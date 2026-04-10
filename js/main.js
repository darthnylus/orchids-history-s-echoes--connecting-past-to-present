/**
 * CHAIN — Main JavaScript
 * Handles: navigation, search overlay, theme toggle, tab UI,
 *          thread step interactions, scroll reveal animations.
 */

/* =========================================================
   UTILITY: DOM helpers
   ========================================================= */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* =========================================================
   THEME TOGGLE
   ========================================================= */
const THEME_KEY = 'chain-theme';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);

  const moonPath = $$('.icon-moon');
  const sunPaths = $$('.icon-sun');
  if (theme === 'dark') {
    moonPath.forEach(el => el.style.display = 'none');
    sunPaths.forEach(el => el.style.display = '');
  } else {
    moonPath.forEach(el => el.style.display = '');
    sunPaths.forEach(el => el.style.display = 'none');
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

const themeBtn = $('#themeToggle');
if (themeBtn) {
  themeBtn.addEventListener('click', toggleTheme);
}

initTheme();

/* =========================================================
   SEARCH OVERLAY
   ========================================================= */
const searchOverlay = $('#searchOverlay');
const searchToggle  = $('#searchToggle');
const searchClose   = $('#searchClose');
const searchInput   = $('#searchInput');

function openSearch() {
  searchOverlay.classList.add('is-open');
  searchOverlay.setAttribute('aria-hidden', 'false');
  searchToggle.setAttribute('aria-expanded', 'true');
  // Focus input on next frame
  requestAnimationFrame(() => {
    if (searchInput) searchInput.focus();
  });
  document.body.style.overflow = 'hidden';
}

function closeSearch() {
  searchOverlay.classList.remove('is-open');
  searchOverlay.setAttribute('aria-hidden', 'true');
  searchToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  if (searchToggle) searchToggle.focus();
}

if (searchToggle) searchToggle.addEventListener('click', openSearch);
if (searchClose)  searchClose.addEventListener('click', closeSearch);

if (searchOverlay) {
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });
}

// Keyboard: Escape to close, Cmd+K to open
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (searchOverlay && searchOverlay.classList.contains('is-open')) {
      closeSearch();
    }
    if (mobileNav && mobileNav.classList.contains('is-open')) {
      closeMobileNav();
    }
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    openSearch();
  }
});

/* =========================================================
   MOBILE NAV
   ========================================================= */
const mobileNav     = $('#mobileNav');
const mobileToggle  = $('#mobileMenuToggle');
const mobileClose   = $('#mobileClose');
const mobileBackdrop = $('#mobileBackdrop');

function openMobileNav() {
  mobileNav.classList.add('is-open');
  mobileNav.setAttribute('aria-hidden', 'false');
  mobileToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  mobileNav.classList.remove('is-open');
  mobileNav.setAttribute('aria-hidden', 'true');
  mobileToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (mobileToggle) mobileToggle.addEventListener('click', openMobileNav);
if (mobileClose)  mobileClose.addEventListener('click', closeMobileNav);
if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileNav);

/* =========================================================
   PPP TABS (People / Policy / Place / Events)
   ========================================================= */
function initTabs() {
  const tabList = $('[role="tablist"]');
  if (!tabList) return;

  const tabs   = $$('[role="tab"]', tabList);
  const panels = tabs.map(tab => $('#' + tab.getAttribute('aria-controls')));

  function activateTab(tab) {
    // Deactivate all
    tabs.forEach((t, i) => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
      if (panels[i]) panels[i].hidden = true;
    });
    // Activate selected
    const idx = tabs.indexOf(tab);
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    if (panels[idx]) {
      panels[idx].hidden = false;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (e) => {
      const idx = tabs.indexOf(tab);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = tabs[(idx + 1) % tabs.length];
        next.focus();
        activateTab(next);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = tabs[(idx - 1 + tabs.length) % tabs.length];
        prev.focus();
        activateTab(prev);
      }
      if (e.key === 'Home') {
        e.preventDefault();
        tabs[0].focus();
        activateTab(tabs[0]);
      }
      if (e.key === 'End') {
        e.preventDefault();
        tabs[tabs.length - 1].focus();
        activateTab(tabs[tabs.length - 1]);
      }
    });
  });
}

initTabs();

/* =========================================================
   THREAD STEP INTERACTIONS
   ========================================================= */
