import os, sys, re, html, docx, fitz, json
from sync_sop_matrix_and_guides import SOP_PARAMS

sys.stdout.reconfigure(encoding='utf-8')

DOCS_DIR = r'c:\Users\User\OneDrive\Desktop\Unit Penyaringan\2_Arahan Kerja 300\Level 300_Arahan Kerja'
OUT_DIR = r'c:\Users\User\OneDrive\Desktop\syarief02\portfolio\lab\penyaringan\sop'

os.makedirs(OUT_DIR, exist_ok=True)

# ─── SOP 040, 028 & 011 are manually crafted and must never be overwritten ───
SKIP_OVERWRITE = {'040', '028', '011'}

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
            if line and not 'CHECK "MASTER LIST"' in line and not 'Page' in line and not 'Testing Procedure' in line:
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
    # Highlight m/z values
    t = re.sub(r'(m/z\s*\d+)', r'<span class="kw-wave">\1</span>', t, flags=re.IGNORECASE)
    # Highlight kPa, psi, bar
    t = re.sub(r'(\b\d+(\.\d+)?\s*(?:kPa|psi|bar)\b)', r'<span class="kw-flow">\1</span>', t, flags=re.IGNORECASE)
    # Highlight kV
    t = re.sub(r'(\b\d+(\.\d+)?\s*kV\b)', r'<span class="kw-temp">\1</span>', t, flags=re.IGNORECASE)
    return t

# ─── SECTION HEADING KEYWORDS ───
# Maps standalone keywords to their proper section number and icon/theme
SECTION_KEYWORDS = {
    'PINDAAN': ('0.0', 'sec-theme-slate', '📋', 'revision'),
    'SEJARAH SEMAKAN': ('0.0', 'sec-theme-slate', '📋', 'revision'),
    'TUJUAN': ('1.0', 'sec-theme-cyan', '🎯', 'normal'),
    'OBJEKTIF': ('1.0', 'sec-theme-cyan', '🎯', 'normal'),
    'OBJECTIVE': ('1.0', 'sec-theme-cyan', '🎯', 'normal'),
    'SKOP': ('2.0', 'sec-theme-cyan', '📐', 'normal'),
    'SCOPE': ('2.0', 'sec-theme-cyan', '📐', 'normal'),
    'DEFINISI': ('3.0', 'sec-theme-purple', '📖', 'normal'),
    'DEFINITIONS': ('3.0', 'sec-theme-purple', '📖', 'normal'),
    'CARTA ALIRAN': ('4.0', 'sec-theme-purple', '🔀', 'normal'),
    'FLOW CHART': ('4.0', 'sec-theme-purple', '🔀', 'normal'),
    'TANGGUNGJAWAB': ('5.0', 'sec-theme-mint', '👥', 'normal'),
    'RESPONSIBILITIES': ('5.0', 'sec-theme-mint', '👥', 'normal'),
    'PROSEDUR': ('6.0', 'sec-theme-amber', '🔬', 'procedure'),
    'PROCEDURE': ('6.0', 'sec-theme-amber', '🔬', 'procedure'),
    'REKOD KUALITI': ('7.0', 'sec-theme-indigo', '📝', 'normal'),
    'QUALITY RECORD': ('7.0', 'sec-theme-indigo', '📝', 'normal'),
    'QUALITY RECORDS': ('7.0', 'sec-theme-indigo', '📝', 'normal'),
    'LAMPIRAN': ('8.0', 'sec-theme-indigo', '📎', 'normal'),
    'ATTACHMENTS': ('8.0', 'sec-theme-indigo', '📎', 'normal'),
    'RUJUKAN': ('9.0', 'sec-theme-indigo', '📚', 'normal'),
    'REFERENCES': ('9.0', 'sec-theme-indigo', '📚', 'normal'),
    'PENYELENGGARAAN': ('6.5', 'sec-theme-rose', '🔧', 'normal'),
    'PEMBERSIHAN': ('6.6', 'sec-theme-rose', '🧹', 'normal'),
}

def is_section_heading(text):
    """Check if a paragraph is a standalone section heading (e.g., just 'TUJUAN' or '6.0 PROSEDUR')"""
    stripped = text.strip().upper()
    
    # Pattern 1: Numbered heading like "6.0 PROSEDUR" or "1. TUJUAN"
    m = re.match(r'^(\d+\.?\d*)\s+(.+)$', stripped)
    if m:
        keyword = m.group(2).strip()
        for k in SECTION_KEYWORDS:
            if keyword.startswith(k):
                return True, f"{m.group(1)} {keyword}", SECTION_KEYWORDS[k]
    
    # Pattern 2: Standalone keyword like "TUJUAN", "PROSEDUR"
    for k in SECTION_KEYWORDS:
        if stripped == k or stripped.startswith(k + ':') or stripped.startswith(k + ' '):
            return True, f"{SECTION_KEYWORDS[k][0]} {k}", SECTION_KEYWORDS[k]
        if stripped == k:
            return True, f"{SECTION_KEYWORDS[k][0]} {k}", SECTION_KEYWORDS[k]
    
    return False, None, None

def is_revision_content(text):
    """Detect revision history / amendment content"""
    t = text.strip()
    patterns = [
        r'^Terbitan\s+\d+',
        r'^Semakan\s+\d+',
        r'^Terbitan\s+\d+,?\s*Semakan\s+\d+',
        r'^i\.\s+Pinda',
        r'^ii\.\s+Pinda',
        r'^iii\.\s+Pinda',
        r'^Kemaskini\s',
        r'^Meminda\s',
        r'^Pindaan\s',
        r'^Mengemaskini\s',
        r'^Batal\s',
        r'^Prosedur ini merupakan dokumen baru selaras',
    ]
    for p in patterns:
        if re.match(p, t, re.IGNORECASE):
            return True
    return False

def is_procedural_action(text):
    """Detect if a line is an actionable procedural step"""
    t = text.strip()
    # Short strings aren't steps
    if len(t) < 10:
        return False
    action_verbs = [
        r'^Tekan\b', r'^Hidupkan\b', r'^Matikan\b', r'^Tutup\b', r'^Buka\b',
        r'^Timbang\b', r'^Isikan\b', r'^Tetapkan\b', r'^Pusingkan\b',
        r'^Tunggu\b', r'^Pasangkan\b', r'^Cabut\b', r'^Lepaskan\b',
        r'^Tampal\b', r'^Cetak\b', r'^Simpan\b', r'^Pilih\b', r'^Klik\b',
        r'^Taip\b', r'^Masukkan\b', r'^Lakukan\b', r'^Jalankan\b',
        r'^Semak\b', r'^Pastikan\b', r'^Sediakan\b', r'^Bilas\b',
        r'^Cuci\b', r'^Keringkan\b', r'^Labur\b', r'^Angkat\b',
        r'^Saring\b', r'^Turas\b', r'^Tuang\b', r'^Campurkan\b',
        r'^Goncang\b', r'^Guna\b', r'^Gunakan\b', r'^Ulangi\b',
        r'^Catat\b', r'^Rekod\b', r'^Pindah\b', r'^Biarkan\b',
        r'^Sambung\b', r'^Laras\b', r'^Letak\b', r'^Ambil\b',
        r'^Ukur\b', r'^Potong\b', r'^Pipet\b', r'^Set\b',
        r'^Suntik\b', r'^Inject\b', r'^Flush\b', r'^Purge\b',
        r'^Run\b', r'^Start\b', r'^Stop\b', r'^Click\b',
        r'^Press\b', r'^Turn\b', r'^Open\b', r'^Close\b',
        r'^Select\b', r'^Enter\b', r'^Check\b', r'^Verify\b',
        r'^Prepare\b', r'^Weigh\b', r'^Fill\b', r'^Rinse\b',
        r'^Transfer\b', r'^Wait\b', r'^Allow\b', r'^Place\b',
        r'^Remove\b', r'^Add\b', r'^Mix\b', r'^Shake\b',
        r'^Filter\b', r'^Dry\b', r'^Record\b', r'^Label\b',
        r'^Condition\b', r'^Elute\b', r'^Collect\b', r'^Evaporate\b',
        r'^Reconstitute\b', r'^Sonicate\b', r'^Centrifuge\b',
        r'^Vortex\b', r'^Dilute\b', r'^Dissolve\b', r'^Store\b',
        r'^Alat\b', r'^Sistem\b', r'^Sekiranya\b',
        r'^Elektrik\b', r'^Pemanasan\b', r'^Water bath\b',
        r'^Kebersihan\b', r'^ON\b', r'^OFF\b',
    ]
    for v in action_verbs:
        if re.match(v, t, re.IGNORECASE):
            return True
    return False

