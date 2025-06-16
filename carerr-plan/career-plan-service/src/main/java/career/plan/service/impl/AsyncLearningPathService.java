package career.plan.service.impl;

import career.plan.dto.GenerateStreamDTO;
import career.plan.service.LearningPathsService;
import cn.hutool.core.bean.BeanUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Map;

import static career.plan.content.RedisConstant.GENERATE_LEARNING_KEY;

@Service
@Slf4j
public class AsyncLearningPathService {

    private final LearningPathsService learningPathsService;
    private final StringRedisTemplate redisTemplate;

    public AsyncLearningPathService(LearningPathsService leanringPathsService, StringRedisTemplate redisTemplate) {
        this.learningPathsService = leanringPathsService;
        this.redisTemplate = redisTemplate;
    }

    @Async
    public void handleMsgAsync(MapRecord<String, Object, Object> record) {
        try {
            Map<Object, Object> value = record.getValue();
            GenerateStreamDTO generateStreamDTO = BeanUtil.fillBeanWithMap(value, new GenerateStreamDTO(), true);
            log.debug("开始异步处理消息：{}", generateStreamDTO);

            // 调用主服务的方法
            learningPathsService.generateLearningPathById(generateStreamDTO);

            // 确认处理完成后再 ACK
            redisTemplate.opsForStream().acknowledge(GENERATE_LEARNING_KEY,"learn_group", record.getId());
            redisTemplate.opsForStream().delete(GENERATE_LEARNING_KEY, record.getId());

        } catch (Exception e) {
            log.error("异步处理消息失败：{}", e.getMessage(), e);
        }
    }
}