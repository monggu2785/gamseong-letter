const CACHE_NAME = 'gamseong-letter-2.0.1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './og-preview.png',
  './app-share-preview.png',
  './bg-night.jpg',
  './bg-sunset.jpg',
  './bg-sea.jpg',
  './bg-forest.jpg',
  './bg-flower.jpg',
  './bg-winter.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // 다른 도메인(Kakao SDK, Apps Script 등)은 브라우저가 직접 처리
  if(url.origin !== self.location.origin) return;

  // 페이지 이동: 최신 버전을 먼저 확인하고, 오프라인이면 설치된 앱 화면 사용
  if(req.mode === 'navigate'){
    event.respondWith((async () => {
      try{
        const fresh = await fetch(req, {cache:'no-store'});
        const cache = await caches.open(CACHE_NAME);
        cache.put('./index.html', fresh.clone());
        return fresh;
      }catch(e){
        return (await caches.match('./index.html')) || (await caches.match('./'));
      }
    })());
    return;
  }

  // 정적 파일: 캐시 우선 + 뒤에서 새 파일 갱신
  event.respondWith((async () => {
    const cached = await caches.match(req);
    const networkPromise = fetch(req).then(async res => {
      if(res && res.ok){
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, res.clone());
      }
      return res;
    }).catch(() => null);
    return cached || (await networkPromise) || Response.error();
  })());
});