def get_target_analytes(title, text, category):
    """Only return analytes for actual testing methods, not instrument/equipment SOPs"""
    # Don't show analyte chips for instrument, equipment, balance, extraction, or QA SOPs
    if category in ('Alat Timbang', 'Radas & Penyelenggaraan', 'Pengekstrakan', 'Kawalan Kualiti & QA'):
        return []
    
    t_low = (title + ' ' + text).lower()
    analytes = []
    if 'steroid' in t_low and ('hplc' in t_low or 'produk tradisional' in t_low):
        analytes = ['Dexamethasone', 'Betamethasone', 'Prednisone', 'Prednisolone', 'Triamcinolone acetonide', 'Hydrocortisone acetate', 'Cortisone acetate', 'Betamethasone-17-valerate']
    elif 'diabetik' in t_low or 'diabetic' in t_low:
        analytes = ['Glibenclamide', 'Metformin', 'Gliclazide', 'Glimepiride']
    elif 'diuretik' in t_low or 'diuretic' in t_low:
        analytes = ['Hydrochlorothiazide', 'Furosemide', 'Spironolactone']
    elif 'proton pump' in t_low or ('ppi' in t_low and 'hplc' in t_low):
        analytes = ['Omeprazole', 'Lansoprazole']
    elif 'hipertensi' in t_low and 'identifikasi' in t_low:
        analytes = ['Amlodipine', 'Atenolol', 'Captopril', 'Losartan', 'Hydrochlorothiazide']
    elif 'domperidone' in t_low and 'identifikasi' in t_low:
        analytes = ['Domperidone']
    elif ('antikolesterol' in t_low or 'kolesterol' in t_low) and 'identifikasi' in t_low:
        analytes = ['Lovastatin', 'Simvastatin', 'Atorvastatin']
    elif 'lovastatin' in t_low and 'kandungan' in t_low:
        analytes = ['Lovastatin']
    elif 'pde-5' in t_low or 'pde5' in t_low:
        analytes = ['Sildenafil', 'Tadalafil', 'Vardenafil', 'Analogues']
    elif 'edd' in t_low and 'identifikasi' in t_low:
        analytes = ['Sildenafil', 'Tadalafil', 'Vardenafil', 'Analogues']
    elif 'diethylene glycol' in t_low or ('glycol' in t_low and ('gcms' in t_low or 'sirap' in t_low or 'syrup' in t_low or 'cecair' in t_low)):
        analytes = ['Ethylene Glycol (EG)', 'Diethylene Glycol (DEG)']
    elif 'menthol' in t_low and ('camphor' in t_low or 'identifikasi' in t_low):
        analytes = ['Menthol', 'Camphor', 'Methyl Salicylate', 'Thymol']
    elif 'hydroquinone' in t_low and ('identifikasi' in t_low or 'kandungan' in t_low or 'kosmetik' in t_low):
        analytes = ['Hydroquinone']
    elif 'tretinoin' in t_low:
        analytes = ['Tretinoin (Retinoic Acid)']
    elif 'paraben' in t_low or 'hydroxybenzoate' in t_low:
        analytes = ['Methyl, Ethyl, Propyl, Butyl 4-Hydroxybenzoate']
    elif 'fluoride' in t_low:
        analytes = ['Fluoride (F⁻)']
    elif 'dopamine' in t_low:
        analytes = ['Dopamine HCl']
    elif 'minoxidil' in t_low:
        analytes = ['Minoxidil']
    elif 'theophylline' in t_low or ('caffeine' in t_low and 'kosmetik' in t_low):
        analytes = ['Theophylline', 'Caffeine']
    elif 'antimicrobial' in t_low:
        analytes = ['Triclosan', 'Climbazole', 'Antimicrobials']
    elif 'nsaid' in t_low:
        analytes = ['Diclofenac', 'Mefenamic Acid', 'Ibuprofen', 'Indomethacin', 'Piroxicam', 'Ketoprofen', 'Naproxen']
    elif 'phenylenediamine' in t_low or 'p-phenylenediamine' in t_low:
        analytes = ['p-Phenylenediamine (PPD)']
    elif 'clindamycin' in t_low:
        analytes = ['Clindamycin']
    elif 'antifungal' in t_low or 'antikulat' in t_low:
        analytes = ['Ketoconazole', 'Miconazole', 'Itraconazole']
    return analytes

def get_bench_tips(category, title):
    t_low = (category + ' ' + title).lower()
    tips = []
    if 'hplc' in t_low or 'lc' in t_low or 'rrlc' in t_low:
        tips.append("Tapis semua fasa bergerak (akueus dan organik) menggunakan penuras membran 0.45 µm dan degas dalam kukus ultrasonik selama sekurang-kurangnya 15–20 minit.")
        tips.append("Lakukan Auto Purge / Manual Purge setiap kali pelarut ditambah atau ditukar jenis bagi menyingkirkan buih udara.")
        tips.append("Pastikan garisan dasar (baseline) dan tekanan pam stabil (RSD < 2%) sebelum memulakan suntikan sampel kelompok.")
        tips.append("Bagi sampel matriks kapsul lembut (softgel), gunakan Chloroform kerana gelatin/minyak tidak larut dalam Methanol.")
    elif 'gcms' in t_low or 'gc-ms' in t_low:
        tips.append("Lakukan Standard Spectra Tune (s.tune) atau Autotune (a.tune) setiap hari sebelum analisis dan pastikan laporan LULUS.")
        tips.append("Semak paras kebocoran udara/air (Air/Water Check): m/z 18 < 10% dan m/z 28 < 5% berbanding puncak dasar m/z 69.")
        tips.append("Gunakan pelarut berkualiti kromatografi gas dan pastikan septum suntikan ditukar berkala bagi mengelak 'ghost peaks'.")
    elif 'lcms' in t_low or 'lc-ms' in t_low:
        tips.append("Pastikan Nebulizing Gas, Drying Gas, dan Heating Gas dibekalkan pada tekanan yang mencukupi sebelum menghidupkan MS.")
        tips.append("Optimumkan Collision Energy (CE) bagi setiap MRM transition untuk mendapat intensiti maksimum.")
        tips.append("Jalankan Tuning secara berkala dan pastikan sensitivity test LULUS sebelum analisis batch.")
    elif 'timbang' in t_low or 'balance' in t_low or 'precisa' in t_low or 'sartorius' in t_low or 'mettler' in t_low:
        tips.append("Pastikan gelembung aras (spirit level) berada tepat di tengah bulatan sebelum penimbangan dimulakan.")
        tips.append("Gunakan forsep atau sarung tangan semasa mengendalikan batu timbang piawai; elakkan sentuhan langsung jari.")
        tips.append("Lakukan verifikasi harian (Borang UP/014) dan pemeriksaan kepekaan (UP/015) serta kebolehulangan (UP/016).")
    elif 'ph meter' in t_low:
        tips.append("Lakukan kalibrasi 2-titik (pH 4.0 dan pH 7.0) atau 3-titik (pH 4.0, 7.0, 10.0) setiap kali sebelum penggunaan.")
        tips.append("Bilas elektrod dengan air suling sebelum dan selepas setiap pengukuran.")
        tips.append("Simpan elektrod dalam larutan penyimpanan KCl 3M. Jangan biarkan elektrod kering.")
    elif 'water bath' in t_low:
        tips.append("Pastikan paras air berada di antara tanda MIN dan MAX sebelum memulakan pemanasan.")
        tips.append("Gunakan air demineralized sahaja untuk mengelakkan pembentukan kerak mineral.")
        tips.append("Matikan suis elektrik dan cabut plug sebelum membuka penutup water bath atau mengisi semula air.")
    elif 'ultrasonic' in t_low or 'sonikasi' in t_low:
        tips.append("Pastikan paras air dalam tangki ultrasonik mencukupi untuk menyelubungi bahagian bawah bekas sampel.")
        tips.append("Jangan mengendalikan ultrasonik tanpa air dalam tangki kerana boleh merosakkan transducer.")
    elif 'vortex' in t_low:
        tips.append("Pastikan bekas sampel ditutup rapat sebelum melakukan vortexing untuk mengelakkan tumpahan.")
        tips.append("Gunakan kelajuan yang sesuai — terlalu laju boleh menyebabkan emulsi pada sampel pengekstrakan cecair-cecair.")
    elif 'sentrifug' in t_low or 'centrifuge' in t_low:
        tips.append("Pastikan tiub sentrifug diimbangkan (balanced) sebelum menjalankan sentrifugasi.")
        tips.append("Jangan buka penutup sentrifug sehingga rotor berhenti sepenuhnya.")
    elif 'spe' in t_low or 'pengekstrakan' in t_low or 'lle' in t_low:
        tips.append("Jangan biarkan kartrij SPE kering semasa proses pengkondisian dan pemuatan sampel.")
        tips.append("Pastikan pH larutan sampel diselaraskan dengan betul sebelum pemuatan ke kartrij SPE.")
    else:
        tips.append("Patuhi amalan keselamatan makmal yang baik (GLP) dan rekodkan semua langkah persediaan dalam lembaran kerja rasmi.")
        tips.append("Sebarang ketakakuran atau sampel luar spesifikasi hendaklah disiasat mengikut Arahan Kerja PKKK/300/UP/002.")
    return tips

