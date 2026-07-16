"use client";

import { GoogleIcon } from "@/shared/presentation/GoogleIcon";

/**
 * GraphButton — header button that opens the graph view (same modal
 * the ⌘G hotkey and the command palette open) by dispatching
 * "sgnk:open-graph".
 *
 * Glyph: Material Symbols Rounded `hub` — three connected nodes —
 * the canonical "knowledge graph / network" affordance.
 */
export function GraphButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("sgnk:open-graph"))}
      className="sgnk-icon-btn"
      aria-label="Open graph view"
      title="Graph view (⌘G)"
    >
      <GoogleIcon name="hub" size={18} weight={500} />
    </button>
  );
}
