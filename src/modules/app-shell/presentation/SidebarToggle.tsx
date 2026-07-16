"use client";

import { GoogleIcon } from "@/shared/presentation/GoogleIcon";

/**
 * SidebarToggle — header button that toggles the file tree. On desktop
 * it collapses/expands the sidebar column; on mobile it opens the
 * drawer. Both are handled by VaultWorkspace via the
 * "sgnk:toggle-sidebar" event.
 *
 * Glyph: Material Symbols Rounded `dock_to_right` — a frame with a
 * solid left panel — reading instantly as "files dock on the left".
 */
export function SidebarToggle() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("sgnk:toggle-sidebar"))}
      className="sgnk-icon-btn"
      aria-label="Toggle file sidebar"
      title="Toggle files"
    >
      <GoogleIcon name="dock_to_right" size={18} weight={500} />
    </button>
  );
}
