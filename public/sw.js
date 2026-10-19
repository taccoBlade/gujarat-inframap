// Gujarat Atlas — High-Performance Roadtrip Offline Service Worker
const CACHE_NAME = 'gujarat-atlas-v1.2';

const STATIC_ASSETS = [
  '/',
  '/app.html',
  '/manifest.webmanifest',
  '/icon-192.svg',
  '/icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching core roadtrip assets for offline Gujarat exploration');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache non-fatal warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome extensions
  if (request.method !== 'GET' || url.protocol.startsWith('chrome-extension')) {
    return;
  }

  // Handle tile requests: Cache with Stale-While-Revalidate
  if (url.hostname.includes('tile.openstreetmap') || url.hostname.includes('cartocdn')) {
    event.respondWith(
      caches.open('gujarat-atlas-tiles').then((cache) => {
        return cache.match(request).then((cached) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cached);
          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // Core application assets: Network-first with instant offline cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        // If navigating to page while offline, return cached app.html
        if (request.mode === 'navigate') {
          return caches.match('/app.html');
        }
        return new Response('Offline: Content not available without network', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain' })
        });
      })
  );
});

// Explicit Roadtrip Pack Pre-download handler
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'DOWNLOAD_OFFLINE_PACK') {
    caches.open(CACHE_NAME).then(async (cache) => {
      const targets = [
        '/app.html',
        '/manifest.webmanifest',
        '/icon-192.svg',
        '/icon-512.svg'
      ];
      for (let i = 0; i < targets.length; i++) {
        try {
          await cache.add(targets[i]);
          const percent = Math.round(((i + 1) / targets.length) * 100);
          event.source.postMessage({ type: 'OFFLINE_PACK_PROGRESS', percent });
        } catch (e) {}
      }
      event.source.postMessage({ type: 'OFFLINE_PACK_COMPLETE' });
    });
  }
});
