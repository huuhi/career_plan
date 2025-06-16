package career.plan.vo;


import lombok.Data;

import java.util.List;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/11
 * 说明:
 */
@Data
public class MajorsDetailVO {
    private Integer id;

    /**
     * 专业全称
     */
    private String title;

    /**
     * 学制(年)
     */
    private String studyDuration;

    /**
     * 专业简介
     */
    private String description;

    /**
     *
     */
    private String degreeType;

    private String type;

    /**
     * 培养目标
     */
    private String trainingObjectives;

    /**
     * 专业特色
     */
    private String professionalFeatures;

    /**
     * 核心课程
     */
    private List<String> coreCourses;

    /**
     * 实践教学
     */
    private List<String> practicalTraining;

    /**
     * 就业前景
     */
    private String careerProspects;

    /**
     * 适合学生类型
     */
    private String recommendedFor;
}
