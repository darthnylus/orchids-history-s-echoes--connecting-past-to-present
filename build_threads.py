import os

def make(filename, acc, acc_lt, hero_bg, kicker, title_html, subtitle, meta_items, central_arg, entries_html, sidebar_html, cta_eyebrow, cta_title, cta_sub, cta_href, cta_text, context_era):
    r,g,b = int(acc[1:3],16), int(acc[3:5],16), int(acc[5:7],16)
    def rgba(a): return f"rgba({r},{g},{b},{a})"
    meta_html = ''.join(f'<div class="thread-meta-item"><div class="thread-meta-item__label">{k}</div><div class="thread-meta-item__value">{v}</div></div>' for k,v in meta_items)
    with open(filename,'w') as f:
        f.write(f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>{title_html.replace('<br />','').replace('<em>','').replace('</em>','')} — Chain</title>
  <script>(function(){{var t=localStorage.getItem('chain-theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t)}})();</script>
  <style>:root{{--_bg:#f8f6f3}}[data-theme="dark"]{{--_bg:#0d0d0d}}*,*::before,*::after{{box-sizing:border-box}}body{{margin:0;background-color:var(--_bg);font-family:Inter,"Helvetica Neue",Arial,sans-serif}}.site-nav{{background:#0d0d0d;position:sticky;top:0;z-index:100;min-height:64px}}a{{color:inherit;text-decoration:none}}</style>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'"/>
  <link rel="stylesheet" href="css/system.css"/>
  <link rel="stylesheet" href="css/thread-page.css"/>
  <style>
    :root{{--acc:{acc};--acc-lt:{acc_lt}}}
    [data-theme="dark"]{{--acc:{acc};--acc-lt:{acc_lt}}}
    .thread-hero{{background:{hero_bg};padding:var(--space-16) 0 var(--space-14);position:relative;overflow:hidden}}
    .thread-hero__bg{{position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse 100% 80% at 20% 50%,{rgba('.45')} 0%,transparent 60%)}}
    .thread-hero::after{{content:'';position:absolute;bottom:0;left:0;right:0;height:140px;background:linear-gradient(to bottom,transparent,var(--_bg));pointer-events:none;z-index:1}}
    .thread-hero__inner{{position:relative;max-width:760px;z-index:2}}
    .thread-hero__kicker{{display:inline-flex;align-items:center;gap:var(--space-2);background:{rgba('.12')};border:1px solid {rgba('.30')};border-radius:999px;padding:var(--space-1) var(--space-4);font-size:var(--type-xs);font-weight:var(--weight-bold);letter-spacing:var(--tracking-wider);text-transform:uppercase;color:var(--acc-lt);margin-bottom:var(--space-6)}}
    .thread-hero__kicker-dot{{width:6px;height:6px;border-radius:50%;background:var(--acc)}}
    .thread-hero__title{{font-family:var(--font-editorial);font-size:clamp(2.25rem,5vw,4rem);font-weight:900;color:#fff;line-height:1.1;letter-spacing:-0.02em;margin-bottom:var(--space-6)}}
    .thread-hero__title em{{color:var(--acc-lt);font-style:normal}}
    .thread-hero__subtitle{{font-size:clamp(1rem,2vw,1.25rem);color:var(--ink-300);line-height:1.7;max-width:640px;margin-bottom:var(--space-8)}}
    .thread-hero__meta{{display:flex;gap:var(--space-6);flex-wrap:wrap}}
    .thread-meta-item__label{{font-size:var(--type-xs);color:var(--ink-500);text-transform:uppercase;letter-spacing:var(--tracking-wide);margin-bottom:2px}}
    .thread-meta-item__value{{font-size:var(--type-sm);font-weight:var(--weight-semibold);color:var(--ink-200)}}
    .argument-bar{{background:{rgba('.06')};border-top:1px solid {rgba('.18')};border-bottom:1px solid {rgba('.18')};padding:var(--space-5) 0}}
    .argument-bar__inner{{display:flex;align-items:flex-start;gap:var(--space-5)}}
    .argument-bar__icon{{width:36px;height:36px;flex-shrink:0;background:{rgba('.18')};border-radius:50%;display:grid;place-items:center;margin-top:2px}}
    .argument-bar__label{{font-size:var(--type-xs);font-weight:var(--weight-bold);letter-spacing:var(--tracking-wider);text-transform:uppercase;color:var(--acc-lt);margin-bottom:var(--space-1)}}
    .argument-bar__text{{font-size:var(--type-md);color:var(--ink-200);line-height:1.65;max-width:820px}}
    .argument-bar__text strong{{color:#fff}}
    .thread-body{{padding:var(--space-14) 0}}
    .thread-layout{{display:grid;grid-template-columns:1fr;gap:var(--space-10);align-items:start}}
    @media(min-width:1024px){{.thread-layout{{grid-template-columns:1fr 300px;gap:var(--space-12)}}}}
    .era-divider{{display:flex;align-items:center;gap:var(--space-4);margin:var(--space-10) 0 var(--space-4)}}
    .era-divider__line{{flex:1;height:1px;background:var(--color-border)}}
    .era-divider__badge{{font-size:var(--type-xs);font-weight:var(--weight-bold);letter-spacing:var(--tracking-wider);text-transform:uppercase;color:var(--acc);background:{rgba('.10')};border:1px solid {rgba('.22')};border-radius:999px;padding:3px var(--space-4);white-space:nowrap}}
    .entry-list{{display:flex;flex-direction:column;gap:0}}
    .entry-item{{scroll-margin-top:80px;padding:var(--space-10) 0;border-bottom:1px solid var(--color-border)}}
    .entry-item:last-of-type{{border-bottom:none}}
    .entry-item__header{{display:grid;grid-template-columns:56px 1fr;gap:var(--space-5);align-items:start;margin-bottom:var(--space-6)}}
    .entry-item__num{{width:56px;height:56px;border-radius:var(--radius-lg);display:grid;place-items:center;flex-shrink:0;font-family:var(--font-editorial);font-size:1.375rem;font-weight:900;background:{rgba('.10')};border:1px solid {rgba('.22')};color:var(--acc-lt)}}
    .entry-item__dates{{font-size:var(--type-xs);font-weight:var(--weight-bold);letter-spacing:var(--tracking-wide);text-transform:uppercase;color:var(--acc-lt);margin-bottom:var(--space-1)}}
    .entry-item__name{{font-family:var(--font-editorial);font-size:clamp(1.375rem,3vw,1.875rem);font-weight:900;color:var(--color-text-primary);line-height:1.15;margin-bottom:var(--space-1)}}
    .entry-item__location{{font-size:var(--type-sm);color:var(--color-text-tertiary)}}
    .entry-stats{{display:flex;gap:var(--space-5);flex-wrap:wrap;padding:var(--space-4) var(--space-5);background:var(--color-surface);border-radius:var(--radius-lg);border:1px solid var(--color-border);margin-bottom:var(--space-6)}}
    .entry-stat__num{{font-family:var(--font-editorial);font-size:1.25rem;font-weight:var(--weight-bold);color:var(--acc);line-height:1;margin-bottom:2px}}
    .entry-stat__label{{font-size:var(--type-xs);color:var(--color-text-tertiary)}}
    .entry-item__body{{font-size:var(--type-md);color:var(--color-text-secondary);line-height:1.8}}
    .entry-item__body p{{margin:0 0 var(--space-5)}}
    .entry-item__body p:last-child{{margin-bottom:0}}
    .entry-item__body strong{{color:var(--color-text-primary);font-weight:var(--weight-semibold)}}
    .entry-item__body em{{color:var(--acc-lt);font-style:normal;font-weight:var(--weight-semibold)}}
    .pullquote{{border-left:3px solid var(--acc);padding:var(--space-4) var(--space-6);margin:var(--space-7) 0;background:{rgba('.05')};border-radius:0 var(--radius-lg) var(--radius-lg) 0}}
    .pullquote p{{font-family:var(--font-editorial);font-size:1.15rem;color:var(--color-text-primary);line-height:1.55;margin:0 0 var(--space-2);font-style:italic}}
    .pullquote cite{{font-size:var(--type-xs);color:var(--color-text-tertiary);font-style:normal}}
    .thread-sidebar{{display:flex;flex-direction:column;gap:var(--space-6)}}
    .sidebar-card{{background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-xl);padding:var(--space-6)}}
    .sidebar-card__title{{font-size:var(--type-xs);font-weight:var(--weight-bold);letter-spacing:var(--tracking-wider);text-transform:uppercase;color:var(--acc);margin-bottom:var(--space-4)}}
    .sidebar-card__body{{font-size:var(--type-sm);color:var(--color-text-secondary);line-height:1.7}}
    .thread-bottom-cta{{background:var(--ink-950);border-top:1px solid rgba(255,255,255,.06);padding:var(--space-14) 0}}
    .thread-bottom-cta__inner{{max-width:640px}}
    .thread-bottom-cta__eyebrow{{font-size:var(--type-xs);font-weight:var(--weight-bold);letter-spacing:var(--tracking-wider);text-transform:uppercase;color:var(--acc-lt);margin-bottom:var(--space-3)}}
    .thread-bottom-cta__title{{font-family:var(--font-editorial);font-size:clamp(1.75rem,4vw,2.5rem);font-weight:900;color:#fff;line-height:1.15;margin-bottom:var(--space-4)}}
    .thread-bottom-cta__sub{{font-size:var(--type-md);color:var(--ink-300);line-height:1.7;margin-bottom:var(--space-8)}}
    .thread-bottom-cta__btns{{display:flex;gap:var(--space-4);flex-wrap:wrap}}
    .thread-bottom-cta__btn{{display:inline-flex;align-items:center;padding:var(--space-3) var(--space-6);border-radius:999px;font-size:var(--type-sm);font-weight:var(--weight-bold);text-decoration:none;transition:all var(--duration-fast)}}
    .thread-bottom-cta__btn--primary{{background:var(--acc);color:#fff}}
    .thread-bottom-cta__btn--primary:hover{{filter:brightness(1.2)}}
    .thread-bottom-cta__btn--secondary{{background:transparent;color:var(--ink-300);border:1px solid rgba(255,255,255,.15)}}
    .thread-bottom-cta__btn--secondary:hover{{background:rgba(255,255,255,.06);color:#fff}}
  </style>
</head>
<body>
<header class="site-nav">
  <div class="site-nav__inner">
    <a href="index.html" class="site-nav__wordmark"><span class="site-nav__name">Chain</span><span class="site-nav__tagline">/ Black history &amp; present-day America</span></a>
    <nav class="site-nav__links"><a href="explore.html" class="site-nav__link">Explore</a><a href="threads.html" class="site-nav__link" aria-current="true">Threads</a><a href="maps.html" class="site-nav__link">Maps &amp; Timelines</a><a href="learn.html" class="site-nav__link">Learn</a><a href="teaching.html" class="site-nav__link">Teaching</a></nav>
    <div class="site-nav__actions">
      <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark/light mode">
        <svg class="theme-toggle__icon theme-toggle__icon--moon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <svg class="theme-toggle__icon theme-toggle__icon--sun" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </button>
      <a href="donate.html" class="site-nav__donate">Support Chain</a>
    </div>
  </div>
</header>
<div class="context-ribbon context-ribbon--thread" id="contextRibbon">
  <div class="context-ribbon__inner">
    <div class="context-ribbon__stats" id="ribbonStats">
      <span class="context-ribbon__stat"><strong>Chain</strong></span>
      <span class="context-ribbon__divider">·</span>
      <span class="context-ribbon__stat">{context_era}</span>
    </div>
    <nav class="context-ribbon__nav">
      <a href="threads.html?view=journey" class="context-ribbon__link">All Threads</a>
      <a href="today.html" class="context-ribbon__link context-ribbon__link--live"><span class="context-ribbon__live-dot"></span>Today</a>
      <a href="search.html" class="context-ribbon__link">Search</a>
    </nav>
  </div>
</div>
<section class="thread-hero">
  <div class="thread-hero__bg" aria-hidden="true"></div>
  <div class="container">
    <div class="thread-hero__inner">
      <div class="thread-hero__kicker"><span class="thread-hero__kicker-dot"></span>{kicker}</div>
      <h1 class="thread-hero__title">{title_html}</h1>
      <p class="thread-hero__subtitle">{subtitle}</p>
      <div class="thread-hero__meta">{meta_html}</div>
    </div>
  </div>
</section>
<div class="argument-bar">
  <div class="container">
    <div class="argument-bar__inner">
      <div class="argument-bar__icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
      <div><div class="argument-bar__label">The Central Argument</div><p class="argument-bar__text">{central_arg}</p></div>
    </div>
  </div>
</div>
<section class="thread-body">
  <div class="container">
    <div class="thread-layout">
      <main class="thread-main"><div class="entry-list">{entries_html}</div></main>
      <aside class="thread-sidebar">{sidebar_html}</aside>
    </div>
  </div>
</section>
<section class="thread-bottom-cta">
  <div class="container">
    <div class="thread-bottom-cta__inner">
      <div class="thread-bottom-cta__eyebrow">{cta_eyebrow}</div>
      <h2 class="thread-bottom-cta__title">{cta_title}</h2>
      <p class="thread-bottom-cta__sub">{cta_sub}</p>
      <div class="thread-bottom-cta__btns">
        <a href="{cta_href}" class="thread-bottom-cta__btn thread-bottom-cta__btn--primary">{cta_text} &rarr;</a>
        <a href="threads.html" class="thread-bottom-cta__btn thread-bottom-cta__btn--secondary">All Threads</a>
      </div>
    </div>
  </div>
</section>
<footer class="site-footer">
  <div class="container">
    <div class="site-footer__inner">
      <div class="site-footer__brand"><a href="index.html" class="site-footer__wordmark">Chain</a><p class="site-footer__tagline">Understand the chain, not just the event.</p></div>
      <nav class="site-footer__nav"><a href="threads.html" class="site-footer__link">Threads</a><a href="explore.html" class="site-footer__link">Explore</a><a href="maps.html" class="site-footer__link">Maps</a><a href="about.html" class="site-footer__link">About</a><a href="sources.html" class="site-footer__link">Sources</a><a href="donate.html" class="site-footer__link">Donate</a></nav>
    </div>
    <div class="site-footer__bottom"><p class="site-footer__copy">All claims are sourced. See <a href="sources.html" class="site-footer__link">Sources</a>.</p></div>
  </div>
</footer>
<script>const t=document.getElementById('themeToggle');if(t)t.addEventListener('click',()=>{{const n=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',n);localStorage.setItem('chain-theme',n)}});</script>
<script src="js/thread-journey.js" defer></script>
</body></html>""")
    print(f"  ✓ {filename}")

print("Template loaded.")
