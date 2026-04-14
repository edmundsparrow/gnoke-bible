# Gnoke Bible

A lightweight, offline-first Holy Bible (KJV) reader. Built for speed, privacy, and simplicity as part of the Gnoke Suite.

## 📖 Features

- **Hex-Grid Navigation:** Intuitive alphabetical browsing of all 66 books.
- **Fast Search:** Real-time keyword search across the entire King James Version.
- **Offline PWA:** Install to your device and read anywhere without an internet connection.
- **Personalized:** Save bookmarks, adjust font sizes, and toggle dark mode.
- **Privacy First:** Zero tracking. All data (bookmarks/settings) stays on your local device.

## 🏗 Architecture

The app follows a flat, client-side architecture designed for static hosting and high performance.

- **Frontend:** Pure HTML5, CSS3 (Custom Properties), and Vanilla JavaScript (ES6+).
- **Data Engine:** - `kjv.js`: Compressed JSON-like array containing the full KJV text.
  - `helpers.js`: Centralized logic for `localStorage` (bookmarks/settings).
- **State Management:**
  - UI state is managed via `data-page` attributes and class toggling.
  - Persistent state (Reading position) is synced to `localStorage`.
- **PWA:** Service Worker (`sw.js`) and `manifest.json` enable offline caching and standalone installation.

## 📂 File Structure

- `index.html`: Splash screen and PWA entry point.
- `browse.html`: The hexagonal alphabet grid and search engine.
- `read.html`: The core reader with chapter selection and verse rendering.
- `saved.html`: Bookmark management interface.
- `settings.html`: UI configuration and data cleanup.
- `shared.css`: Global design tokens and responsive layout system.
- `menu.js`: Global shell injection (Topbar/Drawer).

## 🚀 Getting Started

1. Clone or download the repository.
2. Ensure `global.png` is in the root for icon rendering.
3. Open `index.html` in any modern browser.
4. For PWA features, serve via HTTPS or a local server (e.g., Live Server).

## 📜 License

© 2026 Edmund Sparrow. 
Part of the Gnoke Suite. All rights reserved.

