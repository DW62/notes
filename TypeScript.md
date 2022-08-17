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

## TypeScript 创建类

**定义类：**

```typescript
class 类名 {
    属性名：类型；
    //静态属性只属于类，不属于类实例化的对象
    static 属性名: 类型;
	//只读属性
	readonly  属性名：类型;

	//构造函数
	constructor(参数：类型){
        this.属性名=参数;
    }
	
	//方法
	方法名(){
        .....
    }
}
```

同时也可以直接将属性定义在构造函数中：

```typescript
class C {
    constructor(public name: string, public age: number) {
    }
}
```

> 在TS中只能有一个构造函数

**类的继承：** 通过使用`extends` 关键字来实现类的继承

> 类的继承和Java相似，但是在TS中自恋继承父类时，如果子类有构造方法则，必须在子类构造方法中调用父类的构造方法。使用`super`关键字来调用父类东西。

**抽象类**:

在TS中抽象类是不能被实例化对象的，所以当不希望类被实例化时，可以通过使用关键字`abstract` 在定义的类前面使类变成抽象类，从而限制该类不能实例化。

使用abstract开头的方法叫做抽象方法，抽象方法没有方法体只能定义在抽象类中，继承抽象类时抽象方法必须要实现;

**接口：** TS接口使用和Java中类似，通过使用`interface`关键字定义，使用`implements`关键字来实现接口

> 接口只在TS文件中存在，编译后的JS文件不存在

**属性的封装：**

对象实质上就是属性和方法的容器，它的主要作用就是存储属性和方法，这就是所谓的封装

默认情况下，对象的属性是可以任意的修改的，为了确保数据的安全性，在TS中可以对属性的权限进行设置

- 静态属性（static）：
  - 声明为static的属性或方法不再属于实例，而是属于类的属性；
- 只读属性（readonly）：
  - 如果在声明属性时添加一个readonly，则属性便成了只读属性无法修改
- TS中属性具有三种修饰符：
  - public（默认值），可以在类、子类和对象中修改
  - protected ，可以在类、子类中修改
  - private ，可以在类中修改

对于一些不希望被任意修改的属性，可以将其设置为private，直接将其设置为private将导致无法再通过对象修改其中的属性，我们可以在类中定义一组读取、设置属性的方法，这种对属性读取或设置的属性被称为属性的存取器

读取属性的方法叫做setter方法，设置属性的方法叫做getter方法

示例：

```typescript
class Person{
    private _name: string;

    constructor(name: string){
        this._name = name;
    }

    get name(){
        return this._name;
    }

    set name(name: string){
        this._name = name;
    }

}

const p1 = new Person('孙悟空');
// 实际通过调用getter方法读取name属性
console.log(p1.name);
// 实际通过调用setter方法修改name属性 
p1.name = '猪八戒'; 
```

## 泛型（Generic）

定义一个函数或类时，有些情况下无法确定其中要使用的具体类型（返回值、参数、属性的类型不能确定）；

此时泛型便能够发挥作用；

举个例子：

```typescript
function test(arg: any): any{
    return arg;
}
```

上例中，test函数有一个参数类型不确定，但是能确定的时其返回值的类型和参数的类型是相同的；

由于类型不确定所以参数和返回值均使用了any，但是很明显这样做是不合适的：

首先使用any会关闭TS的类型检查，其次这样设置也不能体现出参数和返回值是相同的类型；

### 泛型函数

#### 创建泛型函数

```typescript
function test<T>(arg: T): T{
    return arg;
}
```

这里的`<T>`就是泛型；

T是我们给这个类型起的名字（不一定非叫T），设置泛型后即可在函数中使用T来表示该类型；

所以泛型其实很好理解，就表示某个类型；

那么如何使用上边的函数呢？

#### 使用泛型函数

##### 方式一（直接使用）：

```typescript
test(10)
```

使用时可以直接传递参数使用，类型会由TS自动推断出来，但有时编译器无法自动推断时还需要使用下面的方式

##### 方式二（指定类型）：

```typescript
test<number>(10)
```

也可以在函数后手动指定泛型；

#### 函数中声明多个泛型

可以同时指定多个泛型，泛型间使用逗号隔开：

```typescript
function test<T, K>(a: T, b: K): K{
  return b;
}

test<number, string>(10, "hello");
```

使用泛型时，完全可以将泛型当成是一个普通的类去使用；

### 泛型类

