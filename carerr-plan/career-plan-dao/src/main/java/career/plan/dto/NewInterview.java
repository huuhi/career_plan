package career.plan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/5/11
 * 说明:
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class NewInterview {
    private String jobName;
    private Long resumeId;

}
