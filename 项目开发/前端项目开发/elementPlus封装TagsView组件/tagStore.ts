//标签页相关
import { defineStore } from "pinia"
import router from "@/router"
import { ElMessage } from "element-plus/lib/components/index.js"

// 导航标签项
interface NavTabItem { name: string, path: string }
//默认标签数据
const defaultTabItem: NavTabItem = { name: '首页', path: '/dashboard' }
//定义tagStore类型
export type TagStore = {
    tagList: any[], // 保存页签tab的数组
    activeKey: string,//默认激活的tag,和选中的菜单
}
//定义store
export const tagStore = defineStore('tagStore', {
    state: (): TagStore => {
        return {
            tagList: [defaultTabItem], // 保存页签tab的数组
            activeKey: defaultTabItem.path,//默认激活的tag,和选中的菜单
        }
    },
    actions: {
        //添加tag
        addTagItem(name: string, path: String) {
            //判断当前路由是否存在于tag数组中，存在就返回true，否则返回false
            var result = this.tagList.some(n => {
                if (n.path == path) {
                    return true
                }
            })
            if (!result) {
                this.tagList.push({ name: name, path: path })
            }
        },
        //关闭当前tag，参数1：要删除的key，参数2：当前key
        closeCurrent(key: string, currentKey: string) {
            //当前要删除的key不是首页
            if (key != "/dashboard") {
                let tagPath: string[] = []
                //将路由转换为数组
                this.tagList.forEach((item) => {
                    tagPath.push(item.path)
                })
                //获取要删除key的下标
                let index = tagPath.indexOf(key)
                if (key == currentKey) {
                    //要删除当前tag
                    //删除数据
                    this.tagList.splice(index, 1)
                    //路由跳转
                    router.push({ path: tagPath[index - 1] })
                } else {
                    //要删除其他tag
                    //删除数据
                    this.tagList.splice(index, 1)
                }
            } else {
                //信息提示
                ElMessage({ message: "首页不能关闭", type: 'warning' })
            }
        },
        //关闭所有tag方法
        closeAllTag() {
            let tagPath: string[] = []
            //将路由转换为数组
            this.tagList.forEach((item) => {
                tagPath.push(item.path)
            })
            //删除数据
            this.tagList.splice(1, tagPath.length - 1)
            //路由跳转
            router.push({ path: tagPath[0] })
        },
        //关闭当前tag,参数：要保留的key
        closeOtherTags(key: string) {
            if (key != "/dashboard") {
                let tagPath: string[] = []
                let newTageList: NavTabItem[] = []
                //将路由转换为数组
                this.tagList.forEach((item) => {
                    tagPath.push(item.path)
                })
                //获取要要保留的key的下标
                let index = tagPath.indexOf(key)
                newTageList.push(this.tagList[0])
                newTageList.push(this.tagList[index])
                //将数据替换
                this.tagList = newTageList
            } else {
                this.closeAllTag()
            }
        },
    }
})