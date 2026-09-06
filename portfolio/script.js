// ===== THEME TOGGLE =====
(function() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    if (!btn) return;
    icon.textContent = saved === 'light' ? '☀️' : '🌙';
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      icon.textContent = next === 'light' ? '☀️' : '🌙';
    });
  });
})();

// ===== TYPING EFFECT =====
class TypingEffect {
  constructor(element, phrases, typeSpeed = 80, deleteSpeed = 40, pauseTime = 2000) {
    this.element = element;
    this.phrases = phrases;
    this.typeSpeed = typeSpeed;
    this.deleteSpeed = deleteSpeed;
    this.pauseTime = pauseTime;
    this.currentPhrase = 0;
    this.currentChar = 0;
    this.isDeleting = false;
    this.tick();
  }

  tick() {
    const phrase = this.phrases[this.currentPhrase];

    if (this.isDeleting) {
      this.currentChar--;
    } else {
      this.currentChar++;
    }

    this.element.textContent = phrase.substring(0, this.currentChar);

    let delay = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.currentChar === phrase.length) {
      delay = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentChar === 0) {
      this.isDeleting = false;
      this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
      delay = 400;
    }

    setTimeout(() => this.tick(), delay);
  }
}

// ===== SCROLL REVEAL =====
class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll('.reveal');
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    this.elements.forEach(el => this.observer.observe(el));
  }
}

// ===== ANIMATED COUNTERS =====
class AnimatedCounter {
  constructor() {
    this.counters = document.querySelectorAll('.stat-number[data-target]');
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    this.counters.forEach(counter => this.observer.observe(counter));
  }

  animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const format = el.dataset.format || 'number';
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // ease-out-quart
      const current = Math.floor(eased * target);

      if (format === 'compact') {
        el.textContent = this.formatCompact(current) + suffix;
      } else {
        el.textContent = current.toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  formatCompact(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  }
}

// ===== NAVBAR =====
class Navbar {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.navToggle = document.getElementById('navToggle');
    this.navLinks = document.getElementById('navLinks');
    this.links = document.querySelectorAll('.nav-links a');
    this.sections = document.querySelectorAll('.section, .hero');

    this.bindEvents();
    this.onScroll();
  }

  bindEvents() {
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });

    this.navToggle.addEventListener('click', () => {
      this.navToggle.classList.toggle('active');
      this.navLinks.classList.toggle('open');
    });

    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          const offset = 80;
          const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
        // Close mobile menu
        this.navToggle.classList.remove('active');
        this.navLinks.classList.remove('open');
      });
    });
  }

  onScroll() {
    // Navbar background
    if (window.scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }

    // Active link highlight
    let current = '';
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    this.links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
}

// ===== CONTACT FORM (Web3Forms) =====
class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.btn = document.getElementById('submitBtn');
    this.result = document.getElementById('formResult');
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Default subject if left blank
    const subjectInput = document.getElementById('contactSubject');
    if (subjectInput && !subjectInput.value.trim()) {
      subjectInput.value = 'New Portfolio Contact';
    }

    // Show loading state
    const originalText = this.btn.innerHTML;
    this.btn.innerHTML = '<span>⏳</span> Sending...';
    this.btn.disabled = true;
    this.result.textContent = '';
    this.result.className = 'form-result';

    try {
      const formData = new FormData(this.form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        this.result.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
        this.result.classList.add('form-result--success');
        this.form.reset();
      } else {
        this.result.textContent = '❌ Something went wrong. Please try emailing me directly.';
        this.result.classList.add('form-result--error');
      }
    } catch (error) {
      this.result.textContent = '❌ Network error. Please try emailing me directly.';
      this.result.classList.add('form-result--error');
    }

    this.btn.innerHTML = originalText;
    this.btn.disabled = false;

    // Auto-hide the message after 8 seconds
    setTimeout(() => {
      this.result.textContent = '';
      this.result.className = 'form-result';
    }, 8000);
  }
}

