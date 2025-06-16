package career.plan.service.impl;

import career.plan.domain.*;
import career.plan.dto.*;
import career.plan.dto.learnDTO.ChapterDetailsDTO;
import career.plan.dto.learnDTO.LearningPathDTO;
import career.plan.dto.learnDTO.LearningSkillDTO;
import career.plan.dto.learnDTO.SkillChapterDTO;
import career.plan.dto.user.UserDTO;
import career.plan.eum.LearnStatus;
import career.plan.service.*;
import career.plan.utils.RedisHashUtils;
import career.plan.utils.RedisUtil;
import career.plan.utils.RegexUtils;
import career.plan.utils.ResumeToString;
import career.plan.vo.Result;
import career.plan.vo.learn.LearnPathVO;
import career.plan.vo.learn.LearningSkillDetailVO;
import career.plan.vo.learn.PathDetailsVO;
import career.plan.webSocket.WebSocketService;
import cn.hutool.core.bean.BeanUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import career.plan.mapper.LearningPathsMapper;
import jakarta.annotation.PostConstruct;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;


import java.util.*;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import static career.plan.content.RedisConstant.*;

/**
* @author windows
* @description 针对表【leanring_paths(用户学习路径表)】的数据库操作Service实现
* @createDate 2025-04-09 14:05:56
*/
@Service
@RequiredArgsConstructor
@Slf4j
public class LeanringPathsServiceImpl extends ServiceImpl<LearningPathsMapper, LearningPaths>
    implements LearningPathsService, DisposableBean {
    private final ChatAssistant chatAssistant;
    private final StringRedisTemplate stringRedisTemplate;
    private volatile boolean isRunning = true;
    private final RedisUtil redisUtil;
    private final JobsService jobService;
    private final MajorsService majorsService;
    private final LearningSkillService learningSkillService;
    private final WebSocketService webSocketService;
    private final LearningSkillChapterService learningSkillChapterService;
    private final LearningSkillDetailsService learningSkillDetailsService;
    private final RedisHashUtils redisHashUtils;
    private final ResumeService resumeService;

    @Autowired
    @Lazy
    private  AsyncLearningPathService asyncLearningPathService;


    private static final ExecutorService LEARN_PATH_EXECUTOR = new ThreadPoolExecutor(
        5,
        10,
        60L, TimeUnit.SECONDS,
        new LinkedBlockingQueue<>(1000),
        new ThreadPoolExecutor.CallerRunsPolicy()
    );

    @PostConstruct
    public void init() {
        LEARN_PATH_EXECUTOR.execute(new handleLearningPath());
    }
    @Override
    public void destroy() {
        isRunning = false;
        log.info("Stopping LEARN_PATH_EXECUTOR...");
        LEARN_PATH_EXECUTOR.shutdown(); // 停止接收新任务
        try {
            // 等待线程池终止（包括处理中的任务）
            if (!LEARN_PATH_EXECUTOR.awaitTermination(30, TimeUnit.SECONDS)) {
                LEARN_PATH_EXECUTOR.shutdownNow(); // 强制终止
            }
        } catch (InterruptedException e) {
            LEARN_PATH_EXECUTOR.shutdownNow();
            Thread.currentThread().interrupt(); // 恢复中断状态
        }
        log.info("LEARN_PATH_EXECUTOR stopped.");
    }
    private class handleLearningPath implements Runnable{
        @Override
        public void run() {
            while (isRunning) {
                try {
                    //处理消息队列  消费者组 ：learn_group
                    List<MapRecord<String, Object, Object>> msg = redisUtil.getMsg(GENERATE_LEARNING_KEY, GENERATE_LEARNING_GROUP, "learn_consumer");
                    if (msg==null||msg.isEmpty()){
                        continue;
                    }
                    MapRecord<String, Object, Object> record = msg.get(0);
                    asyncLearningPathService.handleMsgAsync(record);
                } catch (Exception e) {
                    handlePending();
                }
            }

        }

        private void handlePending() {
            while (isRunning) {
                try {
                    //处理消息队列  消费者组 ：learn_group
                    List<MapRecord<String, Object, Object>> msg = redisUtil.getMsg(GENERATE_LEARNING_KEY, GENERATE_LEARNING_GROUP, "learn_consumer");
                    if (msg==null||msg.isEmpty()){
                        break;
                    }
                    MapRecord<String, Object, Object> record = msg.get(0);
                    asyncLearningPathService.handleMsgAsync(record);
                } catch (Exception e) {
                    log.error("处理pending失败：{}",e.getMessage());
                }
            }
        }
    }

    @Override
    public void generateLearningPathById(GenerateStreamDTO generateStreamDTO) {
        //生成学习路径，首先根据用户的id获取他的默认简历。
        log.debug("处理：{}",generateStreamDTO);

        Long userId = generateStreamDTO.getUserId();
        //简历不一定有，可能是null
        Resume resume = resumeService
                .lambdaQuery()
                .eq(Resume::getIsDefault, 1)
                .eq(Resume::getUserId, userId)
                .one();
        String resumeString="该用户暂时没有简历";
        if(resume!=null&&resume.getOriginalText()!=null){
            //获取简历的数据
            ResumeData resumeData = JSONUtil.toBean(resume.getOriginalText().toString(), ResumeData.class);
            resumeString=ResumeToString.formatResumeContent(resumeData);
        }
        String goal;
        Long goalId = generateStreamDTO.getJobId();
        String goalName;

        if (goalId != null) {
            //说明用户的目标是某个职位
            Jobs job = jobService.getById(goalId);
            goalName = "我的目标职位是:" +job.toString();
            goal=job.getTitle();
        } else {
            //说明目标是专业
            Majors majors = majorsService.getById(generateStreamDTO.getMajorsId());
            goalName = "我的目标专业是:" + majors.toString();
            goal=majors.getTitle();
        }
        log.debug("正在请求ai");
        String learningPath = chatAssistant.generateLearningPath(goalName,resumeString);
        //处理JSON
        learningPath = RegexUtils.cleanJsonResponse(learningPath);
//        log.debug("ai返回的json处理完成之后：{}", learningPath);
        //解析
        LearningPathDTO bean = JSONUtil.toBean(learningPath, LearningPathDTO.class);
//        log.debug("解析是否成功？{}", bean);
        LearningPaths learningPaths = LearningPaths.builder()
                .completeHarvest(bean.getCompleteHarvest())
                .adviceAndAttention(bean.getAdviceAndAttention())
                .whyRecommend(bean.getWhyRecommend())
                .userId(userId)
                .jobId(goalId)
                .majorsId(generateStreamDTO.getMajorsId())
                .goalName(goal)
                .build();
        //保存路径
         save(learningPaths);

        Long pathId = learningPaths.getId();
        List<LearningSkillDTO> skills = bean.getSkills();
        //保存技能
        List<LearningSkill> learningSkills = saveSkill(pathId,skills);
                //保存章节
        List<LearningSkillChapter> learningSkillChapters = saveChapter(learningSkills, skills, pathId);
        saveNodes(pathId,skills, learningSkillChapters);


        Map<String,Long>  map=new HashMap<>();
        map.put("type",3L);//3表示生成学习路径完成
        map.put("pathId",learningPaths.getId());
        String message = JSONUtil.toJsonStr(map);
        //完成之后发送信息给用户
        log.debug("给用户：{}发送信息”{}",userId,message);
        webSocketService.sendToClient(String.valueOf(userId),message);


    }

    @Override
    public Result getAllPath(Long userId) {
        //只获取学习路径。。。
        List<LearningPaths> learnPaths = query().eq("user_id", userId).list();
        if(learnPaths==null){
            return Result.ok(Collections.emptyList());
        }
        List<LearnPathVO> learnPathVOS = BeanUtil.copyToList(learnPaths, LearnPathVO.class);
        return Result.ok(learnPathVOS);
    }

    @Override
    public Result deleteLearningPaths(Long pathId) {
        UserDTO user = UserHolder.getUser();
        if(user==null){
            return  Result.fail("未登录!");
        }
        Long id = user.getId();
        boolean remove = lambdaUpdate()
                .eq(LearningPaths::getUserId, id)
                .eq(LearningPaths::getId, pathId)
                .remove();
        //应该删除缓存中数据！
        if(remove){
            String key=LEARNING_NODE_COUNT+pathId;
            redisUtil.delCache(key);
            return Result.ok("删除成功");
        }
        return Result.fail("删除失败");
    }

    private List<LearningSkill> saveSkill(Long pathId, List<LearningSkillDTO> skills) {
//        log.debug("技能：{}", skills);
        List<LearningSkill> learningSkills = BeanUtil.copyToList(skills, LearningSkill.class);
//        log.debug("学习路线id:{}",pathId);
        learningSkills.forEach(skill -> skill.setPathId(pathId));
//        log.debug("转换之后的技能：{}",learningSkills);

        learningSkillService.saveBatch(learningSkills);
        return learningSkills;

    }

    private List<LearningSkillChapter> saveChapter(List<LearningSkill> learningSkills, List<LearningSkillDTO> skills, Long pathId) {
        List<LearningSkillChapter> skillChaptersList = new ArrayList<>();
        for (int i = 0; i < learningSkills.size(); i++) {
            LearningSkillDTO learningSkillDTO = skills.get(i);
            Long skillId = learningSkills.get(i).getId();
            List<SkillChapterDTO> chapters = learningSkillDTO.getChapters();
            chapters.forEach(c->{
                LearningSkillChapter learningSkillChapter = BeanUtil.copyProperties(c, LearningSkillChapter.class);
                learningSkillChapter.setSkillId(skillId);
                skillChaptersList.add(learningSkillChapter);
            });
        }
//        log.debug("保存章节：{}",skillChaptersList);
        learningSkillChapterService.saveBatch(skillChaptersList);
        return skillChaptersList;
    }

    private void saveNodes(Long pathId, List<LearningSkillDTO> skills, List<LearningSkillChapter> learningSkillChapters){
        ArrayList<LearningSkillDetails> list = new ArrayList<>();
        int chapterIndex = 0; // 用于追踪learningSkillChapters的索引
        Map<String ,String> count= new  HashMap<>();

        // 遍历每个技能的章节
        for (LearningSkillDTO skill : skills) {
            List<SkillChapterDTO> skillChapters = skill.getChapters();
            if (skillChapters == null) continue;
            Long skillId = 0L;
            Integer skillCount=0;
            for (SkillChapterDTO chapterDTO : skillChapters) {
                if (chapterIndex >= learningSkillChapters.size()) break; // 防止越界
                // 获取已保存的章节
                LearningSkillChapter savedChapter = learningSkillChapters.get(chapterIndex);

                skillId=savedChapter.getSkillId();
                // 处理该章节下的小结
                List<ChapterDetailsDTO> nodes = chapterDTO.getNodes();
                //写入redis,hash
                if (nodes != null) {
                    //章节id加章节的总结数
                    for (ChapterDetailsDTO node : nodes) {
                        skillCount++;
                        LearningSkillDetails learningSkillDetails = BeanUtil.copyProperties(node, LearningSkillDetails.class);
                        learningSkillDetails.setChapterId(savedChapter.getId());
//                        保存路径id
                        learningSkillDetails.setPathId(pathId);
                        //保存技能id
                        learningSkillDetails.setSkillId(savedChapter.getSkillId());
                        list.add(learningSkillDetails);
                    }
                }
                chapterIndex++; // 处理下一个章节
            }
            //记录技能的总结数
            count.put(skillId.toString(),skillCount.toString());
        }
        //将学习路径的小结总数保存在redis中
        count.put("total", String.valueOf(list.size()));
        redisHashUtils.hMSet(LEARNING_NODE_COUNT+pathId,count);
        // 批量保存小结到数据库
        if (!list.isEmpty()) {
            learningSkillDetailsService.saveBatch(list);
        }
    }

    @Override
    public Result generateLearningPaths(Long goalId,String type) {
        UserDTO user = UserHolder.getUser();
        if(user== null){
            return Result.fail("你没有登录！");
        }
        if(goalId == null){
            return Result.fail("请选择一个目标职位/专业！");
        }
        //最多生成2个路径，如果用户的路径大于等于2并且没有完成，则不生成，直接返回
        Long count = lambdaQuery()
                .eq(LearningPaths::getUserId, user.getId())
                .eq(LearningPaths::getIsActive, 0)
                .count();
        if(count>=2){
            return Result.fail("请先把当前的目标完成！");
        }
        //保存
        HashMap<String, String> map = new HashMap<>();
        map.put("userId", String.valueOf(user.getId()));
        map.put(type, String.valueOf(goalId));
        //用消息队列生成学习路径
        stringRedisTemplate.opsForStream()
                .add(GENERATE_LEARNING_KEY,map);
        return Result.ok("正在为你生成独一无二的学习路径!");
    }

    @Override
    public Result getLearningPaths(Long id) {
        LearningPaths path = getById(id);
        //先将path转化为pathDetailsVO
        PathDetailsVO pathDetailsVO = BeanUtil.copyProperties(path, PathDetailsVO.class);
        //获取路径下的技能
        List<LearningSkill> skillList = learningSkillService.query()
                .eq("path_id", id)
                .orderByAsc("step_order")
                .list();
//        log.debug("技能：{}",skillList);

        List<LearningSkillDetailVO> learningSkillDetailVOS =new ArrayList<>();

        skillList.forEach(skill->{
            LearningSkillDetailVO skillDetailVO = BeanUtil.copyProperties(skill, LearningSkillDetailVO.class);
//            log.debug("状态：{}",skill.getStatus());
            skillDetailVO.setStatus(LearnStatus.fromCode(skill.getStatus()));
            String resourceJson = skill.getResource().toString();
            ResourceDTO resourceDTO = JSONUtil.toBean(resourceJson, ResourceDTO.class);
            skillDetailVO.setResourceDTO(resourceDTO);

            learningSkillDetailVOS.add(skillDetailVO);
        });
        //返回
        pathDetailsVO.setSkills(learningSkillDetailVOS);
        return Result.ok(pathDetailsVO);
    }
}




