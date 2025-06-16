package career.plan.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;



public class JwtUtil {

    // 在应用启动时生成并存储这个密钥，而不是每次调用时都生成新的
    private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public static String createJWT(long ttlMillis, Map<String, Object> claims) {
        // 使用固定的SECRET_KEY来代替每次传入的secretKey参数
        return Jwts.builder()
                .signWith(SECRET_KEY)
                .setClaims(claims)
                .setExpiration(new Date(System.currentTimeMillis() + ttlMillis))
                .compact();
    }

    public static Claims parseJWT(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

//    根据token获取id
    public static Long getIdFromToken(String token,String key) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return Long.valueOf((Integer)claims.get(key));
    }
}