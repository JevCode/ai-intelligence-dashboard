// =========================================
// AI Intelligence Hub v2 — JavaScript
// Mobile nav, counters, charts, scroll spy
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCounters();
  initCharts();
  initScrollSpy();
});

// ====== MOBILE NAV ======
function openMobileNav() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('mobileOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('mobileOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
window.openMobileNav = openMobileNav;
window.closeMobileNav = closeMobileNav;

// Close nav on nav link click (mobile)
document.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 768) closeMobileNav();
  });
});

// ====== COUNTERS ======
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); obs.unobserve(e.target); }});
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
}
function animateCount(el) {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || '';
  const dur = 1600, steps = 50;
  let step = 0;
  const timer = setInterval(() => {
    step++;
    const val = Math.min(Math.round(target * (step / steps)), target);
    el.textContent = val + suffix;
    if (step >= steps) clearInterval(timer);
  }, dur / steps);
}

// ====== SCROLL SPY ======
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-item[data-section]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-item[data-section="${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: `-${56}px 0px -50% 0px`, threshold: 0 });
  sections.forEach(s => obs.observe(s));
}

// ====== CHART DEFAULTS ======
Chart.defaults.color = '#8899bb';
Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';

const tooltipDefaults = {
  backgroundColor: '#1a2540',
  borderColor: 'rgba(0,212,255,0.3)',
  borderWidth: 1,
  titleColor: '#eef2ff',
  bodyColor: '#8899bb',
  padding: 10,
  cornerRadius: 6,
};

function initCharts() {
  marketChart();
  benchChart();
  sectorChart();
  countryChart();
  riskChart();
  jobsChart();
  gdpChart();
  radarChart();
}

// 1. Market Share Doughnut
function marketChart() {
  const ctx = document.getElementById('marketChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['ChatGPT', 'Google Gemini', 'Perplexity', 'MS Copilot', 'Claude AI', 'Others'],
      datasets: [{
        data: [78.16, 8.65, 7.07, 3.19, 2.91, 0.02],
        backgroundColor: ['#00d4ff','#10e88a','#9b59f9','#ff7c30','#ff4563','#2a3a5a'],
        borderColor: '#0f1624', borderWidth: 3, hoverOffset: 10,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '62%',
      plugins: {
        legend: { position: 'right', labels: { color:'#8899bb', font:{size:11}, padding:10, boxWidth:10, usePointStyle:true } },
        tooltip: { ...tooltipDefaults, callbacks: { label: c => ` ${c.parsed.toFixed(2)}%` } }
      }
    }
  });
}

// 2. Benchmark Bar
function benchChart() {
  const ctx = document.getElementById('benchChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Gemini 3.1 Pro','GPT-5.4','Claude Opus 4.6','GPT-5.2','Grok 4','DeepSeek V3.2'],
      datasets: [
        { label:'Reasoning', data:[94.1,96.1,94.4,96.1,90,72], backgroundColor:'rgba(0,212,255,0.8)', borderRadius:4 },
        { label:'Coding', data:[72.1,83,65.9,70.9,43.6,34.9], backgroundColor:'rgba(155,89,249,0.8)', borderRadius:4 },
        { label:'Math', data:[79.6,74.1,67.6,70.9,63,53.5], backgroundColor:'rgba(16,232,138,0.8)', borderRadius:4 },
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins: {
        legend: { position:'bottom', labels:{ color:'#8899bb', font:{size:11}, padding:10, boxWidth:10, usePointStyle:true } },
        tooltip: { ...tooltipDefaults }
      },
      scales: {
        x: { grid:{color:'rgba(255,255,255,0.04)'}, ticks:{color:'#8899bb',font:{size:10}} },
        y: { grid:{color:'rgba(255,255,255,0.04)'}, ticks:{color:'#8899bb',font:{size:10},callback:v=>v+'%'}, max:100 }
      }
    }
  });
}

