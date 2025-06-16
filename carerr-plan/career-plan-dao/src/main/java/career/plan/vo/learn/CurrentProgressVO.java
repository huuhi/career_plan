package career.plan.vo.learn;

import lombok.Builder;
import lombok.Data;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/17
 * 说明:
 */
@Data
@Builder
public class CurrentProgressVO {
    private String name;
    private Integer progress;
}
