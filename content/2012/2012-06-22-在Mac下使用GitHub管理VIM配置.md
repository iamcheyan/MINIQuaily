---
title: 在Mac下使用GitHub管理VIM配置
slug: 2012-06-22-在mac下使用github管理vim配置
datetime: 2012-06-22 00:00
date: 2012-06-22 00:00
summary: 2012-06-22-在mac下使用github管理vim配置
tags: VIM, Mac, GitHub
cover_image_url: 
---
![64d1ec5djw1du852bm7ymg.gif][1]
<!--more-->
vim这工具年代久，秘籍多，插件纷繁，在日常使用的时候经常会对.vimrc做些修改，再装些插件什么的，不知不觉就会变得乱七八糟，而且又牵扯到跨平台，文件拷来拷去的也不方便管理，看到很多朋友（例如[keke](http://www.imkeke.net/ "keke")）都把vim的配置文件传到github上面，感觉这是个不错的方法，方便自己使用，也利于跟朋友分享（上次微博上一个朋友找我要vim的配置，当时就临时的新建了一个MacVim的项目）。
<!--more-->### 准备一个配置文件夹vim的配置主要分两个部分:_.vimrc(或者.gvimrc)和.vim文件夹_。为了方便管理，我在Mac下将.vimrc拷贝到了.vim文件夹下面并改为_vimrc(这样在Mac下可见)，然后通过ln -s做了一个名为.vimrc的符号链接到HOME文件夹下。
<pre class="lang:sh decode:true">ln -s ~/.vim/_vimrc ~/.vimrc</pre>
这样一来push到github上面的时候只需要传.vim文件夹就行了。### 使用pathogen管理所有的vim插件vim的插件安装方法一般都是拷贝几个文件到_ftplugin,syntax,doc_等文件夹下，虽然方便，但时间一长vim文件夹就变得混乱不堪，卸载起来也不方便，需要到一个个文件夹下找对应的文件，相当不直观，于是我这次整理了一下，把所有的插件都换用[pathogen](http://www.douban.com/group/topic/12214737/ "推荐pathogen.vim，管理插件的插件")管理，插件存放在_.vim/bundle_ 文件夹下，而且大部分插件如果在github上有项目的话，就从github上clone，方便以后更新。
> 具体的插件列表请见我的[_vimrc](https://github.com/iamcheyan/MacVim/blob/master/_vimrc)文件。### 推送到github1.  先在github上建立一个项目MacVim([https://github.com/iamcheyan/MacVim](https://github.com/iamcheyan/MacVim.git "MacVim"))。然后进入.vim目录，初始化版本库
<pre class="lang:sh decode:true ">cd ~/.vim
git init</pre>2.  使用Mac的话在系统会自动产生_.DS_Store_文件，以及一些私密的文件(例如使用vimprojects管理的公司项目的列表)，这些文件不需要被push到github，所以要建立一个过滤列表(在项目根目录下建立 .gitignore 文件，具体说明[详见这里](http://f2e.us/wiki/git-ignore.html#!/ "忽略文件默认为当前目录的.gitignore。  "))。
<pre class="lang:sh decode:true ">vi .gitignore</pre>
在.gitignore文件里填入需要过滤的文件或文件夹，[这里是我的设置](https://github.com/iamcheyan/MacVim/blob/master/.gitignore)
3.  上传到github
<pre class="lang:sh mark:2-3 decode:true  crayon-selected">git add . (使用.是把所有文件都添加进去)
git commit -m"这里是更新说明"
git remote add origin git@github.com/iamcheyan/MacVim.git (这里要填入你自己的项目地址)
git push -u origin master</pre>
当看到_Compressing objects: 100% (182/182), done_时候就说明推送完了。### 具体如何使用上面已经把vim的配置传到github了，当需要在另外的机器上使用这个配置的时候，就把这整个项目clone到本地。
<pre class="lang:sh mark:2-3 decode:true crayon-selected">cd ~ (到HOME目录中)
git clone github.com/iamcheyan/MacVim.git ~/.vim (把MacVim这个项目克隆到本地)
ln -s ~/.vim/&lt;em&gt;vimrc ~/.vimrc (把&lt;/em&gt;vimrc这个文件进行软链接到.vimrc)</pre>### 部分插件列表本来不打算列的，不过想来都是折腾控，所以就简单列下<dl><dt>使用git同步的插件:</dt><dd>vimim中文输入法,使用_⌘+空格_切换,我默认启用的是双拼,自然码</dd><dd>vim-colors-solarized配色,详见这里</dd><dd>mru记录最近打开的文件(o在缓冲区打开,t在新标签打开)_推荐_</dd><dd>NERD_tree文件树</dd><dd>zencoding不多说了,神器_推荐_</dd><dd>visualmark高亮标签(mm标记)_推荐_</dd></dl><dl><dt>未使用git同步的插件:</dt><dd>project项目管理插件,使用,-p启动</dd><dd>after/syntax/css.vim使CSS颜色高亮_推荐_</dd><dd>NERD_commenter快速注释_推荐_</dd><dd>load_template新建文档模板插件,使用LoadTemplate_推荐_</dd><dd>colorselVIM配色调整工具</dd><dd>MatchTag显示配对的HTML标签_推荐_</dd></dl>未能详尽，其他请见[_vimrc](https://github.com/iamcheyan/MacVim/blob/master/_vimrc)文件。
  [1]: ../assets/2020/10/2562402378.gif