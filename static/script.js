// 全局变量
let memos = [];
let filteredMemos = [];
let nextId = 1;

// 分页相关变量
let currentPage = 1;
const itemsPerPage = 10;

// DOM元素
const memoInput = document.getElementById('memoInput');
const postBtn = document.getElementById('postBtn');
const memosList = document.getElementById('memosList');

// URL参数处理函数
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function setUrlParameter(name, value) {
    const url = new URL(window.location);
    if (value && value !== '1') {
        url.searchParams.set(name, value);
    } else {
        url.searchParams.delete(name);
    }
    window.history.pushState({}, '', url);
}

function initializePageFromUrl() {
    const pageParam = getUrlParameter('page');
    if (pageParam) {
        const page = parseInt(pageParam);
        if (page > 0) {
            currentPage = page;
        }
    }
}

// 处理浏览器前进后退按钮
window.addEventListener('popstate', function(event) {
    initializePageFromUrl();
    renderMemos();
});

// 页面路由处理
function handleRouting() {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    
    if (path.startsWith('/tag/')) {
        // 标签页面
        const tag = decodeURIComponent(path.split('/tag/')[1]);
        filterByTag(tag);
        document.title = `标签: ${tag} - MINIQuaily`;
    } else if (path === '/tags') {
        // 标签列表页面
        showTagsPage();
        document.title = '标签列表 - MINIQuaily';
    } else {
        // 首页
        const page = parseInt(params.get('page')) || 1;
        currentPage = page;
        filterByTag('all');
        document.title = 'MINIQuaily';
    }
}

// 显示标签列表页面
function showTagsPage() {
    const memosContainer = document.getElementById('memos');
    memosContainer.innerHTML = '<div class="loading">加载标签中...</div>';
    
    fetch('/api/tags')
        .then(response => response.json())
        .then(data => {
            renderTagsPage(data.tags);
        })
        .catch(error => {
            console.error('Error loading tags:', error);
            memosContainer.innerHTML = '<div class="error">加载标签失败</div>';
        });
}

// 渲染标签列表页面
function renderTagsPage(tags) {
    const memosContainer = document.getElementById('memos');
    
    let html = '<div class="tags-page">';
    html += '<h2>所有标签</h2>';
    html += '<div class="tags-grid">';
    
    tags.forEach(tag => {
        html += `
            <div class="tag-card" onclick="navigateToTag('${tag.name}')">
                <div class="tag-name">${tag.name}</div>
                <div class="tag-count">${tag.count} 篇文章</div>
            </div>
        `;
    });
    
    html += '</div></div>';
    memosContainer.innerHTML = html;
}

// 导航到标签列表页面
function navigateToTags(event) {
    event.preventDefault();
    window.history.pushState({}, '', '/tags');
    handleRouting();
}
function navigateToTag(tag) {
    const encodedTag = encodeURIComponent(tag);
    window.history.pushState({}, '', `/tag/${encodedTag}`);
    handleRouting();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadMemosFromAPI();
    setupEventListeners();
    
    // 处理浏览器前进后退
    window.addEventListener('popstate', handleRouting);
    
    // 初始路由处理
    handleRouting();
});

// 从API加载memos
async function loadMemosFromAPI() {
    try {
        const response = await fetch('/api/memos');
        const data = await response.json();
        
        // 转换时间戳格式
        memos = data.map(memo => ({
            ...memo,
            timestamp: new Date(memo.timestamp)
        }));
        
        filteredMemos = [...memos];
        nextId = Math.max(...memos.map(m => m.id), 0) + 1;
        renderMemos();
        
        // 加载标签
        await loadTags();
    } catch (error) {
        console.error('Error loading memos:', error);
        // 如果API加载失败，使用默认数据
        loadDefaultMemos();
    }
}

// 加载标签
async function loadTags() {
    try {
        const response = await fetch('/api/tags');
        const data = await response.json();
        renderTags(data.tags);
    } catch (error) {
        console.error('Error loading tags:', error);
    }
}

