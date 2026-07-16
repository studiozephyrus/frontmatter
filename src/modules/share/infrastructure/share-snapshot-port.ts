/**
 * Infrastructure adapter: implements ShareSnapshotPort by reading the
 * existing VaultSnapshot. Notes with `publicSlug` set are surfaced.
 */

import type { ShareSnapshotPort } from "@/modules/share/application/ports";
import type { VaultSnapshot } from "@/modules/vault";

export function makeShareSnapshotPort(deps: {
  getSnapshot: () => Promise<VaultSnapshot>;
}): ShareSnapshotPort {
  return {
    async listShares() {
      const snap = await deps.getSnapshot();
      return snap.notes
        .filter((n) => typeof n.publicSlug === "string" && n.publicSlug.length > 0)
        .map((n) => ({ path: n.path, slug: n.publicSlug as string, title: n.title }));
    },
  };
}
