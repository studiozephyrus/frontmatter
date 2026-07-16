// @vitest-environment jsdom
/**
 * command-palette.test.tsx — RTL tests for the CommandPalette component.
 *
 * Guards:
 * - Command list appears when open
 * - Filtering by query works
 * - Selecting a mode command calls setMode
 * - Esc calls onClose
 * - Daily note command is present
 * - Template commands appear when Templates/ notes exist
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { useEditorStore } from "@/modules/editor/presentation/editor-store";
import { SnapshotProvider } from "@/modules/vault/presentation/SnapshotProvider";
import type { VaultSnapshot } from "@/modules/vault/application/dto";

// ---------------------------------------------------------------------------

import { CommandPalette } from "@/modules/app-shell/presentation/CommandPalette";

const mockSetMode = vi.fn();

function makeSnapshot(overrides: Partial<VaultSnapshot> = {}): VaultSnapshot {
  return {
    sha: "abc",
    generatedAt: "2026-01-01T00:00:00.000Z",
    tree: { name: "root", path: "", type: "folder", children: [] },
    notes: [],
    ...overrides,
  };
}

/** Render helper that wraps with SnapshotProvider using a mocked fetch. */
function renderWithSnapshot(
  ui: React.ReactElement,
  snapshot: VaultSnapshot = makeSnapshot(),
) {
  global.fetch = vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input.toString();
    if (url.includes("/api/vault/snapshot")) {
      return new Response(JSON.stringify(snapshot), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("not found", { status: 404 });
  }) as typeof global.fetch;

  return render(<SnapshotProvider>{ui}</SnapshotProvider>);
}

