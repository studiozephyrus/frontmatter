/**
 * GET /api/vault/history?path=<relative-path>
 *
 * Returns the commit history for a single note. 401 if unauthenticated.
 *
 * Architecture: routes only call `dependencyContainer.*` use-cases.
 * The GitHub specifics live in `@/shared/infrastructure/github/client`
 * behind the `VaultReader.listHistory` port.
 */

export const dynamic = "force-dynamic";

import { getActor } from "@/modules/auth";
import { container as dependencyContainer } from "@/container/dependency-container";

const JSON_HEADERS = { "content-type": "application/json" } as const;

export async function GET(req: Request): Promise<Response> {
  const actor = await getActor();
  if (!actor) {
    return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: JSON_HEADERS });
  }

  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  if (!path) {
    return new Response(JSON.stringify({ error: "bad_request", detail: "path required" }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  try {
    const commits = await dependencyContainer.getNoteHistory({ path });
    return new Response(JSON.stringify({ commits }), { status: 200, headers: JSON_HEADERS });
  } catch (e) {
    const message = e instanceof Error ? e.message : "history failed";
    return new Response(JSON.stringify({ error: "history_failed", detail: message }), {
      status: 502,
      headers: JSON_HEADERS,
    });
  }
}
