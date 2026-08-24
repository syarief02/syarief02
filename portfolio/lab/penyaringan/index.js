// Unit Penyaringan Hub Interactive Logic

function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeButton(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeButton(next);
}

function updateThemeButton(theme) {
  const txt = document.getElementById('themeTxt');
  if (txt) txt.textContent = theme === 'light' ? 'Dark Mode' : 'Light Mode';
}

// Search and Category Filtering Logic
let currentCategory = 'all';

function filterCategory(category, btn) {
  currentCategory = category;
  
  // Update button active state
  document.querySelectorAll('.cat-tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  
  applyFilters();
}

function handleSearchInput() {
  const query = document.getElementById('hubSearch').value.trim();
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) {
    clearBtn.style.display = query.length > 0 ? 'block' : 'none';
  }
  applyFilters();
}

function clearSearch() {
  const searchInput = document.getElementById('hubSearch');
  searchInput.value = '';
  searchInput.focus();
  document.getElementById('clearSearchBtn').style.display = 'none';
  applyFilters();
}

function applyFilters() {
  const query = (document.getElementById('hubSearch')?.value || '').toLowerCase().trim();
  const cards = document.querySelectorAll('.res-card[data-category]');
  const groups = document.querySelectorAll('.category-group');
  let visibleCardsCount = 0;

  cards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
    const desc = (card.querySelector('.card-desc')?.textContent || '').toLowerCase();
    const eyebrow = (card.querySelector('.card-eyebrow')?.textContent || '').toLowerCase();
    const tags = Array.from(card.querySelectorAll('.card-tag')).map(t => t.textContent.toLowerCase()).join(' ');
    const code = (card.querySelector('.card-code-badge')?.textContent || '').toLowerCase();

    const matchesCategory = currentCategory === 'all' || cardCat === currentCategory;
    const matchesSearch = !query || 
      title.includes(query) || 
      desc.includes(query) || 
      eyebrow.includes(query) || 
      tags.includes(query) || 
      code.includes(query);

    if (matchesCategory && matchesSearch) {
      card.style.display = 'flex';
      visibleCardsCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Hide empty category groups
  groups.forEach(group => {
    const groupCards = group.querySelectorAll('.res-card[data-category]');
    const visibleInGroup = Array.from(groupCards).filter(c => c.style.display !== 'none').length;
    const groupCount = group.querySelector('.category-count');
    if (groupCount) {
      groupCount.textContent = `${visibleInGroup} Modul`;
    }
    group.style.display = visibleInGroup > 0 ? 'block' : 'none';
  });

  // Show/hide no results box
  const noResults = document.getElementById('noResultsBox');
  if (noResults) {
    if (visibleCardsCount === 0) {
      noResults.classList.add('visible');
      const qSpan = document.getElementById('searchQueryDisplay');
      if (qSpan) qSpan.textContent = query ? ` untuk "${query}"` : '';
    } else {
      noResults.classList.remove('visible');
    }
  }
}

// Hub Tools Tab Navigation
function switchHubTool(toolId, btn) {
  document.querySelectorAll('.tool-nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.hub-tool-content').forEach(c => c.classList.remove('active'));
  
  if (btn) btn.classList.add('active');
  const target = document.getElementById(`tool-${toolId}`);
  if (target) target.classList.add('active');
}

// SOP Jumper Navigation
function jumpToSop() {
  const select = document.getElementById('sopSelect');
  if (!select) return;
  const url = select.value;
  if (url) {
    window.location.href = url;
  }
}

// Interactive Dilution Calculator (C1V1 = C2V2)
function calculateDilution() {
  const c1 = parseFloat(document.getElementById('c1_val')?.value) || 0;
  const c2 = parseFloat(document.getElementById('c2_val')?.value) || 0;
  const v2 = parseFloat(document.getElementById('v2_val')?.value) || 0;
  
  const resultElem = document.getElementById('v1_res');
  const formulaElem = document.getElementById('v1_formula');
  
  if (c1 > 0 && c2 > 0 && v2 > 0) {
    const v1 = (c2 * v2) / c1;
    let formattedV1 = v1 >= 1 ? v1.toFixed(3) + ' mL' : (v1 * 1000).toFixed(1) + ' µL (' + v1.toFixed(4) + ' mL)';
    if (resultElem) resultElem.textContent = formattedV1;
    if (formulaElem) formulaElem.textContent = `V₁ = (${c2} × ${v2}) / ${c1} = ${v1.toFixed(4)} mL`;
  } else {
    if (resultElem) resultElem.textContent = '0.000 mL';
    if (formulaElem) formulaElem.textContent = 'Masukkan nilai yang sah (> 0)';
  }
}

// Interactive Buffer Mass Calculator
function calculateBufferMass() {
  const molarity = parseFloat(document.getElementById('buf_molarity')?.value) || 0; // in mM
  const mw = parseFloat(document.getElementById('buf_mw')?.value) || 0; // g/mol
  const vol = parseFloat(document.getElementById('buf_vol')?.value) || 0; // in mL
  
  const resultElem = document.getElementById('buf_mass_res');
  const formulaElem = document.getElementById('buf_formula');
  
  if (molarity > 0 && mw > 0 && vol > 0) {
    // Mass (g) = M (mol/L) * MW (g/mol) * V (L)
    const mass = (molarity / 1000) * mw * (vol / 1000);
    if (resultElem) resultElem.textContent = mass.toFixed(4) + ' g';
    if (formulaElem) formulaElem.textContent = `Jisim = (${molarity}/1000 M) × ${mw} g/mol × (${vol}/1000 L) = ${mass.toFixed(4)} g`;
  } else {
    if (resultElem) resultElem.textContent = '0.0000 g';
    if (formulaElem) formulaElem.textContent = 'Pilih atau masukkan parameter penimbal';
  }
}

function setBufferPreset(preset) {
  const mInput = document.getElementById('buf_molarity');
  const mwInput = document.getElementById('buf_mw');
  const volInput = document.getElementById('buf_vol');
  
  if (preset === 'na2hpo4') {
    // 25 mM Na2HPO4 anhydrous (MW 141.96) in 1000 mL
    if (mInput) mInput.value = 25;
    if (mwInput) mwInput.value = 141.96;
    if (volInput) volInput.value = 1000;
  } else if (preset === 'kh2po4') {
    // 20 mM KH2PO4 (MW 136.09) in 1000 mL
    if (mInput) mInput.value = 20;
    if (mwInput) mwInput.value = 136.09;
    if (volInput) volInput.value = 1000;
  } else if (preset === 'phosphate005') {
    // 50 mM (0.05M) KH2PO4 (MW 136.09) in 1000 mL
    if (mInput) mInput.value = 50;
    if (mwInput) mwInput.value = 136.09;
    if (volInput) volInput.value = 1000;
  } else if (preset === 'amm_formate') {
    // 10 mM Ammonium Formate (MW 63.06) in 1000 mL
    if (mInput) mInput.value = 10;
    if (mwInput) mwInput.value = 63.06;
    if (volInput) volInput.value = 1000;
  }
  calculateBufferMass();
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const s = document.getElementById('hubSearch');
    if (s) s.focus();
  }
  if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
    e.preventDefault();
    const s = document.getElementById('hubSearch');
    if (s) s.focus();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  
  const searchInput = document.getElementById('hubSearch');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearchInput);
  }
  
  // Calculate initial tool defaults
  calculateDilution();
  calculateBufferMass();
});