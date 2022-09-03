# SrpingBoot集成Swagger2 

这里使用的SpringBoot版本为`2.7.3`

## 快速整合

1. 导入依赖

```xml
 <!--  Swagger        -->
  <dependency>
          <groupId>io.springfox</groupId>
          <artifactId>springfox-swagger2</artifactId>
          <version>2.9.2</version>
  </dependency>
  <!--  Swagger ui 版本和Swagger保持一致       -->
   <dependency>
          <groupId>io.springfox</groupId>
          <artifactId>springfox-swagger-ui</artifactId>
           <version>2.9.2</version>
    </dependency>
```

2. 添加配置类

```java
/**
 * swagger配置类
 * @author: DW @date: 2022/9/3 14:58
 * @EnableSwagger2开启swagger2的注解
 */
@Configuration
@EnableSwagger2
public class SwaggerConfig {
}
```

然后访问`http://localhost:9090/swagger-ui.html` 就可以进入swagger的页面

![image-20220903152443448](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220903152443448.png)

> 如果出现错误则说明是springboot版本太高了

则在配置文件中加上

```yml
  # springboot与swagger/knife4j版本冲突问题的 matching-strategy是path_pattern_parser，改为之前的ant_path_matcher
  spring:
  	mvc:
    	pathmatch:
      		matching-strategy: ant_path_matcher
```

重新访问`http://localhost:9090/swagger-ui.html` 就可以进入swagger的页面

## 完善Swagger的配置信息

即完善上面创建的配置类

```java
/**
 * swagger配置类
 * @author: DW @date: 2022/9/3 14:58
 * @EnableSwagger2开启swagger2的注解
 */
@Configuration
@EnableSwagger2
public class SwaggerConfig {

    /**
     * @return 配置Swagger的Docker的bean实例
     *  .apis()用来配置要扫描的  RequestHandlerSelectors 配置扫描发生
     *      .basePackage("包路径") 指定包扫描
     *      .any()  扫描全部
     *      .none() 全部不扫描
     *      .withClassAnnotation()  扫描类上的注解参数是注解的反射对象
     *      .withMethodAnnotation() 扫描方法上的注解
     *  。paths()用来配置要屏蔽的 PathSelectors配置屏蔽方式
     *  .enable()表示是否启用swagger2  默认为true启用
     *  .groupName("分组名") 设置分组
     */
    @Bean
    public Docket docket() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .enable(true)
                .groupName("分组名")
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.dw.blogApi.controller"))
                .build();
    }

    /**
     * @return  配置Swagger信息apiInfo
     */
    private ApiInfo apiInfo() {
        //定义作者信息
        Contact contact = new Contact("作者名称","地址","邮箱");
        return new ApiInfo(
                "文档标题",
                "文档描述",
                "版本",
                "访问地址",
                contact,
                "执照信息",
                "执照url",
                new ArrayList()
        );
    }
}
```

## Swagger注解说明

```Java
@Api：用在请求的类上，表示对类的说明
    tags="说明该类的作用，可以在UI界面上看到的注解"
    value="该参数没什么意义，在UI界面上也看到，所以不需要配置"

@ApiOperation：用在请求的方法上，说明方法的用途、作用
    value="说明方法的用途、作用"
    notes="方法的备注说明"

@ApiImplicitParams：用在请求的方法上，表示一组参数说明
    @ApiImplicitParam：用在@ApiImplicitParams注解中，指定一个请求参数的各个方面
        name：参数名
        value：参数的汉字说明、解释
        required：参数是否必须传
        paramType：参数放在哪个地方
            · header --> 请求参数的获取：@RequestHeader
            · query --> 请求参数的获取：@RequestParam
            · path（用于restful接口）--> 请求参数的获取：@PathVariable
            · body（不常用）
            · form（不常用）    
        dataType：参数类型，默认String，其它值dataType="Integer"       
        defaultValue：参数的默认值

@ApiResponses：用在请求的方法上，表示一组响应
    @ApiResponse：用在@ApiResponses中，一般用于表达一个错误的响应信息
        code：数字，例如400
        message：信息，例如"请求参数没填好"
        response：抛出异常的类

@ApiModel：用于响应类上，表示一个返回响应数据的信息
            （这种一般用在post创建的时候，使用@RequestBody这样的场景，
            请求参数无法使用@ApiImplicitParam注解进行描述的时候）
    @ApiModelProperty：用在属性上，描述响应类的属性
```

# `SpringBoot`整合`knife4j-spring-boot-starter`

> 不喜欢Swagger-ui样式的可以使用knife4j

这里使用的SpringBoot版本为`2.7.3` 

1. 导入依赖,只需要导入这一个依赖就可以

```xml
<dependency>
       <groupId>com.github.xiaoymin</groupId>
       <artifactId>knife4j-spring-boot-starter</artifactId>
       <version>3.0.3</version>
</dependency>
```

2. 创建配置类,和整合swagger2的配置一模一样

```java
/**
 * sknife4j-spring-boot-starter配置类
 * @author: DW @date: 2022/9/3 14:58
 * @EnableSwagger2开启swagger2的注解
 */
@Configuration
@EnableSwagger2
public class SwaggerConfig {

    /**
     * @return 配置Swagger的Docker的bean实例
     *  .apis()用来配置要扫描的  RequestHandlerSelectors 配置扫描发生
     *      .basePackage("包路径") 指定包扫描
     *      .any()  扫描全部
     *      .none() 全部不扫描
     *      .withClassAnnotation()  扫描类上的注解参数是注解的反射对象
     *      .withMethodAnnotation() 扫描方法上的注解
     *  。paths()用来配置要屏蔽的 PathSelectors配置屏蔽方式
     *  .enable()表示是否启用swagger2  默认为true启用
     *  .groupName("分组名") 设置分组
     */
    @Bean
    public Docket docket() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .enable(true)
                .groupName("分组名")
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.dw.blogApi.controller"))
                .build();
    }

    /**
     * @return  配置Swagger信息apiInfo
     */
    private ApiInfo apiInfo() {
        //定义作者信息
        Contact contact = new Contact("作者名称","地址","邮箱");
        return new ApiInfo(
                "文档标题",
                "文档描述",
                "版本",
                "访问地址",
                contact,
                "执照信息",
                "执照url",
                new ArrayList()
        );
    }
}

```

> 如果发生错误则说明版本冲突

在配置文件中加上

```yml
  # springboot与swagger/knife4j版本冲突问题的 matching-strategy是path_pattern_parser，改为之前的ant_path_matcher
  spring:
  	mvc:
    	pathmatch:
      		matching-strategy: ant_path_matcher
```

访问:http://localhost:9090/doc.html  就可以看到接口文档