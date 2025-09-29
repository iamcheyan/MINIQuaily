---
title: 使用 debian 云主机的一点经验
slug: 使用-debian-云主机
datetime: 2023-01-29 00:00
date: 2023-01-29 00:00
summary: 使用 Debian 云主机的经验分享，包括用户权限管理、软件安装和系统配置的最佳实践。

tags: debian, 云主机
cover_image_url: 
---
默认的 root 帐户登录之后就要切换掉，否则之后产生的用户权限很麻烦。  
安装 gogs 时，尽量不要使用 docker，docker 的权限很小，调用宿主机的 conda 和很麻烦，直接使用二进制的方法安装最适宜。  
安装的时候使用 git 用户，之后`su git`，再用 git 用户安装 miniconda，这样钩子才能执行。 
最后赋予用户在wwwroot下修改的权限：

    sudo chown -R git:git /www/wwwroot
    sudo chmod -R 775 /www/wwwroot