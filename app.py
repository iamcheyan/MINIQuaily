from flask import Flask, render_template, jsonify, send_from_directory, request
import os
import re
import random
from datetime import datetime
import markdown
import frontmatter
from pathlib import Path
import time
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configure upload settings
UPLOAD_FOLDER = 'content/assets'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def ensure_upload_folder():
    """Ensure the upload folder exists"""
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

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
    
    def extract_image_references(self, content):
        """从markdown内容中提取图片引用"""
        image_urls = []
        
        # 匹配markdown图片语法: ![alt](url)
        markdown_pattern = r'!\[.*?\]\(([^)]+)\)'
        markdown_matches = re.findall(markdown_pattern, content)
        image_urls.extend(markdown_matches)
        
        # 匹配HTML img标签: <img src="url">
        html_pattern = r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>'
        html_matches = re.findall(html_pattern, content, re.IGNORECASE)
        image_urls.extend(html_matches)
        
        # 过滤出本地图片路径（相对路径或以/assets/开头的路径）
        local_images = []
        for url in image_urls:
            # 去除URL参数和锚点
            clean_url = url.split('?')[0].split('#')[0]
            
            # 检查是否为本地图片
            if (not clean_url.startswith('http://') and 
                not clean_url.startswith('https://') and 
                not clean_url.startswith('data:')):
                # 转换为相对于项目根目录的路径
                if clean_url.startswith('/assets/'):
                    local_images.append('content' + clean_url)
                elif clean_url.startswith('assets/'):
                    local_images.append('content/' + clean_url)
                elif clean_url.startswith('./assets/'):
                    local_images.append('content/' + clean_url[2:])
                elif clean_url.startswith('../assets/'):
                    local_images.append('content/' + clean_url[3:])
                else:
                    # 其他相对路径，假设相对于content目录
                    local_images.append(os.path.join('content', clean_url))
        
        return local_images
    
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
                'filepath': str(filepath)
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
                            'filename': memo_data['filename'],
                            'filepath': memo_data['filepath']
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
    return send_from_directory('content/assets', filename)

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

@app.route('/tag/<tag>')
def tag_page(tag):
    """标签页面"""
    return render_template('index.html')

@app.route('/tags')
def tags_page():
    """标签列表页面"""
    return render_template('index.html')

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
        content = re.sub(r'\.\./.\./assets/', '/assets/', content)
        
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

