window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']]
  }
};

let dark=false;function toggleTheme(){dark=!dark;document.documentElement.setAttribute('data-theme',dark?'dark':'light');document.getElementById('themeTxt').textContent=dark?'Light Mode':'Dark Mode'}
const obs=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}})},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));