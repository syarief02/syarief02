// Analytical Balance Performance Check & Control Charting Suite (PKKK/300/UP/064 & UP/014–016)

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

function switchQcTab(tabKey) {
  document.querySelectorAll('.s-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.qc-section').forEach(sec => sec.classList.remove('active'));

  const btn = document.getElementById(`tabBtn-${tabKey}`);
  const sec = document.getElementById(`sec-${tabKey}`);
  if (btn && sec) {
    btn.classList.add('active');
    sec.classList.add('active');
  }

  if (tabKey === 'chart') {
    renderQCChart();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  calcDaily();
  calcSens();
  calcRep();
  renderQCChart();
});

// Balance presets
const balanceSpecs = {
  SART_MSE225S: { stdMass: 100.0000, mpe: 0.50, name: 'Sartorius MSE 225S' },
  SART_MSU6: { stdMass: 5.0000, mpe: 0.05, name: 'Sartorius Cubis MSU6.6S Microbalance' },
  PRECISA_XT120A: { stdMass: 100.0000, mpe: 0.50, name: 'Precisa XT 120A' },
  MT_XP205DR: { stdMass: 200.0000, mpe: 0.50, name: 'Mettler Toledo XP 205 DR' }
};

function onBalanceSelect() {
  const model = document.getElementById('daily-balance-select').value;
  const spec = balanceSpecs[model] || balanceSpecs.SART_MSE225S;
  document.getElementById('daily-std-mass').value = spec.stdMass.toFixed(4);
  document.getElementById('daily-mpe').value = spec.mpe.toFixed(2);
  calcDaily();
}

// 1. Daily Check (UP/014)
function calcDaily() {
  const std = parseFloat(document.getElementById('daily-std-mass').value) || 100.0;
  const obs = parseFloat(document.getElementById('daily-obs').value) || 100.0;
  const zero = parseFloat(document.getElementById('daily-zero').value) || 0.0;
  const mpeMg = parseFloat(document.getElementById('daily-mpe').value) || 0.50;
  const level = document.getElementById('daily-level').value;

  const correctedObs = obs - zero;
  const diffG = Math.abs(correctedObs - std);
  const diffMg = diffG * 1000;

  document.getElementById('daily-diff').textContent = `${diffG.toFixed(4)} g (${diffMg.toFixed(2)} mg)`;
  document.getElementById('daily-mpe-text').textContent = `± ${mpeMg.toFixed(2)} mg`;

  const isLevelPass = level === 'YES';
  const isDiffPass = diffMg <= mpeMg;
  const isPass = isLevelPass && isDiffPass;

  const pill = document.getElementById('daily-status-pill');
  pill.className = `status-pill ${isPass ? 'status-pass' : 'status-fail'}`;
  pill.textContent = isPass ? 'PASSED ✓' : 'FAILED ✗';

  const banner = document.getElementById('daily-banner');
  const bannerText = document.getElementById('daily-banner-text');
  if (isPass) {
    banner.className = 'verdict-banner';
    bannerText.textContent = 'BALANCE OPERATIONAL & WITHIN ACCEPTANCE LIMITS';
  } else {
    banner.className = 'verdict-banner fail';
    bannerText.textContent = 'FAILED: LEVEL OFF-CENTER OR ERROR EXCEEDS MPE TOLERANCE';
  }
}

function loadDailyExample() {
  document.getElementById('daily-std-mass').value = 100.0000;
  document.getElementById('daily-zero').value = 0.0000;
  document.getElementById('daily-obs').value = 100.0002;
  document.getElementById('daily-mpe').value = 0.50;
  document.getElementById('daily-level').value = 'YES';
  calcDaily();
}

// 2. Sensitivity Check (UP/015)
function calcSens() {
  let maxErrMg = 0;
  for (let i = 1; i <= 4; i++) {
    const nom = parseFloat(document.getElementById(`sens-nom-${i}`).value) || 0;
    const obs = parseFloat(document.getElementById(`sens-obs-${i}`).value) || 0;
    const errMg = (obs - nom) * 1000;
    const sign = errMg >= 0 ? '+' : '';
    document.getElementById(`sens-err-${i}`).textContent = `${sign}${errMg.toFixed(2)} mg`;
    if (Math.abs(errMg) > maxErrMg) {
      maxErrMg = Math.abs(errMg);
    }
  }

  document.getElementById('sens-max-err').textContent = `${maxErrMg.toFixed(2)} mg`;
  const isPass = maxErrMg <= 0.50;

  const pill = document.getElementById('sens-status-pill');
  pill.className = `status-pill ${isPass ? 'status-pass' : 'status-fail'}`;
  pill.textContent = isPass ? 'PASSED ✓' : 'FAILED ✗';

  const banner = document.getElementById('sens-banner');
  banner.className = `verdict-banner ${isPass ? '' : 'fail'}`;
}

function loadSensExample() {
  const points = [
    { nom: 1.0000, obs: 1.0001 },
    { nom: 50.0000, obs: 49.9998 },
    { nom: 100.0000, obs: 100.0003 },
    { nom: 200.0000, obs: 200.0004 }
  ];
  points.forEach((p, i) => {
    document.getElementById(`sens-nom-${i+1}`).value = p.nom;
    document.getElementById(`sens-obs-${i+1}`).value = p.obs;
  });
  calcSens();
}