def classify_cat(title):
    t = title.lower()
    if 'hplc' in t or 'rrlc' in t: return 'HPLC / LC'
    if 'gcms' in t or 'gc-ms' in t or ('gc' in t and 'ms' in t): return 'GC-MS'
    if 'lcms' in t or 'lc-ms' in t: return 'LC-MS/MS'
    if 'timbang' in t or 'balance' in t or 'precisa' in t or 'sartorius' in t or 'mettler' in t: return 'Alat Timbang'
    if 'ekstrakan' in t or 'spe' in t or 'lle' in t: return 'Pengekstrakan'
    if 'kosmetik' in t or 'cosmetic' in t: return 'Kosmetik'
    if any(w in t for w in ['radas', 'pencucian', 'vortex', 'waterbath', 'water bath', 'ultrasonic', 'ph meter', 'sentrifug', 'centrifuge', 'pipet', 'mikropipet']): return 'Radas & Penyelenggaraan'
    if any(w in t for w in ['spesifikasi', 'persampelan', 'sisa', 'charting', 'kawalan', 'verifikasi', 'kalibrasi']): return 'Kawalan Kualiti & QA'
    return 'Kaedah Pengujian'

# ─── Comprehensive Mapping of Analysis Methods to Instrument SOPs ───
ANALYSIS_TO_INSTRUMENTS = {
    # HPLC Testing Methods
    '021': [
        ('PKKK/300/UP/011', 'HPLC Shimadzu Prominence-i', 'sop-300-up-011.html'),
        ('PKKK/300/UP/003', 'Agilent 1200 Series RRLC', 'sop-300-up-003.html'),
        ('PKKK/300/UP/041', 'Shimadzu Prominence-i (HPLC 3)', 'sop-300-up-041.html'),
        ('PKKK/300/UP/014', 'Pengekstrakan Cecair-Cecair (LLE pH 7.0)', 'sop-300-up-014.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html'),
        ('PKKK/300/UP/019', 'Water bath Memmert WB 45', 'sop-300-up-019.html'),
        ('PKKK/300/UP/058', 'Ultrasonic Bath Branson 8210', 'sop-300-up-058.html')
    ],
    '022': [
        ('PKKK/300/UP/011', 'HPLC Shimadzu Prominence-i', 'sop-300-up-011.html'),
        ('PKKK/300/UP/003', 'Agilent 1200 Series RRLC', 'sop-300-up-003.html'),
        ('PKKK/300/UP/014', 'Pengekstrakan LLE pH 7.0', 'sop-300-up-014.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html'),
        ('PKKK/300/UP/058', 'Ultrasonic Bath Branson 8210', 'sop-300-up-058.html')
    ],
    '024': [
        ('PKKK/300/UP/011', 'HPLC Shimadzu Prominence-i', 'sop-300-up-011.html'),
        ('PKKK/300/UP/003', 'Agilent 1200 Series RRLC', 'sop-300-up-003.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html'),
        ('PKKK/300/UP/058', 'Ultrasonic Bath Branson 8210', 'sop-300-up-058.html')
    ],
    '025': [
        ('PKKK/300/UP/011', 'HPLC Shimadzu Prominence-i', 'sop-300-up-011.html'),
        ('PKKK/300/UP/003', 'Agilent 1200 Series RRLC', 'sop-300-up-003.html'),
        ('PKKK/300/UP/042', 'Shimadzu Prominence-i (HPLC 4)', 'sop-300-up-042.html'),
        ('PKKK/300/UP/008', 'pH Meter Model FiveEasy Plus', 'sop-300-up-008.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html'),
        ('PKKK/300/UP/058', 'Ultrasonic Bath Branson 8210', 'sop-300-up-058.html')
    ],
    '026': [
        ('PKKK/300/UP/011', 'HPLC Shimadzu Prominence-i', 'sop-300-up-011.html'),
        ('PKKK/300/UP/003', 'Agilent 1200 Series RRLC', 'sop-300-up-003.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html'),
        ('PKKK/300/UP/058', 'Ultrasonic Bath Branson 8210', 'sop-300-up-058.html')
    ],
    '027': [
        ('PKKK/300/UP/011', 'HPLC Shimadzu Prominence-i', 'sop-300-up-011.html'),
        ('PKKK/300/UP/003', 'Agilent 1200 Series RRLC', 'sop-300-up-003.html'),
        ('PKKK/300/UP/042', 'Shimadzu Prominence-i (HPLC 4)', 'sop-300-up-042.html'),
        ('PKKK/300/UP/008', 'pH Meter Model FiveEasy Plus', 'sop-300-up-008.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html'),
        ('PKKK/300/UP/058', 'Ultrasonic Bath Branson 8210', 'sop-300-up-058.html')
    ],
    '028': [
        ('PKKK/300/UP/011', 'HPLC Shimadzu Prominence-i', 'sop-300-up-011.html'),
        ('PKKK/300/UP/003', 'Agilent 1200 Series RRLC', 'sop-300-up-003.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html'),
        ('PKKK/300/UP/058', 'Ultrasonic Bath Branson 8210', 'sop-300-up-058.html')
    ],
    '031': [
        ('PKKK/300/UP/011', 'HPLC Shimadzu Prominence-i', 'sop-300-up-011.html'),
        ('PKKK/300/UP/003', 'Agilent 1200 Series RRLC', 'sop-300-up-003.html'),
        ('PKKK/300/UP/044', 'HPLC Agilent 1', 'sop-300-up-044.html'),
        ('PKKK/300/UP/020', 'Alat Timbang Sartorius MSE 225S (Mikro)', 'sop-300-up-020.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html'),
        ('PKKK/300/UP/058', 'Ultrasonic Bath Branson 8210', 'sop-300-up-058.html')
    ],
    '032': [
        ('PKKK/300/UP/011', 'HPLC Shimadzu Prominence-i', 'sop-300-up-011.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html'),
        ('PKKK/300/UP/058', 'Ultrasonic Bath Branson 8210', 'sop-300-up-058.html')
    ],
    '033': [
        ('PKKK/300/UP/011', 'HPLC Shimadzu Prominence-i', 'sop-300-up-011.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html')
    ],
    '035': [
        ('PKKK/300/UP/011', 'HPLC Shimadzu Prominence-i', 'sop-300-up-011.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html')
    ],
    '050': [
        ('PKKK/300/UP/011', 'HPLC Shimadzu Prominence-i', 'sop-300-up-011.html'),
        ('PKKK/300/UP/003', 'Agilent 1200 Series RRLC', 'sop-300-up-003.html'),
        ('PKKK/300/UP/008', 'pH Meter Model FiveEasy Plus', 'sop-300-up-008.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html'),
        ('PKKK/300/UP/058', 'Ultrasonic Bath Branson 8210', 'sop-300-up-058.html')
    ],
    '051': [
        ('PKKK/300/UP/011', 'HPLC Shimadzu Prominence-i', 'sop-300-up-011.html'),
        ('PKKK/300/UP/008', 'pH Meter Model FiveEasy Plus', 'sop-300-up-008.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html')
    ],
    '052': [
        ('PKKK/300/UP/011', 'HPLC Shimadzu Prominence-i', 'sop-300-up-011.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html')
    ],
    '053': [
        ('PKKK/300/UP/011', 'HPLC Shimadzu Prominence-i', 'sop-300-up-011.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html')
    ],
    '054': [
        ('PKKK/300/UP/011', 'HPLC Shimadzu Prominence-i', 'sop-300-up-011.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html')
    ],
    '055': [
        ('PKKK/300/UP/043', 'HPLC Ion Chromatography Shimadzu LC-20AR', 'sop-300-up-043.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html')
    ],
    '056': [
        ('PKKK/300/UP/011', 'HPLC Shimadzu Prominence-i', 'sop-300-up-011.html'),
        ('PKKK/300/UP/003', 'Agilent 1200 Series RRLC', 'sop-300-up-003.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html'),
        ('PKKK/300/UP/014', 'Pengekstrakan LLE pH 7.0', 'sop-300-up-014.html')
    ],
    '060': [
        ('PKKK/300/UP/011', 'HPLC Shimadzu Prominence-i', 'sop-300-up-011.html'),
        ('PKKK/300/UP/003', 'Agilent 1200 Series RRLC', 'sop-300-up-003.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html')
    ],
    '061': [
        ('PKKK/300/UP/011', 'HPLC Shimadzu Prominence-i', 'sop-300-up-011.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html')
    ],

    # GC-MS Testing Methods
    '018': [
        ('PKKK/300/UP/040', 'GCMS Shimadzu QP2010 Ultra', 'sop-300-up-040.html'),
        ('PKKK/300/UP/017', 'GCMS Agilent 8890 / 5977B', 'sop-300-up-017.html'),
        ('PKKK/300/UP/010', 'GCMS Shimadzu QP2010', 'sop-300-up-010.html'),
        ('PKKK/300/UP/004', 'GCMS Agilent 7890A / 5975C', 'sop-300-up-004.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html')
    ],
    '030': [
        ('PKKK/300/UP/040', 'GCMS Shimadzu QP2010 Ultra', 'sop-300-up-040.html'),
        ('PKKK/300/UP/017', 'GCMS Agilent 8890 / 5977B', 'sop-300-up-017.html'),
        ('PKKK/300/UP/010', 'GCMS Shimadzu QP2010', 'sop-300-up-010.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html')
    ],
    '034': [
        ('PKKK/300/UP/040', 'GCMS Shimadzu QP2010 Ultra (COAST SIM)', 'sop-300-up-040.html'),
        ('PKKK/300/UP/017', 'GCMS Agilent 8890 / 5977B', 'sop-300-up-017.html'),
        ('PKKK/300/UP/010', 'GCMS Shimadzu QP2010', 'sop-300-up-010.html'),
        ('PKKK/300/UP/004', 'GCMS Agilent 7890A / 5975C', 'sop-300-up-004.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html'),
        ('PKKK/300/UP/058', 'Ultrasonic Bath Branson 8210 (5 min)', 'sop-300-up-058.html')
    ],
    '047': [
        ('PKKK/300/UP/040', 'GCMS Shimadzu QP2010 Ultra', 'sop-300-up-040.html'),
        ('PKKK/300/UP/017', 'GCMS Agilent 8890 / 5977B', 'sop-300-up-017.html'),
        ('PKKK/300/UP/010', 'GCMS Shimadzu QP2010', 'sop-300-up-010.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html')
    ],
    '048': [
        ('PKKK/300/UP/040', 'GCMS Shimadzu QP2010 Ultra', 'sop-300-up-040.html'),
        ('PKKK/300/UP/017', 'GCMS Agilent 8890 / 5977B', 'sop-300-up-017.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html')
    ],
    '049': [
        ('PKKK/300/UP/040', 'GCMS Shimadzu QP2010 Ultra', 'sop-300-up-040.html'),
        ('PKKK/300/UP/017', 'GCMS Agilent 8890 / 5977B', 'sop-300-up-017.html'),
        ('PKKK/300/UP/010', 'GCMS Shimadzu QP2010', 'sop-300-up-010.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html')
    ],
    '059': [
        ('PKKK/300/UP/040', 'GCMS Shimadzu QP2010 Ultra', 'sop-300-up-040.html'),
        ('PKKK/300/UP/017', 'GCMS Agilent 8890 / 5977B', 'sop-300-up-017.html'),
        ('PKKK/300/UP/004', 'GCMS Agilent 7890A / 5975C', 'sop-300-up-004.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html')
    ],
    '062': [
        ('PKKK/300/UP/040', 'GCMS Shimadzu QP2010 Ultra', 'sop-300-up-040.html'),
        ('PKKK/300/UP/017', 'GCMS Agilent 8890 / 5977B', 'sop-300-up-017.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html')
    ],

    # LC-MS/MS Testing Methods
    '015': [
        ('PKKK/300/UP/012', 'LCMS-8045 Shimadzu Triple Quad', 'sop-300-up-012.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html'),
        ('PKKK/300/UP/013', 'Pengekstrakan Fasa Pepejal (SPE)', 'sop-300-up-013.html')
    ],
    '023': [
        ('PKKK/300/UP/012', 'LCMS-8045 Shimadzu Triple Quad', 'sop-300-up-012.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html'),
        ('PKKK/300/UP/058', 'Ultrasonic Bath Branson 8210', 'sop-300-up-058.html')
    ],
    '029': [
        ('PKKK/300/UP/012', 'LCMS-8045 Shimadzu Triple Quad (MRM)', 'sop-300-up-012.html'),
        ('PKKK/300/UP/005', 'Alat Timbang Precisa XT 120A', 'sop-300-up-005.html'),
        ('PKKK/300/UP/058', 'Ultrasonic Bath Branson 8210', 'sop-300-up-058.html')
    ],
}

