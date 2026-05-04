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

/* =========================================================
   BREADCRUMB + RELATED THREADS — injected from THREAD_INDEX
   ========================================================= */
(function(){
  // Only run on thread pages
  if (!document.querySelector('.thread-hero')) return;

  var DOMAIN_LABELS = {
    'history-culture':  'History & Culture',
    'labor-wealth':     'Labor & Wealth',
    'housing':          'Housing',
    'criminal-justice': 'Criminal Justice',
    'education':        'Education',
    'health':           'Health'
  };

  // THREAD_INDEX is defined in main.js — but main.js isn't loaded on thread pages.
  // Define it inline here for thread pages.
  if (typeof THREAD_INDEX === 'undefined') {
    var THREAD_INDEX = [
      {h:'thread-african-origins-humanity.html',t:'Africa Is the Birthplace of Every Human Being on Earth',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'300,000 BCE – Present'},
      {h:'thread-san-people.html',t:'The San People: The Oldest Continuous Culture on Earth',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'~100,000 BCE – Present'},
      {h:'thread-green-sahara.html',t:'The Green Sahara: When the Desert Was a Fertile Lake District',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'11,000 – 3,000 BCE'},
      {h:'thread-african-empires.html',t:'Before the Chain: 7 African Empires',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'1070 BCE – 1897 CE'},
      {h:'thread-moors.html',t:'Al-Andalus: The Moorish Civilization',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'711 CE – Present'},
      {h:'thread-songhai.html',t:'The Songhai Empire',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'c. 800 CE – 1591'},
      {h:'thread-predynastic-egypt.html',t:'Pre-Dynastic Egypt: The African Roots of the World\'s First Nation-State',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'5000 – 3100 BCE'},
      {h:'thread-imhotep.html',t:'Imhotep: The World\'s First Doctor — and How Hippocrates Got the Credit',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'c. 2650 BCE'},
      {h:'thread-african-mathematics.html',t:"Africa Invented the World's Mathematics",d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'~20,000 BCE – Present'},
      {h:'thread-pharaohs.html',t:'The Black Pharaohs: Egypt\'s African Kings',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'747 – 656 BCE'},
      {h:'thread-aksum.html',t:'The Kingdom of Aksum: Africa\'s Ancient Superpower',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'100 BCE – 940 CE'},
      {h:'thread-great-zimbabwe.html',t:'Great Zimbabwe: The City Europeans Said Africans Couldn\'t Build',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'1100 – 1450 CE'},
      {h:'thread-swahili-coast.html',t:'The Swahili Coast: Africa\'s Global Trade Network',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'800 – 1500 CE'},
      {h:'thread-arab-slave-trade.html',t:'The Arab Slave Trade: 1,300 Years Before the Ships',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'650 CE – 1900s'},
      {h:'thread-mansa-musa.html',t:'Mansa Musa: The Richest Person Who Ever Lived',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'c. 1280 – 1337'},
      {h:'thread-nubia-kush.html',t:'Nubia & the Kingdom of Kush: The Civilization That Ruled Egypt',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'3500 BCE – 350 CE'},
      {h:'thread-african-spiritual-systems.html',t:'African Spiritual Systems: What Was Destroyed and What Survived',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'Ancient – Present'},
      {h:'thread-precolonial-governance.html',t:'Pre-Colonial African Governance: Democracy Before Europe Invented the Word',d:'history-culture',e:1,el:'African Origins',c:'#b8972a',y:'Ancient – 1884'},
      {h:'thread-ife.html',t:'The Kingdom of Ife: Cradle of the Yoruba and the Bronze Heads That Shook the World',d:'history-culture',e:1,el:'African Origins',c:'#5c3d11',y:'500 – 1500 CE'},
      {h:'thread-kanem-bornu.html',t:'The Kanem–Bornu Empire: Africa\'s Longest-Lived Trading Empire',d:'history-culture',e:1,el:'African Origins',c:'#2c4a1e',y:'700 – 1900 CE'},
      {h:'thread-loango.html',t:'The Kingdom of Loango: Central Africa\'s Atlantic Powerhouse',d:'history-culture',e:1,el:'African Origins',c:'#1a5c3a',y:'1300 – 1900 CE'},
      {h:'thread-mapungubwe.html',t:'The Kingdom of Mapungubwe: Africa\'s First Class-Based State',d:'history-culture',e:1,el:'African Origins',c:'#7d5a2f',y:'900 – 1300 CE'},
      {h:'thread-medieval-nubia.html',t:'The Medieval Nubian Kingdoms: Christian Africa\'s Forgotten Civilization',d:'history-culture',e:1,el:'African Origins',c:'#3d1f6e',y:'350 – 1504 CE'},
      {h:'thread-saba.html',t:'The Kingdom of Saba (Sheba): The Queen, the Incense Road, and the African Empire That Traded with Solomon',d:'history-culture',e:1,el:'African Origins',c:'#6b3d00',y:'1000 BCE – 275 CE'},
      {h:'thread-transatlantic-slave-trade.html',t:'The Transatlantic Slave Trade, 1441–1808',d:'history-culture labor-wealth',e:2,el:'The Rupture',c:'#c0392b',y:'1441 – 1808'},
      {h:'thread-slave-ship-resistance.html',t:'Resistance on the Middle Passage',d:'history-culture',e:2,el:'The Rupture',c:'#c0392b',y:'1441 – 1808'},
      {h:'thread-middle-passage.html',t:'The Middle Passage: What the Crossing Cost',d:'history-culture',e:2,el:'The Rupture',c:'#c0392b',y:'1500 – 1808'},
      {h:'thread-code-noir.html',t:'The Code Noir: France Wrote the Rules of Slavery',d:'history-culture',e:2,el:'The Rupture',c:'#c0392b',y:'1685 – Present'},
      {h:'thread-invention-of-race.html',t:'The Invention of Race: Why Racism Was Created',d:'history-culture',e:2,el:'The Rupture',c:'#c0392b',y:'1676 – Present'},
      {h:'thread-blumenbach.html',t:'The Man Who Invented Race: Blumenbach',d:'history-culture',e:2,el:'The Rupture',c:'#c0392b',y:'1775 – Present'},
      {h:'thread-dahomey.html',t:'The Kingdom of Dahomey: The Agojie, the Slave Trade, and the State That Defied Europe',d:'history-culture',e:2,el:'The Rupture',c:'#c0392b',y:'1600 – 1894'},
      {h:'thread-haiti.html',t:'Haiti: The $21 Billion Punishment for Revolution',d:'history-culture labor-wealth',e:2,el:'The Rupture',c:'#c0392b',y:'1791 – Present'},
      {h:'thread-haitian-revolution.html',t:'The Haitian Revolution: The Only Successful Slave Revolt in History',d:'history-culture',e:2,el:'The Rupture',c:'#c0392b',y:'1791 – Present'},
      {h:'thread-france-neocolonialism.html',t:"France's Colonial Tax: 14 Nations Still Pay for Their Own Colonization",d:'history-culture labor-wealth',e:2,el:'The Rupture',c:'#c0392b',y:'1885 – Present'},
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
      {h:'thread-harriet-jacobs.html',t:'Harriet Jacobs: The Story Douglass Could Not Tell',d:'history-culture',e:3,el:'Slavery & Resistance',c:'#1a6b3a',y:'c. 1813 – 1897'},
      {h:'thread-cotton-economy.html',t:'King Cotton: How Slavery Built American Capitalism',d:'labor-wealth',e:3,el:'Slavery & Resistance',c:'#1a6b3a',y:'1793 – 1865'},
      {h:'thread-freedmens-bureau.html',t:'The Freedmen\'s Bureau: America\'s First Attempt at Reparative Justice',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1865 – 1872'},
      {h:'thread-robert-smalls.html',t:'Robert Smalls: He Stole a Confederate Warship',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1839 – 1915'},
      {h:'thread-freedmens-bank.html',t:'The Freedmen\'s Bank: The First Great Theft of Black Savings',d:'labor-wealth history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1865 – 1874'},
      {h:'thread-kkk.html',t:'The Ku Klux Klan: America\'s Terrorist Organization, 1865–Present',d:'history-culture criminal-justice',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1865 – Present'},
      {h:'thread-buffalo-soldiers.html',t:'Buffalo Soldiers: Fighting for a Country That Wouldn\'t Fight for Them',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1866 – 1944'},
      {h:'thread-ebenezer-creek.html',t:'Ebenezer Creek: The Union Army Left Them to Die',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1864'},
      {h:'thread-end-of-slavery.html',t:'How Slavery Really Ended',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1861 – Present'},
      {h:'thread-thirteenth-amendment.html',t:'The Exception That Swallowed the Rule: The 13th Amendment Loophole',d:'criminal-justice history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1865 – Present'},
      {h:'thread-juneteenth.html',t:'Two and a Half Years Late: Juneteenth',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1865 – Present'},
      {h:'thread-black-codes.html',t:'Black Codes: The Law That Re-Enslaved Black America',d:'criminal-justice history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1865 – Present'},
      {h:'thread-opelousas-massacre.html',t:'The Opelousas Massacre: 200–300 Killed to Deliver a Zero-Vote Election',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1868'},
      {h:'thread-colfax-massacre.html',t:'The Colfax Massacre: The Killing That Rewrote Constitutional Law',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1873'},
      {h:'thread-reconstruction.html',t:'Reconstruction: What Was Built and How It Was Destroyed',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1865 – 1877'},
      {h:'thread-hamburg-massacre.html',t:'The Hamburg Massacre: How Reconstruction Died at Gunpoint',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1876 – 1877'},
      {h:'thread-lynching.html',t:'Spectacle and Terror: Lynching as American Policy',d:'history-culture criminal-justice',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1877 – 2022'},
      {h:'thread-fear-of-black-assembly.html',t:'What They Were Afraid Of: Fear of Black Assembly',d:'history-culture criminal-justice',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1739 – Present'},
      {h:'thread-red-summer.html',t:'Red Summer: 26 Cities, One Summer, 1919',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1919'},
      {h:'thread-emmett-till.html',t:'Emmett Till: The Murder That Started a Movement',d:'history-culture criminal-justice',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1955 – Present'},
      {h:'thread-reconstruction-politicians.html',t:'Black Reconstruction: The 2,000 Politicians They Erased',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1868 – 1901'},
      {h:'thread-convict-leasing.html',t:'Convict Leasing: Slavery by Another Name',d:'labor-wealth',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1865 – 1942'},
      {h:'thread-exodusters.html',t:'The Exodusters: 40,000 Black People Flee to Kansas',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1879 – 1880'},
      {h:'thread-hellfighters.html',t:'The 369th Hellfighters: Black Soldiers in WWI',d:'history-culture',e:4,el:'Emancipation & Betrayal',c:'#7a3e3e',y:'1917 – 1919'},
      {h:'thread-sharecropping.html',t:'Sharecropping: The Slavery That Followed Slavery',d:'labor-wealth history-culture',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1865 – 1970'},
      {h:'thread-plessy.html',t:'Plessy v. Ferguson: The Supreme Court Legalizes Apartheid',d:'history-culture criminal-justice',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1896 – Present'},
      {h:'thread-voter-suppression-mechanics.html',t:'Voter Suppression Mechanics: The Toolkit That Never Went Away',d:'history-culture',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1877 – Present'},
      {h:'thread-garvey.html',t:'Marcus Garvey and the Politics of Black Nationhood',d:'history-culture',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1914 – Present'},
      {h:'thread-harlem-renaissance.html',t:'The Harlem Renaissance: Black Intellectual Power, 1920–1935',d:'history-culture',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1920 – 1935'},
      {h:'thread-jazz-blues.html',t:'Jazz, Blues & Cultural Theft: Whose Music Is This?',d:'history-culture labor-wealth',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1890s – Present'},
      {h:'thread-great-migration.html',t:'Six Million People: The Great Migration, 1910–1970',d:'history-culture housing',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1910 – Present'},
      {h:'thread-tulsa.html',t:'Black Wall Street: The Tulsa Massacre of 1921',d:'labor-wealth history-culture',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1905 – 2023'},
      {h:'thread-thibodaux-massacre.html',t:'The Thibodaux Massacre: What Happened When Black Workers Went on Strike',d:'history-culture labor-wealth',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1887'},
      {h:'thread-corbin-expulsion.html',t:'The Corbin Expulsion: Driven Out in a Single Night',d:'history-culture housing',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1919'},
      {h:'thread-ocoee-massacre.html',t:'The Ocoee Massacre: Election Day, 1920',d:'history-culture',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1920'},
      {h:'thread-slocum-massacre.html',t:'The Slocum Massacre: The Killing They Buried Twice',d:'history-culture housing',e:5,el:'Jim Crow Era',c:'#5c4a1e',y:'1910'},
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
      {h:'thread-tuskegee.html',t:'Tuskegee Syphilis Study: The U.S. Government\'s Medical Experiment on Black Men',d:'health criminal-justice',e:6,el:'WWII & Post-War',c:'#1a4a6b',y:'1932 – 1972'},
      {h:'thread-bruces-beach.html',t:'Bruce\'s Beach: The Black Resort Manhattan Beach Stole — and Returned',d:'housing labor-wealth history-culture',e:6,el:'WWII & Post-War',c:'#1a4a6b',y:'1912 – 2022'},
      {h:'thread-brown-v-board.html',t:'Brown v. Board of Education: The Ruling That Changed America — and Didn\'t',d:'education history-culture',e:6,el:'WWII & Post-War',c:'#1a4a6b',y:'1954'},
      {h:'thread-golden-thirteen.html',t:'The Golden Thirteen: First Black Naval Officers',d:'history-culture',e:6,el:'WWII & Post-War',c:'#1a4a6b',y:'1775 – 1987'},
      {h:'thread-gi-bill.html',t:'The GI Bill That Built the White Middle Class',d:'housing labor-wealth',e:6,el:'WWII & Post-War',c:'#1a4a6b',y:'1944 – Present'},
      {h:'thread-lily-white.html',t:'The Lily White Movement: Party of Lincoln',d:'history-culture',e:6,el:'WWII & Post-War',c:'#1a4a6b',y:'1877 – 1968'},
      {h:'thread-displacement.html',t:'The Flooded City: Five Ways Black Communities Were Taken',d:'housing labor-wealth',e:6,el:'WWII & Post-War',c:'#1a4a6b',y:'1898 – Present'},
      {h:'thread-urban-renewal.html',t:'Urban Renewal: The Highway That Ran Through Black America',d:'housing history-culture',e:6,el:'WWII & Post-War',c:'#1a4a6b',y:'1949 – Present'},
      {h:'thread-double-v.html',t:'The Double V Campaign: Fight Fascism Abroad, Fight Racism at Home',d:'history-culture',e:6,el:'WWII & Post-War',c:'#8b1a1a',y:'1942 – 1945'},
      {h:'thread-eo8802.html',t:'Executive Order 8802: How A. Philip Randolph Forced FDR's Hand',d:'history-culture',e:6,el:'WWII & Post-War',c:'#1a3a6b',y:'1941'},
      {h:'thread-detroit-1943.html',t:'The Detroit Race Riot of 1943: When the War Came Home',d:'history-culture',e:6,el:'WWII & Post-War',c:'#7a2a00',y:'1943'},
      {h:'thread-core.html',t:'CORE and the First Sit-Ins: How Civil Disobedience Was Invented Before Anyone Had a Name for It',d:'history-culture',e:6,el:'WWII & Post-War',c:'#1a4a2a',y:'1942 – 1961'},
{h:'thread-negro-market.html',t:'The Negro Market: When Corporate America Discovered Black Consumers',d:'history-culture labor-wealth',e:6,el:'WWII & Post-War',c:'#5a1a1a',y:'1940 – Present'},
      {h:'thread-tuskegee-airmen.html',t:'The Tuskegee Airmen: 332 Fighters, Zero Bombers Lost',d:'history-culture',e:6,el:'WWII & Post-War',c:'#1a4a6b',y:'1941 – Present'},
      {h:'thread-sundown-states.html',t:"Free State, White State: The North's Black Exclusion Laws",d:'housing history-culture',e:3,el:'Slavery & Resistance',c:'#0d1829',y:'1804 – Present'},
      {h:'thread-oregon-exclusion.html',t:"Oregon's Black Exclusion Law: Free State, White State",d:'housing history-culture',e:3,el:'Slavery & Resistance',c:'#0b1f0e',y:'1844 – Present'},
      {h:'thread-redlining.html',t:'Redlining: The Map That Built the Wealth Gap',d:'housing labor-wealth',e:6,el:'WWII & Post-War',c:'#1a4a6b',y:'1934 – Present'},
      {h:'thread-paul-robeson.html',t:'Paul Robeson: The Man America Tried to Erase',d:'history-culture',e:6,el:'WWII & Post-War',c:'#1a4a6b',y:'1898 – 1976'},
      {h:'thread-hidden-figures.html',t:'Hidden Figures: The Black Women Who Put America in Space',d:'history-culture',e:6,el:'WWII & Post-War',c:'#1a4a6b',y:'1943 – 1986'},
      {h:'thread-mlk.html',t:'Martin Luther King Jr.: What They Don\'t Teach You',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1929 – 1968'},
      {h:'thread-bayard-rustin.html',t:'Bayard Rustin: The Man They Hid Behind the March',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1912 – 1987'},
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
      {h:'thread-fannie-lou-hamer.html',t:'Fannie Lou Hamer: Sick and Tired of Being Sick and Tired',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1917 – 1977'},
      {h:'thread-claudette-colvin.html',t:'Claudette Colvin: She Came Before Rosa Parks',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1939 – Present'},
      {h:'thread-montgomery-bus-boycott.html',t:'The Montgomery Bus Boycott: 381 Days That Changed the Country',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1955 – 1956'},
      {h:'thread-selma.html',t:'Selma and Bloody Sunday: The Bridge That Produced the Voting Rights Act',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1965'},
      {h:'thread-jackson-state.html',t:'Jackson State: The Killing Nobody Remembers',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1970'},
      {h:'thread-16th-street-bombing.html',t:'Four Little Girls: The 16th Street Baptist Church Bombing',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1963'},
      {h:'thread-fred-hampton.html',t:'Fred Hampton: The Chairman They Killed at 21',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1948 – 1969'},
      {h:'thread-shirley-chisholm.html',t:'Shirley Chisholm: Unbought and Unbossed',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1968 – 1983'},
      {h:'thread-black-feminism.html',t:'Black Feminism: The Movement That Was There First',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1851 – Present'},
      {h:'thread-baldwin.html',t:'The Fire Next Time: Baldwin and the White Identity Crisis',d:'history-culture',e:7,el:'Civil Rights',c:'#1a5c3a',y:'1924 – Present'},
      {h:'thread-greensboro-massacre.html',t:'The Greensboro Massacre: They Filmed It and Still Walked Free',d:'history-culture criminal-justice labor-wealth',e:8,el:'Backlash Era',c:'#4a2060',y:'1979'},
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
      {h:'thread-cointelpro.html',t:"COINTELPRO: The FBI's War on Black America",d:'history-culture criminal-justice',e:8,el:'Backlash Era',c:'#4a2060',y:'1956 – 1971'},
      {h:'thread-banjo-blues.html',t:'The Banjo & the Blues: African Origins of American Music',d:'history-culture music-art',e:3,el:'Slavery & Resistance',c:'#8a5c1a',y:'1600s – Present'},
      {h:'thread-minstrelsy.html',t:'Minstrelsy: How America Learned to See Black People',d:'history-culture music-art',e:3,el:'Slavery & Resistance',c:'#1a1008',y:'1830s – Present'},
      {h:'thread-rb-rock-theft.html',t:"Why R&B Exists: Race Records, Rock & Roll, and the Theft of Black Music",d:'history-culture music-art',e:5,el:'Jim Crow Era',c:'#7a2020',y:'1920s – Present'},
      {h:'thread-michael-jackson.html',t:'Michael Jackson: The Cost of Crossing Over',d:'history-culture music-art labor-wealth',e:8,el:'Backlash Era',c:'#2a1a00',y:'1958 – 2009'},
      {h:'thread-blaxploitation.html',t:'Blaxploitation: Representation, Exploitation, and the Black Hero Hollywood Did Not Expect',d:'history-culture music-art',e:8,el:'Backlash Era',c:'#3a1400',y:'1971 – 1998'},
      {h:'thread-mtv-color-line.html',t:'MTV and the Color Line: How a Cable Channel Tried to Erase Black Music',d:'history-culture music-art media',e:8,el:'Backlash Era',c:'#1a0a3a',y:'1981 – 1988'},
      {h:'thread-prince.html',t:'Prince Rogers Nelson: The Artist, the Masters, and the War for Ownership',d:'history-culture music-art labor-wealth',e:8,el:'Backlash Era',c:'#2d0050',y:'1958 – 2016'},
      {h:'thread-parliament-funkadelic.html',t:'Parliament-Funkadelic: The Mothership, the Groove, and the Architecture of Black Joy',d:'history-culture music-art',e:8,el:'Backlash Era',c:'#0f0a2a',y:'1956 – Present'},
      {h:'thread-nichelle-nichols.html',t:'Nichelle Nichols: Lt. Uhura, MLK, and the Black Woman in Space',d:'history-culture music-art',e:8,el:'Civil Rights Era',c:'#0a1a2a',y:'1932 – 2022'},
      {h:'thread-foia.html',t:'The Freedom of Information Act: Who Owns the Truth About What the Government Did',d:'history-culture criminal-justice',e:8,el:'Accountability Era',c:'#0e2a1a',y:'1966 – Present'},
      {h:'thread-school-to-prison.html',t:'The School-to-Prison Pipeline: How the Education System Feeds the Carceral System',d:'history-culture criminal-justice education',e:8,el:'Carceral Era',c:'#1a0e00',y:'1994 – Present'},
      {h:'thread-medical-apartheid.html',t:'Medical Apartheid: The Dark History of Medical Experimentation on Black Americans',d:'history-culture health',e:8,el:'Colonial Era – Present',c:'#1a0808',y:'1600s – Present'},
      {h:'thread-african-diaspora.html',t:'One Continent: The African Origins of the Entire Human World',d:'history-culture',e:8,el:'Origins & Diaspora',c:'#0a1f0a',y:'300,000 BCE – Present'},
      {h:'thread-we-refuse.html',t:'We Refuse: A Forceful History of Black Resistance',d:'history-culture criminal-justice',e:8,el:'Resistance Era',c:'#1a0505',y:'1619 – Present'},
      {h:'thread-soul-disco.html',t:'Soul, Funk & the Disco Purge',d:'history-culture music-art',e:8,el:'Backlash Era',c:'#5a1a6b',y:'1960s – 1980s'},
      {h:'thread-punk-grunge.html',t:'Punk, Grunge & the Hidden Black Blueprint',d:'history-culture music-art',e:8,el:'Backlash Era',c:'#2a2a2a',y:'1970s – 1990s'},
      {h:'thread-hiphop-origins.html',t:'Hip-Hop: Born from Ruins',d:'history-culture music-art',e:8,el:'Backlash Era',c:'#1a4a1a',y:'1973 – Present'},
      {h:'thread-gangsta-rap.html',t:'Gangsta Rap: Resistance, Exploitation & Self-Destruction',d:'history-culture music-art criminal-justice',e:9,el:'Present Day',c:'#3a1a0a',y:'1988 – Present'},
      {h:'thread-harlem-renaissance.html',t:'The Harlem Renaissance: Black Art Rewrites America',d:'history-culture music-art',e:6,el:'Jim Crow Era',c:'#7a4a00',y:'1910 – 1940'},
      {h:'thread-jacob-lawrence.html',t:'Jacob Lawrence: Migration as Masterpiece',d:'history-culture music-art',e:7,el:'New Deal Era',c:'#1a3a5c',y:'1917 – 2000'},
      {h:'thread-gordon-parks.html',t:'Gordon Parks: Camera as Weapon',d:'history-culture music-art',e:7,el:'New Deal Era',c:'#2a1a00',y:'1912 – 2006'},
      {h:'thread-black-arts-movement.html',t:'The Black Arts Movement: Art as Revolution',d:'history-culture music-art',e:8,el:'Backlash Era',c:'#4a0a0a',y:'1965 – 1975'},
      {h:'thread-black-film.html',t:'Black Film: From Exclusion to Excellence',d:'history-culture music-art',e:5,el:'Jim Crow Era',c:'#0a0a2a',y:'1915 – Present'},
      {h:'thread-graffiti-resistance.html',t:'Graffiti: Writing on the Wall',d:'history-culture music-art',e:9,el:'Present Day',c:'#1a1a3a',y:'1970s – Present'},
      {h:'thread-stamped.html',t:'Stamped: Racist Ideas Were Not Discovered. They Were Invented.',d:'history-culture education',e:9,el:'Present Day',c:'#2a1a5a',y:'1453 – Present'},
      {h:'thread-sky-full-of-elephants.html',t:"A Sky Full of Elephants: What Black Speculative Fiction Sees That History Books Don't",d:'history-culture',e:9,el:'Present Day',c:'#2d1a6b',y:'2024'},
      {h:'thread-what-racism-is.html',t:"What Racism Actually Is: Why \"I Don't See Color\" Doesn't End It",d:'history-culture',e:9,el:'Present Day',c:'#2a4a6b',y:'1676 – Present'},
      {h:'thread-beverly-tatum.html',t:'Dr. Beverly Tatum: The Smog, the Silence, and Racial Identity',d:'history-culture education',e:9,el:'Present Day',c:'#1a3a2a',y:'1997 – Present'},
      {h:'thread-war-on-black-history.html',t:'The War on Black History: CRT, Book Bans, and the 1619 Project',d:'history-culture education',e:9,el:'Present Day',c:'#2a4a6b',y:'2019 – Present'},
      {h:'thread-algorithmic-racism.html',t:'Algorithmic Racism: How Discrimination Moved into the Machine',d:'history-culture criminal-justice',e:9,el:'Present Day',c:'#2a4a6b',y:'2000 – Present'},
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
  }

  var filename = window.location.pathname.split('/').pop() || 'index.html';
  var current = THREAD_INDEX.find(function(x){ return x.h === filename; });
  if (!current) return;

  // ---- BREADCRUMB ----
  var hero = document.querySelector('.thread-hero');
  if (hero) {
    var primaryDomain = current.d.split(' ')[0];
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
            '<a href="threads.html?domain=' + encodeURIComponent(primaryDomain) + '" class="thread-breadcrumb__link">' + domainLabel + '</a>' +
            '<span class="thread-breadcrumb__sep" aria-hidden="true">›</span>' +
          '</li>' +
          '<li class="thread-breadcrumb__item thread-breadcrumb__item--current" aria-current="page">' +
            '<span class="thread-breadcrumb__era-dot" style="background:' + current.c + '" aria-hidden="true"></span>' +
            '<span class="thread-breadcrumb__era-label">' + current.el + '</span>' +
          '</li>' +
        '</ol>' +
      '</div>';

    hero.parentNode.insertBefore(nav, hero);
  }

  // ---- RELATED THREADS GRID ----
  var cta = document.querySelector('.thread-bottom-cta');
  if (cta) {
    var currentDomains = current.d.split(' ');

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

    if (scored.length) {
      var cardsHtml = scored.map(function(item){
        var t = item.thread;
        var m = t.c.replace('#','').match(/.{2}/g);
        var rgb = m ? m.map(function(v){ return parseInt(v,16); }).join(',') : '251,191,36';
        return '<a href="' + t.h + '" class="rel-thread-card" style="--rel-acc:' + t.c + ';--rel-acc-rgb:' + rgb + '">' +
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
  }
})();
