/**
 * Infrastructure adapter: RepositoryWriter implemented over the GitHub Git Data API.
 *
 * Uses githubFetch (Bearer token set, headers set) and repoEnv for GITHUB_REPO / GITHUB_BRANCH.
 * All tokens are read lazily at request time — never at module load.
 *
 * Endpoints:
 *   getHeadCommit  → GET  /repos/{repo}/git/ref/heads/{branch}  + GET /repos/{repo}/git/commits/{sha}
 *   getBlobSha     → GET  /repos/{repo}/contents/{path}?ref={branch}
 *   createBlob     → POST /repos/{repo}/git/blobs
 *   createTree     → POST /repos/{repo}/git/trees
 *   createCommit   → POST /repos/{repo}/git/commits
 *   updateRef      → PATCH /repos/{repo}/git/refs/heads/{branch}
 */

import { repoEnv } from "@/config/env";
import { githubFetch } from "@/shared/infrastructure/github/client";
import type { RepositoryWriter, TreeItem } from "@/modules/repository/application/ports";
import { ConflictError, type CommitAuthor } from "@/modules/repository/domain/commit";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Like githubFetch but returns null on 404 instead of throwing.
 * For all other non-2xx responses it throws.
 */
async function githubFetchNullOn404(path: string, init?: RequestInit): Promise<Response | null> {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${repoEnv.GITHUB_REPO_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status} ${res.statusText} — ${path}`);
  }
  return res;
}

// ---------------------------------------------------------------------------
// Adapter
// ---------------------------------------------------------------------------

export const githubWriter: RepositoryWriter = {
  /**
   * Returns the HEAD commit SHA and its tree SHA for the configured branch.
   */
  async getHeadCommit(): Promise<{ commitSha: string; treeSha: string }> {
    const repo = repoEnv.GITHUB_REPO;
    const branch = repoEnv.GITHUB_BRANCH;

    // Step 1: resolve the ref to a commit sha
    const refRes = await githubFetch(`/repos/${repo}/git/ref/heads/${branch}`);
    const refData = (await refRes.json()) as { object: { sha: string } };
    const commitSha = refData.object.sha;

    // Step 2: get the commit to find its tree sha
    const commitRes = await githubFetch(`/repos/${repo}/git/commits/${commitSha}`);
    const commitData = (await commitRes.json()) as { tree: { sha: string } };

    return { commitSha, treeSha: commitData.tree.sha };
  },

  /**
   * Returns the current blob SHA for a path in the repo, or null if not found.
   * Encodes each path segment individually (preserving "/" separators).
   */
  async getBlobSha(path: string): Promise<string | null> {
    const repo = repoEnv.GITHUB_REPO;
    const branch = repoEnv.GITHUB_BRANCH;
    const encodedPath = path.split("/").map(encodeURIComponent).join("/");
    const apiPath = `/repos/${repo}/contents/${encodedPath}?ref=${branch}`;

    const res = await githubFetchNullOn404(apiPath);
    if (res === null) return null;

    const data = (await res.json()) as { sha: string };
    return data.sha;
  },

  /**
   * Creates a blob in the repo and returns its SHA.
   */
  async createBlob(content: string): Promise<string> {
    const repo = repoEnv.GITHUB_REPO;
    const res = await githubFetch(`/repos/${repo}/git/blobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, encoding: "utf-8" }),
    });
    const data = (await res.json()) as { sha: string };
    return data.sha;
  },

  /**
   * Creates a binary blob from raw base64 data and returns its SHA.
   */
  async createBinaryBlob(base64: string): Promise<string> {
    const repo = repoEnv.GITHUB_REPO;
    const res = await githubFetch(`/repos/${repo}/git/blobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: base64, encoding: "base64" }),
    });
    const data = (await res.json()) as { sha: string };
    return data.sha;
  },

  /**
   * Creates a new tree from a base tree plus the provided items.
   * Items with sha=null are treated as deletions (GitHub sets sha:null to remove path from tree).
   */
  async createTree(baseTreeSha: string, items: TreeItem[]): Promise<string> {
    const repo = repoEnv.GITHUB_REPO;

    const tree = items.map((item) =>
      item.sha !== null
        ? { path: item.path, mode: "100644" as const, type: "blob" as const, sha: item.sha }
        : { path: item.path, mode: "100644" as const, type: "blob" as const, sha: null },
    );

    const res = await githubFetch(`/repos/${repo}/git/trees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base_tree: baseTreeSha, tree }),
    });
    const data = (await res.json()) as { sha: string };
    return data.sha;
  },

  /**
   * Creates a commit object and returns its SHA.
   * Both author and committer are set to the provided CommitAuthor with the current timestamp.
   */
  async createCommit(
    message: string,
    treeSha: string,
    parentSha: string,
    author: CommitAuthor,
  ): Promise<string> {
    const repo = repoEnv.GITHUB_REPO;
    const date = new Date().toISOString();

    const res = await githubFetch(`/repos/${repo}/git/commits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        tree: treeSha,
        parents: [parentSha],
        author: { name: author.name, email: author.email, date },
        committer: { name: author.name, email: author.email, date },
      }),
    });
    const data = (await res.json()) as { sha: string };
    return data.sha;
  },

  /**
   * Fast-forwards the branch ref to the new commit SHA.
   */
  async updateRef(commitSha: string): Promise<void> {
    const repo = repoEnv.GITHUB_REPO;
    const branch = repoEnv.GITHUB_BRANCH;

    try {
      await githubFetch(`/repos/${repo}/git/refs/heads/${branch}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sha: commitSha, force: false }),
      });
    } catch (err) {
      // 422 = non-fast-forward (HEAD advanced between our read and this update,
      // e.g. concurrent commit from another device). Surface as a conflict so
      // the client re-syncs (409) instead of an opaque 502.
      if (err instanceof Error && /\b422\b/.test(err.message)) {
        throw new ConflictError([`${branch} (remote advanced — please retry)`]);
      }
      throw err;
    }
  },
};
