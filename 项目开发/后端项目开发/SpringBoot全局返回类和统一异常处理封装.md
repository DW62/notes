# Spring Boot封装全局返回类和统一异常处理

## 全局返回类

**HTTP 状态码分类**

HTTP 状态码由三个十进制数字组成，第一个十进制数字定义了状态码的类型。响应分为五类：信息响应(100–199)，成功响应(200–299)，重定向(300–399)，客户端错误(400–499)和服务器错误 (500–599)：

| 分类 | 分类描述                                       |
| :--- | :--------------------------------------------- |
| 1**  | 信息，服务器收到请求，需要请求者继续执行操作   |
| 2**  | 成功，操作被成功接收并处理                     |
| 3**  | 重定向，需要进一步的操作以完成请求             |
| 4**  | 客户端错误，请求包含语法错误或无法完成请求     |
| 5**  | 服务器错误，服务器在处理请求的过程中发生了错误 |



1. 首先定义一个枚举类来控制要返回的状态和信息

```java
/**
 * 全局返回状态枚举
 * @author dw  @date: 2022/9/3 12:05
 */
public enum ResultCode {
    SUCCESS(200,"操作成功"),
    ERROR(500,"操作失败");

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

> 可以根据需要自行添加状态信息

2. 定义全局返回

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

**使用效果**

```java
 @GetMapping("/getImageById")
    public Result getImageById(Long id){
        ImageInfo imageInfo = imageInfoService.getById(1L);
        return Result.success().data("image",imageInfo);
    }
```

可以通过链式调用来进行使用

![image-20220903131236811](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220903131236811.png)

## 统一异常处理

SpringBoot中有一个`@ControllerAdvice注解`，使用该注解标识的类可以开启全局异常捕获，然后在方法上使用`@ExceptionHandler注解`可以来对想要的异常进行处理，在加上`@ResponseBody注解`和

上面定义的全局返回类即可以使异常页面变成返回类json

**全局异常类**

```java
/**
 * 全局异常处理类
 * @author: DW @date: 2022/9/3 13:16
 */
@ControllerAdvice
public class MyExceptionHandler {

    @ExceptionHandler(value =Exception.class)
    @ResponseBody
    public Result exceptionHandler(Exception e) {
        System.out.println("发生的异常是"+e.getMessage());
        return Result.error();
    }
}
```

**出现异常时的效果**

![image-20220903135201132](C:\Users\dw\AppData\Roaming\Typora\typora-user-images\image-20220903135201132.png)

> 当然有可以在异常处理的方法中传入参数 `HandlerMethod handlerMethod`来获取出现异常方法的信息

```java
     @ExceptionHandler(value =Exception.class)
    @ResponseBody
    public Result exceptionHandler(Exception e, HandlerMethod handlerMethod) {
        System.out.println("发生的异常是"+e.getMessage());
        System.out.println("发生的异常的类为："+handlerMethod.getClass());
        System.out.println("发生的异常的方法为："+handlerMethod.getMethod());
        return Result.error();
    }
```

![image-20220903140217079](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220903140217079.png)