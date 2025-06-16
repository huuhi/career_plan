package career.plan.service;

import career.plan.domain.Review;
import career.plan.dto.ReviewDTO;
import career.plan.vo.Result;
import com.baomidou.mybatisplus.extension.service.IService;

/**
* @author windows
* @description 针对表【review(简单评论表)】的数据库操作Service
* @createDate 2025-04-16 20:36:39
*/
public interface ReviewService extends IService<Review> {

    Result getByMajorsId(Long majorId);

    Result sendReview(ReviewDTO review);

    Result getByJobId(Long jobId);

    void checkReview();

    Result delReviewById(Long id);

    Result reportReview(Long reviewId);
}
