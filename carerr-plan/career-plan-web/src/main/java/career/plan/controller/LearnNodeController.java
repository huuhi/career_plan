package career.plan.controller;

import career.plan.dto.learnDTO.WriteNoteDTO;
import career.plan.service.LearningSkillDetailsService;
import career.plan.vo.Result;
import career.plan.vo.learn.LearningStep;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/15
 * 说明:
 */
@RestController
@RequestMapping("/node")
@RequiredArgsConstructor
public class LearnNodeController {
    private final LearningSkillDetailsService learningSkillDetailsService;

    //根据章节的id获取小结
    @GetMapping("/get/{chapterId}")
    public Result getLearningNode(@PathVariable("chapterId") Long chapterId) {
        return learningSkillDetailsService.getLearningNode(chapterId);
    }

    //标记小结为已完成
    @PutMapping("/complete")
    public Result completeNode(@RequestParam Long nodeId,
                               @RequestParam Long pathId,
                               @RequestParam Long skillId,
                               @RequestParam Long chapterId){
        return learningSkillDetailsService.completeNode(nodeId,pathId,skillId,chapterId);
    }

    //获取进度
    @GetMapping("/get/currentProgress")
    public Result getCurrentProgress(@RequestParam Long pathId,
                                     @RequestParam List<Long> skillIds){
        return learningSkillDetailsService.getcurrentProgress(pathId,skillIds);
    }
    @PutMapping("/write-note")
    public Result writeNote(@RequestBody WriteNoteDTO note){
        return learningSkillDetailsService.writeNode(note);
    }

}
