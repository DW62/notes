# github主页贪吃蛇贡献图

## 效果

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/DW62/DW62/output/github-contribution-grid-snake-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/DW62/DW62/output/github-contribution-grid-snake.svg">
  <img alt="github contribution grid snake animation" src="https://raw.githubusercontent.com/DW62/DW62/output/github-contribution-grid-snake.svg">
</picture>

## 创建一个名字和自己github名字一致的仓库

![image-20230723164435139](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20230723164435139.png)

设置仓库工作流权限

![image-20230723171330980](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20230723171330980.png)

![image-20230723171403149](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20230723171403149.png)

设置完成之后点击保存

然后将创建完成仓库的拉取到本地

## 项目文件编写

文件结构

![image-20230723165238459](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20230723165238459.png)

### README文件编写

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/DW62/DW62/output/github-contribution-grid-snake-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/DW62/DW62/output/github-contribution-grid-snake.svg">
  <img alt="github contribution grid snake animation" src="https://raw.githubusercontent.com/DW62/DW62/output/github-contribution-grid-snake.svg">
</picture>
```

> 连接中的DW62/DW62是创建的仓库名字

### workflows文件编写

```yml
name: generate animation

on:
  # run automatically every 24 hours
  schedule:
    - cron: "0 */24 * * *" 
  
  # allows to manually run the job at any time
  workflow_dispatch:
  
  # run on every push on the master branch
  push:
    branches:
    - master
    
  

jobs:
  generate:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    
    steps:
      # generates a snake game from a github user (<github_user_name>) contributions graph, output a svg animation at <svg_out_path>
      - name: generate github-contribution-grid-snake.svg
        uses: Platane/snk/svg-only@v3
        with:
          github_user_name: ${{ github.repository_owner }}
          outputs: |
            dist/github-contribution-grid-snake.svg
            dist/github-contribution-grid-snake-dark.svg?palette=github-dark
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          
          
      # push the content of <build_dir> to a branch
      # the content will be available at https://raw.githubusercontent.com/<github_user>/<repository>/<target_branch>/<file> , or as github page
      - name: push github-contribution-grid-snake.svg to the output branch
        uses: crazy-max/ghaction-github-pages@v3.1.0
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

> 将本地项目更新到github，此时就可以在个人主页看到生成的贪吃蛇效果图

之后每一天都会根据贡献情况自动更新图片

