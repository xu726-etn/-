const CACHE_NAME = 'yogurt-app-cache-v1';
const urlsToCache = [
  './', // 缓存根目录，这里会指向您的 yogurt_management.html
  './yogurt_management.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js'
  // 如果您添加了自定义图标文件，也要在这里列出它们：
  // './icon-192x192.png',
  // './icon-512x512.png'
];

// 安装 Service Worker 并缓存所有文件
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 拦截网络请求，并从缓存中返回资源
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 缓存中有，就直接返回
        if (response) {
          return response;
        }
        // 缓存中没有，就去网络请求
        return fetch(event.request);
      })
  );
});

// 激活 Service Worker，清理旧缓存
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // 删除旧的缓存
          }
        })
      );
    })
  );
});