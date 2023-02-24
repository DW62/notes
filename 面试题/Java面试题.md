# JAVA面试题合集

## 基础

### 为什么需要包装类型数据？

基本类型不是对象，所以Java并不是纯面向对象的语言，好处是效率较高(全部包装为对象效率低)

Java是一个面向对象的编程语言，基本类型并不具有对象的性质，为了让基本类型也具有对象的特征，就出现了包装类型(如果我们在使用集合类型Collection时就一定要使用包装类型而不是基本类型)，它相当于将基本类型包装起来，使得它有了对象的性质，并且为其添加了属性和方法，丰富了基本类型的操作。

### 什么是装箱和拆箱？

**装箱：**自动将基本数据类型转换为包装器类型。

**拆箱：**自动将包装器类型转换为基本数据类型。

> 基本数据类型：		byte、char、		short、 int、	   float、 long、double、boolean
>
> 对应的包装器类型： Byte、Character、Short、Integer、Float、Long、Double、Boolean

**实例：**

```java
//自动装箱
Interger i=10;  //自动将int类型转换为Interger
//自动拆箱
int n=i;//自动将Interger转换为int类型
```

### int和Integer的区别？

* `int`是Java的一种基本数据类型，`Integer`是`int`的包装类
* `Integer`必须实例化后才能使用，`int`不需要
* `Integer`实际上是对象的引用，当`new`一个`Integer`实际上是生成一个指针指向该对象，而`int`可以直接存储值。
* `Integer`默认值是null，`int`默认值是0

**延伸：**关于`Integer`和`int`的比较

1. 由于`Integer`变量实际上是对一个`Integer`对象的引用，所以两个通过`new`生成的`Integer`变量永远是不相等的。**因为new生成的是两个对象，其内存地址不同。**

```java
Integer i=new Integer(100);
Integer n=new Integer(100);
System.out.print(i==n);		//false
```

2. `Integer`变量和`int`变量比较时，**只要两个变量的值是相等的。则比较结果为true**。因为包装类`Integer`和基本数据类型`int`比较时，**Java会自动拆箱为int，然后进行比较**，实际上就变成两个`int`变量的比较

```java
Integer i=new Integer(100);
int j=100;
System.out.print(i==j);		//true
```

3. 非`new`生成的`Integer`变量和`new Integer()`生成的变量比较时，结果false。**因为非`new`生成的`Integer`变量指向的是Java常量池中的对象，而`new Integer()`生成的变量指向堆中新建的对象，两者内存地址不同。**

```java
Integer i=new Integer(100);
Integer j=100;
System.out.print(i==j);	//false
```

4. 对于两个非`new`生成的`Integer`对象，进行比较**如果两个变量值在-128到127之间，则比较结果为true**，**如果两个变量的值不在此区间，则比较结果为false**

```java
Integer i=100;
Integer j=100;
System.out.print(i==j);	//true
Integer i=128;
Integer j=128;
System.out.print(i==j);	//false
```

`Java`在编译`Integer i=100;`时会编译为`Integer i=Integer.valueOf(100);`而Java API中对Integer类型的valueOf定义如下：

```java
public static Integer valueOf(int i){
    assert IntegerCache.high >= 127;
    if(i>= IntegerCache.low && i<=IntegerCache.high){
        return IntegerCache.cache[i + (-IntegerCache.low)];
    }
    return new Integer(i);
}
```

**Java对于-128到127之间的数，会进行缓存**，Integer i=127时，会将127进行缓存，下次再写Integer j=127时，就会**直接从缓存中取，就不会new了。**

### 基本类型和引用类型的区别？

基本类型保存原始值，引用类型保存的是引用值(引用值就是指对象在堆中所处的位置/地址)

### `short s1 = 1; s1 = s1 + 1`;有什么错? `short s1 = 1; s1 +=1;`有什么错?

* 对于`short s1=1; s1=s1+1`来说，在`s1+1`运算时会自动提示表达式类型为`int`，那么将`int`赋予给`short`类型的变量`s1`会出现类型转换错误。
* 对于` short s1=1; s1+=1`来说 `+=`是Java语言规定的运算符，Java编译器会对它进行特殊处理，因此可以正常编译。

### Java的四个基本特征和多态的理解？

**Java的四个基本特征：**

* 抽象：抽象是将一类对象的共同特征总结出来构造类的过程，包括数据抽象和行为抽象两方面。抽象只关注对象有哪些属性和行为，并不关注这些行为的细节。
* 继承：继承是从已有的类得到继承信息创建新类的过程。提供继承的信息的类称为父类(超类、基类)，得到继承信息的类称为子类(派生类)。继承让变化中的系统有一定的延续性，同时继承也是封装过程中可变因素的重要手段。
* 封装：通常认为封装就是把数据和操作数据的方法绑定起来，对数据的访问只能通过已经定义的接口。面向对象的本质就是将现实世界描绘成一系列完全自治、封闭的对象。我们在类中编写的方法就是对实现细节的一种封装，我们编写一个类就是对数据和数据操作的封装。可以说，封装就是隐藏一切可隐藏的东西，只向外界通过最简单的编程接口。
* 多态：是值允许不同子类型对象对同一信息做出不同的相应。

**多态的理解(多态的实现方式)：**

* 方法重载(overload)实现是编译时的多态性(也称为前绑定)。
* 方法重写(overload)实现是运行时的多态(也称为后绑定)。运行时多态是面向对象的精髓。
* 要实现多态需要两件事(1)方法重写(子继承父类并重写父类中已经有的或者抽象的方法)，(2)对象造型(用父类型引用子类型对象，这样同样的引用调用同样的方法就会根据子类对象的不同而表现出不同的行为)

**项目中多态的应用：**

​	举个简单的例子：在物流信息管理系统中，有两种用户：订购客户和卖出客户，两种客户都可以登录系统，他们有相同的Login，但是登录之后他们会进入不同的页面，也就是在登录的时候有不同的操作，两种客户都继承父类的Login方法，但是对于不同的对象，拥有不同的操作。

### 重载和重写的区别？

