---
title: Pelican 使用备忘
slug: pelican-使用技巧
datetime: 2023-05-06 10:20 00:00
date: 2023-05-06 10:20
summary: Pelican 静态博客生成器的使用备忘和技巧，包括环境配置、内容管理和部署流程。

tags: pelican
cover_image_url: 
---
## 新建虚拟环境
    conda create -n pelican python=3.7
    conda install python=3.7    # 指定版本
    pip install --upgrade pip	# 更新 pip

## 安装依赖
	conda activate pelican   
	pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple 

## 运行
    pelican --autoreload --listen -p 8001   # 启动并自动加载更新
    pelican content # 生成静态页
    python compress_images.py	# 对大于1440的图片进行压缩

## 使用
文章在 content 的 post 目录下

    pelican --listen -p 8001    # 在指定端口监听
    pelican --listen    # 启动
    pelican -lr -p 8001 # 启动并自动加载更新
    pelican content # 生成 html 到 blog 文件夹中

## 同步本地文件到ftp中
	python upload_blog.py	# 同步本地博客到远程服务器

## 子模块

查看当前子模块的仓库地址：

```
git config --get remote.origin.url
```

# Typora 设置

所有的图片文件都存储在`../../assets/`目录里，写文章的时候直接把图片拖拽到 Typora 里