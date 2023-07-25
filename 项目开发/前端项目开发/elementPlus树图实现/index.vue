<template>
    <h1>普通树图单选框</h1>
    <el-tree-select v-model="value1" :data="data" :render-after-expand="false" clearable check-strictly />
    {{ value1 }}
    <el-divider />
    <h1>多选树图框</h1>
    <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
    <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
    <el-checkbox v-model="menuCheckStrictly" @change="handleCheckedTreeConnect($event)">父子联动</el-checkbox>
    <el-tree class="tree-border"  :data="data" show-checkbox
        ref="menu" node-key="value" empty-text="加载中，请稍候" :check-strictly="!menuCheckStrictly"></el-tree>

    <el-button type="primary" @click="getData">获取树图选中数据</el-button>
    {{ value2 }}
    <el-divider />
</template>

<script setup lang="ts">
import { ElTree } from "element-plus/lib/components/index.js";
import { ref } from 'vue'
//普通树图单选框值
const value1 = ref()
//多选树图框值
const value2 = ref<number[]>([])
//菜单树折叠展开状态
const menuExpand = ref(false)
//菜单树全选/全不选状态
const menuNodeAll = ref(false)
//菜单树是否父子联动
const menuCheckStrictly = ref(false)
//菜单树ref
const menu = ref<InstanceType<typeof ElTree>>()
const data = [
    {
        value: 1,
        label: "系统管理",
        children: [
            {
                value: 102,
                label: "角色管理",
                children: [
                    {
                        value: 2008,
                        label: "角色查询"
                    },
                    {
                        value: 2009,
                        label: "角色新增"
                    },
                    {
                        value: 2010,
                        label: "角色修改"
                    },
                    {
                        value: 2011,
                        label: "角色删除"
                    },
                    {
                        value: 2012,
                        label: "角色导出"
                    }
                ]
            },
            {
                value: 103,
                label: "菜单管理",
                children: [
                    {
                        value: 2000,
                        label: "菜单查询"
                    },
                    {
                        value: 2001,
                        label: "菜单新增"
                    },
                    {
                        value: 2002,
                        label: "菜单删除"
                    },
                    {
                        value: 2004,
                        label: "修改菜单"
                    }
                ]
            },
            {
                value: 105,
                label: "字典管理",
                children: [
                    {
                        value: 1040,
                        label: "字典查询"
                    },
                    {
                        value: 1041,
                        label: "字典新增"
                    },
                    {
                        value: 1042,
                        label: "字典修改"
                    }
                ]
            }
        ]
    }
]
// 树权限（展开/折叠）
const handleCheckedTreeExpand = (value: any) => {
    //所有节点value数组
    let valueArry = readNodes(data, [])
    for (let i = 0; i < valueArry.length; i++) {
        menu.value.store.nodesMap[valueArry[i]].expanded = value;
    }
}
// 树权限（全选/全不选）
const handleCheckedTreeNodeAll = (value: boolean) => {
    //所有节点value数组
    let valueArry = readNodes(data, [])
    menu.value!.setCheckedKeys((value ? valueArry : []), false)
}
// 树权限（父子联动）
const handleCheckedTreeConnect = (value: boolean) => {
    menuCheckStrictly.value = value ? true : false;
}
//获取树图选中数据
const getData=()=>{
    //获取所有选中菜单的id
    value2.value = menu.value!.getCheckedKeys(false)
}
//遍历树图获取所有节点的value值
const readNodes = (nodes: any[], arr: number[]) => {
    for (let item of nodes) {
        arr.push(item.value)
        if (item.children && item.children.length) readNodes(item.children, arr)
    }
    return arr
}

</script>

<style scoped></style>