/**
 * Application use-case: GetNoteHistory.
 *
 * Returns the most-recent commits that touched a single vault path. The
 * use-case is intentionally thin — all GitHub specifics are encapsulated
 * by the `VaultReader.listHistory` port. The route handler stays
 * framework-only; this file stays infrastructure-free.
 */
import type { VaultHistoryEntry, VaultReader } from "./ports";

export interface GetNoteHistoryRequest {
  path: string;
  limit?: number;
}

export function makeGetNoteHistory(deps: { reader: VaultReader }) {
  const { reader } = deps;
  return async function getNoteHistory(req: GetNoteHistoryRequest): Promise<VaultHistoryEntry[]> {
    return reader.listHistory(req.path, req.limit ?? 50);
  };
}
