---
title: Linux 下 miniconda3 安装方法
slug: linux下miniconda3安装
datetime: 2022-01-14 00:00
date: 2022-01-14 00:00
summary: Linux 下 miniconda3 的安装和配置方法，包括下载安装、路径设置和环境初始化。 linux下miniconda3安装
tags: miniconda3,  python
cover_image_url: 
---
## 下载 miniconda3 
在[官网](https://docs.conda.io/projects/miniconda/en/latest/)下载，进入下载的目录，执行以下命令： 

```bash
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash ./Miniconda3-latest-Linux-x86_64.sh 
```
## 指定安装路径（可选） 
同意用户协议之后，会出现以下提示，它让你选择安装的路径，默认是`/home/cheyan/miniconda3` 

    Miniconda3 will now be installed into this location: 
    /home/cheyan/miniconda3 
    
      - Press ENTER to confirm the location 
      - Press CTRL-C to abort the installation 
      - Or specify a different location below 

我希望安装到`$HOME/.miniconda3`，因为我不希望它出现在我的主目录中。   
所以我把这个路径输入进去，之后它会安装到指定的路径下。 

    [/home/cheyan/miniconda3] >>> $HOME/.miniconda3
    
    PREFIX=/home/cheyan/.miniconda3 
    Unpacking payload ... 
    Installing base environment... 
    Downloading and Extracting Packages 
    Preparing transaction: done 
    Executing transaction: done 
    installation finished. 

## 初始化 conda 
然后会询问你要不要初始化，输入yes, 然后就安装好了。 

    You can undo this by running `conda init --reverse $SHELL`? [yes|no] 
    [no] >>> yes 
    no change     /home/cheyan/.miniconda3/condabin/conda 
    no change     /home/cheyan/.miniconda3/bin/conda 
    no change     /home/cheyan/.miniconda3/bin/conda-env
    no change     /home/cheyan/.miniconda3/bin/activate 
    no change     /home/cheyan/.miniconda3/bin/deactivate 
    no change     /home/cheyan/.miniconda3/etc/profile.d/conda.sh 
    no change     /home/cheyan/.miniconda3/etc/fish/conf.d/conda.fish 
    no change     /home/cheyan/.miniconda3/shell/condabin/Conda.psm1 
    no change     /home/cheyan/.miniconda3/shell/condabin/conda-hook.ps1 
    no change     /home/cheyan/.miniconda3/lib/python3.11/site-packages/xontrib/conda.xsh 
    no change     /home/cheyan/.miniconda3/etc/profile.d/conda.csh 
    modified      /home/cheyan/.zshrc 
    
    ==> For changes to take effect, close and re-open your current shell. <== 
    
    Thank you for installing Miniconda3!

## 关联 zsh
在 ~/.zshrc 或 ~/.zshrc.local 中写入 
```bash
eval "$(/home/$用户名/.miniconda3/bin/conda shell.zsh hook)" 