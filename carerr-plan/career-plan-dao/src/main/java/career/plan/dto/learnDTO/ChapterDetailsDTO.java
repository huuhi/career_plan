package career.plan.dto.learnDTO;

import lombok.Data;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/15
 * 说明:章节下的小结
 */
@Data
public class ChapterDetailsDTO {
    /**
     * 章节名称(如:第一个Java程序)
     */
    private String name;


    /**
     * 章节描述
     */
    private String description;

    /**
     * 章节顺序
     */
    private Integer noduleOrder;
}
