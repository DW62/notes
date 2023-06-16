# SpringBoot项目通过线程池处理异步任务

## 创建线程配置

```java
import com.dw.oaApi.utils.ThreadUtils;//引入线程池工具类
import org.apache.commons.lang3.concurrent.BasicThreadFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledThreadPoolExecutor;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * 线程池配置
 *
 * @author DW  @date 2023/06/12 10:46
 */
@Configuration
public class ThreadPoolConfig {
    /**
     * 核心池大小
     */
    private int corePoolSize = 50;
    /**
     * 最大池大小
     */
    private int maxPoolSize = 200;
    /**
     * 队列最大长度
     */
    private int queueCapacity = 1000;
    /**
     * 线程池维护线程所允许的空闲时间
     */
    private int keepAliveSeconds = 300;

    /**
     * 线程池任务执行器
     * @return {@link ThreadPoolTaskExecutor}
     */
    @Bean(name = "threadPoolTaskExecutor")
    public ThreadPoolTaskExecutor threadPoolTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setMaxPoolSize(maxPoolSize);
        executor.setCorePoolSize(corePoolSize);
        executor.setQueueCapacity(queueCapacity);
        executor.setKeepAliveSeconds(keepAliveSeconds);
        //线程池对拒绝任务(无线程可以)的处理策略
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        return executor;
    }

    /**
     * 执行周期性或定时任务
     */
    @Bean(name = "scheduledExecutorService")
    protected ScheduledExecutorService scheduledExecutorService() {
        /**
         * 参数1：线程池核心线程数
         * 参数2：线程工厂
         * 参数3：任务拒绝策略
         */
        return new ScheduledThreadPoolExecutor(corePoolSize,
                new BasicThreadFactory.Builder().namingPattern("schedule-pool-%d").daemon(true).build(),
                new ThreadPoolExecutor.CallerRunsPolicy()) {
            /**
             * 后执行
             * @param r r 执行任务的线程
             * @param t t 将要执行的任务
             */
            @Override
            protected void afterExecute(Runnable r, Throwable t) {
                super.afterExecute(r, t);
                //调用线程工具类中的打印线程异常信息方法
                ThreadUtils.printException(r, t);
            }
        };
    }
}
```

## 创建异步任务管理器

```java
import java.util.TimerTask;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * 异步任务管理器
 */
public class AsyncManager {
    /**
     * 操作延迟时间 10毫秒
     */
    private final int OPERATE_DELAY_TIME = 10;

    /**
     * 异步操作任务调度线程池 通过Spring工具类获取Bean
     */
    private ScheduledExecutorService executor = SpringUtils.getBean("scheduledExecutorService");

    /**
     * 单例模式
     */
    private AsyncManager() {
    }

    private static AsyncManager me = new AsyncManager();

    public static AsyncManager me() {
        return me;
    }

    /**
     * 执行任务
     *
     * @param task 任务
     */
    public void execute(TimerTask task) {
        executor.schedule(task, OPERATE_DELAY_TIME, TimeUnit.MILLISECONDS);
    }

    /**
     * 停止任务线程池,通过调用线程工具类停止线程池方法
     */
    public void shutdown() {
        ThreadUtils.shutdownAndAwaitTermination(executor);
    }
}
```

## 创建异步工厂

```java
/**
 * 异步工厂（产生任务用）
 */
public class AsyncFactory {
    private static final Logger sys_user_logger= LoggerFactory.getLogger(AsyncFactory.class);

    /**
     * 记录登录信息
     * @param username 用户名
     * @param status   状态
     * @param message  消息
     * @param args     列表
     * @return {@link TimerTask} 任务task
     */
    public static TimerTask recordLoginInfo(final String username,final String status,final String message,
                                          final Object... args  ){
        //获取客户端信息 需要引入UserAgentUtils依赖
        final UserAgent userAgent = UserAgent.parseUserAgentString(ServletUtils.getRequest().getHeader("User-Agent"));
        //获取ip地址
        final String ip= IpUtils.getIpAddr();
        return new TimerTask() {
            @Override
            public void run() {
                //获得真正ip地址
                String address= AddressUtils.getRealAddressByIP(ip);

                StringBuilder s=new StringBuilder();
                s.append(LogUtils.getBlock(ip));
                s.append(address);
                s.append(LogUtils.getBlock(username));
                s.append(LogUtils.getBlock(status));
                s.append(LogUtils.getBlock(message));
                //打印信息到日志
                sys_user_logger.info(s.toString(),args);
                //获取客户端操作系统
                String os = userAgent.getOperatingSystem().getName();
                //获取客户端浏览器
                String browser = userAgent.getBrowser().getName();
                //封装对象
                SysLoginInfo loginInfo=new SysLoginInfo();
                loginInfo.setUserName(username);
                loginInfo.setIpaddr(ip);
                loginInfo.setLoginLocation(address);
                loginInfo.setBrowser(browser);
                loginInfo.setOs(os);
                loginInfo.setMsg(message);
                //日志状态
                if (StringUtils.equalsAny(status, Constants.LOGIN_SUCCESS,Constants.LOGOUT,Constants.REGISTER)){
                    loginInfo.setStatus(Constants.SUCCESS);
                }else if(Constants.LOGIN_FAIL.equals(status)){
                    loginInfo.setStatus(Constants.FAIL);
                }
                //插入数据
                SpringUtils.getBean(SysLoginInfoService.class).insertLoginInfo(loginInfo);
            }
        };
    }

    /**
     * 操作日志记录
     * @param operateLog 操作日志
     * @return {@link TimerTask}
     */
    public static TimerTask recordOperate(final SysOperateLog operateLog){
        return new TimerTask() {
            @Override
            public void run() {
                //查询操作地点
                operateLog.setOperateLocation(AddressUtils.getRealAddressByIP(operateLog.getOperateIp()));
                SpringUtils.getBean(SysOperateLogService.class).insertOperate(operateLog);
            }
        };
    }
}
```

## 具体使用

```java
 //异步在数据库中记录日志 通过任务管理器调用工厂方法
                AsyncManager.me().execute(AsyncFactory.recordLoginInfo(username,Constants.LOGIN_FAIL,e.getMessage()));
```

