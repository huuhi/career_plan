package career.plan.controller;

import career.plan.domain.Review;
import career.plan.dto.ReviewDTO;
import career.plan.service.ReviewService;
import career.plan.vo.Result;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/16
 * 说明:
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/review")
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/send")
    public Result sendReview(@RequestBody ReviewDTO review ) {
        return reviewService.sendReview(review);
    }
    @PutMapping("/report/{reviewId}")
    public Result reportReview(@PathVariable Long reviewId) {
        return reviewService.reportReview(reviewId);
    }
    //根据专业id获取评论
    @GetMapping("/getReviewByMajorsId/{majorId}")
    public Result getReviewsByMajorId(@PathVariable Long majorId) {
        return reviewService.getByMajorsId(majorId);
    }
    @GetMapping("/getReviewByJobId/{jobId}")
    public Result getReviewsByJobId(@PathVariable Long jobId) {
        return reviewService.getByJobId(jobId);
    }

    @DeleteMapping("/del/{id}")
    public Result deleteReview(@PathVariable Long id){
        return reviewService.delReviewById(id);
    }
}
