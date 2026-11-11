// Service worker: lar appen virke uten nett og oppdatere seg når version.js endres.
// Rører ALDRI brukerdata (de ligger i localStorage på enheten).
importScripts('version.js');
const CACHE = 'trener-' + self.APP_VERSION;
const FILES = ['./', 'index.html', 'version.js', 'manifest.webmanifest', 'icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(FILES.map(f => c.add(new Request(f, { cache: 'reload' })))))
      .then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true })
      .then(r => r || fetch(e.request))
      .catch(() => caches.match('index.html'))
  );
});
