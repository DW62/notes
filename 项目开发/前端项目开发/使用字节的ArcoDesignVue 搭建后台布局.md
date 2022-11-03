## 使用字节的ArcoDesignVue 搭建后台布局

主文件

```vue
<template>
    <a-layout class="layout">
        <div class="layout-navbar">
            <!-- 顶部 -->
            <NavBar />
        </div>
        <a-layout>
            <a-layout>
                <a-layout-sider class="layout-sider" breakpoint="xl" :collapsible="true" :style="{ paddingTop: '60px' }"
                    :hide-trigger="true">
                    <div class="menu-wrapper">
                        侧边菜单
                    </div>
                </a-layout-sider>
                <a-layout class="layout-content" :style="{ paddingTop:'60px',paddingLeft:'220px'}">
                    <a-layout-content>
                        <!-- 内容部分 -->
                        <PageLayout />
                    </a-layout-content>
                    <!-- 底部 -->
                    <Footer></Footer>
                </a-layout>
            </a-layout>
        </a-layout>
    </a-layout>
</template>
<script lang="ts" setup>
import NavBar from '@/components/navbar/index.vue';
import Footer from '@/components/footer/index.vue';
import PageLayout from './page-layout.vue';
</script>
<style scoped lang="scss">
.layout {
    width: 100%;
    height: 100%;
}
.layout-navbar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 60px;
}
.layout-sider {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    height: 100%;
    transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);

    &::after {
        position: absolute;
        top: 0;
        right: -1px;
        display: block;
        width: 1px;
        height: 100%;
        background-color: var(--color-border);
        content: '';
    }

    > :deep(.arco-layout-sider-children) {
        overflow-y: hidden;
    }
}
.layout-sider ::after {
    position: absolute;
    top: 0;
    right: -1px;
    display: block;
    width: 1px;
    height: 100%;
    background-color: var(--color-border);
    content: '';
}
.menu-wrapper {
    height: 100%;
    overflow: auto;
    overflow-x: hidden;
    :deep(.arco-menu) {
        ::-webkit-scrollbar {
            width: 12px;
            height: 4px;
        }
        ::-webkit-scrollbar-thumb {
            border: 4px solid transparent;
            background-clip: padding-box;
            border-radius: 7px;
            background-color: var(--color-text-4);
        }
        ::-webkit-scrollbar-thumb:hover {
            background-color: var(--color-text-3);
        }
    }
}
.layout-content {
    min-height: 100vh;
    overflow-y: hidden;
    background-color: var(--color-fill-2);
    transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
}
</style>
```

顶部组件

```vue
<template>
  <div class="navbar">
    顶部
  </div>
</template>

<script lang="ts" setup>
  
</script>

<style scoped lang="css">
  .navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
  }
</style>
```

底部组件

```vue
<template>
  <a-layout-footer class="footer">底部</a-layout-footer>
</template>

<script lang="ts" setup></script>

<style lang="css" scoped>
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: var(--color-text-2);
    text-align: center;
  }
</style>
```

内容区组件

```vue
<template>
  <div class="box" >内容部分啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊</div>
</template>

<script lang="ts" setup>

</script>

<style scoped lang="css">
  .box{
    height: 800px;
    width: 95%;
    background: wheat;
    margin: 10px auto;
  }
</style>
```

## 效果

![image-20221103165725700](https://raw.githubusercontent.com/DW62/ImgStg/master/202211031657780.png)

滚动滚动条顶部和侧边菜单不受影响。