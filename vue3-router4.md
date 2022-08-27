# Vue3-Router4

## 安装

```bash
npm install vue-router -s
```

## 快速使用

1. 首先在src下新建一个router文件夹，在router文件夹下创建index.ts文件作为路由配置文件

```typescript
//引入vue-router文件  createRouter表示路由对象
import { createRouter,  createWebHistory, RouteRecordRaw } from 'vue-router'

//定义路由规则
const routes:Array<RouteRecordRaw>=[
    {
        path:'/',  
        component:()=>import('../components/HelloWorld.vue')   //引入组件
    },
    {
        path:'/login',
        component:()=>import('../components/Login.vue')
    },
    {
        path: '/test',
        component: ()=>import('../components/Test.vue'),
        children:[
            {
        	path:'',  //不填写，则表示默认打开  
        	component:()=>import('../components/HelloWorld.vue')   //引入组件
    	},
    	{
        	path:'login' ,  //子路由不可以不写 / 
        	component:()=>import('../components/Login.vue')
    	},
        ]
    }
]
//创建路由对象
const router= createRouter({
    history:createWebHistory(),  //设置路由模式
    routes           //设置路由配置规则
})

//导出路由
export default router
```

> **路由模式的区别：**
>
>    使用`createWebHashHistory()`路由模式时：会在请求的path前面加上`/#`
>
>    使用`reateWebHistory()`路由模式时：直接在服务端口后面加上path

2. 在main.ts中声明路由

```typescript
//注册路由
import router from './router'

//声明路由   use(router)表示声明路由
createApp(App).use(router).mount('#app')
```

3. 在页面使用路由

```vue
<template>
  <div>
      App组件
      <div>
        <!-- 相关与超链接，来控制点击时路由跳转 to的值和路由配置中一致 -->
        <RouterLink to="/">HelloWord组件</RouterLink>   
        <RouterLink to="/login">Login组件</RouterLink>
      </div>
  </div>
  <hr/>
  <!-- 用来展示路由对于的内容 -->
  <RouterView></RouterView>
</template>
```

## 导航跳转

除了使用path之外，还可以在配置路由时给路由加上name。这有以下优点：

- 没有硬编码的 URL
- `params` 的自动编码/解码。
- 防止你在 url 中出现打字错误。
- 绕过路径排序（如显示一个）

```typescript
//定义路由规则
const routes:Array<RouteRecordRaw>=[
    {
        path:'/',
        name: 'helloword',
        component:()=>import('../components/HelloWorld.vue')
    },
    {
        path:'/login',
        name:'login',
        component:()=>import('../components/Login.vue')
    }
]
```

router-link跳转方式需要改变 变为对象并且有对应name

```vue
 <RouterLink :to="{name:'helloword'}">HelloWord组件</RouterLink>   
 <RouterLink :to="{name:'login'}">Login组件</RouterLink>
```

**使用a标签跳转：** 缺点是会自动刷新页面

```html
<a href="/login">Login组件</a>
```

**使用编程式导航跳转：** 即通过router实例的方法进行跳转

1. 引入router的 useRouter实例

```typescript
//导入userRouter
import { useRouter } from 'vue-router'
```

2. 创建useRouter实例对象

```typescript
const router=useRouter()
```

3. 通过调用实例的方法push进行跳转

```typescript
//示例1：直接传入字符串
router.push('/login')
//示例2：传入对象
router.push({
    path: '/login'
})
//示例3：传入路由名字
router.push({
    name: 'Login'
})
```

## 历史记录

正常情况下路由跳转就留下历史记录，但是可以通过`replace`来关闭历史记录

**使用`router-link`进行路由跳转时关闭历史记录：**

直接在标签中加上`replace`

```vue
   <router-link replace to="/">HelloWord</router-link>
   <router-link replace style="margin-left:10px" to="/login">Login</router-link>
```

**使用编程式导航时关闭历史记录：**

将方法换成`replace()`

```typescript
import { useRouter } from 'vue-router'
const router = useRouter()

  router.replace("/")
```

**横跨历史：**

1. 前进历史记录： 可以通过方法`router.go( 1 )` 括号中数字是几就前进几个历史记录。
2. 后退历史记录：可以通过方法` router.back()` 

## 路由传参

1. **使用`query`进行传参:**

传参：

```typescript
//导入userRouter
import { useRouter } from 'vue-router'
//实例化对象
const router=useRouter()
//路由跳转
router.push({
        path:'/login',
        query:{id:1} //query只能接收对象类型
})
```

此时参数Id和参数的值会直接拼接在路径中`http://127.0.0.1:5173/login?id=1`

获取传递的参数：需要先引入`useRoute `

```typescript
//引入useRoute
import { useRoute } from 'vue-router';
//实例化对象
const route=useRoute()
//获取参数
const value=route.query.参数名
```

2. 使用动态路由参数传值 `params`

传参：

1. 首先修改路由配置

```json
 {
        path:'/login/:id',  //表表示要传递一个参数名为id的参数
        name:'Login',
        component:()=>import('../components/Login.vue')
    }
```

2. 进行传参

```typescript
//导入userRouter
import { useRouter } from 'vue-router'
//实例化对象
const router=useRouter()
//路由跳转
router.push({
        name:'Login',//必须是name
        params:{id:1}   //参数名必须和路由中定义的一致
})
```

此时参数会将值拼接在地址上`http://127.0.0.1:5173/login/1/2`

获取传递的参数：使用`params`来接收值

```typescript
//引入useRoute
import { useRoute } from 'vue-router';
//实例化对象
const route=useRoute()
//获取参数
const value=route.params.参数名
```

## 视图命名

命名视图可以在同一级（同一个组件）中展示更多的路由视图，而不是嵌套显示。 命名视图可以让一个组件中具有多个路由渲染出口。视图的默认名称也是 default

