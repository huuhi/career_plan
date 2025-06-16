package career.plan.dto.user;

import lombok.Data;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/9
 * 说明:用户登录实例
 */
@Data
public class UserLogin {
    private String phone;
    private String password;
}
