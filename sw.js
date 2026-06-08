const CACHE = 'mcfa-v3';
const FILES = [
  './',
  './MCFA_PROJECT.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.allSettled(FILES.map(f => cache.add(f)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(cache =>
      fetch(e.request.clone()).then(res => {
        if (res && res.ok) cache.put(e.request, res.clone());
        return res;
      }).catch(() =>
        cache.match(e.request).then(r => r || cache.match('./MCFA_PROJECT.html'))
      )
    )
  );
});
