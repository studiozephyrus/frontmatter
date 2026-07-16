/**
 * POST /api/ai/complete  { prefix: string }
 *
 * Returns a short inline continuation of the note text (AI ghost-text). The
 * client sends the text immediately before the cursor; we return only the
 * continuation. 401 if unauthenticated.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

import { getActor } from "@/modules/auth";
import { gatewayLlmClient } from "@/modules/ai";

const JSON_HEADERS = { "content-type": "application/json" } as const;

const SYSTEM =
  "You are an inline autocomplete for a markdown notes editor. Continue the user's text naturally from exactly where it stops. Output ONLY the continuation that comes next — no preamble, no quotes, no code fences, no restating prior text. Keep it short: finish the current phrase or sentence (a few words, at most one sentence). If the text ends mid-word, complete that word.";

export async function POST(req: Request): Promise<Response> {
  const actor = await getActor();
  if (!actor) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: JSON_HEADERS });
  }

  let body: { prefix?: string };
  try {
    body = (await req.json()) as { prefix?: string };
  } catch {
    return new Response(JSON.stringify({ error: "bad_request" }), { status: 400, headers: JSON_HEADERS });
  }

  const prefix = typeof body.prefix === "string" ? body.prefix : "";
  if (prefix.length > 200_000) {
    return new Response(JSON.stringify({ error: "too_large" }), { status: 413, headers: JSON_HEADERS });
  }
  if (prefix.trim().length < 3) {
    return new Response(JSON.stringify({ text: "" }), { status: 200, headers: JSON_HEADERS });
  }

  // Only send the tail for context — keeps latency + tokens down.
  const context = prefix.slice(-1500);

  try {
    const out = await gatewayLlmClient.generate({
      prompt: `Text so far:\n${context}\n\nContinuation:`,
      system: SYSTEM,
      speedFirst: true, // ghost-text: prefer fastest providers (Groq/Cerebras)
    });
    // Unwrap a fenced reply only when BOTH fences are present, else keep as-is.
    let text = out.trim();
    const fenced = /^```[a-zA-Z]*\n([\s\S]*?)\n?```$/.exec(text);
    if (fenced) text = (fenced[1] ?? text).trim();
    if (text.length > 280) text = text.slice(0, 280);
    return new Response(JSON.stringify({ text }), { status: 200, headers: JSON_HEADERS });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "ai error";
    return new Response(JSON.stringify({ error: "ai_failed", detail }), { status: 502, headers: JSON_HEADERS });
  }
}
