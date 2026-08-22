// Lovastatin HPLC Analysis & Reporting Suite Engine (PKKK/200/UP/002 & PKKK/300/UP/031)

// State
let calModel = { slope: 62410, intercept: 1200, r2: 0.9999, lodArea: 37500 };
let currentSeqType = 'A';

// Initialize Theme
function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeBtn(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeBtn(next);
}

function updateThemeBtn(theme) {
  const txt = document.getElementById('themeTxt');
  if (txt) {
    txt.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
  }
}

// Tab Switching
function switchSuiteTab(tabKey) {
  document.querySelectorAll('.s-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.suite-section').forEach(sec => sec.classList.remove('active'));

  const btn = document.getElementById(`tabBtn-${tabKey}`);
  const sec = document.getElementById(`section-${tabKey}`);
  if (btn && sec) {
    btn.classList.add('active');
    sec.classList.add('active');
  }

  if (tabKey === 'report') {
    updateReportView();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  calcSST();
  calcCalibration();
  calcAssay();
  renderSeqTable();
});

// ==========================================
// 1. SYSTEM SUITABILITY (SST) CALCULATION
// ==========================================
function calcSST() {
  const areas = [];
  for (let i = 1; i <= 6; i++) {
    const val = parseFloat(document.getElementById(`sst-inj-${i}`).value) || 0;
    areas.push(val);
  }

  const mean = areas.reduce((a, b) => a + b, 0) / areas.length;
  const variance = areas.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (areas.length - 1);
  const sd = Math.sqrt(variance);
  const rsd = mean > 0 ? (sd / mean) * 100 : 0;

  const tailing = parseFloat(document.getElementById('sst-tailing').value) || 1.0;

  document.getElementById('sst-mean').textContent = Math.round(mean).toLocaleString();
  document.getElementById('sst-sd').textContent = sd.toFixed(2);
  document.getElementById('sst-rsd').textContent = rsd.toFixed(2) + '%';

  const rsdPassed = rsd <= 2.0;
  const tailingPassed = tailing < 2.0;

  const rsdStatusElem = document.getElementById('sst-rsd-status');
  rsdStatusElem.className = `status-pill ${rsdPassed ? 'status-pass' : 'status-fail'}`;
  rsdStatusElem.textContent = rsdPassed ? 'PASSED ✓' : 'FAILED ✗';

  const tStatusElem = document.getElementById('sst-t-status');
  tStatusElem.className = `status-pill ${tailingPassed ? 'status-pass' : 'status-fail'}`;
  tStatusElem.textContent = tailingPassed ? 'PASSED ✓' : 'FAILED ✗';

  const banner = document.getElementById('sst-overall-banner');
  const bannerText = document.getElementById('sst-overall-text');
  if (rsdPassed && tailingPassed) {
    banner.className = 'verdict-banner';
    bannerText.textContent = 'VALID & ACCEPTED — PROCEED WITH SAMPLE RUN';
  } else {
    banner.className = 'verdict-banner fail';
    bannerText.textContent = 'SST FAILED — CHECK COLUMN / STANDARD PREP / SYSTEM PRESSURE';
  }
}

function loadSampleSSTData() {
  const sampleAreas = [1245800, 1249200, 1243100, 1251000, 1247400, 1248900];
  sampleAreas.forEach((area, i) => {
    document.getElementById(`sst-inj-${i+1}`).value = area;
  });
  document.getElementById('sst-tailing').value = 1.15;
  document.getElementById('sst-rt').value = 3.95;
  calcSST();
}

