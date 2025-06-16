package career.plan.dto;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/5/7
 * 说明:
 */
@Data
public class GenerateMajorsDTO implements Serializable {
    //专业名
    private String majorsName;
    //描述
    private String description;

    private Long userId;
    @Serial
    private static final long serialVersionUID = 1L;
}
