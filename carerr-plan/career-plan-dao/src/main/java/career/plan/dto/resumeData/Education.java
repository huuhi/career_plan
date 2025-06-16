package career.plan.dto.resumeData;

import lombok.Data;
import java.util.List;

@Data
public class Education {
    private String institution;
    private String area;
    private String studyType;
    private String startDate;
    private String endDate;
    private String score;
    private List<String> courses;
}