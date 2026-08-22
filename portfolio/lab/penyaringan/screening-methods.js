// Adulteration Screening Method Guides Engine

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

function switchMethod(methodKey) {
  document.querySelectorAll('.m-pill-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.method-content').forEach(sec => sec.classList.remove('active'));

  const btn = document.getElementById(`mBtn-${methodKey}`);
  const sec = document.getElementById(`method-${methodKey}`);
  if (btn && sec) {
    btn.classList.add('active');
    sec.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
});