// ==========================================
// 2. CALIBRATION & LOD CALCULATION
// ==========================================
function calcCalibration() {
  const concs = [];
  const areas = [];

  for (let i = 1; i <= 5; i++) {
    const c = parseFloat(document.getElementById(`cal-c-${i}`).value) || 0;
    const a = parseFloat(document.getElementById(`cal-a-${i}`).value) || 0;
    concs.push(c);
    areas.push(a);
  }

  const n = concs.length;
  const sumX = concs.reduce((a, b) => a + b, 0);
  const sumY = areas.reduce((a, b) => a + b, 0);
  const sumXY = concs.reduce((sum, c, i) => sum + (c * areas[i]), 0);
  const sumX2 = concs.reduce((sum, c) => sum + (c * c), 0);
  const sumY2 = areas.reduce((sum, a) => sum + (a * a), 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const numerator = (n * sumXY - sumX * sumY);
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  const r = denominator !== 0 ? numerator / denominator : 0;
  const r2 = r * r;

  calModel.slope = slope;
  calModel.intercept = intercept;
  calModel.r2 = r2;
  calModel.lodArea = parseFloat(document.getElementById('cal-a-lod').value) || 37500;

  document.getElementById('cal-slope').textContent = slope.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('cal-intercept').textContent = intercept.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('cal-r2').textContent = r2.toFixed(4);
  document.getElementById('cal-equation').textContent = `y = ${slope.toFixed(1)}x ${intercept >= 0 ? '+' : '-'} ${Math.abs(intercept).toFixed(1)}`;
  document.getElementById('cal-lod-val').textContent = calModel.lodArea.toLocaleString() + ' Counts';

  const r2Passed = r2 >= 0.999;
  const r2StatusElem = document.getElementById('cal-r2-status');
  r2StatusElem.className = `status-pill ${r2Passed ? 'status-pass' : 'status-fail'}`;
  r2StatusElem.textContent = r2Passed ? 'PASSED ✓' : 'FAILED ✗';
}

function loadSampleCalData() {
  const stds = [
    { c: 5.0, a: 312000 },
    { c: 10.0, a: 625000 },
    { c: 20.0, a: 1248000 },
    { c: 40.0, a: 2498000 },
    { c: 60.0, a: 3745000 }
  ];
  stds.forEach((std, i) => {
    document.getElementById(`cal-c-${i+1}`).value = std.c;
    document.getElementById(`cal-a-${i+1}`).value = std.a;
  });
  document.getElementById('cal-a-lod').value = 37500;
  calcCalibration();
}

// ==========================================
// 3. SAMPLE ASSAY & DAILY DOSE CALCULATION
// ==========================================
let lastAssayResult = {};

function calcAssay() {
  const areaA = parseFloat(document.getElementById('s-area-a').value) || 0;
  const areaB = parseFloat(document.getElementById('s-area-b').value) || 0;
  const meanArea = (areaA + areaB) / 2;

  const sampleWeight = parseFloat(document.getElementById('s-weight').value) || 0.5;
  const avgCapsuleWeight = parseFloat(document.getElementById('s-avg-weight').value) || 0.45;
  const stdPurity = parseFloat(document.getElementById('std-purity').value) || 99.4;
  const dailyDoseCount = parseFloat(document.getElementById('s-daily-dose-count').value) || 1;

  // Calculate concentration using calibration curve: x = (y - c) / m
  let conc = 0;
  if (calModel.slope > 0 && meanArea > calModel.intercept) {
    conc = (meanArea - calModel.intercept) / calModel.slope;
  }

  // Check LOD
  const isDetected = meanArea >= calModel.lodArea;

  // % w/w Formula per SOP 200:
  // %w/w = [Conc (ug/mL) * 100 mL * 100 * (Purity / 100)] / [Weight (g) * 1000 * 1000]
  // Simplified: Conc * 100 * Purity / (Weight * 1000000) = (Conc * Purity) / (Weight * 10000)
  const pctWW = sampleWeight > 0 ? (conc * 100 * 100 * (stdPurity / 100)) / (sampleWeight * 1000000) : 0;

  // Lovastatin per capsule (mg/capsule) per SOP 200:
  // mg/capsule = [Conc (ug/mL) * 100 mL * Avg Capsule Weight (g) * (Purity / 100)] / [1000 * Sample Weight (g)]
  const mgCapsule = sampleWeight > 0 ? (conc * 100 * avgCapsuleWeight * (stdPurity / 100)) / (1000 * sampleWeight) : 0;

  // Dose per day (mg/day)
  const dailyDose = mgCapsule * dailyDoseCount;

  // Compliance checks against NPRA limits:
  // Limit 1: %w/w <= 1.00%
  // Limit 2: Daily dose <= 10.00 mg/day
  const pctPassed = pctWW <= 1.00;
  const dosePassed = dailyDose <= 10.00;
  const isOverallPass = pctPassed && dosePassed;

  lastAssayResult = {
    meanArea,
    conc,
    isDetected,
    pctWW,
    mgCapsule,
    dailyDose,
    pctPassed,
    dosePassed,
    isOverallPass,
    sampleWeight,
    avgCapsuleWeight,
    stdPurity,
    dailyDoseCount
  };

  // Update UI Elements
  document.getElementById('res-mean-area').textContent = Math.round(meanArea).toLocaleString();
  document.getElementById('res-conc').textContent = conc.toFixed(2) + ' µg/mL';
  
  const idElem = document.getElementById('res-id-status');
  idElem.textContent = isDetected ? 'DIKESAN (DETECTED)' : 'TIDAK DIKESAN (< LOD)';
  idElem.className = `status-pill ${isDetected ? 'status-pass' : 'status-fail'}`;

  document.getElementById('res-percent-ww').textContent = pctWW.toFixed(3) + ' % w/w';
  const pctStatusElem = document.getElementById('res-pct-status');
  pctStatusElem.textContent = pctPassed ? 'LULUS (≤ 1.00%)' : 'GAGAL (> 1.00%)';
  pctStatusElem.className = `status-pill ${pctPassed ? 'status-pass' : 'status-fail'}`;

  document.getElementById('res-mg-capsule').textContent = mgCapsule.toFixed(2) + ' mg / cap';
  document.getElementById('res-daily-dose').textContent = dailyDose.toFixed(2) + ' mg / day';

  const doseStatusElem = document.getElementById('res-dose-status');
  doseStatusElem.textContent = dosePassed ? 'LULUS (≤ 10.00 mg)' : 'GAGAL (> 10.00 mg)';
  doseStatusElem.className = `status-pill ${dosePassed ? 'status-pass' : 'status-fail'}`;

  const overallBanner = document.getElementById('assay-overall-banner');
  const bannerTitle = document.getElementById('assay-banner-title');
  const bannerText = document.getElementById('assay-banner-text');

  if (isOverallPass) {
    overallBanner.className = 'verdict-banner';
    bannerTitle.textContent = 'STATUS KELULUSAN NPRA';
    bannerText.textContent = 'MEMATUHI SPESIFIKASI (PASS) — DALAM ZON PENERIMAAN';
  } else {
    overallBanner.className = 'verdict-banner fail';
    bannerTitle.textContent = 'STATUS KETIDAKPATUHAN (OOS)';
    bannerText.textContent = 'GAGAL (OOS) — MELEBIHI HAD MAKSIMUM KAWALAN NPRA';
  }
}

function loadSampleAssayData() {
  document.getElementById('s-reg-no').value = '26/UAT/0145';
  document.getElementById('s-name').value = 'Red Yeast Rice Complex Capsule';
  document.getElementById('s-weight').value = 0.5024;
  document.getElementById('s-avg-weight').value = 0.4500;
  document.getElementById('s-area-a').value = 1380000;
  document.getElementById('s-area-b').value = 1384000;
  document.getElementById('s-daily-dose-count').value = 2;
  document.getElementById('std-purity').value = 99.4;
  calcAssay();
}

function generateReportAndSwitch() {
  switchSuiteTab('report');
}

// ==========================================
// 4. INJECTION SEQUENCE TABLES (TABLE 3 & 4)
// ==========================================
const seqDataA = [
  { seq: '1', name: 'Diluent', inj: 1, purpose: 'Baseline stabilization' },
  { seq: '2–7', name: 'Working Standard Solution 20 µg/mL', inj: 6, purpose: 'System Suitability Test (SST)' },
  { seq: '8–12', name: 'Working Standard Solutions A (5 levels)', inj: 5, purpose: 'Calibration Curve Linearity' },
  { seq: '13', name: 'Working Standard at LOD Level (0.6 µg/mL)', inj: 1, purpose: 'LOD Verification (300 mg/kg)' },
  { seq: '14', name: 'Mobile Phase', inj: 1, purpose: 'Solvent check' },
  { seq: '15', name: 'Diluent', inj: 1, purpose: 'Carryover check' },
  { seq: '16–17', name: 'IQC Sample Solution (Duplicate)', inj: 2, purpose: 'Historical IQC / ILC Verification' },
  { seq: '18', name: 'Diluent', inj: 1, purpose: 'Wash' },
  { seq: '19–20', name: 'Sample Solution 1 (A & B)', inj: 2, purpose: 'Sample 1 Assay' },
  { seq: '21', name: 'Diluent', inj: 1, purpose: 'Wash' },
  { seq: '22–23', name: 'Sample Solution 2 (A & B)', inj: 2, purpose: 'Sample 2 Assay' },
  { seq: '24', name: 'Diluent', inj: 1, purpose: 'Wash' },
  { seq: '25–26', name: 'Sample Solution 3 (A & B)', inj: 2, purpose: 'Sample 3 Assay' },
  { seq: '27', name: 'Diluent', inj: 1, purpose: 'Wash' },
  { seq: '28–29', name: 'Sample Solution 4 (A & B)', inj: 2, purpose: 'Sample 4 Assay' },
  { seq: '30', name: 'Diluent', inj: 1, purpose: 'Wash' },
  { seq: '31–32', name: 'Sample Solution 5 (A & B)', inj: 2, purpose: 'Sample 5 Assay' },
  { seq: '33', name: 'Diluent', inj: 1, purpose: 'Wash' },
  { seq: '34', name: 'Working Standard Solution B (20 µg/mL)', inj: 1, purpose: 'Calibration Check Standard' },
  { seq: '35', name: 'Diluent', inj: 1, purpose: 'Wash' },
  { seq: '36–37', name: 'Sample Solution 6 (A & B)', inj: 2, purpose: 'Sample 6 Assay' },
  { seq: '38', name: 'Diluent', inj: 1, purpose: 'Wash' },
  { seq: '39', name: 'Working Standard Solution B (20 µg/mL)', inj: 1, purpose: 'End Bracket Calibration Check' }
];

const seqDataB = [
  { seq: '1', name: 'Diluent', inj: 1, purpose: 'Baseline check' },
  { seq: '2–7', name: 'Working Standard Solution 20 µg/mL (SST)', inj: 6, purpose: 'System Suitability' },
  { seq: '8–12', name: 'Working Standard Solutions A (5 levels)', inj: 5, purpose: 'Calibration Curve' },
  { seq: '13', name: 'Working Standard LOD (0.6 µg/mL)', inj: 1, purpose: 'LOD Check' },
  { seq: '14', name: 'Mobile Phase', inj: 1, purpose: 'Solvent' },
  { seq: '15', name: 'Diluent', inj: 1, purpose: 'Wash' },
  { seq: '16–17', name: 'Sample 1 Solution (A & B)', inj: 2, purpose: 'Sample 1 Assay' },
  { seq: '18–19', name: 'Sample 1 (C) - IQC Spiked', inj: 2, purpose: 'Matrix Spike Recovery' },
  { seq: '20', name: 'Diluent', inj: 1, purpose: 'Wash' },
  { seq: '21–22', name: 'Sample 2 Solution (A & B)', inj: 2, purpose: 'Sample 2 Assay' },
  { seq: '23–24', name: 'Sample 2 (C) - IQC Spiked', inj: 2, purpose: 'Matrix Spike Recovery' },
  { seq: '25–40', name: 'Samples 3 to 5 (Unspiked & Spiked)', inj: 12, purpose: 'Batch Testing & IQC' },
  { seq: '41', name: 'Working Standard Solution B (20 µg/mL)', inj: 1, purpose: 'Mid-Bracket Check' },
  { seq: '42–47', name: 'Sample 6 (Unspiked & Spiked)', inj: 4, purpose: 'Sample 6 Testing' },
  { seq: '48', name: 'Working Standard Solution B (20 µg/mL)', inj: 1, purpose: 'End Bracket Check' }
];

function showSeqTable(type) {
  currentSeqType = type;
  document.getElementById('btn-seq-a').classList.toggle('active', type === 'A');
  document.getElementById('btn-seq-b').classList.toggle('active', type === 'B');
  renderSeqTable();
}

function renderSeqTable() {
  const container = document.getElementById('seq-table-container');
  const data = currentSeqType === 'A' ? seqDataA : seqDataB;

  container.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th style="width:15%">Seq #</th>
          <th style="width:45%">Sample / Standard Description</th>
          <th style="width:15%">No. of Injections</th>
          <th style="width:25%">Purpose</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(row => `
          <tr>
            <td><strong>${row.seq}</strong></td>
            <td>${row.name}</td>
            <td>${row.inj}</td>
            <td><span style="color:var(--text-dim)">${row.purpose}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// ==========================================
// 5. REPORT VIEW UPDATER
// ==========================================
function updateReportView() {
  const regNo = document.getElementById('s-reg-no').value;
  const sName = document.getElementById('s-name').value;
  const form = document.getElementById('s-dosage-form').value;
  const analyst = document.getElementById('s-analyst').value;

  document.getElementById('rep-s-reg').textContent = regNo;
  document.getElementById('rep-s-name').textContent = sName;
  document.getElementById('rep-s-form').textContent = form;
  document.getElementById('rep-sig-analyst').textContent = analyst;

  const today = new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' });
  document.getElementById('rep-date').textContent = today;

  document.getElementById('rep-sst-rsd').textContent = document.getElementById('sst-rsd').textContent;
  document.getElementById('rep-sst-t').textContent = document.getElementById('sst-tailing').value;
  document.getElementById('rep-cal-r2').textContent = calModel.r2.toFixed(4);

  document.getElementById('rep-s-wt').textContent = (lastAssayResult.sampleWeight || 0.5024).toFixed(4) + ' g';
  document.getElementById('rep-avg-wt').textContent = (lastAssayResult.avgCapsuleWeight || 0.4500).toFixed(4) + ' g';
  document.getElementById('rep-mean-area').textContent = Math.round(lastAssayResult.meanArea || 0).toLocaleString();
  document.getElementById('rep-conc').textContent = (lastAssayResult.conc || 0).toFixed(2) + ' µg/mL';

  const idText = lastAssayResult.isDetected ? 'DIKESAN' : 'TIDAK DIKESAN';
  document.getElementById('rep-id-status').textContent = idText;

  document.getElementById('rep-pct-ww').textContent = (lastAssayResult.pctWW || 0).toFixed(3) + ' % w/w';
  document.getElementById('rep-mg-unit').textContent = (lastAssayResult.mgCapsule || 0).toFixed(2) + ' mg / unit';
  document.getElementById('rep-daily-count').textContent = (lastAssayResult.dailyDoseCount || 1) + ' unit / hari';
  document.getElementById('rep-daily-dose').textContent = (lastAssayResult.dailyDose || 0).toFixed(2) + ' mg / hari';

  const conclusionBox = document.getElementById('rep-conclusion-box');
  if (lastAssayResult.isOverallPass) {
    conclusionBox.className = 'rep-conclusion';
    conclusionBox.innerHTML = `Sampel ini <strong>MEMATUHI SPESIFIKASI</strong> had kandungan Lovastatin yang ditetapkan oleh NPRA (Kandungan &le; 1.00% w/w dan Dos Harian &le; 10.00 mg/hari). Keputusan: <strong>LULUS (PASS)</strong>.`;
  } else {
    conclusionBox.className = 'rep-conclusion fail';
    conclusionBox.innerHTML = `Sampel ini <strong>TIDAK MEMATUHI SPESIFIKASI (GAGAL / OOS)</strong> had kawalan Lovastatin yang ditetapkan oleh NPRA. Tindakan siasatan sampel luar spesifikasi hendaklah dibuka selaras dengan Arahan Kerja PKKK/300/UP/002.`;
  }
}

function copyReportText() {
  const regNo = document.getElementById('rep-s-reg').textContent;
  const sName = document.getElementById('rep-s-name').textContent;
  const pctWW = document.getElementById('rep-pct-ww').textContent;
  const dose = document.getElementById('rep-daily-dose').textContent;
  const verdict = lastAssayResult.isOverallPass ? 'LULUS (PASS)' : 'GAGAL (OOS)';

  const text = `LAPORAN PENGUJIAN LOVASTATIN (PKKK/200/UP/002)
No. Sampel: ${regNo}
Nama Produk: ${sName}
Lovastatin (% w/w): ${pctWW} (Had: <= 1.00% w/w)
Dos Harian: ${dose} (Had: <= 10.00 mg/day)
Keputusan: ${verdict}
Unit Penyaringan, Seksyen Pengujian Produk & Kosmetik, NPRA.`;

  navigator.clipboard.writeText(text).then(() => {
    alert('Report summary copied to clipboard!');
  });
}
