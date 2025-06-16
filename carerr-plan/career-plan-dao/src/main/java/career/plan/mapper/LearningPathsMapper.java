package career.plan.mapper;

import career.plan.domain.LearningPaths;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
* @author windows
* @description 针对表【leanring_paths(用户学习路径表)】的数据库操作Mapper
* @createDate 2025-04-13 11:35:16
* @Entity career.plan.domain.LeanringPaths
*/
public interface LearningPathsMapper extends BaseMapper<LearningPaths> {

}




