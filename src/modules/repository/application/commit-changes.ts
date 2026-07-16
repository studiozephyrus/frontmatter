/**
 * Application use-case: CommitChanges.
 *
 * Atomically commits file changes and deletions to a Git repository via
 * the RepositoryWriter port. Performs conflict detection before any writes:
 * if any file or deletion has a baseSha that doesn't match the current remote
 * sha, the entire commit is aborted with a ConflictError listing all paths.
 *
 * Pure application logic: no framework imports, no infrastructure imports,
 * no env access. All side-effecting dependencies are injected via ports.
 */

import type { CommitAuthor, CommitRequest, CommitResult } from "@/modules/repository/domain/commit";
import { ConflictError } from "@/modules/repository/domain/commit";
import type { RepositoryWriter, TreeItem } from "./ports";

// Repo infrastructure that the editor must NEVER write to via a session —
// blocks `.github/workflows/*` (CI RCE), app source, and build config from
// being clobbered by any path that reaches a commit (defense-in-depth; the
// sole authorized actor can still edit these via git directly).
const BLOCKED_WRITE_PREFIXES = ["src/", "docs/", "specs/", "public/", ".github/", ".claude/", ".vercel/", "node_modules/"];
const BLOCKED_WRITE_FILES = new Set([
  "package.json", "package-lock.json", "vercel.json", "vercel.ts", "next.config.ts",
  "tsconfig.json", "eslint.config.mjs", "postcss.config.mjs", ".gitignore",
]);

function assertVaultWritable(path: string): void {
  if (path.includes("..")) throw new Error(`refusing path traversal: ${path}`);
  if (BLOCKED_WRITE_PREFIXES.some((p) => path.startsWith(p)) || BLOCKED_WRITE_FILES.has(path)) {
    throw new Error(`refusing to write outside the vault: ${path}`);
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function makeCommitChanges(deps: {
  writer: RepositoryWriter;
  author: CommitAuthor;
}): (req: CommitRequest) => Promise<CommitResult> {
  const { writer, author } = deps;

  return async function commitChanges(req: CommitRequest): Promise<CommitResult> {
    // Reject any out-of-vault / config / CI path before touching the repo.
    for (const file of req.files) assertVaultWritable(file.path);
    for (const deletion of req.deletions ?? []) assertVaultWritable(deletion.path);

    const head = await writer.getHeadCommit();

    // ------------------------------------------------------------------
    // Conflict check — gather all paths first, before any writes
    // ------------------------------------------------------------------
    const conflictingPaths: string[] = [];

    for (const file of req.files) {
      const current = await writer.getBlobSha(file.path);
      // baseSha === "" is the "create-new" sentinel used by rename/move flows.
      // Treat it as: path must currently NOT exist (otherwise we'd silently
      // clobber). For normal updates, baseSha must equal the current blob sha.
      if (file.baseSha === "") {
        if (current !== null) conflictingPaths.push(file.path);
      } else if (current !== file.baseSha) {
        conflictingPaths.push(file.path);
      }
    }

    for (const deletion of req.deletions ?? []) {
      const current = await writer.getBlobSha(deletion.path);
      if (current !== deletion.baseSha) {
        conflictingPaths.push(deletion.path);
      }
    }

    if (conflictingPaths.length > 0) {
      throw new ConflictError(conflictingPaths);
    }

    // ------------------------------------------------------------------
    // Build tree items — create blobs for file writes
    // ------------------------------------------------------------------
    const treeItems: TreeItem[] = [];

    for (const file of req.files) {
      const blobSha = await writer.createBlob(file.content);
      treeItems.push({ path: file.path, sha: blobSha });
    }

    for (const deletion of req.deletions ?? []) {
      treeItems.push({ path: deletion.path, sha: null });
    }

    // ------------------------------------------------------------------
    // Commit
    // ------------------------------------------------------------------
    const treeSha = await writer.createTree(head.treeSha, treeItems);
    const commitSha = await writer.createCommit(req.message, treeSha, head.commitSha, author);
    await writer.updateRef(commitSha);

    return { commitSha };
  };
}
