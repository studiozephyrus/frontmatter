/**
 * POST /api/vault/upload
 *
 * Accepts a binary file encoded as base64 and commits it to _attachments/.
 * Returns the vault-relative path of the committed attachment.
 *
 * Request body: { filename: string, dataBase64: string }
 * Response:     { path: string }
 */

export const dynamic = "force-dynamic";

import { z } from "zod";
import { getActor } from "@/modules/auth";
import { container } from "@/container/dependency-container";

const JSON_HEADERS = { "content-type": "application/json" } as const;

/** Safe filename: only word chars, dots, hyphens. Max 200 chars. */
const SAFE_FILENAME_RE = /^[\w.-]+$/;

const bodySchema = z.object({
  filename: z.string().min(1).max(200),
  dataBase64: z.string().min(1),
});

/** Allowed extensions for upload. */
const ALLOWED_EXTENSIONS = new Set([
  "png", "jpg", "jpeg", "gif", "webp", "svg",
  "pdf", "txt", "csv", "json",
  "mp4", "mov", "mp3", "wav",
]);

function sanitizeFilename(raw: string): string | null {
  // Normalize: strip path separators, trim whitespace
  const basename = raw.replace(/[/\\]/g, "").trim();
  if (!SAFE_FILENAME_RE.test(basename)) return null;
  const ext = basename.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXTENSIONS.has(ext)) return null;
  return basename;
}

export async function POST(req: Request): Promise<Response> {
  const actor = await getActor();
  if (!actor) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "bad_request", detail: "invalid JSON body" }),
      { status: 400, headers: JSON_HEADERS },
    );
  }

  const parsed = bodySchema.safeParse(rawBody);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        error: "bad_request",
        detail: parsed.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; "),
      }),
      { status: 400, headers: JSON_HEADERS },
    );
  }

  const sanitized = sanitizeFilename(parsed.data.filename);
  if (!sanitized) {
    return new Response(
      JSON.stringify({ error: "bad_request", detail: "invalid or disallowed filename" }),
      { status: 400, headers: JSON_HEADERS },
    );
  }

  try {
    const result = await container.uploadAttachment({
      filename: sanitized,
      dataBase64: parsed.data.dataBase64,
    });
    return new Response(JSON.stringify({ path: result.path }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "upload failed";
    return new Response(JSON.stringify({ error: "upload_failed", detail: message }), {
      status: 502,
      headers: JSON_HEADERS,
    });
  }
}
