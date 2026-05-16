/**
 * Chain SEO — Structured Data Injector
 * Runs on every thread-*.html and person-*.html page.
 * Injects: BreadcrumbList, Article (or Person), and Organization schemas.
 * No dependencies. Executes once on DOMContentLoaded.
 */
(function () {
  'use strict';

  var BASE = 'https://retrieve-your-roots.com';
  var ORG_ID = BASE + '/#organization';

  /* ── Helpers ─────────────────────────────────────────────── */

  function getMeta(name) {
    var el = document.querySelector('meta[name="' + name + '"], meta[property="' + name + '"]');
    return el ? (el.getAttribute('content') || '').trim() : '';
  }

  function injectJSON(obj) {
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.textContent = JSON.stringify(obj, null, 0);
    document.head.appendChild(s);
  }

  function pageURL() {
    var canonical = document.querySelector('link[rel="canonical"]');
    return canonical ? canonical.href : window.location.href.split('?')[0].split('#')[0];
  }

  function pageTitle() {
    var title = document.querySelector('title');
    return title ? title.textContent.trim() : '';
  }

  function pageDescription() {
    return getMeta('description') || getMeta('og:description') || '';
  }

  function ogImage() {
    return getMeta('og:image') || (BASE + '/assets/images/og-home.jpg');
  }

  function detectPageType() {
    var path = window.location.pathname;
    if (/\/person-/.test(path)) return 'person';
    if (/\/thread-/.test(path)) return 'thread';
    return 'other';
  }

  /* ── Breadcrumb ──────────────────────────────────────────── */

  function buildBreadcrumb(type, label) {
    var items = [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Chain',
        item: BASE + '/'
      }
    ];

    if (type === 'thread') {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: 'All Threads',
        item: BASE + '/threads.html'
      });
      items.push({
        '@type': 'ListItem',
        position: 3,
        name: label,
        item: pageURL()
      });
    } else if (type === 'person') {
      items.push({
        '@type': 'ListItem',
        position: 2,
        name: 'People',
        item: BASE + '/threads.html'
      });
      items.push({
        '@type': 'ListItem',
        position: 3,
        name: label,
        item: pageURL()
      });
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items
    };
  }

  /* ── Article schema (thread pages) ──────────────────────── */

  function buildArticleSchema(title, description, url, image) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: description,
      url: url,
      image: image
        ? { '@type': 'ImageObject', url: image, width: 1200, height: 630 }
        : undefined,
      publisher: {
        '@id': ORG_ID
      },
      author: {
        '@type': 'Organization',
        name: 'Chain',
        url: BASE
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url
      },
      inLanguage: 'en-US',
      about: [
        { '@type': 'Thing', name: 'African American history' },
        { '@type': 'Thing', name: 'Black history' }
      ],
      educationalUse: 'reference',
      audience: {
        '@type': 'Audience',
        audienceType: 'General public, students, educators'
      }
    };
  }

  /* ── Person schema ────────────────────────────────────────── */

  function buildPersonSchema(title, description, url) {
    var name = title.replace(/\s*—.*$/, '').trim();
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: name,
      description: description,
      url: url,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url
      }
    };
  }

  /* ── Organization (always injected as supporting entity) ── */

  function buildOrgSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': ORG_ID,
      name: 'Chain',
      url: BASE,
      description: 'A free digital history platform tracing African and Black history through causal threads from ancient African civilizations to present-day America.'
    };
  }

  /* ── Main ────────────────────────────────────────────────── */

  function run() {
    var type = detectPageType();
    if (type === 'other') return;

    var url   = pageURL();
    var title = pageTitle();
    var desc  = pageDescription();
    var img   = ogImage();

    /* Derive a clean label for the breadcrumb from the H1 or title */
    var h1 = document.querySelector('h1');
    var label = h1 ? h1.textContent.trim().replace(/\s+/g, ' ') : title.replace(/\s*—.*$/, '').trim();
    /* Cap breadcrumb label length */
    if (label.length > 80) label = label.slice(0, 77) + '…';

    injectJSON(buildBreadcrumb(type, label));
    injectJSON(buildOrgSchema());

    if (type === 'thread') {
      injectJSON(buildArticleSchema(title, desc, url, img));
    } else if (type === 'person') {
      injectJSON(buildPersonSchema(title, desc, url));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

})();
