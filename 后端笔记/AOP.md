                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             

# AOP

## AOP??????

AOP (Aspect Oriented Programming),??????: ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????AOP??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????

## AOP????????????

* ????????????
* ????????????
* ????????????
* ????????????
* ????????????
* ???????????????
* ????????????
* ????????????

## Spring AOP???????????????

**aspect???**???????????????????????????????????????????????????????????????????????????????????????????????????
**pointcut???**??????????????????????????????????????????????????????????????????????????????
**joinpoint???**??????????????????????????????????????????????????????????????????????????????
**weaving???**???????????????????????????????????????????????????????????????
**advice???**???????????????????????????????????????????????????????????????????????????????????????????????????????????
**target???**???????????????????????????????????????
**aop Proxy???**??????????????????????????????????????????

Spring AOP????????????????????????JDK???????????????CGLib???????????????????????????????????????????????????????????????

**?????????**

Before advice
????????????????????????????????????????????????????????????:??????????????????????????????????????????
After returning advice 
???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
After throwing advice
??????????????????????????????????????????????????????????????????????????????
After finally advice
??????????????????????????????????????????????????????????????????????????????
Around advice
???????????????????????????????????????????????????????????????????????????(????????????ProceedingJoinPoint. proceed( )) ,????????????????????????????????????????????????

## ??????????????????

1. ?????????????????????Aspect 
   ???????????????????????????@Component @ Aspect???????????????Springboot???????????? spring-boot-stater-aop?????????,
2. ????????????Pointcut
   ????????????????????????????????????????????????????????????@Pointcut??????????????????`@Pointcut(value = "execution(* com.dw.log.controller.*.*(..))")`
   ??????:?????????(???????????????????????????*) +????????????+??????????????????+????????????+????????????????????????,".." ???????????????????????????
3. ??????Advice??????
   ???????????????5???????????????@Before???@ After???@ AfterReturning???@ AfterThrowing???@Around??? ??????????????????????????????????????????@Before("myPointcut0"), myPointcut????????? ?????????????????????

## ??????

??????aop??????

```xml
<!--springBoot-aop??????-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

**?????????????????????aop???????????????**

```java
/**
 * ?????????????????????????????????
 * Aspect??????????????????????????????
 */
@Aspect
@Component
@Slf4j
public class LogAop {
    //???????????? * com.dw.log.controller.*.*(..))??????controller???????????????
    @Pointcut(value = "execution(* com.dw.log.controller.*.*(..))")
    public void logAopPointcut(){}

    //????????????
    @Around("logAopPointcut()")
    public Object log(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        //??????????????????
        String className = proceedingJoinPoint.getTarget().getClass().toString();
        //????????????????????????
        String methdName = proceedingJoinPoint.getSignature().getName();
        ObjectMapper objectMapper = new ObjectMapper();
        //??????????????????
        Object[] array = proceedingJoinPoint.getArgs();
        log.info("????????????"+className+"?????????"+methdName+"??????????????????????????????"+objectMapper.writeValueAsString(array));
        //???????????????
        Object obj = proceedingJoinPoint.proceed();
        log.info(className+"?????????"+methdName+"????????????????????????"+objectMapper.writeValueAsString(obj));
        return obj;
    }
}
```