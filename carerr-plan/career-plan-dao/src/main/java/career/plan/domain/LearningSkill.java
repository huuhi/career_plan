package career.plan.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Builder;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

/**
 * 学习技能表
 * @TableName learning_skill
 */
@Data
@Builder
public class LearningSkill implements Serializable {
    /**
     * 技能ID，主键
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 关联学习路径ID
     */
    private Long pathId;

    /**
     * 步骤名称(如:学习Java)
     */
    private String stepName;

    /**
     * 步骤顺序
     */
    private Integer stepOrder;

    /**
     * 当前进度(0-100)
     */
    private Integer currentProgress;

    /**
     * 状态(0:未学 1:学习中 2:已完成)
     */
    private Integer status;


    /**
     * 预计学习时间
     */
    private String scheduledTime;

    /**
     * 重要程度(核心/重要/扩展)
     */
    private String preKnowledge;

    private String importance;


    @TableField(typeHandler = JacksonTypeHandler.class)
    private Object resource;

    private String completeHarvest;

    /**
     * 开始日期
     */
    private Date startDate;

    /**
     * 完成日期
     */
    private Date completeDate;

    @Serial
    private static final long serialVersionUID = 1L;
}