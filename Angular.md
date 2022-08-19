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

组件是拥有模板的控制器类，主要处理页面上的应用程序和逻辑的视图。组件可以拥有独立的样式。
注册组件，使用@Component注释，可以将应用程序拆分为更小的部分。

**创建组件：**可以直接使用命令`ng g c 组件名` ，使用命令创建的组件会自动生成在`app.module`中引用

**@Component最常用的几个选项:**

* selector：这个是css选择器用于在模板中标记出该指令，并触发该指令的实例化。
* template：组件的内联模板
* templateUrl：组件模板文件的URL
* styleUrls：组件的样式文件



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

