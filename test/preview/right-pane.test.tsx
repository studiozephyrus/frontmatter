// @vitest-environment jsdom

/**
 * right-pane.test.tsx — RTL smoke test for RightPane (Backlinks + Outline).
 *
 * Guards the B4 class of infinite-render loops: if any Zustand selector
 * returns a new object/array on every call, React's update depth limit
 * throws "Maximum update depth exceeded" and this test catches it.
 *
 * We mock useSnapshot so the test is isolated from network calls.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// --------------- module mocks (hoisted before imports) --------------------

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
          outbound: ["Research/Paper.md"],
          backlinks: ["Research/Paper.md"],
          excludeFromGraph: false,
        },
        {
          path: "Research/Paper.md",
          title: "Paper",
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
import { RightPane } from "@/modules/preview/presentation/RightPane";

beforeEach(() => {
  useEditorStore.setState({
    tabs: [{ path: "Projects/HQ/HQ.md", title: "HQ", dirty: false }],
    activePath: "Projects/HQ/HQ.md",
    mode: "reading",
    contentByPath: {
      "Projects/HQ/HQ.md": "# HQ Note\n\n## Section One\n\nSome content.",
    },
  });
});

describe("RightPane", () => {
  it("renders without crashing (no infinite-render loop)", () => {
    // If a Zustand selector returns a new object on every render this throws
    // "Maximum update depth exceeded" — treat any throw as a failure.
    expect(() => render(<RightPane />)).not.toThrow();
  });

  it("renders the Backlinks section header", () => {
    render(<RightPane />);
    expect(screen.getByText(/backlinks/i)).toBeInTheDocument();
  });

  it("renders the Outline section header", () => {
    render(<RightPane />);
    expect(screen.getByText(/outline/i)).toBeInTheDocument();
  });

  it("shows a backlink when one exists for the active note", () => {
    render(<RightPane />);
    // "Paper" is a backlink of HQ.md
    expect(screen.getByRole("button", { name: "Paper" })).toBeInTheDocument();
  });

  it("shows outline headings from the active note content", () => {
    render(<RightPane />);
    // Content has "# HQ Note" and "## Section One"
    expect(screen.getByRole("button", { name: "HQ Note" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Section One" })).toBeInTheDocument();
  });

  it("shows 'No backlinks' when the active note has no backlinks", () => {
    // Switch active note to Paper which has no backlinks
    useEditorStore.setState({
      activePath: "Research/Paper.md",
      contentByPath: { "Research/Paper.md": "# Paper\n\nNo outbound." },
    });
    render(<RightPane />);
    expect(screen.getByText(/no backlinks/i)).toBeInTheDocument();
  });

  it("shows 'Open a note' message when no note is active", () => {
    useEditorStore.setState({ activePath: null, tabs: [], contentByPath: {} });
    render(<RightPane />);
    expect(screen.getByText(/open a note to see backlinks/i)).toBeInTheDocument();
  });
});
