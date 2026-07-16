/* sgnk-md service worker — minimal shell cache for installability.
 *
 * Strategy:
 *  - Never cache HTML navigations (always network) so a new deploy is picked
 *    up instantly. If the network fails, fall back to the most recent cached
 *    asset shell so the browser can render an offline-aware error.
 *  - Static `/_next/static/*` chunks: stale-while-revalidate.
 *  - API + auth: pass through (never intercepted).
 *
 * Bump CACHE on every meaningful change so stale clients self-heal:
 *   v1 → v2  (2026-05): kill HTML caching, add navigation-network-first.
 */
const CACHE = "sgnk-md-v2";
const SHELL = ["/favicon.png", "/theme-init.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  // Manual reset trigger from the app (e.g. a "Reset PWA cache" command).
  if (event.data === "sgnk:reset-cache") {
    event.waitUntil(
      (async () => {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
        await self.registration.unregister();
        const clients = await self.clients.matchAll();
        for (const c of clients) c.navigate(c.url);
      })(),
    );
  }
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Never intercept API, auth, or cross-origin requests.
  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/login")
  ) {
    return;
  }

  // HTML navigations: network-only (no caching). If network fails entirely,
  // fall back to a minimal offline shell so the browser doesn't show
  // "this page couldn't load" without context.
  if (req.mode === "navigate" || req.destination === "document") {
    event.respondWith(
      fetch(req).catch(async () => {
        const cache = await caches.open(CACHE);
        const offline = await cache.match("/favicon.png"); // any cached resource keeps SW happy
        // Return a tiny inline HTML if nothing else worked.
        return new Response(
          `<!doctype html><meta charset=utf-8><title>Offline</title><style>body{font:14px -apple-system,system-ui,sans-serif;background:#0d0e11;color:#e9ecf2;margin:0;display:grid;place-items:center;min-height:100vh}main{text-align:center;max-width:420px;padding:24px}h1{font-size:24px;margin:0 0 8px}p{color:#8a93a4}button{margin-top:16px;padding:8px 14px;background:#5e6ad2;color:#fff;border:0;border-radius:6px;cursor:pointer}</style><main><h1>Offline</h1><p>md.sgnk.ai is unreachable. Check your connection and retry.</p><button onclick="location.reload()">Retry</button></main>`,
          { status: 200, headers: { "content-type": "text/html; charset=utf-8" } },
        );
      }),
    );
    return;
  }

  // Static assets: stale-while-revalidate.
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname === "/favicon.png" ||
    url.pathname === "/theme-init.js" ||
    url.pathname === "/manifest.webmanifest"
  ) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        const network = fetch(req)
          .then((res) => {
            if (res && res.status === 200) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      }),
    );
  }
});
