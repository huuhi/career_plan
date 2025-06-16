package career.plan.service.impl;

import career.plan.dto.GenerateJobDTO;
import career.plan.dto.GenerateMajorsDTO;
import career.plan.eum.CareerCategory;
import career.plan.service.ChatAssistant;
import career.plan.util.SendMessageUtil;
import career.plan.utils.RedisUtil;
import career.plan.utils.RegexUtils;
import career.plan.vo.JobDetailVO;
import career.plan.vo.JobPageVO;
import career.plan.vo.Result;
import career.plan.webSocket.WebSocketService;
import cn.hutool.core.bean.BeanUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import career.plan.domain.Jobs;
import career.plan.service.JobsService;
import career.plan.mapper.JobsMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static career.plan.content.MQConstant.EXCHANGE;
import static career.plan.content.MQConstant.GENERATE_JOB_KEY;
import static career.plan.content.RedisConstant.JOB_KEY;
import static career.plan.content.RedisConstant.JOB_TTL;

/**
* @author windows
* @description 针对表【jobs(职位信息表)】的数据库操作Service实现
* @createDate 2025-04-09 14:06:34
*/
@Service
@Slf4j
@RequiredArgsConstructor
public class JobsServiceImpl extends ServiceImpl<JobsMapper, Jobs>
    implements JobsService{
    private final RedisUtil redisUtil;
    private final SendMessageUtil sendMessageUtil;
    private final ChatAssistant chatAssistant;
    private final WebSocketService webSocketService;

    @Override
    public Result getDetailJobById(Integer id) {
        JobDetailVO jobDetailVO = redisUtil.queryWithPassThrough(
                JOB_KEY,
                id,
                JobDetailVO.class,
                this::getJobDetailVO,
                JOB_TTL,
                TimeUnit.MINUTES
        );
        if(jobDetailVO==null){
            return Result.fail("专业不存在");
        }
        return Result.ok(jobDetailVO);
    }

    @Override
    public Result getJobPage(Integer pageNum, Integer pageSize) {
        return getPageJob(pageNum,pageSize,null,null);
    }

    @Override
    public Result searchJob(Integer pageNum, Integer pageSize, String title) {
        return getPageJob(pageNum,pageSize,title,null);
    }

    @Override
    public Result getJobPageByType(Integer pageNum, Integer pageSize, Integer type) {
         return getPageJob(pageNum,pageSize,null,type);
    }

    @Override
    public Result generateJob(GenerateJobDTO jobDTO) {
        Long exist = isExist(jobDTO.getJobName());
        if(exist!=-1){
            return Result.ok(exist);
        }
        // 直接发送到消息队列中处理
        sendMessageUtil.sendMessage(EXCHANGE,GENERATE_JOB_KEY,jobDTO);
        return Result.ok();
    }

    @Override
    public void generateJobByAI(GenerateJobDTO jobDTO) {
        log.debug("收到信息：{}",jobDTO);
        Long userId = jobDTO.getUserId();
        String jsonStr = JSONUtil.toJsonStr(jobDTO);
        String jobJson= chatAssistant.generateJob(jsonStr);
        // 清理JSON格式符
        jobJson=RegexUtils.cleanJsonResponse(jobJson);
        log.debug("生成的职业信息：{}", jobJson);

        Map<String,Object> map=new HashMap<>();
        if(jobJson.equals("false")){
            //不判断用户id是否为null了
            map.put("message","你填写的职业信息有误！");
            map.put("type",0L);
            webSocketService.sendToClient(String.valueOf(userId), JSONUtil.toJsonStr(map));
            return;
        }
        Jobs job = JSONUtil.toBean(jobJson, Jobs.class);
        save(job);
        //返回
        map.put("id",job.getId());
        map.put("type",5);
        webSocketService.sendToClient(String.valueOf(userId),JSONUtil.toJsonStr(map));

    }

    @Override
    public Result getJobName(String name) {
        List<String> list = query()
                .like("title", name)
                .select("title")
                .list()
                .stream()
                .map(Jobs::getTitle)
                .toList();
        return Result.ok(list);
    }

    private Long isExist(String name){
        Jobs job = query()
                .eq("title", name)
                .one();
        return job==null ? -1:job.getId();
    }


    private Result getPageJob(Integer pageNum, Integer pageSize,String title,Integer typeCode){
        Page<Jobs> jobsPage = lambdaQuery()
                .like(title!=null,Jobs::getTitle,title)
                .eq(typeCode!=null&&typeCode>0,Jobs::getType,typeCode)
                .page(new Page<>(pageNum, pageSize));
        List<Jobs> records = jobsPage.getRecords();
        List<JobPageVO> jobPageVOS = BeanUtil.copyToList(records, JobPageVO.class);
        for (int i = 0; i <jobPageVOS.size(); i++) {
            JobPageVO jobPageVO = jobPageVOS.get(i);
            Short type = records.get(i).getType();
            jobPageVO.setType(CareerCategory.getNameByCode(type));

            if (jobPageVO.getDescription().length()>50){
                jobPageVO.setDescription(jobPageVO.getDescription().substring(0,50)+"...");
             }
            if(jobPageVO.getOutlook().length()>50){
                jobPageVO.setOutlook(jobPageVO.getOutlook().substring(0,50)+"...");
            }

        }
        return Result.ok(jobPageVOS,jobsPage.getTotal());
    }



    private JobDetailVO getJobDetailVO(Integer id) {
        Jobs job = getById(id);
        if(job==null) {
            return null;
        }
        JobDetailVO jobDetailVO = BeanUtil.copyProperties(job, JobDetailVO.class);
        jobDetailVO.setSkills(job.getSkillsList());
        jobDetailVO.setPersonalityTraits(job.getPersonalityTraitsList());
        jobDetailVO.setType(CareerCategory.getNameByCode(job.getType()));
        return jobDetailVO;
    }
}




