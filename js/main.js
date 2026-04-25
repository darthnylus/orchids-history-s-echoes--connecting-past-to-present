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

// Focus trap for search overlay
if (searchOverlay) {
  searchOverlay.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = [...searchOverlay.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )].filter(el => !el.closest('[aria-hidden="true"]'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
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
    // Deactivate all — remove from tab order
    tabs.forEach((t, i) => {
      t.classList.remove('is-active');
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
      if (panels[i]) panels[i].hidden = true;
    });
    // Activate selected — restore to tab order
    const idx = tabs.indexOf(tab);
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    if (panels[idx]) {
      panels[idx].hidden = false;
    }
  }

  // Init tabindex state
  tabs.forEach((t, i) => {
    t.setAttribute('tabindex', t.getAttribute('aria-selected') === 'true' ? '0' : '-1');
  });

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
    counter: '01 / 06',
    caption: '"Enslavement was not the starting condition of Black life — it was an interruption of it."',
    source: 'The Mali Empire\'s Sankore University in Timbuktu held an estimated 25,000 students and 700,000 manuscripts at its peak in the 14th century — one of the largest libraries in the medieval world. Source: Elias N. Saad, Social History of Timbuktu (1983).',
    then: 'Mansa Musa of Mali — the wealthiest individual in recorded human history — ruled an empire larger than Western Europe (c. 1312–1337 CE)',
    now: 'The descendants of enslaved Africans have a median household wealth of $24,100 — vs. $188,200 for white households (Federal Reserve, 2022)'
  },
  {
    counter: '02 / 06',
    caption: '"The Transatlantic Slave Trade was not a chapter in African history. It was a rupture — designed to be one."',
    source: 'The Trans-Atlantic Slave Trade Database (slavevoyages.org) documents 36,000 voyages carrying approximately 12.5 million enslaved Africans to the Americas between 1514 and 1866. Roughly 1.8 million died during the Middle Passage.',
    then: 'West and Central African kingdoms — including Dahomey, Kongo, and Ndongo — were systematically destabilized by European demand for enslaved people over four centuries',
    now: 'The 54 countries of Africa contain some of the world\'s largest populations in poverty — a direct structural legacy of extraction, depopulation, and colonial underdevelopment'
  },
  {
    counter: '03 / 06',
    caption: '"Slavery was not peripheral to the American economy. It was the American economy."',
    source: 'Edward Baptist, The Half Has Never Been Told (2014). Baptist documented how the expansion of cotton slavery drove U.S. GDP growth and capitalized Northern banks, insurers, and textile manufacturers — all built on the unpaid labor of enslaved people.',
    then: 'By 1860, enslaved people represented the single largest financial asset in the United States — worth more than all railroads and factories combined',
    now: 'No reparation, land grant, or capital transfer was ever made to the 4 million people emancipated in 1865 — or to their descendants'
  },
  {
    counter: '04 / 06',
    caption: '"Reconstruction was not a failure — it was a success that was violently overthrown."',
    source: 'W.E.B. Du Bois, Black Reconstruction in America (1935). Du Bois was the first scholar to document Reconstruction as a genuine democratic experiment rather than the "carpetbagger chaos" of white supremacist historiography.',
    then: '16 Black men served in Congress during Reconstruction (1870–1876); more than 600 served in state legislatures',
    now: '57 Black members of Congress in 2024 — less than 11% of seats, in a country that is 13.6% Black'
  },
  {
    counter: '05 / 06',
    caption: '"The federal government did not merely tolerate residential segregation — it created it."',
    source: 'Richard Rothstein, The Color of Law (2017). Rothstein\'s central argument: government at every level enforced residential segregation as explicit policy. HOLC maps, FHA underwriting rules, and VA loan administration all encoded racial exclusion into federal law.',
    then: 'HOLC graded neighborhoods in 239 cities; "D" (hazardous) ratings applied overwhelmingly to Black neighborhoods — making federally backed mortgages impossible (1935–1940)',
    now: 'Formerly redlined neighborhoods show 20% higher rates of asthma and cardiovascular disease. Life expectancy 3.6 years shorter than A-rated neighborhoods in the same city (NCRC, 2020)'
  },
  {
    counter: '06 / 06',
    caption: '"The chain from sovereign African civilization to this morning\'s headlines is unbroken."',
    source: 'EdBuild, Dismissed (2019) and Urban Institute (2023) documented that property-tax school funding directly translates historical housing discrimination into present-day educational inequality — linking federal mortgage policy in the 1930s to school budgets today.',
    then: 'School segregation at its 1954 peak: 99% of Black Southern children attended underfunded segregated schools — a direct legacy of post-Reconstruction disinvestment',
    now: 'Majority-Black school districts receive $1,800 less per student annually than majority-white districts — the compounded consequence of redlining, GI Bill exclusion, and property-tax school funding (EdBuild, 2019)'
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

  // Auto-advance steps every 7 seconds when section is in view (6 steps now)
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

  // Pause button
  let manuallyPaused = false;
  const pauseBtn   = document.getElementById('stepsPauseBtn');
  const pauseIcon  = document.getElementById('stepsPauseIcon');
  const pauseLabel = document.getElementById('stepsPauseLabel');
  const PLAY_SVG  = '<polygon points="5 3 19 12 5 21 5 3"/>';
  const PAUSE_SVG = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      manuallyPaused = !manuallyPaused;
      pauseBtn.setAttribute('aria-pressed', String(manuallyPaused));
      if (manuallyPaused) {
        stopAutoAdvance();
        pauseIcon.innerHTML = PLAY_SVG;
        pauseLabel.textContent = 'Play';
        pauseBtn.setAttribute('aria-label', 'Resume auto-advancing steps');
      } else {
        startAutoAdvance();
        pauseIcon.innerHTML = PAUSE_SVG;
        pauseLabel.textContent = 'Pause';
        pauseBtn.setAttribute('aria-label', 'Pause auto-advancing steps');
      }
    });
  }

  // Pause on user step click (but don't toggle the button state)
  steps.forEach((step, idx) => {
    step.addEventListener('click', () => {
      stopAutoAdvance();
      autoIdx = idx;
      manuallyPaused = true;
      if (pauseBtn) {
        pauseBtn.setAttribute('aria-pressed', 'true');
        if (pauseIcon) pauseIcon.innerHTML = PLAY_SVG;
        if (pauseLabel) pauseLabel.textContent = 'Play';
      }
    });
  });

  // Start auto-advance when section enters viewport (only if not manually paused)
  const threadSection = $('#follow-thread');
  if (threadSection && 'IntersectionObserver' in window) {
    const ioSteps = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !manuallyPaused) {
          startAutoAdvance();
        } else {
          stopAutoAdvance();
        }
      });
    }, { threshold: 0.3 });
    ioSteps.observe(threadSection);
    window.addEventListener('pagehide', () => { ioSteps.disconnect(); stopAutoAdvance(); }, { once: true });
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

  const ioReveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        ioReveal.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  $$('.reveal').forEach(el => ioReveal.observe(el));
  // Disconnect once all items are revealed (self-cleaning)
  window.addEventListener('pagehide', () => ioReveal.disconnect(), { once: true });
}

