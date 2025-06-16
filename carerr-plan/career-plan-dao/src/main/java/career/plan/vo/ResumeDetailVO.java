package career.plan.vo;

import career.plan.dto.ResumeData;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/13
 * 说明:
 */
@Data
public class ResumeDetailVO implements Serializable {
    private Long id;
    /**
     * 关联用户ID
     */
    private Long userId;

    /**
     * 简历名称
     */
    private String resumeName;
    /**
     * AI分析后的结构化数据
     */
    private String structuredData;

    /**
     * 原始简历内容
     */
    private ResumeData resumeData;

    private Boolean isDefault;

    @Serial
    private static final long serialVersionUID = 1L;
}
