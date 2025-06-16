package career.plan.dto.resumeData;

import lombok.Data;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/13
 * 说明:
 */ // 证书
@Data
public class Certificate {
    private String name;
    private String date;
    private String issuer;
    private String url;
}
