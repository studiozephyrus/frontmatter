"use client";

import { useEffect, useState } from "react";
import { GoogleIcon } from "@/shared/presentation/GoogleIcon";

/**
 * RightPaneToggle — kept exported for back-compat. New code should
 * prefer <RightPaneCycle />, which folds this control + the scroll
 * indicator toggle into a single three-state button.
 *
 * Dispatches "sgnk:toggle-right-pane"; VaultWorkspace owns the state
 * and persists it under `sgnk-right-pane`. The icon mirrors the
 * persisted state.
 *
 * Glyph: Material Symbols Rounded `dock_to_left` — outlined when the
 * pane is closed, filled when it's open — same idiom as every other
 * dock/pane affordance in the toolbar.
 */
export function RightPaneToggle() {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      setOpen(localStorage.getItem("sgnk-right-pane") !== "closed");
    } catch {
      /* ignore */
    }
    setMounted(true);
  }, []);

  function toggle() {
    window.dispatchEvent(new CustomEvent("sgnk:toggle-right-pane"));
    setOpen((v) => !v);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="sgnk-icon-btn"
      aria-pressed={open}
      aria-label={!mounted ? "Toggle side panel" : open ? "Hide side panel" : "Show side panel"}
      title={!mounted ? "Toggle backlinks & outline" : open ? "Hide backlinks & outline" : "Show backlinks & outline"}
      suppressHydrationWarning
    >
      <GoogleIcon name="dock_to_left" size={18} fill={open} weight={500} />
    </button>
  );
}
