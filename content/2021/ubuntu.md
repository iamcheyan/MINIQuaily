---
title: ubuntu 安装后的相关配置记录
slug: ubuntu
datetime: 2021-05-31 00:00
date: 2021-05-31 00:00
summary: Ubuntu 安装后的相关配置记录，包括语言设置、输入法配置、常用软件安装等系统优化内容。 
tags: ubuntu
cover_image_url: 
---
### ![screenshot_2023-12-31_22-01-03](../../assets/screenshot_2023-12-31_22-01-03.png)

### 语言相关

    sudo apt install ttf-mscorefonts-installer
    sudo apt install fonts-noto-cjk-extra
    sudo apt install fonts-noto-cjk ttf-wqy-microhei
    sudo apt install software-properties-gtk
    sudo apt install language-pack-zh-hans-base
    sudo apt install language-pack-ja

###  rime
    sudo apt install -y libboost-all-dev capnproto libgoogle-glog-dev libleveldb-dev librime-data liblua5.1-0-dev libmarisa-dev libopencc-dev libyaml-cpp-dev cmake git libgtest-dev ninja-build wget gcc g++   # 安装编译相关包
    git clone  https://github.com/sbxlmdsl/librime
    sudo apt install fcitx5 fcitx5-rime	fcitx5-material-color # fcitx5
    sudo apt install ibus ibus-rime	# ibus
    cd librime/ # 进入源码目录
    make    # 编译器
    sudo make install   # 安装

##### 配置 Fcitx5

存放路径：`$HOME/.local/share/fcitx5/rime/`

```bash
nano ~/.pam_environment

GTK_IM_MODULE DEFAULT=fcitx
QT_IM_MODULE  DEFAULT=fcitx
XMODIFIERS    DEFAULT=@im=fcitx
```

##### 配置 iBus

存放路径：`$HOME/.config/ibus/rime/`

```bash
nano ~/.bashrc

export GTK_IM_MODULE=ibus
export XMODIFIERS=@im=ibus
export QT_IM_MODULE=ibus
```

###  liberoffice  的安装和卸载
    # 安装
    sudo apt install libreoffice
    sudo apt install libreoffice-l10n-zh-cn	# 中文
    
    # 卸载
    sudo apt-get remove --purge l‘ibreoffice*’
    sudo apt-get autoremove --purge ‘libreoffice*’

###  常用软件
	sudo apt install copyq freerdp2-x11 flameshot xclip xdotool xwininfo gpick	# Applications
	sudo apt-get install plank # dock
	
	type -p curl >/dev/null || (sudo apt update && sudo apt install curl -y)	# gh	
	curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
	&& sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
	&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
	&& sudo apt update \
	&& sudo apt install gh -y

### neovim

```bash
sudo add-apt-repository ppa:neovim-ppa/unstable	# neovim
sudo apt-get update
sudo apt-get install neovim
nvim --version

sudo update-alternatives --install /usr/bin/vi vi /usr/bin/nvim 60	# 将 Neovim 设置为默认的 vi 或 vim 替代品
sudo update-alternatives --config vi
sudo update-alternatives --install /usr/bin/vim vim /usr/bin/nvim 60
sudo update-alternatives --config vim

if command -v curl >/dev/null 2>&1; then	# nvimdots
    bash -c "$(curl -fsSL https://raw.githubusercontent.com/ayamir/nvimdots/HEAD/scripts/install.sh)"
else
    bash -c "$(wget -O- https://raw.githubusercontent.com/ayamir/nvimdots/HEAD/scripts/install.sh)"
fi

rm -rf ~/.config/nvim	# 卸载
rm -rf ~/.local/share/nvim
```

### sublime text

```
wget -qO - https://download.sublimetext.com/sublimehq-pub.gpg | gpg --dearmor | sudo tee /etc/apt/trusted.gpg.d/sublimehq-archive.gpg > /dev/null
echo "deb https://download.sublimetext.com/ apt/stable/" | sudo tee /etc/apt/sources.list.d/sublime-text.list
sudo apt-get update
sudo apt-get install sublime-text

sudo apt-get install apt-transport-https	# 如果此操作失败，请确保将 apt 设置为使用 https 源
```


