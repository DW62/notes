# Servlet

## 关于系统架构

系统架构包括什么形式？
- C/S架构   （客户端Client / 服务器Server）
- B/S架构  （Browser浏览器 / Server服务器）

> C/S架构  （客户端Client / 服务器Server）
>
> ​	特点：需要安装特定的客户端软件。

C/S架构优点：
- 速度快（软件中的数据大部分都是集成到客户端软件当中的，很少量的数据从服务器端传送过来，所以C/S结构的系统速度快）
- 体验好（速度又快，界面又酷炫）
- 界面酷炫（专门的语言去实现界面的，更加灵活。）
- 服务器压力小（因为大量的数据都是集成在客户端软件当中，服务器只需要传送很少的数据量服务器压力小。）
- 安全（因为大量的数据是集成在客户端软件当中的，并且客户端有很多个，服务器虽然只有一个，就算服务器那边出现意外，但是大量的数据在多个客户端上有缓存，有存储，所以从这个方面来说，C/S结构的系统比较安全。）

C/S架构缺点：
- 升级维护比较差劲。（升级维护比较麻烦。成本比较高。每一个客户端软件都需要升级。有一些软件不是那么容易安装的。）

> B/S架构  （Browser浏览器 / Server服务器）
>
> ​		实际上B/S结构的系统还是一个C/S，只不过这个C比较特殊，这个Client是一个固定不变浏览器软件

B/S架构优点：
- 升级维护方便，成本比较低。（只需要升级服务器端即可。）
- 不需要安装特定的客户端软件，用户操作极其方便。只需要打开浏览器，输入网址即可。

B/S架构缺点：
- 速度慢（因为所有的数据都是在服务器上，用户发送的每一个请求都是需要服务器全身心的响应数据，所以B/S结构的系统在网络中传送的数据量比较大。）
- 体验差（界面不是那么酷炫，因为浏览器只支持三个语言HTML CSS JavaScript。在加上速度慢。）
- 不安全（所有的数据都在服务器上，服务器发生意外，数据会丢失。）

>C/S和B/S结构的系统，哪个好，哪个不好？
>
>​		并不是哪个好，哪个不好。不同结构的系统在不同的业务场景下有不同的适用场景。

娱乐性软件建议使用   C/S 结构

公司内部使用的一些业务软件建议使用B/S 结构
- 公司内部使用的系统，需要维护成本低。
- 公司内部使用的系统，不需要很酷炫。
- 公司内部使用的企业级系统主要是能够进行数据的维护即可。

## 关于WEB服务器软件

WEB服务器软件都有哪些呢？
- Tomcat（WEB服务器）
- jetty（WEB服务器）
- JBOSS（应用服务器）
- WebLogic（应用服务器）
- WebSphere（应用服务器）

应用服务器和WEB服务器的关系？
- 应用服务器实现了JavaEE的所有规范。(JavaEE有13个不同的规范。)
- WEB服务器只实现了JavaEE中的Servlet + JSP两个核心的规范。
- 应用服务器是包含WEB服务器的。

> Tomcat

apache官网地址：https://www.apache.org/

tomcat官网地址：https://tomcat.apache.org

tomcat还有另外一个名字：catalina（catalina是美国的一个岛屿，风景秀丽，据说作者是在这个风景秀丽的小岛上开发了一个轻量级的WEB服务器，体积小，运行速度快，因此tomcat又被称为catalina）

tomcat的logo是一只公猫（寓意表示Tomcat服务器是轻巧的，小巧的，果然，体积小，运行速度快，只实现了Servlet+JSP规范）

tomcat是java语言写的。

tomcat服务器要想运行，必须先又jre（Java的运行时环境）

**关于Tomcat服务器的目录**

- bin ： 这个目录是Tomcat服务器的命令文件存放的目录，比如：启动Tomcat，关闭Tomcat等。
- conf： 这个目录是Tomcat服务器的配置文件存放目录。（server.xml文件中可以配置端口号，默认Tomcat端口是8080）
- lib ：这个目录是Tomcat服务器的核心程序目录，因为Tomcat服务器是Java语言编写的，这里的jar包里面都是class文件。
- logs: Tomcat服务器的日志目录，Tomcat服务器启动等信息都会在这个目录下生成日志文件。
- temp：Tomcat服务器的临时目录。存储临时文件。
- webapps：这个目录当中就是用来存放大量的webapp（web application：web应用）
- work：这个目录是用来存放JSP文件翻译之后的java文件以及编译之后的class文件。

- 配置Tomcat服务器需要哪些环境变量？
  - JAVA_HOME=JDK的根
  - CATALINA_HOME=Tomcat服务器的根
  - PATH=%JAVA_HOME%\bin;%CATALINA_HOME%\bin
- 启动Tomcat： startup
- 关闭Tomcat：stop （shutdown.bat文件重命名为stop.bat，为什么？原因是shutdown命令和windows中的关机命令冲突。所以修改一下。）

## 开发一个带有Servlet（Java小程序）的webapp

**开发步骤**

- 第一步：在webapps目录下新建一个目录，起名crm（这个crm就是webapp的名字）。当然，也可以是其它项目，比如银行项目，可以创建一个目录bank，办公系统可以创建一个oa。

  - 注意：crm就是这个webapp的根

- 第二步：在webapp的根下新建一个目录：WEB-INF

  - 注意：这个目录的名字是Servlet规范中规定的，必须全部大写，必须一模一样。必须的必须。

- 第三步：在WEB-INF目录下新建一个目录：classes

  - 注意：这个目录的名字必须是全部小写的classes。这也是Servlet规范中规定的。另外这个目录下一定存放的是Java程序编译之后的class文件（这里存放的是字节码文件）。

- 第四步：在WEB-INF目录下新建一个目录：lib

  - 注意：这个目录不是必须的。但如果一个webapp需要第三方的jar包的话，这个jar包要放到这个lib目录下，这个目录的名字也不能随意编写，必须是全部小写的lib。例如java语言连接数据库需要数据库的驱动jar包。那么这个jar包就一定要放到lib目录下。这Servlet规范中规定的。

- 第五步：在WEB-INF目录下新建一个文件：web.xml

  - 注意：这个文件是必须的，这个文件名必须叫做web.xml。这个文件必须放在这里。一个合法的webapp，web.xml文件是必须的，这个web.xml文件就是一个配置文件，在这个配置文件中描述了请求路径和Servlet类之间的对照关系。

  - 这个文件最好从其他的webapp中拷贝，最好别手写。没必要。复制粘贴

  - ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    
    <web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee
                          https://jakarta.ee/xml/ns/jakartaee/web-app_5_0.xsd"
      version="5.0"
      metadata-complete="true">
    
    
    </web-app>
    
    ```

- 第六步：编写一个Java程序，这个小Java程序也不能随意开发，这个小java程序必须实现Servlet接口。

  - 这个Servlet接口不在JDK当中。（因为Servlet不是JavaSE了。Servlet属于JavaEE，是另外的一套类库。）

  - Servlet接口（Servlet.class文件）是Oracle提供的。（最原始的是sun公司提供的。）

  - Servlet接口是JavaEE的规范中的一员。

  - Tomcat服务器实现了Servlet规范，所以Tomcat服务器也需要使用Servlet接口。Tomcat服务器中应该有这个接口，Tomcat服务器的CATALINA_HOME\lib目录下有一个servlet-api.jar，解压这个servlet-api.jar之后，你会看到里面有一个Servlet.class文件。

    **重点：从JakartaEE9开始，Servlet接口的全名变了：jakarta.servlet.Servlet**

  - 注意：编写这个Java小程序的时候，java源代码你愿意在哪里就在哪里，位置无所谓，你只需要将java源代码编译之后的class文件放到classes目录下即可。

- 第七步：编译我们编写的HelloServlet

  - 重点：怎么能让你的HelloServlet编译通过呢？配置环境变量CLASSPATH

    CLASSPATH=.;C:\dev\apache-tomcat-10.0.12\lib\servlet-api.jar

  - 思考问题：以上配置的CLASSPATH和Tomcat服务器运行有没有关系？

    - 没有任何关系，以上配置这个环境变量只是为了让你的HelloServlet能够正常编译生成class文件。

- 第八步：将以上编译之后的HelloServlet.class文件拷贝到WEB-INF\classes目录下。

- 第九步：在web.xml文件中编写配置信息，让“请求路径”和“Servlet类名”关联在一起。

  - 这一步用专业术语描述：在web.xml文件中注册Servlet类。

  - ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    
    <web-app xmlns="https://jakarta.ee/xml/ns/jakartaee"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="https://jakarta.ee/xml/ns/jakartaee
                          https://jakarta.ee/xml/ns/jakartaee/web-app_5_0.xsd"
      version="5.0"
      metadata-complete="true">
    
    	<!--servlet描述信息-->
    	<!--任何一个servlet都对应一个servlet-mapping -->
    	<servlet>
    		<servlet-name>fdsafdsagfdsafdsa</servlet-name>
    		<!--这个位置必须是带有包名的全限定类名-->
    		<servlet-class>com.servlet.HelloServlet</servlet-class>
    	</servlet>
    
    	<!--servlet映射信息-->
    	<servlet-mapping>
    		<!--这个也是随便的，不过这里写的内容要和上面的一样。-->
    		<servlet-name>fdsafdsagfdsafdsa</servlet-name>
    		<!--这里需要一个路径-->
    		<!--这个路径唯一的要求是必须以 / 开始-->
    		<!--当前这个路径可以随便写-->
    		<url-pattern>/fdsa/fd/saf/d/sa/fd/sa/fd</url-pattern>
    	</servlet-mapping>
    	
    </web-app>
    
    ```

- 第十步：启动Tomcat服务器

- 第十一步：打开浏览器，在浏览器地址栏上输入一个url，这个URL必须是：

  - http://127.0.0.1:8080/crm/fdsa/fd/saf/d/sa/fd/sa/fd   
  - 非常重要的一件事：浏览器上的请求路径不能随便写，这个请求路径必须和web.xml文件中的url-pattern一致。
  - 注意：浏览器上的请求路径和web.xml文件中的url-pattern的唯一区别就是：浏览器上的请求路径带项目名：/crm

- 浏览器上编写的路径太复杂，可以使用超链接。（**非常重要：html页面只能放到WEB-INF目录外面。**）

- 以后不需要我们编写main方法了。tomcat服务器负责调用main方法，Tomcat服务器启动的时候执行的就是main方法。我们javaweb程序员只需要编写Servlet接口的实现类，然后将其注册到web.xml文件中，即可。

  >一个合法的webapp目录结构应该是

  ```
  webapproot
       |------WEB-INF
       		  |------classes(存放字节码)
       		  |------lib(第三方jar包)
       		  |------web.xml(注册Servlet)
       |------html
       |------css
       |------javascript
       |------image
       ....
  ```

- 浏览器发送请求，到最终服务器调用Servlet中的方法，是怎样的一个过程？（以下这个过程描述的很粗糙）

  - 用户输入URL，或者直接点击超链接：http://127.0.0.1:8080/crm/fdsa/fd/saf/d/sa/fd/sa/fd  
  - 然后Tomcat服务器接收到请求，截取路径：/crm/fdsa/fd/saf/d/sa/fd/sa/fd  
  - Tomcat服务器找到crm项目
  - Tomcat服务器在web.xml文件中查找/fdsa/fd/saf/d/sa/fd/sa/fd  对应的Servlet是：com.bjpowernode.servlet.HelloServlet
  - Tomcat服务器通过反射机制，创建com.bjpowernode.servlet.HelloServlet的对象。
  - Tomcat服务器调用com.bjpowernode.servlet.HelloServlet对象的service方法。

## 关于JavaEE的版本

- JavaEE目前最高版本是 JavaEE8
- JavaEE被Oracle捐献了，Oracle将JavaEE规范捐献给Apache了。Apache把JavaEE换名了，以后不叫JavaEE了，以后叫做 jakarta EE。以后没有JavaEE了。以后都叫做Jakarta EE。
- JavaEE8版本升级之后的"JavaEE 9"，不再是"JavaEE9"这个名字了，叫做JakartaEE9
- JavaEE8的时候对应的Servlet类名是：javax.servlet.Servlet
- JakartaEE9的时候对应的Servlet类名是：jakarta.servlet.Servlet （包名都换了）

> 如果你之前的项目还是在使用javax.servlet.Servlet，那么你的项目无法直接部署到Tomcat10+版本上。你只能部署到Tomcat9-版本上。在Tomcat9以及Tomcat9之前的版本中还是能够识别javax.servlet这个包。

