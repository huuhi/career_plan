package career.plan.service.impl;

import career.plan.domain.Jobs;
import career.plan.domain.Majors;
import career.plan.domain.UserHolder;
import career.plan.dto.QuestionDTO;
import career.plan.dto.StreamDTO;
import career.plan.dto.user.UserDTO;
import career.plan.eum.CareerCategory;
import career.plan.eum.DisciplineCategory;
import career.plan.service.*;
import career.plan.util.SendMessageUtil;
import career.plan.utils.RedisZSetHelper;
import career.plan.utils.RegexUtils;
import career.plan.vo.JobVO;
import career.plan.vo.MajorsVO;
import career.plan.vo.RecommendedVO;
import career.plan.webSocket.WebSocketService;
import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import career.plan.domain.Question;
import career.plan.mapper.QuestionMapper;
import career.plan.vo.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import static career.plan.content.MQConstant.*;
import static career.plan.content.RedisConstant.*;

/**
* @author windows
* @description 针对表【question(ai分析问题表)】的数据库操作Service实现
* @createDate 2025-04-10 14:09:16
*/
@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionServiceImpl extends ServiceImpl<QuestionMapper, Question>
    implements QuestionService {

    private final ChatAssistant chatAssistant;
    private final JobsService jobsService;
    private final MajorsService majorService;
    private final WebSocketService webSocketService;
    private final RedisZSetHelper redisZSetHelper;
    private final UserService userService;
    private final SendMessageUtil sendMessageUtil;

//
    public void getAnalyzeJobData(StreamDTO streamDTO) {
        Long id = streamDTO.getId();
        Long userId = streamDTO.getUserId();
        //获取问题，并将其转换为对象
        Question question = getById(id);
        Object questionJson = question.getQuestionJson();
        List<QuestionDTO> questionDTOList = JSONUtil.toList((String) questionJson, QuestionDTO.class);
       //获取用户的简介
        String summary = userService.query()
                .eq("id", userId)
                .select("summary")
                .one().getSummary();
        // 发送问题 ，请求ai，处理
        log.debug("正在请求ai");
        String s = chatAssistant.analyzeQuestion(questionDTOList,  summary);
        log.debug("请求完成！返回结果{}",s);
        String result = RegexUtils.cleanJsonResponse(s);
        RecommendedVO recommendedVO = JSONUtil.toBean(result, RecommendedVO.class);
//        log.debug("解析之后的数据：{}", recommendedVO);
//       获取基本信息，并且如果不存在则保存，存在则获取id
        List<JobVO> jobList = getJobList(recommendedVO.getDetailList());
        //不需要详细的信息，直接为null
        recommendedVO.setDetailList(null);
        recommendedVO.setDataList(jobList);
        //如果没有出现错误，说明格式正确，存到数据中
        saveQuestion(recommendedVO, question);
        //向前端发送信息告知，我以处理完成
        log.debug("分析职业成功，发送消息给客户端：{}：",userId);

        HashMap<String, Long> map = new HashMap<>();
        map.put("type",2L);//2表示分析职业
        map.put("id",id);
        String jsonStr = JSONUtil.toJsonStr(map);
        webSocketService.sendToClient(String.valueOf(userId),jsonStr);
        saveAnalyze(userId, USER_ANALYZE_JOB_KEY, id);

    }

    public void getAnalyzeMajorsData(StreamDTO streamDTO) {
            Long id = streamDTO.getId();
            Long userId = streamDTO.getUserId();
            Question question = getById(id);
            Object questionJson = question.getQuestionJson();
            List<QuestionDTO> questionDTOList = JSONUtil.toList((String) questionJson, QuestionDTO.class);
            //获取用户的简介
            String summary = userService.query()
                .eq("id", userId)
                .select("summary")
                .one().getSummary();
              //负责请求ai
            log.debug("用户的简介：{} 专业分析,正在请求ai",summary);
            String reply = chatAssistant.recommendedMajors(questionDTOList,summary);
            log.debug("AI返回的数据：{}",reply);
            String cleanJsonResponse = RegexUtils.cleanJsonResponse(reply);
            log.debug("清理之后的数据：{}",cleanJsonResponse);

            RecommendedVO recommendedMajorVO = JSONUtil.toBean(cleanJsonResponse, RecommendedVO.class);
            List<MajorsVO> majorList =getMajorList(recommendedMajorVO.getDetailList());
            recommendedMajorVO.setDataList(majorList);
            recommendedMajorVO.setDetailList(null);
            saveQuestion(recommendedMajorVO,question);

            log.debug("分析专业成功，发送消息给客户端id{}：",userId);
            HashMap<String, Long> map = new HashMap<>();
            map.put("type",1L);//1表示分析专业
            map.put("id",id);
            String jsonStr = JSONUtil.toJsonStr(map);
            webSocketService.sendToClient(String.valueOf(userId),jsonStr);
            saveAnalyze(userId, USER_ANALYZE_MAJORS_KEY,id);
    }

    @Override
    public Result analyze(List<QuestionDTO> questionDTOList) {
        //获取总分
        Question question = getRecord(questionDTOList);
        if(question.getAnalyzeData() !=null){
            //有数据，不需要请求ai,直接返回
            String analyzeData = question.getAnalyzeData().toString();
            RecommendedVO recommendedVO = JSONUtil.toBean(analyzeData, RecommendedVO.class);
            return Result.ok(recommendedVO);
        }
        String jsonStr = JSONUtil.toJsonStr(questionDTOList);
        //直接写到消息队列中
        if(sendStreamMessage(jsonStr,GENERATE_ANALYZE_KEY,question.getScoreTotal())){
            return Result.ok();
        }else{
            return Result.fail("请求失败");
        }
        //直接返回
    }

    private boolean sendStreamMessage(String jsonStr,String key,Integer score) {
        UserDTO user = UserHolder.getUser();
        if(user==null){
            log.debug("用户登录");
            return false;
        }
        Question question = Question.builder()
                .questionJson(jsonStr)
                .scoreTotal(score)
                .build();
        save(question);
        HashMap<String, String> map = new HashMap<>();
        map.put("id", question.getId().toString());
        map.put("userId", user.getId().toString());
        // 使用RabbitMQ代替Redis的Stream类型
        sendMessageUtil.sendMessage(EXCHANGE,key ,map);
//        stringRedisTemplate.opsForStream().add(key,map);
        return true;
    }

    private void saveQuestion(RecommendedVO recommendedVO, Question question) {
        question.setAnalyzeData(JSONUtil.toJsonStr(recommendedVO));
        updateById(question);
    }

    private Question  getRecord(List<QuestionDTO> questionDTOList) {
        int sum=0;
        for(QuestionDTO question: questionDTOList){
            sum+=question.getScore();
        }
        //去查看是否有数据
        Question question = query()
                .eq("score_total", sum)
                .one();
        if(question == null){
            question= Question.builder()
                    .scoreTotal(sum)
                    .build();
        }
        return question;
    }
    private void saveAnalyze(Long userId,String pkey,Long id){
        String key=pkey+userId;
        redisZSetHelper.zAdd(key,String.valueOf(id),System.currentTimeMillis());
    }

    @Override
    public Result recommendedProfession(List<QuestionDTO> questionDTOList) {
        //推荐专业

        Question question = getRecord(questionDTOList);
        if(question.getAnalyzeData()!=null){
            //解析专业
            String majorJson = question.getAnalyzeData().toString();
            RecommendedVO recommendedVO = JSONUtil.toBean(majorJson, RecommendedVO.class);
            return Result.ok(recommendedVO);
        }
        String jsonStr = JSONUtil.toJsonStr(questionDTOList);
        if(sendStreamMessage(jsonStr,GENERATE_MAJORS_ANALYZE_KEY,question.getScoreTotal())){
            return Result.ok();
        }else {
            return Result.fail("请求失败！");
        }
    }

    @Override
    public Result getAnalyzeReport(Long id) {
        Question question = getById(id);
        if(question==null||question.getAnalyzeData()==null){
            return Result.fail("此数据不存在或者还在解析！");
        }
        String analyzeData = question.getAnalyzeData().toString();
        RecommendedVO recommendedVO = JSONUtil.toBean(analyzeData, RecommendedVO.class);
        return Result.ok(recommendedVO);
    }

    @Override
    public Result getAnalyzeByUserId(Long userId,String preKey) {
        String key=preKey+userId;
        //获取当前用户下的所有分析记录id
        Set<String> analyzeId = redisZSetHelper.zReverseRange(key, 0, -1);
//        log.debug("用户的分析记录：{}",analyzeId);
        if(analyzeId==null||analyzeId.isEmpty()){
            return Result.ok(Collections.emptyList());
        }
        String join = StrUtil.join(",", analyzeId);
        List<Question> list = lambdaQuery()
                .in(Question::getId, analyzeId)
                .last("order by field(id,"+join+")")
                .list();
        List<RecommendedVO> recommendedVOList = new ArrayList<>();
        list.forEach(q->{
            String analyzeData = q.getAnalyzeData().toString();
            RecommendedVO recommendedVO = JSONUtil.toBean(analyzeData, RecommendedVO.class);
            recommendedVO.setId(q.getId());
            recommendedVOList.add(recommendedVO);
        });
        return Result.ok(recommendedVOList);
    }

    private List<MajorsVO> getMajorList(Object detailList) {
        List<Majors> list = JSONUtil.toList(detailList.toString(), Majors.class);
        return list.stream().map(m->{
            Integer matchScore = m.getMatchScore();
            Majors majors = majorService.lambdaQuery()
                    .eq(Majors::getTitle, m.getTitle())
                    .one();
            if(majors==null){
                majorService.save(m);
                majors=m;
            }
            MajorsVO majorsVO = BeanUtil.copyProperties(majors, MajorsVO.class);
            majorsVO.setMatchScore(matchScore);
            //截取详细的字段，不要太多
            if(majorsVO.getDescription().length()>50){
                majorsVO.setDescription(majorsVO.getDescription().substring(0, 50)+"...");
            }
            majorsVO.setType(DisciplineCategory.getNameByCode(majors.getType()));
            return majorsVO;
        }).collect(Collectors.toList());
    }


    private List<JobVO> getJobList(Object list) {
//        将object转换为集合
        List<Jobs> jobList = JSONUtil.toList(JSONUtil.toJsonStr(list), Jobs.class);
        return jobList.stream().map(job -> {
            // 1. 保留原始matchScore
            Integer originalMatchScore = job.getMatchScore();

            // 2. 处理数据库存储
            Jobs savedJob = jobsService.lambdaQuery()
                    .eq(Jobs::getTitle, job.getTitle())
                    .one();

            if (savedJob == null) {
                jobsService.save(job); // 保存后会自动回填id到job对象
                savedJob = job;        // 直接使用回填后的对象
            }

            // 3. 转换VO（确保matchScore不丢失）
            JobVO vo = new JobVO();
            BeanUtil.copyProperties(savedJob, vo);
            vo.setMatchScore(originalMatchScore); // 手动设置matchScore
            if(vo.getDescription().length()>50){
                vo.setDescription(vo.getDescription().substring(0, 50)+"...");
            }
            if(vo.getOutlook().length()>50){
                vo.setOutlook(vo.getOutlook().substring(0, 50)+"...");
            }
            //新增类型
            String type = CareerCategory.getNameByCode(savedJob.getType());
            vo.setType(type);
            return vo;
        }).collect(Collectors.toList());
    }

}