const CACHE_NAME = 'medigesta-ve-v3.3'; // Versión incrementada

// Archivos que se almacenarán en caché para funcionamiento offline
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icons/icon-192.png',   // Añadir iconos
  './icons/icon-512.png'
];

// Instalación: guardar recursos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activación: limpiar cachés antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Estrategia de red: Cache First, luego red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Devuelve de caché si existe; si no, va a la red
      return cachedResponse || fetch(event.request);
    })
  );
});