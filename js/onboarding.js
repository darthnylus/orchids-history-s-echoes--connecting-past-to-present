/**
 * Chain — Onboarding System
 * 1. Nav-item hover tooltips (all pages)
 * 2. First-visit guided tour (home.html only)
 */
(function () {
  'use strict';

  /* ── 1. NAV HOVER TOOLTIPS ─────────────────────────────────────── */

  var NAV_TIPS = {
    'home.html': {
      icon: '🏠',
      title: 'Home',
      desc: 'The starting point — featured threads, era overview, and the chronological journey through Black history.',
      hint: null
    },
    'threads.html': {
      icon: '🧵',
      title: '160+ Threads',
      desc: 'Every thread in one place. Browse by historical era, domain (housing, criminal justice, wealth), or read straight through in chronological order.',
      hint: 'Start with Era 1 → African Origins'
    },
    'about.html': {
      icon: '📖',
      title: 'About Chain',
      desc: 'Our sourcing standards, editorial philosophy, and the argument for why context — not just events — is what history should teach.',
      hint: null
    },
    'resources.html': {
      icon: '📚',
      title: 'Resources',
      desc: 'Curated books, documentaries, podcasts, and primary sources organized by thread topic — for going deeper.',
      hint: null
    },
    'search.html': {
      icon: '🔍',
      title: 'Search',
      desc: 'Ask a full question or search a keyword. Covers all 160 threads, 400+ people, policies, events, and places.',
      hint: 'Try "why does the wealth gap persist?"'
    },
    'today.html': {
      icon: '📅',
      title: 'Today in Black History',
      desc: 'What happened on this date — connected to the full thread where the event lives.',
      hint: null
    },
    'teaching.html': {
      icon: '🎓',
      title: 'Teaching',
      desc: 'Curriculum-aligned pairings, discussion prompts, printable timelines, and primary source packets.',
      hint: null
    },
    'maps.html': {
      icon: '🗺',
      title: 'Maps & Timelines',
      desc: 'Visual tools: HOLC redlining overlays, the Great Migration routes, lynching geography, and interactive era timelines.',
      hint: null
    },
    'learn.html': {
      icon: '💡',
      title: 'Learn',
      desc: 'Guided reading paths for students, educators, and self-directed learners — from 30-minute introductions to deep dives.',
      hint: null
    },
    'explore.html': {
      icon: '🧭',
      title: 'Explore',
      desc: 'Browse the full archive by topic, era, or person — with filters for housing, wealth, criminal justice, health, and education.',
      hint: null
    },
    'donate.html': {
      icon: '❤',
      title: 'Support Chain',
      desc: 'Chain is free and will stay free. Donations keep it maintained, expanded, and ad-free.',
      hint: null
    },
    'submit.html': {
      icon: '✍',
      title: 'Submit a Thread',
      desc: 'Have a documented gap or correction? Submit a thread proposal with sources and we will review it.',
      hint: null
    }
  };

  /* Inject CSS once */
  var style = document.createElement('style');
  style.textContent = [
    /* Nav tooltip wrapper on each link */
    '.nav-tip-wrap{position:relative;display:inline-flex;align-items:center;}',

    /* The tooltip bubble */
    '.nav-tip{',
      'position:absolute;top:calc(100% + 10px);left:50%;',
      'transform:translateX(-50%) translateY(4px);',
      'width:230px;',
      'background:#0d0d0d;',
      'border:1px solid rgba(255,255,255,.11);',
      'border-radius:12px;',
      'padding:14px 16px 13px;',
      'box-shadow:0 16px 48px rgba(0,0,0,.55);',
      'z-index:9999;',
      'opacity:0;pointer-events:none;',
      'transition:opacity .18s ease,transform .18s ease;',
      'white-space:normal;',
    '}',
    '.nav-tip-wrap:hover .nav-tip,',
    '.nav-tip-wrap:focus-within .nav-tip{',
      'opacity:1;transform:translateX(-50%) translateY(0);pointer-events:auto;',
    '}',

    /* Arrow */
    '.nav-tip::before{',
      'content:"";position:absolute;top:-5px;left:50%;',
      'transform:translateX(-50%) rotate(45deg);',
      'width:9px;height:9px;',
      'background:#0d0d0d;',
      'border-top:1px solid rgba(255,255,255,.11);',
      'border-left:1px solid rgba(255,255,255,.11);',
    '}',

    '.nav-tip__icon{font-size:18px;line-height:1;margin-bottom:7px;display:block;}',
    '.nav-tip__title{font-size:12px;font-weight:700;color:#fff;margin-bottom:5px;letter-spacing:.01em;}',
    '.nav-tip__desc{font-size:11.5px;color:rgba(255,255,255,.62);line-height:1.55;margin:0;}',
    '.nav-tip__hint{',
      'margin-top:8px;',
      'font-size:10.5px;',
      'color:rgba(245,158,11,.75);',
      'font-style:italic;',
    '}',

    /* Keep tooltip on right edge from clipping */
    '.nav-tip-wrap:last-child .nav-tip,',
    '.nav-tip--right{left:auto;right:0;transform:translateX(0) translateY(4px);}',
    '.nav-tip-wrap:last-child .nav-tip::before,',
    '.nav-tip--right::before{left:auto;right:18px;transform:translateX(0) rotate(45deg);}',
    '.nav-tip-wrap:last-child:hover .nav-tip,',
    '.nav-tip-wrap:last-child:focus-within .nav-tip{transform:translateX(0) translateY(0);}',

    /* Don't show tooltips on small screens; don't break nav wrapping */
    '@media(max-width:767px){.nav-tip{display:none!important;}.nav-tip-wrap{display:contents;}}'
  ].join('');
  document.head.appendChild(style);

  function getPageKey(href) {
    if (!href) return null;
    var parts = href.split('/');
    var file = parts[parts.length - 1].split('?')[0];
    return file || null;
  }

  function wrapWithTooltip(link) {
    var key = getPageKey(link.getAttribute('href'));
    var tip = NAV_TIPS[key];
    if (!tip) return;

    /* Wrap in a span that holds position:relative */
    var wrap = document.createElement('span');
    wrap.className = 'nav-tip-wrap';

    var bubble = document.createElement('div');
    bubble.className = 'nav-tip';
    bubble.setAttribute('role', 'tooltip');
    bubble.innerHTML =
      '<span class="nav-tip__icon" aria-hidden="true">' + tip.icon + '</span>' +
      '<div class="nav-tip__title">' + tip.title + '</div>' +
      '<p class="nav-tip__desc">' + tip.desc + '</p>' +
      (tip.hint ? '<div class="nav-tip__hint">→ ' + tip.hint + '</div>' : '');

    link.parentNode.insertBefore(wrap, link);
    wrap.appendChild(link);
    wrap.appendChild(bubble);
  }

  /* Apply to all matching nav links */
  document.querySelectorAll('.site-nav__link, .site-nav__wordmark').forEach(wrapWithTooltip);

  /* ── 2. FIRST-VISIT TOUR (home.html only) ───────────────────────── */

  var TOUR_KEY = 'chain-tour-done';
  var isHome   = /home\.html$|^\/$|index\.html$/.test(window.location.pathname);

  if (!isHome || localStorage.getItem(TOUR_KEY)) return;

  var STEPS = [
    {
      target: '.hero__headline',
      title: 'Welcome to Chain',
      body: 'Chain tells the full story of Black history — not isolated events, but the <strong>chain of cause and effect</strong> from ancient Africa to present-day America. Each thread connects to the next.',
      position: 'bottom'
    },
    {
      target: '.hero__journey-btn',
      title: 'The Chronological Journey',
      body: 'Start at Thread 1 and read forward through 160+ threads, from African Origins to Present Day. Every thread ends by linking to the next.',
      position: 'above'
    },
    {
      target: '.hero__search-form',
      title: 'Ask Any Question',
      body: 'Search by keyword, person, policy, or full question — "Why does the racial wealth gap persist?" or "What was COINTELPRO?"',
      position: 'bottom'
    },
    {
      target: '.site-nav__links',
      title: 'Hover Any Nav Item',
      body: 'Hover the navigation links to see what each section contains before clicking. Browse by topic, find teaching materials, or explore maps and timelines.',
      position: 'bottom'
    }
  ];

  /* Build tour overlay */
  var tourStyle = document.createElement('style');
  tourStyle.textContent = [

    /* Dim backdrop (covers everything behind spotlight) */
    '.tour-spotlight{',
      'position:fixed;z-index:10001;',
      'border-radius:10px;',
      'box-shadow:0 0 0 9999px rgba(0,0,0,.68);',
      'transition:top .35s cubic-bezier(.4,0,.2,1),',
                 'left .35s cubic-bezier(.4,0,.2,1),',
                 'width .35s cubic-bezier(.4,0,.2,1),',
                 'height .35s cubic-bezier(.4,0,.2,1);',
      'pointer-events:none;',
    '}',

    /* ── Desktop card ── */
    '.tour-card{',
      'position:fixed;z-index:10002;',
      'width:340px;',
      'max-height:calc(100vh - 48px);',
      'overflow-y:auto;',
      'background:#0d0d0d;',
      'border:1px solid rgba(255,255,255,.13);',
      'border-radius:16px;',
      'padding:22px 24px 20px;',
      'box-shadow:0 24px 64px rgba(0,0,0,.7);',
      'transition:top .3s cubic-bezier(.4,0,.2,1),left .3s cubic-bezier(.4,0,.2,1);',
    '}',

    /* ── Mobile bottom-sheet ── */
    '@media(max-width:767px){',
      '.tour-card{',
        'width:100vw!important;',
        'max-width:100vw!important;',
        'left:0!important;',
        'right:0!important;',
        'bottom:0!important;',
        'top:auto!important;',
        'transform:none!important;',
        'border-radius:20px 20px 0 0;',
        'padding:8px 20px 32px;',
        'max-height:58vh;',
        'overflow-y:auto;',
        'box-shadow:0 -8px 40px rgba(0,0,0,.6);',
      '}',
      /* drag handle pill */
      '.tour-card::before{',
        'content:"";display:block;',
        'width:36px;height:4px;border-radius:2px;',
        'background:rgba(255,255,255,.2);',
        'margin:0 auto 16px;',
      '}',
      /* On mobile, spotlight covers just the top strip so card doesn't overlap target */
      '.tour-spotlight{border-radius:0;box-shadow:0 0 0 9999px rgba(0,0,0,.55);}',
      '.tour-btn-next{flex:1;padding:14px 20px;font-size:15px;border-radius:12px;}',
      '.tour-btn-skip{padding:14px 8px;font-size:13px;}',
      '.tour-card__footer{gap:10px;}',
    '}',

    /* Shared text styles */
    '.tour-card__step{',
      'font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;',
      'color:rgba(245,158,11,.85);margin-bottom:8px;',
    '}',
    '.tour-card__title{',
      'font-family:var(--font-editorial,"Playfair Display",serif);',
      'font-size:1.2rem;font-weight:800;color:#fff;',
      'line-height:1.25;margin-bottom:10px;',
    '}',
    '.tour-card__body{',
      'font-size:13.5px;color:rgba(255,255,255,.68);',
      'line-height:1.65;margin-bottom:18px;',
    '}',
    '.tour-card__body strong{color:#fff;}',
    '.tour-card__footer{display:flex;align-items:center;justify-content:space-between;gap:12px;}',
    '.tour-card__dots{display:flex;gap:6px;align-items:center;flex-shrink:0;}',
    '.tour-dot{',
      'width:7px;height:7px;border-radius:50%;',
      'background:rgba(255,255,255,.2);',
      'transition:background .2s,width .2s;',
    '}',
    '.tour-dot.is-active{background:rgba(245,158,11,.9);width:18px;border-radius:4px;}',
    '.tour-card__btns{display:flex;gap:8px;align-items:center;}',
    '.tour-btn-next{',
      'background:rgba(245,158,11,1);color:#0d0d0d;',
      'border:none;border-radius:999px;',
      'padding:9px 22px;font-size:13px;font-weight:700;',
      'cursor:pointer;transition:filter .15s;white-space:nowrap;',
    '}',
    '.tour-btn-next:hover{filter:brightness(1.08);}',
    '.tour-btn-skip{',
      'font-size:12px;color:rgba(255,255,255,.3);',
      'background:none;border:none;cursor:pointer;padding:6px;white-space:nowrap;',
    '}',
    '.tour-btn-skip:hover{color:rgba(255,255,255,.6);}',

    /* Prevent body scroll while tour runs */
    'body.tour-active{overflow:hidden;}'

  ].join('');
  document.head.appendChild(tourStyle);

  var spotlight = document.createElement('div');
  spotlight.className = 'tour-spotlight';
  document.body.appendChild(spotlight);

  var card = document.createElement('div');
  card.className = 'tour-card';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-modal', 'true');
  card.setAttribute('aria-label', 'Site tour');
  document.body.appendChild(card);

  var currentStep = 0;

  function startTour() {
    document.body.classList.add('tour-active');
    document.body.appendChild(spotlight);
    document.body.appendChild(card);
    showStep(0);
  }

  function endTour() {
    localStorage.setItem(TOUR_KEY, '1');
    if (card.parentNode)      card.parentNode.removeChild(card);
    if (spotlight.parentNode) spotlight.parentNode.removeChild(spotlight);
    document.body.classList.remove('tour-active');
  }

  function isMobile() { return window.innerWidth <= 767; }

  function positionCard(targetRect, position) {
    /* On mobile the bottom-sheet CSS handles everything */
    if (isMobile()) return;

    var margin  = 16;
    var cw      = Math.min(340, window.innerWidth - margin * 2);
    var ch      = card.offsetHeight || 220;
    var vh      = window.innerHeight;
    var top, left;

    var spaceAbove  = targetRect.top - margin;
    var spaceBelow  = vh - targetRect.bottom - margin;
    var preferAbove = (position === 'above') || (position === 'top');

    if (preferAbove && spaceAbove >= ch + margin) {
      top = targetRect.top - ch - margin;
    } else if (spaceBelow >= ch + margin) {
      top = targetRect.bottom + margin;
    } else if (spaceAbove >= spaceBelow) {
      top = targetRect.top - ch - margin;
    } else {
      top = targetRect.bottom + margin;
    }

    left = targetRect.left + (targetRect.width / 2) - (cw / 2);

    /* Hard clamp within viewport */
    left = Math.max(margin, Math.min(left, window.innerWidth - cw - margin));
    top  = Math.max(margin, Math.min(top,  vh - ch - margin));

    card.style.top    = top + 'px';
    card.style.left   = left + 'px';
    card.style.width  = cw + 'px';
    card.style.transform = 'none';
  }

  function showStep(idx) {
    var step = STEPS[idx];
    var el   = document.querySelector(step.target);
    if (!el) { idx < STEPS.length - 1 ? showStep(idx + 1) : endTour(); return; }

    var rect = el.getBoundingClientRect();
    var pad  = 8;

    /* Spotlight — position:fixed uses pure viewport coords */
    spotlight.style.top    = (rect.top    - pad) + 'px';
    spotlight.style.left   = (rect.left   - pad) + 'px';
    spotlight.style.width  = (rect.width  + pad * 2) + 'px';
    spotlight.style.height = (rect.height + pad * 2) + 'px';

    /* Card content */
    var dots = STEPS.map(function(_, i) {
      return '<div class="tour-dot' + (i === idx ? ' is-active' : '') + '"></div>';
    }).join('');

    var isLast = idx === STEPS.length - 1;

    /* Render card off-screen first so offsetHeight is accurate */
    card.style.top = '-9999px';
    card.innerHTML =
      '<div class="tour-card__step">Step ' + (idx + 1) + ' of ' + STEPS.length + '</div>' +
      '<div class="tour-card__title">' + step.title + '</div>' +
      '<div class="tour-card__body">' + step.body + '</div>' +
      '<div class="tour-card__footer">' +
        '<div class="tour-card__dots">' + dots + '</div>' +
        '<div class="tour-card__btns">' +
          '<button class="tour-btn-skip" id="tourSkip">Skip tour</button>' +
          '<button class="tour-btn-next" id="tourNext">' + (isLast ? 'Done ✓' : 'Next →') + '</button>' +
        '</div>' +
      '</div>';

    /* Position after browser has laid out the card */
    requestAnimationFrame(function () {
      positionCard(rect, step.position);
    });

    document.getElementById('tourNext').onclick = function () {
      if (isLast) { endTour(); } else { showStep(idx + 1); }
    };
    document.getElementById('tourSkip').onclick = endTour;
  }

  /* ── Persistent "?" help button ──────────────────────────── */
  var helpBtnStyle = document.createElement('style');
  helpBtnStyle.textContent =
    '.tour-help-btn{' +
      'position:fixed;bottom:24px;right:24px;z-index:9998;' +
      'width:40px;height:40px;border-radius:50%;' +
      'background:#0d0d0d;border:1px solid rgba(255,255,255,.18);' +
      'color:rgba(255,255,255,.75);font-size:17px;font-weight:700;' +
      'cursor:pointer;display:grid;place-items:center;' +
      'box-shadow:0 4px 16px rgba(0,0,0,.4);' +
      'transition:background .15s,transform .15s;' +
    '}' +
    '.tour-help-btn:hover{background:#1a1a1a;transform:scale(1.08);}' +
    /* Hide help btn while tour is running on mobile (sheet covers it) */
    '@media(max-width:767px){' +
      'body.tour-active .tour-help-btn{display:none;}' +
      '.tour-help-btn{bottom:20px;right:16px;width:36px;height:36px;font-size:15px;}' +
    '}';
  document.head.appendChild(helpBtnStyle);

  var helpBtn = document.createElement('button');
  helpBtn.className = 'tour-help-btn';
  helpBtn.setAttribute('aria-label', 'Show site tour');
  helpBtn.setAttribute('title', 'Show site tour');
  helpBtn.textContent = '?';
  document.body.appendChild(helpBtn);

  helpBtn.addEventListener('click', function () {
    localStorage.removeItem(TOUR_KEY);
    startTour();
  });

  /* Auto-start on first visit */
  if (!localStorage.getItem(TOUR_KEY)) {
    setTimeout(startTour, 900);
  }

  /* Dismiss on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') endTour();
  });

})();