**重载：** 方法重载主要发生在同一个类中，两个或者多个方法，方法名相同但是参数不同的情况。

**重写：**重写又名覆盖，方法重写是说明子类重新定义了父类的方法。重写必须有相同的方法名、参数列表和返回值类型。

**重写特点：**

					1. 不能存在同一个类里面，只能是在继承关系中。
					1. 方法名相同，参数列表相同，方法返回值相同。
					1. 子类方法的访问修饰符必须要大于父类的。
					1. 子类的检查异常类型要小于父类的检查异常。

### 继承

子类继承父类所有的成员变量(即使private变量，有所有权，但是没有使用权，不能访问父类的private的成员变量)

子类中可以直接调用父类的非private方法，也可以使用super，父类方法的形式调用。

### 内部类

> * 在另一个类中定义的类就是内部类
> * 内部类是编译器现象，与虚拟机无关
> * 编译器会将内部类编译器成用$分割外部类名和内部类名的常规文件，而虚拟机对此一无所知。
>
> 内部类可以是static的，也可以是public、default、protected和private修饰。而外部类只能是public和default修饰

**内部类的优点：**

* 内部类可以有多个实例，每个实例都有自己状态信息，并且与其他外部对象的信息相互独立。
* 在单个外部类中，外部类想要多继承的类可以分别由内部类来继承，然后外部类通过创建内部类的对象来使用内部对象的方法和成员，从而达到多继承的目的，这样外部类就具有多个父类的所有特征。
* 内部类是一个独立的实体，创建内部类对象的时候并不依赖于外部类对象的创建。
* 内部类提供了更好的封装除了外部类，其他的类都不能访问。
* 只有静态内部类可以同时拥有静态成员和非静态成员，其他内部类只拥有非静态成员。

**成员内部类：** 就像外部类的一个成员变量

内部类的对象总有一个外部类的引用

当创建内部类对象时，就会自动将外部类的this引用传递给当前内部类的构造方法。

**静态内部类：**就像外部类的一个静态成员变量

```java
public class OuterClass{
    private static class StaticInnerClass{
        int id ;
        static int increment=1;
    }
}
//调用方式：
//外部类.内部类 instanceName = new 外部类.内部类();
```

**局部内部类：**定义在一个方法或者一块作用域里面的类

> 想创建一个类来辅助我们的解决方案，又不希望这个类是公共可用的，所有就产生了局部内部类，局部内部类和成员变量一样被编译，只是它的作用域发生了变化，它只能在改方法和属性中被使用，出了改方法和属性就会失效。

JDK1.8之前不能访问非final的局部变量!

**匿名内部类：**必须继承一个父类或者实现一个接口

* 匿名内部类和局部内部类在JDK1.8之前都不能访问一个非final的局部变量，只能访问一个final的局部变量，原因是生命周期不同，可能栈中的局部变量已经被销毁，而堆中的对象依然存活，此时会访问一个不存在的内存区域。假如是final的变量，那么编译时会将其拷贝一份，延长其生命周期。
* 拷贝引用，为了避免引用值发生改变，例如被外部类的方法修改等，而导致内部类得到的值不一致，于是用final来让改引用不可变。
* 在JDK1.8之后可以访问一个非局部变量，前提是非final的局部变量没有修改，表现的和final变量一样才可以！

### switch

**switch字符串实现原理：** 代码编译后switch会基于整数进行比较，整数来源与string的hashCode，会先比较字符串的hashCode，然后在判断equals。

**字节码实现原理：** 编译器会使用tableswitch和lookupswitch指令来生成switch语句的编译代码。将switch语句的case分支的条件值比较稀疏时，tableswitch指令的空间使用率偏低，这种情况下将使用lookupswitch指令来替代。lookupswitch指令的索引表由int类型的键（来源于case语句后面的数值）与对应的目标语句偏移量所构成。lookupswitch指令执行时，switch语句的条件值将索引表中的键值进行比较，如果某一个键和条件值相符，那么将转移到这个键对应的分支偏移量继续执行，如果没有键值符合，执行将在default分支执行。

### JDK和JRE的区别？

**JDK：**Java开发工具包，提供了Java的开发环境和运行环境。

**JRE：**Java运行环境，为Java的运行提供了所需的环境。

具体来说JDK其实包含了JRE，同时还包含了编译Java源码的编译器Javac，还包含了很多Java程序调试和分析工具。简单来说：如果想要开发Java程序就需要安装JDK，要运行Java程序(除了运行包含jsp的Java程序外)只需要安装JRE就可以。

### ==和equals的区别是什么？

`==`对于基本数据类型来说就是值的比较，对于引用数据类型来说就是比较的引用。

`equals`默认情况下是引用的比较，只是很多类都重写了equals方法，比如`String`、`Integer`等把他变成了值的比较，所以一般情况下`equals`比较的是值是否相等。

**示例：**

```java
String x = “string”;
String y = “string”;
String z = new String(“string”);
System.out.println(x==y); // true
System.out.println(x==z); // false
System.out.println(x.equals(y)); // true
System.out.println(x.equals(z)); // true
Cat c1 = new Cat(“王磊”);
Cat c2 = new Cat(“王磊”);
System.out.println(c1.equals(c2)); // false 普通对象没有重写equals
String s1 = new String(“老王”);
String s2 = new String(“老王”);
System.out.println(s1.equals(s2)); // true  String重写equals比较的是值
```

代码解读：因为x和y指的是同一个引用，所以`x==y`为true，而`new String()`方法重新开辟了内存空间所以`x==z`为false，而equals比较的一值都是值，所以结果为true。

### 两个对象的 `hashCode()` 相同，则 `equals()` 也一定为 `true`吗？

**不对**

当两个对象的`equals`为`true`时，两个对象的`hashCode()`一定相等。但是两个对象的hashCode()相等时equals不一定为`true`。

> `hashCode`其实就是对一个对象中的每一个元素进行一次运算生成的结果值，不同的两个对象有可能出现同一个`hashCode`值

### Java中是否可以覆盖(`override`)一个`private`或者是一个`static`的方法？

