---
title: Nextcloud 在 Docker  下的部署
slug: nextcloud
datetime: 2023-01-09 00:00
date: 2023-01-09 00:00
summary: 不要用 SQLlite，虽然我很喜欢这个轻量级的数据库。
tags: SQLite
cover_image_url: 
---
不要用 SQLlite，虽然我很喜欢这个轻量级的数据库。 
速度是一个问题，但稳定性更重要，使用 SQLlite，任何并发访问数据库时，都有可能导致数据库被锁，还是建议使用 Mysql。

## 拉取 MariaDB
建议选用 MariaDB，MariaDB 是一个开源的关系型数据库管理系统（RDBMS），它是 MySQL 的一个分支和替代品。由原始的 MySQL 创始人之一 Michael Widenius 创建。
数据关联到`/root/mysql:/var/www/html`目录：

```bash
docker run -d --name db_nextcloud \
    -p 3307:3306 \
    -e PUID=1000 \
    -e PGID=100 \
    -e MYSQL_ROOT_PASSWORD=123456 \
    -e MYSQL_DATABASE=nextcloud \
    -e MYSQL_USER=nextcloud \
    -e MYSQL_PASSWORD=123456 \
    --restart=unless-stopped \
    -v /root/mysql:/var/lib/mysql \
    mariadb
```

## 拉取 Nextcloud
关联到`/root/nextcloud/data:/var/www/html`目录：

```bash
docker run -d --name nextcloud -p 8888:80 --restart=unless-stopped -v /root/nextcloud/data:/var/www/html nextcloud
```

## 加速
如果 docker 没有速度话，使用腾讯云的加速：
```bash
nano  /etc/docker/daemon.json
```


添加以下内容：

```bash
{
   "registry-mirrors": [
   "https://mirror.ccs.tencentyun.com"
  ]
}
```

## 安装
数据库主机：`ip:3307` 
用户名 \ 数据库：`nextcloud` 
密码：`123456` 


## 解决「通过不被信任的域名访问」
安装好后，通过ip可以访问了，但如果绑定了域名，则需要进 docker 内部，添加一个新的域名，否则域名打开网页会提示「通过不被信任的域名访问」
```bash
docker exec -it nextcloud bash	# 进入 docker 内部
dpkg -l | grep editor	# 查看下可用的编辑器
apt update	# 更新下先
apt install nano # 装个 nano
nano /var/www/html/config/config.php	# 修改配置文件
```

进去后，在下面添加新的域名，按照1234排序：
 ```bash
 'trusted_domains' =>
     array (
       0 => '1.1.1.1:8888',
       1 => 'dev.iamcheyan.com',
     ),
 ```

然后`exit`退出 docker 就行了，不用重启，刷新页面即可见效。