initScrollReveal();

/* =========================================================
   STICKY NAV SHADOW
   ========================================================= */
function initNavShadow() {
  const nav = $('.site-nav');
  if (!nav) return;

  const ioNav = new IntersectionObserver((entries) => {
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
  ioNav.observe(sentinel);
  window.addEventListener('pagehide', () => ioNav.disconnect(), { once: true });
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
   INLINE CITATION SYSTEM
   Handles .cite-ref superscript buttons and .cite-tooltip
   popovers. Data lives in a window.THREAD_SOURCES map on
   each thread page. Entry-level sources accordion is also
   wired here.
   ========================================================= */
function initCitations() {
  const refs = $$('.cite-ref');
  if (!refs.length) return;

  // One shared tooltip element, repositioned per trigger
  let tooltip = document.getElementById('cite-tooltip-global');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'cite-tooltip-global';
    tooltip.className = 'cite-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('aria-live', 'polite');
    tooltip.innerHTML = '<div class="cite-tooltip__arrow"></div><div class="cite-tooltip__type"></div><div class="cite-tooltip__title"></div><div class="cite-tooltip__detail"></div>';
    document.body.appendChild(tooltip);
  }

  const ttType   = tooltip.querySelector('.cite-tooltip__type');
  const ttTitle  = tooltip.querySelector('.cite-tooltip__title');
  const ttDetail = tooltip.querySelector('.cite-tooltip__detail');
  const ttArrow  = tooltip.querySelector('.cite-tooltip__arrow');

  let activeRef = null;

  function showTooltip(ref) {
    const key = ref.dataset.cite;
    const sources = window.THREAD_SOURCES || {};
    const src = sources[key];
    if (!src) return;

    ttType.textContent   = src.type   || 'Source';
    ttTitle.textContent  = src.title  || '';
    ttDetail.innerHTML   = src.detail || '';

    tooltip.classList.add('is-visible');
    ref.classList.add('is-open');
    ref.setAttribute('aria-expanded', 'true');
    activeRef = ref;

    positionTooltip(ref);
  }

  function hideTooltip() {
    tooltip.classList.remove('is-visible');
    if (activeRef) {
      activeRef.classList.remove('is-open');
      activeRef.setAttribute('aria-expanded', 'false');
      activeRef = null;
    }
  }

  function positionTooltip(ref) {
    const refRect = ref.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const ttW = 320;
    const margin = 10;

    // Default: below the ref, left-aligned
    let top  = refRect.bottom + scrollY + 8;
    let left = refRect.left + scrollX - 10;

    // Don't overflow right edge
    if (left + ttW > window.innerWidth - margin) {
      left = window.innerWidth - ttW - margin;
    }
    if (left < margin) left = margin;

    tooltip.style.top  = top + 'px';
    tooltip.style.left = left + 'px';
    tooltip.style.width = ttW + 'px';

    // Arrow horizontal position relative to tooltip
    const arrowLeft = Math.max(10, refRect.left + scrollX - left + 2);
    ttArrow.style.left = Math.min(arrowLeft, ttW - 20) + 'px';
  }

  refs.forEach(ref => {
    ref.setAttribute('role', 'button');
    ref.setAttribute('tabindex', '0');
    ref.setAttribute('aria-expanded', 'false');
    const key = ref.dataset.cite;
    if (key) ref.setAttribute('aria-label', 'Show source ' + ref.textContent.trim());

    ref.addEventListener('mouseenter', () => {
      if (activeRef !== ref) showTooltip(ref);
    });
    ref.addEventListener('mouseleave', (e) => {
      // Don't hide if moving into the tooltip
      if (e.relatedTarget && tooltip.contains(e.relatedTarget)) return;
      hideTooltip();
    });
    ref.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activeRef === ref) { hideTooltip(); return; }
      showTooltip(ref);
    });
    ref.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (activeRef === ref) { hideTooltip(); return; }
        showTooltip(ref);
      }
      if (e.key === 'Escape') hideTooltip();
    });
  });

  tooltip.addEventListener('mouseleave', (e) => {
    if (e.relatedTarget && e.relatedTarget.classList && e.relatedTarget.classList.contains('cite-ref')) return;
    hideTooltip();
  });

  document.addEventListener('click', (e) => {
    if (!tooltip.contains(e.target) && !e.target.classList.contains('cite-ref')) {
      hideTooltip();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeRef) hideTooltip();
  });

  window.addEventListener('scroll', () => {
    if (activeRef) positionTooltip(activeRef);
  }, { passive: true });

  // Entry sources accordion toggles
  $$('.entry-sources__toggle').forEach(toggle => {
    const list = toggle.nextElementSibling;
    if (!list) return;
    list.classList.add('is-hidden');
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('is-open');
      list.classList.toggle('is-hidden', !open);
    });
  });
}

