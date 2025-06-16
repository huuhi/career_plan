package career.plan.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/3/29
 * 说明:
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Result {
    private Boolean success;
    private String errorMsg;
    private Object data;
    private Long total;
    private Integer code;
    public static Result ok(){
        return new Result(true, null, null, null,1);
    }
    public static Result ok(Object data){
        return new Result(true, null, data, null,1);
    }
    public static Result ok(List<?> data, Long total){
        return new Result(true, null, data, total,1);
    }
    public static Result fail(String errorMsg){
        return new Result(false, errorMsg, null, null,0);
    }
}
