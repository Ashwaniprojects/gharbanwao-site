/* Ghar Banwao service worker.
 *
 * Strategies:
 *  - Navigations: network-first; fall back to the cached SPA shell so every
 *    route still boots while offline.
 *  - Same-origin static assets (hashed /static/*, icons) and the Vercel Blob
 *    image store: cache-first — a new deploy changes the hashes / blob keys,
 *    so the cache never goes stale.
 *  - API reads (Vercel /api/* and the Railway CMS backend): network-first
 *    with a short cache fallback so content pages still render offline.
 *  - POST requests (leads, registrations, admin mutations) are never
 *    intercepted.
 *  - Third-party scripts (analytics, fonts) always go to the network.
 */

const VERSION = "gbw-v2";
const SHELL_CACHE = `${VERSION}-shell`;
const ASSET_CACHE = `${VERSION}-assets`;
const API_CACHE = `${VERSION}-api`;

const SHELL_URLS = [
  "/",
  "/manifest.json",
  "/favicon-32.png",
  "/favicon-16.png",
  "/apple-touch-icon.png",
  "/logo.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // Cache the shell first; if it fails, installation fails with it so a
      // broken shell never goes live.
      await cache.add("/");
      const rest = SHELL_URLS.filter((u) => u !== "/");
      for (const url of rest) {
        try {
          await cache.add(url);
        } catch {
          // A missing favicon must not block the install.
        }
      }
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([SHELL_CACHE, ASSET_CACHE, API_CACHE]);
      for (const key of await caches.keys()) {
        if (!keep.has(key)) await caches.delete(key);
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;

  // 1) Page navigations: fresh shell, offline fallback to the cached one.
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(SHELL_CACHE);
          await cache.put("/", fresh.clone());
          return fresh;
        } catch {
          const cache = await caches.open(SHELL_CACHE);
          const shell = (await cache.match("/")) || (await cache.match("/index.html"));
          if (shell) return shell;
          return new Response("You appear to be offline.", {
            status: 503,
            statusText: "Service Unavailable",
            headers: { "Content-Type": "text/plain" },
          });
        }
      })()
    );
    return;
  }

  // 2) Immutable assets: same-origin hashed /static/* + icons, and the Vercel
  // Blob image store (signed public URLs). Cache-first is safe because every
  // asset key includes a content hash — a new upload is a new URL.
  if (
    url.hostname === "ogilrhhcbbuhntyk.public.blob.vercel-storage.com" ||
    (isSameOrigin &&
      (url.pathname.startsWith("/static/") ||
        url.pathname.startsWith("/icons/") ||
        url.pathname === "/manifest.json" ||
        url.pathname === "/logo.png"))
  ) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;
        const fresh = await fetch(req);
        if (fresh.ok) await cache.put(req, fresh.clone());
        return fresh;
      })
    );
    return;
  }

  // 3) API reads: network-first, cache as an offline fallback. `/projects.json`
  //  is the bundled live-project data (pins, search, stats) — it is regenerated
  //  on every build under a fixed URL, so it must stay fresh, not cache-first.
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname === "/projects.json" ||
    url.hostname.endsWith("up.railway.app")
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(API_CACHE);
        try {
          const fresh = await fetch(req);
          if (fresh.ok) await cache.put(req, fresh.clone());
          return fresh;
        } catch {
          const cached = await cache.match(req);
          if (cached) return cached;
          // Offline and never fetched before: empty-but-valid payload so the
          // UI degrades instead of throwing.
          return new Response(JSON.stringify({ items: [], total: 0 }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }
      })()
    );
    return;
  }

  // 4) Everything else (analytics, fonts, third parties): network only.
});