`static`方法跟类的任何实体都不相关，所以概念上不适用。Java中也不可以覆盖`private`的方法，因为`private`修饰的变量和方法只能在当前类中使用，如果是其他类的继承当前类是不能访问到`private`变量或方法的，当然也不能覆盖。

### 面向对象的六个基本原则

**六个基本原则:**

* 单一职责：一个类只做它该做的事情(高内聚)。在面向对象中如果只让一个类完成它该做的事，而不涉及与它无关的领域就是实现了高内聚的原则，这个类就只有单一职责。
* 开发封闭：软件实体应当对扩展开放，对修改关闭。要做到开闭有两个要点
  1. 抽象是关键，一个系统中如果没有抽象类或者接口系统就没有扩展点。
  2. 封装可变性，将系统中各种可变因素封装到一个继承解构中，如果多个可变因素混杂在一起，系统将变的复杂而混乱。
* 墨氏替换：任何时候都可以用子类型替换父类性。子类一定是增加父类的能力，因为子类比父类的能力更多，把能力多的对象当成能力少的对象来用当然没有任何问题。
* 依赖倒置：面向接口编程。该原则说的直白和具体一些就是声明方法的参数类型、方法的返回值类型、变量的引用类型时，尽可能使用聚合或者合成关系复用代码。
* 合成聚合复用：优先使用聚合或者合成关系复用代码。
* 接口隔离：接口要小而专，绝不能大而全。臃肿的接口是对接口的污染，既然接口表示能力，那么一个接口只应描述一种能力，接口也应该是搞内聚的。

**迪米特法则：**又叫做最少知识原则，一个对象应当对其他对象有尽可能少的了解。	

**项目中用到的原则：**单一职责、开放封闭、合成聚合复用(最简单的例子就是String类)、接口隔离

### Java创建对象的四种方式

1. 使用`new`创建对象：使用`new`关键字创建对象是最常见的一种方式，但是使用`new`创建对象会增加耦合度，**无论使用什么框架都要减少使用`new`创建对象以此来降低耦合度**。
2. 使用反射机制创建对象：使用`Class类`的`newInstance方法`。
3. 采用`clone(克隆)`：`clone`时，需要已经有一个分配了内存的源对象，创建新的对象时，首先应该分配一个和源对象一样大的内存空间。要调用`clone方法`需要实现`Cloneable接口`。
4. 采用序列化机制：使用序列化时，需要实现`Serializable`接口，将一个对象序序列化到磁盘上，而采用反序列化可以将磁盘上的对象信息转化到内存中。

### `String、StringBuffer、StringBuilder`的区别？

* 都是`final`类不允许被继承。
* `String`长度是不可变的`StringBuffer`、`StringBuilder`长度是可变的。
* `StringBuffer` 是线程安全的`StringBuilder`不是线程安全的，但是他们两个中的所有方法都是相同的，`StringBuffer`在`StringBuilder`的方法之上添加了`synchronized`修饰，保证线程安全。
* `StringBuilder`比`StringBuffer`拥有更好的性能。
* 如果一个`String`类型的字符串，在编译时就可以确定是一个字符串常量，则编译完成之后，字符串会自动拼接成一个常量，此时`String`的速度比`StringBuffer`和`StringBuilder`的性能好的多。

### String不可变的理解

* `String`类被`final`进行修饰，不能被继承。
* 在用`+`号链接字符串的时候会创建新的字符串。
* `String s=new String("Hello World")`可以创建两个对象也可以创建一个对象，如果静态区有`“Hello World ”`字符串常量对象的话，仅仅在堆中创建一个对象。如果静态区没有`"Hello World" `对象，则在堆和静态区中都要创建对象。
* 在Java中，通过使用`“+”` 符号来串联字符串的时候，实际上底层会转换为`StringBuilder`实例的`append()`方法来实现。

### `String s="XYZ"` 和`String s=new String("XYZ")`的区别？

两个语句都会先在字符串常量池中检查是否已经存在`XYZ`，如果存在则直接使用，如果不存在则会在常量池中创建`XYZ`对象。另外`String s=new String("XYZ") `还会通过` new String() `在堆里面创建一个内容与`XYZ`相同的对象实例，所以前者可以认为是被后者所包含。

### `String s=new String("XYZ")`创建了几个字符串对象？

会创建一个或者两个字符串对象。

如果字符串常量池中已经有一个`XYZ`则中创建一个。

如果字符串常量池中没有`XYZ`则创建两个对象，一个在字符串常量池里面的`XYZ`，另一个是通过`new String() `创建的，在堆中。

### final 在Java中的作用

* final修饰的类叫做终类，该类不能被继承。
* final修饰的方法不能被重写。
* final修饰的变量叫做常量，常量必须初始化，初始化后的值就不能被修改。

### finally

> try-catch-finally

* 无论是否出现异常，finally块中的代码都会执行。
* 当try和catch中有return时，finally仍然会执行，无论try里面执行了return语言，break语句、还是continue语句，finally语句块还会继续执行，但是如果执行try和catch时JVM退出(比如System.exit(0))，那么finally不会被执行。
* finally是在return后面的表达式运算后执行的(此时并没有返回运算后的值，而是先把要返回的值保存起来，然后执行finally中的代码，此时不管finally中的代码怎样运算，返回值都不会改变，依然是之前保存的值)
* 当try和finally里面都有return时，会忽略try的return，而使用finally的return。
* 如果try代码块中的代码抛出异常，执行finally时又抛出异常，此时原始异常信息丢失，只抛出finally代码块中的异常。

### Math.round()方法作用

Math.round()方法为值先加上0.5然后做四舍五入。例如`Math.round(-1.5)=-1`。

>Math类中提供了三个与取值有关的方法：ceil(向上取整)、floor(向下取整)、round(值先加上0.5然后做四舍五入)

### `string`有重写 `Object`的 `hashcode`和 `toString`吗?

`string`重写了`Object`的`hashcode`和`toString.`

### 如果重写`equals`不重写`hashcode`会出现什么问题？

