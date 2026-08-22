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

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  
  const searchInput = document.getElementById('hubSearch');
  if (searchInput) {
    searchInput.addEventListener('input', handleSearchInput);
  }
});