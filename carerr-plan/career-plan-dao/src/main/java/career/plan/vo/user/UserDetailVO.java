package career.plan.vo.user;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/5/15
 * 说明: 用户详细信息返回
 */
@Data
public class UserDetailVO implements Serializable {
    private String username;
    /**
     * 手机号
     */
    private String phone;

    /**
     * 头像URL
     */
    private String avatar;

    //用户简介
    private String summary;

    private LocalDate createAt;


    @Serial
    private static final long serialVersionUID = 1L;


}
