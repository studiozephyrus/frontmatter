/**
 * POST /api/vault/restore
 *
 * Restores a note from `_Trash/` back to its original path. Body: { path }
 * where `path` is the trashed path (starts with `_Trash/`). Reads the trashed
 * content, recreates the note at its original location, and deletes the trash
 * copy — one atomic commit. 401 if unauthenticated, 409 on conflict.
 */

export const dynamic = "force-dynamic";

import { z } from "zod";
import { getActor } from "@/modules/auth";
import { container } from "@/container/dependency-container";
import { ConflictError } from "@/modules/repository";

const JSON_HEADERS = { "content-type": "application/json" } as const;
const TRASH = "_Trash/";

const bodySchema = z.object({ path: z.string().min(1).startsWith(TRASH) });

export async function POST(req: Request): Promise<Response> {
  const actor = await getActor();
  if (!actor) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: JSON_HEADERS });
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "bad_request", detail: "invalid JSON body" }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  const parsed = bodySchema.safeParse(rawBody);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "bad_request", detail: parsed.error.issues.map((i) => i.message).join("; ") }),
      { status: 400, headers: JSON_HEADERS },
    );
  }

  const trashPath = parsed.data.path;
  const originalPath = trashPath.slice(TRASH.length);
  const base = originalPath.split("/").pop()?.replace(/\.md$/, "") ?? originalPath;

  try {
    const { content, sha } = await container.getFile(trashPath);
    const result = await container.commitChanges({
      files: [{ path: originalPath, content, baseSha: "" }],
      deletions: [{ path: trashPath, baseSha: sha }],
      message: `Restore ${base}`,
    });
    container.clearSnapshotCache();
    return new Response(JSON.stringify({ commitSha: result.commitSha, path: originalPath }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (e) {
    if (e instanceof ConflictError) {
      return new Response(JSON.stringify({ error: "conflict", paths: e.paths }), { status: 409, headers: JSON_HEADERS });
    }
    const message = e instanceof Error ? e.message : "restore failed";
    return new Response(JSON.stringify({ error: "restore_failed", detail: message }), { status: 502, headers: JSON_HEADERS });
  }
}
