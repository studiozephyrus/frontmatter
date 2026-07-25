// THE app-facing composition root. The only wiring module app/presentation may import.
// Grows in later batches (auth resolver, vault reader, repository writer).

import { makeGetSnapshot } from "@/modules/vault/application/get-snapshot";
import { makeGetFile } from "@/modules/vault/application/get-file";
import { makeGetNoteHistory } from "@/modules/vault/application/get-history";
import { makeGetNoteVersion } from "@/modules/vault/application/get-version";
import { makeExportVaultZip } from "@/modules/vault/application/export-vault-zip";
import { githubVaultReader, githubMergeReader } from "@/modules/vault/infrastructure/vault-reader";
import { snapshotCache } from "@/modules/vault/infrastructure/snapshot-cache";
import { parseMarkdown } from "@/modules/vault/infrastructure/markdown-parser";
import { makeCommitChanges } from "@/modules/repository/application/commit-changes";
import { makeCreateNote } from "@/modules/repository/application/create-note";
import { makeRenameNote } from "@/modules/repository/application/rename-note";
import { makeMergeNote } from "@/modules/repository/application/merge-note";
import { makeUploadAttachment } from "@/modules/repository/application/upload-attachment";
import { validateNotePath } from "@/modules/repository/application/file-ops";
import { githubWriter } from "@/modules/repository/infrastructure/github-writer";
import { githubFetch } from "@/shared/infrastructure/github/client";
import { FileNotFoundError } from "@/shared/domain/errors";
import { repoEnv } from "@/config/env";

// Prefixes that are repo code/config, never vault media — keep raw file access
// scoped to the vault (mirrors the snapshot's NON_VAULT_PREFIXES).
const RAW_BLOCKED_PREFIXES = ["src/", "docs/", "specs/", "public/", ".github/", ".claude/", ".vercel/", "node_modules/"];
import { searchNotes, findUnlinkedMentions } from "@/modules/vault/infrastructure/search-index";
import {
  makeRefineText,
  makeSummarize,
  makeSuggestLinks,
  makeLinkDoctor,
  makeGenerateDocument,
  gatewayLlmClient,
} from "@/modules/ai";
import { makeShareWriter } from "@/modules/share/infrastructure/share-writer";
import { makeShareSnapshotPort } from "@/modules/share/infrastructure/share-snapshot-port";
import { makeSetShare } from "@/modules/share/application/set-share";
import { makeRemoveShare } from "@/modules/share/application/remove-share";
import { makeListConflicts } from "@/modules/share/application/list-conflicts";
import { makeResolvePublicNote } from "@/modules/share/application/resolve-public-note";

const AUTHOR = { name: "Sagnik Mitra", email: "sagnikmitra123@gmail.com" } as const;

export const container = {
  getSnapshot: makeGetSnapshot({
    reader: githubVaultReader,
    cache: snapshotCache,
    parseNote: parseMarkdown,
  }),
  getFile: makeGetFile({
    reader: githubVaultReader,
  }),
  // History + point-in-time reads for the version viewer. Both use the
  // same VaultReader port (githubVaultReader) — no infra leaks into routes.
  getNoteHistory: makeGetNoteHistory({
    reader: githubVaultReader,
  }),
  getNoteVersion: makeGetNoteVersion({
    reader: githubVaultReader,
  }),
  exportVaultZip: makeExportVaultZip({
    reader: githubVaultReader,
  }),
  commitChanges: makeCommitChanges({
    writer: githubWriter,
    author: AUTHOR,
  }),
  createNote: makeCreateNote({
    writer: githubWriter,
    author: AUTHOR,
  }),
  renameNote: makeRenameNote({
    reader: githubVaultReader,
    writer: githubWriter,
    author: AUTHOR,
  }),
  mergeNote: makeMergeNote({ reader: githubMergeReader }),
  uploadAttachment: makeUploadAttachment({
    writer: githubWriter,
    author: AUTHOR,
  }),
  /**
   * Fetches a raw binary file from GitHub and returns its base64 content.
   * Returns null if the file is not found.
   */
  async getRawFile(path: string): Promise<{ base64: string } | null> {
    // Reject traversal + out-of-vault paths (raw access must stay vault-scoped).
    const segments = path.split("/");
    if (segments.some((s) => s === ".." || s === ".")) return null;
    if (RAW_BLOCKED_PREFIXES.some((p) => path.startsWith(p))) return null;
    const encodedPath = segments.map(encodeURIComponent).join("/");
    const apiPath = `/repos/${repoEnv.GITHUB_REPO}/contents/${encodedPath}?ref=${repoEnv.GITHUB_BRANCH}`;
    let res: Response;
    try {
      res = await githubFetch(apiPath);
    } catch (err) {
      // githubFetch throws FileNotFoundError on 404 (message has no "404").
      if (err instanceof FileNotFoundError) return null;
      throw err;
    }
    const data = (await res.json()) as { content?: string; encoding?: string };
    if (!data.content || data.encoding !== "base64") return null;
    return { base64: data.content.replace(/\n/g, "") };
  },
  /** Validates a vault-relative note path. Throws InvalidPathError if invalid. */
  validateNotePath,
  /** Returns the current blob SHA for a path in the repo, or null if not found. */
  getBlobSha: (path: string) => githubWriter.getBlobSha(path),
  /** Clears the snapshot cache. Call after a successful commit to force re-fetch. */
  clearSnapshotCache(): void {
    snapshotCache.clear();
  },
  searchNotes,
  findUnlinkedMentions,
  /** LLM use-cases (Vercel AI Gateway → Gemini Flash). */
  refineText: makeRefineText({ llm: gatewayLlmClient }),
  summarize: makeSummarize({ llm: gatewayLlmClient }),
  suggestLinks: makeSuggestLinks({ llm: gatewayLlmClient }),
  linkDoctor: makeLinkDoctor({ llm: gatewayLlmClient }),
  generateDocument: makeGenerateDocument({ llm: gatewayLlmClient }),
} as const;

// ── Share module wiring (depends on commitChanges + getSnapshot above) ──
const shareWriter = makeShareWriter({
  reader: githubVaultReader,
  commitChanges: container.commitChanges,
});
const shareSnapshot = makeShareSnapshotPort({ getSnapshot: container.getSnapshot });

export const shareApi = {
  setShare: makeSetShare({
    writer: shareWriter,
    snapshot: shareSnapshot,
    publicBaseUrl: process.env["NEXT_PUBLIC_SITE_URL"] ?? "https://frontmatter.in",
  }),
  removeShare: makeRemoveShare({ writer: shareWriter }),
  listConflicts: makeListConflicts({ snapshot: shareSnapshot }),
  resolvePublicNote: makeResolvePublicNote({
    snapshot: shareSnapshot,
    reader: githubVaultReader,
  }),
  listShares: () => shareSnapshot.listShares(),
} as const;
export type Container = typeof container;