// 3. Repeatability Check (UP/016)
function calcRep() {
  const reads = [];
  for (let i = 1; i <= 10; i++) {
    const val = parseFloat(document.getElementById(`rep-${i}`).value) || 100.0;
    reads.push(val);
  }

  const mean = reads.reduce((a, b) => a + b, 0) / reads.length;
  const variance = reads.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (reads.length - 1);
  const sdG = Math.sqrt(variance);
  const sdMg = sdG * 1000;
  const twoSdMg = sdMg * 2;

  document.getElementById('rep-mean').textContent = `${mean.toFixed(5)} g`;
  document.getElementById('rep-sd').textContent = `${sdMg.toFixed(3)} mg`;
  document.getElementById('rep-2sd').textContent = `${twoSdMg.toFixed(3)} mg`;

  const isPass = sdMg <= 0.15;
  const pill = document.getElementById('rep-status-pill');
  pill.className = `status-pill ${isPass ? 'status-pass' : 'status-fail'}`;
  pill.textContent = isPass ? 'PASSED ✓' : 'FAILED ✗';

  const banner = document.getElementById('rep-banner');
  banner.className = `verdict-banner ${isPass ? '' : 'fail'}`;
}

function loadRepExample() {
  const vals = [100.0001, 100.0002, 100.0000, 100.0003, 100.0001, 100.0002, 100.0001, 100.0000, 100.0002, 100.0001];
  vals.forEach((v, i) => {
    document.getElementById(`rep-${i+1}`).value = v;
  });
  calcRep();
}

// 4. Control Charting & Trend Simulator (UP/064)
let simData = [98.5, 101.2, 99.8, 102.4, 100.1, 97.9, 103.0, 99.2, 101.5, 98.8, 100.6, 102.1, 99.4, 101.0, 100.3];

function generateSimulatedQCChart() {
  simData = [];
  for (let i = 0; i < 15; i++) {
    // normal distribution centered at 100 with SD ~ 2.5
    const val = 100.0 + (Math.random() - 0.5) * 6.5;
    simData.push(parseFloat(val.toFixed(1)));
  }
  renderQCChart();
}

function renderQCChart() {
  const svg = document.getElementById('qcChartSvg');
  if (!svg) return;

  const w = 800;
  const h = 320;
  const padL = 60;
  const padR = 40;
  const padT = 30;
  const padB = 40;

  const plotW = w - padL - padR;
  const plotH = h - padT - padB;

  const minVal = 80;
  const maxVal = 120;

  function getY(v) {
    return padT + plotH - ((v - minVal) / (maxVal - minVal)) * plotH;
  }

  function getX(i) {
    return padL + (i / (simData.length - 1)) * plotW;
  }

  // Draw grid & reference lines
  const yMean = getY(100.0);
  const yWPos = getY(110.0);
  const yWNeg = getY(90.0);
  const yAPos = getY(115.0);
  const yANeg = getY(85.0);

  let elements = `
    <!-- Background Grid -->
    <rect x="${padL}" y="${padT}" width="${plotW}" height="${plotH}" fill="rgba(255,255,255,0.03)" stroke="rgba(148,163,184,0.2)"/>
    
    <!-- Action Limit Lines (+3s and -3s) -->
    <line x1="${padL}" y1="${yAPos}" x2="${w-padR}" y2="${yAPos}" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4,4"/>
    <text x="${padL - 8}" y="${yAPos + 4}" fill="#dc2626" font-size="11" text-anchor="end" font-family="DM Mono">115% (+3s)</text>
    <line x1="${padL}" y1="${yANeg}" x2="${w-padR}" y2="${yANeg}" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4,4"/>
    <text x="${padL - 8}" y="${yANeg + 4}" fill="#dc2626" font-size="11" text-anchor="end" font-family="DM Mono">85% (-3s)</text>

    <!-- Warning Limit Lines (+2s and -2s) -->
    <line x1="${padL}" y1="${yWPos}" x2="${w-padR}" y2="${yWPos}" stroke="#d97706" stroke-width="1.5" stroke-dasharray="3,3"/>
    <text x="${padL - 8}" y="${yWPos + 4}" fill="#d97706" font-size="11" text-anchor="end" font-family="DM Mono">110% (+2s)</text>
    <line x1="${padL}" y1="${yWNeg}" x2="${w-padR}" y2="${yWNeg}" stroke="#d97706" stroke-width="1.5" stroke-dasharray="3,3"/>
    <text x="${padL - 8}" y="${yWNeg + 4}" fill="#d97706" font-size="11" text-anchor="end" font-family="DM Mono">90% (-2s)</text>

    <!-- Mean Target Line (100%) -->
    <line x1="${padL}" y1="${yMean}" x2="${w-padR}" y2="${yMean}" stroke="#059669" stroke-width="2"/>
    <text x="${padL - 8}" y="${yMean + 4}" fill="#059669" font-size="11" text-anchor="end" font-family="DM Mono">100% (Mean)</text>
  `;

  // Plot Data Points & Line
  let pathD = '';
  simData.forEach((val, i) => {
    const x = getX(i);
    const y = getY(val);
    if (i === 0) pathD += `M ${x} ${y}`;
    else pathD += ` L ${x} ${y}`;
  });

  elements += `<path d="${pathD}" fill="none" stroke="#0284c7" stroke-width="2.5"/>`;

  simData.forEach((val, i) => {
    const x = getX(i);
    const y = getY(val);
    const isOutWarning = val > 110 || val < 90;
    const isOutAction = val > 115 || val < 85;
    let dotColor = '#0284c7';
    if (isOutAction) dotColor = '#dc2626';
    else if (isOutWarning) dotColor = '#d97706';

    elements += `
      <circle cx="${x}" cy="${y}" r="4.5" fill="${dotColor}" stroke="#fff" stroke-width="1.5"/>
      <text x="${x}" y="${h - padB + 18}" fill="rgba(148,163,184,0.8)" font-size="10" text-anchor="middle" font-family="DM Mono">R${i+1}</text>
    `;
  });

  svg.innerHTML = elements;
}
