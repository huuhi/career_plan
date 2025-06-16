package career.plan.controller;

import career.plan.domain.UserHolder;
import career.plan.dto.user.UserDTO;
import career.plan.service.LearningPathsService;
import career.plan.vo.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/13
 * 说明:生成学习路径
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/learn-path")
public class LearnPathController {
    private final LearningPathsService learningPathsService;

    //目标是某个工作，生成学习路径
    @PostMapping("/generate-jobPath")
    public Result generateLearningJobPaths(@RequestParam Long jobId){
        return learningPathsService.generateLearningPaths(jobId, "jobId");
    }
    //学习某个专业，生成学习路径
    @PostMapping("/generate-majorPath")
    public Result generateLearningMajorPaths(@RequestParam Long majorsId){
        return learningPathsService.generateLearningPaths(majorsId, "majorsId");
    }
    //根据学习路径id，获取学习路径的信息
    @GetMapping("/get/{id}")
    public Result getLearningPaths(@PathVariable Long id){
        return learningPathsService.getLearningPaths(id);
    }
    @GetMapping("/getAll")
    public Result getLearningPaths(){
        UserDTO user = UserHolder.getUser();
        if(user==null){
            return Result.fail("你还没有登录！");
        }
        return learningPathsService.getAllPath(user.getId());
    }
    //删除学习路径
    @DeleteMapping("/{pathId}")
    public Result deleteLearningPaths(@PathVariable Long pathId){
        return learningPathsService.deleteLearningPaths(pathId);
    }

}
