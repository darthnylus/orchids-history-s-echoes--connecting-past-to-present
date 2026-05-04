/* ============================================================
   CHAIN — Webflow-style Scroll FX Engine
   Drives all wf-* animation classes via IntersectionObserver,
   scroll events, and mouse events.
   ============================================================ */

(function () {
  'use strict';

  /* ── Respect reduced motion preference ─────────────────── */
  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. SCROLL PROGRESS BAR ─────────────────────────────── */
  (function initProgressBar() {
    const bar = document.createElement('div');
    bar.className = 'wf-progress-bar';
    bar.setAttribute('aria-hidden', 'true');
    document.body.prepend(bar);

    if (noMotion) { bar.style.display = 'none'; return; }

    function update() {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = docH > 0 ? ((scrollTop / docH) * 100).toFixed(2) + '%' : '0%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  })();

  /* ── 2. MAIN SCROLL REVEAL OBSERVER ─────────────────────── */
  (function initReveal() {
    const SELECTOR = [
      '.wf-fade', '.wf-up', '.wf-down', '.wf-left', '.wf-right',
      '.wf-scale', '.wf-zoom', '.wf-clip', '.wf-clip-lr',
      '.wf-eyebrow', '.wf-stat-pop', '.wf-flip', '.wf-blur',
      '.wf-divider', '.wf-split',
    ].join(', ');

    if (noMotion) {
      document.querySelectorAll(SELECTOR).forEach(el => el.classList.add('wf-visible'));
      return;
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('wf-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

    document.querySelectorAll(SELECTOR).forEach(el => obs.observe(el));
  })();

  /* ── 3. STAGGER REVEAL ───────────────────────────────────── */
  (function initStagger() {
    const SELECTOR = '.wf-stagger, .wf-grid-reveal';

    if (noMotion) {
      document.querySelectorAll(SELECTOR).forEach(el => {
        el.classList.add('wf-visible');
      });
      return;
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const parent = entry.target;
          /* Stamp --wf-i on each child for CSS delay calc */
          Array.from(parent.children).forEach((child, i) => {
            child.style.setProperty('--wf-i', i);
          });
          parent.classList.add('wf-visible');
          obs.unobserve(parent);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -32px 0px' });

    document.querySelectorAll(SELECTOR).forEach(el => obs.observe(el));
  })();

  /* ── 4. TEXT WORD SPLIT ──────────────────────────────────── */
  (function initTextSplit() {
    if (noMotion) return;

    document.querySelectorAll('[data-wf-split="words"]').forEach(el => {
      el.classList.add('wf-split');
      const text = el.textContent;
      const words = text.split(/(\s+)/);
      el.innerHTML = words.map(w =>
        w.trim().length
          ? `<span class="wf-word" aria-hidden="true">${w}</span>`
          : w
      ).join('');
      /* Preserve screen reader text */
      el.setAttribute('aria-label', text);
    });

    /* Observe split elements */
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const words = entry.target.querySelectorAll('.wf-word');
          words.forEach((w, i) => {
            w.style.transitionDelay = (i * 0.055) + 's';
          });
          entry.target.classList.add('wf-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.wf-split').forEach(el => obs.observe(el));
  })();

  /* ── 5. COUNTER ANIMATION ────────────────────────────────── */
  (function initCounters() {
    if (noMotion) return;

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function animateCounter(el) {
      const raw = el.dataset.wfTarget || el.textContent;
      /* Parse: "12.5M", "400 yrs", "$1,800", "16", "29" */
      const suffix = (raw.match(/[^0-9.]+$/) || [''])[0].trim();
      const prefix = (raw.match(/^[^0-9.]+/) || [''])[0].trim();
      const numStr = raw.replace(/[^0-9.]/g, '');
      const target = parseFloat(numStr);
      if (isNaN(target)) return;

      const decimals = numStr.includes('.') ? (numStr.split('.')[1] || '').length : 0;
      const duration = Math.min(2000, 800 + target * (decimals > 0 ? 200 : 20));
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = easeOut(progress) * target;
        el.textContent =
          prefix +
          value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
          (suffix ? ' ' + suffix : '');
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.wf-counter').forEach(el => {
      /* Store original value before first animation */
      if (!el.dataset.wfTarget) el.dataset.wfTarget = el.textContent.trim();
      obs.observe(el);
    });
  })();

  /* ── 6. PARALLAX ─────────────────────────────────────────── */
  (function initParallax() {
    if (noMotion) return;

    const els = Array.from(document.querySelectorAll('[data-parallax]'));
    if (!els.length) return;

    function update() {
      els.forEach(el => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const viewCenter = window.innerHeight / 2;
        const offset = (center - viewCenter) / window.innerHeight;
        const speed = parseFloat(el.dataset.parallax) || 0.15;
        el.style.transform = `translateY(${offset * speed * 100}px)`;
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  })();

  /* ── 7. MAGNETIC TILT CARDS ──────────────────────────────── */
  (function initTilt() {
    if (noMotion) return;

    document.querySelectorAll('.wf-tilt').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        const tiltX = dy * -6;  /* degrees */
        const tiltY = dx *  6;
        el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  })();

  /* ── 8. SPOTLIGHT MOUSE FOLLOW ───────────────────────────── */
  (function initSpotlight() {
    document.querySelectorAll('.wf-spotlight').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
        el.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
      });
    });
  })();

  /* ── 9. RIPPLE BUTTONS ───────────────────────────────────── */
  (function initRipple() {
    document.querySelectorAll('.wf-ripple').forEach(el => {
      el.addEventListener('click', (e) => {
        const rect = el.getBoundingClientRect();
        const ink = document.createElement('span');
        ink.className = 'wf-ripple__ink';
        const size = Math.max(rect.width, rect.height);
        ink.style.cssText = [
          `width:${size}px`,
          `height:${size}px`,
          `left:${e.clientX - rect.left - size / 2}px`,
          `top:${e.clientY - rect.top - size / 2}px`,
        ].join(';');
        el.appendChild(ink);
        ink.addEventListener('animationend', () => ink.remove());
      });
    });
  })();

  /* ── 10. SECTION PROGRESS DOTS ───────────────────────────── */
  (function initProgressDots() {
    const sections = Array.from(
      document.querySelectorAll('[data-wf-section]')
    );
    if (sections.length < 2) return;

    const sidebar = document.createElement('nav');
    sidebar.className = 'wf-progress-sidebar';
    sidebar.setAttribute('aria-label', 'Page sections');

    const dots = sections.map((sec, i) => {
      const dot = document.createElement('button');
      dot.className = 'wf-progress-dot';
      const label = sec.dataset.wfSection || ('Section ' + (i + 1));
      dot.setAttribute('aria-label', label);
      dot.addEventListener('click', () => {
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      sidebar.appendChild(dot);
      return dot;
    });

    document.body.appendChild(sidebar);

    /* Show sidebar after first scroll */
    let shown = false;
    function showOnScroll() {
      if (!shown && window.scrollY > 200) {
        sidebar.classList.add('wf-visible');
        shown = true;
      }
    }
    window.addEventListener('scroll', showOnScroll, { passive: true });

    /* Active dot tracking */
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const i = sections.indexOf(entry.target);
        if (i === -1) return;
        if (entry.isIntersecting) {
          dots.forEach(d => d.classList.remove('wf-active'));
          dots[i].classList.add('wf-active');
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(sec => obs.observe(sec));
  })();

  /* ── 11. UNDERLINE REVEAL (anchored to parent observe) ──── */
  (function initUnderline() {
    if (noMotion) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('wf-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.wf-underline').forEach(el => obs.observe(el));
  })();

  /* ── 12. MARQUEE DUPLICATE ───────────────────────────────── */
  (function initMarquee() {
    document.querySelectorAll('.wf-marquee__inner').forEach(inner => {
      if (!inner.dataset.wfDuped) {
        inner.innerHTML += inner.innerHTML;
        inner.dataset.wfDuped = '1';
      }
    });
  })();

  /* ── 13. HORIZONTAL SCROLL — DRAG TO SCROLL ─────────────── */
  (function initHScroll() {
    document.querySelectorAll('.wf-hscroll').forEach(el => {
      let isDown = false, startX = 0, scrollLeft = 0;
      el.addEventListener('mousedown', (e) => {
        isDown = true;
        el.style.cursor = 'grabbing';
        startX = e.pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
      });
      el.addEventListener('mouseleave', () => { isDown = false; el.style.cursor = ''; });
      el.addEventListener('mouseup', () => { isDown = false; el.style.cursor = ''; });
      el.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX) * 1.4;
        el.scrollLeft = scrollLeft - walk;
      });
    });
  })();

})();
