/* Service worker for the decisions site. Two things this has to get right, because a
   service worker that gets either wrong quietly breaks the whole product:

   1. It must never serve a stale copy forever. This site deploys often -- three times in
      the session that added this file. Every cached asset uses stale-while-revalidate:
      the cached copy answers immediately, and a network fetch runs in the background to
      refresh the cache for next time. A visitor is never more than one reload behind.
   2. It must never cache a partial or failed response. Only a 200 with a basic (same-
      origin) type is written to the cache; an offline fetch that fails just fails, rather
      than caching an error page under a real asset's name.

   CACHE_VERSION only has to change if the caching STRATEGY changes, not on every deploy --
   stale-while-revalidate already means content updates reach the cache within one visit. */
const CACHE_VERSION = 'fm-decisions-v1';

const SHELL = [
  './',
  './index.html',
  './app.css',
  './app.js',
  './diagram.js',
  './questions.js',
  './manifest.webmanifest',
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.addAll(SHELL);
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (n) { return n !== CACHE_VERSION; }).map(function (n) { return caches.delete(n); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // fonts.css pulls from Google; leave the browser's own cache to handle it

  e.respondWith(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.match(req).then(function (cached) {
        var network = fetch(req).then(function (res) {
          if (res.ok && res.type === 'basic') cache.put(req, res.clone());
          return res;
        }).catch(function () { return cached; }); // offline: fall back to whatever is cached, if anything
        return cached || network;
      });
    })
  );
});
