package career.plan.content;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/5/9
 * 说明: RabbitMQ 的一些常量
 */
public class MQConstant {
//     交换机
    public static final String EXCHANGE="career.direct";

//    生成专业的key以及队列
    public static final String  GENERATE_MAJORS_KEY="g_majors";
    public static final String  MAJORS_QUEUE="majors.queue";

//    生成职业的key以及队列
    public static final String  GENERATE_JOB_KEY="g_job";
    public static final String  JOB_QUEUE="job.queue";

    //生成职业分析
    public static final String GENERATE_ANALYZE_KEY="g_job_analyze";
    public static final String JOB_ANALYZE_QUEUE="job_analyze.queue";
    //生成专业分析
    public static final String GENERATE_MAJORS_ANALYZE_KEY="g_majors_analyze";
    public static final String MAJORS_ANALYZE_QUEUE="majors_analyze.queue";

}
