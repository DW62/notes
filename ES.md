# ES

## ES介绍

ES全称EcmaScript，是脚本语言的规范，而平时经常编写的JavaScript是EcmaScript的一种实现，所以ES新特性其实指的是JavaScript的新特性。

## ES6

### let声明变量

```js
//声明单个变量
let a;
//声明多个变量
let a,b,c;
//声明变量的同时给变量赋值
let a=100, b=200;
```

> 注意（特点）：
>
> 		1. 使用let声明变量时，变量名不能重复。
> 		1. 使用let声明变量时，如果在代码块中声明，则变量的作用域只在代码块。但是不影响作用域链。
> 		1. 不允许在let声明变量前对变量进行使用

### const 定义常量

```js
//声明常量
const NAME='张三'
```

> 注意：
>
> 	1. 使用` const`声明变量，必须要直接赋值。
> 	1. 使用` const`声明变量为常量，值不能改变。
> 	1. 使用` const`声明变量也是块级作用域。
> 	1. 对于数组和对象的元素修改，不算对常量修改，不会报错。

### 解构赋值

> ES6允许按照一定模式从数组和对象中取值，对变量进行赋值，这被称为解构赋值。

**数组的解构**

```js
//声明数组
const Names=['张三', '李四' ,'王五']；

//进行解构
let ['name1', 'name2', 'name3'] =Names;

//进行输出
console.log(name1);         //输出结果    张三
console.log(name2);		//输出结果    李四
console.log(name3);		//输出结果    王五
```

**对象的解构**

```js
//定义对象
const user={
    name: '张三',
    age: '18',
    chifan: function(){
        console.log("我可以吃饭！")；
    }
}；

//进行解构
let {name, age, chifan}=user;

//输出解构的内容
onsole.log(name);         //输出结果    张三
console.log(age);		//输出结果    18
chifan();			//解构的方法可以直接调用
```

### 模板字符串

> ES6中可以直接使用 ``来声明字符串

```js
 //声明变量
  let str=`我是字符串！`;
   console.log(str,typeof str);

//进行字符串拼接
let name=`张三`;
let out=`我叫${name}`;
console.log(out);			//输出结果：我叫张三
```

> 特点：
>
> 	1. 可以直接出现换行符。
> 	1. 可以直接在``声明的字符串中使用${}，进行字符串拼接。

### 简化对象写法

> ES6允许如果对象的属性名和值名称一致，可以直接直接将值名写入对象来给对象赋值。

```js
//定义变量和方法
let name=`张三`;
let chifan=function(){
    consloe.log(`我可以吃饭！`);
}

//声明对象将变量和方法赋值给对象
const user={
    name,
    chifan,
}
```

### 箭头函数

```js
//之前声明函数
let fn=function(a,b){
    return a+b;
}

//使用箭头函数声明
let fn=(a,b) =>{
    return a+b;
}
//当形参只有一个的时候可以省略小括号
//当函数体只有一行时，可以省略花括号，省略花括号时return也必须省略
```

> 特点：
>
> 	1. 箭头函数this是静态的，始终指向函数声明时所在作用域下的this的值。
> 	1. 不能作为构造器实例化对象。
> 	1. 不能使用`arguments`变量。

**箭头函数适合与this无关的回调，定时器，数组的方法回调。不适合与this有关的回调，事件回调，对象方法。**

### 函数参数赋初始值

> ES6允许给函数参数赋初始值

```js
function add(a, b, c=10){
    return a+b+c;
}
let result=add(1,2);		//如果参数未传值默认使用初始值
```

**赋初始值的参数要放到后面**

### rest参数获取函数实参

```js
function fn(a,b,...args){
    console.log(a);
    console.log(b);
    console.log(args)
}
//调用方法
fn(1,2,3,4,5);

//输出结果
1
2
[3,4,5]
```

> 注意：
>
> 	1. rest参数为` ...args`
> 	1. rest参数输出结果为数组
> 	1. rest参数必须要放参数最后

### 扩展运算符`...`

**扩展运算符可以将数组转换为逗号分隔的参数系列**

```js
//声明一个数组
const users=['张三', '李四', '王五'];

//声明一个函数
function fn(){
    console.log(arguments);  //arguments也是获取函数参数
}

//直接将数组作为参数传入
fn(users);		//会输出一个数组
//使用扩展运算符扩展数组后传入方法
fn(...users);		// 等同于fn(张三', '李四', '王五'),会输出s
```

> 扩展运算符也可以进行数字克隆

### Symbol类型

ES6引入了一种新的原始数据类型Symbol，表示独一无二的值，他是JavaScript语言的第七种数据类型，是一种类似于字符串的数据类型。

**Symbol特点：**

1. Symbol的值是唯一的，用来解决命名冲突问题。可以用来创建相同名字的属性或者方法
2. Symbol值不能与其他数据类型进行运算。
3. Symbol定义的对象属性不能使用for..in循环遍历，但是可以使用Reflect.ownkeys来获取对象的所以键名。

