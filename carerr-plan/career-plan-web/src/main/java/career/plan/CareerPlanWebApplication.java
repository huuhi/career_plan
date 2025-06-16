package career.plan;

import lombok.extern.slf4j.Slf4j;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@MapperScan("career.plan.mapper")
@EnableCaching//开启注解方式的缓存管理
@EnableScheduling
@Slf4j
public class CareerPlanWebApplication {

	public static void main(String[] args) {
		System.out.println("AI模型名:"+System.getenv("AI_NAME"));
		System.out.println("AI的基础地址:"+System.getenv("AI_BASE_URL"));
		SpringApplication.run(CareerPlanWebApplication.class, args);
	}

	@Bean
    public MessageConverter messageConverter(){
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter();
        converter.setCreateMessageIds(true);//设置消息ID
        return converter;
    }

}
