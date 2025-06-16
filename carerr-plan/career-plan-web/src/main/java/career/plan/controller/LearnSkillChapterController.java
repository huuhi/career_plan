package career.plan.controller;

import career.plan.service.LearningSkillChapterService;
import career.plan.vo.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/15
 * 说明:
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/chapter")
public class LearnSkillChapterController {
    private final LearningSkillChapterService chapterService;

    @GetMapping("/get/{skillId}")
    public Result getChapterDetails(@PathVariable("skillId") Long skillId) {
        if (skillId==null){
            return Result.fail("请输入技能id！");
        }
        return chapterService.getChapterList(skillId);
    }


}
