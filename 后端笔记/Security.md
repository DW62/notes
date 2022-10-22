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

​		在Spring Seourity中，允许系统同时支持多种不同的认证方式，例如同时支持用户名/密码认证、RememberMe 认证、手机号码动态认证等，而不同的认证方式对应了不同的AuthenticationProvider，所以一个完整的认证流程 可能由多个AuthenticationProvider来提供。
​		多个AuthenticationProvider将组成一个列表， 这个列表将由ProviderManager 代理。换句话说，在ProviderManager 中存在一个AuthenticationProvider列表，在Provider Manager中遍历列表中的每一个AuthenticationProvider 去执行身份认证，最终得到认证结果。

​		ProviderManager本身也可以再配置一个AuthenticationManager作为parent(父类)，这样当ProviderManager认证失败之后，就可以进入到parent(父类)中再次进行认证。理论上来说，ProviderManager的parent可以是任意类型的AuthenticationManager，但是通常都是由ProviderManager来扮演parent的角色，也就是ProviderManager 是ProviderManager的parent(父类)。

​		ProviderManager本身也可以有多个，多个ProviderManager 共用同一个parent。有时，一个应用程序有受保护资源的逻辑组(例如，所有符合路径模式的网络资源，如/api**) ，每个组可以有自己的专用AuthenticationManager。通常每个组都是一个ProviderManager，它们共享一个父级。然后父级是一种全局资源，作为所有提供者的后备资源。

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

### 前后端分离项目实现认证

在security中默认使用的是UsernamePasswordAuthenticationFilter中的attemptAuthentication方法来实现表单认证，但是该方法获取请求参数是从登录表单中获取用户认证参数，但是在前端后端分离项目中，前端给后端的数据封装在json中，默认的UsernamePasswordAuthenticationFilter中的attemptAuthentication方法就无法获取用户认证的数据，所有需要自定义类来实现UsernamePasswordAuthenticationFilter并重写attemptAuthentication方法，来获取认证数据进行认证,来实现前后端分离项目认证

**自定义实现前后端分离的认证Filter**

```java
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        //1.判断请求方式是否的post
        if (!request.getMethod().equals("POST")) {
            throw new AuthenticationServiceException("不支持身份验证方法: " + request.getMethod());
        }
        //2.判断是否是json格式的请求
        if(request.getContentType().equalsIgnoreCase(MediaType.APPLICATION_JSON_VALUE)){
            //3.从json数据中获取用户名和密码进行认证
            try {
                //将请求中的json数据进行序列化为map对象
                Map<String, String>  userInfo= new ObjectMapper().readValue(request.getInputStream(), Map.class);
                //获取请求中的用户名数据
                String username = userInfo.get(getUsernameParameter());
                String password = userInfo.get(getPasswordParameter());
                System.out.println("用户名："+username+"密码："+password);
                //仿照security默认的UsernamePasswordAuthenticationFilter将用户名和密码封装到UsernamePasswordAuthenticationToken
                UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(username, password);
                setDetails(request, authRequest);
                return this.getAuthenticationManager().authenticate(authRequest);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return super.attemptAuthentication(request,response);
    }
}
```

在seucurity配置类中完成配置实现认证

```java
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    //设置内存用户数据
    @Bean
    public UserDetailsService userDetailsService(){
        InMemoryUserDetailsManager inMemoryUserDetailsManager=new InMemoryUserDetailsManager();
        inMemoryUserDetailsManager.createUser(User.withUsername("123").password("{noop}123").roles("admin").build());
        return inMemoryUserDetailsManager;
    }
    //自定义AuthenticationManager
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService());
    }
    //默认AuthenticationManager是需要进行暴露处理，才可以使用
    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    //注入自定义的实现前后端分离的认证file
    @Bean
    public LoginFilter loginFilter() throws Exception {
        LoginFilter loginFilter=new LoginFilter();
        //设置进行认证的url
        loginFilter.setFilterProcessesUrl("/securityLogin");
        //设置认证json中的用户名的key
        loginFilter.setUsernameParameter("username");
        //设置认证json中的密码的key
        loginFilter.setPasswordParameter("password");
        //设置实现认证的AuthenticationManager,这里设置为自定义的AuthenticationManager
        loginFilter.setAuthenticationManager(authenticationManagerBean());
        //设置认证成功后的处理
        loginFilter.setAuthenticationSuccessHandler((req,resp,authentication)->{
            Map<String,Object> result=new HashMap<String,Object>();
            result.put("msg","登陆成功");
            result.put("用户信息",authentication.getPrincipal());
            resp.setContentType("application/json;charset=UTF-8");
            resp.setStatus(HttpStatus.OK.value());//设置请求成功后的状态
            String s = new ObjectMapper().writeValueAsString(result);
            resp.getWriter().println(s);
        });
        //设置认证是吧后的处理
        loginFilter.setAuthenticationFailureHandler((req,resp,ex)->{
            Map<String,Object> result=new HashMap<String,Object>();
            result.put("msg","登陆失败："+ex.getMessage());
            resp.setContentType("application/json;charset=UTF-8");
            resp.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());//设置请求失败后的状态
            String s = new ObjectMapper().writeValueAsString(result);
            resp.getWriter().println(s);
        });
        return loginFilter;
    };
    //自定义security配置
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //授权配置
        http.authorizeHttpRequests()
                .anyRequest().authenticated();//所有请求都需要进行认证
        //配置认证方式
        http.formLogin();
        //配置退出设置
        http.logout()
                .logoutUrl("/logout")//设置退出代理请求url，默认git /logout
                .logoutSuccessHandler((req,resp,authentication)->{
                    Map<String,Object> result=new HashMap<String,Object>();
                    result.put("msg","注销成功");
                    result.put("用户信息",authentication.getPrincipal());
                    resp.setContentType("application/json;charset=UTF-8");
                    resp.setStatus(HttpStatus.OK.value());//设置请求成功后的状态
                    String s = new ObjectMapper().writeValueAsString(result);
                    resp.getWriter().println(s);
                });//设置退出后处理
        //设置异常处理
        http.exceptionHandling()
                .authenticationEntryPoint((req,resp,ex)->{
                    resp.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);//设置响应类型为json
                    resp.setStatus(HttpStatus.UNAUTHORIZED.value());//设置未认证状态
                    resp.getWriter().println("请认证之后在去处理");
                });//设置为授权异常处理
        //关闭csrf
        http.csrf().disable();
        //配置过滤器链
        //将UsernamePasswordAuthenticationFilter过滤器替换为自定义的
        http.addFilterAt(loginFilter(), UsernamePasswordAuthenticationFilter.class);
    }
}
```

