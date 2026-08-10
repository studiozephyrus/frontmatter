// @vitest-environment jsdom

/**
 * §6.1 — CodeMirror never read back from the store. A property-panel edit
 * (or any other out-of-editor writer of contentByPath, e.g. AI apply,
 * history restore) landed in the Zustand store but the live EditorView kept
 * showing its stale mount-time doc. Worse: the NEXT keystroke's
 * updateListener pushed that stale doc back into the store, silently
 * reverting the edit and persisting the reverted text as the draft.
 *
 * Mounts the real CodeMirrorEditor (not mocked) under jsdom so the
 * assertions exercise the actual EditorView, not a stand-in.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, act } from "@testing-library/react";

// CodeMirrorEditor's debounced/unmount save path calls saveDraft, which
// hits idb-keyval → IndexedDB — unavailable in jsdom. Same mock shape as
// test/repository/commit-bar.test.tsx and test/vault/file-tree-crud.test.tsx.
vi.mock("@/modules/drafts", () => ({
  listDirtyPaths: () => [],
  saveDraft: vi.fn(async () => {}),
  getDraft: vi.fn(async () => undefined),
  deleteDraft: vi.fn(async () => {}),
}));

import { useEditorStore } from "@/modules/editor/presentation/editor-store";
import { CodeMirrorEditor } from "@/modules/editor/presentation/CodeMirrorEditor";
import { getActiveView } from "@/modules/editor/presentation/active-view";

const PATH = "note.md";
const ORIGINAL = "---\ntitle: old\n---\nbody text";
const EDITED = "---\ntitle: new\n---\nbody text";

beforeEach(() => {
  useEditorStore.setState({
    tabs: [],
    activePath: null,
    secondaryPath: null,
    mode: "edit",
    contentByPath: {},
    baseShaByPath: {},
    reloadByPath: {},
  });
});

describe("CodeMirrorEditor reads back from the store", () => {
  it("applies an external store edit (property panel) into the live doc", () => {
    render(<CodeMirrorEditor path={PATH} initialContent={ORIGINAL} baseSha="sha1" />);
    const view = getActiveView();
    expect(view).not.toBeNull();
    expect(view!.state.doc.toString()).toBe(ORIGINAL);

    // Exactly what EditorPane's handleEdit does for a PropertiesPanel edit —
    // writes the store directly, never touches CodeMirror.
    act(() => {
      useEditorStore.getState().setContent(PATH, EDITED);
    });

    expect(view!.state.doc.toString()).toBe(EDITED);
  });

  it("does not revert the external edit on the next keystroke", () => {
    render(<CodeMirrorEditor path={PATH} initialContent={ORIGINAL} baseSha="sha1" />);
    const view = getActiveView()!;

    act(() => {
      useEditorStore.getState().setContent(PATH, EDITED);
    });

    // One keystroke at the end of the doc — the class of event that
    // triggered the revert.
    act(() => {
      view.dispatch({ changes: { from: view.state.doc.length, insert: "!" } });
    });

    expect(useEditorStore.getState().contentByPath[PATH]).toBe(`${EDITED}!`);
  });

  it("preserves cursor position across an external sync that edits an earlier region", () => {
    render(<CodeMirrorEditor path={PATH} initialContent={ORIGINAL} baseSha="sha1" />);
    const view = getActiveView()!;

    // Cursor at the very end (in the body, after the frontmatter).
    act(() => {
      view.dispatch({ selection: { anchor: view.state.doc.length } });
    });

    // External sync only rewrites the frontmatter title, well before the cursor.
    act(() => {
      useEditorStore.getState().setContent(PATH, EDITED);
    });

    // Cursor should have shifted by exactly the length delta introduced
    // before it (old→new adds one character: "old" -> "new", same length —
    // so the cursor should be unchanged), not collapsed to 0.
    expect(view.state.selection.main.head).toBe(EDITED.length);
  });

  it("ignores its own typing (no feedback loop / no redundant dispatch)", () => {
    render(<CodeMirrorEditor path={PATH} initialContent={ORIGINAL} baseSha="sha1" />);
    const view = getActiveView()!;

    act(() => {
      view.dispatch({ changes: { from: view.state.doc.length, insert: "!" } });
    });

    expect(view.state.doc.toString()).toBe(`${ORIGINAL}!`);
    expect(useEditorStore.getState().contentByPath[PATH]).toBe(`${ORIGINAL}!`);
  });
});
