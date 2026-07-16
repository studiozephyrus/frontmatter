/**
 * GET /api/share/conflicts — returns slugs claimed by >1 note.
 *
 * The shell calls this on load to detect duplicates introduced by Obsidian /
 * git sync (which bypasses the UI uniqueness check). Auth-required.
 */

export const dynamic = "force-dynamic";

import { getActor } from "@/modules/auth";
import { shareApi } from "@/container/dependency-container";

const JSON_HEADERS = { "content-type": "application/json" } as const;

export async function GET(): Promise<Response> {
  const actor = await getActor();
  if (!actor) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: JSON_HEADERS });
  try {
    const conflicts = await shareApi.listConflicts();
    return new Response(JSON.stringify({ conflicts }), { status: 200, headers: JSON_HEADERS });
  } catch {
    // Duplicate-slug detection is a non-critical background nicety. If the
    // underlying snapshot build hiccups (transient GitHub upstream error),
    // never crash with a 500 — return an empty set so the shell stays quiet.
    // The next focus / poll retries.
    return new Response(JSON.stringify({ conflicts: [] }), { status: 200, headers: JSON_HEADERS });
  }
}