此时就可以实现前后端分离的基于内存数据的认证

**将内存数据替换为数据库数据**

和传统Web项目认证中转化为数据库数据方法一样。

## 添加验证码

引入谷歌开源的kaptcha生成验证码依赖

```xml
<dependency>
      <groupId>com.github.penggle</groupId>
      <artifactId>kaptcha</artifactId>
      <version>2.3.2</version>
</dependency>
```

创建kaptcha的配置类

```java
@Configuration
public class KaptchaConfig {
    @Bean
    public Producer kaptcha(){
        Properties properties=new Properties();
        //设置验证码的宽度
        properties.setProperty("Kaptcha.image.width","150");
        //设置验证码的高度
        properties.setProperty("Kaptcha.image.height","50");
        //设置验证码展示的字
        properties.setProperty("Kaptcha.textoroducer.char.string","012345678");
        //设置验证码的长度
        properties.setProperty("Kaptcha.textoroducer.char.length","4");
        Config config=new Config(properties);
        DefaultKaptcha defaultKaptcha=new DefaultKaptcha();
        defaultKaptcha.setConfig(config);
        return defaultKaptcha;
    }
}
```

### 传统web项目添加验证码

创建一个controller请求来生成验证码并返回

```java
@Controller
public class VerifyCodeController {
    //注入配置了
    @Resource
    private  Producer producer;

    @RequestMapping("/getVc")
    public void verifyCode(HttpServletResponse response, HttpSession session) throws IOException {
        //生成验证码
        String verifyCode = producer.createText();
        //保存生成的验证码，session或者redis中都可以
        session.setAttribute("kaptcha",verifyCode);
        //生成图片
        BufferedImage image = producer.createImage(verifyCode);
        //响应验证码
        response.setContentType("image/jpg");//设置响应类型
        ServletOutputStream os = response.getOutputStream();
        ImageIO.write(image,"jpg",os);
    }
}
```

生成验证码的请求不需要进行认证就可以访问，所以还需要将该请求进行放行。

在页面添加验证码生成

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
        验证码：<input name="kaptcha" type="text"> <img th:src="@{/getVc}"><br>
        <input type="submit" value="登录">
    </form>
</body>
</html>
```

自定义一个验证码的认证过滤器，使其替换UsernamePasswordAuthenticationFilter，使其先进行验证码的认证，在进行用户名和密码的认证。

```java
public class KcptchaFilter extends UsernamePasswordAuthenticationFilter {
    //定义一个静态常量来表示表单验证码的name属性值
    private static final String FROM_KAPTCHA_KEY="kaptcha";
    private String kaptchaParamerter=FROM_KAPTCHA_KEY;

    public String getKaptchaParamerter() {
        return kaptchaParamerter;
    }

    public void setKaptchaParamerter(String kaptchaParamerter) {
        this.kaptchaParamerter = kaptchaParamerter;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        //1判断请求方式是否为post
        if(!request.getMethod().equals("POST")){
            throw new AuthenticationServiceException("请求方式必须为POST");
        }
        //从请求中获取验证码
        String verifyCode = request.getParameter(getKaptchaParamerter());
        //获取保存的验证码
        String sessionVerifyCode = (String) request.getSession().getAttribute("kaptcha");
        //进行比较
        if (!ObjectUtils.isEmpty(verifyCode) && !ObjectUtils.isEmpty(sessionVerifyCode) && verifyCode.equalsIgnoreCase(sessionVerifyCode)){
            //如果用户传来的验证码和保存的一致，则之间执行父类的认证
            return super.attemptAuthentication(request, response);
        }
        throw new KaptchaNotMatchException("验证码不匹配！");
    }
}
```

自定义一个验证码错误的异常

```java
public class KaptchaNotMatchException extends AuthenticationException {
    public KaptchaNotMatchException(String msg, Throwable cause) {
        super(msg, cause);
    }
    public KaptchaNotMatchException(String msg) {
        super(msg);
    }
}
```

修改security配置类使其自定义的验证码认证过滤器替换UsernamePasswordAuthenticationFilter

```java
//注入认证管理器,必须之间注入
    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
