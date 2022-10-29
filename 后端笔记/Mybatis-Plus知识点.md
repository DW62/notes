# Mybatis-Plus

## 使用

### **相关依赖**

> 注意：引入 MyBatis-Plus 之后请不要再次引入 MyBatis，以避免因版本差异导致的问题。

```xml
<!--mybatis-plus-->
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.3.1</version>
</dependency>

<!--mysql依赖-->
  <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <scope>runtime</scope>                  
  </dependency>
<!--lombok用来简化实体类-->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```

### **配置**

`数据库连接配置`

* spring boot 2.0（内置jdbc5驱动）

  ```properties
  #mysql数据库连接
  spring.datasource.driver-class-name=com.mysql.jdbc.Driver
  spring.datasource.url=jdbc:mysql://localhost:3306/mybatis_plus?characterEncoding=utf-8&useSSL=false
  spring.datasource.username=数据库用户名
  spring.datasource.password=数据库密码
  ```

* spring boot 2.1及以上（内置jdbc8驱动）

  ```properties
  spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
  spring.datasource.url=jdbc:mysql://localhost:3306/mybatis_plus?serverTimezone=GMT%2B8
  spring.datasource.username=数据库用户名
  spring.datasource.password=数据库密码
  ```

注意：

1. 这里的 url 使用了 ?serverTimezone=GMT%2B8 后缀，因为8.0版本的jdbc驱动需要添加这个后缀，否则运行测试用例报告如下错误：` java.sql.SQLException: The server time zone value 'ÖÐ¹ú±ê×¼Ê±¼ä' is unrecognized or represents more `

2. 这里的 driver-class-name 使用了  com.mysql.cj.jdbc.Driver ，在 jdbc 8 中 建议使用这个驱动，否则运行测试用例的时候会有 WARN 信息

`查看sql输出日志配置`

```properties
mybatis-plus.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
```

` 配置逻辑删除`（**默认0：表示未删除   1：表示删除**）

```properties
#配置1表示删除
mybatis-plus.global-config.db-config.logic-delete-value=1
#配置0表示不删除
mybatis-plus.global-config.db-config.logic-not-delete-value=0
```

### **启动类**

在 Spring Boot 启动类中添加 @MapperScan 注解，扫描 Mapper 文件夹

```java
@SpringBootApplication
@MapperScan("mapper文件夹路径")
public class DemomptestApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemomptestApplication.class, args);
    }
}
```

### **mapper文件**

创建包 mapper 编写Mapper 接口： UserMapper.java       实现 BaseMapper<实体类>

```java
@Mapper
public interface UserMapper extends BaseMapper<User> {
}
```

**此时mapper就包含Mybatis-Plus的方法**

## 主键策略

1. 默认策略：使用细化算法生成id

   实体字段中配置 @TableId(type = IdType.ASSIGN_ID)

   ```java
   @TableId(type = IdType.ASSIGN_ID)
   private Long id;
   ```

2. 自增策略

   需要在创建数据表的时候设置主键自增

   实体字段中配置 @TableId(type = IdType.AUTO)

   ```java
   @TableId(type = IdType.AUTO)
   private Long id;
   ```

> 要想影响所有实体的配置，可以设置全局主键配置

```properties
#全局设置主键生成策略
mybatis-plus.global-config.db-config.id-type=auto
```

## 实体属性值自动填充

需求描述：

项目中经常会遇到一些数据，每次都使用相同的方式填充，例如记录的创建时间，更新时间等。我们可以使用MyBatis Plus的自动填充功能，完成这些字段的赋值工作

例如创建时间和跟新时间

1. 在实体字段上添加创建和更新自动填充的注解

   ```java
   @TableField(fill = FieldFill.INSERT) //当对象第一次创建时自动填充数据
   private Date createTime;  //create_time
   
   @TableField(fill = FieldFill.INSERT_UPDATE)//当对象第一次创建时和每一次修改时自动填充数据
   private Date updateTime; //update_time
   ```

2. 实现元对象处理接口

   ```java
   @Component
   public class MyMetaObjectHandler implements MetaObjectHandler {
       //mp执行添加操作，这个方法执行
       @Override
       public void insertFill(MetaObject metaObject) {
           //参数1：实体属性名称 参数2：自动填充的值    可以设置多个需要自动填充的值
           this.setFieldValByName("createTime",new Date(),metaObject);
           this.setFieldValByName("updateTime",new Date(),metaObject);
       }
   
       //mp执行修改操作，这个方法执行
       @Override
       public void updateFill(MetaObject metaObject) {
           this.setFieldValByName("updateTime",new Date(),metaObject);
       }
   }
   ```

## 时间转换

当数据库中存储类型为时间类型，此时获取数据后通过json返回，时间格式似“Fri Dec 01 21:05:20 CST 2017”这样，不满足我们的需要。