```js
//创建Symbol
let s=Symbol();

let s1=Symbol(`张三`);
let s2=Symbol(`张三`)；
console.log(s1==s2);		//false

let s3=Symbol.for(`张三`);
let s4=Symbol.for(`张三`);
console.log(s3==s4);		//true
```

> JS  7种基本数据类型：
>
> USONB   U->undefined  S->string symbol  O->object  N->null  number  B->boolean

**Symbol内置属性：**

除了定义自己使用的 Symbol 值以外，ES6 还提供了 11 个内置的 Symbol 值，指向语言内部使用的方法。

#### Symbol.hasInstance

对象的`Symbol.hasInstance`属性，指向一个内部方法。当其他对象使用`instanceof`运算符，判断是否为该对象的实例时，会调用这个方法。比如，`foo instanceof Foo`在语言内部，实际调用的是`Foo[Symbol.hasInstance](foo)`。

```js
class  User {
  [Symbol.hasInstance](foo) {
    return foo instanceof Array;
  }
}
[1, 2, 3] instanceof new  User() // true
```

上面代码中，`User`是一个类，`new User()`会返回一个实例。该实例的`Symbol.hasInstance`方法，会在进行`instanceof`运算时自动调用，判断左侧的运算子是否为`Array`的实例。

下面是另一个例子。

```js
class Even {
  static [Symbol.hasInstance](obj) {
    return Number(obj) % 2 === 0;
  }
}
// 等同于
const Even = {
  [Symbol.hasInstance](obj) {
    return Number(obj) % 2 === 0;
  }
};
1 instanceof Even // false
2 instanceof Even // true
12345 instanceof Even // false
```

#### Symbol.isConcatSpreadable

对象的`Symbol.isConcatSpreadable`属性等于一个布尔值，表示该对象用于`Array.prototype.concat()`时，是否可以展开。

```js
let arr1 = ['c', 'd'];
['a', 'b'].concat(arr1, 'e') // ['a', 'b', 'c', 'd', 'e']
arr1[Symbol.isConcatSpreadable] // undefined
let arr2 = ['c', 'd'];
arr2[Symbol.isConcatSpreadable] = false;
['a', 'b'].concat(arr2, 'e') // ['a', 'b', ['c','d'], 'e']
```

上面代码说明，数组的默认行为是可以展开，`Symbol.isConcatSpreadable`默认等于`undefined`。该属性等于`true`时，也有展开的效果。

类似数组的对象正好相反，默认不展开。它的`Symbol.isConcatSpreadable`属性设为`true`，才可以展开。

```js
let obj = {length: 2, 0: 'c', 1: 'd'};
['a', 'b'].concat(obj, 'e') // ['a', 'b', obj, 'e']
obj[Symbol.isConcatSpreadable] = true;
['a', 'b'].concat(obj, 'e') // ['a', 'b', 'c', 'd', 'e']
```

`Symbol.isConcatSpreadable`属性也可以定义在类里面。

```js
class A1 extends Array {
  constructor(args) {
    super(args);
    this[Symbol.isConcatSpreadable] = true;
  }
}
class A2 extends Array {
  constructor(args) {
    super(args);
  }
  get [Symbol.isConcatSpreadable] () {
    return false;
  }
}
let a1 = new A1();
a1[0] = 3;
a1[1] = 4;
let a2 = new A2();
a2[0] = 5;
a2[1] = 6;
[1, 2].concat(a1).concat(a2)
// [1, 2, 3, 4, [5, 6]]
```

上面代码中，类`A1`是可展开的，类`A2`是不可展开的，所以使用`concat`时有不一样的结果。

注意，`Symbol.isConcatSpreadable`的位置差异，`A1`是定义在实例上，`A2`是定义在类本身，效果相同。

#### Symbol.species

对象的`Symbol.species`属性，指向一个构造函数。创建衍生对象时，会使用该属性。

```js
class MyArray extends Array {
}
const a = new MyArray(1, 2, 3);
const b = a.map(x => x);
const c = a.filter(x => x > 1);
b instanceof MyArray // true
c instanceof MyArray // true
```

上面代码中，子类`MyArray`继承了父类`Array`，`a`是`MyArray`的实例，`b`和`c`是`a`的衍生对象。你可能会认为，`b`和`c`都是调用数组方法生成的，所以应该是数组（`Array`的实例），但实际上它们也是`MyArray`的实例。

`Symbol.species`属性就是为了解决这个问题而提供的。现在，我们可以为`MyArray`设置`Symbol.species`属性。

```js
class MyArray extends Array {
  static get [Symbol.species]() { return Array; }
}
```

上面代码中，由于定义了`Symbol.species`属性，创建衍生对象时就会使用这个属性返回的函数，作为构造函数。这个例子也说明，定义`Symbol.species`属性要采用`get`取值器。默认的`Symbol.species`属性等同于下面的写法。

