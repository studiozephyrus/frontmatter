"use client";

/**
 * TauriBridge — when running inside the Tauri macOS shell, this component
 * translates native menu / shortcut events into the same DOM CustomEvents
 * the web app already uses. Result: every native menu item maps to the
 * existing in-app shortcut behavior with zero forking.
 *
 * Outside Tauri (browser / PWA) it's a no-op.
 */

import { useEffect } from "react";

// Maps native menu ids → DOM events that ACTUALLY have listeners
// (KnowledgeUI / VaultWorkspace / FileTreeActions). Keep in sync with those.
const EVENT_MAP: Record<string, string> = {
  "file.new-note":        "sgnk:new-note",
  "file.new-folder":      "sgnk:new-folder",
  "view.toggle-sidebar":  "sgnk:toggle-sidebar",
  "view.toggle-right":    "sgnk:toggle-right-pane",
  "view.command-palette": "sgnk:command-palette",
  "view.spotlight":       "sgnk:spotlight",
  "view.search":          "sgnk:open-search",
};

export function TauriBridge() {
  useEffect(() => {
    // Detect Tauri runtime. `__TAURI_INTERNALS__` is injected by Tauri v2.
    type TauriGlobal = { __TAURI_INTERNALS__?: unknown };
    const w = window as Window & TauriGlobal;
    if (!w.__TAURI_INTERNALS__) return;

    let unlisten: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      try {
        const { listen } = await import("@tauri-apps/api/event");
        if (cancelled) return;
        const handle = await listen<string>("sgnk:menu", (event) => {
          const id = event.payload;
          const domEvent = EVENT_MAP[id];
          if (domEvent) {
            window.dispatchEvent(new CustomEvent(domEvent));
          }
        });
        unlisten = handle;
      } catch {
        // Tauri not actually present — ignore.
      }
    })();

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, []);

  return null;
}
