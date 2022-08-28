# Angular

## Angular介绍

Angular是一个由Google维护和开发的开源的JavaScript框架，用于在HTML和JavaScript中构建Web应用程序。

Angular最显著的特征就是其整合性。涵盖了M、V、C/VM等各个层面，不需要组合，评估其它技术就能完成大部分前端开发作务。这样可以有效降低决策成本，提高决策速度，对需要快迪起步的团队是非常有帮助的。

在Angular中最具特色的就是依赖注入系统了，它把后端开发中用来解决复杂问题、实现高弹性设计的技术引入了前端。

## 使用VsCode开发Angular插件推荐

1. `Angular 10 Snippets ` 用于快速生成Angular相关内容快捷键

![image-20220819102315081](https://raw.githubusercontent.com/DW62/ImgStg/master/202208191023180.png)

## Angular CLI

**安装：** Angular CLI用于简单，快速构建Angular项目，依赖于NodeJS和npm。

1. 安装脚手架 ` npm install -g @angular/cli`   g值的是全局安装

出现下面情况说明成功。

![image-20220818185349494](https://raw.githubusercontent.com/DW62/ImgStg/master/202208181853606.png)

可以通过命令`ng version`命令来查看版本信息

如果出现下面情况

![image-20220818185735402](https://raw.githubusercontent.com/DW62/ImgStg/master/202208181857452.png)

找到电脑` Windos PowerShell`应用使用管理员权限打开

![image-20220818185904969](https://raw.githubusercontent.com/DW62/ImgStg/master/202208181859033.png)

输入：`set-ExecutionPolicy RemoteSigned` 然后选择`A`

![image-20220818190055940](https://raw.githubusercontent.com/DW62/ImgStg/master/202208181900983.png)

如果输错使用`Set-ExecutionPolicy Unrestricted`命令然后从新选择

可以通过` get-ExecutionPolicy `查看当前的状态

![image-20220818190224137](https://raw.githubusercontent.com/DW62/ImgStg/master/202208181902176.png)

此时就可以使用`ng version`命令来查看版本信息

![image-20220818212037762](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220818212037762.png)

2. 使用命令`ng new 项目名`创建项目

3. 项目创建完成后可以使用命令`ng serve --open`运行程序

**Angular CLI特性：**

1. Angular CLI可以快速搭建框架，创建module，service，class ，directive等;
2. 具有webpack的功能，代码分割，按需加载;
3. 代码打包压缩;
4. 模块测试;
5. 热部署，有改动立即重新编译,不用刷新浏览器;而且速度很快
6. 有开发环境，测试环境，生产环境的配置，不用自己操心;
7. sass，less的预编译Angular CL都会自动识别后缀来编译;
8. typescript的配置, Angular CL在创建应用时都可以自己配置;
9. 在创建好的工程也可以做一些个性化的配置
10. Angular CL创建的工程结构是最佳实践，生产可用;

**自动生成的项目文件结构：**

src->app下文件：

​		`app-routing.module.ts`文件：是当前项目的路由配置文件

​		`app.component.html`文件：为app.component组件的模板文件 

​		`app.component.css`为app.component样式文件

​		`app.component.spec.ts`文件：为app.component的测试文件

​		`app.component.ts`文件：为app.component组件写TS的文件

​		`app.module.ts`文件：所有组件的人口文件，所有写的组件都需要在这个里面进行配置

src->assets	为静态资源存放目录

src->environments下文件

​		`environment.prod.ts`文件：为开发环境配置

​		`environment.ts`文件：为线上环境配置

src->`main.ts`文件：为项目的人口文件

src->`styles.css`文件：为项目默认的样式文件

src->`test.ts`文件：为测试的文件

`.browserslistrc`文件：配置不同浏览器兼容的文件

`.editorconfig`文件：配置不同浏览器配置文件

`.gitignore`文件：配置git忽略的文件

`angular.json`文件：angular的配置文件

`karma.conf.js`文件：测试的配置文件

`package-lock.json`文件：配置当前页面的锁定，锁定于`package.json`文件

`tsconfig.app.json`文件：是当前项目的TS配置文件

`tsconfig.json`文件：为编辑器内置的TS检测文件

## 架构

### 模块

​       模块组件的特征在于可以用于执行单个任务的代码块。您可以从代码(类)中导出值。 Angular应用程序被称为模块, 并使用许多模块勾建您的应用程序。 Angular的基本构建块是可以从模块导出的组件类。

```typescript
// @Component称为装饰器，用来加载一些配置
//然后使用export 导出一个类
@Component({
    //表示当前当前渲染时的选择器(id选择器，标签选择器...)为app-root     ，渲染为<app-root></app-root>标签
  selector: 'app-root',   
    //表示当前组件渲染的模板文件
  templateUrl: './app.component.html',
    //表示当前组件渲染的样式文件
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    //组件的变量
  title = 'angluar01';
}
```

### 组件

#### 组件创建

组件是拥有模板的控制器类，主要处理页面上的应用程序和逻辑的视图。组件可以拥有独立的样式。
注册组件，使用@Component注释，可以将应用程序拆分为更小的部分。

**创建组件：**可以直接使用命令`ng g c 组件名` ，使用命令创建的组件会自动生成在`app.module`中引用

**@Component最常用的几个选项:**

* selector：这个是css选择器用于在模板中标记出该指令，并触发该指令的实例化。
* template：组件的内联模板
* templateUrl：组件模板文件的URL
* styleUrls：组件的样式文件

#### 组件生命周期

Angular会按以下顺序执行钩子方法

| 钩子方法                | 用途                                                         | 时机                                                         |
| :---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| ngOnChanges()           | 当`Angular`设置或重新设置数组绑定的输入属性时相应。该方法接受当前和上一属性值的`SimpleChanges`对象注意，这发生的非常频繁，所以你在这里执行的任何操作都会显著影响性能。 | 在`ngOnInit()`之前以及所绑定的一个或者多个输入属性的值发生变化时都会调用。注意，如果你的组件没有输入，或者你使用它时没有提供任何输入，那么框架就不会调用`ngOnChanges()` |
| ngOnInit()              | 在`Angular`第一次显示数据绑定和设置指令/组件的输入属性之后，初始化指令/组件/ | 在第一轮`ngOnChanges()`完成之后调用，只调用一次。            |
| ngDoCheck()             | 检测，并在发生`Angular`无法或不愿意自己检测的变化时做出反应  | 紧跟在每一次执行变更检测时的`ngOnChanges()`和首次执行变更检测时的`ngOnInit()`后调用 |
| ngAfterContentInit()    | 当`Angular`把外部内容投影进组件视图或者指令所在的视图之后调用 | 第一次`ngDoCheck()`之后调用，只调用一次                      |
| ngAfterContentChecked() | 每当`Angular`检查完被投影到组件或指令中的内容之后调用        | `ngAfterContentInit()`和每次`ngDoCheck ()`之后调用           |
| ngAfterViewInit()       | 当`Angular`初始化完组件视图及其子视图或包该指令的视图之后调用 | 第一次`ngAfterContentChecked()`之后调用，只调用一次          |
| ngAfterContentCheced()  | 每当`Angular`做完组件视图和子视图或包含该指令的视图的变更检测之后调用 | `ngAfterViewInit()`和每次`ngAfterContentChecked()`之后调用   |
| ngOnDestroy()           | 每当`Angular`每次销毁指令/组件之前调用并清扫。在这儿反订阅可观察对象和分离事件处理器，以防止内存泄漏 | 在`Angular`销毁指令或组件之前立即调用                        |

**重点生命周期：**`ngOnInit()`、`ngOnChanges()`、`ngOnDestroy()`

#### 组件交互

**父组件给子组件传值**：`@Input`：父组件通过`@Input`给子组件绑定属性设置输入类数据

示例：

父组件

```jsx
//在组件间的ts文件中将要传递的值声明出来
export class HomeComponent implements OnInit {
  title:string='张三'   //要向子组件中传递的值为title
  constructor() { }
 
  ngOnInit(): void {
  }
}

//在父组件的html中找到要传递的子组件
<app-title [titles]="title"></app-title>    //【titles】表示子组件接收到值后的变量名         title表示父组件传递的值
```

子组件

```jsx
//先引入Input
import { Component, OnInit, Input } from '@angular/core';

//接收符组件传来的值
export class TitleComponent implements OnInit {

  @Input()
   titles!: string   //titles为符组件传递的值的名字

    .....
}

//在页面中使用符组件传递的值
<p>title 组件 {{titles}}</p>
```

**子组件给父组件传值：**`@Output`    用法：父组件给子组件传递一个事件，子组件通过`@Output`弹射触发事件然后将值给父组件

子组件

```jsx
//现在子组件中引入 Output 和EventEmitter
import { Component, OnInit ,Output ,EventEmitter} from '@angular/core';


export class TitleComponent implements OnInit {
//传教一个ventEmitter对象 然后使用@Output() 将对象弹射出去
 @Output() addList=new EventEmitter()
    //给子组件添加一个方法，用来给对象添加值
 addBtnFun(){
  console.log(1);
  this.addList.emit('Vue')  //给对象添加值
 }
    
    ...
}
    
    
    //页面添加触发addBtnFun方法的事件
    <button (click)="addBtnFun()">子组件向父组件传值</button>
```

父组件

```jsx
//在父组件中找到传递值的子组件
//通过设置方法来获取子组件传递的值    （addList)表示子组件弹射过来的对象   addListFun($event)" 为方法
<app-title (addList)="addListFun($event)"></app-title>  

//展示数据
<p *ngFor="let item of list"> {{item}}</p>

//在ts文件中添加上对应的方法
export class HomeComponent implements OnInit {

  list:Array<string> =['Angular','React']
  addListFun(str:string){  //参数表示子组件传递的值
    this.list?.push(str)   //将子组件传递的值添加到lis中
  }
...
}
```

>  父组件还可以通过`@ViewChild('自己声明的子组件的名字')` 来获取子组件的示例，从而获取子组件数据。不过很少用

### 模板

在Angular中，模板就是一块HTML。在模板中你可以通过一种特殊的语法来使用Angluar的许多功能。

#### 插值语法

所谓的"插值"是指将表达式嵌入到标记文本中。默认情况下插值写入`{{  }}`中

```html
<p>   {{ name}}  </p>
```

花括号中的文本值组件属性的名字。Angular会把这个名字替换为响应组件的属性字符串值括号间的素材是一个模板表达式所以也可以在`{{ }}`中进行js运算

```html
<p> {{1+1}}</p>
```

#### 属性绑定

1. Attribute绑定

```jsx
//绑定值为字符串，必须加上单引号
<h3 [id]="'h3-dom'">  hello , {{name}}</h3>
<h3 [class]="'h3-dom'">  hello , {{name}}</h3>

//绑定值为属性，不用加上单引号，但是必须在组件中声明属性
<h3 [id]="h3-dom">  hello , {{name}}</h3>
<h3 [class]="h3-dom">  hello , {{name}}</h3>
```

2. 类绑定

```jsx
//单一类绑定   true表示显示
<h3 [class.h3-dom]="true">  hello , {{name}}</h3>

//多重类绑定
<h3 [class]="'h3-dom  title-dom   min-title'"> 多类名绑定</h3>
<h3 [class]="{'h3-dom' :true ,  'title-dom' : false}">  类名条件渲染，只用为true的才能绑定</h3>
<h3 [class]="['h3-dom' ,  'title-dom' ]">  hello , {{name}}</h3>


//ngClass
export class AppComponent{
    isActive=true;
}
<h3 [ngClass]="{'active': isActive}">hello</h3>
```

3. 样式绑定

```jsx
//单一样式绑定
<h3 [style.width]="'300px'">hello</h3>

//带单位的单一样式绑定
<h2 [style.width.px]="'300'">hello</h2>

//多重样式绑定
<h3 [style]="'background:red; color:#fff;'">hello</h3>
<h3 [style]="{'background':'red', 'color':'#fff'}">多重样式绑定</h3>

//ngStyle
export class AppComponent{
    isMax=false;
}
<h3 [ngStyle]="{'color':'red'}">hello</h3>
<h3 [ngStyle]="{'font-size': isMax ?  '24px' : '12px'  }">hello</h3>
```

#### 条件判断

`*ngIf`是直接影响元素是否被渲染，而非控制元素是否显示和隐藏

```jsx
export class AppComponent{
    isMax=false;
    isMin=false;
}
<div *ngIf="isMax">Max title</div>
<div *ngIf="isMin">Min title</div>

//条件判断底层实现效果
<ng-template  [ngIf]="isMax">
	<div>Max title</div>
</ng-template>


//如果isMax为true则直接显示包含的div内容，
//如果isMax为fale则显示 elseTemplate里面div包含内容
<ng-container  *ngIf="isMax; ales elseTemplate">
	<div>isMax为true</div>
</ng-container>
<ng-temolate #elseTemplate>
	<div>isMax为false</div>
</ng-temolate>
```

#### 循环语句

语法：`*ngFor="let 循环后得到的单个对象  of  要循环的数据   let i=index  let odd=odd"`  其中index表示循环的索引  odd用来表示当前项是否为偶数项，是偶数项则odd为true，否则为false

```jsx
export class AppComponent{
    colors=['red' ,'blue', 'yellow', 'green'];
}
<div *ngFor=" let color  of  colors  let i=index   let odd=odd">
	{{odd}}
       {{i}}
       {{color}}
</div>


//解析效果
<ng-template ngFor  let-color  [ngForOf]="colors" let-i="index" let-odd="odd">
	<div>{{odd}}  {{i}}  {{color}}</div>
</ng-template>
```

```jsx
//声明一个变量type
<div [ngSwitch]="type">
	<p *ngSwitchCase="1"> type变量等于1时显示</p>
       <p *ngSwitchCase="2"> type变量等于2时显示</p>
       <p *ngSwitchDefault> type变量不等于1也不等于2时显示</p>
</div>
```

#### 事件绑定

Angular的时间绑定语法是由等号左侧括号内的目标事件名和右侧引号内模板语句组成。事件对象会通过`$event`传递

```jsx
export class AppComponent{
    onSave(e: Event){
        console.log(e);
        console.log('点击了按钮！');
    }
}

<button (click)="onSave($event)">Save</button>
```

#### 模板引用变量

模板引用变量可以帮助在模板的另一部分使用这部分是数据。可以使用`#变量名`

```jsx
<input #username></input>
```

可以在组件模板中的任意地方引用这个模板变量。

```jsx
//这里方法中的参数username.value表示上面input的值
<button (click)="getUsername(username.value)">按钮</button>

export class AppComponent{
    grtUsername(v: string){
        console.log(v);
    }
}
```

Angular根据你所声明的变量位置给模板变量赋值

* 如果在组件上声明变量，该变量会引用该组件实例
* 如果在标准HTML标记中声明变量，该变量会引用该元素
* 如果在<ng-template>元素生声明变量该变量会引用一个TemplateRef实例来代表此模板

#### 双向绑定

可以通过`ngModel`指令来实现双向绑定，不过该指令只对表单元素有效，所以在使用之前需要在`app.module`中导入`FormsModule`模块

```jsx
//导入FromsModule模块
import {FormsModule} from '@angular/forms'；

//在imports中引入
imports:[
    FormsModule
]
```

```jsx
//使用双向绑定
<input [(ngModel)]="title"  type="text"></input>
<p>title:{{ title}}</p>
```

#### 表单控件

使用表单控件的步骤：

1. 在应该中注册响应式表单模块。该模块声明了一些要在响应式表单中的指令
2. 生成一个新的`FormControl`实例，并保存在组件中。
3. 在模块中注册这个`FormControl`

**注册响应式表单模块：**

要使用响应式表单控件，就要从`@angular/forms`包中导入`ReactiveFormsModule`，并把它添加到你的`NgModule的impots`数组中

```jsx
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
    imports:[
        ReactiveFormsModule
    ],
})
export class AppModule { }
```

要注册一个表单控件件，就要导入`FormControl`类并创建一个`FormControl`的新实例，将其保存为类的属性。

```jsx
import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
    selector : 'app-name-editor',
    templateUrl: './name-editot.component.html',
    styleUrls: ['./name-editor.component.css']
})

export class NameEditorComponent{
    name=new FormControl('');
}

//使用这个模块绑定语法，把该表单控件注册给模板中为name的输入元素，这样表单控件和DOM元素就可以相互通讯视图会反应模型的变化，模型也会反映视图的变化

<lable>Name: <input type="text" [formControl]="name"></input></lable>
<p>Value: {{name.value}}</p>
```

修改`name`值可以通过`Formcontrol`提供的`setValue()`方法

```jsx
updateName(){
    this.name.setValue('张三')；
}
```

#### 表单控件的分组

表单中通常会包含几个相互关联的控件。响应式表单提供了两种把多个相关控件分组到同一个输入表单中的方法

要将表单组件添加到此组中需要：

1. 创建一个`FormGroup`实例。
2. 把这个`FormGroup`模型关联到视图。
3. 保存表单数据。

创建一个`FormGroup`实例

在组件类中创建一个名叫`loginForm`的属性，并设置为`FormGroup`的一个新实例。要初始化这个`FormGroup`，请为构造函数提供一个由控件组成的对象，对象中每一个名字都要和表单控件的名字一一对应

```jsx
import { Component } form '@angular/core';
import { FormGroup , FormControl } from '@angular/forms';

@Component({
    selector: 'app-profile-editor',
    templateUrl: './profilr-editor.component.html',
    styleUrls: ['./profile-editor.component.css']
})
export class ProfileEditorComponent {
    loginForm=new FormGroup({
        userName: new FormGroup(' '),
        password: new FormControl(' '),
    });
}

//模板渲染
<from [formGroup]="loginForm">
	<label>账号：<inpult  type="text"  formControlName="userName"/></label>
       <label>密码：<inpult  type="text"  formControlName="password"/></label>
</from>
```

#### 表单验证

表单元素添加`required`关键字表示必填，通过绑定`ngModel`的引用可以拿到当前组件的信息，通过引用获取到验证的信息.

```jsx
export class AppComponent{
    formData={
        name: ' ',
        password: ' '
    };
    
    subBtnFun(object){
        console.log(object)
    }
}

<form action="">
	账号：<input required  #nameInp="ngModel"  type="text"  [(ngModel)]="formData.name"  name="uaserName"/>
      <br/>
      <span>{{ nameInp.valid}}</span>
       密码：<input required  #pasInp="ngModel"  type="text"  [(ngModel)]="formData.password"  name="password"/>
      <br/>
      <span>{{ pasInp.valid}}</span>
     <button (click)="subBtnFun(nameInp)">提交</button>
</form>
```

我们还可以通过`ngModel`跟踪修改状态与有效性验证，它使用了三个css类来更新控件，以便反映当前的状态。

| 状态             | 为true时的类 | 为false时的类 |
| ---------------- | ------------ | ------------- |
| 控件已经被访问过 | ng-touched   | ng-untouched  |
| 控件值已经变化   | ng-dirty     | ng-pristine   |
| 控件值是有效的   | ng-valid     | ng-invalid    |

**自定义表单验证：**

先引入表单的一些内置依赖

```jsx
import { FormGroup , FormBuilder , Validators}  form '@angular/forms';

//构造函数注入FormBuilder
constructor(private fb:FormBuilder){  }

//错误提醒数据
formErrors={
    'title': ' ',
    'content': ' '
};


//在组件类的初始化函数里对表单的元素的校验进行定义，并调用表单的valueChanges方法，检测表单输入的变化
ngOnInit():void{
    this.taskInfo.isComplete=1;
    this.tasksForm=this.fb.group({
    	userName: [' ', [Validators.required, Validators.maxLength(18), Validators.minLength(6)]],
            password: [' ', [this.passwordVal]],
            phone: [' ' ,[Validators.required, this.phoneVal], ]    
	});

phoneVal(phone: FormControl): object {
    const value=phone.value || ' ' ;
    if(!value)  return {desc: '请输入手机号'}
    const valid= /[0-9]{11}/.test(value);
    return valid ? { } : {desc: '联系电话必须是11位数'}
   }
passWordVal(password:FormControl):object{
    const value=password.value || ' ';
    const valid=value.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/);
    return valid ? { } : {passwordValidator : {desc: '密码至少要包含数字和英文长度6-20'}}
  }
}
```

#### 管道

管道的作用就是传输。不同的管道具有不同的作用(其实就是数据处理)

angular中自带pipe函数

| 管道          | 功能                                                      |
| ------------- | --------------------------------------------------------- |
| DatePipe      | 日期管道，格式化                                          |
| JsonPipe      | 将输入数据对象经过Json.stringfy()方法转换后输出对象字符串 |
| UppercasePipe | 将文本所有小写字母转换为大写字母                          |
| LowercasePipe | 将文本所有大写字母转换为小写字母                          |
| DecimalPipe   | 将数值按照特定的格式显示文本                              |
| CurrentcyPipe | 将数值进行货币格式化处理                                  |
| SlicePipe     | 将数组或者字符串裁剪成新的子集                            |
| PercentPipe   | 将数值转换为百分比格式                                    |

Pipe用法：

* {{输入数据 | 管道(只取Pipe前面的内容并且转为小写) ：管道参数}}  其中`|`是管道操作符
* 链式管道{{ 输入数据 | date | uppercase }}
* 管道流通方向自左向右，逐层执行

**示例：**

```jsx
//使用管道转换时间
<p>{{ dateStr | date : 'yyyy-MM-dd HH:mm:ss'}}</p>  //将时间字符串转换为yyyy-MM-dd HH:mm:ss 格式
```

可以使用命令`ng g p 管道名字`来创建管道，通过命令创建的管道会自动在`app.module.ts`中引用，手动传教的需要自己引用到`app.module.ts`中

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'test'        //test表示通过命令生成管道时的管道名字
})
export class TestPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
      //value表示管道接收到的数据 ，返回的是自己经过处理的结果
    return  '>>>'+value+'>>>';
  }

}
```

### 服务

>  angular中，把从组件内抽离出来的代码叫服务，服务的本质就是函数

官方认为组件不应该直接获取或保存数据，它们应该聚焦于展示数据，而把数据访问的职责委托给某个服务。而
服务就充当着数据访问，逻辑处理的功能。把组件和服务区分开,以提高模块性和复用性。通过把组件中和视图有
关的功能与其他类型的处理分离开，可以让组件类更加精简、高效。

使用命令`ng g S xxx`创建一个服务， 通过`@Injectable()`装饰器标识服务。

```jsx
//导入Injectable装饰器
import { Injectable } from '@angular/core'；
//使用Injectable装饰器声明服务
@Injectable({
    //作用域设置，'root' 表示默认注入，注入到AppModule    还可以是null表示不设置区域   还可以是某个模块的名字(一般是懒加载模式)
    providedIn: 'root',
})

export class TestService{
    
}
```

组件中如何使用服务呢，必须将服务依赖注入系统、组件或者模块,才能够使用服务。我们可以用**注册提供商**和**根**
**注入器**实现。
该服务本身是CLI创建的一个类，并且加上了`@Injectable()`装饰器。默认情况下，该装饰器是用`providedIn`属性进行配置的，它会为该服务创建一个提供商。

**依赖注入:** 服务创建完成后需要手动在`中进行导入`

1. 在`app.module.ts`中进行导入

```typescript
import {服务名} from '服务地址'

providers: [服务名],
```

2. 在要使用该服务的组件中进行导入

```typescript
iimport {服务名} from '服务地址'

//在组件的构造函数中进行声明服务
 constructor(private 服务使用时的变量名: 在当前组件中注入的服务名) { }
//然后就可以在需要使用服务的地方直接使用服务变量名来使用
```

### 路由

路由就是连接组件的筋络，它也是树形结构的.有了它，就可以在angular中实现路径的导航模式
可以把路由看成是一组规则,它决定 了url的变化对应着哪一种状态， 具体表现就是不同视图的切换，在angular中，路由是非常重要的组成部分,组件的实例化与销毁,模块的加载组件的某些生命周期钩子的发起，都是与它有关

#### 路由基本使用
**路由器**是一个调度中心，它是一 套规则的列表能够查询当前URL对应的规则，并呈现出相应的视图.
**路由**是列表里面的一个规则，即路由定义，它有很多功能字段:
●path字段,表示该路由中的URL路径部分
●Component字段，表示与该路由相关联的组件
每个带路由的Angular应用都有一个路由器服务的单例对象，通过 路由定义的列表进行配置后使用。

路由配置步骤：

1. 在`app-routing.module.ts`文件中

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//引入组件
import {HomeComponent } from './home/home.component'
import {HelloComponent } from './hello/hello.component'
//路由配置
const routes: Routes = [
    {
    path:'',   //为空表示默认打开
    component:HomeComponent
  },
  {
    path:'hello', //Url对应
    component:HelloComponent  ///与该路由相关联的组件
  },
    {
    path:'**',  //通配匹配(如果不管输入什么都会打开)，这个必须要放最下面
    component:HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
```

2. 在页面上进行渲染路由

```html
<!-- 设置路由导航 -->
<a [routerLink]="[ '/home' ]">首页</a>    |      <a [routerLink]="[ '/hello' ]">hello页</a>
<!-- 路由渲染位置 -->
<router-outlet></router-outlet>
```

#### 路由嵌套

**路由设置：**

```jsx
 {
    path:'hello',
    component:HelloComponent,
    children:[
      {path:'title' ,component:TitleComponent}  //嵌套的路由
    ]
  },
```

**页面设置：**  在hello里面嵌套路由，所以修改hello页面

```html
<!-- 设置路由导航   必须把父级路由地址也加上-->
<a [routerLink]="[ '/hello/title' ]">的组件</a>
<!-- 路由渲染位置 -->
<router-outlet></router-outlet>
```

#### 路由传参和获取

1. `query`方式：在a标签上添加一个参数`queryParms`,并通过`this.routerfo.snapshot.queryParams`获取参数 

```html
<a [routerLink]="[ '/home' ]" [queryParams]="{'id':1,'name':'张三'}">首页</a>  
```

效果：在路由地址后面使用`？`分割开参数，参数与参数直接使用`&`连接。

例如：`http://localhost:4200/home?id=1&name=张三`

参数的获取：**路由地址对应的组件的ts文件中**

```typescript
//引入ActivatedRoute 
import { ActivatedRoute } from '@angular/router';

//在构造方法中声明一个ActivatedRoute 类型的参数
 constructor(private routerInfo:ActivatedRoute){
    
  }

//在需要获取参数的地方直接根据声明的变量来获取
  //初始化生命周期方法
  ngOnInit(): void {
   //输出路由参数 对象
   console.log(this.routerInfo.snapshot.queryParams);
	//根据参数名子获取参数值
 	console.log(this.routerInfo.snapshot.queryParams['前面的参数名']);
  }
```

2. `params`方式：修改路由配置文件`path`，路由导航a标签`routerLink`后面数组的第二个参数为传递的值，并且通过`subscribe`获取传递的值

```jsx
  {
    path:'hello/:id/:name',   //id和name就是要传递的参数名称
    component:HelloComponent
  },
      
     //2和zhangsan表示传递的具体值   值顺序必须和上面一致
<a [routerLink]="[ '/hello','2','zhangsan']">hello页</a> |
```

效果：在路由地址后面使用`/`分割开参数，参数与参数也使用`/`连接。

例如：`http://localhost:4200/hello/2/zhangsan`

参数的获取：**路由地址对应的组件的ts文件中**

```typescript
//引入ActivatedRoute, Params 
import { ActivatedRoute, Params } from '@angular/router';

//在构造方法中声明一个ActivatedRoute 类型的参数
 constructor(private routerInfo:ActivatedRoute){
    
  }


//在需要获取参数的地方直接根据声明的变量来获取
  //初始化生命周期方法
  ngOnInit(): void {
  		this.routerInfo.params.subscribe((params:Params)=>{
        	console.log(params)  //输出参数对象
       	      console.log(params['id'])  //根据参数名字获取参数
        })
  }
```

