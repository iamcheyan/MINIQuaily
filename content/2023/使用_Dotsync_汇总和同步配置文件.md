---
title: 使用 Dotsync 汇总和同步配置文件
slug: 使用-dotsync-汇总和同步配置文件
datetime: 2023-11-26 00:00
date: 2023-11-26 00:00
summary: 
tags: Dotsync, Linux
cover_image_url: 
---
Linux 下的软件和系统的配置文件常常散落在各处。  
比如 zsh 的配置文件存放在`~/.zshrc`，但 ssh 的配置却存放在`.ssh/config`，如何管理和同步它们是个很麻烦的事情。  
最近在 Github 上找到了 [dotsync](https://github.com/dotsync/dotsync)，它是一个跨平台的配置文件管理工具。   
它可以汇总本地的配置文件，使它们统一在某个目录下（通常是`~/.dotfiles`目录），然后使用软连接的方法指向原位置，这样当需要修改或者同步这些文件时，只需要在`~/.dotfiles`下修改即可。 

![Dotsync](../../assets/dotsync.png)

## 准备
```bash
mkdir -p ~/.dotfiles    # 创建配置存储目录
cd ~/.dotfiles  # 切换到该目录
git clone https://github.com/dotphiles/dotsync.git  # 拉取程序
```

`~/.dotfiles`目录存放了dotsync的主程序，以及配置文件，比如 vim 配置，git 配置等等。  
将需要同步的文件都放在这里，需要注意的是，如果你的文件是在主目录下的隐藏文件，就要去掉文件名中的`.`，例如 .zshrc 文件需要更名为 zschrc。   

## 配置
```bash
nano ~/.dotfiles/dotsyncrc   # 配置 dotsync
```
打开 dotsync 的配置文件，以下是一个示例，它支持单个文件同步和子目录级别的同步，但写法是不一样的，注意，hostname 写自己主机的名字。  

```bash
[files]
# 在主目录下进行同步
dotsyncrc
zshrc

# 在子目录级别进行同步
ssh/config:.ssh/config
oh-my-zsh/editorconfig:.oh-my-zsh/.editorconfig
[endfiles]

# hostname 
[hosts]
pop-os git=ANY
[endhosts]
```

## 运行
使用以下命令生成配置文件的软连接：
```bash
~/.dotfiles/dotsync/bin/dotsync -L 
```
运行后可以看到`~/.dotfiles/dotsyncrc`被软连接到了`~/.dotsyncrc`。 
以后修改的话，只要到`~/.dotfiles/`中进行编辑即可。

### 以下是 dotsync 的命令解释：
    -I：初始化一台机器，配置其使用 dotsync。
    -L：将 dotfiles 符号链接到 $HOME 目录中。
    -u：更新到最新的 dotfiles 版本，不包括子模块。
    -U：更新到最新的 dotfiles 版本，包括子模块。
    -P：将本地更改推送回仓库（仅适用于 git）。
    -H host：在配置文件中指定的主机上执行操作，可以是“ALL”。
    -a：对所有已知机器更新 dotfiles。
    -A：对所有已知机器更新 dotfiles 和子模块。
    -r：使用 rsync 代替 git 进行同步。
    -f conf：使用指定的 dotsync 配置文件进行操作，默认为 '~/.dotsyncrc' 或 '$DOTSYNCRC'。
    -d dotfiles：指定 dotfiles 目录的路径，默认为 '~/.dotfiles'。
    -l：列出已配置的主机和 dotfiles。
    -c：在所有已知机器上运行任意 shell 命令。
    -g：类似于 -c，但仅在使用 git 的机器上运行。
    -v：显示详细信息。
    -h：显示帮助信息。