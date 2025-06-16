package career.plan.consumer;

import career.plan.dto.GenerateJobDTO;
import career.plan.dto.GenerateMajorsDTO;
import career.plan.dto.StreamDTO;
import career.plan.service.JobsService;
import career.plan.service.MajorsService;
import career.plan.service.QuestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.Exchange;
import org.springframework.amqp.rabbit.annotation.Queue;
import org.springframework.amqp.rabbit.annotation.QueueBinding;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import static career.plan.content.MQConstant.*;
import static career.plan.content.RedisConstant.JOB_QUESTION_KEY;
import static career.plan.content.RedisConstant.MAJORS_QUESTION_KEY;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/5/8
 * 说明: 负责消费RabbitMQ的消息
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class MqListener {
    private final MajorsService majorsService;
    private final JobsService jobService;
    private final QuestionService questionService;
    @RabbitListener(bindings = @QueueBinding(
            value =@Queue(value = MAJORS_QUEUE,durable = "true"),
            exchange = @Exchange(value = EXCHANGE),
            key = GENERATE_MAJORS_KEY
    ))
    public void ListenerGMajors(GenerateMajorsDTO majorsDTO){
        log.debug("收到生成专业消息：{}",majorsDTO);
        majorsService.generateMajorsByAI(majorsDTO);
    }

    @RabbitListener(bindings = @QueueBinding(
            value=@Queue(value = JOB_QUEUE,durable = "true"),
            exchange = @Exchange(value = EXCHANGE),
            key = GENERATE_JOB_KEY
    ))
    public void ListenerGJob(GenerateJobDTO jobDTO){
        log.debug("收到生成职位消息：{}",jobDTO);
        jobService.generateJobByAI(jobDTO);
    }
    @RabbitListener(bindings = @QueueBinding(
        value = @Queue(value = JOB_ANALYZE_QUEUE,durable = "true"),
        exchange = @Exchange(value = EXCHANGE),
        key=GENERATE_ANALYZE_KEY
    ))
    public void ListenerAnalyzeJob(StreamDTO streamDTO){
        log.debug("职业分析消费者收到消息的：{}",streamDTO);
        questionService.getAnalyzeJobData(streamDTO);
    }
    @RabbitListener(bindings = @QueueBinding(
        value = @Queue(value = MAJORS_ANALYZE_QUEUE,durable = "true"),
        exchange = @Exchange(value = EXCHANGE),
        key=GENERATE_MAJORS_ANALYZE_KEY
    ))
    public void ListenerAnalyzeMajors(StreamDTO streamDTO){
        log.debug("专业分析消费者收到消息的：{}",streamDTO);
        questionService.getAnalyzeMajorsData(streamDTO);
    }
}
