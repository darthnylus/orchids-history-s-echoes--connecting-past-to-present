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
   THREAD TIMELINE BAND
   Full-width overview timeline between the argument bar and
   main content. Renders from window.THREAD_TIMELINE_BAND.
   HTML: <div id="tl-band-mount"></div>
   Data: { range: "1829–1865", nodes: [{ year, label, note?,
           entry?, icon?, highlight? }] }
   ========================================================= */
function initThreadTimelineBand() {
  const mount = document.getElementById('tl-band-mount');
  const data  = window.THREAD_TIMELINE_BAND;
  if (!mount || !data || !data.nodes || !data.nodes.length) return;

  mount.className = 'tl-band';
  mount.innerHTML = `
    <div class="tl-band__header">
      <span class="tl-band__title">
        <span class="tl-band__title-dot" aria-hidden="true"></span>
        Thread timeline
      </span>
      <span class="tl-band__range">${data.range || ''}</span>
    </div>
    <div class="tl-band__scroll" id="tlBandScroll" role="region" aria-label="Thread overview timeline">
      <div class="tl-band__track" id="tlBandTrack">
        <div class="tl-band__progress-line" id="tlProgressLine"></div>
      </div>
    </div>
    <div class="tl-band__fade-left"  aria-hidden="true"></div>
    <div class="tl-band__fade-right" aria-hidden="true"></div>
    <div class="tl-band__hint" id="tlScrollHint" aria-hidden="true">
      Scroll
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>`;

  const track    = document.getElementById('tlBandTrack');
  const scrollEl = document.getElementById('tlBandScroll');
  const progLine = document.getElementById('tlProgressLine');
  const hint     = document.getElementById('tlScrollHint');
  const nodeEls  = [];

  data.nodes.forEach((n, i) => {
    const el = document.createElement('div');
    el.className = 'tl-node';
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', `${n.year}: ${n.label}${n.entry ? ' — click to jump to entry' : ''}`);
    if (n.entry) el.dataset.entry = n.entry;

    el.innerHTML = `
      <div class="tl-node__card">
        ${n.icon ? `<span class="tl-node__icon" aria-hidden="true">${n.icon}</span>` : ''}
        <div class="tl-node__card-label">${n.label}</div>
        ${n.note ? `<div class="tl-node__card-note">${n.note}</div>` : ''}
      </div>
      <div class="tl-node__stem" aria-hidden="true"></div>
      <div class="tl-node__dot"  aria-hidden="true"></div>
      <div class="tl-node__year">${n.year}</div>`;

    el.addEventListener('click', () => {
      setActive(i);
      if (n.entry) {
        const target = document.getElementById(n.entry);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });

    track.appendChild(el);
    nodeEls.push(el);
  });

  function setActive(idx) {
    nodeEls.forEach((el, i) => el.classList.toggle('is-active', i === idx));
    // Advance progress line to active node center
    const el = nodeEls[idx];
    if (el) {
      const nodeCenter = el.offsetLeft + el.offsetWidth / 2;
      const pct = (nodeCenter / track.scrollWidth) * 100;
      progLine.style.width = Math.max(0, Math.min(100, pct)) + '%';
      // Auto-scroll timeline to keep active visible
      const visLeft  = scrollEl.scrollLeft;
      const visRight = visLeft + scrollEl.offsetWidth;
      if (el.offsetLeft < visLeft + 60 || el.offsetLeft + el.offsetWidth > visRight - 60) {
        scrollEl.scrollTo({ left: el.offsetLeft - scrollEl.offsetWidth / 2 + el.offsetWidth / 2, behavior: 'smooth' });
      }
    }
  }

  // Bidirectional link: reading entries activates timeline nodes
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const idx = data.nodes.findIndex(n => n.entry === entry.target.id);
        if (idx !== -1) setActive(idx);
      });
    }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 });

    data.nodes.forEach(n => {
      if (n.entry) { const el = document.getElementById(n.entry); if (el) obs.observe(el); }
    });
  }

  setActive(0);

  // Hide scroll hint after first user scroll
  scrollEl.addEventListener('scroll', () => hint.classList.add('is-hidden'), { once: true });

  // Drag-to-scroll (desktop)
  let drag = false, dragX = 0, dragLeft = 0;
  scrollEl.addEventListener('mousedown', e => { drag = true; dragX = e.pageX - scrollEl.offsetLeft; dragLeft = scrollEl.scrollLeft; scrollEl.style.cursor = 'grabbing'; });
  document.addEventListener('mouseup', () => { drag = false; scrollEl.style.cursor = 'grab'; });
  scrollEl.addEventListener('mousemove', e => {
    if (!drag) return;
    e.preventDefault();
    scrollEl.scrollLeft = dragLeft - (e.pageX - scrollEl.offsetLeft - dragX) * 1.2;
  });
}

