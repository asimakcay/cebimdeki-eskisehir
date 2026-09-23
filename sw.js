const CACHE = "cebimdeki-esk-v25";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./sw.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./assets/eskisehir-yili-2026.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith("cebimdeki-esk-") && k !== CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);
  // Ignore cross-origin (fonts.googleapis, gstatic, etc.) — don't break SW
  if (url.origin !== self.location.origin) return;

  const isHTML =
    e.request.mode === "navigate" ||
    (e.request.headers.get("accept") || "").includes("text/html") ||
    url.pathname.endsWith("/") ||
    url.pathname.endsWith(".html");

  // HTML / navigation: network-first so updates still show
  if (isHTML) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() =>
          caches.match(e.request).then((cached) => cached || caches.match("./index.html"))
        )
    );
    return;
  }

  // Icons / assets / manifest / SW: cache-first, then network + cache
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) {
        // stale-while-revalidate for non-critical freshness
        fetch(e.request)
          .then((res) => {
            if (res && res.ok) {
              caches.open(CACHE).then((c) => c.put(e.request, res.clone())).catch(() => {});
            }
          })
          .catch(() => {});
        return cached;
      }
      return fetch(e.request)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
