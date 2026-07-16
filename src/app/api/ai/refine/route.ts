export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { getActor } from "@/modules/auth";
import { container } from "@/container/dependency-container";

const JSON_HEADERS = { "content-type": "application/json" } as const;

export async function POST(req: Request): Promise<Response> {
  const actor = await getActor();
  if (!actor) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  let body: { text?: string; instruction?: string };
  try {
    body = (await req.json()) as { text?: string; instruction?: string };
  } catch {
    return new Response(JSON.stringify({ error: "bad_request" }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  if (typeof body.text !== "string" || body.text.trim().length === 0) {
    return new Response(
      JSON.stringify({ error: "bad_request", detail: "text required" }),
      { status: 400, headers: JSON_HEADERS },
    );
  }
  if (body.text.length > 200_000) {
    return new Response(
      JSON.stringify({ error: "too_large", detail: "text exceeds 200k chars" }),
      { status: 413, headers: JSON_HEADERS },
    );
  }

  try {
    const result = await container.refineText({
      text: body.text,
      ...(typeof body.instruction === "string" ? { instruction: body.instruction } : {}),
    });
    return new Response(JSON.stringify(result), { status: 200, headers: JSON_HEADERS });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "ai error";
    return new Response(JSON.stringify({ error: "ai_failed", detail }), {
      status: 502,
      headers: JSON_HEADERS,
    });
  }
}
