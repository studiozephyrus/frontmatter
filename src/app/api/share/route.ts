/**
 * POST   /api/share        body: { path, slug }   — assign slug (auth)
 * DELETE /api/share        body: { path }         — unpublish (auth)
 * GET    /api/share        list current shares    (auth)
 *
 * Slug validation + uniqueness happens server-side. UI MUST surface the
 * `slug_conflict` body so the user can pick a different slug.
 */

export const dynamic = "force-dynamic";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getActor } from "@/modules/auth";
import { shareApi, container } from "@/container/dependency-container";
import { InvalidSlugError, SlugConflictError } from "@/modules/share/domain/slug";

const JSON_HEADERS = { "content-type": "application/json" } as const;
const unauth = () => new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: JSON_HEADERS });

const postSchema = z.object({ path: z.string().min(1), slug: z.string().min(1).max(60) });
const deleteSchema = z.object({ path: z.string().min(1) });

export async function GET(): Promise<Response> {
  const actor = await getActor();
  if (!actor) return unauth();
  const shares = await shareApi.listShares();
  return new Response(JSON.stringify({ shares }), { status: 200, headers: JSON_HEADERS });
}

export async function POST(req: Request): Promise<Response> {
  const actor = await getActor();
  if (!actor) return unauth();
  const body = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "bad_request", detail: parsed.error.message }), { status: 400, headers: JSON_HEADERS });
  }
  try {
    const result = await shareApi.setShare(parsed.data);
    container.clearSnapshotCache();
    return new Response(JSON.stringify(result), { status: 200, headers: JSON_HEADERS });
  } catch (err) {
    if (err instanceof SlugConflictError) {
      return new Response(JSON.stringify({ error: "slug_conflict", slug: parsed.data.slug, conflictPath: err.conflictPath, detail: err.message }), { status: 409, headers: JSON_HEADERS });
    }
    if (err instanceof InvalidSlugError) {
      return new Response(JSON.stringify({ error: "invalid_slug", detail: err.message }), { status: 422, headers: JSON_HEADERS });
    }
    const message = err instanceof Error ? err.message : "upstream error";
    return new Response(JSON.stringify({ error: "upstream_failure", detail: message }), { status: 502, headers: JSON_HEADERS });
  }
}

export async function DELETE(req: Request): Promise<Response> {
  const actor = await getActor();
  if (!actor) return unauth();
  const body = await req.json().catch(() => null);
  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "bad_request", detail: parsed.error.message }), { status: 400, headers: JSON_HEADERS });
  }
  try {
    // Grab the slug BEFORE removal so we can purge its ISR-cached public page
    // (otherwise an unpublished note stays readable at /<slug> for up to 60s).
    // The real page lives at /<slug> (revalidate = 60) — /p/<slug> is only a
    // permanent-redirect stub (revalidate = false) kept for old links.
    let slug: string | undefined;
    try {
      const snap = await container.getSnapshot();
      slug = snap.notes.find((n) => n.path === parsed.data.path)?.publicSlug;
    } catch {
      /* best-effort */
    }
    const result = await shareApi.removeShare(parsed.data.path);
    container.clearSnapshotCache();
    if (slug) revalidatePath(`/${slug}`);
    return new Response(JSON.stringify(result), { status: 200, headers: JSON_HEADERS });
  } catch (err) {
    const message = err instanceof Error ? err.message : "upstream error";
    return new Response(JSON.stringify({ error: "upstream_failure", detail: message }), { status: 502, headers: JSON_HEADERS });
  }
}
