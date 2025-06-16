package career.plan.service.impl;

import career.plan.domain.UserHolder;
import career.plan.dto.ReviewDTO;
import career.plan.dto.user.UserDTO;
import career.plan.utils.RedisSetUtils;
import career.plan.vo.Result;
import career.plan.vo.ReviewVO;
import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.extension.conditions.query.LambdaQueryChainWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import career.plan.domain.Review;
import career.plan.service.ReviewService;
import career.plan.mapper.ReviewMapper;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static career.plan.content.RedisConstant.REPORT_KEY;

/**
* @author windows
* @description 针对表【review(简单评论表)】的数据库操作Service实现
* @createDate 2025-04-16 20:36:39
*/
@Service
@Slf4j
public class ReviewServiceImpl extends ServiceImpl<ReviewMapper, Review>
    implements ReviewService {
    @Resource
    private RedisSetUtils redisSetUtils;

    @Override
    public Result getByMajorsId(Long majorId) {
        return getResult(lambdaQuery().eq(Review::getMajorsId, majorId));
    }

    @Override
    public Result sendReview(ReviewDTO reviewDTO) {
        UserDTO user = UserHolder.getUser();
        if (user == null) {
            return Result.fail("未登录！");
        }
        Review review = BeanUtil.copyProperties(reviewDTO, Review.class);
        review.setUserId(user.getId());
        review.setUsername(user.getUsername());
        boolean save = save(review);
        if(save){
            return Result.ok("评论成功！");
        }else{
            return Result.fail("评论失败！");
        }
    }

    @Override
    public Result getByJobId(Long jobId) {
        return getResult(lambdaQuery().eq(Review::getJobId, jobId));
    }

    @Override
    @Transactional
    public void checkReview() {
//        删除举报次数大于等于3的评论
        List<Review> reviews = lambdaQuery()
                .ge(Review::getReportCount, 3)
                .list();
        if (reviews == null || reviews.isEmpty()) {
            return;
        }
        // 提取评论ID列表
        List<Long> reviewIds = reviews.stream()
                .map(Review::getId)
                .collect(Collectors.toList());
        removeBatchByIds(reviewIds);
            // 批量删除Redis缓存
        redisSetUtils.deleteBatch(List.of(reviewIds.stream()
                .map(id -> REPORT_KEY + id)
                .toArray(String[]::new)));
    }

    @Override
    public Result delReviewById(Long id) {
        UserDTO user = UserHolder.getUser();
        if(user==null){
            return Result.fail("未登录！");
        }
        //添加当前用户的判断
        boolean remove = lambdaUpdate()
                .eq(Review::getId, id)
                .eq(Review::getUserId, user.getId())
                .remove();
        //去删除redis中的数据
        if(remove){
            redisSetUtils.delete(REPORT_KEY+id);
            return  Result.ok("删除成功");
        }else{
            return Result.fail("删除失败");
        }
    }

    @Override
    public Result reportReview(Long reviewId) {
        //首先判断当前用户是否为null
        UserDTO user = UserHolder.getUser();
        if(user==null){
            return Result.fail("未登录！");
        }
        //查看当前用户是否已经举报过此评论
        String key=REPORT_KEY+reviewId;
        Boolean b = redisSetUtils.sIsMember(key, user.getId().toString());
        if(b){
            //用户已经举报过此评论
            return Result.fail("你已经举报过此评论了！");
        }
//         更新成功
        boolean update = update()
                .eq("id", reviewId)
                .setSql("report_count=report_count+1")
                .update();
        if (update) {
            redisSetUtils.sAdd(key, String.valueOf(user.getId()));
            return Result.ok("举报成功！");
        }else{
            return Result.fail("举报失败！");
        }
    }

    private Result getResult(LambdaQueryChainWrapper<Review> eq) {
        List<Review> reviews = eq.list();
        UserDTO user = UserHolder.getUser();
        if(reviews == null|| reviews.isEmpty()){
            return Result.ok(Collections.emptyList());
        }
        List<ReviewVO> reviewVOS = BeanUtil.copyToList(reviews, ReviewVO.class);
        reviewVOS.forEach(r->{
            if(user!=null&& Objects.equals(user.getId(), r.getUserId())){
                r.setIsMe(true);
            }
        });
        return Result.ok(reviewVOS);
    }

}




