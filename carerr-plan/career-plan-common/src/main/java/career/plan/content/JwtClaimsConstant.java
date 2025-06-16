package career.plan.content;

public class JwtClaimsConstant {
    public static final String USER_ID = "userId";
    public static final String USERNAME = "username";
    public static final String USER_IMAGE = "userImage";
     // 7天的毫秒数
   public static final long TOKEN_EXPIRATION_TIME = 604800000L;

   // 刷新令牌的时间阈值（1天）
   public static final long REFRESH_THRESHOLD = 86400000L;

}