// ===== PARALLAX ORBS =====
class ParallaxOrbs {
  constructor() {
    this.orbs = document.querySelectorAll('.bg-orb');
    window.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true });
  }

  onMouseMove(e) {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    this.orbs.forEach((orb, i) => {
      const speed = (i + 1) * 8;
      orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
  }
}

// ===== SUPABASE GUESTBOOK =====
const SUPABASE_CONFIG = {
  url: 'https://qthjikwteugfowlflkfi.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0aGppa3d0ZXVnZm93bGZsa2ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MTg5OTUsImV4cCI6MjA4NzI5NDk5NX0.rQpfbsdJuFVcLjiGu0C9nsaL1Nh8G830p258pAfUrls'
};

function formatTimeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffSec = Math.floor((now - date) / 1000);
  if (diffSec < 60) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
}

class GuestbookManager {
  constructor() {
    this.form = document.getElementById('guestbookForm');
    this.feedList = document.getElementById('gbFeedList');
    this.countBadge = document.getElementById('gbCountBadge');
    this.refreshBtn = document.getElementById('gbRefreshBtn');
    this.filterTabs = document.querySelectorAll('.gb-tab');
    this.charCount = document.getElementById('gbCharCount');
    this.messageInput = document.getElementById('gbMessage');
    this.eaNameGroup = document.getElementById('gbEaNameGroup');
    this.typeRadios = document.querySelectorAll('input[name="gbType"]');
    this.formAlert = document.getElementById('gbFormAlert');
    this.submitBtn = document.getElementById('gbSubmitBtn');

    this.messages = [];
    this.currentFilter = 'all';

    if (this.form && this.feedList) {
      this.init();
    }
  }

