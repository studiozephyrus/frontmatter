/**
 * Application-layer ports for the vault module.
 * Pure interfaces — no framework imports, no env reads.
 */

import type { ParsedNote } from "@/modules/vault/domain/note";

/**
 * Commit-history entry for the version-history viewer. Domain-level
 * shape — no GitHub-specific fields leak through the port.
 */
export interface VaultHistoryEntry {
  sha: string;
  message: string;
  author: string;
  date: string | null;
}

export interface VaultReader {
  /** Returns the HEAD commit SHA for the configured repo+branch. */
  getHeadSha(): Promise<string>;
  /** Downloads the zipball for the configured repo+branch as an ArrayBuffer. */
  getZipball(): Promise<ArrayBuffer>;
  /** Fetches the raw content and blob SHA of a single file in the vault. */
  getFile(path: string): Promise<{ content: string; sha: string }>;
  /** Lists the last `limit` commits that touched `path`. Most-recent first. */
  listHistory(path: string, limit?: number): Promise<VaultHistoryEntry[]>;
  /**
   * Reads file content at `sha`. Returns `null` when the path at that
   * revision is not a single readable file (directory, submodule,
   * oversize blob).
   */
  getFileAtSha(path: string, sha: string): Promise<string | null>;
}

/**
 * Port for parsing raw markdown into domain notes.
 * Implemented by markdown-parser.ts in infrastructure.
 */
export type NoteParserFn = (path: string, raw: string) => ParsedNote;
