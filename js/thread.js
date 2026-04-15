/**
 * CHAIN — Thread Page JavaScript
 * Handles: reading progress, bookmark, chapter nav active state,
 *          scrollytelling, keyboard navigation.
 */

/* =========================================================
   READING PROGRESS BAR (auto-inject)
   ========================================================= */
function initReadingProgress() {
  // Auto-inject a fixed progress bar at top of page if not already present
  let bar = document.getElementById('chain-progress-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'chain-progress-bar';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', 'Reading progress');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-valuenow', '0');
    document.body.prepend(bar);
  }

  function updateProgress() {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (docH <= 0) return;
    const progress = Math.min(100, Math.max(0, (window.scrollY / docH) * 100));
    bar.style.width = progress + '%';
    bar.setAttribute('aria-valuenow', Math.round(progress));
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

initReadingProgress();

/* =========================================================
   BOOKMARK / SAVE THREAD
   ========================================================= */
function initBookmark() {
  const STORAGE_KEY = 'chain-bookmarks';

  function getBookmarks() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  }
  function saveBookmarks(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  const href   = window.location.pathname.split('/').pop() || window.location.pathname;
  const title  = document.querySelector('h1')?.textContent?.trim()
                 || document.title.replace(/\s*—\s*Chain\s*$/, '').trim();

  // Find sidebar to inject bookmark button into
  const sidebar = document.querySelector('.sidebar, .thread-page-sidebar, aside[aria-label*="navigation"]');
  if (!sidebar) return;

  // Create bookmark card
  const card = document.createElement('div');
  card.className = 'sidebar-card';
  card.style.padding = '12px';

  const btn = document.createElement('button');
  btn.className = 'bookmark-btn';
  btn.setAttribute('aria-label', 'Save this thread to your reading list');
  btn.innerHTML = `
    <svg class="bookmark-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
    <span class="bookmark-btn__label">Save this thread</span>
  `;

  card.appendChild(btn);
  // Insert as first child of sidebar
  sidebar.prepend(card);

  // Set initial state
  function refresh() {
    const saved = getBookmarks().some(b => b.href === href);
    btn.classList.toggle('is-saved', saved);
    btn.querySelector('.bookmark-btn__label').textContent = saved ? 'Saved to reading list' : 'Save this thread';
    btn.setAttribute('aria-pressed', String(saved));
  }
  refresh();

  btn.addEventListener('click', () => {
    let list = getBookmarks();
    const idx = list.findIndex(b => b.href === href);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.unshift({ href, title, savedAt: Date.now() });
      if (list.length > 50) list = list.slice(0, 50);
    }
    saveBookmarks(list);
    refresh();
  });
}

initBookmark();

/* =========================================================
   CHAPTER NAV — Active state on scroll
   ========================================================= */
function initChapterNav() {
  const navItems = document.querySelectorAll('.chapter-nav__item[data-chapter]');
  if (!navItems.length) return;

  const chapters = Array.from(navItems).map(item => {
    const id = item.getAttribute('data-chapter');
    return {
      navItem: item,
      section: document.getElementById(id)
    };
  }).filter(c => c.section);

  const navTotal = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-total') || '100'
  ) + 80;

  function getActiveChapter() {
    const scrollTop = window.scrollY + navTotal;
    let active = chapters[0];
    for (const c of chapters) {
      if (c.section.offsetTop <= scrollTop) {
        active = c;
      } else {
        break;
      }
    }
    return active;
  }

  function updateNav() {
    const active = getActiveChapter();
    chapters.forEach(c => {
      c.navItem.classList.toggle('is-active', c === active);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

initChapterNav();

/* =========================================================
   SMOOTH SCROLL FOR CHAPTER LINKS
   ========================================================= */
document.querySelectorAll('.chapter-nav__item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const href = item.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* =========================================================
   REVEAL CHAPTERS ON SCROLL
   ========================================================= */
if ('IntersectionObserver' in window) {
  const ioChapters = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        ioChapters.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });

  document.querySelectorAll('.chapter, .stat-callout, .pull-quote, .evidence-box, .causal-chain, .relations-block').forEach(el => {
    el.classList.add('reveal');
    ioChapters.observe(el);
  });
  window.addEventListener('pagehide', () => ioChapters.disconnect(), { once: true });
}

/* =========================================================
   SOURCE CITE — click to scroll to evidence box
   ========================================================= */
document.querySelectorAll('.source-cite').forEach(cite => {
  cite.setAttribute('tabindex', '0');
  cite.setAttribute('role', 'button');
  cite.addEventListener('click', () => {
    const nearestEvidence = cite.closest('.chapter')?.querySelector('.evidence-box');
    if (nearestEvidence) {
      nearestEvidence.scrollIntoView({ behavior: 'smooth', block: 'center' });
      nearestEvidence.style.outline = '2px solid var(--color-accent)';
      setTimeout(() => nearestEvidence.style.outline = '', 2000);
    }
  });
  cite.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cite.click();
    }
  });
});

