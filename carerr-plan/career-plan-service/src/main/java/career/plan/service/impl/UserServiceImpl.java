package career.plan.service.impl;


import career.plan.domain.User;
import career.plan.domain.UserHolder;
import career.plan.dto.user.UserDTO;
import career.plan.dto.user.UserLogin;
import career.plan.dto.user.UserRegisterDTO;
import career.plan.dto.user.UserUpdatePwdDTO;
import career.plan.dto.user.UpdateDTO;
import career.plan.mapper.UserMapper;
import career.plan.service.UserService;
import career.plan.utils.JwtUtil;
import career.plan.utils.RegexUtils;
import career.plan.vo.Result;
import career.plan.vo.user.UserDetailVO;
import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.file.attribute.UserDefinedFileAttributeView;
import java.util.HashMap;
import java.util.Map;
import static career.plan.content.JwtClaimsConstant.*;


/**
* @author windows
* @description 针对表【user(用户基本信息表)】的数据库操作Service实现
* @createDate 2025-04-08 20:14:40
*/
@Service
@Slf4j
public class UserServiceImpl extends ServiceImpl<UserMapper, User>
    implements UserService{
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    /**
     * 用户注册,首先校验手机号是否合法，如果不合法直接返回
     * 之后查看用户的手机号是否存在数据库中
     * 如果存在,不给注册，否则注册成功返回token
     */
    @Override
    public Result register(UserRegisterDTO userRegisterDTO) {
        //先校验手机号是否合法
        String phone = userRegisterDTO.getPhone();
        if (RegexUtils.isPhoneInvalid(phone)) {
            return Result.fail("手机号不合法!");
        }
        //查询
        Long count = query()
                .eq("phone", userRegisterDTO.getPhone())
                .count();
        if(count>=1){
            return Result.fail("你的手机号已经注册！");
        }
        //不存在，注册用户
        User user = BeanUtil.copyProperties(userRegisterDTO, User.class);
        //使用BCrypt加密
        String pwd = encoder.encode(user.getPassword());
        user.setPassword(pwd);
        boolean save = save(user);
        //注册成功，生成jwt返回
        if(save){
            String jwt = getJwt(user);
            return Result.ok(jwt);
        }
        return Result.fail("注册失败！");

    }

    @Override
    public Result login(UserLogin userLogin) {
        String phone = userLogin.getPhone();
        //校验手机号
        if(RegexUtils.isPhoneInvalid(phone)){
            return Result.fail("手机号不合法!");
        }
        User user = query()
                .eq("phone", phone)
                .one();
        if(user==null){
            return Result.fail("用户不存在！");
        }
        if(encoder.matches(userLogin.getPassword(),user.getPassword())){
            String jwt = getJwt(user);
            return Result.ok(jwt);
        }
        return Result.fail("手机号或者密码错误！");
    }

    @Override
    public Result updatePassword(UserUpdatePwdDTO userUpdate) {
        UserDTO userDTO = UserHolder.getUser();
        if(userDTO==null){
            return Result.fail("你没有登录！");
        }
        User user = getById(userDTO.getId());
        if(!encoder.matches(userUpdate.getOldPassword(),user.getPassword())){
            return Result.fail("你的原密码错误");
        }
        if(!encoder.matches(userUpdate.getNewPassword(),user.getPassword())){
            user.setPassword(encoder.encode(userUpdate.getNewPassword()));
            updateById(user);
            return Result.ok("修改成功");
        }
        return Result.fail("新密码不能与原密码相同");
    }

    @Override
    public Result updateSummary(UpdateDTO updateDTO) {
        User user = BeanUtil.copyProperties(updateDTO, User.class);
        Long userId = user.getId();
        Long nowId = UserHolder.getUser().getId();
        if(!userId.equals(nowId)){
            return Result.fail("你没有权限修改!");
        }
        boolean save = updateById(user);
        if(save){
            return Result.ok("修改成功!");
        }
        return Result.fail("修改失败!");
    }

    @Override
    public Result getUserDetail(UserDTO userDTO) {
        Long id =userDTO.getId();
        User user = getById(id);
        //获取用户详细信息
        UserDetailVO userDetailVO = BeanUtil.copyProperties(user, UserDetailVO.class);
        return Result.ok(userDetailVO);
    }

    private static String getJwt(User user) {
        Map<String, Object> claim=new HashMap<>();
        claim.put(USER_ID, user.getId());
        claim.put(USERNAME, user.getUsername());
        //用户的头像URL
//        claim.put(USER_IMAGE,user.getAvatar());
        return JwtUtil.createJWT(TOKEN_EXPIRATION_TIME, claim);
    }


}




