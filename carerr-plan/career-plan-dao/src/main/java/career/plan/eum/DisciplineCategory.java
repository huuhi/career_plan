package career.plan.eum;

public enum DisciplineCategory {
    PHILOSOPHY((short) 1, "哲学"),
    ECONOMICS((short) 2, "经济学"),
    LAW((short) 3, "法学"),
    EDUCATION((short) 4, "教育学"),
    LITERATURE((short) 5, "文学"),
    HISTORY((short) 6, "历史学"),
    SCIENCE((short) 7, "理学"),
    ENGINEERING((short) 8, "工学"),
    AGRICULTURE((short) 9, "农学"),
    MEDICINE((short) 10, "医学"),
    MILITARY_SCIENCE((short) 11, "军事学"),
    MANAGEMENT((short) 12, "管理学"),
    ARTS((short) 13, "艺术学"),
    INTERDISCIPLINARY((short) 14, "交叉学科"),
    OTHER((short) 15, "其他");

    private final short code;
    private final String name;

    DisciplineCategory(short code, String name) {
        this.code = code;
        this.name = name;
    }

    public short getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public static String getNameByCode(Short code) {
        for (DisciplineCategory category : DisciplineCategory.values()) {
            if (category.getCode() == code) {
                return category.getName();
            }
        }
        return null; // 或者抛出异常，表示未知分类
    }
}
