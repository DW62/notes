# Vite+Vue3封装axios

## 引入依赖

```bash
npm install axios
```

## 配置

### 首先创建一个axios的配置文件

```typescript
//axios配置文件
//引入axios
import axios from "axios";
//引入路由
import router from "../router";

//创建axios实例
const instance = axios.create({
    // baseURL:'http://localhost:9090/',
    timeout: 5000  //设置超时时间
})

//请求拦截器
instance.interceptors.request.use(config => {
    //获取请求信息
    console.log(config);
    return config
}, error => {
    //请求失败信息
    //console.log(error)
    return Promise.reject(error)
})

//响应拦截器
instance.interceptors.response.use(response => {
    //console.log(response.data); 响应数据
    console.log("响应状态码=" + response.status);
    return response.data
}, error => {
    switch (error.response.status) {
          //根据状态进行错误页面跳转
        case 404:
            console.log("404啦")
            router.push({path:'/404'})
            break
        default:
            return Promise.reject(error)
    }
    return Promise.reject(error)
})

export default instance
```

### 对axios请求进行封装

```typescript
//封装axios请求
import instance from '../config/axiosConfig'
//定义一个configType类型
type configType = {
    method: string
    url: string
    [x: string]: any
}
const http = {
    get(url: string, params?: any) {
        const config: configType = {
            method: 'get',
            url: url,
        }
        //如果参数存在则将参数赋值
        if (params) config.params = params
        return instance(config)
    },
    post(url: string, params?: any) {
        const config: configType = {
            method: 'post',
            url: url,
        }
        if (params) config.data = params
        return instance(config)
    },
    put(url: string, params: any) {
        const config: configType = {
            method: 'put',
            url: url,
        }
        //如果参数存在则将参数赋值
        if (params) config.params = params
        return instance(config)
    },
    delete(url: string, params: any) {
        const config: configType = {
            method: 'delete',
            url: url,
        }
        //如果参数存在则将参数赋值
        if (params) config.params = params
        return instance(config)
    },
}
export default http
```

### 创建api文件来对方法进行使用

```typescript
import http from '../util/httpUtil'

export function getTest(params:any){
    return http.get('/api/image/getImageById',params)
}
```

> 后台需要表单提交时可以通过 FoemDate() 将数据封装起来，然后在使用post方法来执行。

```ts
let formData = new FormData();
formData.append('username', loginform.emali);
formData.append('password', loginform.password);
```

### 在页面进入方法

```vue
<script lang="ts">
import { defineComponent, onMounted } from 'vue'
//引入方法
import {getTest} from '../../api/test'
export default defineComponent({
    name:'Workbench',
    setup () {
        onMounted(()=>{
            getTest({id:1}).then((res)=>{
                console.log(res);
            }).catch(error=>{
                console.log(error);
            }),
        })
        return {}
    }
})
</script>
```

### 在vite.config.ts文件中进行跨越配置

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    port:8888,
    proxy:{  //解决跨域
      '/api':{
        target:'http://localhost:9090/', //后端真正地址
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/api/,'')
      }
    }
  }
})
```

