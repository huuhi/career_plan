package career.plan.service;

import career.plan.domain.Majors;
import career.plan.dto.GenerateMajorsDTO;
import career.plan.vo.Result;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author windows
* @description 针对表【majors(专业信息表)】的数据库操作Service
* @createDate 2025-04-11 10:18:17
*/
public interface MajorsService extends IService<Majors> {

    Result getDetailMajorsById(Integer id);

    Result getMajorsPage(Integer pageNum, Integer pageSize);

    Result searchMajors(Integer pageNum, Integer pageSize, String title);

    Result getMajorsPageByType(Integer pageNum, Integer pageSize, Integer type);

    Result generateMajors(GenerateMajorsDTO majorsDTO);

    void generateMajorsByAI(GenerateMajorsDTO majorsDTO);
}
