package career.plan.vo;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/10
 * 说明:分析问题之后返回的推荐的工作的主类
 */
@Data
public class RecommendedVO implements Serializable {
    private Integer id;
    //对用户的描述
    private String description;
    //为什么推荐以下职位的解释
    private String whyRecommend;
    //详细信息（不返回，只是用来保存）
    private Object DetailList;
    //工作的简单信息
    private Object DataList;

    @Serial
    private static final long serialVersionUID = 1L;

}
