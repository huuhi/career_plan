package career.plan.dto.learnDTO;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/13
 * 说明:
 */
@Data
public class LearningPathDTO {

    private String goalName;
    @JsonProperty("why_recommend")
    private String whyRecommend;

    @JsonProperty("advice_and_attention")
    private String adviceAndAttention;
    @JsonProperty("complete_harvest")
    private String completeHarvest;


    private List<LearningSkillDTO> skills;
}