```js
static get [Symbol.species]() {
  return this;
}
```

现在，再来看前面的例子。

```js
class MyArray extends Array {
  static get [Symbol.species]() { return Array; }
}
const a = new MyArray();
const b = a.map(x => x);
b instanceof MyArray // false
b instanceof Array // true
```

上面代码中，`a.map(x => x)`生成的衍生对象，就不是`MyArray`的实例，而直接就是`Array`的实例。

再看一个例子。

```js
class T1 extends Promise {
}
class T2 extends Promise {
  static get [Symbol.species]() {
    return Promise;
  }
}
new T1(r => r()).then(v => v) instanceof T1 // true
new T2(r => r()).then(v => v) instanceof T2 // false
```

上面代码中，`T2`定义了`Symbol.species`属性，`T1`没有。结果就导致了创建衍生对象时（`then`方法），`T1`调用的是自身的构造方法，而`T2`调用的是`Promise`的构造方法。

总之，`Symbol.species`的作用在于，实例对象在运行过程中，需要再次调用自身的构造函数时，会调用该属性指定的构造函数。它主要的用途是，有些类库是在基类的基础上修改的，那么子类使用继承的方法时，作者可能希望返回基类的实例，而不是子类的实例。

#### Symbol.match

对象的`Symbol.match`属性，指向一个函数。当执行`str.match(myObject)`时，如果该属性存在，会调用它，返回该方法的返回值。

```js
String.prototype.match(regexp)
// 等同于
regexp[Symbol.match](this)
class MyMatcher {
  [Symbol.match](string) {
    return 'hello world'.indexOf(string);
  }
}
'e'.match(new MyMatcher()) // 1
```

#### Symbol.replace

对象的`Symbol.replace`属性，指向一个方法，当该对象被`String.prototype.replace`方法调用时，会返回该方法的返回值。

```js
String.prototype.replace(searchValue, replaceValue)
// 等同于
searchValue[Symbol.replace](this, replaceValue)
```

下面是一个例子。

```js
const x = {};
x[Symbol.replace] = (...s) => console.log(s);
'Hello'.replace(x, 'World') // ["Hello", "World"]
```

`Symbol.replace`方法会收到两个参数，第一个参数是`replace`方法正在作用的对象，上面例子是`Hello`，第二个参数是替换后的值，上面例子是`World`。

#### Symbol.search

对象的`Symbol.search`属性，指向一个方法，当该对象被`String.prototype.search`方法调用时，会返回该方法的返回值。

```js
String.prototype.search(regexp)
// 等同于
regexp[Symbol.search](this)
class MySearch {
  constructor(value) {
    this.value = value;
  }
  [Symbol.search](string) {
    return string.indexOf(this.value);
  }
}
'foobar'.search(new MySearch('foo')) // 0
```

#### Symbol.split

对象的`Symbol.split`属性，指向一个方法，当该对象被`String.prototype.split`方法调用时，会返回该方法的返回值。

```js
String.prototype.split(separator, limit)
// 等同于
separator[Symbol.split](this, limit)
```

下面是一个例子。

```js
class MySplitter {
  constructor(value) {
    this.value = value;
  }
  [Symbol.split](string) {
    let index = string.indexOf(this.value);
    if (index === -1) {
      return string;
    }
    return [
      string.substr(0, index),
      string.substr(index + this.value.length)
    ];
  }
}
'foobar'.split(new MySplitter('foo'))
// ['', 'bar']
'foobar'.split(new MySplitter('bar'))
// ['foo', '']
'foobar'.split(new MySplitter('baz'))
// 'foobar'
```

上面方法使用`Symbol.split`方法，重新定义了字符串对象的`split`方法的行为，

#### Symbol.iterator

对象的`Symbol.iterator`属性，指向该对象的默认遍历器方法。

```js
const myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};
[...myIterable] // [1, 2, 3]
```

对象进行`for...of`循环时，会调用`Symbol.iterator`方法，返回该对象的默认遍历器，详细介绍参见《Iterator 和 for…of 循环》一章。

```js
class Collection {
  *[Symbol.iterator]() {
    let i = 0;
    while(this[i] !== undefined) {
      yield this[i];
      ++i;
    }
  }
}
let myCollection = new Collection();
myCollection[0] = 1;
myCollection[1] = 2;
for(let value of myCollection) {
  console.log(value);
}
// 1
// 2
```

#### Symbol.toPrimitive

对象的`Symbol.toPrimitive`属性，指向一个方法。该对象被转为原始类型的值时，会调用这个方法，返回该对象对应的原始类型值。

`Symbol.toPrimitive`被调用时，会接受一个字符串参数，表示当前运算的模式，一共有三种模式。

- Number：该场合需要转成数值
- String：该场合需要转成字符串
- Default：该场合可以转成数值，也可以转成字符串

