package career.plan.dto.user;

import lombok.Builder;
import lombok.Data;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/9
 * 说明:
 */
@Data
@Builder
public class UserDTO {
    private Long id;
    private String username;
}