## 解决Tomcat服务器在DOS命令窗口中的乱码问题（控制台乱码）

将CATALINA_HOME/conf/logging.properties文件中的内容修改如下：

java.util.logging.ConsoleHandler.encoding = GBK

## Servlet对象的生命周期

> 自己new的Servlet对象是不受WEB容器管理的。

- WEB容器创建的Servlet对象，这些Servlet对象都会被放到一个集合当中（HashMap），只有放到这个HashMap集合中的Servlet才能够被WEB容器管理，自己new的Servlet对象不会被WEB容器管理。（自己new的Servlet对象不在容器当中）
- web容器底层应该有一个HashMap这样的集合，在这个集合当中存储了Servlet对象和请求路径之间的关系

> 默认情况下服务器在启动的Servlet对象有没有被创建出来？

- 在Servlet中提供一个无参数的构造方法，启动服务器的时候看看构造方法是否执行。
- 经过测试得出结论：**默认情况下，服务器在启动的时候Servlet对象并不会被实例化。**
- 这个设计是合理的。用户没有发送请求之前，如果提前创建出来所有的Servlet对象，必然是耗费内存的，并且创建出来的Servlet如果一直没有用户访问，显然这个Servlet对象没必要先创建。

怎么让服务器启动的时候创建Servlet对象呢？

​		在servlet标签中添加<load-on-startup>子标签，在该子标签中填写整数，越小的整数优先级越高。

```xml
<servlet>
    <servlet-name>aservlet</servlet-name>
    <servlet-class>com.bjpowernode.javaweb.servlet.AServlet</servlet-class>
    <load-on-startup>1</load-on-startup>
</servlet>
<servlet-mapping>
    <servlet-name>aservlet</servlet-name>
    <url-pattern>/a</url-pattern>
</servlet-mapping>
```

> Servlet对象生命周期
>
> ​		默认情况下服务器启动的时候Servlet对象并没有被实例化

**在发送第一次请求的时候**Servlet对象被实例化（Servlet的构造方法被执行了。并且执行的是无参数构造方法。）

- Servlet对象被创建出来之后，Tomcat服务器马上调用了Servlet对象的init方法。（init方法在执行的时候，Servlet对象已经存在了。已经被创建出来了。）
- 用户发送第一次请求的时候，init方法执行之后，Tomcat服务器马上调用Servlet对象的service方法。

**继续发送第二次及多次请求**：

- Servlet对象并没有新建，还是使用之前创建好的Servlet对象，直接调用该Servlet对象的service方法，这说明：

  - 第一：Servlet对象是单例的（单实例的。但是要注意：Servlet对象是单实例的，但是Servlet类并不符合单例模式。称之为假单例。之所以单例是因为Servlet对象的创建我们程序员管不着，这个对象的创建只能由Tomcat来说了算，Tomcat只创建了一个，所以导致了单例，但是属于假单例。真单例模式，构造方法是私有化的。）
  - 第二：无参数构造方法、init方法只在第一次用户发送请求的时候执行。也就是说无参数构造方法只执行一次。init方法也只被Tomcat服务器调用一次。
  - 第三：只要用户发送一次请求：service方法必然会被Tomcat服务器调用一次。发送100次请求，service方法会被调用100次。

**关闭服务器的时候**

​	Servlet的destroy方法执行，并且只被Tomcat服务器调用一次

​			因为服务器关闭的时候要销毁Servlet对象的内存，所以destroy方法在服务器销毁Servlet对象内存之前被Tomcat服务器自动调用执行。

> destroy方法执行的时候Servlet对象还在，没有被销毁。destroy方法执行结束之后，Servlet对象的内存才会被Tomcat释放。

Servlet对象更像一个人的一生：

- Servlet的无参数构造方法执行：标志着你出生了。
- Servlet对象的init方法的执行：标志着你正在接受教育。
- Servlet对象的service方法的执行：标志着你已经开始工作了，已经开始为人类提供服务了。
- Servlet对象的destroy方法的执行：标志着临终。有什么遗言，抓紧的。要不然，来不及了。

**Servlet类中方法的调用次数？**

- 构造方法只执行一次。
- init方法只执行一次。
- service方法：用户发送一次请求则执行一次，发送N次请求则执行N次。
- destroy方法只执行一次。

**当在Servlet类中编写一个有参数的构造方法，如果没有手动编写无参数构造方法会出现什么问题？**

- 如果没有无参数的构造方法，会导致出现500错误，无法实例化Servlet对象。所以在Servlet开发当中，不建议程序员来定义构造方法，因为定义不当，一不小心就会导致无法实例化Servlet对象。

**思考：Servlet的无参数构造方法是在对象第一次创建的时候执行，并且只执行一次。init方法也是在对象第一次创建的时候执行，并且只执行一次。那么这个无参数构造方法可以代替掉init方法吗？**

- 不能。Servlet规范中有要求，作为javaweb程序员，编写Servlet类的时候，不建议手动编写构造方法，因为编写构造方法，很容易让无参数构造方法消失，这个操作可能会导致Servlet对象无法实例化。所以init方法是有存在的必要的。

**init、service、destroy方法中使用最多的是哪个方法？**

- 使用最多就是service方法，service方法是一定要实现的，因为service方法是处理用户请求的核心方法。
- 什么时候使用init方法呢？
  - init方法很少用。通常在init方法当中做初始化操作，并且这个初始化操作只需要执行一次。例如：初始化数据库连接池，初始化线程池....
- 什么时候使用destroy方法呢？
  - destroy方法也很少用。通常在destroy方法当中，进行资源的关闭。马上对象要被销毁了，还有什么没有关闭的，抓紧时间关闭资源。还有什么资源没保存的，抓紧时间保存一下。

## GenericServlet

**我们编写一个Servlet类直接实现Servlet接口有什么缺点？**

​	我们只需要service方法，其他方法大部分情况下是不需要使用的，直接实现Servlet接口就会使程序无用的代码变多。



编写一个GenericServlet类，这个类是一个抽象类，其中有一个抽象方法service。

- GenericServlet实现Servlet接口。
- GenericServlet是一个适配器。
- 以后编写的所有Servlet类继承GenericServlet，重写service方法即可。

思考：GenericServlet类是否需要改造一下？怎么改造？更利于子类程序的编写？

- 思考第一个问题：我提供了一个GenericServlet之后，init方法还会执行吗？

  - 还会执行。会执行GenericServlet类中的init方法。

- 思考第二个问题：init方法是谁调用的？

  - Tomcat服务器调用的。

- 思考第三个问题：init方法中的ServletConfig对象是谁创建的？是谁传过来的？

  - 都是Tomcat干的。
  - Tomcat服务器先创建了ServletConfig对象，然后调用init方法，将ServletConfig对象传给了init方法。

- 思考一下Tomcat服务器伪代码：

  - ```java
    public class Tomcat {
        public static void main(String[] args){
            // .....
            // Tomcat服务器伪代码
            // 创建LoginServlet对象（通过反射机制，调用无参数构造方法来实例化LoginServlet对象）
            Class clazz = Class.forName("com.bjpowernode.javaweb.servlet.LoginServlet");
            Object obj = clazz.newInstance();
            
            // 向下转型
            Servlet servlet = (Servlet)obj;
            
            // 创建ServletConfig对象
            // Tomcat服务器负责将ServletConfig对象实例化出来。
            // 多态（Tomcat服务器完全实现了Servlet规范）
            ServletConfig servletConfig = new org.apache.catalina.core.StandardWrapperFacade();
            
            // 调用Servlet的init方法
            servlet.init(servletConfig);
            
            // 调用Servlet的service方法
            // ....
            
        }
    }
    ```

## ServletConfig

**什么是ServletConfig？**

- 是Servlet对象的配置信息对象。
- ServletConfig对象中封装了<servlet></servlet>标签中的配置信息。（web.xml文件中servlet的配置信息）

- 一个Servlet对应一个ServletConfig对象。

- Servlet对象是Tomcat服务器创建，并且ServletConfig对象也是Tomcat服务器创建。并且默认情况下，他们都是在用户发送第一次请求的时候创建。

- Tomcat服务器调用Servlet对象的init方法的时候需要传一个ServletConfig对象的参数给init方法。

- ServletConfig接口的实现类是Tomcat服务器给实现的。（Tomcat服务器说的就是WEB服务器。）

- ServletConfig接口有哪些常用的方法？

  - ```java
    public String getInitParameter(String name); // 通过初始化参数的name获取value
    public Enumeration<String> getInitParameterNames(); // 获取所有的初始化参数的name
    public ServletContext getServletContext(); // 获取ServletContext对象
    public String getServletName(); // 获取Servlet的name
    ```

  - 以上方法在Servlet类当中，都可以使用this去调用。因为GenericServlet实现了ServletConfig接口。

## ServletContext

> 一个Servlet对象对应一个ServletConfig。100个Servlet对象则对应100个ServletConfig对象。但是只要在同一个webapp当中，只要在同一个应用当中，所有的Servlet对象都是共享同一个ServletContext对象的。

ServletContext对象**在服务器启动阶段创建**，**在服务器关闭的时候销毁**。这就是ServletContext对象的生命周期。ServletContext对象是应用级对象。

- Tomcat服务器中有一个webapps，这个webapps下可以存放webapp，可以存放多个webapp，假设有100个webapp，那么就有100个ServletContext对象。但是，总之，一个应用，一个webapp肯定是只有一个ServletContext对象。

- **ServletContext被称为Servlet上下文对象**。（Servlet对象的四周环境对象。）

- 一个ServletContext对象通常对应的是一个web.xml文件。

- ServletContext对应显示生活中的什么例子呢？

  - 一个教室里有多个学生，那么每一个学生就是一个Servlet，这些学生都在同一个教室当中，那么我们可以把这个教室叫做ServletContext对象。那么也就是说放在这个ServletContext对象（环境）当中的数据，在同一个教室当中，物品都是共享的。比如：教室中有一个空调，所有的学生都可以操作。可见，空调是共享的。因为空调放在教室当中。教室就是ServletContext对象。

- **ServletContext是一个接口，Tomcat服务器对ServletContext接口进行了实现。**

  - **ServletContext对象的创建也是Tomcat服务器来完成的。启动webapp的时候创建的**。

- ServletContext接口中有哪些常用的方法？

  - ```java
    public String getInitParameter(String name); // 通过初始化参数的name获取value
    public Enumeration<String> getInitParameterNames(); // 获取所有的初始化参数的name
    ```

  - ```xml
    <!--以上两个方法是ServletContext对象的方法，这个方法获取的是什么信息？是以下的配置信息-->
    <context-param>
        <param-name>pageSize</param-name>
        <param-value>10</param-value>
    </context-param>
    <context-param>
        <param-name>startIndex</param-name>
        <param-value>0</param-value>
    </context-param>
    <!--注意：以上的配置信息属于应用级的配置信息，一般一个项目中共享的配置信息会放到以上的标签当中。-->
    <!--如果你的配置信息只是想给某一个servlet作为参考，那么你配置到servlet标签当中即可，使用ServletConfig对象来获取。-->
    ```

  - ```java
    // 获取应用的根路径（非常重要），因为在java源代码当中有一些地方可能会需要应用的根路径，这个方法可以动态获取应用的根路径
    // 在java源码当中，不要将应用的根路径写死，因为你永远都不知道这个应用在最终部署的时候，起一个什么名字。
    public String getContextPath();
    //String contextPath = application.getContextPath();
    ```

  - ```java
    // 获取文件的绝对路径（真实路径）
    public String getRealPath(String path);
    ```

  - ```java
    // 通过ServletContext对象也是可以记录日志的
    public void log(String message);
    public void log(String message, Throwable t);
    // 这些日志信息记录到哪里了？
    // localhost.2021-11-05.log
    
    // Tomcat服务器的logs目录下都有哪些日志文件？
    //catalina.2021-11-05.log 服务器端的java程序运行的控制台信息。
    //localhost.2021-11-05.log ServletContext对象的log方法记录的日志信息存储到这个文件中。
    //localhost_access_log.2021-11-05.txt 访问日志
    ```

  - ```java
    // ServletContext对象还有另一个名字：应用域（后面还有其他域，例如：请求域、会话域）
    
    // 如果所有的用户共享一份数据，并且这个数据很少的被修改，并且这个数据量很少，可以将这些数据放到ServletContext这个应用域中
    
    // 为什么是所有用户共享的数据？ 不是共享的没有意义。因为ServletContext这个对象只有一个。只有共享的数据放进去才有意义。
    
    // 为什么数据量要小？ 因为数据量比较大的话，太占用堆内存，并且这个对象的生命周期比较长，服务器关闭的时候，这个对象才会被销毁。大数据量会影响服务器的性能。占用内存较小的数据量可以考虑放进去。
    
    // 为什么这些共享数据很少的修改，或者说几乎不修改？
    // 所有用户共享的数据，如果涉及到修改操作，必然会存在线程并发所带来的安全问题。所以放在ServletContext对象中的数据一般都是只读的。
    
    // 数据量小、所有用户共享、又不修改，这样的数据放到ServletContext这个应用域当中，会大大提升效率。因为应用域相当于一个缓存，放到缓存中的数据，下次在用的时候，不需要从数据库中再次获取，大大提升执行效率。
    
    // 存（怎么向ServletContext应用域中存数据）
    public void setAttribute(String name, Object value); // map.put(k, v)
    // 取（怎么从ServletContext应用域中取数据）
    public Object getAttribute(String name); // Object v = map.get(k)
    // 删（怎么删除ServletContext应用域中的数据）
    public void removeAttribute(String name); // map.remove(k)
    ```

