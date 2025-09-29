from flask import Flask, render_template, jsonify, send_from_directory, request
import os
import re
import random
from datetime import datetime
import markdown
import frontmatter
from pathlib import Path

app = Flask(__name__)

class MemoParser:
    def __init__(self, content_dir="content"):
        self.content_dir = content_dir
        
    def parse_filename(self, filename):
        """从文件名解析日期和标题"""
        # 匹配格式：YYYY-MM-DD-标题.md
        pattern = r'(\d{4}-\d{2}-\d{2})-(.+)\.md$'
        match = re.match(pattern, filename)
        if match:
            date_str, title = match.groups()
            try:
                date = datetime.strptime(date_str, '%Y-%m-%d')
                return date, title
            except ValueError:
                pass
        
        # 如果无法解析日期，使用文件修改时间
        return None, filename.replace('.md', '')
    
    def extract_tags(self, content):
        """从内容中提取标签"""
        # 匹配 #标签 格式
        tag_pattern = r'#([^\s#]+)'
        tags = re.findall(tag_pattern, content)
        return list(set(tags))  # 去重
    
    def has_checkbox(self, content):
        """检查内容是否包含复选框"""
        checkbox_pattern = r'\[[ xX]\]'
        return bool(re.search(checkbox_pattern, content))
    
    def read_markdown_file(self, filepath):
        """读取并解析markdown文件"""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                post = frontmatter.load(f)
            
            filename = os.path.basename(filepath)
            
            # 优先使用YAML front matter中的数据
            title = post.metadata.get('title', '')
            slug = post.metadata.get('slug', '')
            summary = post.metadata.get('summary', '')
            
            # 处理日期
            date = None
            datetime_str = post.metadata.get('datetime', '')
            date_str = post.metadata.get('date', '')
            
            # 尝试解析datetime字段
            if datetime_str:
                try:
                    # 处理多种日期格式
                    if ' 00:00' in datetime_str:
                        date = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M 00:00')
                    elif len(datetime_str) == 16:  # YYYY-MM-DD HH:MM
                        date = datetime.strptime(datetime_str, '%Y-%m-%d %H:%M')
                    elif len(datetime_str) == 10:  # YYYY-MM-DD
                        date = datetime.strptime(datetime_str, '%Y-%m-%d')
                except ValueError:
                    pass
            
            # 如果datetime解析失败，尝试date字段
            if date is None and date_str:
                try:
                    if len(date_str) == 16:  # YYYY-MM-DD HH:MM
                        date = datetime.strptime(date_str, '%Y-%m-%d %H:%M')
                    elif len(date_str) == 10:  # YYYY-MM-DD
                        date = datetime.strptime(date_str, '%Y-%m-%d')
                except ValueError:
                    pass
            
            # 如果YAML中没有日期，尝试从文件名解析
            if date is None:
                parsed_date, parsed_title = self.parse_filename(filename)
                date = parsed_date
                if not title:
                    title = parsed_title
            
            # 如果仍然无法解析日期，使用文件修改时间
            if date is None:
                stat = os.stat(filepath)
                date = datetime.fromtimestamp(stat.st_mtime)
            
            # 处理标签
            tags = post.metadata.get('tags', '')
            if isinstance(tags, str):
                # 如果tags是字符串，按逗号分割
                tags = [tag.strip() for tag in tags.split(',') if tag.strip()]
            elif isinstance(tags, list):
                # 如果tags已经是列表，直接使用
                tags = [str(tag).strip() for tag in tags if str(tag).strip()]
            else:
                # 如果没有tags或格式不对，从内容中提取
                tags = self.extract_tags(post.content)
            
            has_checkbox = self.has_checkbox(post.content)
            
            return {
                'filename': filename,
                'title': title or filename.replace('.md', ''),
                'slug': slug,
                'summary': summary,
                'content': post.content,
                'date': date,
                'tags': tags,
                'has_checkbox': has_checkbox,
                'filepath': filepath
            }
        except Exception as e:
            print(f"Error reading {filepath}: {e}")
            return None
    
    def get_all_memos(self):
        """获取所有memo"""
        memos = []
        memo_id = 1
        
        # 遍历content目录下的所有年份文件夹
        content_path = Path(self.content_dir)
        if not content_path.exists():
            return []
        
        for year_dir in sorted(content_path.iterdir()):
            if year_dir.is_dir() and year_dir.name.isdigit():
                # 遍历年份目录下的所有md文件
                for md_file in year_dir.glob('*.md'):
                    if md_file.name.endswith('.processed'):
                        continue  # 跳过处理过的文件
                    
                    memo_data = self.read_markdown_file(md_file)
                    if memo_data:
                        memo = {
                            'id': memo_id,
                            'content': memo_data['content'],
                            'tags': memo_data['tags'],
                            'timestamp': memo_data['date'],
                            'likes': 0,  # 默认点赞数
                            'hasCheckbox': memo_data['has_checkbox'],
                            'author': 'iamcheyan',
                            'title': memo_data['title'],
                            'slug': memo_data.get('slug', ''),
                            'summary': memo_data.get('summary', ''),
                            'year': year_dir.name,
                            'filename': memo_data['filename']
                        }
                        memos.append(memo)
                        memo_id += 1
        
        # 按日期倒序排列（最新的在前面）
        memos.sort(key=lambda x: x['timestamp'], reverse=True)
        return memos

# 创建解析器实例
memo_parser = MemoParser()

@app.route('/')
def index():
    """主页"""
    return render_template('index.html')

@app.route('/content/<path:filename>')
def serve_content_files(filename):
    """服务content目录下的静态文件（如图片）"""
    return send_from_directory('content', filename)

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    """服务assets目录下的静态文件（如图片）"""
    return send_from_directory('assets', filename)