当`equals`方法被重写时，通常有必要重写`hashCode`方法，以维护`hashcode`方法的常规协定，该协定声明**对相对等的两个对象必须有相同的hashcode。**

重写`equals`不重写`hashcode`方式，在存储散列集合如`Set`时，如果两个对象`equals`相等，但是对`hashcode`没有重写，即两个对象拥有不同的`hashcode`，则在集合中会存储两个值相同的对象，从而导致混淆，因此在重写`equals`方法必须重写`hashconde`方法

### 对字符串常量池`String Pool`的了解

字符串常量池`String Pool` 保存这所有字符串的字面量`Iiteral strings `，这些字面量在编译时期就确了。不仅如此，还可以使用`String的intern()方法`在运行的过程中将字符串添加到`StringPool`中。

当一个字符串调用`intern()`方法时，如果`StringPool`中已经存在一个字符串和该字符串值相等(使用equals方法进行确定)，那么就会返回`StringPool`中字符串的引用，否则就会在`StringPool`中添加一个新的字符串并返回这个新字符串的引用。

**示例：**

```java
String s1=new String("aaa");
String s2=new String("aaa");
System.out.println(s1==s2)；		//false
String s3=s1.intern();
String s4=s1.intern();
System.out.println(s3==s4);		//true
```

s1和s2是通过`new String()`的方法创建的两个不同的字符串，而s3和s4是通过`s1.intern()`方法获取的一个字符串的引用。`intern()`首先把s1引用的字符串放到`StringPool`中，然后返回这个字符串引用。因此s3和s4引用的是同一个字符串。

```java
String s5="bbb";
String s6="bbb";
System.out.println(s5==s6)；	//true
```

如果是采用这种方法传教的字符串，则会自动将字符串放入`StringPool`中。

> 在Java7之前，`StringPool`被放在运行时常量池中，它属于永久代。而在Java7，`StringPool`被移动到堆中。这是因为永久代的空间有限，在大量使用字符串的场景下会导致`OutOfMemoryError`错误。

### Java访问控制符的区别

| 访问级别 | 访问控制修饰符  | 同类 | 同包 | 子类 | 不同包 |
| -------- | --------------- | ---- | ---- | ---- | ------ |
| 公开     | public          | ✔    | ✔    | ✔    | ✔      |
| 受保护的 | protected       | ✔    | ✔    | ✔    |        |
| 默认     | default可以不写 | ✔    | ✔    |      |        |
| 私有     | private         | ✔    |      |      |        |

不写时默认为default。默认等于同一个包中的其他类相当于公开public，对于不是同一个包中的其他类相当于私有的private。受保护的protected对于子类相当于公开，对于是同一包中没有父子关系的类相当于私有。

不可覆盖private的方法，因为private修饰的变量和方法只能在当前类中使用，如果是其他的类继承当前类是不能访问到private变量或方法的，当然也不能覆盖。

### 父子类的加载顺序？

类加载顺序：

1. 父类静态代码块(包括静态初始化代码块，静态属性、但不包括静态方法)
2. 子类静态代码块(包括静态初始化代码块，静态属性，但是不包括静态方法)
3. 父类非静态代码块(包括非静态初始化代码块、非静态属性)
4. 父类构造函数
5. 子类非静态代码块(包括非静态初始化代码块、非静态属性)
6. 子类构造函数

### 如何实现字符串反转？

可以使用StringBuilder或者StringBuffer的reverse()方法

```java
//StringBuffer  reverse
StringBuffer stringBuffer = new StringBuffer();
stringBuffer.append("abcdefg");
System.out.println(stringBuffer.reverse()); //gfedcba
//StringBuilder reverse
StringBuilder stringBuilder=new SreingBuilder();
stringBuilder.append("abcde");
System.out.println(stringBuilder.reverse());//edcba
```

### String 类常用的方法

indexOf()：返回指定字符串的索引

CharAt()：返回指定索引处的字符

replace()：字符串替换

trim()：去除字符串两端的空白

split()：分割字符串返回字符串数组

getBytes()：返回字符串的byte类型数组

length()：返回字符串长度

toLowerCase()：将字符串转成小写字母

toUpperCase()：将字符串转为大写字符

subString()：截取字符串

equals()：字符串比较

### Java中IO流分几种？

按照功能分为：输入流input、输入流output

按照类型分为：字节流、字符流

### 字节流和字符流的区别？

1. 字节流按照8位传输以字节为单位进行输入输出数据。字符流按照16位传输以字符为单位进行输入输出数据。
2. 字节流主要处理字节、字节数组或二进制对象。字符流主要处理字符、字符数组或字符串
3. 字节流在操作的时候本身是不会用到缓冲区(内存)的，是与文件本身直接操作的，而字符流操作的时候是使用到缓冲区的。
4. 字节流在操作文件时，即使并关闭资源(close方法)，文件也能输出，但是如果字符流不使用close方法的话，则不会输出任何内容，说明字符流用的是缓冲区，并且可以使用flush方法强制进行刷新缓冲区，这时才能在不close的情况下输出内容。
5. Reader类的read()方法返回类型为int：作为整数读取的字符(占两个字节共16位)，范围在0到65535之间，如果已经到达流的末尾，则返回-1。inputStream的read()虽然也返回int，但由于此类是面向字节流的，一个字节占8位，所以返回0到255范围内的int字节值。如果因为已经到达流末尾没有可用的字节，则返回值-1.因此对于不能用0到255来表示的值就得用字符流来读取。比如汉字

### BIO、NIO、AIO有什么区别？

BIO：同步阻塞式IO，就是平常所使用的传统IO，它的特点是模式简单使用方便，并发处理能力低。

NIO：同步非阻塞式IO，是传统IO的升级，客户端和服务端通过Channel(通道)通讯，实现了多路复用。

AIO：也叫NIO2是NIO的升级，实现了异步非阻塞IO，异步IO操作基于事件和回调机制。

### Java中NIO使用

> 传统的IO操作面向数据流，意味着每一次从流中读取一个或者多个字节，直至完成，数据没有被缓存到任何地方。

