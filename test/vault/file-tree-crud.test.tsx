// @vitest-environment jsdom
/**
 * RTL tests for FileTree create / rename / delete actions.
 *
 * Mocks:
 *  - useSnapshot  → returns a small static tree
 *  - useEditorStore → stable tabs / activePath
 *  - listDirtyPaths → []
 *  - fetch → controlled per test
 *  - window.dispatchEvent → spied to verify "sgnk:vault-changed" event
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// ---------------------------------------------------------------------------
// Module mocks — must be hoisted before any import of the tested module
// ---------------------------------------------------------------------------

vi.mock("@/modules/vault/presentation/use-snapshot", () => ({
  useSnapshot: vi.fn(),
}));

vi.mock("@/modules/editor", () => ({
  useEditorStore: vi.fn(),
}));

vi.mock("@/modules/drafts", () => ({
  listDirtyPaths: () => [],
  saveDraft: vi.fn(async () => {}),
  getDraft: vi.fn(async () => undefined),
  deleteDraft: vi.fn(async () => {}),
}));

vi.mock("@/modules/vault/presentation/tree-order", () => ({
  orderTree: (node: unknown) => node,
}));

// FileTreeActions reads applyOptimistic from the SnapshotProvider context.
// These tests render it in isolation, so provide a no-op mutate hook.
vi.mock("@/modules/vault/presentation/SnapshotProvider", () => ({
  useSnapshotMutate: () => () => {},
}));

// ---------------------------------------------------------------------------
// Imports after mocks
// ---------------------------------------------------------------------------

import { useSnapshot } from "@/modules/vault/presentation/use-snapshot";
import { useEditorStore } from "@/modules/editor";
import { FileTree } from "@/modules/vault/presentation/FileTree";
import { FileTreeActions } from "@/modules/vault/presentation/file-tree/FileTreeActions";
import { defaultNoteContent } from "@/modules/repository";
import type { TreeNode } from "@/modules/vault/application/dto";

/** Composite renderer — FileTreeActions is now mounted at the workspace
 *  level (single source of truth for the dialog bridge). Tests mount both
 *  together so the action buttons + dialog state machine wire up. */
