// @vitest-environment jsdom
/**
 * use-share-conflicts.test.tsx — hook tests.
 *
 * The first scan is DEFERRED ~1.5s past mount (so it doesn't contend with
 * the sidebar's snapshot build). Tests use fake timers to advance past that
 * delay deterministically.
 *
 * Covers:
 *  - deferred fetch on mount (after the timer)
 *  - swallows non-200 (no exception)
 *  - swallows network errors (no exception)
 *  - refetches on window focus (immediate, no delay)
 *  - manual refresh() works
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useShareConflicts } from "@/modules/share/presentation/use-share-conflicts";

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

function ok(payload: unknown): Response {
  return new Response(JSON.stringify(payload), { status: 200, headers: { "content-type": "application/json" } });
}

describe("useShareConflicts", () => {
  it("fetches /api/share/conflicts after the mount delay and exposes them", async () => {
    vi.useFakeTimers();
    fetchMock.mockResolvedValueOnce(ok({ conflicts: [{ slug: "x", notes: [{ path: "A.md", title: "A" }, { path: "B.md", title: "B" }] }] }));
    const { result } = renderHook(() => useShareConflicts());
    // Not fired yet — deferred.
    expect(fetchMock).not.toHaveBeenCalled();
    await act(async () => {
      vi.advanceTimersByTime(1600);
    });
    vi.useRealTimers();
    await waitFor(() => expect(result.current.conflicts.length).toBe(1));
    expect(result.current.conflicts[0]?.slug).toBe("x");
    expect(fetchMock).toHaveBeenCalledWith("/api/share/conflicts", expect.objectContaining({ cache: "no-store" }));
  });

  it("stays at [] when the endpoint returns non-200", async () => {
    vi.useFakeTimers();
    fetchMock.mockResolvedValueOnce(new Response("", { status: 500 }));
    const { result } = renderHook(() => useShareConflicts());
    await act(async () => { vi.advanceTimersByTime(1600); });
    vi.useRealTimers();
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(result.current.conflicts).toEqual([]);
  });

  it("does not throw on network error", async () => {
    vi.useFakeTimers();
    fetchMock.mockRejectedValueOnce(new Error("offline"));
    const { result } = renderHook(() => useShareConflicts());
    await act(async () => { vi.advanceTimersByTime(1600); });
    vi.useRealTimers();
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(result.current.conflicts).toEqual([]);
  });

  it("refetches immediately on window focus (no delay)", async () => {
    fetchMock.mockResolvedValue(ok({ conflicts: [] }));
    renderHook(() => useShareConflicts());
    // Focus handler calls refresh directly — fires without waiting for the
    // mount timer.
    act(() => { window.dispatchEvent(new Event("focus")); });
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
  });

  it("manual refresh() triggers a fetch", async () => {
    fetchMock.mockResolvedValue(ok({ conflicts: [] }));
    const { result } = renderHook(() => useShareConflicts());
    await act(async () => { await result.current.refresh(); });
    expect(fetchMock).toHaveBeenCalled();
  });
});
