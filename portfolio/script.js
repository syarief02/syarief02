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

    // Sync the visible subject field into the hidden one
    const subjectInput = document.getElementById('contactSubject');
    const hiddenSubject = document.getElementById('hiddenSubject');
    if (subjectInput && subjectInput.value) {
      hiddenSubject.value = subjectInput.value;
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
});