// 3. Sector Displacement Chart
function sectorChart() {
  const ctx = document.getElementById('sectorChart');
  if (!ctx) return;
  const data = [90.2,84.2,82.3,78.7,74.8,73.8,72.3,72.2,56.2,53.6,46.4,37.8,34.4];
  const labels = ['Office & Admin','Finance','Retail / CS','Marketing','Tech & IT','Legal','Manufacturing','Transport','Education','Healthcare','Construction','Research','Personal Care'];
  const colors = data.map(v => v>=80?'rgba(255,69,99,0.8)':v>=70?'rgba(255,124,48,0.8)':v>=50?'rgba(255,200,50,0.8)':'rgba(16,232,138,0.8)');
  new Chart(ctx, {
    type:'bar',
    data: { labels, datasets:[{ label:'Displacement Risk %', data, backgroundColor:colors, borderRadius:4, borderWidth:0 }] },
    options: {
      responsive:true, maintainAspectRatio:false, indexAxis:'y',
      plugins: { legend:{display:false}, tooltip:{...tooltipDefaults,callbacks:{label:c=>` ${c.parsed.x}%`}} },
      scales: {
        x:{min:0,max:100,grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#8899bb',font:{size:10},callback:v=>v+'%'}},
        y:{grid:{display:false},ticks:{color:'#c0cce0',font:{size:10}}}
      }
    }
  });
}

// 4. Country Adoption Chart
function countryChart() {
  const ctx = document.getElementById('countryChart');
  if (!ctx) return;
  new Chart(ctx, {
    type:'bar',
    data: {
      labels:['UAE','Singapore','South Korea','Japan','Germany','United States','UK','Malaysia'],
      datasets:[{
        label:'AI Adoption / Usage %',
        data:[64,61,55,48,42,38,35,28],
        backgroundColor:['rgba(0,212,255,0.85)','rgba(0,212,255,0.75)','rgba(0,212,255,0.65)','rgba(0,212,255,0.55)','rgba(0,212,255,0.48)','rgba(0,212,255,0.42)','rgba(0,212,255,0.36)','rgba(0,212,255,0.3)'],
        borderRadius:6, borderWidth:0,
      }]
    },
    options: {
      responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:false},tooltip:{...tooltipDefaults,callbacks:{label:c=>` ${c.parsed.y}% adoption`}}},
      scales:{
        x:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#8899bb',font:{size:11}}},
        y:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#8899bb',font:{size:10},callback:v=>v+'%'},max:80}
      }
    }
  });
}

