package career.plan.config;

import career.plan.service.ChatAssistant;
import career.plan.service.MemoryAI;
import career.plan.store.MongodbChatMemoryStore;
import dev.langchain4j.http.client.spring.restclient.SpringRestClientBuilder;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.chat.StreamingChatLanguageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiStreamingChatModel;
import dev.langchain4j.service.AiServices;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/9
 * 说明:
 */
@Component
@Slf4j
public class LLMConfig {
    private static final String BASE_URL = System.getenv("AI_BASE_URL");
    private static final String MODEL_NAME = System.getenv("AI_NAME");
//    qwen-turbo-latest
//    "sk-3192500342ea4bb3a3fa963430d7b388"
    private static final String API_KEY = System.getenv("AI_KEY");
    private static final Integer TIME_OUT = 300;
    private static final Integer MAX_MESSAGE = 30;
    
    @Autowired
    private MongodbChatMemoryStore mongodbChatMemoryStore;

    @Bean
    public ChatLanguageModel chatLanguageModel() {
        return OpenAiChatModel.builder()
                .apiKey(API_KEY)
                .modelName(MODEL_NAME)
                .logRequests(true)
                .logResponses(true)
                .maxRetries(3)
                .timeout(Duration.ofSeconds(TIME_OUT))
                .baseUrl(BASE_URL)
                .httpClientBuilder(new SpringRestClientBuilder()) // 直接 new 一个 Spring 的客户端
                .build();
    }
     @Bean
     @Primary
    public StreamingChatLanguageModel streamingChatLanguageModel() {
        return OpenAiStreamingChatModel.builder()
                .apiKey(API_KEY)
                .modelName(MODEL_NAME)
                .timeout(Duration.ofSeconds(TIME_OUT))
                .baseUrl(BASE_URL)
                .httpClientBuilder(new SpringRestClientBuilder())
                .build();
    }
    @Bean
    public ChatAssistant chatAssistant(StreamingChatLanguageModel streamingChatLanguageModel,
                                       ChatLanguageModel chatLanguageModel) {
        return AiServices.builder(ChatAssistant.class)
            .streamingChatLanguageModel(streamingChatLanguageModel)
            .chatLanguageModel(chatLanguageModel)
            .build();
    }

    @Bean
    public MemoryAI MemoryChatAI(StreamingChatLanguageModel streamingChatLanguageModel,
                                  ChatLanguageModel chatLanguageModel,
                                 ChatMemoryProvider chatMemoryProvider) {
        return AiServices.builder(MemoryAI.class)
            .streamingChatLanguageModel(streamingChatLanguageModel)
            .chatMemoryProvider(chatMemoryProvider)
            .chatLanguageModel(chatLanguageModel)
            .build();
    }
    @Bean
    public ChatMemoryProvider chatMemoryProvider(){
        return memoryId->MessageWindowChatMemory
                .builder()
                .id(memoryId)
                .maxMessages(MAX_MESSAGE)
                .chatMemoryStore(mongodbChatMemoryStore)
                .build();
    }


}
