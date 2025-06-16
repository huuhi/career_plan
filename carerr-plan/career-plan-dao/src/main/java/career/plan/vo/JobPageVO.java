package career.plan.vo;

import lombok.Data;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/16
 * 说明:
 */
@Data
public class JobPageVO {
    private Long id;
     //职位名称
     private String title;
     //工资区间
     private String salary;
     private String type;


     //工作描述
     private String description;
     //前景
     private String outlook;


}
