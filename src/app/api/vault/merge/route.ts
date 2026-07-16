/**
 * POST /api/vault/merge
 *
 * Non-destructive conflict resolution. Given { path, baseSha, localContent },
 * fetches the common-ancestor base (blob at baseSha) and the current remote
 * content, runs the conservative 3-way merge, and returns:
 *   { clean, text, remoteSha, conflicts }
 * The client adopts `remoteSha` as the new baseSha and `text` as the draft
 * (which carries git-style conflict markers when clean === false).
 */

export const dynamic = "force-dynamic";

import { z } from "zod";
import { getActor } from "@/modules/auth";
import { container } from "@/container/dependency-container";

const JSON_HEADERS = { "content-type": "application/json" } as const;

const bodySchema = z.object({
  path: z.string().min(1),
  baseSha: z.string(),
  localContent: z.string(),
});

export async function POST(req: Request): Promise<Response> {
  const actor = await getActor();
  if (!actor) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "bad_request" }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        error: "bad_request",
        detail: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
      }),
      { status: 400, headers: JSON_HEADERS },
    );
  }

  try {
    const result = await container.mergeNote(parsed.data);
    return new Response(JSON.stringify(result), { status: 200, headers: JSON_HEADERS });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "merge failed";
    return new Response(JSON.stringify({ error: "merge_failed", detail }), {
      status: 502,
      headers: JSON_HEADERS,
    });
  }
}
