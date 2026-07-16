"use client";

/**
 * Polls /api/share/conflicts on mount and on focus.
 * Surfaces duplicate public_slug claims to the shell so the user can
 * resolve them via DuplicateConflictModal.
 */

import { useCallback, useEffect, useState } from "react";
import type { SlugConflict } from "@/modules/share/application/list-conflicts";

export function useShareConflicts(): {
  conflicts: readonly SlugConflict[];
  refresh: () => Promise<void>;
} {
  const [conflicts, setConflicts] = useState<readonly SlugConflict[]>([]);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/share/conflicts", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { conflicts: SlugConflict[] };
      setConflicts(data.conflicts ?? []);
    } catch {
      // Silent: a network blip should not nag with a stale modal. Next focus retries.
    }
  }, []);

  useEffect(() => {
    // Defer the first conflict scan past first paint. It builds the SAME
    // vault snapshot the sidebar needs; firing both on mount makes two
    // callers contend for the (cold) snapshot build. Letting the sidebar's
    // /api/vault/snapshot win the race means this then hits the warm cache
    // instantly. Duplicate-slug detection is a background nicety, not
    // first-paint-critical — a ~1.5s delay is invisible.
    const timer = window.setTimeout(() => void refresh(), 1500);
    const onFocus = () => { void refresh(); };
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [refresh]);

  return { conflicts, refresh };
}
