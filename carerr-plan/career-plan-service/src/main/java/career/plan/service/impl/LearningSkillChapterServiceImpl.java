package career.plan.service.impl;

import career.plan.vo.Result;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import career.plan.domain.LearningSkillChapter;
import career.plan.service.LearningSkillChapterService;
import career.plan.mapper.LearningSkillChapterMapper;
import org.springframework.stereotype.Service;

import java.util.List;

/**
* @author windows
* @description 针对表【learning_skill_chapter(学习技能详细章节表)】的数据库操作Service实现
* @createDate 2025-04-13 11:35:43
*/
@Service
public class LearningSkillChapterServiceImpl extends ServiceImpl<LearningSkillChapterMapper, LearningSkillChapter>
    implements LearningSkillChapterService{

    @Override
    public Result getChapterList(Long skillId) {
        List<LearningSkillChapter> skillChapters = lambdaQuery()
                .eq(LearningSkillChapter::getSkillId, skillId)
                .orderByAsc(LearningSkillChapter::getChapterOrder)
                .list();
        return Result.ok(skillChapters);
    }
}




