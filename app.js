/**
 * Ping-Kun Personal Page - Application Script
 * Features:
 *  - Real-time High-Precision Clock (12h/24h Toggle & Localized Greeting)
 *  - Session Duration Tracker
 *  - Responsive Mobile Navigation
 *  - Interactive Project Filtering
 *  - Smooth Scroll & Back to Top Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initSessionTracker();
  initMobileNav();
  initProjectFilter();
  initScrollEffects();
  initThemeToggle();
  initScreenshotCollapse();
  initLightbox();
});

/* ==========================================================================
   1. Real-Time Clock & Greeting
   ========================================================================== */
let is24HourFormat = localStorage.getItem('pingkun_clock_24h') !== 'false'; // Default to true

function initClock() {
  const hoursEl = document.getElementById('clock-hours');
  const minutesEl = document.getElementById('clock-minutes');
  const secondsEl = document.getElementById('clock-seconds');
  const ampmEl = document.getElementById('clock-ampm');
  const dateEl = document.getElementById('clock-date');
  const greetingEl = document.getElementById('clock-greeting');
  const timezoneEl = document.getElementById('clock-timezone');
  const toggleBtn = document.getElementById('clock-toggle-format');

  // Format Toggle Handler
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      is24HourFormat = !is24HourFormat;
      localStorage.setItem('pingkun_clock_24h', is24HourFormat);
      toggleBtn.textContent = is24HourFormat ? '切換至 12H 制' : '切換至 24H 制';
      updateTime();
    });
    toggleBtn.textContent = is24HourFormat ? '切換至 12H 制' : '切換至 24H 制';
  }

  // Timezone display
  if (timezoneEl) {
    try {
      let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Etc/GMT+8';
      // In POSIX IANA database notation, signs are inverted (Etc/GMT-8 means UTC+8).
      // Standardize display for user clarity:
      if (userTimeZone === 'Etc/GMT-8' || userTimeZone === 'GMT-8') {
        userTimeZone = 'Etc/GMT+8';
      }
      timezoneEl.textContent = `時區：${userTimeZone}`;
    } catch {
      timezoneEl.textContent = '時區：Etc/GMT+8';
    }
  }

  function updateTime() {
    const now = new Date();

    let rawHours = now.getHours();
    const rawMinutes = now.getMinutes();
    const rawSeconds = now.getSeconds();

    let displayHours = rawHours;
    let ampmText = '';

    if (!is24HourFormat) {
      ampmText = rawHours >= 12 ? 'PM' : 'AM';
      displayHours = rawHours % 12 || 12;
    }

    if (hoursEl) hoursEl.textContent = String(displayHours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(rawMinutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(rawSeconds).padStart(2, '0');
    if (ampmEl) {
      ampmEl.textContent = ampmText;
      ampmEl.style.display = is24HourFormat ? 'none' : 'inline-block';
    }

    // Update Date
    if (dateEl) {
      const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const dayOfWeek = weekDays[now.getDay()];
      dateEl.textContent = `${year} 年 ${month} 月 ${day} 日 星期${dayOfWeek}`;
    }

    // Dynamic Greeting
    if (greetingEl) {
      let greeting = '您好，歡迎蒞臨！';
      if (rawHours >= 5 && rawHours < 11) {
        greeting = '☀️ 早安！美好的一天從探索新技術開始。';
      } else if (rawHours >= 11 && rawHours < 14) {
        greeting = '🍱 午安！適度休憩，保持清晰思維。';
      } else if (rawHours >= 14 && rawHours < 18) {
        greeting = '☕ 下午好！高效專注，打造優秀專案。';
      } else if (rawHours >= 18 && rawHours < 23) {
        greeting = '🌆 傍晚好！享受充實成就與下班時光。';
      } else {
        greeting = '🌙 夜深了！研究路上別忘了充足睡眠。';
      }
      greetingEl.textContent = greeting;
    }
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/* ==========================================================================
   2. Session Duration Tracker
   ========================================================================== */
function initSessionTracker() {
  const sessionEl = document.getElementById('session-uptime');
  if (!sessionEl) return;

  const startTime = Date.now();
  setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    sessionEl.textContent = `${String(mins).padStart(2, '0')} 分 ${String(secs).padStart(2, '0')} 秒`;
  }, 1000);
}

/* ==========================================================================
   3. Responsive Mobile Navigation
   ========================================================================== */
function initMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.classList.toggle('hidden');
    
    // Toggle hamburger icon animation
    const icon = menuBtn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-xmark');
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
      const icon = menuBtn.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
      }
    });
  });
}

