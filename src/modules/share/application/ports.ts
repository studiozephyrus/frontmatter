/**
 * Application-layer ports for the share module.
 * Pure interfaces — no framework imports, no env reads.
 */

export interface ShareWriter {
  /**
   * Updates the frontmatter of a vault note at `path` so its `public_slug`
   * field equals `slug` (or removes the key when slug is null).
   * Commits via the underlying repository writer.
   */
  writeSlug(path: string, slug: string | null): Promise<{ sha: string }>;
}

export interface ShareSnapshotPort {
  /** Returns all notes that currently expose a public_slug. */
  listShares(): Promise<readonly { path: string; slug: string; title: string }[]>;
}
