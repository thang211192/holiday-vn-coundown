/* ===== VIETNAMESE HOLIDAY COUNTDOWN APP ===== */

const WEEKDAYS = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
const MONTHS   = ['tháng 1','tháng 2','tháng 3','tháng 4','tháng 5','tháng 6',
                  'tháng 7','tháng 8','tháng 9','tháng 10','tháng 11','tháng 12'];

let holidays = [];
let heroIndex = -1;
let prevValues = { days: null, hours: null, mins: null, secs: null };

/* ===== PARTICLES ===== */
function createParticles() {
  const container = document.getElementById('particles');

  // Floating emoji icons
  const icons = ['❤️','✨','🌸','⭐','💫','🌟','💖','🎊','🌺','💝','🎉','🦋','🌙','💕','🎈'];
  for (let i = 0; i < 35; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const icon  = icons[Math.floor(Math.random() * icons.length)];
    const size  = (Math.random() * 18 + 10).toFixed(1);
    const left  = (Math.random() * 100).toFixed(1);
    const dur   = (Math.random() * 18 + 12).toFixed(1);
    const delay = (Math.random() * 22).toFixed(1);
    const drift = ((Math.random() - 0.5) * 120).toFixed(0);
    p.textContent = icon;
    p.style.cssText = `
      font-size:${size}px;
      left:${left}%;
      bottom:-${size}px;
      --drift:${drift}px;
      animation-duration:${dur}s;
      animation-delay:-${delay}s;
      filter: drop-shadow(0 0 6px rgba(255,200,255,0.6));
    `;
    container.appendChild(p);
  }

  // Glowing background orbs
  const orbColors = [
    'rgba(180,80,255,0.5)','rgba(255,80,160,0.45)',
    'rgba(80,140,255,0.4)','rgba(255,160,50,0.35)','rgba(80,220,200,0.35)'
  ];
  orbColors.forEach((color, i) => {
    const orb = document.createElement('div');
    orb.className = 'orb';
    const size = Math.random() * 300 + 200;
    orb.style.cssText = `
      width:${size}px; height:${size}px;
      background:${color};
      left:${Math.random() * 90}%;
      top:${Math.random() * 80}%;
      animation-duration:${4 + i * 1.5}s;
      animation-delay:${i * 0.8}s;
    `;
    container.appendChild(orb);
  });
}

/* ===== DATE HELPERS ===== */

// Parse "DD-MM" and return next occurrence Date from now
function getNextOccurrence(ddmm) {
  const [dd, mm] = ddmm.split('-').map(Number);
  const now = new Date();
  let candidate = new Date(now.getFullYear(), mm - 1, dd, 0, 0, 0, 0);
  if (candidate < now) candidate.setFullYear(candidate.getFullYear() + 1);
  return candidate;
}

function isToday(ddmm) {
  const now = new Date();
  const [dd, mm] = ddmm.split('-').map(Number);
  return now.getMonth() + 1 === mm && now.getDate() === dd;
}

