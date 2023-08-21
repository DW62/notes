<!-- 标签导航组件 -->
<template>
    <div id="tags-view-container" class="tags-view-container">
        <el-tabs v-model="tStore.activeKey" type="card" class="demo-tabs" closable @tab-remove="removeTab"
            @tab-click="clickTag">
            <el-tab-pane v-for="item in tStore.tagList" :label="item.name" :name="item.path"></el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from "vue"
import { useRouter } from 'vue-router'
import { tagStore } from '@/store/tagStore'

const router = useRouter()
const tStore = tagStore();
// 监听当前路由变化
watch(() => router.currentRoute.value,
    () => {
        //添加标签
        addTab()
    }
);
//页面刷新执行的方法
onMounted(() => {
    //添加标签
    addTab()
})

//添加标签
const addTab = () => {
    let path = router.currentRoute.value.fullPath
    let name = router.currentRoute.value.meta.title + ""
    //添加tag
    tStore.addTagItem(name, path)
    //设置默认激活tag
    tStore.activeKey = path
}
//移除标签
const removeTab = (targetName: string) => {
    //要删除的tag
    let selectedkey = targetName
    //当前的tag
    let currentKey = router.currentRoute.value.fullPath;
    tStore.closeCurrent(selectedkey, currentKey)
}
//点击标签
const clickTag = (tab: any) => {
    //路由跳转
    router.push({ path: tab.props.name })
}
</script>
<style lang="scss" scoped>
.tags-view-container {
    height: 34px;
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

    .el-tabs {
        --el-tabs-header-height: 34px;
    }
}
</style>