NIO操作是面向缓冲区的，数据从Channel读取到Buffer缓冲区，随后，在Buffer中处理数据。

BIO中的accept是没有客户端连接时阻塞，NIO的accept是没有客户端连接时立即返回。

NIO的三个重要组件：Buffer、Channel、Selector

Buffer是用于容纳数据缓冲区，Channel是与IO设备之间的连接，类似于流、Seletor是Channel的多路复用器。

**Buffer(缓冲区)**

clear是将position置为0，limit置为capacity，flip是将limit置为position，position置为0

### session和cookie区别

> cookie是Web服务器发送给浏览器的一块信息。浏览器会在本地文件中给每一个Web服务器存储cookie。以后浏览器在给特定的Web服务器发请求的时候，同时会发送所有为该服务器存储cookie。

* session在服务器端，cookie在客户端(浏览器)
* session的运行依赖于cookie中的cookieId，也就是说浏览器禁用了cookie，同时seeion也会失效(但是可以通过其他方式实现，比如在url中传递seeionid)
* session可以放在文件、数据库、或者内存中都可以
* 用户验证这种场合一般会用session
* cookie不是很安全，别人可以分析存放在本地的cookie进行cookie欺骗，考虑到安全应当使用session
* session会在一定时间内保存在服务器上，当访问增多，会比较占用服务器的性能考虑到减轻服务器性能方面，应当使用cookie
* 单个cookie保存数据不能超过4k，很多浏览器都限制一个站点最多保存20个cookie。session能够存储任意的Java对象，cookie只能存储String类型的对象。

### static

static方法就是没有this的方法。在static方法内部不能调用非静态方法，反过来是可以的。而且可以在没有创建任何对象的前提下，仅仅通过类本身来调用static方法。

### static和final

**static和final的区别：**

* static
  * 修饰变量：静态变量随着类加载时被完成初始化，内存中只有一个，且JVM也只会给它分配一次内存，所有类共享静态变量
  
  * 修饰方法：在类加载的时候就存在，不依赖任何实例。static方法必须实现，不能用abstract修饰。并且在静态方法中不能访问类的非静态成员变量和静态成员方法。
  
  * 修饰代码块：在类加载完成之后就会执行代码块中的内容，并且只执行一次。
  
  * 修饰内部类：变成静态内部类。
  
    成员内部类和静态内部类的区别：
  
    	1. 成员内部类只能拥有非静态成员，静态内部类即可以拥有静态成员又可以拥有非静态成员
    	1. 成员内部类持有外部类的引用，可以访问外部类的静态成员和非静态成员。静态内部类不持有外部类的引用，只能访问外部类的静态成员。
    	1. 成员内部类不能脱离外部类而存在，静态内部类可以脱离外部类而存在。
  
  * 父类静态代码块->子类静态代码块->父类非静态代码块->父类构造方法->子类非静态代码块->子类构造方法
  
* final
  * 修饰变量：1.编译常量，类加载的过程完成初始化，编译后带入到任何计算式中，只能是基本类型。2.运行时常量：基本数据类型或引用数据类型。引用不可变，但引用的对象内容可变。
  * 修饰方法：不能被继承，不能被子类修饰。
  * 修饰类：不能被继承。
  * 修饰形参：final形参不可变

**final的好处：**

1. final关键字提高了性能。JVM和Java应用都会缓存final变量。
2. final变量可以安全的在多线程环境下进行共享，而不需要额外的同步开销。
3. 使用final关键字，JVM会对方法、变量及类进行优化。

**static方法是否可以被覆盖？**

static方法不能被覆盖，因为方法覆盖是基于运行时动态绑定的，而static方法是编译时静态绑定的。static方法根类的任意实例都不相关，所以概念上不适用。

### char类型变量能不能存储一个中文汉字？为什么？

char类型变量是用来存储Unicode编码的字符串.Unicode编码字符集中包含了汉字，所以char类型变量可以存储汉字。不过如果某个特殊的汉字没有被包含在Unicode编码字符集中，那么这个char型变量中不能存储这个特殊的汉字。

**补充说明：**unicode编码占两个字节，所以char类型的变量也占两个字节

### abstract

* 只要含有抽象方法，这个类必须添加abstract关键字，定义为抽象类。
* 只要父类是抽象类，内含抽象方法，那么继承这个类的子类的相应方法必须重写。如果不重写，就需要把父类的声明抽象方法再重写一遍，留给这个子类的子类去实现。同时将这个子类也定义为抽象类。
* 抽象类中可以有抽象方法，也可以有具体实现方法
* 抽象方法必须加上abstract关键字，而具体方法不可以加
* 只要是抽象类就不能new一个这个类的对象。

### 抽象类必须要有抽象方法吗?

不需要。抽象类不一定非要抽象方法。

### 普通类和抽象类有哪些区别？

普通类不能包含抽象方法，抽象类可以包含抽象方法。

普通类可以直接实例化，抽象类不能直接实例化。

### 抽象类能使用final修饰吗？

不能，定义抽象类就是让其他类继承的，如果定义为final该类就不能被继承，这样彼此就会产生矛盾，所以final不能修饰抽象类。

### 抽象类可以有static方法吗？

可以。但是必须遵守Java中将方法声明为static的准则。

### 可以创建抽象类实例吗？

不可以，不能创建Java抽象类的实例，它是不完整的。即使抽象类中不包含任何抽象方法，也不能对它实例化。将类声明为abstract的，就等于告诉了编辑器，它是不完整的，不应该被实例化。当一段代码尝试实例化一个抽象类时，Java编辑器就会抛出异常。

### 接口和抽象类有什么区别？

默认方法实现：抽象类可以有默认方法实现，接口不能有默认方法实现。

方法：抽象类可以包含非抽象的普通方法，而接口中所有的方法必须是抽象的，不能有非抽象的普通方法。抽象类可以包含静态方法，接口不能包含静态方法。

成员变量：抽象类中可以有普通成员变量，接口中不能有普通成员变量。抽象类和接口都可以包含静态成员变量，抽象类中的静态成员变量的访问类型可以任意，但是接口中变量只能是public static类型，并且默认为public static final类型

