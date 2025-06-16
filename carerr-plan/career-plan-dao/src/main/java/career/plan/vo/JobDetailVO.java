package career.plan.vo;


import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/11
 * 说明:职位的详细，返回实体类
 */
@Data
public class JobDetailVO implements Serializable {
    private Long id;

    /**
     * 职位名称
     */
    private String title;

    /**
     * 职位描述
     */
    private String description;

    /**
     * 职业前景
     */
    private String outlook;

    private String type;


    /**
     * 薪资范围(如:15k-30k)
     */
    private String salary;

    /**
     * 所需技能(JSON数组格式)
     */

    private List<String> skills;

    /**
     * 适合的性格(JSON数组格式)
     */
    private List<String> personalityTraits;
//    日常工作内容
    private String dailyTasks;
//    职业发展方向
    private String  careerGrowth;
//    *被AI/自动化替代的 风险*
    private String automationRisk;
    //风险解释
    private String riskExplanation;
}
