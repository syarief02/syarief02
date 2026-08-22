const SOP_DATA = {
  "sop200": [
    {
      "code": "PKKK/200/UP/001",
      "title": "Screening for Identification of Hydroquinone in Cosmetic Cream Products by using HPLC Technique",
      "effective_date": "10 April 2026",
      "status": "Terbitan 2 Semakan 2",
      "category": "Kosmetik / HPLC",
      "scope": "Screening for identification of Hydroquinone in cosmetic cream products received from Surveillance, Complaint, Pharmacy Enforcement, etc.",
      "instrument": "HPLC with PDA detector",
      "column": "C18 (Cosmosil 5 C18 AR-II), 250 mm x 4.6 mm i.d., 5 µm",
      "mobile_phase": "0.05M Phosphate buffer solution pH 2.5 : Methanol (99:1 v/v)",
      "flow_rate": "0.9 mL/min",
      "temp": "30 °C",
      "wavelength": "280 nm",
      "retention_approx": "Hydroquinone ~ 5.5 - 6.5 min",
      "sst_criteria": "Peak identification by comparison with Hydroquinone Reference Standard (RT within ±2% and UV spectrum match).",
      "forms": [
        "UP/001B (Sampling)",
        "UP/X009 (Tatacara Pengujian HPLC)",
        "UP/X013 (Keputusan Ujian Kosmetik)",
        "UP/002B (OOS Kosmetik)"
      ],
      "prev_code": "PKKK/200/KOS/001"
    },
    {
      "code": "PKKK/200/UP/002",
      "title": "Determination of Lovastatin in Traditional Products by using High Performance Liquid Chromatography (HPLC)",
      "effective_date": "17 Ogos 2026",
      "status": "Terbitan 3 Semakan 1",
      "category": "Tradisional / HPLC",
      "scope": "Identification and quantitative assay of Lovastatin in traditional products (capsules, tablets, liquids).",
      "instrument": "HPLC with PDA / UV detector",
      "column": "Thermo ODS Hypersil, 200 x 4.6 mm, 5 µm",
      "mobile_phase": "Acetonitrile : 0.05% Orthophosphoric Acid (H3PO4) in Water (60:40 v/v)",
      "flow_rate": "1.8 mL/min",
      "temp": "45 °C",
      "wavelength": "238 nm",
      "retention_approx": "Lovastatin ~ 3.5 - 4.5 min (Run time: 6 min)",
      "sst_criteria": "Tailing factor T < 2; Peak area precision of 6 replicate working standard (20 µg/mL) injections: RSD ≤ 2.0%; Calibration r² ≥ 0.999.",
      "limits": "NPRA Limit: ≤ 1.00% w/w AND ≤ 10.00 mg/day total daily dose; LOD = 0.6 µg/mL (300 mg/kg).",
      "forms": [
        "UP/001A",
        "UP/008A (PKKK/UP/006A) ID & Assay",
        "UP/008B Berat Purata",
        "UP/008C SST",
        "UP/008D IQC Spiked",
        "UP/008E Limit Test",
        "UP/008F IQC Historical",
        "UP/008G Calibration Curve",
        "UP/002A (OOS)"
      ],
      "prev_code": "PKKK/200/UAT/006"
    }
  ],
  "ak300": [
    {
      "no": "1",
      "code": "PKKK/300/UP/001",
      "title": "Proses Persampelan (Ujian Penyaringan)",
      "status": "Terbitan 1  Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen baru",
      "category": "Kualiti & Prosedur Makmal",
      "instrument": "Peralatan Persampelan & Neraca",
      "scope": "Tatacara persampelan rasmi produk tradisional dan kosmetik di makmal penyaringan mengikut garis panduan pensampelan rawak ISO 17025.",
      "forms": [
        "Borang UP/001A (Sampel Tradisional)",
        "Borang UP/001B (Sampel Kosmetik)"
      ]
    },
    {
      "no": "2",
      "code": "PKKK/300/UP/002",
      "title": "Prosedur \tPenyiasatan \tSampel \tLuar  Spesifikasi (OOS) Ujian Penyaringan",
      "status": "Terbitan 1,  Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen baru",
      "category": "Ekstraksi / Sample Prep",
      "instrument": "Sistem Penyiasatan OOS Makmal",
      "scope": "Prosedur penyiasatan sampel luar spesifikasi (Out of Specification - OOS) fasa 1 (analyst/lab error) dan fasa 2 (re-testing & confirmation).",
      "forms": [
        "Borang UP/002A (OOS Tradisional)",
        "Borang UP/002B (OOS Kosmetik)",
        "Laporan Penyiasatan OOS"
      ]
    },
    {
      "no": "3",
      "code": "PKKK/300/UP/003",
      "title": "Rapid Resolution Liquid Chromatography HP 1200",
      "status": "Terbitan 3, Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Makmal F04",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/004",
      "category": "General",
      "instrument": "Agilent 1200 Series RRLC (Binary Pump, DAD)",
      "column": "Zorbax SB-C18 / Eclipse Plus C18 (150 × 4.6 mm, 3.5/5 µm)",
      "mobile_phase": "Pelarut Kromatografi (A: Akueus/Buffer, B: Acetonitrile/Methanol)",
      "flow_rate": "0.1 – 2.0 mL/min (Purge: 5.0 mL/min)",
      "temp": "25 – 60 °C (Oven)",
      "wavelength": "190 – 400 nm (DAD full spectral acquisition)",
      "sst_criteria": "Deaerasi injap purge manual, baseline drift < 0.5 mAU/hr, pressure ripple < 2.0%.",
      "forms": [
        "Borang UP/003 (Logbook Agilent 1200)",
        "Borang Penyelenggaraan"
      ]
    },
    {
      "no": "4",
      "code": "PKKK/300/UP/004",
      "title": "Gas Chromatography-Mass Spectroscopy Agilent (7890A/5975C)",
      "status": "Terbitan 4,  Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Makmal F04",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/005",
      "category": "Ekstraksi / Sample Prep",
      "instrument": "Agilent GC-MS (7890A GC / 5975C MSD)",
      "column": "HP-5MS / DB-5MS / BP20 (30 m × 0.25 mm × 0.25 µm)",
      "mobile_phase": "Helium Gas Pembawa (Ketulenan 99.999% / High Purity 5.0)",
      "flow_rate": "0.8 – 1.2 mL/min (Linear Velocity: 30–40 cm/s)",
      "temp": "Inlet: 250 °C · Source: 230 °C · Quad: 150 °C",
      "wavelength": "MS EI 70 eV · Scan m/z 35 – 550 amu",
      "sst_criteria": "Autotune m/z 69 (100%), m/z 219 (>35%), m/z 502 (>1.0%); Air/Water m/z 18 < 10%, m/z 28 < 5%.",
      "forms": [
        "Borang UP/004 (Logbook GCMS 7890A)",
        "Laporan Autotune"
      ]
    },
    {
      "no": "5",
      "code": "PKKK/300/UP/005",
      "title": "Alat Timbang Precisa XT120A and XB1200C",
      "status": "Terbitan 4,  Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Makmal F04",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/006",
      "category": "Alat Timbang",
      "instrument": "Precisa XT120A (4 Perpuluhan) & XB1200C (Kasar)",
      "scope": "Penimbangan sampel dan piawai rujukan bagi kaedah pengujian adulteran dan sisa kimia.",
      "sst_criteria": "Semakan harian batu timbang piawai (UP/014), kepekaan ΔE (UP/015) & kebolehulangan s (UP/016).",
      "forms": [
        "Borang UP/014 (Harian)",
        "Borang UP/015 (Kepekaan)",
        "Borang UP/016 (Kebolehulangan)"
      ]
    },
    {
      "no": "6",
      "code": "PKKK/300/UP/006",
      "title": "Alat Timbang Sartorius Cubis Microbalance MSU6.6S",
      "status": "Terbitan 4,  Semakan 1",
      "effective_date": "1 Julai 2026",
      "location": "Makmal  F04",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/007",
      "category": "Alat Timbang",
      "instrument": "Sartorius Cubis Microbalance MSU6.6S (6 Perpuluhan)",
      "scope": "Penimbangan mikro kuantiti rendah (< 10 mg) bagi piawai rujukan ketulenan tinggi.",
      "sst_criteria": "Semakan harian batu timbang mikro E2/F1 (UP/014) dan carta kawalan mutu.",
      "forms": [
        "Borang UP/014 (Semakan Harian)",
        "Borang UP/015",
        "Borang UP/016"
      ]
    },
    {
      "no": "7",
      "code": "PKKK/300/UP/007",
      "title": "Pencucian Radas Kaca dan Plastik",
      "status": "Terbitan 4,  Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Bilik Cuci F04",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/008",
      "category": "Kualiti & Prosedur Makmal",
      "instrument": "Radas Kaca & Plastik Makmal",
      "scope": "Prosedur mencuci radas kaca volumetrik dan plastik menggunakan detergen neutral Decon 90 dan bilasan air ternyahion.",
      "forms": [
        "Borang UP/007 (Log Pencucian Radas)"
      ]
    },
    {
      "no": "8",
      "code": "PKKK/300/UP/008",
      "title": "pH Meter Model FiveEasy Plus",
      "status": "Terbitan 4,  Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Makmal F04",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/009",
      "category": "Peralatan Am",
      "instrument": "Mettler Toledo FiveEasy Plus pH Meter",
      "scope": "Pengukuran dan pelarasan nilai pH fasa bergerak dan larutan pengekstrakan (pH 2.0 – 9.0).",
      "sst_criteria": "Kalibrasi 3-titik (pH 4.01, 7.00, 9.21) dengan slope elektrod 95.0% – 105.0%.",
      "forms": [
        "Borang UP/008 (Log Kalibrasi pH Meter)"
      ]
    },
    {
      "no": "9",
      "code": "PKKK/300/UP/009",
      "title": "Alat Timbang Metler Toledo ME204T LCMS",
      "status": "Terbitan 4,  Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Makmal F04",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/010",
      "category": "LCMS",
      "instrument": "Mettler Toledo ME204T Analytical Balance",
      "scope": "Penimbangan gravimetrik ketepatan 0.1 mg bagi penyediaan reagen dan sampel makmal.",
      "sst_criteria": "Semakan harian (Borang UP/014) dengan toleransi ±0.1% nilai nominal.",
      "forms": [
        "Borang UP/014",
        "Borang UP/015",
        "Borang UP/016"
      ]
    },
    {
      "no": "10",
      "code": "PKKK/300/UP/010",
      "title": "Gas Chromatography Mass Spectrometer Shimadzu (QP2010 Ultra)",
      "status": "Terbitan 4,  Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Makmal H02",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/011",
      "category": "Ekstraksi / Sample Prep",
      "instrument": "Shimadzu GCMS QP2010 (GC-2010 / QP2010 MS)",
      "column": "Rtx-5MS / BPX5 (30 m × 0.25 mm × 0.25 µm)",
      "mobile_phase": "Helium Gas Pembawa (High Purity 99.999%)",
      "flow_rate": "1.0 mL/min (Column Flow)",
      "temp": "Inlet: 250 °C · Interface: 250 °C · Ion Source: 200 °C",
      "wavelength": "MS EI 70 eV · Scan / SIM Modes",
      "sst_criteria": "GCMSsolution Autotune: EM Voltage stabil, nisbah isotop PFTBA dalam had toleransi.",
      "forms": [
        "Borang UP/010 (Logbook QP2010)",
        "Laporan Autotuning"
      ]
    },
    {
      "no": "11",
      "code": "PKKK/300/UP/011",
      "title": "Shimadzu \tHigh \tPerformance \tLiquid  Chromatography (Prominence-i)",
      "status": "Terbitan 4,  Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Makmal F04",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/012",
      "category": "HPLC",
      "instrument": "Shimadzu HPLC Prominence-i (LC-2030C 3D with PDA)",
      "column": "C18 / Phenyl-Hexyl / C8 (150/250 × 4.6 mm, 2.6/5 µm)",
      "mobile_phase": "Fasa Bergerak Kecerunan / Isokratik (Saluran A, B, C, D)",
      "flow_rate": "0.2 – 2.0 mL/min (Auto Purge: 5.0 mL/min)",
      "temp": "20 – 60 °C (Column Oven)",
      "wavelength": "190 – 800 nm (PDA multi-channel / 3D plot)",
      "sst_criteria": "Tekanan stabil (RSD < 2%), garis dasar PDA stabil (drift < 1.0 mAU/hr), %RSD SST ≤ 2.0%.",
      "forms": [
        "Borang UP/011 (Logbook LC-2030C)",
        "Lembaran Kerja Analisis"
      ]
    },
    {
      "no": "12",
      "code": "PKKK/300/UP/012",
      "title": "Shimadzu \tHigh \tPerformance Liquid Chromatography Mass Spectrometer LCMS-8045",
      "status": "Terbitan4,  Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Makmal H02",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/013",
      "category": "LCMS",
      "instrument": "Shimadzu LCMS-8045 Triple Quadrupole (LC-30AD / ESI)",
      "column": "Kinetex C18 XB / Shim-pack GIST C18 (100 × 2.1 mm, 2.6 µm)",
      "mobile_phase": "A: 0.1% Formic Acid dH2O, B: 0.1% Formic Acid Acetonitrile",
      "flow_rate": "0.35 – 0.40 mL/min",
      "temp": "40 – 45 °C · DL Temp: 250 °C · Heat Block: 400 °C",
      "wavelength": "ESI (+/-) MRM Multiple Reaction Monitoring Transitions",
      "sst_criteria": "Nebulizing Gas: 3.0 L/min, Drying Gas: 10.0 L/min, Heating Gas: 10.0 L/min, S/N MRM > 10.",
      "forms": [
        "Borang UP/012 (Logbook LCMS-8045)",
        "Laporan MRM Kuantitatif"
      ]
    },
    {
      "no": "13",
      "code": "PKKK/300/UP/013",
      "title": "Pengekstrakan Fasa Pepejal Bagi Produk Tradisional, Suplemen Kesihatan dan Kosmetik",
      "status": "Terbitan 5  Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/014",
      "category": "Ekstraksi / Sample Prep",
      "instrument": "Sistem Vakum Manifold SPE (Solid-Phase Extraction)",
      "scope": "Pembersihan dan pemekatan analit daripada matriks kompleks menggunakan kartrij JT Baker C18, Florisil, dan Softgel MeOH.",
      "forms": [
        "Borang UP/013 (Rekod Pengekstrakan SPE)"
      ]
    },
    {
      "no": "14",
      "code": "PKKK/300/UP/014",
      "title": "Pengekstrakan Fasa Cecair Bagi Produk Tradisional, Suplemen Kesihatan dan Kosmetik",
      "status": "Terbitan 5,  Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/015",
      "category": "Ekstraksi / Sample Prep",
      "instrument": "Corong Pemisah Kaca (Liquid-Liquid Extraction)",
      "scope": "Pengekstrakan fasa cecair-cecair pada pH neutral 7.0 menggunakan pelarut Chloroform dan Ethyl Acetate untuk mengasingkan bahan adulteran.",
      "forms": [
        "Borang UP/014 (Rekod Ekstraksi LLE)"
      ]
    },
    {
      "no": "15",
      "code": "PKKK/300/UP/015",
      "title": "Identifikasi Sildenafil, Vardenafil & Tadalafil dalam Produk Tradisional dengan menggunakan High Performance Liquid Chromatography (HPLC)   (Identification of Sildenafil, Vardenafil & Tadalafil in Traditional Products by using HPLC)",
      "status": "Terbitan 5,  Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/016",
      "category": "HPLC",
      "instrument": "Shimadzu LCMS-8045 Triple Quadrupole",
      "column": "Kinetex C18 XB (100 × 2.1 mm, 2.6 µm)",
      "mobile_phase": "A: 0.1% Asid Formik dalam Air : B: 0.1% Asid Formik dalam ACN",
      "flow_rate": "0.35 mL/min",
      "temp": "45 °C",
      "wavelength": "MRM Transitions bagi Analog EDD (Sildenafil, Tadalafil, Vardenafil)",
      "sst_criteria": "SST Retention time %RSD ≤ 2.0%, S/N MRM > 10, padanan ion produk (qualifier/quantifier ratio).",
      "forms": [
        "Borang UP/005",
        "Borang UP/012"
      ]
    },
    {
      "no": "16",
      "code": "PKKK/300/UP/016",
      "title": "High Performance Liquid Chromatography Flexar (Perkin Elmer)",
      "status": "Terbitan 3, Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Makmal F04",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/017",
      "category": "HPLC",
      "instrument": "PerkinElmer Flexar HPLC System (FX-15 / PDA Detector)",
      "column": "Brownlee SPP C18 (100 × 4.6 mm, 2.7 µm)",
      "mobile_phase": "Kecerunan Pelarut Organik / Buffer",
      "flow_rate": "0.8 – 1.5 mL/min",
      "temp": "35 °C",
      "wavelength": "190 – 400 nm (PDA Detector)",
      "sst_criteria": "Chromera software baseline stability, pressure RSD < 2.0%.",
      "forms": [
        "Borang UP/016 (Logbook Flexar)"
      ]
    },
    {
      "no": "17",
      "code": "PKKK/300/UP/017",
      "title": "Gas Chromatography Mass Spectroscopy Agilent (8890/5977B)",
      "status": "Terbitan 3, Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Makmal  F04",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/018",
      "category": "Ekstraksi / Sample Prep",
      "instrument": "Agilent GC-MS System (8890 GC / 5977B MSD)",
      "column": "HP-5MS UI / BP20 Wax (30 m × 0.25 mm × 0.25 µm)",
      "mobile_phase": "Helium Gas Pembawa @ 1.0 mL/min (Constant Flow)",
      "flow_rate": "Linear Velocity: 36 cm/s",
      "temp": "Inlet: 250 °C · Source: 230 °C · Transfer Line: 280 °C",
      "wavelength": "EI 70 eV · Scan m/z 40–550 amu / SIM Target Ions",
      "sst_criteria": "MassHunter Tune: m/z 69 (100%), m/z 219 (>35%), m/z 502 (>1.0%); Air/Water m/z 18 < 10%.",
      "forms": [
        "Borang UP/017 (Logbook GCMS 8890)",
        "Laporan Autotune MassHunter"
      ]
    },
    {
      "no": "18",
      "code": "PKKK/300/UP/018",
      "title": "Pengesanan Bahan Kawalan dan Terlarang dalam Produk Tradisional menggunakan GCMS (Detection of Controlled and Prohibited Compound in Traditional Products using GCMS)",
      "status": "Terbitan 3, Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/020",
      "category": "GCMS",
      "instrument": "Agilent / Shimadzu GC-MS Systems",
      "column": "HP-5MS / DB-5MS (30 m × 0.25 mm × 0.25 µm)",
      "mobile_phase": "Helium Gas Pembawa (Ketulenan Tinggi)",
      "flow_rate": "1.0 mL/min",
      "temp": "Oven Program: 100 °C (1 min) → 10 °C/min ke 300 °C (5 min)",
      "wavelength": "Full Scan EI m/z 40 – 550 amu",
      "sst_criteria": "Padanan spektrum NIST Library Match Factor > 800, Retention Index (RI) ± 10 unit.",
      "forms": [
        "Borang UP/005 (Keputusan Ujian)",
        "Borang UP/018 (Laporan Carian NIST)"
      ]
    },
    {
      "no": "19",
      "code": "PKK/300/UP/019",
      "title": "Water Bath Memmert WB 45",
      "status": "Terbitan 2, Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Makmal F04",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/022",
      "category": "Peralatan Am",
      "instrument": "Water bath Memmert WB 45",
      "scope": "Pemanasan dan penyejatan ekstrak sampel organik secara terkawal pada julat suhu 40 °C – 80 °C.",
      "sst_criteria": "Paras air di antara penanda MIN-MAX, penggunaan air demineralized sahaja.",
      "forms": [
        "Borang UP/019 (Log Penggunaan Waterbath)"
      ]
    },
    {
      "no": "20",
      "code": "PKKK/300/UP/020",
      "title": "Alat Timbang Sartorius MSE 225S-100-DU",
      "status": "Terbitan 1 Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Alat Timbang",
      "remarks": "Dokumen baru",
      "category": "Alat Timbang",
      "instrument": "Sartorius MSE 225S-100-DU Semi-Micro Balance (5 Perpuluhan)",
      "scope": "Penimbangan tepat piawai rujukan ketulenan tinggi (0.01 mg – 100 mg).",
      "sst_criteria": "Verifikasi harian batu timbang piawai UP/014, kepekaan UP/015, dan kebolehulangan UP/016.",
      "forms": [
        "Borang UP/014",
        "Borang UP/015",
        "Borang UP/016"
      ]
    },
    {
      "no": "21",
      "code": "PKKK/300/UP/021",
      "title": "Identifikasi Steroid dalam Produk Tradisional menggunakan HPLC  (Identification of Steroids in Traditional Products using HPLC)",
      "status": "Terbitan 2 Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/047",
      "category": "HPLC",
      "instrument": "Shimadzu Prominence-i (LC-2030C 3D PDA)",
      "column": "Kinetex Phenyl-Hexyl 100Å (150 × 4.6 mm, 2.6 µm)",
      "mobile_phase": "Kecerunan A: Ultrapure Water : B: Acetonitrile",
      "flow_rate": "0.7 mL/min",
      "temp": "40 °C (Cell: 40 °C)",
      "wavelength": "240 nm (Scan 190–400 nm)",
      "sst_criteria": "Peak Area %RSD ≤ 2.0% (n=6), Tailing Factor T ≤ 2.0, Resolution Rs > 1.5 antara Dexamethasone & Betamethasone.",
      "forms": [
        "Borang UP/005 (Borang Ujian)",
        "Borang UP/011 (Logbook HPLC)"
      ]
    },
    {
      "no": "22",
      "code": "PKKK/300/UP/022",
      "title": "Identifikasi Anti-diabetik dalam Produk Tradisional menggunakan HPLC (Identification of Anti-diabetics in Traditional Products using HPLC)",
      "status": "Terbitan 2 Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/048",
      "category": "HPLC",
      "instrument": "HPLC Shimadzu Prominence-i / Agilent 1200",
      "column": "Zorbax Eclipse Plus C18 (150 × 4.6 mm, 5 µm)",
      "mobile_phase": "Kecerunan Buffer Phosphate pH 3.0 : Acetonitrile",
      "flow_rate": "1.0 mL/min",
      "temp": "40 °C",
      "wavelength": "230 nm (Glibenclamide, Glimepiride, Metformin, Pioglitazone)",
      "sst_criteria": "SST %RSD ≤ 2.0% bagi 6 suntikan piawai bekerja, padanan spektrum UV > 0.999.",
      "forms": [
        "Borang UP/005",
        "Borang UP/011"
      ]
    },
    {
      "no": "23",
      "code": "PKKK/300/UP/023",
      "title": "Identifikasi Antifungal dalam produk tradisional menggunakan LC/MS-MS (Identification of Anti-fungal in Traditional Product using LC/MS-MS)",
      "status": "Terbitan 2 Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/049",
      "category": "LCMS",
      "instrument": "Shimadzu LCMS-8045 Triple Quadrupole",
      "column": "Kinetex C18 XB (100 × 2.1 mm, 2.6 µm)",
      "mobile_phase": "A: 0.1% Formic Acid dH2O : B: 0.1% Formic Acid ACN",
      "flow_rate": "0.35 mL/min",
      "temp": "40 °C",
      "wavelength": "MRM Transitions (Fluconazole, Ketoconazole, Itraconazole, Griseofulvin)",
      "sst_criteria": "Retention time %RSD ≤ 2.0%, S/N MRM > 10, nisbah ion pengesah dalam had toleransi.",
      "forms": [
        "Borang UP/005",
        "Borang UP/012"
      ]
    },
    {
      "no": "24",
      "code": "PKKK/300/UP/024",
      "title": "Identifikasi Diuretik dalam Produk Tradisional menggunakan HPLC (Identification of Diuretics in Traditional Products using HPLC)",
      "status": "Terbitan 2 Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/050",
      "category": "HPLC",
      "instrument": "HPLC Shimadzu Prominence-i / Agilent 1200",
      "column": "Zorbax SB-C18 (150 × 4.6 mm, 5 µm)",
      "mobile_phase": "Buffer Asetat pH 4.5 : Acetonitrile (Kecerunan)",
      "flow_rate": "1.0 mL/min",
      "temp": "35 °C",
      "wavelength": "270 nm (Furosemide, Hydrochlorothiazide, Spironolactone)",
      "sst_criteria": "SST %RSD ≤ 2.0% (n=6), Tailing T ≤ 2.0, Plate Count N ≥ 2000.",
      "forms": [
        "Borang UP/005",
        "Borang UP/011"
      ]
    },
    {
      "no": "25",
      "code": "PKKK/300/UP/025",
      "title": "Identifikasi Proton Pump Inhibitor (Omeprazole & Lansoprazole) dalam produk tradisional menggunakan HPLC (Identification of Proton Pump Inhibitor (Omeprazole and Lansoprazole) in Traditional Products using HPLC)",
      "status": "Terbitan 2 Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/051",
      "category": "HPLC",
      "instrument": "HPLC Shimadzu Prominence-i LC-2030C 3D",
      "column": "Zorbax SB-C18 (250 × 4.6 mm, 5 µm)",
      "mobile_phase": "Isokratik: 65% Buffer Na2HPO4 25 mM pH 7.6 : 35% Acetonitrile",
      "flow_rate": "1.0 mL/min",
      "temp": "30 °C (Sampler: 4 °C)",
      "wavelength": "280 nm (Scan 190–400 nm)",
      "sst_criteria": "SST %RSD ≤ 2.0% (n=6), Tailing T ≤ 2.0, Theoretical Plates N ≥ 2000, LOD 0.003 mg/mL.",
      "forms": [
        "Borang UP/005",
        "Borang UP/011"
      ]
    },
    {
      "no": "26",
      "code": "PKKK/300/UP/026",
      "title": "Identifikasi Anti-hypertensi dalam Produk Tradisional menggunakan HPLC (Identification of Anti-Hypertensives in Traditional Products using HPLC)",
      "status": "Terbitan 2 Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/052",
      "category": "HPLC",
      "instrument": "HPLC Shimadzu Prominence-i / Agilent 1200",
      "column": "Zorbax Eclipse XDB-C18 (150 × 4.6 mm, 5 µm)",
      "mobile_phase": "Buffer Fosfat pH 3.0 : Methanol : Acetonitrile",
      "flow_rate": "1.0 mL/min",
      "temp": "40 °C",
      "wavelength": "238 nm (Amlodipine, Atenolol, Captopril, Losartan, Nifedipine)",
      "sst_criteria": "SST %RSD ≤ 2.0%, Tailing T ≤ 2.0, resolusi puncak Rs > 1.5.",
      "forms": [
        "Borang UP/005",
        "Borang UP/011"
      ]
    },
    {
      "no": "27",
      "code": "PKKK/300/UP/027",
      "title": "Identifikasi Domperidone dalam Produk Tradisional menggunakan HPLC (Identification of Domperidone in Traditional Products using HPLC)",
      "status": "Terbitan 2 Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/053",
      "category": "HPLC",
      "instrument": "HPLC Shimadzu Prominence-i LC-2030C 3D",
      "column": "Zorbax Eclipse Plus C18 (150 × 4.6 mm, 5 µm)",
      "mobile_phase": "Kecerunan: 20 mM KH2PO4 pH 3.0 : Acetonitrile",
      "flow_rate": "1.0 mL/min",
      "temp": "40 °C (Sampler: 4 °C)",
      "wavelength": "284 nm (Scan 190–400 nm)",
      "sst_criteria": "SST %RSD ≤ 2.0% (n=6), Tailing T ≤ 2.0, Plates N ≥ 2000, LOD 0.003 mg/mL.",
      "forms": [
        "Borang UP/005",
        "Borang UP/011"
      ]
    },
    {
      "no": "28",
      "code": "PKKK/300/UP/028",
      "title": "Identifikasi Antikolesterol dalam Produk Tradisional menggunakan HPLC (Identification of Anticholesterol in Traditional Products using HPLC)",
      "status": "Terbitan 2 Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/054",
      "category": "HPLC",
      "instrument": "HPLC Shimadzu Prominence-i / Agilent 1200",
      "column": "Zorbax Eclipse XDB-C18 (150 × 4.6 mm, 5 µm)",
      "mobile_phase": "Kecerunan: Buffer Fosfat pH 3.0 : Acetonitrile",
      "flow_rate": "1.0 – 1.5 mL/min",
      "temp": "40 °C",
      "wavelength": "220 nm (Gemfibrozil) & 238 nm (Atorvastatin, Simvastatin, Pravastatin, Rosuvastatin)",
      "sst_criteria": "SST %RSD ≤ 2.0%, Tailing T ≤ 2.0, padanan spektrum UV > 0.999.",
      "forms": [
        "Borang UP/005",
        "Borang UP/011"
      ]
    },
    {
      "no": "29",
      "code": "PKKK/300/UP/029",
      "title": "Identifikasi Phosphodiesterase-5 Inhibitors (PDE-5) dalam Produk Tradisional menggunakan LC/MS-MS (Identification of Phosphodiesterase-5 Inhibitors in Traditional Products using LC/MS-MS)",
      "status": "Terbitan 2 Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/055",
      "category": "LCMS",
      "instrument": "Shimadzu LCMS-8045 Triple Quadrupole",
      "column": "Kinetex C18 XB (100 × 2.1 mm, 2.6 µm)",
      "mobile_phase": "A: 0.1% Formic Acid dH2O : B: 0.1% Formic Acid ACN",
      "flow_rate": "0.35 mL/min",
      "temp": "45 °C · DL Temp: 250 °C · Heat Block: 400 °C",
      "wavelength": "MRM Mode ESI(+) bagi Sildenafil, Tadalafil, Vardenafil & Analog",
      "sst_criteria": "Retention time %RSD ≤ 2.0%, S/N MRM > 10, pengesahan pecahan ion produk.",
      "forms": [
        "Borang UP/005",
        "Borang UP/012"
      ]
    },
    {
      "no": "30",
      "code": "PKKK/300/UP/030",
      "title": "Identifikasi dan Kandungan Menthol, Camphor, Methyl Salicylate dan Thymol dalam Produk Tradisional menggunakan GCMS                                                              (Identification and Assay of Menthol, Camphor, Methyl Salicylate and Thymol in Traditional Product using GCMS)",
      "status": "Terbitan 2 Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/056",
      "category": "GCMS",
      "instrument": "Agilent 8890 / Shimadzu QP2010 GC-MS",
      "column": "BP-624 (30 m × 0.25 mm × 1.4 µm)",
      "mobile_phase": "Helium Gas Pembawa (Linear Velocity: 48.5 cm/sec)",
      "flow_rate": "1.70 mL/min (Split 30:1 @ 230 °C)",
      "temp": "Oven: 60 °C (1 min) → 10 °C/min ke 220 °C (2 min)",
      "wavelength": "MS EI 70 eV · Scan m/z 35 – 350 amu",
      "sst_criteria": "SST %RSD ≤ 5.0% bagi Menthol, Camphor, Methyl Salicylate, kalibrasi R² ≥ 0.995.",
      "forms": [
        "Borang UP/005",
        "Borang UP/017"
      ]
    },
    {
      "no": "31",
      "code": "PKKK/300/UP/031",
      "title": "Penentuan Lovastatin dalam Produk Tradisional dengan menggunakan HPLC (Determination of Lovastatin in Traditional Products by using High Performance Liquid Chromatography (HPLC)",
      "status": "Terbitan 2 Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/057",
      "category": "HPLC",
      "instrument": "HPLC Shimadzu Prominence-i / Agilent 1200",
      "column": "Thermo ODS Hypersil (200 × 4.6 mm, 5 µm)",
      "mobile_phase": "Acetonitrile : 0.05% H3PO4 dalam Air (60:40 v/v)",
      "flow_rate": "1.8 mL/min",
      "temp": "45 °C",
      "wavelength": "238 nm (PDA / UV Detector)",
      "sst_criteria": "Peak Area %RSD ≤ 2.0% (n=6), Tailing Factor T ≤ 2.0, Kalibrasi R² ≥ 0.9990.",
      "limits": "NPRA Had: ≤ 1.00% w/w dan ≤ 10.00 mg/hari had dos harian maksimum.",
      "forms": [
        "Borang UP/008A (Assay)",
        "Borang UP/008B",
        "Borang UP/008C (SST)",
        "Borang UP/008G"
      ]
    },
    {
      "no": "32",
      "code": "PKKK/300/UP/032",
      "title": "Identifikasi Dopamine dalam Produk Tradisional menggunakan HPLC (Identification of Dopamine in Traditional Products using HPLC",
      "status": "Terbitan 1 Semakan 1",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/058",
      "category": "HPLC",
      "instrument": "HPLC Shimadzu Prominence-i LC-2030C",
      "column": "Zorbax Eclipse Plus C18 (150 × 4.6 mm, 5 µm)",
      "mobile_phase": "Isokratik: 0.05 M Buffer KH2PO4 pH 3.0 : Methanol (95:5 v/v)",
      "flow_rate": "0.8 mL/min",
      "temp": "30 °C",
      "wavelength": "280 nm",
      "sst_criteria": "SST %RSD ≤ 2.0% (n=6), Tailing T ≤ 2.0, Plate Count N ≥ 2000.",
      "forms": [
        "Borang UP/005",
        "Borang UP/011"
      ]
    },
    {
      "no": "33",
      "code": "PKKK/300/UP/033",
      "title": "Identifikasi Minoxidil dalam Produk Tradisional menggunakan HPLC (Identification of Minoxidil in Traditional Products using HPLC)",
      "status": "Terbitan 1 Semakan 1",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/059",
      "category": "HPLC",
      "instrument": "HPLC Shimadzu Prominence-i LC-2030C",
      "column": "Phenomenex Luna C18 (150 × 4.6 mm, 5 µm)",
      "mobile_phase": "Isokratik: Buffer Fosfat pH 3.0 : Methanol : Water (70:20:10)",
      "flow_rate": "1.0 mL/min",
      "temp": "30 °C",
      "wavelength": "254 nm",
      "sst_criteria": "SST %RSD ≤ 2.0% (n=6), Tailing T ≤ 2.0, Plate Count N ≥ 2000.",
      "forms": [
        "Borang UP/005",
        "Borang UP/011"
      ]
    },
    {
      "no": "34",
      "code": "PKKK/300/UP/034",
      "title": "Identifikasi dan Kandungan Diethylene Glycol dan Ethylene Glycol dalam Ubat Cecair menggunakan GCMS (Identification and Assay of Diethylene Glycol and Ethylene Glycol in Medicinal syrups using GCMS)",
      "status": "Terbitan 1 Semakan 2",
      "effective_date": "1 Julai 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/060",
      "category": "GCMS",
      "instrument": "Shimadzu QP2010 Ultra / Agilent 8890 GC-MS",
      "column": "BP20 Wax (30 m × 0.25 mm × 0.25 µm)",
      "mobile_phase": "Helium Gas Pembawa (Linear Velocity: 30.0 cm/sec)",
      "flow_rate": "0.65 mL/min (Split 20:1 @ 250 °C)",
      "temp": "Oven: 100 °C (1 min) → 10 °C/min ke 130 °C (7 min) → 20 °C/min ke 240 °C (3 min)",
      "wavelength": "SIM Mode: EG (m/z 31, 33, 62) & DEG (m/z 45, 75, 31)",
      "sst_criteria": "Peak Area %RSD ≤ 10.0% (n=6), Tailing Tf ≤ 2.5, N ≥ 2000, LOD S/N ≥ 3, LOQ S/N ≥ 10.",
      "limits": "Had USP / NPRA: Tidak Melebihi 0.10% v/v bagi kedua-dua EG dan DEG.",
      "forms": [
        "Borang UP/009 (Borang Ujian EG/DEG)",
        "Borang UP/040 (Logbook GCMS)"
      ]
    },
    {
      "no": "35",
      "code": "PKKK/300/UP/035",
      "title": "Identifikasi Tretinoin dalam Produk Tradisional menggunakan HPLC  (Identification of Tretinoin in Traditional Products using HPLC)",
      "status": "Terbitan 1 Semakan 1",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/061",
      "category": "HPLC",
      "instrument": "HPLC Shimadzu Prominence-i LC-2030C",
      "column": "Zorbax SB-C18 (150 × 4.6 mm, 5 µm)",
      "mobile_phase": "Isokratik: Acetonitrile : 1% Asid Asetik Glacial dalam Air (85:15 v/v)",
      "flow_rate": "1.4 mL/min",
      "temp": "30 °C",
      "wavelength": "353 nm",
      "sst_criteria": "SST %RSD ≤ 2.0% (n=6), Tailing T ≤ 2.0, Plate Count N ≥ 2000.",
      "forms": [
        "Borang UP/005",
        "Borang UP/011"
      ]
    },
    {
      "no": "36",
      "code": "PKKK/300/UP/036",
      "title": "Alat Vortex Mixer Genie 2",
      "status": "Terbitan 1 Semakan 1",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja F03",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/UAT/062",
      "category": "Peralatan Am",
      "instrument": "Vortex-Genie 2 Mixer",
      "scope": "Pengadunan pantas sampel cecair, pelarutan ekstrak, dan homogenisasi campuran sebelum suntikan kromatografi.",
      "forms": [
        "Borang UP/036 (Logbook Vortex)"
      ]
    },
    {
      "no": "37",
      "code": "PKKK/300/UP/037",
      "title": "Prosedur untuk verifikasi pembersihan radas-radas kaca dan plastik di makmal",
      "status": "Terbitan 5,  Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/KOS/003",
      "category": "General",
      "instrument": "Radas Kaca & Plastik Makmal",
      "scope": "Verifikasi keberkesanan pembersihan radas kaca melalui ujian konduktiviti air bilasan terakhir dan ujian visual sisa analit.",
      "forms": [
        "Borang UP/037 (Verifikasi Pembersihan)"
      ]
    },
    {
      "no": "38",
      "code": "PKKK/300/ UP/038",
      "title": "MT XP 205 DR Analytical Balance",
      "status": "Issue 5,  Revision 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/KOS/004",
      "category": "Alat Timbang",
      "instrument": "Mettler Toledo XP 205 DR Dual Range Analytical Balance",
      "scope": "Penimbangan analitikal berketepatan tinggi (0.01 mg – 220 g).",
      "sst_criteria": "Verifikasi harian UP/014, kepekaan UP/015, dan kebolehulangan UP/016.",
      "forms": [
        "Borang UP/014",
        "Borang UP/015",
        "Borang UP/016"
      ]
    },
    {
      "no": "39",
      "code": "PKKK/300/UP/039",
      "title": "Prosedur pelupusan sisa kimia",
      "status": "Terbitan 4,  Semakan 1",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari  PKKK/300/KOS/005",
      "category": "Kualiti & Prosedur Makmal",
      "instrument": "Pusat Pengurusan Sisa Kimia SPPK",
      "scope": "Pengasingan, penyimpanan sementara, pelabelan mengikut kod sisa DOE, dan pelupusan sisa pelarut organik/akueus berjadual.",
      "forms": [
        "Borang UP/039 (Inventori Pelupusan Sisa Kimia)"
      ]
    },
    {
      "no": "40",
      "code": "PKKK/300/UP/040",
      "title": "Gas Chromatography Mass Spectrometer Shimadzu QP2010 Ultra",
      "status": "Issue 4, Revision 1",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari  PKKK/300/KOS/006",
      "category": "Ekstraksi / Sample Prep",
      "instrument": "Shimadzu GCMS QP2010 Ultra (GC-2010 Plus / QP2010 Ultra MSD)",
      "column": "BP20 Wax / Rtx-5MS (30 m × 0.25 mm × 0.25 µm)",
      "mobile_phase": "Helium Gas Pembawa (High Purity 99.999%)",
      "flow_rate": "Linear Velocity: 30–45 cm/s (Advanced Flow Controller)",
      "temp": "Inlet: 250 °C · Ion Source: 230 °C · Interface: 240 °C",
      "wavelength": "EI 70 eV · COAST SIM Automatic Wizard / Full Scan",
      "sst_criteria": "Autotune m/z 69 (100%), m/z 219 (>35%), m/z 502 (>1.0%), Air/Water m/z 18 < 10%, m/z 28 < 5%.",
      "forms": [
        "Borang UP/040 (Logbook QP2010 Ultra)",
        "Laporan Autotuning"
      ]
    },
    {
      "no": "41",
      "code": "PKKK/300/UP/041",
      "title": "HPLC Shimadzu Series Prominence-i (HPLC 3)",
      "status": "Issue 4, Revision 1",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/KOS/007",
      "category": "HPLC",
      "instrument": "Shimadzu HPLC Prominence-i LC-2030C 3D (HPLC 3)",
      "column": "C18 / Phenyl-Hexyl / C8 (150/250 × 4.6 mm, 5 µm)",
      "mobile_phase": "Kecerunan 4 Saluran (A, B, C, D)",
      "flow_rate": "0.5 – 2.0 mL/min (Auto Purge: 5.0 mL/min)",
      "temp": "25 – 60 °C (Column Oven)",
      "wavelength": "190 – 800 nm (PDA Detector)",
      "sst_criteria": "Passcode: 00000, Auto Purge rutin, kestabilan tekanan (RSD < 2%).",
      "forms": [
        "Borang UP/041 (Logbook HPLC 3)"
      ]
    },
    {
      "no": "42",
      "code": "PKKK/300/UP/042",
      "title": "HPLC Shimadzu Series Prominence-i (HPLC 4)",
      "status": "Issue 4, Revision 1",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari PKKK/300/KOS/008",
      "category": "HPLC",
      "instrument": "Shimadzu HPLC Prominence-i LC-2030C 3D (HPLC 4)",
      "column": "Zorbax SB-C18 / Eclipse Plus C18 (150/250 × 4.6 mm, 5 µm)",
      "mobile_phase": "Isokratik / Kecerunan",
      "flow_rate": "0.5 – 2.0 mL/min",
      "temp": "25 – 60 °C",
      "wavelength": "190 – 800 nm (PDA Detector)",
      "sst_criteria": "Passcode: 00000, Auto Purge rutin, kestabilan tekanan (RSD < 2%).",
      "forms": [
        "Borang UP/042 (Logbook HPLC 4)"
      ]
    },
    {
      "no": "43",
      "code": "PKKK/300/UP/043",
      "title": "HPLC \tIon \tChromatography System Shimadzu LC-20AR",
      "status": "Issue 4, Revision 1",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari   PKKK/300/KOS/009",
      "category": "HPLC",
      "instrument": "Shimadzu Ion Chromatography System (LC-20AR / CDD-10Avp)",
      "column": "Shim-pack IC-A3 (150 × 4.6 mm, 5 µm)",
      "mobile_phase": "8 mmol/L p-Hydroxybenzoic Acid + 3.2 mmol/L Bis-Tris + 50 mmol/L Boric Acid",
      "flow_rate": "1.0 mL/min",
      "temp": "40 °C",
      "wavelength": "Pengesan Konduktiviti Ion (CDD-10Avp, 300–400 µS/cm)",
      "sst_criteria": "SST Peak Area %RSD ≤ 2.0% bagi 6 suntikan piawai Fluoride RS, R² ≥ 0.9990.",
      "forms": [
        "Borang UP/043 (Logbook IC Shimadzu)",
        "Borang UP/055"
      ]
    },
    {
      "no": "44",
      "code": "PKKK/300/UP/044",
      "title": "HPLC Agilent (HPLC 1)",
      "status": "Issue 4,  Revision 1",
      "effective_date": "10 April  2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari   PKKK/200/KOS/012",
      "category": "HPLC",
      "instrument": "Agilent 1260 Infinity HPLC System (HPLC Agilent 1)",
      "column": "Thermo ODS Hypersil / Zorbax C18 (150/200 × 4.6 mm, 5 µm)",
      "mobile_phase": "Acetonitrile : 0.05% H3PO4 (60:40 v/v)",
      "flow_rate": "1.8 mL/min",
      "temp": "45 °C",
      "wavelength": "238 nm (VWD / DAD Detector)",
      "sst_criteria": "OpenLab ChemStation Passcode: 3000hanover, %RSD SST ≤ 2.0%.",
      "forms": [
        "Borang UP/044 (Logbook Agilent 1)"
      ]
    },
    {
      "no": "45",
      "code": "PKKK/300/UP/045",
      "title": "HPLC Shimadzu Series LC-20AT   (HPLC 2)",
      "status": "Issue 4, Revision 1",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari   PKKK/200/KOS/013",
      "category": "HPLC",
      "instrument": "Shimadzu Modular HPLC Series (LC-20AT Pump / SPD-M20A PDA)",
      "column": "C18 Analytical Column (150/250 × 4.6 mm, 5 µm)",
      "mobile_phase": "Binary Gradient Solvent Delivery",
      "flow_rate": "1.0 mL/min",
      "temp": "35 °C",
      "wavelength": "190 – 400 nm (SPD-M20A PDA)",
      "sst_criteria": "Manual purge per saluran, tekanan stabil, baseline drift < 1.0 mAU/hr.",
      "forms": [
        "Borang UP/045 (Logbook LC-20AT)"
      ]
    },
    {
      "no": "46",
      "code": "PKKK/300/UP/046",
      "title": "Precisa XB 320M Top Pan Balance",
      "status": "Issue 4, Revision 1",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari  PKKK/200/KOS/014",
      "category": "Alat Timbang",
      "instrument": "Precisa XB 320M Top Pan Balance",
      "scope": "Penimbangan kasar bagi penyediaan sampel pukal, sampel herba kisar, dan reagen pelarut.",
      "sst_criteria": "Semakan harian batu timbang M1/F2 (UP/014).",
      "forms": [
        "Borang UP/014"
      ]
    },
    {
      "no": "47",
      "code": "PKKK/300/UP/047",
      "title": "Screening of Theophylline & Caffeine in Cosmetic Samples using GCMS",
      "status": "Issue 5, Revision 1",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari  PKKK/200/KOS/015",
      "category": "GCMS",
      "instrument": "Agilent / Shimadzu GC-MS Systems",
      "column": "HP-5MS / Rtx-5MS (30 m × 0.25 mm × 0.25 µm)",
      "mobile_phase": "Helium Gas Pembawa @ 1.0 mL/min",
      "flow_rate": "Split 20:1 @ 250 °C",
      "temp": "Oven: 80 °C (1 min) → 15 °C/min ke 280 °C (5 min)",
      "wavelength": "EI 70 eV · Scan m/z 40 – 450 amu",
      "sst_criteria": "Padanan spektrum Theophylline (m/z 180, 95) & Caffeine (m/z 194, 109) > 800.",
      "forms": [
        "Borang UP/005",
        "Borang UP/017"
      ]
    },
    {
      "no": "48",
      "code": "PKKK/300/UP/048",
      "title": "Identification of Hydroquinone in Cosmetic Products using GCMS",
      "status": "Issue 6, Revision 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari  PKKK/200/HMS/016",
      "category": "GCMS",
      "instrument": "Agilent 8890 GC-MS System",
      "column": "HP-5MS UI (30 m × 0.25 mm × 0.25 µm)",
      "mobile_phase": "Helium Gas Pembawa @ 1.0 mL/min",
      "flow_rate": "Split 10:1 @ 250 °C",
      "temp": "Oven: 70 °C (1 min) → 12 °C/min ke 250 °C (4 min)",
      "wavelength": "MS EI 70 eV · Scan / SIM m/z 110, 81, 53",
      "sst_criteria": "RT match ±2%, ion ratio match had toleransi Table 6.",
      "forms": [
        "Borang UP/005",
        "Borang UP/017"
      ]
    },
    {
      "no": "49",
      "code": "PKKK/300/UP/049",
      "title": "Screening of Diethylene Glycol in Toothpaste Preparations using GCMS",
      "status": "Issue 5, Revision 1",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari  PKKK/200/KOS/017",
      "category": "GCMS",
      "instrument": "Agilent 8890 / Shimadzu QP2010 GC-MS",
      "column": "BP20 Wax (30 m × 0.25 mm × 0.25 µm)",
      "mobile_phase": "Helium Gas Pembawa (Linear Velocity: 35 cm/s)",
      "flow_rate": "0.8 mL/min (Split 20:1 @ 240 °C)",
      "temp": "Oven: 100 °C (1 min) → 10 °C/min ke 140 °C (5 min) → 20 °C/min ke 240 °C",
      "wavelength": "SIM Mode: m/z 45, 75, 31 (DEG) & m/z 31, 62 (EG)",
      "sst_criteria": "Peak Area %RSD ≤ 10.0%, had DEG dalam ubat gigi ≤ 0.10% w/w.",
      "forms": [
        "Borang UP/005",
        "Borang UP/017"
      ]
    },
    {
      "no": "50",
      "code": "PKKK/300/UP/050",
      "title": "Screening for Identification of Hydroquinone in Cosmetic Products using HPLC Technique",
      "status": "Issue 6, Revision 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari  PKKK/200/KOS/019",
      "category": "HPLC",
      "instrument": "HPLC Shimadzu Prominence-i / Agilent 1200",
      "column": "Cosmosil 5 C18 AR-II (250 × 4.6 mm, 5 µm)",
      "mobile_phase": "Isokratik: 0.05 M Buffer Fosfat pH 2.5 : Methanol (99:1 v/v)",
      "flow_rate": "0.9 mL/min",
      "temp": "30 °C",
      "wavelength": "280 nm (UV / PDA Detector)",
      "sst_criteria": "SST Peak Area %RSD ≤ 2.0% (n=6), Tailing T ≤ 2.0, Plate Count N ≥ 2000, LOD 0.0005 mg/mL.",
      "limits": "Racun Berjadual: Bahan Dilarang Mutlak dalam Kosmetik (0.00% w/w).",
      "forms": [
        "Borang UP/005",
        "Borang UP/011"
      ]
    },
    {
      "no": "51",
      "code": "PKKK/300/UP/051",
      "title": "Determination of Hydroquinone Content in Cosmetic Products Using HPLC Technique",
      "status": "Issue 5,  Revision 1",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari  PKKK/200/HMS/020",
      "category": "HPLC",
      "instrument": "HPLC Shimadzu Prominence-i LC-2030C",
      "column": "Cosmosil 5 C18 AR-II (250 × 4.6 mm, 5 µm)",
      "mobile_phase": "Isokratik: 0.05 M Buffer Fosfat pH 2.5 : Methanol (99:1 v/v)",
      "flow_rate": "0.9 mL/min",
      "temp": "30 °C",
      "wavelength": "280 nm",
      "sst_criteria": "SST %RSD ≤ 2.0% (n=6), Kalibrasi R² ≥ 0.9990.",
      "forms": [
        "Borang UP/005",
        "Borang UP/011"
      ]
    },
    {
      "no": "52",
      "code": "PKKK/300/UP/052",
      "title": "Screening of Clindamycin in Cosmetics using HPLC",
      "status": "Issue 5, Revision 1",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari   PKKK/300/KOS/022",
      "category": "HPLC",
      "instrument": "HPLC Shimadzu Prominence-i LC-2030C",
      "column": "Zorbax SB-C18 (150 × 4.6 mm, 5 µm)",
      "mobile_phase": "Buffer Fosfat pH 3.0 : Acetonitrile (55:45 v/v)",
      "flow_rate": "1.0 mL/min",
      "temp": "30 °C",
      "wavelength": "210 nm",
      "sst_criteria": "SST %RSD ≤ 2.0% (n=6), Tailing T ≤ 2.0, Plates N ≥ 2000.",
      "forms": [
        "Borang UP/005",
        "Borang UP/011"
      ]
    },
    {
      "no": "53",
      "code": "PKKK/300/UP/053",
      "title": "Identification and Quantitation of Tretinoin (Retinoic Acid) in Cosmetic Products By HPLC",
      "status": "Issue 6, Revision 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari   PKKK/300/KOS/023",
      "category": "HPLC",
      "instrument": "HPLC Shimadzu Prominence-i LC-2030C",
      "column": "Zorbax SB-C18 (150 × 4.6 mm, 5 µm)",
      "mobile_phase": "Acetonitrile : 1% Glacial Acetic Acid (85:15 v/v)",
      "flow_rate": "1.2 mL/min",
      "temp": "30 °C",
      "wavelength": "353 nm",
      "sst_criteria": "SST %RSD ≤ 2.0% (n=6), Kalibrasi R² ≥ 0.9990.",
      "forms": [
        "Borang UP/005",
        "Borang UP/011"
      ]
    },
    {
      "no": "54",
      "code": "PKKK/300/UP/054",
      "title": "Identification and Quantitation of Methyl, Ethyl, Propyl and Butyl 4-Hydroxybenzoate in Cosmetic Products By HPLC",
      "status": "Issue 5, Revision 1",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari   PKKK/200/KOS/024",
      "category": "HPLC",
      "instrument": "HPLC Shimadzu Prominence-i LC-2030C",
      "column": "Zorbax Eclipse Plus C18 (150 × 4.6 mm, 5 µm)",
      "mobile_phase": "Kecerunan: Water : Acetonitrile (dengan 0.1% Asid Asetik)",
      "flow_rate": "1.0 mL/min",
      "temp": "35 °C",
      "wavelength": "254 nm (Methyl, Ethyl, Propyl, Butylparaben)",
      "sst_criteria": "Resolusi Rs > 1.5 antara semua puncak paraben, %RSD ≤ 2.0%.",
      "forms": [
        "Borang UP/005",
        "Borang UP/011"
      ]
    },
    {
      "no": "55",
      "code": "PKKK/300/UP/055",
      "title": "Identification and Determination of Fluoride in  Toothpaste \tProducts \tusing \tIon  Chromatography",
      "status": "Issue 6, Revision 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari   PKKK/300/KOS/025",
      "category": "General",
      "instrument": "Shimadzu Ion Chromatography System (LC-20AR / CDD-10Avp)",
      "column": "Shim-pack IC-A3 (150 × 4.6 mm, 5 µm)",
      "mobile_phase": "8 mmol/L p-Hydroxybenzoic Acid + 3.2 mmol/L Bis-Tris + 50 mmol/L Boric Acid",
      "flow_rate": "1.0 mL/min",
      "temp": "40 °C",
      "wavelength": "Konduktiviti Ion (CDD-10Avp)",
      "sst_criteria": "SST %RSD ≤ 2.0% bagi Fluoride RS, kalibrasi R² ≥ 0.9990.",
      "forms": [
        "Borang UP/043",
        "Borang UP/055"
      ]
    },
    {
      "no": "56",
      "code": "PKKK/300/UP/056",
      "title": "Identification of Steroids in Cosmetic Products by HPLC (ASEAN Harmonised Method ACM 007)",
      "status": "Issue 4, Revision 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari   PKKK/300/KOS/026",
      "category": "HPLC",
      "instrument": "HPLC Shimadzu Prominence-i / Agilent 1200",
      "column": "Kinetex Phenyl-Hexyl (150 × 4.6 mm, 2.6 µm)",
      "mobile_phase": "Kecerunan: Ultrapure Water : Acetonitrile (ACM 007)",
      "flow_rate": "0.7 mL/min",
      "temp": "40 °C",
      "wavelength": "240 nm (PDA Detector)",
      "sst_criteria": "Pematuhan standard ASEAN Cosmetic Method (ACM 007), resolusi Rs > 1.5.",
      "forms": [
        "Borang UP/005",
        "Borang UP/011"
      ]
    },
    {
      "no": "57",
      "code": "PKKK/300/UP/057",
      "title": "High Performance Liquid Chromatography Flexar (Perkin Elmer)",
      "status": "Issue 3,  Revision 1",
      "effective_date": "10 April 2026",
      "location": "Makmal H04",
      "remarks": "Dokumen ini bertukar nombor dari   PKKK/300/KOS/028",
      "category": "HPLC",
      "instrument": "PerkinElmer Flexar HPLC System",
      "column": "Brownlee SPP C18 (100 × 4.6 mm, 2.7 µm)",
      "mobile_phase": "Kecerunan Pelarut Organik / Buffer",
      "flow_rate": "1.0 mL/min",
      "temp": "35 °C",
      "wavelength": "190 – 400 nm (PDA Detector)",
      "sst_criteria": "Kestabilan tekanan dan kelancaran pam Flexar FX-15.",
      "forms": [
        "Borang UP/057 (Logbook Flexar)"
      ]
    },
    {
      "no": "58",
      "code": "PKKK/300/UP/058",
      "title": "Ultrasonic Bath Branson 8210",
      "status": "Terbitan 3, Semakan 1",
      "effective_date": "10 April  2026",
      "location": "Makmal H04",
      "remarks": "Dokumen ini bertukar nombor dari   PKKK/300/KOS/029",
      "category": "Peralatan Am",
      "instrument": "Ultrasonic Bath Branson 8210",
      "scope": "Penyahgasan fasa bergerak kromatografi (degassing 15–20 min) dan pengekstrakan sonikasi matriks sampel (10–15 min).",
      "sst_criteria": "Paras air mencukupi pada tangki keluli, suhu tidak melebihi had keselamatan.",
      "forms": [
        "Borang UP/058 (Logbook Branson 8210)"
      ]
    },
    {
      "no": "59",
      "code": "PKKK/300/UP/059",
      "title": "Screening for Antimicrobials (Metronidazole, Griseofulvin, Chloramphenicol, Trimethoprim, Clindamycin & Sulfamethoxazole) in  Cosmetic Products Using GC-MS",
      "status": "Issue 3,  Revision 0",
      "effective_date": "31 Mac 2026",
      "location": "Fail Arahan  Kerja  H04",
      "remarks": "Dokumen ini bertukar nombor dari   PKKK/300/KOS/030",
      "category": "GCMS",
      "instrument": "Agilent 8890 / 7890A GC-MS Systems",
      "column": "HP-5MS UI (30 m × 0.25 mm × 0.25 µm)",
      "mobile_phase": "Helium Gas Pembawa @ 1.0 mL/min",
      "flow_rate": "Split 20:1 @ 250 °C",
      "temp": "Oven Ramp: 80 °C (1 min) → 12 °C/min ke 280 °C (5 min)",
      "wavelength": "EI 70 eV · Scan m/z 40 – 500 amu",
      "sst_criteria": "Padanan spektrum antimikrobial (Triclosan, Phenoxyethanol, Chlorphenesin) > 800.",
      "forms": [
        "Borang UP/005",
        "Borang UP/017"
      ]
    },
    {
      "no": "60",
      "code": "PKKK/300/UP/060",
      "title": "Screening of Non-Steroidal Anti-Inflammatory Drugs (NSAIDs) in Cosmetic Products Using High Performance Liquid Chromatography (HPLC)",
      "status": "Issue 3,  Revision 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari   PKKK/300/KOS/032",
      "category": "HPLC",
      "instrument": "HPLC Shimadzu Prominence-i / Agilent 1200",
      "column": "Zorbax Eclipse Plus C18 (150 × 4.6 mm, 5 µm)",
      "mobile_phase": "Kecerunan: Buffer Fosfat pH 3.0 : Acetonitrile",
      "flow_rate": "1.0 mL/min",
      "temp": "40 °C",
      "wavelength": "230 nm (Diclofenac, Ibuprofen, Indomethacin, Mefenamic Acid, Piroxicam)",
      "sst_criteria": "Resolusi Rs > 1.5 antara semua analit NSAID, SST %RSD ≤ 2.0%.",
      "forms": [
        "Borang UP/005",
        "Borang UP/011"
      ]
    },
    {
      "no": "61",
      "code": "PKKK/300/UP/061",
      "title": "Identification & Determination of p-Phenylenediamine in Hair Care Products",
      "status": "Terbitan 2, Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari   PKKK/300/KOS/033",
      "category": "General",
      "instrument": "HPLC Shimadzu Prominence-i LC-2030C",
      "column": "Discovery RP Amide C16 (250 × 4.6 mm, 5 µm)",
      "mobile_phase": "Isokratik: Phosphate Buffer : Acetonitrile (90:10 v/v)",
      "flow_rate": "1.0 mL/min",
      "temp": "25 °C",
      "wavelength": "280 nm (p-Phenylenediamine PPD dalam Pewarna Rambut)",
      "sst_criteria": "SST %RSD ≤ 2.0% (n=6), Kalibrasi R² ≥ 0.9990.",
      "forms": [
        "Borang UP/005",
        "Borang UP/011"
      ]
    },
    {
      "no": "62",
      "code": "PKKK/300/UP/062",
      "title": "Determination of Volatile Compounds (Camphor, Menthol, Methyl Salicylate and Thymol) in Cosmetic Products using GC-MS",
      "status": "Terbitan 2, Semakan 0",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari   PKKK/300/KOS/035",
      "category": "GCMS",
      "instrument": "Agilent 8890 GC-MS System",
      "column": "HP-INNOWax / BP20 (30 m × 0.25 mm × 0.25 µm)",
      "mobile_phase": "Helium Gas Pembawa @ 1.0 mL/min",
      "flow_rate": "Split 30:1 @ 240 °C",
      "temp": "Oven: 50 °C (2 min) → 8 °C/min ke 200 °C (5 min)",
      "wavelength": "EI 70 eV · Scan m/z 35 – 350 amu",
      "sst_criteria": "Kuantitasi kompaun volatil (Ethanol, Isopropanol, Methanol) dengan R² ≥ 0.9950.",
      "forms": [
        "Borang UP/005",
        "Borang UP/017"
      ]
    },
    {
      "no": "63",
      "code": "PKKK/300/UP/063",
      "title": "Water Bath Memmert WNB 14",
      "status": "Terbitan 1, Semakan 1",
      "effective_date": "10 April 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari   PKKK/300/KOS/036",
      "category": "Peralatan Am",
      "instrument": "Waterbath Memmert WNB 14",
      "scope": "Pemanasan dan inkubasi sampel cecair pada suhu malar (30 °C – 95 °C) bagi ujian kestabilan dan reaksi pelarutan.",
      "sst_criteria": "Paras air demineralized di antara tanda aras keselamatan.",
      "forms": [
        "Borang UP/063 (Logbook Memmert WNB 14)"
      ]
    },
    {
      "no": "64",
      "code": "PKKK/300/UP/064",
      "title": "Control Charting and Trend Analysis",
      "status": "Terbitan 1, Semakan 0",
      "effective_date": "15 Mei 2026",
      "location": "Fail Arahan Kerja H04",
      "remarks": "Dokumen ini bertukar nombor dari   PKKK/300/UAT/028",
      "category": "Kualiti & Prosedur Makmal",
      "instrument": "Sistem Kawalan Kualiti Statistik & Carta Kawalan Shewhart",
      "scope": "Pemplotan carta kawalan Shewhart IQC bagi verifikasi harian neraca analitikal, semakan drift instrumen, dan trend data ujian kuantitatif.",
      "sst_criteria": "Amaran Tindakan: 1 titik di luar had ±3s (UCL/LCL), atau 2 daripada 3 titik berturutan di luar had ±2s (UWL/LWL).",
      "forms": [
        "Borang UP/014 (Data Harian)",
        "Borang UP/064 (Carta Shewhart IQC)"
      ]
    }
  ],
  "rk_list": [
    {
      "code": "-",
      "title": "Rekod penyelenggaraan alat   Rapid Resolution Liquid Chromatography HP 1200",
      "pic": "Penolong Pegawai Farmasi U6 / U7",
      "file_location": "F03 - Fail Alat Berkenaan",
      "retention": "Sepanjang hayat alat",
      "disposal": "Shredding"
    },
    {
      "code": "-",
      "title": "Rekod penyelenggaraan alat Gas Chromatography -Mass Spectroscopy Agilent (7890A/5975C)",
      "pic": "Penolong Pegawai Farmasi U6 / U7",
      "file_location": "F03 - Fail Alat Berkenaan",
      "retention": "Sepanjang hayat alat",
      "disposal": "Shredding"
    },
    {
      "code": "-",
      "title": "Rekod penyelenggaraan alat timbang Precisa XT120A",
      "pic": "Penolong Pegawai Farmasi U6 / U7",
      "file_location": "F03 - Fail Alat Berkenaan",
      "retention": "Sepanjang hayat alat",
      "disposal": "Shredding"
    },
    {
      "code": "-",
      "title": "Rekod penyelenggaraan alat timbang Precisa XB1200C",
      "pic": "Penolong Pegawai Farmasi U6 / U7",
      "file_location": "F03 - Fail Alat Berkenaan",
      "retention": "Sepanjang hayat alat",
      "disposal": "Shredding"
    },
    {
      "code": "-",
      "title": "Rekod penyelenggaraan alat timbang Sartorius Cubis Microbalance MSU6.6S",
      "pic": "Penolong Pegawai Farmasi U6 / U7",
      "file_location": "F03 - Fail Alat Berkenaan",
      "retention": "Sepanjang hayat alat",
      "disposal": "Shredding"
    },
    {
      "code": "-",
      "title": "Rekod penyelenggaraan PH Meter Model FiveEasy Plus",
      "pic": "Penolong Pegawai Farmasi U6 / U7",
      "file_location": "F03 - Fail Alat Berkenaan",
      "retention": "Sepanjang hayat alat",
      "disposal": "Shredding"
    },
    {
      "code": "-",
      "title": "Rekod penyelenggaraan alat timbang Metler Toledo ME204T",
      "pic": "Penolong Pegawai Farmasi U6 / U7",
      "file_location": "F03 - Fail Alat Berkenaan",
      "retention": "Sepanjang hayat alat",
      "disposal": "Shredding"
    },
    {
      "code": "-",
      "title": "Rekod penyelenggaraan alat Gas Chromatograph Mass Spectrometer Shimadzu (QP2010 Ultra)",
      "pic": "Penolong Pegawai Farmasi U6 / U7",
      "file_location": "F03 - Fail Alat Berkenaan",
      "retention": "Sepanjang hayat alat",
      "disposal": "Shredding"
    },
    {
      "code": "-",
      "title": "Rekod penyelenggaraan alat Shimadzu High Performance Liquid Chromatography (Prominence-i)",
      "pic": "Penolong Pegawai Farmasi U6 / U7",
      "file_location": "F03 - Fail Alat Berkenaan",
      "retention": "Sepanjang hayat alat",
      "disposal": "Shredding"
    },
    {
      "code": "-",
      "title": "Rekod penyelenggaraan alat Shimadzu High Performance Liquid Chromatograph Mass Spectrometer LCMS-8045",
      "pic": "Penolong Pegawai Farmasi U6 / U7",
      "file_location": "F03 - Fail Alat Berkenaan",
      "retention": "Sepanjang hayat alat",
      "disposal": "Shredding"
    },
    {
      "code": "-",
      "title": "Rekod penyelenggaraan alat Shimadzu High Performance Liquid Chromatography Flexar (Perkin Elmer)",
      "pic": "Penolong Pegawai Farmasi U6 / U7",
      "file_location": "F03 - Fail Alat Berkenaan",
      "retention": "Sepanjang hayat alat",
      "disposal": "Shredding"
    },
    {
      "code": "-",
      "title": "Rekod penyelenggaraan alat Gas Chromatography -Mass Spectroscopy Agilent (8890/5977B)",
      "pic": "Penolong Pegawai Farmasi U6 / U7",
      "file_location": "F03 - Fail Alat Berkenaan",
      "retention": "Sepanjang hayat alat",
      "disposal": "Shredding"
    },
    {
      "code": "-",
      "title": "Rekod penyelenggaraan alat Water Bath Memmert WB 45",
      "pic": "Penolong Pegawai Farmasi U6 / U7",
      "file_location": "F03 - Fail Alat Berkenaan",
      "retention": "Sepanjang hayat alat",
      "disposal": "Shredding"
    },
    {
      "code": "-",
      "title": "Rekod penyelenggaraan alat timbang Sartorius MSE 225S-100-DU",
      "pic": "Penolong Pegawai Farmasi U6 / U7",
      "file_location": "F03 - Fail Alat Berkenaan",
      "retention": "Sepanjang hayat alat",
      "disposal": "Shredding"
    },
    {
      "code": "-",
      "title": "Rekod penyelenggaraan alat Vortex Mixer Genie-2",
      "pic": "Penolong Pegawai Farmasi U6 / U7",
      "file_location": "F03 - Fail Alat Berkenaan",
      "retention": "Sepanjang hayat alat",
      "disposal": "Shredding"
    },
    {
      "code": "UP/001A",
      "title": "Borang Persampelan",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/001B",
      "title": "Borang Persampelan produk kosmetik",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/002A",
      "title": "Laporan Siasatan Untuk Sampel Gagal",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/002B",
      "title": "Laporan Siasatan Sampel Kosmetik Tidak Lulus Ujian Kromatografi",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/003",
      "title": "Laporan Penyediaan Stok Piawai Rujukan",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/004",
      "title": "Laporan Pengesanan Bahan Kawalan dan Terlarang dalam produk Tradisional menggunakan GCMS",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/005",
      "title": "Laporan Pengujian HPLC",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/006",
      "title": "Laporan Pengujian LCMS",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "PKKK/UP/006A",
      "title": "Laporan Identification & Assay Lovastatin",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "PKKK/UP/006B",
      "title": "Borang Ujian Berat Purata (Ujian Penyaringan)",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "PKKK/UP/006C",
      "title": "Laporan System Suitability",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "PKKK/UP/006D",
      "title": "Laporan Internal Quality Check (IQC)",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "PKKK/UP/006E",
      "title": "Laporan Lovastatin Limit Test Calculation",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "PKKK/UP/006F",
      "title": "Laporan Internal Quality Control (Menggunakan sampel yang pernah diuji atau sampel ILC)",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "PKKK/UP/006G",
      "title": "Borang Calibration Curve for Lovastatin Standard",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/007",
      "title": "Laporan Pengujian Identifikasi dan Kandungan Menthol, Camphor, Methyl Salicylate dan Thymol dalam Produk Tradisional Menggunakan GCMS",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/008A",
      "title": "Laporan Identification & Assay Lovastatin",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/008B",
      "title": "Borang Ujian Berat Purata (Ujian Penyaringan)",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/008C",
      "title": "Laporan System Suitability",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/008D",
      "title": "Laporan Internal Quality Check (IQC)",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/008E",
      "title": "Laporan Lovastatin Limit Test Calculation",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/008F",
      "title": "Laporan Internal Quality Control (Menggunakan sampel yang pernah diuji atau sampel ILC)",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/008G",
      "title": "Borang Calibration Curve for Lovastatin Standard",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/009",
      "title": "Laporan Pengujian Identification And Assay Of Diethylene Glycol And Ethylene Glycol  In Medicinal Syrup Using GCMS",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/010",
      "title": "Laporan Ujian Identifikasi - Kromatografi Cecair Berprestasi Tinggi (HPLC)",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/011",
      "title": "Laporan Ujian Kandungan - Kromatografi Cecair Berprestasi Tinggi  (HPLC)",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/012",
      "title": "Accuracy Control Chart for Internal Quality Control (IQC) Samples",
      "pic": "Ketua Unit Penyaringan",
      "file_location": "F03 - Fail Control Chart",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/013",
      "title": "Mixed Standard Stock Solution Preparation Form",
      "pic": "Ketua Unit Penyaringan",
      "file_location": "F04 - Fail Penyediaan Piawai Rujukan",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/014",
      "title": "Daily Performance Check Form for Weighing Balance",
      "pic": "Ketua Unit Penyaringan",
      "file_location": "F04 - Fail Performance Check",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/015",
      "title": "Performance Check for Weighing Balance: Sensitivity Check",
      "pic": "Ketua Unit Penyaringan",
      "file_location": "F04 - Fail Performance Check",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/016",
      "title": "Performance Check for Weighing Balance: Repeatability Check",
      "pic": "Ketua Unit Penyaringan",
      "file_location": "F04 - Fail Performance Check",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/X001",
      "title": "Rumusan laporan pengujian",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/X002",
      "title": "Keputusan Ujian Sampel",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/X003",
      "title": "Borang Agihan Ujian",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/X004",
      "title": "Borang pemantauan proses kerja",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/X005",
      "title": "Borang Deskripsi Dosej",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/X006",
      "title": "Analysis Report Verification Checklist",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/X007",
      "title": "Borang Internal Quality Control Pengujian Kromatografi",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/X008",
      "title": "Borang agihan sampel kosmetik",
      "pic": "Pegawai Farmasi",
      "file_location": "H04 - Fail Distribution of Cosmetic Sample",
      "retention": "1 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/X009",
      "title": "Borang Tatacara Pengujian menggunakan kaedah HPLC",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/X010",
      "title": "Borang Tatacara Pengujian menggunakan kaedah GCMS",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/X011",
      "title": "Laporan Ujian Kandungan Teknik Kromatografi",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/X012",
      "title": "Borang ujian rupabentuk fizikal",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/X013",
      "title": "Borang Keputusan Ujian Sampel Kosmetik",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/X014",
      "title": "Borang Internal Quality Control (HPLC)",
      "pic": "Pegawai Farmasi",
      "file_location": "H01 - Fail Internal Quality Control (HPLC)",
      "retention": "6 tahun",
      "disposal": "Shredding"
    },
    {
      "code": "UP/X015",
      "title": "Laporan Keputusan Ujian Identifikasi / Kandungan GC-MS",
      "pic": "Ketua Unit Perkhidmatan Analisis",
      "file_location": "H01 - Laporan Ujian",
      "retention": "6 tahun",
      "disposal": "Shredding"
    }
  ]
};
