// @vitest-environment jsdom

/**
 * embedded-note.test.tsx — RTL tests for ![[embed]] transclusion in Markdown.
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Markdown } from "@/modules/preview/presentation/Markdown";

// ---------------------------------------------------------------------------
// Mock editor store (avoid real Zustand state in tests)
// ---------------------------------------------------------------------------
vi.mock("@/modules/editor/presentation/editor-store", () => ({
  useEditorStore: {
    getState: () => ({ openTab: vi.fn() }),
  },
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BASENAME_MAP = new Map<string, string>([
  ["HQ", "Projects/HQ/HQ.md"],
]);

function makeFetchMock(content: string): typeof fetch {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ path: "Projects/HQ/HQ.md", content }),
  } as unknown as Response);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("![[embed]] transclusion", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches and renders the embedded content for a resolved target", async () => {
    const fetchMock = makeFetchMock("# HQ\n\nhello embed");
    vi.stubGlobal("fetch", fetchMock);

    render(
      <Markdown
        content={"before ![[HQ]] after"}
        basenameToPath={BASENAME_MAP}
      />,
    );

    // Surrounding text should be visible
    expect(screen.getByText(/before/)).toBeInTheDocument();
    expect(screen.getByText(/after/)).toBeInTheDocument();

    // Embedded content should appear after fetch resolves
    await waitFor(() => {
      expect(screen.getByText(/hello embed/i)).toBeInTheDocument();
    });

    // Fetch was called for the resolved path
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("Projects%2FHQ%2FHQ.md"),
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("renders dim fallback for an unresolved target without calling fetch", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(
      <Markdown
        content={"before ![[HQ]] after"}
        basenameToPath={new Map()} // empty → unresolved
      />,
    );

    // Fallback span should show the raw embed syntax
    expect(screen.getByText(/!\[\[HQ\]\]/)).toBeInTheDocument();

    // fetch should NOT be called
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not fetch or expand embeds when depth >= 2 (depth guard)", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(
      <Markdown
        content="![[HQ]]"
        depth={2}
        basenameToPath={BASENAME_MAP}
      />,
    );

    // Should NOT fetch
    expect(fetchMock).not.toHaveBeenCalled();

    // Should render a shallow link/indicator instead
    const depthGuard = document.querySelector("[data-embed-depth-guard]");
    expect(depthGuard).toBeInTheDocument();
  });

  it("does not break existing [[wikilink]] behavior", () => {
    render(
      <Markdown
        content="see [[HQ]] for details"
        basenameToPath={BASENAME_MAP}
        onWikilink={vi.fn()}
      />,
    );

    // Should render the display text "HQ" as a link, not an embed
    expect(screen.getByText("HQ")).toBeInTheDocument();
    // Should NOT render an embed container
    expect(document.querySelector("[data-embed-container]")).not.toBeInTheDocument();
  });
});
