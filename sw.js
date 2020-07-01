self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('siggy').then(function(cache) {
      cache.delete('/');
      cache.delete('/index.html');
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
