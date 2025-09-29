---
title: Flatpak Chrome 开启全局菜单
slug: flatpak-chrome-开启全局菜单的方法
datetime: 2023-07-19 00:00
date: 2023-07-19 00:00
summary: 介绍如何在 Flatpak 版本的 Chrome 浏览器中开启全局菜单功能，提升 Linux 桌面体验。

tags: sbxlm
cover_image_url: 
---
![Screenshot_20230719_120849.png][1]
<!--more-->

其实很简单，先安装 flatseal
	
	flatpak install com.github.tchx84.Flatseal --user

装好后打开它，选择`全部应用程序`，在`Session Bus`的`e.g.org.gnome.Contacts.SearchProvider`里，新增一个条目，输入`com.canonical.AppMenu.Registrar`
之后关闭 Chrome 再打开，就会发现已经启用了全局菜单。





  [1]: ../../assets/4091095532.png