```typescript

const routes: Array<RouteRecordRaw> = [
    {
        path:'/listFirst',
        name:'listFirst',
        component:()=>import('../pages/transmitInfo/list-first'),
        children:[
            {
                path:'listFirstA',
                components:{
                    default:()=>import('../components/listFirstA')
                }
            },
            {
                path:'listFirstB',
                components:{
                    listFirstB1:()=>import('../components/listFirstB1'),
                    listFirstB2:()=>import('../components/listFirstB2')
                }
            }
        ]
    }
]
```

对应Router-view 通过name 对应组件

```vue
<div>
     <div>
         <router-link to='/listFirst/listFirstA'>goodsCount</router-link>
         <router-link    style="margin-left:20px;"     to='/listFirst/listFirstB'>   listFirstB</router-link>
         <hr>
         <div>
             <router-view></router-view>
             <router-view name='listFirstB1'></router-view>
             <router-view name='listFirstB12'></router-view>
         </div>              
     </div>
</div>
```

## 重定向和别名

**重定向:** 可以在路由配置中添加 `redirect: '重定向的路由地址'`  来进行路由的重定向配置

**别名：** 可以通过`alias：['/别名1', '/别名2']`   来使多个请求地址访问同一个内容

## 导航守卫

### 全局前置守卫

router.beforeEach

```js
router.beforeEach((to, form, next) => {
    console.log(to, form);
    next()
})
```

> 每个守卫方法接收三个参数：
>
> * to: Route， 即将要进入的目标 路由对象；
> * from: Route，当前导航正要离开的路由；
> * next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed (确认的)。
> * next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
> * next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。

**案例 权限判断**  在main.ts中

```typescript
//定义放行名单
const whileList = ['/']

//进行访问前拦截
router.beforeEach((to, from, next) => {
    let token = localStorage.getItem('token')  //用户成功登录后的凭证
    //白名单 有值 或者登陆过存储了token信息可以跳转 否则就去登录页面
    if (whileList.includes(to.path) || token) {
        next()
    } else {
        next({
            path:'/'
        })
    }
})
```

### 全局后置守卫

使用场景一般可以用来做loadingBar 加载动画

你也可以注册全局后置钩子，然而和守卫不同的是，这些钩子不会接受 `next` 函数也不会改变导航本身：

```typescript
router.afterEach((to,from)=>{
    
})
```

## 路由元信息

通过路由记录的 `meta` 属性可以定义路由的**元信息**。使用路由元信息可以在路由中附加自定义的数据，例如：

- 权限校验标识。
- 路由组件的过渡名称。
- 路由组件持久化缓存 (keep-alive) 的相关配置。
- 标题名称

我们可以在**导航守卫**或者是**路由对象**中访问路由的元信息数据。

**用法：**

1. 在路由配置中添加`meta`数据信息，可以自定义数据

```typescript
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Login.vue'),
      meta: {
        title: "登录"
      }
    },
    {
      path: '/index',
      component: () => import('@/views/Index.vue'),
      meta: {
        title: "首页",
      }
    }
  ]
})
```

2. 在路由配置文件中**使用TS来进行扩展**如果不使用扩展 将会是`unknow` 类型

```typescript
declare module 'vue-router' {
  interface RouteMeta {
    title: string   //声明数据的类型
  }
}
```

3. 可以在路由守卫中对数据获取并使用

```typescript
//前置路由守卫
router.beforeEach((to,from,next)=>{
    //可以通过 to.meta中设置的数据
    console.log(to.meta);
    //将获取到的meta数据进行使用
    document.title=to.meta.title
    next();
})
```

也可以使用元信息使路由加上过度特效

1. 在元信息上声明过度动画的名字，在进行扩展配置
2. 然后直接在`router-view`上进行使用

```vue
    <router-view #default="{route,Component}">
        <transition  :enter-active-class="`${route.meta.元数据中定义的过度动画参数名}`">
            <component :is="Component"></component>
        </transition>
    </router-view>
```

## 动态路由

动态路由主要通过两个函数实现。`router.addRoute()` 和` router.removeRoute()`。它们只注册一个新的路由，也就是说，如果新增加的路由与当前位置相匹配，就需要你用 `router.push() `或` router.replace() `来手动导航，才能显示该新路由

**添加路由**

```typescript
router.addRoute({ path: '后台传递的数据', component: '后台传递的数据 '})
```

**删除路由**

* 通过添加一个名称冲突的路由。如果添加与现有途径名称相同的途径，会先删除路由，再添加路由：

```typescript
router.addRoute({ path: '/about', name: 'about', component: About })
// 这将会删除之前已经添加的路由，因为他们具有相同的名字且名字必须是唯一的
router.addRoute({ path: '/other', name: 'about', component: Other })
```

* 通过调用 `router.addRoute()` 返回的回调：  当路由没有名称时，这很有用。

```typescript
const removeRoute = router.addRoute(routeRecord)
removeRoute() // 删除路由如果存在的话
```

* 通过使用 `router.removeRoute()` 按名称删除路由：

```typescript
router.addRoute({ path: '/about', name: 'about', component: About })
// 删除路由
router.removeRoute('about')
```

​      需要注意的是，如果你想使用这个功能，但又想避免名字的冲突，可以在路由中使用 `Symbol` 作为名字。

当路由被删除时，**所有的别名和子路由也会被同时删除**

**查看现有路由**

Vue Router 提供了两个功能来查看现有的路由：

- [router.hasRoute()](https://router.vuejs.org/zh/api/#hasroute)：检查路由是否存在。
- [router.getRoutes()](https://router.vuejs.org/zh/api/#getroutes)：获取一个包含所有路由记录的数组。