const PANEL_DATA = [
  {
    counter: '01 / 05',
    caption: '"Reconstruction was not a failure — it was a success that was violently overthrown."',
    source: 'W.E.B. Du Bois, Black Reconstruction in America (1935). Du Bois was the first scholar to document Reconstruction as a genuine democratic experiment rather than the "carpetbagger chaos" of white supremacist historiography.',
    then: '16 Black congressmen in office during Reconstruction (1870–1876)',
    now: '57 Black members of Congress in 2024 — less than 11% of seats'
  },
  {
    counter: '02 / 05',
    caption: '"The rise of Jim Crow was not spontaneous. It was constructed, law by law, terror by terror."',
    source: 'C. Vann Woodward, The Strange Career of Jim Crow (1955). Woodward traced the deliberate legal architecture of segregation built in the years after Reconstruction.',
    then: 'Black land ownership reached 14 million acres by 1910',
    now: 'Black Americans own less than 5 million acres of farmland today — nearly a 65% loss'
  },
  {
    counter: '03 / 05',
    caption: '"The federal government did not merely tolerate residential segregation — it created it."',
    source: 'Richard Rothstein, The Color of Law (2017). Rothstein\'s central argument: government at every level enforced residential segregation as explicit policy, not as passive bystanderism.',
    then: 'HOLC graded neighborhoods in 239 cities; "D" ratings applied overwhelmingly to Black neighborhoods (1935–1940)',
    now: 'Formerly redlined neighborhoods show 20% higher rates of asthma and cardiovascular disease (EPA, 2022)'
  },
  {
    counter: '04 / 05',
    caption: '"The Fair Housing Act was passed too late — not to prevent segregation, but to pretend it had ended."',
    source: 'Ta-Nehisi Coates, "The Case for Reparations," The Atlantic (2014). Coates documented how contract buying in Chicago continued wealth extraction from Black families for decades after legal segregation ended.',
    then: 'Fair Housing Act signed 1968 — one week after Dr. King\'s assassination',
    now: 'The racial homeownership gap (30 percentage points) is wider today than in 1968 when the FHA passed'
  },
  {
    counter: '05 / 05',
    caption: '"The present is the past, wearing different clothes."',
    source: 'EdBuild, Dismissed (2019) and Urban Institute (2023) documented that property-tax school funding directly translates historical housing discrimination into present-day educational inequality.',
    then: 'School segregation peaked in 1954 before Brown v. Board; 99% of Black Southern children attended segregated schools',
    now: 'Majority-Black school districts receive $1,800 less per student annually than majority-white districts (EdBuild, 2019)'
  }
];

function initThreadSteps() {
  const steps = $$('.thread-step');
  if (!steps.length) return;

  const panelCaption = $('#panelCaption');
  const panelSource  = $('#panelSource');
  const panelCounter = $('#panelCounter');
  const panelThen    = $('#panelThen');
  const panelNow     = $('#panelNow');

  function activateStep(idx) {
    steps.forEach((step, i) => {
      const isActive = i === idx;
      step.classList.toggle('is-active', isActive);
      step.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    const data = PANEL_DATA[idx];
    if (data && panelCaption) {
      panelCaption.textContent = data.caption;
      panelSource.textContent  = data.source;
      panelCounter.textContent = data.counter;
      panelThen.textContent    = data.then;
      panelNow.textContent     = data.now;
    }
  }

  steps.forEach((step, idx) => {
    step.addEventListener('click', () => activateStep(idx));
    step.setAttribute('tabindex', '0');
    step.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateStep(idx);
      }
    });
  });

  // Auto-advance steps every 6 seconds when section is in view
  let autoIdx = 0;
  let autoTimer = null;

  function startAutoAdvance() {
    autoTimer = setInterval(() => {
      autoIdx = (autoIdx + 1) % steps.length;
      activateStep(autoIdx);
    }, 6000);
  }

  function stopAutoAdvance() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  // Pause on user interaction
  steps.forEach((step, idx) => {
    step.addEventListener('click', () => {
      stopAutoAdvance();
      autoIdx = idx;
    });
  });

  // Start auto-advance when section enters viewport
  const threadSection = $('#follow-thread');
  if (threadSection && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAutoAdvance();
        } else {
          stopAutoAdvance();
        }
      });
    }, { threshold: 0.3 });
    io.observe(threadSection);
  }
}

initThreadSteps();

/* =========================================================
   SCROLL REVEAL
   ========================================================= */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all
    $$('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  $$('.reveal').forEach(el => io.observe(el));
}

initScrollReveal();

/* =========================================================
   STICKY NAV SHADOW
   ========================================================= */
function initNavShadow() {
  const nav = $('.site-nav');
  if (!nav) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      nav.style.boxShadow = entry.isIntersecting
        ? 'none'
        : '0 2px 20px rgba(0,0,0,.3)';
    });
  }, { threshold: 0 });

  // Observe a sentinel just below the nav
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:1px;left:0;height:1px;width:1px;pointer-events:none;';
  document.body.insertBefore(sentinel, document.body.firstChild);
  io.observe(sentinel);
}

initNavShadow();

/* =========================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ========================================================= */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href').slice(1);
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Set focus for accessibility
  target.tabIndex = -1;
  target.focus({ preventScroll: true });
});

/* =========================================================
   TODAY DATE IN UTILITY BAR
   ========================================================= */
function updateTodayDate() {
  const el = $('.today-pill');
  if (!el) return;
  // Could fetch from an API — for now, static
  el.setAttribute('aria-label', `Today in Black history — ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`);
}

updateTodayDate();

/* =========================================================
   CONSOLE EASTER EGG
   ========================================================= */
console.log(
  '%cChain%c — Understand the chain, not just the event.\nhttps://chain.org/about\n\nBuilt with care for public knowledge.',
  'font-size:1.5rem;font-family:Georgia,serif;color:#e07a00;font-weight:bold;',
  'font-size:0.875rem;color:#909090;'
);