首先加入jackson-databind依赖，**如果出现错误可以提高依赖版本**

```xml
 	<dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.12.5</version>
        <scope>compile</scope>
    </dependency>
```

然后在属性上添加注解 @JsonFormat

```java
  	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createTime;
```

此时在通过json返回的数据中时间的格式就会变成yyyy-MM-dd HH:mm:ss的格式，但是如果在控制台输出依然是原理格式

## 乐观锁

**主要适用场景**：当要更新一条记录的时候，希望这条记录没有被别人更新，也就是说实现线程安全的数据更新

**乐观锁实现方式**：给数据添加一个版本字段，当数据进行更新时需要先查询版本值，然后带上版本值对数据进行更新，在数据更新的同时，Mybatis-Plus会自动更新版本自动的值

**具体实现步骤：**

1. 在数据和实体类中添加version字段和属性,并在属性上使用@Version注解

   ```java
   @Version
   private Integer version;
   ```

2. 创建配置文件

   创建包`config`，创建文件`MybatisPlusConfig.java`

   **此时可以删除主类中的 @MapperScan 扫描注解**

   ```java
   @Configuration
   @MapperScan("com.atguigu.demomptest.mapper")
   public class MpConfig {
       /**
        * 乐观锁插件,可以从官网找
        */
       @Bean
       public OptimisticLockerInterceptor optimisticLockerInterceptor() {
           return new OptimisticLockerInterceptor();
       }
   }
   ```

3. 测试

   如果使用乐观锁，对数据跟新时，先查询数据然后对需要改变的值进行改变，最后将新的数据执行更新操作到数据库

## 查询

### 通过多个id批量查询

完成了动态sql的foreach的功能  

```java
//多个id批量查询
@Test
public void testSelect1() {
    List<User> users = userMapper.selectBatchIds(Arrays.asList(1, 2, 3));
    System.out.println(users);
}
```

### 简单条件查询

通过map封装查询条件

注意：map中的key对应数据库中的列名。如：数据库user_id，实体类是userId，这时map的key需要填写user_id

```java
@Test
public void testSelect2() {
    Map<String, Object> columnMap = new HashMap<>();
    columnMap.put("name","Jack");
    columnMap.put("age",20);
    List<User> users = userMapper.selectByMap(columnMap);
    System.out.println(users);
}
```

### 分页查询

MyBatis Plus自带分页插件，只要简单的配置即可实现分页功能

**在MyBatis Plus配置类中添加分页插件**

```java
 	/**
     * 分页插件
     * @return
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }
```

**测试selectPage分页**最终通过page对象获取相关数据

```java
//分页查询
@Test
public void testSelectPage() {
    Page<User> page = new Page(1,3);//参数1：当前页码，参数2：每一页显示条数
    Page<User> userPage = userMapper.selectPage(page, null);
    //返回对象得到分页所有数据
    long pages = userPage.getPages(); //总页数
    long current = userPage.getCurrent(); //当前页
    List<User> records = userPage.getRecords(); //查询数据集合
    long total = userPage.getTotal(); //总记录数
    boolean hasNext = userPage.hasNext();  //是否有下一页
    boolean hasPrevious = userPage.hasPrevious(); //是否有上一页

    System.out.println(pages);
    System.out.println(current);
    System.out.println(records);
    System.out.println(total);
    System.out.println(hasNext);
    System.out.println(hasPrevious);
}
```

**当指定了特定的查询列时，希望分页结果列表只返回被查询的列，而不是很多null值** 测试selectMapsPage分页：结果集是Map

```java
@Test
public void testSelectMapsPage() {
    //Page不需要泛型
    Page<Map<String, Object>> page = newPage<>(1, 5);//参数1：当前页码，参数2：每一页显示条数
    Page<Map<String, Object>> pageParam = userMapper.selectMapsPage(page, null);
    List<Map<String, Object>> records = pageParam.getRecords();
    records.forEach(System.out::println);
    System.out.println(pageParam.getCurrent());
    System.out.println(pageParam.getPages());
    System.out.println(pageParam.getSize());
    System.out.println(pageParam.getTotal());
    System.out.println(pageParam.hasNext());
    System.out.println(pageParam.hasPrevious());
}
```

## 删除与逻辑删除

### 根据id删除

```java
@Test
public void testDeleteById(){
    int result = userMapper.deleteById(5L);
	system.out.println(result);
}
```

### 批量删除

```java
@Test
public void testDeleteBatchIds() {
    int result = userMapper.deleteBatchIds(Arrays.asList(8, 9, 10));
	system.out.println(result);
}
```

### 简单条件删除

