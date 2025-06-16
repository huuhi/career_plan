package career.plan.controller;

import career.plan.domain.UserHolder;
import career.plan.dto.ContinueInterviewDTO;
import career.plan.dto.NewInterview;
import career.plan.dto.user.UserDTO;
import career.plan.dto.interview.RenameInterviewDTO;
import career.plan.service.InterviewService;
import career.plan.vo.Result;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.time.Duration;
/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/5/11
 * 说明:  AI 模拟面试控制器
 */

@RestController
@RequestMapping("/interview")
@Slf4j
@RequiredArgsConstructor
public class InterviewController {
    private final  InterviewService interviewService;
    @PostMapping(value = "/new/{memoryId}",produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> startInterview(@PathVariable Long memoryId) {

        return interviewService.startNewInterview(memoryId);
//                .map(json -> "{\"data\":\"" + json + "\"}")
//                .timeout(Duration.ofSeconds(30)); // 防止长时间无响应

    }
    @PostMapping(value = "/continue",produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> startInterview(@RequestBody ContinueInterviewDTO continueInterviewDTO) {
        return interviewService.continueInterview(continueInterviewDTO);
//                .map(json -> "{\"data\":\"" + json + "\"}")
//                .timeout(Duration.ofSeconds(30)); // 防止长时间无响应;
    }
    @PostMapping("/new")
    public Result CreateInterview(@RequestBody NewInterview newInterview) {
        return interviewService.createInterview(newInterview);
    }
    @GetMapping("/getDetail/{memoryId}")
    public Result getInterview(@PathVariable Long memoryId) {
        return interviewService.getInterview(memoryId);
    }

    @GetMapping("/getByUserId")
    public Result getInterviewByUserId() {
        //先判断当前用户是否为null
        UserDTO user = UserHolder.getUser();
        if(user==null) return Result.fail("未登录！");
        return interviewService.getInterviewByUserId(user.getId());
    }
    //重命名聊天记录标题
    @PutMapping("/rename")
    public Result renameInterview(@RequestBody RenameInterviewDTO  renameInterviewDTO) {
        return interviewService.renameInterview(renameInterviewDTO);
    }

    //删除
    @DeleteMapping("/delete/{memoryId}")
    public Result deleteInterview(@PathVariable Long memoryId) {
        return interviewService.removeInterviewById(memoryId);
    }


}
