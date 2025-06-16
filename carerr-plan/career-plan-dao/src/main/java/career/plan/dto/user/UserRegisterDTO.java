package career.plan.dto.user;

import lombok.Data;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/8
 * 说明:
 */
@Data
public class UserRegisterDTO {
    private String username;
    private String phone;
    /**
     * 密码(MD5加密)
     */
    private String password;
    private String avatar;
}
