---
title: Nginx 配置子域名绑定IP+端口
slug: 配置子域名绑定ip端口
date: 2023-11-25 00:00
datetime: 2023-11-25 00:00
summary: 使用 Nginx 和宝塔面板配置子域名绑定到特定 IP 和端口的方法，实现多服务统一域名管理。

tags: Nginx, 宝塔, 运维
cover_image_url: 
---
主站架设在`10.0.5.248`，绑定了`iamcheyan.com`这个域名。  
随后，又在这个域名下面添加了几个子域名，每个域名对应一个端口。  
例如现在，要把`code.iamcheyan.com` 绑定到`10.0.5.248:3000`，使用 Nginx+宝塔 可以实现。

## 域名解析
先在域名运营商的域名解析中添加子域名，解析的IP跟主站点相同，这点不多讲了。

注意，不用在宝塔里添加对应域名的网站，这里直接修改Nginx配置文件实现绑定。

## 宝塔检查 Nginx.conf
打开宝塔，找到`nginx.conf`配置文件（/www/server/panel/vhost/nginx），打开它，可以看到在文件中有如下配置：

```bash
include vhost/*.conf;   #加载vhost目录下的虚拟主机配置文件
```
这段配置的意思就是把当前目录下的 vhost 文件夹里的配置文件包含进来。  
如果你的没有，就照做写一下。

## 添加子配置文件
来到 vhost 目录下，可以看到里面已经有一个`iamcheyan.com.conf`的配置文件。  
把它复制一份为`code.iamcheyan.com.conf`，修改成如下内容：

```bash
server
{
    listen 80;  # 监听端口80
    server_name code.iamcheyan.com;  # 定义服务器名称

    location / {
        # 反向代理到服务器的端口3000
        proxy_pass http://10.0.5.248:3000/;
        proxy_set_header Host $host;  # 设置请求头中的Host信息
    }

    access_log  C:/BtSoft/wwwlogs/code.iamcheyan.com.log;  # 访问日志路径
    error_log  C:/BtSoft/wwwlogs/code.iamcheyan.com.error.log;  # 错误日志路径
}
```

之后重启 Nginx 服务。

## 宝塔反向代理设置

打开宝塔的反向代理设置，添加code.iamcheyan.com，url代理到http://127.0.0.1:3000，并绑定域名。

随后为绑定的域名申请SSL证书，即可打开SSL。