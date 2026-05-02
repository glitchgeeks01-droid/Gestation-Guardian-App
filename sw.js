const CACHE_NAME = 'gestguard-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/health-hub.html',
  '/profile.html',
  '/care-guide.html',
  '/kick-counter.html',
  '/log-bp.html',
  '/log-vitals.html',
  '/reminders.html',
  '/signin.html',
  '/signup.html',
  '/assessment-report.html',
  '/q1-risk-score.html',
  '/q2-risk-score.html',
  '/q3-risk-score.html',
  '/q4-risk-score.html',
  '/q5-risk-score.html',
  '/q6-risk-score.html',
  '/q7-risk-score.html',
  '/q8-risk-score.html',
  '/q9-risk-score.html',
  '/q10-risk-score.html',
  '/q11-risk-score.html',
  '/q12-risk-score.html',
  '/style.css',
  '/script.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use catch() so a single missing file doesn't block the whole cache
      return Promise.all(
        ASSETS.map(asset => {
          return cache.add(asset).catch(err => console.error('Failed to cache:', asset, err));
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => {
        // Fallback for failed network (offline)
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
