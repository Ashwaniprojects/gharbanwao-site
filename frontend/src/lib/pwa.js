/** Register the service worker once the page has finished its first paint.
 *  Gated to production so the CRA dev server never caches the app. */
export function registerServiceWorker() {
  if (process.env.NODE_ENV !== "production") return;
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${process.env.PUBLIC_URL || ""}/sw.js`, { scope: "/" })
      .catch(() => {
        // A service-worker registration failure must never break the app;
        // the site simply runs without offline support.
      });
  });
}
