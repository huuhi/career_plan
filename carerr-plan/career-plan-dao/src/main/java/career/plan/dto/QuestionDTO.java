package career.plan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/10
 * 说明:问题dto
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO implements Serializable {
    private String question;
    private String answer;
    private Integer score;

    @Serial
    private static final long serialVersionUID = 1L;

    public QuestionDTO(String question) {
        this.question = question;
    }
}
