"use client";

/**
 * InlineBlockEditor — a minimal, single-block CodeMirror surface used by Live
 * mode. When the user clicks a rendered block, that block's raw markdown opens
 * here for editing. Esc / Cmd-Enter / blur commit the edited text back to the
 * document; the block then re-renders. Only one block edits at a time, so a
 * fresh view is mounted per edit and destroyed on commit.
 */
import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";

type Props = {
  /** Raw markdown source of the block being edited. */
  initial: string;
  /** Commit the edited source (Esc / Cmd-Enter / blur). */
  onCommit: (next: string) => void;
};

const inlineTheme = EditorView.theme({
  "&": { background: "transparent", color: "var(--fg)", fontSize: "14px" },
  ".cm-content": {
    padding: "2px 0",
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    lineHeight: "1.6",
    caretColor: "var(--fg)",
  },
  ".cm-cursor": { borderLeftColor: "var(--fg)" },
  "&.cm-focused": { outline: "none" },
  ".cm-line": { padding: "0" },
});

export function InlineBlockEditor({ initial, onCommit }: Props): React.JSX.Element {
  const parentRef = useRef<HTMLDivElement>(null);
  // Keep the latest onCommit in a ref so the mount-once effect's closures call
  // the current handler without re-creating the view.
  const onCommitRef = useRef(onCommit);
  onCommitRef.current = onCommit;

  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;

    let committed = false;
    const commit = (view: EditorView): boolean => {
      if (committed) return true;
      committed = true;
      onCommitRef.current(view.state.doc.toString());
      return true;
    };

    const state = EditorState.create({
      doc: initial,
      extensions: [
        markdown(),
        history(),
        EditorView.lineWrapping,
        keymap.of([
          { key: "Escape", run: (v) => commit(v) },
          { key: "Mod-Enter", run: (v) => commit(v) },
          indentWithTab,
          ...historyKeymap,
          ...defaultKeymap,
        ]),
        inlineTheme,
        EditorView.domEventHandlers({
          blur: (_e, view) => {
            commit(view);
            return false;
          },
        }),
      ],
    });

    const view = new EditorView({ state, parent });
    view.focus();
    // Place the caret at the end of the block on open.
    view.dispatch({ selection: { anchor: view.state.doc.length } });

    return () => view.destroy();
    // Mount once per edit session — `initial` is fixed for this instance and
    // the latest onCommit is read via onCommitRef.
  }, []);

  return <div ref={parentRef} className="sgnk-live-edit" />;
}
