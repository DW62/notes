# Git

## Git下载

[Git 官方地址](https://git-scm.com/)

![image-20220808213202834](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808213202834.png)

![image-20220808213306554](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808213306554.png)

**官网下载很慢，可以使用镜像地址进行下载**

[Git镜像下载地址](https://registry.npmmirror.com/binary.html?path=git-for-windows/)

找到要下载的版本

![image-20220808215410254](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808215410254.png)

![image-20220808215439956](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808215439956.png)

下载完成后

![image-20220808215508583](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808215508583.png)

## Git安装

安装基本上默认下一步就行了

1. 运行安装文件

   ![image-20220808215657114](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808215657114.png)

2. 选择安装位置

   ![image-20220808215757529](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808215757529.png)

3. 选择安装组件

   ![image-20220808215843394](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808215843394.png)

4. 选择开始菜单文件夹

   ![image-20220808221932145](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808221932145.png)

5. 选择Git默认编辑器

   ![image-20220808221948784](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808221948784.png)

6. 在新存储库中调整初始分支的名称

   ![image-20220808222011992](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808222011992.png)

7. 调整Path环境

   ![image-20220808222513625](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808222513625.png)

8. 选择SSH可执行文件

   ![image-20220808222037209](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808222037209.png)

9. 选择HTTPS传输后端

   ![image-20220808222051906](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808222051906.png)

10. 配置行结束转换

    ![image-20220808222200267](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808222200267.png)

11. 将终端仿真器配置为与Git Bash一起使用

    ![image-20220808222221102](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808222221102.png)

12. 选择git pull的默认行为

    ![image-20220808222248317](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808222248317.png)

13. 选择凭证助手

    ![image-20220808222315038](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808222315038.png)

14. 配置额外选项

    ![image-20220808222330224](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808222330224.png)

15. 配置实验选

    ![image-20220808222354245](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808222354245.png)

16. 完成Git安装向导

	 ![image-20220808222605466](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808222605466.png)

## Git 配置连接GitHub

通过ssh公私钥进行连接

1. 任意找一个文件夹鼠标右键选择git bash here弹出了git命令控制台！

   ![image-20220808223225368](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808223225368.png)

2. 通过命令创建git的用户名和邮箱作为表示标识

   ```git
   git config --global user.name "XXXX"  用户名标识  ---- 实际也可以填写您的github仓库的名称
   git config --global user.email "xxxx@xxx.com"  邮箱标识  -------可以填写github仓库的邮箱
   ```

3. 创建密钥

   ```git
   ssh-keygen -t rsa    -- 生成密钥命令
   ```

   ![image-20220808224109084](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808224109084.png)

4. 找到生成密钥的地址

   ![image-20220808224424840](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808224424840.png)

5. 找到GitHub进行公钥配置

   ![image-20220808224604038](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808224604038.png)

   ![image-20220808224707478](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808224707478.png)

   ![image-20220808224955478](https://raw.githubusercontent.com/DW62/ImgStg/master/image-20220808224955478.png)



**验证是否成功**

```git
ssh -T git@github.com
```

如果初次设置的话，输入yes 同意即可

## GIt常用命令
**创建文件夹**
```git
mkdir 文件夹名称
```
**进入文件夹**
```git
cd 文件夹名称
```
**克隆远程库**
```git
git clone 你的地址
```
**添加到暂存区**
```git
 git add 文件名
 git add 文件名1 文件名2 ...
 git add .           添加当前目录所有文件到缓存区
```
**添加文件提交到本地库**

```git
git commit  -m  "注释"
```
**版本退回**

```git
查看版本
git log
git log --pretty=oneline (推荐)
版本回退回退到上一个版本。commit-id每次提交git根据您的注释自动生成的加密字符串。只需要输入前六位。
git reset --hard <commit_id> 
```
**本地仓库内容提交的远程库**

```git
git  push -u orgin maser
```

**查看文件状态**

```git
git status         -- 查看文件状态

git diff 查看与上个版本的区别。如果本次有改动后（未提交）才可以看到变化

git log 查看最近到最远的提交记录

git reflog 查看命令历史，一般用来确认回到过去的那个版本
```



**分支相关命令**

```git
git branch 						如果不输入分支名，则查看当前所有分支

git branch 分支名 				创建一个侧分支

git checkout 分支名称 			克隆侧分支并切换到该侧分支上。

git merge 侧分支名      		合并分支，合并操作前，先切换到主分支（master），再执行此命令

git branch -d 分支名称    			删除分支，删除前工作区时干净的
```

**文件忽略**

 项目文件夹内有一些文件不希望提交到仓库，那么可以使用git的配置文件将其忽略。 创建一个 .gitignore 文件放置在项目根目录下,该文件内可将某个文件或目录忽略，不再提示要求提交该文件了。

**初始化仓库**

```git
git  init
```

**删除仓库文件**

```git
git rm "w"
```

