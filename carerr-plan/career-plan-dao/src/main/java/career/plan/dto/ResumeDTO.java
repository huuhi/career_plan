package career.plan.dto;

import lombok.Data;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/13
 * 说明:
 */
@Data
public class ResumeDTO {
    private Long resumeId;
    private String resumeName;
    private  ResumeData resumeData;
}