//注入自定义验证码验证过滤器
	@Bean
    public KcptchaFilter kcptchaFilter() throws Exception {
        KcptchaFilter kcptchaFilter=new KcptchaFilter();
        //设置认证请求地址
        kcptchaFilter.setFilterProcessesUrl("/doLogin");
        //设置认证用户名的name
        kcptchaFilter.setUsernameParameter("uanme");
        //设置认证密码的name
        kcptchaFilter.setPasswordParameter("passwd");
        //设置验证码的name
        kcptchaFilter.setKaptchaParamerter("kaptcha");
        //指定认证管理器
        kcptchaFilter.setAuthenticationManager(authenticationManagerBean());
        //指定认证成功处理器
        kcptchaFilter.setAuthenticationSuccessHandler((req,resp,auth)->{
            resp.sendRedirect("/goIndex");
        });
        //指定认证失败处理
        kcptchaFilter.setAuthenticationFailureHandler((req,resp,ex)->{
            resp.sendRedirect("/goLogin");
        });
        return kcptchaFilter;
    }
```

configure(HttpSecurity http)方法配置

```Java
//自定义配置规则
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //配置认证规则
        http.authorizeRequests()
                .mvcMatchers("/goLogin").permitAll()//放行去登录页面请求
                .mvcMatchers("/getVc").permitAll()//放行生成验证码请求
                .anyRequest().authenticated();//所有请求都需要进行认证
        //配置认证方式
        http.formLogin()
                .loginPage("/goLogin")//指定登录页面
                ;
        //配置退出登录
        http.logout()
                .logoutUrl("/logout")//配置退出登录url
                .logoutSuccessUrl("/goLogin");//配置退出登录成功后的跳转
        //配置过滤器
        http.addFilterAt(kcptchaFilter(), UsernamePasswordAuthenticationFilter.class);
        //关闭csrf
        http.csrf().disable();
    }
```

### 前后端分离时的验证码实现

在前后端分离的项目中，后端给前端返回的是json数据，所以需要创建一个生成base64编码验证码的控制器，并且该控制器方法需要进行放行

```java
/**
 * 用于生成验证码的控制器
 */
@RestController
public class VerifyCodeController {
    //注入配置了
    @Resource
    private Producer producer;

    @GetMapping("/getVc")
    public String verifyCode(HttpSession session) throws IOException {
        //生成验证码
        String verifyCode = producer.createText();
        //保存生成的验证码，session或者redis中都可以
        session.setAttribute("kaptcha",verifyCode);
        //生成图片,将图片转为Bases64
        BufferedImage image = producer.createImage(verifyCode);
        //响应验证码
        FastByteArrayOutputStream fos = new FastByteArrayOutputStream();
        ImageIO.write(image,"jpg",fos);
        return Base64.encodeBase64String(fos.toByteArray());
    }
}
```

生成的base64编码进行转译的时候需要在前面添加上`data:image/png;base64,`

[base64图片在线转换工具 - 站长工具 (chinaz.com)](https://tool.chinaz.com/tools/imgtobase/)

传教自定义认证过滤器，并且在配置类中替换掉UsernamePasswordAuthenticationFilter

```java
/**
 * 自定义实现前后端分离的认证Filter
 */
public class LoginFilter extends UsernamePasswordAuthenticationFilter {
    //定义一个静态常量来表示表单验证码的name属性值
    private static final String FROM_KAPTCHA_KEY="kaptcha";
    private String kaptchaParamerter=FROM_KAPTCHA_KEY;

