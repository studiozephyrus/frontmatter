/**
 * Application use-case: MergeNote.
 *
 * The non-destructive replacement for "override remote". When a draft conflicts
 * with the remote (its baseSha no longer matches), this fetches the common-
 * ancestor base (the blob at the draft's baseSha) and the current remote
 * content, runs the conservative 3-way merge, and returns the merged text plus
 * the fresh remote blob sha to adopt as the new base. Non-overlapping edits
 * combine automatically; genuine conflicts come back with git-style markers for
 * the user to resolve — nobody's work is silently dropped.
 *
 * Pure application logic over a narrow read port + the merge3 domain function.
 */

import { merge3 } from "../domain/merge3";

export type MergeNoteInput = {
  path: string;
  /** Blob sha the local edit was based on ("" = the edit created a new file). */
  baseSha: string;
  localContent: string;
};

export type MergeNoteResult = {
  clean: boolean;
  /** Merged content (carries conflict markers when clean === false). */
  text: string;
  /** Current remote blob sha — adopt as the new baseSha after merging. */
  remoteSha: string;
  conflicts: number;
};

export type MergeReader = {
  getFile(path: string): Promise<{ content: string; sha: string }>;
  getBlobContent(sha: string): Promise<string>;
};

export function makeMergeNote(deps: { reader: MergeReader }) {
  return async function mergeNote(input: MergeNoteInput): Promise<MergeNoteResult> {
    const remote = await deps.reader.getFile(input.path);
    // No baseSha → no common ancestor (the local edit created the file); treat
    // base as empty so every line is an addition.
    const base = input.baseSha ? await deps.reader.getBlobContent(input.baseSha) : "";
    const result = merge3(base, input.localContent, remote.content);
    return {
      clean: result.clean,
      text: result.text,
      remoteSha: remote.sha,
      conflicts: result.clean ? 0 : result.conflicts,
    };
  };
}
