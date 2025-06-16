package career.plan.dto.learnDTO;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/17
 * 说明:消息队列中获取
 */
@Data
public class NodeDTO implements Serializable {
     private Long pathId;
     private Long skillId;
     private Long chapterId;
    @Serial
    private static final long serialVersionUID = 1L;

}
