# Vite配置使用Svg

**第一步：**

安装 vite-plugin-svg-icons

```
npm i vite-plugin-svg-icons -D
```

**第二步：**

在main.js或者main.ts中进行引用

```typescript
import 'virtual:svg-icons-register'
```

**第三步：**

在项目中建立一个文件夹用来存放svg图片文件

这里创建在 src/assets/icons文件夹下

**第四步：**

在vite.config.js中进行配置

```typescript
//import path,{ resolve } from 'path'
import path from 'path'
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
 
export default defineConfig((command) => {
 return {
    plugins: [
      createSvgIconsPlugin({
        // 指定要缓存的文件夹，和上步创建的文件夹一致
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      })
    ],
  }
})
```

**第五步：**

封装一个svg组件

```html
sizecolorname<!-- svg图标组件 -->
<template>
  <svg
    aria-hidden="true"
    :class="svgClass"
    :style="{ color: color, fill: color, width: iconSize, height: iconSize }"
  >
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script setup lang="ts" name="SvgIcon">
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: ''
  },
  size: {
    type: [Number, String],
    default: 20
  }
})

// 判断传入的值，是否带有单位，如果没有，就默认用px单位
const getUnitValue = (value: string | number): string | number => {
  return /(px|em|rem|%)$/.test(value.toString()) ? value : value + 'px'
}
//计算宽度
const iconSize = computed<string | number>(() => {
  return getUnitValue(props.size)
})

const iconName = computed<string>(() => `#icon-${props.name}`)
//设置名字
const svgClass = computed<string>(() => {
  if (props.name) return `svg-icon icon-${props.name}`
  return 'svg-icon'
})
</script>

<style lang="scss" scoped>
.svg-icon {
  width: auto;
  height: auto;
  // fill: currentColor;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
```

>  该组件对外暴露三参数，
> 
> 1. name必须传递，指svg文件的名字，名字必须和存放在svg文件夹下的文件名字一致
> 2. color可以不传递，默认值为空，用来设置svg的颜色
> 3. size可以不传递，默认值为20，用来设置svg大小

此时就可以通过引入来进行使用

**按需引入使用**

```html
<template>
  <SvgIcon :size="24" :name="a"></SvgIcon>
</template>
<script setup>
import SvgIcon from "@/components/SvgIcon.vue";
</script>
```

**全局引入使用**

```typescript
import svgIcon from './components/svgIcon/index.vue'
createApp(App).component('svg-icon', svgIcon)
```
