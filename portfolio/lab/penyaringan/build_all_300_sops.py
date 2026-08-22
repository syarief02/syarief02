import os, sys, re, html, docx, fitz, json

sys.stdout.reconfigure(encoding='utf-8')

DOCS_DIR = r'c:\Users\User\OneDrive\Desktop\Unit Penyaringan\2_Arahan Kerja 300\Level 300_Arahan Kerja'
OUT_DIR = r'c:\Users\User\OneDrive\Desktop\syarief02\portfolio\lab\penyaringan\sop'

os.makedirs(OUT_DIR, exist_ok=True)

def clean_text(t):
    if not t: return ''
    return t.strip().replace('\xa0', ' ')

def parse_docx(path):
    doc = docx.Document(path)
    paras = [clean_text(p.text) for p in doc.paragraphs if clean_text(p.text)]
    
    tables_data = []
    for t in doc.tables:
        rows = []
        for r in t.rows:
            row_cells = [clean_text(c.text) for c in r.cells]
            rows.append(row_cells)
        tables_data.append(rows)
    
    return paras, tables_data

def parse_pdf(path):
    doc = fitz.open(path)
    paras = []
    for page in doc:
        text = page.get_text('text')
        for line in text.split('\n'):
            line = clean_text(line)
            if line and not 'CHECK “MASTER LIST”' in line and not 'Page' in line and not 'Testing Procedure' in line:
                paras.append(line)
    return paras, []

