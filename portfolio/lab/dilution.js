/* Theme */
let dark = false;
function toggleTheme(){
  dark = !dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.getElementById('themeTxt').textContent = dark ? 'Light Mode' : 'Dark Mode';
}

/* Scroll reveal */
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }});
}, {threshold:0.1, rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* Calculator */
let solveFor = 'V1';

function setSolveFor(v, btn) {
  solveFor = v;
  document.querySelectorAll('.calc-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  
  // Show/hide fields
  ['C1','V1','C2','V2'].forEach(id => {
    const grp = document.getElementById('grp-' + id);
    const inp = document.getElementById('inp-' + id);
    if (id === v) {
      grp.style.opacity = '0.4';
      inp.disabled = true;
      inp.value = '';
      inp.placeholder = '(calculated)';
    } else {
      grp.style.opacity = '1';
      inp.disabled = false;
      inp.placeholder = id === 'C1' ? 'e.g. 1000' : id === 'V1' ? 'e.g. 5' : id === 'C2' ? 'e.g. 100' : 'e.g. 50';
    }
  });
  
  document.getElementById('calcResult').style.display = 'none';
  calculate();
}

function calculate() {
  const c1 = parseFloat(document.getElementById('inp-C1').value);
  const v1 = parseFloat(document.getElementById('inp-V1').value);
  const c2 = parseFloat(document.getElementById('inp-C2').value);
  const v2 = parseFloat(document.getElementById('inp-V2').value);
  const concUnit = document.getElementById('concUnit').value;
  const volUnit = document.getElementById('volUnit').value;
  
  let result, label, unit, extra = '';
  
  switch(solveFor) {
    case 'V1':
      if (!isNaN(c1) && !isNaN(c2) && !isNaN(v2) && c1 !== 0) {
        result = (c2 * v2) / c1;
        label = 'V₁ — Volume to pipette';
        unit = volUnit;
        const df = v2 / result;
        extra = 'Dilution Factor: ' + df.toFixed(1) + '× &nbsp;|&nbsp; Solvent to add: ' + (v2 - result).toFixed(4) + ' ' + volUnit;
      } else return hide();
      break;
    case 'C2':
      if (!isNaN(c1) && !isNaN(v1) && !isNaN(v2) && v2 !== 0) {
        result = (c1 * v1) / v2;
        label = 'C₂ — Final concentration';
        unit = concUnit;
        const df2 = v2 / v1;
        extra = 'Dilution Factor: ' + df2.toFixed(1) + '×';
      } else return hide();
      break;
    case 'V2':
      if (!isNaN(c1) && !isNaN(v1) && !isNaN(c2) && c2 !== 0) {
        result = (c1 * v1) / c2;
        label = 'V₂ — Final volume';
        unit = volUnit;
        extra = 'Solvent to add: ' + (result - v1).toFixed(4) + ' ' + volUnit;
      } else return hide();
      break;
    case 'C1':
      if (!isNaN(c2) && !isNaN(v1) && !isNaN(v2) && v1 !== 0) {
        result = (c2 * v2) / v1;
        label = 'C₁ — Stock concentration';
        unit = concUnit;
      } else return hide();
      break;
  }
  
  if (result < 0) {
    document.getElementById('resultVal').textContent = 'Invalid (negative)';
    document.getElementById('resultLabel').textContent = '⚠️ Check your values';
    document.getElementById('resultUnit').textContent = '';
    document.getElementById('resultExtra').innerHTML = '';
    document.getElementById('calcResult').style.display = 'block';
    return;
  }
  
  // Smart formatting
  let formatted;
  if (result >= 1000) formatted = result.toFixed(1);
  else if (result >= 1) formatted = result.toFixed(4);
  else if (result >= 0.001) formatted = result.toFixed(4);
  else formatted = result.toExponential(3);
  
  document.getElementById('resultVal').textContent = formatted;
  document.getElementById('resultLabel').textContent = label;
  document.getElementById('resultUnit').textContent = unit;
  document.getElementById('resultExtra').innerHTML = extra;
  document.getElementById('calcResult').style.display = 'block';
}

function hide() {
  document.getElementById('calcResult').style.display = 'none';
}

// Initialize
setSolveFor('V1', document.querySelector('.calc-btn.active'));

/* Quiz Logic */
let qzState = { q1:null, q2:null, q3:null };

function selectOpt(q, idx, btn) {
  if(document.getElementById(q+'-btn').textContent === 'Next' || document.getElementById(q+'-btn').style.display === 'none') return; // already answered
  qzState[q] = idx;
  const opts = document.getElementById(q+'-opts').children;
  for(let i=0; i<opts.length; i++) opts[i].classList.remove('selected');
  btn.classList.add('selected');
  document.getElementById(q+'-btn').disabled = false;
}

function checkAnswer(q, correctIdx) {
  const selectedIdx = qzState[q];
  const opts = document.getElementById(q+'-opts').children;
  const fb = document.getElementById(q+'-feedback');
  const btn = document.getElementById(q+'-btn');
  
  if(selectedIdx === correctIdx) {
    opts[selectedIdx].classList.add('correct');
    opts[selectedIdx].classList.remove('selected');
    fb.innerHTML = '<strong>✅ Correct!</strong> ' + getFeedback(q, true);
    fb.className = 'qz-feedback show success';
  } else {
    opts[selectedIdx].classList.add('wrong');
    opts[correctIdx].classList.add('correct');
    opts[selectedIdx].classList.remove('selected');
    fb.innerHTML = '<strong>❌ Incorrect.</strong> ' + getFeedback(q, false);
    fb.className = 'qz-feedback show error';
  }
  
  // Disable all options
  for(let i=0; i<opts.length; i++) opts[i].style.pointerEvents = 'none';
  
  if(q === 'q3') {
    btn.textContent = 'Finish';
    btn.onclick = () => { document.getElementById('q3-box').style.display = 'none'; document.getElementById('qz-complete').style.display = 'block'; };
  } else {
    btn.textContent = 'Next';
    btn.onclick = () => {
      document.getElementById(q+'-box').style.display = 'none';
      const nextQ = q === 'q1' ? 'q2' : 'q3';
      document.getElementById(nextQ+'-box').style.display = 'block';
    };
  }
}

function getFeedback(q, isCorrect) {
  if(q === 'q1') return isCorrect 
    ? 'V₁ = (C₂ × V₂) / C₁ = (50 × 20) / 1000 = 1000 / 1000 = 1.0 mL.'
    : 'The formula is V₁ = (C₂ × V₂) / C₁. So, (50 × 20) / 1000 = 1.0 mL.';
  if(q === 'q2') return isCorrect
    ? 'DF = V₂ / V₁ = 50 / 0.5 = 100×.'
    : 'Dilution Factor = Final Volume / Pipetted Volume. So, 50 / 0.5 = 100×.';
  if(q === 'q3') return isCorrect
    ? 'C_original = C_measured × DF = 12 × 50 = 600 ppm.'
    : 'To back-calculate, multiply the measured result by the dilution factor: 12 × 50 = 600 ppm.';
  return '';
}

function resetQuiz() {
  qzState = { q1:null, q2:null, q3:null };
  ['q1','q2','q3'].forEach(q => {
    const opts = document.getElementById(q+'-opts').children;
    for(let i=0; i<opts.length; i++) {
      opts[i].className = 'qz-opt';
      opts[i].style.pointerEvents = 'auto';
    }
    document.getElementById(q+'-feedback').className = 'qz-feedback';
    const btn = document.getElementById(q+'-btn');
    btn.disabled = true;
    btn.textContent = 'Check Answer';
    // restore original onclicks
    if(q==='q1') btn.onclick = () => checkAnswer('q1', 1);
    if(q==='q2') btn.onclick = () => checkAnswer('q2', 2);
    if(q==='q3') btn.onclick = () => checkAnswer('q3', 3);
  });
  
  document.getElementById('qz-complete').style.display = 'none';
  document.getElementById('q2-box').style.display = 'none';
  document.getElementById('q3-box').style.display = 'none';
  document.getElementById('q1-box').style.display = 'block';
}