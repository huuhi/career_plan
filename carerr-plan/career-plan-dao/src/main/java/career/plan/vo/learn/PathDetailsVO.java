package career.plan.vo.learn;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/14
 * 说明:
 */
@Data
public class PathDetailsVO implements Serializable {
    private Long id;

    private Long jobId;
    private Long majorsId;

    private String goalName;
    private String whyRecommend;
    private String adviceAndAttention;
    private String completeHarvest;


    private List<LearningSkillDetailVO> skills;


    @Serial
    private static final long serialVersionUID = 1L;
}
