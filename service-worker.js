// Tên cache (đổi version khi cập nhật file để kích hoạt update)
const CACHE_NAME = 'pwa-offline-demo-v1';

// Danh sách file cần cache để chạy offline
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Cài đặt service worker: cache toàn bộ ASSETS
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  // Kích hoạt ngay phiên bản mới
  self.skipWaiting();
});

// Kích hoạt: xóa cache cũ nếu có
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Chiến lược fetch: cache-first, fallback network
self.addEventListener('fetch', event => {
  const request = event.request;
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).catch(() => {
        // Fallback đơn giản: nếu offline và không có cache, trả về index.html
        if (request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
