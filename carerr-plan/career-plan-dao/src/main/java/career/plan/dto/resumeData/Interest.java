package career.plan.dto.resumeData;

import lombok.Data;

import java.util.List;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/13
 * 说明:
 */ // 兴趣爱好
@Data
public class Interest {
    private String name;
    private List<String> keywords;
}
