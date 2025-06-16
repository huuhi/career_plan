package career.plan.controller;

import career.plan.vo.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/21
 * 说明: 测试是否连接
 */
@RestController
public class TestController {

    @GetMapping("/test")
    public Result testConnection() {
        return Result.ok();
    }
}
