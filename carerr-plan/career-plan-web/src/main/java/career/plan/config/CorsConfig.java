package career.plan.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 配置 CORS
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 匹配所有路径，或改为 "/ws/**" 仅限 WebSocket
            .allowedOrigins(
                "https://marvelous-snickerdoodle-d8a4f2.netlify.app",
                "http://localhost:3000"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 允许 WebSocket 握手的 GET
            .allowedHeaders("*")  // 允许所有头（包括 Upgrade、Connection）
            .exposedHeaders("Upgrade", "Connection")  // 暴露 WebSocket 相关头
            .allowCredentials(true)  // 如果需要 Cookie/认证
            .maxAge(3600);  // 预检请求缓存时间（秒）
    }
}