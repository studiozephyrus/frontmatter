"use client";

/**
 * SnapshotProvider — single shared fetch of /api/vault/snapshot for the
 * entire pane tree.
 *
 * Design:
 * - One React context holds { loading, error, snapshot, refresh }.
 * - Provider fetches once on mount; `refresh()` re-fetches.
 * - `window` event "sgnk:vault-changed" calls refresh() so components outside
 *   the provider tree (e.g. CommitBar in the layout header) can trigger a
 *   re-fetch by dispatching that event.
 * - Context value is memoised with useMemo (keyed on state + stable refresh
 *   callback) — prevents unnecessary re-renders in all consumers.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { VaultSnapshot } from "@/modules/vault/application/dto";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SnapshotState =
  | { loading: true; error: null; snapshot: null }
  | { loading: false; error: string; snapshot: null }
  | { loading: false; error: null; snapshot: VaultSnapshot };

type SnapshotContextValue = SnapshotState & {
  refresh: () => void;
  /** Apply an immediate, local transform to the current snapshot (optimistic
   *  UI). No-op when no snapshot is loaded yet. The next refresh() reconciles
   *  with server truth, so this never diverges. */
  applyOptimistic: (transform: (snap: VaultSnapshot) => VaultSnapshot) => void;
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const SnapshotContext = createContext<SnapshotContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

// localStorage key for the persisted snapshot. Stored as JSON; the snapshot
// is metadata-only (tree + per-note title/tags/links — NO file content), so
// it stays well within quota even for large vaults.
const SNAPSHOT_CACHE_KEY = "sgnk-snapshot-cache:v1";

