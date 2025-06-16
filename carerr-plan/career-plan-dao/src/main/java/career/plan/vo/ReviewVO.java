package career.plan.vo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/16
 * 说明:
 */
@Data
public class ReviewVO implements Serializable {

    private Long id;
    /**
     *
     */
    private String content;

    private Long userId;
    /**
     *
     */
    private String username;

    //默认为false
    private Boolean isMe=false;

    @Serial
    private static final long serialVersionUID = 1L;

}
