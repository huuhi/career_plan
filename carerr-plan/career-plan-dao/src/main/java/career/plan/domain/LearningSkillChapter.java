package career.plan.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Builder;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 学习技能详细章节表
 * @TableName learning_skill_chapter
 */
@Data
@Builder
public class LearningSkillChapter implements Serializable {
    /**
     * 主键ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 关联的学习技能ID
     */
    private Long skillId;

    /**
     * 章节名称（如：第一章:JavaScript简介）
     */


    private String name;

//    状态
    private Boolean status;
    private String description;

    /**
     * 章节排序序号
     */
    private Integer chapterOrder;

    @Serial
    private static final long serialVersionUID = 1L;
}