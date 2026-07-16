/**
 * GET /api/export/vault
 *
 * Exports all vault .md files as a zip archive.
 * Requires an authenticated session — returns 401 if not authenticated.
 * Returns 502 if the GitHub upstream call fails.
 */

export const dynamic = "force-dynamic";

import { getActor } from "@/modules/auth";
import { container } from "@/container/dependency-container";

export async function GET(): Promise<Response> {
  const actor = await getActor();
  if (!actor) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    const bytes = await container.exportVaultZip();
    return new Response(bytes.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "content-type": "application/zip",
        "content-disposition": 'attachment; filename="sgnk-md-vault.zip"',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "upstream error";
    return new Response(
      JSON.stringify({ error: "upstream_failure", detail: message }),
      { status: 502, headers: { "content-type": "application/json" } },
    );
  }
}
