package career.plan.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.concurrent.TimeUnit;

@Component
public class RedisObjectHelper {
    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    public RedisObjectHelper(StringRedisTemplate stringRedisTemplate, ObjectMapper objectMapper) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.objectMapper = objectMapper;
    }

    public <T> void setObject(String key, T obj, long ttl, TimeUnit unit) {
        try {
            String json = objectMapper.writeValueAsString(obj);
            stringRedisTemplate.opsForValue().set(key, json, ttl, unit);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("序列化失败", e);
        }
    }

    public <T> T getObject(String key, Class<T> clazz) {
        String json = stringRedisTemplate.opsForValue().get(key);
        if (json == null) return null;
        try {
            return objectMapper.readValue(json, clazz);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("反序列化失败", e);
        }
    }
//    删除
    public void delete(String key) {
        stringRedisTemplate.delete(key);
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