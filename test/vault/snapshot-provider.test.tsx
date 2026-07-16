// @vitest-environment jsdom
/**
 * snapshot-provider.test.tsx
 *
 * Verifies:
 * 1. Two child consumers share ONE fetch (fetch called exactly once).
 * 2. Dispatching "sgnk:vault-changed" triggers a re-fetch.
 * 3. No render loop — both consumers receive stable references.
 * 4. useSnapshot throws when used outside the provider.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {
  SnapshotProvider,
  useSnapshot,
  useSnapshotRefresh,
} from "@/modules/vault/presentation/SnapshotProvider";
import type { VaultSnapshot } from "@/modules/vault/application/dto";

// ---------------------------------------------------------------------------
// Minimal snapshot fixture
// ---------------------------------------------------------------------------

function makeSnapshot(): VaultSnapshot {
  return {
    sha: "abc123",
    generatedAt: "2026-01-01T00:00:00.000Z",
    tree: { name: "root", path: "", type: "folder", children: [] },
    notes: [],
  };
}

// ---------------------------------------------------------------------------
// Consumer components for testing
// ---------------------------------------------------------------------------

function LoadingConsumer({ id }: { id: string }) {
  const { loading } = useSnapshot();
  return <div data-testid={`loading-${id}`}>{loading ? "loading" : "done"}</div>;
}

function SnapshotConsumer({ id }: { id: string }) {
  const { snapshot } = useSnapshot();
  return (
    <div data-testid={`snapshot-${id}`}>
      {snapshot ? snapshot.sha : "null"}
    </div>
  );
}

function RefreshConsumer() {
  const refresh = useSnapshotRefresh();
  return (
    <button onClick={refresh} data-testid="refresh-btn">
      Refresh
    </button>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("SnapshotProvider", () => {
  beforeEach(() => {
    // Clear the persisted-snapshot cache between tests — otherwise a prior
    // test's successful fetch leaves a cached tree in localStorage and the
    // provider hydrates from it (skipping the initial "loading" state).
    try {
      localStorage.clear();
    } catch {
      /* jsdom always has localStorage; guard anyway */
    }
    global.fetch = vi.fn(async () =>
      new Response(JSON.stringify(makeSnapshot()), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("two consumers share a SINGLE fetch call", async () => {
    render(
      <SnapshotProvider>
        <LoadingConsumer id="a" />
        <SnapshotConsumer id="a" />
        <LoadingConsumer id="b" />
        <SnapshotConsumer id="b" />
      </SnapshotProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading-a")).toHaveTextContent("done");
    });

    // Both consumers should show the same snapshot sha
    expect(screen.getByTestId("snapshot-a")).toHaveTextContent("abc123");
    expect(screen.getByTestId("snapshot-b")).toHaveTextContent("abc123");

    // Crucially: only one fetch was made despite two consumers
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith("/api/vault/snapshot");
  });

  it("dispatching sgnk:vault-changed triggers a re-fetch", async () => {
    render(
      <SnapshotProvider>
        <SnapshotConsumer id="c" />
      </SnapshotProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("snapshot-c")).toHaveTextContent("abc123");
    });

    const fetchCallsBefore = vi.mocked(global.fetch).mock.calls.length;

    // Dispatch the vault-changed event
    await act(async () => {
      window.dispatchEvent(new CustomEvent("sgnk:vault-changed"));
    });

    await waitFor(() => {
      expect(vi.mocked(global.fetch).mock.calls.length).toBeGreaterThan(
        fetchCallsBefore,
      );
    });
  });

  it("shows loading state initially then snapshot after fetch", async () => {
    render(
      <SnapshotProvider>
        <LoadingConsumer id="d" />
      </SnapshotProvider>,
    );

    // Initially loading
    expect(screen.getByTestId("loading-d")).toHaveTextContent("loading");

    // Then done
    await waitFor(() => {
      expect(screen.getByTestId("loading-d")).toHaveTextContent("done");
    });
  });

  it("handles 401 by setting error=unauthorized", async () => {
    global.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    );

    function ErrorConsumer() {
      const { error } = useSnapshot();
      return <div data-testid="error">{error ?? "none"}</div>;
    }

    render(
      <SnapshotProvider>
        <ErrorConsumer />
      </SnapshotProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("error")).toHaveTextContent("unauthorized");
    });
  });

  it("refresh() from useSnapshotRefresh triggers a re-fetch", async () => {
    render(
      <SnapshotProvider>
        <SnapshotConsumer id="e" />
        <RefreshConsumer />
      </SnapshotProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("snapshot-e")).toHaveTextContent("abc123");
    });

    const fetchCallsBefore = vi.mocked(global.fetch).mock.calls.length;

    await act(async () => {
      screen.getByTestId("refresh-btn").click();
    });

    await waitFor(() => {
      expect(vi.mocked(global.fetch).mock.calls.length).toBeGreaterThan(
        fetchCallsBefore,
      );
    });
  });

  it("does not enter a render loop (stable context value)", async () => {
    const renderCount = { count: 0 };

    function CountingConsumer() {
      renderCount.count += 1;
      const { snapshot } = useSnapshot();
      return <div>{snapshot ? "ok" : "wait"}</div>;
    }

    render(
      <SnapshotProvider>
        <CountingConsumer />
      </SnapshotProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("ok")).toBeInTheDocument();
    });

    const countAfterLoad = renderCount.count;

    // Wait a tick — if there's a loop, count keeps rising
    await new Promise((r) => setTimeout(r, 50));

    // At most 2 renders: initial (loading) + after fetch settles
    // Allow a small buffer for React StrictMode double-invoke
    expect(renderCount.count).toBeLessThanOrEqual(countAfterLoad + 1);
  });

  it("hydrates instantly from a cached snapshot (no loading flash)", async () => {
    // Seed the persisted cache, then mount — the tree should be available
    // on the very first render without waiting for fetch.
    const cached = makeSnapshot();
    localStorage.setItem("sgnk-snapshot-cache:v1", JSON.stringify(cached));

    render(
      <SnapshotProvider>
        <LoadingConsumer id="cache" />
      </SnapshotProvider>,
    );
    // No "loading" — straight to done from cache.
    expect(screen.getByTestId("loading-cache")).toHaveTextContent("done");
  });

  it("persists the snapshot to localStorage after a successful fetch", async () => {
    render(
      <SnapshotProvider>
        <SnapshotConsumer id="persist" />
      </SnapshotProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("snapshot-persist")).toHaveTextContent("abc123");
    });
    const stored = localStorage.getItem("sgnk-snapshot-cache:v1");
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!).sha).toBe("abc123");
  });

  it("clears the cache on 401 (signed out)", async () => {
    localStorage.setItem("sgnk-snapshot-cache:v1", JSON.stringify(makeSnapshot()));
    global.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    );
    function ErrorConsumer() {
      const { error } = useSnapshot();
      return <div data-testid="err401">{error ?? "none"}</div>;
    }
    render(
      <SnapshotProvider>
        <ErrorConsumer />
      </SnapshotProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("err401")).toHaveTextContent("unauthorized");
    });
    expect(localStorage.getItem("sgnk-snapshot-cache:v1")).toBeNull();
  });

  it("useSnapshot throws when used outside SnapshotProvider", () => {
    function Orphan() {
      useSnapshot();
      return null;
    }

    // Suppress React error boundary noise in test output
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Orphan />)).toThrow(
      "useSnapshot must be used inside <SnapshotProvider>",
    );

    consoleError.mockRestore();
  });
});
