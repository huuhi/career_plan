package career.plan.dto.interview;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/5/12
 * 说明: 修改标题DTO
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RenameInterviewDTO implements Serializable {
    private Long memoryId;
//    新标题
    private String title;


    @Serial
    private static final long serialVersionUID = 1L;
}