  init() {
    this.fetchMessages();

    // Form radio change for EA name input
    this.typeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        if (e.target.value === 'ea_request') {
          this.eaNameGroup.style.display = 'block';
        } else {
          this.eaNameGroup.style.display = 'none';
        }
      });
    });

    // Character counter
    if (this.messageInput && this.charCount) {
      this.messageInput.addEventListener('input', () => {
        this.charCount.textContent = `${this.messageInput.value.length} / 1000`;
      });
    }

    // Refresh button
    if (this.refreshBtn) {
      this.refreshBtn.addEventListener('click', () => {
        this.fetchMessages();
      });
    }

    // Filter tabs
    this.filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentFilter = tab.dataset.gbFilter;
        this.renderMessages();
      });
    });

    // Submit handler
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async fetchMessages() {
    try {
      const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/comments?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_CONFIG.anonKey,
          'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
        }
      });
      if (!response.ok) throw new Error('Failed to load guestbook');
      this.messages = await response.json();
      if (this.countBadge) {
        this.countBadge.textContent = this.messages.length;
      }
      this.renderMessages();
    } catch (err) {
      console.error('Guestbook load error:', err);
      if (this.feedList) {
        this.feedList.innerHTML = `<div class="gb-empty">⚠️ Unable to load live messages at the moment. Please try refreshing.</div>`;
      }
    }
  }

  renderMessages() {
    if (!this.feedList) return;

    const filtered = this.currentFilter === 'all'
      ? this.messages
      : this.messages.filter(m => (m.type || 'feedback') === this.currentFilter);

    if (filtered.length === 0) {
      this.feedList.innerHTML = `<div class="gb-empty">💬 No posts in this category yet. Be the first to share your thoughts!</div>`;
      return;
    }

    this.feedList.innerHTML = filtered.map(item => {
      const initial = (item.name || 'Anonymous').charAt(0).toUpperCase();
      const type = item.type || 'feedback';
      const time = formatTimeAgo(item.created_at);

      let badgeLabel = '💬 Feedback';
      let badgeClass = 'gb-badge--feedback';
      if (type === 'idea') {
        badgeLabel = '💡 Idea';
        badgeClass = 'gb-badge--idea';
      } else if (type === 'ea_request') {
        badgeLabel = '🤖 Request';
        badgeClass = 'gb-badge--ea_request';
      }

      const eaTag = item.ea_name
        ? `<div class="gb-ea-tag">📌 Target EA: <strong>${this.escapeHtml(item.ea_name)}</strong></div>`
        : '';

      return `
        <div class="gb-message-card">
          <div class="gb-author-row">
            <div class="gb-author-left">
              <div class="gb-avatar">${initial}</div>
              <div class="gb-meta">
                <span class="gb-author-name">${this.escapeHtml(item.name || 'Anonymous')}</span>
                <span class="gb-time">${time}</span>
              </div>
            </div>
            <span class="gb-badge ${badgeClass}">${badgeLabel}</span>
          </div>
          ${eaTag}
          <div class="gb-message-text">${this.escapeHtml(item.message || '')}</div>
        </div>
      `;
    }).join('');
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.showAlert('', '');

    // Anti-bot honeypot check
    const hp = document.getElementById('hpCheck');
    if (hp && hp.value) return;

    const nameInput = document.getElementById('gbName');
    const msgInput = document.getElementById('gbMessage');
    const eaInput = document.getElementById('gbEaName');
    const selectedTypeEl = document.querySelector('input[name="gbType"]:checked');
    const type = selectedTypeEl ? selectedTypeEl.value : 'feedback';

    const name = nameInput ? nameInput.value.trim() : '';
    const message = msgInput ? msgInput.value.trim() : '';
    const ea_name = (eaInput && type === 'ea_request') ? eaInput.value.trim() : null;

    if (!name || !message) {
      this.showAlert('Please fill in both your name and message.', 'error');
      return;
    }

    const originalBtnHtml = this.submitBtn.innerHTML;
    this.submitBtn.innerHTML = '<span>⏳</span> Posting...';
    this.submitBtn.disabled = true;

    const payload = { name, type, message };
    if (ea_name) payload.ea_name = ea_name;

    try {
      const response = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/comments`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_CONFIG.anonKey,
          'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Supabase insert failed');
      }

      const inserted = await response.json();
      if (inserted && inserted.length > 0) {
        this.messages.unshift(inserted[0]);
        if (this.countBadge) this.countBadge.textContent = this.messages.length;
        this.renderMessages();
      } else {
        this.fetchMessages();
      }

      this.showAlert('🎉 Message published live! Thanks for connecting.', 'success');
      this.form.reset();
      if (this.charCount) this.charCount.textContent = '0 / 1000';
      if (this.eaNameGroup) this.eaNameGroup.style.display = 'none';
      setTimeout(() => this.showAlert('', ''), 6000);
    } catch (err) {
      console.error('Submit error:', err);
      this.showAlert('❌ Failed to post message. Please try again.', 'error');
    } finally {
      this.submitBtn.innerHTML = originalBtnHtml;
      this.submitBtn.disabled = false;
    }
  }

  showAlert(text, type) {
    if (!this.formAlert) return;
    if (!text) {
      this.formAlert.style.display = 'none';
      this.formAlert.textContent = '';
      this.formAlert.className = 'form-alert';
      return;
    }
    this.formAlert.style.display = 'block';
    this.formAlert.textContent = text;
    this.formAlert.className = `form-alert form-alert--${type}`;
  }
}

// ===== GITHUB REAL-TIME SYNC =====
class GitHubSync {
  constructor() {
    this.syncStats();
  }

  async syncStats() {
    const CACHE_KEY = 'sa_gh_stats';
    const ONE_HOUR = 3600 * 1000;
    let data = null;

    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < ONE_HOUR) {
          data = parsed.data;
        }
      }

      if (!data) {
        const res = await fetch('https://api.github.com/users/syarief02');
        if (res.ok) {
          data = await res.json();
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: { public_repos: data.public_repos, followers: data.followers }
          }));
        }
      }

      if (data && data.public_repos) {
        // Update repo counter target
        const repoCounter = document.querySelector('.stat-item:nth-child(3) .stat-number');
        if (repoCounter) {
          repoCounter.dataset.target = data.public_repos;
          repoCounter.textContent = data.public_repos + '+';
        }
      }
    } catch (e) {
      // Graceful fallback to static numbers
    }
  }
}

// ===== COMMAND PALETTE (CMD+K / CTRL+K) =====
class CommandPalette {
  constructor() {
    this.modal = document.getElementById('cmdPalette');
    this.input = document.getElementById('cmdPaletteInput');
    this.results = document.getElementById('cmdPaletteResults');
    this.trigger = document.getElementById('cmdKTrigger');
    this.closeBtn = document.getElementById('cmdCloseBtn');
    this.selectedIndex = 0;
    this.filteredCommands = [];

    this.commands = [
      // Navigation
      { group: 'Navigation', label: 'About Me', desc: 'NPRA Analyst & self-taught developer story', icon: '👤', action: () => this.scrollTo('#about') },
      { group: 'Navigation', label: 'Pharma × Tech Duality', desc: 'Where chemistry meets code', icon: '🧬', action: () => this.scrollTo('#duality') },
      { group: 'Navigation', label: 'Tech Stack & Skills', desc: 'Languages, frameworks & domain', icon: '⚡', action: () => this.scrollTo('#skills') },
      { group: 'Navigation', label: 'Featured Projects', desc: 'Trading bots, web apps & NPRA tools', icon: '🚀', action: () => this.scrollTo('#projects') },
      { group: 'Navigation', label: 'GitHub Stats', desc: 'Lines of code & contribution metrics', icon: '📊', action: () => this.scrollTo('#stats') },
      { group: 'Navigation', label: 'Journey & Experience', desc: 'Career timeline & education', icon: '🗺️', action: () => this.scrollTo('#experience') },
      { group: 'Navigation', label: 'Community Guestbook', desc: 'Live Supabase-powered messages', icon: '💬', action: () => this.scrollTo('#guestbook') },
      { group: 'Navigation', label: 'Get in Touch', desc: 'Contact form & socials', icon: '📬', action: () => this.scrollTo('#contact') },

      // Actions
      { group: 'Actions', label: 'Download Resume PDF', desc: 'Open official resume document', icon: '📄', action: () => window.open('CV_Syarief Azman Rosli.pdf', '_blank') },
      { group: 'Actions', label: 'View Curriculum Vitae', desc: 'Detailed government & NPRA CV', icon: '📋', action: () => window.location.href = 'cv.html' },
      { group: 'Actions', label: 'Copy Email Address', desc: 'hello@syariefazman.com', icon: '📧', action: () => this.copyEmail() },
      { group: 'Actions', label: 'Toggle Dark / Light Theme', desc: 'Switch visual appearance', icon: '🌓', action: () => this.toggleTheme() },
      { group: 'Actions', label: 'View Source on GitHub', desc: 'syarief02/syarief02 repository', icon: '🐙', action: () => window.open('https://github.com/syarief02/syarief02', '_blank') },
      { group: 'Actions', label: 'Visit eabudakubat.com', desc: 'Automated trading tools platform', icon: '🌐', action: () => window.open('https://eabudakubat.com', '_blank') }
    ];

    if (this.modal && this.input) {
      this.init();
    }
  }

  init() {
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen()) {
        e.preventDefault();
        this.close();
      }
    });

    if (this.trigger) {
      this.trigger.addEventListener('click', () => this.open());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    this.input.addEventListener('input', () => this.filter());
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  isOpen() {
    return this.modal.style.display !== 'none';
  }

  toggle() {
    if (this.isOpen()) this.close();
    else this.open();
  }

  open() {
    this.modal.style.display = 'flex';
    this.modal.setAttribute('aria-hidden', 'false');
    this.input.value = '';
    this.selectedIndex = 0;
    this.filter();
    setTimeout(() => this.input.focus(), 50);
  }

  close() {
    this.modal.style.display = 'none';
    this.modal.setAttribute('aria-hidden', 'true');
  }

  filter() {
    const q = this.input.value.trim().toLowerCase();
    this.filteredCommands = this.commands.filter(cmd => {
      return !q || cmd.label.toLowerCase().includes(q) || cmd.desc.toLowerCase().includes(q) || cmd.group.toLowerCase().includes(q);
    });
    this.selectedIndex = 0;
    this.render();
  }

  render() {
    if (!this.results) return;

    if (this.filteredCommands.length === 0) {
      this.results.innerHTML = `<div class="gb-empty">No matching commands found.</div>`;
      return;
    }

    let currentGroup = '';
    let html = '';

    this.filteredCommands.forEach((cmd, idx) => {
      if (cmd.group !== currentGroup) {
        currentGroup = cmd.group;
        html += `<div class="cmd-group-title">${currentGroup}</div>`;
      }

      const activeClass = idx === this.selectedIndex ? 'active' : '';
      html += `
        <div class="cmd-item ${activeClass}" data-index="${idx}">
          <div class="cmd-item-left">
            <span class="cmd-item-icon">${cmd.icon}</span>
            <div>
              <span class="cmd-item-label">${cmd.label}</span>
              <span class="cmd-item-desc">${cmd.desc}</span>
            </div>
          </div>
          <span class="cmd-item-badge">↵</span>
        </div>
      `;
    });

    this.results.innerHTML = html;

    this.results.querySelectorAll('.cmd-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.index);
        this.execute(idx);
      });
      item.addEventListener('mouseenter', () => {
        this.selectedIndex = parseInt(item.dataset.index);
        this.updateActiveItem();
      });
    });
  }

  updateActiveItem() {
    const items = this.results.querySelectorAll('.cmd-item');
    items.forEach((item, idx) => {
      if (idx === this.selectedIndex) {
        item.classList.add('active');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  handleKeydown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.filteredCommands.length > 0) {
        this.selectedIndex = (this.selectedIndex + 1) % this.filteredCommands.length;
        this.updateActiveItem();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.filteredCommands.length > 0) {
        this.selectedIndex = (this.selectedIndex - 1 + this.filteredCommands.length) % this.filteredCommands.length;
        this.updateActiveItem();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (this.filteredCommands[this.selectedIndex]) {
        this.execute(this.selectedIndex);
      }
    }
  }

  execute(idx) {
    const cmd = this.filteredCommands[idx];
    if (cmd && typeof cmd.action === 'function') {
      this.close();
      cmd.action();
    }
  }

  scrollTo(selector) {
    const el = document.querySelector(selector);
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  copyEmail() {
    navigator.clipboard.writeText('hello@syariefazman.com').then(() => {
      alert('📧 Copied "hello@syariefazman.com" to clipboard!');
    });
  }

  toggleTheme() {
    const btn = document.getElementById('themeToggle');
    if (btn) btn.click();
  }
}

// ===== QUICK COPY BUTTONS =====
class QuickCopyHandler {
  constructor() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.copy-cmd-btn');
      if (!btn) return;
      const text = btn.dataset.copy;
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = '✅ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Typing effect
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    new TypingEffect(typingEl, [
      'Building Expert Advisors for MetaTrader',
      'Full-Stack Web Developer',
      'AI-Powered Trading Systems',
      'Python Automation Enthusiast',
      'Open Source Contributor',
      'Harvard CS50x Student',
      'From Pharma Lab to Code Editor'
    ]);
  }

  // Scroll reveal
  new ScrollReveal();

  // Animated counters
  new AnimatedCounter();

  // Navbar
  new Navbar();

  // Contact form
  new ContactForm();

  // Parallax orbs
  new ParallaxOrbs();

  // Supabase Guestbook
  new GuestbookManager();

  // GitHub Live Sync
  new GitHubSync();

  // Command Palette
  new CommandPalette();

  // Quick Copy
  new QuickCopyHandler();
});

// ===== PROJECT FILTERS =====
function filterProjects(category, btn) {
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Show/hide cards
  document.querySelectorAll('.project-card[data-category]').forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.classList.remove('filter-hidden');
    } else {
      card.classList.add('filter-hidden');
    }
  });
}
