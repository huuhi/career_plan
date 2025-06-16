package career.plan.vo;

import career.plan.dto.ResumeData;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/12
 * 说明:
 */
@Data
public class ResumeVO implements Serializable {
    private Long id;
    /**
     * 关联用户ID
     */
    private Long userId;

    /**
     * 简历名称
     */
    private String resumeName;

    private String structuredData;



    private Boolean isDefault;

    @Serial
    private static final long serialVersionUID = 1L;
}
