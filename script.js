const music = document.getElementById('bgMusic');
const opening = document.getElementById('opening');
const mainContent = document.getElementById('mainContent');
const envelope = document.getElementById('envelope');
const musicBtn = document.getElementById('musicBtn');

let letterOpened = false;
let autoScrollTimer = null;
let resumeTimer = null;
let autoScrollRunning = false;
let userPausedAutoScroll = false;
let autoScrollStarted = false;

function openLetter() {
  if (letterOpened) return;
  letterOpened = true;
  envelope.classList.add('open');
  createHearts(22);
  startMusic();

  window.setTimeout(() => {
    opening.classList.add('hide');
    window.setTimeout(() => {
      opening.style.display = 'none';
      mainContent.classList.remove('hidden');
      window.setTimeout(() => {
        if (!autoScrollStarted) {
          autoScrollStarted = true;
          startAutoScroll();
        }
      }, 3000);
    }, 900);
  }, 1100);
}

function startMusic() {
  music.volume = 0.3;
  music.play().then(() => {
    musicBtn.textContent = '♫';
    musicBtn.setAttribute('aria-label', 'Pause background music');
  }).catch(() => {
    // Some browsers require another tap before playing audio.
    musicBtn.textContent = '♫';
  });
}

function toggleMusic() {
  if (music.paused) {
    music.play().then(() => {
      musicBtn.textContent = '♫';
      musicBtn.setAttribute('aria-label', 'Pause background music');
    }).catch(() => {});
  } else {
    music.pause();
    musicBtn.textContent = '🔇';
    musicBtn.setAttribute('aria-label', 'Play background music');
  }
}

function scrollToMemories() {
  pauseAutoScrollTemporarily();
  document.getElementById('memories').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function loveMessage() {
  document.getElementById('secret').innerHTML = 'I love you more than yesterday,<br>but less than tomorrow. ❤️';
  createHearts(28);
  pauseAutoScrollTemporarily();
}

function createHearts(count = 18) {
  const container = document.querySelector('.hearts');
  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = Math.random() > 0.5 ? '♥' : '♡';
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${12 + Math.random() * 22}px`;
    heart.style.animationDuration = `${3 + Math.random() * 4}s`;
    heart.style.animationDelay = `${Math.random() * 0.8}s`;
    container.appendChild(heart);
    window.setTimeout(() => heart.remove(), 8000);
  }
}

function startAutoScroll() {
  if (autoScrollRunning || document.hidden || mainContent.classList.contains('hidden') || userPausedAutoScroll) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  autoScrollRunning = true;
  autoScrollTimer = window.setInterval(() => {
    const currentBottom = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    if (currentBottom >= pageHeight - 3) {
      stopAutoScroll();
      return;
    }
    // One pixel at a time keeps the movement subtle and steady.
    window.scrollBy(0, 1);
  }, 45);
}

function stopAutoScroll() {
  autoScrollRunning = false;
  if (autoScrollTimer) window.clearInterval(autoScrollTimer);
  autoScrollTimer = null;
}

function pauseAutoScrollTemporarily() {
  stopAutoScroll();
  userPausedAutoScroll = true;
  if (resumeTimer) window.clearTimeout(resumeTimer);
  resumeTimer = window.setTimeout(() => {
    userPausedAutoScroll = false;
    startAutoScroll();
  }, 6000);
}

// Pause when the visitor takes control of the page. Ignore the music button.
window.addEventListener('wheel', pauseAutoScrollTemporarily, { passive: true });
window.addEventListener('touchstart', pauseAutoScrollTemporarily, { passive: true });
window.addEventListener('keydown', (event) => {
  if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) {
    pauseAutoScrollTemporarily();
  }
});
window.addEventListener('pointerdown', (event) => {
  if (event.target.closest('button, video, a, input, textarea, select')) {
    if (event.target.closest('#musicBtn')) return;
    pauseAutoScrollTemporarily();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) stopAutoScroll();
  else if (autoScrollStarted && !userPausedAutoScroll) startAutoScroll();
});

// Small occasional hearts add a little movement without overwhelming the page.
window.setInterval(() => {
  if (!document.hidden && !mainContent.classList.contains('hidden') && Math.random() > 0.6) {
    createHearts(5);
  }
}, 9000);
