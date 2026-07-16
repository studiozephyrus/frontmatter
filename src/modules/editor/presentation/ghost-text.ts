"use client";

/**
 * AI ghost-text — inline "continue writing" suggestions (Cursor/Copilot style).
 *
 * After a short idle following typing, fetches a continuation from
 * /api/ai/complete for the text before the cursor and renders it as faint
 * inline text. Tab accepts; Escape or any edit/cursor-move dismisses.
 *
 * Opt-in (off by default) since it calls the AI on idle. Wired as a
 * Compartment in CodeMirrorEditor, toggled via the `aiGhostText` setting.
 */
import { StateField, StateEffect, Prec, type Extension } from "@codemirror/state";
import {
  EditorView,
  Decoration,
  type DecorationSet,
  WidgetType,
  ViewPlugin,
  type ViewUpdate,
  keymap,
} from "@codemirror/view";

type Ghost = { from: number; text: string } | null;

const setGhost = StateEffect.define<Ghost>();

// Backoff state shared across editor panes:
//  - 5xx (AI unavailable, e.g. free-tier block) → disable for the session.
//  - 429 (rate-limited) → cool down for 60s, then resume (transient).
// Both cleared on full reload.
let completionsDisabled = false;
let cooldownUntil = 0;

class GhostWidget extends WidgetType {
  constructor(readonly text: string) {
    super();
  }
  override eq(other: GhostWidget): boolean {
    return other.text === this.text;
  }
  override toDOM(): HTMLElement {
    const span = document.createElement("span");
    span.className = "cm-ghost-text";
    span.textContent = this.text;
    span.style.opacity = "0.4";
    span.style.fontStyle = "italic";
    return span;
  }
  override ignoreEvent(): boolean {
    return true;
  }
}

const ghostField = StateField.define<Ghost>({
  create() {
    return null;
  },
  update(value, tr) {
    for (const e of tr.effects) {
      if (e.is(setGhost)) return e.value;
    }
    // Any edit or cursor move with no explicit re-set dismisses the ghost.
    if (tr.docChanged || tr.selection) return null;
    return value;
  },
  provide: (f) =>
    EditorView.decorations.from(f, (value): DecorationSet => {
      if (!value || !value.text) return Decoration.none;
      return Decoration.set([
        Decoration.widget({ widget: new GhostWidget(value.text), side: 1 }).range(value.from),
      ]);
    }),
});

const ghostKeymap = Prec.high(
  keymap.of([
    {
      key: "Tab",
      run: (view) => {
        const g = view.state.field(ghostField, false);
        if (!g || !g.text) return false;
        view.dispatch({
          changes: { from: g.from, insert: g.text },
          selection: { anchor: g.from + g.text.length },
          effects: setGhost.of(null),
        });
        return true;
      },
    },
    {
      key: "Escape",
      run: (view) => {
        const g = view.state.field(ghostField, false);
        if (!g) return false;
        view.dispatch({ effects: setGhost.of(null) });
        return true;
      },
    },
  ]),
);

const ghostFetcher = ViewPlugin.fromClass(
  class {
    timeout: ReturnType<typeof setTimeout> | null = null;
    gen = 0;
    abort: AbortController | null = null;

    update(u: ViewUpdate) {
      // Only (re)schedule after the user actually types, unless disabled for the
      // session (5xx) or within a 429 cooldown window.
      if (u.docChanged && !completionsDisabled && Date.now() >= cooldownUntil) {
        this.schedule(u.view);
      }
    }

    schedule(view: EditorView) {
      if (this.timeout) clearTimeout(this.timeout);
      this.abort?.abort(); // cancel any in-flight request
      const myGen = ++this.gen;
      this.timeout = setTimeout(() => void this.fetch(view, myGen), 650);
    }

    async fetch(view: EditorView, myGen: number) {
      const sel = view.state.selection.main;
      if (!sel.empty) return;
      const pos = sel.head;
      const prefix = view.state.sliceDoc(0, pos);
      if (prefix.trim().length < 3) return;
      const controller = new AbortController();
      this.abort = controller;
      try {
        const res = await fetch("/api/ai/complete", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ prefix }),
          signal: controller.signal,
        });
        if (!res.ok) {
          if (res.status >= 500) completionsDisabled = true; // AI unavailable
          else if (res.status === 429) cooldownUntil = Date.now() + 60_000; // rate-limited
          return;
        }
        const data = (await res.json()) as { text?: string };
        const text = (data.text ?? "").replace(/\n{3,}/g, "\n\n");
        if (!text) return;
        // Discard if superseded or the cursor moved while we waited.
        if (myGen !== this.gen) return;
        if (view.state.selection.main.head !== pos) return;
        view.dispatch({ effects: setGhost.of({ from: pos, text }) });
      } catch {
        /* aborted or network/AI error — silently skip */
      }
    }

    destroy() {
      if (this.timeout) clearTimeout(this.timeout);
      this.abort?.abort();
    }
  },
);

export const ghostText: Extension = [ghostField, ghostKeymap, ghostFetcher];
