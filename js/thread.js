/**
 * CHAIN — Thread Page JavaScript
 * Handles: reading progress, chapter nav active state,
 *          scrollytelling, keyboard navigation.
 */

/* =========================================================
   READING PROGRESS BAR
   ========================================================= */
function initReadingProgress() {
  const bar     = document.getElementById('readingBar');
  const content = document.getElementById('thread-content');
  if (!bar || !content) return;

  function updateProgress() {
    const rect = content.getBoundingClientRect();
    const totalHeight = content.scrollHeight;
    const scrolled = window.scrollY - content.offsetTop + window.innerHeight;
    const progress = Math.min(100, Math.max(0, (scrolled / totalHeight) * 100));
    bar.style.width = progress + '%';
    bar.parentElement.setAttribute('aria-valuenow', Math.round(progress));
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

initReadingProgress();

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
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -80px 0px' });

  document.querySelectorAll('.chapter, .stat-callout, .pull-quote, .evidence-box, .causal-chain, .relations-block').forEach(el => {
    el.classList.add('reveal');
    io.observe(el);
  });
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
