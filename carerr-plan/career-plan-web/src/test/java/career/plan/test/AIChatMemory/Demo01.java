//package career.plan.test.AIChatMemory;
//
//import career.plan.domain.Resume;
//import career.plan.dto.ResumeData;
//import career.plan.service.ChatAssistant;
//
//import career.plan.service.MemoryAI;
//import career.plan.service.ResumeService;
//import career.plan.utils.ResumeToString;
//import cn.hutool.json.JSONUtil;
//import dev.langchain4j.data.message.AiMessage;
//import dev.langchain4j.data.message.ChatMessage;
//import dev.langchain4j.data.message.UserMessage;
//import dev.langchain4j.memory.chat.MessageWindowChatMemory;
//import dev.langchain4j.model.chat.ChatLanguageModel;
//import dev.langchain4j.service.AiServices;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//import java.util.List;
//
///**
// * @author 胡志坚
// * @version 1.0
// * 创造日期 2025/5/10
// * 说明:
// */
////@SpringBootTest
//public class Demo01 {
////    @Autowired
//    private ChatAssistant assistant;
////    @Autowired
//    private MemoryAI memoryAI;
////    @Autowired
//    private ChatLanguageModel chatLanguageModel;
////    @Autowired
//    private ResumeService resumeService;
//    @Test
//    void test(){
//        //创建chatMemory
//        MessageWindowChatMemory chatMemory = MessageWindowChatMemory.withMaxMessages(10);
//        ChatAssistant chatAssistant = AiServices.builder(ChatAssistant.class)
//                .chatMemory(chatMemory)
//                .chatLanguageModel(chatLanguageModel)
//                .build();
//
//        String ans1 =chatAssistant.chat("我是喜喜");
//        System.out.println(ans1);
//        String ans2 = chatAssistant.chat("我是谁？");
//        System.out.println(ans2);
//        String ans3 = chatAssistant.chat("好吧，我有个问题，我现在使用的Java来调用你，现在你已经有了上下文的能力，问题在于我怎么保存这些信息呢？我使用的是langchain4j的MessageWindowChatMemory实现的");
//        System.out.println(ans3);
//        List<ChatMessage> messages = chatMemory.messages();
//        for (ChatMessage message : messages) {
//            if (message instanceof UserMessage) {
//                String userText = ((UserMessage) message).singleText();
//                System.out.println("User: " + userText);
//            } else if (message instanceof dev.langchain4j.data.message.AiMessage) {
//                String aiText = ((AiMessage) message).text();
//                System.out.println("AI: " + aiText);
//            }
//        }
//    }
//
//    @Test
//    void test2(){
//        // 测试隔离聊天
////        String ans1 = memoryAI.chat(0,"我是喜喜");
////        System.out.println(ans1);
////        String ans2 = memoryAI.chat(0,"我是谁？");
////        System.out.println(ans2);
////         memoryAI.chat(0,"你好，我是？还有就是我的上一个问题是什么来着？").;
////        System.out.println(ans1);
////        String ans3 = memoryAI.chat(1,"我是谁？");
////        System.out.println(ans3);
//    }
//
//
//
//    @Test
//    void test3(){
////        Resume resume =resumeService.getById(6);
////        String resumeJson = resume.getOriginalText().toString();
////        ResumeData resumeData = JSONUtil.toBean(resumeJson, ResumeData.class);
////        String s = ResumeToString.formatResumeContent(resumeData);
////        System.out.println(memoryAI.startInterview(1, "用户的需要面试的岗位以及用户的简历", "Java后端开发",
////                s));
//        System.out.println(memoryAI.continueInterview(1L, "好的，我是一个善于解决问题的人，并且乐于帮助他人"));
//    }
//
//    @Test
//    void test4(){
//        String title="Java工程师"+"的模拟面试";
//        String jobName = title.substring(0, title.length() - 5);
//        System.out.println(jobName);
//    }
//
//}