```java
@Test
public void testDeleteByMap() {
    HashMap<String, Object> map = new HashMap<>();
    map.put("name", "Helen");
    map.put("age", 18);
    int result = userMapper.deleteByMap(map);
    system.out.println(result);
}
```

### 逻辑删除

物理删除：真实删除，将对应数据从数据库中删除，之后查询不到此条被删除数据

逻辑删除：假删除，将对应数据中代表是否被删除字段状态修改为“被删除状态”，之后在数据库中仍旧能看到此条数据记录

**逻辑删除的使用场景：**可以进行数据恢复，有关联数据，不便删除

> 逻辑删除具体原理：在表中添加一个字段，作为逻辑删除的标志，每一次删除的时候修改标志位，1：表示已经删除
>
> 0：表示未被删除

步骤·：

1. 在数据库中添加一个字段（这里用deleted表示），来表示逻辑删除状态，**字段值为1或者0**

2. **在实体类中添加deleted 字段，并加上 @TableLogic 注解** 

   ```java
   @TableLogic
   private Integer deleted;	
   ```

3. 在配置文件中配置逻辑删除状态（**默认0：表示未删除 1：表示删除**）

   ```properties
   #配置1表示删除
   mybatis-plus.global-config.db-config.logic-delete-value=1
   #配置0表示不删除
   mybatis-plus.global-config.db-config.logic-not-delete-value=0
   ```

4. 测试

   测试后发现，数据并没有被删除，deleted字段的值由0变成了1

   测试后分析打印的sql语句，是一条update

   注意：被删除前，数据的deleted 字段的值必须是 0，才能被选取出来执行逻辑删除的操作

5. 测试逻辑删除后的查询

   MyBatis Plus中查询操作也会自动添加逻辑删除字段的判断

## 条件构造器和常用接口

![image-20220205164228545](https://gitee.com/dwOrigin/imgck/raw/master/image/image-20220205164228545.png)

Wrapper ： 条件构造抽象类，最顶端父类  

​	 **AbstractWrapper ：** **用于查询条件封装，生成 sql 的 where 条件** 

​	**QueryWrapper ： 查询条件封装**（常用）

​	**UpdateWrapper ： Update 条件封装**

 	 AbstractLambdaWrapper ： 使用Lambda 语法

​    	LambdaQueryWrapper ：用于Lambda语法使用的查询Wrapper

   	 LambdaUpdateWrapper ： Lambda 更新封装Wrapper

### 条件参数

| ge：大于等于                        | le：小于等于               | isNull：为空                |
| ----------------------------------- | -------------------------- | --------------------------- |
| gt：大于                            | lt：小于                   | isNotNull：不为空           |
| eq：等于                            | between：在区间范围内      | like: 模糊查询 等同于 %张%  |
| ne：不等于                          | notBetween：不在区间范围内 | notLike：不在模糊查询范围中 |
| likeLeft：左边模糊查询  等同于 %张  | orderBy：                  | orderByDesc：降序排列       |
| likeRight：右边模糊查询  等同于 张% |                            | orderByAsc：升序排列        |

```java
//测试ge、gt、le、lt、isNull、isNotNull
@Test
public void testQuery() {
    QueryWrapper<User>queryWrapper = newQueryWrapper<>();
    queryWrapper
            .isNull("name")
            .ge("age", 12)
            .isNotNull("email");
        int result = userMapper.delete(queryWrapper);
    System.out.println("delete return count = " + result);
}
//测试eq、ne
@Test
public void testSelectOne() {
    QueryWrapper<User>queryWrapper = newQueryWrapper<>();
    queryWrapper.eq("name", "Tom");
    Useruser = userMapper.selectOne(queryWrapper);//只能返回一条记录，多余一条则抛出异常
    System.out.println(user);
}
//测试 between、notBetween
@Test
public void testSelectCount() {
    QueryWrapper<User>queryWrapper = newQueryWrapper<>();
    queryWrapper.between("age", 20, 30);
    Integer count = userMapper.selectCount(queryWrapper); //返回数据数量
    System.out.println(count);
}
//测试 like、notLike、likeLeft、likeRight
@Test
public void testSelectMaps() {
    QueryWrapper<User>queryWrapper = newQueryWrapper<>();
    queryWrapper
            .select("name", "age")
            .like("name", "e")
            .likeRight("email", "5");
    List<Map<String, Object>>maps = userMapper.selectMaps(queryWrapper);//返回值是Map列表
    maps.forEach(System.out::println);
}
//测试 orderBy、orderByDesc、orderByAsc
@Test
public void testSelectListOrderBy() {
    QueryWrapper<User>queryWrapper = newQueryWrapper<>();
    queryWrapper.orderByDesc("age", "id");
    List<User>users = userMapper.selectList(queryWrapper);
    users.forEach(System.out::println);
}
```

