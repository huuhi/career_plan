package career.plan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/12
 * 说明:
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StreamDTO implements Serializable {
    private Long id;
    private Long userId;

    @Serial
    private static final long serialVersionUID = 1L;
}
