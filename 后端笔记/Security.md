# Security

## 整体架构

在Spring Security的架构设计中，认证Authentication和授权Authorization是分开的，无论使用什么样的认证方式。都不会影响授权，这是两个独立的存在，这种独立带来的好处之一，就是可以使用非常方便地整合一些外部的解决方案。

![image-20221011191213398](https://raw.githubusercontent.com/DW62/ImgStg/master/202210111912455.png)

### 认证

**AuthenticationManager：**在SpringSecurity中认证是由AuthenticationManager来负责，接口定义为：

```java
public interface AuthenticationManager {
    Authentication authenticate(Authentication authentication) throws AuthenticationException;
}
```

* 返回Authentication表示认证成功
* 返回AuthenticationException异常，表示认证失败

> AuthenticationManager主要实现类为ProviderManger，在ProviderManager这管理了众多AuthenticationProvider实例。在一次完整的认证流程中，SpringSecurity允许存在多个AuthenticationProvider，用来实现多种认证方式，这些AuthenticationProvider都由ProviderManager进行统一管理。

![image-20221011192541065](https://raw.githubusercontent.com/DW62/ImgStg/master/202210111925117.png)

**Authentication：**认证以及认证成功的信息主要是由Authentication的实现类来进行保存的，起接口定义为：

![image-20221011192717778](https://raw.githubusercontent.com/DW62/ImgStg/master/202210111927822.png)

```java
public interface Authentication extends Principal, Serializable {
    //获取用户权限信息的方法
    Collection<? extends GrantedAuthority> getAuthorities();
	//获取用户凭证信息，一般值密码的方法
    Object getCredentials();
	//获取用户详细信息的方法
    Object getDetails();
	//获取身份信息，用户名、用户对象等的方法
    Object getPrincipal();
	//判断用户是否认证成功的方法
    boolean isAuthenticated();
	//设置认证标记的
    void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException;
}
```

**SecurityContextHolder：**用来获取登录之后用户信息。SpringSecurity会将登录用户数据保存在Session中。但是为了使用方便，SpringSecurity在此基础上做了一些改进，其中最主要的变化就是线程绑定。当用户登录成功后，SpringSecurity会将登录成功的用户信息保存到SecurityContextHolder中。SecurityContextHolder中的数据保存默认是通过ThreadLocal来实现的，使用ThreadLocal创建的变量只能被当前线程访问，不能被其他线程访问和修改，也就是用户数据和请求线程绑定在一起。当登录请求处理完毕后，SpringSecurity会将SecurityContextHolder中的数据拿出来保存到Session中，同时将SecurityContextHolder中的数据情况。以后每当有请求来时，Spring Security就会从Session中取出用户登录数据，保存到SecurityContextHolder中，方便在改请求的后续处理过程中使用，同时在请求结束时将SecurityContextHolder中的数据拿出来保存到Session中，然后将SecurityContextHolder中的数据清空。这一策略非常方便用户在Controller、Service层以及任何代码中获取当前登录用户数据。

### 授权

当认证成功后，接下来结束授权了。在SpringSecurity的授权体系中，有两个关键接口。

**AccessDecisionManager**

> AccessDecisionManager(访问决策管理器)，用来决定此次访问是否被允许

![image-20221011195456515](https://raw.githubusercontent.com/DW62/ImgStg/master/202210111954559.png)

**AccessDecisionVoter**

> AccessDecisionVoter(访问决定投票器)，投票器会检查用户是否具备应该有的角色，进而投出赞成、反对或者弃权票。

![image-20221011195748544](https://raw.githubusercontent.com/DW62/ImgStg/master/202210111957587.png)

AccessDecisionVoter和AccessDecisionManager都有众多实现类，在AccessDecisionManager中会遍历AccessDecisionVoter，进而决定是否允许用户访问，因而AccessDecisionVoter和AccessDecisionManager的关系类似于AuthenticationProvider和ProviderManager的关系

**ConfigAttribute**

> ConfigAttribute，用来保存授权时的角色信息

![image-20221011200248440](https://raw.githubusercontent.com/DW62/ImgStg/master/202210112002476.png)

在SpringSecurity中，用户请求一个资源(通常是一个接口或者一个Java方法)需要的角色会
被封装成一个ConfigAttribute对象，在ConfigAttribute中只有一个getAttribute方法，该方
法返回一个Sting字符串，就是角色的名称。一般来说，角色名称都带有一个`ROLE_` 前
缀，投票器AccessDecisionVoter所做的事情，其实就是比较用户所具各的角色和请求某个
资源所需的ConfigAttribute之间的关系。

**认证总结：**

> 在进行认证的时候，会使用AuthenticationManager，认证成功之后会将用户信息封装到Authentication中，同时为了方便获取认证之后的信息还可以使用SecurityContextHolder来获取。

**授权总结：**

>在授权时当我们要访问某一个资源时，需要先经过AccessDecisionManager，而AccessDecisionManager会将当前用户的角色封装到ConfigAttribute，同时会调用AccessDecisionVoter来进行对，要访问资源(或接口的权限信息)与ConfigAttribute进行比对，如果AccessDecisionVoter投出赞成则表示当前用户有访问该资源的权限

## Security自动配置原理

> 在开发时，只要添加上Security的依赖，则就会对所有的请求进行拦截控制，是因为将Security依赖添加上之后，SpringBoot就会启用Security默认配置创建一个SecurityFilterChain

SpringBootWebSecurityConfiguration类就是SpringBoot对Security配置类

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnDefaultWebSecurity
@ConditionalOnWebApplication(type = Type.SERVLET)//当运行的容器满足是一个Servlet时生效
class SpringBootWebSecurityConfiguration {
    @Bean
    @Order(SecurityProperties.BASIC_AUTH_ORDER)
    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
    //要求所有请求都要认证
    http.authorizeRequests().anyRequest().authenticated()
    			.and().formLogin().and().httpBasic();
        return http.build();
    }
}
```

通过上面对自动配置分析，我们也能看出默认生效条件为:

```java
class DefaultWebSecurityCondition extends AllNestedConditions {

    DefaultWebSecurityCondition() {
        super(ConfigurationPhase.REGISTER_BEAN);
    }

    @ConditionalOnClass({ SecurityFilterChain.class, HttpSecurity.class })
    static class Classes {

    }

    @ConditionalOnMissingBean({ WebSecurityConfigurerAdapter.class, SecurityFilterChain.class })
    static class Beans {

    }

}
```

- 条件一 classpath中存在 SecurityFilterChain.class或者存在HttpSecurity.class。当项目中引入Security依赖时，项目中肯定存在 SecurityFilterChain.class，所以说第一个条件一定是满足的。
- 条件二 没有自定义 WebSecurityConfigurerAdapter.class和SecurityFilterChain.class

> **结论：**只要我们不自定义配置类(比如WebSecurityConfigurerAdapter) ，条件都是满足的，也就加载默认的配置。否则如果要进行自定义配置，就要继承这个WebSecurityConfigurerAdapter类，通过覆盖类中方法达到修改默认配置的目的。**WebSecurityConfigurerAdapter** 这个类极其重要，Spring Security 核心配置都在这个类中

### Security请求时默认的流程

![image-20221011222808409](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20221011222808409.png)

1. 请求/hello接口，在引入Security之后会先经过一些过滤器
2. 在请求到达FilterSecurityInterceptor时，发现请求未认证。请求拦截下来，并抛出AccessDeniedException异常。
3. 抛出的AccessDeniedException异常会被ExceptionTranslationFilter捕获，这个Filter中会调用LoginUrlAuthenticationEntryPoint类的commence方法给客户端返回302，要求客户端进行重定向到/login页面。
4. 客户端发送/login请求。
5. /login请求会再次被拦截器中的DefaultLoginPageGeneratingFilter拦截到，并在拦截器中返回生成的登录页面。

**这就是没有配置登录页面，但是返回登录页面的原因！**

### Security默认用户的生成

1. 查看SpringBootWebSecurityConfiguration类的defaultSecurityFilterChain方法

![image-20221011224954206](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20221011224954206.png)

2. 处理登录为FormLoginConfigurer类中调用UsernamePasswordAuthenticationFilter这个类实例

![image-20221011225301086](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20221011225301086.png)

3. 查看类UsernamePasswordAuthenticationFilter中的attemptAuthentication方法得知实际调用AuthenticationManager中authenticate方法进行认证

![image-20221011225523354](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20221011225523354.png)

4. 调用ProviderManager类中方法authenticate

![image-20221011225726063](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20221011225726063.png)

5. 调用了ProviderManager实现类中的AbstractUserDetailsAuthenticationProvider类中的方法

![image-20221011230018420](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20221011230018420.png)

6. 最终调用实现类DaoAuthennticationProvider类中方法比较

![image-20221011230132740](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20221011230132740.png)

![image-20221011230200930](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20221011230200930.png)

此时就知道默认是基于InMemoryUserDetailsManager这个类，也就是基于内存实现的。

通过查看源码可以分析出UserDetailService是顶层父接口，接口中的loadUserByUserName方法是用来认证时进行用户名认证方法，默认实现使用的是内存实现，**如果想要修改为数据库实现，我们只需要自定义UserDetailService实现，最终返回UserDetails实例即可**。

```java
public interface UserDetailsService {
	UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
```

![image-20221011230950199](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20221011230950199.png)

**结论：**

1. 从自动配置源码中得知当classpath下存在AuthenticationManager类
2. 当项目中，系统没有通过AuthenticationManager.class、AuthenticationProvider.class、UserDetailsService.class、AuthenticationManagerResolver.class实例

默认情况下都会满足，此时Security就会提供一个InMemoryUserDetailManager实例

![image-20221011231702386](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20221011231702386.png)

```java
@ConfigurationProperties(prefix="spring.security")
public class SecurityProperties{
    private final User user=new User();
    public User getUser(){
        return this.user;
    }
    //...
    public static class User{
        private String name = "user";
        private String password = UUID.randomUUID().toString();
        private List<String> roles=new ArrayList<>();
        private boolean passwordGanerater=true;
        //....
    }
}
```

这就是默认生成user和uuid密码的过程。另外还知道可以在配置文件中对内存中用户和密码进行覆盖。

```properties
spring.security.user.name=root
pring.security.user.password=root
pring.security.user.roles=admin,t
```



## Security提供的过滤器

| 过滤器                                          | 过滤器作用                                               | 默认是否加载 |
| ----------------------------------------------- | -------------------------------------------------------- | ------------ |
| ChannelProcessingFilter                         | 过滤请求协议 HTTP 、HTTPS                                | NO           |
| `WebAsyncManagerIntegrationFilter`              | 将 WebAsyncManger 与 SpringSecurity 上下文进行集成       | YES          |
| `SecurityContextPersistenceFilter`              | 在处理请求之前,将安全信息加载到 SecurityContextHolder 中 | YES          |
| `HeaderWriterFilter`                            | 处理头信息加入响应中                                     | YES          |
| CorsFilter                                      | 处理跨域问题                                             | NO           |
| `CsrfFilter`                                    | 处理 CSRF 攻击                                           | YES          |
| `LogoutFilter`                                  | 处理注销登录                                             | YES          |
| OAuth2AuthorizationRequestRedirectFilter        | 处理 OAuth2 认证重定向                                   | NO           |
| Saml2WebSsoAuthenticationRequestFilter          | 处理 SAML 认证                                           | NO           |
| X509AuthenticationFilter                        | 处理 X509 认证                                           | NO           |
| AbstractPreAuthenticatedProcessingFilter        | 处理预认证问题                                           | NO           |
| CasAuthenticationFilter                         | 处理 CAS 单点登录                                        | NO           |
| OAuth2LoginAuthenticationFilter                 | 处理 OAuth2 认证                                         | NO           |
| Saml2WebSsoAuthenticationFilter                 | 处理 SAML 认证                                           | NO           |
| `UsernamePasswordAuthenticationFilter`          | 处理表单登录                                             | YES          |
| OpenIDAuthenticationFilter                      | 处理 OpenID 认证                                         | NO           |
| `DefaultLoginPageGeneratingFilter`              | 配置默认登录页面                                         | YES          |
| `DefaultLogoutPageGeneratingFilter`             | 配置默认注销页面                                         | YES          |
| ConcurrentSessionFilter                         | 处理 Session 有效期                                      | NO           |
| DigestAuthenticationFilter                      | 处理 HTTP 摘要认证                                       | NO           |
| BearerTokenAuthenticationFilter                 | 处理 OAuth2 认证的 Access Token                          | NO           |
| `BasicAuthenticationFilter`                     | 处理 HttpBasic 登录                                      | YES          |
| `RequestCacheAwareFilter`                       | 处理请求缓存                                             | YES          |
| `SecurityContextHolder<br />AwareRequestFilter` | 包装原始请求                                             | YES          |
| JaasApiIntegrationFilter                        | 处理 JAAS 认证                                           | NO           |
| RememberMeAuthenticationFilter                  | 处理 RememberMe 登录                                     | NO           |
| `AnonymousAuthenticationFilter`                 | 配置匿名认证                                             | YES          |
| OAuth2AuthorizationCodeGrantFilter              | 处理OAuth2认证中授权码                                   | NO           |
| `SessionManagementFilter`                       | 处理 session 并发问题                                    | YES          |
| `ExceptionTranslationFilter`                    | 处理认证/授权中的异常                                    | YES          |
| `FilterSecurityInterceptor`                     | 处理授权相关                                             | YES          |
| SwitchUserFilter                                | 处理账户切换                                             | NO           |

可以看出，Spring Security 提供了 30 多个过滤器。默认情况下Spring Boot 在对 Spring Security 进入自动化配置时，会创建一个名为 SpringSecurityFilerChain 的过滤器，并注入到 Spring 容器中，这个过滤器将负责所有的安全管理，包括用户认证、授权、重定向到登录页面等。具体可以参考WebSecurityConfiguration的源码:

![image-20221011214845313](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20221011214845313.png)

![image-20221011214903430](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20221011214903430.png)