实现：抽象类的子类使用extends来继承，接口必须使用implements来实现接口。

构造方法：抽象类可以有构造函数，接口不能有。

main方法：抽象类可以有main方法并且能够运行它，接口不能有main方法。

实现数量：类可以实现很多给接口，但是只能继承一个抽象类。

访问修饰符：抽象类中的方法可以是任意访问修饰符，接口中的方法默认使用public修饰

Java8中接口中会有default方法，即可以被实现的方法

### 抽象类必须有抽象方法吗？

不需要，抽象类有抽象方法不是强制性的。只需要使用关键字abstract就可以将类声明为抽象类。编辑器会强制所有机构的限制来适用于抽象类，例如现在允许创建一些实例。是否在抽象类中有抽象方法是引起争论的。

### 什么时候选用抽象类而不是接口？

当系统升级时，不能在一个已经发布的接口中添加新的方法，这时使用抽象类更好。同样的，如果你的接口中有很多方法，你对他们的实现感到很头疼，考虑提供一个抽象类作为默认实现。这是Java集合中包含的模式，你可以使用默认实现的List接口的AbstractList。

### Java中抽象方法是什么？

抽象方法是一个没有方法体的方法。仅需要声明一个方法，不需要定义它并使用关键字sbstract声明。

### this & super

**this:** 用来自身引用、访问成员变量和方法、调用其他构造方法

* 通过this调用另一个构造方法，用法是this(参数列表),这个仅在类的构造方法中可以使用。
* 函数参数或者函数中的局部变量和成员变量同名的情况下，成员变量被屏蔽，此时要访问成员变量则需要使用this.成员变量名的方法引用成员变量。
* 需要引用当前对象的时候，直接使用this(自身引用)

**super：** 用来父类引用、访问父类成员变量与方法。调用父类构造方法

> super可以理解为是指向离自己最近的父类对象的一个指针。

super有三种用法：

1. 普通的直接引用：与this类似，super相当于是指向当前对象的父类，这样就可以直接使用super.XXX来引用父类成员
2. 子类中的成员变量或方法与父类中的成员变量或方法名相同时，为了区别调用父类的成员必须要加上super
3. 调用父类的构造函数

### Files的常用方法有那些？

Files.exists()：检测文件路径是否存在。

Files.createFile()：创建文件

Files.createDirectory()：创建文件夹

Files.delete()：删除一个文件夹或者目录

Files.copy()：复制文件

Files.move()：移动文件

Files.size()：查看文件个数

Files.read()：读取文件

Files.write()：写入文件

### Java的四种引用

> 四种引用的目的是为了避免对象长期占用内存

**强引用：**

* `StringReference GC`时不回收
* 当内存空间不足，Java虚拟机宁愿抛出`OutOfMemoryError`错误，使程序异常终止，也不会随意回收具有强引用的对象来解决内存不足的问题。

**软引用：**

* `SoftReference GC` 时如果JVM内存不足时会回收
* 软引用可以用来实现内存敏感的高速缓存。软引用可以和一个引用队列(`ReferenceQueue`)联合使用，如果软引用所引用的对象被垃圾回收，Java虚拟机就会把这个软引用加入到与之关联的引用队列中。

**弱引用：**

* `WeakReference GC`时立刻回收
* 弱引用与软引用的区别在于：只具有弱引用的对象拥有更短暂的生命周期。
* 弱引用可以和一个引用队列(`ReferenceQueue`)联合使用，如果弱引用所引用的对象被垃圾回收，Java虚拟机就会把这个弱引用加入到与之联合的引用队列中。

**虚引用：**

* `PhantomReference`
* 如果一个对象仅持有虚引用，那么它就和没有任何引用一样，在任何时候都可能被垃圾回收。 虚引用主要用来跟踪对象被垃圾回收的活动。虚引用与软引用和弱引用的一个区别在于：虚引用必须和引用队列（`ReferenceQueue`)联合使用。当垃圾回收器准备回收一个对象时，如果发现它还有虚引用，就会在回收对象的内存之前，把这个虚引用加入到与之关联的引用队列中。程序可以通过判断引用队列中是否已经加入了虚引用，来了解被引用的对象是否将要被垃圾回收。程序如果发现某个虚引用已经被加入到引用队列，那么就可以在所引用的对象的内存被回收之前采取必要的行动。
* 在Java集合中有一种特殊的Map类型：WeakHashMap， 在这种Map中存放了键对象的弱引用，当一个键对象被垃圾回收，那么相应的值对象的引用会从Map中删除。WeakHashMap能够节约存储空间，可用来缓存那些非必须存在的数据。

### 反射

反射机制是在`运行状态中`，对于任意一个类，`都能够知道这个类的所有属性和方法`；对于任意一个对象，都能够调用它的任意一个属性和方法；这种动态获取的信息以及动态调用对象任意方法的功能称为Java语言的反射机制。

获取Class对象的方法：

* 通过`Class.forName()`传入类的全路径获取
* 通过对象实例`instance.getClass()`获取
* 通过类加载器`ClassLoader.loadClass()`根据类的全路径获取
* 通过具体的实例对象获取

`Class.forName()`和`ClassLoader.loadClass()`的区别：

* 初始化不同：

  1. `Class.forName()`会对类初始化，而`loadClass()`只会装载或链接。
  2. `forName()`在类加载的时候会执行静态代码块，`loadclass`只有在调用`newInstance`方法的时候才会执行静态代码块。
* 类加载器不同：

  1. `Class.forName()`方法只有一个参数，使用调用者的类加载器来加载，也就是用加载了调用`forName`方法的代码的那个类加载器
  2. `ClassLoader.loadClass()`方法是一个实例方法(非静态方法)，调用时需要自己指定类加载器


### finalize、finalization和finally

**finalize用途：**

