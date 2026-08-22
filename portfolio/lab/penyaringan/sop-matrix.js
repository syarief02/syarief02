// SOP & Quality Records Matrix Logic

let currentTab = 'all'; // 'all', '200', '300', 'rk'
let currentCategory = 'ALL';
let currentSearchQuery = '';
let activeModalDoc = null;

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

// Populate UI on Load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderCounters();
  renderResults();
});

function renderCounters() {
  const total200 = SOP_DATA.sop200.length;
  const total300 = SOP_DATA.ak300.length;
  const totalRk = SOP_DATA.rk_list.length;
  const totalAll = total200 + total300 + totalRk;

  document.getElementById('stat-200').textContent = total200;
  document.getElementById('stat-300').textContent = total300;
  document.getElementById('stat-rk').textContent = totalRk;

  document.getElementById('count-all').textContent = totalAll;
  document.getElementById('count-200').textContent = total200;
  document.getElementById('count-300').textContent = total300;
  document.getElementById('count-rk').textContent = totalRk;
}

function setTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  renderResults();
}

function setCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll('.chip').forEach(btn => {
    if (btn.textContent.includes(cat) || (cat === 'ALL' && btn.textContent.includes('All Categories'))) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  renderResults();
}

function handleSearch() {
  const input = document.getElementById('searchInput');
  currentSearchQuery = input.value.trim().toLowerCase();
  document.getElementById('clearBtn').style.display = currentSearchQuery ? 'block' : 'none';
  renderResults();
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  currentSearchQuery = '';
  document.getElementById('clearBtn').style.display = 'none';
  renderResults();
}

// Filter dataset
function getFilteredData() {
  let list = [];

  if (currentTab === 'all' || currentTab === '200') {
    list.push(...SOP_DATA.sop200.map(d => ({ ...d, type: '200', categoryTag: 'Prosedur Level 200' })));
  }
  if (currentTab === 'all' || currentTab === '300') {
    list.push(...SOP_DATA.ak300.map(d => ({ ...d, type: '300', categoryTag: d.category || 'Arahan Kerja 300' })));
  }
  if (currentTab === 'all' || currentTab === 'rk') {
    list.push(...SOP_DATA.rk_list.map(d => ({ ...d, type: 'rk', categoryTag: 'Rekod Kualiti', category: 'Rekod Kualiti & Borang' })));
  }

  // Filter Category
  if (currentCategory !== 'ALL') {
    list = list.filter(item => {
      const c = (item.category || item.categoryTag || '').toLowerCase();
      const target = currentCategory.toLowerCase();
      if (target === 'hplc') return c.includes('hplc');
      if (target === 'gcms') return c.includes('gcms') || c.includes('gc-ms');
      if (target === 'lcms') return c.includes('lcms') || c.includes('lc/ms');
      if (target === 'alat timbang') return c.includes('timbang') || c.includes('balance');
      if (target.includes('ekstraksi')) return c.includes('ekstraksi') || c.includes('spe') || c.includes('lle');
      if (target.includes('kualiti')) return c.includes('kualiti') || c.includes('prosedur') || c.includes('oos') || c.includes('sampling');
      return c.includes(target);
    });
  }

  // Filter Search
  if (currentSearchQuery) {
    list = list.filter(item => {
      const code = (item.code || '').toLowerCase();
      const title = (item.title || '').toLowerCase();
      const scope = (item.scope || '').toLowerCase();
      const remarks = (item.remarks || '').toLowerCase();
      const loc = (item.location || item.file_location || '').toLowerCase();
      const inst = (item.instrument || '').toLowerCase();

      return code.includes(currentSearchQuery) ||
             title.includes(currentSearchQuery) ||
             scope.includes(currentSearchQuery) ||
             remarks.includes(currentSearchQuery) ||
             loc.includes(currentSearchQuery) ||
             inst.includes(currentSearchQuery);
    });
  }

  return list;
}

// Render Results Grid
function renderResults() {
  const container = document.getElementById('resultsContainer');
  const data = getFilteredData();

  if (data.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-title">No documents match your filter</div>
        <div class="empty-desc">Try clearing search filters or selecting 'All Categories'.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = data.map((doc, idx) => {
    let badgeClass = 'badge-cyan';
    if (doc.type === '200') badgeClass = 'badge-mint';
    else if (doc.type === 'rk') badgeClass = 'badge-amber';
    else if (doc.category === 'GCMS') badgeClass = 'badge-purple';
    else if (doc.category === 'Alat Timbang') badgeClass = 'badge-cyan';

    const subtitle = doc.scope || doc.remarks || (doc.file_location ? `Lokasi: ${doc.file_location} · Tempoh Simpanan: ${doc.retention}` : 'Standard Operating Working Instruction');
    const metaDate = doc.effective_date ? `Kuatkuasa: ${doc.effective_date}` : (doc.retention ? `Simpanan: ${doc.retention}` : 'ISO 17025');
    const statusText = doc.status || (doc.pic ? `PIC: ${doc.pic}` : 'Active');

    return `
      <div class="doc-card" onclick="openDocModal(${idx})">
        <div>
          <div class="card-top">
            <span class="badge ${badgeClass}">${doc.categoryTag || doc.category || 'Dokumen'}</span>
            <span style="font-family:var(--font-mono);font-size:0.7rem;color:var(--text-dim)">${statusText}</span>
          </div>
          <div class="card-code">${doc.code || '-'}</div>
          <div class="card-title">${doc.title}</div>
          <div class="card-snippet">${subtitle}</div>
        </div>
        <div class="card-meta">
          <span>${metaDate}</span>
          <span class="card-action-btn">View Details →</span>
        </div>
      </div>
    `;
  }).join('');
}

// Modal handling
function openDocModal(index) {
  const data = getFilteredData();
  const doc = data[index];
  if (!doc) return;
  activeModalDoc = doc;

  document.getElementById('modalCategory').textContent = doc.categoryTag || doc.category || 'SOP';
  document.getElementById('modalTitle').textContent = doc.title;
  document.getElementById('modalCode').textContent = doc.code || 'Dokumen Unit Penyaringan';

  let bodyHtml = '';

  if (doc.type === '200') {
    bodyHtml = `
      <div class="param-grid">
        <div class="param-item"><span class="param-label">Status Terbitan</span><span class="param-val">${doc.status}</span></div>
        <div class="param-item"><span class="param-label">Tarikh Kuatkuasa</span><span class="param-val">${doc.effective_date}</span></div>
        <div class="param-item"><span class="param-label">Instrumen Utama</span><span class="param-val">${doc.instrument || '-'}</span></div>
        <div class="param-item"><span class="param-label">Turus / Column</span><span class="param-val">${doc.column || '-'}</span></div>
        <div class="param-item"><span class="param-label">Fasa Bergerak (Mobile Phase)</span><span class="param-val">${doc.mobile_phase || '-'}</span></div>
        <div class="param-item"><span class="param-label">Kadar Alir / Suhu</span><span class="param-val">${doc.flow_rate || '-'} @ ${doc.temp || '-'}</span></div>
        <div class="param-item"><span class="param-label">Panjang Gelombang</span><span class="param-val">${doc.wavelength || '-'}</span></div>
        <div class="param-item"><span class="param-label">Kriteria SST</span><span class="param-val">${doc.sst_criteria || '-'}</span></div>
      </div>

      ${doc.limits ? `
        <div class="detail-section">
          <div class="detail-heading">Had Kawalan / Acceptance Limits</div>
          <div class="detail-content" style="border-left:3px solid var(--amber);font-weight:600">${doc.limits}</div>
        </div>
      ` : ''}

      <div class="detail-section">
        <div class="detail-heading">Skop Pengujian</div>
        <div class="detail-content">${doc.scope}</div>
      </div>

      ${doc.forms && doc.forms.length ? `
        <div class="detail-section">
          <div class="detail-heading">Borang & Rekod Kualiti Berkaitan</div>
          <div class="forms-tags">
            ${doc.forms.map(f => `<span class="form-tag">${f}</span>`).join('')}
          </div>
        </div>
      ` : ''}

      ${doc.code === 'PKKK/200/UP/002' ? `
        <div style="margin-top:0.8rem">
          <a href="lovastatin.html" class="ctrl-btn highlight" style="width:100%;justify-content:center;padding:0.75rem">
            💊 Launch Interactive Lovastatin HPLC Calculator & Report Generator →
          </a>
        </div>
      ` : ''}

      ${doc.code === 'PKKK/200/UP/001' ? `
        <div style="margin-top:0.8rem">
          <a href="hydroquinone-hplc.html" class="ctrl-btn highlight" style="width:100%;justify-content:center;padding:0.75rem">
            🧴 View Comprehensive Hydroquinone in Cosmetics HPLC Guide →
          </a>
        </div>
      ` : ''}
    `;
  } else if (doc.type === '300') {
    bodyHtml = `
      <div class="param-grid">
        <div class="param-item"><span class="param-label">Nombor Dokumen</span><span class="param-val">${doc.code}</span></div>
        <div class="param-item"><span class="param-label">Status Terbitan</span><span class="param-val">${doc.status}</span></div>
        <div class="param-item"><span class="param-label">Tarikh Kuatkuasa</span><span class="param-val">${doc.effective_date}</span></div>
        <div class="param-item"><span class="param-label">Lokasi Fail / Makmal</span><span class="param-val">${doc.location || 'Makmal Penyaringan'}</span></div>
      </div>

      ${doc.remarks ? `
        <div class="detail-section">
          <div class="detail-heading">Catatan & Pindaan Dokumen</div>
          <div class="detail-content">${doc.remarks}</div>
        </div>
      ` : ''}

      <div class="detail-section">
        <div class="detail-heading">Klasifikasi Kategori</div>
        <div class="detail-content">
          Kategori: <strong>${doc.category}</strong>. Prosedur operasi standard ini digunapakai bagi memastikan kebolehulangan dan ketepatan data analisis di Seksyen Pengujian Produk & Kosmetik.
        </div>
      </div>

      ${doc.code === 'PKKK/300/UP/021' ? `
        <div style="margin-top:0.8rem">
          <a href="steroid-hplc.html" class="ctrl-btn highlight" style="width:100%;justify-content:center;padding:0.75rem">
            🔬 View Comprehensive Steroids 8-Mix HPLC Guide →
          </a>
        </div>
      ` : ''}

      ${doc.code === 'PKKK/300/UP/025' ? `
        <div style="margin-top:0.8rem">
          <a href="ppi-hplc.html" class="ctrl-btn highlight" style="width:100%;justify-content:center;padding:0.75rem">
            💊 View Comprehensive Proton Pump Inhibitors (PPI) HPLC Guide →
          </a>
        </div>
      ` : ''}

      ${doc.code === 'PKKK/300/UP/027' ? `
        <div style="margin-top:0.8rem">
          <a href="domperidone-hplc.html" class="ctrl-btn highlight" style="width:100%;justify-content:center;padding:0.75rem">
            🧪 View Comprehensive Domperidone HPLC Guide →
          </a>
        </div>
      ` : ''}

      ${doc.code === 'PKKK/300/UP/034' ? `
        <div style="margin-top:0.8rem">
          <a href="deg-eg-gcms.html" class="ctrl-btn highlight" style="width:100%;justify-content:center;padding:0.75rem">
            🧬 View Comprehensive EG & DEG in Syrups GC-MS Guide →
          </a>
        </div>
      ` : ''}

      ${(doc.code === 'PKKK/300/UP/064' || doc.category === 'Alat Timbang') ? `
        <div style="margin-top:0.8rem">
          <a href="qc-balance.html" class="ctrl-btn highlight" style="width:100%;justify-content:center;padding:0.75rem">
            ⚖️ Launch Interactive Balance Verification & QC Suite →
          </a>
        </div>
      ` : ''}
    `;
  } else {
    // Rekod Kualiti
    bodyHtml = `
      <div class="param-grid">
        <div class="param-item"><span class="param-label">Kod Borang</span><span class="param-val">${doc.code || '-'}</span></div>
        <div class="param-item"><span class="param-label">Pegawai Bertanggungjawab</span><span class="param-val">${doc.pic || 'Ketua Unit'}</span></div>
        <div class="param-item"><span class="param-label">Lokasi Fail</span><span class="param-val">${doc.file_location || '-'}</span></div>
        <div class="param-item"><span class="param-label">Tempoh Simpanan</span><span class="param-val">${doc.retention || '6 tahun'}</span></div>
        <div class="param-item"><span class="param-label">Kaedah Pelupusan</span><span class="param-val">${doc.disposal || 'Shredding'}</span></div>
      </div>

      <div class="detail-section">
        <div class="detail-heading">Keterangan Borang / Rekod Kerja</div>
        <div class="detail-content">
          Borang kualiti <strong>${doc.title}</strong> merupakan dokumen kawalan rasmi bagi pelaporan ujian, verifikasi data, atau rekod penyelenggaraan instrumen.
        </div>
      </div>
    `;
  }

  document.getElementById('modalBody').innerHTML = bodyHtml;
  document.getElementById('docModal').classList.add('active');
}

function closeModal(event) {
  if (event && event.target !== event.currentTarget && !event.target.classList.contains('close-modal-btn')) return;
  document.getElementById('docModal').classList.remove('active');
  activeModalDoc = null;
}

function copyDocCitation() {
  if (!activeModalDoc) return;
  const text = `${activeModalDoc.code} - ${activeModalDoc.title} (${activeModalDoc.status || 'Kuatkuasa 2026'}), Unit Penyaringan, PKKK, NPRA.`;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('copyCiteBtn');
    btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.textContent = '📋 Copy Reference'; }, 2000);
  });
}