    public String getKaptchaParamerter() {
        return kaptchaParamerter;
    }
    public void setKaptchaParamerter(String kaptchaParamerter) {
        this.kaptchaParamerter = kaptchaParamerter;
    }
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        //1.判断请求方式是否的post
        if (!request.getMethod().equals("POST")) {
            throw new AuthenticationServiceException("不支持身份验证方法: " + request.getMethod());
        }
        //2.判断是否是json格式的请求
        if(request.getContentType().equalsIgnoreCase(MediaType.APPLICATION_JSON_VALUE)){
            //3.从json数据中获取用户名和密码进行认证
            try {
                //将请求中的json数据进行序列化为map对象
                Map<String, String>  userInfo= new ObjectMapper().readValue(request.getInputStream(), Map.class);
                //获取请求中的用户名数据
                String username = userInfo.get(getUsernameParameter());
                String password = userInfo.get(getPasswordParameter());
                //获取请求中的验证码
                String verifyCode = userInfo.get(getKaptchaParamerter());
                System.out.println("用户名："+username+"密码："+password+"验证码："+verifyCode);
                //获取保存的验证码
                String sessionVerifyCode = (String) request.getSession().getAttribute("kaptcha");
                //进行比较
                if (!ObjectUtils.isEmpty(verifyCode) && !ObjectUtils.isEmpty(sessionVerifyCode) && verifyCode.equalsIgnoreCase(sessionVerifyCode)){
                    //仿照security默认的UsernamePasswordAuthenticationFilter将用户名和密码封装到UsernamePasswordAuthenticationToken
                    UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(username, password);
                    setDetails(request, authRequest);
                    return this.getAuthenticationManager().authenticate(authRequest);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        throw new KaptchaNotMatchException("验证码或用户名密码错误！");
    }
}
```

```java
/**
 * Security配置类
 */
@Configuration
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    //设置基于数据库的数据
    @Resource
    private MyUserDetailsService myUserDetailsService;
    //自定义AuthenticationManager
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {

        auth.userDetailsService(myUserDetailsService);
    }
    //默认AuthenticationManager是需要进行暴露处理，才可以使用
    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    //注入自定义的实现前后端分离的认证file
    @Bean
    public LoginFilter loginFilter() throws Exception {
        LoginFilter loginFilter=new LoginFilter();
        //设置进行认证的url
        loginFilter.setFilterProcessesUrl("/securityLogin");
        //设置认证json中的用户名的key
        loginFilter.setUsernameParameter("username");
        //设置认证json中的密码的key
        loginFilter.setPasswordParameter("password");
        //设置认证json中的验证码的key
        loginFilter.setKaptchaParamerter("verify");
        //设置实现认证的AuthenticationManager,这里设置为自定义的AuthenticationManager
        loginFilter.setAuthenticationManager(authenticationManagerBean());
        //设置认证成功后的处理
        loginFilter.setAuthenticationSuccessHandler((req,resp,authentication)->{
            Map<String,Object> result=new HashMap<String,Object>();
            result.put("msg","登陆成功");
            result.put("用户信息",authentication.getPrincipal());
            resp.setContentType("application/json;charset=UTF-8");
            resp.setStatus(HttpStatus.OK.value());//设置请求成功后的状态
            String s = new ObjectMapper().writeValueAsString(result);
            resp.getWriter().println(s);
        });
        //设置认证是吧后的处理
        loginFilter.setAuthenticationFailureHandler((req,resp,ex)->{
            Map<String,Object> result=new HashMap<String,Object>();
            result.put("msg","登陆失败："+ex.getMessage());
            resp.setContentType("application/json;charset=UTF-8");
            resp.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());//设置请求失败后的状态
            String s = new ObjectMapper().writeValueAsString(result);
            resp.getWriter().println(s);
        });
        return loginFilter;
    };
    //自定义security配置
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //授权配置
        http.authorizeHttpRequests()
                .mvcMatchers("/getVc").permitAll()//放行生成验证码请求
                .anyRequest().authenticated();//所有请求都需要进行认证
        //配置认证方式
        http.formLogin();
        //配置退出设置
        http.logout()
                .logoutUrl("/logout")//设置退出代理请求url，默认git /logout
                .logoutSuccessHandler((req,resp,authentication)->{
                    Map<String,Object> result=new HashMap<String,Object>();
                    result.put("msg","注销成功");
                    result.put("用户信息",authentication.getPrincipal());
                    resp.setContentType("application/json;charset=UTF-8");
                    resp.setStatus(HttpStatus.OK.value());//设置请求成功后的状态
                    String s = new ObjectMapper().writeValueAsString(result);
                    resp.getWriter().println(s);
                });//设置退出后处理
        //设置异常处理
        http.exceptionHandling()
                .authenticationEntryPoint((req,resp,ex)->{
                    resp.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);//设置响应类型为json
                    resp.setStatus(HttpStatus.UNAUTHORIZED.value());//设置未认证状态
                    resp.getWriter().println("请认证之后在去处理");
                });//设置为授权异常处理
        //关闭csrf
        http.csrf().disable();
        //配置过滤器链
        //将UsernamePasswordAuthenticationFilter过滤器替换为自定义的
        http.addFilterAt(loginFilter(), UsernamePasswordAuthenticationFilter.class);
    }
}
```

## 密码加密

通过对认证流程源码分析得知，实际密码比较是由PasswordEncoder完成的，因此只需要使用PasswordEncoder不同实现就可以实现不同方式加密。

```java
public interface PasswordEncoder {
    String encode(CharSequence rawPassword);

    boolean matches(CharSequence rawPassword, String encodedPassword);

    default boolean upgradeEncoding(String encodedPassword) {
        return false;
    }
}
```

* encode 用来进行明文加密的
* matches用来比较密码的方法
* upgradeEncoding 用来给密码进行升级的方法

**方法一：**

根据Security的代码可以知道，如果想要对密码进行加密，直接在工厂中注入一个PasswoedEncoder，PasswoedEncoder返回那种加密方式就会使用那种加密方法

```java
    //设置加密方式
    @Bean
    public PasswordEncoder passwordEncoder(){
        //返回那种加密类型，就使用那种方法进行加密
        return new BCryptPasswordEncoder();
    }