function FileTreeWithActions(props: { onOpen?: (p: string) => void }) {
  return (
    <>
      <FileTree {...props} />
      <FileTreeActions />
    </>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockUseSnapshot = useSnapshot as ReturnType<typeof vi.fn>;
const mockUseEditorStore = useEditorStore as unknown as ReturnType<typeof vi.fn>;

function makeTree(): TreeNode {
  return {
    name: "root",
    path: "",
    type: "folder",
    children: [
      {
        name: "Notes",
        path: "Notes",
        type: "folder",
        children: [
          { name: "hello.md", path: "Notes/hello.md", type: "file" },
          { name: "world.md", path: "Notes/world.md", type: "file" },
        ],
      },
      { name: "standalone.md", path: "standalone.md", type: "file" },
    ],
  };
}

const closeTabMock = vi.fn();
const openTabMock = vi.fn();
const dispatchSpy = vi.fn();

function setupMocks() {
  mockUseSnapshot.mockReturnValue({
    loading: false,
    error: null,
    snapshot: { sha: "abc", generatedAt: "now", tree: makeTree(), notes: [] },
  });

  // useEditorStore is called with a selector; handle both stable calls
  mockUseEditorStore.mockImplementation((selector: (s: unknown) => unknown) => {
    const state = { tabs: [], activePath: null };
    if (typeof selector === "function") return selector(state);
    return state;
  });
  // Mock getState for closeTab / openTab / setBaseSha / setDirty
  (
    mockUseEditorStore as unknown as {
      getState: () => Record<string, ReturnType<typeof vi.fn>>;
    }
  ).getState = vi.fn(() => ({
    closeTab: closeTabMock,
    openTab: openTabMock,
    setBaseSha: vi.fn(),
    setDirty: vi.fn(),
  }));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("FileTree CRUD actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
    global.fetch = vi.fn();

    // Spy on window.dispatchEvent to verify vault-changed events
    dispatchSpy.mockClear();
    vi.spyOn(window, "dispatchEvent").mockImplementation(dispatchSpy);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // New Note
  // -------------------------------------------------------------------------

  it("clicking ＋ New and submitting a name calls POST /api/vault/create", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ commitSha: "sha1", path: "MyNote.md" }),
    });

    render(<FileTreeWithActions />);

    // Click the + New button
    const newBtn = screen.getByRole("button", { name: "New note" });
    fireEvent.click(newBtn);

    // The dialog should appear
    const input = await screen.findByRole("textbox");
    fireEvent.change(input, { target: { value: "MyNote" } });

    // Submit by clicking Create
    const createBtn = screen.getByRole("button", { name: /create/i });
    await act(async () => {
      fireEvent.click(createBtn);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/vault/create",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ path: "MyNote.md", content: defaultNoteContent("MyNote.md") }),
        }),
      );
    });

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "sgnk:vault-changed" }),
      );
    });
  });

  it("pressing Enter in the new-note input submits the form", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ commitSha: "sha1", path: "Pressed.md" }),
    });

    render(<FileTreeWithActions />);

    fireEvent.click(screen.getByRole("button", { name: "New note" }));

    const input = await screen.findByRole("textbox");
    fireEvent.change(input, { target: { value: "Pressed" } });

    await act(async () => {
      fireEvent.keyDown(input, { key: "Enter" });
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/vault/create",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ path: "Pressed.md", content: defaultNoteContent("Pressed.md") }),
        }),
      );
    });
  });

  it("shows error toast on 409 for new-note (optimistic rollback)", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({ error: "exists" }),
    });

    render(<FileTreeWithActions />);

    fireEvent.click(screen.getByRole("button", { name: "New note" }));

    const input = await screen.findByRole("textbox");
    fireEvent.change(input, { target: { value: "ExistingNote" } });

    await act(async () => {
      fireEvent.keyDown(input, { key: "Enter" });
    });

    // New optimistic flow: the dialog closes + the tab opens before the
    // /api/vault/create response. On 409 the tab is rolled back and a
    // status-role toast surfaces the collision.
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        /already exists/i,
      );
    });

    // On 409 the optimistic tree node is reconciled away by re-fetching the
    // snapshot, so a vault-changed event IS dispatched (the file content is
    // not changed, but the sidebar must reflect server truth).
    const calls = dispatchSpy.mock.calls as Array<[Event]>;
    const vaultChanged = calls.some((c) => c[0].type === "sgnk:vault-changed");
    expect(vaultChanged).toBe(true);
  });

  it("Escape closes the new-note dialog without calling fetch", async () => {
    render(<FileTreeWithActions />);

    fireEvent.click(screen.getByRole("button", { name: "New note" }));
    const input = await screen.findByRole("textbox");

    fireEvent.keyDown(input, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // Delete
  // -------------------------------------------------------------------------

  it("clicking Delete (after confirm) calls /api/vault/file then /api/vault/delete", async () => {
    // First fetch: file sha
    // Second fetch: delete
    (global.fetch as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ sha: "fileSha123" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ commitSha: "delSha" }),
      });

    render(<FileTreeWithActions />);

    // Find the ⋯ button for standalone.md (visible in tree)
    const actionsBtn = await screen.findByRole("button", {
      name: /actions for standalone\.md/i,
    });

    // Show the context menu
    fireEvent.click(actionsBtn);

    // Click Delete in the menu
    const deleteMenuItem = screen.getByRole("menuitem", { name: /delete/i });
    fireEvent.click(deleteMenuItem);

    // Confirm dialog should appear
    const confirmBtn = await screen.findByRole("button", { name: /^delete$/i });
    await act(async () => {
      fireEvent.click(confirmBtn);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenNthCalledWith(
        1,
        "/api/vault/file?path=standalone.md",
      );
      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        "/api/vault/delete",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ path: "standalone.md", baseSha: "fileSha123" }),
        }),
      );
    });

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "sgnk:vault-changed" }),
      );
    });
  });

  // -------------------------------------------------------------------------
  // No render loop
  // -------------------------------------------------------------------------

  it("renders without infinite loop (stable selector check)", () => {
    const openSpy = vi.fn();
    const { unmount } = render(<FileTreeWithActions onOpen={openSpy} />);

    // If there were a render loop, vitest would hang. Just check it rendered.
    expect(screen.getByRole("button", { name: "New note" })).toBeInTheDocument();
    unmount();
    // No assertions needed — reaching here without timeout proves no loop
  });
});
