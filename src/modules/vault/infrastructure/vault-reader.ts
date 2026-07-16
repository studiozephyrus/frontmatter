/**
 * Infrastructure adapter: implements VaultReader using the GitHub client.
 * process.env is never accessed here — the github client handles lazy env reads.
 */

import {
  getHeadSha,
  getZipball,
  getFile,
  listHistory,
  getFileAtSha,
  getBlobContent,
} from "@/shared/infrastructure/github/client";
import type { VaultReader } from "@/modules/vault/application/ports";

export const githubVaultReader: VaultReader = {
  getHeadSha,
  getZipball,
  getFile,
  listHistory,
  getFileAtSha,
};

/** Narrow reader for the 3-way merge use-case (getFile + blob-by-sha). */
export const githubMergeReader = { getFile, getBlobContent };
