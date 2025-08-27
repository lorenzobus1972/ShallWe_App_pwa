// service-worker.js — basic offline cache
const CACHE = "shallwe-cache-v1";
const ASSETS = [
  "index.html","styles.css","app.js","firebase.js",
  "chat.html","chat.js","people.html","people.js","past.html","events.js",
  "profile.html","profile.js","suggest.html","suggest.js","admin.html","admin.js",
  "manifest.webmanifest","assets/icons/icon-192.png","assets/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if(url.origin === location.origin){
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
  }
});
