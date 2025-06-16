package career.plan.service.impl;

import career.plan.domain.LearningPaths;
import career.plan.domain.LearningSkill;
import career.plan.domain.LearningSkillChapter;
import career.plan.dto.learnDTO.NodeDTO;
import career.plan.dto.learnDTO.WriteNoteDTO;
import career.plan.mapper.LearningPathsMapper;
import career.plan.mapper.LearningSkillChapterMapper;
import career.plan.mapper.LearningSkillMapper;
import career.plan.service.LearningSkillDetailsService;
import career.plan.utils.RedisHashUtils;
import career.plan.utils.RedisUtil;
import career.plan.vo.Result;
import career.plan.vo.learn.CurrentProgressVO;
import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import career.plan.domain.LearningSkillDetails;
import career.plan.mapper.LearningSkillDetailsMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.DisposableBean;
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
* @description 针对表【learning_skill_details(学习技能详细章节表)】的数据库操作Service实现
* @createDate 2025-04-09 14:06:20
*/
@Service
@RequiredArgsConstructor
@Slf4j
public class LearningSkillDetailsServiceImpl extends ServiceImpl<LearningSkillDetailsMapper, LearningSkillDetails>
    implements LearningSkillDetailsService, DisposableBean {
    private final StringRedisTemplate redisTemplate;
    private volatile boolean isRunning = true;
    private final RedisUtil redisUtil;
    private final RedisHashUtils redisHashUtils;
    private final LearningPathsMapper learningPathsMapper;
    private final LearningSkillMapper learningSkillMapper;
    private final LearningSkillChapterMapper chapterMapper;



    private static final ExecutorService COMPLETE_NODE_EXECUTOR =  new ThreadPoolExecutor(
        5,
        10,
        60L, TimeUnit.SECONDS,
        new LinkedBlockingQueue<>(1000),
        new ThreadPoolExecutor.CallerRunsPolicy()
    );

    @PostConstruct
    public void init() {
        COMPLETE_NODE_EXECUTOR.execute(new handleLearningNode());
    }
    @Override
    public void destroy() {
        isRunning = false;
        log.info("Stopping LEARN_PATH_EXECUTOR...");
        COMPLETE_NODE_EXECUTOR.shutdown(); // 停止接收新任务
        try {
            // 等待线程池终止（包括处理中的任务）
            if (!COMPLETE_NODE_EXECUTOR.awaitTermination(30, TimeUnit.SECONDS)) {
                COMPLETE_NODE_EXECUTOR.shutdownNow(); // 强制终止
            }
        } catch (InterruptedException e) {
            COMPLETE_NODE_EXECUTOR.shutdownNow();
            Thread.currentThread().interrupt(); // 恢复中断状态
        }
        log.info("LEARN_PATH_EXECUTOR stopped.");
    }
    private class handleLearningNode implements Runnable{
        @Override
        public void run() {
            while (isRunning){
                try {
                    List<MapRecord<String, Object, Object>> msg = redisUtil.getMsg(LEARN_STREAM_KEY, LEARN_GROUP_KEY, "c1");
                    if(msg==null||msg.isEmpty()){
                        continue;
                    }
                    MapRecord<String, Object, Object> record = msg.get(0);
                    handleNode(record);
                    redisTemplate.opsForStream().acknowledge(LEARN_STREAM_KEY, LEARN_GROUP_KEY, record.getId());
                    redisTemplate.opsForStream().delete(LEARN_STREAM_KEY, record.getId());
                } catch (Exception e) {
                    handPending();
                }
            }


        }

        private void handPending() {
            while (isRunning){
                try {
                    List<MapRecord<String, Object, Object>> msg = redisUtil.getMsg(LEARN_STREAM_KEY, LEARN_GROUP_KEY, "c1");
                    if(msg==null||msg.isEmpty()){
                        break;
                    }
                    MapRecord<String, Object, Object> record = msg.get(0);
                    handleNode(record);
                    redisTemplate.opsForStream().acknowledge(LEARN_STREAM_KEY, LEARN_GROUP_KEY, record.getId());
                    Long delete = redisTemplate.opsForStream().delete(LEARN_STREAM_KEY, record.getId());
                    log.debug("删除消息队列:{}",delete);
                } catch (Exception e) {
                    log.error("处理pending时出现错误：{}",e.getMessage());
                }
            }

        }

        private void handleNode(MapRecord<String, Object, Object> record) {
            Map<Object, Object> value = record.getValue();
            NodeDTO nodeDTO = BeanUtil.fillBeanWithMap(value, new NodeDTO(), true);
            log.debug("开始更新整体进度：{}",nodeDTO);
            //获取总数，更新进度
            //首先获取总数
            Long skillId = nodeDTO.getSkillId();
            Long pathId = nodeDTO.getPathId();
            Long chapterId = nodeDTO.getChapterId();

            //获取总数
            Map<String, String> totalMap = redisHashUtils.hGetAll(LEARNING_NODE_COUNT + pathId);

            //total  chapterId
            int total = Integer.parseInt(totalMap.get("total"));
            int skillCount = Integer.parseInt(totalMap.get(skillId + ""));
            //获取已完成的总数数量
            int count = lambdaQuery()
                    .eq(LearningSkillDetails::getPathId, pathId)
                    .eq(LearningSkillDetails::getStatus,1)
                    .count().intValue();
            Long skillNodeCount = lambdaQuery()
                    .eq(LearningSkillDetails::getSkillId, skillId)
                    .eq(LearningSkillDetails::getStatus, 1)
                    .count();
            //该章节下已完成的小结数
            int chapterCount = lambdaQuery()
                    .eq(LearningSkillDetails::getChapterId, chapterId)
                    .eq(LearningSkillDetails::getStatus, 1)
                    .count().intValue();
            int chapterTotal = lambdaQuery()
                    .eq(LearningSkillDetails::getChapterId, chapterId)
                    .count().intValue();


            //计算百分比
            int percent = getPercent(total,count);
            //计算技能的百分比
            int skillPercent =getPercent(skillCount,skillNodeCount);
            //更新,还需要更新状态啊。。。
            LearningPaths learningPaths = LearningPaths.builder()
                    .id(pathId)
                    .currentProgress(percent)
                    .build();
            //如果相等更新章节状态

            if(chapterCount==chapterTotal){
                LearningSkillChapter chapter = LearningSkillChapter.builder()
                        .id(chapterId).status(true)
                        .build();
                //更新章节的状态
                chapterMapper.updateById(chapter);
            }

//            1
            if(total==count){
                //更新学习路径的状态为 1
                learningPaths.setIsActive(1);
            }
            learningPathsMapper.updateById(learningPaths);

            //1
            LearningSkill skill = LearningSkill.builder()
                    .id(skillId)
                    .currentProgress(skillPercent)
                    .build();
            if(skillCount==skillNodeCount){
                //更新状态
                skill.setStatus(1);
            }
            learningSkillMapper.updateById(skill);
            log.debug("更新进度完成！");
            //删除消息队列

        }
    }

    private int getPercent(int all,long count){
        return (int)(count * 100.0 / all);
    }


    @Override
    public Result getLearningNode(Long chapterId) {
        List<LearningSkillDetails> learningSkillDetails = lambdaQuery().eq(LearningSkillDetails::getChapterId, chapterId)
                .orderByAsc(LearningSkillDetails::getNoduleOrder).list();
        return Result.ok(Objects.requireNonNullElse(learningSkillDetails, Collections.emptyList()));
    }

    @Override
    public Result completeNode(Long nodeId, Long pathId, Long skillId, Long chapterId) {
        /*
        在获取时存储所以的节点数，如果根据这个去获取完成率，还是要写消息队列
         */
        lambdaUpdate().eq(LearningSkillDetails::getId, nodeId)
                .set(LearningSkillDetails::getStatus, 1).update();
        Map<String, String> map = new HashMap<>();
        map.put("pathId", pathId.toString());
        map.put("skillId", skillId.toString());
        map.put("chapterId",chapterId.toString());
        redisTemplate.opsForStream()
                .add(LEARN_STREAM_KEY,map);
        //写入消息队列中更新
        return Result.ok();

//        return Result.fail("更新失败");
    }

    @Override
    public Result getcurrentProgress(Long pathId, List<Long> skillIds) {
        //获取路径的 百分比
        ArrayList<CurrentProgressVO> list = new ArrayList<>();

        Integer currentProgress = learningPathsMapper.selectById(pathId).getCurrentProgress();
        CurrentProgressVO currentProgressVO = CurrentProgressVO.builder()
                .name("整体进度")
                .progress(currentProgress)
                .build();
        list.add(currentProgressVO);
        List<LearningSkill> learningSkills = learningSkillMapper.selectBatchIds(skillIds);
        learningSkills.forEach(skill->{
            String stepName = skill.getStepName();
            Integer skillProgress = skill.getCurrentProgress();
            CurrentProgressVO progressVO = CurrentProgressVO.builder()
                    .name(stepName)
                    .progress(skillProgress)
                    .build();
            list.add(progressVO);

        });
        return Result.ok(list);
    }

    @Override
    public Result writeNode(WriteNoteDTO note) {
        if(note==null||note.getNote()==null||note.getId()==null){
            return Result.fail("参数错误");
        }

        LearningSkillDetails details = LearningSkillDetails
                .builder()
                .id(note.getId())
                .note(note.getNote())
                .build();
        updateById(details);
        return Result.ok("成功保存！");
    }
}