```js
let obj = {
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'number':
        return 123;
      case 'string':
        return 'str';
      case 'default':
        return 'default';
      default:
        throw new Error();
     }
   }
};
2 * obj // 246
3 + obj // '3default'
obj == 'default' // true
String(obj) // 'str'
```

#### Symbol.toStringTag

对象的`Symbol.toStringTag`属性，指向一个方法。在该对象上面调用`Object.prototype.toString`方法时，如果这个属性存在，它的返回值会出现在`toString`方法返回的字符串之中，表示对象的类型。也就是说，这个属性可以用来定制`[object Object]`或`[object Array]`中`object`后面的那个字符串。

```js
// 例一
({[Symbol.toStringTag]: 'Foo'}.toString())
// "[object Foo]"
// 例二
class Collection {
  get [Symbol.toStringTag]() {
    return 'xxx';
  }
}
let x = new Collection();
Object.prototype.toString.call(x) // "[object xxx]"
```

ES6 新增内置对象的`Symbol.toStringTag`属性值如下。

- `JSON[Symbol.toStringTag]`：’JSON’
- `Math[Symbol.toStringTag]`：’Math’
- Module 对象`M[Symbol.toStringTag]`：’Module’
- `ArrayBuffer.prototype[Symbol.toStringTag]`：’ArrayBuffer’
- `DataView.prototype[Symbol.toStringTag]`：’DataView’
- `Map.prototype[Symbol.toStringTag]`：’Map’
- `Promise.prototype[Symbol.toStringTag]`：’Promise’
- `Set.prototype[Symbol.toStringTag]`：’Set’
- `%TypedArray%.prototype[Symbol.toStringTag]`：’Uint8Array’等
- `WeakMap.prototype[Symbol.toStringTag]`：’WeakMap’
- `WeakSet.prototype[Symbol.toStringTag]`：’WeakSet’
- `%MapIteratorPrototype%[Symbol.toStringTag]`：’Map Iterator’
- `%SetIteratorPrototype%[Symbol.toStringTag]`：’Set Iterator’
- `%StringIteratorPrototype%[Symbol.toStringTag]`：’String Iterator’
- `Symbol.prototype[Symbol.toStringTag]`：’Symbol’
- `Generator.prototype[Symbol.toStringTag]`：’Generator’
- `GeneratorFunction.prototype[Symbol.toStringTag]`：’GeneratorFunction’

#### Symbol.unscopables

对象的`Symbol.unscopables`属性，指向一个对象。该对象指定了使用`with`关键字时，哪些属性会被`with`环境排除。

```js
Array.prototype[Symbol.unscopables]
// {
//   copyWithin: true,
//   entries: true,
//   fill: true,
//   find: true,
//   findIndex: true,
//   includes: true,
//   keys: true
// }
Object.keys(Array.prototype[Symbol.unscopables])
// ['copyWithin', 'entries', 'fill', 'find', 'findIndex', 'includes', 'keys']
```

上面代码说明，数组有 7 个属性，会被`with`命令排除。

```js
// 没有 unscopables 时
class MyClass {
  foo() { return 1; }
}
var foo = function () { return 2; };
with (MyClass.prototype) {
  foo(); // 1
}
// 有 unscopables 时
class MyClass {
  foo() { return 1; }
  get [Symbol.unscopables]() {
    return { foo: true };
  }
}
var foo = function () { return 2; };
with (MyClass.prototype) {
  foo(); // 2
}
```

上面代码通过指定`Symbol.unscopables`属性，使得`with`语法块不会在当前作用域寻找`foo`属性，即`foo`将指向外层作用域的变量。

### 迭代器

> 需要自定义遍历规则的时候使用迭代器

迭代器（Iterator）是一种接口，为各种不同数据结构提供统一的访问机制。任何数据结构只要部署了Iterator接口就可以完成遍历操作。

1. ES6创建了一种新的的遍历命令`for...of`循环，Iterator接口主要供`for...of`消费。

2. 原生具备iterator的接口数据可以用`for...of`遍历。

   Arrey、Arguments、Set、Map、String、TypedArray、NodeList

3. 工作原理

   1. 创建一个指针对象，指向当前数据结构的起始位置。
   2. 、第一次调用对象的next方法，指针自动指向数据结构的第一个成员。
   3. 接下来不断调用next方法，指针一直往后移动，直到指向最后一个成员。
   4. 每调用next方法返回一个包含value和done属性的对象。

**示例**

```js
//声明一个数组
const array=['张三', '李四', '王五'];

//使用for...of遍历  输出的是键值
for(let name of  array){
    console.log(name);
}
//输出结果  
//张三
//李四
//王五

//使用for...in遍历  输出的是键名
for(let name in array){
    console.log(name);
}
//输出结果
//0
//1
//2
```

### 生成器函数

> 生成器函数是ES6提供的一种异步编程解决方案

**生成器函数的声明：**

```js
function * gen(){
    
}
//gen 表示函数名，自定义可以是任意的
```

