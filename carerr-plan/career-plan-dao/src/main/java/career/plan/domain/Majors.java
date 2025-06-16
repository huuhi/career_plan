package career.plan.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import com.fasterxml.jackson.core.type.TypeReference;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 专业信息表
 * @TableName majors
 */
@Data
public class Majors implements Serializable {

    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 专业全称
     */
    private String title;

    /**
     * 学制(年)
     */
    private String studyDuration;

    /**
     * 专业简介
     */
    private String description;

    /**
     * 
     */
    private String degreeType;

    private Short type;

    /**
     * 培养目标
     */
    private String trainingObjectives;

    /**
     * 专业特色
     */
    private String professionalFeatures;

    @TableField(exist = false)
    private  Integer matchScore;
    /**
     * 核心课程
     */
    private String coreCourses;

    /**
     * 实践教学
     */
    private String practicalTraining;

    /**
     * 就业前景
     */
    private String careerProspects;

    /**
     * 适合学生类型
     */
    private String recommendedFor;

    /**
     * 
     */
    private Date createdAt;

    /**
     * 
     */
    private Date updatedAt;

    @Serial
    private static final long serialVersionUID = 1L;

    public List<String> getCoursesList(){
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(coreCourses, new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    public List<String> getPracticeList(){
        ObjectMapper mapper = new ObjectMapper();
        try {
            return mapper.readValue(practicalTraining, new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }


}