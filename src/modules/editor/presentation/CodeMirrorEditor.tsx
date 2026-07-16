"use client";

import { useEffect, useRef } from "react";
import { EditorState, Compartment } from "@codemirror/state";
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  drawSelection,
  dropCursor,
} from "@codemirror/view";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import {
  markdown,
  insertNewlineContinueMarkup,
  deleteMarkupBackward,
} from "@codemirror/lang-markdown";
import {
  syntaxHighlighting,
  HighlightStyle,
  foldGutter,
  codeFolding,
  foldKeymap,
  bracketMatching,
  indentOnInput,
} from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import {
  autocompletion,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import { search, searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { vim } from "@replit/codemirror-vim";
import { saveDraft } from "@/modules/drafts";
import { useEditorStore } from "@/modules/editor/presentation/editor-store";
import { useEditorSettings } from "@/modules/editor/presentation/editor-settings";
import { setActiveView, getActiveView } from "@/modules/editor/presentation/active-view";
import { wrapSelection } from "@/modules/editor/presentation/toolbar-transforms";
import { makeVaultCompletionSource } from "@/modules/editor/presentation/completions";
import { makeSlashCommandSource } from "@/modules/editor/presentation/slash-commands";
import { livePreview } from "@/modules/editor/presentation/live-preview";
import { aiSuggestion } from "@/modules/editor/presentation/ai-suggestion";
import { ghostText } from "@/modules/editor/presentation/ghost-text";

export type CompletionData = { noteNames: string[]; tags: string[] };

type Props = {
  path: string;
  initialContent: string;
  baseSha: string;
  completionData?: CompletionData;
  /** When true, the Live-Preview conceal extension is on — used ONLY by the
   *  "Live" view mode. Edit/split never conceal markers (raw stays raw). */
  livePreviewForced?: boolean;
};

const editorTheme = EditorView.theme({
  "&": {
    height: "100%",
    background: "var(--bg)",
    color: "var(--fg)",
    fontSize: "14px",
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  },
  ".cm-content": {
    padding: "16px",
    caretColor: "var(--fg)",
    maxWidth: "var(--cm-max-width, none)",
    margin: "0 auto",
    width: "100%",
    lineHeight: "1.6",
  },
  ".cm-cursor": { borderLeftColor: "var(--fg)" },
  ".cm-selectionBackground, ::selection": {
    background: "var(--accent) !important",
    opacity: "0.3",
  },
  ".cm-focused .cm-selectionBackground": {
    background: "var(--accent) !important",
    opacity: "0.4",
  },
  ".cm-activeLine": { background: "var(--hover)" },
  ".cm-activeLineGutter": { background: "var(--hover)" },
  // Gutter blends into the editor — no rail line, no fill. With line
  // numbers off this is just the fold column; the border-right + bg
  // previously made it read as a stray vertical bar.
  ".cm-gutters": {
    background: "transparent",
    color: "var(--muted)",
    border: "none",
  },
  // Fold chevrons: hidden by default so there's no permanent column of
  // arrows. They fade in beside a foldable line (heading / frontmatter)
  // only when that line — or the gutter — is hovered. Folded regions keep
  // their marker visible so you can always see + unfold them.
  ".cm-foldGutter .cm-gutterElement": {
    opacity: "0",
    transition: "opacity 0.12s ease",
    cursor: "pointer",
  },
  ".cm-gutters:hover .cm-foldGutter .cm-gutterElement, .cm-activeLineGutter .cm-foldGutter .cm-gutterElement":
    {
      opacity: "0.55",
    },
  ".cm-foldGutter .cm-gutterElement:hover": { opacity: "1 !important" },
  // A region that IS folded always shows its marker (otherwise the user
  // can't tell content is hidden or click to expand it).
  ".cm-foldGutter .cm-gutterElement[title='unfold']": { opacity: "0.7" },
  ".cm-scroller": { height: "100%", overflow: "auto" },
  "&.cm-focused": { outline: "none" },
  // Search panel theming
  ".cm-panels": { background: "var(--panel)", color: "var(--fg)", borderTop: "1px solid var(--border)" },
  ".cm-panel.cm-search input": {
    background: "var(--bg)",
    color: "var(--fg)",
    border: "1px solid var(--border)",
    borderRadius: "5px",
    padding: "2px 6px",
  },
  ".cm-panel.cm-search button": {
    background: "var(--panel-2)",
    color: "var(--fg)",
    border: "1px solid var(--border)",
    borderRadius: "5px",
  },
  ".cm-searchMatch": { background: "color-mix(in srgb, var(--accent) 30%, transparent)" },
  ".cm-searchMatch-selected": { background: "color-mix(in srgb, var(--accent) 55%, transparent)" },
  ".cm-selectionMatch": { background: "color-mix(in srgb, var(--accent) 18%, transparent)" },
});

// Markdown-aware syntax styling for the EDIT surface (was near-plain before).
const mdHighlight = HighlightStyle.define([
  { tag: t.heading1, fontSize: "1.4em", fontWeight: "700", color: "var(--fg)" },
  { tag: t.heading2, fontSize: "1.25em", fontWeight: "700", color: "var(--fg)" },
  { tag: t.heading3, fontSize: "1.12em", fontWeight: "700", color: "var(--fg)" },
  { tag: [t.heading4, t.heading5, t.heading6], fontWeight: "700", color: "var(--fg)" },
  { tag: t.strong, fontWeight: "700", color: "var(--fg)" },
  { tag: t.emphasis, fontStyle: "italic" },
  { tag: t.strikethrough, textDecoration: "line-through", color: "var(--fg-muted)" },
  { tag: t.link, color: "var(--link)" },
  { tag: t.url, color: "var(--link)" },
  { tag: [t.monospace], fontFamily: "var(--font-mono)", color: "var(--success)" },
  { tag: t.quote, color: "var(--fg-muted)", fontStyle: "italic" },
  { tag: [t.list, t.processingInstruction], color: "var(--fg-muted)" },
  { tag: [t.meta, t.comment], color: "var(--muted)" },
  { tag: t.keyword, color: "var(--link)" },
  { tag: [t.string, t.special(t.string)], color: "var(--success)" },
  { tag: [t.number, t.bool, t.atom], color: "var(--link)" },
  { tag: [t.typeName, t.className], color: "var(--link)" },
  { tag: t.variableName, color: "var(--fg)" },
]);

// URL detection for smart paste (paste a URL over a text selection → [sel](url)).
const URL_RE = /^(https?:\/\/|mailto:)[^\s]+$/i;

export function CodeMirrorEditor({ path, initialContent, baseSha, completionData, livePreviewForced = false }: Props) {
  // Ref so the settings-subscription closure (created once at mount) always
  // reads the LATEST forced flag without re-subscribing.
  const forcedRef = useRef(livePreviewForced);
  forcedRef.current = livePreviewForced;
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSaveRef = useRef(false);
  const completionDataRef = useRef<CompletionData>(completionData ?? { noteNames: [], tags: [] });
  completionDataRef.current = completionData ?? { noteNames: [], tags: [] };

  // Compartments for live-reconfigurable settings (no view recreation).
  const vimComp = useRef(new Compartment());
  const lineNumComp = useRef(new Compartment());
  const spellComp = useRef(new Compartment());
  const lpComp = useRef(new Compartment());
  const ghostComp = useRef(new Compartment());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const s0 = useEditorSettings.getState();

    const startState = EditorState.create({
      doc: initialContent,
      extensions: [
        // vim must come FIRST per @replit/codemirror-vim docs.
        vimComp.current.of(s0.vimMode ? vim() : []),
        markdown(),
        EditorView.lineWrapping,
        history(),
        drawSelection(),
        dropCursor(),
        indentOnInput(),
        bracketMatching(),
        closeBrackets(),
        codeFolding(),
        foldGutter(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        highlightSelectionMatches(),
        search({ top: true }),
        syntaxHighlighting(mdHighlight),
        aiSuggestion,
        lpComp.current.of(livePreviewForced ? livePreview : []),
        ghostComp.current.of(s0.aiGhostText ? ghostText : []),
        lineNumComp.current.of(s0.lineNumbers ? lineNumbers() : []),
        spellComp.current.of(
          EditorView.contentAttributes.of({ spellcheck: s0.spellcheck ? "true" : "false" }),
        ),
        autocompletion({
          override: [
            makeVaultCompletionSource(() => completionDataRef.current),
            makeSlashCommandSource(),
          ],
        }),
        keymap.of([
          // Authoring keybindings (Obsidian-style)
          { key: "Mod-b", run: (v) => wrapSelection(v, "**", "**") },
          { key: "Mod-i", run: (v) => wrapSelection(v, "*", "*") },
          { key: "Mod-e", run: (v) => wrapSelection(v, "`", "`") },
          // List / quote continuation + smart backspace
          { key: "Enter", run: insertNewlineContinueMarkup },
          { key: "Backspace", run: deleteMarkupBackward },
          ...closeBracketsKeymap,
          ...searchKeymap,
          ...foldKeymap,
          indentWithTab,
          ...defaultKeymap,
          ...historyKeymap,
        ]),
        editorTheme,
        EditorView.updateListener.of((update) => {
          if (!update.docChanged) return;
          // Instant preview path — push the new buffer into the editor
          // store synchronously on every doc change so the split-mode
          // preview re-renders in the same animation frame. Cheap because
          // Zustand only notifies subscribers actually selecting THIS
          // path's content slice.
          const content = update.state.doc.toString();
          useEditorStore.getState().setContent(path, content);

          // Debounced persistence path — saveDraft (IndexedDB) and the
          // dirty flag are still throttled to 400ms so we don't beat up
          // the disk on every keystroke.
          pendingSaveRef.current = true;
          if (debounceRef.current !== null) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => {
            pendingSaveRef.current = false;
            // Always read the FRESHEST baseSha from the store — the prop
            // `baseSha` was captured at mount time and never refreshes when
            // a commit / history restore / AI accept updates it. Saving a
            // draft with the stale sha trips the OCC check at commit time.
            const liveBaseSha =
              useEditorStore.getState().baseShaByPath[path] ?? baseSha;
            void saveDraft(path, { content: update.state.doc.toString(), baseSha: liveBaseSha });
            useEditorStore.getState().setDirty(path, true);
          }, 400);
        }),
      ],
    });

    const view = new EditorView({ state: startState, parent: container });
    viewRef.current = view;
    setActiveView(view, path);

    // Focus-based active-view claim: with two split panes mounted, whichever
    // pane the user focuses becomes the target for toolbar/AI/find/ghost.
    const onFocusIn = () => setActiveView(view, path);
    view.dom.addEventListener("focusin", onFocusIn);

    // Live-reconfigure compartments when settings change.
    const unsub = useEditorSettings.subscribe((s) => {
      view.dispatch({
        effects: [
          vimComp.current.reconfigure(s.vimMode ? vim() : []),
          // Concealment (live-preview) is NOT a user setting — it's owned by
          // the "Live" view mode only, reconfigured by the livePreviewForced
          // effect below. Edit/split always show raw markers.
          ghostComp.current.reconfigure(s.aiGhostText ? ghostText : []),
          lineNumComp.current.reconfigure(s.lineNumbers ? lineNumbers() : []),
          spellComp.current.reconfigure(
            EditorView.contentAttributes.of({ spellcheck: s.spellcheck ? "true" : "false" }),
          ),
        ],
      });
    });

    // ------------------------------------------------------------------
    // Image paste / drop + smart URL paste
    // ------------------------------------------------------------------
    function readFileAsBase64(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1] ?? "");
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    }

    async function handleImageFile(file: File): Promise<void> {
      try {
        const base64 = await readFileAsBase64(file);
        const res = await fetch("/api/vault/upload", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ filename: file.name, dataBase64: base64 }),
        });
        if (!res.ok) {
          console.error("[sgnk-md] upload failed:", await res.text());
          return;
        }
        const json = (await res.json()) as { path?: string };
        if (!json.path) return;
        const mdLink = `![${file.name}](${json.path})`;
        const v = viewRef.current;
        if (!v) return;
        const cursor = v.state.selection.main.head;
        v.dispatch({
          changes: { from: cursor, insert: mdLink },
          selection: { anchor: cursor + mdLink.length },
        });
      } catch (err) {
        console.error("[sgnk-md] image upload error:", err);
      }
    }

    function extractImageFiles(files: FileList | null): File[] {
      if (!files) return [];
      const result: File[] = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (f && f.type.startsWith("image/")) result.push(f);
      }
      return result;
    }

    function onPaste(e: ClipboardEvent): void {
      const v = viewRef.current;
      // 1. Image paste → upload
      const images = extractImageFiles(e.clipboardData?.files ?? null);
      if (images.length > 0) {
        e.preventDefault();
        for (const img of images) void handleImageFile(img);
        return;
      }
      // 2. Smart URL paste: a URL pasted over a non-empty selection → [sel](url)
      if (!v) return;
      const text = e.clipboardData?.getData("text/plain")?.trim() ?? "";
      if (!URL_RE.test(text)) return;
      const sel = v.state.selection.main;
      if (sel.empty) return;
      const selected = v.state.sliceDoc(sel.from, sel.to);
      e.preventDefault();
      const link = `[${selected}](${text})`;
      v.dispatch({
        changes: { from: sel.from, to: sel.to, insert: link },
        selection: { anchor: sel.from + link.length },
      });
    }

    function onDrop(e: DragEvent): void {
      const images = extractImageFiles(e.dataTransfer?.files ?? null);
      if (images.length === 0) return;
      e.preventDefault();
      for (const img of images) void handleImageFile(img);
    }

    container.addEventListener("paste", onPaste);
    container.addEventListener("drop", onDrop);

    return () => {
      unsub();
      view.dom.removeEventListener("focusin", onFocusIn);
      container.removeEventListener("paste", onPaste);
      container.removeEventListener("drop", onDrop);
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      if (pendingSaveRef.current) {
        pendingSaveRef.current = false;
        const content = view.state.doc.toString();
        // Same freshness rule as the debounced path — read the live store sha.
        const liveBaseSha =
          useEditorStore.getState().baseShaByPath[path] ?? baseSha;
        void saveDraft(path, { content, baseSha: liveBaseSha });
        useEditorStore.getState().setDirty(path, true);
        useEditorStore.getState().setContent(path, content);
      }
      view.destroy();
      viewRef.current = null;
      // Only relinquish the global active view if it was ours (a sibling split
      // pane may now be the active one).
      if (getActiveView() === view) setActiveView(null);
    };
    // Empty dep array intentional: component is keyed by path (remounts on note
    // switch). Settings changes are handled via the store subscription above.
  }, []);

  // Mode switches (edit ↔ live) change `livePreviewForced` WITHOUT remounting
  // the editor (it's keyed by path only). Reconfigure the live-preview
  // compartment whenever the forced flag flips, OR-ed with the user setting.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const enabled = livePreviewForced;
    view.dispatch({
      effects: lpComp.current.reconfigure(enabled ? livePreview : []),
    });
  }, [livePreviewForced]);

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />;
}