```

**方法二：**

可以直接在用户密码前面添加加密的标志，例如

```text
密码前面加上{noop}  ，表示不加密
密码前面加上{MD5}表示使用MD5加密
密码前面加上{bcrypt},表示使用BCryptPasswordEncoder加密
... 
如果要使用这种方法进行加密推荐使用{bcrypt}
```

> 密码加密推荐使用第二种，第二种加密方法适用于多种加密方法，并且第二种加密方法更方便对密码加密方法进行升级，并且支持使用security提供的密码升级方法

**密码升级**

> 如果使用第一种加密方法，则需要直接手动进行升级。

使用第二种加密方法，对密码进行升级

只需要在原来自定义的MyUserDetailsService在使用UserDetailsService接口的基础上在实现UserDetailsPasswordService，并且重写updatePassword方法

```java
@Component
public class MyUserDetailsService  implements UserDetailsService, UserDetailsPasswordService {
    
    //自动升级密码的方法
    //参数1为认证成功的用户，此时密码还是升级之前的密码
    //参数2为使用默认加密方法，进行加密后的新密码
    @Override
    public UserDetails updatePassword(UserDetails user, String newPassword) {
        //1.调用数据库操作，来根据用户名更新密码
        //2.判断数据库操作是否成功，如果成功则将内存中的用户密码通过set方法进行跟新
        return 用户
    }
}
```

## 记住我

### 原理分析

当在SecurityConfig配置中开启 了“记住我"功能之后，在进行认证时如果勾选了“记住我"选项，此时打开浏览器控制台，分析整个登录过程。首先当我们登录时，在登录请求中多了一个RememberMe的参数。很显然，这个参数就是告诉服务器应该开启RememberMe功能的。如果自定义登录页面开启RememberMe功能应该多加入一个一样的请求参数就可以啦。该请求会被RememberMeAuthenticationFilter进行拦截然后自动登录具体参见源码:

1. 请求到达过滤器之后，首先判断SecurityContextHolder中是否有值，没值的话表示用户尚未登录，此时调用autoLogin方法进行自动登录。
2.  当自动登录成功后返回的rememberMeAuth不为null时，表示自动登录成功，此时调用authenticate方法对key进行校验，并且将登录成功的用户信息保存到SecurityContextHolder对象中，然后调用登录成功回调，并发布登录成功事件。需要注意的是，登录成功的回调并不包含RememberMeServices中的loginSuccess方法。
3. 如果自动登录失败，则调用remenberMeServices.loginFail方法处理登录失败回调。onUnsuccessfulAuthentication和onSuccesfulAuthentication都是该过滤器中定义的空方法，并没有任何实现这就是RememberMeAuthenticationFilter过滤器所做的事情，成功将RememberMeServices的服务集成进来。

### 传统Web项目实现记住我

在security配置类中添加

```java
 //设置是记住我
http.rememberMe()
       .rememberMeParameter("remember")//设置表单记住我单选框name
		//.alwaysRemember(true)//是否总记住我
;
```

然后根据配置修改登录页面

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>登录页面</title>
</head>
<body>
    <h1>用户登录</h1>
    <form method="post" th:action="@{/doLogin}">
        用户名：<input name="uname" type="text"></br>
        密  码：<input name="passwd" type="text"></br>
        <!--记住我的值默认为true、yes、on、1都可以-->
        <input type="checkbox" name="remember" value="true">记住我</br>
        <input type="submit" value="登录">
    </form>
</body>
</html>
```

此时再次访问登录页面，勾选上记住我单选框，就可以实现记住我操作。

