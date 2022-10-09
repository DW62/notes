# SpringBoot+security前后端分离

> 实现SpringBoot+Security+JWT+Redis整合

## 准备工作

### 引用依赖

**常规依赖**

```xml
<!--spring-boot依赖-->
<dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<!--spring-security依赖-->
<dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<!--mysql依赖-->
<dependency>
     <groupId>mysql</groupId>
     <artifactId>mysql-connector-java</artifactId>
     <scope>runtime</scope>
</dependency>
<!--mybatis-plus依赖-->
<dependency>
     <groupId>com.baomidou</groupId>
     <artifactId>mybatis-plus-boot-starter</artifactId>
     <version>3.5.2</version>
</dependency>
<!--lombok依赖-->
<dependency>
     <groupId>org.projectlombok</groupId>
     <artifactId>lombok</artifactId>
     <optional>true</optional>
</dependency>
<!--SpringBoot测试依赖-->
<dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-test</artifactId>
       <scope>test</scope>
 </dependency>
<!--SpringSecurity测试依赖-->
  <dependency>
       <groupId>org.springframework.security</groupId>
       <artifactId>spring-security-test</artifactId>
       <scope>test</scope>
   </dependency>
```

**JWT依赖**

JDK8引入

```xml
<!--JWT依赖-->
<dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt</artifactId>
            <version>0.9.0</version>
</dependency>
```

JDK8以上引入

```xml
	<!--JWT依赖-->
	<dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt</artifactId>
            <version>0.9.0</version>
        </dependency>
        <dependency>
            <groupId>javax.xml.bind</groupId>
            <artifactId>jaxb-api</artifactId>
            <version>2.3.0</version>
        </dependency>
        <dependency>
            <groupId>com.sun.xml.bind</groupId>
            <artifactId>jaxb-impl</artifactId>
            <version>2.3.0</version>
        </dependency>
        <dependency>
            <groupId>com.sun.xml.bind</groupId>
            <artifactId>jaxb-core</artifactId>
            <version>2.3.0</version>
        </dependency>
        <dependency>
            <groupId>javax.activation</groupId>
            <artifactId>activation</artifactId>
            <version>1.1.1</version>
        </dependency>
```

**Redis依赖**

```xml
        <!--Redis依赖-->
	<dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
```

### 封装全局返回

全局返回枚举类

```java

/**
 * 全局返回状态枚举
 * @author dw  @date: 2022/9/3 12:05
 */
public enum ResultCode {
    SUCCESS(200,"操作成功"),
    ERROR(400,"操作失败"),
    ARITHMETICEXCEPTION(501,"发生算术运算异常"),
    RUNTIMEEXCEPTION(502,"发生运行时异常"),
    MISSINGSERVLETREQUESTPARAMETEREXCEPTION(503,"缺少 Servlet 请求参数异常"),
    EXCEPTION(500,"服务器发生异常");
    /**
     * 状态码
     */
    private final int code;
    /**
     * 状态信息
     */
    private final String msg;

    public int getCode() {
        return code;
    }

    public String getMsg(){
        return msg;
    }
    ResultCode(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }
}
```

全局返回类

```java

/**
 * 全局返回类
 * @author: DW @date: 2022/9/3 12:05
 */
@Data
public class Result {
    /**
     * 状态码
     */
    private int code;
    /**
     * 返回信息
     */
    private String msg;
    /**
     * 返回数据
     */
    private Map<String,Object> data=new HashMap<>();
    public Result(){

    }

    /**
     * 请求成功方法
     * @return
     */
    public static Result success(){
        Result result = new Result();
        result.code=ResultCode.SUCCESS.getCode();
        result.msg=ResultCode.SUCCESS.getMsg();
        return result;
    }

    /**
     * 请求成功方法
     * @return
     */
    public static Result error() {
        Result result = new Result();
        result.code = ResultCode.ERROR.getCode();
        result.msg=ResultCode.ERROR.getMsg();
        return result;
    }
    /**
     * 设置返回状态码和信息
     * @param resultCode
     * @return
     */
    public static Result codeAndMsg(ResultCode resultCode){
        Result result = new Result();
        result.code=resultCode.getCode();
        result.msg=resultCode.getMsg();
        return result;
    }
    /**
     * 设置返回数据
     * @param key key
     * @param value 值
     * @return
     */
    public  Result data(String key,Object value){
        this.data.put(key, value);
        return this;
    }
    /**
     * 设置值
     * @param data
     * @return
     */
    public Result data(HashMap<String,Object> data){
        this.setData(data);
        return this;
    }
}
```

