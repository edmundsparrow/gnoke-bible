/**
 * sw.js — Gnoke Bible  v1.0
 * Service worker · offline-first · cache-first strategy.
 *
 * ── BUMP ON EVERY DEPLOY ──────────────────────────────────────
 * Change CACHE version string whenever any file changes.
 * Old caches are automatically deleted on activate.
 * Format: gnoke-bible-v{n}
 */
const CACHE = 'gnoke-bible-v1';

const PRECACHE = [
  /* Root */
  './',
  './index.html',
  './manifest.json',
  './global.png',

  /* Shared assets */
  './main/shared.css',
  './main/helpers.js',
  './main/menu.js',

  /*
    KJV data file — this is the largest asset (~4 MB).
    Caching it here means the full Bible is available offline
    after the very first page load.
  */
  './main/kjv.js',

  /* App pages */
  './main/read.html',
  './main/browse.html',
  './main/saved.html',
  './main/settings.html',
  './main/about.html',
];

/* ── Install: pre-cache all assets ── */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

/* ── Activate: remove stale caches ── */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── Fetch: cache-first, network fallback ── */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request))
  );
});
