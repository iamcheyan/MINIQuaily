---
title: 使用宝塔部署 python 项目
slug: 使用宝塔部署-python-项目
datetime: 2023-04-22 00:00
date: 2023-04-22 00:00
summary: 使用宝塔面板部署 Python 项目的详细教程，包括虚拟环境配置、依赖安装和项目启动。

tags: pelican
cover_image_url: 
---
宝塔的软件商店里有 python 项目管理器插件，使用这个插件可以方便地管理 py 项目。
但这玩意的用法有点麻烦，琢磨了几天，有点收获，记录下。

首先先在宝塔里搭建项目，使用 virtualenv 虚拟环境，普通项目选 flask，命令行项目选 python。
切记不要勾上自动安装依赖。
当项目创建成功后，会获得类似`7f10183f8187e732458bac27c57d3619_venv`这样的文件夹
然后 ssh 连接进去，先创建虚拟环境

	python3 -m venv 7f10183f8187e732458bac27c57d3619_venv

然后激活这个虚拟环境：
	
	source ef0ddd61138fe4fa0b2f985527e73319_venv/bin/activate`

接着安装依赖：
	pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt

最后使用绝对路径启动项目：

	/mnt/d/dev/wwwroot/iamcheyan.com/ef0ddd61138fe4fa0b2f985527e73319_venv/bin/python3 /mnt/d/dev/wwwroot/iamcheyan.com pelican --autoreload --listen -p 9001