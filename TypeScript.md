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

### never 没有值类型

通常用在方法抛出异常时设置的返回值类型

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

**TS类型：**

| 数据类型   | 关键字    | 描述                                                         |
| :--------- | :-------- | :----------------------------------------------------------- |
| 任意类型   | any       | 声明为 any 的变量可以赋予任意类型的值。                      |
| 数字类型   | number    | 双精度 64 位浮点值。它可以用来表示整数和分数。               |
| 字符串类型 | string    | 一个字符系列，使用单引号（**'**）或双引号（**"**）来表示字符串类型。反引号（**`**）来定义多行文本和内嵌表达式。 |
| 布尔类型   | boolean   | 表示逻辑值：true 和 false。                                  |
| 数组类型   | 无        | 声明变量为数组。                                             |
| 元组       | 无        | 元组类型用来表示已知元素数量和类型的数组，各元素的类型不必相同，对应位置的类型需要相同。 |
| 枚举       | enum      | 枚举类型用于定义数值集合。                                   |
| void       | void      | 用于标识方法返回值的类型，表示该方法没有返回值。             |
| null       | null      | 表示对象值缺失。                                             |
| undefined  | undefined | 用于初始化变量为一个未定义的值                               |
| never      | never     | never 是其它类型（包括 null 和 undefined）的子类型，代表从不会出现的值。 |
| 字面量     | 本身      | ` let n:10` 这里的10就是字面量(可以是任意数字和字符串) 设置字面量类型，则变量的值就是字面量的值 |
| 未知类型   | unknown   | 在不清楚类型的时候使用。unknown类型的值不能赋值给其他类型。  |
|            |           |                                                              |

> TypeScript和JavaScript没有整数类型。

**Any 类型**

任意值是 TypeScript 针对编程时类型不明确的变量使用的一种数据类型，它常用于以下三种情况。

1. 变量的值会动态改变时，比如来自用户的输入，任意值类型可以让这些变量跳过编译阶段的类型检查，示例代码如下：

```typescript
let x: any = 1;    // 数字类型
x = 'I am who I am';    // 字符串类型
x = false;    // 布尔类型
```

2. 改写现有代码时，任意值允许在编译时可选择地包含或移除类型检查，示例代码如下：

```typescript
let x: any = 4;
x.ifItExists();    // 正确，ifItExists方法在运行时可能存在，但这里并不会检查
x.toFixed();    // 正确
```

3. 定义存储各种类型数据的数组时，示例代码如下：

```typescript
let arrayList: any[] = [1, false, 'fine'];
arrayList[1] = 100;
```

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

**never 类型**

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