生成器函数与普通函数的区别在于`function`和函数名之间添加`*`号。

**生成器函数的调用：**生成器函数不能直接调用。需要将方法赋值给iterator迭代器。

```js
//生明生成器函数
function * gen(){
    
}
//调用生成器函数
let iterator=gen();
consloe.log(iterator.next());

```

这样我们可以得到一个迭代器对象，可以通过调用迭代器中的next方法来执行

![image-20220813134348154](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220813134348154.png)

**yield使用**

yield可以看作函数代码的分隔符。

```js
function * gen(){
    console.log(111);
    yield '第一部分！';
    
    onsole.log(222);
    yield '第二部分！';
    
    onsole.log(333);
    yield '第三部分！';
    
    onsole.log(444);
}
//指行
let iterator=gen();
iterator.next();		//输出结果111
iterator.next();		//输出结果222
iterator.next();		//输出结果333
iterator.next();		//输出结果444
```

**参数传递**

> 第n次调用next函数传递的参数将作为第n-1个yield整体的返回值。

```js
function* gen() {
        console.log(1);
        let one = yield 'hello';
        console.log(one);
        let two = yield 'world';
        console.log(two);
        let three = yield '!';
        console.log(three);
    }
    let iterator = gen();
    iterator.next();
    iterator.next(2);
    iterator.next(3);
    iterator.next(4);
```

第二个next函数内传递的2赋给了第一个 yield 'hello’的整体返回值，所以是2，
同理3、4.。

**示例**

1. 先过一秒输出1，再过两秒输出2，再过3秒输出3

```js
<script>
    // 1s后输出1，再过2s后输出2，再过3s后输出3
    function one() {
        setTimeout(() => {
            console.log(1);
            iterator.next();
        }, 1000);
    }
    function two() {
        setTimeout(() => {
            console.log(2);
            iterator.next();
        }, 2000);

    }
    function three() {
        setTimeout(() => {
            console.log(3);
            iterator.next();
        }, 3000);

    }
    function* gen() {
        yield one();
        yield two();
        yield three();
    }
    let iterator = gen();
    iterator.next();
</script>
```

2. 模拟获取数据，先获取用户信息，再获取订单信息，最后获取商品信息

```js
<script>
    // 2.模拟获取数据，先获取用户信息，再获取订单信息，最后获取商品信息
    function getUser() {
        setTimeout(() => {
            let data = '用户信息';
            iterator.next(data);
        }, 1000)
    }
    function getOrder() {
        setTimeout(() => {
            let data = '订单信息';
            iterator.next(data);
        }, 1000)
    }
    function getGoods() {
        setTimeout(() => {
            let data = '商品信息';
            iterator.next(data);
        }, 1000)
    }

    function* gen() {
        console.log(yield getUser());
        console.log(yield getOrder());
        console.log(yield getGoods());
    }

    let iterator = gen();
    iterator.next();
</script>
```

### Promise

**基本使用：**

```js
//实例化Promise对象
const p=new Promise(function(resolve,reject){
    //进行异步操作获取数据
    let data='异步获取的数据';
    //获取成功执行
    resolve(data);
    //获取失败执行
    reject('失败信息');
});
//调用Promise对象的then方法处理数据
p.then(function(value){
    //处理请求成功后的数据
},function(reason){
    //处理请求失败的数据
})
```

**使用Promise封装AJAX请求**

1. 常规AJAX请求

```js
//创建对象
const xhr=new XMLHttpRequest();
//初始化
xhr.open("GET", "https://api.apiopen.top/getJoke");
//发送请求
xhr.send();
//绑定事件处理相应结果
xhr.onreadystatechange=function(){
    //判断
    if(xhr.readyState==4){
        //判断相应状态码200-299
        if(xhr.status>=200&& xhr.status<300){
            //表示成功
            console.log(xhr.response);
        }eslse{
            //失败
            console.error(xhr.status);
        }
    }
}
```

2. 使用Promise进行封装

```js
const p=new Promise((resolve,reject)=>{
   	 //创建对象
	const xhr=new XMLHttpRequest();
	//初始化
	xhr.open("GET", "https://api.apiopen.top/getJoke");
	//发送请求
	xhr.send();
	//绑定事件处理相应结果
	xhr.onreadystatechange=function(){
  	  //判断
  	  if(xhr.readyState==4){
        	//判断相应状态码200-299
       	 	if(xhr.status>=200&& xhr.status<300){
            	//表示成功
            	resolve(xhr.response);
        	}eslse{
            	//失败
            	reject(xhr.status);
        	}
    	}
	}
})
//指定回调
p.then(value=>{
    //成功处理
    console.log(value);
},reason=>{
    //失败处理
    console.log(reason);
});

```

### Set

ES6提供了新的数据结构Set（集合）,它的数据结构类似与数组，但是成员的值都是唯一的，集合实现了iterator接口，所以可以使用扩展运算符`...`和`for ...of`进行遍历

