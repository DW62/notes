# 自定义SpringBoot项目的Banner

在SpringBoot项目启动的时候会默认展示，SpringBoot的Banner

![image-20221013195814143](https://raw.githubusercontent.com/DW62/ImgStg/master/202210131958192.png)

有时我们需要自定义Banner。

> 自定义 banner 的实现方式有两种，一种是通过重写自定义的 Banner 类来实现，另一种通过 txt 文件来实现。

## 通过重写Banner类来实现自定义

1. 首先，我们需要自定义Banner接口。

```java
/**
 * 自定义实现Banner类
 */
public class MyBanner implements Banner {
    //来设置自定义的Banner
    private String BANNER=
                    " ______         ____      ____ \n" +
                    "|_   _ `.      |_  _|    |_  _|\n" +
                    "  | | `.        \\ \\ \\  /\\  / /  \n" +
                    "  | |  | |       \\ \\/  \\/ /   \n" +
                    " _| |_.' /        \\  /\\  /    \n" +
                    "|______.'          \\/  \\/     \n";
    @Override
    public void printBanner(Environment environment, Class<?> sourceClass, PrintStream out) {
        out.println(BANNER);
        out.println();
    }
}
```

2. 修改SpringBoot启动类，设置Banner类为自定义类

```java
@SpringBootApplication
public class Security01Application {

    public static void main(String[] args) {
        SpringApplication springApplication = new SpringApplication(Security01Application.class);
        //设置自定义Banner
        springApplication.setBanner(new MyBanner());
        //启动SpringBoot
        springApplication.run(args);
    }
}
```

运行效果：

![image-20221013200956250](https://raw.githubusercontent.com/DW62/ImgStg/master/202210132009281.png)

## 通过txt文件实现自定义Banner

我们可以在 Spring Boot 工程的 /src/main/resources 目录下创建一个 banner.txt 文件，然后将 ASCII 字符画复制进去，就能替换默认的 banner 了，如下图所示：

![image-20221013201214615](https://raw.githubusercontent.com/DW62/ImgStg/master/202210132012647.png)

之所以可以使用 banner.txt 文件的方式实现自定义 banner 是因为 Spring Boot 框架在启动时会按照以下顺序，查找 banner 信息：

- 先在 Classpath 下找 文件 banner.gif 或 banner.jpg 或 banner.png , 先找到谁就用谁；
- 以上都没有就在 Classpath 下找 banner.txt；
- 如果都没找到才会使用默认的 SpringBootBanner。

所以我们才能使用 banner.txt 自定义 banner 信息，当然你也可以使用图片的方式来自定义 banner。

> 小技巧：我们可以使用 banner.gif 来实现动态 banner 的效果，动手试试吧。

**此种方式实现起来比较简单，且是无代码侵入式的，推荐使用这种方式。**

```txt
 ______   ____      ____ 
|_   _ `.|_  _|    |_  _|
  | | `. \ \ \  /\  / /  
  | |  | |  \ \/  \/ /   
 _| |_.' /   \  /\  /    
|______.'     \/  \/     
```

## Banner样式控制

我们还可以修改 banner 的演示以及其他属性，例如字体的样式，粗体、斜体等，Spring Boot 为提供了三个枚举类来设定这些样式，他们分别是：

- AnsiColor：用来设定字符的前景色；
- AnsiBackground：用来设定字符的背景色。
- AnsiStyle：用来控制加粗、斜体、下划线等等。

例如,我们可以使用 AnsiColor 来设置颜色，banner.txt 中的信息如下：

```txt
${AnsiColor.BRIGHT_GREEN}______   ____      ____
${AnsiColor.BRIGHT_MAGENTA}|_   _ `.|_  _|    |_  _|
${AnsiColor.BRIGHT_YELLOW}  | | `. \ \ \  /\  / /
${AnsiColor.BRIGHT_YELLOW}  | |  | |  \ \/  \/ /
${AnsiColor.BRIGHT_MAGENTA} _| |_.' /   \  /\  /
${AnsiColor.BRIGHT_GREEN}|______.'     \/  \/
```

效果：

![image-20221013202742685](https://raw.githubusercontent.com/DW62/ImgStg/master/202210132027720.png)

## Banner使用输出变量

* Spring Boot 版本：${spring-boot.version}

## Banner图在线生成

在线生成 banner 的地址：

- [www.bootschool.net/ascii](https://link.juejin.cn?target=https%3A%2F%2Fwww.bootschool.net%2Fascii)
- [www.network-science.de/ascii/](https://link.juejin.cn?target=http%3A%2F%2Fwww.network-science.de%2Fascii%2F)
- [patorjk.com/software/ta…](https://link.juejin.cn?target=http%3A%2F%2Fpatorjk.com%2Fsoftware%2Ftaag%2F)
- [www.degraeve.com/img2txt.php](https://link.juejin.cn?target=http%3A%2F%2Fwww.degraeve.com%2Fimg2txt.php)

## 隐藏Banner

如果我们需要隐藏 banner 信息，可以通过以下**两种方法**实现。

### 1.通过代码关闭Banner

我们可以在 Spring Boot 启动（run）之前设置隐藏 banner，实现代码如下：

```java
@SpringBootApplication
public class Security01Application {

    public static void main(String[] args) {
        SpringApplication springApplication = new SpringApplication(Security01Application.class);
        //隐藏Banner
        springApplication.setBannerMode(Banner.Mode.OFF);
        //启动SpringBoot
        springApplication.run(args);
    }
}
```

### 2.通过配置文件隐藏Banner

在 Spring Boot 的配置文件 `application.properties` 通过设置如下配置来隐藏 banner 的显示，配置如下：

```ini
spring.main.banner-mode=off
```



## 直接可以使用的banner.txt 文件

```txt
${AnsiColor.BRIGHT_CYAN}                        *********************************
${AnsiColor.MAGENTA}                        *    ______   ____      ____    *
${AnsiColor.BLUE}                        *   |_   _ `.|_  _|    |_  _|   *
${AnsiColor.BRIGHT_GREEN}                        *     | | `. \ \ \  /\  / /     *
${AnsiColor.BRIGHT_RED}                        *     | |  | |  \ \/  \/ /      *
${AnsiColor.BRIGHT_GREEN}                        *    _| |_.' /   \  /\  /       *
${AnsiColor.BLUE}                        *   |______.'     \/  \/        *
${AnsiColor.MAGENTA}                        *   Spring Boot 版本：${spring-boot.version}      *
${AnsiColor.BRIGHT_CYAN}                        *********************************
```

