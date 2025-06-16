package career.plan.service;

import career.plan.domain.Interview;
import career.plan.dto.ContinueInterviewDTO;
import career.plan.dto.NewInterview;
import career.plan.dto.interview.RenameInterviewDTO;
import career.plan.vo.Result;
import com.baomidou.mybatisplus.extension.service.IService;
import reactor.core.publisher.Flux;

/**
* @author windows
* @description 针对表【interview】的数据库操作Service
* @createDate 2025-05-11 21:09:03
*/
public interface InterviewService extends IService<Interview> {

    Flux<String> startNewInterview(Long memoryId);

    Flux<String> continueInterview(ContinueInterviewDTO continueInterviewDTO);

    Result createInterview(NewInterview newInterview);

    Result getInterview(Long memoryId);

    Result getInterviewByUserId(Long id);

    Result renameInterview(RenameInterviewDTO renameInterviewDTO);

    Result removeInterviewById(Long memoryId);
}
