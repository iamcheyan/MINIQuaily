---
title: Hp_chromebook_13_g1_安装_ubuntu_记录
slug: 2021-04-30-hp-chromebook-13-g1-安装-ubuntu-记录
datetime: 2021-04-30 00:00
date: 2021-04-30 00:00
summary: HP Chromebook 13 G1 安装 Ubuntu 的完整记录，3K屏幕和双TypeC接口的性价比之选，破解BIOS实现完全Linux化。
tags: Linux, ChromeBook, Hp chromebook 13 g1
cover_image_url: 
---
![2021-04-30 16-39-20屏幕截图.png][1]
<!--more-->
这个机器的亮点是3k屏+双typeC+低廉的价格（闲鱼价格在600-800之间），性价比超高。本来打算买回来在 ChromeOS 下通过 Linux 容器来满足日常使用（主要是Rime输入法），谁知到手后却发现这款机器不支持 Linux 容器，只好破解 BIOS ，完全安装 Ubuntu了。
先启用开发者模式，然后安装第三方BIOS，入口在
https://mrchromebox.tech/#fwscript系统版本选择 Ubuntu 18 LTS，因为只有这个版本可以打声音补丁声音补丁在这里下载，https://github.com/windirt/chromebook_sound安装完后记得禁用系统更新，一旦更新，则声音失效
  [1]: ../assets/2021/04/3523822164.png