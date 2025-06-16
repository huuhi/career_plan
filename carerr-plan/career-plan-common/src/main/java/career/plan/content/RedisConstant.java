package career.plan.content;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/3/21
 * 说明:
 */
public class RedisConstant {
    public static final long LOCK_TTL=5L;
    public static final long CACHE_NULL_TTL=2L;
    public static final String LOCK_KEY="lock:";


    public static final String JOB_QUESTION_KEY="job.question.stream";
    public static final String JOB_QUESTION_GROUP="job-group";
    public static final String MAJORS_QUESTION_KEY="majors.question.stream";
    public static final String MAJORS_QUESTION_GROUP="majors-group";

    public static final String GENERATE_LEARNING_KEY="learn.path.stream";
    public static final String LEARN_STREAM_KEY="learn.stream";
    public static final String LEARN_GROUP_KEY="lc1";


    public static final String GENERATE_LEARNING_GROUP="learn_group";


    public static final String USER_ANALYZE_JOB_KEY="user:analyze:job:";
    public static final String USER_ANALYZE_MAJORS_KEY="user:analyze:majors:";

    public static final String RESUME_KEY="resume:";
    public static final long RESUME_TTL=10L;


    public static final String JOB_KEY="job:";
    public static final long JOB_TTL=20L;
    public static final String MAJORS_KEY="majors:";
    public static final long MAJORS_TTL=20L;

    //记录总节点以及章节下的节点
    public static final String LEARNING_NODE_COUNT="learn:path:";

    public static final String REPORT_KEY="review:report:";


}
