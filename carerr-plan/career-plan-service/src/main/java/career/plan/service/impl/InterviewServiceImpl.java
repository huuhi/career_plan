package career.plan.service.impl;

import career.plan.domain.Resume;
import career.plan.domain.UserHolder;
import career.plan.dto.ContinueInterviewDTO;
import career.plan.dto.NewInterview;
import career.plan.dto.ResumeData;
import career.plan.dto.user.UserDTO;
import career.plan.dto.interview.RenameInterviewDTO;
import career.plan.service.MemoryAI;
import career.plan.service.ResumeService;
import career.plan.utils.ResumeToString;
import career.plan.vo.Interview.InterviewHistoryDetailVO;
import career.plan.vo.Interview.InterviewHistoryVO;
import career.plan.vo.Result;
import cn.hutool.core.bean.BeanUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import career.plan.domain.Interview;
import career.plan.service.InterviewService;
import career.plan.mapper.InterviewMapper;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.store.memory.chat.ChatMemoryStore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
* @author windows
* @description 针对表【interview】的数据库操作Service实现
* @createDate 2025-05-11 21:09:03
*/
@Service
@RequiredArgsConstructor
@Slf4j
public class InterviewServiceImpl extends ServiceImpl<InterviewMapper, Interview>
    implements InterviewService{
    private final MemoryAI memoryAI;
    private final ResumeService resumeService;
    private static final String FIRST="用户的数据(面试岗位,简历)已提供，请开始面试";
    private final ChatMemoryStore chatMemoryStore;


    @Override
    public Flux<String> startNewInterview(Long memoryId) {
        Interview interview = getById(memoryId);
        Long resumeId = interview.getResumeId();
        String resumeData = getResumeData(resumeId);
        String title = interview.getTitle();
        String jobName = title.substring(0, title.length() - 5);
//        Sinks.Many<String> sink = Sinks.many().unicast().onBackpressureBuffer();
//        StringBuilder combinedResponse = new StringBuilder();


        return memoryAI.startInterview(memoryId,FIRST,jobName,resumeData);
//                                .windowUntil(str -> str.contains("\n") || str.matches(".*[。.!?]$"))
//                .flatMap(Flux::collectList)
//                .map(list -> {
//        // 合并为完整段落并保持JSON结构
//                    return String.join("", list).replace("\\", "\\\\")
//                          .replace("\"", "\\\"")
//                          .replace("\n", "\\n");
//            })
//            .doOnNext(data -> {
//                sink.tryEmitNext(data); // 实时转发给前端
//            })
//            .doOnError(e -> {
//                log.error("处理流时出错", e);
//                sink.tryEmitError(e);
//            })
//            .doOnComplete(sink::tryEmitComplete)
//            .subscribe();
//
//        // 2. 返回给前端的流
//        return sink.asFlux()
//            .doOnCancel(() -> log.warn("用户中断连接，userId: "))
//            .doOnError(e -> log.error("前端流错误", e))
//                ;
    }
    @Override
    public Flux<String> continueInterview(ContinueInterviewDTO continueInterviewDTO) {
//        Sinks.Many<String> sink = Sinks.many().unicast().onBackpressureBuffer();

        return memoryAI.continueInterview(continueInterviewDTO.getMemoryId(),continueInterviewDTO.getAnswer());
//                .windowUntil(str -> str.contains("\n") || str.matches(".*[。.!?]$"))
//                .flatMap(Flux::collectList)
//                .map(list -> {
//        // 合并为完整段落并保持JSON结构
//                    return String.join("", list).replace("\\", "\\\\")
//                          .replace("\"", "\\\"")
//                          .replace("\n", "\\n");
//            })
//            .doOnNext(data -> {
//                sink.tryEmitNext(data); // 实时转发给前端
//            })
//            .doOnError(e -> {
//                log.error("处理流时出错", e);
//                sink.tryEmitError(e);
//            })
//             .doOnComplete(sink::tryEmitComplete)
//            .subscribe();
//
//        // 2. 返回给前端的流
//        return sink.asFlux()
//            .doOnCancel(() -> log.warn("用户中断连接，userId: "))
//            .doOnError(e -> log.error("前端流错误", e));
    }

    @Override
    public Result createInterview(NewInterview newInterview) {
        if(newInterview==null||newInterview.getJobName()==null){
            return Result.fail("选择需要面试的岗位名称!");
        }
        String jobName = newInterview.getJobName();
        UserDTO user = UserHolder.getUser();
        if(user==null) return null;
        Long id = user.getId();
        //创建面试表格数据
        Interview interview = Interview.builder()
                .title(jobName + "的模拟面试")
                .resumeId(newInterview.getResumeId())
                .userId(id).build();
        boolean save = save(interview);
        if(save){
            return Result.ok(interview.getMemoryId());
        }
        return Result.fail("创建面试失败");
    }

    @Override
    public Result getInterview(Long memoryId) {
        //根据memoryId获取详细的面试对话信息
        List<ChatMessage> messages = chatMemoryStore.getMessages(memoryId);
        List<InterviewHistoryDetailVO> interviewHistoryDetailVOS = new ArrayList<>();
        for (ChatMessage message : messages) {
            InterviewHistoryDetailVO interviewHistoryDetailVO = new InterviewHistoryDetailVO();
            if (message instanceof UserMessage) {
                String userText = ((UserMessage) message).singleText();
                interviewHistoryDetailVO.setUser(userText);
            } else if (message instanceof AiMessage) {
                String aiText = ((AiMessage) message).text();
                interviewHistoryDetailVO.setAssistant(aiText);
            }
            //加入集合
            interviewHistoryDetailVOS.add(interviewHistoryDetailVO);
        }
        //删除前2个
        interviewHistoryDetailVOS.remove(0);
//        interviewHistoryDetailVOS.remove(1);
        return Result.ok(interviewHistoryDetailVOS);
    }

    @Override
    public Result getInterviewByUserId(Long id) {
        List<Interview> list = lambdaQuery()
                .eq(Interview::getUserId, id)
                .orderByDesc(Interview::getUpdateTime)
                .list();
        if(list.isEmpty()){
            return Result.ok(Collections.emptyList());
        }
        List<InterviewHistoryVO> interviewHistoryVOS = BeanUtil.copyToList(list, InterviewHistoryVO.class);
        return Result.ok(interviewHistoryVOS);
    }

    @Override
    public Result renameInterview(RenameInterviewDTO renameInterviewDTO) {
        Interview interview = BeanUtil.copyProperties(renameInterviewDTO, Interview.class);
        if (updateById(interview)) {
            return Result.ok();
        }
        return Result.fail("重命名失败");
    }

    @Override
    public Result removeInterviewById(Long memoryId) {
        UserDTO user = UserHolder.getUser();
        if(user==null) return Result.fail("未登录！");

        //删除模拟面试的聊天记录
        boolean remove = lambdaUpdate()
                .eq(Interview::getMemoryId, memoryId)
                .eq(Interview::getUserId, user.getId())
                .remove();

        if(remove){
            chatMemoryStore.deleteMessages(memoryId);
            return Result.ok("删除成功");
        }
        return Result.fail("删除失败！");
    }


    private String getResumeData(Long resumeId){
        if(resumeId==null||resumeId<=0){
            return null;
        }
        Resume resume = resumeService.getById(resumeId);
        String originalText = resume.getOriginalText().toString();
        ResumeData resumeData = JSONUtil.toBean(originalText, ResumeData.class);
        return ResumeToString.formatResumeContent(resumeData);
    }
}




