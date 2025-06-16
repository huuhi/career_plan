package career.plan.service.impl;

import career.plan.domain.UserHolder;
import career.plan.dto.ResumeDTO;
import career.plan.dto.ResumeData;
import career.plan.dto.user.UserDTO;
import career.plan.service.ChatAssistant;
import career.plan.utils.RedisUtil;
import career.plan.utils.ResumeToString;
import career.plan.vo.Result;
import career.plan.vo.ResumeDetailVO;
import career.plan.vo.ResumeVO;
import cn.hutool.core.bean.BeanUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import career.plan.domain.Resume;
import career.plan.service.ResumeService;
import career.plan.mapper.ResumeMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;


import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static career.plan.content.RedisConstant.RESUME_KEY;
import static career.plan.content.RedisConstant.RESUME_TTL;


/**
* @author windows
* @description 针对表【resume(用户简历信息表)】的数据库操作Service实现
* @createDate 2025-04-09 13:13:14
*/
@Service
@Slf4j
@RequiredArgsConstructor
public class ResumeServiceImpl extends ServiceImpl<ResumeMapper, Resume>
    implements ResumeService{
    private final ChatAssistant chatAssistant;
    private final RedisUtil redisUtil;
    @Override
    public Flux<String> analyzeResumeStream(Long resumeId) {
        Resume resume = getById(resumeId);
        UserDTO user = UserHolder.getUser();
        if(resume==null||user==null){
            return null;
        }
        ResumeData resumeData = JSONUtil.toBean((String) resume.getOriginalText(), ResumeData.class);
        String formattedResume = ResumeToString.formatResumeContent(resumeData);
        //????

        // 1. 调用聊天助手获取流式响应
           // 使用 Sink 作为中间处理器
        Sinks.Many<String> sink = Sinks.many().unicast().onBackpressureBuffer();
        StringBuilder combinedResponse = new StringBuilder();

        // 1. 处理原始流数据
        chatAssistant.analyzeResume(formattedResume)
                .windowUntil(str -> str.contains("\n") || str.matches(".*[。.!?]$"))
                .flatMap(Flux::collectList)
                .map(list -> {
        // 合并为完整段落并保持JSON结构
                    return String.join("", list).replace("\\", "\\\\")
                          .replace("\"", "\\\"")
                          .replace("\n", "\\n");
            })
            .doOnNext(data -> {
                combinedResponse.append(data.replace("\\n","\n"));
                sink.tryEmitNext(data); // 实时转发给前端
            })
            .doOnComplete(() -> {
                Mono.defer(() -> {
                        saveCombinedData(user.getId(),resume, combinedResponse.toString());
                        return Mono.empty();
                    })
                    .subscribeOn(Schedulers.boundedElastic())  // 确保在弹性线程池执行
                    .subscribe();

                sink.tryEmitComplete();
            })
            .doOnError(e -> {
                log.error("处理流时出错", e);
                sink.tryEmitError(e);
            })
            .subscribe();

        // 2. 返回给前端的流
        return sink.asFlux()
            .doOnCancel(() -> log.warn("用户中断连接，userId: {}", user.getId()))
            .doOnError(e -> log.error("前端流错误", e));
    }
    @Override
    public Result getByUserId() {
        UserDTO user = UserHolder.getUser();
        if(user==null){
            return Result.fail("用户未登录");
        }
        List<Resume> list = lambdaQuery()
                .eq(Resume::getUserId, user.getId())
                .list();
        //如果没有则返回空集合
        if(list.isEmpty()){
            return Result.ok(Collections.emptyList());
        }
        List<ResumeVO> resumeVOList=new ArrayList<>();
        list.forEach(r->{
//            ResumeData
            ResumeVO resumeVO = BeanUtil.copyProperties(r, ResumeVO.class);
            if(resumeVO.getStructuredData()==null) {
                resumeVO.setStructuredData("你的简历还没有分析记录，点击简历详情开始分析简历吧！");
            }else if(resumeVO.getStructuredData().length()>80){
                resumeVO.setStructuredData(resumeVO.getStructuredData().substring(0, 80)+"...");
            }
            resumeVOList.add(resumeVO);
        });
        return Result.ok(resumeVOList);
    }

    @Override
    public Result updateResume(ResumeDTO resumeDTO) {
        //更新简历
        Long id = resumeDTO.getResumeId();
        Resume resume = getById(id);
        if (resume == null) {
            return Result.fail("简历不存在");
        }
        ResumeData resumeData = resumeDTO.getResumeData();
        String jsonStr = JSONUtil.toJsonStr(resumeData);
        log.debug("简历：{}",jsonStr);
        resume.setResumeName(resumeDTO.getResumeName());
        resume.setOriginalText(jsonStr);
        log.debug("更新简历：{}",resume);

        updateById(resume);

        redisUtil.delCache(RESUME_KEY+id);
        return Result.ok();

    }

    @Override
    public Result saveResume(ResumeDTO resumeData) {
        UserDTO user = UserHolder.getUser();
        if(user==null){
            return Result.fail("用户未登录");
        }
        String resumeJson = JSONUtil.toJsonStr(resumeData.getResumeData());
        log.debug("简历：{}",resumeJson);
        Resume resume = Resume.builder()
                .userId(user.getId())
                .resumeName(resumeData.getResumeName())
                .originalText(resumeJson)
                .build();
        log.debug("保存简历：{}",resume);
        save(resume);
        return Result.ok();

    }

    @Override
    public Result setDefaultResume(Long id) {
        //获取用户id
        UserDTO user = UserHolder.getUser();
        if(user==null){
            return Result.fail("你还没有登录！");
        }
        //先将其他的简历写成0，不默认
        lambdaUpdate()
                .eq(Resume::getUserId, user.getId())
                .set(Resume::getIsDefault, 0)
                .update();
        boolean update = lambdaUpdate()
                .eq(Resume::getId, id)
                .eq(Resume::getUserId,user.getId())
                .set(Resume::getIsDefault, 1)
                .update();

        return Result.ok();

    }

    @Override
    public Result getResumeDataById(Long resumeId) {
        //写缓存
        ResumeDetailVO resumeDetailVO = redisUtil.queryWithMutex(
                RESUME_KEY,
                resumeId,
                ResumeDetailVO.class,
                this::getResumeDetailVO,
                RESUME_TTL,
                TimeUnit.MINUTES
        );
        return Result.ok(resumeDetailVO);
    }
    public ResumeDetailVO getResumeDetailVO(Long resumeId) {
        Resume resume = getById(resumeId);
        String resumeJson = resume.getOriginalText().toString();
        ResumeData resumeData = JSONUtil.toBean(resumeJson, ResumeData.class);
        ResumeDetailVO resumeDetailVO = BeanUtil.copyProperties(resume, ResumeDetailVO.class);
        resumeDetailVO.setResumeData(resumeData);
        return resumeDetailVO;
    }


    private void saveCombinedData(Long userId, Resume resumeData, String combinedResponse) {
        if (userId == null) {
            log.debug("用户未登录，无法保存");
            return;
        }
        log.debug("拼接之后的数据：{}",combinedResponse);
        // 更新ai分析记录
        resumeData.setStructuredData(combinedResponse);
        updateById(resumeData);
        redisUtil.delCache(RESUME_KEY+resumeData.getId());
        log.info("Resume and analysis saved for user: {}", userId);
    }
// 在流完成时处理所有字段的方法
}