# Reverse Mapping of Instruments to All Active Analysis Methods
INSTRUMENT_TO_ANALYSIS = {
    '011': [('PKKK/300/UP/021', 'Steroid 8-Mix HPLC', 'sop-300-up-021.html'), ('PKKK/300/UP/022', 'Anti Diabetik HPLC', 'sop-300-up-022.html'), ('PKKK/300/UP/024', 'Diuretik HPLC', 'sop-300-up-024.html'), ('PKKK/300/UP/025', 'Proton Pump Inhibitor (PPI) HPLC', 'sop-300-up-025.html'), ('PKKK/300/UP/026', 'Anti-hipertensi HPLC', 'sop-300-up-026.html'), ('PKKK/300/UP/027', 'Domperidone HPLC', 'sop-300-up-027.html'), ('PKKK/300/UP/028', 'Antikolesterol HPLC', 'sop-300-up-028.html'), ('PKKK/300/UP/031', 'Lovastatin HPLC', 'sop-300-up-031.html'), ('PKKK/300/UP/050', 'Hydroquinone in Cosmetics HPLC', 'sop-300-up-050.html'), ('PKKK/300/UP/060', 'NSAIDs in Cosmetics HPLC', 'sop-300-up-060.html')],
    '003': [('PKKK/300/UP/021', 'Steroid 8-Mix HPLC', 'sop-300-up-021.html'), ('PKKK/300/UP/022', 'Anti Diabetik HPLC', 'sop-300-up-022.html'), ('PKKK/300/UP/025', 'Proton Pump Inhibitor (PPI) HPLC', 'sop-300-up-025.html'), ('PKKK/300/UP/027', 'Domperidone HPLC', 'sop-300-up-027.html'), ('PKKK/300/UP/031', 'Lovastatin HPLC', 'sop-300-up-031.html'), ('PKKK/300/UP/056', 'Steroids in Cosmetics ACM 007', 'sop-300-up-056.html')],
    '017': [('PKKK/300/UP/034', 'Diethylene Glycol & Ethylene Glycol in Syrups GCMS', 'sop-300-up-034.html'), ('PKKK/300/UP/018', 'Bahan Kawalan & Terlarang GCMS', 'sop-300-up-018.html'), ('PKKK/300/UP/030', 'Menthol, Camphor & Methyl Salicylate GCMS', 'sop-300-up-030.html'), ('PKKK/300/UP/047', 'Theophylline & Caffeine GCMS', 'sop-300-up-047.html'), ('PKKK/300/UP/048', 'Hydroquinone GCMS', 'sop-300-up-048.html'), ('PKKK/300/UP/049', 'Diethylene Glycol in Toothpaste GCMS', 'sop-300-up-049.html'), ('PKKK/300/UP/059', 'Antimicrobials in Cosmetics GCMS', 'sop-300-up-059.html'), ('PKKK/300/UP/062', 'Volatile Compounds in Cosmetics GCMS', 'sop-300-up-062.html')],
    '010': [('PKKK/300/UP/034', 'Diethylene Glycol & Ethylene Glycol GCMS', 'sop-300-up-034.html'), ('PKKK/300/UP/018', 'Bahan Kawalan GCMS', 'sop-300-up-018.html'), ('PKKK/300/UP/030', 'Menthol & Camphor GCMS', 'sop-300-up-030.html'), ('PKKK/300/UP/047', 'Theophylline & Caffeine GCMS', 'sop-300-up-047.html')],
    '004': [('PKKK/300/UP/034', 'Diethylene Glycol & Ethylene Glycol GCMS', 'sop-300-up-034.html'), ('PKKK/300/UP/018', 'Bahan Kawalan GCMS', 'sop-300-up-018.html'), ('PKKK/300/UP/059', 'Antimicrobials GCMS', 'sop-300-up-059.html')],
    '040': [('PKKK/300/UP/034', 'Diethylene Glycol & Ethylene Glycol GCMS', 'sop-300-up-034.html'), ('PKKK/300/UP/018', 'Bahan Kawalan GCMS', 'sop-300-up-018.html')],
    '012': [('PKKK/300/UP/029', 'PDE-5 Inhibitors in Traditional Products LC-MS/MS', 'sop-300-up-029.html'), ('PKKK/300/UP/023', 'Antifungal in Traditional Products LC-MS', 'sop-300-up-023.html'), ('PKKK/300/UP/015', 'Id EDD in Traditional Products LC-MS', 'sop-300-up-015.html')],
    '041': [('PKKK/300/UP/021', 'Steroid 8-Mix HPLC', 'sop-300-up-021.html'), ('PKKK/300/UP/025', 'Proton Pump Inhibitor (PPI) HPLC', 'sop-300-up-025.html')],
    '042': [('PKKK/300/UP/025', 'Proton Pump Inhibitor (PPI) HPLC', 'sop-300-up-025.html'), ('PKKK/300/UP/027', 'Domperidone HPLC', 'sop-300-up-027.html')],
    '043': [('PKKK/300/UP/055', 'Fluoride in Toothpaste Products Ion Chromatography', 'sop-300-up-055.html')],
    '044': [('PKKK/300/UP/031', 'Lovastatin HPLC', 'sop-300-up-031.html')],
    '045': [('PKKK/300/UP/021', 'Steroid 8-Mix HPLC', 'sop-300-up-021.html')],
    '016': [('PKKK/300/UP/021', 'Steroid 8-Mix HPLC', 'sop-300-up-021.html'), ('PKKK/300/UP/022', 'Anti Diabetik HPLC', 'sop-300-up-022.html')],
    '057': [('PKKK/300/UP/021', 'Steroid 8-Mix HPLC', 'sop-300-up-021.html'), ('PKKK/300/UP/026', 'Anti-hipertensi HPLC', 'sop-300-up-026.html')],
    '005': [('PKKK/300/UP/014', 'Penyediaan Sampel LLE', 'sop-300-up-014.html'), ('PKKK/300/UP/013', 'Penyediaan Sampel SPE', 'sop-300-up-013.html'), ('PKKK/300/UP/031', 'Penimbangan Sampel Lovastatin', 'sop-300-up-031.html'), ('PKKK/300/UP/064', 'Control Charting & Shewhart IQC', 'sop-300-up-064.html')],
    '006': [('PKKK/300/UP/014', 'Penyediaan Sampel LLE', 'sop-300-up-014.html'), ('PKKK/300/UP/013', 'Penyediaan Sampel SPE', 'sop-300-up-013.html'), ('PKKK/300/UP/064', 'Control Charting & Shewhart IQC', 'sop-300-up-064.html')],
    '009': [('PKKK/300/UP/014', 'Penyediaan Sampel LLE', 'sop-300-up-014.html'), ('PKKK/300/UP/064', 'Control Charting & Shewhart IQC', 'sop-300-up-064.html')],
    '020': [('PKKK/300/UP/031', 'Penimbangan Piawai Rujukan Lovastatin (Mikro)', 'sop-300-up-031.html'), ('PKKK/300/UP/064', 'Control Charting & Shewhart IQC', 'sop-300-up-064.html')],
    '038': [('PKKK/300/UP/031', 'Penimbangan Piawai Rujukan Lovastatin', 'sop-300-up-031.html'), ('PKKK/300/UP/064', 'Control Charting & Shewhart IQC', 'sop-300-up-064.html')],
    '046': [('PKKK/300/UP/001', 'Penimbangan Kasar Persampelan', 'sop-300-up-001.html'), ('PKKK/300/UP/064', 'Control Charting & Shewhart IQC', 'sop-300-up-064.html')],
    '008': [('PKKK/300/UP/021', 'Penyelarasan pH 7.0 Fasa Bergerak Steroid', 'sop-300-up-021.html'), ('PKKK/300/UP/025', 'Penyelarasan pH 7.6 Buffer Phosphate PPI', 'sop-300-up-025.html'), ('PKKK/300/UP/027', 'Penyelarasan pH 3.0 Buffer KH2PO4 Domperidone', 'sop-300-up-027.html'), ('PKKK/300/UP/014', 'Penyelarasan pH Pengekstrakan LLE', 'sop-300-up-014.html')],
    '058': [('PKKK/300/UP/034', 'Sonikasi Sampel Sirap EG/DEG (5 minit)', 'sop-300-up-034.html'), ('PKKK/300/UP/021', 'Sonikasi Ekstrak Sampel Steroid (15 minit)', 'sop-300-up-021.html'), ('PKKK/300/UP/025', 'Sonikasi Ekstrak Sampel PPI (15 minit)', 'sop-300-up-025.html'), ('PKKK/300/UP/031', 'Sonikasi Ekstrak Lovastatin (15 minit)', 'sop-300-up-031.html')],
    '036': [('PKKK/300/UP/014', 'Vortexing Sampel Pengekstrakan LLE (1 minit)', 'sop-300-up-014.html'), ('PKKK/300/UP/013', 'Vortexing Sampel SPE', 'sop-300-up-013.html')],
}

