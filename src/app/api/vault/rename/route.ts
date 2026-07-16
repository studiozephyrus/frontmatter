/**
 * POST /api/vault/rename
 *
 * Renames a vault note and auto-relinks all inbound wikilinks.
 * Returns 409 if newPath already exists; 401 if not authenticated.
 */

export const dynamic = "force-dynamic";

import { z } from "zod";
import { getActor } from "@/modules/auth";
import { container } from "@/container/dependency-container";
import { NoteExistsError, InvalidPathError } from "@/modules/repository/application/file-ops";

const JSON_HEADERS = { "content-type": "application/json" } as const;

const renameBodySchema = z.object({
  oldPath: z.string().min(1),
  newPath: z.string().min(1),
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

  const parsed = renameBodySchema.safeParse(rawBody);
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

  const { oldPath, newPath } = parsed.data;

  try {
    // Which notes link to oldPath? Read it from the (cached) snapshot's
    // backlink index so the rename fetches + relinks ONLY those notes instead
    // of downloading the whole vault zipball. If the snapshot is unavailable,
    // fall back to a pure rename (the note itself still moves correctly).
    let referencingPaths: string[] = [];
    try {
      const snapshot = await container.getSnapshot();
      referencingPaths = snapshot.notes.find((n) => n.path === oldPath)?.backlinks ?? [];
    } catch {
      /* snapshot unavailable — proceed without relinking */
    }

    const result = await container.renameNote({ oldPath, newPath, referencingPaths });
    container.clearSnapshotCache();
    return new Response(
      JSON.stringify({ commitSha: result.commitSha, relinkedCount: result.relinkedCount }),
      { status: 200, headers: JSON_HEADERS },
    );
  } catch (e) {
    if (e instanceof NoteExistsError || e instanceof InvalidPathError) {
      return new Response(JSON.stringify({ error: "conflict", detail: e.message }), {
        status: 409,
        headers: JSON_HEADERS,
      });
    }
    const message = e instanceof Error ? e.message : "rename failed";
    return new Response(JSON.stringify({ error: "rename_failed", detail: message }), {
      status: 502,
      headers: JSON_HEADERS,
    });
  }
}