### 配置类

**Redis配置类**

```java
import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    @SuppressWarnings("all")//抑制所有警告
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        //创建一个RedisTemplate对象
        RedisTemplate<String, Object> template = new RedisTemplate<String, Object>();
        //设置连接工厂
        template.setConnectionFactory(factory);
        //JSON序列化配置
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        //用来解决序列化对象中包含对象，并且对象属性有get、set时出现错误
        om.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        //String序列化
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();

        // key采用String的序列化方式
        template.setKeySerializer(stringRedisSerializer);
        // hash的key也采用String的序列化方式
        template.setHashKeySerializer(stringRedisSerializer);
        // value序列化方式采用jackson
        template.setValueSerializer(jackson2JsonRedisSerializer);
        // hash的value序列化方式采用jackson
        template.setHashValueSerializer(jackson2JsonRedisSerializer);
        template.afterPropertiesSet();

        return template;
    }
}
```

### 工具类

**Redis工具类**

```java

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import javax.annotation.Resource;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Component
public final class RedisUtil {

    /**
     *     注入配置类中自定义的RedisTemplate
     */
    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    // =============================common============================
    /**
     * 指定缓存失效时间
     * @param key  键
     * @param time 时间(秒)
     */
    public boolean expire(String key, long time) {
        try {
            if (time > 0) {
                redisTemplate.expire(key, time, TimeUnit.SECONDS);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 根据key 获取过期时间
     * @param key 键 不能为null
     * @return 时间(秒) 返回0代表为永久有效
     */
    public long getExpire(String key) {
        return redisTemplate.getExpire(key, TimeUnit.SECONDS);
    }

    /**
     * 判断key是否存在
     * @param key 键
     * @return true 存在 false不存在
     */
    public boolean hasKey(String key) {
        try {
            return redisTemplate.hasKey(key);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 删除缓存
     * @param key 可以传一个值 或多个
     */
    @SuppressWarnings("unchecked")
    public void del(String... key) {
        if (key != null && key.length > 0) {
            if (key.length == 1) {
                redisTemplate.delete(key[0]);
            } else {
                redisTemplate.delete((Collection<String>) CollectionUtils.arrayToList(key));
            }
        }
    }
    // ============================String=============================
    /**
     * 普通缓存获取
     * @param key 键
     * @return 值
     */
    public Object get(String key) {
        return key == null ? null : redisTemplate.opsForValue().get(key);
    }

    /**
     * 普通缓存放入
     * @param key   键
     * @param value 值
     * @return true成功 false失败
     */
    public boolean set(String key, Object value) {
        try {
            redisTemplate.opsForValue().set(key, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 普通缓存放入并设置时间
     * @param key   键
     * @param value 值
     * @param time  时间(秒) time要大于0 如果time小于等于0 将设置无限期
     * @return true成功 false 失败
     */
    public boolean set(String key, Object value, long time) {
        try {
            if (time > 0) {
                redisTemplate.opsForValue().set(key, value, time, TimeUnit.SECONDS);
            } else {
                set(key, value);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 递增
     * @param key   键
     * @param delta 要增加几(大于0)
     */
    public long incr(String key, long delta) {
        if (delta < 0) {
            throw new RuntimeException("递增因子必须大于0");
        }
        return redisTemplate.opsForValue().increment(key, delta);
    }

    /**
     * 递减
     * @param key   键
     * @param delta 要减少几(小于0)
     */
    public long decr(String key, long delta) {
        if (delta < 0) {
            throw new RuntimeException("递减因子必须大于0");
        }
        return redisTemplate.opsForValue().increment(key, -delta);
    }
    // ================================Map=================================
    /**
     * HashGet
     * @param key  键 不能为null
     * @param item 项 不能为null
     */
    public Object hget(String key, String item) {
        return redisTemplate.opsForHash().get(key, item);
    }

    /**
     * 获取hashKey对应的所有键值
     * @param key 键
     * @return 对应的多个键值
     */
    public Map<Object, Object> hmget(String key) {
        return redisTemplate.opsForHash().entries(key);
    }

    /**
     * HashSet
     * @param key 键
     * @param map 对应多个键值
     */
    public boolean hmset(String key, Map<String, Object> map) {
        try {
            redisTemplate.opsForHash().putAll(key, map);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * HashSet 并设置时间
     * @param key  键
     * @param map  对应多个键值
     * @param time 时间(秒)
     * @return true成功 false失败
     */
    public boolean hmset(String key, Map<String, Object> map, long time) {
        try {
            redisTemplate.opsForHash().putAll(key, map);
            if (time > 0) {
                expire(key, time);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 向一张hash表中放入数据,如果不存在将创建
     * @param key   键
     * @param item  项
     * @param value 值
     * @return true 成功 false失败
     */
    public boolean hset(String key, String item, Object value) {
        try {
            redisTemplate.opsForHash().put(key, item, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 向一张hash表中放入数据,如果不存在将创建
     * @param key   键
     * @param item  项
     * @param value 值
     * @param time  时间(秒) 注意:如果已存在的hash表有时间,这里将会替换原有的时间
     * @return true 成功 false失败
     */
    public boolean hset(String key, String item, Object value, long time) {
        try {
            redisTemplate.opsForHash().put(key, item, value);
            if (time > 0) {
                expire(key, time);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 删除hash表中的值
     * @param key  键 不能为null
     * @param item 项 可以使多个 不能为null
     */
    public void hdel(String key, Object... item) {
        redisTemplate.opsForHash().delete(key, item);
    }

    /**
     * 判断hash表中是否有该项的值
     * @param key  键 不能为null
     * @param item 项 不能为null
     * @return true 存在 false不存在
     */
    public boolean hHasKey(String key, String item) {
        return redisTemplate.opsForHash().hasKey(key, item);
    }

    /**
     * hash递增 如果不存在,就会创建一个 并把新增后的值返回
     * @param key  键
     * @param item 项
     * @param by   要增加几(大于0)
     */
    public double hincr(String key, String item, double by) {
        return redisTemplate.opsForHash().increment(key, item, by);
    }

    /**
     * hash递减
     * @param key  键
     * @param item 项
     * @param by   要减少记(小于0)
     */
    public double hdecr(String key, String item, double by) {
        return redisTemplate.opsForHash().increment(key, item, -by);
    }
    // ============================set=============================
    /**
     * 根据key获取Set中的所有值
     * @param key 键
     */
    public Set<Object> sGet(String key) {
        try {
            return redisTemplate.opsForSet().members(key);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 根据value从一个set中查询,是否存在
     * @param key   键
     * @param value 值
     * @return true 存在 false不存在
     */
    public boolean sHasKey(String key, Object value) {
        try {
            return redisTemplate.opsForSet().isMember(key, value);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 将数据放入set缓存
     * @param key    键
     * @param values 值 可以是多个
     * @return 成功个数
     */
    public long sSet(String key, Object... values) {
        try {
            return redisTemplate.opsForSet().add(key, values);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 将set数据放入缓存
     * @param key    键
     * @param time   时间(秒)
     * @param values 值 可以是多个
     * @return 成功个数
     */
    public long sSetAndTime(String key, long time, Object... values) {
        try {
            Long count = redisTemplate.opsForSet().add(key, values);
            if (time > 0)
                expire(key, time);
            return count;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 获取set缓存的长度
     * @param key 键
     */
    public long sGetSetSize(String key) {
        try {
            return redisTemplate.opsForSet().size(key);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 移除值为value的
     * @param key    键
     * @param values 值 可以是多个
     * @return 移除的个数
     */
    public long setRemove(String key, Object... values) {
        try {
            Long count = redisTemplate.opsForSet().remove(key, values);
            return count;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }
    // ===============================list=================================
    /**
     * 获取list缓存的内容
     * @param key   键
     * @param start 开始
     * @param end   结束 0 到 -1代表所有值
     */
    public List<Object> lGet(String key, long start, long end) {
        try {
            return redisTemplate.opsForList().range(key, start, end);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 获取list缓存的长度
     * @param key 键
     */
    public long lGetListSize(String key) {
        try {
            return redisTemplate.opsForList().size(key);
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 通过索引 获取list中的值
     * @param key   键
     * @param index 索引 index>=0时， 0 表头，1 第二个元素，依次类推；index<0时，-1，表尾，-2倒数第二个元素，依次类推
     */
    public Object lGetIndex(String key, long index) {
        try {
            return redisTemplate.opsForList().index(key, index);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 将list放入缓存
     * @param key   键
     * @param value 值
     */
    public boolean lSet(String key, Object value) {
        try {
            redisTemplate.opsForList().rightPush(key, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 将list放入缓存
     * @param key   键
     * @param value 值
     * @param time  时间(秒)
     */
    public boolean lSet(String key, Object value, long time) {
        try {
            redisTemplate.opsForList().rightPush(key, value);
            if (time > 0)
                expire(key, time);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 将list放入缓存
     * @param key   键
     * @param value 值
     * @return
     */
    public boolean lSet(String key, List<Object> value) {
        try {
            redisTemplate.opsForList().rightPushAll(key, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 将list放入缓存
     * @param key   键
     * @param value 值
     * @param time  时间(秒)
     * @return
     */
    public boolean lSet(String key, List<Object> value, long time) {
        try {
            redisTemplate.opsForList().rightPushAll(key, value);
            if (time > 0)
                expire(key, time);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 根据索引修改list中的某条数据
     * @param key   键
     * @param index 索引
     * @param value 值
     * @return
     */
    public boolean lUpdateIndex(String key, long index, Object value) {
        try {
            redisTemplate.opsForList().set(key, index, value);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 移除N个值为value
     * @param key   键
     * @param count 移除多少个
     * @param value 值
     * @return 移除的个数
     */
    public long lRemove(String key, long count, Object value) {
        try {
            Long remove = redisTemplate.opsForList().remove(key, count, value);
            return remove;
        } catch (Exception e) {
            e.printStackTrace();
            return 0;
        }
    }
}
```

