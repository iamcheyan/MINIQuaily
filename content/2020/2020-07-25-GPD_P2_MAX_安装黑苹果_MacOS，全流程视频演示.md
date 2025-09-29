---
title: GPD_P2_MAX_安装黑苹果_MacOS，全流程视频演示
slug: 2020-07-25-gpd-p2-max-安装黑苹果-macos，全流程视频演示
datetime: 2020-07-25 00:00
date: 2020-07-25 00:00
summary: 近期翻出来，把它安装了黑苹果，此处做个记录。
tags: 黑苹果, 视频教程, GPD P2 MAX
cover_image_url: 
---
![v2-da62191eb4b3067e2d81a6f07713964d_1440w.jpg][1]虽然曾[吐槽过这机器的散热][2]，但不得不说，它真的在便携和键盘上，做出了不错的兼容.
近期翻出来，把它安装了黑苹果，此处做个记录。
<!--more-->**需要物品：**一个16G优盘，因为安装包镜像为8个G；
一瓶可乐。
第一步，下载所需要用到的全部软件链接: https://pan.baidu.com/s/1tu6d940xuaOYWcbAxF9PnA 密码: bsgt
> 内含：
> 
> 系统镜像macOS Catalina 10.15.6(19G73) Installer for Clover 5119 and
> WEPE.dmg（这个镜像也可以用来装其它机型）； 镜像写入工具balenaEtcher-1.5.101-x64.AppImage；
> EFI（你可以理解成驱动）； 内置网卡配置工具HeliPort.app； 四叶草配置工具Clover
> Configurator（安装完系统后会用到）。
第二步，用balenaEtcher把macOS Catalina 10.15.6写入到U盘里。第三步，U盘插入机器，进行安装。第四步，安装成功后，使用Clover Configurator挂载EFI分区，替换里面的EFI文件。第五步，（如果你用外置网卡，此步操作可跳过），用记事本打开/EFI/CLOVER/kexts/Other/itlwm.kext/Contents/Info.plist，编辑WiFi_1到WiFi_4下面的 /IOKitPersonalities/itlwm/WiFiConfig，填写本地Wi-Fi路由器的SSID和密码并保存。然后把HeliPort.app添加为自启动项。第六步，重启之后，全部驱动正常，包括触摸屏、外接显示器、内置网卡也能正常上网了，安装完成。第七步，开瓶可乐庆祝一下。-**目前发现的问题：***1、电池不能即时更新，拔掉电源还会显示在充电中；
!!!
-
参考资料：[科技那些事儿：笔记本怎么安装黑苹果？看完这篇教程轻松get][3]GPD-P2-MAX-Hackintosh：[Azkali/GPD-P2-MAX-Hackintosh][4][【黑果小兵】macOS Catalina 10.15.6 19G73 正式版 with Clover 5119原版镜像\[双EFI版\]\[UEFI and MBR\]][5]感谢 [@马秉尧][6] 小马哥提供的EFI。
  [1]: ../assets/2019/09/2470711444.jpg
  [2]: https://www.zhihu.com/question/329680317/answer/842482817
  [3]: https://zhuanlan.zhihu.com/p/108671791
  [4]: https://link.zhihu.com/?target=https%3A//github.com/Azkali/GPD-P2-MAX-Hackintosh
  [5]: https://link.zhihu.com/?target=https%3A//blog.daliansky.net/macOS-Catalina-10.15.6-19G73-Release-version-with-Clover-5119-original-image-Double-EFI-Version-UEFI-and-MBR.html
  [6]: https://www.zhihu.com/people/52a78c543e55834b0448641887586076