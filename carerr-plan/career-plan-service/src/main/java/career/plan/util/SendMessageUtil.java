package career.plan.util;

import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessagePostProcessor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;


/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/25
 * 说明:消息队列的工具类
 */
@Component
public class SendMessageUtil {
    private final RabbitTemplate rabbitTemplate;


    public SendMessageUtil(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public  void sendDelayMessage(String exchange,String key,Object message,Long delayTime){
         rabbitTemplate.convertAndSend(exchange,key,message, new MessagePostProcessor() {
            @Override
            public Message postProcessMessage(Message message) throws AmqpException {
//                设置过期时间
                message.getMessageProperties().setDelayLong(delayTime);
                return message;
            }
        });
    }
    public  void sendMessage(String exchange,String key,Object message){
        rabbitTemplate.convertAndSend(exchange,key,message);
    }
}
