import os
import glob
import re

html_files = glob.glob('**/*.html', recursive=True)
count_processed = 0

for file in html_files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()

        dir_name = os.path.dirname(file)
        base_name = os.path.basename(file)
        name_without_ext = os.path.splitext(base_name)[0]

        # Find <style> blocks
        style_pattern = re.compile(r'<style>([\s\S]*?)</style>', re.IGNORECASE)
        styles = style_pattern.findall(content)
        
        css_changed = False
        if styles:
            css_content = '\n\n'.join(s.strip() for s in styles)
            if css_content:
                css_file_path = os.path.join(dir_name, f'{name_without_ext}.css')
                with open(css_file_path, 'w', encoding='utf-8') as f:
                    f.write(css_content)
                
                # Replace <style> blocks
                def style_replacer(match, count=[0]):
                    count[0] += 1
                    if count[0] == 1:
                        return f'<link rel="stylesheet" href="{name_without_ext}.css">'
                    return ''
                
                content = style_pattern.sub(style_replacer, content)
                print(f'Extracted CSS to {css_file_path}')
                css_changed = True

        # Find <script> blocks that don't have src
        script_pattern = re.compile(r'<script(?![^>]*\bsrc\b)[^>]*>([\s\S]*?)</script>', re.IGNORECASE)
        
        # We need to manually iterate to carefully replace and extract
        scripts = script_pattern.findall(content)
        valid_scripts = [s for s in scripts if s.strip() and not 'application/ld+json' in s]
        
        js_changed = False
        if valid_scripts:
            # We must be careful not to extract MathJax configuration or purely JSON scripts
            # This is a bit tricky, but checking for application/ld+json handles the main issue
            js_content = '\n\n'.join(s.strip() for s in valid_scripts)
            if js_content:
                js_file_path = os.path.join(dir_name, f'{name_without_ext}.js')
                with open(js_file_path, 'w', encoding='utf-8') as f:
                    f.write(js_content)
                    
                def script_replacer(match, count=[0]):
                    if 'application/ld+json' in match.group(0):
                        return match.group(0)
                        
                    count[0] += 1
                    if count[0] == 1:
                        return f'<script src="{name_without_ext}.js"></script>'
                    return ''
                    
                content = script_pattern.sub(script_replacer, content)
                print(f'Extracted JS to {js_file_path}')
                js_changed = True

        if css_changed or js_changed:
            with open(file, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Updated {file}')
            count_processed += 1
    except Exception as e:
        print(f'Error processing {file}: {e}')

print(f'\nDone extracting CSS and JS for {count_processed} files.')
