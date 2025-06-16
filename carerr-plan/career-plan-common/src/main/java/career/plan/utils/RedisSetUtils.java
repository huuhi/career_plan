package career.plan.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/18
 * 说明:
 */
@Component
public class RedisSetUtils {
    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper ;
    public RedisSetUtils(StringRedisTemplate stringRedisTemplate, ObjectMapper objectMapper) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.objectMapper = objectMapper;
    }


    //    删除
    public void delete(String key) {
        stringRedisTemplate.delete(key);
    }

        // 批量删除
    public void deleteBatch(List<String> keys) {
        if (keys == null || keys.isEmpty()) {
            return;
        }
        stringRedisTemplate.delete(keys); // Spring Data Redis 提供的批量删除方法
    }


        /**
     * 向Set中添加元素
     * @param key Redis key
     * @param values 要添加的值
     * @return 添加成功的元素数量
     */
    public Long sAdd(String key, String... values) {
        return stringRedisTemplate.opsForSet().add(key, values);
    }

    /**
     * 从Set中移除元素
     * @param key Redis key
     * @param values 要移除的值
     * @return 移除成功的元素数量
     */
    public Long sRemove(String key, Object... values) {
        return stringRedisTemplate.opsForSet().remove(key, values);
    }

    /**
     * 判断元素是否是Set的成员
     * @param key Redis key
     * @param value 要检查的值
     * @return 是否是成员
     */
    public Boolean sIsMember(String key, Object value) {
        return stringRedisTemplate.opsForSet().isMember(key, value);
    }

    /**
     * 获取Set中的所有成员
     * @param key Redis key
     * @return 所有成员集合
     */
    public Set<String> sMembers(String key) {
        return stringRedisTemplate.opsForSet().members(key);
    }

    /**
     * 获取Set的大小
     * @param key Redis key
     * @return Set的大小
     */
    public Long sSize(String key) {
        return stringRedisTemplate.opsForSet().size(key);
    }
}
