## 使用字节的ArcoDesignVue 搭建后台布局

主文件

```vue
<template>
    <a-layout class="layout">
        <div class="layout-navbar">
            <!-- 顶部 -->
            <Head></Head>
        </div>
        <a-layout>
            <a-layout>
                <a-layout-sider class="layout-sider" :style="{ paddingTop: '60px',paddingLeft: '0px'}" breakpoint="lg"
                    collapsible :collapsed="collapsed" @collapse="onCollapse">
                    <div class="menu-wrapper">
                        <Menu></Menu>
                    </div>
                </a-layout-sider>
                <a-layout class="layout-content" :style="contentPaddingStyle">
                    <a-layout-content>
                        <!-- 内容部分 -->
                        <Content />
                    </a-layout-content>
                    <!-- 底部 -->
                    <Footer></Footer>
                </a-layout>
            </a-layout>
        </a-layout>
    </a-layout>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
//引入头部组件
import Head from './components/head.vue';
//引入底部组件
import Footer from './components/footer.vue';
//引入内容区组件
import Content from './components/content.vue';
//引入菜单组件
import Menu from './components/menu.vue'
export default defineComponent({
    components: {
        Head,
        Footer,
        Content,
        Menu
    },
    setup() {
        //定义内容区样式
        const contentPaddingStyle=reactive({
            paddingTop: '60px',
            paddingLeft: '200px'
        })
        //定义菜单是否折叠
        const collapsed = ref(false);
        //点击菜单折叠按时时触发
        const onCollapse = (val: boolean, type: string) => {
            collapsed.value = val;
            if(val){
                //折叠时
                contentPaddingStyle.paddingLeft='50px'
            }else{
                //展开时
                contentPaddingStyle.paddingLeft='200px'
            }
        }
        return {
            collapsed,
            onCollapse,
            contentPaddingStyle
        }
    }
})
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
    // width: 1px;
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

菜单组件

```vue
<!-- 菜单组件 -->
<template>
    <div class="menu-demo">
        <a-menu :style="{ width: '100%', height: '100%' }">
            <a-sub-menu key="0">
                <template #icon>
                    <icon-apps></icon-apps>
                </template>
                <template #title>Navigation 1</template>
                <a-menu-item key="0_0">Menu 1</a-menu-item>
                <a-menu-item key="0_1">Menu 2</a-menu-item>
            </a-sub-menu>
        </a-menu>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
    IconMenuFold,
    IconMenuUnfold,
    IconApps,
    IconBug,
    IconBulb,
} from '@arco-design/web-vue/es/icon';

export default defineComponent({
    components: {
        IconMenuFold,
        IconMenuUnfold,
        IconApps,
        IconBug,
        IconBulb,
    },
    setup() {
        return {
            
        }
    }
})
</script>

<style scoped>
.menu-demo {
    box-sizing: border-box;
    width: 100%;
    height:100% ;
    background-color: var(--color-neutral-2);
}
</style>
```

## 效果

![image-20221103165725700](https://raw.githubusercontent.com/DW62/ImgStg/master/202211031657780.png)

滚动滚动条顶部和侧边菜单不受影响。