**Jwt工具类**

```java
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.UUID;

/**
 * JWT工具类
 */
public class JWTUtil {

    //有效期为
    public static final Long JWT_TTL = 60 * 60 *1000L;// 60 * 60 *1000  一个小时
    //设置秘钥明文6位或6位以上字母
    public static final String JWT_KEY = "jwtkeasasas";

    //生成UUID
    public static String getUUID(){
        String token = UUID.randomUUID().toString().replaceAll("-", "");
        return token;
    }
    
    /**
     * 生成jtw
     * @param subject token中要存放的数据可以是一个字符串，也可以是json对象
     * @return  jwt
     */
    public static String createJWT(String subject) {
        JwtBuilder builder = getJwtBuilder(subject, null, getUUID());// 设置过期时间
        return builder.compact();
    }

    /**
     * 生成jtw
     * @param subject token中要存放的数据可以是一个字符串，也可以是json对象
     * @param ttlMillis token生效时间
     * @return jwt
     */
    public static String createJWT(String subject, Long ttlMillis) {
        JwtBuilder builder = getJwtBuilder(subject, ttlMillis, getUUID());// 设置过期时间
        return builder.compact();
    }

    private static JwtBuilder getJwtBuilder(String subject, Long ttlMillis, String uuid) {
        //设置加密算法
        SignatureAlgorithm signatureAlgorithm = SignatureAlgorithm.HS256;
        //生成加密后的秘钥 secretKey
        SecretKey secretKey = generalKey();
        //获取当前时间
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        if(ttlMillis==null){
            ttlMillis= JWTUtil.JWT_TTL;
        }
        //设置过期时间
        long expMillis = nowMillis + ttlMillis;
        Date expDate = new Date(expMillis);

        return Jwts.builder()
                .setId(uuid)              //唯一的ID
                .setSubject(subject)   // 主题  可以是JSON数据
                .setIssuer("DW")     // 签发者
                .setIssuedAt(now)      // 签发时间
                .signWith(signatureAlgorithm, secretKey) //使用HS256对称加密算法签名, 第二个参数为秘钥
                .setExpiration(expDate); //过期时间
    }

    /**
     * 创建token
     * @param id   jwt的Id
     * @param subject  jwt中添加的数据，可以是一个字符串，也可以是json对象
     * @param ttlMillis 生效时间（单位毫秒）
     * @return Jwt
     */
    public static String createJWT(String id, String subject, Long ttlMillis) {
        JwtBuilder builder = getJwtBuilder(subject, ttlMillis, id);// 设置过期时间
        return builder.compact();
    }

    /**
     * 生成加密后的秘钥 secretKey
     * @return  生成加密后的秘钥 secretKey
     */
    public static SecretKey generalKey() {
        byte[] encodedKey = Base64.getDecoder().decode(JWTUtil.JWT_KEY);
        SecretKey key = new SecretKeySpec(encodedKey, 0, encodedKey.length, "AES");
        return key;
    }
    
    /**
     * 解析
     * @param jwt  jwt
     * @return  jwt的荷载部分
     * @throws Exception 异常
     */
    public static Claims parseJWT(String jwt) throws Exception {
        SecretKey secretKey = generalKey();
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(jwt)
                .getBody();
    }
}
```