def format_sop_html(code, title, doc_num_str, rev_str, date_str, paras, tables_data):
    # Detect sections
    sections = []
    current_sec = {'title': '1.0 PENGENALAN / MAKLUMAT DOKUMEN', 'items': []}
    
    sec_regex = re.compile(r'^((\d+\.0?|[1-9]\.)\s*(TUJUAN|OBJEKTIF|OBJECTIVE|SKOP|SCOPE|DEFINISI|DEFINITIONS|CARTA ALIRAN|FLOW CHART|TANGGUNGJAWAB|RESPONSIBILIT|PROSEDUR|PROCEDURE|REKOD KUALITI|QUALITY RECORD|LAMPIRAN|ATTACHMENTS|RUJUKAN|REFERENCES?))', re.IGNORECASE)
    
    for p in paras:
        m = sec_regex.match(p)
        if m:
            if current_sec['items']:
                sections.append(current_sec)
            current_sec = {'title': p, 'items': []}
        else:
            current_sec['items'].append(p)
    if current_sec['items']:
        sections.append(current_sec)
    
    # Build tables HTML
    tables_html = ''
    for t_idx, tbl in enumerate(tables_data):
        if not tbl or len(tbl) < 1: continue
        # Filter out revision history or tiny tables from body if needed, or render all
        t_rows_html = ''
        header_done = False
        for r_idx, row in enumerate(tbl):
            # deduplicate duplicate text in cells caused by merged cells
            seen = set()
            clean_row = []
            for c in row:
                c_clean = c.replace('\n', ' ').strip()
                clean_row.append(c_clean)
            
            if r_idx == 0:
                t_rows_html += '<tr>' + ''.join([f'<th>{html.escape(c)}</th>' for c in clean_row]) + '</tr>'
            else:
                t_rows_html += '<tr>' + ''.join([f'<td>{html.escape(c)}</td>' for c in clean_row]) + '</tr>'
        
        tables_html += f'''
        <div class="table-wrap" style="margin:1.5rem 0">
          <div class="table-caption">Jadual Kromatografi / Rujukan {t_idx + 1}</div>
          <table class="table-official">
            {t_rows_html}
          </table>
        </div>
        '''

    # Build sections HTML
    sections_html = ''
    for s in sections:
        sec_title = html.escape(s['title'])
        body_p = ''
        for itm in s['items']:
            itm_esc = html.escape(itm)
            # Check if sub-step like 6.1, 6.2, etc.
            if re.match(r'^\d+\.\d+', itm_esc):
                body_p += f'<div class="sop-substep"><strong>{itm_esc}</strong></div>'
            elif itm_esc.startswith(('•', '-', '*')) or re.match(r'^[a-z]\)', itm_esc) or re.match(r'^\d+\)', itm_esc):
                body_p += f'<div class="sop-list-item"><span class="sop-bullet">▹</span> <span>{itm_esc}</span></div>'
            else:
                body_p += f'<p class="sop-p">{itm_esc}</p>'

        sections_html += f'''
        <div class="sop-section-block">
          <div class="sop-sec-title">{sec_title}</div>
          <div class="sop-sec-content">
            {body_p}
          </div>
        </div>
        '''

    html_content = f'''<!DOCTYPE html>
<html lang="ms" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{code} — {title} | NPRA Arahan Kerja 300</title>
<meta name="description" content="Arahan Kerja Rasmi {code}: {title} — Pusat Kawalan Kualiti (PKKK), NPRA Malaysia.">
<link rel="icon" type="image/png" href="../../../favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&family=Playfair+Display:ital@1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../steroid-hplc.css">
<style>
  .sop-doc-container {{
    background: var(--card-bg); border: 1px solid var(--card-border);
    border-radius: 16px; padding: 2.5rem; backdrop-filter: blur(20px);
    box-shadow: var(--shadow-md); margin-top: 1.5rem;
  }}
  .sop-header-table {{
    width: 100%; border-collapse: collapse; margin-bottom: 2rem; font-family: var(--font-mono); font-size: 0.85rem;
  }}
  .sop-header-table td {{
    border: 1px solid var(--glass-border); padding: 0.6rem 0.9rem; vertical-align: middle;
  }}
  .sop-sec-title {{
    font-size: 1.25rem; font-weight: 800; color: var(--text-bright); margin: 1.8rem 0 0.8rem;
    padding-bottom: 0.4rem; border-bottom: 2px solid var(--cyan-dim); display: flex; align-items: center;
  }}
  .sop-p {{
    font-size: 0.92rem; line-height: 1.75; color: var(--text-main); margin-bottom: 0.8rem;
  }}
  .sop-substep {{
    background: var(--glass); border-left: 3px solid var(--cyan); padding: 0.7rem 1rem;
    border-radius: 0 8px 8px 0; margin: 1rem 0 0.5rem; font-size: 0.92rem; color: var(--text-bright);
  }}
  .sop-list-item {{
    display: flex; gap: 0.5rem; align-items: flex-start; margin-left: 1.2rem; font-size: 0.9rem;
    line-height: 1.65; color: var(--text-main); margin-bottom: 0.4rem;
  }}
  .sop-bullet {{ color: var(--cyan); font-weight: bold; flex-shrink: 0; }}
  .table-official {{
    width: 100%; border-collapse: collapse; margin: 0.8rem 0; font-size: 0.82rem; font-family: var(--font-mono);
  }}
  .table-official th, .table-official td {{
    border: 1px solid var(--glass-border); padding: 0.55rem 0.75rem; text-align: left;
  }}
  .table-official th {{ background: var(--glass); color: var(--text-dim); font-weight: 700; }}
  .table-caption {{ font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyan); font-weight: 700; text-transform: uppercase; margin-bottom: 0.3rem; }}
  
  @media print {{
    .topbar, .ctrl-btn, .bg-canvas, .grid-overlay {{ display: none !important; }}
    .main {{ max-width: 100% !important; padding: 0 !important; }}
    .sop-doc-container {{ box-shadow: none !important; border: none !important; padding: 0 !important; }}
    body {{ background: #fff !important; color: #000 !important; }}
  }}
</style>
</head>
<body>

<div class="bg-canvas"><div class="orb orb1"></div><div class="orb orb2"></div><div class="orb orb3"></div></div>
<div class="grid-overlay"></div>

<div class="main">

  <!-- Topbar -->
  <div class="topbar">
    <div class="topbar-left">
      <a href="../index.html" class="ctrl-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Unit Penyaringan Hub
      </a>
      <a href="../sop-matrix.html" class="ctrl-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        Master SOP Matrix
      </a>
    </div>
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
      <button class="ctrl-btn" onclick="window.print()">
        🖨️ Cetak / Print SOP
      </button>
      <button class="ctrl-btn" onclick="toggleTheme()" id="themeBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <span id="themeTxt">Dark Mode</span>
      </button>
    </div>
  </div>

  <!-- Document Container -->
  <div class="sop-doc-container">

    <!-- Official Header Table -->
    <table class="sop-header-table">
      <tr>
        <td rowspan="3" style="width:20%;text-align:center;font-weight:800;font-size:1.1rem;color:var(--cyan)">
          NPRA<br><span style="font-size:0.7rem;color:var(--text-dim)">PUSAT KAWALAN KUALITI</span>
        </td>
        <td colspan="2"><strong>ARAHAN KERJA: {html.escape(title.upper())}</strong></td>
      </tr>
      <tr>
        <td><strong>No. Dokumen:</strong> {code}</td>
        <td><strong>Terbitan / Semakan:</strong> {rev_str}</td>
      </tr>
      <tr>
        <td><strong>Tarikh Kuatkuasa:</strong> {date_str}</td>
        <td><strong>Bahagian / Seksyen:</strong> SPPK · Unit Penyaringan</td>
      </tr>
    </table>

    <!-- Sections -->
    {sections_html}

    <!-- Tables -->
    {tables_html}

  </div>

  <div class="footer">
    Unit Penyaringan ◈ Seksyen Pengujian Produk & Kosmetik ◈ Pusat Kawalan Kualiti (PKKK), NPRA Malaysia
  </div>
</div>

<script src="../steroid-hplc.js"></script>
</body>
</html>
'''
    return html_content

