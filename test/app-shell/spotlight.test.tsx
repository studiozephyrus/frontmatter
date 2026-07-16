// @vitest-environment jsdom
/**
 * spotlight.test.tsx — RTL tests for the Spotlight component.
 *
 * Guards:
 * - Typing "hq" → fuzzy result list shows HQ note first
 * - Enter → openTab called with correct path, onClose called
 * - Esc → onClose called
 * - No render loop (stable selectors)
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { useEditorStore } from "@/modules/editor/presentation/editor-store";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock("@/modules/vault/presentation/use-snapshot", () => ({
  useSnapshot: () => ({
    loading: false,
    error: null,
    snapshot: {
      sha: "abc",
      generatedAt: "2026-01-01",
      tree: { name: "root", path: "", type: "folder", children: [] },
      notes: [
        {
          path: "notes/home.md",
          title: "Home",
          tags: [],
          outbound: [],
          backlinks: [],
          excludeFromGraph: false,
        },
        {
          path: "notes/hq-prd.md",
          title: "HQ PRD",
          tags: [],
          outbound: [],
          backlinks: [],
          excludeFromGraph: false,
        },
        {
          path: "notes/stock.md",
          title: "Stock Top 10",
          tags: [],
          outbound: [],
          backlinks: [],
          excludeFromGraph: false,
        },
      ],
    },
  }),
}));

// ---------------------------------------------------------------------------

import { Spotlight } from "@/modules/app-shell/presentation/Spotlight";

const mockOpenTab = vi.fn();

beforeEach(() => {
  mockOpenTab.mockClear();
  useEditorStore.setState({
    tabs: [],
    activePath: null,
    mode: "reading",
    contentByPath: {},
    openTab: mockOpenTab,
  } as unknown as Parameters<typeof useEditorStore.setState>[0]);
});

describe("Spotlight", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <Spotlight open={false} onClose={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("shows search input when open", () => {
    render(<Spotlight open onClose={vi.fn()} />);
    expect(
      screen.getByPlaceholderText("Search notes…"),
    ).toBeInTheDocument();
  });

  it("typing 'hq' shows HQ PRD before other results", () => {
    render(<Spotlight open onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText("Search notes…");
    fireEvent.change(input, { target: { value: "hq" } });

    const items = screen.getAllByRole("option");
    expect(items[0]).toHaveTextContent("HQ PRD");
  });

  it("Enter opens the selected note and calls onClose", () => {
    const onClose = vi.fn();
    render(<Spotlight open onClose={onClose} />);
    const input = screen.getByPlaceholderText("Search notes…");
    fireEvent.change(input, { target: { value: "hq" } });

    // Press Enter on the dialog element
    const dialog = screen.getByRole("dialog");
    fireEvent.keyDown(dialog, { key: "Enter" });

    expect(mockOpenTab).toHaveBeenCalledWith("notes/hq-prd.md");
    expect(onClose).toHaveBeenCalled();
  });

  it("Esc calls onClose without opening a tab", () => {
    const onClose = vi.fn();
    render(<Spotlight open onClose={onClose} />);
    const dialog = screen.getByRole("dialog");
    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(onClose).toHaveBeenCalled();
    expect(mockOpenTab).not.toHaveBeenCalled();
  });

  it("clicking the overlay calls onClose", () => {
    const onClose = vi.fn();
    render(<Spotlight open onClose={onClose} />);
    // Click the outer presentation div (overlay), not the dialog
    const overlay = screen.getByRole("presentation");
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it("clicking a result opens the tab and calls onClose", () => {
    const onClose = vi.fn();
    render(<Spotlight open onClose={onClose} />);
    const input = screen.getByPlaceholderText("Search notes…");
    fireEvent.change(input, { target: { value: "hq" } });

    const [firstResult] = screen.getAllByRole("option");
    if (!firstResult) throw new Error("No result rendered");
    fireEvent.click(firstResult);

    expect(mockOpenTab).toHaveBeenCalledWith("notes/hq-prd.md");
    expect(onClose).toHaveBeenCalled();
  });

  it("does not cause a render loop (no infinite updates)", () => {
    // If this renders without throwing "Maximum update depth exceeded" the test passes
    expect(() => render(<Spotlight open onClose={vi.fn()} />)).not.toThrow();
  });
});
