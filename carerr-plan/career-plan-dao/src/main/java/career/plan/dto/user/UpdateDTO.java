package career.plan.dto.user;

import lombok.Data;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/5/15
 * 说明:
 */
@Data
public class UpdateDTO {
     private Long id;
     //用户名
     private String username;
     //用户头像
     private String avatar;
     //用户简介
     private String summary;
}