​			垃圾回收机制(garbage colector)决定回收某一个对象时，就会运行改对象的finalize()方法，但是在Java中如果内存总是充足的，那么垃圾回收可能永远不会进行，也就是说filalize()可能永远不会被执行。那么finzlize()究竟是做什么的呢？它最主要的用途是回收特殊渠道申请的内存。Java程序有垃圾回收器，所以一般情况下内存问题不用程序员操心，但是有一种JNI(Java Native Interface)调用non-Java程序(C或C++)，finalize()的工作就是回收这部分内存。

**finally用途：**

​			finally一定会被执行，如果finally里面有return语句，则覆盖try/cath里面的return，比较爱考的是finally里面没有return语句，这时虽然finally里面对return的值进行了修改，但是return的值并不会改变这种情况。

**finally代码块和finalize()方法有什么区别？**

​			无论是否抛出异常，finally代码块都会执行，它主要是用来释放应用占用的资源。finalize()方法是Object类的一个protected方法，它是在对象被垃圾回收之前由Java虚拟机来调用的。、

### Java集合容器有哪些？

![img](https://img-blog.csdnimg.cn/20190727183756962.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM1NzcxMjY2,size_16,color_FFFFFF,t_70)

> list 元素是有序的，可重复的；set元素是无序的，不可重复的。

### List、Set、Map之间的区别是什么？

List、Set、Map的主要区别体现在：元素是否有序、是否允许重复。

1. List集合中对象按照索引位置进行排序，可以有重复对象，允许按照对象在集合中的索引位置检索对象，例如通过list.git(i)方法来获取集合中的元素；
2. Map中每一个元素包含一个键和一个值，成对出现，键对象不可重复，值对象可以重复。
3. Set集合中的对象不按照特定的方法进行排序，并且没有重复对象，但它的实现类能对集合中的对象按照特定的方法排序，例如Tree Set类，可以按照默认顺序，也可以通过实现Java.util.Comparator< Type >接口来自定义排序方式。 

### HashMap和Hashtable有什么区别？

存储：HashMap允许一个key和多个不同的key对应的value为null，而hashtable不允许key或者value为空。

线程安全：Hashtable是线程安全的，而HashMap是非线程安全的。

推荐使用：在Hashtable的类注释可以看到，Hashtable是保留类不建议使用，推荐在单线程环境下使用HashMap替代，如果需要多线程使用则用ConcurrentHashMap

### 如何决定使用HashMap还是TreeMap

对于在Map中插入、删除、定位一个元素这类操作，HashMap是最好的选择，因为相对而言HashMap的插入会更快，但是如果对一个key集合进行有序遍历，那么TreeMap是更好的选择。

### 说一下HashMap的实现原理

HashMap基于Hash算法实现的，我们通过put(key，value)存储，get(key)来获取。当传入key时，hashMap会根据key.hashCode()计算出hash值，根据hash值将value保存在bucket里。当计算出hash值相同时，我们称之为hash冲突，hashMap的做法是用链表和红黑树存储相同hash值的value。当hash冲突的个数比较少时，使用链表否则使用红黑树。

### 说一下HashSet实现原理

HashSet是基于HashMap实现的，HashSet底层使用HashMap来保存所有元素，因此HashSet的实现比较简单，相关HashSet的操作，基本上都是直接调用底层HashMap的相关方法来完成，HashSet不允许重复的值。

### ArrayList和LinkedList的区别是什么

数据解构实现：ArrayList是动态数组的数据结构实现，而Linked List是双链表的数据结构实现。

数据访问效率：Array List比LinkedList在随机访问时效率高，因为linkedList是线性的数据存储，所以需要移动指针从前向后以此查找。

增加和删除效率：在非首尾的增加和删除操作，LinkedList要比ArrayList效率高，因为ArrayList增删操作要影响数组内其他数据的下标。

综合来说：在需要频繁读取集合元素时，更推荐使用ArrayList，而在频繁插入和删除更推荐LinkedList。

### 如何实现数组和LIst之间的转换

数组转List：使用Arrays.asList(array)进行转换

List转数组：使用List自带的toArray()方法

### ArrayList和Vector的区别是什么？

线程安全：Vector使用Synchronized来实现线程同步，是线程安全的，而ArrayList是非线程安全的。

性能：ArrayList在性能方面要优于Vector

扩容：ArrayList和Vector都会根据实际的需要动态调整容量，只不过在Vector扩容每次只会增加1倍而ArrayList只会增加50%

### Array和ArrayList有何区别？

Array可以存储基本数据类型和对象，ArrayList只能存储对象

Array是指定固定大小的，而ArrayList大小是自动扩展的。

Array内置方法没有ArrayList多，比如addAll、removerAll、iteration等方法只有ArrayList有

### Collection和Collections有什么区别？

Collection是一个集合接口，它提供了对集合对象进行基本操作的通用接口方法，所以集合都是它的子类，比如List、set等

Collections是一个包装类，它提供了很多静态方法，不能被实例化就像一个工具类，比如提供的排序方法：Collections.sort(list)。

### 在Queue中poll()和remove()有什么区别？

相同点：都是返回第一个元素，并在队列中删除返回对象/

不同点：如果没有元素poll()会返回null，而remove()会直接抛出NoSuchElementException异常

### 哪些集合是线程安全的

Vector、Hashtable、Stack都是线程安全的，而像HashMap则是非线程安全的，不过JDK1.5之后随着java.utill.concurrent并发包的出现，他们也有了自己对应的线程安全类，比如HashMap对应的线程安全类就是ConcurrentHashMap。

### 迭代器Iterator是什么？

Iterator接口提供遍历任何Collention的接口。我们可以从一个Collection中使用迭代器的方法来获取迭代器实例。迭代器取代了Java集合框架中的Enumeration，迭代器允许调用者在迭代过程中移除元素。

### Iterator怎么使用？有什么特点？

**使用：**

```java
List list = new ArrayList<>();
Iterator it =list.iterator();
while(it.hasNext()){
    String obj=it.next();
    System.out.println(obj);
}
```

Iterator的特点是更加安全，因为它可以保证，在当前遍历的集合元素被改变的时候，就会抛出ConcurrentModificationException异常。

### Iterator和ListIterator有什么区别？

Iterator可以遍历Set和List，而ListIterator只能遍历List

Iterator只能单向遍历，而ListIterator可以双向遍历(向前/向后)

ListIterator从Iterator接口继承，然后添加了一些额外的功能，比如添加一个元素，替换一个元素、获取前面或者后面元素的索引位置。

### 怎么确保一个集合不能被修改？

可以使用Collections.unmodifiableCollection(Collection c) 方法来创建一个只读的集合，这样改变集合的任何操作对会抛出Java.lang.UnsupportedOperationException异常

```java
//示例代码如下；
List list=new ArrayList<>();
list.add("X");
Collection clist=Collections.unmodifableCollection(list);
clist.add("y");//允许时报错
System.out.println(l)
```



### Java泛型是如何工作的？什么是类型擦除？

泛型是通过类型擦除来实现的，编译器在编译时擦除了所以类型相关的学习，所以在运行时内存在任何类型相关的信息。例如List<String>在运行时仅用一个List来表示。这样做的目的，是确保和Java5之前的版本开发二进制类库进行兼容。你无法在运行是访问到类型参数，因为编译器已经把泛型类型转换为原始类型。

### 什么是泛型中限定的通配符和非限定的通配符？

限定通配符对类型进行了限制。有两种限定通配符，一种是`<? extends T>`它通过确保类型必须是T的子类来设定类型的上界，另一种是`<? super T>`它通过确保类型必须是T的父类来设定类型的下界。泛型类型必须用限定内的类型来进行初始化，否则会导致编译错误。另一方面`<?>`表示了非限定通配符，因为`<？>`可以用来代替任意类型。

### List<? extends T> 和List<? super T>之间有什么区别？

这两个List的声明都是限定通配符的例子，List<? extends T >可以接受任何继承自T的类型的List，而List<? super T>可以接受任何T的父类构成的List。例如List<? extends Number>可以接受List<Integer>或List<Float>

### 可以将List<String> 传递给一个接受List<Object>参数的方法吗？

不可以，应为List<Object>可以存储任何类型的对象包括Strng、Integer等等，而List<String>只能用来存储String。

### Array中可以接受泛型吗？

Array事实上并不支持泛型。

### JDK序列化

> 序列化（Serizalizable）：将实现了Serializable接口的对象转换成一个字节数字，并可以将改字节数组转换为原来的对象。

ObjectOutPutStream是专门用来输出对象的输出流

ObjectOutPutStream将Java对象写入OutputStream。可以使用ObjectInputStream读取对象。

### serialVersionUID

Java的序列化机制是通过在运行时判断类的serialVersionUID来验证版本一致性的。在进行反序列化时，JVM会把传来的字节流中的serialVersionUID与本地相应实体类的seralVersionUID进行比较，如果相同就会认为是一致的，可以进行反序列化，否则就会出现序列化版本不一致的异常(InvalidCastExeption)。

如果没有添加serialVersionUID，进行了序列化，而在反序列化的时候，修改了类的解构(添加或删除成员变量，修改成员变量的命名)此时会报错。

如果添加serialVersionUID，进行了序列化，而在反序列化的时候，修改了类的解构(添加或删除了成员变量，修改成员变量的命名)那么可以会恢复部分数据，或者恢复不了数据。

如果设置了serialVersionUID并且一致，那么就会反序列化部分数据；如果没有设置，那么只要属性不同，那么无法反序列化。

### 对象深拷贝与浅拷贝

当拷贝一个变量时，原始引用和拷贝的引用会指向同一个对象，改变其中一个对象，会对另一个对象产生影响。如果需要创建一个对象的浅拷贝，那么需要调用clone方法。

> Object 类本身是不实现接口Cloneable，直接调用clone会抛出异常。
>
> 如果要在自己定义的类中调用clone方法，必须实现Cloneable接口(标记型接口)，因为Object类中的clone方法为protected，所以需要自己重写clone方法，设置为public

**例如：**

```java
public class Person implements Cloneable {
    private int age;
    private String  name;
    private Company company;
    @Override
    public Person clone() throws CloneNotSupportedException {
        return (Person) super.clone();
    }
}
```

使用super(即Object)的clone方法只能进行浅拷贝。

> 如果想实现深拷贝，需要修改为：

```java
@Override
public Person clone() throws CloneNotSupportedException {
    Person person = (Person) super.clone();
    person.setCompany(company.clone()); // 一个新的Company
    return person;
}
```

假如Company中还有其他对象的引用，那么Company中也要像Person这样做。

可以说：想要深拷贝一个子类，那么它的所有父类都必须可以实现深拷贝。

> 另一种实现深拷贝的方法是通过序列化实现。

```java
@Override
protected Object clone()  {
try {
   ByteArrayOutputStream baos = new ByteArrayOutputStream();
   ObjectOutputStream os = new ObjectOutputStream(baos);
   os.writeObject(this);
   os.close();
   ByteArrayInputStream bais = new ByteArrayInputStream(baos.toByteArray());
   ObjectInputStream in = new ObjectInputStream(bais);
   Object ret = in.readObject();
   in.close();
   return ret;
}catch(Exception e) {
   e.printStackTrace();
}
	return null;
}
```

### Error和Exception

Error是程序无法处理的错误，它是由JVM产生和抛出的，比如OutOfMenoryError、ThreadDeath等。这些异常发生时Java虚拟机一般会选择线程终止。

Exception是程序本身出现可以处理的异常，这种异常分两大类运行时异常和非运行时异常。程序中应该尽可能处理这些异常。

### 常见的RuntimeException

* lllegalArgumentException：方法的参数无效
* NullPointerException：试图访问一空对象的变量、方法或空数组的元素
* ArrayIndexOUtOfBoundsException：数组越界访问
* ClassCastException：类型转换异常
* NumberFormatException继承lllegalArgumentException：字符串转换为数字时出现

### RuntimeException与非RuntimeException

* RuntimeException是运行时异常，也称为非检查异常
* 非RuntimeException也称CheckedException受检异常
* 前者可以不必进行try-catch，后者必须进行try-catch或throw

### 

