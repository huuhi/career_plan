package career.plan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/3/31
 * 说明:
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RedisData implements Serializable {
    private LocalDateTime expireTime;
    private Object data;
    private static final long serialVersionUID = 1L;
}
