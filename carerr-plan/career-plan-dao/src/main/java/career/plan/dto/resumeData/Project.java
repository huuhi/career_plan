package career.plan.dto.resumeData;

import lombok.Data;

import java.util.List;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/13
 * 说明:
 */ // 项目经历
@Data
public class Project {
    private String name;
    private String startDate;
    private String endDate;
    private String description;
    private List<String> highlights;
}