- 注意：**以后我们编写Servlet类的时候，实际上是不会去直接继承GenericServlet类的**，因为我们是B/S结构的系统，这种系统是基于HTTP超文本传输协议的，在Servlet规范当中，提供了一个类叫做HttpServlet，它是专门为HTTP协议准备的一个Servlet类。我们编写的Servlet类要继承HttpServlet。（HttpServlet是HTTP协议专用的。）使用HttpServlet处理HTTP协议更便捷。但是你需要直到它的继承结构：

  - ```Java
    jakarta.servlet.Servlet（接口）【爷爷】
    jakarta.servlet.GenericServlet implements Servlet（抽象类）【儿子】
    jakarta.servlet.http.HttpServlet extends GenericServlet（抽象类）【孙子】
    
    我们以后编写的Servlet要继承HttpServlet类。
    ```

## HTTP协议

**什么是协议？**

- 协议实际上是某些人，或者某些组织提前制定好的一套规范，大家都按照这个规范来，这样可以做到沟通无障碍。
- 协议就是一套规范，就是一套标准。由其他人或其他组织来负责制定的。
- 我说的话你能听懂，你说的话，我也能听懂，这说明我们之间是有一套规范的，一套协议的，这套协议就是：中国普通话协议。我们都遵守这套协议，我们之间就可以沟通无障碍。

**什么是HTTP协议？**

* HTTP协议：是W3C制定的一种超文本传输协议。（通信协议：发送消息的模板提前被制定好。）
* W3C：
  * 万维网联盟组织，负责制定标准的：HTTP HTML4.0 HTML5 XML DOM等规范都是W3C制定的。
  * 万维网之父：蒂姆·伯纳斯·李

**什么是超文本？**

- 超文本说的就是：不是普通文本，比如流媒体：声音、视频、图片等。
- HTTP协议支持：不但可以传送普通字符串，同样支持传递声音、视频、图片等流媒体信息。

- 这种协议游走在B和S之间。B向S发数据要遵循HTTP协议。S向B发数据同样需要遵循HTTP协议。这样B和S才能解耦合。

浏览器   向   WEB服务器发送数据，叫做：请求（request)

WEB服务器   向   浏览器发送数据，叫做：响应（response）

HTTP协议包括：
- 请求协议
  - 浏览器  向   WEB服务器发送数据的时候，这个发送的数据需要遵循一套标准，这套标准中规定了发送的数据具体格式。
- 响应协议
  - WEB服务器  向  浏览器发送数据的时候，这个发送的数据需要遵循一套标准，这套标准中规定了发送的数据具体格式。

**HTTP协议就是提前制定好的一种消息模板。**

HTTP的请求协议（B --> S）

- HTTP的请求协议包括：**请求行**、**请求头**、**空白行**、**请求体**4部分

- HTTP请求协议的具体报文：GET请求

  - ```http
    GET /servlet05/getServlet?username=lucy&userpwd=1111 HTTP/1.1                        请求行
    Host: localhost:8080                                                                    请求头
    Connection: keep-alive
    sec-ch-ua: "Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"
    sec-ch-ua-mobile: ?0
    sec-ch-ua-platform: "Windows"
    Upgrade-Insecure-Requests: 1
    User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36
    Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
    Sec-Fetch-Site: same-origin
    Sec-Fetch-Mode: navigate
    Sec-Fetch-User: ?1
    Sec-Fetch-Dest: document
    Referer: http://localhost:8080/servlet05/index.html
    Accept-Encoding: gzip, deflate, br
    Accept-Language: zh-CN,zh;q=0.9
                                                                                            空白行
                                                                                            请求体
    ```

- HTTP请求协议的具体报文：POST请求

  - ```http
    POST /servlet05/postServlet HTTP/1.1                                                  请求行
    Host: localhost:8080                                                                  请求头
    Connection: keep-alive
    Content-Length: 25
    Cache-Control: max-age=0
    sec-ch-ua: "Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"
    sec-ch-ua-mobile: ?0
    sec-ch-ua-platform: "Windows"
    Upgrade-Insecure-Requests: 1
    Origin: http://localhost:8080
    Content-Type: application/x-www-form-urlencoded
    User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36
    Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
    Sec-Fetch-Site: same-origin
    Sec-Fetch-Mode: navigate
    Sec-Fetch-User: ?1
    Sec-Fetch-Dest: document
    Referer: http://localhost:8080/servlet05/index.html
    Accept-Encoding: gzip, deflate, br
    Accept-Language: zh-CN,zh;q=0.9
                                                                                          空白行
    username=lisi&userpwd=123                                                             请求体
    ```

  **请求行**包括三部分:

  - 第一部分：请求方式（7种）
    - get（常用的）
    - post（常用的）
    - delete
    - put
    - head
    - options
    - trace
  - 第二部分：URI
    - 什么是URI？ 统一资源标识符。代表网络中某个资源的名字。但是通过URI是无法定位资源的。
    - 什么是URL？统一资源定位符。代表网络中某个资源，同时，通过URL是可以定位到该资源的。
    - URI和URL什么关系，有什么区别？
      - URL包括URI
      - http://localhost:8080/servlet05/index.html 这是URL。
      - /servlet05/index.html 这是URI。
  - 第三部分：HTTP协议版本号

  **请求头**

  - 请求的主机
  - 主机的端口
  - 浏览器信息
  - 平台信息
  - cookie等信息
  - ....

  **空白行**

  - 空白行是用来区分“请求头”和“请求体”

  **请求体**

  - 向服务器发送的具体数据。

HTTP的响应协议（S --> B）

- HTTP的响应协议包括：**状态行**、**响应头**、**空白行**、**响应体**4部分

- HTTP响应协议的具体报文：

  - ```http
    HTTP/1.1 200 ok                                     状态行
    Content-Type: text/html;charset=UTF-8               响应头
    Content-Length: 160
    Date: Mon, 08 Nov 2021 13:19:32 GMT
    Keep-Alive: timeout=20
    Connection: keep-alive
                                                        空白行
    <!doctype html>                                     响应体
    <html>
        <head>
            <title>from get servlet</title>
        </head>
        <body>
            <h1>from get servlet</h1>
        </body>
    </html>
    ```

  **状态行**由三部分组成：

  - 第一部分：协议版本号（HTTP/1.1）
  - 第二部分：状态码（HTTP协议中规定的响应状态号。不同的响应结果对应不同的号码。）
    - 200 表示请求响应成功，正常结束。
    - 404表示访问的资源不存在，通常是因为要么是你路径写错了，要么是路径写对了，但是服务器中对应的资源并没有启动成功。总之404错误是前端错误。
    - 405表示前端发送的请求方式与后端请求的处理方式不一致时发生：
      - 比如：前端是POST请求，后端的处理方式按照get方式进行处理时，发生405
      - 比如：前端是GET请求，后端的处理方式按照post方式进行处理时，发生405
    - 500表示服务器端的程序出现了异常。一般会认为是服务器端的错误导致的。
    - 以4开始的，一般是浏览器端的错误导致的。
    - 以5开始的，一般是服务器端的错误导致的。
  - 第三部分：状态的描述信息
    - ok 表示正常成功结束。
    - not found 表示资源找不到。

  **响应头**：

  - 响应的内容类型
  - 响应的内容长度
  - 响应的时间
  - ....

  **空白行**：

  - 用来分隔“响应头”和“响应体”的。

  **响应体**：

  - 响应体就是响应的正文，这些内容是一个长的字符串，这个字符串被浏览器渲染，解释并执行，最终展示出效果。

**GET请求和POST请求有什么区别？**

- get请求发送数据的时候，数据会挂在URI的后面，并且在URI后面添加一个“?”，"?"后面是数据。这样会导致发送的数据回显在浏览器的地址栏上。（get请求在“请求行”上发送数据）
  - http://localhost:8080/servlet05/getServlet?username=zhangsan&userpwd=1111
- post请求发送数据的时候，在请求体当中发送。不会回显到浏览器的地址栏上。也就是说post发送的数据，在浏览器地址栏上看不到。（post在“请求体”当中发送数据）
- get请求只能发送普通的字符串。并且发送的字符串长度有限制，不同的浏览器限制不同。这个没有明确的规范。
- get请求无法发送大数据量。
- post请求可以发送任何类型的数据，包括普通字符串，流媒体等信息：视频、声音、图片。
- post请求可以发送大数据量，理论上没有长度限制。
- get请求在W3C中是这样说的：get请求比较适合从服务器端获取数据。
- post请求在W3C中是这样说的：post请求比较适合向服务器端传送数据。
- get请求是安全的。get请求是绝对安全的。为什么？因为get请求只是为了从服务器上获取数据。不会对服务器造成威胁。
- post请求是危险的。因为post请求是向服务器提交数据，如果这些数据通过后门的方式进入到服务器当中，服务器是很危险的。另外post是为了提交数据，所以一般情况下拦截请求的时候，大部分会选择拦截（监听）post请求。
- get请求支持缓存。
  - 任何一个get请求最终的“响应结果”都会被浏览器缓存起来。在浏览器缓存当中：
  - 实际上，你只要发送get请求，浏览器做的第一件事都是先从本地浏览器缓存中找，找不到的时候才会去服务器上获取。这种缓存机制目的是为了提高用户的体验。
  - 有没有这样一个需求：我们不希望get请求走缓存，怎么办？怎么避免走缓存？我希望每一次这个get请求都去服务器上找资源，我不想从本地浏览器的缓存中取。
    - 只要每一次get请求的请求路径不同即可。可以在路径的后面添加一个每时每刻都在变化的“时间戳”，这样，每一次的请求路径都不一样，浏览器就不走缓存了。
- post请求不支持缓存。（POST是用来修改服务器端的资源的。）
  - post请求之后，服务器“响应的结果”不会被浏览器缓存起来。因为这个缓存没有意义。

**GET请求和POST请求如何选择，什么时候使用GET请求，什么时候使用POST请求？**

- 如果你是想从服务器上获取资源，建议使用GET请求，如果你这个请求是为了向服务器提交数据，建议使用POST请求。
- 大部分的form表单提交，都是post方式，因为form表单中要填写大量的数据，这些数据是收集用户的信息，一般是需要传给服务器，服务器将这些数据保存/修改等。
- 如果表单中有敏感信息，还是建议适用post请求，因为get请求会回显敏感信息到浏览器地址栏上。（例如：密码信息）
- 做文件上传，一定是post请求。要传的数据不是普通文本。
- 其他情况都可以使用get请求。

- **不管你是get请求还是post请求，发送的请求数据格式是完全相同的，只不过位置不同，格式都是统一的**：
  - name=value&name=value&name=value&name=value
  - name是什么？
    - 以form表单为例：form表单中input标签的name。
  - value是什么？
    - 以form表单为例：form表单中input标签的value。

## HttpServlet源码分析

​	HttpServlet类是专门为HTTP协议准备的。比GenericServlet更加适合HTTP协议下的开发。

HttpServlet在哪个包下？

- jakarta.servlet.http.HttpServlet

**http包下都有哪些类和接口呢？jakarta.servlet.http.*;**

- jakarta.servlet.http.HttpServlet （HTTP协议专用的Servlet类，抽象类）
- jakarta.servlet.http.HttpServletRequest （HTTP协议专用的请求对象）
- jakarta.servlet.http.HttpServletResponse （HTTP协议专用的响应对象）

**HttpServletRequest对象中封装了什么信息？**

