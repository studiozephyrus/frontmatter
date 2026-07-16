"use client";

/**
 * Slash commands — Notion/Logseq-style `/` block menu inside the editor.
 *
 * Triggers when `/` is typed at the start of a line (after optional
 * whitespace). Offers block inserts; selecting one replaces the typed
 * `/query` with the snippet and positions the caret via `$|` marker.
 *
 * Wired as an extra CompletionSource in CodeMirrorEditor's `autocompletion`
 * override, alongside the wikilink/tag source.
 */
import type { CompletionContext, CompletionResult, CompletionSource } from "@codemirror/autocomplete";
import type { EditorView } from "@codemirror/view";

type Snippet = {
  label: string;
  detail: string;
  /** Body text; `$|` marks the caret position after insertion (removed). */
  body: string;
};

function todayISO(): string {
  // App runtime (client) — Date is available here.
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function snippets(): Snippet[] {
  return [
    { label: "Heading 1", detail: "#", body: "# $|" },
    { label: "Heading 2", detail: "##", body: "## $|" },
    { label: "Heading 3", detail: "###", body: "### $|" },
    { label: "Bullet list", detail: "-", body: "- $|" },
    { label: "Numbered list", detail: "1.", body: "1. $|" },
    { label: "Task", detail: "- [ ]", body: "- [ ] $|" },
    { label: "Quote", detail: ">", body: "> $|" },
    { label: "Callout", detail: "> [!note]", body: "> [!note] $|\n> " },
    { label: "Code block", detail: "```", body: "```\n$|\n```" },
    { label: "Math block", detail: "$$", body: "$$\n$|\n$$" },
    { label: "Mermaid diagram", detail: "```mermaid", body: "```mermaid\n$|\n```" },
    {
      label: "Table",
      detail: "grid",
      body: "| $| | Column |\n| --- | --- |\n| Cell | Cell |",
    },
    { label: "Divider", detail: "---", body: "---\n$|" },
    { label: "Today's date", detail: todayISO(), body: todayISO() + "$|" },
  ];
}

function applySnippet(body: string) {
  return (view: EditorView, _c: unknown, from: number, to: number): void => {
    const caret = body.indexOf("$|");
    const text = body.replace("$|", "");
    const anchor = from + (caret >= 0 ? caret : text.length);
    view.dispatch({
      changes: { from, to, insert: text },
      selection: { anchor },
      scrollIntoView: true,
    });
  };
}

export function makeSlashCommandSource(): CompletionSource {
  const items = snippets();
  return function slashSource(context: CompletionContext): CompletionResult | null {
    // `/` at line start (optionally after whitespace), then a word query.
    const line = context.state.doc.lineAt(context.pos);
    const before = context.state.sliceDoc(line.from, context.pos);
    const m = /(?:^|\s)\/(\w*)$/.exec(before);
    if (m === null) return null;
    const query = (m[1] ?? "").toLowerCase();
    const slashPos = context.pos - (m[1] ?? "").length - 1; // position of '/'

    const options = items
      .filter((s) => s.label.toLowerCase().includes(query))
      .map((s) => ({
        label: s.label,
        detail: s.detail,
        type: "keyword",
        apply: applySnippet(s.body),
      }));
    if (options.length === 0) return null;

    return { from: slashPos, options, filter: false };
  };
}
