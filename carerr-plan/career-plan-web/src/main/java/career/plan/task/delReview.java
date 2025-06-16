package career.plan.task;

import career.plan.service.ReviewService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/17
 * 说明:
 */
@Component
@Slf4j
public class delReview {
    private  final ReviewService reviewService;

    public delReview(ReviewService reviewService) {
        this.reviewService = reviewService;
    }


    //每天凌晨12点去检查评论
    @Scheduled(cron ="* * 0 * * ? ")
    public void checkReview(){
        reviewService.checkReview();
    }
}
