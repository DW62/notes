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

   ```bash
   git config --global user.name "XXXX"  			      用户名标识  ---- 实际也可以填写您的github仓库的名称
   git config --global user.email "xxxx@xxx.com"  		邮箱标识  -------可以填写github仓库的邮箱
   ```

3. 创建密钥

   ```bash
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

```bash
ssh -T git@github.com
```

如果初次设置的话，输入yes 同意即可

## 常用命令

### 创建文件夹

```bash
mkdir 文件夹名
```

### 进入文件夹

```bash
cd 文件夹名称
```

## GIt常用命令

### 克隆远程库

```bash
git clone 你的地址
```
### 文件上传到本地仓库

**添加到暂存区**

```bash
 git   add 	文件名				    
 git   add   文件名1 文件名2 ...
 git   add   .           				#添加当前目录所有文件到缓存区
```
**添加文件提交到本地库**

```bash
git commit  -m  "注释"
```
### 版本回退

1. 查看版本

   ```bash
   git log
   git log --pretty=oneline      #(推荐)
   ```

2. 回退

   ```bash
   git reset --hard  版本号    # 只需要输入前六位。
   ```

   > 回到过去之后，想要再回到之前最新的版本的时候，需要使用指令查看历史操作
   >
   > ### 小结
   >
   > 1. 想要回到过去，必须要先得到commit id ,然后通过 git reset -- hard进行回退
   > 2. 想要回到未来，需要使用git reflog 进行历史操作查看，得到最新的commit id
   > 3. 在写回退指令的时候commit id 可以不用写全，git自动识别至少要写前4位

   ```bash
   git reflog   		#进行历史操作查看
   ```

### 跟新本地仓库和远程同步

```bash
git  pull
```

### 本地仓库内容提交到远程库

```bash
git  push 
```

### 分支操作

**查看分支**

```bash
git branch
```

**创建分支**

```bash
git branch 分支名
```

**切换分支**

```bash
git checkout 分支名
```

**删除分支**

```bash
git branch -d 分支名
```

删除分支需要退出当前分支

**合并分支**

```bash
git merge 被合并的分支名
```

### 查看操作

**查看文件状态**

```bash
git status    
```

**看与上个版本的区别**如果本次有改动后（未提交）才可以看到变化

```bash
git diff 
```

**查看记录**

```bash
git log  
git log --pretty=oneline  
```

**查看命令历史**一般用来确认回到过去的那个版本

```bash
git reflog 
```

### 文件忽略

 项目文件夹内有一些文件不希望提交到仓库，那么可以使用git的配置文件将其忽略。 创建一个 .gitignore 文件放置在项目根目录下,该文件内可将某个文件或目录忽略，不再提示要求提交该文件了。

### 删除仓库文件

```git
git rm "文件名"
```

