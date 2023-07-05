# 导入导出Excel

> 后端：SpringBoot+EasyExcel
>
> 前端：Vue3+axios

## 后端

### 引入依赖

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>easyexcel</artifactId>
    <version>3.1.3</version>
</dependency>
```

### 在实体类上添加注解

```java
@Data
@EqualsAndHashCode(callSuper = false)
public class SysConfig implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 参数主键
     * ExcelProperty用来设置导出的excel表头
     * ColumnWidth(15) 用来设置excel单元格宽带
     */
    @TableId(value = "config_id", type = IdType.AUTO)
    @ExcelProperty("编号")
    @ColumnWidth(15)
    private Integer configId;

    /**
     * 参数名称
     */
    @ExcelProperty("参数名称")
    @ColumnWidth(30)
    private String configName;

    /**
     * 参数键名
     */
    @ExcelProperty("参数键名")
    @ColumnWidth(30)
    private String configKey;

    /**
     * 参数键值
     */
    @ExcelProperty("参数键值")
    @ColumnWidth(15)
    private String configValue;

    /**
     * 删除标志（0x存在 1删除）
     * ExcelIgnore表示不导出
     */
    @ExcelIgnore
    private String delFlag;
}
```

### 导出

#### 导出工具类

```java
/**
 * easyExcel工具类
 * @author DW  @date 2023/07/03 15:03
 */
public class ExcelUtil {

    /**
     * 导出excel
     * @param response  响应
     * @param data      数据
     * @param fileName  文件名称
     * @param sheetName 表名字
     * @param clazz     clazz
     * @throws IOException io异常
     */
    public static void writeExcel(HttpServletResponse response, List<? extends Object> data,String fileName,String sheetName,Class clazz) throws IOException {
        //表头样式设置
        WriteCellStyle headWriteCellStyle=new WriteCellStyle();
        //设置表头剧中对齐
        headWriteCellStyle.setHorizontalAlignment(HorizontalAlignment.CENTER);
        //设置内容样式
        WriteCellStyle contentWriteCellStyle=new WriteCellStyle();
        //设置内容靠左对齐
        contentWriteCellStyle.setHorizontalAlignment(HorizontalAlignment.LEFT);
        HorizontalCellStyleStrategy horizontalCellStyleStrategy=new HorizontalCellStyleStrategy(headWriteCellStyle,contentWriteCellStyle);
        EasyExcel.write(getOutPutStream(fileName,response),clazz).excelType(ExcelTypeEnum.XLSX)
                .sheet(sheetName).registerWriteHandler(horizontalCellStyleStrategy)
                .doWrite(data);
    }

    /**
     * 设置响应头
     * @param fileName 文件名称
     * @param response 响应
     * @return {@link OutputStream}
     * @throws IOException ioexception
     */
    private static OutputStream getOutPutStream(String fileName,HttpServletResponse response) throws IOException {
        fileName= URLEncoder.encode(fileName,"UTF-8");
        response.setContentType("application/vnd.ms-excel");
        response.setCharacterEncoding("utf8");
        response.setHeader("Content-Disposition", "attachment;filename=" + fileName + ".xlsx");
        return response.getOutputStream();
    }
}
```

#### 具体接口实现

```java
/**
 * 根据条件导出数据
 * @param response  response
 * @param configListSearchBody 列表搜索条件对象
 * @return
 */
@GetMapping("/export")
public void export(HttpServletResponse response, ConfigListSearchBody configListSearchBody) {
    sysConfigService.export(response,configListSearchBody);
}    
```

```java
/**
 * 导出数据
 * @param response             响应
 * @param configListSearchBody 列表搜索条件对象
 * @return {@link Result}
 */
 void export(HttpServletResponse response, ConfigListSearchBody configListSearchBody);
```

```java
 /**
  * 导出数据
  * @param response             响应
  * @param configListSearchBody 列表搜索条件对象
  * @return {@link Result}
  */
@Override
public void export(HttpServletResponse response, ConfigListSearchBody configListSearchBody) {
   try {
      //根据条件查询数据
      Page<SysConfig> configPage= selectConfigPage(configListSearchBody);
      List<SysConfig> configList=configPage.getRecords();
      //通过工具类调用导出excel方法
      ExcelUtil.writeExcel(response,configList,"配置列表","配置列表",SysConfig.class);
   }catch (IOException e){
      //重置response
      response.reset();
      ServletUtils.renderString(response, JSON.toJSONString(Result.error()));
      throw new RuntimeException(e);
   }
}
```

### 导入

```java
 /**
  * 导入数据
  * @param file 文件
  * @return {@link Result}
  */