**集合的创建：**

```js
//方法一
let s=new Set()；
//方法二
let s1=new Set(['张三', '李四'])；
```

**集合的属性和方法：**

1. size：返回集合的元素个数
2. add：添加一个新的元素，返回当前集合
3. delete：删除元素。返回Boolean值
4. has：检测集合中是否包含某一个元素，返回Boolean值
5. clear：清空集合

**set的应用**

1. 数组去重

```js
//创建一个数组
let arr=[1,2,3,4,1,2];
//根据数组创建集合
let s1=new Set(arr);	//此时已经成功去重，但是结果是集合不是数组
//通过扩展运算符将集合转换为数组
let arr1=[...s1];//此时得到的就是去重后的数组

//可以合并为
let arr2=[...new Set(arr)];
```

2. 取两个数组的交集

```js
let arr1=[1,2,3,4,5,1,2];
let arr2=[1,3,5,3];
//1.将数组1进行去重
let newarr1=[...new Set(srr1)]；
//将数组2转换我集合
let newarr2=new Set(arr2);
//将去重后的数组1进行遍历 并判断每个元素是否在数组2转换的集合中
let result=newarr1.filter(item=>{
    if(newarr2.has(item)){
        return true;
    }else{
        return false;
    }
})

//简化
let result=[...new Set(arr1)].filter(item=>new Set(arr2).has(item));
```

3. 取两个数组的并集

```js
let arr1=[1,2,3,4,1,2];
let arr2=[3,5,3];
//通过扩展运算符将两个数组进行合并
let arrs=[...arr1,...arr2];
//将合并额数据进行去重
let result=[...new Set(arrs)];

///简化
let result=[...new Set([...arr1,...arr2])];
```

4. 取差集

```js
//交集取反就是差集
llet arr1=[1,2,3,4,5,1,2];
let arr2=[1,3,5,3];

let result=[...new Set(arr1)].filter(item=>!(new Set(arr2).has(item)));
```

### Map

ES6提供了Map数据结果，它类似与对象，也是键值对的集合。但是“键”的范围不仅限于字符串，各种类型的值（包含对象）都可以作为键。Map也实现了iterator接口所以可以使用扩展运算符`...`和`for..of`进行遍历

**Map的属性和方法：**

1. size：返回Map的元素个数
2. Set：增加一个新元素，返回当前map
3. get：返回键名调用的键值
4. has：检测Map中是否包含某个元素，返回Boolean值
5. clear：清空集合返回undefined
6. delete：根据键名删除

**声明Map**

```js
let m=new Map();
```

### Class类

ES6提供了更接近传统语言的写法，引入了Class（类）的概念，作为对象的模板。提供class关键字，可以定义类，基本上ES6的class可以看作只是一种语法糖，它的绝大部分功能ES5都可以做到，新的class写法只是让对象原型的写法更加清晰、更像面向对象编程语法而已。

**对象的声明**

ES5声明对象

```js
//类似与Java的全参构造，来声明对象，beand和price是对象的属性
function Phone(brand,price){
	this.bramd=brand;
       this.price=price;
}
//给对象添加方法
Phone.prototye.cali=function(){
    console.log("我可以打电话！")；
}
//实例化对象
let huWei=new Phone('华为','5999');
//调用对象方法
huWei.cail();
```

ES6声明对象

```js
class Phone{
    //构造方法必须使用constructor不能改变  beand和price是对象的属性
    constructor(brand,price){
        this.bramd=brand;
       this.price=price;
    }
    //方法必须使用  方法名(){}  的形式
    call(){
         console.log("我可以打电话！")；
    }
}
//实例化对象
let onePlus=new Phone('1+',1999)；
```

构造函数没有也是合法的。

**class静态成员**

```js
class Phone{
    //静态属性
    static name='手机';
    static change(){
        console.log("111")；
    }
}
//测试
let nokie=new Phone();
console.log(nokie.name);		//输出结果 undefined
console.log(Phone.name);		//输出结果  手机
```

> 结论：
>
> ​	对于使用`static`标注的属性和方法，是属性类的，并不属于类实例化后的对象。

**class类的继承**

```js
//创建父类
class Phone{
    //构造方法必须使用constructor不能改变  beand和price是对象的属性
    constructor(brand,price){
        this.bramd=brand;
       this.price=price;
    }
    //方法必须使用  方法名(){}  的形式
    call(){
         console.log("我可以打电话！");
    }
}

//通过继承创建子类
class SmartPhone extends Phone{
	//构造方法
    constructor(brand,price,color,size){
	//通过super方法来设置父类属性
        super(brand,price);
        this.color=color;
        this.size=size;
    }
    //创建子类独有的方法
    photo(){
        console.log('拍照');
    }
}
```

**class中的get和set**

```js
class Phone{
    get price(){
        return '111'；
    }
    //set必须传递参数
    set price(value){
        //进行值的设置
    }
}
```

