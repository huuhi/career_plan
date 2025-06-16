package career.plan.service;


import career.plan.domain.User;
import career.plan.domain.UserHolder;
import career.plan.dto.user.*;
import career.plan.vo.Result;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author windows
* @description 针对表【user(用户基本信息表)】的数据库操作Service
* @createDate 2025-04-08 20:14:40
*/
public interface UserService extends IService<User> {

    Result register(UserRegisterDTO userRegisterDTO);

    Result login(UserLogin userLogin);

    Result updatePassword(UserUpdatePwdDTO userUpdate);

    Result updateSummary(UpdateDTO updateDTO);

    Result getUserDetail(UserDTO user);
}
