/**
 * GET /api/vault/version?path=<relative-path>&sha=<commit-sha>
 *
 * Returns the content of a note as it existed at a specific commit.
 * Used by the version-history viewer. 401 if unauthenticated.
 *
 * Architecture: routes only call `dependencyContainer.*` use-cases.
 * The GitHub specifics live in `@/shared/infrastructure/github/client`
 * behind the `VaultReader.getFileAtSha` port.
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
  const sha = searchParams.get("sha");
  if (!path || !sha) {
    return new Response(JSON.stringify({ error: "bad_request", detail: "path and sha required" }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  try {
    const result = await dependencyContainer.getNoteVersion({ path, sha });
    if (!result.ok) {
      return new Response(
        JSON.stringify({ error: "not_a_file", detail: "path at this revision is not a readable file" }),
        { status: 422, headers: JSON_HEADERS },
      );
    }
    return new Response(JSON.stringify({ content: result.content }), { status: 200, headers: JSON_HEADERS });
  } catch (e) {
    const message = e instanceof Error ? e.message : "version fetch failed";
    return new Response(JSON.stringify({ error: "version_failed", detail: message }), {
      status: 502,
      headers: JSON_HEADERS,
    });
  }
}