// 渲染标签
function renderTags(tags) {
    const tagsContainer = document.getElementById('tagsContainer');
    if (!tagsContainer) return;
    
    // 保留"全部"按钮
    const allButton = tagsContainer.querySelector('[data-tag="all"]');
    tagsContainer.innerHTML = '';
    tagsContainer.appendChild(allButton);
    
    // 只显示前20个最常用的标签
    const topTags = tags.slice(0, 20);
    
    topTags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag-filter';
        tagElement.setAttribute('data-tag', tag.name);
        tagElement.textContent = `${tag.name} (${tag.count})`;
        tagElement.onclick = () => filterByTag(tag.name);
        tagsContainer.appendChild(tagElement);
    });
}

// 加载默认数据（备用）
function loadDefaultMemos() {
    const sampleMemos = [
        {
            id: 1,
            content: "Welcome to your Memos! This is powered by Flask and reads from your markdown files.",
            tags: ["welcome", "flask"],
            timestamp: new Date(),
            likes: 0,
            hasCheckbox: false,
            author: "yourselfhosted"
        }
    ];
    
    memos = [...sampleMemos];
    filteredMemos = [...memos];
    nextId = 2;
    renderMemos();
}

// Event listeners
function setupEventListeners() {
    postBtn.addEventListener('click', handlePost);
    memoInput.addEventListener('input', handleInputChange);
    memoInput.addEventListener('keydown', handleKeyDown);
    
    // Write log functionality
    const writeLogBtn = document.getElementById('writeLogBtn');
    const writeLogModal = document.getElementById('writeLogModal');
    const saveLogBtn = document.getElementById('saveLogBtn');
    
    if (writeLogBtn) {
        writeLogBtn.addEventListener('click', openWriteLogModal);
    }
    if (saveLogBtn) {
        saveLogBtn.addEventListener('click', saveLog);
    }
    if (writeLogModal) {
        writeLogModal.addEventListener('click', function(e) {
            if (e.target === writeLogModal) {
                closeWriteLogModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const writeLogModal = document.getElementById('writeLogModal');
            if (writeLogModal && writeLogModal.style.display === 'flex') {
                closeWriteLogModal();
            }
        }
    });
}

function handleInputChange() {
    const hasContent = memoInput.value.trim().length > 0;
    postBtn.disabled = !hasContent;
}

function handleKeyDown(e) {
    if (e.ctrlKey && e.key === 'Enter') {
        handlePost();
    }
}

function handlePost() {
    const content = memoInput.value.trim();
    if (!content) return;

    const tags = extractTags(content);
    const newMemo = {
        id: nextId++,
        content: content,
        tags: tags,
        timestamp: new Date(),
        likes: 0,
        hasCheckbox: content.includes('[ ]') || content.includes('[x]'),
        author: "yourselfhosted"
    };

    memos.unshift(newMemo);
    memoInput.value = '';
    postBtn.disabled = true;
    renderMemos();
}

function extractTags(content) {
    const tagRegex = /#([^\s#]+)/g;
    const tags = [];
    let match;
    while ((match = tagRegex.exec(content)) !== null) {
        if (!tags.includes(match[1])) {
            tags.push(match[1]);
        }
    }
    return tags;
}

// 分页相关函数
function getTotalPages() {
    return Math.ceil(filteredMemos.length / itemsPerPage);
}

function getCurrentPageMemos() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMemos.slice(startIndex, endIndex);
}

function goToPage(page) {
    const totalPages = getTotalPages();
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    
    // 更新URL参数
    setUrlParameter('page', page);
    
    renderMemos();
    updatePaginationUI();
}

function nextPage() {
    goToPage(currentPage + 1);
}

function prevPage() {
    goToPage(currentPage - 1);
}

