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

## 自定义认证

### 自定义资源权限认证规则

> 在引入security后，如果没有进行配置，则security就会使用默认认证规则，将所有请求都进行拦截。

要想实现自定义资源认证规则，就需要自定义资源配置规则，在项目中添加security配置类

```java
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    //自定义security配置
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //资源权限管理
        http.authorizeRequests()//开启权限配置
                .mvcMatchers("/index").permitAll()//放行资源
                .mvcMatchers("/home").authenticated()//需要认证的资源
                .anyRequest().authenticated();//所有资源都需要进行认证 ，放行资源必须放在该配置之前
        	
        //认证方式
        http.formLogin();//不加上该配置·访问受限资源，直接出现错误页面，没有默认的登录页面
    }
}
```

### 自定义登录界面

在security在访问受限资源时会跳转到默认登录页面。在实际开发时默认登录页面不满足需要，就需要自定义登录页面。

**在常规前后端不分离项目中进行自定义登录界面：**

1. 修改security配置类，进行自定义登录界面的配置。

```java
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    //自定义security配置
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //资源权限管理
        http.authorizeRequests()//开启权限配置
                .mvcMatchers("/goLogin").permitAll()//放行去登录页面的请求
                .mvcMatchers("/goError").permitAll()//放行去error页面的请求
                .mvcMatchers("/index").permitAll()//放行资源
                .mvcMatchers("/home").authenticated()//需要认证的资源
                .anyRequest().authenticated();//所有资源都需要进行认证
        //认证方式
        http.formLogin()
                //设置登录页面,一旦设置该配置，就必须指定登录的url
                .loginPage("/goLogin")
                //设置登录的url，该url不需要自定义controller，但是必须和登录页面表单action的url一致
                .loginProcessingUrl("/doLogin")
                //设置登录表单用户名的name属性值
                .usernameParameter("uname")
                //设置登录表单密码的name属性值
                .passwordParameter("pwd")
                //设置登录成功后forward(重定向)跳转的url,浏览器地址栏不会改变，同时始终在认证之后跳转到指定请求
//                .successForwardUrl("/home")
                //设置登录成功后redirect(转发)跳转的url，浏览器地址栏会改变，会根据上一个保存请求进行成功跳转 ，可以通过传递第二次参数为false，来使始终跳转到指定请求
                .defaultSuccessUrl("/home");
        //关闭csrf
        http.csrf().disable();
    }
}
```

> successForwardUrl和defaultSuccessUrl两个方法都可以实现成功之后的跳转
>
> * successForwardUrl默认使用orward(重定向)跳转的url,浏览器地址栏不会改变，同时始终在认证之后跳转到指定请求
> * defaultSuccessUrl默认使用redirect(转发)跳转的url，浏览器地址栏会改变，会根据上一个保存请求进行成功跳转 ，可以通过传递第二次参数为false，来使始终跳转到指定请求

2. 先引入thymeleaf依赖

```xml
<dependency>
        <groupId>org.springframework.boot</groupId>
         <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

thymeleaf默认是开启缓存的，所以要想修改后页面直接生效，就需要修改thymeleaf配置，关闭缓存

```properties
# 设置thymeleaf缓存
spring.thymeleaf.cache=false
```

3. 根据配置类中的配置创建一个登录页面

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>用户登录</title>
</head>
<body>
    <h1>用户登录</h1>
    <form method="post" th:action="@{/doLogin}">
        用户名:<input type="text" name="uname"><br>
        密 码:<input type="text" name="pwd"><br>
        <input type="submit" value="登录">
    </form>
</body>
</html>
```

**注意：**

* 要在页面中添加上` xmlns:th="http://www.thymeleaf.org"`

4. 定义一个跳转到登录页的controller

```java
@Controller
public class LoginController {
    @RequestMapping("/login.html")
    public String login() {
        return "login";
    }
}
```

### 自定义登录成功后处理，来实现前后的分离项目使用

successForwardUrl和defaultSuccessUrl两个方法只能在传统项目中实现登录成功之后，通过系统中controller实现系统中页面跳转，但是在前后端分离项目中，登录成功后往往需要给前端返回一个JSON数据，successForwardUrl和defaultSuccessUrl两个方法就不能实现。

