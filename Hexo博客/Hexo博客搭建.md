# Hexo博客搭建

> 前提条件
>
>  	1. 安装Node.js   [Node.js 下载地址](https://nodejs.org/en/)       查看版本命令：node -v
>  	1. 安装 git   [Git 下载地址](https://git-scm.com/downloads)    查看版本命令：git -v

## hexo的安装和本地运行

安装命令

```bash
npm install hexo-cli -g
```

选择一个文件夹进行hexo的初始化

```bash
hexo init
```

如果出现下面的情况，在执行一遍 hexo init

![image-20230223144602231](https://raw.githubusercontent.com/DW62/ImgStg/master/202302231446327.png)

出现下面情况说明成功

![image-20230223145138874](https://raw.githubusercontent.com/DW62/ImgStg/master/202302231451920.png)

安装 hexo 部署到 git page 的插件

```bash
npm install hexo-deployer-git --save
```

此时文件夹中就会生成很多文件

![image-20230223145650504](https://raw.githubusercontent.com/DW62/ImgStg/master/202302231456555.png)

运行查看

```bash
hexo generate
hexo server
```

此时就可以通过浏览器访问 http://localhost:4000/ 来进行查看，效果如下图

![image-20230223150002137](https://raw.githubusercontent.com/DW62/ImgStg/master/202302231500354.png)

## 给Hoxe安装butterfly主体

1. 在文件夹的根目录下面执行命令下载要使用的主体，这里使用`butterfly` butterfly 主题官网: https://butterfly.js.org/  。 Hexo  [主题商店](https://hexo.io/themes/)

   ```bash
   git clone -b master https://github.com/jerryc127/hexo-theme-butterfly.git themes/butterfly
   ```

2. 在hexo的配置文件_config.yml 中 声明要使用的主体

   ```yml
   ## 生命要使用的主体
   theme: butterfly
   ```

3. 安装渲染插件

   ```bash
   npm install hexo-renderer-pug hexo-renderer-stylus --save
   ```

4. 在根目录下新建一个`_config.butterfly.yml`的文件用来配置butterfly主体的设置，并把butterfly主体文件中的配置文件`_config.yml`复制一份到新建的文件中

5. 依次执行命令运行查看效果

   ```bash
   hexo cl
   hexo g
   hexo s
   ```

通过浏览器访问运行地址如果出现下图情况说明`butterfly主体`使用成功

![image-20230223152751839](https://raw.githubusercontent.com/DW62/ImgStg/master/202302231527942.png)

## Hexo 优化

### 配置文章链接转数字或字母

> https://github.com/rozbo/hexo-abbrlink     提升你的文章在搜索引擎中的自然排名

安装依赖：

```bash
npm install hexo-abbrlink --save
```

在配置文件`_config.yml`中进行配置

```yml
permalink: posts/:abbrlink.html  ## 设置文章链接转数字或字母
## 在配置文件最下面添加
abbrlink:
  alg: crc32      #support crc16(default) and crc32
  rep: hex        #support dec(default) and hex
```

### 添加本地文章搜索依赖

> https://github.com/wzpan/hexo-generator-search

安装依赖：

```bash
npm install hexo-generator-search --save
```

在配置文件`_config.yml` 最下面添加

```yaml
search:
  path: search.xml
  field: all
  content: true
```

在主体配置文件`_config.butterfly.yml`在修改配置

```yml
local_search:
  enable: true
  preload: false
  CDN:
```

### 配置看板娘

> https://github.com/EYHN/hexo-helper-live2d

安装依赖:

```bash
# 安装live2d
npm install --save hexo-helper-live2d
# 安装模型
npm install --save live2d-widget-model-koharu
```

在配置文件`_config.yml` 最下面添加配置

```yml
#配置看办娘 Live2D  https://github.com/EYHN/hexo-helper-live2d
live2d:
  enable: true ##开关看板娘
  scriptFrom: local  ## 默认
  tagMode: false #标签模式，是否仅替换live2d tag标签而非插入到所有页面
  debug: false #是否在控制台输出日志
  model:
    use: live2d-widget-model-koharu  ##模型名称
  display:
    position: left  ##控制看板娘的位置
    width: 150   ##控制看板娘的宽
    height: 300  ##控制看板娘的高
  mobile:
    show: false  ##在手机端是否显示
```

### 配置方便爬虫爬取网站

1. 配置sitemap

```bash
npm install hexo-generator-sitemap --save
```

在配置文件`_config.yml` 最下面添加配置

```yml
#配置sitemap来方便爬虫爬取网站 https://github.com/hexojs/hexo-generator-sitemap
sitemap:
  path: sitemap.xml
  rel: false
  tags: true
  categories: true
```

2. 配置百度sitemap

```bash
npm install hexo-generator-baidu-sitemap --save-dev
```

在配置文件`_config.yml` 最下面添加配置

```yml
#配置百度sitemap https://github.com/coneyCode/hexo-generator-baidu-sitemap
baidusitemap:
  path: baidusitemap.xml
```

3. 配置Rss 同样是方便爬虫

```bash
npm install hexo-generator-feed --save
```

在配置文件`_config.yml` 最下面添加配置

```yml
#配置Rss 同样是方便爬虫 https://github.com/hexojs/hexo-generator-feed
feed:
  type: atom
  path: atom.xml
  limit: 20
rss: /atom.xml
```

在上面配置的下面声明一些插件

```yml
## 声明插件
plugins:
  - hexo-generator-feed
  - hexo-generator-baidu-sitemap
  - hexo-generator-sitemap
```

### 配置追番插件

> 具体配置可以参照 https://github.com/HCLonely/hexo-bilibili-bangumi  的文档

安装依赖：

``` bash
npm install hexo-bilibili-bangumi --save
```

在主体配置文件`_config.butterfly.yml`在修改配置

```yml
menu:
  Home: / || fas fa-home
  追番: /bangumis/index.html || fas fa-home
```

### 百度主动推送 

> https://github.com/huiwang/hexo-baidu-url-submit

安装依赖:

```bash
npm install hexo-baidu-url-submit --save
```

在配置文件`_config.yml` 最下面添加配置

```yml
## 百度主动推送 https://github.com/huiwang/hexo-baidu-url-submit
baidu_url_submit:
  count: 1 ## 提交最新的一个链接
  host:  ## 在百度站长平台中注册的域名,自己网站的域名
  token: xxxxx ## 请注意这是您的秘钥， 所以请不要把博客源代码发布在公众仓库里!
  path: baidu_urls.txt ## 文本文档的地址， 新链接会保存在此文本文档里
```

### 配置全局的一个音乐插件 

> Aplayer https://github.com/MoePlayer/hexo-tag-aplayer/blob/master/docs/README-zh_cn.md

安装依赖：

```bash
npm install hexo-tag-aplayer --save
```

在配置文件`_config.yml` 最下面添加配置

```yml
aplayer:
  meting: true             # MetingJS 支持
  asset_inject: true       # 自动插入 Aplayer.js 与 Meting.js 资源脚本, 默认开启
```

在主体配置文件`_config.butterfly.yml`在修改配置

```yml
#配置防止aplayer重复加载 Inject the css and script (aplayer/meting)
aplayerInject:
  enable: true
  per_page: true
  
  
## id和服务具体配置查看文档  
inject:
  head:
    # - <link rel="stylesheet" href="/xxx.css">
  bottom:
    # aplayer音乐
    - <div class="aplayer no-destroy" data-id="修改id" data-server="设置服务" data-type="playlist"   data-order="list" data-fixed="true" data-preload="auto" data-autoplay="false" data-mutex="true" ></div>
  
```

### 配置pwa

> 装配了PWA以后，用户可以将网站作为WEB APP安装到自己的设备上，以原生应用般的方式浏览博客，同时借助PWA的缓存机制，能够更快速的浏览。

安装依赖：

```bash
npm install --global gulp-cli # 全局安装gulp命令集
npm install workbox-build gulp --save # 安装workbox和gulp插件

# 压缩html插件
npm install gulp-htmlclean --save-dev
npm install --save gulp-htmlmin
# 压缩css插件
npm install gulp-clean-css --save-dev
# 压缩js插件 使用terser压缩js
npm install gulp-terser --save-dev
npm install --save-dev gulp-babel @babel/core @babel/preset-env
# 压缩字体插件(font-min仅支持压缩ttf格式的字体包)
npm install gulp-fontmin --save-dev
```

在 package.json 中添加

```json
"type": "module",
```

在 Hexo 的根目录，创建一个`gulpfile.js`文件来配置压缩,文件内容如下

```js
{
  "name": "hexo-site",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "build": "hexo generate",
    "clean": "hexo clean",
    "deploy": "hexo deploy",
    "server": "hexo server"
  },
  "hexo": {
    "version": "6.3.0"
  },
  "type": "module",
  "dependencies": {
    "gulp": "^4.0.2",
    "gulp-htmlmin": "^5.0.1",
    "hexo": "^6.3.0",
    "hexo-abbrlink": "^2.2.1",
    "hexo-deployer-git": "^4.0.0",
    "hexo-generator-archive": "^2.0.0",
    "hexo-generator-category": "^2.0.0",
    "hexo-generator-feed": "^3.0.0",
    "hexo-generator-index": "^3.0.0",
    "hexo-generator-search": "^2.4.3",
    "hexo-generator-sitemap": "^3.0.1",
    "hexo-generator-tag": "^2.0.0",
    "hexo-helper-live2d": "^3.1.1",
    "hexo-renderer-ejs": "^2.0.0",
    "hexo-renderer-marked": "^6.0.0",
    "hexo-renderer-pug": "^3.0.0",
    "hexo-renderer-stylus": "^2.1.0",
    "hexo-server": "^3.0.0",
    "hexo-theme-landscape": "^0.0.3",
    "live2d-widget-model-koharu": "^1.0.5",
    "workbox-build": "^6.5.4"
  },
  "devDependencies": {
    "@babel/core": "^7.21.0",
    "@babel/preset-env": "^7.20.2",
    "gulp-babel": "^8.0.0",
    "gulp-clean-css": "^4.3.0",
    "gulp-fontmin": "^0.7.4",
    "gulp-htmlclean": "^2.7.22",
    "gulp-terser": "^2.1.0",
    "hexo-generator-baidu-sitemap": "^0.1.9"
  }
}
```

创建在 Hexo 的根目录，创建一个`sw-template.js`文件，来设置缓存

```js
/*
    设置缓存
 */
const workboxVersion = "5.1.3";

importScripts(`https://storage.googleapis.com/workbox-cdn/releases/${workboxVersion}/workbox-sw.js`);

workbox.core.setCacheNameDetails({
    prefix: "缓存名称",
});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

// 注册成功后要立即缓存的资源列表
// 具体缓存列表在gulpfile.js中配置，见下文
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST, {
    directoryIndex: null,
});

// 清空过期缓存
workbox.precaching.cleanupOutdatedCaches();


// 字体文件（可选，不需要就注释掉）
workbox.routing.registerRoute(
    /\.(?:eot|ttf|woff|woff2)$/,
    new workbox.strategies.CacheFirst({
        cacheName: "fonts",
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30,
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    })
);

// 谷歌字体（可选，不需要就注释掉）
workbox.routing.registerRoute(
    /^https:\/\/fonts\.googleapis\.com/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
    })
);
workbox.routing.registerRoute(
    /^https:\/\/fonts\.gstatic\.com/,
    new workbox.strategies.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30,
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    })
);

workbox.googleAnalytics.initialize();
```

在`根目录\themes\butterfly\layout\includes\third-party\`目录下新建`pwanotice.pug`文件，
打开`根目录\themes\butterfly\layout\includes\third-party\pwanotice.pug`,输入：

```
#app-refresh.app-refresh(style='position: fixed;top: -2.2rem;left: 0;right: 0;z-index: 99999;padding: 0 1rem;font-size: 15px;height: 2.2rem;transition: all 0.3s ease;')
  .app-refresh-wrap(style=' display: flex;color: #fff;height: 100%;align-items: center;justify-content: center;')
    label ✨ 有新文章啦！ 👉
    a(href='javascript:void(0)' onclick='location.reload()')
      span(style='color: #fff;text-decoration: underline;cursor: pointer;') 🍗点击食用🍔
script.
  if ('serviceWorker' in navigator) {
  if (navigator.serviceWorker.controller) {
  navigator.serviceWorker.addEventListener('controllerchange', function() {
  showNotification()
  })
  }
  window.addEventListener('load', function() {
  navigator.serviceWorker.register('/sw.js')
  })
  }
  function showNotification() {
  if (GLOBAL_CONFIG.Snackbar) {
  var snackbarBg =
  document.documentElement.getAttribute('data-theme') === 'light' ?
  GLOBAL_CONFIG.Snackbar.bgLight :
  GLOBAL_CONFIG.Snackbar.bgDark
  var snackbarPos = GLOBAL_CONFIG.Snackbar.position
  Snackbar.show({
  text: '✨ 有新文章啦！ 👉',
  backgroundColor: snackbarBg,
  duration: 500000,
  pos: snackbarPos,
  actionText: '🍗点击食用🍔',
  actionTextColor: '#fff',
  onActionClick: function(e) {
  location.reload()
  },
  })
  } else {
  var showBg =
  document.documentElement.getAttribute('data-theme') === 'light' ?
  '#3b70fc' :
  '#1f1f1f'
  var cssText = `top: 0; background: ${showBg};`
  document.getElementById('app-refresh').style.cssText = cssText
  }
  }
```

修改`根目录\themes\butterfly\layout\includes\additional-js.pug`,在文件底部添加以下内容，注意缩进。`butterfly_v3.6.0`取消了缓存配置，转为完全默认，需要将`{cache:theme.fragment_cache}`改为`{cache: true}`:

```
  if theme.pwa.enable
    !=partial('includes/third-party/pwanotice', {}, {cache: true})
```

在`source`文件夹下新建一个img文件夹用来存放图标将   

新建文件名为`manifest.json`并将其放到`source`目录下，来对图标进行设置其中的`theme_color`建议用取色器取设计的图标的主色调，**同时务必配置 start_url 和 name 的配置项，这关系到你之后能否看到浏览器的应用安装按钮**。：

```json
{
    "name": "拾忆者`Blog",
    "short_name": "拾忆者",
    "theme_color": "#3b70fc",
    "background_color": "#3b70fc",
    "display": "standalone",
    "scope": "/",
    "start_url": "/",
    "icons": [
        {
            "src": "图片地址",
            "sizes": "16x16",
            "type": "image/png"
        }
    ],
    "splash_pages": null
}
-- 可以配置多种尺寸
```

打开主题配置文件`根目录/_config.butterfly.yml`,找到`PWA`配置项。添加图标路径。这里的 theme_color 建议改成你图标的主色调，包括`manifest.json`中的`theme_color`也是如此。

```yml
pwa:
  enable: true
  manifest: /manifest.json
  theme_color: "图标主色调"
  apple_touch_icon: /img/siteicon/128.png
  favicon_32_32: /img/siteicon/32.png
  favicon_16_16: /img/siteicon/16.png
  mask_icon: /img/siteicon/128.png
```

### 配置自定义 css

新建文件`根目录/source/css/样式.css`,在 样式.css中填入要自定义的样式

在`_config.butterfly.yml`中搜索 Inject 添加以下代码，将自定义 css引入

```yml
inject:
head:
  - <link rel="stylesheet" href="css文件地址" media="defer" onload="this.media='all'">
```

```yml
# 设置网站背景图片
background: url(http://xxxxxx.com/xxx.jpg)
```

在配置文件`_config.yml` 中修改配置

```yml
url:   #设置部署的访问地址
```

### 安装标签外挂

> https://www.npmjs.com/package/hexo-butterfly-tag-plugins-plus
>
> 用法可以参考文章：[外挂标签用法](https://akilar.top/posts/615e2dec/)

安装依赖：

```bash
npm install hexo-butterfly-tag-plugins-plus --save

npm uninstall hexo-renderer-marked --save
npm install hexo-renderer-kramed --save
```

在`_config.butterfly.yml`中添加配置项

```yml
# tag-plugins-plus
# see https://akilar.top/posts/615e2dec/
tag_plugins:
  enable: true # 开关
  priority: 5 #过滤器优先权
  issues: false #issues标签开关
  link:
    placeholder: /img/siteicon/64.png #link_card标签默认的图标图片
  CDN:
    anima: https://cdn.cbd.int/hexo-butterfly-tag-plugins-plus@latest/lib/assets/font-awesome-animation.min.css #动画标签anima的依赖
    jquery: https://cdn.cbd.int/jquery@latest/dist/jquery.min.js #issues标签依赖
    issues: https://cdn.cbd.int/hexo-butterfly-tag-plugins-plus@latest/lib/assets/issues.js #issues标签依赖
    iconfont: 换成自己的图标文件地址 #参看https://akilar.top/posts/d2ebecef/
    carousel: https://cdn.cbd.int/hexo-butterfly-tag-plugins-plus@latest/lib/assets/carousel-touch.js
    tag_plugins_css: https://cdn.cbd.int/hexo-butterfly-tag-plugins-plus@latest/lib/tag_plugins.css
```

### 安装wowjs

> wowjs 可以有动画效果
>
> https://www.npmjs.com/package/hexo-butterfly-wowjs

安装依赖：

```bash
npm install hexo-butterfly-wowjs --save
```

在`_config.butterfly.yml`中添加配置项

```yml
# wowjs
# see https://www.npmjs.com/package/hexo-butterfly-wowjs
wowjs:
  enable: true #控制动画开关。true是打开，false是关闭
  priority: 10 #过滤器优先级
  mobile: false #移动端是否启用，默认移动端禁用
  animateitem:
    - class: recent-post-item #必填项，需要添加动画的元素的class
      style: animate__zoomIn #必填项，需要添加的动画
      duration: 1.5s #选填项，动画持续时间，单位可以是ms也可以是s。例如3s，700ms。
      delay: 200ms #选填项，动画开始的延迟时间，单位可以是ms也可以是s。例如3s，700ms。
      offset: 30 #选填项，开始动画的距离（相对浏览器底部）
      iteration: 1 #选填项，动画重复的次数
    - class: card-widget
      style: animate__zoomIn
      delay: 200ms
    # - class: flink-list-card
    #   style: wowpanels
    - class: flink-list-card
      style: animate__flipInY
      duration: 3s
    - class: flink-list-card
      style: animate__animated
      duration: 3s
    - class: article-sort-item
      style: animate__slideInRight
      duration: 1.5s
    - class: site-card
      style: animate__flipInY
      duration: 3s
    - class: site-card
      style: animate__animated
      duration: 3s
  animate_css: https://cdn.cbd.int/hexo-butterfly-wowjs/lib/animate.min.css
  wow_js: https://cdn.cbd.int/hexo-butterfly-wowjs/lib/wow.min.js
  wow_init_js: https://cdn.cbd.int/hexo-butterfly-wowjs/lib/wow_init.js
```

### 配置留言板

安装依赖

```bash
npm install hexo-butterfly-envelope --save
```

在`_config.butterfly.yml`中添加配置项

```yml
# envelope_comment
# see https://akilar.top/posts/e2d3c450/
# envelope_comment
# see https://akilar.top/posts/e2d3c450/
envelope_comment:
  enable: true #控制开关
  custom_pic:
    cover: https://cdn.cbd.int//hexo-butterfly-envelope/lib/violet.jpg #信笺头部图片
    line: https://cdn.cbd.int/hexo-butterfly-envelope/lib/line.png #信笺底部图片
    beforeimg: https://cdn.cbd.int/hexo-butterfly-envelope/lib/before.png # 信封前半部分
    afterimg: https://cdn.cbd.int/hexo-butterfly-envelope/lib/after.png # 信封后半部分
  message: #信笺正文，多行文本，写法如下
    - 有什么想问的？
    - 有什么想说的？
    - 有什么想吐槽的？
    - 哪怕是有什么想吃的，都可以告诉我哦~
  bottom: 自动书记人偶竭诚为您服务！ #仅支持单行文本
  height: #1050px，信封划出的高度
  path: #【可选】comments 的路径名称。默认为 comments，生成的页面为 comments/index.html
  front_matter: #【可选】comments页面的 front_matter 配置
    title: 留言板
    comments: true
```

同时给菜单添加上留言板

```yml
留言板: /comments/ || fas fa-envelope
```

### 配置电子时钟

> 参照 https://anzhiy.cn/posts/fc18.html

安装依赖：

```bash
npm install hexo-butterfly-clock-anzhiyu --save
```

在`_config.butterfly.yml`中添加配置项

```yml
# electric_clock
# see https://anzhiy.cn/posts/fc18.html
electric_clock:
  enable: true # 开关
  priority: 5 #过滤器优先权
  enable_page: all # 应用页面
  exclude:
    # - /posts/
    # - /about/
  layout: # 挂载容器类型
    type: class
    name: sticky_layout
    index: 0
  loading: https://cdn.cbd.int/hexo-butterfly-clock-anzhiyu@1.1.6/lib/loading.gif #加载动画自定义
  clock_css: https://cdn.cbd.int/hexo-butterfly-clock-anzhiyu@1.1.6/lib/clock.min.css
  clock_js: https://cdn.cbd.int/hexo-butterfly-clock-anzhiyu@1.1.6/lib/clock.min.js
  ip_api: https://widget.qweather.net/simple/static/js/he-simple-common.js?v=2.0
  qweather_key: # 和风天气key
  gaud_map_key: # 高得地图web服务key
  default_rectangle: true # 开启后将一直显示rectangle位置的天气，否则将获取访问者的地理位置与天气
  rectangle: 112.6534116,27.96920845 # 获取访问者位置失败时会显示该位置的天气，同时该位置为开启default_rectangle后的位置
```

### 配置页脚建站时间和徽标

安装依赖：

```bash
npm install hexo-butterfly-footer-beautify --save
```

在`_config.butterfly.yml`中添加配置项

```yml
# footer_beautify
# 页脚计时器：[Native JS Timer](https://akilar.top/posts/b941af/)
# 页脚徽标：[Add Github Badge](https://akilar.top/posts/e87ad7f8/)
footer_beautify:
  enable:
    timer: true # 计时器开关
    bdage: true # 徽标开关
  priority: 5 #过滤器优先权
  enable_page: all # 应用页面
  exclude:
    # - /posts/
    # - /about/
  layout: # 挂载容器类型
    type: id
    name: footer-wrap
    index: 0
  # 计时器部分配置项
  runtime_js: 
  runtime_css: 
  # 徽标部分配置项
  swiperpara: 0 #若非0，则开启轮播功能，每行徽标个数
  bdageitem:
    - link: https://hexo.io/ #徽标指向网站链接
      shields: https://img.shields.io/badge/Frame-Hexo-blue?style=flat&logo=hexo #徽标API
      message: 博客框架为Hexo_v5.4.0 #徽标提示语
    - link: https://butterfly.js.org/
      shields: https://img.shields.io/badge/Theme-Butterfly-6513df?style=flat&logo=bitdefender
      message: 主题版本Butterfly_v4.2.2
    - link: https://github.com/
      shields: https://img.shields.io/badge/Source-Github-d021d6?style=flat&logo=GitHub
      message: 本站项目由Github托管
    - link: http://creativecommons.org/licenses/by-nc-sa/4.0/
      shields: https://img.shields.io/badge/Copyright-BY--NC--SA%204.0-d42328?style=flat&logo=Claris
      message: 本站采用知识共享署名-非商业性使用-相同方式共享4.0国际许可协议进行许可

  # swiper_css: https://cdn.cbd.int/hexo-butterfly-swiper/lib/swiper.min.css
  # swiper_js: https://cdn.cbd.int/hexo-butterfly-swiper/lib/swiper.min.js
  # swiperbdage_init_js: https://cdn.cbd.int/hexo-butterfly-footer-beautify/lib/swiperbdage_init.min.js
```

### 配置GitHub贡献图

> 参考：[butterfly 重装日记 | 安知鱼 (anzhiy.cn)](https://anzhiy.cn/posts/cf4f.html)

安装依赖：

```bash
npm install hexo-filter-gitcalendar --save
```

在站点配置文件`_config.yml`或者主题配置文件如`_config.butterfly.yml`中添加

```yml

# hexo-filter-gitcalendar
# see https://akilar.top/posts/1f9c68c9/
gitcalendar:
  enable: true # 开关
  priority: 5 #过滤器优先权
  enable_page: / # 应用页面
  # butterfly挂载容器
  layout: # 挂载容器类型
    type: id
    name: recent-posts
    index: 0
  # volantis挂载容器
  # layout:
  #   type: class
  #   name: l_main
  #   index: 0
  # matery挂载容器
  # layout:
  #   type: id
  #   name: indexCard
  #   index: 0
  # mengd挂载容器
  # layout:
  #   type: class
  #   name: content
  #   index: 0
  user:  #git用户名
  apiurl: '贡献图地址'
  minheight:
    pc: 280px #桌面端最小高度
    mibile: 0px #移动端最小高度
  color: "['#e4dfd7', '#f9f4dc', '#f7e8aa', '#f7e8aa', '#f8df72', '#fcd217', '#fcc515', '#f28e16', '#fb8b05', '#d85916', '#f43e06']" #橘黄色调
  # color: "['#ebedf0', '#fdcdec', '#fc9bd9', '#fa6ac5', '#f838b2', '#f5089f', '#c4067e', '#92055e', '#540336', '#48022f', '#30021f']" #浅紫色调
  # color: "['#ebedf0', '#f0fff4', '#dcffe4', '#bef5cb', '#85e89d', '#34d058', '#28a745', '#22863a', '#176f2c', '#165c26', '#144620']" #翠绿色调
  # color: "['#ebedf0', '#f1f8ff', '#dbedff', '#c8e1ff', '#79b8ff', '#2188ff', '#0366d6', '#005cc5', '#044289', '#032f62', '#05264c']" #天青色调
  container: .recent-post-item(style='width:100%;height:auto;padding:10px;') #父元素容器，需要使用pug语法
  gitcalendar_css: https://cdn.cbd.int/hexo-filter-gitcalendar/lib/gitcalendar.css
  gitcalendar_js: https://cdn.cbd.int/hexo-filter-gitcalendar/lib/gitcalendar.js
```



## 通过github page部署到互联网

1. 创建一个公共仓库 仓库名必须是： `github名+.github.io`

2. 在配置文件`_config.yml`中进行配置

```yml
# 配置上传
deploy:
  - type: git  ##上传方法
    repository:  ## 仓库SSH地址
    branch: master  ##分支名
  - type: baidu_url_submitter # 百度主动推送
```

3. 执行命令上传

```bash
hexo cl ##清除缓存
hexo g -d ## 提交到本地然后上传到仓库
```









​	