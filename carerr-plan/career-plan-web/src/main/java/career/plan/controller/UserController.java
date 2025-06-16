package career.plan.controller;

import career.plan.domain.UserHolder;
import career.plan.dto.user.*;
import career.plan.service.UserService;
import career.plan.vo.Result;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/8
 * 说明:用户controller
 */
@RestController
@RequestMapping("/user")
@Slf4j
public class UserController {
    @Resource
    private UserService userService;

    @PostMapping("/register")
    public Result register(@RequestBody UserRegisterDTO userRegisterDTO){
        return userService.register(userRegisterDTO);
    }
    //用户登录
    @PostMapping("/login")
    public Result login(@RequestBody UserLogin userLogin){
        return userService.login(userLogin);
    }

    @PutMapping("/updatePassword")
    public Result updatePassword(@RequestBody UserUpdatePwdDTO userUpdate){
        return userService.updatePassword(userUpdate);
    }
    //修改用户基本信息
    @PutMapping("/updateSummary")
    public Result updateData(@RequestBody UpdateDTO updateDTO){
        if(updateDTO.getId()==null|| UserHolder.getUser()==null){
            return Result.fail("用户不存在!");
        }
        return userService.updateSummary(updateDTO);
    }
    @GetMapping("/getUserData")
    public Result getUserData(){
        UserDTO user = UserHolder.getUser();
        if(user==null){
            return Result.fail("未登录！");
        }
        return userService.getUserDetail(user);
    }

}
