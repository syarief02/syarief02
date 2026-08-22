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

def highlight_keywords(text):
    # Highlight numbers with units, limits, temperatures, etc.
    # Protect html tags first
    t = html.escape(text)
    # Highlight temperatures
    t = re.sub(r'(\b\d+(\.\d+)?\s*°C\b)', r'<span class="kw-temp">\1</span>', t)
    # Highlight flow rates
    t = re.sub(r'(\b\d+(\.\d+)?\s*(?:mL/min|µL/min|mil/min)\b)', r'<span class="kw-flow">\1</span>', t, flags=re.IGNORECASE)
    # Highlight wavelengths
    t = re.sub(r'(\b\d{3}\s*nm\b)', r'<span class="kw-wave">\1</span>', t, flags=re.IGNORECASE)
    # Highlight weights
    t = re.sub(r'(\b\d+(\.\d+)?\s*(?:mg|g|µg|kg)\b)', r'<span class="kw-wt">\1</span>', t)
    # Highlight volumes
    t = re.sub(r'(\b\d+(\.\d+)?\s*(?:mL|µL|L)\b)', r'<span class="kw-vol">\1</span>', t)
    # Highlight durations
    t = re.sub(r'(\b\d+(\.\d+)?\s*(?:minit|min|minutes|jam|hours|saat|seconds)\b)', r'<span class="kw-time">\1</span>', t, flags=re.IGNORECASE)
    # Highlight limits / RSD
    t = re.sub(r'(\b(?:%RSD|RSD)\s*(?:≤|NMT|&le;)?\s*\d+(\.\d+)?\s*%?)', r'<span class="kw-limit">\1</span>', t, flags=re.IGNORECASE)
    # Highlight pH
    t = re.sub(r'(\bpH\s*\d+(\.\d+)?(\s*±\s*\d+(\.\d+)?)?)', r'<span class="kw-ph">\1</span>', t, flags=re.IGNORECASE)
    return t

