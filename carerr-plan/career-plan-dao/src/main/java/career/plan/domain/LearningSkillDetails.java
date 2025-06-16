package career.plan.domain;



import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Builder;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 学习技能详细章节表
 * @TableName learning_skill_details
 */
@Data
@Builder
public class LearningSkillDetails implements Serializable {
    /**
     * 章节ID，主键
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 关联技能ID
     */
    private Long chapterId;

    private Long pathId;

    private Long skillId;

    /**
     * 章节名称(如:第一个Java程序)
     */
    private String name;

    /**
     * 状态(0:未学 1:已完成)
     */
    private Integer status;

    /**
     * 学习笔记
     */
    private String note;

    /**
     * 章节描述
     */
    private String description;

    /**
     * 章节顺序
     */
    private Integer noduleOrder;

    @Serial
    private static final long serialVersionUID = 1L;

}