### ES6数值扩展

1. Nubmer.EPSILON：是javaScript的最小精度，可以用来判断浮点数比较的范围
2. Number.isFinite：检测一个数是否为有限数
3. Number.isNan：检测一个数值是否为NaN
4. Number.parseInt和Number.praseFloat：字符串转整数

```js
console.log(Number.parseInt('12312312asdas'));  //输出结果12312312
console.log(Number,praseFloat('3.14啦啦啦'));		//输出结果3.14
```

5. Number.isInteger：判断一个数是否为整数
6. Math.trunc：将数字的小数部分去除
7. Math.sign：判断一个数是正数(返回1)、负数(返回-1)还是零

### ES6对象方法的扩展

1. Object.is：判断两个值是否完全相等和`===`相似唯一的区别是Object.is可以比较NaN

```js
console.log(Object.is(120,121));	//flase
console.log(Object.is(120,120));	//true
console.log(Object.is(Nan,Nan));	//true
```

2. Object.assign：对象的合并，传递两个对象参数，后面的对象属性会把前面的对象相同的属性值覆盖

3. Object.setprototypeOf：设置原型对象

```js
const school={
    name: '清华'
}
const address={
    address: '北京'
}
Object.setprototypeOf(school,address);
//结果
console.log(school);
//会将addrsee对象的属性给school对象
```

4. Object.getPrototypeOf：获取原型对象

### ES6模块化⭐

> 模块化是值将一个大的程序文件，拆分为多个小的文件，然后将小文件组合起来。

**模块化的好处：**

1. 防止命名冲突
2. 代码复用
3. 高维护性

**ES6模块化语法**

模块化的功能主要是由两个命令构成：`export`和` import`

* export命令用于规定模块的对外接口
* import命令用于输入其他模块提供的功能

**用法：**

暴露数据：

1. 分别暴露：直接在要暴露的数据前面添加`export`

```js
export let school='清华';

export function test(){
    console.log("啦啦啦啦啦");
}
```

2. 统一暴露

```js
let school='清华';

function test(){
    console.log("啦啦啦啦啦");
}
//将要暴露的进行暴露
export {school, test};
```

3. 默认暴露

```js
export default{
    school: '清华',
    test: function(){
    	console.log("啦啦啦啦啦");
	}
}
```

数据引入：

1. 通用引入： `import *  as 别名 from “要引入的文件路径”`

```html
<script type="module"> 
	//引入
    import  * as  m1  from "js模块文件的地址";
</script>
<script>
	//引入成功就可以使用m1的内容
    console.log(m1);
</script>
```

2. 结构赋值形式： ` import {暴露数据1，暴露数据2} from "要引入文件的路径"`  如果引入多个文件暴露的数据名字重复可以使用`as`给数据加别名

```html
<script type="module"> 
	//引入
    import  {school ,test }as  m1  from "js模块文件的地址";
</script>
<script>
	//引入成功就可以使用m1的内容
    console.log(school);
    console.log(test)
</script>
```

3. 简便形式引入：只适用于默认暴露的文件 ` import 别名 from "要引入的文件的路径"`

**模块化引入优化**

可以单独建立一个js文件只用来作为文件引入，然后在html中引入该文件。

```html
<script src="单独引入的js文件路径" type="m"></script>
```

## ES7

### Array.prototype.includes

` includes`方法用来检测数组中是否包含某一个元素，返回布尔类型值

```js
//定义一个数组
const users=['张三','李四'];

//判断
console.log(users.includes('张三'));			//输出true
console.log(users.includes('王五');			//输出false
```

### 指数操作符`**`

用来实现幂运算，功能和`Math.pow`结果相似

```js
//计算2的10次方
console.log(2** 10);
console.log(Math.pow(2,10));
```

## ES8

### async和await

>  async和await两种语法结合可以使异步代码像同步代码一样。

**async函数**

* `async`函数的还回值为`promise`对象
* `promise`对象的结果由`async`函数执行的返回值决定

```js
//只要在方法前面加上async，则该方法就变成async方法
async  function test(){
    //返回字符串   如果返回结果不是一个`Promise`类型的对象   返回一个成功的Promise对象。
    //return '结果'；   
    //抛出异常  返回结果是一个失败的Promise对象。
    //throw new Error('抛出的异常！');
    //返回一个Promise对象则
	return new Promise((resolve,reject)=>{
        resovle('成功数据！')；
    })
}
```

async函数返回类型：

* 如果返回结果不是一个`Promise`类型的对象，则`async`函数就会将结果变成一个成功的`Promise`对象。
* 如果抛出错误，则返回结果是一个失败的`Promise`对象。
* 如果返回结果是一个`Promise`对象则，`async`函数返回结果就`Promise`对象的结果。

**await函数**