- HttpServletRequest，简称request对象。
- HttpServletRequest中封装了请求协议的全部内容。
- Tomcat服务器（WEB服务器）将“请求协议”中的数据全部解析出来，然后将这些数据全部封装到request对象当中了。也就是说，我们只要面向HttpServletRequest，就可以获取请求协议中的数据。

- HttpServletResponse对象是专门用来响应HTTP协议到浏览器的。

  **HttpServlet源码分析：**

```java
public class HelloServlet extends HttpServlet {
	// 用户第一次请求，创建HelloServlet对象的时候，会执行这个无参数构造方法。
	public HelloServlet() {
    }
    
    //override 重写 doGet方法
    //override 重写 doPost方法
}

public abstract class GenericServlet implements Servlet, ServletConfig,
        java.io.Serializable {
           
	// 用户第一次请求的时候，HelloServlet对象第一次被创建之后，这个init方法会执行。
    public void init(ServletConfig config) throws ServletException {
        this.config = config;
        this.init();
    }
	// 用户第一次请求的时候，带有参数的init(ServletConfig config)执行之后，会执行这个没有参数的init()
	public void init() throws ServletException {
        // NOOP by default
    }
}

// HttpServlet模板类。
public abstract class HttpServlet extends GenericServlet {
    // 用户发送第一次请求的时候这个service会执行
    // 用户发送第N次请求的时候，这个service方法还是会执行。
    // 用户只要发送一次请求，这个service方法就会执行一次。
    @Override
    public void service(ServletRequest req, ServletResponse res)
        throws ServletException, IOException {

        HttpServletRequest  request;
        HttpServletResponse response;

        try {
            // 将ServletRequest和ServletResponse向下转型为带有Http的HttpServletRequest和HttpServletResponse
            request = (HttpServletRequest) req;
            response = (HttpServletResponse) res;
        } catch (ClassCastException e) {
            throw new ServletException(lStrings.getString("http.non_http"));
        }
        // 调用重载的service方法。
        service(request, response);
    }
    
    // 这个service方法的两个参数都是带有Http的。
    // 这个service是一个模板方法。
    // 在该方法中定义核心算法骨架，具体的实现步骤延迟到子类中去完成。
    protected void service(HttpServletRequest req, HttpServletResponse resp)
        throws ServletException, IOException {
        // 获取请求方式
        // 这个请求方式最终可能是：""
        // 注意：request.getMethod()方法获取的是请求方式，可能是七种之一：
        // GET POST PUT DELETE HEAD OPTIONS TRACE
        String method = req.getMethod();

        // 如果请求方式是GET请求，则执行doGet方法。
        if (method.equals(METHOD_GET)) {
            long lastModified = getLastModified(req);
            if (lastModified == -1) {
                // servlet doesn't support if-modified-since, no reason
                // to go through further expensive logic
                doGet(req, resp);
            } else {
                long ifModifiedSince;
                try {
                    ifModifiedSince = req.getDateHeader(HEADER_IFMODSINCE);
                } catch (IllegalArgumentException iae) {
                    // Invalid date header - proceed as if none was set
                    ifModifiedSince = -1;
                }
                if (ifModifiedSince < (lastModified / 1000 * 1000)) {
                    // If the servlet mod time is later, call doGet()
                    // Round down to the nearest second for a proper compare
                    // A ifModifiedSince of -1 will always be less
                    maybeSetLastModified(resp, lastModified);
                    doGet(req, resp);
                } else {
                    resp.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
                }
            }

        } else if (method.equals(METHOD_HEAD)) {
            long lastModified = getLastModified(req);
            maybeSetLastModified(resp, lastModified);
            doHead(req, resp);

        } else if (method.equals(METHOD_POST)) {
            // 如果请求方式是POST请求，则执行doPost方法。
            doPost(req, resp);

        } else if (method.equals(METHOD_PUT)) {
            doPut(req, resp);

        } else if (method.equals(METHOD_DELETE)) {
            doDelete(req, resp);

        } else if (method.equals(METHOD_OPTIONS)) {
            doOptions(req,resp);

        } else if (method.equals(METHOD_TRACE)) {
            doTrace(req,resp);

        } else {
            //
            // Note that this means NO servlet supports whatever
            // method was requested, anywhere on this server.
            //

            String errMsg = lStrings.getString("http.method_not_implemented");
            Object[] errArgs = new Object[1];
            errArgs[0] = method;
            errMsg = MessageFormat.format(errMsg, errArgs);

            resp.sendError(HttpServletResponse.SC_NOT_IMPLEMENTED, errMsg);
        }
    }
    
    
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
        throws ServletException, IOException{
        // 报405错误
        String msg = lStrings.getString("http.method_get_not_supported");
        sendMethodNotAllowed(req, resp, msg);
    }
    
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
        throws ServletException, IOException {
        // 报405错误
        String msg = lStrings.getString("http.method_post_not_supported");
        sendMethodNotAllowed(req, resp, msg);
    }
    
}

/*
通过以上源代码分析：
	假设前端发送的请求是get请求，后端程序员重写的方法是doPost
	假设前端发送的请求是post请求，后端程序员重写的方法是doGet
	会发生什么呢？
		发生405这样的一个错误。
		405表示前端的错误，发送的请求方式不对。和服务器不一致。不是服务器需要的请求方式。
	
	通过以上源代码可以知道：只要HttpServlet类中的doGet方法或doPost方法执行了，必然405.

怎么避免405的错误呢？
	后端重写了doGet方法，前端一定要发get请求。
	后端重写了doPost方法，前端一定要发post请求。
	这样可以避免405错误。
	
	这种前端到底需要发什么样的请求，其实应该后端说了算。后端让发什么方式，前端就得发什么方式。
	
有的人，你会看到为了避免405错误，在Servlet类当中，将doGet和doPost方法都进行了重写。
这样，确实可以避免405的发生，但是不建议，405错误还是有用的。该报错的时候就应该让他报错。
如果你要是同时重写了doGet和doPost，那还不如你直接重写service方法好了。这样代码还能
少写一点。
*/


```

- 我们编写的HelloServlet直接继承HttpServlet，直接重写HttpServlet类中的service()方法行吗？
  - 可以，只不过你享受不到405错误。享受不到HTTP协议专属的东西。

## 关于一个web站点的欢迎页面

**怎么设置欢迎页面呢？**

- 第一步：我在IDEA工具的web目录下新建了一个文件login.html

- 第二步：在web.xml文件中进行了以下的配置

  - ```xml
    <welcome-file-list>
            <welcome-file>login.html</welcome-file>
        </welcome-file-list>
    ```

  - 注意：设置欢迎页面的时候，这个路径不需要以“/”开始。并且这个路径默认是从webapp的根下开始查找。

**如果在webapp的根下新建一个目录，目录中再给一个文件，那么这个欢迎页该如何设置呢？**

- 在webapp根下新建page1

- 在page1下新建page2目录

- 在page2目录下新建page.html页面

- 在web.xml文件中应该这样配置

  - ```
    <welcome-file-list>
        <welcome-file>page1/page2/page.html</welcome-file>
    </welcome-file-list>
    ```

  - 注意：路径不需要以“/”开始，并且路径默认从webapp的根下开始找。

**一个webapp是可以设置多个欢迎页面的**

- ```xml
  <welcome-file-list>
      <welcome-file>page1/page2/page.html</welcome-file>
      <welcome-file>login.html</welcome-file>
  </welcome-file-list>
  ```

- 注意：越靠上的优先级越高。找不到的继续向下找。

你有没有注意一件事：当我的文件名设置为index.html的时候，不需要在web.xml文件中进行配置欢迎页面。这是为什么？

- 这是因为Tomcat服务器已经提前配置好了。

- 实际上配置欢迎页面有两个地方可以配置：

  - 一个是在webapp内部的web.xml文件中。（在这个地方配置的属于局部配置）

  - 一个是在CATALINA_HOME/conf/web.xml文件中进行配置。（在这个地方配置的属于全局配置）

    - ```xml
      <welcome-file-list>
          <welcome-file>index.html</welcome-file>
          <welcome-file>index.htm</welcome-file>
          <welcome-file>index.jsp</welcome-file>
      </welcome-file-list>
      ```

    - Tomcat服务器的全局欢迎页面是：index.html index.htm index.jsp。如果你一个web站点没有设置局部的欢迎页面，Tomcat服务器就会以index.html index.htm index.jsp作为一个web站点的欢迎页面。

  - 注意原则：局部优先原则。（就近原则）

**欢迎页可以是一个Servlet吗？**

- 当然可以。

## 关于WEB-INF目录

- 在WEB-INF目录下新建了一个文件：welcome.html
- 打开浏览器访问：http://localhost:8080/servlet07/WEB-INF/welcome.html 出现了404错误。
- 注意：**放在WEB-INF目录下的资源是受保护的。在浏览器上不能够通过路径直接访问**。所以像HTML、CSS、JS、image等静态资源一定要放到WEB-INF目录之外。

## HttpServletRequest接口详解

- HttpServletRequest是一个接口，全限定名称：jakarta.servlet.http.HttpServletRequest

- HttpServletRequest接口是Servlet规范中的一员。

