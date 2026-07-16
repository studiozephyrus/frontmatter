/**
 * Infrastructure: module-level LRU snapshot cache.
 * Max 3 entries — evicts the oldest when the limit is exceeded.
 */

import type { SnapshotCache } from "@/modules/vault/application/get-snapshot";
import type { VaultSnapshot } from "@/modules/vault/application/dto";

export interface ClearableSnapshotCache extends SnapshotCache {
  clear(): void;
}

const MAX_ENTRIES = 3;

const store = new Map<string, VaultSnapshot>();

function evictOldestIfNeeded(): void {
  if (store.size >= MAX_ENTRIES) {
    const oldestKey = store.keys().next().value;
    if (oldestKey !== undefined) {
      store.delete(oldestKey);
    }
  }
}

export const snapshotCache: ClearableSnapshotCache = {
  get(sha: string): VaultSnapshot | null {
    return store.get(sha) ?? null;
  },
  set(sha: string, snapshot: VaultSnapshot): void {
    if (!store.has(sha)) {
      evictOldestIfNeeded();
    }
    store.set(sha, snapshot);
  },
  /** Clears all cached snapshots. Call after a successful commit to force re-fetch. */
  clear(): void {
    store.clear();
  },
};
