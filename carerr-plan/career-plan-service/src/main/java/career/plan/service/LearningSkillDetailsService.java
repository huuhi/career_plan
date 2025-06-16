package career.plan.service;

import career.plan.domain.LearningSkillDetails;
import career.plan.dto.learnDTO.WriteNoteDTO;
import career.plan.vo.Result;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

/**
* @author windows
* @description 针对表【learning_skill_details(学习技能详细章节表)】的数据库操作Service
* @createDate 2025-04-09 14:06:20
*/
public interface LearningSkillDetailsService extends IService<LearningSkillDetails> {

    Result getLearningNode(Long chapterId);

    Result completeNode(Long nodeId, Long pathId, Long skillId,Long chapterId);

    Result getcurrentProgress(Long pathId, List<Long> skillIds);

    Result writeNode(WriteNoteDTO note);
}