- HttpServletRequest接口的父接口：ServletRequest

  - ```java
    public interface HttpServletRequest extends ServletRequest {}
    ```

  HttpServletRequest接口的实现类谁写的? HttpServletRequest对象是谁给创建的？

  - 通过测试：org.apache.catalina.connector.RequestFacade 实现了 HttpServletRequest接口

    - ```java
      public class RequestFacade implements HttpServletRequest {}
      ```

  - 测试结果说明：Tomcat服务器（WEB服务器、WEB容器）实现了HttpServletRequest接口，还是说明了Tomcat服务器实现了Servlet规范。而对于我们javaweb程序员来说，实际上不需要关心这个，我们只需要面向接口编程即可。我们关心的是HttpServletRequest接口中有哪些方法，这些方法可以完成什么功能！！！！

  **HttpServletRequest对象中都有什么信息？都包装了什么信息？**

  - HttpServletRequest对象是Tomcat服务器负责创建的。封装了HTTP的请求协议。
  - 实际上是用户发送请求的时候，遵循了HTTP协议，发送的是HTTP的请求协议，Tomcat服务器将HTTP协议中的信息以及数据全部解析出来，然后Tomcat服务器把这些信息封装到HttpServletRequest对象当中，传给了我们javaweb程序员。
  - javaweb程序员面向HttpServletRequest接口编程，调用方法就可以获取到请求的信息了。

  **request和response对象的生命周期？**

  - request对象和response对象，一个是请求对象，一个是响应对象。**这两个对象只在当前请求中有效**。
  - 一次请求对应一个request。
  - 两次请求则对应两个request。

  **HttpServletRequest接口中有哪些常用的方法？**

  ```java
  Map<String,String[]> getParameterMap() 这个是获取Map
  Enumeration<String> getParameterNames() 这个是获取Map集合中所有的key
  String[] getParameterValues(String name) 根据key获取Map集合的value
  String getParameter(String name)  获取value这个一维数组当中的第一个元素。这个方法最常用。
  // 以上的4个方法，和获取用户提交的数据有关系。
  ```

  思考：如果是你，前端的form表单提交了数据之后，你准备怎么存储这些数据，你准备采用什么样的数据结构去存储这些数据呢？

  - 前端提交的数据格式：username=abc&userpwd=111&aihao=s&aihao=d&aihao=tt

  - 我会采用Map集合来存储：

    - ```java
      Map<String,String>
          key存储String
          value存储String
          这种想法对吗？不对。
          如果采用以上的数据结构存储会发现key重复的时候value覆盖。
          key         value
          ---------------------
          username    abc
          userpwd     111
          aihao       s
          aihao       d
          aihao       tt
          这样是不行的，因为map的key不能重复。
      Map<String, String[]>
          key存储String
          value存储String[]
          key				value
          -------------------------------
          username		{"abc"}
          userpwd			{"111"}
          aihao			{"s","d","tt"}
      ```

    > 注意：前端表单提交数据的时候，假设提交了120这样的“数字”，其实是以字符串"120"的方式提交的，所以服务器端获取到的一定是一个字符串的"120"，而不是一个数字。（前端永远提交的是字符串，后端获取的也永远是字符串。）

  **request对象实际上又称为“请求域”对象。**

  - 应用域对象是什么？

    - ServletContext （Servlet上下文对象。）

    - 什么情况下会考虑向ServletContext这个应用域当中绑定数据呢？

      - 第一：所有用户共享的数据。
      - 第二：这个共享的数据量很小。
      - 第三：这个共享的数据很少的修改操作。
      - 在以上三个条件都满足的情况下，使用这个应用域对象，可以大大提高我们程序执行效率。
      - 实际上向应用域当中绑定数据，就相当于把数据放到了缓存（Cache）当中，然后用户访问的时候直接从缓存中取，减少IO的操作，大大提升系统的性能，所以缓存技术是提高系统性能的重要手段。

    - ServletContext当中有三个操作域的方法：

      - ```java
        void setAttribute(String name, Object obj); // 向域当中绑定数据。
        Object getAttribute(String name); // 从域当中根据name获取数据。
        void removeAttribute(String name); // 将域当中绑定的数据移除
        
        // 以上的操作类似于Map集合的操作。
        Map<String, Object> map;
        map.put("name", obj); // 向map集合中放key和value
        Object obj = map.get("name"); // 通过map集合的key获取value
        map.remove("name"); // 通过Map集合的key删除key和value这个键值对。
        ```

    **reques“请求域”对象**

    - “请求域”对象要比“应用域”对象范围小很多。生命周期短很多。请求域只在一次请求内有效。

    - 一个请求对象request对应一个请求域对象。一次请求结束之后，这个请求域就销毁了。

    - 请求域对象也有这三个方法：

      - ```java
        void setAttribute(String name, Object obj); // 向域当中绑定数据。
        Object getAttribute(String name); // 从域当中根据name获取数据。
        void removeAttribute(String name); // 将域当中绑定的数据移除
        ```

      **请求域和应用域的选用原则？**

      - 尽量使用小的域对象，因为小的域对象占用的资源较少。

    **转发（一次请求）**

    - ```java
      // 第一步：获取请求转发器对象
      RequestDispatcher dispatcher = request.getRequestDispatcher("/b");
      // 第二步：调用转发器的forward方法完成跳转/转发
      dispatcher.forward(request,response);
      
      // 第一步和第二步代码可以联合在一起。
      request.getRequestDispatcher("/b").forward(request,response);
      
      ```

    **两个Servlet怎么共享数据？**

    - 将数据放到`ServletContext应用域`当中，当然是可以的，但是应用域范围太大，占用资源太多。不建议使用。
    - 可以将数据放到`request请求域`当中，然后AServlet转发到BServlet，保证AServlet和BServlet在同一次请求当中，这样就可以做到两个Servlet，或者多个Servlet共享同一份数据。

    **转发的下一个资源必须是一个Servlet吗？**

    - 不一定，只要是Tomcat服务器当中的合法资源，都是可以转发的。例如：html....
    - 注意：转发的时候，路径的写法要注意，转发的路径以“/”开始，不加项目名。

  - 关于request对象中两个非常容易混淆的方法：

    - ```java
      
      // uri?username=zhangsan&userpwd=123&sex=1
      String username = request.getParameter("username");
      
      // 之前一定是执行过：request.setAttribute("name", new Object())
      Object obj = request.getAttribute("name");
      
      // 以上两个方法的区别是什么？
      // 第一个方法：获取的是用户在浏览器上提交的数据。
      // 第二个方法：获取的是请求域当中绑定的数据。
      ```

  - HttpServletRequest接口的其他常用方法：

    - ```java
      // 获取客户端的IP地址
      String remoteAddr = request.getRemoteAddr();
      
      // get请求在请求行上提交数据。
      // post请求在请求体中提交数据。
      // 设置请求体的字符集。（显然这个方法是处理POST请求的乱码问题。这种方式并不能解决get请求的乱码问题。）
      // Tomcat10之后，request请求体当中的字符集默认就是UTF-8，不需要设置字符集，不会出现乱码问题。
      // Tomcat9前（包括9在内），如果前端请求体提交的是中文，后端获取之后出现乱码，怎么解决这个乱码？执行以下代码。
      request.setCharacterEncoding("UTF-8");
      
      // 在Tomcat9之前（包括9），响应中文也是有乱码的，怎么解决这个响应的乱码？
      response.setContentType("text/html;charset=UTF-8");
      // 在Tomcat10之后，包括10在内，响应中文的时候就不在出现乱码问题了。以上代码就不需要设置UTF-8了。
      
      // 注意一个细节
      // 在Tomcat10包括10在内之后的版本，中文将不再出现乱码。（这也体现了中文地位的提升。）
      
      // get请求乱码问题怎么解决？
      // get请求发送的时候，数据是在请求行上提交的，不是在请求体当中提交的。
      // get请求乱码怎么解决
      // 方案：修改CATALINA_HOME/conf/server.xml配置文件
      <Connector URIEncoding="UTF-8" />
      // 注意：从Tomcat8之后，URIEncoding的默认值就是UTF-8，所以GET请求也没有乱码问题了。
          
      // 获取应用的根路径
      String contextPath = request.getContextPath();
      
      // 获取请求方式
      String method = request.getMethod();
      
      // 获取请求的URI
      String uri = request.getRequestURI();  // /aaa/testRequest
      
      // 获取servlet path
      String servletPath = request.getServletPath(); //   /testRequest
      
      ```

## 在一个web应用中应该如何完成资源的跳转

在一个web应用中通过两种方式，可以完成资源的跳转：

- 第一种方式：转发
- 第二种方式：重定向

**转发和重定向有什么区别？**

**代码上有什么区别？**

- 转发

  - ```java
    // 获取请求转发器对象
    RequestDispatcher dispatcher = request.getRequestDispatcher("/dept/list");
    // 调用请求转发器对象的forward方法完成转发
    dispatcher.forward(request, response);
    
    // 合并一行代码
    request.getRequestDispatcher("/dept/list").forward(request, response);
    // 转发的时候是一次请求，不管你转发了多少次。都是一次请求。
    // AServlet转发到BServlet，再转发到CServlet，再转发到DServlet，不管转发了多少次，都在同一个request当中。
    // 这是因为调用forward方法的时候，会将当前的request和response对象传递给下一个Servlet。
    ```

- 重定向

  - ```java
    // 注意：路径上要加一个项目名。为什么？
    // 浏览器发送请求，请求路径上是需要添加项目名的。
    // 以下这一行代码会将请求路径“/oa/dept/list”发送给浏览器
    // 浏览器会自发的向服务器发送一次全新的请求：/oa/dept/list
    response.sendRedirect("/oa/dept/list");
    ```


**形式上有什么区别？**

- 转发（一次请求）
  - 在浏览器地址栏上发送的请求是：http://localhost:8080/servlet10/a ，最终请求结束之后**，浏览器地址栏上的地址还是这个。没变**。
- 重定向（两次请求）
  - 在浏览器地址栏上发送的请求是：http://localhost:8080/servlet10/a ，最终在浏览器地址栏上显示的地址是：http://localhost:8080/servlet10/b

**转发和重定向的本质区别？**

- 转发：是由WEB服务器来控制的。A资源跳转到B资源，这个跳转动作是Tomcat服务器内部完成的。
- 重定向：是浏览器完成的。具体跳转到哪个资源，是浏览器说了算。

**转发和重定向应该如何选择？什么时候使用转发，什么时候使用重定向？**

- 如果在上一个Servlet当中向request域当中绑定了数据，希望从下一个Servlet当中把request域里面的数据取出来，使用转发机制。
- 剩下所有的请求均使用重定向。（重定向使用较多。）

跳转的下一个资源有没有要求呢？必须是一个Servlet吗？

- 不一定，跳转的资源只要是服务器内部合法的资源即可。包括：Servlet、JSP、HTML.....

**转发会存在浏览器的刷新问题**。

## Servlet注解，简化配置

Servlet3.0版本之后，推出了各种Servlet基于注解式开发。优点是什么？

- 开发效率高，不需要编写大量的配置信息。直接在java类上使用注解进行标注。
- web.xml文件体积变小了。

- 并不是说注解有了之后，web.xml文件就不需要了：

  - 有一些需要变化的信息，还是要配置到web.xml文件中。一般都是 注解+配置文件 的开发模式。
  - 一些不会经常变化修改的配置建议使用注解。一些可能会被修改的建议写到配置文件中。

- 我们的第一个注解：

  - ```
    jakarta.servlet.annotation.WebServlet
    ```

  - 在Servlet类上使用：@WebServlet，WebServlet注解中有哪些属性呢？

    - name属性：用来指定Servlet的名字。等同于：<servlet-name>
    - urlPatterns属性：用来指定Servlet的映射路径。可以指定多个字符串。<url-pattern>
    - loadOnStartUp属性：用来指定在服务器启动阶段是否加载该Servlet。等同于：<load-on-startup>
    - value属性：当注解的属性名是value的时候，使用注解的时候，value属性名是可以省略的。
    - 注意：不是必须将所有属性都写上，只需要提供需要的。（需要什么用什么。）
    - 注意：属性是一个数组，如果数组中只有一个元素，使用该注解的时候，属性值的大括号可以省略。

- 注解对象的使用格式：

  - @注解名称(属性名=属性值, 属性名=属性值, 属性名=属性值....)

## 关于B/S结构系统的会话机制（session机制）

**什么是会话？**

- 会话对应的英语单词：session

- 用户打开浏览器，进行一系列操作，然后最终将浏览器关闭，这个整个过程叫做：一次会话。会话在服务器端也有一个对应的java对象，这个java对象叫做：session。

- 什么是一次请求：用户在浏览器上点击了一下，然后到页面停下来，可以粗略认为是一次请求。请求对应的服务器端的java对象是：request。

  **一个会话当中可以包含多次请求**。（一次会话对应N次请求。）

- 在java的servlet规范当中，session对应的类名：HttpSession（jarkata.servlet.http.HttpSession）

- session机制属于B/S结构的一部分。如果使用php语言开发WEB项目，同样也是有session这种机制的。**session机制实际上是一个规范。**然后不同的语言对这种会话机制都有实现。

- session对象最主要的作用是：保存会话状态。（用户登录成功了，这是一种登录成功的状态，你怎么把登录成功的状态一直保存下来呢？使用session对象可以保留会话状态。）

  **为什么需要session对象来保存会话状态呢？**

  - 因为HTTP协议是一种无状态协议。
  - 什么是无状态：请求的时候，B和S是连接的，但是请求结束之后，连接就断了。为什么要这么做？HTTP协议为什么要设计成这样？因为这样的无状态协议，可以降低服务器的压力。请求的瞬间是连接的，请求结束之后，连接断开，这样服务器压力小。
  - 只要B和S断开了，那么关闭浏览器这个动作，服务器知道吗？
    - 不知道。服务器是不知道浏览器关闭的。

- 张三打开一个浏览器A，李四打开一个浏览器B，访问服务器之后，在服务器端会生成：
  - 张三专属的session对象
  - 李四专属的session对象

  **为什么不使用request对象保存会话状态？为什么不使用ServletContext对象保存会话状态？**

  - request.setAttribute()存，request.getAttribute()取，ServletContext也有这个方法。`request是请求域。ServletContext是应用域`。

  - request是一次请求一个对象。

  - ServletContext对象是服务器启动的时候创建，服务器关闭的时候销毁，这个ServletContext对象只有一个ServletContext对象的域太大。

    request请求域（HttpServletRequest）、session会话域（HttpSession）、application域（ServletContext）

    **request < session < application**

- 思考一下：session对象的实现原理。
  - HttpSession session = request.getSession();
  - 这行代码很神奇。张三访问的时候获取的session对象就是张三的。李四访问的时候获取的session对象就是李四的。

  **session的实现原理：**

  - JSESSIONID=xxxxxx  这个是以Cookie的形式保存在浏览器的内存中的。浏览器只要关闭。这个cookie就没有了。
  - session列表是一个Map，map的key是sessionid，map的value是session对象。
  - 用户第一次请求，服务器生成session对象，同时生成id，将id发送给浏览器。
  - 用户第二次请求，自动将浏览器内存中的id发送给服务器，服务器根据id查找session对象。
  - 关闭浏览器，内存消失，cookie消失，sessionid消失，会话等同于结束。

  **Cookie禁用了，session还能找到吗？**

  - cookie禁用是什么意思？服务器正常发送cookie给浏览器，但是浏览器不要了。拒收了。并不是服务器不发了。
  - 找不到了。每一次请求都会获取到新的session对象。
  - cookie禁用了，session机制还能实现吗？
    - 可以。需要使用URL重写机制。
    - http://localhost:8080/servlet12/test/session;jsessionid=19D1C99560DCBF84839FA43D58F56E16
    - URL重写机制会提高开发者的成本。开发人员在编写任何请求路径的时候，后面都要添加一个sessionid，给开发带来了很大的难度，很大的成本。所以大部分的网站都是这样设计的：你要是禁用cookie，你就别用了。

  **总结一下到目前位置我们所了解的域对象：**

  - request（对应的类名：HttpServletRequest）**请求域**（请求级别的）

  - session（对应的类名：HttpSession）**会话域**（用户级别的）

  - application（对应的类名：ServletContext）**应用域**（项目级别的，所有用户共享的。）

    **这三个域对象的大小关系**

    - request < session < application

  - 他们三个域对象都有以下三个公共的方法：
    - setAttribute（向域当中绑定数据）
    - getAttribute（从域当中获取数据）
    - removeAttribute（删除域当中的数据）
    
  - **使用原则：尽量使用小的域。**

  **销毁session对象：**

  - ```java
    session.invalidate();
    ```

