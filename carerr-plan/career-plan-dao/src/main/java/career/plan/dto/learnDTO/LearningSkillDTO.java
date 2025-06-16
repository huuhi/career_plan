package career.plan.dto.learnDTO;

import career.plan.dto.ResourceDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
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
public class LearningSkillDTO implements Serializable {

    @JsonProperty("step_name")
     private String stepName;

    /**
     * 步骤顺序
     */
    @JsonProperty("step_order")
    private Integer stepOrder;



    /**
     * 预计学习时间
     */
    @JsonProperty("scheduled_time")
    private String scheduledTime;

    /**
     * 重要程度(核心/重要/扩展)
     */
    @JsonProperty("pre_knowledge")
    private String preKnowledge;


    private String importance;


    private ResourceDTO resource;

    @JsonProperty("complete_harvest")
    private String completeHarvest;

    private List<SkillChapterDTO> chapters;




    @Serial
    private static final long serialVersionUID = 1L;

}
