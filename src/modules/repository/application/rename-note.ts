/**
 * Application use-case: RenameNote.
 *
 * Renames a vault note from `oldPath` to `newPath` and rewrites inbound
 * wikilinks (oldBase → newBase) in the notes that reference it.
 *
 * The set of referencing notes is supplied by the caller (`referencingPaths`),
 * sourced from the server snapshot's backlink index — so we fetch and rewrite
 * ONLY those notes instead of downloading the entire repository zipball. For a
 * note with no inbound links this is a pure rename (read one blob, write the
 * new path, delete the old): a handful of API calls instead of a full-vault
 * download that froze the UI for 10–30s.
 *
 * Pure application logic: the only I/O is via the narrow ports
 * (`reader.getFile`, `RepositoryWriter`). No framework, infrastructure, or env.
 */

import { validateNotePath, basenameNoExt, rewriteWikilinks } from "./file-ops";
import { NoteExistsError } from "./file-ops";
import type { RepositoryWriter, TreeItem } from "./ports";
import type { CommitAuthor } from "@/modules/repository/domain/commit";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RenameNoteInput = {
  oldPath: string;
  newPath: string;
  /**
   * Vault note paths that link to `oldPath` (from the snapshot backlink index).
   * Only these are fetched and relinked. Defaults to none — a pure rename.
   */
  referencingPaths?: readonly string[];
};

export type RenameNoteResult = {
  commitSha: string;
  relinkedCount: number;
};

/** Narrow read port — fetch a single note's content by path. */
export type NoteContentReader = {
  getFile(path: string): Promise<{ content: string; sha: string }>;
};

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function makeRenameNote(deps: {
  reader: NoteContentReader;
  writer: RepositoryWriter;
  author: CommitAuthor;
}): (input: RenameNoteInput) => Promise<RenameNoteResult> {
  const { reader, writer, author } = deps;

  return async function renameNote({
    oldPath,
    newPath,
    referencingPaths = [],
  }: RenameNoteInput): Promise<RenameNoteResult> {
    validateNotePath(oldPath);
    validateNotePath(newPath);

    const head = await writer.getHeadCommit();

    // newPath must not already exist.
    const existingSha = await writer.getBlobSha(newPath);
    if (existingSha !== null) {
      throw new NoteExistsError(newPath);
    }

    const oldBase = basenameNoExt(oldPath);
    const newBase = basenameNoExt(newPath);

    const treeItems: TreeItem[] = [];

    // 1. The renamed note itself — read it, rewrite any self-links, write it at
    //    newPath, and delete oldPath.
    const original = await reader.getFile(oldPath);
    const { content: renamedContent } = rewriteWikilinks(original.content, oldBase, newBase);
    const renamedBlob = await writer.createBlob(renamedContent);
    treeItems.push({ path: newPath, sha: renamedBlob });
    treeItems.push({ path: oldPath, sha: null });

    // 2. Referencing notes — fetch ONLY these and rewrite their inbound links.
    //    Dedupe; oldPath/newPath are handled above.
    const seen = new Set<string>([oldPath, newPath]);
    let relinkedCount = 0;
    for (const refPath of referencingPaths) {
      if (seen.has(refPath)) continue;
      seen.add(refPath);
      let file: { content: string; sha: string };
      try {
        file = await reader.getFile(refPath);
      } catch {
        // Stale backlink (note moved/deleted since the snapshot) — skip it
        // rather than failing the whole rename.
        continue;
      }
      const { content: rewritten, changed } = rewriteWikilinks(file.content, oldBase, newBase);
      if (changed) {
        const blobSha = await writer.createBlob(rewritten);
        treeItems.push({ path: refPath, sha: blobSha });
        relinkedCount++;
      }
    }

    // 3. Commit atomically.
    const treeSha = await writer.createTree(head.treeSha, treeItems);
    const commitSha = await writer.createCommit(
      `Rename ${oldBase} → ${newBase}`,
      treeSha,
      head.commitSha,
      author,
    );
    await writer.updateRef(commitSha);

    return { commitSha, relinkedCount };
  };
}
