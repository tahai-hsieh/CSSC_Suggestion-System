const CACHE_NAME = 'petition-system-v1';
// 設定離線時需要快取的檔案清單
const ASSETS_TO_CACHE = [
  './',
  './index.html', // 你的 HTML 檔名（若不同請修改）
  './icon2.png'   // 圖標檔案
];

// 安裝 Service Worker 並快取資源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 激活並清理舊快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 攔截網路請求：有網路走網路，無網路走快取
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // 傳回快取檔案
      }
      return fetch(event.request).catch(() => {
        // 若離線且找不到快取時的備援（可回傳首頁）
        return caches.match('./index.html');
      });
    })
  );
});
