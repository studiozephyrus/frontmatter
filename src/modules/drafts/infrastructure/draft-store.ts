/**
 * Infrastructure: client-side draft store.
 * Persists draft content in IndexedDB (via idb-keyval) and tracks dirty
 * paths in localStorage for fast synchronous lookups.
 *
 * SSR-safe: localStorage functions return empty/no-op on the server.
 * IDB functions are async and should only be called client-side.
 */

import { createStore, del, get, keys, set } from "idb-keyval";

export type Draft = { content: string; baseSha: string; updatedAt: number };

const DIRTY_KEY = "sgnk-md:dirty";

// Dedicated IDB store so we don't pollute the default keyval store.
const idbStore =
  typeof window !== "undefined"
    ? createStore("sgnk-md", "drafts")
    : undefined;

function idbKey(path: string): string {
  return `draft:${path}`;
}

// ---------------------------------------------------------------------------
// localStorage dirty index helpers (sync, SSR-guarded)
// ---------------------------------------------------------------------------

// In-memory mirror of the parsed dirty index so keystroke-hot helpers
// (addToDirtyIndex / hasDraft / listDirtyPaths) skip the JSON.parse on every
// call. The cache is keyed on the raw localStorage string: a cheap getItem +
// string compare lets us detect external mutations (other tabs, dev tools,
// localStorage.clear() in tests) and rebuild — but we still skip the
// expensive JSON.parse when nothing changed.
let dirtyCache: { raw: string | null; arr: string[]; set: Set<string> } | null = null;

function buildCache(raw: string | null, arr: string[]): { raw: string | null; arr: string[]; set: Set<string> } {
  // Make a shallow copy so external mutation of the returned array (via
  // listDirtyPaths) can't poison the cache.
  const snapshot = arr.slice();
  return { raw, arr: snapshot, set: new Set(snapshot) };
}

function readDirtyIndex(): string[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(DIRTY_KEY);
  if (dirtyCache && dirtyCache.raw === raw) return dirtyCache.arr;
  if (raw === null) {
    dirtyCache = buildCache(null, []);
    return dirtyCache.arr;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const paths = (parsed as unknown[]).filter((x): x is string => typeof x === "string");
      dirtyCache = buildCache(raw, paths);
      return dirtyCache.arr;
    }
    dirtyCache = buildCache(raw, []);
    return dirtyCache.arr;
  } catch {
    // Corrupt JSON — silently returning [] would orphan every unsaved draft
    // because callers think there's nothing dirty. Wipe the bad value here so
    // the next saveDraft call rewrites it from scratch, and schedule a
    // background IDB scan to rebuild the index from real drafts.
    try {
      localStorage.removeItem(DIRTY_KEY);
    } catch {
      /* private mode etc. — non-fatal */
    }
    dirtyCache = buildCache(null, []);
    void rebuildDirtyIndexFromIDB();
    return dirtyCache.arr;
  }
}

/** Recovery path: scan the IDB drafts store and rebuild the dirty index from
 *  whichever draft entries still exist. Called when the localStorage index is
 *  corrupt or wiped — without this, all unsaved drafts become orphaned. */
async function rebuildDirtyIndexFromIDB(): Promise<void> {
  if (typeof window === "undefined" || idbStore === undefined) return;
  try {
    const ks = await keys(idbStore);
    const paths: string[] = [];
    for (const k of ks) {
      if (typeof k !== "string") continue;
      if (k.startsWith("draft:")) paths.push(k.slice("draft:".length));
    }
    if (paths.length > 0) writeDirtyIndex(paths);
  } catch {
    /* IDB unavailable — leave the index empty; user re-saves repopulate it */
  }
}

function writeDirtyIndex(paths: string[]): void {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(paths);
  localStorage.setItem(DIRTY_KEY, raw);
  dirtyCache = buildCache(raw, paths);
}

function addToDirtyIndex(path: string): void {
  // O(1) membership check via the cached Set instead of Array.includes —
  // matters on the autosave hot path (every keystroke through debounce).
  readDirtyIndex();
  if (dirtyCache && dirtyCache.set.has(path)) return;
  const next = dirtyCache ? dirtyCache.arr.concat(path) : [path];
  writeDirtyIndex(next);
}

function removeFromDirtyIndex(path: string): void {
  readDirtyIndex();
  if (!dirtyCache || !dirtyCache.set.has(path)) return;
  writeDirtyIndex(dirtyCache.arr.filter((p) => p !== path));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Persist a draft to IndexedDB and mark the path as dirty in localStorage.
 */
export async function saveDraft(
  path: string,
  data: { content: string; baseSha: string },
): Promise<void> {
  const draft: Draft = { ...data, updatedAt: Date.now() };
  // idbStore is guaranteed defined when called client-side (window exists).
  await set(idbKey(path), draft, idbStore!);
  addToDirtyIndex(path);
}

/**
 * Retrieve a draft from IndexedDB. Returns undefined if not found.
 */
export async function getDraft(path: string): Promise<Draft | undefined> {
  return get<Draft>(idbKey(path), idbStore!);
}

/**
 * Delete a draft from IndexedDB and remove the path from the dirty index.
 */
export async function deleteDraft(path: string): Promise<void> {
  await del(idbKey(path), idbStore!);
  removeFromDirtyIndex(path);
}

/**
 * Synchronously check whether a draft exists (reads from localStorage index).
 */
export function hasDraft(path: string): boolean {
  readDirtyIndex();
  return dirtyCache?.set.has(path) ?? false;
}

/**
 * Synchronously return all paths that have unsaved drafts.
 */
export function listDirtyPaths(): string[] {
  return readDirtyIndex();
}
