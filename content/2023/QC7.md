---
title: 英特尔 QC7 使用体验
slug: qc7
date: 2023-05-31 00:00
datetime: 2023-05-31 00:00
summary: 英特尔 QC7 笔记本的详细使用体验，包括硬件配置、4K 屏幕升级、Linux 系统安装和性能优化建议。
tags: QC7
cover_image_url: 
---
![英特尔KC7](../../assets/941eb979deda7833ead5c66ae020e13.jpg)

攀升迁跃者d、未来人类QC7、爱尔轩幻影Q、MAG-15，机械革命umipro3 等一众 LAPQC71 电脑都是这个模具

CPU Intel i7-9750H (12) @ 4.500GHz  
内存 32G (16G * 2) DDR4 2400Mhz   
独显 NVIDIA GeForce GTX 1660 Ti Mobile 6G 显存    
集显 Intel CoffeeLake-H GT2 [UHD Graphics 630] 
屏幕 NE156QUM-NZ4 3840*2160 4K+120HZ    
硬盘 1T NVME 威刚 ADATA SX820PNP 

换了HOTA氮化镓充电器230W的充电器，很小巧，官方旗舰店买的  
还有一个硬盘位，这机器可以插两个2280的nvme  

屏幕是自己换的4K屏，NE156QUM-NZ4 3840*2160 4K+120HZ    
但 i7-9750H 上4K只能到60的刷新率   
以及，这块屏幕在 Windows 下驱动有 BUG，睡眠唤醒后会黑屏，需要`关闭再打开屏幕才行`  
不是关机再打开，只是单独`关闭再打开屏幕`  
Windows 电源设置里有一个`按下电源按钮`的动作，把它设置成`关闭屏幕`  
这样唤醒后，如果黑屏，就轻按下电源键，关掉屏幕，再随机按下键盘按键激活屏幕，就恢复正常了  
以上问题只在 Windows 中出现  
如果像我一样使用 Linux 就没有这个问题，全部驱动都正常 

顺便说下，这个机器如果装 Linux 的话，优先推荐德国的 TUXEDO OS   
这个厂商专门对 QC7 做了适配，所以它的发行版也是开箱即用 
如果不喜欢 KDE 的话，就用 pop!OS，下载自带 Nvidia 驱动的版本 
根据官网的教程安装 CUDA，拉取 Tabby 的 Docker 镜像，在设置中把显卡改成`运算模式`，就可以使用`NVIDIA GeForce GTX 1660 Ti Mobile`在本地进行计算运算，辅助写代码了  