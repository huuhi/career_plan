package career.plan.dto.resumeData;

import lombok.Data;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/13
 * 说明:
 */ // 获奖记录
@Data
public class Award {
    private String title;
    private String date;
    private String awarder;
    private String summary;
}
