package career.plan.service;

import career.plan.domain.Jobs;
import career.plan.dto.GenerateJobDTO;
import career.plan.dto.GenerateMajorsDTO;
import career.plan.vo.Result;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author windows
* @description 针对表【jobs(职位信息表)】的数据库操作Service
* @createDate 2025-04-09 14:06:34
*/
public interface JobsService extends IService<Jobs> {

    Result getDetailJobById(Integer id);

    Result getJobPage(Integer pageNum, Integer pageSize);

    Result searchJob(Integer pageNum, Integer pageSize, String title);

    Result getJobPageByType(Integer pageNum, Integer pageSize, Integer type);

    Result generateJob(GenerateJobDTO jobDTO);

    void generateJobByAI(GenerateJobDTO jobDTO);

    Result getJobName(String name);
}