此时就需要通过自定义`AuthenticationSuccessHandler`实现类

**具体实现：**

1. 首先修改Security配置类，不在使用successForwardUrl和defaultSuccessUrl两个方法来进行登录成功后处理，而使用` successHandler()`方法。
2. 自定义`AuthenticationSuccessHandler`实现类MyAuthenticationSuccessHandler

```java
/**
 * 自定义认证成功之后的处理
 * @author: DW 
 */
public class MyAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        Map<String,Object> result = new HashMap<>();
        result.put("msg","登录成功");
        result.put("status",200);
        result.put("认证数据",authentication);
        response.setContentType("application/json;charset=utf-8");
        String s=new ObjectMapper().writeValueAsString(result);
        response.getWriter().write(s);
    }
}
```

### 自定义登录失败处理

SpringSecurity也可以在配置类中进行配置，实现登录失败的页面跳转

**配置一：**

```java
   //登录失败处理，传入登录失败要跳转的页面处理url
     .failureUrl("/goError");
```

这种方法的处理，是使用redirect(转发)跳转的url，还会将错误信息封装到Session中的`SPRING_SECURITY_LAST_EXCEPTION`中，错误信息获取方法：

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>登录失败页面</title>
</head>
<body>
    <h1>登录失败跳转的页面</h1>
    失败原因：<h1 th:text="${session.SPRING_SECURITY_LAST_EXCEPTION}"></h1>
</body>
</html>
```

**配置二：**

```java
//登录失败处理传入登录失败要跳转的页面处理url
.failureForwardUrl("/goError");
```

这种方法的处理，是使用forward(重定向)跳转的url，还会将错误信息封装到request中的`SPRING_SECURITY_LAST_EXCEPTION`中，错误信息获取方法：

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>登录失败页面</title>
</head>
<body>
    <h1>登录失败跳转的页面</h1>
    失败原因：<h1 th:text="${SPRING_SECURITY_LAST_EXCEPTION}"></h1>
</body>
</html>
```

### 自定义登录失败后处理，来实现前后的分离项目使用

failureUrl和failureForwardUrl两个方法只能在传统项目中实现登录失败之后，通过系统中controller实现系统中页面跳转，但是在前后端分离项目中，登录失败后往往需要给前端返回一个JSON数据，failureUrl和failureForwardUrl两个方法就不能实现。

此时就需要通过自定义`AuthenticationFailureHandler`实现类

**具体实现：**

1. 首先修改Security配置类，不在使用failureUrl和failureForwardUrl两个方法进行登录失败后处理，而使用` failureHandler()`方法。
2. 自定义`AuthenticationFailureHandler`实现类MyAuthenticationFailureHandler

```java
/**
 * 自定义登录失败后的处理
 * @author: DW 
 */
public class MyAuthenticationFailureHandler implements AuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        Map<String,Object> result = new HashMap<>();
        result.put("msg","登录失败，失败原因："+exception.getMessage());
        result.put("status",500);
        response.setContentType("application/json;charset=utf-8");
        String s=new ObjectMapper().writeValueAsString(result);
        response.getWriter().write(s);
    }
}
}
```

### 注销登录

> security默认是开启了注销登录的操作，并且默认注销为/logout，请求方式为GET

**配置注销登录：**

```java
 //设置注销
        http.logout()
                .logoutUrl("/logout")//设置退出登录的url，默认请求为/logout，默认请求方式为get
                .invalidateHttpSession(true)//设置退出登录时清除session，默认值就是true
                .clearAuthentication(true)//设置退出登录时，清除当前认证标记，默认值就是true
                .logoutSuccessUrl("/goLogin");//设置注销成功之后访问的页面
        
```

**配置多个注销登录请求：**

```java
 //设置注销
        http.logout()
                //配置多个注销登录请求，同时设置请求方式
                .logoutRequestMatcher(new OrRequestMatcher(
                        new AntPathRequestMatcher("/logout","GET"),
                        new AntPathRequestMatcher("/goLogout","POST")
                ))
                .invalidateHttpSession(true)//设置退出登录时清除session，默认值就是true
                .clearAuthentication(true)//设置退出登录时，清除当前认证标记，默认值就是true
                .logoutSuccessUrl("/goLogin");//设置注销成功之后访问的页面
        
```

