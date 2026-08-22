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
    t = html.escape(text)
    t = re.sub(r'(\b\d+(\.\d+)?\s*°C\b)', r'<span class="kw-temp">\1</span>', t)
    t = re.sub(r'(\b\d+(\.\d+)?\s*(?:mL/min|µL/min|mil/min)\b)', r'<span class="kw-flow">\1</span>', t, flags=re.IGNORECASE)
    t = re.sub(r'(\b\d{3}\s*nm\b)', r'<span class="kw-wave">\1</span>', t, flags=re.IGNORECASE)
    t = re.sub(r'(\b\d+(\.\d+)?\s*(?:mg|g|µg|kg)\b)', r'<span class="kw-wt">\1</span>', t)
    t = re.sub(r'(\b\d+(\.\d+)?\s*(?:mL|µL|L)\b)', r'<span class="kw-vol">\1</span>', t)
    t = re.sub(r'(\b\d+(\.\d+)?\s*(?:minit|min|minutes|jam|hours|saat|seconds)\b)', r'<span class="kw-time">\1</span>', t, flags=re.IGNORECASE)
    t = re.sub(r'(\b(?:%RSD|RSD)\s*(?:≤|NMT|&le;)?\s*\d+(\.\d+)?\s*%?)', r'<span class="kw-limit">\1</span>', t, flags=re.IGNORECASE)
    t = re.sub(r'(\bpH\s*\d+(\.\d+)?(\s*±\s*\d+(\.\d+)?)?)', r'<span class="kw-ph">\1</span>', t, flags=re.IGNORECASE)
    return t

def get_target_analytes(title, text):
    t_low = (title + ' ' + text).lower()
    analytes = []
    if 'steroid' in t_low: analytes = ['Dexamethasone', 'Betamethasone', 'Prednisone', 'Prednisolone', 'Triamcinolone acetonide', 'Hydrocortisone acetate', 'Cortisone acetate', 'Betamethasone-17-valerate']
    elif 'diabetik' in t_low or 'diabetic' in t_low: analytes = ['Glibenclamide', 'Metformin', 'Gliclazide', 'Glimepiride']
    elif 'diuretik' in t_low or 'diuretic' in t_low: analytes = ['Hydrochlorothiazide', 'Furosemide', 'Spironolactone']
    elif 'proton pump' in t_low or 'ppi' in t_low: analytes = ['Omeprazole', 'Lansoprazole']
    elif 'hipertensi' in t_low: analytes = ['Amlodipine', 'Atenolol', 'Captopril', 'Losartan', 'Hydrochlorothiazide']
    elif 'domperidone' in t_low: analytes = ['Domperidone']
    elif 'antikolesterol' in t_low or 'kolesterol' in t_low or 'lovastatin' in t_low: analytes = ['Lovastatin', 'Simvastatin', 'Atorvastatin']
    elif 'pde-5' in t_low or 'pde5' in t_low or 'edd' in t_low: analytes = ['Sildenafil', 'Tadalafil', 'Vardenafil', 'Analogues']
    elif 'glycol' in t_low or 'deg' in t_low or 'eg' in t_low: analytes = ['Ethylene Glycol (EG)', 'Diethylene Glycol (DEG)']
    elif 'menthol' in t_low: analytes = ['Menthol', 'Camphor', 'Methyl Salicylate', 'Thymol']
    elif 'hydroquinone' in t_low: analytes = ['Hydroquinone']
    elif 'tretinoin' in t_low: analytes = ['Tretinoin (Retinoic Acid)']
    elif 'paraben' in t_low or 'hydroxybenzoate' in t_low: analytes = ['Methyl, Ethyl, Propyl, Butyl 4-Hydroxybenzoate']
    elif 'fluoride' in t_low: analytes = ['Fluoride (F-)']
    elif 'dopamine' in t_low: analytes = ['Dopamine HCl']
    elif 'minoxidil' in t_low: analytes = ['Minoxidil']
    elif 'theophylline' in t_low or 'caffeine' in t_low: analytes = ['Theophylline', 'Caffeine']
    elif 'antimicrobial' in t_low: analytes = ['Triclosan', 'Climbazole', 'Antimicrobials']
    elif 'nsaid' in t_low: analytes = ['Diclofenac', 'Mefenamic Acid', 'Ibuprofen', 'Indomethacin', 'Piroxicam', 'Ketoprofen', 'Naproxen']
    elif 'phenylenediamine' in t_low or 'p-phenylenediamine' in t_low: analytes = ['p-Phenylenediamine (PPD)']
    elif 'clindamycin' in t_low: analytes = ['Clindamycin']
    return analytes

