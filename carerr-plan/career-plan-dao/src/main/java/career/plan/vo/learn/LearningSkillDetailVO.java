package career.plan.vo.learn;

import career.plan.dto.ResourceDTO;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/14
 * 说明:
 */
@Data
public class LearningSkillDetailVO implements Serializable {

    private Long id;


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
    private String status;


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
    private ResourceDTO resourceDTO;


    private String completeHarvest;


    @Serial
    private static final long serialVersionUID = 1L;



}
