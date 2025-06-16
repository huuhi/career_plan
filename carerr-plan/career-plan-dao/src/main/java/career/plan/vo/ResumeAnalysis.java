package career.plan.vo;

import career.plan.vo.Interview.InterviewPreparation;
import lombok.Data;

//AI 分析的主类
@Data
public class ResumeAnalysis {
    private ResumeEvaluation resumeEvaluation;
    private TargetPositionAnalysis targetPositionAnalysis;
    private InterviewPreparation interviewPreparation;
}