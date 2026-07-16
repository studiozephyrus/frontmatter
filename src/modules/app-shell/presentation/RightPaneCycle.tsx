"use client";

import { useEffect, useState } from "react";
import { GoogleIcon } from "@/shared/presentation/GoogleIcon";

/**
 * RightPaneCycle — single header button that cycles the right-edge
 * UI through three states:
 *
 *   hidden    →  backlinks   →  scroll      →  hidden  …
 *   (default)    sidebar         indicator
 *
 * Each click advances to the next state. Persisted to localStorage
 * under `sgnk-right-pane-mode`. Pre-paint sync is handled by
 * /theme-init.js so the first paint already matches the persisted
 * state (no flash).
 *
 * Wiring:
 *  - Backlinks sidebar — toggles the right pane via the existing
 *    `sgnk:toggle-right-pane` event (VaultWorkspace owns its state).
 *    The persisted `sgnk-right-pane` key (open/closed) is set
 *    directly here so the workspace's mount-time read picks it up.
 *  - Scroll indicator — flips the `scrollind-hidden` class on <html>
 *    (CSS rule in globals.css hides `.sgnk-scrollind` when set).
 *    Persisted under `sgnk-scrollind` (shown/hidden).
 *
 * Replaces the previous separate <RightPaneToggle /> and
 * <ScrollbarToggle /> buttons.
 */

export type RightPaneMode = "hidden" | "sidebar" | "scroll";

const STORAGE_KEY = "sgnk-right-pane-mode";
const ORDER: readonly RightPaneMode[] = ["hidden", "sidebar", "scroll"] as const;

function readMode(): RightPaneMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "sidebar" || raw === "scroll" || raw === "hidden") return raw;
  } catch {
    /* fall through */
  }
  return "hidden";
}

function applyMode(mode: RightPaneMode): void {
  const root = document.documentElement;

  // Scroll indicator CSS class — kept in sync for back-compat (the
  // ScrollIndicator-targeted display:none rule still uses it).
  root.classList.toggle("scrollind-hidden", mode !== "scroll");
  try {
    localStorage.setItem(
      "sgnk-scrollind",
      mode === "scroll" ? "shown" : "hidden",
    );
    localStorage.setItem(
      "sgnk-right-pane",
      mode === "sidebar" ? "open" : "closed",
    );
    localStorage.setItem("sgnk-right-pane-mode", mode);
  } catch {
    /* ignore */
  }

  // Tri-state setter — VaultWorkspace consumes this and renders the
  // right column accordingly (sidebar / 46px lane / nothing).
  window.dispatchEvent(
    new CustomEvent<{ mode: RightPaneMode }>("sgnk:right-pane-mode", {
      detail: { mode },
    }),
  );
}

function nextMode(current: RightPaneMode): RightPaneMode {
  const i = ORDER.indexOf(current);
  return ORDER[(i + 1) % ORDER.length] ?? "hidden";
}

const ICON_BY_MODE: Record<RightPaneMode, { name: string; fill: boolean; title: string; aria: string }> = {
  hidden: {
    // Closed right pane — outlined dock icon. Click reveals backlinks.
    name: "dock_to_left",
    fill: false,
    title: "Show backlinks & outline",
    aria: "Right pane: hidden. Click to show backlinks sidebar.",
  },
  sidebar: {
    // Backlinks sidebar active — same dock icon, filled to signal "on".
    name: "dock_to_left",
    fill: true,
    title: "Show scroll indicator",
    aria: "Right pane: backlinks. Click to show scroll indicator.",
  },
  scroll: {
    // Scroll indicator active — vertical-distribute icon reads as
    // "ruler / position", matching the on-page tick scrubber.
    name: "vertical_distribute",
    fill: true,
    title: "Hide right-pane chrome",
    aria: "Right pane: scroll indicator. Click to hide.",
  },
};

export function RightPaneCycle() {
  const [mode, setMode] = useState<RightPaneMode>("hidden");
  const [mounted, setMounted] = useState(false);

  // Sync from the pre-paint state set by /theme-init.js. We DON'T
  // re-apply on mount — that would fight the workspace's own
  // mount-time read of `sgnk-right-pane`.
  useEffect(() => {
    setMode(readMode());
    setMounted(true);
  }, []);

  function onClick() {
    const next = nextMode(readMode());
    applyMode(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    setMode(next);
  }

  // Until mounted, render a stable neutral state so the SSR HTML and
  // first client render match (prevents the hydration warning the old
  // ScrollbarToggle was throwing).
  const icon = ICON_BY_MODE[mounted ? mode : "hidden"];

  return (
    <button
      type="button"
      onClick={onClick}
      className="sgnk-icon-btn"
      aria-label={icon.aria}
      title={icon.title}
      data-mode={mounted ? mode : undefined}
      // Sidebar / scroll states tint with the link accent — same idiom
      // every other "on" state uses across the toolbar.
      style={
        mounted && mode !== "hidden"
          ? { color: "var(--link, var(--accent))" }
          : undefined
      }
    >
      <GoogleIcon name={icon.name} size={18} fill={icon.fill} weight={500} />
    </button>
  );
}
