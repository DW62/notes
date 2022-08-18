# Angular

## Angular介绍

Angular是一个由Google维护和开发的开源的JavaScript框架，用于在HTML和JavaScript中构建Web应用程序。

Angular最显著的特征就是其整合性。涵盖了M、V、C/VM等各个层面，不需要组合，评估其它技术就能完成大部分前端开发作务。这样可以有效降低决策成本，提高决策速度，对需要快迪起步的团队是非常有帮助的。

在Angular中最具特色的就是依赖注入系统了，它把后端开发中用来解决复杂问题、实现高弹性设计的技术引入了前端。

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