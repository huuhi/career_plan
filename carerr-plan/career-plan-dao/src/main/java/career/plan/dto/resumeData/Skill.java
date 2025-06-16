package career.plan.dto.resumeData;

import lombok.Data;
import java.util.List;

@Data
public class Skill {
    private String name;
    private String level;
    private List<String> keywords;
}