@app.route('/api/memos')
def get_memos():
    """获取所有memos的API接口"""
    memos = memo_parser.get_all_memos()
    
    # 将datetime对象转换为字符串，便于JSON序列化
    for memo in memos:
        memo['timestamp'] = memo['timestamp'].isoformat()
    
    return jsonify(memos)

@app.route('/api/memos/<int:memo_id>')
def get_memo(memo_id):
    """获取单个memo的API接口"""
    memos = memo_parser.get_all_memos()
    memo = next((m for m in memos if m['id'] == memo_id), None)
    
    if memo:
        memo['timestamp'] = memo['timestamp'].isoformat()
        return jsonify(memo)
    else:
        return jsonify({'error': 'Memo not found'}), 404

@app.route('/memo/<int:memo_id>')
def memo_detail(memo_id):
    """显示单个memo的完整内容页面"""
    memos = memo_parser.get_all_memos()
    memo = next((m for m in memos if m['id'] == memo_id), None)
    
    if memo:
        # 计算时间差
        now = datetime.now()
        time_diff = now - memo['timestamp']
        
        if time_diff.days > 0:
            time_ago = f"{time_diff.days}天前"
        elif time_diff.seconds > 3600:
            hours = time_diff.seconds // 3600
            time_ago = f"{hours}小时前"
        elif time_diff.seconds > 60:
            minutes = time_diff.seconds // 60
            time_ago = f"{minutes}分钟前"
        else:
            time_ago = "刚刚"
        
        memo['time_ago'] = time_ago
        
        # 将markdown内容转换为HTML，并修复图片路径
        md = markdown.Markdown(extensions=['extra', 'codehilite'])
        content = memo['content']
        
        # 修复相对路径的图片引用，将 ../../assets/ 替换为 /assets/
        content = re.sub(r'\.\./\.\./assets/', '/assets/', content)
        
        memo['content'] = md.convert(content)
        
        return render_template('memo_detail.html', memo=memo)
    else:
        return "文章未找到", 404

@app.route('/api/search')
def search_memos():
    """搜索文章"""
    try:
        query = request.args.get('q', '').strip()
        if not query or len(query) < 2:
            return jsonify({'error': '搜索关键词至少需要2个字符'}), 400
        
        all_memos = memo_parser.get_all_memos()
        search_results = []
        
        # 搜索逻辑：在标题、内容和标签中搜索
        for memo in all_memos:
            content_lower = memo['content'].lower()
            query_lower = query.lower()
            
            # 检查是否匹配
            if (query_lower in content_lower or 
                any(query_lower in tag.lower() for tag in memo.get('tags', []))):
                
                # 计算时间差
                now = datetime.now()
                memo_time = datetime.strptime(memo['timestamp'], '%Y-%m-%d %H:%M:%S')
                time_diff = now - memo_time
                
                if time_diff.days > 0:
                    time_ago = f"{time_diff.days}天前"
                elif time_diff.seconds > 3600:
                    hours = time_diff.seconds // 3600
                    time_ago = f"{hours}小时前"
                elif time_diff.seconds > 60:
                    minutes = time_diff.seconds // 60
                    time_ago = f"{minutes}分钟前"
                else:
                    time_ago = "刚刚"
                
                # 获取文章标题（取第一行或前50个字符）
                content_lines = memo['content'].strip().split('\n')
                title = content_lines[0] if content_lines else memo['content']
                if len(title) > 50:
                    title = title[:50] + '...'
                
                search_results.append({
                    'id': memo['id'],
                    'title': title,
                    'content': memo['content'][:200] + '...' if len(memo['content']) > 200 else memo['content'],
                    'time_ago': time_ago,
                    'tags': memo.get('tags', []),
                    'timestamp': memo['timestamp']
                })
        
        # 按时间排序（最新的在前）
        search_results.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return jsonify({
            'query': query,
            'results': search_results,
            'total': len(search_results)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/random-articles')
def get_random_articles():
    """获取随机文章列表"""
    try:
        all_memos = memo_parser.get_all_memos()
        if len(all_memos) <= 10:
            random_memos = all_memos
        else:
            random_memos = random.sample(all_memos, 10)
        
        # 格式化随机文章数据
        random_articles = []
        for memo in random_memos:
            # 计算时间差
            now = datetime.now()
            memo_time = memo['timestamp']
            
            # 如果timestamp已经是datetime对象，直接使用；否则解析字符串
            if isinstance(memo_time, str):
                memo_time = datetime.strptime(memo_time, '%Y-%m-%d %H:%M:%S')
            
            time_diff = now - memo_time
            
            if time_diff.days > 0:
                time_ago = f"{time_diff.days}天前"
            elif time_diff.seconds > 3600:
                hours = time_diff.seconds // 3600
                time_ago = f"{hours}小时前"
            elif time_diff.seconds > 60:
                minutes = time_diff.seconds // 60
                time_ago = f"{minutes}分钟前"
            else:
                time_ago = "刚刚"
            
            # 获取显示标题：优先使用title字段，没有则使用内容的第一行
            display_title = ""
            if memo.get('title') and memo.get('filename') and memo['title'] != memo['filename'].replace('.md', ''):
                # 有独立的title字段，使用title
                display_title = memo['title']
            else:
                # 没有title字段，使用内容的第一行
                content_lines = memo['content'].strip().split('\n')
                display_title = content_lines[0] if content_lines else memo['content']
                if len(display_title) > 50:
                    display_title = display_title[:50] + '...'
            
            random_articles.append({
                'id': memo['id'],
                'title': display_title,
                'time_ago': time_ago,
                'tags': memo.get('tags', []),
                'has_title': bool(memo.get('title') and memo.get('filename') and memo['title'] != memo['filename'].replace('.md', ''))
            })
        
        return jsonify(random_articles)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)