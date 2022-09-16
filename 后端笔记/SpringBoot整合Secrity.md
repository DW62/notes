# SpringBoot整合Secrity

## 准备工作

1. 导入maven依赖

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
<dependency>
     <groupId>org.projectlombok</groupId>
     <artifactId>lombok</artifactId>
     <optional>true</optional>
</dependency>
```

2. 定义全局返回类和返回信息枚举类

```java
import lombok.Data;
import java.util.HashMap;
import java.util.Map;

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

3. 配置yml文件

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

## 设置mybatis-plus   xml文件位置
mybatis-plus:
  mapper-locations: classpath*:/mapper/**mapper.xml
```

## 实现通过数据库查询用户信息进行认证

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
            throw new RuntimeException("用户不存在");
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

## 前后端分离自定义登录接口

前面已经实现可以通过查询数据进行认证，但是对于前后段分离项目来说默认的登录页面不用使用，并且前后的分离不能使用session，所以还需要集成JWT来生成Token进行登录认证

**引入jwt依赖**

```xml
<dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt</artifactId>
            <version>0.9.0</version>
</dependency>
```

**添加一个JWT的工具类来实现生成token和解析token**

```java
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.UUID;

/**
 * JWT工具类
 */
public class JwtUtil {
    //设置保存时长
    private static final long EXPIRE=60*1000;
    //设置加密密钥
    private static final String ENCRYPTIONKEY="admin";
    //设置加密方式
    private static final String ENCRYPTION="HS256";

    //生成token
    public static String getToken(String key,Object value){
        JwtBuilder jwtBuilder= Jwts.builder();
        String token = jwtBuilder
                //设置jwt的header部分
                .setHeaderParam("type", "JWT")
                        //指定加密算法
                .setHeaderParam("alg", ENCRYPTION)
                //设置JWT的payload部分
                .claim(key, value)//设置jwt中存储的信息
                    //设置过期时间
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE))
                .setId(UUID.randomUUID().toString())//设置token的ID
                //设置JWT的signature部分
                .signWith(SignatureAlgorithm.valueOf(ENCRYPTION), ENCRYPTIONKEY)
                .compact();
        return token;
    }
    //解析token
    public static Claims parseToken(String token){
        try {
            return Jwts.parser()
                    .setSigningKey(ENCRYPTIONKEY)
                    .parseClaimsJws(token)
                    .getBody();
        }catch (Exception e){
            return null;
        }
    }
}
```

**创建一个controller接口来让前端进行调用**

```java
@PostMapping("/securityLogin")
public Result login(@RequestBody UserInfo userInfo){
        return loginService.login(userInfo);
 }
```

在service中可以通过`AuthenticationManager`的`authenticate`方法来进行用户的认证，所以需要先在`SecurityConfig`中将`AuthenticationManager`注入到容器中。同时还需要在配置类中将登录接口进行放行，使其不需要认证也可以调用。

**Security配置类**

```java
/**
 * security配置类
 */
@EnableWebSecurity
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                //关闭csrf
                .csrf().disable()
                //不通过Session获取SecurityContext
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                // 对于登录接口 允许匿名访问
                .antMatchers("/securityLogin").anonymous()
                // 除上面外的所有请求全部需要鉴权认证
                .anyRequest().authenticated();
    }
    //将AuthenticationManager注入到容器中使其他类可以调用
    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
```

**创建service编写实际的登录方法**

```java
@Service
public class LoginServiceImpl implements LoginService {
    //注入AuthenticationManager 
    @Autowired
    private AuthenticationManager authenticationManager;

    public Result login(UserInfo userInfo) {
        //生成Authentication接口的实现类对象
        UsernamePasswordAuthenticationToken authenticationToken=new UsernamePasswordAuthenticationToken(userInfo.getUsername(),userInfo.getPassword());
        //使用AuthenticationManager 的authenticate方法进行认证，需要传个Authentication对象
        Authentication authenticate = authenticationManager.authenticate(authenticationToken);
        //从认证后的Authentication对象中获取用户信息
        MyUserDetails myUserDetails = (MyUserDetails) authenticate.getPrincipal();
        UserInfo userInfo1 = myUserDetails.getUserInfo();
        //将用户信息生成token进行返回
        String token = JwtUtil.getToken("userId", userInfo1.getId());
        return Result.success().data("token",token);
    }
}
```

认证成功后根据用户ID生成一个JWT，进行返回，之后的请求携带JWT就可以知道是那个用户，同时这里还可以将用户完整信息存在redis中，来更快获取用户所有信息

**认证过滤器**

此时还需要定义一个过滤器，来获取请求头中的token，然后进行解析从而获取用户信息，然后封装到`Authentication`对象并存入`SecurityContextHolder`中。

```java
/**
 * 过滤请求中的token
 */
@Component
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {
    @Autowired
    private UserInfoMapper userInfoMapper;
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //获取token
        String token = request.getHeader("token");
        if (!StringUtils.hasText(token)){
            //不存在token放行
            filterChain.doFilter(request,response);
            return;
        }
        //解析token
        Claims claims = JwtUtil.parseToken(token);
        Object userId = claims.get("userId");

        //获取用户信息，这里也可以从redis中获取用户信息
        UserInfo userInfo = userInfoMapper.selectById((Serializable) userId);
        //将用户信息封装为Authentication对象并存入SecurityContextHolder
        UsernamePasswordAuthenticationToken authenticationToken=new UsernamePasswordAuthenticationToken(userInfo,null,null);
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        //放行
        filterChain.doFilter(request,response);
    }
}
```

过滤器创建完成后还需要在配置类中将自定义的过滤器加到Security过滤器链中

```java
  @Autowired
    private JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter;
  
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                //关闭csrf
                .csrf().disable()
                //不通过Session获取SecurityContext
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                // 对于登录接口 允许匿名访问
                .antMatchers("/securityLogin").anonymous()
                // 除上面外的所有请求全部需要鉴权认证
                .anyRequest().authenticated();
        //把token校验过滤器添加到过滤器链中
        http.addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);
    }
```

**此时就实现自定义登录接口并集成JWT**

## 自定义实现退出接口

> 可以在认证过滤器中解析完token后，通过token中的数据，来从redis中查询用户信息，然后查不到直接抛出异常，在定义一个退出登录的controller接口，退出登录方法只需要从SecurityContextHolder中获取认证信息，然后从认证信息中获取用户信息，最后在删除redis中的用户信息。既可以实现退出接口