* `await`必须写在`async`函数中。
* `await`右侧的表达式一般为`Promise`对象
* `await`返回的是`promise`成功的值
* `await`的`promise`失败了，就会抛出异常，需要通过`try...catch`捕获处理

```js
//创建一个Promise对象
const p=new Promise((resovle,reject)=>{
    //数据处理
    resovle("成功数据");
    //失败数据处理  reject('失败数据！');
})

//使用await和async
async function test(){
    //如果Promise失败则使用try...catch进行捕获数据
    try{
        //如果Promise成功则直接可以直接获取结果
    	let result=await  p;
    	console.log(result); //输出结果：成功数据
    }cath(e){
        console.log(e)；//输出结果：失败的数据
    } 
}
```

### Object.values和Object.entries和Object.getOwnPropertyDescriptors

Object.valuse()：方法返回一个给定对象的所以可枚举属性值的数组（即获取对象的所有属性值）

Object.entries()：方法返回一个给定对象自身可遍历属性key.value的数组

Object.getOwnPropertyDescriptors()：该方法返回对象所有自身属性的描述对象

## ES9

### spread扩展运算符和rest参数

ES9的扩展运算符和rest参数支持对象操作。

### 正则扩展-命名捕获分组

```js
//定义一个字符串
let str=`<a href="http://www.baidu.com">百度</a>`;

//定义一个正则
const reg=/<a href="(?<url>.*)">(?<text>.*)<\/a>/;

const result=reg.exec(str);
console.log(result.groups.url);			//输出结果http://www.baidu.com
console.log(result.groups.text);		//输出结果百度
```

说明：可以在则表达式中通过`(?<别名>.*)`来将内容赋予别名,然后可以通过`正则结果.groups.别名`来获取别名所代替的值

### 正则扩展-反向断言

### 正则扩展-dotAll模式

## ES10

### 对象扩展方法Object.fromEntries

> 可以通过`Object.fromEntries`方法来将`二维数组`和`Map`转换为对象

将二维数组转换为对象

```js
const result=Object.fromEntries([
    ['name', '张三'],
    ['age','18']
])
console.log(result);
```

**注意：**如果二维数组中的某一项数组有多个数据，则转换后的对象，属性值只取改多个数据数组的第二给数据为属性值。

Map转换对象

```js
const m=new Map();
m.set('name','张三');
//转换为对象
const result =Objrect.fromEntries(m);
console.log(result);
```

### 字符串扩展方法 trimStart和trimEnd

trimStart()：方法用来清除字符串左侧空格

trimEnd()：方法用来清除字符串右侧空格

### 数组扩展方法flat和flatMap

flat()：方法可以将多维数组转换为低维数组，方法可以传递一个非零数字类型的值，表示转换深度不传默认为1(即直接向下转换一维即3维数组只能转换为二维数组)

flatMap()：方法相当于map方法和flat方法的结合

### Symbol.prototye.description

可以用来获取Symbol的字符串描述

```js
//创建Symbol
let s=Symbol("啦啦啦");
//获取Symbol字符串描述
console.log(s.description);		//输出结果为啦啦啦
```

## ES11

### 私有属性

> 通过在属性名前面加上`#`来将公有属性变成私有属性

```js
//创建对象
class Person{
    //公有属性
    name;
    //私有属性
    #age;
    //构造方法
    constructor(name,age){
        this.name=name;
        this.age=age;
    }
}
//实例化对象
const girl=new Person('张三',18);
//私有属性不能直接获取
console.log(girl.#age);//	直接会报错
```

### Promise.allSettled

Promise.allSettled()：方法接收一个Promise数组，返回一个Promise对象。返回结果永远是成功的，值为接收的Promise数组中每一个Promise的结果组成的数组

Promise.all()：方法和Promise.allSettled()方法相似也是接收一个Promise数组，但是必须每个Promise都成功才能返回成功。

### 字符串扩展matchAll方法

**用来获取数据的批量提取**

即也用来获取正则批量匹配的结果

### 可选连操作符`?.`

> 可选连操作符`？.`  含义：如果`？`前面的东西存在着可以通过`.`来获取它内部的东西

使用可选连操作符可以不能自己进行判断是否存在，如果不存在则不会报错，如果存在这可以通过`.`获取它内部的值

### 动态import

通过`import('引入模块路径').then(引入模块的别名=>{使用别名. 暴露数据进行操作})`实现动态引人**可以实现按需加载**

动态import()方法的结果是一个Promise对象，所以可以使用then方法

### BigInt大整型类型

**声明**:在常规整型数据后面加上`n`就可以变成大整型

```js
//声明大整型数据
let n=12n;
```

普通正整型转换为大整型

```js
let n=123；
//转换
BigInt(n);
```

> BigInt类型的数据不能直接和普通数据进行运行，需要将普通数据也转换为大整型数据。
>
> BigInt类型通过应用于超过普通数据范围以外的数据运输

### 绝对全局对象globalThis

globalThis对象始终指向全局对象