类中同样可以使用泛型：

```typescript
class MyClass<T>{
  prop: T;

  constructor(prop: T){
      this.prop = prop;
  }
}
```

### 泛型继承

除此之外，也可以对泛型的范围进行约束

```typescript
interface MyInter{
  length: number;
}

function test<T extends MyInter>(arg: T): number{
  return arg.length;
}
```

使用T extends MyInter表示泛型T必须是MyInter的子类，不一定非要使用接口类和抽象类同样适用；

## TypeScript打包

### webpack整合

通常情况下，实际开发中我们都需要使用构建工具对代码进行打包；

TS同样也可以结合构建工具一起使用，下边以webpack为例介绍一下如何结合构建工具使用TS；

步骤如下：

#### 初始化项目

进入项目根目录，执行命令 `npm init -y`，创建package.json文件

#### 下载构建工具

命令如下：

```bash
npm i -D webpack webpack-cli webpack-dev-server typescript ts-loader clean-webpack-plugin
```

共安装了7个包:

- webpack：构建工具webpack
- webpack-cli：webpack的命令行工具
- webpack-dev-server：webpack的开发服务器
- typescript：ts编译器
- ts-loader：ts加载器，用于在webpack中编译ts文件
- html-webpack-plugin：webpack中html插件，用来自动创建html文件
- clean-webpack-plugin：webpack中的清除插件，每次构建都会先清除目录

#### 配置webpack

根目录下创建webpack的配置文件`webpack.config.js`：

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
   optimization:{
       minimize: false // 关闭代码压缩，可选
   },

   entry: "./src/index.ts",

   devtool: "inline-source-map",

   devServer: {
       contentBase: './dist'
   },

   output: {
       path: path.resolve(__dirname, "dist"),
       filename: "bundle.js",
       environment: {
           arrowFunction: false // 关闭webpack的箭头函数，可选
       }
   },

   resolve: {
       extensions: [".ts", ".js"]
   },

   module: {
       rules: [
           {
               test: /\.ts$/,
               use: {
                   loader: "ts-loader"     
               },
               exclude: /node_modules/
           }
       ]
   },

   plugins: [
       new CleanWebpackPlugin(),
       new HtmlWebpackPlugin({
           title:'TS测试'
       }),
   ]
}
```

#### 配置TS编译选项

根目录下创建tsconfig.json，配置可以根据自己需要

```json
{
   "compilerOptions": {
       "target": "ES2015",
       "module": "ES2015",
       "strict": true
   }
}
```

#### 修改package.json配置

修改package.json添加如下配置

```json
{
   ...
   "scripts": {
       "test": "echo \"Error: no test specified\" && exit 1",
       "build": "webpack",
       "start": "webpack serve --open chrome.exe"
   },
   ...
}
```

#### 项目使用

在src下创建ts文件，并在并命令行执行`npm run build`对代码进行编译；

或者执行`npm start`来启动开发服务器；

### Babel

除了webpack，开发中还经常需要结合babel来对代码进行转换；

以使其可以兼容到更多的浏览器，在上述步骤的基础上，通过以下步骤再将babel引入到项目中；

> 虽然TS在编译时也支持代码转换，但是只支持简单的代码转换；
>
> 对于例如：Promise等ES6特性，TS无法直接转换，这时还要用到babel来做转换；

安装依赖包：

```bash
npm i -D @babel/core @babel/preset-env babel-loader core-js
```

共安装了4个包，分别是：

- @babel/core：babel的核心工具
- @babel/preset-env：babel的预定义环境
- @babel-loader：babel在webpack中的加载器
- core-js：core-js用来使老版本的浏览器支持新版ES语法

修改webpack.config.js配置文件

```js
...
module: {
    rules: [
        {
            test: /\.ts$/,
            use: [
                {
                    loader: "babel-loader",
                    options:{
                        presets: [
                            [
                                "@babel/preset-env",
                                {
                                    "targets":{
                                        "chrome": "58",
                                        "ie": "11"
                                    },
                                    "corejs":"3",
                                    "useBuiltIns": "usage"
                                }
                            ]
                        ]
                    }
                },
                {
                    loader: "ts-loader",

                }
            ],
            exclude: /node_modules/
        }
    ]
}
...
```

如此一来，使用ts编译后的文件将会再次被babel处理；

使得代码可以在大部分浏览器中直接使用；

同时可以在配置选项的targets中指定要兼容的浏览器版本；
