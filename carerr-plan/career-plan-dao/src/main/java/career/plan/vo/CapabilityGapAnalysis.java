package career.plan.vo;

import lombok.Data;
import java.util.List;
// 能力差距分析

@Data
public class CapabilityGapAnalysis {
    private List<String> meetRequirements;
    private List<String> needImprovement;
}