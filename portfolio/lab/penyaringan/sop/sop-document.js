// ==========================================================================
// NPRA Unit Penyaringan — Master SOP Document Engine (sop-document.js)
// Interactive checklist tracking, theme switching, image modal zoom, and tools
// ==========================================================================

function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const txt = document.getElementById('themeTxt');
  if (txt) txt.textContent = saved === 'light' ? 'Dark Mode' : 'Light Mode';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  const txt = document.getElementById('themeTxt');
  if (txt) txt.textContent = next === 'light' ? 'Dark Mode' : 'Light Mode';
}

function getDocCode() {
  const meta = document.querySelector('meta[name="doc-code"]');
  if (meta && meta.content) return meta.content.trim();
  
  const h1 = document.querySelector('.sop-header-table td, h1, .doc-code-tag');
  const title = document.title;
  const match = title.match(/PKKK\/\d+\/[A-Z]+\/\d+/i) || (h1 ? h1.textContent.match(/PKKK\/\d+\/[A-Z]+\/\d+/i) : null);
  return match ? match[0] : (window.location.pathname.split('/').pop().replace('.html', ''));
}

function onStepCheckChange(docCode) {
  const activeCode = docCode || getDocCode();
  const checks = document.querySelectorAll('.sop-task-check');
  const checked = Array.from(checks).filter(c => c.checked).length;
  const total = checks.length;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
  
  const pBar = document.getElementById('pBarFill');
  const pText = document.getElementById('pBarText');
  if (pBar) pBar.style.width = pct + '%';
  if (pText) pText.textContent = `${checked} / ${total} Langkah Selesai (${pct}%)`;
  
  const state = Array.from(checks).map(c => c.checked);
  localStorage.setItem('sop_check_' + activeCode, JSON.stringify(state));
}

function loadChecklist(docCode) {
  const activeCode = docCode || getDocCode();
  const saved = localStorage.getItem('sop_check_' + activeCode);
  if (!saved) return;
  try {
    const state = JSON.parse(saved);
    const checks = document.querySelectorAll('.sop-task-check');
    checks.forEach((c, idx) => {
      if (state[idx]) c.checked = true;
    });
    onStepCheckChange(activeCode);
  } catch (e) {}
}

function resetChecklist(docCode) {
  const activeCode = docCode || getDocCode();
  localStorage.removeItem('sop_check_' + activeCode);
  document.querySelectorAll('.sop-task-check').forEach(c => c.checked = false);
  onStepCheckChange(activeCode);
}

// Image Zoom Modal
function openImageModal(src, title) {
  let modal = document.getElementById('sopImageModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'sopImageModal';
    modal.className = 'img-modal-backdrop';
    modal.innerHTML = `
      <div class="img-modal-content">
        <button class="img-modal-close" onclick="closeImageModal()" title="Tutup">✕</button>
        <img id="sopModalImg" src="" alt="Zoomed view">
        <div id="sopModalTitle" class="img-modal-title"></div>
      </div>
    `;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeImageModal();
    });
    document.body.appendChild(modal);
  }
  
  const img = document.getElementById('sopModalImg');
  const caption = document.getElementById('sopModalTitle');
  if (img) img.src = src;
  if (caption) caption.textContent = title || '';
  modal.classList.add('active');
}

function closeImageModal() {
  const modal = document.getElementById('sopImageModal');
  if (modal) modal.classList.remove('active');
}

// ESC key to close modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeImageModal();
});

// Interactive EG/DEG Assay Calculator helper
function calculateAssay() {
  const egConc = parseFloat(document.getElementById('gcms_eg_conc')?.value) || 0;
  const degConc = parseFloat(document.getElementById('gcms_deg_conc')?.value) || 0;
  const volFinal = parseFloat(document.getElementById('sample_vol_final')?.value) || 10.0;
  const volOrig = parseFloat(document.getElementById('sample_vol_orig')?.value) || 0.1;
  const densityEg = 1.113;
  const densityDeg = 1.118;
  
  const egPercent = (egConc * volFinal) / (volOrig * 10000 * densityEg);
  const degPercent = (degConc * volFinal) / (volOrig * 10000 * densityDeg);
  
  const egResElem = document.getElementById('eg_result');
  const degResElem = document.getElementById('deg_result');
  
  if (egResElem) {
    egResElem.textContent = egPercent.toFixed(4) + ' % v/v';
    egResElem.style.color = egPercent > 0.10 ? 'var(--rose)' : 'var(--mint)';
  }
  if (degResElem) {
    degResElem.textContent = degPercent.toFixed(4) + ' % v/v';
    degResElem.style.color = degPercent > 0.10 ? 'var(--rose)' : 'var(--mint)';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  const code = getDocCode();
  loadChecklist(code);
  
  // Attach change listeners to step checkboxes
  document.querySelectorAll('.sop-task-check').forEach(c => {
    c.addEventListener('change', () => onStepCheckChange(code));
  });
});
