// Steroid HPLC Screening Guide Stepper Engine

let currentStep = 1;

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

function goToStep(stepNum) {
  currentStep = stepNum;
  document.querySelectorAll('.step-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.guide-step').forEach(step => step.classList.remove('active'));

  const btn = document.getElementById(`stepBtn-${stepNum}`);
  const card = document.getElementById(`step-${stepNum}`);
  if (btn && card) {
    btn.classList.add('active');
    card.classList.add('active');
    window.scrollTo({ top: card.offsetTop - 100, behavior: 'smooth' });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
});