# Rich Operational Troubleshooting / Deep Guide Enhancements for Instruments
INSTRUMENT_DEEP_TIPS = {
    '011': [
        "🔑 **Akses Sistem**: User ID: `Admin` (Password: dibiarkan kosong), Passcode Mesin: `00000`.",
        "🔄 **Auto Purge Routine**: Wajib jalankan Auto Purge (5.0 mL/min, 3 min setiap saluran) jika solvent ditambah atau ditukar jenis.",
        "⚡ **Intermediate Flushing**: Jika menukar dari larutan Buffer ke Organik 100%, flush saluran dengan Intermediate (Air Suling 90% : MeOH 10%) dahulu.",
        "📈 **PDA Baseline Monitoring**: Klik ikon `Plot` dan tunggu sekurang-kurangnya 15–30 minit sehingga tekanan stabil (RSD < 2%) sebelum klik `Stop` dan mulakan suntikan.",
        "🧼 **Tatacara Flushing Penutupan**: Buffer → Flush 90:10 Air:MeOH (30 min) → 100% Organik (30 min) → 70:30 Simpanan Kolum (15 min)."
    ],
    '003': [
        "🔑 **Akses Sistem Agilent**: Passcode Agilent ChemStation: `3000hanover`.",
        "🎛️ **Injap Purge Manual**: Pusing lawan arah jam untuk buka → Purge Binary Pump 5.0 mL/min (3 min setiap line) → Turunkan ke 0.1 mL/min → Pusing arah jam untuk tutup injap → Naikkan flow perlahan-lahan.",
        "🌈 **Tetapan DAD**: Spectrum Store: `All`, Range: `190 to 400 nm`, Step: `2.0 nm`.",
        "🔍 **Overlay Signal**: Tekan serentak <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + **Klik pada puncak standard** untuk tindih (overlay) UV spektrum standard dengan sampel.",
        "🧼 **Pencucian**: Fasa gerak 5% Methanol selama 1 jam @ 1.0 mL/min → 100% Acetonitrile/Methanol selama 30 min @ 1.0 mL/min."
    ],
    '017': [
        "🎯 **Tuning Harian MS**: Jalankan `s.tune` (Standard Tune) atau `a.tune` setiap pagi dan simpan laporan penalaan rasmi.",
        "💧 **Air/Water Check**: Pastikan m/z 18 (Air) < 10% dan m/z 28 (N₂) < 5% berbanding m/z 69.",
        "🌡️ **Suhu Antaramuka & Sumber EI**: EI Source 230 °C, Transfer Line / Interface 240 °C, Inlet 250 °C.",
        "⏱️ **Solvent Delay**: Tetapkan Solvent Delay 4.00 min bagi melindungi filamen MS daripada beban pelarut Methanol yang pekat.",
        "📊 **SIM Integration**: Kuantitasi menggunakan Target Ion utama (m/z 31 bagi EG, m/z 45 bagi DEG) dan sahkan dengan Qualifier Ions mengikut Had Toleransi Table 6."
    ],
    '010': [
        "🎯 **Shimadzu GCMS Tuning**: Jalankan Autotune melalui GCMSsolution. Pastikan EM Voltage tidak melebihi paras amaran.",
        "🔍 **Penyelenggaraan Inlet**: Tukar Septum suntikan setiap 100 suntikan bagi mengelakkan kebocoran gas pembawa Helium dan ghost peaks.",
        "🧼 **Bake-Out Kolum**: Lakukan Column Conditioning pada suhu 240–250 °C selama 30 minit jika terdapat peningkatan baseline bleeding."
    ],
    '012': [
        "⚡ **LCMS-8045 Triple Quad**: Tetapkan ESI Interface Voltage +4.0 kV (Positive mode) atau -3.0 kV (Negative mode).",
        "💨 **Gas Desolvation & Nebulizer**: Nebulizing Gas Flow: 3.0 L/min, Drying Gas Flow: 10.0 L/min, Heating Gas Flow: 10.0 L/min.",
        "🎯 **MRM Transitions**: Optimumkan CE (Collision Energy) bagi setiap pecahan ion produk (Product Ion) sasaran."
    ]
}

