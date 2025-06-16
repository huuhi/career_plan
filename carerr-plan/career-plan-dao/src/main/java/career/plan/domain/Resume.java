package career.plan.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

/**
 * 用户简历信息表
 * @TableName resume
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Resume implements Serializable {
    /**
     * 简历ID，主键
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 关联用户ID
     */
    private Long userId;

    /**
     * 简历名称
     */
    private String resumeName;

    /**
     * AI分析后的结构化数据
     */
    private String structuredData;

    /**
     * 原始简历内容
     */
    private Object originalText;

    private Boolean isDefault;

    @Serial
    private static final long serialVersionUID = 1L;


}