"use client";

/**
 * Live Preview — Obsidian-style inline rendering for the CodeMirror edit
 * surface. Conceals markdown syntax markers (`**`, `*`, `` ` ``, `~~`, `#`,
 * `>`) on lines the cursor is NOT on, so prose reads clean while typing but
 * the raw markup reappears the moment you move onto its line to edit it.
 *
 * Combined with the `mdHighlight` style (bold renders bold, headings render
 * large), this gives WYSIWYG-while-typing without a second render engine.
 *
 * Implementation: a ViewPlugin walks the markdown syntax tree over the visible
 * range and replaces each marker node with an empty atomic decoration — unless
 * the active selection touches that node's line. Marker nodes never overlap, so
 * the RangeSetBuilder stays ordered and valid.
 *
 * Scoped to low-risk inline marks (emphasis/strong/strike/code/heading/quote).
 * Links and images are left intact (still colour-styled) to avoid hiding URLs.
 */
import { ViewPlugin, Decoration, type DecorationSet, EditorView, type ViewUpdate } from "@codemirror/view";
import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";

// lezer-markdown node names for the delimiter marks we conceal.
const CONCEAL = new Set([
  "EmphasisMark", // * _ ** __ (italic + bold delimiters)
  "StrikethroughMark", // ~~
  "CodeMark", // ` inline code ticks
  "HeaderMark", // # ## … and the trailing space
  "QuoteMark", // >
]);

const hidden = Decoration.replace({});

/** Line numbers (1-based) currently touched by any selection range. */
function activeLines(view: EditorView): Set<number> {
  const set = new Set<number>();
  for (const r of view.state.selection.ranges) {
    const a = view.state.doc.lineAt(r.from).number;
    const b = view.state.doc.lineAt(r.to).number;
    for (let n = a; n <= b; n++) set.add(n);
  }
  return set;
}

function buildDecorations(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  const active = activeLines(view);
  const doc = view.state.doc;

  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter(node) {
        if (!CONCEAL.has(node.name)) return;
        if (node.from === node.to) return;
        // Reveal raw markup when the cursor is on this marker's line.
        const lineNo = doc.lineAt(node.from).number;
        if (active.has(lineNo)) return;
        builder.add(node.from, node.to, hidden);
      },
    });
  }
  return builder.finish();
}

export const livePreview = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = buildDecorations(view);
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.selectionSet || update.viewportChanged) {
        this.decorations = buildDecorations(update.view);
      }
    }
  },
  {
    decorations: (v) => v.decorations,
    // Treat concealed markers as atomic so arrow-key/click navigation steps
    // OVER the hidden delimiters instead of landing the caret inside them.
    provide: (plugin) =>
      EditorView.atomicRanges.of((view) => view.plugin(plugin)?.decorations ?? Decoration.none),
  },
);
