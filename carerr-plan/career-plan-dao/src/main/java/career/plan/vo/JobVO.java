package career.plan.vo;

import lombok.Data;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/10
 * 说明:
 */
@Data
public class JobVO {
    private Long id;
     //职位名称
     private String title;
     //工资
     private String salary;
     private String type;

//    匹配度1-100
     private Integer matchScore;
     //工作描述
     private String description;
     //前景
     private String outlook;
}