@PostMapping("/import")
public Result importDate(MultipartFile file){
    return sysConfigService.importDate(file);
}
```

```java
/**
 * 导人数据
 * @param file 文件
 * @return {@link Result}
 */
 Result importDate(MultipartFile file);
```

```java
/**
 * 导入数据
 * @param file 文件
 * @return {@link Result}
 */
@Override
public Result importDate(MultipartFile file) {
   List<SysConfig> configExcelList=null;
   //1.读取excel数据
   try {
       //读取excle文件
       configExcelList=EasyExcel.read(new BufferedInputStream(file.getInputStream()))
                    .head(SysConfig.class).sheet().doReadSync();
   } catch (IOException e) {
         throw new RuntimeException("Excel数据读取出现错误");
   }
   //判断数据条数
   if (configExcelList.size()>30){
       throw new RuntimeException("Excel数据量超过最多处理条数");
   }
   //将读取的list转换为数据库对应的对象list
   List<ConfigAddAndEditBody> list = excelListToList(configExcelList);
   //调用新增方法进行新增
   for (ConfigAddAndEditBody config:list) {
       //新增方法
        insertConfig(config);
   }
   return Result.success();
}
```

## 前端

安装axios 和 qs

```bash
npm install axios
npm install --save @types/qs
npm i qs -S
```

### 封装Axios

```typescript
//axios配置
import { getToken } from '@/utils/auth';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus/lib/components/index.js';
import qs from 'qs';

//定义后端返回状态码、
export enum StatusCode {
    NoAuth = 403,//没有权限
    Success = 200//返回成功
}
//返回值类型
export interface Result<T = any> {
    code: number,
    msg: string,
    data: T
}

//定义request类
class request {
    //axios实例
    private instance: AxiosInstance;
    //构造函数初始化值
    constructor(config: AxiosRequestConfig) {
        //创建axios
        this.instance = axios.create(config);
        //拦截器
        this.interceptors();
    }

    //拦截器
    private interceptors() {
        //请求之前拦截 来添加token
        this.instance.interceptors.request.use((config: any) => {
            //配置token,从sessionStorage中获取
            let token = getToken();
            //token存在放入请求头中
            if (token) {
                config.headers = {
                    ...config.headers,
                    Authorization: token
                }
            }
            return config;
        }, (error: any) => {
            //错误抛出到业务代码
            error.data = {}
            error.data.msg = '服务器异常，请联系管理员！'
            return error
        })

        //请求返回之后处理
        this.instance.interceptors.response.use((res: any) => {
            if (res && res.data) {
                const data = res.data;
                if (data.code == StatusCode.NoAuth) {
                    //token过期清空sessionStorage数据
                    sessionStorage.clear();
                    //跳转到登录
                    window.location.href = '/login'
                } else if (data.code == StatusCode.Success || res.status == StatusCode.Success) {
                    return res;
                } else {
                    ElMessage.error(data.msg || '服务器出错！')
                    return res || null
                }
            }
        }, (error) => {
            console.log('进入错误')
            if (error && error.response) {
                error.data = {};
                switch (error.response.status) {
                    case 400:
                        error.data.msg = '错误请求';
                        ElMessage.error(error.data.msg)
                        break
                    case 401:
                        error.data.msg = '未授权，请重新登录';
                        ElMessage.error(error.data.msg)
                        break
                    case 403:
                        error.data.msg = '拒绝访问';
                        ElMessage.error(error.data.msg)
                        break
                    case 404:
                        error.data.msg = '请求错误,未找到该资源';
                        ElMessage.error(error.data.msg)
                        break
                    case 405:
                        error.data.msg = '请求方法未允许';
                        ElMessage.error(error.data.msg)
                        break
                    case 408:
                        error.data.msg = '请求超时';
                        ElMessage.error(error.data.msg)
                        break
                    case 500:
                        error.data.msg = '服务器端出错';
                        ElMessage.error(error.data.msg)
                        break
                    case 501:
                        error.data.msg = '网络未实现';
                        ElMessage.error(error.data.msg)
                        break
                    case 502:
                        error.data.msg = '网络错误';
                        ElMessage.error(error.data.msg)
                        break
                    case 503:
                        error.data.msg = '服务不可用';
                        ElMessage.error(error.data.msg)
                        break
                    case 504:
                        error.data.msg = '网络超时';
                        ElMessage.error(error.data.msg)
                        break
                    case 505:
                        error.data.msg = 'http版本不支持该请求';
                        ElMessage.error(error.data.msg)
                        break
                    default:
                        error.data.msg = `连接错误${error.response.status}`;
                        ElMessage.error(error.data.msg)
                }
            } else {
                error.data.msg = "连接到服务器失败";
                ElMessage.error(error.data.msg)
            }
            return error
        })
    }
    
