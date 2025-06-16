package career.plan.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Date;

/**
 * 用户基本信息表
 * @TableName user
 */
@Data
public class User implements Serializable {
    /**
     * 用户ID，主键
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 用户名
     */
    private String username;

    /**
     * 手机号
     */
    private String phone;

    /**
     * 密码(加密)
     */
    private String password;

    /**
     * 头像URL
     */
    private String avatar;

    //用户简介
    private String summary;

    /**
     * 注册时间
     */
    private LocalDate createAt;

    @Serial
    private static final long serialVersionUID = 1L;
}