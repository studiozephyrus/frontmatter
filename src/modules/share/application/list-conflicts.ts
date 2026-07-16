/**
 * Application use-case: ListConflicts.
 *
 * Returns slugs claimed by more than one note (caused by an Obsidian/git push
 * that introduced a duplicate the UI couldn't gate). The shell uses this on
 * mount to prompt the user with a rename modal.
 */

import type { ShareSnapshotPort } from "./ports";

export interface SlugConflict {
  slug: string;
  notes: readonly { path: string; title: string }[];
}

export function makeListConflicts(deps: { snapshot: ShareSnapshotPort }) {
  return async function listConflicts(): Promise<readonly SlugConflict[]> {
    const shares = await deps.snapshot.listShares();
    const grouped = new Map<string, { path: string; title: string }[]>();
    for (const s of shares) {
      const arr = grouped.get(s.slug) ?? [];
      arr.push({ path: s.path, title: s.title });
      grouped.set(s.slug, arr);
    }
    const conflicts: SlugConflict[] = [];
    for (const [slug, notes] of grouped) {
      if (notes.length > 1) conflicts.push({ slug, notes });
    }
    return conflicts.sort((a, b) => a.slug.localeCompare(b.slug));
  };
}
