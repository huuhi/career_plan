package career.plan.controller;

import career.plan.domain.UserHolder;
import career.plan.dto.GenerateJobDTO;
import career.plan.dto.user.UserDTO;
import career.plan.service.JobsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import career.plan.vo.Result;
/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/11
 * 说明:
 */
@RestController
@RequestMapping("/job")
@RequiredArgsConstructor
public class JobController {
    private final JobsService jobService;

    @GetMapping("/get/{id}")
    public Result getJobDetailById(@PathVariable("id") Integer id){
        return jobService.getDetailJobById(id);
    }
//    分页获取职位信息（前端需要下拉刷新）
    @GetMapping("/get/page")
    public Result getJobPage(@RequestParam(defaultValue = "1") Integer pageNum,
                             @RequestParam(defaultValue = "20") Integer pageSize){
        return  jobService.getJobPage(pageNum,pageSize);
    }

    //搜索
    @GetMapping("/search")
    public Result searchJob(@RequestParam(defaultValue = "1") Integer pageNum,
                            @RequestParam(defaultValue = "20") Integer pageSize,
                            @RequestParam(defaultValue = "") String title) {
        return jobService.searchJob(pageNum, pageSize, title);
    }
    //根据职位类型获取职位信息
    @GetMapping("/getByType")
    public Result getJobPageByType(@RequestParam(defaultValue = "1") Integer pageNum,
                                  @RequestParam(defaultValue = "20") Integer pageSize,
                                  @RequestParam() Integer type) {
        return jobService.getJobPageByType(pageNum, pageSize, type);
    }
    @PostMapping("/generateJob")
    public Result generateJob(@RequestBody GenerateJobDTO jobDTO){
//        UserMessage userMessage = UserMessage.userMessage("你好");
        UserDTO user = UserHolder.getUser();
        if(user!=null){
            jobDTO.setUserId(user.getId());
        }
        return jobService.generateJob(jobDTO);
    }
    // 返回使用的职位名称
    @GetMapping("/getJobName")
    public Result getJobName(@RequestParam(defaultValue = "") String title){
        return jobService.getJobName(title);
    }

}
