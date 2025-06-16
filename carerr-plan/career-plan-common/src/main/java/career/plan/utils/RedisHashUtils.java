package career.plan.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * Redis Hash 操作工具类
 * @author 胡志坚
 * @version 1.0
 * 创建日期 2025/4/4
 */
@Component
public class RedisHashUtils {
    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    public RedisHashUtils(StringRedisTemplate stringRedisTemplate, ObjectMapper objectMapper) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * 设置Hash字段值
     * @param key Redis key
     * @param field Hash字段
     * @param value 值
     */
    public void hSet(String key, String field, String value) {
        stringRedisTemplate.opsForHash().put(key, field, value);
    }

    /**
     * 设置Hash字段值并设置过期时间
     * @param key Redis key
     * @param field Hash字段
     * @param value 值
     * @param timeout 过期时间
     * @param unit 时间单位
     */
    public void hSetWithExpire(String key, String field, String value, long timeout, TimeUnit unit) {
        stringRedisTemplate.opsForHash().put(key, field, value);
        stringRedisTemplate.expire(key, timeout, unit);
    }

    /**
     * 批量设置Hash字段值
     * @param key Redis key
     * @param map 字段-值映射表
     */
    public void hMSet(String key, Map<String, String> map) {
        stringRedisTemplate.opsForHash().putAll(key, map);
    }

    /**
     * 获取Hash字段值
     * @param key Redis key
     * @param field Hash字段
     * @return 字段值，如果不存在返回null
     */
    public String hGet(String key, String field) {
        return (String) stringRedisTemplate.opsForHash().get(key, field);
    }

    /**
     * 批量获取Hash字段值
     * @param key Redis key
     * @param fields Hash字段集合
     * @return 字段-值映射表
     */
    public Map<String, String> hMGet(String key, Collection<String> fields) {
        List<Object> values = stringRedisTemplate.opsForHash().multiGet(key, Arrays.asList(fields.toArray()));
        Map<String, String> result = new HashMap<>();
        Iterator<String> fieldIter = fields.iterator();
        Iterator<Object> valueIter = values.iterator();
        
        while (fieldIter.hasNext() && valueIter.hasNext()) {
            result.put(fieldIter.next(), (String) valueIter.next());
        }
        return result;
    }

    /**
     * 获取Hash所有字段和值
     * @param key Redis key
     * @return 字段-值映射表
     */
    public Map<String, String> hGetAll(String key) {
        Map<Object, Object> entries = stringRedisTemplate.opsForHash().entries(key);
        Map<String, String> result = new HashMap<>();
        entries.forEach((k, v) -> result.put((String) k, (String) v));
        return result;
    }

    /**
     * 删除Hash字段
     * @param key Redis key
     * @param fields 要删除的字段
     * @return 删除的字段数量
     */
    public Long hDel(String key, String... fields) {
        return stringRedisTemplate.opsForHash().delete(key, (Object[]) fields);
    }

    /**
     * 判断Hash字段是否存在
     * @param key Redis key
     * @param field Hash字段
     * @return 是否存在
     */
    public Boolean hExists(String key, String field) {
        return stringRedisTemplate.opsForHash().hasKey(key, field);
    }

    /**
     * 获取Hash所有字段名
     * @param key Redis key
     * @return 字段名集合
     */
    public Set<String> hKeys(String key) {
        Set<Object> keys = stringRedisTemplate.opsForHash().keys(key);
        return keys.stream().map(k -> (String) k).collect(Collectors.toSet());
    }

    /**
     * 获取Hash字段数量
     * @param key Redis key
     * @return 字段数量
     */
    public Long hSize(String key) {
        return stringRedisTemplate.opsForHash().size(key);
    }

    /**
     * Hash字段值自增（整型）
     * @param key Redis key
     * @param field Hash字段
     * @param increment 增量（可为负）
     * @return 自增后的值
     */
    public Long hIncrBy(String key, String field, long increment) {
        return stringRedisTemplate.opsForHash().increment(key, field, increment);
    }

    /**
     * Hash字段值自增（浮点型）
     * @param key Redis key
     * @param field Hash字段
     * @param increment 增量（可为负）
     * @return 自增后的值
     */
    public Double hIncrByFloat(String key, String field, double increment) {
        return stringRedisTemplate.opsForHash().increment(key, field, increment);
    }

    /**
     * 设置对象到Hash（自动序列化）
     * @param key Redis key
     * @param field Hash字段
     * @param object 要存储的对象
     */
    public <T> void hSetObject(String key, String field, T object) {
        try {
            String value = objectMapper.writeValueAsString(object);
            hSet(key, field, value);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("对象序列化失败", e);
        }
    }

    /**
     * 获取Hash中的对象（自动反序列化）
     * @param key Redis key
     * @param field Hash字段
     * @param clazz 对象类型
     * @return 反序列化的对象，如果不存在返回null
     */
    public <T> T hGetObject(String key, String field, Class<T> clazz) {
        String value = hGet(key, field);
        if (value == null) {
            return null;
        }
        try {
            return objectMapper.readValue(value, clazz);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("对象反序列化失败", e);
        }
    }

    /**
     * 批量设置对象到Hash（自动序列化）
     * @param key Redis key
     * @param objectMap 对象映射表
     */
    public <T> void hMSetObject(String key, Map<String, T> objectMap) {
        Map<String, String> stringMap = new HashMap<>();
        objectMap.forEach((field, obj) -> {
            try {
                stringMap.put(field, objectMapper.writeValueAsString(obj));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("对象序列化失败", e);
            }
        });
        hMSet(key, stringMap);
    }

    /**
     * 批量获取Hash中的对象（自动反序列化）
     * @param key Redis key
     * @param fields 字段集合
     * @param clazz 对象类型
     * @return 对象映射表
     */
    public <T> Map<String, T> hMGetObject(String key, Collection<String> fields, Class<T> clazz) {
        Map<String, String> stringMap = hMGet(key, fields);
        Map<String, T> result = new HashMap<>();
        stringMap.forEach((field, json) -> {
            if (json != null) {
                try {
                    result.put(field, objectMapper.readValue(json, clazz));
                } catch (JsonProcessingException e) {
                    throw new RuntimeException("对象反序列化失败", e);
                }
            }
        });
        return result;
    }

    /**
     * 获取Hash中所有对象（自动反序列化）
     * @param key Redis key
     * @param clazz 对象类型
     * @return 对象映射表
     */
    public <T> Map<String, T> hGetAllObject(String key, Class<T> clazz) {
        Map<String, String> stringMap = hGetAll(key);
        Map<String, T> result = new HashMap<>();
        stringMap.forEach((field, json) -> {
            try {
                result.put(field, objectMapper.readValue(json, clazz));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("对象反序列化失败", e);
            }
        });
        return result;
    }
}