/**
 * Application ports for the repository commit workflow.
 *
 * Pure application layer: no framework, no infrastructure, no env access.
 * Infrastructure adapters implement RepositoryWriter.
 */

import type { CommitAuthor } from "@/modules/repository/domain/commit";

export type TreeItem = {
  path: string;
  /** sha of the blob to write; null means delete this path from the tree */
  sha: string | null;
};

export interface RepositoryWriter {
  getHeadCommit(): Promise<{ commitSha: string; treeSha: string }>;
  getBlobSha(path: string): Promise<string | null>;
  createBlob(content: string): Promise<string>;
  /** Creates a binary blob from raw base64 data and returns its SHA. */
  createBinaryBlob(base64: string): Promise<string>;
  createTree(baseTreeSha: string, items: TreeItem[]): Promise<string>;
  createCommit(
    message: string,
    treeSha: string,
    parentSha: string,
    author: CommitAuthor,
  ): Promise<string>;
  updateRef(commitSha: string): Promise<void>;
}