def format_sop_html(code, title, doc_num_str, rev_str, date_str, paras, tables_data, category):
    # Detect sections
    sections = []
    current_sec = {'title': '1.0 PENGENALAN DOKUMEN', 'items': []}
    
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
        t_rows_html = ''
        for r_idx, row in enumerate(tbl):
            clean_row = [c.replace('\n', ' ').strip() for c in row]
            
            # Row class highlight for sequence tables
            row_str = ' '.join(clean_row).lower()
            r_class = ''
            if 'sst' in row_str or 'system suitability' in row_str:
                r_class = 'class="seq-sst"'
            elif 'iqc' in row_str or 'lod' in row_str:
                r_class = 'class="seq-iqc"'
            elif 'blank' in row_str or 'diluent' in row_str:
                r_class = 'class="seq-blank"'
            
            if r_idx == 0:
                t_rows_html += '<tr>' + ''.join([f'<th>{html.escape(c)}</th>' for c in clean_row]) + '</tr>'
            else:
                t_rows_html += f'<tr {r_class}>' + ''.join([f'<td>{highlight_keywords(c)}</td>' for c in clean_row]) + '</tr>'
        
        tables_html += f'''
        <div class="table-card" id="table-{t_idx + 1}">
          <div class="table-card-header">
            <span class="table-tag">JADUAL {t_idx + 1}</span>
            <span class="table-doc-code">{code}</span>
          </div>
          <div class="table-responsive">
            <table class="table-official">
              {t_rows_html}
            </table>
          </div>
        </div>
        '''

    # Build sections HTML with step checkboxes
    sections_html = ''
    total_steps = 0
    
    for s_idx, s in enumerate(sections):
        sec_title = html.escape(s['title'])
        sec_id = f'sec-{s_idx + 1}'
        body_p = ''
        
        for itm_idx, itm in enumerate(s['items']):
            # If item is a major step (e.g. 6.1, 6.2, 6.3, 6.4)
            if re.match(r'^\d+\.\d+', itm):
                total_steps += 1
                step_id = f'step-{doc_num_str}-{total_steps}'
                body_p += f'''
                <div class="sop-step-box">
                  <div class="step-check-wrap">
                    <input type="checkbox" id="{step_id}" class="sop-task-check" onchange="onStepCheckChange('{code}')">
                    <label for="{step_id}" class="sop-step-label">
                      <strong>{html.escape(itm)}</strong>
                    </label>
                  </div>
                </div>
                '''
            elif itm.startswith(('•', '-', '*')) or re.match(r'^[a-z]\)', itm) or re.match(r'^\d+\)', itm):
                body_p += f'''
                <div class="sop-list-item">
                  <span class="sop-bullet">▹</span>
                  <span class="sop-list-text">{highlight_keywords(itm)}</span>
                </div>
                '''
            else:
                body_p += f'<p class="sop-p">{highlight_keywords(itm)}</p>'

        sections_html += f'''
        <div class="sop-section-block" id="{sec_id}">
          <div class="sop-sec-title">
            <span class="sec-anchor-dot">◈</span> {sec_title}
          </div>
          <div class="sop-sec-content">
            {body_p}
          </div>
        </div>
        '''

    # Quick Nav Pills
    nav_pills_html = '<div class="toc-pills">'
    for s_idx, s in enumerate(sections):
        s_name = s['title'][:30] + ('...' if len(s['title']) > 30 else '')
        nav_pills_html += f'<a href="#sec-{s_idx + 1}" class="toc-pill">{html.escape(s_name)}</a>'
    if tables_data:
        nav_pills_html += '<a href="#sec-tables" class="toc-pill highlight">📊 Jadual & Data</a>'
    nav_pills_html += '</div>'

    html_content = f'''<!DOCTYPE html>
<html lang="ms" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{code} — {title} | NPRA Unit Penyaringan</title>
<meta name="description" content="Arahan Kerja Rasmi {code}: {title} — Pusat Kawalan Kualiti (PKKK), NPRA Malaysia.">
<link rel="icon" type="image/png" href="../../../favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500&family=Playfair+Display:ital@1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../steroid-hplc.css">
<style>
  /* Enhanced SOP Interactive Styling */
  .sop-doc-container {{
    background: var(--card-bg); border: 1px solid var(--card-border);
    border-radius: 20px; padding: 2.5rem; backdrop-filter: blur(20px);
    box-shadow: var(--shadow-md); margin-top: 1.5rem; position: relative;
  }}
  .sop-header-table {{
    width: 100%; border-collapse: collapse; margin-bottom: 1.8rem; font-family: var(--font-mono); font-size: 0.85rem;
    background: var(--glass); border-radius: 12px; overflow: hidden;
  }}
  .sop-header-table td {{
    border: 1px solid var(--glass-border); padding: 0.75rem 1rem; vertical-align: middle;
  }}
  .sop-sec-title {{
    font-size: 1.3rem; font-weight: 800; color: var(--text-bright); margin: 2.2rem 0 1rem;
    padding-bottom: 0.5rem; border-bottom: 2px solid var(--cyan-dim); display: flex; align-items: center; gap: 0.5rem;
  }}
  .sec-anchor-dot {{ color: var(--cyan); font-size: 0.9rem; }}
  .sop-p {{
    font-size: 0.94rem; line-height: 1.8; color: var(--text-main); margin-bottom: 0.9rem;
  }}
  .sop-step-box {{
    background: var(--glass); border: 1px solid var(--glass-border); border-left: 4px solid var(--cyan);
    padding: 1rem 1.2rem; border-radius: 0 12px 12px 0; margin: 1.2rem 0 0.8rem; transition: all 0.2s ease;
  }}
  .sop-step-box:hover {{ background: var(--card-hover); border-left-color: var(--purple); }}
  .step-check-wrap {{ display: flex; align-items: flex-start; gap: 0.8rem; }}
  .sop-task-check {{
    width: 20px; height: 20px; margin-top: 0.2rem; cursor: pointer; accent-color: var(--cyan); flex-shrink: 0;
  }}
  .sop-step-label {{ cursor: pointer; font-size: 0.95rem; line-height: 1.5; color: var(--text-bright); }}
  .sop-list-item {{
    display: flex; gap: 0.6rem; align-items: flex-start; margin-left: 1.4rem; font-size: 0.92rem;
    line-height: 1.7; color: var(--text-main); margin-bottom: 0.5rem;
  }}
  .sop-bullet {{ color: var(--cyan); font-weight: bold; flex-shrink: 0; }}
  .sop-list-text {{ flex: 1; }}

  /* Keyword Highlights */
  .kw-temp {{ color: var(--amber); font-weight: 700; font-family: var(--font-mono); }}
  .kw-flow {{ color: var(--cyan); font-weight: 700; font-family: var(--font-mono); }}
  .kw-wave {{ color: var(--purple); font-weight: 700; font-family: var(--font-mono); }}
  .kw-wt {{ color: var(--mint); font-weight: 700; font-family: var(--font-mono); }}
  .kw-vol {{ color: var(--cyan); font-weight: 700; font-family: var(--font-mono); }}
  .kw-time {{ color: var(--amber); font-weight: 700; font-family: var(--font-mono); }}
  .kw-limit {{ color: var(--red); font-weight: 700; font-family: var(--font-mono); }}
  .kw-ph {{ color: var(--purple); font-weight: 700; font-family: var(--font-mono); }}

  /* Progress Tracker */
  .progress-card {{
    background: linear-gradient(135deg, var(--cyan-dim), var(--purple-dim));
    border: 1px solid var(--cyan); border-radius: 14px; padding: 1rem 1.4rem;
    margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;
  }}
  .progress-left {{ display: flex; flex-direction: column; gap: 0.3rem; }}
  .progress-title {{ font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; text-transform: uppercase; color: var(--cyan); }}
  .progress-bar-bg {{ width: 260px; max-width: 100%; height: 8px; background: rgba(0,0,0,0.1); border-radius: 100px; overflow: hidden; }}
  .progress-bar-fill {{ height: 100%; background: var(--cyan); width: 0%; transition: width 0.3s ease; }}
  .progress-stat {{ font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: var(--text-bright); }}

  /* TOC Pills */
  .toc-pills {{ display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.8rem; }}
  .toc-pill {{
    padding: 0.4rem 0.8rem; background: var(--glass); border: 1px solid var(--glass-border);
    border-radius: 100px; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-main);
    text-decoration: none; transition: all 0.2s ease;
  }}
  .toc-pill:hover {{ border-color: var(--cyan); color: var(--cyan); background: var(--card-hover); }}
  .toc-pill.highlight {{ background: var(--cyan-dim); border-color: var(--cyan); color: var(--cyan); font-weight: 700; }}

  /* Table Cards */
  .table-card {{
    background: var(--glass); border: 1px solid var(--glass-border); border-radius: 14px;
    padding: 1.2rem; margin: 1.5rem 0; overflow: hidden;
  }}
  .table-card-header {{
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;
    border-bottom: 1px solid var(--glass-border); padding-bottom: 0.4rem;
  }}
  .table-tag {{ font-family: var(--font-mono); font-size: 0.75rem; font-weight: 800; color: var(--cyan); }}
  .table-doc-code {{ font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-dim); }}
  .table-responsive {{ overflow-x: auto; }}
  .table-official {{
    width: 100%; border-collapse: collapse; font-size: 0.82rem; font-family: var(--font-mono);
  }}
  .table-official th, .table-official td {{
    border: 1px solid var(--glass-border); padding: 0.6rem 0.85rem; text-align: left;
  }}
  .table-official th {{ background: var(--card-bg); color: var(--text-dim); font-weight: 700; }}
  .seq-sst {{ background: var(--purple-dim); }}
  .seq-iqc {{ background: var(--cyan-dim); }}
  .seq-blank {{ background: rgba(0,0,0,0.03); color: var(--text-dim); }}

  @media print {{
    .topbar, .ctrl-btn, .bg-canvas, .grid-overlay, .progress-card, .toc-pills {{ display: none !important; }}
    .main {{ max-width: 100% !important; padding: 0 !important; }}
    .sop-doc-container {{ box-shadow: none !important; border: none !important; padding: 0 !important; }}
    body {{ background: #fff !important; color: #000 !important; }}
    .sop-step-box {{ border-left: 2px solid #000 !important; background: none !important; }}
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
        Unit Penyaringan
      </a>
      <a href="../sop-matrix.html" class="ctrl-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        SOP Matrix (64)
      </a>
    </div>
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
      <button class="ctrl-btn" onclick="window.print()">
        🖨️ Cetak / Print SOP
      </button>
      <button class="ctrl-btn" onclick="resetChecklist('{code}')">
        🔄 Reset Progress
      </button>
      <button class="ctrl-btn" onclick="toggleTheme()" id="themeBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <span id="themeTxt">Dark Mode</span>
      </button>
    </div>
  </div>

  <!-- Hero Ribbon -->
  <div class="hero" style="margin-bottom:1.2rem">
    <div class="hero-org">🇲🇾 NPRA — Pusat Kawalan Kualiti · ISO/IEC 17025 Accredited</div><br>
    <div class="hero-unit">◈ Seksyen Pengujian Produk & Kosmetik · Unit Penyaringan</div>
    <h1 style="font-size:2.2rem">{code} <span class="g">{title}</span></h1>
    <div class="hero-sub">Arahan Kerja Rasmi (Level 300 SOP) · Kategori: {category}</div>
  </div>

  <!-- Progress Tracker Card -->
  <div class="progress-card">
    <div class="progress-left">
      <span class="progress-title">Analyst Benchtop Checklist Progress</span>
      <div class="progress-bar-bg"><div class="progress-bar-fill" id="pBarFill"></div></div>
    </div>
    <div class="progress-stat" id="pBarText">0 / {total_steps} Langkah Selesai (0%)</div>
  </div>

  <!-- Document Container -->
  <div class="sop-doc-container">

    <!-- Official Header Table -->
    <table class="sop-header-table">
      <tr>
        <td rowspan="3" style="width:20%;text-align:center;font-weight:800;font-size:1.15rem;color:var(--cyan)">
          NPRA<br><span style="font-size:0.7rem;color:var(--text-dim);font-weight:500">PUSAT KAWALAN KUALITI</span>
        </td>
        <td colspan="2"><strong>ARAHAN KERJA: {html.escape(title.upper())}</strong></td>
      </tr>
      <tr>
        <td><strong>No. Dokumen:</strong> {code}</td>
        <td><strong>Terbitan / Semakan:</strong> {rev_str}</td>
      </tr>
      <tr>
        <td><strong>Tarikh Kuatkuasa:</strong> {date_str}</td>
        <td><strong>Bahagian / Unit:</strong> SPPK · Unit Penyaringan</td>
      </tr>
    </table>

    <!-- Quick Navigation TOC Pills -->
    {nav_pills_html}

    <!-- Sections -->
    {sections_html}

    <!-- Tables -->
    {f'<div class="sop-sec-title" id="sec-tables"><span class="sec-anchor-dot">◈</span> Jadual Kromatografi &amp; Rujukan Data</div>{tables_html}' if tables_html else ''}

  </div>

  <div class="footer">
    Unit Penyaringan ◈ Seksyen Pengujian Produk & Kosmetik ◈ Pusat Kawalan Kualiti (PKKK), NPRA Malaysia
  </div>
</div>

<script>
  function initTheme() {{
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    const txt = document.getElementById('themeTxt');
    if (txt) txt.textContent = saved === 'light' ? 'Dark Mode' : 'Light Mode';
  }}
  function toggleTheme() {{
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    const txt = document.getElementById('themeTxt');
    if (txt) txt.textContent = next === 'light' ? 'Dark Mode' : 'Light Mode';
  }}

  function onStepCheckChange(docCode) {{
    const checks = document.querySelectorAll('.sop-task-check');
    const checked = Array.from(checks).filter(c => c.checked).length;
    const total = checks.length;
    const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
    
    document.getElementById('pBarFill').style.width = pct + '%';
    document.getElementById('pBarText').textContent = `${{checked}} / ${{total}} Langkah Selesai (${{pct}}%)`;
    
    const state = Array.from(checks).map(c => c.checked);
    localStorage.setItem('sop_check_' + docCode, JSON.stringify(state));
  }}

  function loadChecklist(docCode) {{
    const saved = localStorage.getItem('sop_check_' + docCode);
    if (!saved) return;
    try {{
      const state = JSON.parse(saved);
      const checks = document.querySelectorAll('.sop-task-check');
      checks.forEach((c, idx) => {{
        if (state[idx]) c.checked = true;
      }});
      onStepCheckChange(docCode);
    }} catch (e) {{}}
  }}

  function resetChecklist(docCode) {{
    localStorage.removeItem('sop_check_' + docCode);
    document.querySelectorAll('.sop-task-check').forEach(c => c.checked = false);
    onStepCheckChange(docCode);
  }}

  document.addEventListener('DOMContentLoaded', () => {{
    initTheme();
    loadChecklist('{code}');
  }});
</script>
</body>
</html>
'''
    return html_content