自定义注销登录后处理，来实现前后的分离项目使用

在前后的分离项目中，注销成功之后就不需要进行页面跳转，只需要返回一个JSON数据来说明注销登录成功即可。

此时就需要在配置类中使用`logoutSuccessHandler`方法，然后通过自定义`LogoutSuccessHandler`实现类来返回Json数据。

```java
public class MyLogoutSuccessHandler implements LogoutSuccessHandler {
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        Map<String,Object> result = new HashMap<>();
        result.put("msg","注销登录成功");
        result.put("status",200);
        response.setContentType("application/json;charset=utf-8");
        String s=new ObjectMapper().writeValueAsString(result);
        response.getWriter().write(s);
    }
}
```

## 登录用户数据获取

Spring Security会将登录用户数据保存在Session中。但是，为了使用方便,Spring Security在此基础上还做了一些改进，其中最主要的-一个变化就是线程绑定。当用户登录成功后,Spring Security会将登录成功的用户信息保存到SecurityContextHolder中。

SecurityContextHolder中的数据保存默认是通过ThreadLocal来实现的，使用ThreadLocal创建的变量只能被当前线程访问，不能被其他线程访问和修改，也就是用户数据和请求线程绑定在一起。 当登录请求处理完毕后，Spring Security会将SecurityContextHolder中的数据拿出来保存到Session中，同时将SecurityContexHolder中的数据清空。以后每当有请求到来时，Spring Security就会先从Session中取出用户登录数据，保存到SecurityContextHolder中，方便在该请求的后续处理过程中使用，同时在请求结束时将SecurityContextHolder中的数据拿出来保存到Session中，然后将SecurityContextHolder中的数据清空。

实际上SecurityContextHolder中存储是SecurityContext,。在SecurityContext中存储是Authentication。

![image-20221013222244228](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20221013222244228.png)



在SecurityContextHolder类中有一个setContext方法来设置上下文对象方法，和一个getContext方法来获取上下文对象方法

```java
//SecurityContextHolder类中获取上下文方法
public static SecurityContext getContext() {
		return strategy.getContext();   //根据SecurityContextHolder中的策略来获取上下文对象
}

private static SecurityContextHolderStrategy strategy;
```

**策略说明：**SecurityContextHolderStrategy用来定义存储策略方法

```java
//SecurityContextHolder中获取上下文对象的策略
public interface SecurityContextHolderStrategy {
	//用来清除存储的SecurityContext对象
	void clearContext();
	//用来获取存储的SecurityContext对象
	SecurityContext getContext();
	//用来设置存储的SecurityContext对象
	void setContext(SecurityContext context);
	//用来创建一个空的SecurityContext对象
	SecurityContext createEmptyContext();
}
```

策略接口的实现类和接口对应策略

![image-20221013225342273](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20221013225342273.png)

* ListeningSecurityContextHolderStrategy
* InheritableThreadLocalSecurityContextHolderStrategy
* GlobalSecurityContextHolderStrategy
* ThreadLocalSecurityContextHolderStrategy

1. `MODE_THREADLOCAL` :这种存放策略是将SecurityContext存放在ThreadLocal中,Threadlocal的特点是在哪个线程中存储就要在哪个线程中读取，这其实非常适合web应用，因为在默认情况下，一个请求无论经过多少Filter到达Servlet,都是由一个线程来处理的。这也是SecurityContextHolder的默认存储策略，这种存储策略意味着如果在具体的业务处理代码中，开启了子线程，在子线程中去获取登录用户数据，就会获取不到。
2. `MODE_INHERITABLETHREADLOCAL`：这种存储模式适用于多线程环境，如果希望在子线程中也能够获取到登录用户数据，那么可以使用这种存储模式。
3. `MODE_GLOBAL`：这种存储模式实际上是将数据保存在一个静态变量中，在JavaWeb开发中，这种模式很少使用到。

**修改策略：**