def get_bench_tips(category, title):
    t_low = (category + ' ' + title).lower()
    tips = []
    if 'hplc' in t_low or 'lc' in t_low:
        tips.append("Tapis semua fasa bergerak (akueus dan organik) menggunakan penuras membran 0.45 µm dan degas dalam kukus ultrasonik selama sekurang-kurangnya 15–20 minit.")
        tips.append("Lakukan Auto Purge / Manual Purge setiap kali pelarut ditambah atau ditukar jenis bagi menyingkirkan buih udara.")
        tips.append("Pastikan garisan dasar (baseline) dan tekanan pam stabil (RSD < 2%) sebelum memulakan suntikan sampel kelompok.")
        tips.append("Bagi sampel matriks kapsul lembut (softgel), gunakan Chloroform kerana gelatin/minyak tidak larut dalam Methanol.")
    elif 'gcms' in t_low:
        tips.append("Lakukan Standard Spectra Tune (s.tune) atau Autotune (a.tune) setiap hari sebelum analisis dan pastikan laporan LULUS.")
        tips.append("Semak paras kebocoran udara/air (Air/Water Check): m/z 18 < 10% dan m/z 28 < 5% berbanding puncak dasar m/z 69.")
        tips.append("Gunakan pelarut berkualiti kromatografi gas dan pastikan septum suntikan ditukar berkala bagi mengelak 'ghost peaks'.")
    elif 'timbang' in t_low or 'balance' in t_low:
        tips.append("Pastikan gelembung aras (spirit level) berada tepat di tengah bulatan sebelum penimbangan dimulakan.")
        tips.append("Gunakan forsep atau sarung tangan semasa mengendalikan batu timbang piawai; elakkan sentuhan langsung jari.")
        tips.append("Lakukan verifikasi harian (Borang UP/014) dan pemeriksaan kepekaan (UP/015) serta kebolehulangan (UP/016).")
    else:
        tips.append("Patuhi amalan keselamatan makmal yang baik (GLP) dan rekodkan semua langkah persediaan dalam lembaran kerja rasmi.")
        tips.append("Sebarang ketakakuran atau sampel luar spesifikasi hendaklah disiasat mengikut Arahan Kerja PKKK/300/UP/002.")
    return tips

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

