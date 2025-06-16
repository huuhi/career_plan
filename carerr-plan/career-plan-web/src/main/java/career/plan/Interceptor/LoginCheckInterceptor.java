package career.plan.Interceptor;

import career.plan.content.JwtClaimsConstant;
import career.plan.domain.UserHolder;
import career.plan.dto.user.UserDTO;
import career.plan.utils.JwtUtil;
import com.alibaba.fastjson.JSONObject;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import career.plan.vo.Result;


/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/1/17
 * 说明:拦截器
 */
@Slf4j
@Component
public class LoginCheckInterceptor implements HandlerInterceptor {


    //在请求处理之前调用，返回 true 表示继续处理，返回 false 表示中断处理。
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 其他请求处理逻辑
        String jwt = request.getHeader("token");
        if (jwt == null || jwt.isEmpty()) {
            log.debug("未登录");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            Result res = Result.fail("NOT_LOGIN");
            String json = JSONObject.toJSONString(res);
            response.getWriter().write(json);

            return false;
        }

        try {
            Claims claims = JwtUtil.parseJWT(jwt);
            Long id =Long.valueOf(claims.get(JwtClaimsConstant.USER_ID).toString());
            String username = claims.get(JwtClaimsConstant.USERNAME).toString();
            UserDTO userDTO = UserDTO.builder()
                    .id(id).username(username)
                    .build();
            UserHolder.saveId(userDTO);
            log.debug("登录成功，用户id为：" + UserHolder.getUser());
        } catch (Exception e) {

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            Result res = Result.fail("NOT_LOGIN");
            String json = JSONObject.toJSONString(res);
            response.getWriter().write(json);
            log.warn("错误：{}",e.getMessage());
            return false;
        }

        return true;
    }
}
