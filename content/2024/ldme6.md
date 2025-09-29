---
title: LMDE 6 のインストールと設定
slug: ldme6
datetime: 2024-09-26 00:00
date: 2024-09-26 00:00
summary: ldme6
tags: debian, linux mint, lmde
cover_image_url: 
---
![Screenshot from 2024-09-26 19-12-03](../../assets/Screenshot from 2024-09-26 19-12-03.png)

私は長い間 Linux Mint を使っています、その安定性と軽さが好きです。

しかし、最近21から22にアップグレードしたときに、それがクラッシュしました。
原因は、システムに多くの変更を加え、知らない第三者のリポジトリを使ったことだと推測しています。

それで、私はそれを再インストールしました、今回は Debian ベースの Linux Mint ディストリビューションである LMDE 6 を選びました。
なぜなら、頻繁に更新されたくなくて、安定した作業環境だけが欲しいからです。

LMDE 6 は他の Linux Mint ディストリビューションと同じように、btrfs、専用グラフィックドライバー、ハイバネーションなどの機能に対して、すぐに使える対応がされていますので、多くの設定時間を省けます。

ダウンロードアドレス：https://linuxmint.com/edition.php?id=308

# 必要なソフトウェアのインストール

できるだけ apt でのソフトウェアインストールを減らし、flatpak を使えるならできるだけそれを使用します。これにより、後の更新が簡単になり、システムのソースに影響を与えません。

```
sudo apt install freerdp2-x11 fcitx-5 fcitx5-rime vim  sshpass sshfs unison linuxlogo xclip
sudo apt-get install grub2-theme-mint-2k    # grub の 4K での適応
sudo apt install fonts-noto-cjk fonts-wqy-zenhei fonts-wqy-microhei fonts-liberation
sudo fc-cache -fv
```

# システムに付属しているソフトウェアを削除する
```
sudo apt remove redshift-gtk
sudo apt-get remove --purge 'libreoffice*'
sudo apt-get autoremove --purge 'libreoffice*'
sudo apt remove thunderbird
sudo apt-get remove --auto-remove rhythmbox
```


# Flatpak 部分のソフトウェアインストールのソフトウェア
```
flatpak install -y flathub com.google.Chrome com.visualstudio.code com.microsoft.Edge org.keepassxc.KeePassXC com.qq.QQ com.tencent.WeChat org.libreoffice.LibreOffice com.spotify.Client org.mozilla.Thunderbird org.videolan.VLC com.wps.Office com.dropbox.Client org.freefilesync.FreeFileSync com.github.hluk.copyq org.filezillaproject.Filezilla io.github.cboxdoerfer.FSearch org.telegram.desktop org.freedesktop.Platform.Compat.i386 org.freedesktop.Platform.GL.default flathub org.gnome.FontManager org.gnome.font-viewer

flatpak install flathub org.winehq.Wine
flatpak override --user --filesystem=/home org.winehq.Wine
flatpak override --user --env=VARIABLE_NAME=value org.winehq.Wine
```