function updatePaginationUI() {
    const totalPages = getTotalPages();
    const paginationContainer = document.getElementById('pagination');
    
    if (!paginationContainer || totalPages <= 1) {
        if (paginationContainer) {
            paginationContainer.style.display = 'none';
        }
        return;
    }
    
    paginationContainer.style.display = 'flex';
    
    // 更新页码信息
    const pageInfo = document.getElementById('pageInfo');
    if (pageInfo) {
        pageInfo.textContent = `第 ${currentPage} 页，共 ${totalPages} 页`;
    }
    
    // 更新按钮状态
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
    }
}

function renderMemos() {
    memosList.innerHTML = '';
    
    if (filteredMemos.length === 0) {
        memosList.innerHTML = '<div class="no-memos">No memos found. Start by writing your first memo!</div>';
        updatePaginationUI();
        return;
    }
    
    // 获取当前页的memos
    const currentPageMemos = getCurrentPageMemos();
    
    currentPageMemos.forEach(memo => {
        const memoElement = createMemoElement(memo);
        memosList.appendChild(memoElement);
    });
    
    // 更新分页UI
    updatePaginationUI();
}

function createMemoElement(memo) {
    const memoDiv = document.createElement('div');
    memoDiv.className = 'memo-item';
    memoDiv.dataset.id = memo.id;

    const shouldTruncate = shouldTruncateContent(memo.content);
    const displayContent = shouldTruncate ? getTruncatedContent(memo.content) : memo.content;
    const formattedContent = formatMemoContent(displayContent);
    const timeAgo = getTimeAgo(memo.timestamp);

    // 检查是否需要显示标题
    const shouldShowTitle = memo.title && memo.filename && memo.title !== memo.filename.replace('.md', '');
    const titleHtml = shouldShowTitle ? `<div class="memo-title"><h1>${memo.title}</h1></div>` : '';

    memoDiv.innerHTML = `
        <div class="memo-header">
            <div class="memo-author">
                <div class="author-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="author-info">
                    <span class="author-name">${memo.author}</span>
                    <span class="memo-time">${timeAgo}</span>
                </div>
            </div>
            <div class="memo-actions">
                <button class="btn-icon" onclick="copyMemo(${memo.id})" title="Copy">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="btn-icon" onclick="shareMemo(${memo.id})" title="Share">
                    <i class="fas fa-share"></i>
                </button>
                <button class="btn-icon" onclick="deleteMemo(${memo.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn-icon" title="More">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
        </div>
        ${titleHtml}
        <div class="memo-content">${formattedContent}</div>
        ${shouldTruncate ? `
            <div class="read-more-container">
                <button class="read-more-btn" onclick="showExpandedMemo(${memo.id})">
                    <i class="fas fa-expand-alt"></i>
                    阅读全文
                </button>
            </div>
        ` : ''}
        ${memo.tags.length > 0 ? `
            <div class="memo-tags">
                ${memo.tags.map(tag => `<span class="tag" onclick="filterByTag('${tag}')">#${tag}</span>`).join('')}
            </div>
        ` : ''}
        <div class="memo-footer">
            <div class="memo-reactions">
                <button class="reaction-btn ${memo.likes > 0 ? 'active' : ''}" onclick="toggleLike(${memo.id})">
                    <i class="fas fa-heart"></i>
                    <span>${memo.likes > 0 ? memo.likes : ''}</span>
                </button>
            </div>
        </div>
    `;

    return memoDiv;
}

