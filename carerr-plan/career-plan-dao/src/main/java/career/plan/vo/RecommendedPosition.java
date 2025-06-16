package career.plan.vo;

import career.plan.vo.learn.LearningStep;
import lombok.Data;
import java.util.List;

//推荐职位
@Data
public class RecommendedPosition {
    private String title;
    private String description;
    private String outlook;
    private String salary;
    private Integer matchScore;
    private List<String> skills;
    private String reason;
    private List<LearningStep> learningRoadmap;
}