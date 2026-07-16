import { repoEnv } from "@/config/env";
import { FileNotFoundError } from "@/shared/domain/errors";

const GITHUB_API = "https://api.github.com";

const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 3;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Thin fetch wrapper for the GitHub REST API.
 * Reads the token at request time — never at module load.
 *
 * Retries transient failures (network error or a 429/5xx) up to MAX_ATTEMPTS
 * with exponential backoff. GitHub intermittently 502s under load and the
 * zipball endpoint occasionally rate-limits; a single blip should NOT surface
 * as "Couldn't load your vault" when an immediate retry succeeds. 404s and
 * other 4xx are NOT retried (they're deterministic).
 */
export async function githubFetch(path: string, init?: RequestInit): Promise<Response> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(`${GITHUB_API}${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${repoEnv.GITHUB_REPO_TOKEN}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          ...(init?.headers ?? {}),
        },
      });
      if (res.ok) return res;

      if (res.status === 404) {
        throw new FileNotFoundError(path);
      }
      if (RETRYABLE_STATUS.has(res.status) && attempt < MAX_ATTEMPTS) {
        console.error(`[github] ${res.status} ${res.statusText} — ${path} (attempt ${attempt}/${MAX_ATTEMPTS}, retrying)`);
        await sleep(250 * 2 ** (attempt - 1)); // 250ms, 500ms
        continue;
      }
      // Non-retryable, or out of attempts. Log full detail server-side only;
      // throw a generic message so route bodies never leak the repo layout.
      console.error(`[github] ${res.status} ${res.statusText} — ${path}`);
      throw new Error(`GitHub API error ${res.status}`);
    } catch (err) {
      // FileNotFoundError + the generic API error above are deterministic —
      // don't retry them. Anything else (network/DNS/abort) is transient.
      if (err instanceof FileNotFoundError) throw err;
      if (err instanceof Error && err.message.startsWith("GitHub API error")) throw err;
      lastErr = err;
      if (attempt < MAX_ATTEMPTS) {
        console.error(`[github] network error — ${path} (attempt ${attempt}/${MAX_ATTEMPTS}, retrying)`);
        await sleep(250 * 2 ** (attempt - 1));
        continue;
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("GitHub request failed");
}

/** Returns the HEAD commit SHA for the configured repo+branch. */
export async function getHeadSha(): Promise<string> {
  const res = await githubFetch(
    `/repos/${repoEnv.GITHUB_REPO}/commits/${repoEnv.GITHUB_BRANCH}`,
  );
  const data = (await res.json()) as { sha: string };
  return data.sha;
}

/** Downloads the zipball for the configured repo+branch as an ArrayBuffer. */
export async function getZipball(): Promise<ArrayBuffer> {
  const res = await githubFetch(
    `/repos/${repoEnv.GITHUB_REPO}/zipball/${repoEnv.GITHUB_BRANCH}`,
  );
  return res.arrayBuffer();
}

/**
 * Fetches the raw content and blob SHA of a single file in the vault.
 * Encodes each path segment individually (preserving `/` separators).
 * Throws FileNotFoundError on 404; throws Error on other non-2xx responses.
 */
export async function getFile(path: string): Promise<{ content: string; sha: string }> {
  // Encode each segment individually, keep "/" separators
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const apiPath = `/repos/${repoEnv.GITHUB_REPO}/contents/${encodedPath}?ref=${repoEnv.GITHUB_BRANCH}`;

  const res = await githubFetch(apiPath);
  const data = (await res.json()) as { content: string; sha: string; encoding: string };

  // GitHub returns base64-encoded content with embedded newlines — strip them before decoding
  const rawBase64 = data.content.replace(/\n/g, "");
  const content = Buffer.from(rawBase64, "base64").toString("utf-8");

  return { content, sha: data.sha };
}

// ---------------------------------------------------------------------------
// History / point-in-time reads
// ---------------------------------------------------------------------------

/**
 * Domain shape returned by listHistory. Strictly what the UI needs —
 * commit-history viewer, version compare. Matches the previous inline
 * route response so consumers don't change.
 */
export interface HistoryEntry {
  sha: string;
  message: string;
  author: string;
  date: string | null;
}

/**
 * Lists the last `limit` commits that touched `path` on the configured
 * branch. Up to 100 (GitHub max per page). Used by the history viewer.
 */
export async function listHistory(path: string, limit = 50): Promise<HistoryEntry[]> {
  const enc = encodeURIComponent(path);
  const res = await githubFetch(
    `/repos/${repoEnv.GITHUB_REPO}/commits?path=${enc}&sha=${repoEnv.GITHUB_BRANCH}&per_page=${Math.min(100, limit)}`,
  );
  const data = (await res.json()) as Array<{
    sha: string;
    commit: { message: string; author: { name?: string; date?: string } | null };
  }>;
  return data.map((c) => ({
    sha: c.sha,
    message: c.commit.message,
    author: c.commit.author?.name ?? "unknown",
    date: c.commit.author?.date ?? null,
  }));
}

/**
 * Reads the content of a file at a specific commit (ref-pinned).
 * Used by the version-history viewer to render a past revision.
 *
 * Returns `null` when the path at that revision is not a single readable
 * file (it's a directory, a submodule, or a >1 MB blob — GitHub omits
 * `content` in those cases).
 */
export async function getFileAtSha(path: string, sha: string): Promise<string | null> {
  const encPath = path.split("/").map(encodeURIComponent).join("/");
  const res = await githubFetch(
    `/repos/${repoEnv.GITHUB_REPO}/contents/${encPath}?ref=${encodeURIComponent(sha)}`,
  );
  const data = (await res.json()) as { content?: string; type?: string } | unknown[];
  if (Array.isArray(data) || typeof (data as { content?: string }).content !== "string") {
    return null;
  }
  const rawBase64 = (data as { content: string }).content.replace(/\n/g, "");
  return Buffer.from(rawBase64, "base64").toString("utf-8");
}

/**
 * Reads a blob's content by its blob SHA (path-independent). A draft's baseSha
 * is a blob sha (not a commit sha), so the contents API — which needs a ref —
 * can't serve it; this fetches the common-ancestor base for a 3-way merge.
 */
export async function getBlobContent(sha: string): Promise<string> {
  const res = await githubFetch(`/repos/${repoEnv.GITHUB_REPO}/git/blobs/${encodeURIComponent(sha)}`);
  const data = (await res.json()) as { content: string; encoding: string };
  const rawBase64 = data.content.replace(/\n/g, "");
  return Buffer.from(rawBase64, "base64").toString("utf-8");
}