## Cookie

session的实现原理中，每一个session对象都会关联一个sessionid，例如：
- JSESSIONID=41C481F0224664BDB28E95081D23D5B8
- 以上的这个键值对数据其实就是cookie对象。
- 对于session关联的cookie来说，这个cookie是被保存在浏览器的“运行内存”当中。
- 只要浏览器不关闭，用户再次发送请求的时候，会自动将运行内存中的cookie发送给服务器。
- 例如，这个Cookie: JSESSIONID=41C481F0224664BDB28E95081D23D5B8就会再次发送给服务器。
- 服务器就是根据41C481F0224664BDB28E95081D23D5B8这个值来找到对应的session对象的。

cookie怎么生成？cookie保存在什么地方？cookie有啥用？浏览器什么时候会发送cookie，发送哪些cookie给服务器？

​	cookie最终是保存在浏览器客户端上的。

- 可以保存在运行内存中。（浏览器只要关闭cookie就消失了。）
- 也可以保存在硬盘文件中。（永久保存。）

**cookie有啥用呢？**

- cookie和session机制其实都是为了保存会话的状态。

- **cookie是将会话的状态保存在浏览器客户端上**。（cookie数据存储在浏览器客户端上的。）

- **session是将会话的状态保存在服务器端上**。（session对象是存储在服务器上。）

  为什么要有cookie和session机制呢？因为HTTP协议是无状态 无连接协议。

**cookie的经典案例**

- 京东商城，在未登录的情况下，向购物车中放几件商品。然后关闭商城，再次打开浏览器，访问京东商城的时候，购物车中的商品还在，这是怎么做的？我没有登录，为什么购物车中还有商品呢？
  - 将购物车中的商品编号放到cookie当中，cookie保存在硬盘文件当中。这样即使关闭浏览器。硬盘上的cookie还在。下一次再打开京东商城的时候，查看购物车的时候，会自动读取本地硬盘中存储的cookie，拿到商品编号，动态展示购物车中的商品。
    - 京东存储购物车中商品的cookie可能是这样的：productIds=xxxxx,yyyy,zzz,kkkk
    - 注意：cookie如果清除掉，购物车中的商品就消失了。
- 126邮箱中有一个功能：十天内免登录
  - 这个功能也是需要cookie来实现的。
  - 怎么实现的呢？
    - 用户输入正确的用户名和密码，并且同时选择十天内免登录。登录成功后。浏览器客户端会保存一个cookie，这个cookie中保存了用户名和密码等信息，这个cookie是保存在硬盘文件当中的，十天有效。在十天内用户再次访问126的时候，浏览器自动提交126的关联的cookie给服务器，服务器接收到cookie之后，获取用户名和密码，验证，通过之后，自动登录成功。
    - 怎么让cookie失效？
      - 十天过后自动失效。
      - 或者改密码。
      - 或者在客户端浏览器上清除cookie。

**cookie机制和session机制其实都不属于java中的机制，实际上cookie机制和session机制都是HTTP协议的一部分**。php开发中也有cookie和session机制，只要是你是做web开发，不管是什么编程语言，cookie和session机制都是需要的。

- HTTP协议中规定：任何一个cookie都是由name和value组成的。name和value都是字符串类型的。

- 在java的servlet中，对cookie提供了哪些支持呢？

  - 提供了一个Cookie类来专门表示cookie数据。jakarta.servlet.http.Cookie;
  - java程序怎么把cookie数据发送给浏览器呢？response.addCookie(cookie);

- 在HTTP协议中是这样规定的：当浏览器发送请求的时候，会自动携带该path下的cookie数据给服务器。（URL。）

- 关于cookie的有效时间

  - **怎么用java设置cookie的有效时间**
    
    cookie.setMaxAge(60 * 60); 设置cookie在一小时之后失效。
    
  - 没有设置有效时间：默认保存在浏览器的运行内存中，浏览器关闭则cookie消失。

  - 只要设置cookie的有效时间 > 0，这个cookie一定会存储到硬盘文件当中。

  - 设置cookie的有效时间 = 0 呢？
    - cookie被删除，同名cookie被删除。
    
  - 设置cookie的有效时间 < 0 呢？
    - 保存在运行内存中。和不设置一样。

  **关于cookie的path，cookie关联的路径：**

  - 假设现在发送的请求路径是“http://localhost:8080/servlet13/cookie/generate”生成的cookie，如果cookie没有设置path，默认的path是什么？
    - 默认的path是：http://localhost:8080/servlet13/cookie 以及它的子路径。
    - 也就是说，以后只要浏览器的请求路径是http://localhost:8080/servlet13/cookie 这个路径以及这个路径下的子路径，cookie都会被发送到服务器。
    
    **手动设置cookie的path**
    
    - cookie.setPath(“/servlet13”); 表示只要是这个servlet13项目的请求路径，都会提交这个cookie给服务器。

- 浏览器发送cookie给服务器了，服务器中的java程序怎么接收？

  - ```java
    Cookie[] cookies = request.getCookies(); // 这个方法可能返回null
    if(cookies != null){
        for(Cookie cookie : cookies){
            // 获取cookie的name
            String name = cookie.getName();
            // 获取cookie的value
            String value = cookie.getValue();
        }
    }
    
    ```

- 使用cookie实现一下十天内免登录功能。

  - 先实现登录功能
    - 登录成功
      - 跳转到部门列表页面
    - 登录失败
      - 跳转到登录失败页面
  - 修改前端页面
    - 在登录页面给一个复选框，复选框后面给一句话：十天内免登录。
    - 用户选择了复选框：表示要支持十天内免登录。
    - 用户没有选择复选框：表示用户不想使用十天内免登录功能。
  - 修改Servlet中的login方法
    - 如果用户登录成功了，并且用户登录时选择了十天内免登录功能，这个时候应该在Servlet的login方法中创建cookie，用来存储用户名和密码，并且设置路径，设置有效期，将cookie响应给浏览器。（浏览器将其自动保存在硬盘文件当中10天）
  - 用户再次访问该网站的时候，访问这个网站的首页的时候，有两个走向:
    - 要么跳转到部门列表页面
    - 要么跳转到登录页面
    - 以上分别有两个走向，这显然是需要编写java程序进行控制的。









# JSP

- 我的第一个JSP程序：
  
  - 在WEB-INF目录之外创建一个index.jsp文件，然后这个文件中没有任何内容。
  
- 将上面的项目部署之后，启动服务器，打开浏览器，访问以下地址：
  - http://localhost:8080/jsp/index.jsp 展现在大家面前的是一个空白。
  - 实际上访问以上的这个：index.jsp，底层执行的是：index_jsp.class 这个java程序。
  - 这个index.jsp会被tomcat翻译生成index_jsp.java文件，然后tomcat服务器又会将index_jsp.java编译生成index_jsp.class文件
  - 访问index.jsp，实际上执行的是index_jsp.class中的方法。
  
- JSP实际上就是一个Servlet。
  - index.jsp访问的时候，会自动翻译生成index_jsp.java，会自动编译生成index_jsp.class，那么index_jsp 这就是一个类。
  - index_jsp 类继承 HttpJspBase，而HttpJspBase类继承的是HttpServlet。所以index_jsp类就是一个Servlet类。
  - jsp的生命周期和Servlet的生命周期完全相同。完全就是一个东西。没有任何区别。
  - jsp和servlet一样，都是单例的。（假单例。）
  
- jsp文件第一次访问的时候是比较慢的，为什么？
  - 为什么大部分的运维人员在给客户演示项目的时候，为什么提前先把所有的jsp文件先访问一遍。
  - 第一次比较麻烦：
    - 要把jsp文件翻译生成java源文件
    - java源文件要编译生成class字节码文件
    - 然后通过class去创建servlet对象
    - 然后调用servlet对象的init方法
    - 最后调用servlet对象的service方法。
  - 第二次就比较快了，为什么？
    - 因为第二次直接调用单例servlet对象的service方法即可。
  
- JSP是什么？
  - JSP是java程序。（JSP本质还是一个Servlet）
  - JSP是：JavaServer Pages的缩写。（基于Java语言实现的服务器端的页面。）
  - Servlet是JavaEE的13个子规范之一，那么JSP也是JavaEE的13个子规范之一。
  - JSP是一套规范。所有的web容器/web服务器都是遵循这套规范的，都是按照这套规范进行的“翻译”
  - 每一个web容器/web服务器都会内置一个JSP翻译引擎。
  
- 对JSP进行错误调试的时候，还是要直接打开JSP文件对应的java文件，检查java代码。

- 开发JSP的最高境界：
  
  - 眼前是JSP代码，但是脑袋中呈现的是java代码。
  
- JSP既然本质上是一个Servlet，那么JSP和Servlet到底有什么区别呢？
  - 职责不同：
    - Servlet的职责是什么：收集数据。（Servlet的强项是逻辑处理，业务处理，然后链接数据库，获取/收集数据。）
    - JSP的职责是什么：展示数据。（JSP的强项是做数据的展示）
  
