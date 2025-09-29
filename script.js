// Sample data based on the demo content
const sampleMemos = [
    {
        id: 1,
        content: "Does this have sublists?\n• A\n  - B\n  - C\ntext\nGet-Mailbox #powershell\n#测试/测试3 Thinking of memos.\n\n# This is headline\n[ ] This is checkbox\n- #测试/测试3 sdfafda\ntest\ntext",
        tags: ["powershell", "测试/测试3"],
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        likes: 0,
        hasCheckbox: true,
        author: "iamcheyan"
    },
    {
        id: 2,
        content: `#include <iostream>

int main() {
    std::cout << "Hello memos";
    return 0;
}`,
        tags: ["hello"],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        likes: 1,
        hasCheckbox: false,
        author: "iamcheyan"
    },
    {
        id: 3,
        content: "wow nice ui\nChecking out\nTesting public one",
        tags: [],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        likes: 0,
        hasCheckbox: false,
        author: "iamcheyan"
    },
    {
        id: 4,
        content: "Hello world. This is my first memo! #hello",
        tags: ["hello"],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        likes: 0,
        hasCheckbox: false,
        author: "iamcheyan"
    },
    {
        id: 5,
        content: "Ok, I'm able to upload some images. #features",
        tags: ["features"],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        likes: 0,
        hasCheckbox: false,
        author: "iamcheyan"
    },
    {
        id: 6,
        content: "And here are my tasks. #todo\n[x] deploy memos for myself;\n[x] share to my friends;\n[ ] sounds good to me!",
        tags: ["todo"],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        likes: 0,
        hasCheckbox: true,
        author: "iamcheyan"
    },
    {
        id: 7,
        content: "Wow, it can be referenced too! REALLY GREAT!!! #features",
        tags: ["features"],
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
        likes: 0,
        hasCheckbox: false,
        author: "iamcheyan"
    }
];

let memos = [...sampleMemos];
let nextId = Math.max(...memos.map(m => m.id)) + 1;

// DOM elements
const memoInput = document.getElementById('memoInput');
const postBtn = document.getElementById('postBtn');
const memosList = document.getElementById('memosList');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderMemos();
    setupEventListeners();
});

// Event listeners
function setupEventListeners() {
    postBtn.addEventListener('click', handlePost);
    memoInput.addEventListener('input', handleInputChange);
    memoInput.addEventListener('keydown', handleKeyDown);
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
        author: "iamcheyan"
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

function renderMemos() {
    memosList.innerHTML = '';
    memos.forEach(memo => {
        const memoElement = createMemoElement(memo);
        memosList.appendChild(memoElement);
    });
}

function createMemoElement(memo) {
    const memoDiv = document.createElement('div');
    memoDiv.className = 'memo-item';
    memoDiv.dataset.id = memo.id;

    const formattedContent = formatMemoContent(memo.content);
    const timeAgo = getTimeAgo(memo.timestamp);

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
        <div class="memo-content">${formattedContent}</div>
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
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
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
    // This could be implemented to filter memos by tag
    console.log(`Filtering by tag: ${tag}`);
    // For now, just highlight the tag
    const tagElements = document.querySelectorAll('.tag');
    tagElements.forEach(el => {
        el.style.backgroundColor = el.textContent === `#${tag}` ? '#3b82f6' : '';
        el.style.color = el.textContent === `#${tag}` ? 'white' : '';
    });
    
    setTimeout(() => {
        tagElements.forEach(el => {
            el.style.backgroundColor = '';
            el.style.color = '';
        });
    }, 1000);
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