package career.plan.dto.resumeData;

import lombok.Data;
import java.util.List;

@Data
public class WorkExperience {
    private String name;
    private String position;
    private String startDate; // 建议改用LocalDate
    private String endDate;
    private String summary;
    private List<String> highlights;
}