function readCachedSnapshot(): VaultSnapshot | null {
  try {
    const raw = localStorage.getItem(SNAPSHOT_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as VaultSnapshot;
    // Cheap shape guard — avoid handing a malformed blob to the tree.
    if (parsed && typeof parsed.sha === "string" && parsed.tree && Array.isArray(parsed.notes)) {
      return parsed;
    }
  } catch {
    /* ignore corrupt/oversize cache */
  }
  return null;
}

function writeCachedSnapshot(snapshot: VaultSnapshot): void {
  try {
    localStorage.setItem(SNAPSHOT_CACHE_KEY, JSON.stringify(snapshot));
  } catch {
    /* quota exceeded / private mode — skip, not fatal */
  }
}

export function SnapshotProvider({ children }: { children: ReactNode }) {
  // MUST start in the SSR state (loading) so the server-rendered HTML and the
  // first client render match — reading localStorage in the initializer made
  // the client render the loaded tree while the server rendered "Loading…",
  // a hydration mismatch. The cached snapshot is hydrated in the mount effect
  // below (runs immediately after commit, before the network round-trip), so
  // the tree still appears within a frame — just not during hydration itself.
  const [state, setState] = useState<SnapshotState>({
    loading: true,
    error: null,
    snapshot: null,
  });

  // Per-request monotonic token. A single shared boolean can't disambiguate
  // overlapping refreshes (a later refresh would re-arm an earlier in-flight
  // fetch), letting a slow earlier response clobber a faster later one — which
  // is exactly the scenario when several `sgnk:vault-changed` events fire after
  // a commit/import/rename. Only the LATEST request is allowed to commit.
  const reqIdRef = useRef(0);
  const mountedRef = useRef(true);

  const refresh = useCallback(() => {
    const myId = ++reqIdRef.current;
    const isStale = () => myId !== reqIdRef.current || !mountedRef.current;
    // Only blank to the spinner when we have nothing to show. If a snapshot
    // is already on screen (from cache or a prior fetch), revalidate
    // SILENTLY — the tree stays put and just updates when fresh data lands.
    setState((prev) =>
      prev.snapshot ? prev : { loading: true, error: null, snapshot: null },
    );

    void (async () => {
      try {
        const res = await fetch("/api/vault/snapshot");
        if (isStale()) return;

        if (res.status === 401) {
          // Signed out — drop any cached tree so a stale vault never shows
          // to the next (possibly different) user.
          try {
            localStorage.removeItem(SNAPSHOT_CACHE_KEY);
          } catch {
            /* ignore */
          }
          setState({ loading: false, error: "unauthorized", snapshot: null });
          return;
        }

        if (!res.ok) {
          // Keep the cached tree on a transient upstream error (502 etc.) —
          // only blank if we have nothing.
          setState((prev) =>
            prev.snapshot
              ? prev
              : {
                  loading: false,
                  error: `Failed to load snapshot (HTTP ${res.status})`,
                  snapshot: null,
                },
          );
          return;
        }

        const data = (await res.json()) as VaultSnapshot;
        if (isStale()) return;
        setState({ loading: false, error: null, snapshot: data });
        writeCachedSnapshot(data);
      } catch (err) {
        if (isStale()) return;
        // Keep a cached snapshot visible on transient network failure —
        // only surface the error state when we have nothing to fall back to.
        setState((prev) => {
          if (prev.snapshot) return prev;
          const message = err instanceof Error ? err.message : "Unknown error";
          return { loading: false, error: message, snapshot: null };
        });
      }
    })();
  }, []); // no deps — fetch URL is stable

  // Initial fetch on mount.
  useEffect(() => {
    mountedRef.current = true;
    // Paint the cached tree first (post-hydration, so no SSR mismatch) so the
    // sidebar appears within a frame instead of showing the spinner for the
    // whole snapshot round-trip. refresh() then revalidates in the background.
    const cached = readCachedSnapshot();
    if (cached) {
      setState({ loading: false, error: null, snapshot: cached });
    }
    refresh();
    return () => {
      mountedRef.current = false;
    };
  }, [refresh]);

  // Listen for external "sgnk:vault-changed" events (dispatched by CommitBar,
  // FileTree, etc.) so they can trigger a shared snapshot refresh without
  // prop-drilling or store coupling. Debounced: a multi-file commit fires the
  // event once per file — collapse the burst to a single refresh.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const handler = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        refresh();
      }, 300);
    };
    window.addEventListener("sgnk:vault-changed", handler);
    return () => {
      window.removeEventListener("sgnk:vault-changed", handler);
      if (timer) clearTimeout(timer);
    };
  }, [refresh]);

  // Optimistic local mutation — used to drop a just-created node into the tree
  // instantly, ahead of the GitHub round-trip + snapshot refresh.
  const applyOptimistic = useCallback(
    (transform: (snap: VaultSnapshot) => VaultSnapshot) => {
      setState((prev) =>
        prev.snapshot
          ? { loading: false, error: null, snapshot: transform(prev.snapshot) }
          : prev,
      );
    },
    [],
  );

  // Stable context value — only changes when state or refresh identity changes.
  // refresh / applyOptimistic are stable (useCallback, no deps), so the value
  // object only changes when the snapshot state itself changes.
  const value = useMemo<SnapshotContextValue>(
    () => ({ ...state, refresh, applyOptimistic }),
    [state, refresh, applyOptimistic],
  );

  return (
    <SnapshotContext.Provider value={value}>
      {children}
    </SnapshotContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Consumer hooks
// ---------------------------------------------------------------------------

/**
 * useSnapshot() — drop-in compatible with the old per-component useSnapshot.
 * Returns { loading, error, snapshot } from the shared provider.
 * Must be used inside <SnapshotProvider>.
 */
export function useSnapshot(): SnapshotState {
  const ctx = useContext(SnapshotContext);
  if (!ctx) {
    throw new Error("useSnapshot must be used inside <SnapshotProvider>");
  }
  // Omit `refresh` to return the plain SnapshotState discriminated union.
  // ctx.loading is always defined because all union members have it.
  if (ctx.loading) {
    return { loading: true, error: null, snapshot: null };
  }
  if (ctx.error !== null) {
    return { loading: false, error: ctx.error, snapshot: null };
  }
  return { loading: false, error: null, snapshot: ctx.snapshot! };
}

/**
 * useSnapshotRefresh() — returns the stable refresh() callback.
 * Useful for components that want to manually trigger a snapshot re-fetch.
 */
export function useSnapshotRefresh(): () => void {
  const ctx = useContext(SnapshotContext);
  if (!ctx) {
    throw new Error("useSnapshotRefresh must be used inside <SnapshotProvider>");
  }
  return ctx.refresh;
}

/**
 * useSnapshotMutate() — returns applyOptimistic for instant local tree edits
 * (e.g. show a just-created file before the snapshot refresh lands).
 */
export function useSnapshotMutate(): (transform: (snap: VaultSnapshot) => VaultSnapshot) => void {
  const ctx = useContext(SnapshotContext);
  if (!ctx) {
    throw new Error("useSnapshotMutate must be used inside <SnapshotProvider>");
  }
  return ctx.applyOptimistic;
}
