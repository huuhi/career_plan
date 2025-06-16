package career.plan.service;

import career.plan.domain.LearningPaths;
import career.plan.dto.GenerateStreamDTO;
import career.plan.vo.Result;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author windows
* @description 针对表【leanring_paths(用户学习路径表)】的数据库操作Service
* @createDate 2025-04-09 14:05:56
*/
public interface LearningPathsService extends IService<LearningPaths> {

    Result generateLearningPaths(Long goalId,String type);

    Result getLearningPaths(Long id);

    void generateLearningPathById(GenerateStreamDTO generateStreamDTO);

    Result getAllPath(Long userId);

    Result deleteLearningPaths(Long pathId);
}
