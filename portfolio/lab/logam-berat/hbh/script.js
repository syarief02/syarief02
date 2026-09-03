/* =============================================
   JavaScript — HBH SpotMe Guide
   Interactive features & animations
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    initStickyNav();
    initProgressBar();
    initBackToTop();
    initScrollAnimations();
    initNavHighlight();
    initMobileNav();
});

/* ---------- Sticky Navigation ---------- */
function initStickyNav() {
    const nav = document.getElementById('sticky-nav');
    const hero = document.getElementById('hero');
    
    const observer = new IntersectionObserver(
        ([entry]) => {
            nav.classList.toggle('visible', !entry.isIntersecting);
        },
        { threshold: 0.1 }
    );
    
    observer.observe(hero);
}

/* ---------- Progress Bar ---------- */
function initProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }, { passive: true });
}

/* ---------- Back to Top ---------- */
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
}

/* ---------- Scroll Animations ---------- */
function initScrollAnimations() {
    const elements = document.querySelectorAll(
        '.step-header, .instruction-item, .screenshot-card, .info-card, .tip-box, .warning-box, .timeline-item, .flow-item, .copy-box'
    );
    
    elements.forEach(el => el.classList.add('animate-in'));
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 50);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    
    elements.forEach(el => observer.observe(el));
}

/* ---------- Navigation Highlight ---------- */
function initNavHighlight() {
    const sections = document.querySelectorAll('.section[id], .hero[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.dataset.section === id);
                    });
                }
            });
        },
        { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' }
    );
    
    sections.forEach(section => observer.observe(section));
}

/* ---------- Mobile Navigation ---------- */
function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    
    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
        toggle.classList.toggle('active');
    });
    
    // Close on link click
    links.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.classList.remove('active');
        });
    });
}

/* ---------- Copy Text ---------- */
function copyText(text, btnEl) {
    navigator.clipboard.writeText(text).then(() => {
        const original = btnEl.textContent;
        btnEl.textContent = '✅ Disalin!';
        btnEl.classList.add('copied');
        
        setTimeout(() => {
            btnEl.textContent = original;
            btnEl.classList.remove('copied');
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        const original = btnEl.textContent;
        btnEl.textContent = '✅ Disalin!';
        btnEl.classList.add('copied');
        
        setTimeout(() => {
            btnEl.textContent = original;
            btnEl.classList.remove('copied');
        }, 2000);
    });
}

/* ---------- Lightbox ---------- */
function openLightbox(cardEl) {
    const img = cardEl.querySelector('img');
    const caption = cardEl.querySelector('.screenshot-caption');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
    // Only close if clicking overlay or close button, not the image
    if (event.target.tagName === 'IMG') return;
    
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const lightbox = document.getElementById('lightbox');
        if (lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});