![image-20221013231421262](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20221013231421262.png)

### 在代码中获取用户信息

可以直接SecurityContextHolder中获取SecurityContext然后使用getAuthentication()获取认证信息。通过认证信息获取具体信息

```java
Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
System.out.println("身份信息："+authentication.getPrincipal());
System.out.println("权限信息："+authentication.getAuthorities());
```

**这种方法只适用于单线程**

### 多线程情况下获取用户信息

由于默认策略不支持多线程获取认证信息，因此，先修改参数，使在多线程下依然可以获取用户信息，然后可以直接SecurityContextHolder中获取SecurityContext然后使用getAuthentication()获取认证信息。通过认证信息获取具体信息。

### 传统项目页面获取用户信息

传统项目使用的模板引擎都是thymeleaf，但是无法从thymeleaf直接获取用户认证信息，所有需要引入thymeleaf对security扩展的依赖。

```xml
<!--引入thymeleaf对security扩展的依赖-->
<dependency>
     <groupId>org.thymeleaf.extras</groupId>
     <artifactId>thymeleaf-extras-springsecurity5</artifactId>
     <version>3.0.4.RELEASE</version>
</dependency>                     
```

在页面上添加命名空间

```html
<html lang="en" xmlns:th="http://www.thymeleaf.org"
        xmlns:sec="http://www.thymeleaf.org/extras/spring-security">
```

此时就可以直接使用thymeleaf对security扩展的依赖的命名空间来获取用户认证信息。

```html
 <h1>认证用户信息</h1>
 <ul>
     <li sec:authentication="principal.username"></li>
     <li sec:authentication="principal.authorities"></li>
     <li sec:authentication="principal.accountNonExpired"></li>
     <li sec:authentication="principal.accountNonLocked"></li>
     <li sec:authentication="principal.credentialsNonExpired"></li>
 </ul>
```

## 自定义认证数据源

### 认证流程分析

