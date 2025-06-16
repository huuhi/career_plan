package career.plan.eum;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/14
 * 说明:
 */
public enum LearnStatus {

    IN_PROGRESS(0, "学习中"),
    COMPLETED(1, "已完成");

    private final Integer code;
    private final String description;

    /**
     * 构造函数
     *
     * @param code        状态码
     * @param description 状态描述
     */
    LearnStatus(int code, String description) {
        this.code = code;
        this.description = description;
    }

    /**
     * 获取状态码
     *
     * @return 状态码
     */
    public int getCode() {
        return code;
    }


    /**
     * 根据状态码获取对应的 LearnStatus 枚举
     *
     * @param code 状态码
     * @return 对应的 LearnStatus 枚举
     */
    public static String fromCode(Integer code) {
        for (LearnStatus status : values()) {
            if (status.getCode() == code) {
                return status.description;
            }
        }
        throw new IllegalArgumentException("无效的状态码: " + code);
    }

}
