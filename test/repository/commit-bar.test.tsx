// @vitest-environment jsdom

/**
 * commit-bar.test.tsx — RTL test for the CommitBar component.
 *
 * Guards the B4 class of infinite-render loops: if any Zustand selector
 * returns a new object/array on every render, React hits the maximum update
 * depth and throws. This test catches that.
 *
 * Also verifies:
 * - CommitBar renders the dirty count without crashing.
 * - Clicking Commit calls fetch("/api/commit") with the expected body.
 * - On 200, deleteDraft and setDirty are called for committed files.
 * - On 200, dispatches "sgnk:vault-changed" (no page reload).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// ---------------------------------------------------------------------------
// Module mocks — hoisted before component import
// ---------------------------------------------------------------------------

// Mock the drafts module so we control what getDraft/deleteDraft/listDirtyPaths do.
vi.mock("@/modules/drafts", () => ({
  listDirtyPaths: vi.fn(() => ["notes/foo.md"]),
  getDraft: vi.fn(async (path: string) => {
    if (path === "notes/foo.md") {
      return { content: "# Foo", baseSha: "sha-foo", updatedAt: Date.now() };
    }
    return undefined;
  }),
  deleteDraft: vi.fn(async () => undefined),
  hasDraft: vi.fn(() => false),
}));

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------

import { useEditorStore } from "@/modules/editor/presentation/editor-store";
import { CommitBar } from "@/modules/repository/presentation/CommitBar";
import { deleteDraft, listDirtyPaths } from "@/modules/drafts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Spy on window.dispatchEvent to verify the vault-changed event
const dispatchSpy = vi.fn();

beforeEach(() => {
  // Reset editor store to a predictable state
  useEditorStore.setState({
    tabs: [{ path: "notes/foo.md", title: "foo", dirty: true }],
    activePath: "notes/foo.md",
    mode: "reading",
    contentByPath: {},
  });

  // Stub fetch
  global.fetch = vi.fn(async (_url: RequestInfo | URL, _init?: RequestInit) =>
    new Response(JSON.stringify({ commitSha: "x" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );

  // Spy on window.dispatchEvent
  dispatchSpy.mockClear();
  vi.spyOn(window, "dispatchEvent").mockImplementation(dispatchSpy);

  vi.mocked(deleteDraft).mockClear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("CommitBar", () => {
  it("renders without crashing or entering an infinite loop", () => {
    // If a Zustand selector returns a new object/array every render, React
    // will throw "Maximum update depth exceeded" — this test catches that.
    expect(() => render(<CommitBar />)).not.toThrow();
  });

  it("shows the dirty count from editor tabs and dirty index (union)", () => {
    render(<CommitBar />);
    // listDirtyPaths returns ["notes/foo.md"], tabs has dirty "notes/foo.md"
    // union → 1 unique path
    expect(screen.getByText("1 uncommitted")).toBeInTheDocument();
  });

  it("renders a Commit button", () => {
    render(<CommitBar />);
    expect(screen.getByRole("button", { name: "Commit" })).toBeInTheDocument();
  });

  it("Commit button is enabled when count > 0", () => {
    render(<CommitBar />);
    const btn = screen.getByRole("button", { name: "Commit" });
    expect(btn).not.toBeDisabled();
  });

  it("Commit button is disabled when no dirty paths exist", () => {
    vi.mocked(listDirtyPaths).mockReturnValueOnce([]);
    useEditorStore.setState({ tabs: [], activePath: null });

    render(<CommitBar />);
    const btn = screen.getByRole("button", { name: "Commit" });
    expect(btn).toBeDisabled();
  });

  it("clicking Commit calls fetch('/api/commit') with the dirty file in the body", async () => {
    render(<CommitBar />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Commit" }));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/commit",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });

    // Verify the body contains the expected file
    const [, init] = vi.mocked(global.fetch).mock.calls[0] as [
      RequestInfo,
      RequestInit,
    ];
    const body = JSON.parse(init.body as string) as {
      files: { path: string; content: string; baseSha: string }[];
      message: string;
    };

    expect(body.files).toHaveLength(1);
    expect(body.files[0]).toMatchObject({
      path: "notes/foo.md",
      content: "# Foo",
      baseSha: "sha-foo",
    });
    expect(typeof body.message).toBe("string");
  });

  it("on 200, calls deleteDraft for the committed path", async () => {
    render(<CommitBar />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Commit" }));
    });

    await waitFor(() => {
      expect(deleteDraft).toHaveBeenCalledWith("notes/foo.md");
    });
  });

  it("on 200, dispatches sgnk:vault-changed event (no page reload)", async () => {
    render(<CommitBar />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Commit" }));
    });

    await waitFor(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "sgnk:vault-changed" }),
      );
    });
  });

  it("on 409 shows a conflict error message without deleting drafts", async () => {
    global.fetch = vi.fn(async () =>
      new Response(
        JSON.stringify({ error: "conflict", paths: ["notes/foo.md"] }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    render(<CommitBar />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Commit" }));
    });

    await waitFor(() => {
      expect(screen.getByText(/Conflict on \d+ file/i)).toBeInTheDocument();
    });

    expect(deleteDraft).not.toHaveBeenCalled();
    // No vault-changed event on conflict
    const calls = dispatchSpy.mock.calls as Array<[Event]>;
    const vaultChanged = calls.some((c) => c[0].type === "sgnk:vault-changed");
    expect(vaultChanged).toBe(false);
  });

  it("on 401 shows session-expired message", async () => {
    global.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    );

    render(<CommitBar />);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Commit" }));
    });

    await waitFor(() => {
      expect(
        screen.getByText(/Session expired — sign in again/i),
      ).toBeInTheDocument();
    });
  });
});
