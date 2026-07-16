/**
 * Application use-case: GetNoteVersion.
 *
 * Reads file content as it existed at a specific commit. Returns
 * `{ content }` or `{ error: "not_a_file" }` when the path at that
 * revision is not a single readable blob (directory, submodule, or
 * >1 MB file). Route handler maps to 200 / 422 accordingly.
 */
import type { VaultReader } from "./ports";

export type GetNoteVersionResult =
  | { ok: true; content: string }
  | { ok: false; reason: "not_a_file" };

export interface GetNoteVersionRequest {
  path: string;
  sha: string;
}

export function makeGetNoteVersion(deps: { reader: VaultReader }) {
  const { reader } = deps;
  return async function getNoteVersion(req: GetNoteVersionRequest): Promise<GetNoteVersionResult> {
    const content = await reader.getFileAtSha(req.path, req.sha);
    if (content === null) return { ok: false, reason: "not_a_file" };
    return { ok: true, content };
  };
}
