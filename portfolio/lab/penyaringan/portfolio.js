let dark = false;
function toggleTheme(){
  dark = !dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.getElementById('themeTxt').textContent = dark ? 'Light Mode' : 'Dark Mode';
}

// Active TOC handling on scroll
const sections = document.querySelectorAll('.section-label[id]');
const navLinks = document.querySelectorAll('.toc-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    const top = window.scrollY;
    const offset = sec.offsetTop - 100;
    const height = sec.offsetHeight;
    if(top >= offset){ current = sec.getAttribute('id'); }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if(link.getAttribute('href').includes(current)){ link.classList.add('active'); }
  });
});

const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }});
}, {threshold:0.1, rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));