@app.route('/api/tags')
def get_all_tags():
    """获取所有标签及其文章数量"""
    try:
        all_memos = memo_parser.get_all_memos()
        tag_counts = {}
        
        for memo in all_memos:
            tags = memo.get('tags', [])
            for tag in tags:
                if tag:  # 确保标签不为空
                    tag_counts[tag] = tag_counts.get(tag, 0) + 1
        
        # 按文章数量排序
        sorted_tags = sorted(tag_counts.items(), key=lambda x: x[1], reverse=True)
        
        return jsonify({
            'tags': [{'name': tag, 'count': count} for tag, count in sorted_tags],
            'total': len(sorted_tags)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/memos/by-tag/<tag>')
def get_memos_by_tag(tag):
    """根据标签获取文章"""
    try:
        all_memos = memo_parser.get_all_memos()
        
        # 筛选包含指定标签的文章
        filtered_memos = []
        for memo in all_memos:
            tags = memo.get('tags', [])
            if any(t.lower() == tag.lower() for t in tags):
                # 转换时间戳格式
                memo_copy = memo.copy()
                memo_copy['timestamp'] = memo['timestamp'].isoformat()
                filtered_memos.append(memo_copy)
        
        # 按时间排序（最新的在前）
        filtered_memos.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return jsonify({
            'tag': tag,
            'memos': filtered_memos,
            'total': len(filtered_memos)
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

@app.route('/api/save-log', methods=['POST'])
def save_log():
    """保存日志到markdown文件"""
    try:
        data = request.get_json()
        
        # 验证必需字段
        if not data or not data.get('content'):
            return jsonify({'error': '内容不能为空'}), 400
        
        # 获取数据
        title = data.get('title', '')
        slug = data.get('slug', '')
        datetime_str = data.get('datetime', '')
        date_str = data.get('date', '')
        summary = data.get('summary', '')
        tags = data.get('tags', '')
        cover_image_url = data.get('cover_image_url', '')
        content = data.get('content', '')
        
        # 生成文件名 - 使用毫秒时间戳
        current_date = datetime.now()
        year = current_date.strftime('%Y')
        timestamp_ms = int(current_date.timestamp() * 1000)
        filename = f"{timestamp_ms}.md"
        
        # 如果date和datetime字段为空，自动填充当前时间戳
        if not datetime_str:
            datetime_str = current_date.strftime('%Y-%m-%d %H:%M')
        if not date_str:
            date_str = current_date.strftime('%Y-%m-%d %H:%M')
        
        # 确保年份目录存在
        year_dir = os.path.join('content', year)
        os.makedirs(year_dir, exist_ok=True)
        
        # 生成完整文件路径
        filepath = os.path.join(year_dir, filename)
        
        # 检查文件是否已存在，如果存在则添加数字后缀
        counter = 1
        original_filepath = filepath
        while os.path.exists(filepath):
            name, ext = os.path.splitext(original_filepath)
            filepath = f"{name}-{counter}{ext}"
            counter += 1
        
        # 创建YAML front matter
        front_matter = {
            'title': title,
            'slug': slug,
            'datetime': datetime_str,
            'date': date_str,
            'summary': summary,
            'cover_image_url': cover_image_url
        }
        
        # 如果有标签，添加到front matter
        if tags:
            front_matter['tags'] = tags
        
        # 创建frontmatter对象
        post = frontmatter.Post(content, **front_matter)
        
        # 写入文件
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(frontmatter.dumps(post))
        
        return jsonify({
            'success': True,
            'message': '日志保存成功',
            'filepath': filepath,
            'filename': os.path.basename(filepath)
        })
        
    except Exception as e:
        return jsonify({'error': f'保存失败: {str(e)}'}), 500

@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    """Handle image upload from paste events"""
    try:
        # Ensure upload folder exists
        ensure_upload_folder()
        
        # Check if image file is in request
        if 'image' not in request.files:
            return jsonify({'error': '没有找到图片文件'}), 400
        
        file = request.files['image']
        
        # Check if file is selected
        if file.filename == '':
            return jsonify({'error': '没有选择文件'}), 400
        
        # Check if file is allowed
        if file and allowed_file(file.filename):
            # Generate unique filename with timestamp
            timestamp = int(time.time() * 1000)  # milliseconds
            file_extension = file.filename.rsplit('.', 1)[1].lower()
            filename = f"{timestamp}.{file_extension}"
            
            # Save file
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            
            # Return the URL for the uploaded image
            image_url = f"/assets/{filename}"
            
            return jsonify({
                'success': True,
                'url': image_url,
                'filename': filename,
                'message': '图片上传成功'
            })
        else:
            return jsonify({'error': '不支持的文件类型'}), 400
            
    except Exception as e:
        return jsonify({'error': f'上传失败: {str(e)}'}), 500

@app.route('/api/delete-memo/<int:memo_id>', methods=['DELETE'])
def delete_memo(memo_id):
    """删除指定的memo及其相关图片"""
    try:
        # 获取所有memos
        memos = memo_parser.get_all_memos()
        
        # 找到要删除的memo
        target_memo = None
        for memo in memos:
            if memo['id'] == memo_id:
                target_memo = memo
                break
        
        if not target_memo:
            return jsonify({'error': '未找到指定的memo'}), 404
        
        # 构建markdown文件路径
        memo_file_path = target_memo['filepath']
        
        if not os.path.exists(memo_file_path):
            return jsonify({'error': '文件不存在'}), 404
        
        # 读取文件内容以提取图片引用
        try:
            with open(memo_file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 提取图片引用
            image_paths = memo_parser.extract_image_references(content)
            
            # 删除相关图片文件
            deleted_images = []
            failed_images = []
            
            for image_path in image_paths:
                try:
                    if os.path.exists(image_path):
                        os.remove(image_path)
                        deleted_images.append(image_path)
                except Exception as img_error:
                    failed_images.append({'path': image_path, 'error': str(img_error)})
            
            # 删除markdown文件
            os.remove(memo_file_path)
            
            return jsonify({
                'success': True,
                'message': f'成功删除memo和{len(deleted_images)}个相关图片',
                'deleted_file': memo_file_path,
                'deleted_images': deleted_images,
                'failed_images': failed_images
            })
            
        except Exception as read_error:
            return jsonify({'error': f'读取文件失败: {str(read_error)}'}), 500
            
    except Exception as e:
        return jsonify({'error': f'删除失败: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)