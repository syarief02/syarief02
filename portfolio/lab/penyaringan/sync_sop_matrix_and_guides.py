import os, sys, re, json

sys.stdout.reconfigure(encoding='utf-8')

# Comprehensive Curated Parameters for Level 300 SOPs
SOP_PARAMS = {
    '001': {
        'instrument': 'Peralatan Persampelan & Neraca',
        'scope': 'Tatacara persampelan rasmi produk tradisional dan kosmetik di makmal penyaringan mengikut garis panduan pensampelan rawak ISO 17025.',
        'forms': ['Borang UP/001A (Sampel Tradisional)', 'Borang UP/001B (Sampel Kosmetik)']
    },
    '002': {
        'instrument': 'Sistem Penyiasatan OOS Makmal',
        'scope': 'Prosedur penyiasatan sampel luar spesifikasi (Out of Specification - OOS) fasa 1 (analyst/lab error) dan fasa 2 (re-testing & confirmation).',
        'forms': ['Borang UP/002A (OOS Tradisional)', 'Borang UP/002B (OOS Kosmetik)', 'Laporan Penyiasatan OOS']
    },
    '003': {
        'instrument': 'Agilent 1200 Series RRLC (Binary Pump, DAD)',
        'column': 'Zorbax SB-C18 / Eclipse Plus C18 (150 × 4.6 mm, 3.5/5 µm)',
        'mobile_phase': 'Pelarut Kromatografi (A: Akueus/Buffer, B: Acetonitrile/Methanol)',
        'flow_rate': '0.1 – 2.0 mL/min (Purge: 5.0 mL/min)',
        'temp': '25 – 60 °C (Oven)',
        'wavelength': '190 – 400 nm (DAD full spectral acquisition)',
        'sst_criteria': 'Deaerasi injap purge manual, baseline drift < 0.5 mAU/hr, pressure ripple < 2.0%.',
        'forms': ['Borang UP/003 (Logbook Agilent 1200)', 'Borang Penyelenggaraan']
    },
    '004': {
        'instrument': 'Agilent GC-MS (7890A GC / 5975C MSD)',
        'column': 'HP-5MS / DB-5MS / BP20 (30 m × 0.25 mm × 0.25 µm)',
        'mobile_phase': 'Helium Gas Pembawa (Ketulenan 99.999% / High Purity 5.0)',
        'flow_rate': '0.8 – 1.2 mL/min (Linear Velocity: 30–40 cm/s)',
        'temp': 'Inlet: 250 °C · Source: 230 °C · Quad: 150 °C',
        'wavelength': 'MS EI 70 eV · Scan m/z 35 – 550 amu',
        'sst_criteria': 'Autotune m/z 69 (100%), m/z 219 (>35%), m/z 502 (>1.0%); Air/Water m/z 18 < 10%, m/z 28 < 5%.',
        'forms': ['Borang UP/004 (Logbook GCMS 7890A)', 'Laporan Autotune']
    },
    '005': {
        'instrument': 'Precisa XT120A (4 Perpuluhan) & XB1200C (Kasar)',
        'scope': 'Penimbangan sampel dan piawai rujukan bagi kaedah pengujian adulteran dan sisa kimia.',
        'sst_criteria': 'Semakan harian batu timbang piawai (UP/014), kepekaan ΔE (UP/015) & kebolehulangan s (UP/016).',
        'forms': ['Borang UP/014 (Harian)', 'Borang UP/015 (Kepekaan)', 'Borang UP/016 (Kebolehulangan)']
    },
    '006': {
        'instrument': 'Sartorius Cubis Microbalance MSU6.6S (6 Perpuluhan)',
        'scope': 'Penimbangan mikro kuantiti rendah (< 10 mg) bagi piawai rujukan ketulenan tinggi.',
        'sst_criteria': 'Semakan harian batu timbang mikro E2/F1 (UP/014) dan carta kawalan mutu.',
        'forms': ['Borang UP/014 (Semakan Harian)', 'Borang UP/015', 'Borang UP/016']
    },
    '007': {
        'instrument': 'Radas Kaca & Plastik Makmal',
        'scope': 'Prosedur mencuci radas kaca volumetrik dan plastik menggunakan detergen neutral Decon 90 dan bilasan air ternyahion.',
        'forms': ['Borang UP/007 (Log Pencucian Radas)']
    },
    '008': {
        'instrument': 'Mettler Toledo FiveEasy Plus pH Meter',
        'scope': 'Pengukuran dan pelarasan nilai pH fasa bergerak dan larutan pengekstrakan (pH 2.0 – 9.0).',
        'sst_criteria': 'Kalibrasi 3-titik (pH 4.01, 7.00, 9.21) dengan slope elektrod 95.0% – 105.0%.',
        'forms': ['Borang UP/008 (Log Kalibrasi pH Meter)']
    },
    '009': {
        'instrument': 'Mettler Toledo ME204T Analytical Balance',
        'scope': 'Penimbangan gravimetrik ketepatan 0.1 mg bagi penyediaan reagen dan sampel makmal.',
        'sst_criteria': 'Semakan harian (Borang UP/014) dengan toleransi ±0.1% nilai nominal.',
        'forms': ['Borang UP/014', 'Borang UP/015', 'Borang UP/016']
    },
    '010': {
        'instrument': 'Shimadzu GCMS QP2010 (GC-2010 / QP2010 MS)',
        'column': 'Rtx-5MS / BPX5 (30 m × 0.25 mm × 0.25 µm)',
        'mobile_phase': 'Helium Gas Pembawa (High Purity 99.999%)',
        'flow_rate': '1.0 mL/min (Column Flow)',
        'temp': 'Inlet: 250 °C · Interface: 250 °C · Ion Source: 200 °C',
        'wavelength': 'MS EI 70 eV · Scan / SIM Modes',
        'sst_criteria': 'GCMSsolution Autotune: EM Voltage stabil, nisbah isotop PFTBA dalam had toleransi.',
        'forms': ['Borang UP/010 (Logbook QP2010)', 'Laporan Autotuning']
    },
    '011': {
        'instrument': 'Shimadzu HPLC Prominence-i (LC-2030C 3D with PDA)',
        'column': 'C18 / Phenyl-Hexyl / C8 (150/250 × 4.6 mm, 2.6/5 µm)',
        'mobile_phase': 'Fasa Bergerak Kecerunan / Isokratik (Saluran A, B, C, D)',
        'flow_rate': '0.2 – 2.0 mL/min (Auto Purge: 5.0 mL/min)',
        'temp': '20 – 60 °C (Column Oven)',
        'wavelength': '190 – 800 nm (PDA multi-channel / 3D plot)',
        'sst_criteria': 'Tekanan stabil (RSD < 2%), garis dasar PDA stabil (drift < 1.0 mAU/hr), %RSD SST ≤ 2.0%.',
        'forms': ['Borang UP/011 (Logbook LC-2030C)', 'Lembaran Kerja Analisis']
    },
    '012': {
        'instrument': 'Shimadzu LCMS-8045 Triple Quadrupole (LC-30AD / ESI)',
        'column': 'Kinetex C18 XB / Shim-pack GIST C18 (100 × 2.1 mm, 2.6 µm)',
        'mobile_phase': 'A: 0.1% Formic Acid dH2O, B: 0.1% Formic Acid Acetonitrile',
        'flow_rate': '0.35 – 0.40 mL/min',
        'temp': '40 – 45 °C · DL Temp: 250 °C · Heat Block: 400 °C',
        'wavelength': 'ESI (+/-) MRM Multiple Reaction Monitoring Transitions',
        'sst_criteria': 'Nebulizing Gas: 3.0 L/min, Drying Gas: 10.0 L/min, Heating Gas: 10.0 L/min, S/N MRM > 10.',
        'forms': ['Borang UP/012 (Logbook LCMS-8045)', 'Laporan MRM Kuantitatif']
    },
    '013': {
        'instrument': 'Sistem Vakum Manifold SPE (Solid-Phase Extraction)',
        'scope': 'Pembersihan dan pemekatan analit daripada matriks kompleks menggunakan kartrij JT Baker C18, Florisil, dan Softgel MeOH.',
        'forms': ['Borang UP/013 (Rekod Pengekstrakan SPE)']
    },
    '014': {
        'instrument': 'Corong Pemisah Kaca (Liquid-Liquid Extraction)',
        'scope': 'Pengekstrakan fasa cecair-cecair pada pH neutral 7.0 menggunakan pelarut Chloroform dan Ethyl Acetate untuk mengasingkan bahan adulteran.',
        'forms': ['Borang UP/014 (Rekod Ekstraksi LLE)']
    },
    '015': {
        'instrument': 'Shimadzu LCMS-8045 Triple Quadrupole',
        'column': 'Kinetex C18 XB (100 × 2.1 mm, 2.6 µm)',
        'mobile_phase': 'A: 0.1% Asid Formik dalam Air : B: 0.1% Asid Formik dalam ACN',
        'flow_rate': '0.35 mL/min',
        'temp': '45 °C',
        'wavelength': 'MRM Transitions bagi Analog EDD (Sildenafil, Tadalafil, Vardenafil)',
        'sst_criteria': 'SST Retention time %RSD ≤ 2.0%, S/N MRM > 10, padanan ion produk (qualifier/quantifier ratio).',
        'forms': ['Borang UP/005', 'Borang UP/012']
    },
    '016': {
        'instrument': 'PerkinElmer Flexar HPLC System (FX-15 / PDA Detector)',
        'column': 'Brownlee SPP C18 (100 × 4.6 mm, 2.7 µm)',
        'mobile_phase': 'Kecerunan Pelarut Organik / Buffer',
        'flow_rate': '0.8 – 1.5 mL/min',
        'temp': '35 °C',
        'wavelength': '190 – 400 nm (PDA Detector)',
        'sst_criteria': 'Chromera software baseline stability, pressure RSD < 2.0%.',
        'forms': ['Borang UP/016 (Logbook Flexar)']
    },
    '017': {
        'instrument': 'Agilent GC-MS System (8890 GC / 5977B MSD)',
        'column': 'HP-5MS UI / BP20 Wax (30 m × 0.25 mm × 0.25 µm)',
        'mobile_phase': 'Helium Gas Pembawa @ 1.0 mL/min (Constant Flow)',
        'flow_rate': 'Linear Velocity: 36 cm/s',
        'temp': 'Inlet: 250 °C · Source: 230 °C · Transfer Line: 280 °C',
        'wavelength': 'EI 70 eV · Scan m/z 40–550 amu / SIM Target Ions',
        'sst_criteria': 'MassHunter Tune: m/z 69 (100%), m/z 219 (>35%), m/z 502 (>1.0%); Air/Water m/z 18 < 10%.',
        'forms': ['Borang UP/017 (Logbook GCMS 8890)', 'Laporan Autotune MassHunter']
    },
    '018': {
        'instrument': 'Agilent / Shimadzu GC-MS Systems',
        'column': 'HP-5MS / DB-5MS (30 m × 0.25 mm × 0.25 µm)',
        'mobile_phase': 'Helium Gas Pembawa (Ketulenan Tinggi)',
        'flow_rate': '1.0 mL/min',
        'temp': 'Oven Program: 100 °C (1 min) → 10 °C/min ke 300 °C (5 min)',
        'wavelength': 'Full Scan EI m/z 40 – 550 amu',
        'sst_criteria': 'Padanan spektrum NIST Library Match Factor > 800, Retention Index (RI) ± 10 unit.',
        'forms': ['Borang UP/005 (Keputusan Ujian)', 'Borang UP/018 (Laporan Carian NIST)']
    },
    '019': {
        'instrument': 'Water bath Memmert WB 45',
        'scope': 'Pemanasan dan penyejatan ekstrak sampel organik secara terkawal pada julat suhu 40 °C – 80 °C.',
        'sst_criteria': 'Paras air di antara penanda MIN-MAX, penggunaan air demineralized sahaja.',
        'forms': ['Borang UP/019 (Log Penggunaan Waterbath)']
    },
    '020': {
        'instrument': 'Sartorius MSE 225S-100-DU Semi-Micro Balance (5 Perpuluhan)',
        'scope': 'Penimbangan tepat piawai rujukan ketulenan tinggi (0.01 mg – 100 mg).',
        'sst_criteria': 'Verifikasi harian batu timbang piawai UP/014, kepekaan UP/015, dan kebolehulangan UP/016.',
        'forms': ['Borang UP/014', 'Borang UP/015', 'Borang UP/016']
    },
    '021': {
        'instrument': 'Shimadzu Prominence-i (LC-2030C 3D PDA)',
        'column': 'Kinetex Phenyl-Hexyl 100Å (150 × 4.6 mm, 2.6 µm)',
        'mobile_phase': 'Kecerunan A: Ultrapure Water : B: Acetonitrile',
        'flow_rate': '0.7 mL/min',
        'temp': '40 °C (Cell: 40 °C)',
        'wavelength': '240 nm (Scan 190–400 nm)',
        'sst_criteria': 'Peak Area %RSD ≤ 2.0% (n=6), Tailing Factor T ≤ 2.0, Resolution Rs > 1.5 antara Dexamethasone & Betamethasone.',
        'forms': ['Borang UP/005 (Borang Ujian)', 'Borang UP/011 (Logbook HPLC)']
    },
    '022': {
        'instrument': 'HPLC Shimadzu Prominence-i / Agilent 1200',
        'column': 'Zorbax Eclipse Plus C18 (150 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Kecerunan Buffer Phosphate pH 3.0 : Acetonitrile',
        'flow_rate': '1.0 mL/min',
        'temp': '40 °C',
        'wavelength': '230 nm (Glibenclamide, Glimepiride, Metformin, Pioglitazone)',
        'sst_criteria': 'SST %RSD ≤ 2.0% bagi 6 suntikan piawai bekerja, padanan spektrum UV > 0.999.',
        'forms': ['Borang UP/005', 'Borang UP/011']
    },
    '023': {
        'instrument': 'Shimadzu LCMS-8045 Triple Quadrupole',
        'column': 'Kinetex C18 XB (100 × 2.1 mm, 2.6 µm)',
        'mobile_phase': 'A: 0.1% Formic Acid dH2O : B: 0.1% Formic Acid ACN',
        'flow_rate': '0.35 mL/min',
        'temp': '40 °C',
        'wavelength': 'MRM Transitions (Fluconazole, Ketoconazole, Itraconazole, Griseofulvin)',
        'sst_criteria': 'Retention time %RSD ≤ 2.0%, S/N MRM > 10, nisbah ion pengesah dalam had toleransi.',
        'forms': ['Borang UP/005', 'Borang UP/012']
    },
    '024': {
        'instrument': 'HPLC Shimadzu Prominence-i / Agilent 1200',
        'column': 'Zorbax SB-C18 (150 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Buffer Asetat pH 4.5 : Acetonitrile (Kecerunan)',
        'flow_rate': '1.0 mL/min',
        'temp': '35 °C',
        'wavelength': '270 nm (Furosemide, Hydrochlorothiazide, Spironolactone)',
        'sst_criteria': 'SST %RSD ≤ 2.0% (n=6), Tailing T ≤ 2.0, Plate Count N ≥ 2000.',
        'forms': ['Borang UP/005', 'Borang UP/011']
    },
    '025': {
        'instrument': 'HPLC Shimadzu Prominence-i LC-2030C 3D',
        'column': 'Zorbax SB-C18 (250 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Isokratik: 65% Buffer Na2HPO4 25 mM pH 7.6 : 35% Acetonitrile',
        'flow_rate': '1.0 mL/min',
        'temp': '30 °C (Sampler: 4 °C)',
        'wavelength': '280 nm (Scan 190–400 nm)',
        'sst_criteria': 'SST %RSD ≤ 2.0% (n=6), Tailing T ≤ 2.0, Theoretical Plates N ≥ 2000, LOD 0.003 mg/mL.',
        'forms': ['Borang UP/005', 'Borang UP/011']
    },
    '026': {
        'instrument': 'HPLC Shimadzu Prominence-i / Agilent 1200',
        'column': 'Zorbax Eclipse XDB-C18 (150 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Buffer Fosfat pH 3.0 : Methanol : Acetonitrile',
        'flow_rate': '1.0 mL/min',
        'temp': '40 °C',
        'wavelength': '238 nm (Amlodipine, Atenolol, Captopril, Losartan, Nifedipine)',
        'sst_criteria': 'SST %RSD ≤ 2.0%, Tailing T ≤ 2.0, resolusi puncak Rs > 1.5.',
        'forms': ['Borang UP/005', 'Borang UP/011']
    },
    '027': {
        'instrument': 'HPLC Shimadzu Prominence-i LC-2030C 3D',
        'column': 'Zorbax Eclipse Plus C18 (150 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Kecerunan: 20 mM KH2PO4 pH 3.0 : Acetonitrile',
        'flow_rate': '1.0 mL/min',
        'temp': '40 °C (Sampler: 4 °C)',
        'wavelength': '284 nm (Scan 190–400 nm)',
        'sst_criteria': 'SST %RSD ≤ 2.0% (n=6), Tailing T ≤ 2.0, Plates N ≥ 2000, LOD 0.003 mg/mL.',
        'forms': ['Borang UP/005', 'Borang UP/011']
    },
    '028': {
        'instrument': 'HPLC Shimadzu Prominence-i / Agilent 1200',
        'column': 'Zorbax Eclipse XDB-C18 (150 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Kecerunan: Buffer Fosfat pH 3.0 : Acetonitrile',
        'flow_rate': '1.0 – 1.5 mL/min',
        'temp': '40 °C',
        'wavelength': '220 nm (Gemfibrozil) & 238 nm (Atorvastatin, Simvastatin, Pravastatin, Rosuvastatin)',
        'sst_criteria': 'SST %RSD ≤ 2.0%, Tailing T ≤ 2.0, padanan spektrum UV > 0.999.',
        'forms': ['Borang UP/005', 'Borang UP/011']
    },
    '029': {
        'instrument': 'Shimadzu LCMS-8045 Triple Quadrupole',
        'column': 'Kinetex C18 XB (100 × 2.1 mm, 2.6 µm)',
        'mobile_phase': 'A: 0.1% Formic Acid dH2O : B: 0.1% Formic Acid ACN',
        'flow_rate': '0.35 mL/min',
        'temp': '45 °C · DL Temp: 250 °C · Heat Block: 400 °C',
        'wavelength': 'MRM Mode ESI(+) bagi Sildenafil, Tadalafil, Vardenafil & Analog',
        'sst_criteria': 'Retention time %RSD ≤ 2.0%, S/N MRM > 10, pengesahan pecahan ion produk.',
        'forms': ['Borang UP/005', 'Borang UP/012']
    },
    '030': {
        'instrument': 'Agilent 8890 / Shimadzu QP2010 GC-MS',
        'column': 'BP-624 (30 m × 0.25 mm × 1.4 µm)',
        'mobile_phase': 'Helium Gas Pembawa (Linear Velocity: 48.5 cm/sec)',
        'flow_rate': '1.70 mL/min (Split 30:1 @ 230 °C)',
        'temp': 'Oven: 60 °C (1 min) → 10 °C/min ke 220 °C (2 min)',
        'wavelength': 'MS EI 70 eV · Scan m/z 35 – 350 amu',
        'sst_criteria': 'SST %RSD ≤ 5.0% bagi Menthol, Camphor, Methyl Salicylate, kalibrasi R² ≥ 0.995.',
        'forms': ['Borang UP/005', 'Borang UP/017']
    },
    '031': {
        'instrument': 'HPLC Shimadzu Prominence-i / Agilent 1200',
        'column': 'Thermo ODS Hypersil (200 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Acetonitrile : 0.05% H3PO4 dalam Air (60:40 v/v)',
        'flow_rate': '1.8 mL/min',
        'temp': '45 °C',
        'wavelength': '238 nm (PDA / UV Detector)',
        'sst_criteria': 'Peak Area %RSD ≤ 2.0% (n=6), Tailing Factor T ≤ 2.0, Kalibrasi R² ≥ 0.9990.',
        'limits': 'NPRA Had: ≤ 1.00% w/w dan ≤ 10.00 mg/hari had dos harian maksimum.',
        'forms': ['Borang UP/008A (Assay)', 'Borang UP/008B', 'Borang UP/008C (SST)', 'Borang UP/008G']
    },
    '032': {
        'instrument': 'HPLC Shimadzu Prominence-i LC-2030C',
        'column': 'Zorbax Eclipse Plus C18 (150 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Isokratik: 0.05 M Buffer KH2PO4 pH 3.0 : Methanol (95:5 v/v)',
        'flow_rate': '0.8 mL/min',
        'temp': '30 °C',
        'wavelength': '280 nm',
        'sst_criteria': 'SST %RSD ≤ 2.0% (n=6), Tailing T ≤ 2.0, Plate Count N ≥ 2000.',
        'forms': ['Borang UP/005', 'Borang UP/011']
    },
    '033': {
        'instrument': 'HPLC Shimadzu Prominence-i LC-2030C',
        'column': 'Phenomenex Luna C18 (150 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Isokratik: Buffer Fosfat pH 3.0 : Methanol : Water (70:20:10)',
        'flow_rate': '1.0 mL/min',
        'temp': '30 °C',
        'wavelength': '254 nm',
        'sst_criteria': 'SST %RSD ≤ 2.0% (n=6), Tailing T ≤ 2.0, Plate Count N ≥ 2000.',
        'forms': ['Borang UP/005', 'Borang UP/011']
    },
    '034': {
        'instrument': 'Shimadzu QP2010 Ultra / Agilent 8890 GC-MS',
        'column': 'BP20 Wax (30 m × 0.25 mm × 0.25 µm)',
        'mobile_phase': 'Helium Gas Pembawa (Linear Velocity: 30.0 cm/sec)',
        'flow_rate': '0.65 mL/min (Split 20:1 @ 250 °C)',
        'temp': 'Oven: 100 °C (1 min) → 10 °C/min ke 130 °C (7 min) → 20 °C/min ke 240 °C (3 min)',
        'wavelength': 'SIM Mode: EG (m/z 31, 33, 62) & DEG (m/z 45, 75, 31)',
        'sst_criteria': 'Peak Area %RSD ≤ 10.0% (n=6), Tailing Tf ≤ 2.5, N ≥ 2000, LOD S/N ≥ 3, LOQ S/N ≥ 10.',
        'limits': 'Had USP / NPRA: Tidak Melebihi 0.10% v/v bagi kedua-dua EG dan DEG.',
        'forms': ['Borang UP/009 (Borang Ujian EG/DEG)', 'Borang UP/040 (Logbook GCMS)']
    },
    '035': {
        'instrument': 'HPLC Shimadzu Prominence-i LC-2030C',
        'column': 'Zorbax SB-C18 (150 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Isokratik: Acetonitrile : 1% Asid Asetik Glacial dalam Air (85:15 v/v)',
        'flow_rate': '1.4 mL/min',
        'temp': '30 °C',
        'wavelength': '353 nm',
        'sst_criteria': 'SST %RSD ≤ 2.0% (n=6), Tailing T ≤ 2.0, Plate Count N ≥ 2000.',
        'forms': ['Borang UP/005', 'Borang UP/011']
    },
    '036': {
        'instrument': 'Vortex-Genie 2 Mixer',
        'scope': 'Pengadunan pantas sampel cecair, pelarutan ekstrak, dan homogenisasi campuran sebelum suntikan kromatografi.',
        'forms': ['Borang UP/036 (Logbook Vortex)']
    },
    '037': {
        'instrument': 'Radas Kaca & Plastik Makmal',
        'scope': 'Verifikasi keberkesanan pembersihan radas kaca melalui ujian konduktiviti air bilasan terakhir dan ujian visual sisa analit.',
        'forms': ['Borang UP/037 (Verifikasi Pembersihan)']
    },
    '038': {
        'instrument': 'Mettler Toledo XP 205 DR Dual Range Analytical Balance',
        'scope': 'Penimbangan analitikal berketepatan tinggi (0.01 mg – 220 g).',
        'sst_criteria': 'Verifikasi harian UP/014, kepekaan UP/015, dan kebolehulangan UP/016.',
        'forms': ['Borang UP/014', 'Borang UP/015', 'Borang UP/016']
    },
    '039': {
        'instrument': 'Pusat Pengurusan Sisa Kimia SPPK',
        'scope': 'Pengasingan, penyimpanan sementara, pelabelan mengikut kod sisa DOE, dan pelupusan sisa pelarut organik/akueus berjadual.',
        'forms': ['Borang UP/039 (Inventori Pelupusan Sisa Kimia)']
    },
    '040': {
        'instrument': 'Shimadzu GCMS QP2010 Ultra (GC-2010 Plus / QP2010 Ultra MSD)',
        'column': 'BP20 Wax / Rtx-5MS (30 m × 0.25 mm × 0.25 µm)',
        'mobile_phase': 'Helium Gas Pembawa (High Purity 99.999%)',
        'flow_rate': 'Linear Velocity: 30–45 cm/s (Advanced Flow Controller)',
        'temp': 'Inlet: 250 °C · Ion Source: 230 °C · Interface: 240 °C',
        'wavelength': 'EI 70 eV · COAST SIM Automatic Wizard / Full Scan',
        'sst_criteria': 'Autotune m/z 69 (100%), m/z 219 (>35%), m/z 502 (>1.0%), Air/Water m/z 18 < 10%, m/z 28 < 5%.',
        'forms': ['Borang UP/040 (Logbook QP2010 Ultra)', 'Laporan Autotuning']
    },
    '041': {
        'instrument': 'Shimadzu HPLC Prominence-i LC-2030C 3D (HPLC 3)',
        'column': 'C18 / Phenyl-Hexyl / C8 (150/250 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Kecerunan 4 Saluran (A, B, C, D)',
        'flow_rate': '0.5 – 2.0 mL/min (Auto Purge: 5.0 mL/min)',
        'temp': '25 – 60 °C (Column Oven)',
        'wavelength': '190 – 800 nm (PDA Detector)',
        'sst_criteria': 'Passcode: 00000, Auto Purge rutin, kestabilan tekanan (RSD < 2%).',
        'forms': ['Borang UP/041 (Logbook HPLC 3)']
    },
    '042': {
        'instrument': 'Shimadzu HPLC Prominence-i LC-2030C 3D (HPLC 4)',
        'column': 'Zorbax SB-C18 / Eclipse Plus C18 (150/250 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Isokratik / Kecerunan',
        'flow_rate': '0.5 – 2.0 mL/min',
        'temp': '25 – 60 °C',
        'wavelength': '190 – 800 nm (PDA Detector)',
        'sst_criteria': 'Passcode: 00000, Auto Purge rutin, kestabilan tekanan (RSD < 2%).',
        'forms': ['Borang UP/042 (Logbook HPLC 4)']
    },
    '043': {
        'instrument': 'Shimadzu Ion Chromatography System (LC-20AR / CDD-10Avp)',
        'column': 'Shim-pack IC-A3 (150 × 4.6 mm, 5 µm)',
        'mobile_phase': '8 mmol/L p-Hydroxybenzoic Acid + 3.2 mmol/L Bis-Tris + 50 mmol/L Boric Acid',
        'flow_rate': '1.0 mL/min',
        'temp': '40 °C',
        'wavelength': 'Pengesan Konduktiviti Ion (CDD-10Avp, 300–400 µS/cm)',
        'sst_criteria': 'SST Peak Area %RSD ≤ 2.0% bagi 6 suntikan piawai Fluoride RS, R² ≥ 0.9990.',
        'forms': ['Borang UP/043 (Logbook IC Shimadzu)', 'Borang UP/055']
    },
    '044': {
        'instrument': 'Agilent 1260 Infinity HPLC System (HPLC Agilent 1)',
        'column': 'Thermo ODS Hypersil / Zorbax C18 (150/200 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Acetonitrile : 0.05% H3PO4 (60:40 v/v)',
        'flow_rate': '1.8 mL/min',
        'temp': '45 °C',
        'wavelength': '238 nm (VWD / DAD Detector)',
        'sst_criteria': 'OpenLab ChemStation Passcode: 3000hanover, %RSD SST ≤ 2.0%.',
        'forms': ['Borang UP/044 (Logbook Agilent 1)']
    },
    '045': {
        'instrument': 'Shimadzu Modular HPLC Series (LC-20AT Pump / SPD-M20A PDA)',
        'column': 'C18 Analytical Column (150/250 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Binary Gradient Solvent Delivery',
        'flow_rate': '1.0 mL/min',
        'temp': '35 °C',
        'wavelength': '190 – 400 nm (SPD-M20A PDA)',
        'sst_criteria': 'Manual purge per saluran, tekanan stabil, baseline drift < 1.0 mAU/hr.',
        'forms': ['Borang UP/045 (Logbook LC-20AT)']
    },
    '046': {
        'instrument': 'Precisa XB 320M Top Pan Balance',
        'scope': 'Penimbangan kasar bagi penyediaan sampel pukal, sampel herba kisar, dan reagen pelarut.',
        'sst_criteria': 'Semakan harian batu timbang M1/F2 (UP/014).',
        'forms': ['Borang UP/014']
    },
    '047': {
        'instrument': 'Agilent / Shimadzu GC-MS Systems',
        'column': 'HP-5MS / Rtx-5MS (30 m × 0.25 mm × 0.25 µm)',
        'mobile_phase': 'Helium Gas Pembawa @ 1.0 mL/min',
        'flow_rate': 'Split 20:1 @ 250 °C',
        'temp': 'Oven: 80 °C (1 min) → 15 °C/min ke 280 °C (5 min)',
        'wavelength': 'EI 70 eV · Scan m/z 40 – 450 amu',
        'sst_criteria': 'Padanan spektrum Theophylline (m/z 180, 95) & Caffeine (m/z 194, 109) > 800.',
        'forms': ['Borang UP/005', 'Borang UP/017']
    },
    '048': {
        'instrument': 'Agilent 8890 GC-MS System',
        'column': 'HP-5MS UI (30 m × 0.25 mm × 0.25 µm)',
        'mobile_phase': 'Helium Gas Pembawa @ 1.0 mL/min',
        'flow_rate': 'Split 10:1 @ 250 °C',
        'temp': 'Oven: 70 °C (1 min) → 12 °C/min ke 250 °C (4 min)',
        'wavelength': 'MS EI 70 eV · Scan / SIM m/z 110, 81, 53',
        'sst_criteria': 'RT match ±2%, ion ratio match had toleransi Table 6.',
        'forms': ['Borang UP/005', 'Borang UP/017']
    },
    '049': {
        'instrument': 'Agilent 8890 / Shimadzu QP2010 GC-MS',
        'column': 'BP20 Wax (30 m × 0.25 mm × 0.25 µm)',
        'mobile_phase': 'Helium Gas Pembawa (Linear Velocity: 35 cm/s)',
        'flow_rate': '0.8 mL/min (Split 20:1 @ 240 °C)',
        'temp': 'Oven: 100 °C (1 min) → 10 °C/min ke 140 °C (5 min) → 20 °C/min ke 240 °C',
        'wavelength': 'SIM Mode: m/z 45, 75, 31 (DEG) & m/z 31, 62 (EG)',
        'sst_criteria': 'Peak Area %RSD ≤ 10.0%, had DEG dalam ubat gigi ≤ 0.10% w/w.',
        'forms': ['Borang UP/005', 'Borang UP/017']
    },
    '050': {
        'instrument': 'HPLC Shimadzu Prominence-i / Agilent 1200',
        'column': 'Cosmosil 5 C18 AR-II (250 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Isokratik: 0.05 M Buffer Fosfat pH 2.5 : Methanol (99:1 v/v)',
        'flow_rate': '0.9 mL/min',
        'temp': '30 °C',
        'wavelength': '280 nm (UV / PDA Detector)',
        'sst_criteria': 'SST Peak Area %RSD ≤ 2.0% (n=6), Tailing T ≤ 2.0, Plate Count N ≥ 2000, LOD 0.0005 mg/mL.',
        'limits': 'Racun Berjadual: Bahan Dilarang Mutlak dalam Kosmetik (0.00% w/w).',
        'forms': ['Borang UP/005', 'Borang UP/011']
    },
    '051': {
        'instrument': 'HPLC Shimadzu Prominence-i LC-2030C',
        'column': 'Cosmosil 5 C18 AR-II (250 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Isokratik: 0.05 M Buffer Fosfat pH 2.5 : Methanol (99:1 v/v)',
        'flow_rate': '0.9 mL/min',
        'temp': '30 °C',
        'wavelength': '280 nm',
        'sst_criteria': 'SST %RSD ≤ 2.0% (n=6), Kalibrasi R² ≥ 0.9990.',
        'forms': ['Borang UP/005', 'Borang UP/011']
    },
    '052': {
        'instrument': 'HPLC Shimadzu Prominence-i LC-2030C',
        'column': 'Zorbax SB-C18 (150 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Buffer Fosfat pH 3.0 : Acetonitrile (55:45 v/v)',
        'flow_rate': '1.0 mL/min',
        'temp': '30 °C',
        'wavelength': '210 nm',
        'sst_criteria': 'SST %RSD ≤ 2.0% (n=6), Tailing T ≤ 2.0, Plates N ≥ 2000.',
        'forms': ['Borang UP/005', 'Borang UP/011']
    },
    '053': {
        'instrument': 'HPLC Shimadzu Prominence-i LC-2030C',
        'column': 'Zorbax SB-C18 (150 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Acetonitrile : 1% Glacial Acetic Acid (85:15 v/v)',
        'flow_rate': '1.2 mL/min',
        'temp': '30 °C',
        'wavelength': '353 nm',
        'sst_criteria': 'SST %RSD ≤ 2.0% (n=6), Kalibrasi R² ≥ 0.9990.',
        'forms': ['Borang UP/005', 'Borang UP/011']
    },
    '054': {
        'instrument': 'HPLC Shimadzu Prominence-i LC-2030C',
        'column': 'Zorbax Eclipse Plus C18 (150 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Kecerunan: Water : Acetonitrile (dengan 0.1% Asid Asetik)',
        'flow_rate': '1.0 mL/min',
        'temp': '35 °C',
        'wavelength': '254 nm (Methyl, Ethyl, Propyl, Butylparaben)',
        'sst_criteria': 'Resolusi Rs > 1.5 antara semua puncak paraben, %RSD ≤ 2.0%.',
        'forms': ['Borang UP/005', 'Borang UP/011']
    },
    '055': {
        'instrument': 'Shimadzu Ion Chromatography System (LC-20AR / CDD-10Avp)',
        'column': 'Shim-pack IC-A3 (150 × 4.6 mm, 5 µm)',
        'mobile_phase': '8 mmol/L p-Hydroxybenzoic Acid + 3.2 mmol/L Bis-Tris + 50 mmol/L Boric Acid',
        'flow_rate': '1.0 mL/min',
        'temp': '40 °C',
        'wavelength': 'Konduktiviti Ion (CDD-10Avp)',
        'sst_criteria': 'SST %RSD ≤ 2.0% bagi Fluoride RS, kalibrasi R² ≥ 0.9990.',
        'forms': ['Borang UP/043', 'Borang UP/055']
    },
    '056': {
        'instrument': 'HPLC Shimadzu Prominence-i / Agilent 1200',
        'column': 'Kinetex Phenyl-Hexyl (150 × 4.6 mm, 2.6 µm)',
        'mobile_phase': 'Kecerunan: Ultrapure Water : Acetonitrile (ACM 007)',
        'flow_rate': '0.7 mL/min',
        'temp': '40 °C',
        'wavelength': '240 nm (PDA Detector)',
        'sst_criteria': 'Pematuhan standard ASEAN Cosmetic Method (ACM 007), resolusi Rs > 1.5.',
        'forms': ['Borang UP/005', 'Borang UP/011']
    },
    '057': {
        'instrument': 'PerkinElmer Flexar HPLC System',
        'column': 'Brownlee SPP C18 (100 × 4.6 mm, 2.7 µm)',
        'mobile_phase': 'Kecerunan Pelarut Organik / Buffer',
        'flow_rate': '1.0 mL/min',
        'temp': '35 °C',
        'wavelength': '190 – 400 nm (PDA Detector)',
        'sst_criteria': 'Kestabilan tekanan dan kelancaran pam Flexar FX-15.',
        'forms': ['Borang UP/057 (Logbook Flexar)']
    },
    '058': {
        'instrument': 'Ultrasonic Bath Branson 8210',
        'scope': 'Penyahgasan fasa bergerak kromatografi (degassing 15–20 min) dan pengekstrakan sonikasi matriks sampel (10–15 min).',
        'sst_criteria': 'Paras air mencukupi pada tangki keluli, suhu tidak melebihi had keselamatan.',
        'forms': ['Borang UP/058 (Logbook Branson 8210)']
    },
    '059': {
        'instrument': 'Agilent 8890 / 7890A GC-MS Systems',
        'column': 'HP-5MS UI (30 m × 0.25 mm × 0.25 µm)',
        'mobile_phase': 'Helium Gas Pembawa @ 1.0 mL/min',
        'flow_rate': 'Split 20:1 @ 250 °C',
        'temp': 'Oven Ramp: 80 °C (1 min) → 12 °C/min ke 280 °C (5 min)',
        'wavelength': 'EI 70 eV · Scan m/z 40 – 500 amu',
        'sst_criteria': 'Padanan spektrum antimikrobial (Triclosan, Phenoxyethanol, Chlorphenesin) > 800.',
        'forms': ['Borang UP/005', 'Borang UP/017']
    },
    '060': {
        'instrument': 'HPLC Shimadzu Prominence-i / Agilent 1200',
        'column': 'Zorbax Eclipse Plus C18 (150 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Kecerunan: Buffer Fosfat pH 3.0 : Acetonitrile',
        'flow_rate': '1.0 mL/min',
        'temp': '40 °C',
        'wavelength': '230 nm (Diclofenac, Ibuprofen, Indomethacin, Mefenamic Acid, Piroxicam)',
        'sst_criteria': 'Resolusi Rs > 1.5 antara semua analit NSAID, SST %RSD ≤ 2.0%.',
        'forms': ['Borang UP/005', 'Borang UP/011']
    },
    '061': {
        'instrument': 'HPLC Shimadzu Prominence-i LC-2030C',
        'column': 'Discovery RP Amide C16 (250 × 4.6 mm, 5 µm)',
        'mobile_phase': 'Isokratik: Phosphate Buffer : Acetonitrile (90:10 v/v)',
        'flow_rate': '1.0 mL/min',
        'temp': '25 °C',
        'wavelength': '280 nm (p-Phenylenediamine PPD dalam Pewarna Rambut)',
        'sst_criteria': 'SST %RSD ≤ 2.0% (n=6), Kalibrasi R² ≥ 0.9990.',
        'forms': ['Borang UP/005', 'Borang UP/011']
    },
    '062': {
        'instrument': 'Agilent 8890 GC-MS System',
        'column': 'HP-INNOWax / BP20 (30 m × 0.25 mm × 0.25 µm)',
        'mobile_phase': 'Helium Gas Pembawa @ 1.0 mL/min',
        'flow_rate': 'Split 30:1 @ 240 °C',
        'temp': 'Oven: 50 °C (2 min) → 8 °C/min ke 200 °C (5 min)',
        'wavelength': 'EI 70 eV · Scan m/z 35 – 350 amu',
        'sst_criteria': 'Kuantitasi kompaun volatil (Ethanol, Isopropanol, Methanol) dengan R² ≥ 0.9950.',
        'forms': ['Borang UP/005', 'Borang UP/017']
    },
    '063': {
        'instrument': 'Waterbath Memmert WNB 14',
        'scope': 'Pemanasan dan inkubasi sampel cecair pada suhu malar (30 °C – 95 °C) bagi ujian kestabilan dan reaksi pelarutan.',
        'sst_criteria': 'Paras air demineralized di antara tanda aras keselamatan.',
        'forms': ['Borang UP/063 (Logbook Memmert WNB 14)']
    },
    '064': {
        'instrument': 'Sistem Kawalan Kualiti Statistik & Carta Kawalan Shewhart',
        'scope': 'Pemplotan carta kawalan Shewhart IQC bagi verifikasi harian neraca analitikal, semakan drift instrumen, dan trend data ujian kuantitatif.',
        'sst_criteria': 'Amaran Tindakan: 1 titik di luar had ±3s (UCL/LCL), atau 2 daripada 3 titik berturutan di luar had ±2s (UWL/LWL).',
        'forms': ['Borang UP/014 (Data Harian)', 'Borang UP/064 (Carta Shewhart IQC)']
    }
}

# 1. Update sop_data.js
with open('sop_data.js', 'r', encoding='utf-8') as f:
    sop_content = f.read()

# Load SOP_DATA
data_match = re.search(r'const\s+SOP_DATA\s*=\s*(\{[\s\S]*\});?', sop_content)
if data_match:
    sop_data_json = json.loads(data_match.group(1))
    
    # Enrich ak300
    for item in sop_data_json.get('ak300', []):
        num = item.get('no', '').zfill(3)
        code_match = re.search(r'UP/(\d{3})', item.get('code', ''))
        if code_match:
            num = code_match.group(1)
        
        params = SOP_PARAMS.get(num, {})
        for k, v in params.items():
            item[k] = v
            
    with open('sop_data.js', 'w', encoding='utf-8') as f:
        f.write('const SOP_DATA = ' + json.dumps(sop_data_json, indent=2, ensure_ascii=False) + ';\n')
    print('✅ Synchronized and enriched sop_data.js with complete Level 300 parameters!')
else:
    print('❌ Failed to parse SOP_DATA from sop_data.js')

