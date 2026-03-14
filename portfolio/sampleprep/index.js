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

/* ─── CHECKLIST ───────────────────────────────── */
const state = {};
const TOTAL = document.querySelectorAll('.fi[data-step]').length;

const catIds = ['cat1','cat2','cat3','cat4','cat5','cat6','cat7'];
const methodCounts = {};
catIds.forEach(c => {
  methodCounts[c] = document.querySelectorAll('#' + c + ' .fi[data-step]').length;
});

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

  catIds.forEach(c => {
    const mDone = Object.keys(state).filter(k => k.startsWith(c + '-')).length;
    document.getElementById('tp-' + c).textContent = mDone + ' / ' + methodCounts[c];
  });

  if (pct === 100) setTimeout(celebrate, 200);
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