### 编译相关

    sudo apt install -y libboost-all-dev capnproto libgoogle-glog-dev libleveldb-dev librime-data liblua5.1-0-dev libmarisa-dev libopencc-dev cmake git ninja-build wget gcc g++ libgtest-dev libyaml-cpp-dev   # 安装编译相关包

### elementary 相关编译

```bash
sudo apt-get install valac
sudo apt-get install libgee-0.8-dev
sudo apt-get install libgtk-3-dev
sudo apt-get install libgranite-dev
sudo apt-get install libhandy-1-dev
sudo apt-get install libvte-2.91-dev
sudo apt-get install xvfb
```

###  Timeshift下brrfs分区下启用

	sudo apt install timeshift
	
	sudo apt install build-essential git	# grub
	mkdir -p ~/git
	cd ~/git
	git clone https://github.com/Antynea/grub-btrfs.git
	cd grub-btrfs
	sudo make install
	sudo grub-mkconfig
	sudo grub-btrfsd systemd instructions
	
	sudo apt install -y git make	# timeshift-autosnap-apt
	git clone https://github.com/wmutschl/timeshift-autosnap-apt.git /home/$USER/timeshift-autosnap-apt
	cd /home/$USER/timeshift-autosnap-apt
	sudo make install
	sudo systemctl start grub-btrfsd
	sudo systemctl enable grub-btrfsd

###  Jianguoyun && nextcloud
    sudo apt-get install libglib2.0-dev libgtk2.0-dev libnautilus-extension-dev gvfs-bin python3-gi gir1.2-appindicator3-0.1 gir1.2-notify-0.7 gdebi gvfs-bin python3-gi gir1.2-appindicator3-0.1 gir1.2-notify-0.7
    wget https://www.jianguoyun.com/static/exe/installer/ubuntu/nautilus_nutstore_amd64.deb
    sudo gdebi nautilus_nutstore_amd64.deb
    
    sudo add-apt-repository ppa:nextcloud-devs/client	# nextcloud
    sudo apt update
    sudo apt install nextcloud-client

### git

```bash
git config --global user.email "me@iamcheyan.com"
git config --global user.name "cheyan"
git config --global credential.helper store
```

### go

```
wget -c https://go.dev/dl/go1.21.6.linux-amd64.tar.gz	#下载 Go 压缩包
sudo tar -xz -C /usr/local -f go1.21.6.linux-amd64.tar.gz	#解压缩 Go 压缩包
ls /usr/local/go	#查看是否成功了
export PATH=$PATH:/usr/local/go/bin	#调整环境变量
source ~/.profile	#重新加载新的PATH 环境变量到当前的 shell 会话
go version	#打印版本号
```

#### 把 go 变量添加在zsh

```
vi ~/.zshrc

#GO
# 检查 Go 安装目录是否存在
if [ -d /usr/local/go ]; then

    # 将 Go 安装目录添加到 PATH 环境变量
    export PATH=$PATH:/usr/local/go/bin

    # 检查 PATH 环境变量是否已添加
    #echo $PATH

    # 验证 Go 命令是否可用
    #go version
fi

source ~/.zshrc  
```



###  v2raya for debian

    curl -Ls https://mirrors.v2raya.org/go.sh | sudo bash
    sudo systemctl disable v2ray --now	#Xray 需要替换服务为 xray
    wget -qO - https://apt.v2raya.org/key/public-key.asc | sudo tee /etc/apt/trusted.gpg.d/v2raya.asc	#  添加公钥
    echo "deb https://apt.v2raya.org/ v2raya main" | sudo tee /etc/apt/sources.list.d/v2raya.list	#  添加软件源
    sudo apt update
    sudo apt install v2ray v2raya
    
    sudo systemctl start v2raya.service
    sudo systemctl enable v2raya.service

###  v2raya for snap
    sudo mv /etc/apt/preferences.d/10-tuxedo-snap  ~/nosnap.backup
    sudo apt install snapd
    snap install v2ray-core
    snap install v2raya

###  wechat
    wget -O- https://deepin-wine.i-m.dev/setup.sh | sh
    sudo apt-get install com.qq.weixin.deepin
    sudo apt --fix-broken install

