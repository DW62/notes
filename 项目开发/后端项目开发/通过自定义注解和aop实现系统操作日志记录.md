# 通过自定义注解和aop实现系统日志记录

## 创建操作日志的表结构

```sql
DROP TABLE IF EXISTS `sys_operate_log`;
CREATE TABLE `sys_operate_log`  (
  `operate_id` bigint(0) NOT NULL AUTO_INCREMENT COMMENT '日志主键',
  `title` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '模块标题',
  `business_type` int(0) NULL DEFAULT 0 COMMENT '业务类型（0其它 1新增 2修改 3删除）',
  `method` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '方法名称',
  `request_method` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '请求方式',
  `operator_type` int(0) NULL DEFAULT 0 COMMENT '操作类别（0其它 1后台用户 2手机端用户）',
  `operate_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '操作人员',
  `dept_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '部门名称',
  `operate_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '请求URL',
  `operate_ip` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '主机地址',
  `operate_location` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '操作地点',
  `operate_param` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '请求参数',
  `json_result` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '返回参数',
  `status` int(0) NULL DEFAULT 0 COMMENT '操作状态（0正常 1异常）',
  `error_msg` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT '' COMMENT '错误消息',
  `operate_time` datetime(0) NULL DEFAULT NULL COMMENT '操作时间',
  `cost_time` bigint(0) NULL DEFAULT 0 COMMENT '消耗时间',
  PRIMARY KEY (`operate_id`) USING BTREE,
  INDEX `idx_sys_oper_log_bt`(`business_type`) USING BTREE,
  INDEX `idx_sys_oper_log_s`(`status`) USING BTREE,
  INDEX `idx_sys_oper_log_ot`(`operate_time`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 101 CHARACTER SET = utf8 COLLATE = utf8_general_ci COMMENT = '操作日志记录' ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
```

根据结构创建对应的实体类`SysOperateLog`

## 在系统中引入aop依赖

```xml
<!--springBoot-aop依赖-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>                                
```

## 创建需要的枚举类

1. 操作状态枚举

   ```java
   public enum BusinessStatus {
       //成功
       SUCCESS,
       //失败
       FAIL
   }
   ```

2. 业务类型枚举

   ```java
   public enum BusinessType {
   
       //其他
       OTHER,
       //新增
       INSERT,
       //修改
       UPDATE,
       //删除
       DELETE,
       //授权
       GRANT,
       //导出
       EXPORT,
       //导入
       IMPORT,
       //强退
       FORCE,
       //清空数据
       CLEAN
   }
   ```

3. 请求方法枚举

   ```java
   import org.springframework.lang.Nullable;
   import java.util.HashMap;
   import java.util.Map;
   
   /**
    * 请求方法
    */
   public enum HttpMethod {
       GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS, TRACE;
   
       private static final Map<String,HttpMethod> mappings=new HashMap<>(16);
   
       static {
           for (HttpMethod httpMethod: values()) {
               mappings.put(httpMethod.name(),httpMethod);
           }
       }
   
       @Nullable
       public static HttpMethod resolve(@Nullable String method){
           return (method!=null?mappings.get(method):null);
       }
       public boolean matches(String method){
           return (this==resolve(method));
       }
   }
   ```

4. 操作人类别枚举

   ```java
   public enum OperatorType {
       //其他
       OTHER,
       //合同用户
       MANAGE,
       //移动用户
       MOBILE
   }
   ```

## 定义日志注解

```java
/**
 * 自定义操作日志注解
 */
@Target({ElementType.PARAMETER,ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Log {

    /**
     * 模块
     */
    public String title() default "";

    /**
     * 业务类型
     */
    public BusinessType businessType() default BusinessType.OTHER;

    /**
     * 操作人类型
     */
    public OperatorType operatorType() default OperatorType.OTHER;

    /**
     * 是保存请求数据
     */
    public boolean isSaveRequestData() default true;

    /**
     * 是保存响应数据
     */
    public boolean isSaveResponseData() default true;

    /**
     * 排除指定请求参数
     */
    public String[] excludeParamNames() default {};
}
```

## 创建排除JSON敏感属性过滤器

```java
import com.alibaba.fastjson2.filter.SimplePropertyPreFilter;
/**
 * 排除JSON敏感属性 过滤器
 */
public class PropertyPreExcludeFilter extends SimplePropertyPreFilter
{
    public PropertyPreExcludeFilter()
    {
    }

    public PropertyPreExcludeFilter addExcludes(String... filters)
    {
        for (int i = 0; i < filters.length; i++)
        {
            this.getExcludes().add(filters[i]);
        }
        return this;
    }
}
```

## 创建日志记录AOP

```java
import com.dw.oaApi.annotation.Log;
import com.dw.oaApi.domain.SysOperateLog;
import com.dw.oaApi.enums.BusinessStatus;
import com.dw.oaApi.enums.HttpMethod;
import com.dw.oaApi.filter.PropertyPreExcludeFilter;
import com.dw.oaApi.manager.AsyncManager;
import com.dw.oaApi.manager.factory.AsyncFactory;
import com.dw.oaApi.model.LoginUser;
import com.dw.oaApi.security.utils.SecurityUtils;
import com.dw.oaApi.utils.ServletUtils;
import com.dw.oaApi.utils.StringUtils;
import com.dw.oaApi.utils.ip.IpUtils;
import com.alibaba.fastjson2.JSON;
import javafx.print.Collation;
import org.apache.commons.lang3.ArrayUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.NamedThreadLocal;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Collection;
import java.util.Map;


/**
 * 操作日志记录处理类
 * @author DW  @date 2023/06/15 19:25
 */
@Aspect
@Component
public class LogAspect {

    private static final Logger log= LoggerFactory.getLogger(LogAspect.class);

    /**
     * 排除属性字段
     */
    public static final String[] EXCLUDE_PROPERTIES={"password","oldPassword"};

    /**
     * 操作消耗时间
     */
    private static final ThreadLocal<Long> TIME_THREADLOCAL=new NamedThreadLocal<>("Cost Time");

    /**
     * 请求处理之前执行
     * @param joinPoint     连接点
     * @param controllerLog 控制器日志
     */
    @Before(value = "@annotation(controllerLog)")
    public void before(JoinPoint joinPoint, Log controllerLog){
        TIME_THREADLOCAL.set(System.currentTimeMillis());
    }
    /**
     * 请求处理完后执行
     * @param joinPoint     连接点
     * @param controllerLog 控制器日志
     * @param jsonResult    json结果
     */
    @AfterReturning(pointcut = "@annotation(controllerLog)",returning = "jsonResult")
    public void afterReturning(JoinPoint joinPoint,Log controllerLog,Object jsonResult){
        handleLog(joinPoint,controllerLog,null,jsonResult);
    }
    /**
     * 拦截异常操作
     * @param joinPoint     连接点
     * @param controllerLog 控制器日志
     * @param e             e
     */
    @AfterThrowing(value = "@annotation(controllerLog)",throwing = "e")
    public void afterThrowing(JoinPoint joinPoint,Log controllerLog,Exception e){
        handleLog(joinPoint,controllerLog,e,null);
    }
    /**
     * 处理日志
     * @param joinPoint     连接点
     * @param controllerLog 控制器日志
     * @param e             e
     * @param jsonResult    json结果
     */
    protected void handleLog(final JoinPoint joinPoint,Log controllerLog,final Exception e,Object jsonResult){
        try {
            //获取当前用户
            LoginUser loginUser = SecurityUtils.getLoginUser();
			//设置日志记录实体属性
            SysOperateLog operateLog=new SysOperateLog();
            //ordinal()方法，用来返回枚举对象的序数
            operateLog.setStatus(BusinessStatus.SUCCESS.ordinal());
            //请求ip
            String ip = IpUtils.getIpAddr();
            operateLog.setOperateIp(ip);
            //请求地址
            operateLog.setOperateUrl(StringUtils.substring(ServletUtils.getRequest().getRequestURI(),0,255));
            if (loginUser!=null){
                //操作人员
                operateLog.setOperateName(loginUser.getUsername());
            }

            if (e!=null){
                operateLog.setStatus(BusinessStatus.FAIL.ordinal());
                operateLog.setErrorMsg(StringUtils.substring(e.getMessage(),0,2000));
            }
            //设置方法名称
            String className = joinPoint.getTarget().getClass().getName();
            String methodName = joinPoint.getSignature().getName();
            operateLog.setMethod(className+"."+methodName+"()");
            //设置请求方式
            operateLog.setRequestMethod(ServletUtils.getRequest().getMethod());
            //处理设置注解上的参数
            getControllerMethodDescription(joinPoint,controllerLog,operateLog,jsonResult);
            //设置消耗时间
            operateLog.setCostTime(System.currentTimeMillis()-TIME_THREADLOCAL.get());
            //y保存数据到数据库
            AsyncManager.me().execute(AsyncFactory.recordOperate(operateLog));
        }
        catch (Exception exception)
        {
            //记录本地异常日志
            log.error("异常信息：{}",exception.getMessage());
        }
        finally {
            TIME_THREADLOCAL.remove();
        }
    }
    /**
     * 获取注解中对方法的描述信息 用于Controller层注解
     * @param joinPoint     连接点
     * @param controllerLog 控制器日志
     * @param operateLog    操作日志
     * @param jsonResult    json结果
     */
    private void getControllerMethodDescription(JoinPoint joinPoint, Log controllerLog, SysOperateLog operateLog, Object jsonResult) {
        //设置业务类型
        operateLog.setBusinessType(controllerLog.businessType().ordinal());
        //设置标题
        operateLog.setTitle(controllerLog.title());
        //设置操作人类别
        operateLog.setOperatorType(controllerLog.operatorType().ordinal());
        //是否需要操作人类别
        if (controllerLog.isSaveRequestData()){
            //获取参数信息传入数据库
            setRequestValue(joinPoint,operateLog,controllerLog.excludeParamNames());
        }
        //是否需要保存response 参数
        if (controllerLog.isSaveResponseData() && StringUtils.isNotNull(jsonResult)){
            operateLog.setJsonResult(StringUtils.substring(JSON.toJSONString(jsonResult),0,2000));
        }
    }
    /**
     * 获取请求的参数，放到log中
     * @param joinPoint         连接点
     * @param operateLog        操作日志
     * @param excludeParamNames 排除参数名称
     */
    private void setRequestValue(JoinPoint joinPoint, SysOperateLog operateLog, String[] excludeParamNames) {
        Map<?, ?> paramMap = ServletUtils.getParamMap(ServletUtils.getRequest());
        String requestMethod = operateLog.getRequestMethod();
        boolean flag=HttpMethod.PUT.name().equals(requestMethod)||HttpMethod.POST.name().equals(requestMethod);
        if (StringUtils.isEmpty(paramMap) && flag)
        {
            //参数拼装
            String params=argsArrayToString(joinPoint.getArgs(),excludeParamNames);
            operateLog.setOperateParam(StringUtils.substring(params, 0, 2000));
        }
        else
        {
            operateLog.setOperateParam(StringUtils.substring(JSON.toJSONString(paramMap, excludePropertyPreFilter(excludeParamNames)), 0, 2000));
        }
    }
    /**
     * 参数拼装
     * @param args             参数数组
     * @param excludeParamNames 排除参数名称
     * @return {@link String}
     */
    private String argsArrayToString(Object[] args, String[] excludeParamNames) {
        String params="";
        if (args!=null&&args.length>0){
            for (Object o:args) {
                if (StringUtils.isNotNull(o)&&!isFilterObject(o))
                {
                    try
                    {
                        String jsonObj = JSON.toJSONString(o, excludePropertyPreFilter(excludeParamNames));
                        params += jsonObj.toString() + " ";
                    }
                    catch (Exception e)
                    {
                    }
                }
            }
        }
        return params.trim();
    }
    /**
     * 忽略敏感属性
     */
    public PropertyPreExcludeFilter excludePropertyPreFilter(String[] excludeParamNames)
    {
        return new PropertyPreExcludeFilter().addExcludes(ArrayUtils.addAll(EXCLUDE_PROPERTIES, excludeParamNames));
    }
    /**
     * 判断是否需要过滤的对象。
     * @param o o对象信息
     * @return boolean 如果是需要过滤的对象，则返回true；否则返回false。
     */
    private boolean isFilterObject(Object o) {
        Class<?> clazz = o.getClass();
        if (clazz.isArray())
        {
            return clazz.getComponentType().isAssignableFrom(MultipartFile.class);
        }
        else if (Collation.class.isAssignableFrom(clazz))
        {
            Collection collection = (Collection) o;
            for (Object value:collection) {
                return value instanceof MultipartFile;
            }
        }
        else if (Map.class.isAssignableFrom(clazz))
        {
            Map map=(Map) o;
            for (Object value:map.entrySet()) {
                Map.Entry entry=(Map.Entry) value;
                return entry.getValue() instanceof MultipartFile;
            }
        }
        return o instanceof MultipartFile || o instanceof HttpServletRequest || o instanceof HttpServletResponse
                || o instanceof BindingResult;
    }
}
```

## 使用

```java
    @Log(title = "参数管理", businessType = BusinessType.INSERT)
    @PostMapping
    public Result add(@Validated(AddGroup.class) @RequestBody ConfigAddAndEditBody config){
        return sysConfigService.insertConfig(config);
    }
```

