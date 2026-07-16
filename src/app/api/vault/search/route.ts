/**
 * GET /api/vault/search?q=<query>
 *
 * Full-text search over vault notes using MiniSearch.
 * Requires an authenticated session — returns 401 if not authenticated.
 * Returns 400 for missing/empty query. Returns 502 on upstream failure.
 */

export const dynamic = "force-dynamic";

import { z } from "zod";
import { getActor } from "@/modules/auth";
import { container } from "@/container/dependency-container";

const JSON_HEADERS = { "content-type": "application/json" } as const;

const querySchema = z.object({
  q: z.string().min(1),
});

export async function GET(request: Request): Promise<Response> {
  const actor = await getActor();
  if (!actor) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({ q: url.searchParams.get("q") });
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "bad_request", detail: "q parameter is required and must be non-empty" }),
      { status: 400, headers: JSON_HEADERS },
    );
  }

  try {
    const results = await container.searchNotes(parsed.data.q);
    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "upstream error";
    return new Response(
      JSON.stringify({ error: "upstream_failure", detail: message }),
      { status: 502, headers: JSON_HEADERS },
    );
  }
}
