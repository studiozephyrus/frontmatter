/**
 * Application use-case: ExportVaultZip.
 *
 * Fetches the vault's latest GitHub zipball, filters to vault-only .md files
 * (reusing the same isVaultNote rule as get-snapshot), and re-zips them
 * preserving vault-relative paths.
 *
 * Pure application logic: no framework imports, no infrastructure imports,
 * no env access. All side-effecting dependencies are injected via ports.
 */

import { unzipSync, zipSync } from "fflate";
import type { VaultReader } from "./ports";

// ---------------------------------------------------------------------------
// Vault scope — identical to the rule in get-snapshot.ts so both agree on
// which files belong to the vault.
// ---------------------------------------------------------------------------

const NON_VAULT_PREFIXES = [
  "src/",
  "docs/",
  "specs/",
  "public/",
  ".github/",
  ".claude/",
  ".vercel/",
  "node_modules/",
] as const;

function isVaultNote(relPath: string): boolean {
  if (relPath === "") return false;
  if (relPath === "README.md") return false; // repo readme, not a note
  return !NON_VAULT_PREFIXES.some((prefix) => relPath.startsWith(prefix));
}

// ---------------------------------------------------------------------------
// Internal: strip the first path segment (GitHub zipball top-level dir)
// e.g. "repo-abc123/Projects/HQ/HQ.md" → "Projects/HQ/HQ.md"
// ---------------------------------------------------------------------------

function stripTopLevelDir(zipPath: string): string {
  const slashIdx = zipPath.indexOf("/");
  if (slashIdx === -1) return zipPath;
  return zipPath.slice(slashIdx + 1);
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function makeExportVaultZip(deps: { reader: VaultReader }): () => Promise<Uint8Array> {
  const { reader } = deps;

  return async function exportVaultZip(): Promise<Uint8Array> {
    const buf = await reader.getZipball();
    const entries = unzipSync(new Uint8Array(buf));

    const vaultFiles: Record<string, Uint8Array> = {};

    for (const [zipPath, bytes] of Object.entries(entries)) {
      if (!zipPath.endsWith(".md")) continue;
      const relPath = stripTopLevelDir(zipPath);
      if (!isVaultNote(relPath)) continue;
      vaultFiles[relPath] = bytes;
    }

    return zipSync(vaultFiles);
  };
}
