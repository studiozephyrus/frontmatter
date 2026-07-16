/**
 * POST /api/vault/create
 *
 * Creates a new vault note. Returns 409 if the file already exists.
 * Requires an authenticated session — returns 401 if not authenticated.
 */

export const dynamic = "force-dynamic";

import { z } from "zod";
import { getActor } from "@/modules/auth";
import { container } from "@/container/dependency-container";
import { InvalidPathError, defaultNoteContent } from "@/modules/repository/application/file-ops";

const JSON_HEADERS = { "content-type": "application/json" } as const;

const createBodySchema = z.object({
  path: z.string().min(1),
  content: z.string().optional(),
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

  const parsed = createBodySchema.safeParse(rawBody);
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

  const { path, content } = parsed.data;

  // Validate path
  try {
    container.validateNotePath(path);
  } catch (e) {
    if (e instanceof InvalidPathError) {
      return new Response(JSON.stringify({ error: "bad_request", detail: e.message }), {
        status: 400,
        headers: JSON_HEADERS,
      });
    }
    throw e;
  }

  // Check if file already exists
  const existingSha = await container.getBlobSha(path);
  if (existingSha !== null) {
    return new Response(JSON.stringify({ error: "exists", path }), {
      status: 409,
      headers: JSON_HEADERS,
    });
  }

  // Default content (shared with the client so its optimistic note matches).
  const noteContent = content !== undefined ? content : defaultNoteContent(path);

  try {
    const result = await container.createNote({ path, content: noteContent });
    container.clearSnapshotCache();
    return new Response(
      JSON.stringify({ commitSha: result.commitSha, sha: result.sha, path }),
      { status: 200, headers: JSON_HEADERS },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "create failed";
    return new Response(JSON.stringify({ error: "create_failed", detail: message }), {
      status: 502,
      headers: JSON_HEADERS,
    });
  }
}
