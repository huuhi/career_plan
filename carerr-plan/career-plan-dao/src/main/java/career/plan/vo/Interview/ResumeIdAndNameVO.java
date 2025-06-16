package career.plan.vo.Interview;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.Serializable;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/5/13
 * 说明:
 */
@Data
@AllArgsConstructor
public class ResumeIdAndNameVO implements Serializable {
    private Long id;
    private String resumeName;
}
