---
title: Linux 下编译安装声笔系列码输入法
slug: linux-下编译安装声笔系列码输入法
datetime: 2023-06-10 00:00
date: 2023-06-10 00:00
summary: linux-下编译安装声笔系列码输入法
tags: sbxlm
cover_image_url: 
---
![Screenshot_20230610_225523.png][1]

之前一直用 manjaro，使用声笔自然直接从 AUR 里抓就好了。
现在换了 ubuntu，找了一圈没看到有现成的 deb 包。
研究了一会，发现编译安装也不是很麻烦，半小时就搞定了，记录下。


### 1 安装fcitx5

	:::shell
	sudo apt install fcitx5 fcitx5-*    # 一把梭将相关软件包都装上，省得之后缺这少那

### 2 编译 rime

	:::shell
	sudo apt update # 先更新一下系统
	sudo apt install -y libboost-all-dev capnproto libgoogle-glog-dev libleveldb-dev librime-data liblua5.1-0-dev libmarisa-dev libopencc-dev libyaml-cpp-dev cmake git libgtest-dev ninja-build wget gcc g++   # 安装编译相关包
	git clone https://github.com/sbxlmdsl/librime   # 从 github 上把源码搞下来
	cd librime/ # 进入源码目录
	
	make    # 编译器
	sudo make install   # 安装

如果是 manjaro 的话，安装以下编译包
	
	:::shell
	sudo pacman -Syu boost capnproto glog leveldb librime-data lua51 marisa opencc yaml-cpp cmake git google-glog gtest ninja wget gcc

同时提醒，新版的sbzr似乎并不能正常输入`aeiou`，建议使用旧版：
	
	:::shell
	git clone --branch 9.5.10 https://github.com/sbxlmdsl/librime

### 3 配置
右键点击托盘里的 fcitx5 图标，选择重新启动。
进入 `$HOME/.local/share/fcitx5/rime` 目录，如果没有就新建一个。
从别的地方把配置拿来，直接粘贴进去，再点进输入法设置，添加中州韵。
	

	:::shell
	rime_deployer --build $HOME/.local/share/fcitx5/rime/

最后再重新配置一下，就可以愉快地使用了。


[1]: ../../assets/1717818191.png