###  gnome 相关
	sudo apt install yaru-theme-gtk yaru-theme-icon
	sudo apt install gedit gnome-terminal nautilus gnome-tweaks 
	sudo apt remove gnome-games libgnome-games-support-1-3:amd64 libgnome-games-support-common	# 卸载游戏
	sudo apt install deja-dup	# 备份工具

### pop os 相关

```
sudo add-apt-repository ppa:system76/pop
sudo apt update
sudo apt install pop-icon-theme	# 图标
sudo apt install pop-theme	# 主题
```

###  kvm

    sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients bridge-utils virtinst virt-manager
    sudo adduser $USER libvirt	# 用户"cheyan"已经属于"libvirt"组
    sudo adduser $USER kvm	# 用户"cheyan"已经属于"kvm"组
    sudo virsh list --all	# 查看虚拟机列表
    sudo virsh autostart win10 # 启用开机启动
    sudo virsh autostart --disable win10	# 禁用开机启动


###  zsh
    bash ~/.dotfiles/dotsync/bin/dotsync -L
    sudo apt install zsh zsh-autosuggestions zsh-syntax-highlighting autojump fish fzf fd-find thefuck
    chsh -s /bin/zsh    #  将 Zsh 设置为默认 Shell
    git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting
    git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions
    
    rm -rf /home/cheyan/.oh-my-zsh
    wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh
    bash ./install.sh   # 安装 Oh My Zsh 主题
    
    git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/.oh-my-zsh/custom/themes/powerlevel10k
    # 在 .zshrc 文件中设置`ZSH_THEME="powerlevel10k/powerlevel10k"`
    p10k configure  # 安装和配置 powerlevel10k


###  wine
    sudo dpkg --add-architecture i386
    sudo mkdir -pm755 /etc/apt/keyrings
    sudo wget -O /etc/apt/keyrings/winehq-archive.key https://dl.winehq.org/wine-builds/winehq.key
    sudo wget -NP /etc/apt/sources.list.d/ https://dl.winehq.org/wine-builds/ubuntu/dists/jammy/winehq-jammy.sources
    sudo apt-get update
    
    sudo apt-get install --install-recommends winehq-stable	#  稳定分支
    sudo apt install winehq-devel	# 开发版本
    sudo apt install winehq-staging	# wine-staging
    
    wine --version

###  vs code
    sudo apt update
    sudo apt install software-properties-common apt-transport-https curl
    curl -sSL https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://packages.microsoft.com/repos/vscode stable main"
    sudo apt update
    sudo apt install code

###  chrome
    sudo sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' 
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add - 
    sudo apt update 
    sudo apt install google-chrome-stable 

###  edge
    curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
    sudo install -o root -g root -m 644 microsoft.gpg /etc/apt/trusted.gpg.d/
    sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/edge stable main" > /etc/apt/sources.list.d/microsoft-edge-dev.list'
    sudo rm microsoft.gpg
    sudo apt update && sudo apt install microsoft-edge-stable
    sudo rm /etc/apt/sources.list.d/microsoft-edge-dev.list

###  fsearch
    sudo add-apt-repository ppa:christian-boxdoerfer/fsearch-stable
    sudo apt update
    sudo apt install fsearch


###  flatpak
    flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo  #  添加源
    flatpak install flathub com.github.gmg137.netease-cloud-music-gtk   # 网易云音乐
    flatpak install flathub io.github.fastrizwaan.WineZGUI	# wineZGUI
    flatpak install com.github.hluk.copyq	# copyq

### rofi

```bash
sudo apt-get install rofi
```

### 编译支持中文输入法的rofi

```bash
git clone https://github.com/davatorium/rofi.git
sudo apt install libxcb1-dev libstartup-notification0-dev# 库
```

#### 修改imdkit下的value值为true

````bash
nano meson_options.txt 
option('imdkit', type: 'boolean', value: true, description: 'IMDKit support')

meson setup build
ninja -C build
ninja -C build install

/home/cheyan/APP/rofi/build/rofi -show
````

###  解决自动唤醒

    cat /proc/acpi/wakeup   # 查看唤醒
    sudo sh -c 'grep enabled /proc/acpi/wakeup | cut -f 1 -d " " | xargs -I {} sh -c "echo {} > /proc/acpi/wakeup"' # 禁用所有唤醒