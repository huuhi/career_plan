package career.plan.service;

import career.plan.domain.LearningSkillChapter;
import career.plan.vo.Result;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author windows
* @description 针对表【learning_skill_chapter(学习技能详细章节表)】的数据库操作Service
* @createDate 2025-04-13 11:35:43
*/
public interface LearningSkillChapterService extends IService<LearningSkillChapter> {

    Result getChapterList(Long skillId);
}
