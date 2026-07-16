/**
 * GET /api/vault/snapshot
 *
 * Returns the full vault snapshot as JSON.
 * Requires an authenticated session — returns 401 if not authenticated.
 * Returns 502 if the GitHub upstream call fails.
 */

export const dynamic = "force-dynamic";

import { getActor } from "@/modules/auth";
import { container } from "@/container/dependency-container";

const JSON_HEADERS = { "content-type": "application/json" } as const;

export async function GET(req: Request): Promise<Response> {
  const actor = await getActor();
  if (!actor) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  try {
    const snapshot = await container.getSnapshot();
    // ETag = the vault HEAD sha. The snapshot is fully determined by it, so
    // if the client already has this revision we answer 304 Not Modified and
    // skip serialising + transferring the whole tree.
    const etag = `"${snapshot.sha}"`;
    const cacheHeaders = { ETag: etag, "Cache-Control": "private, must-revalidate" };
    if (req.headers.get("if-none-match") === etag) {
      return new Response(null, { status: 304, headers: cacheHeaders });
    }
    return new Response(JSON.stringify(snapshot), {
      status: 200,
      headers: { ...JSON_HEADERS, ...cacheHeaders },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "upstream error";
    return new Response(
      JSON.stringify({ error: "upstream_failure", detail: message }),
      { status: 502, headers: JSON_HEADERS },
    );
  }
}