### 配置文件

```yml
## 设置运行端口
server:
  port: 9090

spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/security?serverTimezone=UTC&useUnicode=true&characterEncoding=utf8&useSSL=false
    username: root
    password: root
  ## redis配置
  redis:
    database: 0
    password: redis
    host: 39.105.29.9
    port: 6380
## 设置mybatis-plus   xml文件位置
mybatis-plus:
  mapper-locations: classpath*:/mapper/**mapper.xml
```

## 实现数据库数据进行登录

1. 实现` UserDetailsService`接口重写`loadUserByusername`方法来实现通过传递的用户名来查询数据库中的用户数据

```java
/**
 * 实现查询数据量数据进行登录
 */
@Service
public class MyUserDetailsService  implements UserDetailsService {
    //注入数据库对应实体mapper
    @Autowired
    private UserInfoMapper userInfoMapper;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //根据传递的用户进行查询数据
        UserInfo userInfo = userInfoMapper.selectOne(new QueryWrapper<UserInfo>().eq("username", username));
        //判断用户是否存在，不存在直接抛出异常
        if (Objects.isNull(userInfo)){
            tthrow new UsernameNotFoundException("用户不存在!");
        }
        //将用户封装为UserDetails进行返回
        return new MyUserDetails(userInfo);
    }
}
```

