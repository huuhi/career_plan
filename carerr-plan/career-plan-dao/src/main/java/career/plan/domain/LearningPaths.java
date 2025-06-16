package career.plan.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

/**
 * 用户学习路径表
 * @TableName leanring_paths
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LearningPaths implements Serializable {
    /**
     * 学习路径ID，主键
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 关联职位ID
     */
    private Long jobId;

    private Long majorsId;

    private String goalName;


    /**
     * 关联用户ID
     */
    private Long userId;

    /**
     * 是否正在使用(1:是 0:否)
     */
    private Integer isActive;

    private String whyRecommend;

    private String adviceAndAttention;

    private String completeHarvest;

    private Integer currentProgress;


    /**
     * 创建时间
     */
    private Date createAt;

    private Date end;

    @Serial
    private static final long serialVersionUID = 1L;


}