package career.plan.service.impl;

import career.plan.dto.GenerateMajorsDTO;
import career.plan.eum.DisciplineCategory;
import career.plan.service.ChatAssistant;
import career.plan.util.SendMessageUtil;
import career.plan.utils.RedisUtil;
import career.plan.utils.RegexUtils;
import career.plan.vo.MajorsDetailVO;
import career.plan.vo.MajorsVO;
import career.plan.vo.Result;
import career.plan.webSocket.WebSocketService;
import cn.hutool.core.bean.BeanUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import career.plan.domain.Majors;
import career.plan.service.MajorsService;
import career.plan.mapper.MajorsMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static career.plan.content.MQConstant.EXCHANGE;
import static career.plan.content.MQConstant.GENERATE_MAJORS_KEY;
import static career.plan.content.RedisConstant.MAJORS_KEY;
import static career.plan.content.RedisConstant.MAJORS_TTL;

/**
* @author windows
* @description 针对表【majors(专业信息表)】的数据库操作Service实现
* @createDate 2025-04-11 10:18:17
*/
@Service
@RequiredArgsConstructor
@Slf4j
public class MajorsServiceImpl extends ServiceImpl<MajorsMapper, Majors>
    implements MajorsService{
    private final RedisUtil redisUtil;
    private final SendMessageUtil rabbitUtil;
    private final ChatAssistant chatAssistant;
    private final WebSocketService webSocketService;


    @Override
    public Result getDetailMajorsById(Integer id) {
        MajorsDetailVO majorsDetailVO = redisUtil.queryWithPassThrough(
                MAJORS_KEY,
                id,
                MajorsDetailVO.class,
                this::getMajorsDetailVO,
                MAJORS_TTL,
                TimeUnit.MINUTES
        );
        if(majorsDetailVO==null){
            return Result.fail("专业不存在");
        }

        return Result.ok(majorsDetailVO);
    }

    @Override
    public Result getMajorsPage(Integer pageNum, Integer pageSize) {
        return getMajorsPage(pageNum,pageSize,null,null);
    }

    @Override
    public Result searchMajors(Integer pageNum, Integer pageSize, String title) {
        return getMajorsPage(pageNum,pageSize,title,null);
    }

    @Override
    public Result getMajorsPageByType(Integer pageNum, Integer pageSize, Integer type) {
        return getMajorsPage(pageNum,pageSize,null,type);

    }

    @Override
    public Result generateMajors(GenerateMajorsDTO majorsDTO) {
        //应该去查看这个专业在不在 数据库中，如果存在则不去生成
        int exist = isExist(majorsDTO.getMajorsName());
        if(exist!=-1){
            // 如果存在则返回专业的id
            return Result.ok(exist);
        }
        //添加到消息队列中去生成
//        rabbitTemplate.convertAndSend();
        rabbitUtil.sendMessage(EXCHANGE,GENERATE_MAJORS_KEY,majorsDTO);
        return Result.ok();
    }

    @Override
    public void generateMajorsByAI(GenerateMajorsDTO majorsDTO) {
        // 请求AI，生成专业,将Java对象转换为JSON字符串
        Long userId = majorsDTO.getUserId();
        log.debug("收到：{}",majorsDTO);
        String jsonStr = JSONUtil.toJsonStr(majorsDTO);
        //生成的专业数据
        String majors = chatAssistant.generateMajors(jsonStr);
        log.debug("专业详细记录（JSON格式）:{}",majors);
        majors=RegexUtils.cleanJsonResponse(majors);
        Map<String,Long> map=new HashMap<>();
        if(majors.equals("false")){
            //如果用户id为null，不需要发送websocket消息
            if(userId==null){
                return;
            }
            //说明生成失败，用户提供的信息有问题
            map.put("id",-1L);
            map.put("type",0L);
            String message = JSONUtil.toJsonStr(map);
            webSocketService.sendToClient(String.valueOf(userId),message);
            return;
        }
        //转换成Java对象,直接保存即可
        Majors goalMajors = JSONUtil.toBean(majors, Majors.class);
        save(goalMajors);
        if(userId!=null){
            map.put("id",goalMajors.getId().longValue());
            map.put("type",4L);
            webSocketService.sendToClient(String.valueOf(userId),JSONUtil.toJsonStr(map));
        }
    }

    private int isExist(String majorsName) {
        //去数据库查询
        Majors majors = query()
                .eq("title", majorsName)
                .one();
        return majors==null? -1:majors.getId();
    }

    private Result getMajorsPage(Integer pageNum, Integer pageSize, String title, Integer typeCode) {
                //只需要获取基本的信息MajorsVO
        Page<Majors> majorsPage = lambdaQuery()
                .like(title!=null,Majors::getTitle,title)
                .eq(typeCode!=null&&typeCode>0,Majors::getType,typeCode)
                .page(new Page<>(pageNum, pageSize));
        List<Majors> records = majorsPage.getRecords();
        List<MajorsVO> majorsVOS = BeanUtil.copyToList(records, MajorsVO.class);
        //
        for(int i=0;i<majorsVOS.size();i++){
            MajorsVO majorsVO = majorsVOS.get(i);
            Short type = records.get(i).getType();
            majorsVO.setType(DisciplineCategory.getNameByCode(type));
            if(majorsVO.getDescription().length()>50){
                majorsVO.setDescription(majorsVO.getDescription().substring(0,50)+"...");
            }
        }
        return Result.ok(majorsVOS,majorsPage.getTotal());
    }

    private MajorsDetailVO getMajorsDetailVO(Integer id){
        Majors majors = getById(id);
        if(majors==null){
            return null;
        }
        MajorsDetailVO majorsDetailVO = BeanUtil.copyProperties(majors, MajorsDetailVO.class);
        majorsDetailVO.setCoreCourses(majors.getCoursesList());
        majorsDetailVO.setPracticalTraining(majors.getPracticeList());
        majorsDetailVO.setType(DisciplineCategory.getNameByCode(majors.getType()));

        return majorsDetailVO;
    }
}