// 5. Jobs Risk by Country
function riskChart() {
  const ctx = document.getElementById('riskChart');
  if (!ctx) return;
  new Chart(ctx, {
    type:'bar',
    data: {
      labels:['Switzerland','South Korea','Japan','UK','Germany','US','Singapore','UAE','Malaysia','India'],
      datasets:[{
        label:'Jobs at Risk %',
        data:[71,70,68,67,62,59,56,52,45,40],
        backgroundColor:data=>{
          const colors=['rgba(255,69,99,0.85)','rgba(255,69,99,0.8)','rgba(255,69,99,0.75)','rgba(255,69,99,0.7)','rgba(255,124,48,0.8)','rgba(255,124,48,0.75)','rgba(255,124,48,0.7)','rgba(255,200,50,0.75)','rgba(255,200,50,0.65)','rgba(16,232,138,0.7)'];
          return colors;
        },
        borderRadius:6, borderWidth:0,
      }]
    },
    options: {
      responsive:true,maintainAspectRatio:false,indexAxis:'y',
      plugins:{legend:{display:false},tooltip:{...tooltipDefaults,callbacks:{label:c=>` ${c.parsed.x}% at risk`}}},
      scales:{
        x:{min:0,max:80,grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#8899bb',font:{size:10},callback:v=>v+'%'}},
        y:{grid:{display:false},ticks:{color:'#c0cce0',font:{size:10}}}
      }
    }
  });
}

// 6. Jobs Displaced vs Created
function jobsChart() {
  const ctx = document.getElementById('jobsChart');
  if (!ctx) return;
  new Chart(ctx, {
    type:'bar',
    data: {
      labels:['2025','2026','2027','2028','2029','2030'],
      datasets:[
        { label:'Jobs Displaced (M)', data:[15,25,40,60,75,92], backgroundColor:'rgba(255,69,99,0.8)', borderRadius:4 },
        { label:'New Jobs Created (M)', data:[20,40,65,100,135,170], backgroundColor:'rgba(16,232,138,0.8)', borderRadius:4 },
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{position:'bottom',labels:{color:'#8899bb',font:{size:11},padding:12,boxWidth:10,usePointStyle:true}},
        tooltip:{...tooltipDefaults,callbacks:{label:c=>` ${c.parsed.y}M jobs`}}
      },
      scales:{
        x:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#8899bb',font:{size:11}}},
        y:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#8899bb',font:{size:10},callback:v=>v+'M'}}
      }
    }
  });
}

// 7. GDP Impact
function gdpChart() {
  const ctx = document.getElementById('gdpChart');
  if (!ctx) return;
  new Chart(ctx, {
    type:'line',
    data: {
      labels:['2024','2025','2026','2027','2028','2029','2030'],
      datasets:[
        { label:'Goldman Sachs', data:[0.5,1.2,2.1,3.2,4.5,5.8,7], borderColor:'#00d4ff', backgroundColor:'rgba(0,212,255,0.08)', tension:0.4, fill:true, pointRadius:4, pointBackgroundColor:'#00d4ff' },
        { label:'McKinsey', data:[0.3,0.8,2.2,4.1,6.5,9.8,13], borderColor:'#10e88a', backgroundColor:'rgba(16,232,138,0.06)', tension:0.4, fill:true, pointRadius:4, pointBackgroundColor:'#10e88a' },
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{position:'bottom',labels:{color:'#8899bb',font:{size:11},padding:12,boxWidth:10,usePointStyle:true}},
        tooltip:{...tooltipDefaults,callbacks:{label:c=>` $${c.parsed.y}T GDP boost`}}
      },
      scales:{
        x:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#8899bb',font:{size:11}}},
        y:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#8899bb',font:{size:10},callback:v=>'$'+v+'T'}}
      }
    }
  });
}

// 8. Skills Radar
function radarChart() {
  const ctx = document.getElementById('radarChart');
  if (!ctx) return;
  new Chart(ctx, {
    type:'radar',
    data: {
      labels:['Critical Thinking','AI Literacy','Workflow Design','Emotional IQ','Fact Checking','Creativity','Domain Expertise','Continuous Learning'],
      datasets:[
        { label:'AI Replaceability Risk', data:[12,30,42,8,35,18,22,15], borderColor:'rgba(255,69,99,0.9)', backgroundColor:'rgba(255,69,99,0.08)', borderWidth:2, pointBackgroundColor:'rgba(255,69,99,0.9)', pointRadius:3 },
        { label:'Human Career Value', data:[96,88,80,99,82,92,94,95], borderColor:'rgba(0,212,255,0.9)', backgroundColor:'rgba(0,212,255,0.08)', borderWidth:2, pointBackgroundColor:'rgba(0,212,255,0.9)', pointRadius:3 },
      ]
    },
    options: {
      responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{position:'bottom',labels:{color:'#8899bb',font:{size:11},padding:12,boxWidth:10,usePointStyle:true}},
        tooltip:{...tooltipDefaults}
      },
      scales:{
        r:{
          min:0,max:100,
          grid:{color:'rgba(255,255,255,0.06)'},
          angleLines:{color:'rgba(255,255,255,0.05)'},
          pointLabels:{color:'#8899bb',font:{size:10}},
          ticks:{display:false,stepSize:25}
        }
      }
    }
  });
}
