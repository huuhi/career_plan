package career.plan.vo.learn;

import lombok.Data;

//学习路线步骤
@Data
public class LearningStep {
    private String stepName;  // 使用驼峰命名（原JSON是step_name）
    private Integer stepOrder;
    private String scheduledTime;
    private String importance;
    private String preknowledge;
    private String targetSkill;
}