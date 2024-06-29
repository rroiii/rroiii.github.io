import os
import markdown
from jinja2 import Environment, FileSystemLoader
import json

POSTS_DIR = "_posts"
WRITEUPS_DIR = "_writeups"
TEMPLATES_DIR = "templates"

env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))

class ClassyExtension(markdown.extensions.Extension):
    def extendMarkdown(self, md):
        md.treeprocessors.register(ClassyProcessor(md), 'classy', 25)

class ClassyProcessor(markdown.treeprocessors.Treeprocessor):
    def run(self, root):
        for element in root.iter():
            if element.tag == 'p':
                element.set('class', 'mb-3 text-justify')

def read_markdown_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
        md = markdown.Markdown(extensions=['meta', ClassyExtension()])
        html = md.convert(content)
        metadata = {key: md.Meta[key][0] for key in md.Meta}
    return metadata, html

def get_data(DIR):
    data = []
    data_lists = []

    if 'posts' in DIR:
        string = 'posts'
    else:
        string = 'writeups'

    for filename in os.listdir(DIR):
        if filename.endswith(".md"):
            filepath = os.path.join(DIR, filename)
            metadata, content = read_markdown_file(filepath)
            metadata['content'] = content
            metadata['url'] = f"{filename.replace('.md', '.html')}"
            filename = filename.replace('.md', '.html')
            data.append(metadata)
            data_lists.append({
                'id': f'{filename.replace(".html", "")}',
                'title': f'{metadata["title"]}',
                'url': f'{string}/{filename}'
            })

    with open(f'{string}.json', 'w') as file:
        json.dump(data_lists, file)

    for d in data:
        template = env.get_template(f'{string}.html')
        html_output = template.render(d=d)
        with open(f"{string}/{d['url']}", 'w') as file:
            file.write(html_output)

get_data(POSTS_DIR)
get_data(WRITEUPS_DIR)