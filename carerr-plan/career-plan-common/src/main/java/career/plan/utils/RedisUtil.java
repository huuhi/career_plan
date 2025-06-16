package career.plan.utils;


import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import org.springframework.data.redis.connection.stream.*;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

import static career.plan.content.RedisConstant.*;


/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/3/20
 * 说明:
 */
@Component
public class RedisUtil {
    private final StringRedisTemplate redisTemplate;

    public RedisUtil(StringRedisTemplate redisTemplate){
        this.redisTemplate = redisTemplate;
    }

    /**
     *
     * @param key 键
     * @param value 值
     * @param time 过期时间
     * @param unit 时间单位
     * @shwo 在指定的时间添加1-10的随机值，防止缓存雪崩
     */
    public  void set(String key,Object value,Long time , TimeUnit unit){
        String json = JSONUtil.toJsonStr(value);
        int i = RandomUtil.randomInt(1, 10);
        redisTemplate.opsForValue().set(key,json,time+i,unit);
    }

    /**
     *
     * @param key 键
     * @return 返回是否成功获取互斥锁
     * @show 获取互斥锁，过期时间默认为5秒
     */
    public boolean tryLock(String key){
        Boolean success = redisTemplate.opsForValue().setIfAbsent(key, "1", LOCK_TTL, TimeUnit.SECONDS);
        return Boolean.TRUE.equals(success);
    }

    /**
     *
     * @param key 键
     * @param ttl 过期时间
     * @return 获取互斥锁，时间单位默认是秒
     */
    public boolean tryLock(String key,Long ttl){
        Boolean success = redisTemplate.opsForValue().setIfAbsent(key, "1", ttl, TimeUnit.SECONDS);
        return Boolean.TRUE.equals(success);
    }

    /**
     * @param key 解锁
     */
    public void unlock(String key){
        redisTemplate.delete(key);
    }

    /**
     *
     * @param keyPrefix 前缀键
     * @param id 查询的id
     * @param clazz 返回的类型
     * @param dbFallback 查询数据库的函数
     * @param time 过期时间
     * @param unit 时间单位
     * @return  返回指定的类型数据
     * @param <R> 返回的类型
     * @param <ID> 查询的id的类型
     * @author 胡志坚
     * @show 此方法解决了缓存穿透问题，在指定的时间过期上加1-10的随机值，防止缓存雪崩
     */
    public <R,ID> R queryWithPassThrough(String keyPrefix, ID id, Class<R> clazz,
                                         Function<ID,R> dbFallback, Long time,
                                         TimeUnit unit){
        String key=keyPrefix+id;
        String s = redisTemplate.opsForValue().get(key);
        if(StrUtil.isNotBlank(s)){
            return JSONUtil.toBean(s,clazz);
        }
        if(s!=null){
            return null;
        }
        R r= dbFallback.apply(id);
        if(r==null){
//            防止缓存穿透
            redisTemplate.opsForValue().set(key,"",CACHE_NULL_TTL,TimeUnit.MINUTES);
            return null;
        }
        int random = RandomUtil.randomInt(1, 10);
        this.set(key,r,time+random,unit);
        return r;
    }

    /**
     *
     * @param keyPrefix 前缀键
     * @param id 查询的id
     * @param clazz 返回的类型
     * @param dbFallback 查询数据库的函数
     * @param time 过期时间
     * @param unit 时间单位
     * @return  返回指定的类型数据
     * @param <R> 返回的类型
     * @param <ID> 查询的id的类型
     * @author 胡志坚
     * @show 此方法使用互斥锁解决了缓存击穿问题，在指定的时间过期上加1-10的随机值，防止缓存雪崩
     */
    public <R,ID> R queryWithMutex(String keyPrefix, ID id, Class<R> clazz,
                                         Function<ID,R> dbFallback, Long time,
                                         TimeUnit unit){
        String key=keyPrefix+id;
        R r=getCache(key,clazz);
        if(r!=null){
            return r;
        }
        String lockKey=LOCK_KEY+id;
        boolean lock=false;
        final int MAX_TRY=5;
        for (int i = 0; i < MAX_TRY; i++) {
            lock=tryLock(lockKey);
            if(lock) break;
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
        if(lock){
            R r2= getCache(key,clazz);
            if(r2!=null){
                return r2;
            }
        }else{
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
//            不管是不是null，都直接返回
            return getCache(key, clazz);
        }


        R r3= dbFallback.apply(id);
        try {
            if(r3==null){
    //            防止缓存穿透
                redisTemplate.opsForValue().set(key,"",CACHE_NULL_TTL,TimeUnit.MINUTES);
                return null;
            }
            int random = RandomUtil.randomInt(1, 10);
            this.set(key,r3,time+random,unit);
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            unlock(lockKey);
        }
        return r3;
    }

    public <R> R getCache(String key,Class<R> clazz){
        String s = redisTemplate.opsForValue().get(key);
        if(StrUtil.isNotBlank(s)){
            return JSONUtil.toBean(s,clazz);
        }
        return null;
    }
    public boolean delCache(String key){
        Boolean delete = redisTemplate.delete(key);
        return Boolean.TRUE.equals(delete);
    }

    public List<MapRecord<String, Object, Object>> getMsg(String key, String group, String c) {
        try {
            if (redisTemplate.getConnectionFactory().getConnection().isClosed()) {
                return Collections.emptyList(); // 连接已关闭，直接返回空
            }
            if(!isConsumerGroupExists(key,group)){
                 redisTemplate.opsForStream().createGroup(key, ReadOffset.from("0"), group);
            }

            return redisTemplate.opsForStream().read(
                Consumer.from(group, c),
                StreamReadOptions.empty().count(1).block(Duration.ofSeconds(5)),
                StreamOffset.create(key, ReadOffset.lastConsumed())
            );
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

        /**
     * 检查消费者组是否存在
     */
    private boolean isConsumerGroupExists(String key, String group) {
        try {
            // 使用 XINFO GROUPS 获取 Stream 的所有消费者组
            StreamInfo.XInfoGroups groups = redisTemplate.opsForStream().groups(key);
            // 检查目标 Group 是否存在
            return groups.stream()
                .anyMatch(g -> group.equals(g.groupName()));
        } catch (Exception e) {
            // 如果 key 不存在或发生其他错误，返回 false
            return false;
        }
    }

}
