// Saves Ivy and Ryan's Play Garden on the device so it plays with no internet.
// Bump VERSION whenever index.html changes so devices pick up the new game.
const VERSION = 'play-garden-v3';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Andika:wght@400;700&family=Grandstander:wght@600;700;800&display=swap';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    await cache.addAll(SHELL);
    // Fonts are optional: the game falls back to built-in fonts if this fails.
    try {
      const res = await fetch(FONT_CSS);
      if (res.ok) {
        const css = await res.clone().text();
        await cache.put(FONT_CSS, res);
        const urls = Array.from(new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^)'"\s]+/g) || []));
        await Promise.all(urls.map(u => fetch(u, { mode: 'cors' }).then(r => (r.ok ? cache.put(u, r) : null)).catch(() => null)));
      }
    } catch (err) { /* offline during install: fonts are cached later when online */ }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

const withTimeout = (promise, ms) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('timeout')), ms);
  promise.then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); });
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Google Fonts: use the saved copy, fetch and save it the first time.
  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
    event.respondWith(caches.match(req, { ignoreVary: true }).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(req, copy));
      return res;
    })));
    return;
  }
  if (url.origin !== self.location.origin) return;

  // The page itself: try the network briefly for updates, otherwise use the saved copy.
  if (req.mode === 'navigate') {
    event.respondWith(withTimeout(fetch(req), 3000).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put('./index.html', copy)); }
      return res;
    }).catch(() => caches.match('./index.html', { ignoreSearch: true })));
    return;
  }

  // Everything else: saved copy first, refresh it in the background.
  event.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => {
    const net = fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
