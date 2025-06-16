package career.plan.dto.user;

import lombok.Data;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/18
 * 说明:
 */
@Data
public class UserUpdatePwdDTO {
    //用户 id
    private String oldPassword;
    private String newPassword;
}