def format_sop_html(code, title, doc_num_str, rev_str, date_str, paras, tables_data, category):
    full_text = ' '.join(paras)
    analytes = get_target_analytes(title, full_text)
    bench_tips = get_bench_tips(category, title)
    
    # Workflow Steps
    if 'HPLC' in category or 'GC-MS' in category or 'LC-MS' in category or 'Kosmetik' in category:
        workflow_steps = [
            ("1. Reagen & Piawai", "Penyediaan fasa bergerak, stok & kalibrasi"),
            ("2. Pengekstrakan", "Timbang, sonikasi, sentrifug & turas 0.45µm"),
            ("3. Persediaan Alat", "Purging saluran, autotune & baseline"),
            ("4. Suntikan Batch", "Blank, SST (n=6), Sampel & IQC"),
            ("5. Verifikasi & Rekod", "Padanan RT, spektrum UV/MS & Laporan")
        ]
    elif 'Alat Timbang' in category:
        workflow_steps = [
            ("1. Pemeriksaan", "Semak aras gelembung (spirit level)"),
            ("2. Warm-up", "Buka suis & stabilkan 30 minit"),
            ("3. Semakan Harian", "Timbang batu piawai harian (UP/014)"),
            ("4. Ujian Prestasi", "Kepekaan ΔE (UP/015) & kebolehulangan s"),
            ("5. Carta Kawalan", "Plot graf Shewhart IQC & logbook")
        ]
    else:
        workflow_steps = [
            ("1. Persediaan", "Penerimaan sampel & borang"),
            ("2. Pelaksanaan", "Langkah kerja mengikut SOP"),
            ("3. Verifikasi", "Pemeriksaan kualiti & pematuhan"),
            ("4. Dokumentasi", "Perekodan fail kualiti rasmi")
        ]

    wf_html = '<div class="wf-track">'
    for idx, (w_title, w_desc) in enumerate(workflow_steps):
        wf_html += f'''
        <div class="wf-step">
          <div class="wf-node">{idx + 1}</div>
          <div class="wf-info">
            <div class="wf-name">{w_title}</div>
            <div class="wf-desc">{w_desc}</div>
          </div>
        </div>
        '''
        if idx < len(workflow_steps) - 1:
            wf_html += '<div class="wf-arrow">➔</div>'
    wf_html += '</div>'

    # Build Quick Executive Summary Banner
    summary_chips_html = ''
    if analytes:
        chips_str = ''.join([f'<span class="analite-chip">{html.escape(a)}</span>' for a in analytes[:8]])
        summary_chips_html = f'''
        <div class="summary-analytes">
          <span class="sum-lbl">🎯 Sebatian Sasaran Pengujian:</span>
          <div class="chips-container">{chips_str}</div>
        </div>
        '''

    tips_html = ''
    if bench_tips:
        tips_list = ''.join([f'<li>{t}</li>' for t in bench_tips])
        tips_html = f'''
        <div class="bench-tips-card">
          <div class="tips-header">
            <span class="tips-icon">💡</span>
            <strong>Petua &amp; Perhatian Penting Makmal (Bench Notes):</strong>
          </div>
          <ul class="tips-list">
            {tips_list}
          </ul>
        </div>
        '''

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

    # Section theme classifier
    def get_sec_theme(stitle):
        st = stitle.lower()
        if 'tujuan' in st or 'objektif' in st or 'skop' in st:
            return 'sec-theme-cyan', '🎯'
        if 'definisi' in st:
            return 'sec-theme-purple', '📖'
        if 'tanggungjawab' in st:
            return 'sec-theme-mint', '👥'
        if 'prosedur' in st or 'procedure' in st:
            return 'sec-theme-amber', '🔬'
        if 'rekod' in st:
            return 'sec-theme-indigo', '📝'
        return 'sec-theme-cyan', '◈'

    # Build sections HTML with high-contrast card boxes
    sections_html = ''
    total_steps = 0
    
    for s_idx, s in enumerate(sections):
        sec_title = html.escape(s['title'])
        sec_id = f'sec-{s_idx + 1}'
        theme_class, sec_icon = get_sec_theme(sec_title)
        
        body_content = ''
        current_step_body = []
        current_step_header = None
        
        def flush_step():
            nonlocal current_step_body, current_step_header, total_steps, body_content
            if current_step_header or current_step_body:
                if current_step_header:
                    total_steps += 1
                    step_id = f'step-{doc_num_str}-{total_steps}'
                    inner_items = ''.join(current_step_body)
                    body_content += f'''
                    <div class="sop-step-card">
                      <div class="step-card-header">
                        <div class="step-check-wrap">
                          <input type="checkbox" id="{step_id}" class="sop-task-check" onchange="onStepCheckChange('{code}')">
                          <label for="{step_id}" class="sop-step-title">
                            {html.escape(current_step_header)}
                          </label>
                        </div>
                      </div>
                      <div class="step-card-body">
                        {inner_items}
                      </div>
                    </div>
                    '''
                else:
                    body_content += ''.join(current_step_body)
                current_step_body = []
                current_step_header = None

        for itm in s['items']:
            # Check if this is a sub-step heading (e.g. 6.1, 6.2, 6.3.1, etc.)
            if re.match(r'^\d+\.\d+(\.\d+)?(\s+|$)', itm):
                flush_step()
                current_step_header = itm
            elif itm.startswith(('•', '-', '*')) or re.match(r'^[a-z]\)', itm) or re.match(r'^\d+\)', itm):
                current_step_body.append(f'''
                <div class="sop-list-item">
                  <span class="sop-bullet">▹</span>
                  <span class="sop-list-text">{highlight_keywords(itm)}</span>
                </div>
                ''')
            else:
                current_step_body.append(f'<p class="sop-p">{highlight_keywords(itm)}</p>')
        
        flush_step()

        sections_html += f'''
        <div class="sop-section-container {theme_class}" id="{sec_id}">
          <div class="sop-section-header">
            <span class="sec-icon">{sec_icon}</span>
            <h2>{sec_title}</h2>
          </div>
          <div class="sop-section-body">
            {body_content}
          </div>
        </div>
        '''

    # Quick Nav Pills
    nav_pills_html = '<div class="toc-pills">'
    for s_idx, s in enumerate(sections):
        s_name = s['title'][:30] + ('...' if len(s['title']) > 30 else '')
        nav_pills_html += f'<a href="#sec-{s_idx + 1}" class="toc-pill">{html.escape(s_name)}</a>'
    if tables_data:
        nav_pills_html += f'<a href="#sec-tables" class="toc-pill highlight">📊 Jadual Data ({len(tables_data)})</a>'
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
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=DM+Mono:wght@400;500;700&family=Playfair+Display:ital@1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../steroid-hplc.css">
<style>
  /* ========================================================= */
  /* HIGH-CONTRAST, ULTRA-READABLE SOP TYPOGRAPHY & LAYOUT     */
  /* ========================================================= */
  
  :root {{
    --text-heading: #090d16;
    --text-body: #1e293b;
    --text-muted: #475569;
    --card-surface: #ffffff;
    --card-border-subtle: #cbd5e1;
    --step-border: #94a3b8;
  }}

  [data-theme="dark"] {{
    --text-heading: #f8fafc;
    --text-body: #cbd5e1;
    --text-muted: #94a3b8;
    --card-surface: rgba(15, 23, 42, 0.85);
    --card-border-subtle: rgba(255, 255, 255, 0.12);
    --step-border: rgba(255, 255, 255, 0.18);
  }}

  .sop-doc-container {{
    background: var(--card-bg); border: 1px solid var(--card-border);
    border-radius: 20px; padding: 2.5rem; backdrop-filter: blur(20px);
    box-shadow: var(--shadow-md); margin-top: 1.5rem; position: relative;
  }}

  /* Header Table */
  .sop-header-table {{
    width: 100%; border-collapse: collapse; margin-bottom: 2rem; font-family: var(--font-mono); font-size: 0.88rem;
    background: var(--card-surface); border-radius: 12px; overflow: hidden; border: 1px solid var(--card-border-subtle);
    box-shadow: var(--shadow-sm);
  }}
  .sop-header-table td {{
    border: 1px solid var(--card-border-subtle); padding: 0.85rem 1.1rem; vertical-align: middle; color: var(--text-body);
  }}
  .sop-header-table strong {{ color: var(--text-heading); font-weight: 700; }}

  /* ========================================================= */
  /* SECTION CONTAINERS WITH HIGH-CONTRAST COLORED HEADERS    */
  /* ========================================================= */
  .sop-section-container {{
    background: var(--card-surface);
    border: 1px solid var(--card-border-subtle);
    border-radius: 16px;
    margin-bottom: 2.2rem;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }}
  .sop-section-container:hover {{
    box-shadow: var(--shadow-md);
  }}

  .sop-section-header {{
    padding: 0.9rem 1.4rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #ffffff;
    font-weight: 800;
  }}
  .sop-section-header h2 {{
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.01em;
    margin: 0;
    color: #ffffff;
  }}
  .sec-icon {{
    font-size: 1.2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }}

  /* Distinct Section Color Themes */
  .sec-theme-cyan .sop-section-header {{
    background: linear-gradient(135deg, #0284c7, #0369a1);
  }}
  .sec-theme-purple .sop-section-header {{
    background: linear-gradient(135deg, #7c3aed, #6d28d9);
  }}
  .sec-theme-mint .sop-section-header {{
    background: linear-gradient(135deg, #059669, #047857);
  }}
  .sec-theme-amber .sop-section-header {{
    background: linear-gradient(135deg, #d97706, #b45309);
  }}
  .sec-theme-indigo .sop-section-header {{
    background: linear-gradient(135deg, #4f46e5, #3730a3);
  }}

  .sop-section-body {{
    padding: 1.6rem 1.8rem;
  }}

  /* ========================================================= */
  /* STEP CARDS (HIGH CONTRAST & INTERACTIVE)                  */
  /* ========================================================= */
  .sop-step-card {{
    background: var(--glass);
    border: 1px solid var(--step-border);
    border-left: 5px solid var(--cyan);
    border-radius: 12px;
    margin-bottom: 1.4rem;
    overflow: hidden;
    transition: all 0.2s ease;
  }}
  .sop-step-card:hover {{
    border-color: var(--cyan);
    border-left-color: var(--purple);
    background: var(--card-hover);
    transform: translateY(-2px);
  }}
  .step-card-header {{
    padding: 0.85rem 1.2rem;
    background: rgba(2, 132, 199, 0.08);
    border-bottom: 1px solid var(--glass-border);
  }}
  .step-check-wrap {{
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }}
  .sop-task-check {{
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: var(--cyan);
    flex-shrink: 0;
  }}
  .sop-step-title {{
    cursor: pointer;
    font-size: 1.02rem;
    font-weight: 700;
    color: var(--text-heading);
    font-family: var(--font-main);
  }}
  .step-card-body {{
    padding: 1.1rem 1.3rem;
  }}

  /* Typography */
  .sop-p {{
    font-size: 0.95rem;
    line-height: 1.8;
    color: var(--text-body);
    margin-bottom: 0.8rem;
  }}
  .sop-list-item {{
    display: flex;
    gap: 0.65rem;
    align-items: flex-start;
    margin-left: 0.8rem;
    font-size: 0.93rem;
    line-height: 1.75;
    color: var(--text-body);
    margin-bottom: 0.5rem;
  }}
  .sop-bullet {{
    color: var(--cyan);
    font-weight: bold;
    flex-shrink: 0;
  }}
  .sop-list-text {{ flex: 1; }}

  /* Keyword Highlights */
  .kw-temp {{ color: #d97706; font-weight: 700; font-family: var(--font-mono); background: rgba(217, 119, 6, 0.1); padding: 0.1rem 0.35rem; border-radius: 4px; }}
  .kw-flow {{ color: #0284c7; font-weight: 700; font-family: var(--font-mono); background: rgba(2, 132, 199, 0.1); padding: 0.1rem 0.35rem; border-radius: 4px; }}
  .kw-wave {{ color: #7c3aed; font-weight: 700; font-family: var(--font-mono); background: rgba(124, 58, 237, 0.1); padding: 0.1rem 0.35rem; border-radius: 4px; }}
  .kw-wt {{ color: #059669; font-weight: 700; font-family: var(--font-mono); background: rgba(5, 150, 105, 0.1); padding: 0.1rem 0.35rem; border-radius: 4px; }}
  .kw-vol {{ color: #0284c7; font-weight: 700; font-family: var(--font-mono); background: rgba(2, 132, 199, 0.1); padding: 0.1rem 0.35rem; border-radius: 4px; }}
  .kw-time {{ color: #d97706; font-weight: 700; font-family: var(--font-mono); background: rgba(217, 119, 6, 0.1); padding: 0.1rem 0.35rem; border-radius: 4px; }}
  .kw-limit {{ color: #dc2626; font-weight: 700; font-family: var(--font-mono); background: rgba(220, 38, 38, 0.1); padding: 0.1rem 0.35rem; border-radius: 4px; }}
  .kw-ph {{ color: #7c3aed; font-weight: 700; font-family: var(--font-mono); background: rgba(124, 58, 237, 0.1); padding: 0.1rem 0.35rem; border-radius: 4px; }}

  /* Visual Workflow Timeline */
  .wf-track {{
    display: flex; align-items: center; justify-content: space-between; gap: 0.6rem; margin-bottom: 1.8rem;
    background: var(--card-surface); padding: 1.2rem 1.4rem; border-radius: 16px; border: 1px solid var(--card-border-subtle); overflow-x: auto;
    box-shadow: var(--shadow-sm);
  }}
  .wf-step {{ display: flex; align-items: center; gap: 0.6rem; min-width: 140px; }}
  .wf-node {{
    width: 34px; height: 34px; border-radius: 50%; background: var(--cyan-dim); border: 2px solid var(--cyan);
    color: var(--cyan); display: flex; align-items: center; justify-content: center; font-family: var(--font-mono);
    font-size: 0.9rem; font-weight: 800; flex-shrink: 0;
  }}
  .wf-name {{ font-family: var(--font-mono); font-size: 0.84rem; font-weight: 700; color: var(--text-heading); }}
  .wf-desc {{ font-size: 0.74rem; color: var(--text-muted); line-height: 1.3; }}
  .wf-arrow {{ color: var(--cyan); font-size: 1rem; font-weight: bold; flex-shrink: 0; }}

  /* Executive Summary & Chips */
  .summary-analytes {{
    margin: 1rem 0 1.4rem; padding: 1rem 1.3rem; background: var(--card-surface); border-radius: 14px;
    border: 1px solid var(--card-border-subtle); display: flex; flex-direction: column; gap: 0.5rem;
    box-shadow: var(--shadow-sm);
  }}
  .sum-lbl {{ font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; color: var(--cyan); text-transform: uppercase; }}
  .chips-container {{ display: flex; flex-wrap: wrap; gap: 0.45rem; }}
  .analite-chip {{
    padding: 0.35rem 0.75rem; background: var(--purple-dim); border: 1px solid rgba(124, 58, 237, 0.25);
    color: var(--purple); font-family: var(--font-mono); font-size: 0.78rem; border-radius: 8px; font-weight: 600;
  }}

  /* Bench Notes Card */
  .bench-tips-card {{
    background: var(--amber-dim); border: 1px solid rgba(217, 119, 6, 0.35); border-radius: 14px;
    padding: 1.3rem 1.5rem; margin-bottom: 1.8rem; box-shadow: var(--shadow-sm);
  }}
  .tips-header {{ display: flex; align-items: center; gap: 0.5rem; font-size: 0.95rem; color: #d97706; margin-bottom: 0.7rem; font-weight: 700; }}
  .tips-list {{ margin-left: 1.5rem; font-size: 0.9rem; line-height: 1.7; color: var(--text-body); }}

  /* Progress Tracker */
  .progress-card {{
    background: linear-gradient(135deg, var(--cyan-dim), var(--purple-dim));
    border: 1px solid var(--cyan); border-radius: 14px; padding: 1.1rem 1.5rem;
    margin-bottom: 1.8rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;
    box-shadow: var(--shadow-sm);
  }}
  .progress-left {{ display: flex; flex-direction: column; gap: 0.35rem; }}
  .progress-title {{ font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--cyan); }}
  .progress-bar-bg {{ width: 280px; max-width: 100%; height: 10px; background: rgba(0,0,0,0.1); border-radius: 100px; overflow: hidden; }}
  .progress-bar-fill {{ height: 100%; background: var(--cyan); width: 0%; transition: width 0.3s ease; }}
  .progress-stat {{ font-family: var(--font-mono); font-size: 0.9rem; font-weight: 700; color: var(--text-heading); }}

  /* TOC Pills */
  .toc-pills {{ display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem; }}
  .toc-pill {{
    padding: 0.45rem 0.9rem; background: var(--card-surface); border: 1px solid var(--card-border-subtle);
    border-radius: 100px; font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-body);
    text-decoration: none; transition: all 0.2s ease; box-shadow: var(--shadow-sm); font-weight: 600;
  }}
  .toc-pill:hover {{ border-color: var(--cyan); color: var(--cyan); transform: translateY(-1px); }}
  .toc-pill.highlight {{ background: var(--cyan-dim); border-color: var(--cyan); color: var(--cyan); font-weight: 700; }}

  /* Table Cards */
  .table-card {{
    background: var(--card-surface); border: 1px solid var(--card-border-subtle); border-radius: 14px;
    padding: 1.4rem; margin: 1.8rem 0; overflow: hidden; box-shadow: var(--shadow-sm);
  }}
  .table-card-header {{
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.9rem;
    border-bottom: 2px solid var(--glass-border); padding-bottom: 0.5rem;
  }}
  .table-tag {{ font-family: var(--font-mono); font-size: 0.8rem; font-weight: 800; color: var(--cyan); }}
  .table-doc-code {{ font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted); }}
  .table-responsive {{ overflow-x: auto; }}
  .table-official {{
    width: 100%; border-collapse: collapse; font-size: 0.85rem; font-family: var(--font-mono);
  }}
  .table-official th, .table-official td {{
    border: 1px solid var(--card-border-subtle); padding: 0.65rem 0.9rem; text-align: left;
  }}
  .table-official th {{ background: var(--glass); color: var(--text-heading); font-weight: 700; }}
  .seq-sst {{ background: var(--purple-dim); }}
  .seq-iqc {{ background: var(--cyan-dim); }}
  .seq-blank {{ background: rgba(0,0,0,0.03); color: var(--text-muted); }}

  @media print {{
    .topbar, .ctrl-btn, .bg-canvas, .grid-overlay, .progress-card, .toc-pills, .bench-tips-card, .wf-track {{ display: none !important; }}
    .main {{ max-width: 100% !important; padding: 0 !important; }}
    .sop-doc-container {{ box-shadow: none !important; border: none !important; padding: 0 !important; }}
    body {{ background: #fff !important; color: #000 !important; }}
    .sop-section-header {{ background: #eee !important; color: #000 !important; }}
    .sop-section-header h2 {{ color: #000 !important; }}
    .sop-step-card {{ border-left: 2px solid #000 !important; background: none !important; }}
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
    <h1 style="font-size:2.3rem;font-weight:900">{code} <span class="g">{title}</span></h1>
    <div class="hero-sub" style="font-weight:600">Arahan Kerja Rasmi (Level 300 SOP) · Kategori: {category}</div>
  </div>

  <!-- Visual Workflow Timeline -->
  {wf_html}

  <!-- Target Analytes / Quick Chips -->
  {summary_chips_html}

  <!-- Bench Notes & Precautions -->
  {tips_html}

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
        <td rowspan="3" style="width:20%;text-align:center;font-weight:800;font-size:1.2rem;color:var(--cyan)">
          NPRA<br><span style="font-size:0.72rem;color:var(--text-muted);font-weight:600">PUSAT KAWALAN KUALITI</span>
        </td>
        <td colspan="2"><strong style="font-size:0.95rem">ARAHAN KERJA: {html.escape(title.upper())}</strong></td>
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

    <!-- Sections (High-Contrast Colored Blocks) -->
    {sections_html}

    <!-- Tables -->
    {f'<div class="sop-section-container sec-theme-indigo" id="sec-tables"><div class="sop-section-header"><span class="sec-icon">📊</span><h2>Jadual Kromatografi &amp; Rujukan Data</h2></div><div class="sop-section-body">{tables_html}</div></div>' if tables_html else ''}

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

print(f'Successfully built {len(all_sops)} high-contrast, ultra-differentiated SOP guide pages!')