/* ==========================================================================
   4. Interactive Project Filter
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        const categoryList = categories.split(' ');

        if (filterValue === 'all' || categoryList.includes(filterValue)) {
          card.classList.remove('hidden');
          card.classList.remove('fade-in');
          void card.offsetWidth; // Trigger reflow for animation
          card.classList.add('fade-in');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   5. Smooth Scroll & Back to Top Controller
   ========================================================================== */
function initScrollEffects() {
  const backToTopBtn = document.getElementById('back-to-top');
  const navbar = document.getElementById('main-navbar');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || window.pageYOffset;

    // Navbar style change on scroll
    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add('shadow-lg', 'bg-slate-950/90');
      } else {
        navbar.classList.remove('shadow-lg', 'bg-slate-950/90');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        backToTopBtn.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* ==========================================================================
   6. Dark / Light Mode Theme Controller
   ========================================================================== */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const mobileThemeBtn = document.getElementById('mobile-theme-toggle-btn');
  const mobileQuickThemeBtn = document.getElementById('mobile-hamburger-theme-btn');
  const mobileThemeText = document.getElementById('mobile-theme-text');

  // Load saved theme or default to light
  const savedTheme = localStorage.getItem('pingkun_theme_v2') || 'light';

  function updateUI(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      if (themeBtn) {
        themeBtn.innerHTML = '<i class="fa-solid fa-moon text-indigo-600 text-base"></i>';
        themeBtn.setAttribute('title', '切換至深色模式');
      }
      if (mobileThemeText) {
        mobileThemeText.textContent = '淺色模式';
      }
      if (mobileQuickThemeBtn) {
        mobileQuickThemeBtn.innerHTML = '<i class="fa-solid fa-moon text-indigo-600 text-base"></i>';
      }
    } else {
      document.body.classList.remove('light-mode');
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      if (themeBtn) {
        themeBtn.innerHTML = '<i class="fa-solid fa-sun text-amber-400 text-base"></i>';
        themeBtn.setAttribute('title', '切換至淺色模式');
      }
      if (mobileThemeText) {
        mobileThemeText.textContent = '深色模式';
      }
      if (mobileQuickThemeBtn) {
        mobileQuickThemeBtn.innerHTML = '<i class="fa-solid fa-sun text-amber-400 text-base"></i>';
      }
    }
  }

  function applyTheme(theme) {
    updateUI(theme);
    localStorage.setItem('pingkun_theme_v2', theme);
    localStorage.setItem('pingkun_theme', theme);
  }

  // Initial setup
  updateUI(savedTheme);

  function toggleTheme() {
    const isCurrentlyLight = document.body.classList.contains('light-mode');
    const newTheme = isCurrentlyLight ? 'dark' : 'light';
    applyTheme(newTheme);
  }

  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', toggleTheme);
  if (mobileQuickThemeBtn) mobileQuickThemeBtn.addEventListener('click', toggleTheme);
}

/* ==========================================================================
   7. Screenshot Collapse / Accordion & Image Lightbox
   ========================================================================== */
function initScreenshotCollapse() {
  const toggleBtns = document.querySelectorAll('.screenshot-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      const textEl = btn.querySelector('.toggle-text');
      const iconEl = btn.querySelector('.toggle-icon');
      if (!targetEl) return;

      const isHidden = targetEl.classList.contains('hidden');
      if (isHidden) {
        targetEl.classList.remove('hidden');
        if (textEl) textEl.textContent = '收合截圖';
        if (iconEl) iconEl.classList.add('rotate-180');
      } else {
        targetEl.classList.add('hidden');
        if (textEl) textEl.textContent = '展開預覽';
        if (iconEl) iconEl.classList.remove('rotate-180');
      }
    });
  });
}

window.openLightbox = function(src, caption) {
  const modal = document.getElementById('image-lightbox');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  if (!modal || !img) return;

  img.src = src;
  if (cap) cap.textContent = caption || '';
  modal.classList.remove('hidden');
  requestAnimationFrame(() => {
    modal.classList.remove('opacity-0');
  });
};

function initLightbox() {
  const modal = document.getElementById('image-lightbox');
  const closeBtn = document.getElementById('lightbox-close-btn');
  if (!modal) return;

  const close = () => {
    modal.classList.add('opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
      const img = document.getElementById('lightbox-img');
      if (img) img.src = '';
    }, 300);
  };

  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.id === 'image-lightbox') {
      close();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      close();
    }
  });
}


