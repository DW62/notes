# TypeScript

## 什么是TypeScript

> Typescript 是 Javascript 的超集。TS代码不能直接执行需要先编译成JS才可以执行

TypeScript为JavaScript增加类型能力，主要为了避免JS弱类型下产生的各种有意无意的问题。或者说，TS是用来限制JS的编写。

**TypeScript最大的特点是有类型的概念**

## TypeScript开发环境搭建

1. 安装Node.js      [Node.js 中文网 (nodejs.cn)](http://nodejs.cn/download/)

2. 使用npm全局安装typescript。输入命令` npm i -g typescript`

   安装完成后输入`tsc`进行测试看是否安装完成

## TypeScript类型声明

* 在变量上声明类型

```typescript
let 变量名:  变量类型
let 变量名:  变量类型=变量值
//在TS文件中，如果声明变量时直接给变量赋值，则变量的类型可以不用自己声明，会自动识别。即如下所示
let 变量名=变量值
```

* 在函数的参数和返回值上声明类型

```typescript
function sum(参数名1:参数1的类型,  参数名2: 参数2的类型): 函数返回值类型(没有返回值可以不写){
    return  返回值;
}
```

## TypeScript类型

> TypeScript和JavaScript没有整数类型。

### number类型

number类型可以是任意的数字。

### String类型

Sting类型可以是任意字符串

### boolean类型

boolean类型的值只能是`true`或者`false`

### 字面量类型

如果给变量赋值字面量类型，则变量的值只能是字面量的值

```typescript
//字面量类型示例
let a:10;  //这里的10就表示字面量，当a为字面量类型时，a的值只能是10
let a:"hello";  //这里的hello就表示字面量，当a为字面量类型时，a的值只能是hello
```

### any 任意类型

> any 表示任意的类型。一个变量设置为any类型相当于对改变量关闭TS的类型检查。开发时不建议使用   any类型的变量可以赋值给其他类型的变量

```typescript
//any类型说明
//显示any
let a: any;

//隐式any
let a;	//即不不给变量声明类型，会自动判断为any类型
```

### unknown 未知类型

> 当不明确变量的类型的时候，可以给变量声明`unknown`类型，并且被声明为`unknown`类型的变量值可以是任意类型，且不能在赋值给其他类型的变量，当然可以先对`unknown`类型的变量做类型检查如何在赋值给其他类型

```typescript
let a:unknown="aaa";
let s:string;
//将unknown类型的变量赋值给其他类型
if(typeof a==="string"){
    s=a;
}

//或者直接使用类型断言来赋值(类型断言实际上就是自己告诉编译器类型)
s=a as string;  //即告诉编译器a是string类型，然后将a赋值给s
//类型断言方式2
s=<string>a
```

### void类型

通过用来给函数设置void类型的返回值，函数返回值设置void类型也可以返回`null`

**Null 和 Undefined**

null:

* 在 JavaScript 中 null 表示 "什么都没有"。

* null是一个只有一个值的特殊类型。表示一个空对象引用。

* 用 typeof 检测 null 返回是 object。

undefined

* 在 JavaScript 中, undefined 是一个没有设置值的变量。

* typeof 一个没有值的变量会返回 undefined。

**Null 和 Undefined 是其他任何类型（包括 void）的子类型，可以赋值给其它类型**，如数字类型，此时，赋值后的类型会变成 null 或 undefined。而在TypeScript中启用严格的空校验（--strictNullChecks）特性，就可以使得null 和 undefined 只能被赋值给 void 或本身对应的类型，示例代码如下：

```typescript
// 启用 --strictNullChecks
let x: number;
x = 1; // 编译正确
x = undefined;    // 编译错误
x = null;    // 编译错误
```

上面的例子中变量 x 只能是数字类型。如果一个类型可能出现 null 或 undefined， 可以用` |` 来支持多种类型，示例代码如下：

```typescript
// 启用 --strictNullChecks
let x: number | null | undefined;
x = 1; // 编译正确
x = undefined;    // 编译正确
x = null;    // 编译正确
```

### never 没有值类型

通常用在方法抛出异常时设置的返回值类型

**never 是其它类型（包括 null 和 undefined）的子类型，代表从不会出现的值**。这意味着声明为 never 类型的变量只能被 never 类型所赋值，在函数中它通常表现为抛出异常或无法执行到终止点（例如无限循环），示例代码如下：

```typescript
let x: never;
let y: number;

// 编译错误，数字类型不能转为 never 类型
x = 123;

// 运行正确，never 类型可以赋值给 never类型
x = (()=>{ throw new Error('exception')})();

// 运行正确，never 类型可以赋值给 数字类型
y = (()=>{ throw new Error('exception')})();

// 返回值为 never 的函数可以是抛出异常的情况
function error(message: string): never {
    throw new Error(message);
}

// 返回值为 never 的函数可以是无法被执行到的终止点的情况
function loop(): never {
    while (true) {}
}
```

### object类型

**实例：**

* 语法1：` let 变量名：{属性名：属性类型，属性名：属性类型，....}`

```typescript
let a: {name: string}  ;
//给a赋值
a={name:"张三"} ;//可以成功赋值

a={name:"张三", age:18}; //因为没有声明age所以会报错

a={age:18};//a里面必须包含name，并且a里面不能有age
```

> 这种声明对象类型变量，变量里面必须包含声明的属性和类型，不能有未定义的。

* 语法2：`let 变量名：{属性名：属性类型，属性名？：属性类型，...}`，在属性名后面添加`?`则改属性可以有也可以没有

```typescript
let a: {name: string ,age?: number}  ;
//给a赋值
a={name:"张三", age:18};//可以成功赋值
a={name:"张三"};//可以成功赋值

a={name:"张三", age:18 ,address:"地球"};//没有定义address所以不能成功赋值

a={age:18};//必须要有name所以不能成功赋值
```

* 语法3：`let 变量名：{属性名：属性类型，[属性名：属性类型]：any}`  其中`[属性名：属性类型]：any`表示可以有任意类型的变量任意个，要可以没有

```typescript
let a={name: string, [propname: string]: any}
//给a赋值
a={name: "张三", age:18};//可以成功赋值
a={name:"张三"}；//可以成功赋值
a={name: "张三", age:18, address:"地球"};//可以成功赋值
```

* 语法4：定义函数形式的使用`let 变量名=（形参：类型，形参：类型，..）=>返回值类型`

```typescript
let a: (a:number, b:number)=>number
a=function (n1,n2):number{
    return 1;
}
```

### array 数组类型

**数组类型定义：**

* let 变量名：数组数据类型[];
* let 变量名：Array<数组数据类型>

### 元组类型

> 元组实际上就是固定长度的数组   

语法：`let 变量名：[类型，类型]`

元组类型数据，数据长度必须和定义的一样不能多，也不能少，并且元组类型数据`[ ]`中的类型可以是多种不同的，也可以是相同类型。

### enum 枚举类型

**枚举的定义：**

```typescript
enum 枚举类的名字{
    枚举元素1=枚举元素1的值，
    枚举元素2=枚举元素2的值，
}
```

**枚举的应用：**

```typescript
//定义枚举
enum Gender{
    Male=0,
    Female=1
}
//应该枚举
let i：{name：string, gender: Gender}
i={
    name:"张三",
    gender: Gender.Male
}
```

### `|`和`&`的使用

**`|`:**  可以用了连接类型，表示或的意思。即满足其中一个类型即可。

**`&`:**  通常的用法.	`let 变量名：{属性名：类型} & {属性名：类型}`例如` let i: {name: string} & {age: number}`表示`变量 i 必须具备string类型的number属性同时还要有number类型的age 属性`

### 类型别名(自定义类型)

**语法：** 可以通过`type`关键字来给类型添加别名或者自定义一个类型

```typescript
//自定义一个类型
type myType=1|2|3;

//定义变量并且给变量赋予自定义的类型
let i: myTYpe  //此时i的类型实际上为  1|2|3  
```

## 编译选项

由于TS文件不能直接允许需要先转换为JS才能执行，所以每次修改完TS文件都需要进行从新编译。

**编译方式：**

1. 手动编译单个TS文件 **命令：`tsc 文件名.ts`**

2. 自动检测一个TS，每当文件方式变化都会自动进行编译。**命令：`tsc 文件名.ts -w`**

3. 自动检测所有文件，自动编译
   1. 在项目根目录下先创建一个`tsconfig.json`文件，文件内容为空也可以自动编译。
   2. 使用`tsc -w`命令检测根目录下所有文件，当文件发生改变就会自动进行编译。

**tsconfig.json文件配置选项：**

1. **`"include": [ ]`**:在括号中配置**要进行编译的**文件相对于`tsconfig.json`文件的路径。支持模糊匹配  **默认值是根目录下所以值**
2. **`"exclude":[ ]`**:在括号中配置**不进行编译的**文件相对于`tsconfig.json`文件的路径。支持模糊匹配  默认值是`["node_modules", "bower_components", "jspm_packages"]`
3. **`"extends" : ""`** :定义被继承的配置文件路径(可以用来引入其他配置文件)
4. **`"files: [ ]"`**: 在括号中直接添加要进行编译的文件名(文件名包含后缀)
5. **`"compilerOptions":{ }`** 包含多个子配置项
   1. `"target": "要变成的ES版名"`：用来指定ts被编译成的ES版本
   2. `"module": " "`：用来指定要使用的模块化规范
   3. `"lib": [ ]`：用来指定项目中要使用的库，一般情况不使用改配置，让其为默认值
   4. `"outDir": " "`：用来指定编译后的JS文件存放目录
   5. `"outFile":" "`：用来设置将编译后的js代码合并到那个目录下的那个文件
   6. `"allowJs": false`：用来设置是否将JS文件进行编译，默认为fasle不编译
   7. `"checkJs": fales`：用来设置是否检测js代码是否符合语法规范
   8. `"removeComments":false`：设置是否移除编译后js文件的注释
   9. `"noEmit"：true`：设置是否生成编译后的文件
   10. `"noEmitOnError": true`：设置当出现错误时不生成编译后的文件
   11. `"alwaysStrict": false`：设置编译后的文件是否使用严格语法检查模式
   12. `"noImplicitAny": true`：设置不允许使用隐式any类型
   13. `"noImplicitThis": true`：设置不允许不明确的this存在
   13. `"strictNullChecks": true`：设置严格的检查空值
   13. `"strict": false`：设置所有严格检查的总开关