- JSP的基础语法
  - 在jsp文件中直接编写文字，都会自动被翻译到哪里？
    - 翻译到servlet类的service方法的out.write("翻译到这里")，直接翻译到双引号里，被java程序当做普通字符串打印输出到浏览器。
    - 在JSP中编写的HTML CSS JS代码，这些代码对于JSP来说只是一个普通的字符串。但是JSP把这个普通的字符串一旦输出到浏览器，浏览器就会对HTML CSS JS进行解释执行。展现一个效果。
  - JSP的page指令（这个指令后面再详细说，这里先解决一下中文乱码问题），解决响应时的中文乱码问题：
    - 通过page指令来设置响应的内容类型，在内容类型的最后面添加：charset=UTF-8
      - <%@page contentType="text/html;charset=UTF-8"%>，表示响应的内容类型是text/html，采用的字符集UTF-8
      - <%@page import="java.util.List,java.util.ArrayList"%>
  - 怎么在JSP中编写Java程序：
    - <% java语句; %>
      - 在这个符号当中编写的被视为java程序，被翻译到Servlet类的service方法内部。
      - 这里你要细心点，你要思考，在<% %>这个符号里面写java代码的时候，你要时时刻刻的记住你正在“方法体”当中写代码，方法体中可以写什么，不可以写什么，你心里是否明白呢？
      - 在service方法当中编写的代码是有顺序的，方法体当中的代码要遵循自上而下的顺序依次逐行执行。
      - service方法当中不能写静态代码块，不能写方法，不能定义成员变量。。。。。。
      - 在同一个JSP当中 <%%> 这个符号可以出现多个。
    - <%! %>
      - 在这个符号当中编写的java程序会自动翻译到service方法之外。
      - 这个语法很少用，为什么？不建议使用，因为在service方法外面写静态变量和实例变量，都会存在线程安全问题，因为JSP就是servlet，servlet是单例的，多线程并发的环境下，这个静态变量和实例变量一旦有修改操作，必然会存在线程安全问题。
    - JSP的输出语句
      - 怎么向浏览器上输出一个java变量。
      - <% String name = “jack”;  out.write("name = " + name); %>
      - 注意：以上代码中的out是JSP的九大内置对象之一。可以直接拿来用。当然，必须只能在service方法内部使用。
      - 如果向浏览器上输出的内容中没有“java代码”，例如输出的字符串是一个固定的字符串，可以直接在jsp中编写，不需要写到<%%> 这里。
      - 如果输出的内容中含有“java代码”，这个时候可以使用以下语法格式：
        - <%= %> 注意：在=的后面编写要输出的内容。
        - <%= %> 这个符号会被翻译到哪里？最终翻译成什么？ 
          - 翻译成了这个java代码：   out.print();
          - 翻译到service方法当中了。
        - 什么时候使用<%=%> 输出呢？输出的内容中含有java的变量，输出的内容是一个动态的内容，不是一个死的字符串。如果输出的是一个固定的字符串，直接在JSP文件中编写即可。
  - 在JSP中如何编写JSP的专业注释
    - <%--JSP的专业注释，不会被翻译到java源代码当中。--%>
    - <!--这种注释属于HTML的注释，这个注释信息仍然会被翻译到java源代码当中，不建议。-->
  - JSP基础语法总结：
    - JSP中直接编写普通字符串
      - 翻译到service方法的out.write("这里")
    - <%%>
      - 翻译到service方法体内部，里面是一条一条的java语句。
    - <%! %>
      - 翻译到service方法之外。
    - <%= %>
      - 翻译到service方法体内部，翻译为：out.print();
    - <%@page  contentType="text/html;charset=UTF-8"%>
      - page指令，通过contentType属性用来设置响应的内容类型。
  - 使用Servlet + JSP完成oa项目的改造。
    - 使用Servlet处理业务，收集数据。 使用JSP展示数据。

    - 将之前原型中的html文件，全部修改为jsp，然后在jsp文件头部添加page指令（指定contentType防止中文乱码），将所有的JSP直接拷贝到web目录下。

    - 完成所有页面的正常流转。（页面仍然能够正常的跳转。修改超链接的请求路径。）
      
      - <%=request.getContextPath() %>  在JSP中动态的获取应用的根路径。
      
    - Servlet中连接数据库，查询所有的部门，遍历结果集。
      - 遍历结果集的过程中，取出部门编号、部门名、位置等信息，封装成java对象。
      - 将java对象存放到List集合中。
      - 将List集合存储到request域当中。
      - 转发forward到jsp。
      
    - 在JSP中：
      - 从request域当中取出List集合。
      - 遍历List集合，取出每个部门对象。动态生成tr。
      
    - 思考一个问题：如果我只用JSP这一个技术，能不能开发web应用？

      - 当然可以使用JSP来完成所有的功能。因为JSP就是Servlet，在JSP的<%%>里面写的代码就是在service方法当中的，所以在<%%>当中完全可以编写JDBC代码，连接数据库，查询数据，也可以在这个方法当中编写业务逻辑代码，处理业务，都是可以的，所以使用单独的JSP开发web应用完全没问题。
      - 虽然JSP一个技术就可以完成web应用，但是不建议，还是建议采用servlet + jsp的方式进行开发。这样都能将各自的优点发挥出来。JSP就是做数据展示。Servlet就是做数据的收集。（JSP中编写的Java代码越少越好。）一定要职责分明。

    - JSP文件的扩展名必须是xxx.jsp吗？

      - jsp文件的扩展名是可以配置的。不是固定的。

      - 在CATALINA_HOME/conf/web.xml，在这个文件当中配置jsp文件的扩展名。

      - ```xml
        <servlet-mapping>
            <servlet-name>jsp</servlet-name>
            <url-pattern>*.jsp</url-pattern>
            <url-pattern>*.jspx</url-pattern>
        </servlet-mapping>
        ```

      - xxx.jsp文件对于小猫咪来说，只是一个普通的文本文件，web容器会将xxx.jsp文件最终生成java程序，最终调用的是java对象相关的方法，真正执行的时候，和jsp文件就没有关系了。

      - 小窍门：JSP如果看不懂，建议把jsp翻译成java代码，就能看懂了。

    - 同学问：包名bean是什么意思？

      - javabean（java的logo是一杯冒着热气的咖啡。javabean被翻译为：咖啡豆）
      - java是一杯咖啡，咖啡又是由一粒一粒的咖啡豆研磨而成。
      - 整个java程序中有很多bean的存在。由很多bean组成。
      - 什么是javabean？实际上javabean你可以理解为符合某种规范的java类，比如：
        - 有无参数构造方法
        - 属性私有化
        - 对外提供公开的set和get方法
        - 实现java.io.Serializable接口
        - 重写toString
        - 重写hashCode+equals
        - ....
      - javabean其实就是java中的实体类。负责数据的封装。
      - 由于javabean符合javabean规范，具有更强的通用性。

    - 完成剩下所有功能的改造。
  
- 当前的oa应用存在的问题：

  - 任何一个用户都可以访问这个系统，都可以对这个系统当中的数据进行增删改这些危险的操作。我只想让合法的用户去使用这个系统，不合法的用户不能访问这个系统，怎么办？
    - 加一个登录功能。登录成功的可以访问该系统，登录失败不能访问。
  - 实现登录功能：
    - 步骤1：数据库当中添加一个用户表：t_user
      - t_user表当中存储的是用户的登录信息，最基本的也包括：登录的用户名和登录的密码。
      - 密码一般在数据库表当中存储的是密文。一般不以明文的形式存储。（这里先使用明文方式。）
      - 向t_user表中插入数据。
    - 步骤2：再实现一个登录页面。
      - 登录页面上应该有一个登录的表单。有用户名和密码输入的框。
      - 用户点击登录，提交表单，提交用户名和密码。form是post方式提交。
    - 步骤3：后台要有一个对应的Servlet来处理登录的请求。
      - 登录成功：跳转到部门列表页面。
      - 登录失败：跳转到失败的页面。
    - 步骤4：再提供一个登录失败的页面。

- 登录功能实现了，目前存在的最大的问题：

  - 这个登录功能目前只是一个摆设，没有任何作用。只要用户知道后端的请求路径，照样可以在不登录的情况下访问。
  - 这个登录没有真正起到拦截的作用。怎么解决？
  
- JSP的指令

  - 指令的作用：指导JSP的翻译引擎如何工作（指导当前的JSP翻译引擎如何翻译JSP文件。）

  - 指令包括哪些呢？

    - include指令：包含指令，在JSP中完成静态包含，很少用了。（这里不讲）
    - taglib指令：引入标签库的指令。这个到JJSTL标签库的时候再学习。现在先不管。
    - page指令：目前重点学习一个page指令。

  - 指令的使用语法是什么？

    - <%@指令名  属性名=属性值  属性名=属性值  属性名=属性值....%>

  - 关于page指令当中都有哪些常用的属性呢？

    - ```
      <%@page session="true|false" %>
      true表示启用JSP的内置对象session，表示一定启动session对象。没有session对象会创建。
      如果没有设置，默认值就是session="true"
      session="false" 表示不启动内置对象session。当前JSP页面中无法使用内置对象session。
      ```

    - ```
      <%@page contentType="text/json" %>
      contentType属性用来设置响应的内容类型
      但同时也可以设置字符集。
      <%@page contentType="text/json;charset=UTF-8" %>
      ```

    - ```
      <%@page pageEncoding="UTF-8" %>
      pageEncoding="UTF-8" 表示设置响应时采用的字符集。
      ```

    - ```
      <%@page import="java.util.List, java.util.Date, java.util.ArrayList" %>
      <%@page import="java.util.*" %>
      import语句，导包。
      ```

    - ```
      <%@page errorPage="/error.jsp" %>
      当前页面出现异常之后，跳转到error.jsp页面。
      errorPage属性用来指定出错之后的跳转位置。
      ```

    - ```
      <%@page isErrorPage="true" %>
      表示启用JSP九大内置对象之一：exception
      默认值是false。
      ```

- JSP的九大内置对象

  - jakarta.servlet.jsp.PageContext pageContext       页面作用域
  - jakarta.servlet.http.HttpServletRequest request 请求作用域
  - jakarta.servlet.http.HttpSession session  会话作用域
  - jakarta.servlet.ServletContext application 应用作用域
    - pageContext < request < session < application
    - 以上四个作用域都有：setAttribute、getAttribute、removeAttribute方法。
    - 以上作用域的使用原则：尽可能使用小的域。

  - java.lang.Throwable exception   

  - jakarta.servlet.ServletConfig config

  - java.lang.Object page  （其实是this，当前的servlet对象）

  - jakarta.servlet.jsp.JspWriter out  （负责输出）
  - jakarta.servlet.http.HttpServletResponse response （负责响应）

# EL表达式

- EL表达式是干什么用的？
  - Expression Language（表达式语言）
  - EL表达式可以代替JSP中的java代码，让JSP文件中的程序看起来更加整洁，美观。
  - JSP中夹杂着各种java代码，例如<% java代码 %>、<%=%>等，导致JSP文件很混乱，不好看，不好维护。所以才有了后期的EL表达式。
  - EL表达式可以算是JSP语法的一部分。EL表达式归属于JSP。
  
- EL表达式出现在JSP中主要是：
  - 从某个作用域中取数据，然后将其转换成字符串，然后将其输出到浏览器。这就是EL表达式的功效。三大功效：
    - 第一功效：从某个域中取数据。
      - 四个域：
        - pageContext
        - request
        - session
        - application
    - 第二功效：将取出的数据转成字符串。
      - 如果是一个java对象，也会自动调用java对象的toString方法将其转换成字符串。
    - 第三功效：将字符串输出到浏览器。
      - 和这个一样：<%= %>，将其输出到浏览器。
  
- EL表达式很好用，基本的语法格式：
  - ${表达式}
  
- EL表达式的使用：

  - ```jsp
    <%
    	// 创建User对象
    	User user = new User();
    	user.setUsername("jackson");
    	user.setPassword("1234");
    	user.setAge(50);
    
    	// 将User对象存储到某个域当中。一定要存，因为EL表达式只能从某个范围中取数据。
    	// 数据是必须存储到四大范围之一的。
    	request.setAttribute("userObj", user);
    %>
    
    <%--使用EL表达式取--%>
    ${这个位置写什么？？？？这里写的一定是存储到域对象当中时的name}
    要这样写：
    ${userObj}
    等同于java代码：<%=request.getAttribute("userObj")%>
    你不要这样写：${"userObj"}
    
    面试题：
    	${abc} 和 ${"abc"}的区别是什么？
    		${abc}表示从某个域中取出数据，并且被取的这个数据的name是"abc"，之前一定有这样的代码: 域.setAttribute("abc", 对象);
    		${"abc"} 表示直接将"abc"当做普通字符串输出到浏览器。不会从某个域中取数据了。
    
    ${userObj} 底层是怎么做的？从域中取数据，取出user对象，然后调用user对象的toString方法，转换成字符串，输出到浏览器。
    
    <%--如果想输出对象的属性值，怎么办？--%>
    ${userObj.username} 使用这个语法的前提是：User对象有getUsername()方法。
    ${userObj.password} 使用这个语法的前提是：User对象有getPassword()方法。
    ${userObj.age} 使用这个语法的前提是：User对象有getAge()方法。
    ${userObj.email} 使用这个语法的前提是：User对象有getEmail()方法。
    EL表达式中的. 这个语法，实际上调用了底层的getXxx()方法。
    注意：如果没有对应的get方法，则出现异常。报500错误。
    
    ${userObj.addr222.zipcode}
    以上EL表达式对应的java代码：
    user.getAddr222().getZipcode()
    ```

  - EL表达式优先从小范围中读取数据。

    - pageContext < request < session < application

  - EL表达式中有四个隐含的隐式的范围：

    - pageScope 对应的是 pageContext范围。
    - requestScope 对应的是 request范围。
    - sessionScope 对应的是 session范围。
    - applicationScope 对应的是 application范围。

  - EL表达式对null进行了预处理。如果是null，则向浏览器输出一个空字符串。

  - EL表达式取数据的时候有两种形式：

    - 第一种：.  （大部分使用这种方式）
    - 第二种：[ ] （如果存储到域的时候，这个name中含有特殊字符，可以使用 [ ]）
      - request.setAttribute("abc.def", "zhangsan");
      - ${requestScope.abc.def} 这样是无法取值的。
      - 应该这样：${requestScope["abc.def"]}

  - 掌握使用EL表达式，怎么从Map集合中取数据：

    - ${map.key}

  - 掌握使用EL表达式，怎么从数组和List集合中取数据：

    - ${数组[0]}
    - ${数组[1]}
    - ${list[0]}

  - page指令当中，有一个属性，可以忽略EL表达式

    - ```
      <%@page contentType="text/html;charset=UTF-8" isELIgnored="true" %>
      isELIgnored="true" 表示忽略EL表达式
      isELIgnored="false" 表示不忽略EL表达式。（这是默认值）
      
      isELIgnored="true" 这个是全局的控制。
      
      可以使用反斜杠进行局部控制：\${username} 这样也可以忽略EL表达式。
      ```

  - 通过EL表达式获取应用的根：

    - ${pageContext.request.contextPath}

  - EL表达式中其他的隐式对象：

    - pageContext
    - param
    - paramValues
    - initParam
  
  - EL表达式的运算符
  
    - 算术运算符
      - +、-、*、/、%
    - 关系运算符
      - [ ] == eq != > >= < <= 
    - 逻辑运算符
      - [ ] !  && ||  not and or
    - 条件运算符
      - [ ] ? : 
    - 取值运算符
      - [ ]和.
    - empty运算符
      - [ ] empty运算符的结果是boolean类型
      - [ ] ${empty param.username}
      - [ ] ${not empty param.username}
      - [ ] ${!empty param.password}