function isPast(ddmm) {
  const now = new Date();
  const [dd, mm] = ddmm.split('-').map(Number);
  const thisYear = new Date(now.getFullYear(), mm - 1, dd);
  return thisYear < new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function formatDate(ddmm) {
  const [dd, mm] = ddmm.split('-').map(Number);
  const next = getNextOccurrence(ddmm);
  const wd = WEEKDAYS[next.getDay()];
  return `${wd}, ${dd} ${MONTHS[mm - 1]}`;
}

function msUntil(target) {
  return Math.max(0, target - Date.now());
}

function decompose(ms) {
  const total = Math.floor(ms / 1000);
  return {
    days:  Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    mins:  Math.floor((total % 3600) / 60),
    secs:  total % 60
  };
}

function pad(n) { return String(n).padStart(2, '0'); }

/* ===== FIND NEXT HOLIDAY ===== */
function findHeroHoliday() {
  // Sort by time until next occurrence
  let minMs = Infinity, idx = 0;
  holidays.forEach((h, i) => {
    if (isToday(h.date)) { idx = i; minMs = 0; return; }
    const ms = msUntil(getNextOccurrence(h.date));
    if (ms < minMs) { minMs = ms; idx = i; }
  });
  return idx;
}

/* ===== RENDER HERO ===== */
function renderHero(h) {
  const hero = document.querySelector('.hero');
  hero.style.setProperty('--hero-accent', h.color);
  hero.style.setProperty('--hero-glow', hexToRgba(h.color, 0.18));

  document.getElementById('hero-icon').textContent = h.icon;
  document.getElementById('hero-name').textContent = h.name;
  document.getElementById('hero-desc').textContent = h.description;
  document.getElementById('hero-date-display').textContent = `📅 ${formatDate(h.date)}`;

  // Update label color
  const label = document.querySelector('.hero-label');
  label.style.color = h.color;
  label.style.background = hexToRgba(h.color, 0.12);
  label.style.borderColor = hexToRgba(h.color, 0.3);
}

/* ===== UPDATE HERO COUNTDOWN ===== */
function updateHeroCountdown() {
  if (heroIndex < 0) return;
  const h = holidays[heroIndex];

  if (isToday(h.date)) {
    setCount('cd-days',  '00');
    setCount('cd-hours', '00');
    setCount('cd-mins',  '00');
    setCount('cd-secs',  '00');
    return;
  }

  const target = getNextOccurrence(h.date);
  const { days, hours, mins, secs } = decompose(msUntil(target));

  flipIfChanged('cd-days',  pad(days),  prevValues, 'days');
  flipIfChanged('cd-hours', pad(hours), prevValues, 'hours');
  flipIfChanged('cd-mins',  pad(mins),  prevValues, 'mins');
  flipIfChanged('cd-secs',  pad(secs),  prevValues, 'secs');
}

function setCount(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function flipIfChanged(id, val, cache, key) {
  const el = document.getElementById(id);
  if (!el) return;
  if (cache[key] !== val) {
    el.classList.add('flip');
    setTimeout(() => {
      el.textContent = val;
      el.classList.remove('flip');
    }, 150);
    cache[key] = val;
  }
}

/* ===== RENDER GRID ===== */
function renderGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  // Sort: today first, then by time until next occurrence
  const sorted = holidays.map((h, i) => ({ ...h, _orig: i })).sort((a, b) => {
    const ams = isToday(a.date) ? -1 : msUntil(getNextOccurrence(a.date));
    const bms = isToday(b.date) ? -1 : msUntil(getNextOccurrence(b.date));
    return ams - bms;
  });

  sorted.forEach((h, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.id = `card-${h._orig}`;
    card.style.animationDelay = `${idx * 0.07}s`;
    card.style.setProperty('--card-color', h.color);
    card.style.setProperty('--card-accent', h.color);
    card.style.setProperty('--card-border-hover', hexToRgba(h.color, 0.3));

    const today = isToday(h.date);
    const past  = !today && isPast(h.date);
    const next  = h._orig === heroIndex;

    if (today) card.classList.add('is-today');
    else if (past) card.classList.add('is-past');
    else if (next) card.classList.add('is-next');

    const badgeLabel = today ? 'Hôm nay!' : past ? 'Đã qua' : next ? 'Sắp tới' : 'Sắp tới';
    const badgeClass = today ? 'badge-today' : past ? 'badge-past' : next ? 'badge-next' : 'badge-upcoming';

    card.innerHTML = `
      <div class="card-header">
        <span class="card-icon">${h.icon}</span>
        <span class="card-name">${h.name}</span>
        <span class="card-badge ${badgeClass}">${badgeLabel}</span>
      </div>
      <p class="card-desc">${h.description}</p>
      <div class="card-date">📅 ${formatDate(h.date)}</div>
      <div class="card-countdown" id="cc-${h._orig}">
        ${today
          ? `<div class="card-today-msg">🎉 Chúc mừng ngày lễ hôm nay!</div>`
          : past
          ? `<div class="card-past-msg">Đã qua — hẹn gặp lại năm sau 👋</div>`
          : `
            <div class="mini-box"><span class="mini-count" id="mc-${h._orig}-d">--</span><span class="mini-label">Ngày</span></div>
            <div class="mini-box"><span class="mini-count" id="mc-${h._orig}-h">--</span><span class="mini-label">Giờ</span></div>
            <div class="mini-box"><span class="mini-count" id="mc-${h._orig}-m">--</span><span class="mini-label">Phút</span></div>
            <div class="mini-box"><span class="mini-count" id="mc-${h._orig}-s">--</span><span class="mini-label">Giây</span></div>
          `
        }
      </div>
      ${!today && !past ? `<div class="card-progress"><div class="card-progress-bar" id="pb-${h._orig}" style="width:0%"></div></div>` : ''}
    `;

    grid.appendChild(card);
  });
}

/* ===== UPDATE CARD COUNTDOWNS ===== */
function updateCardCountdowns() {
  holidays.forEach((h, i) => {
    if (isToday(h.date) || isPast(h.date)) return;
    const target = getNextOccurrence(h.date);
    const { days, hours, mins, secs } = decompose(msUntil(target));

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl(`mc-${i}-d`, pad(days));
    setEl(`mc-${i}-h`, pad(hours));
    setEl(`mc-${i}-m`, pad(mins));
    setEl(`mc-${i}-s`, pad(secs));

    // Progress bar: percentage of year elapsed toward this holiday
    const pb = document.getElementById(`pb-${i}`);
    if (pb) {
      const totalMs = 365 * 24 * 3600 * 1000;
      const remaining = msUntil(target);
      const pct = Math.max(0, Math.min(100, ((totalMs - remaining) / totalMs) * 100));
      pb.style.width = pct + '%';
    }
  });
}

/* ===== UTILS ===== */
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ===== INIT ===== */
function init() {
  createParticles();

  // Dữ liệu từ holidays.js (biến HOLIDAYS toàn cục)
  holidays = HOLIDAYS;

  heroIndex = findHeroHoliday();
  renderHero(holidays[heroIndex]);
  renderGrid();
  updateHeroCountdown();
  updateCardCountdowns();

  // Tick every second
  setInterval(() => {
    updateHeroCountdown();
    updateCardCountdowns();
  }, 1000);
}

document.addEventListener('DOMContentLoaded', init);
