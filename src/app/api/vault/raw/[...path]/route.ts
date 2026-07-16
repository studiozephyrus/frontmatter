/**
 * GET /api/vault/raw/[...path]
 *
 * Serves a raw binary file from the vault via the GitHub Contents API.
 * Requires an authenticated session.
 *
 * The [...path] catch-all segments are joined to form the vault-relative path.
 * Content-Type is inferred from the file extension.
 */

export const dynamic = "force-dynamic";

import { getActor } from "@/modules/auth";
import { container } from "@/container/dependency-container";
import { inferContentType } from "@/app/api/vault/raw/content-type";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  const actor = await getActor();
  if (!actor) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const { path: segments } = await params;
  const filePath = segments.join("/");

  let result: { base64: string } | null;
  try {
    result = await container.getRawFile(filePath);
  } catch (err) {
    const message = err instanceof Error ? err.message : "upstream error";
    return new Response(JSON.stringify({ error: "upstream_failure", detail: message }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }

  if (result === null) {
    return new Response(JSON.stringify({ error: "not_found" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }

  const bytes = Buffer.from(result.base64, "base64");
  const contentType = inferContentType(filePath);

  return new Response(bytes, {
    status: 200,
    headers: {
      "content-type": contentType,
      "cache-control": "private, max-age=3600",
    },
  });
}
