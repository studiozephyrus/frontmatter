/**
 * Module-level singleton holding the currently focused CodeMirror EditorView
 * AND the vault path it is editing.
 *
 * The path matters for two-note split: toolbar/AI/find act on whichever pane
 * is focused, so writes (setContent/saveDraft) must target THAT pane's path —
 * not the store's primary `activePath` (which would clobber the wrong note's
 * draft). `getActivePath()` returns the focused pane's path.
 *
 * Deliberately NOT in Zustand — EditorView is a mutable object and storing it
 * would trigger selector comparisons on every dispatch (render-loop risk).
 */

import type { EditorView } from "@codemirror/view";

let active: { view: EditorView; path: string | null } | null = null;

export function setActiveView(view: EditorView | null, path: string | null = null): void {
  active = view === null ? null : { view, path };
}

export function getActiveView(): EditorView | null {
  return active?.view ?? null;
}

/** Path of the focused editor pane, or null. */
export function getActivePath(): string | null {
  return active?.path ?? null;
}
