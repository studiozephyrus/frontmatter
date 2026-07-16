// @vitest-environment jsdom

/**
 * editor-pane.test.tsx — RTL smoke test for EditorPane.
 *
 * Guards the B4 class of infinite-render loops: if any Zustand selector
 * returns a new object/array on every call, React's update depth limit
 * will throw "Maximum update depth exceeded" and this test catches it.
 *
 * We mock heavy leaf components (CodeMirrorEditor, Markdown) and the
 * data hooks (useNoteContent, useSnapshot) so the test stays fast and
 * isolated from network / IndexedDB.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// --------------- module mocks (hoisted before imports) --------------------

vi.mock("@/modules/editor/presentation/CodeMirrorEditor", () => ({
  CodeMirrorEditor: ({ path }: { path: string }) => (
    <div data-testid="codemirror">{path}</div>
  ),
}));

vi.mock("@/modules/preview/presentation/Markdown", () => ({
  Markdown: ({ content }: { content: string }) => (
    <div data-testid="markdown">{content}</div>
  ),
}));

// Toolbar is a thin button row — mock it to keep the RTL test fast and DOM-isolated
vi.mock("@/modules/editor/presentation/Toolbar", () => ({
  Toolbar: () => <div data-testid="editor-toolbar" />,
}));

vi.mock("@/modules/editor/presentation/use-note-content", () => ({
  useNoteContent: (_path: string) => ({
    loading: false,
    error: null,
    initialContent: "# Hello",
    baseSha: "abc123",
  }),
}));

vi.mock("@/modules/vault/presentation/use-snapshot", () => ({
  useSnapshot: () => ({
    loading: false,
    error: null,
    snapshot: {
      sha: "s1",
      generatedAt: "2026-01-01",
      tree: { name: "root", path: "", type: "folder", children: [] },
      notes: [
        {
          path: "Projects/HQ/HQ.md",
          title: "HQ",
          tags: [],
          outbound: [],
          backlinks: [],
          excludeFromGraph: false,
        },
      ],
    },
  }),
}));

// --------------------------------------------------------------------------

import { useEditorStore } from "@/modules/editor/presentation/editor-store";
import { EditorPane } from "@/modules/editor/presentation/EditorPane";

beforeEach(() => {
  // Reset store to a clean state with known tabs
  useEditorStore.setState({
    tabs: [
      { path: "Projects/HQ/HQ.md", title: "HQ", dirty: false },
      { path: "Research/Paper.md", title: "Paper", dirty: false },
    ],
    activePath: "Projects/HQ/HQ.md",
    mode: "reading",
    contentByPath: {},
  });
});

describe("EditorPane", () => {
  it("renders without crashing and shows the tab bar", () => {
    render(<EditorPane />);
    expect(screen.getByText("HQ")).toBeInTheDocument();
    expect(screen.getByText("Paper")).toBeInTheDocument();
  });

  it("renders the mode toggle buttons", () => {
    render(<EditorPane />);
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reading" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Split" })).toBeInTheDocument();
  });

  it("in reading mode renders Markdown, not CodeMirrorEditor", async () => {
    useEditorStore.setState({ mode: "reading" });
    render(<EditorPane />);
    expect(screen.getByText("Rendering preview…")).toBeInTheDocument();
    expect(await screen.findByTestId("markdown")).toBeInTheDocument();
    expect(screen.queryByTestId("codemirror")).not.toBeInTheDocument();
  });

  it("in edit mode renders CodeMirrorEditor, not Markdown", () => {
    useEditorStore.setState({ mode: "edit" });
    render(<EditorPane />);
    expect(screen.getByTestId("codemirror")).toBeInTheDocument();
    expect(screen.queryByTestId("markdown")).not.toBeInTheDocument();
  });

  it("in split mode renders both CodeMirrorEditor and Markdown", async () => {
    useEditorStore.setState({ mode: "split" });
    render(<EditorPane />);
    expect(screen.getByTestId("codemirror")).toBeInTheDocument();
    expect(screen.getByText("Rendering preview…")).toBeInTheDocument();
    expect(await screen.findByTestId("markdown")).toBeInTheDocument();
  });

  it("shows empty state when no tabs are open", () => {
    useEditorStore.setState({ tabs: [], activePath: null });
    render(<EditorPane />);
    expect(screen.getByText(/No note open/i)).toBeInTheDocument();
  });

  // -----------------------------------------------------------------------
  // B5T4: Toolbar visibility
  // -----------------------------------------------------------------------

  it("renders the Toolbar in edit mode", () => {
    useEditorStore.setState({ mode: "edit" });
    render(<EditorPane />);
    expect(screen.getByTestId("editor-toolbar")).toBeInTheDocument();
  });

  it("renders the Toolbar in split mode", () => {
    useEditorStore.setState({ mode: "split" });
    render(<EditorPane />);
    expect(screen.getByTestId("editor-toolbar")).toBeInTheDocument();
  });

  it("does NOT render the Toolbar in reading mode", () => {
    useEditorStore.setState({ mode: "reading" });
    render(<EditorPane />);
    expect(screen.queryByTestId("editor-toolbar")).not.toBeInTheDocument();
  });
});
