# pinia

## pinia介绍

![image-20220828121445101](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220828121445101.png)

> pinia是用来替代vuex的

Pinia.js 有如下特点：

* 完整的 ts 的支持；
* 足够轻量，压缩后的体积只有1kb左右;
* 去除 mutations，只有 state，getters，actions；
* actions 支持同步和异步；
* 代码扁平化没有模块嵌套，只有 store 的概念，store 之间可以自由使用，每一个store都是独立的
* 无需手动添加 store，store 一旦创建便会自动添加；
* 支持Vue3 和 Vue2

官方文档[Pinia](https://pinia.vuejs.org/)

git 地址 https://github.com/vuejs/pinia

## 使用pinia

1. **安装依赖**

```bash
npm install  pinia -s
```

2. **在min.ts中引用和使用**

   * 在vue3中引入

     ```typescript
     //引入pinia
     import {createPinia } from 'pinia'
     
     const store=createPinia();
     
     let app=createApp(App)
     app.use(store)
     app.mount('#app')
     ```

     * 在vue2中引入

     ```typescript
     import { createPinia, PiniaVuePlugin } from 'pinia'
      
     Vue.use(PiniaVuePlugin)
     const pinia = createPinia()
      
     new Vue({
       el: '#app',
       pinia,
     })
     ```

## 初始化Store仓库

首先在`src`下建一个文件夹`store`，然后在文件夹下创建一个pinia的文件

```typescript
//pinia文件
//引入pinia
import { defineStore} from 'pinia'

//useTserStore表示要暴露出的对象名可以为任意
//test相当于id作为唯一标识，可以自定义任意值
export const useTserStore=defineStore('test',{
    //state必须是一个箭头函数
    state:()=>{
        return{
            count:1  //参数
        }
    },
    //类似于computed 可以帮我们修饰值
    getters:{

    },
    //可以操作异步和异步提交store，通常用来编写方法改变参数值
    actions:{

    }
})
```

在组件中引入pinia文件，就可以获取`store`中的值

```vue
<template>
  		<!-- 从声明的变量中中直接获取值 -->
  		pinia：{{ Test.count}}
</template>
<script setup lang="ts">
		//引入pinia文件暴露出来的对象，和pinia文件中的一致
		import { useTserStore} from './store'
		//声明变量
		const Test=useTserStore()
</script>
<style scoped>
</style>
```

## 修改Store中参数的值

1. Store中参数的值是可以直接进行修改的` Test.count++`。
2. 通过实例的`$patch`方法批量修改多个值。

```typescript
    Test.$patch({
       count:200,
       age:300
    })
```

3. 通过使用函数来进行修改 ⭐推荐使用这个方法

```typescript
//state 就表示pinia文件中定义的所以参数的对象，名字可以是任意不一定要是state
Test.$patch((state)=>{
      state.count++
  })
```

4. 通过原始对象修改整个实例。`$state`您可以通过将store的属性设置为新对象来替换store的整个状态，缺点就是必须修改整个对象的所有属性

```typescript
  Test.$state = {
       count:10,
       age:30
    }  
```

5. 通过actions修改。先在pinia文件的action中定义方法，然后在组件中调用方法进行值的修改

```typescript
//pinia文件的action中方法
     actions:{
         setCurrent () {
             this.current++
         }
     }

//组件中 
Test.setCurrent()
```

## 解构store

直接解构Pinia是会失去响应性的

解决方案可以使用 storeToRefs

```typescript
import { storeToRefs } from 'pinia'
 
const Test = useTestStore()
 
const { current, name } = storeToRefs(Test)
```

其原理跟toRefs 一样的给里面的数据包裹一层toref

## pinia其他API

* `$reset`：用来重置参数值，时期回到初始状态
* `$subscribe`： 当参数值改变时就会触发该函数
* `$onAction`：当action中方法被调用就触发这个函数

## pinia 数据持久化插件

pinia 和 vuex 都有一个通病 页面刷新状态会丢失，我们可以写一个pinia 插件缓存他的值

```typescript
//定义key  值和变量名任意
const __piniaKey = '__PINIAKEY__'

 //声明传人key的类型
type Options = {
   key?:string
}

//将数据存在本地方法
const setStorage = (key: string, value: any): void => {
       localStorage.setItem(key, JSON.stringify(value))
}
 
//存缓存中读取数据方法
const getStorage = (key: string) => {
	return (localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) as string) : {})
}
 
//利用函数柯丽华接受用户入参
const piniaPlugin = (options: Options) => {
 		//将函数返回给pinia  让pinia  调用 注入 context
		return (context: PiniaPluginContext) => {
			const { store } = context;
            	//获取存入的值
			const data = getStorage(`${options?.key ?? __piniaKey}-${store.$id}`)
            	//当值发生改变将就执行该方法
			store.$subscribe(() => {
					setStorage(`${options?.key ?? __piniaKey}-${store.$id}`, toRaw(store.$state));
			})
 			//返回值覆盖pinia 原始值
			return {...data	} 
		} 
}）
 
//初始化pinia
const pinia = createPinia()
 
//注册pinia 插件
pinia.use(piniaPlugin({
	key: "pinia"

}))
```