# ─── SMART SECTION PARSER ───
def parse_into_sections(paras):
    """Parse flat paragraphs into structured sections with smart heading detection.
    Consolidates all revision-type content into a single section and merges duplicates."""
    raw_sections = []
    current_sec = None
    revision_buffer = []
    in_revision = False
    
    for p in paras:
        stripped = p.strip()
        if not stripped:
            continue
        
        # Check if this is a section heading
        is_heading, heading_title, heading_info = is_section_heading(stripped)
        
        if is_heading:
            # Flush any pending revision content
            if revision_buffer and current_sec:
                current_sec['items'].append(('revision_block', revision_buffer[:]))
                revision_buffer = []
                in_revision = False
            
            sec_num, theme, icon, sec_type = heading_info
            
            # If this is a revision heading and we already have a revision section,
            # just keep the current revision section open (merge into it)
            if sec_type == 'revision' and current_sec and current_sec['type'] == 'revision':
                in_revision = True
                continue
            
            # Save previous section
            if current_sec and (current_sec['items'] or current_sec['title']):
                raw_sections.append(current_sec)
            
            current_sec = {
                'title': heading_title,
                'theme': theme,
                'icon': icon,
                'type': sec_type,
                'items': []
            }
            in_revision = (sec_type == 'revision')
            continue
        
        # If no section started yet, create a default one
        if current_sec is None:
            current_sec = {
                'title': 'MAKLUMAT DOKUMEN',
                'theme': 'sec-theme-slate',
                'icon': '📋',
                'type': 'revision',
                'items': []
            }
            in_revision = True
        
        # Check if this is revision content
        if is_revision_content(stripped):
            in_revision = True
            revision_buffer.append(stripped)
            continue
        
        # If we were collecting revision content and hit non-revision, flush
        if in_revision and not is_revision_content(stripped):
            # Check if this is still part of the revision block (short amendment text)
            if revision_buffer and len(stripped) < 200 and not is_procedural_action(stripped):
                revision_buffer.append(stripped)
                continue
            else:
                if revision_buffer:
                    current_sec['items'].append(('revision_block', revision_buffer[:]))
                    revision_buffer = []
                in_revision = False
        
        # Classify the paragraph type
        if re.match(r'^\d+\.\d+(\.\d+)?(\s+|$)', stripped):
            current_sec['items'].append(('numbered_step', stripped))
        elif stripped.startswith(('•', '-', '*')) or re.match(r'^[a-z]\)', stripped) or re.match(r'^\d+\)', stripped):
            current_sec['items'].append(('list_item', stripped))
        elif current_sec['type'] == 'procedure' and is_procedural_action(stripped):
            current_sec['items'].append(('action_step', stripped))
        else:
            current_sec['items'].append(('paragraph', stripped))
    
    # Flush remaining
    if revision_buffer and current_sec:
        current_sec['items'].append(('revision_block', revision_buffer[:]))
    if current_sec:
        raw_sections.append(current_sec)
    
    # ─── POST-PROCESSING: Merge duplicate sections ───
    # 1. Consolidate all revision-type sections into a single one at the top
    # 2. Merge duplicate section types (e.g., two PROSEDUR sections)
    sections = []
    revision_section = None
    seen_types = {}  # title_key -> section index in sections list
    
    for sec in raw_sections:
        if sec['type'] == 'revision':
            # Merge all revision sections into one
            if revision_section is None:
                revision_section = {
                    'title': '0.0 SEJARAH PINDAAN & SEMAKAN',
                    'theme': 'sec-theme-slate',
                    'icon': '📋',
                    'type': 'revision',
                    'items': sec['items'][:]
                }
            else:
                revision_section['items'].extend(sec['items'])
        else:
            # For non-revision sections, check for duplicates
            # Use a key based on the section number prefix (e.g., "6.0")
            title_upper = sec['title'].upper()
            sec_key = None
            for kw in ['TUJUAN', 'SKOP', 'DEFINISI', 'TANGGUNGJAWAB', 'PROSEDUR', 'REKOD KUALITI']:
                if kw in title_upper:
                    sec_key = kw
                    break
            
            if sec_key and sec_key in seen_types:
                # Merge into existing section
                existing_idx = seen_types[sec_key]
                sections[existing_idx]['items'].extend(sec['items'])
            else:
                if sec_key:
                    seen_types[sec_key] = len(sections)
                sections.append(sec)
    
    # Put revision section first if it exists and has content
    final_sections = []
    if revision_section and revision_section['items']:
        final_sections.append(revision_section)
    final_sections.extend(sections)
    
    return final_sections


