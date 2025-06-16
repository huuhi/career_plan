package career.plan.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.core.ReturnedMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.Configuration;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/23
 * 说明:设置消息确认回调配置
 */
@Configuration
@Slf4j
public class MqConfirmConfig implements ApplicationContextAware {
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        RabbitTemplate rabbitTemplate = applicationContext.getBean(RabbitTemplate.class);
//        配置回调
        rabbitTemplate.setReturnsCallback(new RabbitTemplate.ReturnsCallback() {
            @Override
            public void returnedMessage(ReturnedMessage returned) {
                log.debug("收到，消息日志：key:{},message:{},replyCode:{},replyTest:{}",
                        returned.getRoutingKey(),returned.getMessage(), returned.getReplyCode(), returned.getReplyText());
            }
        });

    }
}
