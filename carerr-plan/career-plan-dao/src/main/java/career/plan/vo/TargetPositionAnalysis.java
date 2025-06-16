package career.plan.vo;

import lombok.Data;
import java.util.List;
//目标职位分析
@Data
public class TargetPositionAnalysis {
    private List<RecommendedPosition> recommendedPositions;
    private CapabilityGapAnalysis capabilityGapAnalysis;
}