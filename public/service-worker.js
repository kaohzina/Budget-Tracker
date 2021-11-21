const APP_PREFIX = "BudgetTracker";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/favicon.icon",
  "/css/style.css",
  "/js/index.js",
  "/js/idb.js",
  "./manifest.json",
  "./icons/icons-512x512.png",
  "./icons/icons-384x384.png",
  "./icons/icons-192x192.png",
  "./icons/icons-152x152.png",
  "./icons/icons-144x144.png",
  "./icons/icons-128x128.png",
  "./icons/icons-96x96.png",
  "./icons/icons-72x72.png",
];

self.addEventListener("install", function (evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("installing cache : " + CACHE_NAME);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(
        keyList.map(function (key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log("deleting cache : " + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", function (e) {
  console.log("fetch request : " + e.request.url);
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) {
        console.log("responding with cache : " + e.request.url);
        return request;
      } else {
        console.log("file is not cached, fetching : " + e.request.url);
        return fetch(e.request);
      }
    })
  );
});