initCitations();

/* =========================================================
   ENTRY TIMELINE EMBEDS
   Renders horizontal milestone timelines inside thread entries.
   Data source: window.THREAD_TIMELINES[id] — array of objects:
     { year, event, note?, icon?, highlight? }
   ========================================================= */
function initTimelines() {
  const containers = $$('.entry-timeline[data-timeline-id]');
  if (!containers.length) return;

  const data = window.THREAD_TIMELINES || {};

  containers.forEach(container => {
    const id = container.dataset.timelineId;
    const nodes = data[id];
    if (!nodes || !nodes.length) return;

    // Build header
    const header = document.createElement('div');
    header.className = 'entry-timeline__header';
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.setAttribute('aria-expanded', 'false');
    header.innerHTML = `
      <span class="entry-timeline__label">
        <svg class="entry-timeline__label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>Timeline</span>
      </span>
      <svg class="entry-timeline__toggle-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
        <polyline points="6 9 12 15 18 9"/>
      </svg>`;

    // Build body + track
    const body = document.createElement('div');
    body.className = 'entry-timeline__body';
    const track = document.createElement('div');
    track.className = 'entry-timeline__track';

    nodes.forEach(n => {
      const node = document.createElement('div');
      node.className = 'etl-node' + (n.highlight ? ' is-highlighted' : '');
      node.innerHTML = `
        <div class="etl-node__dot">
          ${n.icon
            ? `<span class="etl-node__icon" aria-hidden="true">${n.icon}</span>`
            : '<div class="etl-node__dot-inner"></div>'}
        </div>
        <div class="etl-node__year">${n.year}</div>
        <div class="etl-node__event">${n.event}</div>
        ${n.note ? `<div class="etl-node__note">${n.note}</div>` : ''}`;
      track.appendChild(node);
    });

    body.appendChild(track);
    container.appendChild(header);
    container.appendChild(body);

    // Toggle open/close
    function toggleTimeline() {
      const open = container.classList.toggle('is-open');
      header.setAttribute('aria-expanded', String(open));
    }
    header.addEventListener('click', toggleTimeline);
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTimeline(); }
    });

    // Auto-open when scrolled into view (once)
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        container.classList.add('is-open');
        header.setAttribute('aria-expanded', 'true');
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(container);
  });
}

initTimelines();

/* =========================================================
   CONSOLE EASTER EGG
   ========================================================= */
console.log(
  '%cChain%c — Understand the chain, not just the event.\nhttps://chain.org/about\n\nBuilt with care for public knowledge.',
  'font-size:1.5rem;font-family:Georgia,serif;color:#e07a00;font-weight:bold;',
  'font-size:0.875rem;color:#909090;'
);