/* =========================================================
   RELATED THREADS (auto-inject into sidebar)
   ========================================================= */
(function initRelatedThreads() {
  // Map each thread to 3-4 related threads by causal/thematic connection
  const RELATED = {
    'thread-african-empires.html':       ['thread-transatlantic-slave-trade.html','thread-moors.html','thread-diaspora.html','thread-invention-of-race.html'],
    'thread-moors.html':                 ['thread-african-empires.html','thread-transatlantic-slave-trade.html','thread-invention-of-race.html','thread-diaspora.html'],
    'thread-transatlantic-slave-trade.html': ['thread-african-empires.html','thread-end-of-slavery.html','thread-stolen-labor.html','thread-racial-capitalism.html'],
    'thread-end-of-slavery.html':        ['thread-transatlantic-slave-trade.html','thread-mass-incarceration.html','thread-juneteenth.html','thread-black-codes.html'],
    'thread-juneteenth.html':            ['thread-end-of-slavery.html','thread-voting-rights.html','thread-reconstruction.html','thread-lily-white.html'],
    'thread-invention-of-race.html':     ['thread-african-empires.html','thread-transatlantic-slave-trade.html','thread-racial-capitalism.html','thread-lynching.html'],
    'thread-stolen-labor.html':          ['thread-racial-capitalism.html','thread-gi-bill.html','thread.html','thread-black-farmers.html'],
    'thread.html':                       ['thread-gi-bill.html','thread-subprime.html','thread-stolen-labor.html','thread-displacement.html'],
    'thread-gi-bill.html':               ['thread.html','thread-stolen-labor.html','thread-great-migration.html','thread-subprime.html'],
    'thread-subprime.html':              ['thread.html','thread-gi-bill.html','thread-racial-capitalism.html','thread-displacement.html'],
    'thread-police.html':                ['thread-mass-incarceration.html','thread-war-on-drugs.html','thread-black-panthers.html','thread-civil-rights.html'],
    'thread-mass-incarceration.html':    ['thread-war-on-drugs.html','thread-police.html','thread-end-of-slavery.html','thread-rap-pipeline.html'],
    'thread-war-on-drugs.html':          ['thread-mass-incarceration.html','thread-police.html','thread-rap-pipeline.html','thread-gangs.html'],
    'thread-rap-pipeline.html':          ['thread-mass-incarceration.html','thread-war-on-drugs.html','thread-gangs.html','thread-media.html'],
    'thread-gangs.html':                 ['thread-black-panthers.html','thread-war-on-drugs.html','thread-rap-pipeline.html','thread-mass-incarceration.html'],
    'thread-voting-rights.html':         ['thread-lily-white.html','thread-civil-rights.html','thread-reconstruction.html','thread-fear-of-black-assembly.html'],
    'thread-lily-white.html':            ['thread-voting-rights.html','thread-civil-rights.html','thread-fear-of-black-assembly.html','thread-reconstruction.html'],
    'thread-civil-rights.html':          ['thread-voting-rights.html','thread-black-panthers.html','thread-fear-of-black-assembly.html','thread-lynching.html'],
    'thread-black-panthers.html':        ['thread-civil-rights.html','thread-cointelpro.html','thread-gangs.html','thread-fear-of-black-assembly.html'],
    'thread-fear-of-black-assembly.html':['thread-black-panthers.html','thread-voting-rights.html','thread-self-defense.html','thread-lynching.html'],
    'thread-self-defense.html':          ['thread-fear-of-black-assembly.html','thread-lynching.html','thread-civil-rights.html','thread-black-panthers.html'],
    'thread-lynching.html':              ['thread-fear-of-black-assembly.html','thread-self-defense.html','thread-great-migration.html','thread-police.html'],
    'thread-great-migration.html':       ['thread-lynching.html','thread.html','thread-displacement.html','thread-black-church.html'],
    'thread-displacement.html':          ['thread-great-migration.html','thread.html','thread-tulsa.html','thread-oscarville.html'],
    'thread-tulsa.html':                 ['thread-displacement.html','thread-oscarville.html','thread-racial-capitalism.html','thread-reparations.html'],
    'thread-oscarville.html':            ['thread-tulsa.html','thread-lake-lanier.html','thread-displacement.html','thread-lynching.html'],
    'thread-lake-lanier.html':           ['thread-oscarville.html','thread-displacement.html','thread-lake-marion.html','thread-racial-capitalism.html'],
    'thread-lake-marion.html':           ['thread-lake-lanier.html','thread-displacement.html','thread-ferguson.html','thread-racial-capitalism.html'],
    'thread-ferguson.html':              ['thread-lake-marion.html','thread-displacement.html','thread-racial-capitalism.html'],
    'thread-katrina.html':               ['thread-displacement.html','thread-health-disparities.html','thread-racial-capitalism.html','thread-great-migration.html'],
    'thread-education.html':             ['thread-hbcus.html','thread.html','thread-black-women.html','thread-civil-rights.html'],
    'thread-hbcus.html':                 ['thread-education.html','thread-hbcu-football.html','thread-civil-rights.html','thread-black-women.html'],
    'thread-hbcu-football.html':         ['thread-hbcus.html','thread-negro-leagues.html','thread-black-athletes.html','thread-education.html'],
    'thread-black-athletes.html':        ['thread-negro-leagues.html','thread-hbcu-football.html','thread-civil-rights.html','thread-media.html'],
    'thread-negro-leagues.html':         ['thread-black-athletes.html','thread-hbcu-football.html','thread-racial-capitalism.html'],
    'thread-black-press.html':           ['thread-media.html','thread-civil-rights.html','thread-lynching.html','thread-black-church.html'],
    'thread-media.html':                 ['thread-black-press.html','thread-rap-pipeline.html','thread-black-athletes.html','thread-invention-of-race.html'],
    'thread-black-church.html':          ['thread-civil-rights.html','thread-black-press.html','thread-great-migration.html','thread-fear-of-black-assembly.html'],
    'thread-black-women.html':           ['thread-civil-rights.html','thread-education.html','thread-stolen-labor.html','thread-voting-rights.html'],
    'thread-health-disparities.html':    ['thread-healthcare.html','thread.html','thread-racial-capitalism.html','thread-katrina.html'],
    'thread-healthcare.html':            ['thread-health-disparities.html','thread-racial-capitalism.html','thread-black-women.html'],
    'thread-black-farmers.html':         ['thread-stolen-labor.html','thread-displacement.html','thread-racial-capitalism.html','thread-gi-bill.html'],
    'thread-haiti.html':                 ['thread-transatlantic-slave-trade.html','thread-african-empires.html','thread-racial-capitalism.html'],
    'thread-racial-capitalism.html':     ['thread-stolen-labor.html','thread-transatlantic-slave-trade.html','thread-invention-of-race.html','thread-subprime.html'],
    'thread-reparations.html':           ['thread-tulsa.html','thread-stolen-labor.html','thread-racial-capitalism.html','thread-gi-bill.html'],
    'thread-dei.html':                   ['thread-civil-rights.html','thread-education.html','thread-racial-capitalism.html'],
    'thread-statue-of-liberty.html':     ['thread-invention-of-race.html','thread-transatlantic-slave-trade.html','thread-diaspora.html'],
    'thread-inventors.html':             ['thread-stolen-labor.html','thread-racial-capitalism.html','thread-education.html','thread-black-women.html'],
    'thread-diaspora.html':              ['thread-african-empires.html','thread-transatlantic-slave-trade.html','thread-haiti.html','thread-great-migration.html'],
    'thread-abolitionism.html':          ['thread-end-of-slavery.html','thread-juneteenth.html','thread-self-defense.html','thread-black-press.html'],
  };

  // Thread title lookup
  const TITLES = {
    'thread-african-empires.html':        'Before the Chain: 7 African Empires',
    'thread-moors.html':                  'Al-Andalus: The Moorish Civilization Europe Erased',
    'thread-transatlantic-slave-trade.html': 'The Rupture: The Transatlantic Slave Trade',
    'thread-end-of-slavery.html':         'How Slavery Really Ended',
    'thread-juneteenth.html':             'Two and a Half Years Late: Juneteenth',
    'thread-invention-of-race.html':      'The Invention of Race',
    'thread-stolen-labor.html':           'Stolen Labor: The Racial Wealth Gap',
    'thread.html':                        'Housing & the Racial Wealth Gap',
    'thread-gi-bill.html':                'The GI Bill That Built the White Middle Class',
    'thread-subprime.html':               'The Subprime Trap',
    'thread-police.html':                 'Patrol and Punish: The Invention of Policing',
    'thread-mass-incarceration.html':     'The 13th: Mass Incarceration',
    'thread-war-on-drugs.html':           'The War on Drugs: Nixon\'s Confession',
    'thread-rap-pipeline.html':           'The Pipeline: How Rap Was Captured',
    'thread-gangs.html':                  'After the Panthers: Origins of Crips & Bloods',
    'thread-voting-rights.html':          'The Stolen Vote: Black Voting Rights',
    'thread-lily-white.html':             'The Lily White Movement',
    'thread-civil-rights.html':           'The Movement: Civil Rights 1954–1968',
    'thread-black-panthers.html':         'What the Panthers Actually Were',
    'thread-fear-of-black-assembly.html': 'The Fear of Black Assembly',
    'thread-self-defense.html':           'The Right to Defend: Black Self-Defense',
    'thread-lynching.html':               'Spectacle and Terror: Lynching as Policy',
    'thread-great-migration.html':        'The Great Migration',
    'thread-displacement.html':           'The Flooded City: Five Ways Black Communities Were Displaced',
    'thread-tulsa.html':                  'Black Wall Street: The Tulsa Massacre',
    'thread-oscarville.html':             'Oscarville: The Racial Cleansing of Forsyth County',
    'thread-lake-lanier.html':            'Lake Lanier: Atlanta\'s Playground Was a Crime Scene',
    'thread-lake-marion.html':            'Lake Marion: The Economy Built Over Ferguson',
    'thread-ferguson.html':               'Ferguson, South Carolina: Drowned by the New Deal',
    'thread-katrina.html':                'Katrina: What the Flood Revealed',
    'thread-education.html':              'Separate Was Never Equal: Black Education',
    'thread-hbcus.html':                  'HBCUs: Founded Under Exclusion',
    'thread-hbcu-football.html':          'Gridiron Separate and Unequal: HBCU Football',
    'thread-black-athletes.html':         'Shut Up and Play',
    'thread-negro-leagues.html':          'The Negro Leagues: Black Baseball',
    'thread-black-press.html':            'The Black Press: The Counter-Record',
    'thread-media.html':                  'How America Images Blackness',
    'thread-black-church.html':           'The Bombed Church: The Black Church',
    'thread-black-women.html':            'Twice Invisible: Black Women\'s Labor & Resistance',
    'thread-health-disparities.html':     'The Body as Evidence: Black Health Disparities',
    'thread-healthcare.html':             'Why the US Has No Universal Healthcare',
    'thread-black-farmers.html':          '14 Million Acres: Black Farmers and the USDA',
    'thread-haiti.html':                  'The First and the Punished: Haiti',
    'thread-racial-capitalism.html':      'Old Slavery, New Capitalism',
    'thread-reparations.html':            'What Is Owed: The Reparations Question',
    'thread-dei.html':                    'Built to Be Dismantled: The DEI Backlash',
    'thread-statue-of-liberty.html':      'The Black Statue of Liberty',
    'thread-inventors.html':              'Built by Black Hands: The Inventors America Erased',
    'thread-diaspora.html':               'Who Black People Are: The Diaspora',
    'thread-abolitionism.html':           'The Fire Next Time: Black Abolitionists',
  };

  const currentFile = window.location.pathname.split('/').pop() || 'thread.html';
  const related = RELATED[currentFile];
  if (!related || !related.length) return;

  // Find sidebar
  const sidebar = document.querySelector('.sidebar, aside[aria-label*="navigation"], .thread-page-sidebar');
  if (!sidebar) return;

  // Build the related card
  const card = document.createElement('div');
  card.className = 'sidebar-card';
  card.innerHTML = `<div class="sidebar-card__title">Continue the chain</div>
    <nav class="sidebar-toc__list" aria-label="Related threads">
      ${related
        .filter(href => TITLES[href])
        .map(href => `
          <a class="sidebar-toc__link" href="${href}" style="display:flex;align-items:center;justify-content:space-between;gap:4px">
            <span>${TITLES[href]}</span>
            <span style="flex-shrink:0;opacity:.4;font-size:.7rem">→</span>
          </a>`)
        .join('')}
    </nav>`;

  // Append after TOC card (if present) or at end of sidebar
  const tocCard = sidebar.querySelector('#toc-card');
  if (tocCard && tocCard.nextSibling) {
    sidebar.insertBefore(card, tocCard.nextSibling);
  } else {
    sidebar.appendChild(card);
  }
})();