2. 用于`loadUserByUsername`方法返回的数据为`UserDetails`类型，所以要自定义一个类来实现`UserDetails`接口重写方法

```java
/**
 * 自定义security返回对象
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MyUserDetails implements UserDetails {

    //将数据库对应用户对象变为属性进行封装
    private UserInfo userInfo;
    //获取用户权限信息
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }
	//获取用户密码
    @Override
    public String getPassword() {
        return userInfo.getPassword();
    }
	//获取用户账户
    @Override
    public String getUsername() {
        return userInfo.getUsername();
    }
	
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
```

此时就可以实现通过查询数据的用户数据进行登录认证

> 但是此时数据库中的密码前面必须加上{noop}才能查询成功，并且此时数据库中的密码是明文密码

显然这种查询明文密码并且需要在明文密码前面拼接`{noop}`是很不人性化的

可以通过添加一个`security`配置文件然后指定加密方式来实现数据库密码的加密查询

```java
/**
 * security配置类
 */
@EnableWebSecurity
@Configuration
public class SecurityConfig  {

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
```

## 自定义登录接口

**创建一个controller接口来让前端进行调用**

```java
@PostMapping("/securityLogin")
public Result login(@RequestBody UserInfo userInfo){
        return loginService.login(userInfo);
 }
```

在service中可以通过`AuthenticationManager`的`authenticate`方法来进行用户的认证，所以需要先在`SecurityConfig`中将`AuthenticationManager`注入到容器中。同时还需要在配置类中将登录接口进行放行，使其不需要认证也可以调用。

**完善配置类放行登录接口**

```java
@Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        //关闭csrf
        http.csrf().disable();
        //关闭Session
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        //认证
        http.authorizeRequests()
                //放行登录接口
                .antMatchers("/securityLogin").anonymous()
                //除了放行的接口以外其他都需要认证
                .anyRequest().authenticated();
        return http.build();
    }
```

**将`AuthenticationManager`注入到容器中**

```java
    @Resource
    private AuthenticationConfiguration authenticationConfiguration;

    @Bean
    public AuthenticationManager authenticationManager() throws Exception{
        AuthenticationManager authenticationManager = authenticationConfiguration.getAuthenticationManager();
        return authenticationManager;
    }
```

**创建service编写实际的登录方法**

