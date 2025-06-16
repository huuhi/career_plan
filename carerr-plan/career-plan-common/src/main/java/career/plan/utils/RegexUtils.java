package career.plan.utils;


import cn.hutool.core.util.StrUtil;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static career.plan.utils.RegexPatterns.CLEAN_JSON_RESPONSE;

/**
 * @author 胡志坚
 * 说明：正则校验工具类
 */
public class RegexUtils {
    /**
     * 是否是无效手机格式
     * @param phone 要校验的手机号
     * @return true:符合，false：不符合
     */
    public static boolean isPhoneInvalid(String phone){
        return mismatch(phone, RegexPatterns.PHONE_REGEX);
    }
    /**
     * 是否是无效邮箱格式
     * @param email 要校验的邮箱
     * @return true:符合，false：不符合
     */
    public static boolean isEmailInvalid(String email){
        return mismatch(email, RegexPatterns.EMAIL_REGEX);
    }

    /**
     * 是否是无效验证码格式
     * @param code 要校验的验证码
     * @return true:符合，false：不符合
     */
    public static boolean isCodeInvalid(String code){
        return mismatch(code, RegexPatterns.VERIFY_CODE_REGEX);
    }

    // 校验是否不符合正则格式
    private static boolean mismatch(String str, String regex){
        if (StrUtil.isBlank(str)) {
            return true;
        }
        return !str.matches(regex);
    }

    public static String cleanJsonResponse(String rawResponse) {
        // 匹配 ```json 开头和 ``` 结尾
        Pattern pattern = Pattern.compile(CLEAN_JSON_RESPONSE, Pattern.DOTALL);
        Matcher matcher = pattern.matcher(rawResponse);

        if (matcher.find()) {
            return matcher.group(1); // 提取实际JSON内容
        }
        return rawResponse; // 如果没有匹配到标记，返回原始内容
    }
}
