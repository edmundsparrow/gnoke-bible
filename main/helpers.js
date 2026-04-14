/**
 * helpers.js — Gnoke Bible
 * Shared utilities loaded before every page script.
 *
 * Public globals:
 *   toast(msg, type)         → 'ok' | 'err' | 'info'
 *   copyText(text)           → copies to clipboard
 *   downloadDataUrl(url, fn) → triggers <a> download
 *   downloadBlob(blob, fn)   → URL.createObjectURL download
 *   SavedItems               → localStorage CRUD for bookmarked verses
 *   AppSettings              → localStorage key/value settings store
 *   applyFontSize()          → applies saved font size to <body>
 */
'use strict';

/* ── Toast ── */
let _toastTimer = null;

function toast(msg, type) {
  const el = document.getElementById('toast');
  if (!el) return;
  clearTimeout(_toastTimer);
  el.textContent = msg;
  el.className = 'show' + (type === 'ok' ? ' ok' : type === 'err' ? ' err' : '');
  _toastTimer = setTimeout(() => { el.className = ''; }, 2800);
}

/* ── Clipboard ── */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast('Copied!', 'ok');
  } catch (_) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
    toast('Copied!', 'ok');
  }
}

/* ── Download helpers ── */
function downloadDataUrl(dataUrl, filename) {
  const a = document.createElement('a');
  a.href = dataUrl; a.download = filename; a.click();
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 15000);
}

/* ── SavedItems — bookmarked verses store ── */
const SavedItems = (() => {
  const KEY = 'gnoke_bible_saved';
  const MAX = 100;

  function getAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch (_) { return []; }
  }

  function save(entry) {
    const items = getAll().filter(i => i.id !== entry.id);
    items.unshift({
      id:       entry.id || (Date.now() + Math.random().toString(36).slice(2)),
      title:    entry.title    || '',
      subtitle: entry.subtitle || '',
      body:     entry.body     || '',
      meta:     entry.meta     || {},
      savedAt:  new Date().toISOString(),
    });
    if (items.length > MAX) items.length = MAX;
    localStorage.setItem(KEY, JSON.stringify(items));
  }

  function remove(id) {
    const items = getAll().filter(i => i.id !== id);
    localStorage.setItem(KEY, JSON.stringify(items));
  }

  function has(id) {
    return getAll().some(i => i.id === id);
  }

  function clear() { localStorage.removeItem(KEY); }

  return { getAll, save, remove, has, clear };
})();

/* ── AppSettings ── */
const AppSettings = (() => {
  const KEY = 'gnoke_bible_settings';

  const DEFAULTS = {
    fontSize: 'md',   /* 'sm' | 'md' | 'lg' | 'xl' */
  };

  function _load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch (_) { return { ...DEFAULTS }; }
  }

  function get(key)        { return _load()[key]; }
  function set(key, value) { const all = _load(); all[key] = value; localStorage.setItem(KEY, JSON.stringify(all)); }
  function reset()         { localStorage.removeItem(KEY); }
  function getAll()        { return _load(); }

  return { get, set, reset, getAll, DEFAULTS };
})();

/* ── Font size ── */
function applyFontSize() {
  const size = AppSettings.get('fontSize') || 'md';
  document.body.setAttribute('data-font-size', size);
}
