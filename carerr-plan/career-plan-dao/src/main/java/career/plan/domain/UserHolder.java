package career.plan.domain;

import career.plan.dto.user.UserDTO;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/3/29
 * 说明:
 */
public class UserHolder {
    private static final ThreadLocal<UserDTO> tl=new ThreadLocal<>();
    public static void saveId(UserDTO userDTO){
        tl.set(userDTO);
    }

    public static UserDTO getUser(){
        return tl.get();
    }

    public static void removeUser(){
        tl.remove();
    }


}
