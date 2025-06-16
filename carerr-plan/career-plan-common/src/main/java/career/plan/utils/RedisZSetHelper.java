package career.plan.utils;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.concurrent.TimeUnit;

@Component
public class RedisZSetHelper {
    private final StringRedisTemplate stringRedisTemplate;

    public RedisZSetHelper(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    /**
     * 向ZSet中添加元素
     * @param key Redis key
     * @param value 元素值
     * @param score 分数
     * @return 是否添加成功
     */
    public Boolean zAdd(String key, String value, double score) {
        return stringRedisTemplate.opsForZSet().add(key, value, score);
    }

    /**
     * 批量向ZSet中添加元素
     * @param key Redis key
     * @param tuples 元素集合(值+分数)
     * @return 添加成功的元素数量
     */
    public Long zAdd(String key, Set<ZSetOperations.TypedTuple<String>> tuples) {
        return stringRedisTemplate.opsForZSet().add(key, tuples);
    }

    /**
     * 从ZSet中移除元素
     * @param key Redis key
     * @param values 要移除的值
     * @return 移除的元素数量
     */
    public Long zRemove(String key, Object... values) {
        return stringRedisTemplate.opsForZSet().remove(key, values);
    }

    /**
     * 增加元素的分数
     * @param key Redis key
     * @param value 元素值
     * @param delta 增加的分数
     * @return 增加后的新分数
     */
    public Double zIncrementScore(String key, String value, double delta) {
        return stringRedisTemplate.opsForZSet().incrementScore(key, value, delta);
    }

    /**
     * 获取元素的分数
     * @param key Redis key
     * @param value 元素值
     * @return 分数
     */
    public Double zScore(String key, String value) {
        return stringRedisTemplate.opsForZSet().score(key, value);
    }

    /**
     * 获取元素的排名(按分数从小到大排序)
     * @param key Redis key
     * @param value 元素值
     * @return 排名(从0开始)，不存在返回null
     */
    public Long zRank(String key, String value) {
        return stringRedisTemplate.opsForZSet().rank(key, value);
    }

    /**
     * 获取元素的排名(按分数从大到小排序)
     * @param key Redis key
     * @param value 元素值
     * @return 排名(从0开始)，不存在返回null
     */
    public Long zReverseRank(String key, String value) {
        return stringRedisTemplate.opsForZSet().reverseRank(key, value);
    }

    /**
     * 获取ZSet的大小
     * @param key Redis key
     * @return 元素数量
     */
    public Long zSize(String key) {
        return stringRedisTemplate.opsForZSet().size(key);
    }

    /**
     * 获取ZSet中分数在[min,max]之间的元素数量
     * @param key Redis key
     * @param min 最小分数
     * @param max 最大分数
     * @return 元素数量
     */
    public Long zCount(String key, double min, double max) {
        return stringRedisTemplate.opsForZSet().count(key, min, max);
    }

    /**
     * 按分数从小到大获取范围内的元素
     * @param key Redis key
     * @param start 开始位置(包含)
     * @param end 结束位置(包含)
     * @return 元素集合
     */
    public Set<String> zRange(String key, long start, long end) {
        return stringRedisTemplate.opsForZSet().range(key, start, end);
    }

    /**
     * 按分数从小到大获取范围内的元素(带分数)
     * @param key Redis key
     * @param start 开始位置(包含)
     * @param end 结束位置(包含)
     * @return 元素及分数集合
     */
    public Set<ZSetOperations.TypedTuple<String>> zRangeWithScores(String key, long start, long end) {
        return stringRedisTemplate.opsForZSet().rangeWithScores(key, start, end);
    }

    /**
     * 按分数从大到小获取范围内的元素
     * @param key Redis key
     * @param start 开始位置(包含)
     * @param end 结束位置(包含)
     * @return 元素集合
     */
    public Set<String> zReverseRange(String key, long start, long end) {
        return stringRedisTemplate.opsForZSet().reverseRange(key, start, end);
    }

    /**
     * 按分数从大到小获取范围内的元素(带分数)
     * @param key Redis key
     * @param start 开始位置(包含)
     * @param end 结束位置(包含)
     * @return 元素及分数集合
     */
    public Set<ZSetOperations.TypedTuple<String>> zReverseRangeWithScores(String key, long start, long end) {
        return stringRedisTemplate.opsForZSet().reverseRangeWithScores(key, start, end);
    }

    /**
     * 按分数范围从小到大获取元素
     * @param key Redis key
     * @param min 最小分数
     * @param max 最大分数
     * @return 元素集合
     */
    public Set<String> zRangeByScore(String key, double min, double max) {
        return stringRedisTemplate.opsForZSet().rangeByScore(key, min, max);
    }

    /**
     * 按分数范围从小到大获取元素(带分数)
     * @param key Redis key
     * @param min 最小分数
     * @param max 最大分数
     * @return 元素及分数集合
     */
    public Set<ZSetOperations.TypedTuple<String>> zRangeByScoreWithScores(String key, double min, double max) {
        return stringRedisTemplate.opsForZSet().rangeByScoreWithScores(key, min, max);
    }

    /**
     * 按分数范围从大到小获取元素
     * @param key Redis key
     * @param min 最小分数
     * @param max 最大分数
     * @return 元素集合
     */
    public Set<String> zReverseRangeByScore(String key, double min, double max) {
        return stringRedisTemplate.opsForZSet().reverseRangeByScore(key, min, max);
    }

    /**
     * 按分数范围从大到小获取元素(带分数)
     * @param key Redis key
     * @param min 最小分数
     * @param max 最大分数
     * @return 元素及分数集合
     */
    public Set<ZSetOperations.TypedTuple<String>> zReverseRangeByScoreWithScores(String key, double min, double max) {
        return stringRedisTemplate.opsForZSet().reverseRangeByScoreWithScores(key, min, max);
    }

    /**
     * 移除排名在[start,end]之间的元素
     * @param key Redis key
     * @param start 开始排名
     * @param end 结束排名
     * @return 移除的元素数量
     */
    public Long zRemoveRange(String key, long start, long end) {
        return stringRedisTemplate.opsForZSet().removeRange(key, start, end);
    }

    /**
     * 移除分数在[min,max]之间的元素
     * @param key Redis key
     * @param min 最小分数
     * @param max 最大分数
     * @return 移除的元素数量
     */
    public Long zRemoveRangeByScore(String key, double min, double max) {
        return stringRedisTemplate.opsForZSet().removeRangeByScore(key, min, max);
    }

    /**
     * 设置ZSet的过期时间
     * @param key Redis key
     * @param timeout 过期时间
     * @param unit 时间单位
     * @return 是否设置成功
     */
    public Boolean zExpire(String key, long timeout, TimeUnit unit) {
        return stringRedisTemplate.expire(key, timeout, unit);
    }

    /**
     * 删除ZSet
     * @param key Redis key
     * @return 是否删除成功
     */
    public Boolean zDelete(String key) {
        return stringRedisTemplate.delete(key);
    }

    /**
     * 计算两个ZSet的并集并存储到新的ZSet中
     * @param destKey 目标ZSet的key
     * @param key1 第一个ZSet的key
     * @param key2 第二个ZSet的key
     * @return 新ZSet的元素数量
     */
    public Long zUnionAndStore(String destKey, String key1, String key2) {
        return stringRedisTemplate.opsForZSet().unionAndStore(key1, key2, destKey);
    }

    /**
     * 计算两个ZSet的交集并存储到新的ZSet中
     * @param destKey 目标ZSet的key
     * @param key1 第一个ZSet的key
     * @param key2 第二个ZSet的key
     * @return 新ZSet的元素数量
     */
    public Long zIntersectAndStore(String destKey, String key1, String key2) {
        return stringRedisTemplate.opsForZSet().intersectAndStore(key1, key2, destKey);
    }
}