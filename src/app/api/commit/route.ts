/**
 * POST /api/commit
 *
 * Commits file changes and/or deletions to the vault repository.
 * Requires an authenticated session — returns 401 if not authenticated.
 * Returns 409 on OCC conflict (ConflictError), 502 on GitHub upstream failure.
 */

export const dynamic = "force-dynamic";

import { z } from "zod";
import { getActor } from "@/modules/auth";
import { container } from "@/container/dependency-container";
import { ConflictError } from "@/modules/repository";

const JSON_HEADERS = { "content-type": "application/json" } as const;

// ---------------------------------------------------------------------------
// Request schema
// ---------------------------------------------------------------------------

// Bounds protect the server from pathological clients that could try to send
// a 10 GB content blob or 100 000 file batch. The picks here are well above
// any realistic vault note (10 MB per file, 500 files per commit, 5 KB
// message, 1 KB path).
const MAX_PATH = 1024;
const MAX_CONTENT = 10 * 1024 * 1024; // 10 MB per file
const MAX_FILES_PER_COMMIT = 500;
const MAX_MESSAGE = 5 * 1024; // 5 KB

const fileChangeSchema = z.object({
  path: z.string().min(1).max(MAX_PATH),
  content: z.string().max(MAX_CONTENT),
  // baseSha === "" is the "create-new" sentinel handled by commit-changes
  // (asserts the path is currently absent). For updates, must equal current sha.
  baseSha: z.string().max(256),
});

const deletionSchema = z.object({
  path: z.string().min(1).max(MAX_PATH),
  baseSha: z.string().min(1).max(256),
});

const commitBodySchema = z.object({
  files: z.array(fileChangeSchema).max(MAX_FILES_PER_COMMIT),
  deletions: z.array(deletionSchema).max(MAX_FILES_PER_COMMIT).optional(),
  message: z.string().min(1).max(MAX_MESSAGE),
});

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

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
    return new Response(JSON.stringify({ error: "bad_request", detail: "invalid JSON body" }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  const parsed = commitBodySchema.safeParse(rawBody);
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

  // Execute commit use-case
  // Build a CommitRequest that satisfies exactOptionalPropertyTypes:
  // only include `deletions` key when it is actually defined.
  const commitReq = parsed.data.deletions !== undefined
    ? { files: parsed.data.files, deletions: parsed.data.deletions, message: parsed.data.message }
    : { files: parsed.data.files, message: parsed.data.message };

  try {
    const result = await container.commitChanges(commitReq);
    container.clearSnapshotCache();
    return new Response(JSON.stringify({ commitSha: result.commitSha }), {
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
    const message = e instanceof Error ? e.message : "commit failed";
    return new Response(JSON.stringify({ error: "commit_failed", detail: message }), {
      status: 502,
      headers: JSON_HEADERS,
    });
  }
}
