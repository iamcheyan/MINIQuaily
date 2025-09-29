---
title: 在 Btrfs 分区使用 Grub 硬盘引导 iso 镜像
slug: 使用grub2引导硬盘上的iso文件
datetime: 2023-12-30 00:00
date: 2023-12-30 00:00
summary: 在 Btrfs 分区使用 Grub2 引导硬盘上的 ISO 镜像文件，实现直接从硬盘启动 Linux 安装镜像的方法。

tags: grub,  btrfs
cover_image_url: 
---
![f556bdcd4b50800022394f89c49e254](../../assets/f556bdcd4b50800022394f89c49e254.jpg)

电脑上有一些 Linux 镜像，可以直接通过 Grub 启动，省去了往优盘拷贝的麻烦。

## 代码

```bash
sudo nano /etc/grub.d/40_custom		# 打开 grub 配置自定义文件
```

然后添加以下内容：

```
#!/bin/sh
exec tail -n +3 $0
# This file provides an easy way to add custom menu entries.  Simply type the
# menu entries you want to add after this comment.  Be careful not to change
# the 'exec tail' line above.

menuentry "Live CD" {
 set isofile="/@home/cheyan/Documents/ISO/linuxmint-cinnamon-64bit-edge.iso"
 loopback loop (hd0,gpt3)/$isofile
 linux (loop)/casper/vmlinuz boot=casper iso-scan/filename=$isofile quiet noeject nopromt spalsh --
 initrd (loop)/casper/initrd.lz
}
```

保存后执行：

```
sudo update-grub    
sudo reboot
```

然后就能在启动菜单里通过`Live CD`选项启动镜像了。



### 路径

网上的方法都只是说了添加代码即可，但实际用的时候还是要因地制宜，根据自己的状况来修改。  

拿刚刚那个路径来说，`(hd0,gpt3)`里指的是在 Grub 下访问的编号，以及 Btrfs 分区的`home`在路径中是`@home`：

![242f9af63ae78fdedd54f9351b2e177](../../assets/242f9af63ae78fdedd54f9351b2e177.jpg)

最简单的方法是开机的时候，在 Grub 界面中按`ESC`键，进入命令行中，使用`ls`命令，一个一个磁盘路径地试，直到找到真实路径为止。



### casper

`/casper/vmlinuz`和`/casper/initrd.lz`都是存储在ISO文件中的文件。

- `/casper/vmlinuz` 是一个Linux内核映像文件，它是ISO文件中包含的实际内核文件。内核是操作系统的核心部分，负责管理系统资源、处理硬件和提供基本的系统功能。
- `/casper/initrd.lz` 是一个初始化 RAM 磁盘（initrd）映像文件，也被称为初始文件系统。它包含了启动过程中所需的一些文件和驱动程序。在引导过程中，内核首先加载 initrd 映像文件，然后根据其中的指令来加载必要的模块和文件系统。

这两个文件不同的镜像，里面可能写的也不一样，需要自己打开镜像，看一下具体叫什么。

![image-20231230011228951](../../assets/image-20231230011228951.png)