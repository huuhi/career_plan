package career.plan.controller;

import career.plan.domain.UserHolder;
import career.plan.dto.QuestionDTO;
import career.plan.dto.user.UserDTO;
import career.plan.service.QuestionService;
import career.plan.vo.Result;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static career.plan.content.RedisConstant.USER_ANALYZE_JOB_KEY;
import static career.plan.content.RedisConstant.USER_ANALYZE_MAJORS_KEY;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/10
 * 说明:
 */
@RestController
@RequestMapping("/analyzeQuestion")
public class AnalyzeQuestionController {
    @Resource
    private QuestionService questionService;
    @PostMapping("/job")
    public Result analyzeQuestion(
            @RequestBody List<QuestionDTO> questionDTOList) {
        // 根据用户的回答，推荐职位
        return questionService.analyze(questionDTOList);
    }
    //根据用户回答的一些问题推荐专业（面向需要选择专业的学生）
    @PostMapping("/profession")
    public Result analyzeProfession(@RequestBody List<QuestionDTO> questionDTOList) {
        // 根据用户的回答，推荐专业
        return questionService.recommendedProfession(questionDTOList);
    }
    //根据id获取分析报告
    @GetMapping("/report/{id}")
    public Result getAnalyzeReport(@PathVariable("id") Long id) {
        // 根据用户的回答，推荐职位
        return questionService.getAnalyzeReport(id);
    }
    //获取用户的职位分析
    @GetMapping("/getJob")
    public Result getJobAnalyzeById() {
        // 根据用户的id获取分析
        UserDTO user = UserHolder.getUser();
        if(user==null){
            return Result.fail("用户未登录");
        }
        return questionService.getAnalyzeByUserId(user.getId(),USER_ANALYZE_JOB_KEY);
    }
    //获取用户的专业分析
    @GetMapping("/getMajors")
    public Result getMajorsAnalyzeById() {
        // 根据用户的id获取分析
        UserDTO user = UserHolder.getUser();
        if(user==null){
            return Result.fail("用户未登录");
        }
        return questionService.getAnalyzeByUserId(user.getId(),USER_ANALYZE_MAJORS_KEY);
    }
}
