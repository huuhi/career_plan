package career.plan.vo.Interview;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/5/12
 * 说明:
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InterviewHistoryVO implements Serializable {
    private Long memoryId;

    private String title;


    @Serial
    private static final long serialVersionUID = 1L;
}
