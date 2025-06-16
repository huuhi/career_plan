package career.plan.service;

import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.V;
import reactor.core.publisher.Flux;

import static career.plan.content.AiRoleConstant.INTERVIEW_PROMPT_WORDS;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/5/10
 * 说明:
 */
public interface MemoryAI {

    @SystemMessage(INTERVIEW_PROMPT_WORDS)
    Flux<String> startInterview(@MemoryId Long memoryId,
                                @UserMessage String message,
                                @V("jobName") String jobName,
                                @V("resume") String resume);


    Flux<String> continueInterview(@MemoryId Long memoryId, @UserMessage String message);
}
