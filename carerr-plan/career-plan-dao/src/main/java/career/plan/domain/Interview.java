package career.plan.domain;

import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

/**
 * 
 * @TableName interview
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Interview implements Serializable {
    /**
     * 
     */
    @TableId(value = "id")
    private Long memoryId;

    /**
     * 
     */
    private String title;

    /**
     * 
     */
    private Long userId;


    private Long resumeId;
    /**
     * 
     */
    private Date updateTime;

    @Serial
    private static final long serialVersionUID = 1L;

}