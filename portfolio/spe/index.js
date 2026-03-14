/* ─── TAB SWITCHING ───────────────────────────── */
function go(id, el) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  el.classList.add('active');
}

/* ─── THEME ───────────────────────────────────── */
let dark = false;
function toggleTheme() {
  dark = !dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.getElementById('themeTxt').textContent = dark ? 'Light Mode' : 'Dark Mode';
}

/* ─── SIDEBAR ─────────────────────────────────── */
function toggleSidebar() {
  const s = document.getElementById('sidebar');
  const o = document.getElementById('sidebarOverlay');
  const b = document.getElementById('sidebarBtn');
  const open = s.classList.toggle('open');
  o.classList.toggle('visible', open);
  b.classList.toggle('active-ctrl', open);
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('visible');
  document.getElementById('sidebarBtn').classList.remove('active-ctrl');
}

/* ─── CHECKLIST ───────────────────────────────── */
const state = {};
const TOTAL = document.querySelectorAll('.fi[data-step]').length;
document.getElementById('totalCount').textContent = TOTAL;
document.getElementById('remainCount').textContent = TOTAL;

// Step counts per method
const methodCounts = {
  m1: document.querySelectorAll('#m1 .fi[data-step]').length,
  m2: document.querySelectorAll('#m2 .fi[data-step]').length,
  m3: document.querySelectorAll('#m3 .fi[data-step]').length
};

function toggle(el) {
  const key = el.dataset.method + '-' + el.dataset.step;
  const wasDone = el.classList.contains('done');
  el.classList.toggle('done');
  if (!wasDone) {
    el.classList.add('just-done');
    setTimeout(() => el.classList.remove('just-done'), 400);
    playTick();
    state[key] = true;
  } else {
    delete state[key];
  }
  updateProgress();
}

function updateProgress() {
  const done = Object.keys(state).length;
  const pct = Math.round((done / TOTAL) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressPct').textContent = pct + '%';
  document.getElementById('doneCount').textContent = done;
  document.getElementById('remainCount').textContent = TOTAL - done;

  // Per-tab progress
  ['m1','m2','m3'].forEach(m => {
    const mDone = Object.keys(state).filter(k => k.startsWith(m+'-')).length;
    document.getElementById('tp-' + m).textContent = mDone + ' / ' + methodCounts[m];
  });

  if (pct === 100) setTimeout(celebrate, 200);
}

function resetAll() {
  document.querySelectorAll('.fi.done').forEach(el => el.classList.remove('done'));
  Object.keys(state).forEach(k => delete state[k]);
  updateProgress();
}

function celebrate() {
  const el = document.getElementById('progressPct');
  el.classList.add('celebrate');
  setTimeout(() => el.classList.remove('celebrate'), 500);
  playDing();
}

/* ─── SOUND ───────────────────────────────────── */
let audioCtx;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function playTick() {
  try {
    const ctx = getCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
    g.gain.setValueAtTime(0.12, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.12);
  } catch(e){}
}
function playDing() {
  try {
    const ctx = getCtx();
    [523, 659, 784, 1047].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = f;
      const t = ctx.currentTime + i * 0.12;
      g.gain.setValueAtTime(0.15, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      o.start(t); o.stop(t + 0.4);
    });
  } catch(e){}
}
function playAlarm() {
  try {
    const ctx = getCtx();
    [880, 1108, 880, 1108].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = f;
      const t = ctx.currentTime + i * 0.25;
      g.gain.setValueAtTime(0.2, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      o.start(t); o.stop(t + 0.22);
    });
  } catch(e){}
}

/* ─── TIMER ───────────────────────────────────── */
let timerInterval = null;
let timerTotal = 0;
let timerLeft = 0;
let timerPaused = false;

function startTimer(name, seconds) {
  clearInterval(timerInterval);
  timerTotal = seconds;
  timerLeft = seconds;
  timerPaused = false;
  document.getElementById('timerName').textContent = name;
  document.getElementById('timerOverlay').classList.add('visible');
  document.getElementById('timerPlayPause').textContent = '⏸ Pause';
  renderTimer();
  timerInterval = setInterval(tickTimer, 1000);
}

function tickTimer() {
  if (timerPaused) return;
  timerLeft--;
  renderTimer();
  if (timerLeft <= 0) {
    clearInterval(timerInterval);
    playAlarm();
    document.getElementById('timerDisplay').textContent = 'Done!';
    document.getElementById('timerDisplay').classList.add('urgent');
    setTimeout(() => document.getElementById('timerDisplay').classList.remove('urgent'), 4000);
  }
}

function renderTimer() {
  const m = Math.floor(timerLeft / 60).toString().padStart(2,'0');
  const s = (timerLeft % 60).toString().padStart(2,'0');
  document.getElementById('timerDisplay').textContent = m + ':' + s;
  const pct = (timerLeft / timerTotal) * 100;
  document.getElementById('timerBarFill').style.width = pct + '%';
  const disp = document.getElementById('timerDisplay');
  if (timerLeft <= 30 && timerLeft > 0) disp.classList.add('urgent');
  else disp.classList.remove('urgent');
}

function toggleTimer() {
  timerPaused = !timerPaused;
  document.getElementById('timerPlayPause').textContent = timerPaused ? '▶ Resume' : '⏸ Pause';
}
function resetTimer() {
  timerLeft = timerTotal;
  timerPaused = false;
  document.getElementById('timerPlayPause').textContent = '⏸ Pause';
  renderTimer();
}
function closeTimer() {
  clearInterval(timerInterval);
  document.getElementById('timerOverlay').classList.remove('visible');
}
