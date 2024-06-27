import os
import markdown
import yaml
from jinja2 import Environment, FileSystemLoader
import json

POSTS_DIR = "_posts"
TEMPLATES_DIR = "templates"

env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))

# Read the metadata and content from a markdown file
def read_markdown_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
        md = markdown.Markdown(extensions=['meta'])
        html = md.convert(content)
        metadata = {key: md.Meta[key][0] for key in md.Meta}
        print(metadata, html)
    return metadata, html

posts = []
post_lists = []

for filename in os.listdir(POSTS_DIR):
    if filename.endswith(".md"):
        filepath = os.path.join(POSTS_DIR, filename)
        metadata, content = read_markdown_file(filepath)
        metadata['content'] = content
        metadata['url'] = f"{filename.replace('.md', '.html')}"
        filename = filename.replace('.md', '.html')
        posts.append(metadata)
        post_lists.append({
            'title': f'{metadata["title"]}',
            'url': f'posts/{filename}'
        })

for post in posts:
    template = env.get_template('post.html')
    html_output = template.render(post=post)
    with open(f"posts/{post['url']}", 'w') as file:
        file.write(html_output)

with open('posts.json', 'w') as f:
    json.dump(post_lists, f, indent=4)