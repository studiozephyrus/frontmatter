/**
 * Application use-case: SetShare.
 *
 * Assigns a public slug to a note (or rejects with conflict). Server-side
 * gate: validates slug format AND uniqueness against the current snapshot.
 * Pure: takes ports + a fresh snapshot reader.
 */

import { validateSlug, SlugConflictError } from "@/modules/share/domain/slug";
import type { ShareWriter, ShareSnapshotPort } from "./ports";

export interface SetShareInput {
  /** Vault-relative note path, e.g. "Projects/HQ/HQ.md" */
  path: string;
  /** Desired public slug (raw user input — validated here). */
  slug: string;
}

export interface SetShareResult {
  path: string;
  slug: string;
  publicUrl: string;
  sha: string;
}

export function makeSetShare(deps: {
  writer: ShareWriter;
  snapshot: ShareSnapshotPort;
  publicBaseUrl: string;
}): (input: SetShareInput) => Promise<SetShareResult> {
  return async function setShare({ path, slug: rawSlug }) {
    const slug = validateSlug(rawSlug);
    const existing = await deps.snapshot.listShares();
    const collision = existing.find((s) => s.slug === slug && s.path !== path);
    if (collision) throw new SlugConflictError(slug, collision.path);

    const { sha } = await deps.writer.writeSlug(path, slug);
    return {
      path,
      slug,
      publicUrl: `${deps.publicBaseUrl.replace(/\/$/, "")}/${slug}`,
      sha,
    };
  };
}
