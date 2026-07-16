"use client";

/**
 * AI suggestion highlight — a CodeMirror state field that marks a range of
 * just-inserted AI text with a tinted background so the user can SEE the
 * change inline (Notion-style), then accept (keep) or reject (undo) it.
 *
 * Flow:
 *   1. SgnkAiButton inserts the AI text into the doc and dispatches
 *      `showAiSuggestion({ from, to })`.
 *   2. The field renders a `.cm-ai-suggestion` mark over [from, to].
 *   3. Accept → `clearAiSuggestion` (text stays, highlight removed).
 *   4. Reject → caller deletes [from, to] then `clearAiSuggestion`.
 *
 * The range is mapped through document changes so concurrent typing doesn't
 * desync the highlight. Any edit that touches inside the range clears it
 * (the suggestion is no longer "pristine").
 */
import { StateField, StateEffect, type Extension, RangeSetBuilder } from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView } from "@codemirror/view";

export interface AiSuggestionRange {
  from: number;
  to: number;
}

export const showAiSuggestion = StateEffect.define<AiSuggestionRange>();
export const clearAiSuggestion = StateEffect.define<null>();

const suggestionMark = Decoration.mark({ class: "cm-ai-suggestion" });

export const aiSuggestionField = StateField.define<AiSuggestionRange | null>({
  create() {
    return null;
  },
  update(value, tr) {
    for (const e of tr.effects) {
      if (e.is(showAiSuggestion)) return e.value;
      if (e.is(clearAiSuggestion)) return null;
    }
    if (value === null) return null;
    // Map the range forward through edits.
    if (tr.docChanged) {
      const from = tr.changes.mapPos(value.from, 1);
      const to = tr.changes.mapPos(value.to, -1);
      if (to <= from) return null;
      return { from, to };
    }
    return value;
  },
  provide: (f) =>
    EditorView.decorations.from(f, (range): DecorationSet => {
      if (!range) return Decoration.none;
      const b = new RangeSetBuilder<Decoration>();
      b.add(range.from, range.to, suggestionMark);
      return b.finish();
    }),
});

/** The extension bundle to add to the editor. */
export const aiSuggestion: Extension = [aiSuggestionField];

/** Read the current suggestion range from a view (null if none). */
export function currentAiSuggestion(view: EditorView): AiSuggestionRange | null {
  return view.state.field(aiSuggestionField, false) ?? null;
}
