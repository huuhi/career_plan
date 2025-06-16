package career.plan.dto;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/5/9
 * 说明:
 */
@Data
public class GenerateJobDTO implements Serializable {
        //专业名
    private String jobName;
    //描述
    private String description;

    private Long userId;
    @Serial
    private static final long serialVersionUID = 1L;
}
