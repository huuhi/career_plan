package career.plan.vo;

import lombok.Data;
import java.util.List;
//简历评估
@Data
public class ResumeEvaluation {
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> improvementSuggestions;
}