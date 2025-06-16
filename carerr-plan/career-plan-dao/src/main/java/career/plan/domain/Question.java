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

/**
 * ai分析问题表
 * @TableName question
 */

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Question implements Serializable {

    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 总分
     */
    private Integer scoreTotal;

    /**
     * 分析之后的数据
     */
    @TableField("analyze_data")
    private Object analyzeData;

    private Object questionJson;


    @Serial
    private static final long serialVersionUID = 1L;
}