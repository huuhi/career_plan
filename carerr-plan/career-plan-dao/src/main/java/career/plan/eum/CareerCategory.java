package career.plan.eum;

import lombok.Getter;

@Getter
public enum CareerCategory {
    AGRICULTURE((short) 1, "农业类"),
    INDUSTRY((short) 2, "工业类"),
    SERVICES((short) 3, "服务业类"),
    PROFESSIONAL_TECHNOLOGY((short) 4, "专业技术类"),
    MANAGEMENT((short) 5, "管理类"),
    ART_AND_ENTERTAINMENT((short) 6, "艺术与娱乐类"),
    OTHER((short) 7, "其他");

    private final Short code;
    private final String name;

    CareerCategory(Short code, String name) {
        this.code = code;
        this.name = name;
    }



    public static String getNameByCode(Short code) {
        for (CareerCategory category : CareerCategory.values()) {
            if (category.getCode().equals(code)) {
                return category.getName();
            }
        }
        return null; // 或者抛出异常，表示未知分类
    }
}