![image-20221014153215056](https://raw.githubusercontent.com/DW62/ImgStg/master/202210141532176.png)

1. 发起认证请求，请求中携带用户名、密码，该请求会被`UsernamePasswordAuthenticationFilter`拦截。

2. 在`UsernamePasswordApthenticationFilter`的`attemptAuthentication`方法中将
   请求中用户名和密码，封装为`Authentication`对象，并交给`AuthenticationManager`进行认证。
3. 认证成功，将认证信息存储到SecurityContextHodler以及调用记住我等，并回调
   `AuthenticationSuccessHandler`处理。
4. 认证失败，清除SecurityContextHolder以及记住我中的信息，回调`AuthenticationFailurHandler`处理。

在进行认证时 AuthenticationManager 是认证的核心类，但实际上在底层真正认证时
还离不开ProviderManager以及AuthenticationProvider 

**三者关系**

* AuthenticationManager是一个认证管理器，它定义了Spring Security过滤器要执行
  认证操作。
* ProviderManager  AuthenticationManager 接口的实现类。 Spring Security认证时默认使
  用就是ProviderManager.
* AuthenticationProvider就是针对不同的身份类型执行的具体的身份认证。

**AuthenticationManager与ProviderManager关系**

![image-20221014154646312](https://raw.githubusercontent.com/DW62/ImgStg/master/202210141546366.png)

ProviderManager 是AuthenticationManager的唯一实现， 也是Spring Security默认使用实
现。从这里不难看出默认情况下AuthenticationManager就是一个ProviderManager。

**ProviderManager与AuthenticationProvider关系**

![image-20221014154924239](https://raw.githubusercontent.com/DW62/ImgStg/master/202210141549320.png)

​		在Spring Seourity中，允许系统同时支持多种不同的认证方式，例如同时支持用户名/密
码认证、RememberMe 认证、手机号码动态认证等，而不同的认证方式对应了不同的AuthenticationProvider，所以一个完整的认证流程 可能由多个AuthenticationProvider来提
供。
​		多个AuthenticationProvider将组成一个列表， 这个列表将由ProviderManager 代理。换句
话说，在ProviderManager 中存在一个AuthenticationProvider列表，在Provider Manager中
遍历列表中的每一个AuthenticationProvider 去执行身份认证，最终得到认证结果。

​		ProviderManager本身也可以再配置一个AuthenticationManager作为parent(父类)，这样当
ProviderManager认证失败之后，就可以进入到parent(父类)中再次进行认证。理论上来说，
ProviderManager的parent可以是任意类型的AuthenticationManager，但是通常都是由ProviderManager来扮演parent的角色，也就是ProviderManager 是ProviderManager的
parent(父类)。

​		ProviderManager本身也可以有多个，多个ProviderManager 共用同一个parent。有时，一
个应用程序有受保护资源的逻辑组(例如，所有符合路径模式的网络资源，如/api**) ，每个组可以有自己的专用AuthenticationManager。通常每个组都是一个ProviderManager，它们共享一个父级。然后父级是一种全局资源，作为所有提供者的后备资源。

​		根据上面的介绍，我们绘出新的AuthenticationManager. ProvideManager 和AuthentictionProvider关系

![image-20221014160253805](https://raw.githubusercontent.com/DW62/ImgStg/master/202210141602875.png)

弄清楚认证原理之后我们来看下具体认证时数据源的获取。默认情况下AuthenticationProvider是由DaoAuthenticationProvider 类来实现认证的，在DaoAuthenticationProvider认证时又通过UserDetailsService 完成数据源的校验。他们之间调用关系如下:

![image-20221014160434481](https://raw.githubusercontent.com/DW62/ImgStg/master/202210141604544.png)

**总结：** AuthenticationManager是认证管理器，在Spring Security中有全局AuthenticationManager，也可以有局部的AuthenticationManager。全局的AuthenticationManager用来对全局认证进行处理，局部的AuthenticationManager用来对某 些特殊资源认证处理。

当然无论是全局认证管理器还是局部认证管理器都是由ProviderManger 进行实现。每一个ProviderManger中都代理一个AuthenticationProvider的列表， 列表中每一个实现代表一种身
份认证方式。**认证时底层数据源需要调用UserDetailService来实现**。

### 配置全局AuthenticationManager

**方法一：** SpringBoot对Security默认配置中，在工厂中默认创建有AuthenticationManager，所有可以直接使用默认创建的

```java
  //SpringBoot对Security默认配置中，在工厂中默认创建有AuthenticationManager
    @Autowired
    public void initialize(AuthenticationManagerBuilder builder) throws Exception {
        System.out.println("SpringBoot默认配置："+builder);
        //创建一个基于内存的数据源，当然也可以创建其他的数据源
        InMemoryUserDetailsManager userDetailsManager = new InMemoryUserDetailsManager();
        userDetailsManager.createUser(User.withUsername("user").password("{noop}123").roles("admin").build());
        //构建数据源方法
        builder.userDetailsService(userDetailsService());
    }
```

当然，用于在Security的代码中，只要在代码中存在UserDetailsService，就会不会使用默认的，并且会自动把自己创建的UserDetailsService给赋值给工厂中默认创建有AuthenticationManager。

以此，只需要在代码中自己注入一个UserDetailsService的实现，就可以，**不需要上面的代码。改为自己注入一个UserDetailsService的实现**

```java
 //注入一个  自己UserDetailsService实现
@Bean
public UserDetailsService userDetailsService(){
    //创建一个基于内存的数据源，当然也可以创建其他的数据源
    InMemoryUserDetailsManager userDetailsService = new InMemoryUserDetailsManager();
    userDetailsService.createUser(User.withUsername("user").password("{noop}123").roles("admin").build());
        return userDetailsService;
    }
```

**方法二：** 自定义AuthenticationManager,如果有自定义的，则就会默认覆盖掉默认的

```java
//自定义AuthenticationManager,如果有自定义的，则就会默认覆盖掉默认的,必须自己传入UserDetailsService实现
@Override
public void configure(AuthenticationManagerBuilder builder) throws Exception {
        System.out.println("自定义AuthenticationManager："+builder);
        builder.userDetailsService("传入UserDetailsService实现");
}
```

自定义AuthenticationManager总结：
1. 一旦通过configure方法自定义AuthenticationManager实现就会将工厂中自动配置AuthenticationManager进行覆盖。
2. 一旦通过configure方法自定义AuthenticationManager实现需要在实现中指定认证数据源对象UserDetaiService实例。
3. 一旦通过 configure方法自定义AuthenticationManager实现这种方式创建AuthenticationManager对象工厂内部本地一个AuthenticationManager对象不允许在其他自定义组件中进行注入。

**在工厂中暴露AuthenticationManager解决方法：**

```java
//将自定义的AuthenticationManager在工厂中进行暴露，暴露之后就可以在位置注入AuthenticationManager
    @Override
	@Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
```

## 认证实践

### 传统Web项目认证

1. 创建一个SpringBoot项目
2. 引入依赖，基础依赖

```xml
 	<dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
<!--security的依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
  <!--引入thymeleaf的依赖-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
<!--引入thymeleaf对security扩展的依赖-->
        <dependency>
            <groupId>org.thymeleaf.extras</groupId>
            <artifactId>thymeleaf-extras-springsecurity5</artifactId>
            <version>3.0.4.RELEASE</version>
        </dependency>
```

3. 编写配置文件

```yml
server:
  port: 8081   #设置端口号

spring:
  thymeleaf:
    cache: false #关闭thymeleaf缓存
    prefix: classpath:/templates/
    suffix: .html
    encoding: utf-8
```

4. 创建security配置类

```java
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    //自定义配置规则
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //配置认证规则
        http.authorizeRequests()
                .mvcMatchers("/goLogin").permitAll()//放行去登录页面请求
                .anyRequest().authenticated();//所有请求都需要进行认证
        //配置认证方式
        http.formLogin()
                .loginPage("/goLogin")//指定登录页面
                .loginProcessingUrl("/doLogin")//指定登录表单请求url
                .usernameParameter("uanme")//指定登录表单用户名的name值
                .passwordParameter("passwd")//指定登录表单密码的name值
                .defaultSuccessUrl("/goIndex")//指定登录成功后跳转的url
                ;
        //关闭csrf
        http.csrf().disable();
    }
}
```

5. 根据security配置类来创建一个MVC配置类，将需要使用的controller和页面进行绑定

```java
@Configuration
public class MvcConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        //添加视图和定义的控制器
        registry.addViewController("/goLogin").setViewName("login");
        registry.addViewController("/goIndex").setViewName("index");
    }
}
```

6. 根据security配置类和MVC配置来创建需要的页面

​			登录页面：

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org" xmlns="http://www.w3.org/1999/html">
<head>
    <meta charset="UTF-8">
    <title>登录页面</title>
</head>
<body>
    <h1>用户登录</h1>
    <form method="post" th:action="@{/doLogin}">
        用户名：<input name="uanme" type="text"></br>
        密码：<input name="passwd" type="text"></br>
        <input type="submit" value="登录">
    </form>
</body>
</html>
```

​			index页面

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>首页</title>
</head>
<body>
    <h1>首页</h1>
</body>
</html>
```

7. 登录成功后可以从代码中直接在SecurityContextHolder中获取登录用户的信息

```java
 @GetMapping("/getUserInfo")
    public String getUserInfo() {
        //1.登录成功后，用户的数据会存放到SecurityContextHolder中
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //获取用户数据
        User user = (User) authentication.getPrincipal();
        System.out.println("用户名："+user.getUsername());
        System.out.println("密码："+user.getPassword());
        System.out.println("用户权限信息："+user.getAuthorities());
        return "";
    }
```

从页面获取登录用户信息，默认thymeleaf无法获取security用户信息，可以在页面引入thymeleaf对security扩展的依赖的命名就可以获取。修改index页面获取用户信息

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org"
      xmlns:sec="http://www.thymeleaf.org/extras/spring-security">
<head>
    <meta charset="UTF-8">
    <title>首页</title>
</head>
<body>
    <h1>首页</h1>
    <ul>
        <li sec:authentication="principal.username"></li>
        <li sec:authentication="principal.authorities"></li>
        <li sec:authentication="principal.accountNonExpired"></li>
        <li sec:authentication="principal.accountNonLocked"></li>
        <li sec:authentication="principal.credentialsNonExpired"></li>
    </ul>
</body>
</html>
```

8. 配置退出登录，在security配置中添加

```java
 //配置退出登录
        http.logout()
                .logoutUrl("/logout")//配置退出登录url
                .logoutSuccessUrl("/goLogin");//配置退出登录成功后的跳转
```

在首页添加退出连接

```html
 <a th:href="@{/logout}">退出登录</a>
```

9. 自定义数据源

使用自定义的自定义AuthenticationManager，来说明数据源。在security配置类中自定义AuthenticationManager

```java
//自定义AuthenticationManager,如果有自定义的，则就会默认覆盖掉默认的
    @Override
    public void configure(AuthenticationManagerBuilder builder) throws Exception {
        System.out.println("自定义AuthenticationManager："+builder);
        builder.userDetailsService(myUserDetailsService);
    }
```

**配置基于内存的数据源**，在security配置类中自定义内存的UserDetailsService

```java
   @Bean
    public UserDetailsService userDetailsService(){
        //创建一个基于内存的数据源，当然也可以创建其他的数据源
        InMemoryUserDetailsManager userDetailsService = new InMemoryUserDetailsManager();
        userDetailsService.createUser(User.withUsername("user").password("{noop}123").roles("admin").build());
        return userDetailsService;
    }
```

**配置基于数据的数据源**

添加依赖

```xml
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
            <version>3.5.0</version>
        </dependency>
        <!--lombok依赖-->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
```

添加数据库连接配置文件

```yml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://39.105.29.9:3306/security?serverTimezone=UTC&useUnicode=true&characterEncoding=utf8&useSSL=false
    username: root
    password: root
```

首先自定义实现UserDetailsService接口的loadUserByUsername方法

```java
/**
 * 自定义实现根据数据数据登录
 */
@Component
public class MyUserDetailsService  implements UserDetailsService {
    @Resource
    private UserInfoService userInfoService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //根据用户名查询用户
        UserInfo userInfo=userInfoService.getOne(new QueryWrapper<UserInfo>().eq("username",username));
        if (ObjectUtils.isEmpty(userInfo))throw new UsernameNotFoundException("用户不存在！");
        //根据用户ID查询用户角色信息
        List<RoleInfo> roles = userInfoService.getRolesByUId(userInfo.getId());
        return new MyUserDetails(userInfo,roles);
    }
}
```

由于loadUserByUsername方法返回为UserDetails对象，所以还需要自定义实现UserDetails

```java
public class MyUserDetails implements UserDetails {
    private UserInfo userInfo;
    private List<RoleInfo> roles=new ArrayList<>();  //用户角色列表
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<SimpleGrantedAuthority> authorities=new HashSet<>();
        roles.forEach(roleInfo -> {
            SimpleGrantedAuthority simpleGrantedAuthority=new SimpleGrantedAuthority(roleInfo.getRoleKey());
            authorities.add(simpleGrantedAuthority);
        });
        return authorities;
    }

    @Override
    public String getPassword() {
        return userInfo.getPassword();
    }

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

    public MyUserDetails() {
    }

    public MyUserDetails(UserInfo userInfo) {
        this.userInfo = userInfo;
    }

    public MyUserDetails(UserInfo userInfo, List<RoleInfo> roles) {
        this.userInfo = userInfo;
        this.roles = roles;
    }

    public UserInfo getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(UserInfo userInfo) {
        this.userInfo = userInfo;
    }

    public List<RoleInfo> getRoles() {
        return roles;
    }

    public void setRoles(List<RoleInfo> roles) {
        this.roles = roles;
    }
}
```

3. 需要将自定义的UserDetailsService声明到Security配置类,使Security不使用默认的查询方式

```java
//将自定义的UserDetailsService声明,来实现根据数据查询
    @Resource
    private MyUserDetailsService myUserDetailsService;
 //自定义AuthenticationManager,如果有自定义的，则就会默认覆盖掉默认的
    @Override
    public void configure(AuthenticationManagerBuilder builder) throws Exception {
        System.out.println("自定义AuthenticationManager："+builder);
        builder.userDetailsService(myUserDetailsService);
    }
```



