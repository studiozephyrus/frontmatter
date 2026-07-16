// @vitest-environment jsdom
/**
 * search-panel.test.tsx — RTL tests for the SearchPanel component.
 *
 * Guards:
 * - Renders nothing when closed
 * - Shows search input when open
 * - Typing a query (after debounce) triggers fetch and renders results
 * - Clicking a result calls openTab with the correct path and closes the panel
 * - Esc / overlay click calls onClose
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { useEditorStore } from "@/modules/editor/presentation/editor-store";

// Mock useSnapshot — SearchPanel reads snapshot for client-side title/tag/folder match.
vi.mock("@/modules/vault/presentation/use-snapshot", () => ({
  useSnapshot: () => ({
    loading: false,
    error: null,
    snapshot: {
      sha: "test", generatedAt: "2026-01-01",
      tree: { name: "", path: "", type: "folder", children: [] },
      notes: [],
    },
  }),
}));

// ---------------------------------------------------------------------------
// Mock fetch
// ---------------------------------------------------------------------------

const MOCK_RESULTS = [
  {
    path: "Projects/HQ/HQ.md",
    title: "HQ",
    snippet: "…This is our headquarters note…",
  },
];

const mockFetch = vi.fn<typeof globalThis.fetch>();
vi.stubGlobal("fetch", mockFetch);

function setFetchSuccess(): void {
  mockFetch.mockResolvedValue(
    new Response(JSON.stringify({ results: MOCK_RESULTS }), {
      status: 200,
      headers: { "content-type": "application/json" },
    }),
  );
}

// ---------------------------------------------------------------------------

import { SearchPanel } from "@/modules/app-shell/presentation/SearchPanel";

const mockOpenTab = vi.fn();

beforeEach(() => {
  mockFetch.mockReset();
  mockOpenTab.mockClear();
  useEditorStore.setState({
    tabs: [],
    activePath: null,
    mode: "reading",
    contentByPath: {},
    openTab: mockOpenTab,
  } as unknown as Parameters<typeof useEditorStore.setState>[0]);
});

afterEach(() => {
  vi.useRealTimers();
});

// Helper: advance debounce timers then let Promises flush
async function advanceDebounce(): Promise<void> {
  await act(async () => {
    vi.useFakeTimers();
    vi.advanceTimersByTime(300);
    vi.useRealTimers();
    // Let microtask queue drain (fetch resolves)
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe("SearchPanel", () => {
  it("renders nothing when closed", () => {
    const { container } = render(<SearchPanel open={false} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it("shows search input when open", () => {
    render(<SearchPanel open onClose={vi.fn()} />);
    expect(screen.getByPlaceholderText(/Search titles/i)).toBeInTheDocument();
  });

  it("typing a query triggers fetch and renders results", async () => {
    setFetchSuccess();
    render(<SearchPanel open onClose={vi.fn()} />);

    const input = screen.getByPlaceholderText(/Search titles/i);
    fireEvent.change(input, { target: { value: "headquarters" } });

    await advanceDebounce();

    await waitFor(() => {
      expect(screen.getByText("HQ")).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("headquarters"),
    );
  });

  it("clicking a result calls openTab with correct path and closes panel", async () => {
    setFetchSuccess();
    const onClose = vi.fn();
    render(<SearchPanel open onClose={onClose} />);

    const input = screen.getByPlaceholderText(/Search titles/i);
    fireEvent.change(input, { target: { value: "headquarters" } });

    await advanceDebounce();

    await waitFor(() => {
      expect(screen.getByText("HQ")).toBeInTheDocument();
    });

    const hqTitle = screen.getByText("HQ");
    const listItem = hqTitle.closest("li");
    expect(listItem).not.toBeNull();
    fireEvent.click(listItem!);

    expect(mockOpenTab).toHaveBeenCalledWith("Projects/HQ/HQ.md");
    expect(onClose).toHaveBeenCalled();
  });

  it("Esc key calls onClose", () => {
    const onClose = vi.fn();
    render(<SearchPanel open onClose={onClose} />);
    const dialog = screen.getByRole("dialog");
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("clicking the overlay calls onClose", () => {
    const onClose = vi.fn();
    render(<SearchPanel open onClose={onClose} />);
    fireEvent.click(screen.getByRole("presentation"));
    expect(onClose).toHaveBeenCalled();
  });

  it("shows empty state message before typing", () => {
    render(<SearchPanel open onClose={vi.fn()} />);
    expect(screen.getByText("Start typing to search…")).toBeInTheDocument();
  });

  it("shows 'no matching notes' when results are empty", async () => {
    mockFetch.mockResolvedValue(
      new Response(JSON.stringify({ results: [] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    render(<SearchPanel open onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText(/Search titles/i);
    fireEvent.change(input, { target: { value: "xyzzy" } });

    await advanceDebounce();

    await waitFor(() => {
      expect(screen.getByText("No matches")).toBeInTheDocument();
    });
  });
});
