/**
 * POST /api/vault/delete
 *
 * Deletes a vault note. Uses OCC baseSha to detect concurrent modifications.
 * Returns 409 on conflict; 401 if not authenticated.
 */

export const dynamic = "force-dynamic";

import { z } from "zod";
import { getActor } from "@/modules/auth";
import { container } from "@/container/dependency-container";
import { ConflictError } from "@/modules/repository";

const JSON_HEADERS = { "content-type": "application/json" } as const;

const deleteBodySchema = z.object({
  path: z.string().min(1),
  baseSha: z.string().min(1),
});

export async function POST(req: Request): Promise<Response> {
  // Auth check
  const actor = await getActor();
  if (!actor) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  // Parse + validate body
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "bad_request", detail: "invalid JSON body" }),
      { status: 400, headers: JSON_HEADERS },
    );
  }

  const parsed = deleteBodySchema.safeParse(rawBody);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        error: "bad_request",
        detail: parsed.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; "),
      }),
      { status: 400, headers: JSON_HEADERS },
    );
  }

  const { path, baseSha } = parsed.data;
  const base = path.split("/").pop()?.replace(/\.md$/, "") ?? path;
  const TRASH = "_Trash/";
  const alreadyTrashed = path.startsWith(TRASH);

  try {
    let result;
    if (alreadyTrashed) {
      // Purge — permanent hard delete from trash.
      result = await container.commitChanges({
        files: [],
        deletions: [{ path, baseSha }],
        message: `Purge ${base}`,
      });
    } else {
      // Soft delete — move the note into _Trash/ so it can be restored.
      const { content } = await container.getFile(path);
      // If a same-named note was trashed before (and not purged), overwrite that
      // trash copy instead of asserting absence (which would 409 confusingly).
      const trashPath = TRASH + path;
      const existingTrashSha = await container.getBlobSha(trashPath);
      result = await container.commitChanges({
        files: [{ path: trashPath, content, baseSha: existingTrashSha ?? "" }],
        deletions: [{ path, baseSha }],
        message: `Trash ${base}`,
      });
    }
    container.clearSnapshotCache();
    return new Response(JSON.stringify({ commitSha: result.commitSha, trashed: !alreadyTrashed }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (e) {
    if (e instanceof ConflictError) {
      return new Response(JSON.stringify({ error: "conflict", paths: e.paths }), {
        status: 409,
        headers: JSON_HEADERS,
      });
    }
    const message = e instanceof Error ? e.message : "delete failed";
    return new Response(JSON.stringify({ error: "delete_failed", detail: message }), {
      status: 502,
      headers: JSON_HEADERS,
    });
  }
}