beforeEach(() => {
  mockSetMode.mockClear();
  useEditorStore.setState({
    tabs: [],
    activePath: null,
    mode: "reading",
    contentByPath: {},
    setMode: mockSetMode,
  } as unknown as Parameters<typeof useEditorStore.setState>[0]);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CommandPalette", () => {
  it("renders nothing when closed", () => {
    const { container } = renderWithSnapshot(
      <CommandPalette open={false} onClose={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("shows command input when open", () => {
    renderWithSnapshot(<CommandPalette open onClose={vi.fn()} />);
    expect(
      screen.getByPlaceholderText("Run a command…"),
    ).toBeInTheDocument();
  });

  it("shows all commands by default (empty query)", () => {
    renderWithSnapshot(<CommandPalette open onClose={vi.fn()} />);
    // Should list mode commands
    expect(screen.getByText("Toggle to Edit mode")).toBeInTheDocument();
    expect(screen.getByText("Reading mode")).toBeInTheDocument();
    expect(screen.getByText("Split mode")).toBeInTheDocument();
  });

  it("filters commands by query", () => {
    renderWithSnapshot(<CommandPalette open onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText("Run a command…");
    fireEvent.change(input, { target: { value: "edit" } });

    expect(screen.getByText("Toggle to Edit mode")).toBeInTheDocument();
    // "Reading mode" doesn't match "edit"
    expect(screen.queryByText("Reading mode")).not.toBeInTheDocument();
  });

  it("Enter on first result runs the command and closes", () => {
    const onClose = vi.fn();
    renderWithSnapshot(<CommandPalette open onClose={onClose} />);
    const input = screen.getByPlaceholderText("Run a command…");
    // Filter to reading mode
    fireEvent.change(input, { target: { value: "reading" } });

    const dialog = screen.getByRole("dialog");
    fireEvent.keyDown(dialog, { key: "Enter" });

    expect(mockSetMode).toHaveBeenCalledWith("reading");
    expect(onClose).toHaveBeenCalled();
  });

  it("Esc calls onClose without running a command", () => {
    const onClose = vi.fn();
    renderWithSnapshot(<CommandPalette open onClose={onClose} />);
    const dialog = screen.getByRole("dialog");
    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(onClose).toHaveBeenCalled();
    expect(mockSetMode).not.toHaveBeenCalled();
  });

  it("clicking a mode command calls setMode", () => {
    const onClose = vi.fn();
    renderWithSnapshot(<CommandPalette open onClose={onClose} />);
    const input = screen.getByPlaceholderText("Run a command…");
    fireEvent.change(input, { target: { value: "split" } });

    const splitCmd = screen.getByText("Split mode");
    fireEvent.click(splitCmd);

    expect(mockSetMode).toHaveBeenCalledWith("split");
    expect(onClose).toHaveBeenCalled();
  });

  it("clicking the overlay closes the palette", () => {
    const onClose = vi.fn();
    renderWithSnapshot(<CommandPalette open onClose={onClose} />);
    const overlay = screen.getByRole("presentation");
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // Daily note command
  // -------------------------------------------------------------------------

  it("includes the 'Open today's daily note' command", () => {
    renderWithSnapshot(<CommandPalette open onClose={vi.fn()} />);
    expect(
      screen.getByText("Open today's daily note"),
    ).toBeInTheDocument();
  });

  it("daily note command opens tab directly when note exists in snapshot", async () => {
    const mockOpenTab = vi.fn();
    useEditorStore.setState({
      ...useEditorStore.getState(),
      openTab: mockOpenTab,
    } as unknown as Parameters<typeof useEditorStore.setState>[0]);

    // Build a note matching today's path
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayPath = `Daily/${year}-${month}-${day}.md`;

    const snapshot = makeSnapshot({
      notes: [
        {
          path: todayPath,
          title: `${year}-${month}-${day}`,
          tags: ["daily"],
          outbound: [],
          backlinks: [],
          excludeFromGraph: false,
        },
      ],
    });

    const onClose = vi.fn();
    renderWithSnapshot(<CommandPalette open onClose={onClose} />, snapshot);

    // Wait for snapshot to load
    await waitFor(() =>
      expect(screen.getByText("Open today's daily note")).toBeInTheDocument(),
    );

    const input = screen.getByPlaceholderText("Run a command…");
    fireEvent.change(input, { target: { value: "daily" } });

    fireEvent.click(screen.getByText("Open today's daily note"));

    expect(mockOpenTab).toHaveBeenCalledWith(todayPath);
    expect(onClose).toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // Template commands
  // -------------------------------------------------------------------------

  it("shows fallback entry when no Templates/ notes exist", () => {
    renderWithSnapshot(<CommandPalette open onClose={vi.fn()} />, makeSnapshot({ notes: [] }));
    const input = screen.getByPlaceholderText("Run a command…");
    fireEvent.change(input, { target: { value: "template" } });
    expect(
      screen.getByText(/Insert template \(none found/),
    ).toBeInTheDocument();
  });

  it("shows per-template commands when Templates/ notes exist in snapshot", async () => {
    const snapshot = makeSnapshot({
      notes: [
        {
          path: "Templates/Weekly Review.md",
          title: "Weekly Review",
          tags: [],
          outbound: [],
          backlinks: [],
          excludeFromGraph: false,
        },
        {
          path: "Templates/Meeting Notes.md",
          title: "Meeting Notes",
          tags: [],
          outbound: [],
          backlinks: [],
          excludeFromGraph: false,
        },
      ],
    });

    renderWithSnapshot(
      <CommandPalette open onClose={vi.fn()} />,
      snapshot,
    );

    // Wait for snapshot to load and commands to populate
    await waitFor(() =>
      expect(
        screen.getByText("Insert template: Weekly Review"),
      ).toBeInTheDocument(),
    );

    expect(screen.getByText("Insert template: Meeting Notes")).toBeInTheDocument();
  });

  it("does not show fallback entry when Templates/ notes exist", async () => {
    const snapshot = makeSnapshot({
      notes: [
        {
          path: "Templates/Standup.md",
          title: "Standup",
          tags: [],
          outbound: [],
          backlinks: [],
          excludeFromGraph: false,
        },
      ],
    });

    renderWithSnapshot(
      <CommandPalette open onClose={vi.fn()} />,
      snapshot,
    );

    await waitFor(() =>
      expect(screen.getByText("Insert template: Standup")).toBeInTheDocument(),
    );

    const input = screen.getByPlaceholderText("Run a command…");
    fireEvent.change(input, { target: { value: "template" } });

    expect(
      screen.queryByText(/none found/),
    ).not.toBeInTheDocument();
  });
});
