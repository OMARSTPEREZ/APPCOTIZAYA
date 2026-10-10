// Service Worker básico para CotizaRápido PWA
// Cache offline-first para assets estáticos

const CACHE_NAME = 'cotizarapido-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Solo manejar peticiones GET
  if (event.request.method !== 'GET') return;

  // Estrategia: Network First para API, Cache First para assets
  const url = new URL(event.request.url);
  const isSupabaseAPI = url.hostname.includes('supabase.co');

  if (isSupabaseAPI) {
    // Network first para Supabase
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  } else {
    // Cache first para assets estáticos
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        });
      })
    );
  }
});

// Notificaciones push (para futuras versiones Pro)
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'CotizaRápido', {
      body: data.body || 'Tienes una actualización',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
    })
  );
});
