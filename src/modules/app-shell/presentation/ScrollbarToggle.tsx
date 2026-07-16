"use client";

import { useEffect, useState } from "react";
import { GoogleIcon } from "@/shared/presentation/GoogleIcon";

/**
 * ScrollbarToggle — flips a `scrollind-hidden` class on <html> that
 * hides the right-edge reading-position indicator (the percent +
 * tick scrubber widget <ScrollIndicator />). Native browser scrollbars
 * are NOT affected — only the custom on-page chrome.
 *
 * Persisted to localStorage under `sgnk-scrollind`:
 *   "hidden" → class on,  indicator not visible (default)
 *   "shown"  → class off, indicator rendered
 *
 * Initial state is applied pre-paint by /theme-init.js (same place the
 * theme class is set), so there's no flash on first paint. This
 * component only syncs its icon after mount.
 */
export function ScrollbarToggle() {
  const [hidden, setHidden] = useState(true);
  // `mounted` gates the dynamic aria-label / title until after hydration
  // — the server can't know the user's stored preference, so without
  // this gate the first client render differs from the SSR HTML and
  // React logs a hydration warning.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHidden(document.documentElement.classList.contains("scrollind-hidden"));
    setMounted(true);
  }, []);

  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains("scrollind-hidden");
    root.classList.toggle("scrollind-hidden", next);
    try {
      localStorage.setItem("sgnk-scrollind", next ? "hidden" : "shown");
    } catch {
      /* ignore storage errors */
    }
    setHidden(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="sgnk-icon-btn"
      aria-label={!mounted ? "Toggle scroll indicator" : hidden ? "Show reading-position indicator" : "Hide reading-position indicator"}
      title={!mounted ? "Toggle scroll indicator" : hidden ? "Show scroll indicator" : "Hide scroll indicator"}
      suppressHydrationWarning
    >
      {/* Material Symbols Rounded — `vertical_distribute` reads as
          the tick-scrubber widget; filled when the indicator is on.
          The hidden variant uses `visibility_off` to match the rest
          of Google's "off" semantics. */}
      <GoogleIcon
        name={hidden ? "visibility_off" : "vertical_distribute"}
        size={18}
        fill={!hidden}
        weight={500}
      />
    </button>
  );
}