function formatMemoContent(content) {
    let formatted = content;

    // Handle headers (# Title)
    formatted = formatted.replace(/^# (.+)$/gm, '<h2 class="memo-title">$1</h2>');
    formatted = formatted.replace(/^## (.+)$/gm, '<h3 class="memo-subtitle">$1</h3>');
    
    // Handle code blocks
    formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Handle inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Handle images (![alt text](image.png))
    formatted = formatted.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function(match, alt, src) {
        // Handle relative paths starting with ../ or ../../
        if (src.startsWith('../')) {
            // Remove all ../ prefixes and convert to absolute path from content directory
            const cleanPath = src.replace(/^(\.\.\/)+/, '');
            src = '/content/' + cleanPath;
        }
        return `<img src="${src}" alt="${alt}" class="memo-image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0;">`;
    });
    
    // Handle checkboxes
    formatted = formatted.replace(/\[x\]/g, '<input type="checkbox" checked disabled>');
    formatted = formatted.replace(/\[ \]/g, '<input type="checkbox" disabled>');
    
    // Handle bullet points
    formatted = formatted.replace(/^• (.+)$/gm, '<div class="bullet-item">• $1</div>');
    formatted = formatted.replace(/^  - (.+)$/gm, '<div class="sub-bullet-item">- $1</div>');
    formatted = formatted.replace(/^- (.+)$/gm, '<div class="bullet-item">- $1</div>');
    
    // Handle line breaks
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Handle tags (make them clickable)
    formatted = formatted.replace(/#([^\s#]+)/g, '<span class="tag" onclick="filterByTag(\'$1\')">#$1</span>');

    return formatted;
}

function getTimeAgo(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

function toggleLike(memoId) {
    const memo = memos.find(m => m.id === memoId);
    if (memo) {
        memo.likes = memo.likes > 0 ? 0 : 1;
        renderMemos();
    }
}

function deleteMemo(memoId) {
    if (confirm('Are you sure you want to delete this memo?')) {
        memos = memos.filter(m => m.id !== memoId);
        renderMemos();
    }
}

function filterByTag(tag) {
    if (tag === 'all') {
        filteredMemos = [...memos];
    } else {
        filteredMemos = memos.filter(memo => 
            memo.tags && memo.tags.some(t => 
                t.toLowerCase().includes(tag.toLowerCase())
            )
        );
    }
    
    // 重置到第一页
    currentPage = 1;
    
    // 清除URL中的页码参数
    setUrlParameter('page', 1);
    
    renderMemos();
    
    // 更新标签按钮状态
    document.querySelectorAll('.tag-filter').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 激活当前选中的标签
    const activeBtn = document.querySelector(`[data-tag="${tag}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

function copyMemo(memoId) {
    const memo = memos.find(m => m.id === memoId);
    if (memo) {
        navigator.clipboard.writeText(memo.content).then(() => {
            // Show a temporary success message
            const notification = document.createElement('div');
            notification.className = 'notification success';
            notification.textContent = 'Copied to clipboard!';
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 2000);
        });
    }
}

function shareMemo(memoId) {
    const memo = memos.find(m => m.id === memoId);
    if (memo) {
        if (navigator.share) {
            navigator.share({
                title: 'Memo',
                text: memo.content,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            copyMemo(memoId);
        }
    }
}

// Auto-resize textarea
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

// Add auto-resize to memo input
memoInput.addEventListener('input', function() {
    autoResize(this);
});

// Initialize button state
handleInputChange();

// 内容截断和展开相关函数
function shouldTruncateContent(content) {
    const lines = content.split('\n');
    const hasImage = content.includes('![');
    
    if (hasImage) {
        // 如果有图片，检查是否需要截断
        const imageIndex = content.indexOf('![');
        const contentAfterFirstImage = content.substring(imageIndex);
        const firstImageEnd = contentAfterFirstImage.indexOf('\n');
        
        if (firstImageEnd === -1) {
            // 只有一个图片，不需要截断
            return false;
        }
        
        const remainingContent = contentAfterFirstImage.substring(firstImageEnd + 1).trim();
        return remainingContent.length > 0;
    } else {
        // 没有图片，检查是否超过5行
        return lines.length > 5;
    }
}

function getTruncatedContent(content) {
    const hasImage = content.includes('![');
    
    if (hasImage) {
        // 截断到第一个图片后
        const imageIndex = content.indexOf('![');
        const contentAfterFirstImage = content.substring(imageIndex);
        const firstImageEnd = contentAfterFirstImage.indexOf('\n');
        
        if (firstImageEnd === -1) {
            return content; // 只有一个图片
        }
        
        return content.substring(0, imageIndex + firstImageEnd);
    } else {
        // 截断到前5行
        const lines = content.split('\n');
        return lines.slice(0, 5).join('\n');
    }
}

function createExpandedMemoModal(memo) {
    // 创建模态框背景
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.onclick = () => closeExpandedMemo();
    
    // 创建模态框内容
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.onclick = (e) => e.stopPropagation();
    
    const formattedContent = formatMemoContent(memo.content);
    const timeAgo = getTimeAgo(memo.timestamp);
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>完整文章</h3>
            <button class="modal-close-btn" onclick="closeExpandedMemo()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="expanded-memo">
            <div class="memo-header">
                <div class="memo-author">
                    <div class="author-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="author-info">
                        <span class="author-name">${memo.author}</span>
                        <span class="memo-time">${timeAgo}</span>
                    </div>
                </div>
            </div>
            <div class="memo-content">${formattedContent}</div>
            ${memo.tags.length > 0 ? `
                <div class="memo-tags">
                    ${memo.tags.map(tag => `<span class="tag" onclick="filterByTag('${tag}'); closeExpandedMemo();">#${tag}</span>`).join('')}
                </div>
            ` : ''}
            <div class="memo-footer">
                <div class="memo-reactions">
                    <button class="reaction-btn ${memo.likes > 0 ? 'active' : ''}" onclick="toggleLike(${memo.id})">
                        <i class="fas fa-heart"></i>
                        <span>${memo.likes > 0 ? memo.likes : ''}</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modalOverlay.appendChild(modalContent);
    return modalOverlay;
}

function showExpandedMemo(memoId) {
    // 跳转到静态页面链接
    window.open(`/memo/${memoId}`, '_blank');
}

function closeExpandedMemo() {
    // 这个函数现在不再需要，因为我们使用新页面打开
    // 保留空函数以防其他地方有引用
}

// 随机文章功能
async function loadRandomArticles() {
    try {
        const response = await fetch('/api/random-articles');
        if (response.ok) {
            const randomArticles = await response.json();
            renderRandomArticles(randomArticles);
        } else {
            console.error('Failed to load random articles');
        }
    } catch (error) {
        console.error('Error loading random articles:', error);
    }
}

function renderRandomArticles(articles) {
    const randomArticlesContainer = document.getElementById('randomArticles');
    if (!randomArticlesContainer) return;

    if (articles.length === 0) {
        randomArticlesContainer.innerHTML = '<p class="no-articles">暂无文章</p>';
        return;
    }

    const articlesHTML = articles.map(article => `
        <a href="/memo/${article.id}" class="random-article-item" target="_blank">
            <div class="random-article-title">${escapeHtml(article.title)}</div>
            <div class="random-article-meta">
                <span>${article.time_ago}</span>
                ${article.tags && article.tags.length > 0 ? `
                    <div class="random-article-tags">
                        ${article.tags.slice(0, 2).map(tag => `
                            <span class="random-article-tag">${escapeHtml(tag)}</span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </a>
    `).join('');

    randomArticlesContainer.innerHTML = articlesHTML;
}

// HTML转义函数
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 搜索功能
function setupSearchForm() {
    const searchForm = document.getElementById('search');
    const searchInput = document.getElementById('tipue_search_input');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query.length >= 2) {
                await performSearch(query);
            } else {
                alert('搜索关键词至少需要2个字符');
            }
        });
    }
}

async function performSearch(query) {
    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
            const searchData = await response.json();
            displaySearchResults(searchData);
        } else {
            const errorData = await response.json();
            alert(errorData.error || '搜索失败');
        }
    } catch (error) {
        console.error('Search error:', error);
        alert('搜索时发生错误');
    }
}

function displaySearchResults(searchData) {
    const { query, results, total } = searchData;
    
    // 创建搜索结果页面
    const searchResultsHTML = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>搜索结果 - ${escapeHtml(query)}</title>
            <link rel="stylesheet" href="/static/styles.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        </head>
        <body>
            <div class="container">
                <header class="header">
                    <div class="header-content">
                        <div class="logo">MINIQuaily</div>
                        <div class="header-actions">
                            <button class="btn-icon" onclick="window.close()" title="关闭">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </header>
                
                <main class="main-content">
                    <div class="search-results-header">
                        <h2>搜索结果</h2>
                        <p>关键词："${escapeHtml(query)}" - 找到 ${total} 条结果</p>
                        <button onclick="window.history.back()" class="btn-back">
                            <i class="fas fa-arrow-left"></i> 返回
                        </button>
                    </div>
                    
                    <div class="search-results">
                        ${results.length > 0 ? results.map(result => `
                            <div class="search-result-item">
                                <h3 class="search-result-title">
                                    <a href="/memo/${result.id}" target="_blank">${escapeHtml(result.title)}</a>
                                </h3>
                                <p class="search-result-content">${escapeHtml(result.content)}</p>
                                <div class="search-result-meta">
                                    <span class="search-result-time">${result.time_ago}</span>
                                    ${result.tags && result.tags.length > 0 ? `
                                        <div class="search-result-tags">
                                            ${result.tags.map(tag => `
                                                <span class="search-result-tag">${escapeHtml(tag)}</span>
                                            `).join('')}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('') : '<p class="no-results">没有找到相关文章</p>'}
                    </div>
                </main>
            </div>
        </body>
        </html>
    `;
    
    // 在新窗口中显示搜索结果
    const searchWindow = window.open('', '_blank');
    searchWindow.document.write(searchResultsHTML);
    searchWindow.document.close();
}

// ...

// Write Log functionality
// Write log functionality - moved to setupEventListeners function

function openWriteLogModal() {
    writeLogModal.style.display = 'flex';
    logContent.focus();
}

function closeWriteLogModal() {
    writeLogModal.style.display = 'none';
    logContent.value = '';
    logTags.value = '';
}

// Remove duplicate modal event listeners - moved to setupEventListeners function

async function saveLog() {
    const logContent = document.getElementById('logContent');
    const logTags = document.getElementById('logTags');
    const saveLogBtn = document.getElementById('saveLogBtn');
    
    const content = logContent.value.trim();
    if (!content) {
        alert('请输入日志内容');
        return;
    }

    const tags = logTags.value.trim();
    
    // Generate title from first line or first 50 characters
    const firstLine = content.split('\n')[0];
    const title = firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
    
    // Generate slug from title
    const slug = title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    
    // Get current datetime
    const now = new Date();
    const datetime = now.toISOString();
    const date = now.toISOString().split('T')[0];
    
    // Generate summary from first paragraph or first 200 characters
    const firstParagraph = content.split('\n\n')[0];
    const summary = firstParagraph.length > 200 ? firstParagraph.substring(0, 200) + '...' : firstParagraph;
    
    const logData = {
        title: title,
        slug: slug,
        datetime: datetime,
        date: date,
        summary: summary,
        tags: tags,
        cover_image_url: '',
        content: content
    };

    try {
        saveLogBtn.disabled = true;
        saveLogBtn.textContent = '保存中...';
        
        const response = await fetch('/api/save-log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(logData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('日志保存成功！');
            closeWriteLogModal();
            // Clear form
            logContent.value = '';
            logTags.value = '';
            // Reload memos to show the new log
            loadMemosFromAPI();
        } else {
            alert('保存失败：' + result.error);
        }
    } catch (error) {
        console.error('Error saving log:', error);
        alert('保存失败：网络错误');
    } finally {
        saveLogBtn.disabled = false;
        saveLogBtn.textContent = '保存日志';
    }
}