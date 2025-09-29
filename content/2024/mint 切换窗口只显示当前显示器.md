---
title: 让 Linutx mint 使用 Alt-Tab 只显示当前窗口
slug: mint-切换窗口只显示当前显示器
datetime: 2024-01-03 00:00
date: 2024-01-03 00:00
summary: mint-切换窗口只显示当前显示器
tags: Linutx mint
cover_image_url: 
---
![image-20240103134809876](../../assets/image-20240103134809876.png)

## 解释

我有两个显示器，当使用`Alt-Tab`切换窗口时，无论当前在哪个显示器里，Mint 默认都会把两个显示器的内容都显示在 `Alt-Tab`中，很乱，在设置里也没这个选项，最后我在 [这里](https://github.com/linuxmint/cinnamon/issues/4330) 找到了解决方案。



### 方法

```bash
sudo xed /usr/share/cinnamon/js/ui/appSwitcher/appSwitcher.js	# 修改切换窗口文件
```

在大约65行左右的位置，找到`windows = windows.filter(Main.isInteresting);`这一行，在它的后面加一行`windows = windows.filter(w => w.get_monitor() === global.screen.get_current_monitor()) // 过滤当前显示器的窗口`，如下：

```
function getWindowsForBinding(binding) {
    // Construct a list with all windows
    let windows = [];
    let windowActors = global.get_window_actors();
    for (let i in windowActors)
        windows.push(windowActors[i].get_meta_window());

    windows = windows.filter(Main.isInteresting);
    windows = windows.filter(w => w.get_monitor() === global.screen.get_current_monitor()) // 过滤当前显示器的窗口
```

然后`alt+f2`，输入`rt`重启 cinnamon 即可。

打算回头好好研究下这个文件，感觉通过 js+css 能完成许多好玩的系统自定义功能。



# 进阶：修改切换窗口时显示缩略图的时间

![Peek 2024-01-03 14-06](../../assets/Peek 2024-01-03 14-06.gif)

顺便又研究了下，`/usr/share/cinnamon/js/ui/appSwitcher/classicSwitcher.js` 这里是有关切换任务时的另外一些设定，包含了这些参数：

```
POPUP_SCROLL_TIME: 弹出菜单滚动时间，单位为秒。它控制了弹出菜单中内容滚动的速度。
POPUP_DELAY_TIMEOUT: 弹出延迟超时时间，单位为毫秒。它控制了弹出菜单的延迟时间，即鼠标悬停在应用图标上的一段时间后，才会触发弹出菜单。
POPUP_FADE_OUT_TIME: 弹出菜单淡出时间，单位为秒。它控制了弹出菜单在隐藏时的淡出效果的持续时间。
APP_ICON_HOVER_TIMEOUT: 应用图标悬停超时时间，单位为毫秒。它控制了鼠标在应用图标上悬停的时间，达到该时间后会触发相应的事件。
THUMBNAIL_DEFAULT_SIZE: 缩略图默认大小，单位为像素。它定义了缩略图显示的默认大小。
THUMBNAIL_POPUP_TIME: 缩略图弹出时间，单位为毫秒。它控制了缩略图显示的持续时间。
THUMBNAIL_FADE_TIME: 缩略图淡出时间，单位为秒。它控制了缩略图在隐藏时的淡出效果的持续时间。
PREVIEW_DELAY_TIMEOUT: 预览延迟超时时间，单位为毫秒。它控制了预览效果的延迟时间，即鼠标悬停在应用图标上的一段时间后，才会触发预览效果。
PREVIEW_SWITCHER_FADEOUT_TIME: 预览切换器淡出时间，单位为秒。它控制了预览切换器在隐藏时的淡出效果的持续时间。
iconSizes: 应用图标尺寸数组。它定义了不同大小的应用图标的尺寸，用于在切换器中显示不同大小的图标。
```

把`THUMBNAIL_POPUP_TIME`改成`0`就可以让缩略图即时显示了。