package career.plan.service;

import career.plan.domain.Resume;
import career.plan.dto.ResumeDTO;
import career.plan.dto.ResumeData;
import career.plan.vo.Result;
import com.baomidou.mybatisplus.extension.service.IService;
import reactor.core.publisher.Flux;

/**
* @author windows
* @description 针对表【resume(用户简历信息表)】的数据库操作Service
* @createDate 2025-04-09 13:13:14
*/
public interface ResumeService extends IService<Resume> {


    Flux<String> analyzeResumeStream(Long resumeId);

    Result getByUserId();

    Result updateResume(ResumeDTO resumeDTO);

    Result saveResume(ResumeDTO resumeData);

    Result setDefaultResume(Long id);

    Result getResumeDataById(Long resumeId);
}
