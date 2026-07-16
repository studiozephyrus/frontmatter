/**
 * Application use-case: RemoveShare.
 * Removes the public_slug from a note's frontmatter (unpublish).
 */

import type { ShareWriter } from "./ports";

export function makeRemoveShare(deps: { writer: ShareWriter }) {
  return async function removeShare(path: string): Promise<{ path: string; sha: string }> {
    const { sha } = await deps.writer.writeSlug(path, null);
    return { path, sha };
  };
}
