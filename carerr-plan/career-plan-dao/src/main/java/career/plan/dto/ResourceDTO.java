package career.plan.dto;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/14
 * 说明:
 */
@Data
public class ResourceDTO implements Serializable {
    private String course;
    private String web;
    private String book;

    @Serial
    private static final long serialVersionUID = 1L;
}
