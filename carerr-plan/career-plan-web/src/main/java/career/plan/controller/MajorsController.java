package career.plan.controller;

import career.plan.domain.UserHolder;
import career.plan.dto.GenerateMajorsDTO;
import career.plan.dto.user.UserDTO;
import career.plan.service.MajorsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import career.plan.vo.Result;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/11
 * 说明:专业业务层
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/major")
public class MajorsController {
    private final MajorsService majorsService;

    @GetMapping("/get/{id}")
    public Result getDetailMajorsById(@PathVariable("id") Integer id){
        return majorsService.getDetailMajorsById(id);
    }
    //分页查询，在前端需要下拉刷新
    @GetMapping("/get/page")
    public Result getMajorsPage(@RequestParam(defaultValue = "1") Integer pageNum,
                                @RequestParam(defaultValue = "20") Integer pageSize){
        return majorsService.getMajorsPage(pageNum, pageSize);
    }
    @GetMapping("/search")
    public Result searchMajors(@RequestParam(defaultValue = "1") Integer pageNum,
                               @RequestParam(defaultValue = "20") Integer pageSize,
                               @RequestParam(defaultValue = "") String title){
        return majorsService.searchMajors(pageNum, pageSize, title);
    }
    @GetMapping("/getByType")
    public Result getMajorsByType(@RequestParam(defaultValue = "1") Integer pageNum,
                                  @RequestParam(defaultValue = "20") Integer pageSize,
                                  @RequestParam() Integer type){
        return majorsService.getMajorsPageByType(pageNum,pageSize,type);
    }
    //根据用户输入的职位名称去生成信息
    @PostMapping("/generateMajors")
    public Result generateMajors(@RequestBody GenerateMajorsDTO majorsDTO){
        //获取当前线程的用户（也就是请求生成的用户）
        UserDTO user = UserHolder.getUser();
        if(user!=null){
            majorsDTO.setUserId(user.getId());
        }
        return majorsService.generateMajors(majorsDTO);
    }
}