# Generate for all files
all_sops = []
file_list = sorted(os.listdir(DOCS_DIR))

for f in file_list:
    if f.startswith('~$'): continue
    
    # Extract number (e.g. 001, 002, ..., 064)
    m = re.search(r'300\s*UP\s*(\d{3})', f, re.IGNORECASE)
    if not m: continue
    
    num_str = m.group(1)
    code = f'PKKK/300/UP/{num_str}'
    slug = f'sop-300-up-{num_str}'
    
    path = os.path.join(DOCS_DIR, f)
    
    title_raw = f.replace('.docx', '').replace('.doc', '').replace('.pdf', '')
    title_clean = re.sub(r'^300\s*UP\s*\d{3}\s*', '', title_raw).strip()
    
    paras = []
    tables = []
    if f.endswith('.docx'):
        paras, tables = parse_docx(path)
    elif f.endswith('.pdf'):
        paras, tables = parse_pdf(path)
    
    rev_str = 'Kuatkuasa 2026'
    date_str = '10 April 2026'
    
    # extract title from paras if present
    doc_title = title_clean
    for p in paras[:10]:
        if 'ARAHAN KERJA' in p.upper() or 'IDENTIFIKASI' in p.upper() or 'PENGENDALIAN' in p.upper() or 'SCREENING' in p.upper():
            doc_title = p.replace('ARAHAN KERJA :', '').replace('ARAHAN KERJA:', '').strip()
            break
            
    html_out = format_sop_html(code, doc_title or title_clean, code, rev_str, date_str, paras, tables)
    
    out_file = os.path.join(OUT_DIR, f'{slug}.html')
    with open(out_file, 'w', encoding='utf-8') as out_f:
        out_f.write(html_out)
        
    all_sops.append({
        'code': code,
        'title': doc_title or title_clean,
        'num': num_str,
        'slug': slug,
        'url': f'sop/{slug}.html'
    })

print(f'Successfully generated {len(all_sops)} dedicated SOP HTML pages in {OUT_DIR}!')
