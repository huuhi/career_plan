package career.plan.vo.Interview;

import lombok.Data;
import java.util.List;
//面试准备
@Data
public class InterviewPreparation {
    private List<String> technicalFocus;
    private List<String> behavioralQuestions;
    private List<String> salaryNegotiationTips;
}