    //封装导出excel参数传递和get一样
    getExport<T = any>(url: string, parms?: any): Promise<Result<T>> {
        return new Promise((resolve, reject) => {
            this.instance.get<T>(url, {
                params: parms,
                responseType: 'blob',
                paramsSerializer: (parms) => {
                    return qs.stringify(parms)
                }
            }).then((res) => {
                resolve(res as any)
            }).catch((error) => {
                reject(error)
            })
        })
    }
    //导入Excel方法
    postImport<T = any>(url: string, parms: any): Promise<Result<T>> {
        return new Promise((resolve, reject) => {
            this.instance.post(url, parms, {
                params: parms,
                headers: {
                    'Content-Type': 'multipart/from-data'
                }
            }).then((res) => {
                resolve(res.data as any)
            }).catch((error) => {
                reject(error)
            })
        })
    }
}
export default request;
```

```typescript
import request from "./request";

const http=new request({
    baseURL:'http://localhost:8090',//后端地址
    timeout:10000
})

export default http;
```

### 对接后端接口

```typescript
import http from "@/http/http";
import { ConfigAddAndEditModel, ConfigListParm } from "./ConfigModel";
import { DeleteParm } from "@/type/BastType";

enum Api {
    //导出接口
    export = '/system/config/export',
    //导入接口
    import = '/system/config/import'
}
//导出数据接口
export const exportApi = async (parm: ConfigListParm) => {
    return await http.getExport(Api.export, parm)
}
//导入数据接口
export const importApi = async (parm: any) => {
    return await http.postImport(Api.import, parm)
}
```

### 具体导出方法

```typescript
//导出方法
const exportBtn = async (parm: ConfigListParm) => {
   exportApi(parm).then(res => {
       let blob = new Blob([res.data], { type: 'application/xlsx' })
       let url = window.URL.createObjectURL(blob)
       const link = document.createElement('a') // 创建a标签
       link.href = url
       link.download = '配置列表.xlsx' // 重命名文件
       link.click()
       URL.revokeObjectURL(url)
   })
}
```

### 具体导入方法

封装导入组件

```vue
<template>
    <el-dialog title="参数导入" v-model="visible" width="400px" append-to-body>
        <el-upload ref="uploadRef" class="upload-demo" drag action="" :http-request="uploadFun"
            :before-upload="beforeUpload" multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传后缀是.xlsx的文件，且不超过20M</div>
        </el-upload>
    </el-dialog>
</template>

<script setup lang="ts">
import useImportDialog from '@/composables/config/useImportDialog';
//接收父组件的方法
const emit = defineEmits(['getList'])
const { visible, uploadRef, onShow, beforeUpload, uploadFun } = useImportDialog(emit)
//暴露出去
defineExpose({
    onShow
})

</script>

<style scoped></style>
```

具体方法

```typescript
import { importApi } from "@/api/config/config";
import useInstance from "@/hooks/useInstance";
import { UploadInstance } from "element-plus/lib/components/index.js";
import { ref } from "vue";

export default function useImportDialog(emit: any) {
    const { global } = useInstance()
    //上传组件ref
    const uploadRef = ref<UploadInstance>()
    // 是否显示弹出层
    const visible = ref(false)
    //上传之前操作
    const beforeUpload = (file: { name: string; size: number; }) => {
        let extension = file.name.substring(file.name.lastIndexOf('.') + 1);
        let size = file.size / 1024 / 1024;
        if (extension !== 'xlsx') {
            global.$message({ message: "只能上传后缀是.xlsx的文件", type: 'warning' })
        }
        if (size > 20) {
            global.$message({ message: "文件大小不得超过20M", type: 'warning' })
        }
    }
    //上传之后操作
    const uploadFun = async (param: any) => {
        let formData = new FormData()
        formData.append('file', param.file)
        let res = await importApi(formData)
        if (res && res.code == 200) {
            //提示信息
            global.$message({ message: res.msg, type: 'success' })
            //移除上传列表
            uploadRef.value!.clearFiles()
            //关闭弹窗
            onClose()
            //刷新列表
            emit('getList')
        }
    }
    //展示
    const onShow = () => {
        //打开弹窗
        visible.value = true;
    }
    //关闭
    const onClose = () => {
        visible.value = false;
    }
    return {
        uploadRef,
        visible,
        onShow,
        beforeUpload,
        uploadFun
    }
}
```



