let timerInterval = null;
let startTime     = null;
let targetTime    = null;
let isCountingUp  = false;

window.addEventListener('load', () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  document.getElementById('target-date').min = now.toISOString().slice(0, 16);
});

function startCountdown() {
  const name    = document.getElementById('event-name').value.trim();
  const dateVal = document.getElementById('target-date').value;
  const error   = document.getElementById('setup-error');

  if (!name)    { showError(error, 'Please enter an event name.'); return; }
  if (!dateVal) { showError(error, 'Please pick a target date and time.'); return; }

  const target = new Date(dateVal).getTime();
  if (target <= Date.now()) { showError(error, 'Please pick a future date and time.'); return; }

  error.classList.add('hidden');

  targetTime = target;
  startTime  = Date.now();

  document.getElementById('display-name').textContent = name;
  setTargetLabel(targetTime);
  showScreen('countdown-screen');

  const remaining   = targetTime - Date.now();
  const realDays    = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const realHours   = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const realMinutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const realSeconds = Math.floor((remaining % (1000 * 60)) / 1000);

  runCountUpAnimation(realDays, realHours, realMinutes, realSeconds, () => {
    tick();
    timerInterval = setInterval(tick, 1000);
  });
}

function runCountUpAnimation(targetD, targetH, targetM, targetS, onDone) {
  isCountingUp = true;
  ['days','hours','minutes','seconds'].forEach(id => {
    document.getElementById(id).classList.add('counting-up');
  });

  const duration = 1200;
  const fps = 30;
  const steps = Math.floor(duration / (1000 / fps));
  let step = 0;

  const interval = setInterval(() => {
    step++;
    const progress = step / steps;
    const ease = 1 - Math.pow(1 - progress, 3);

    document.getElementById('days').textContent    = String(Math.round(ease * targetD)).padStart(2, '0');
    document.getElementById('hours').textContent   = String(Math.round(ease * targetH)).padStart(2, '0');
    document.getElementById('minutes').textContent = String(Math.round(ease * targetM)).padStart(2, '0');
    document.getElementById('seconds').textContent = String(Math.round(ease * targetS)).padStart(2, '0');

    if (step >= steps) {
      clearInterval(interval);
      ['days','hours','minutes','seconds'].forEach(id => {
        document.getElementById(id).classList.remove('counting-up');
      });
      isCountingUp = false;
      onDone();
    }
  }, 1000 / fps);
}

function setPreset(days, name) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  document.getElementById('target-date').value = d.toISOString().slice(0, 16);
  document.getElementById('event-name').value  = name;
}

function resetCountdown() {
  clearInterval(timerInterval);
  targetTime = null;
  startTime  = null;

  document.getElementById('event-name').value  = '';
  document.getElementById('target-date').value = '';
  document.getElementById('setup-error').classList.add('hidden');
  document.getElementById('expired-card').classList.add('hidden');
  document.getElementById('units').classList.remove('hidden');
  document.getElementById('progress-fill').style.width = '0%';
  document.getElementById('confetti-container').innerHTML = '';

  showScreen('setup-screen');
}

function tick() {
  const remaining = targetTime - Date.now();

  if (remaining <= 0) {
    clearInterval(timerInterval);
    showExpired();
    return;
  }

  const days    = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  setUnit('days',    days);
  setUnit('hours',   hours);
  setUnit('minutes', minutes);
  setUnit('seconds', seconds, true);

  const total   = targetTime - startTime;
  const elapsed = Date.now() - startTime;
  const percent = Math.min((elapsed / total) * 100, 100);
  document.getElementById('progress-fill').style.width = percent + '%';
}

function setUnit(id, value, animate = false) {
  const el  = document.getElementById(id);
  const val = String(value).padStart(2, '0');
  if (el.textContent !== val) {
    el.textContent = val;
    if (animate) {
      el.classList.remove('tick');
      void el.offsetWidth;
      el.classList.add('tick');
    }
  }
}

function showExpired() {
  const name = document.getElementById('display-name').textContent;
  document.getElementById('expired-title').textContent = name + ' is here!';
  document.getElementById('units').classList.add('hidden');
  document.getElementById('expired-card').classList.remove('hidden');
  launchConfetti();
}

function launchConfetti() {
  const container = document.getElementById('confetti-container');
  const colors = ['#f0c040', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#ff9ff3', '#54a0ff'];

  for (let i = 0; i < 120; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width  = (Math.random() * 8 + 4) + 'px';
    piece.style.height = (Math.random() * 8 + 4) + 'px';
    piece.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.animationDuration = (Math.random() * 2.5 + 1.5) + 's';
    piece.style.animationDelay    = (Math.random() * 0.8) + 's';
    container.appendChild(piece);
  }

  setTimeout(() => { container.innerHTML = ''; }, 5000);
}

function showScreen(id) {
  document.getElementById('setup-screen').classList.add('hidden');
  document.getElementById('countdown-screen').classList.add('hidden');
  document.getElementById(id).classList.remove('hidden');
}

function setTargetLabel(target) {
  const d = new Date(target);
  document.getElementById('target-label').textContent =
    'Target: ' + d.toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
}

function showError(el, msg) {
  el.textContent = msg;
  el.classList.remove('hidden');
}