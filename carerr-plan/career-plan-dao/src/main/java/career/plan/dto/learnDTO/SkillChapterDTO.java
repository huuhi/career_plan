package career.plan.dto.learnDTO;

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
public class SkillChapterDTO implements Serializable {
    private String name;
    /**
     * 章节说明
     */
    private String description;

    /**
     * 章节排序序号
     */
    @JsonProperty("chapter_order")
    private Integer chapterOrder;

    @JsonProperty("complete_harvest")
    private String completeHarvest;

    private List<ChapterDetailsDTO> nodes;

    @Serial
    private static final long serialVersionUID = 1L;


}
