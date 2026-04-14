/**
 * menu.js — Gnoke Bible
 * Injects topbar + nav drawer into #app-shell on every page.
 * Active nav item is marked by matching body[data-page].
 */
const Menu = (() => {
  'use strict';

  const THEME_KEY = 'gnoke_bible_theme';
  const BRAND_APP = 'Bible';
  const VERSION   = 'v1.0';

  const NAV_ITEMS = [
    { page: 'read',     icon: '📖', label: 'Read',     sub: 'Current chapter',      href: './read.html'     },
    { page: 'browse',   icon: '📚', label: 'Browse',   sub: 'Books & search',        href: './browse.html'   },
    { page: 'saved',    icon: '🔖', label: 'Saved',    sub: 'Bookmarked verses',     href: './saved.html'    },
    { page: 'settings', icon: '⚙️', label: 'Settings', sub: 'Theme & preferences',  href: './settings.html' },
    { page: 'about',    icon: 'ℹ️', label: 'About',    sub: 'App info & author',    href: './about.html'    },
  ];

  /* ── Build & inject shell ── */
  function _injectShell() {
    const slot = document.getElementById('app-shell');
    if (!slot) return;

    const navHtml = NAV_ITEMS.map(n =>
      `<a class="drawer-item" data-page="${n.page}" href="${n.href}">` +
      `<span class="drawer-item-icon">${n.icon}</span>` +
      `<span>` +
        `<span class="drawer-item-label">${n.label}</span>` +
        `<span class="drawer-item-sub">${n.sub}</span>` +
      `</span></a>`
    ).join('');

    slot.innerHTML =
      `<div id="topbar">` +
        `<button id="hamburger" aria-label="Open menu">☰</button>` +
        `<a id="brand" href="./read.html">` +
          `<span id="brand-gnoke">Gnoke</span>` +
          `<span id="brand-app">${BRAND_APP}</span>` +
        `</a>` +
        `<div class="topbar-spacer"></div>` +
        `<div id="topbar-right">` +
          `<button class="icon-btn btn-theme" id="btn-theme" title="Toggle theme">🌙</button>` +
        `</div>` +
      `</div>` +
      `<div id="drawer-overlay"></div>` +
      `<div id="drawer">` +
        `<div id="drawer-head">` +
          `<span id="drawer-gnoke">Gnoke</span>` +
          `<span id="drawer-name">${BRAND_APP}</span>` +
          `<button id="drawer-close" aria-label="Close menu">✕</button>` +
        `</div>` +
        `<nav id="drawer-nav">${navHtml}</nav>` +
        `<div id="drawer-footer">Gnoke Suite · ${VERSION}</div>` +
      `</div>`;
  }

  /* ── Theme ── */
  const Theme = {
    current() {
      return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    },
    apply(t) {
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem(THEME_KEY, t);
      document.querySelectorAll('.btn-theme').forEach(b => {
        b.textContent = t === 'dark' ? '☀️' : '🌙';
      });
    },
    toggle() { this.apply(this.current() === 'dark' ? 'light' : 'dark'); },
    init() {
      const saved = localStorage.getItem(THEME_KEY);
      this.apply(saved || 'light');
    },
  };

  /* ── Drawer ── */
  function open() {
    document.getElementById('drawer')?.classList.add('open');
    document.getElementById('drawer-overlay')?.classList.add('open');
  }
  function close() {
    document.getElementById('drawer')?.classList.remove('open');
    document.getElementById('drawer-overlay')?.classList.remove('open');
  }

  /* ── Mark active nav item ── */
  function _markActive() {
    const current = document.body.dataset.page;
    if (!current) return;
    document.querySelectorAll('.drawer-item[data-page]').forEach(el => {
      el.classList.toggle('active', el.dataset.page === current);
    });
  }

  /* ── Init ── */
  function init() {
    _injectShell();
    Theme.init();
    _markActive();

    document.getElementById('hamburger')?.addEventListener('click', open);
    document.getElementById('drawer-close')?.addEventListener('click', close);
    document.getElementById('drawer-overlay')?.addEventListener('click', close);
    document.querySelectorAll('.drawer-item').forEach(el => {
      el.addEventListener('click', close);
    });
    document.querySelectorAll('.btn-theme').forEach(btn => {
      btn.addEventListener('click', () => Theme.toggle());
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { open, close, theme: Theme };

})();