![image-20221021144920913](https://raw.githubusercontent.com/DW62/ImgStg/master/202210211449002.png)

此时登录成功后就会在返回一个base64加密的cookie，安全性不高

**增强安全性：**

首先修改配置

```java
 //设置是记住我
 http.rememberMe()
        .rememberMeParameter("remember")//设置表单记住我单选框name
         .rememberMeServices(rememberMeServices())//设置服务类型来增加安全性
		// .alwaysRemember(true)//是否总记住我
 ;
```

```java
@Bean
public RememberMeServices rememberMeServices(){
      	//参数1：设置key
        //参数2：设置数据源
        //参数3：设置保存位置，可以基于内存 new InMemoryTokenRepositoryImpl()，也可以基于数据库new JdbcTokenRepositoryImpl()
        return new 		       PersistentTokenBasedRememberMeServices(UUID.randomUUID().toString(),userDetailsService(),new InMemoryTokenRepositoryImpl());
}
```

### 会话管理

> 当浏览器调用登录接口登录成功后，服务端会和浏览器之间建立一个会话(Session)浏览器在每次发送请求时都会携带一个Sessionld，服务端则根据这个Sessionld来判断用户身份。当浏览器关闭后，服务端的Session并不会自动销毁，需要开发者手动在服务端调用Session销毁方法，或者等Session过期时间到了自动销毁。在Spring Security中，与HttpSession相关的功能SessionManagemenFiter和Session AutheaticationStrateey接口来处理，SessionManagomentFilter 过滤器将Session 相关操作委托给SessionAuthenticationStrategy接口去完成。

### 会化的并发管理

会话并发管理就是指在当前系统中，同一个用户可以同时创建多少个会话，如果一台设备对应一个会话，那么也可以简单理解为同一个用户可以同时在多少台设备上进行登录。默认情况下，同一用户在多少台设备上登录并没有限制，不过开发者可以在Spring Security中对此
进行配置。

实现会话管理

```java
 //设置会话管理
http.sessionManagement()//开启会话管理
       .maximumSessions(1)//设置同一账户最多登录个数
       .maxSessionsPreventsLogin(true)//设置如果同一个账户登录过一次后就不会被挤掉
                ;
```

```java
//配置监听session
@Bean
public HttpSessionEventPublisher httpSessionEventPublisher(){
    return new HttpSessionEventPublisher();
}
```

1. sessionManagement() 用来开启会话管理、maximumSessions 指定会话的并发数。
2. HttpSessionEventPublisher 提供一个HttpSessionEvenePubishor实例。SpringSecurity中通过一个Map集合来集护当前的HttpSession记录，进而实现会话的并发管理。当用户登录成功时，就向集合中添动加一条HttpSession记录;当会话销毁时，就从集合中移除一条Httpsession记录。HtpSesionEvenPublisher 实现了Fttp SessionListener接口，可以监听到HtpSessicn的创建和销毁事件,并将Fltp Session的创建/销毁事件发布出去，这样，当有HtpSession销毁时，Spring Security就可以感知到该事件了。

### 会话失效处理

**传统项目处理**

只需要添加一个会话失效后的处理就可以

```java
//设置会话管理
http.sessionManagement()//开启会话管理
        .maximumSessions(1)//设置同一账户最多登录个数
        .expiredUrl("/goLogin")//设置会话超时的处理
        ;
```

此时会话失效时后，之间返回登录页面

**前后端分离项目处理**

```
 //设置会话管理
 http.sessionManagement()//开启会话管理
                .maximumSessions(1)//设置同一账户最多登录个数
                //设置会失效时的策略，用来在前后端分离项目中会话超时返回json
                .expiredSessionStrategy(event -> {
                    HttpServletResponse response=event.getResponse();
                    response.setContentType("application/json;charset=UTF-8");
                    Map<String, Object> result=new HashMap<>();
                    result.put("status",500);
                    result.put("msg","当前会话失效，请重新登录！");
                    String s = new ObjectMapper().writeValueAsString(result);
                    response.getWriter().println(s);
                    response.flushBuffer();
                })
                ;
```

此时会话失效时后，之间返回json数据

### 禁止重复登录

只需要设置一个

```java
.maxSessionsPreventsLogin(true)//上面配置个数要想生效，必须添加该配置
```

有了该设置同一账号只允许登录一个

### 会话共享

前面的会话管理都是单机.上的会话管理，如果当前是集群环境，前面所讲的会话管理方案就会失效。此时可以利用spring session结合redis实现session共享。

## CSRF

简介：CSRF (Cross Site Request Forgery跨站请求伪造)，也可称为一键式攻击(one-click attack),通常缩写为CSRF或者XSRF 。CSRF攻击是一种挟持用户在当前已登录的浏览器上发送恶意请求的攻击方法。相对于XSS利用用户对指定网站的信任，CSRF则是利用网站对用户网页浏览器的信任。简单来说,CSRF是致击者通过一些技术手段欺骗用户的浏览器，去访问一个用户曾经认证过的网站并执行恶意请求，例如发送邮件、发消息、甚至财产操作(如转账和购买商品)。由于客户端(浏览器)已经在该网站上认证过，所以该网站会认为是真正用户在操作而执行请求(实际上这个并非用户的本意)。

**CSRF防御**
CSRF攻击的根源在于浏览器默认的身份验证机制(自动携带当前网站的Cookie信息)，这种机制虽然可以保证请求是来自用户的某个浏览器,但是无法确保这请求是用户授权发送。攻击者和用户发送的请求一模一样,这意味着我们没有办法去直接拒绝这里的某一个请求。如果能在合法清求中额外携带一个攻击者无法获取的参数，就可以成功区分出两种不同的请求,进而直接拒绝掉恶意请求。在SpringSecurity中就提供了这种机制来防御CSRF攻击，这种机制我们称之为`令牌同步模式`。

**令牌同步模式**
这是目前主流的CSRF攻击防御方案。具体的操作方式就是在每一个HTTP请求中，除了默认自动携带的Cookie参数之外，再提供一个安全的、随机生成的宇符串,我们称之为CSRF令牌。这个CSRF令牌由服务端生成,生成后在HtpSession中保存一份。当前端请求到达后，将请求携带的CSRF令牌信息和服务端中保存的令牌进行对比，如果两者不相等,则拒绝掉该HITTP请求。

> 注意:考虑到会有一些外部站点链接到我们的网站，所以我们要求请求是幂等的，这样对子HEAD、OPTIONS、 TRACE 等方法就没有必要使用CSRF令牌了，强行使用可能会导致令牌泄露!

### 传统开发使用CSRF

只需要开启csrf就可以了。

开启CSRF防御后会自动在提交的表单中加入如下代码，如果不能自动加入，需要在开启之后手动加入如下代码，并随着请求提交。获取服务端令牌方式如下:

## 跨域

CORS (Cross-0rigin Resource Sharing )是由W3C制定的一种跨域资源共享技术标准，其目的就是为了解决前端的跨域请求。在JavaEE 开发中，最常见的前端跨域请求解决方案是早期的JSONP，但是JSONP只支持GET请求，这是一个很大的缺陷，而CORS则支特多种HTTTP请求方法，也是目前主流的跨域解决方案。CORS中新增了一组HTTP请求头字段，通过这些字段，服务器告诉浏览器，那些网站通过浏览器有权限访问哪些资源。同时规定，对那些可能修改服务器数据的HTTP请求方法(如GET以外的HTTTP请求等)，浏览器必须首先使用OPTIONS方法发起一个预检请求(prenightst)， 预检请求的目的是查看服务端是否支持即将发起的跨域请求，如果服务端允许,才发送实际的HTTP请求。在预检请求的返回中，服务器端也可以通知客户端，是否需要携带身份凭证(如Cookies. HTTP 认证信息等)。

### Spring跨域解决方案

**方法一：**Spring中第一种处理跨域的方式是通过`@CrossOrigin`注解来标记支持跨域，该注解可以添加在方法上,也可以添加在Controller. 上。当添加在Controller.上时，表示Controller中的所有接口都支持跨域，具体配置如下:

```java
@RestController
public Class TestController{
    @CrossOrigin(origins="http://localhost:8081")
    @GetMapping("/test")
    public String test(){
        return "test";
    }
}
```

@CrossOrigin注解各属性含义如下：

* alowCredentials：浏览器是否应当发送凭证信息，如Cookie。
* allowedFeaders：请求被允许的请求头宇段，★ 表示所有字段
* exposedHeaders：哪些响应头可以作为响应的一部分暴露出来。
  注意，这里只可以一一列举， 通配符★在这里是无效的。
* maxAge：预检请求的有效期，有效期内不必再次发送预检请求，默认是1800秒。
* methods: 允许的请求方法，★表示允许所有方法。
* origins: 允许的域，* 表示允许所有域。

**方法二：**@CrossOrigin注解需要添加在不同的Controller.上。所以还有一种全局配置方法，就是通过重写WebMvcConfigurerComposite#addCorsMappings方法来实现，具体配置如下:

```java
@Configuration
public class MvcConfig implements WebMvcConfigurer {
	//配置跨越
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")//对那些请求允许跨域
                .allowedMethods("*")//允许那些方法进行跨域
                .allowedOrigins("*")//允许那些来源进行跨域
                .allowedHeaders("*")//允许那些头
                .allowCredentials(false)//是否需要传递凭证
                .exposedHeaders("")//暴露那些头
                .maxAge(3600)
        ;
    }
}
```

**方法三：** Cosr Filter是Spring Web中提供的一个处理跨域的过滤器，开发者也可以通过该过该过滤器处理跨域。

```java
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import java.util.Arrays;
/**
 * @author: DW @date: 2022/10/21 22:18
 */
@Configuration
public class WebMvcConfig {
    @Bean
    FilterRegistrationBean<CorsFilter> corsFilter() {
        FilterRegistrationBean<CorsFilter> registrationBean=new FilterRegistrationBean<>();
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(Arrays.asList("*"));//设置允许那些源允许访问
        corsConfiguration.setAllowedHeaders(Arrays.asList("*"));//设置允许那些头
        corsConfiguration.setAllowedMethods(Arrays.asList("*"));//设置允许那些方法
        corsConfiguration.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        registrationBean.setFilter(new CorsFilter(source));
        registrationBean.setOrder(-1);
        return registrationBean;
    }
}
```

### SpringSecurity跨域解决

**原理分析：**当我们为项目添加了Spring Security依赖之后，发现上面三种跨域方式有的失效了，有则可以继续使用，这是怎么回事?

通过@CrossOrigin注解或者重写addCorsMappings方法配置跨域，统统失效了，通
CorsFilter配置的跨域，有没有失效则要看过滤器的优先级，如果过滤器优先级高于Sp
Security过滤器，即先于Spring Security过滤器执行，则CorsFiter所配置的跨域处理依然有效;如果过滤器优先级低于Spring Security过滤器，则CorsFilter所配置的跨域处理就会失效。

**解决方法：**

首先在配置类中添加

```java
//配置跨域
 http.cors()
            .configurationSource(corsConfigurationSource())//设置跨域的配置
                ;
```

在添加对应的跨域设置

```java
    //跨域配置
    CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));//设置允许的元
        configuration.setAllowedMethods(Arrays.asList("*"));//设置允许的方法
        configuration.setAllowedHeaders(Arrays.asList("*"));//设置允许的头
        configuration.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
```

## 异常处理

Spring Security中异常主要分为两大类：

* AuthenticationException: 认证异常
* AccessDeniedException: 授权异常

**处理：**

```java
        //设置异常处理
        http.exceptionHandling()
                //处理认证异常
                .authenticationEntryPoint((request, response, e) -> {
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    response.getWriter().write("尚未认证，请进行认证操作！");
                })
                //处理授权异常
                .accessDeniedHandler((request, response, e) -> {
                    response.setStatus(HttpStatus.FORBIDDEN.value());
                    response.getWriter().write("无权访问！");
                })
;
```

## 授权

Spring Security中提供的权限管理策略主要有两种类型：

* 基于过滤器(URL)的权限管理(FilterSecurityInterceptor)主要是用来拦截HTTP请求，拦截下来之后，根据HTTP请求地址进行权限校验。
* 基于AOP(方法)的权限管理(MethodSecurityInterceptor)主要是用来处理方法级别的权限问题。当需要调用某一个方法时，通过AOP将操作拦截下来，然后判断用户是否具备相关的权限。

### 基于注解实现授权

SpringSecurity提供了基于注解的权限控制方案，我们可以使用注解去指定访问对应的资源所需的权限。但是要使用它我们需要先开启相关配置。配置类中。

```java
@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true,securedEnabled = true,jsr250Enabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
```

* perPostEnabled：开启Spring Security提供的四个权限注解，@PostAuthorize.@PostFilter. @PreAuthorize 以及@PreFilter.
* securedEnabled: 开启Spring Security提供的@Secured注解支持，该注解不支持权限表达式
* jsr250Enabled: 开启JSR-250提供的注解，主要是@DenyAll、@PermitAll、 @RolesAll 同样这些注解也不支持权限表达式

```text
#以上注解含义如下:
@PostAuthorize: 在目前标方法执行之后进行权限校验。
@PostFiter: 在目标方法执行之后对方法的返回结果进行过滤。
@PreAuthorize:在目标方法执行之前进行权限校验。
@PreFiter: 在日标方法执行之前对方法参数进行过滤。
@secured: 访问目标方法必须具各相应的角色。
@DenyA1l:拒绝所有访问。
@PermitAll:允许所有访问。
@RolesAllowed:访问目标方法必须具备相应的角色。
```

这些基于方法的权限管理相关的注解，一般来说只要设置prePostEnabLed=true 就够用了。

### 基于数据库实现动态权限管理

首先需要5张数据表

用户表  角色表  菜单表  用户角色关联表  菜单角色关联表  

> 其中角色表中的表示角色的数据必须以`ROLE_`开头

首先在实现根据数据库数据登录时，将用户的角色信息也放入认证对象中，使认证成功后的对象具有真实的数据中的角色信息。

要实现基于数据的动态授权就先将之间配置的认证规则

```java
//配置认证规则
 http.authorizeRequests()
        .mvcMatchers("/goLogin").permitAll()//放行去登录页面请求
        .mvcMatchers("/getVc").permitAll()//放行生成验证码请求
        .anyRequest().authenticated();//所有请求都需要进行认证
```

替换为(之前的不要了)

```java
//获取工厂对象
ApplicationContext applicationContext=http.getSharedObject(ApplicationContext.class);
//配置动态认证规则
//设置自定义的url权限处理
http.apply(new UrlAuthorizationConfigurer<>(applicationContext))
       .withObjectPostProcessor(new ObjectPostProcessor<FilterSecurityInterceptor>() {
              @Override
              public <O extends FilterSecurityInterceptor> O postProcess(O object) {
                   //设置自定义动态授权处理类
                   object.setSecurityMetadataSource(customerSecurityMetaSource);
                   //设置是否拒绝公共资源的访问
                   object.setRejectPublicInvocations(false);
                   return object;
              }
       });
```

创建对应的自定义动态授权处理类

```java
/**
 * 自定义动态授权处理类
 */
@Component
public class CustomerSecurityMetaSource implements FilterInvocationSecurityMetadataSource {
    //用来进行路径对比
    AntPathMatcher antPathMatcher=new AntPathMatcher();
    @Resource
    private MenuInfoService menuInfoService;
    /**
     * 自定义动态资源权限元数据信息
     */
    @Override
    public Collection<ConfigAttribute> getAttributes(Object object) throws IllegalArgumentException {
        //获取请求接口的url
        String requestURI = ((FilterInvocation) object).getRequest().getRequestURI();
        //获取所有菜单信息
        List<MenuInfo> allMenuInfo = menuInfoService.getAllMenuInfo();
        for (MenuInfo menu:allMenuInfo) {
            //判断是否和当前请求地址一致
            if (antPathMatcher.match(menu.getMenuKey(),requestURI)){
                //如果一致，获取该请求所需要的角色信息
                List<String> roleKeyByMenuKey = menuInfoService.getRoleKeyByMenuKey(menu.getMenuKey());
                String[] roles = roleKeyByMenuKey.toArray(new String[]{});
                return SecurityConfig.createList(roles);
            }
        }
        return null;
    }

    @Override
    public Collection<ConfigAttribute> getAllConfigAttributes() {
        return null;
    }

    //保持和默认返回一致
    @Override
    public boolean supports(Class<?> clazz) {
        return FilterInvocation.class.isAssignableFrom(clazz);
    }
}
```

此时在菜单表中配置的菜单就需要有对应的角色才可以访问，菜单表中未配置的菜单就不要权限之间就可以访问。
