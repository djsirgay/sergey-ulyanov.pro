const CACHE_PREFIX = 'joyofphonetics-';
const CACHE = CACHE_PREFIX + 'v15-20261018-practitioner-feedback';
const ASSETS = ['./', './index.html', './base.css', './catalog.css', './workspace.css', './responsive.css', './presentation.css', './presentation.js', './assets/joy-logo-cream.webp', './assets/joy-logo-lavender.webp', './assets/joy-mouth-32.png', './assets/joy-mouth-192.png', './assets/joy-mouth-512.png', './assets/louis-colaianni.webp', './core.js', './discover.js', './lab.js', './coach.js', './research.js', './archive-index.json', './gmu-index.json', './manifest.webmanifest'];
const staticPaths = new Set(ASSETS.map(path => new URL(path, self.registration.scope).pathname));
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Only this tool's static shell: never capture third-party audio or another tool's data.
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !staticPaths.has(url.pathname)) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(event.request, {ignoreSearch: true});
    if (cached) return cached;
    const response = await fetch(event.request);
    if (response.ok && response.type !== 'opaque') await cache.put(event.request, response.clone());
    return response;
  }));
});
