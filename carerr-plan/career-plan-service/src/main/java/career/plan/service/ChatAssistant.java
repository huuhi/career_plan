package career.plan.service;


import career.plan.dto.QuestionDTO;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import reactor.core.publisher.Flux;

import java.util.List;

import static career.plan.content.AiRoleConstant.*;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/9
 * 说明:
 */
public interface ChatAssistant {
    /**
     *
     * @param message 消息
     * @return 响应数据
     */
    @SystemMessage(RESUME_ANALYST_STREAM)
    Flux<String> analyzeResume(String message);

    @SystemMessage(ANALYST_QUESTION)
    String analyzeQuestion(@UserMessage List<QuestionDTO> list, @V("summary") String summary);

    @SystemMessage(RECOMMENDED_MAJORS)
    String recommendedMajors(@UserMessage List<QuestionDTO> list,  @V("summary") String summary);

    @SystemMessage(GENERATED_LEARN_PATH)
    String generateLearningPath(@UserMessage  String goal,@UserMessage String resume);

    @SystemMessage(GENERATED_MAJORS)
    String generateMajors(@UserMessage String goal);

    @SystemMessage(GENERATED_JOB)
    String generateJob(@UserMessage String jsonStr);
    @SystemMessage("你是一个可爱的小助手")
    String chat(String message);

}
