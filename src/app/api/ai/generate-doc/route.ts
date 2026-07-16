export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { getActor } from "@/modules/auth";
import { container } from "@/container/dependency-container";
import { isDocKind } from "@/modules/ai";

const JSON_HEADERS = { "content-type": "application/json" } as const;

/**
 * POST /api/ai/generate-doc
 * Idea mode: { kind, idea } → { document } where kind ∈ PRD/FRD/BRD/
 * product-note/spec. Auth-gated; same provider chain as the other AI routes.
 */
export async function POST(req: Request): Promise<Response> {
  const actor = await getActor();
  if (!actor) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  let body: { kind?: unknown; idea?: unknown };
  try {
    body = (await req.json()) as { kind?: unknown; idea?: unknown };
  } catch {
    return new Response(JSON.stringify({ error: "bad_request" }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  if (!isDocKind(body.kind)) {
    return new Response(
      JSON.stringify({ error: "bad_request", detail: "invalid kind" }),
      { status: 400, headers: JSON_HEADERS },
    );
  }
  if (typeof body.idea !== "string" || body.idea.trim().length === 0) {
    return new Response(
      JSON.stringify({ error: "bad_request", detail: "idea required" }),
      { status: 400, headers: JSON_HEADERS },
    );
  }
  if (body.idea.length > 20_000) {
    return new Response(
      JSON.stringify({ error: "too_large", detail: "idea exceeds 20k chars" }),
      { status: 413, headers: JSON_HEADERS },
    );
  }

  try {
    const result = await container.generateDocument({ kind: body.kind, idea: body.idea });
    return new Response(JSON.stringify(result), { status: 200, headers: JSON_HEADERS });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "ai error";
    return new Response(JSON.stringify({ error: "ai_failed", detail }), {
      status: 502,
      headers: JSON_HEADERS,
    });
  }
}