```java
/**
 * @author: DW @date: 2022/10/8 23:00
 */
@Service
public class LoginServiceImpl implements LoginService {
    @Resource
    private AuthenticationManager authenticationManager;
    @Resource
    private RedisUtil redisUtil;
    /**
     * 自定义登录
     * @param userInfo
     * @return
     */
    @Override
    public Result login(UserInfo userInfo) {
        //使用AuthenticationManager 的authenticate方法进行用户认证，
        //1.将用户封装到authentication对象,authentication是接口需要他的实现类
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken=new UsernamePasswordAuthenticationToken(userInfo.getUsername(), userInfo.getPassword());
        //2.传入authentication对象的实现类UsernamePasswordAuthenticationToken
        Authentication authenticate = authenticationManager.authenticate(usernamePasswordAuthenticationToken);
        //如果认证没通过给出提示
        if (Objects.isNull(authenticate)){
            throw new RuntimeException("认证失败");
        }
        //获取认证成功后的UserDetails对象
        MyUserDetails myUserDetails =(MyUserDetails) authenticate.getPrincipal();
        //根据用户id生成token
        String userInfoId = myUserDetails.getUserInfo().getId().toString();
        String jwt = JWTUtil.createJWT(userInfoId);
        //把完整用户信息存入redis，用户id为key，用户信息为value
        redisUtil.set("UserInfo:"+userInfoId,myUserDetails);
        return Result.success().data("token",jwt);
    }
}
```

认证成功后根据用户ID生成一个JWT，进行返回，之后的请求携带JWT就可以知道是那个用户，同时这里还可以将用户完整信息存在redis中，来更快获取用户所有信息

**添加认证过滤器**

此时还需要定义一个过滤器，来获取请求头中的token，然后进行解析从而获取用户信息，然后封装到`Authentication`对象并存入`SecurityContextHolder`中。

```java
/**
 * 认证过滤器
 * @author: DW @date: 2022/10/8 23:30
 */
@Component
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {
    @Resource
    private RedisUtil redisUtil;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //1获取token  header的token
        String token = request.getHeader("token");
        if (!StringUtils.hasText(token)) {
            //放行，让后面的过滤器执行
            filterChain.doFilter(request, response);
            return;
        }
        //2解析token
        String userInfoId;
        try {
            Claims claims = JWTUtil.parseJWT(token);
            userInfoId = claims.getSubject();
        } catch (Exception e) {
            throw new RuntimeException("token不合法！");
        }

        //3获取userId, redis获取用户信息
        MyUserDetails myUserDetails = (MyUserDetails) redisUtil.get("UserInfo:"+userInfoId);
        if (Objects.isNull(myUserDetails)) {
            throw new RuntimeException("当前用户未登录！");
        }

        //4封装Authentication
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken
                = new UsernamePasswordAuthenticationToken(myUserDetails, null, null);
        //5存入SecurityContextHolder
        SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
        //放行，让后面的过滤器执行
        filterChain.doFilter(request, response);
    }
}
```

创建完认证过滤器，还需要将过滤器添加到security的过滤器链中

**完善security配置类**

```java
 	@Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        //关闭csrf
        http.csrf().disable();
        //关闭Session
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        //认证
        http.authorizeRequests()
                //放行登录接口
                .antMatchers("/securityLogin").anonymous()
                //除了放行的接口以外其他都需要认证
                .anyRequest().authenticated();
        //把token校验过滤器添加到过滤器链中
        http.addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
```

## 实现退出登录接口

>可以在认证过滤器中解析完token后，通过token中的数据，来从redis中查询用户信息，然后查不到用户信息直接抛出异常，在定义一个退出登录的controller接口，退出登录方法只需要从SecurityContextHolder中获取认证信息，然后从认证信息中获取用户信息，最后在删除redis中的用户信息。既可以实现退出接口

**创建controller**

```java
	/**
     * 实现退出登录
     */
    @GetMapping("/securityLogout")
    public Result login(){
        return logoutService.logout();
    }
```

**创建service和service实现类**

```java
@Service
public class LogoutServiceImpl implements LogoutService {
    @Resource
    private RedisUtil redisUtil;
    //退出登录
    @Override
    public Result logout() {
        //从SecurityContextHolder中获取认证的用户信息
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails myUserDetails=(MyUserDetails) authentication.getPrincipal();
        //获取用户的id
        Long userInfoId = myUserDetails.getUserInfo().getId();
        //删除redis中的用户信息
        redisUtil.del("UserInfo:"+userInfoId);
        return Result.success();
    }
}
```

