package career.plan.controller;

import career.plan.domain.Resume;
import career.plan.domain.UserHolder;
import career.plan.dto.ResumeDTO;
import career.plan.dto.user.UserDTO;
import career.plan.service.ResumeService;
import career.plan.vo.Interview.ResumeIdAndNameVO;
import career.plan.vo.Result;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.util.List;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/9
 * 说明:简历controller
 */
@RestController
@RequestMapping("/resume")
@Slf4j
public class ResumeController {
    @Resource
    private ResumeService resumeService;

    //获取简历，然后用ai分析简历，将分析之后的数据返回
    // 获取简历，然后用AI流式分析简历
    @PostMapping(value = "/send/{resumeId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> sendResume(@PathVariable("resumeId") Long resumeId) {
//        TODO 之后需要添加消息队列给出职位推荐...
        return resumeService.analyzeResumeStream(resumeId)
                .map(json -> "{\"data\":\"" + json + "\"}")
                .timeout(Duration.ofSeconds(30)) // 防止长时间无响应
                .onErrorResume(e -> {
                    log.debug("连接中止: " + e.getMessage());
                    return Flux.just("{\"data\":\"" + "已停止" + "\"}");
                });
    }
    //获取当前登录用户的基本简历信息
    @GetMapping("/get")
    public Result getResumeByUserId() {
        log.debug("获取当前用户的简历:");
        return resumeService.getByUserId();
    }
    //更新简历
    @PutMapping("/update")
    public Result updateResume(@RequestBody ResumeDTO resumeDTO) {
        return resumeService.updateResume(resumeDTO);
    }
    @PostMapping("/save")
    public Result saveResume(@RequestBody ResumeDTO resumeData) {
        return resumeService.saveResume(resumeData);
    }
    //设置某个简历为默认简历
    @PutMapping("/setDefault")
    public Result setDefaultResume(@RequestParam Long id) {
        return resumeService.setDefaultResume(id);
    }
    //根据简历id获取简历详细数据
    @GetMapping("/get/{resumeId}")
    public Result getResumeData(@PathVariable("resumeId") Long resumeId) {
        return resumeService.getResumeDataById(resumeId);
    }
    @DeleteMapping("/del/{id}")
    public Result delResume(@PathVariable("id") Long id) {
        UserDTO user = UserHolder.getUser();
        if(user==null){
            return Result.fail("未登录");
        }
         resumeService
                .lambdaUpdate()
                .eq(Resume::getUserId, user.getId())
                .eq(Resume::getId, id)
                .remove();
        return Result.ok("删除成功");
    }
    @GetMapping("/getIdAndName")
    public Result getResumeIdAndName() {
        UserDTO user = UserHolder.getUser();
        if(user==null){
            return Result.fail("未登录");
        }
        List<ResumeIdAndNameVO> resumeIdAndNameVOS = resumeService.lambdaQuery()
                .eq(Resume::getUserId, user.getId())
                .select(Resume::getId, Resume::getResumeName)
                .list()
                .stream()
                .map(resume -> new ResumeIdAndNameVO(resume.getId(), resume.getResumeName())).toList();
        return Result.ok(resumeIdAndNameVOS);
    }


}
