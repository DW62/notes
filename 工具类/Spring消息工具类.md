# Spring消息工具类

> 在常规的开发中系统返回的信息都是直接写在代码中，这个的开发当后期想要改变信息内容，就想要修改代码。显然是不合理的。此时就可以通过配置文件来将信息委托给Spring MessageSource，此后想要想要信息内容，就只需要修改配置文件即可。

**具体实现**

首先需要在配置文件中声明信息的文件

```yml
# Spring配置
spring:
  # 资源信息
  messages:
    # 国际化资源文件路径
    basename: i18n/messages
    encoding: UTF-8
```

然后根据配置文件中的声明在resources下新增一个`i18n/messages.properties` 的配置文件(文件编码要是UTF-8)不然会出现乱码

```properties
#错误消息
user.password.not.match=用户不存在/密码错误
user.jcaptcha.expire=验证码已失效
user.jcaptcha.error=验证码错误
not.null=用户名或密码为空

login.blocked=很遗憾，访问IP已被列入系统黑名单

user.login.success=登录成功
```

编写工具类MessageUtils

```java
/**
 * 获取i18n资源文件
 * @author DW  
 */
public class MessageUtils {

    /**
     * 根据消息键和参数 获取消息 委托给spring messageSource
     * @param code 消息键
     * @param args 参数
     * @return 获取国际化翻译值
     */
    public static String message(String code, Object... args)
    {
        MessageSource messageSource = SpringUtils.getBean(MessageSource.class);
        return messageSource.getMessage(code, args, LocaleContextHolder.getLocale());
    }
}
```

页可以为

```java
/**
 * 获取i18n资源文件
 * @author DW  
 */
public class MessageUtils {

    @Resource
    private MessageSource messageSource;
    /**
     * 根据消息键和参数 获取消息 委托给spring messageSource
     * @param code 消息键
     * @param args 参数
     * @return 获取国际化翻译值
     */
    public  String message(String code, Object... args)
    {
        return messageSource.getMessage(code,args,LocaleContextHolder.getLocale());
    }
}
```

工具类的使用

```java
 //直接调用message方法传如key
MessageUtils.message("user.password.not.match")
```



