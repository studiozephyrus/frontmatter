"use client";

import { useEffect } from "react";

/**
 * PWARegister — registers the service worker.
 *
 * Lifecycle hardening (after v1 served stale chunks → "this page couldn't load"):
 *  - `updateViaCache: "none"` so the browser revalidates /sw.js on every load.
 *  - On `updatefound` + activation, reload once per session so the user gets
 *    the fresh app shell + new chunk filenames.
 *  - Poll for new SW versions every 60s while the tab is open.
 *  - Expose `window.sgnkResetPWA()` to nuke all caches + re-register.
 */
export function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let reg: ServiceWorkerRegistration | null = null;

    function reloadOnce() {
      const key = "sgnk:pwa-reloaded";
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
      window.location.reload();
    }

    async function register() {
      try {
        reg = await navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" });
        if (reg.waiting && navigator.serviceWorker.controller) reloadOnce();
        reg.addEventListener("updatefound", () => {
          const sw = reg?.installing;
          if (!sw) return;
          sw.addEventListener("statechange", () => {
            if (sw.state === "activated" && navigator.serviceWorker.controller) {
              reloadOnce();
            }
          });
        });
      } catch {
        /* registration failure is non-fatal */
      }
    }

    if (document.readyState === "complete") void register();
    else window.addEventListener("load", () => void register(), { once: true });

    const id = setInterval(() => { void reg?.update().catch(() => {}); }, 60_000);

    (window as Window & { sgnkResetPWA?: () => Promise<void> }).sgnkResetPWA = async () => {
      try {
        const r = await navigator.serviceWorker.getRegistration();
        r?.active?.postMessage("sgnk:reset-cache");
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
        }
        await r?.unregister();
      } finally {
        window.location.reload();
      }
    };

    return () => clearInterval(id);
  }, []);

  return null;
}