# JSTL标签库

- 什么是JSTL标签库？

  - Java Standard Tag Lib（Java标准的标签库）
  - JSTL标签库通常结合EL表达式一起使用。目的是让JSP中的java代码消失。
  - 标签是写在JSP当中的，但实际上最终还是要执行对应的java程序。（java程序在jar包当中。）

- 使用JSTL标签库的步骤：

  - 第一步：引入JSTL标签库对应的jar包。

    - tomcat10之后引入的jar包是：
      - jakarta.servlet.jsp.jstl-2.0.0.jar
      - jakarta.servlet.jsp.jstl-api-2.0.0.jar
    - 在IDEA当中怎么引入？
      - 在WEB-INF下新建lib目录，然后将jar包拷贝到lib当中。然后将其“Add Lib...”
      - 一定是要和mysql的数据库驱动一样，都是放在WEB-INF/lib目录下的。
      - 什么时候需要将jar包放到WEB-INF/lib目录下？如果这个jar是tomcat服务器没有的。
    
  - 第二步：在JSP中引入要使用标签库。（使用taglib指令引入标签库。）
  
    - JSTL提供了很多种标签，你要引入哪个标签？？？？重点掌握核心标签库。
  
    - ```
      <%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
      这个就是核心标签库。
      prefix="这里随便起一个名字就行了，核心标签库，大家默认的叫做c，你随意。"
      ```
  
  - 第三步：在需要使用标签的位置使用即可。表面使用的是标签，底层实际上还是java程序。
  
- JSTL标签的原理

  - ```
    <%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
    以上uri后面的路径实际上指向了一个xxx.tld文件。
    tld文件实际上是一个xml配置文件。
    在tld文件中描述了“标签”和“java类”之间的关系。
    以上核心标签库对应的tld文件是：c.tld文件。它在哪里。
    在jakarta.servlet.jsp.jstl-2.0.0.jar里面META-INF目录下，有一个c.tld文件。
    ```

  - 源码解析：配置文件tld解析

    - ```
      <tag>
          <description>对该标签的描述</description>
          <name>catch</name> 标签的名字
          <tag-class>org.apache.taglibs.standard.tag.common.core.CatchTag</tag-class> 标签对应的java类。
          <body-content>JSP</body-content> 标签体当中可以出现的内容，如果是JSP，就表示标签体中可以出现符合JSP所有语法的代码。例如EL表达式。
          <attribute>
              <description>
              	对这个属性的描述
              </description>
              <name>var</name> 属性名
              <required>false</required> false表示该属性不是必须的。true表示该属性是必须的。
              <rtexprvalue>false</rtexprvalue> 这个描述说明了该属性是否支持EL表达式。false表示不支持。true表示支持EL表达式。
          </attribute>
        </tag>
      
      <c:catch var="">
      	JSP....
      </c:catch>
      ```
    
  - jstl中的核心标签库core当中有哪些常用的标签呢？
  
    - c:if
  
      - <c:if test="boolean类型，支持EL表达式"></c: if>
  
    - c:forEach
  
      - <c:forEach items="集合，支持EL表达式" var="集合中的元素" varStatus="元素状态对象"> ${元素状态对象.count} </c: forEach>
      - <c:forEach var="i" begin="1" end="10" step="2"> ${i} </c: forEach>
  
    - c:choose c:when c:otherwise
  
      - ```
        <c:choose>
            <c:when test="${param.age < 18}">
                青少年
            </c:when>
            <c:when test="${param.age < 35}">
                青年
            </c:when>
            <c:when test="${param.age < 55}">
                中年
            </c:when>
            <c:otherwise>
                老年
            </c:otherwise>
        </c:choose>
        ```

## 改造OA

- 使用什么技术改造呢？

  - Servlet + JSP + EL表达式 + JSTL标签。进行改造。

- 在前端HTML代码中，有一个标签，叫做base标签，这个标签可以设置整个网页的基础路径。

  - 这是Java的语法，也不是JSP的语法。是HTML中的一个语法。HTML中的一个标签。通常出现在head标签中。

  - < base href="http://localhost:8080/oa/">

  - 在当前页面中，凡是路径没有以“/”开始的，都会自动将base中的路径添加到这些路径之前。

    - < a href="ab/def"></ a>
    - 等同于：< a href="http://localhost:8080/oa/ab/def"></ a>

  - 需要注意：在JS代码中的路径，保险起见，最好不要依赖base标签。JS代码中的路径最好写上全路径。

  - ```
    <base href="${pageContext.request.scheme}://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.request.contextPath}/">
    ```

# Filter过滤器

- 当前的OA项目存在什么缺陷？
  - DeptServlet、EmpServlet、OrderServlet。每一个Servlet都是处理自己相关的业务。在这些Servlet执行之前都是需要判断用户是否登录了。如果用户登录了，可以继续操作，如果没有登录，需要用户登录。这段判断用户是否登录的代码是固定的，并且在每一个Servlet类当中都需要编写，显然代码没有得到重复利用。包括每一个Servlet都要解决中文乱码问题，也有公共的代码。这些代码目前都是重复编写，并没有达到复用。怎么解决这个问题?
    - 可以使用Servlet规范中的Filter过滤器来解决这个问题。
  
- Filter是什么，有什么用，执行原理是什么？
  - Filter是过滤器。
  - Filter可以在Servlet这个目标程序执行之前添加代码。也可以在目标Servlet执行之后添加代码。之前之后都可以添加过滤规则。
  - 一般情况下，都是在过滤器当中编写公共代码。
  
- 一个过滤器怎么写呢？

  - 第一步：编写一个Java类实现一个接口：jarkata.servlet.Filter。并且实现这个接口当中所有的方法。

    - init方法：在Filter对象第一次被创建之后调用，并且只调用一次。
    - doFilter方法：只要用户发送一次请求，则执行一次。发送N次请求，则执行N次。在这个方法中编写过滤规则。
    - destroy方法：在Filter对象被释放/销毁之前调用，并且只调用一次。

  - 第二步：在web.xml文件中对Filter进行配置。这个配置和Servlet很像。

    - ```
      <filter>
          <filter-name>filter2</filter-name>
          <filter-class>com.bjpowernode.javaweb.servlet.Filter2</filter-class>
      </filter>
      <filter-mapping>
          <filter-name>filter2</filter-name>
          <url-pattern>*.do</url-pattern>
      </filter-mapping>
      ```

    - 或者使用注解：@WebFilter({"*.do"})

- 注意：

  - Servlet对象默认情况下，在服务器启动的时候是不会新建对象的。
  - Filter对象默认情况下，在服务器启动的时候会新建对象。
  - Servlet是单例的。Filter也是单例的。（单实例。）

- 目标Servlet是否执行，取决于两个条件：

  - 第一：在过滤器当中是否编写了：chain.doFilter(request, response); 代码。
  - 第二：用户发送的请求路径是否和Servlet的请求路径一致。

- chain.doFilter(request, response); 这行代码的作用：

  - 执行下一个过滤器，如果下面没有过滤器了，执行最终的Servlet。

- 注意：Filter的优先级，天生的就比Servlet优先级高。

  - /a.do 对应一个Filter，也对应一个Servlet。那么一定是先执行Filter，然后再执行Servlet。

- 关于Filter的配置路径：

  - /a.do、/b.do、/dept/save。这些配置方式都是精确匹配。
  - /* 匹配所有路径。
  - *.do 后缀匹配。不要以 / 开始
  - /dept/*  前缀匹配。

- 在web.xml文件中进行配置的时候，Filter的执行顺序是什么？

  - 依靠filter-mapping标签的配置位置，越靠上优先级越高。

- 过滤器的调用顺序，遵循栈数据结构。

- 使用@WebFilter的时候，Filter的执行顺序是怎样的呢？

  - 执行顺序是：比较Filter这个类名。
  - 比如：FilterA和FilterB，则先执行FilterA。
  - 比如：Filter1和Filter2，则先执行Filter1.

- Filter的生命周期？

  - 和Servlet对象生命周期一致。
  - 唯一的区别：Filter默认情况下，在服务器启动阶段就实例化。Servlet不会。

- Filter过滤器这里有一个设计模式：

  - 责任链设计模式。
  - 过滤器最大的优点：
    - 在程序编译阶段不会确定调用顺序。因为Filter的调用顺序是配置到web.xml文件中的，只要修改web.xml配置文件中filter-mapping的顺序就可以调整Filter的执行顺序。显然Filter的执行顺序是在程序运行阶段动态组合的。那么这种设计模式被称为责任链设计模式。
  - 责任链设计模式最大的核心思想：
    - 在程序运行阶段，动态的组合程序的调用顺序。
  
- 使用过滤器改造OA项目。

# Listener监听器

- 什么是监听器？

  - 监听器是Servlet规范中的一员。就像Filter一样。Filter也是Servlet规范中的一员。
  - 在Servlet中，所有的监听器接口都是以“Listener”结尾。

- 监听器有什么用？

  - 监听器实际上是Servlet规范留给我们javaweb程序员的特殊时机。
  - 特殊的时刻如果想执行这段代码，你需要想到使用对应的监听器。

- Servlet规范中提供了哪些监听器？

  - jakarta.servlet包下：
    - ServletContextListener
    - ServletContextAttributeListener
    - ServletRequestListener
    - ServletRequestAttributeListener
  - jakarta.servlet.http包下：
    - HttpSessionListener
    - HttpSessionAttributeListener
      - 该监听器需要使用@WebListener注解进行标注。
      - 该监听器监听的是什么？是session域中数据的变化。只要数据变化，则执行相应的方法。主要监测点在session域对象上。
    - HttpSessionBindingListener
      - 该监听器不需要使用@WebListener进行标注。
      - 假设User类实现了该监听器，那么User对象在被放入session的时候触发bind事件，User对象从session中删除的时候，触发unbind事件。
      - 假设Customer类没有实现该监听器，那么Customer对象放入session或者从session删除的时候，不会触发bind和unbind事件。
    - HttpSessionIdListener
      - session的id发生改变的时候，监听器中的唯一一个方法就会被调用。
    - HttpSessionActivationListener
      - 监听session对象的钝化和活化的。
      - 钝化：session对象从内存存储到硬盘文件。
      - 活化：从硬盘文件把session恢复到内存。

- 实现一个监听器的步骤：以ServletContextListener为例。

  - 第一步：编写一个类实现ServletContextListener接口。并且实现里面的方法。

    - ```
      void contextInitialized(ServletContextEvent event)
      void contextDestroyed(ServletContextEvent event)
      ```

  - 第二步：在web.xml文件中对ServletContextListener进行配置，如下：

    - ```
      <listener>
          <listener-class>com.bjpowernode.javaweb.listener.MyServletContextListener</listener-class>
      </listener>
      ```

    - 当然，第二步也可以不使用配置文件，也可以用注解，例如：@WebListener
  
- 注意：所有监听器中的方法都是不需要javaweb程序员调用的，由服务器来负责调用？什么时候被调用呢？

  - 当某个特殊的事件发生（特殊的事件发生其实就是某个时机到了。）之后，被web服务器自动调用。
  
- 思考一个业务场景：

  - 请编写一个功能，记录该网站实时的在线用户的个数。
  - 我们可以通过服务器端有没有分配session对象，因为一个session代表了一个用户。有一个session就代表有一个用户。如果你采用这种逻辑去实现的话，session有多少个，在线用户就有多少个。这种方式的话：HttpSessionListener够用了。session对象只要新建，则count++，然后将count存储到ServletContext域当中，在页面展示在线人数即可。
  - 业务发生改变了，只统计登录的用户的在线数量，这个该怎么办？
    - session.setAttribute("user", userObj); 
    - 用户登录的标志是什么？session中曾经存储过User类型的对象。那么这个时候可以让User类型的对象实现HttpSessionBindingListener监听器，只要User类型对象存储到session域中，则count++，然后将count++存储到ServletContext对象中。页面展示在线人数即可。

- 实现oa项目中当前登录在线的人数。

  - 什么代表着用户登录了？
    - session.setAttribute("user", userObj); User类型的对象只要往session中存储过，表示有新用户登录。
  - 什么代表着用户退出了？
    - session.removeAttribute("user"); User类型的对象从session域中移除了。
    - 或者有可能是session销毁了。（session超时）

























