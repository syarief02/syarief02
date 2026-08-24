import os, glob, re

DIR = r'c:\Users\User\OneDrive\Desktop\syarief02\portfolio\lab\penyaringan'

REPLACEMENTS = [
    (r'\$\\rightarrow\$', '➔'),
    (r'\$\\to\$', '➔'),
    (r'\\rightarrow', '➔'),
    (r'\\to', '➔'),
    (r'\$\\le\$', '≤'),
    (r'\$\\ge\$', '≥'),
    (r'\$\\le\s*(\d+(?:\.\d+)?)\s*\\%\$', r'≤ \1%'),
    (r'\$T\s*\\le\s*(\d+(?:\.\d+)?)\$', r'T ≤ \1'),
    (r'\$N\s*\\ge\s*(\d+(?:\.\d+)?)\$', r'N ≥ \1'),
    (r'\$R\^2\s*\\ge\s*(\d+(?:\.\d+)?)\$', r'R² ≥ \1'),
    (r'\$R\^2\s*\\ge\s*(\d+(?:\.\d+)?)\s*\$', r'R² ≥ \1'),
    (r'\$150\s*\\times\s*4\.6\\text\{\s*mm\}\$', '150 × 4.6 mm'),
    (r'\$2\.6\\\s*\\mu\\text\{m\}\$', '2.6 µm'),
    (r'\$190–400\\text\{\s*nm\}\$', '190–400 nm'),
    (r'\$>\s*0\.999\$', '> 0.999'),
    (r'\$\\pm\s*(\d+(?:\.\d+)?)\s*\\%\$', r'±\1%'),
    (r'\$2\\times\$', '2×'),
    (r'\\times', '×'),
    (r'\\le', '≤'),
    (r'\\ge', '≥'),
    (r'\\pm', '±'),
    (r'\\mu m', 'µm'),
    (r'\\mu', 'µ'),
    (r'\\lambda_\{?max\}?', 'λ_max'),
    (r'\$\\lambda_\{?max\}?\s*=\s*(\d+(?:\.\d+)?)\\text\{\s*nm\}\$', r'λ_max = \1 nm'),
    (r'\\text\{\s*([^\}]+)\s*\}', r'\1'),
    (r'\$([0-9\.\s\w\(\)\/°\-\+]+)\$', r'\1'),
]

files = glob.glob(os.path.join(DIR, '*.html')) + glob.glob(os.path.join(DIR, 'sop', '*.html')) + glob.glob(os.path.join(DIR, '*.js'))

count = 0
for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    orig = content
    for pattern, repl in REPLACEMENTS:
        content = re.sub(pattern, repl, content)
    
    content = content.replace(r'EG $\le 0.10\% v/v$ and DEG $\le 0.10\% v/v$', 'EG ≤ 0.10% v/v and DEG ≤ 0.10% v/v')
    content = content.replace(r'If $> 0.10\% v/v \rightarrow$', 'If > 0.10% v/v ➔')
    content = content.replace(r'Linear regression $R^2 \ge 0.995$', 'Linear regression R² ≥ 0.995')
    content = content.replace(r'nilai $R^2 \ge 0.9950$', 'nilai R² ≥ 0.9950')
    content = content.replace(r'($150 \times 4.6\text{ mm}$, $2.6\ \mu\text{m}$)', '(150 × 4.6 mm, 2.6 µm)')
    content = content.replace(r'($190–400\text{ nm}$)', '(190–400 nm)')
    content = content.replace(r'index <strong>$> 0.999$</strong>', 'index <strong>> 0.999</strong>')
    content = content.replace(r'$\rightarrow$', '➔')
    content = content.replace(r'$\to$', '➔')
    content = content.replace(r'$$\text{Amount', 'Amount')
    content = content.replace(r'$$\% \text{ v/v}', '% v/v')
    content = content.replace(r'$$', '')
    content = content.replace(r'\ ', ' ')
    content = content.replace(r'\,', '')
    content = content.replace(r'\%', '%')
    content = content.replace(r'\rho', 'ρ')
    
    if content != orig:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        count += 1
        print(f"Cleaned LaTeX symbols in {os.path.basename(fpath)}")

print(f"Done! Cleaned {count} files.")
