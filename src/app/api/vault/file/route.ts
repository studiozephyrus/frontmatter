/**
 * GET /api/vault/file?path=<relative-path>
 *
 * Returns the raw content and blob SHA of a single vault file.
 * Requires an authenticated session — returns 401 if not authenticated.
 * Returns 400 for a missing/invalid path parameter.
 * Returns 404 if the file does not exist in the vault.
 * Returns 502 if any other upstream call fails.
 */

export const dynamic = "force-dynamic";

import { z } from "zod";
import { getActor } from "@/modules/auth";
import { container } from "@/container/dependency-container";
import { InvalidPathError } from "@/modules/vault/application/get-file";
import { FileNotFoundError } from "@/shared/domain/errors";

const JSON_HEADERS = { "content-type": "application/json" } as const;

// 1024 chars is well above any plausible vault path; bound the query param
// so a malicious client can't burn bandwidth/memory with a 100 MB URL.
const pathSchema = z
  .string()
  .min(1, "path must not be empty")
  .max(1024, "path is too long");

export async function GET(req: Request): Promise<Response> {
  const actor = await getActor();
  if (!actor) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  const { searchParams } = new URL(req.url);
  const pathParam = searchParams.get("path");
  const parsed = pathSchema.safeParse(pathParam);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "bad_request", detail: "path query parameter is required and must be non-empty" }),
      { status: 400, headers: JSON_HEADERS },
    );
  }

  try {
    const result = await container.getFile(parsed.data);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (err) {
    if (err instanceof FileNotFoundError || err instanceof InvalidPathError) {
      return new Response(
        JSON.stringify({ error: "not_found", detail: err.message }),
        { status: err instanceof InvalidPathError ? 400 : 404, headers: JSON_HEADERS },
      );
    }
    const message = err instanceof Error ? err.message : "upstream error";
    return new Response(
      JSON.stringify({ error: "upstream_failure", detail: message }),
      { status: 502, headers: JSON_HEADERS },
    );
  }
}
