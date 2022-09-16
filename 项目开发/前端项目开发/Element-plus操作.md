# Element-plus操作

## 菜单

### 去除菜单右边竖线

默认请情况下使用element-plus的demo搭建的菜单，菜单右边有一条竖线

**效果:**

![image-20220906125653807](https://raw.githubusercontent.com/DW62/ImgStg/master/202209061256895.png)

实际上是因为el-menu有个右边框，将右边框去除就可以了

```css
.el-menu {
      border-right: 0;
    }
```

