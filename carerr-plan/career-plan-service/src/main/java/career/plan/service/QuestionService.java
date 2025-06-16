package career.plan.service;

import career.plan.domain.Question;
import career.plan.dto.QuestionDTO;
import career.plan.dto.StreamDTO;
import com.baomidou.mybatisplus.extension.service.IService;
import career.plan.vo.Result;


import java.util.List;

/**
* @author windows
* @description 针对表【question(ai分析问题表)】的数据库操作Service
* @createDate 2025-04-10 14:09:17
*/
public interface QuestionService extends IService<Question> {

    Result analyze(List<QuestionDTO> questionDTOList);

    Result recommendedProfession(List<QuestionDTO> questionDTOList);

    Result getAnalyzeReport(Long id);

    Result getAnalyzeByUserId(Long userId,String preKey);

    void getAnalyzeJobData(StreamDTO streamDTO);

    void getAnalyzeMajorsData(StreamDTO streamDTO);
}
