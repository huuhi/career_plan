package career.plan.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 简单评论表
 * @TableName review
 */
@Data
public class Review implements Serializable {

@TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 
     */
    private String content;

    /**
     * 
     */
    private Integer majorsId;

    /**
     * 
     */
    private Long jobId;

    /**
     * 
     */
    private String username;

    private Long userId;

    /**
     * 举报次数
     */
    private Integer reportCount;

    @Serial
    private static final long serialVersionUID = 1L;

}