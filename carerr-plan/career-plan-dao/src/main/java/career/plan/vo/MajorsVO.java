package career.plan.vo;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/11
 * 说明:专业的基本信息
 */
@Data
public class MajorsVO {
    private Integer id;

    /**
     * 专业全称
     */
    private String title;

    /**
     * 学制(年)
     */
    private String studyDuration;

    /**
     * 专业简介
     */
    private String description;

    private String type;

    /**
     *
     */
    private String degreeType;


    @TableField(exist = false)
    private  Integer matchScore;

}