def format_sop_html(code, title, doc_num_str, rev_str, date_str, paras, tables_data, category):
    full_text = ' '.join(paras)
    analytes = get_target_analytes(title, full_text, category)
    bench_tips = get_bench_tips(category, title)
    
    # Check if this document has cross-linked instruments or analysis methods
    inst_links = ANALYSIS_TO_INSTRUMENTS.get(doc_num_str, [])
    analysis_links = INSTRUMENT_TO_ANALYSIS.get(doc_num_str, [])
    deep_inst_tips = INSTRUMENT_DEEP_TIPS.get(doc_num_str, [])
    
    # Workflow Steps based on category
    if any(k in category for k in ['HPLC', 'GC-MS', 'LC-MS', 'Kosmetik']):
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
    elif 'Pengekstrakan' in category:
        workflow_steps = [
            ("1. Penyediaan", "Sediakan reagen, kartrij & pelarut"),
            ("2. Pengkondisian", "Conditioning kartrij / corong pemisah"),
            ("3. Pemuatan Sampel", "Load sampel & basuh"),
            ("4. Pengelutan", "Elute analit sasaran"),
            ("5. Penyejatan & Rekod", "Evaporasi, reconstitute & dokumentasi")
        ]
    elif 'Radas' in category:
        workflow_steps = [
            ("1. Pemeriksaan", "Semak keadaan alat & keselamatan"),
            ("2. Penghidupan", "Hidupkan suis & tetapkan parameter"),
            ("3. Penggunaan", "Kendalikan alat mengikut SOP"),
            ("4. Penutupan", "Matikan & bersihkan alat"),
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

    # Build Parameters Ribbon / Grid
    params = SOP_PARAMS.get(doc_num_str, {})
    param_chips = []
    if params.get('instrument'):
        param_chips.append(f'<div class="spec-chip"><span class="spec-lbl">Instrumen Utama</span><strong class="spec-val">{html.escape(params["instrument"])}</strong></div>')
    if params.get('column'):
        param_chips.append(f'<div class="spec-chip"><span class="spec-lbl">Turus / Column</span><strong class="spec-val">{html.escape(params["column"])}</strong></div>')
    if params.get('mobile_phase'):
        param_chips.append(f'<div class="spec-chip"><span class="spec-lbl">Fasa Bergerak / Pelarut</span><strong class="spec-val">{html.escape(params["mobile_phase"])}</strong></div>')
    if params.get('flow_rate') or params.get('temp'):
        flow_temp = f'{params.get("flow_rate", "-")} @ {params.get("temp", "-")}'
        param_chips.append(f'<div class="spec-chip"><span class="spec-lbl">Kadar Alir &amp; Suhu</span><strong class="spec-val">{html.escape(flow_temp)}</strong></div>')
    if params.get('wavelength'):
        param_chips.append(f'<div class="spec-chip"><span class="spec-lbl">Pengesan / Gelombang / SIM</span><strong class="spec-val">{html.escape(params["wavelength"])}</strong></div>')
    if params.get('sst_criteria'):
        param_chips.append(f'<div class="spec-chip"><span class="spec-lbl">Kriteria Kesesuaian Sistem (SST)</span><strong class="spec-val">{html.escape(params["sst_criteria"])}</strong></div>')
    if params.get('limits'):
        param_chips.append(f'<div class="spec-chip highlight-limit"><span class="spec-lbl">Had Kawalan Rasmi</span><strong class="spec-val highlight-amber-text">{html.escape(params["limits"])}</strong></div>')

    specs_ribbon_html = ''
    if param_chips:
        specs_ribbon_html = f'''
        <div class="specs-ribbon-card">
          <div class="specs-card-header">
            <span class="specs-icon">⚡</span>
            <strong>Spesifikasi &amp; Parameter Kromatografi / Analitikal (Official Parameters):</strong>
          </div>
          <div class="specs-ribbon-grid">{"".join(param_chips)}</div>
        </div>
        '''

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

    # Cross-Linked Instrument Banner (For Analysis SOPs)
    cross_inst_html = ''
    if inst_links:
        inst_cards = ''.join([
            f'''
            <a href="{link[2]}" class="inst-link-card">
              <div class="inst-code">{link[0]}</div>
              <div class="inst-name">{link[1]}</div>
              <span class="inst-badge">Buka Panduan Alat →</span>
            </a>
            ''' for link in inst_links
        ])
        cross_inst_html = f'''
        <div class="cross-link-container">
          <div class="cross-header">
            <span class="cross-icon">⚙️</span>
            <strong>SOP Pengendalian Alat Yang Digunakan Untuk Ujian Ini:</strong>
          </div>
          <div class="cross-grid">{inst_cards}</div>
        </div>
        '''

    # Cross-Linked Analysis Banner (For Instrument SOPs)
    cross_analysis_html = ''
    if analysis_links:
        ana_cards = ''.join([
            f'''
            <a href="{link[2]}" class="analysis-link-card">
              <div class="ana-code">{link[0]}</div>
              <div class="ana-name">{link[1]}</div>
              <span class="ana-badge">Buka SOP Kaedah →</span>
            </a>
            ''' for link in analysis_links
        ])
        cross_analysis_html = f'''
        <div class="cross-link-container analysis-theme">
          <div class="cross-header">
            <span class="cross-icon">🧪</span>
            <strong>Kaedah-Kaedah Pengujian Aktif Menggunakan Instrumen Ini:</strong>
          </div>
          <div class="cross-grid">{ana_cards}</div>
        </div>
        '''

    # Deep Operating Tips for Instruments
    deep_tips_html = ''
    if deep_inst_tips:
        dt_list = ''.join([f'<li>{t}</li>' for t in deep_inst_tips])
        deep_tips_html = f'''
        <div class="deep-tips-card">
          <div class="tips-header">
            <span class="tips-icon">⚡</span>
            <strong>Panduan Khas Pengendalian &amp; Penyelenggaraan Terperinci (Pro Tips):</strong>
          </div>
          <ul class="tips-list">
            {dt_list}
          </ul>
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

    # ─── SMART SECTION PARSING ───
    sections = parse_into_sections(paras)
    
    # Build tables HTML
    tables_html = ''
    for t_idx, tbl in enumerate(tables_data):
        if not tbl or len(tbl) < 1: continue
        t_rows_html = ''
        
        # Detect if this is a revision history table (all header cells same)
        is_revision_table = False
        if tbl and len(tbl[0]) > 1:
            unique_headers = set(c.strip() for c in tbl[0])
            if len(unique_headers) == 1 and 'SEJARAH SEMAKAN' in unique_headers:
                is_revision_table = True
        
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
                if is_revision_table:
                    # Fix: use proper column headers instead of duplicate "SEJARAH SEMAKAN"
                    t_rows_html += '<tr><th>Terbitan</th><th>Semakan</th><th>Ditulis Oleh</th><th>Disemak Oleh</th><th>Diluluskan Oleh</th><th>Tarikh Kuatkuasa</th></tr>'
                    continue  # Skip the original broken header row
                else:
                    t_rows_html += '<tr>' + ''.join([f'<th>{html.escape(c)}</th>' for c in clean_row]) + '</tr>'
            elif is_revision_table and r_idx == 1:
                # Skip the second row which is the real column names (already replaced above)
                actual_headers = [c.strip() for c in clean_row]
                if 'Terbitan' in actual_headers:
                    continue
                else:
                    t_rows_html += f'<tr {r_class}>' + ''.join([f'<td>{highlight_keywords(c)}</td>' for c in clean_row]) + '</tr>'
            else:
                t_rows_html += f'<tr {r_class}>' + ''.join([f'<td>{highlight_keywords(c)}</td>' for c in clean_row]) + '</tr>'
        
        table_label = 'SEJARAH SEMAKAN' if is_revision_table else f'JADUAL {t_idx + 1}'
        
        tables_html += f'''
        <div class="table-card" id="table-{t_idx + 1}">
          <div class="table-card-header">
            <span class="table-tag">{table_label}</span>
            <span class="table-doc-code">{code}</span>
          </div>
          <div class="table-responsive">
            <table class="table-official">
              {t_rows_html}
            </table>
          </div>
        </div>
        '''

    # ─── RENDER SECTIONS ───
    sections_html = ''
    total_steps = 0
    
    for s_idx, s in enumerate(sections):
        sec_title = html.escape(s['title'])
        sec_id = f'sec-{s_idx + 1}'
        theme_class = s['theme']
        sec_icon = s['icon']
        sec_type = s['type']
        
        body_content = ''
        action_step_counter = 0
        
        for item_type, item_data in s['items']:
            if item_type == 'revision_block':
                # Render as collapsible
                rev_items = item_data
                rev_content = ''.join([f'<p class="sop-rev-p">{html.escape(r)}</p>' for r in rev_items])
                body_content += f'''
                <details class="rev-details">
                  <summary class="rev-summary">
                    <span class="rev-toggle-icon">📋</span>
                    Sejarah Pindaan & Semakan Dokumen ({len(rev_items)} entri)
                    <span class="rev-arrow">▸</span>
                  </summary>
                  <div class="rev-body">{rev_content}</div>
                </details>
                '''
            
            elif item_type == 'numbered_step':
                total_steps += 1
                step_id = f'step-{doc_num_str}-{total_steps}'
                body_content += f'''
                <div class="sop-step-card">
                  <div class="step-card-header">
                    <div class="step-check-wrap">
                      <input type="checkbox" id="{step_id}" class="sop-task-check" onchange="onStepCheckChange('{code}')">
                      <label for="{step_id}" class="sop-step-title">
                        {highlight_keywords(item_data)}
                      </label>
                    </div>
                  </div>
                </div>
                '''
            
            elif item_type == 'action_step':
                total_steps += 1
                action_step_counter += 1
                step_id = f'step-{doc_num_str}-{total_steps}'
                body_content += f'''
                <div class="sop-step-card action-step">
                  <div class="step-card-header">
                    <div class="step-check-wrap">
                      <input type="checkbox" id="{step_id}" class="sop-task-check" onchange="onStepCheckChange('{code}')">
                      <label for="{step_id}" class="sop-step-title">
                        <span class="action-badge">Langkah {action_step_counter}</span>
                        {highlight_keywords(item_data)}
                      </label>
                    </div>
                  </div>
                </div>
                '''
            
            elif item_type == 'list_item':
                body_content += f'''
                <div class="sop-list-item">
                  <span class="sop-bullet">▹</span>
                  <span class="sop-list-text">{highlight_keywords(item_data)}</span>
                </div>
                '''
            
            elif item_type == 'paragraph':
                body_content += f'<p class="sop-p">{highlight_keywords(item_data)}</p>'
        
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
        s_name = s['title'][:35] + ('...' if len(s['title']) > 35 else '')
        pill_class = 'toc-pill'
        if s['type'] == 'procedure':
            pill_class += ' highlight-amber'
        nav_pills_html += f'<a href="#sec-{s_idx + 1}" class="{pill_class}">{html.escape(s_name)}</a>'
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

  /* Sections */
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
    padding: 0.95rem 1.4rem;
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

  .sec-theme-cyan .sop-section-header {{ background: linear-gradient(135deg, #0284c7, #0369a1); }}
  .sec-theme-purple .sop-section-header {{ background: linear-gradient(135deg, #7c3aed, #6d28d9); }}
  .sec-theme-mint .sop-section-header {{ background: linear-gradient(135deg, #059669, #047857); }}
  .sec-theme-amber .sop-section-header {{ background: linear-gradient(135deg, #d97706, #b45309); }}
  .sec-theme-indigo .sop-section-header {{ background: linear-gradient(135deg, #4f46e5, #3730a3); }}
  .sec-theme-rose .sop-section-header {{ background: linear-gradient(135deg, #e11d48, #be123c); }}
  .sec-theme-slate .sop-section-header {{ background: linear-gradient(135deg, #475569, #334155); }}

  .sop-section-body {{ padding: 1.6rem 1.8rem; }}

  /* Step Cards */
  .sop-step-card {{
    background: var(--glass);
    border: 1px solid var(--step-border);
    border-left: 5px solid var(--cyan);
    border-radius: 12px;
    margin-bottom: 1.2rem;
    overflow: hidden;
    transition: all 0.2s ease;
  }}
  .sop-step-card:hover {{
    border-color: var(--cyan);
    border-left-color: var(--purple);
    background: var(--card-hover);
    transform: translateY(-2px);
  }}
  .sop-step-card.action-step {{
    border-left-color: #d97706;
  }}
  .sop-step-card.action-step:hover {{
    border-left-color: #b45309;
  }}
  .step-card-header {{
    padding: 0.85rem 1.2rem;
    background: rgba(2, 132, 199, 0.08);
    border-bottom: 1px solid var(--glass-border);
  }}
  .action-step .step-card-header {{
    background: rgba(217, 119, 6, 0.08);
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
    line-height: 1.6;
  }}
  .step-card-body {{ padding: 1.1rem 1.3rem; }}
  
  /* Action Step Badge */
  .action-badge {{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #d97706, #b45309);
    color: #fff;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 800;
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    margin-right: 0.5rem;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    flex-shrink: 0;
  }}

  /* Typography */
  .sop-p {{ font-size: 0.95rem; line-height: 1.8; color: var(--text-body); margin-bottom: 0.8rem; }}
  .sop-list-item {{
    display: flex; gap: 0.65rem; align-items: flex-start; margin-left: 0.8rem; font-size: 0.93rem;
    line-height: 1.75; color: var(--text-body); margin-bottom: 0.5rem;
  }}
  .sop-bullet {{ color: var(--cyan); font-weight: bold; flex-shrink: 0; }}
  .sop-list-text {{ flex: 1; }}

  /* Revision History Collapsible */
  .rev-details {{
    background: var(--card-surface);
    border: 1px solid var(--card-border-subtle);
    border-radius: 12px;
    margin-bottom: 1.2rem;
    overflow: hidden;
    transition: all 0.2s ease;
  }}
  .rev-summary {{
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 1.2rem;
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--text-muted);
    background: rgba(71, 85, 105, 0.06);
    user-select: none;
    list-style: none;
  }}
  .rev-summary::-webkit-details-marker {{ display: none; }}
  .rev-summary:hover {{ color: var(--text-heading); background: rgba(71, 85, 105, 0.1); }}
  .rev-toggle-icon {{ font-size: 1rem; }}
  .rev-arrow {{
    margin-left: auto;
    transition: transform 0.2s ease;
    font-size: 0.85rem;
  }}
  details[open] .rev-arrow {{ transform: rotate(90deg); }}
  .rev-body {{
    padding: 1rem 1.3rem;
    border-top: 1px solid var(--card-border-subtle);
    max-height: 400px;
    overflow-y: auto;
  }}
  .sop-rev-p {{
    font-size: 0.85rem;
    line-height: 1.65;
    color: var(--text-muted);
    margin-bottom: 0.4rem;
    padding-left: 0.5rem;
    border-left: 2px solid rgba(71, 85, 105, 0.15);
  }}

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

  /* Two-Way Cross Link Grid */
  .cross-link-container {{
    background: linear-gradient(135deg, rgba(2, 132, 199, 0.08), rgba(124, 58, 237, 0.08));
    border: 1px solid var(--cyan); border-radius: 16px; padding: 1.3rem 1.5rem; margin-bottom: 1.8rem;
    box-shadow: var(--shadow-sm);
  }}
  .cross-link-container.analysis-theme {{
    background: linear-gradient(135deg, rgba(5, 150, 105, 0.08), rgba(2, 132, 199, 0.08));
    border-color: var(--mint);
  }}
  .cross-header {{
    display: flex; align-items: center; gap: 0.6rem; font-size: 0.95rem; font-weight: 800;
    color: var(--text-heading); margin-bottom: 1rem;
  }}
  .cross-icon {{ font-size: 1.15rem; }}
  .cross-grid {{
    display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.8rem;
  }}
  .inst-link-card, .analysis-link-card {{
    background: var(--card-surface); border: 1px solid var(--card-border-subtle); border-radius: 12px;
    padding: 0.9rem 1.1rem; text-decoration: none; display: flex; flex-direction: column; gap: 0.3rem;
    transition: all 0.2s ease; box-shadow: var(--shadow-sm);
  }}
  .inst-link-card:hover, .analysis-link-card:hover {{
    border-color: var(--cyan); transform: translateY(-2px); box-shadow: var(--shadow-md);
  }}
  .inst-code, .ana-code {{ font-family: var(--font-mono); font-size: 0.78rem; font-weight: 800; color: var(--cyan); }}
  .inst-name, .ana-name {{ font-size: 0.85rem; font-weight: 700; color: var(--text-heading); line-height: 1.35; }}
  .inst-badge, .ana-badge {{ font-size: 0.72rem; font-weight: 600; color: var(--purple); margin-top: 0.2rem; }}

  /* Deep Tips Card */
  .deep-tips-card {{
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(2, 132, 199, 0.08));
    border: 1px solid var(--purple); border-radius: 14px; padding: 1.3rem 1.5rem; margin-bottom: 1.8rem;
    box-shadow: var(--shadow-sm);
  }}

  /* Parameters Specs Ribbon Card */
  .specs-ribbon-card {{
    background: var(--card-surface);
    border: 1.5px solid var(--cyan);
    border-radius: 16px;
    padding: 1.3rem 1.5rem;
    margin: 1.5rem 0 1.8rem;
    box-shadow: var(--shadow-sm);
    backdrop-filter: blur(12px);
  }}
  .specs-card-header {{
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--text-heading);
    margin-bottom: 1rem;
  }}
  .specs-icon {{ font-size: 1.2rem; }}
  .specs-ribbon-grid {{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 0.85rem;
  }}
  .spec-chip {{
    background: var(--glass);
    border: 1px solid var(--card-border-subtle);
    border-radius: 12px;
    padding: 0.75rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    transition: all 0.2s ease;
  }}
  .spec-chip:hover {{
    border-color: var(--cyan);
    background: var(--card-surface);
    transform: translateY(-2px);
  }}
  .spec-chip.highlight-limit {{
    border-color: rgba(217, 119, 6, 0.4);
    background: var(--amber-dim);
  }}
  .spec-lbl {{
    font-family: var(--font-mono);
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--cyan);
    letter-spacing: 0.05em;
  }}
  .highlight-limit .spec-lbl {{
    color: #d97706;
  }}
  .spec-val {{
    font-size: 0.85rem;
    color: var(--text-heading);
    line-height: 1.4;
  }}
  .highlight-amber-text {{
    color: #d97706;
    font-weight: 800;
  }}

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
  .toc-pill.highlight-amber {{ background: var(--amber-dim); border-color: #d97706; color: #d97706; font-weight: 700; }}

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
    .topbar, .ctrl-btn, .bg-canvas, .grid-overlay, .progress-card, .toc-pills, .bench-tips-card, .wf-track, .cross-link-container, .deep-tips-card, .rev-details {{ display: none !important; }}
    .main {{ max-width: 100% !important; padding: 0 !important; }}
    .sop-doc-container {{ box-shadow: none !important; border: none !important; padding: 0 !important; }}
    body {{ background: #fff !important; color: #000 !important; }}
    .sop-section-header {{ background: #eee !important; color: #000 !important; }}
    .sop-section-header h2 {{ color: #000 !important; }}
    .sop-step-card {{ border-left: 2px solid #000 !important; background: none !important; }}
  }}

  @media (max-width: 768px) {{
    .sop-doc-container {{ padding: 1.2rem; }}
    .sop-section-body {{ padding: 1rem; }}
    .wf-track {{ flex-wrap: wrap; justify-content: center; }}
    .cross-grid {{ grid-template-columns: 1fr; }}
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

  <!-- Chromatographic / Analytical Parameters Specs Ribbon -->
  {specs_ribbon_html}

  <!-- Target Analytes / Quick Chips -->
  {summary_chips_html}

  <!-- Cross-Linked Instruments (For Analysis SOPs) -->
  {cross_inst_html}

  <!-- Cross-Linked Analysis (For Instrument SOPs) -->
  {cross_analysis_html}

  <!-- Deep Operating Tips for Instruments -->
  {deep_tips_html}

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

# ═══════════════════════════════════════════════════════════════
# Generate for all files
# ═══════════════════════════════════════════════════════════════
all_sops = []
file_list = sorted(os.listdir(DOCS_DIR))

for f in file_list:
    if f.startswith('~$'): continue
    
    m = re.search(r'300\s*UP\s*(\d{3})', f, re.IGNORECASE)
    if not m: continue
    
    num_str = m.group(1)
    code = f'PKKK/300/UP/{num_str}'
    slug = f'sop-300-up-{num_str}'
    
    # Skip manually crafted SOPs
    if num_str in SKIP_OVERWRITE:
        print(f'  ⏭️  Skipping {code} (manually crafted, preserved)')
        all_sops.append({
            'code': code,
            'title': '(preserved)',
            'num': num_str,
            'category': 'GC-MS',
            'slug': slug,
            'url': f'sop/{slug}.html'
        })
        continue
    
    path = os.path.join(DOCS_DIR, f)
    title_raw = f.replace('.docx', '').replace('.doc', '').replace('.pdf', '')
    title_clean = re.sub(r'^300\s*UP\s*\d{3}\s*', '', title_raw).strip()
    
    paras = []
    tables = []
    if f.endswith('.docx'):
        paras, tables = parse_docx(path)
    elif f.endswith('.pdf'):
        paras, tables = parse_pdf(path)
    
    # Use the pristine official title from filename
    doc_title = title_clean
    cat = classify_cat(doc_title)
    rev_str = 'Terbitan 3 Semakan 0'
    date_str = '10 April 2026'
    if '034' in num_str:
        date_str = '1 Julai 2026'
        rev_str = 'Terbitan 1 Semakan 2'
    
    html_out = format_sop_html(code, doc_title, num_str, rev_str, date_str, paras, tables, cat)
    
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
    print(f'  ✅ Built {code}: {doc_title[:60]}...' if len(doc_title) > 60 else f'  ✅ Built {code}: {doc_title}')

print(f'\n🎉 Successfully rebuilt {len(all_sops)} crystal-clear, section-parsed SOP guide pages!')
print(f'   (SOP 040 preserved as manually crafted)')
