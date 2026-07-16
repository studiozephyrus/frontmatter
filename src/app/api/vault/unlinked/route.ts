/**
 * GET /api/vault/unlinked?title=<title>&path=<self-path>
 *
 * Returns notes that mention `title` as plain text without a `[[wikilink]]`
 * (Obsidian-style "unlinked mentions"). 401 if unauthenticated.
 */

export const dynamic = "force-dynamic";

import { getActor } from "@/modules/auth";
import { container } from "@/container/dependency-container";

const JSON_HEADERS = { "content-type": "application/json" } as const;

export async function GET(req: Request): Promise<Response> {
  const actor = await getActor();
  if (!actor) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: JSON_HEADERS });
  }

  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");
  const path = searchParams.get("path") ?? "";
  if (!title) {
    return new Response(JSON.stringify({ error: "bad_request", detail: "title required" }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  try {
    const mentions = await container.findUnlinkedMentions(title, path);
    return new Response(JSON.stringify({ mentions }), { status: 200, headers: JSON_HEADERS });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unlinked scan failed";
    return new Response(JSON.stringify({ error: "unlinked_failed", detail: message }), {
      status: 502,
      headers: JSON_HEADERS,
    });
  }
}
