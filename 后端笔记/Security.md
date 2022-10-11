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