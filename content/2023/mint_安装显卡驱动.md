---
title: Linux Mint 安装 Nvidia 显卡驱动
slug: mint-安装显卡驱动
date: 2023-12-10 00:00
datetime: 2023-12-10 00:00
summary: 
tags: ubuntu, Nvidia
cover_image_url: 
---
![5f4a764b546a3e3e5122a81143c27e2](../../assets/5f4a764b546a3e3e5122a81143c27e2.jpg)



Linux Mint 自带一个显卡驱动安装工具，但奇怪的是怎样都检测不出来我的 3050，只好手动安装了。

有两种方法，一种是使用`由 Canonical 成员维护的 NVIDIA 驱动程序 PPA `，一种是`利用 Nvidia CUDA 存储库`，流程都是添加源，然后从源里找驱动安装。

## NVIDIA 驱动程序 PPA

### 添加源

现已正式发布，添加这个源就可以方便地下载驱动了：

```bash
sudo add-apt-repository ppa:graphics-drivers/ppa -y
sudo apt update
```

### 自动安装驱动

```bash
ubuntu-drivers devices	# 检查 Nvidia 驱动程序安装状态
sudo ubuntu-drivers autoinstall	# 自动安装驱动
```

### 手动安装驱动

```bash
sudo apt install nvidia-driver-535
```



## Nvidia CUDA 存储库

### 安装相关软件

```bash
sudo apt install dirmngr ca-certificates software-properties-common apt-transport-https dkms curl -y
```

### 导入密钥添加源

```bash
curl -fSsL https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/3bf863cc.pub | sudo gpg --dearmor | sudo tee /usr/share/keyrings/nvidia-drivers.gpg > /dev/null 2>&1
echo 'deb [signed-by=/usr/share/keyrings/nvidia-drivers.gpg] https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/ /' | sudo tee /etc/apt/sources.list.d/nvidia-drivers.list
sudo apt update
```

### 安装驱动

```bash
apt search nvidia-driver-*	# 搜索
sudo apt install nvidia-driver-535 cuda
```

## 确认是否安装成功

```bash
nvidia-smi
nvidia-settings
```

### 其他

```bash
nvidia-smi -pm ENABLED # 持久化
```



[参考链接](https://www.linuxcapable.com/install-nvidia-drivers-on-linux-mint/)