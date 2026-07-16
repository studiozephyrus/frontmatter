/**
 * Application use-case: CreateNote.
 *
 * Creates a new vault note at `path` with the given `content`.
 * Does NOT perform a baseSha conflict check (callers must verify the file
 * doesn't already exist before calling this use-case, e.g. via getBlobSha).
 *
 * Pure application logic: no framework, no infrastructure, no env access.
 */

import { validateNotePath, basenameNoExt } from "./file-ops";
import type { RepositoryWriter } from "./ports";
import type { CommitAuthor } from "@/modules/repository/domain/commit";

export type CreateNoteInput = {
  path: string;
  content: string;
};

export type CreateNoteResult = {
  commitSha: string;
  /** Blob sha of the created file — the editor adopts this as its baseSha so
   *  a subsequent edit commits without a false conflict. */
  sha: string;
};

export function makeCreateNote(deps: {
  writer: RepositoryWriter;
  author: CommitAuthor;
}): (input: CreateNoteInput) => Promise<CreateNoteResult> {
  const { writer, author } = deps;

  return async function createNote({ path, content }: CreateNoteInput): Promise<CreateNoteResult> {
    validateNotePath(path);

    const head = await writer.getHeadCommit();
    const blobSha = await writer.createBlob(content);
    const treeSha = await writer.createTree(head.treeSha, [{ path, sha: blobSha }]);
    const base = basenameNoExt(path);
    const commitSha = await writer.createCommit(
      `Create ${base}`,
      treeSha,
      head.commitSha,
      author,
    );
    await writer.updateRef(commitSha);

    return { commitSha, sha: blobSha };
  };
}
