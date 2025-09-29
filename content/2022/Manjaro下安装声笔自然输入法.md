---
title: Manjaro_下安装声笔自然输入法
slug: manjaro下安装声笔自然输入法
datetime: 2022-04-14 00:00
date: 2022-04-14 00:00
summary: 在 Manjaro Linux 下安装声笔自然输入法的详细教程，包括 fcitx5 配置和 rime 输入法设置。 manjaro下安装声笔自然输入法
tags: Manjaro, 声笔自然
cover_image_url: 
---
Modified: 2022-04-14

Category:技术相关
![截图_2022-04-14_07-45-31.png][1]
<!--more-->

这个输入法实在是太冷门了，有必要做个记录。  
先更换国内源，选延迟最低的那一个，然后更新：   

    sudo pacman-mirrors -i -c China -m rank  
    sudo pacman -Syyu  

添加 archlinuxcn 仓库，因为稍后声笔自然的安装包需要从里面下载    

    sudo gedit /etc/pacman.conf
      
    [archlinuxcn]
    SigLevel = Optional TrustedOnly
    Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch

安装 archlinuxcn-keyring 然后添加密钥，并安装软件

    sudo pacman -S archlinuxcn-keyring    
    sudo pacman -Syyu   #无脑删除 fcitx4 软件包，因为稍后要安装 fcitx5   
    sudo pacman -Rs $(pacman -Qsq fcitx)    #然后安装 fcitx5 软件包
    sudo pacman -S fcitx5 fcitx5-configtool fcitx5-qt fcitx5-gtk fcitx5-chinese-addons fcitx5-material-color fcitx5-rime

修改输入法环境变量，使应用可以调用 Fcitx5 输入法    

    gedit ~/.pam_environment    
    
    GTK_IM_MODULE DEFAULT=fcitx
    QT_IM_MODULE  DEFAULT=fcitx
    XMODIFIERS    DEFAULT=@im=fcitx

系统登陆后默认启动fcitx5   

    gedit ~/.xprofile    
    fcitx5 &

然后，搞定声笔自然    

    sudo pacman -S yay
    yay -S librime-sbxlm-git rime-sbxlm-sbzr

安装完成后执行命令 `sbxlm-init` 初始化   
默认配置目录为 `~/.local/share/fcitx5/rime` 

![2022-04-16 13-47-28屏幕截图.png][2]
然后重启运行以下命令来 重启 Fcitx5   

    kill `ps -A | grep fcitx5 | awk '{print $1}'` && fcitx5&

若非首次安装可能还要执行 rime 的重新部署。  
在输入界面按 F4 可以打开方案选单。  
可以通过在 rime 配置目录建立 default.custom.yaml，并配置如下内容定制方案选单。    

    gedit ~/.local/share/fcitx5/rime/default.custom.yaml    
    patch:
        schema_list:
        - {schema: sbzr} # 声笔自然

注销之后，就可以正常使用了，如果没有启用，先切换到 rime，然后按 f4 选择声笔自然。

[1]: ../assets/2022/04/14561730.png
[2]: ../assets/2022/04/2510824031.png