# Generate for all files
all_sops = []
file_list = sorted(os.listdir(DOCS_DIR))

# Category classifier helper
def classify_cat(title):
    t = title.lower()
    if 'hplc' in t or 'rrlc' in t: return 'HPLC / LC'
    if 'gcms' in t or 'gc' in t: return 'GC-MS'
    if 'lcms' in t: return 'LC-MS/MS'
    if 'timbang' in t or 'balance' in t: return 'Alat Timbang'
    if 'ekstrakan' in t or 'spe' in t: return 'Pengekstrakan'
    if 'kosmetik' in t or 'cosmetic' in t: return 'Kosmetik'
    if 'radas' in t or 'pencucian' in t or 'vortex' in t or 'waterbath' in t or 'ultrasonic' in t or 'ph meter' in t: return 'Radas & Penyelenggaraan'
    if 'spesifikasi' in t or 'persampelan' in t or 'sisa' in t or 'charting' in t: return 'Kawalan Kualiti & QA'
    return 'Kaedah Pengujian'

for f in file_list:
    if f.startswith('~$'): continue
    
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
    
    doc_title = title_clean
    for p in paras[:10]:
        if 'ARAHAN KERJA' in p.upper() or 'IDENTIFIKASI' in p.upper() or 'PENGENDALIAN' in p.upper() or 'SCREENING' in p.upper():
            doc_title = p.replace('ARAHAN KERJA :', '').replace('ARAHAN KERJA:', '').strip()
            break
            
    cat = classify_cat(doc_title or title_clean)
    rev_str = 'Terbitan 3 Semakan 0'
    date_str = '10 April 2026'
    if '034' in num_str:
        date_str = '1 Julai 2026'
        rev_str = 'Terbitan 1 Semakan 2'
    
    html_out = format_sop_html(code, doc_title or title_clean, num_str, rev_str, date_str, paras, tables, cat)
    
    out_file = os.path.join(OUT_DIR, f'{slug}.html')
    with open(out_file, 'w', encoding='utf-8') as out_f:
        out_f.write(html_out)
        
    all_sops.append({
        'code': code,
        'title': doc_title or title_clean,
        'num': num_str,
        'category': cat,
        'slug': slug,
        'url': f'sop/{slug}.html'
    })

print(f'Successfully built and formatted {len(all_sops)} ultra-detailed SOP guide pages!')
