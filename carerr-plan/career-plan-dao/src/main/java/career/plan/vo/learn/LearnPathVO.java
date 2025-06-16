package career.plan.vo.learn;

import lombok.Data;

import java.io.Serializable;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/15
 * 说明:返回学习路径的基本信息
 */
@Data
public class LearnPathVO implements Serializable {
    private Long id;

    private Long jobId;

    private Long majorsId;

    private String goalName;

    /**
     * 是否完成,0:未完成,1:已完成
     */
    private Integer isActive;

    private String whyRecommend;

    private String adviceAndAttention;

    private String completeHarvest;
}