initThreadTimelineBand();

/* =========================================================
   THREAD INDEX — all 126 threads, used for breadcrumbs
   and related-threads injection on individual thread pages.
   Fields: h=href, t=title, d=domain(s), e=era number,
           el=era label, c=era color hex, y=year range
   ========================================================= */
var THREAD_INDEX = [
  {h:'thread-african-origins-humanity.html',t:'Africa Is the Birthplace of Every Human Being on Earth',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'300,000 BCE – Present'},
  {h:'thread-san-people.html',t:'The San People: The Oldest Continuous Culture on Earth',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'~100,000 BCE – Present'},
  {h:'thread-green-sahara.html',t:'The Green Sahara: When the Desert Was a Fertile Lake District',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'11,000 – 3,000 BCE'},
  {h:'thread-african-empires.html',t:'Before the Chain: 7 African Empires',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'1070 BCE – 1897 CE'},
  {h:'thread-moors.html',t:'Al-Andalus: The Moorish Civilization',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'711 CE – Present'},
  {h:'thread-songhai.html',t:'The Songhai Empire',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'c. 800 CE – 1591'},
  {h:'thread-arab-slave-trade.html',t:'The Arab Slave Trade: 1,300 Years Before the Ships',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'650 CE – 1900s'},
  {h:'thread-mansa-musa.html',t:'Mansa Musa: The Richest Person Who Ever Lived',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'c. 1280 – 1337'},
  {h:'thread-nubia-kush.html',t:'Nubia & the Kingdom of Kush: The Civilization That Ruled Egypt',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'3500 BCE – 350 CE'},
  {h:'thread-african-spiritual-systems.html',t:'African Spiritual Systems: What Was Destroyed and What Survived',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'Ancient – Present'},
  {h:'thread-precolonial-governance.html',t:'Pre-Colonial African Governance: Democracy Before Europe Invented the Word',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'Ancient – 1884'},
  {h:'thread-transatlantic-slave-trade.html',t:'The Transatlantic Slave Trade, 1441–1808',d:'history-culture labor-wealth',e:2,el:'The Rupture',c:'#c0392b',y:'1441 – 1808'},
  {h:'thread-slave-ship-resistance.html',t:'Resistance on the Middle Passage',d:'history-culture',e:2,el:'The Rupture',c:'#c0392b',y:'1441 – 1808'},
  {h:'thread-middle-passage.html',t:'The Middle Passage: What the Crossing Cost',d:'history-culture',e:2,el:'The Rupture',c:'#c0392b',y:'1500 – 1808'},
  {h:'thread-code-noir.html',t:'The Code Noir: France Wrote the Rules of Slavery',d:'history-culture',e:2,el:'The Rupture',c:'#c0392b',y:'1685 – Present'},
  {h:'thread-invention-of-race.html',t:'The Invention of Race: Why Racism Was Created',d:'history-culture',e:2,el:'The Rupture',c:'#c0392b',y:'1676 – Present'},
  {h:'thread-blumenbach.html',t:'The Man Who Invented Race: Blumenbach',d:'history-culture',e:2,el:'The Rupture',c:'#c0392b',y:'1775 – Present'},
  {h:'thread-haiti.html',t:'Haiti: The $21 Billion Punishment for Revolution',d:'history-culture labor-wealth',e:2,el:'The Rupture',c:'#c0392b',y:'1791 – Present'},
  {h:'thread-haitian-revolution.html',t:'The Haitian Revolution: The Only Successful Slave Revolt in History',d:'history-culture',e:2,el:'The Rupture',c:'#c0392b',y:'1791 – Present'},
  {h:'thread-stolen-labor.html',t:'Stolen Labor: The Architecture of the Racial Wealth Gap',d:'labor-wealth',e:3,el:'Slavery & Resistance',c:'#1a6b3a',y:'1619 – Present'},
  {h:'thread-before-mayflower.html',t:'Before the Mayflower: Black America Before the Founding',d:'history-culture',e:3,el:'Slavery & Resistance',c:'#1a6b3a',y:'1513 – 1861'},
  {h:'thread-abolitionism.html',t:'The Fire Next Time: Black Abolitionists, 1829–1865',d:'history-culture',e:3,el:'Slavery & Resistance',c:'#1a6b3a',y:'1829 – 1865'},
  {h:'thread-slave-revolts.html',t:'The Fire from Below: Slave Revolts & Uprisings',d:'history-culture',e:3,el:'Slavery & Resistance',c:'#1a6b3a',y:'1739 – 1831'},
  {h:'thread-mexico-freedom.html',t:'South to Freedom: Mexico Offered Liberty',d:'history-culture',e:3,el:'Slavery & Resistance',c:'#1a6b3a',y:'1829 – 1865'},
  {h:'thread-seneca-village.html',t:'Seneca Village: Destroyed to Build Central Park',d:'history-culture housing',e:3,el:'Slavery & Resistance',c:'#1a6b3a',y:'1825 – 1857'},
  {h:'thread-weeksville.html',t:'Weeksville: The Free Black City Built Inside Brooklyn',d:'history-culture',e:3,el:'Slavery & Resistance',c:'#1a6b3a',y:'1838 – Present'},
  {h:'thread-black-church.html',t:'The Bombed Church: The Black Church in America',d:'history-culture',e:3,el:'Slavery & Resistance',c:'#1a6b3a',y:'1773 – Present'},
  {h:'thread-black-press.html',t:'The Black Press: Ida B. Wells & the Counter-Record',d:'history-culture',e:3,el:'Slavery & Resistance',c:'#1a6b3a',y:'1827 – Present'},
  {h:'thread-domestic-slave-trade.html',t:'The Domestic Slave Trade: One Million Sold South',d:'labor-wealth history-culture',e:3,el:'Slavery & Resistance',c:'#1a6b3a',y:'1790 – 1860'},
  {h:'thread-frederick-douglass.html',t:'Frederick Douglass: The Man They Could Not Silence',d:'history-culture',e:3,el:'Slavery & Resistance',c:'#1a6b3a',y:'1818 – 1895'},
  {h:'thread-harriet-tubman.html',t:'Harriet Tubman: She Never Lost a Passenger',d:'history-culture',e:3,el:'Slavery & Resistance',c:'#1a6b3a',y:'c. 1822 – 1913'},
  {h:'thread-cotton-economy.html',t:'King Cotton: How Slavery Built American Capitalism',d:'labor-wealth',e:3,el:'Slavery & Resistance',c:'#1a6b3a',y:'1793 – 1865'},
  {h:'thread-end-of-slavery.html',t:'How Slavery Really Ended',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1861 – Present'},
  {h:'thread-thirteenth-amendment.html',t:'The Exception That Swallowed the Rule: The 13th Amendment Loophole',d:'criminal-justice history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1865 – Present'},
  {h:'thread-juneteenth.html',t:'Two and a Half Years Late: Juneteenth',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1865 – Present'},
  {h:'thread-black-codes.html',t:'Black Codes: The Law That Re-Enslaved Black America',d:'criminal-justice history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1865 – Present'},
  {h:'thread-reconstruction.html',t:'Reconstruction: What Was Built and How It Was Destroyed',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1865 – 1877'},
  {h:'thread-lynching.html',t:'Spectacle and Terror: Lynching as American Policy',d:'history-culture criminal-justice',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1877 – 2022'},
  {h:'thread-fear-of-black-assembly.html',t:'What They Were Afraid Of: Fear of Black Assembly',d:'history-culture criminal-justice',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1739 – Present'},
  {h:'thread-red-summer.html',t:'Red Summer: 26 Cities, One Summer, 1919',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1919'},
  {h:'thread-emmett-till.html',t:'Emmett Till: The Murder That Started a Movement',d:'history-culture criminal-justice',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1955 – Present'},
  {h:'thread-reconstruction-politicians.html',t:'Black Reconstruction: The 2,000 Politicians They Erased',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1868 – 1901'},
  {h:'thread-convict-leasing.html',t:'Convict Leasing: Slavery by Another Name',d:'labor-wealth',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1865 – 1942'},
  {h:'thread-exodusters.html',t:'The Exodusters: 40,000 Black People Flee to Kansas',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1879 – 1880'},
  {h:'thread-sharecropping.html',t:'Sharecropping: The Slavery That Followed Slavery',d:'labor-wealth history-culture',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1865 – 1970'},
  {h:'thread-plessy.html',t:'Plessy v. Ferguson: The Supreme Court Legalizes Apartheid',d:'history-culture criminal-justice',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1896 – Present'},
  {h:'thread-voter-suppression-mechanics.html',t:'Voter Suppression Mechanics: The Toolkit That Never Went Away',d:'history-culture',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1877 – Present'},
  {h:'thread-garvey.html',t:'Marcus Garvey and the Politics of Black Nationhood',d:'history-culture',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1914 – Present'},
  {h:'thread-harlem-renaissance.html',t:'The Harlem Renaissance: Black Intellectual Power, 1920–1935',d:'history-culture',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1920 – 1935'},
  {h:'thread-jazz-blues.html',t:'Jazz, Blues & Cultural Theft: Whose Music Is This?',d:'history-culture labor-wealth',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1890s – Present'},
  {h:'thread-great-migration.html',t:'Six Million People: The Great Migration, 1910–1970',d:'history-culture housing',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1910 – Present'},
  {h:'thread-tulsa.html',t:'Black Wall Street: The Tulsa Massacre of 1921',d:'labor-wealth history-culture',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1905 – 2023'},
  {h:'thread-greenwood-pattern.html',t:'The Greenwood Pattern: They Burned It Every Time',d:'labor-wealth history-culture',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1898 – 1923'},
  {h:'thread-negro-leagues.html',t:'The Negro Leagues',d:'history-culture',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1867 – Present'},
  {h:'thread-hbcus.html',t:'HBCUs: Founded Under Exclusion, $12B Underfunded Today',d:'education',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1837 – Present'},
  {h:'thread-hbcu.html',t:'HBCUs: Founded Under Exclusion, Underfunded for a Century',d:'education',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1837 – Present'},
  {h:'thread-black-culture.html',t:'Black Culture Is American Culture: The Creation That Was Stolen',d:'history-culture labor-wealth',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1619 – Present'},
  {h:'thread-inventors.html',t:'Built by Black Hands: The Inventors America Erased',d:'history-culture labor-wealth',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1821 – Present'},
  {h:'thread-oscarville.html',t:'Oscarville, Georgia: The Erasure of Forsyth County',d:'history-culture housing',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1912 – Present'},
  {h:'thread-lake-marion.html',t:'Lake Marion: The Economy Built Over Ferguson',d:'housing labor-wealth',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1942 – Present'},
  {h:'thread-ida-b-wells.html',t:'Ida B. Wells: The Woman Who Documented American Terror',d:'history-culture',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1862 – 1931'},
  {h:'thread-dubois.html',t:'W.E.B. Du Bois: The Architect of Black Consciousness',d:'history-culture',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1868 – 1963'},
  {h:'thread-booker-t-washington.html',t:'Booker T. Washington: The Accommodation and Its Cost',d:'history-culture',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1856 – 1915'},
  {h:'thread-scottsboro.html',t:'The Scottsboro Boys: Nine Teenagers and the Trial That Exposed American Justice',d:'history-culture',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1931 – 1950'},
  {h:'thread-golden-thirteen.html',t:'The Golden Thirteen: First Black Naval Officers',d:'history-culture',e:6,el:'WWII & Post-War',c:'#1a4a6b',y:'1775 – 1987'},
  {h:'thread-gi-bill.html',t:'The GI Bill That Built the White Middle Class',d:'housing labor-wealth',e:6,el:'WWII & Post-War',c:'#1a4a6b',y:'1944 – Present'},
  {h:'thread-lily-white.html',t:'The Lily White Movement: Party of Lincoln',d:'history-culture',e:6,el:'WWII & Post-War',c:'#1a4a6b',y:'1877 – 1968'},
  {h:'thread-displacement.html',t:'The Flooded City: Five Ways Black Communities Were Taken',d:'housing labor-wealth',e:6,el:'WWII & Post-War',c:'#1a4a6b',y:'1898 – Present'},
  {h:'thread-urban-renewal.html',t:'Urban Renewal: The Highway That Ran Through Black America',d:'housing history-culture',e:6,el:'WWII & Post-War',c:'#1a4a6b',y:'1949 – Present'},
  {h:'thread-tuskegee-airmen.html',t:'The Tuskegee Airmen: 332 Fighters, Zero Bombers Lost',d:'history-culture',e:6,el:'WWII & Post-War',c:'#1a4a6b',y:'1941 – Present'},
  {h:'thread-redlining.html',t:'Redlining: The Map That Built the Wealth Gap',d:'housing labor-wealth',e:6,el:'WWII & Post-War',c:'#1a4a6b',y:'1934 – Present'},
  {h:'thread-civil-rights.html',t:'The Movement That Was Not Spontaneous',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1954 – Present'},
  {h:'thread-voting-rights.html',t:'The Right They Keep Taking: Black Voting Rights',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1870 – Present'},
  {h:'thread-self-defense.html',t:'The Right to Defend: Black Organized Self-Defense',d:'history-culture criminal-justice',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1892 – 1982'},
  {h:'thread-black-athletes.html',t:'Shut Up and Play: Ali, Kaepernick, and Athletic Protest',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1908 – Present'},
  {h:'thread-hbcu-football.html',t:'Gridiron Separate and Unequal: HBCU Football',d:'history-culture education',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1892 – Present'},
  {h:'thread-black-panthers.html',t:'What the Panthers Actually Were',d:'history-culture health',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1966 – Present'},
  {h:'thread-statue-of-liberty.html',t:'The Black Statue of Liberty',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1865 – Present'},
  {h:'thread-malcolm-x.html',t:'Malcolm X: By Any Means Necessary',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1925 – 1965'},
  {h:'thread-freedom-riders.html',t:'The Freedom Riders: The Government Knew and Did Nothing',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1961'},
  {h:'thread-birmingham.html',t:'Birmingham: The Four Girls and the Dogs',d:'history-culture criminal-justice',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1963'},
  {h:'thread-black-lgbtq.html',t:'Black LGBTQ+ History: The Revolution Marsha Started',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1969 – Present'},
  {h:'thread-black-mayors.html',t:'Black Political Power: Elected Into a System Built to Constrain Them',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1967 – Present'},
  {h:'thread-montgomery-bus-boycott.html',t:'The Montgomery Bus Boycott: 381 Days That Changed the Country',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1955 – 1956'},
  {h:'thread-selma.html',t:'Selma and Bloody Sunday: The Bridge That Produced the Voting Rights Act',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1965'},
  {h:'thread-fred-hampton.html',t:'Fred Hampton: The Chairman They Killed at 21',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1948 – 1969'},
  {h:'thread-shirley-chisholm.html',t:'Shirley Chisholm: Unbought and Unbossed',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1968 – 1983'},
  {h:'thread-black-feminism.html',t:'Black Feminism: The Movement That Was There First',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1851 – Present'},
  {h:'thread-baldwin.html',t:'The Fire Next Time: Baldwin and the White Identity Crisis',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1924 – Present'},
  {h:'thread-deindustrialization.html',t:'Deindustrialization: When the Jobs Left Black America',d:'labor-wealth history-culture',e:8,el:'Backlash Era',c:'#4a2060',y:'1970 – Present'},
  {h:'thread-mass-incarceration.html',t:'The 13th: Mass Incarceration & the Second Slavery',d:'criminal-justice',e:8,el:'Backlash Era',c:'#4a2060',y:'1865 – Present'},
  {h:'thread-capital-punishment.html',t:'Capital Punishment: Race, Death, and the American Justice System',d:'criminal-justice',e:8,el:'Backlash Era',c:'#4a2060',y:'1972 – Present'},
  {h:'thread-police.html',t:'Patrol and Punish: The Invention of American Policing',d:'criminal-justice',e:8,el:'Backlash Era',c:'#4a2060',y:'1704 – Present'},
  {h:'thread-media.html',t:'How America Images Blackness',d:'history-culture criminal-justice',e:8,el:'Backlash Era',c:'#4a2060',y:'1915 – Present'},
  {h:'thread-rap-pipeline.html',t:'The Pipeline: How Rap Was Captured',d:'criminal-justice history-culture',e:8,el:'Backlash Era',c:'#4a2060',y:'1973 – Present'},
  {h:'thread-gangs.html',t:'After the Panthers: Origins of the Crips and Bloods',d:'criminal-justice',e:8,el:'Backlash Era',c:'#4a2060',y:'1965 – Present'},
  {h:'thread-white-terror-la.html',t:'Before the Crips: White Terror Gangs in L.A.',d:'history-culture criminal-justice housing',e:8,el:'Backlash Era',c:'#4a2060',y:'1940s – 1969'},
  {h:'thread-subprime.html',t:'The Subprime Trap: 2008 Crisis Built on Black Neighborhoods',d:'housing labor-wealth',e:8,el:'Backlash Era',c:'#4a2060',y:'1990s – Present'},
  {h:'thread-racial-capitalism.html',t:'Same Ledger, New Name: Old Slavery to New Capitalism',d:'labor-wealth',e:8,el:'Backlash Era',c:'#4a2060',y:'1619 – Present'},
  {h:'thread-la-uprising.html',t:'The LA Uprising 1992: Six Days After the Verdict',d:'history-culture criminal-justice',e:8,el:'Backlash Era',c:'#4a2060',y:'1992'},
  {h:'thread-welfare-reform.html',t:'Welfare Reform: Ending Welfare As We Know It',d:'labor-wealth history-culture',e:8,el:'Backlash Era',c:'#4a2060',y:'1996 – Present'},
  {h:'thread-hiv-aids.html',t:'HIV/AIDS and Black America: The Epidemic the Government Ignored',d:'health',e:8,el:'Backlash Era',c:'#4a2060',y:'1981 – Present'},
  {h:'thread-attica.html',t:'Attica: The Massacre the Governor Ordered',d:'history-culture criminal-justice',e:8,el:'Backlash Era',c:'#4a2060',y:'1971'},
  {h:'thread-move-bombing.html',t:'The MOVE Bombing: Philadelphia Dropped a Bomb on Its Own Residents',d:'history-culture criminal-justice',e:8,el:'Backlash Era',c:'#4a2060',y:'1985'},
  {h:'thread-crack-epidemic.html',t:'The Crack Epidemic: The Drug That Was Treated as a Crime',d:'history-culture',e:8,el:'Backlash Era',c:'#4a2060',y:'1984 – 1994'},
  {h:'thread-katrina.html',t:'Katrina: What the Flood Revealed',d:'housing health',e:9,el:'Present Day',c:'#2a4a6b',y:'2005 – Present'},
  {h:'thread-bail-system.html',t:'The Bail System: Wealth Determines Freedom',d:'criminal-justice',e:9,el:'Present Day',c:'#2a4a6b',y:'Present'},
  {h:'thread-shelby-county.html',t:'Shelby County v. Holder: The Supreme Court Guts the Voting Rights Act',d:'history-culture',e:9,el:'Present Day',c:'#2a4a6b',y:'2013 – Present'},
  {h:'thread-health-disparities.html',t:'The Body as Evidence: Black Health Disparities',d:'health',e:9,el:'Present Day',c:'#2a4a6b',y:'1619 – Present'},
  {h:'thread-healthcare.html',t:'By Design: Why America Has No Universal Healthcare',d:'health',e:9,el:'Present Day',c:'#2a4a6b',y:'1917 – Present'},
  {h:'thread-environmental-racism.html',t:'Environmental Racism: Toxic by Design',d:'health housing',e:9,el:'Present Day',c:'#2a4a6b',y:'1987 – Present'},
  {h:'thread-education.html',t:'Separate Was Never Equal: Black Education in America',d:'education',e:9,el:'Present Day',c:'#2a4a6b',y:'1835 – Present'},
  {h:'thread-black-farmers.html',t:'14 Million Acres: Black Farmers and the USDA',d:'labor-wealth',e:9,el:'Present Day',c:'#2a4a6b',y:'1865 – Present'},
  {h:'thread-ferguson.html',t:'Ferguson, South Carolina: Drowned by the New Deal',d:'housing history-culture',e:9,el:'Present Day',c:'#2a4a6b',y:'1939 – Present'},
  {h:'thread-dei.html',t:'Built to Be Dismantled: The DEI Backlash',d:'labor-wealth history-culture',e:9,el:'Present Day',c:'#2a4a6b',y:'1964 – 2025'},
  {h:'thread-reparations.html',t:'What Is Owed: The Reparations Question',d:'labor-wealth history-culture',e:9,el:'Present Day',c:'#2a4a6b',y:'1865 – Present'},
  {h:'thread-diaspora.html',t:'Before, During, and After: Who Black People Are',d:'history-culture',e:9,el:'Present Day',c:'#2a4a6b',y:'Ancient Africa – Present'},
  {h:'thread-blm.html',t:'Black Lives Matter: The Largest Protest Movement in American History',d:'history-culture',e:9,el:'Present Day',c:'#2a4a6b',y:'2013 – Present'},
  {h:'thread-school-to-prison.html',t:'The School-to-Prison Pipeline: Suspended at Six, Incarcerated at Twenty',d:'criminal-justice education',e:9,el:'Present Day',c:'#2a4a6b',y:'1994 – Present'},
  {h:'thread-affirmative-action.html',t:'Affirmative Action: 45 Years of Policy, Dismantled in One Ruling',d:'education labor-wealth',e:9,el:'Present Day',c:'#2a4a6b',y:'1961 – 2023'},
  {h:'thread-black-maternal-mortality.html',t:'Black Maternal Mortality: Dying to Give Birth in America',d:'health',e:9,el:'Present Day',c:'#2a4a6b',y:'Present'},
  {h:'thread-stand-your-ground.html',t:'Stand Your Ground: The Law That Made Killing Black People Defensible',d:'criminal-justice',e:9,el:'Present Day',c:'#2a4a6b',y:'2005 – Present'},
  {h:'thread-wealth-gap.html',t:'The Racial Wealth Gap: $171,000 vs. $17,150',d:'labor-wealth',e:9,el:'Present Day',c:'#2a4a6b',y:'1865 – Present'},
  {h:'thread-george-floyd.html',t:'George Floyd and the 2020 Uprisings',d:'history-culture',e:9,el:'Present Day',c:'#2a4a6b',y:'2020 – Present'},
  {h:'thread-gentrification.html',t:'Gentrification: The Polite Word for Displacement',d:'housing labor-wealth',e:9,el:'Present Day',c:'#2a4a6b',y:'1970s – Present'},
  {h:'thread-black-mental-health.html',t:'Black Mental Health: The Weight of 400 Years',d:'history-culture',e:9,el:'Present Day',c:'#2a4a6b',y:'Ongoing'}
];

/* =========================================================
   DOMAIN LABELS — pretty display names for domain slugs
   ========================================================= */
var DOMAIN_LABELS = {
  'history-culture':   'History & Culture',
  'labor-wealth':      'Labor & Wealth',
  'housing':           'Housing',
  'criminal-justice':  'Criminal Justice',
  'education':         'Education',
  'health':            'Health'
};

/* =========================================================
   initBreadcrumb()
   Injects a breadcrumb nav bar above .thread-hero on thread
   pages, reading the current page filename and matching it
   against THREAD_INDEX to get era + domain labels.
   ========================================================= */
function initBreadcrumb() {
  var hero = document.querySelector('.thread-hero');
  if (!hero) return;

  var filename = location.pathname.split('/').pop() || 'index.html';
  var thread = THREAD_INDEX.find(function(x){ return x.h === filename; });
  if (!thread) return;

  var primaryDomain = thread.d.split(' ')[0];
  var domainLabel = DOMAIN_LABELS[primaryDomain] || primaryDomain;

  var nav = document.createElement('nav');
  nav.className = 'thread-breadcrumb';
  nav.setAttribute('aria-label', 'Breadcrumb');
  nav.innerHTML =
    '<div class="container">' +
      '<ol class="thread-breadcrumb__list">' +
        '<li class="thread-breadcrumb__item">' +
          '<a href="home.html" class="thread-breadcrumb__link">Home</a>' +
          '<span class="thread-breadcrumb__sep" aria-hidden="true">›</span>' +
        '</li>' +
        '<li class="thread-breadcrumb__item">' +
          '<a href="threads.html" class="thread-breadcrumb__link">Threads</a>' +
          '<span class="thread-breadcrumb__sep" aria-hidden="true">›</span>' +
        '</li>' +
        '<li class="thread-breadcrumb__item">' +
          '<a href="threads.html?domain=' + encodeURIComponent(primaryDomain) + '" class="thread-breadcrumb__link">' +
            domainLabel +
          '</a>' +
          '<span class="thread-breadcrumb__sep" aria-hidden="true">›</span>' +
        '</li>' +
        '<li class="thread-breadcrumb__item thread-breadcrumb__item--current" aria-current="page">' +
          '<span class="thread-breadcrumb__era-dot" style="background:' + thread.c + '" aria-hidden="true"></span>' +
          '<span class="thread-breadcrumb__era-label">' + thread.el + '</span>' +
        '</li>' +
      '</ol>' +
    '</div>';

  hero.parentNode.insertBefore(nav, hero);
}

/* =========================================================
   initRelatedThreads()
   Injects a "Related Threads" grid section before
   .thread-bottom-cta, using THREAD_INDEX to find the 4
   most relevant threads by domain overlap + era proximity.
   ========================================================= */
function initRelatedThreads() {
  var cta = document.querySelector('.thread-bottom-cta');
  if (!cta) return;

  var filename = location.pathname.split('/').pop() || 'index.html';
  var current = THREAD_INDEX.find(function(x){ return x.h === filename; });
  if (!current) return;

  var currentDomains = current.d.split(' ');

  // Score each thread: +3 per shared domain, +1 if adjacent era, -999 if same href
  var scored = THREAD_INDEX
    .filter(function(x){ return x.h !== filename; })
    .map(function(x){
      var xDomains = x.d.split(' ');
      var domainOverlap = currentDomains.filter(function(d){ return xDomains.indexOf(d) >= 0; }).length;
      var eraDiff = Math.abs(x.e - current.e);
      var eraScore = eraDiff === 0 ? 2 : eraDiff === 1 ? 1 : 0;
      return { thread: x, score: domainOverlap * 3 + eraScore };
    })
    .sort(function(a, b){ return b.score - a.score; })
    .slice(0, 4);

  if (!scored.length) return;

  var cardsHtml = scored.map(function(item){
    var t = item.thread;
    var accentRgb = t.c.replace('#','').match(/.{2}/g).map(function(v){ return parseInt(v,16); }).join(',');
    return '<a href="' + t.h + '" class="rel-thread-card" style="--rel-acc:' + t.c + ';--rel-acc-rgb:' + accentRgb + '">' +
      '<div class="rel-thread-card__era" style="color:' + t.c + '">' + t.el + ' · ' + t.y + '</div>' +
      '<div class="rel-thread-card__title">' + t.t + '</div>' +
      '<div class="rel-thread-card__arrow" aria-hidden="true">→</div>' +
    '</a>';
  }).join('');

  var section = document.createElement('section');
  section.className = 'related-threads-section';
  section.setAttribute('aria-labelledby', 'relThreadsTitle');
  section.innerHTML =
    '<div class="container">' +
      '<div class="related-threads__header">' +
        '<h2 class="related-threads__title" id="relThreadsTitle">Continue the Chain</h2>' +
        '<a href="threads.html" class="related-threads__all-link">All threads →</a>' +
      '</div>' +
      '<div class="related-threads__grid">' + cardsHtml + '</div>' +
    '</div>';

  cta.parentNode.insertBefore(section, cta);
}

initBreadcrumb();
initRelatedThreads();

/* =========================================================
   CONSOLE EASTER EGG
   ========================================================= */
console.log(
  '%cChain%c — Understand the chain, not just the event.\nhttps://chain.org/about\n\nBuilt with care for public knowledge.',
  'font-size:1.5rem;font-family:Georgia,serif;color:#e07a00;font-weight:bold;',
  'font-size:0.875rem;color:#909090;'
);
