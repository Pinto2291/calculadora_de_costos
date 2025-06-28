const CACHE_NAME = 'calculadora-precios-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Si tuvieras archivos de CSS o JS separados, los añadirías aquí
  // '/style.css',
  // '/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el recurso está en la caché, lo devuelve. Si no, lo busca en la red.
        return response || fetch(event.request);
      })
  );
});