---
title: 簡単なモダンな VIM の設定
slug: vim
date: 2024-08-10 00:00
datetime: 2024-08-10 00:00
summary: 简单而现代的 VIM 编辑器配置，包括基本设置、快捷键配置和性能优化，让 VIM 像现代编辑器一样易用。
tags: VIM
cover_image_url: 
---
![VIM](../../assets/VIM.jpg)


**最小限のパラメータで、VIM をモダンなエディタのように使える簡単な設定です。マウス操作ができ、一般的なショートカットキーでテキストを編集できます。**

```bash

" 基本设置
set nocompatible          " 使用vim而非vi
set wildmenu              " 按TAB键时命令行自动补齐
set ignorecase smartcase  " 搜索时忽略大小写，但在有大写字母时匹配大小写
set number relativenumber " 显示相对行号和当前行号
set visualbell t_vb=      " 禁止响铃和闪烁
set ruler                 " 显示当前光标位置
set autoread              " 文件在Vim之外修改过，自动重新读入
set autowrite             " 设置自动保存内容
set autochdir             " 当前目录随着被编辑文件的改变而改变
set mouse=a               " 开启鼠标支持
set shiftwidth=4 tabstop=4 expandtab " 设置缩进为4个空格
set smartindent           " 启用智能缩进
set autoindent            " 参考上一行的缩进方式进行自动缩进
set smarttab              " 启用智能TAB键
set hlsearch incsearch    " 开启搜索结果的高亮显示和实时搜索
set noswapfile nobackup nowritebackup " 禁用交换文件和备份文件

" 设置backspace键功能
set backspace=eol,start,indent
" 设置backspace键在任何模式下都进入编辑模式并删除字符
nnoremap <BS> i<BS>
vnoremap <BS> i<BS>

" tab设为4个空格
set tabstop=4
set shiftwidth=4
set softtabstop=4
set expandtab
set smarttab
" 新一行与上一行的缩进一致
set autoindent

" 性能优化
set lazyredraw            " 提高宏执行速度
set ttyfast               " 加快终端连接速度

" 编码设置
set encoding=utf-8
set fileencoding=utf-8
set fileencodings=utf-8,gb2312,gb18030,gbk,ucs-bom,cp936,latin1

" 设置键绑定，使其与现代编辑器一致
" 撤销和重做
nnoremap <silent> <C-z> u
inoremap <silent> <C-z> <C-o>u
nnoremap <silent> <C-y> <C-r>
inoremap <silent> <C-y> <C-o><C-r>

" 复制、剪切和粘贴
vnoremap <silent> <C-c> "+y
vnoremap <silent> <C-x> "+d
nnoremap <silent> <C-v> "+p
inoremap <silent> <C-v> <C-r>+
cnoremap <silent> <C-v> <C-r>+

" 强制退出（不保存）
nnoremap <silent> <C-q> :q!<CR>
inoremap <silent> <C-q> <Esc>:q!<CR>

" 全选
nnoremap <silent> <C-a> ggVG
inoremap <silent> <C-a> <Esc>ggVG

" 保存
nnoremap <silent> <C-s> :update<CR>
inoremap <silent> <C-s> <Esc>:update<CR>a

" 查找
nnoremap <C-f> /
inoremap <C-f> <Esc>/

" 在查找状态下切换搜索选项
cnoremap <C-n> <C-g>
cnoremap <C-m> <C-t>

" 全局替换
nnoremap <C-h> :%s///g<Left><Left><Left>
inoremap <C-h> <Esc>:%s///g<Left><Left><Left>

" 确保回车键在替换操作时可以正常工作
cnoremap <expr> <CR> getcmdtype() =~ '[/?]' ? '<CR>' : '<C-]><CR>'

" 窗口分割快捷键
nnoremap <silent> <C-l> :vsplit<CR><C-w>l
nnoremap <silent> <C-j> :vsplit<CR><C-w>h
nnoremap <silent> <C-i> :split<CR><C-w>k
nnoremap <silent> <C-k> :split<CR><C-w>j

" 显示行号
set number
" 高亮显示当前行
set cursorline
" 让一行的内容不换行
set nowrap
" 距窗口边缘还有多少行时滚动窗口
set scrolloff=8

" 显示不可见字符
set list listchars=tab:»·,trail:·,extends:>,precedes:<
" 在底部显示命令
set showcmd
" 允许在未保存的缓冲区间切换
set hidden
" 设置分割窗口在下方和右侧打开
set splitbelow splitright

" 代码颜色主题
syntax enable              " 开启语法高亮并优化性能
if has('termguicolors')
    set termguicolors
endif
" 设置颜色主题
colorscheme evening

```