export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

import { getActor } from "@/modules/auth";
import { container } from "@/container/dependency-container";

const JSON_HEADERS = { "content-type": "application/json" } as const;
const MAX_PATHS = 50;

export async function POST(req: Request): Promise<Response> {
  const actor = await getActor();
  if (!actor) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: JSON_HEADERS,
    });
  }

  let body: { paths?: string[] };
  try {
    body = (await req.json()) as { paths?: string[] };
  } catch {
    return new Response(JSON.stringify({ error: "bad_request" }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  if (!Array.isArray(body.paths) || body.paths.length === 0) {
    return new Response(
      JSON.stringify({ error: "bad_request", detail: "paths required" }),
      { status: 400, headers: JSON_HEADERS },
    );
  }

  const paths = body.paths
    .filter((p): p is string => typeof p === "string" && p.endsWith(".md"))
    .slice(0, MAX_PATHS);

  if (paths.length === 0) {
    return new Response(JSON.stringify({ results: [], errors: [] }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  }

  try {
    const snapshot = await container.getSnapshot();
    const candidates: string[] = [];
    for (const n of snapshot.notes) {
      const last = n.path.split("/").pop() ?? n.path;
      const base = last.endsWith(".md") ? last.slice(0, -3) : last;
      candidates.push(base);
    }

    const output = await container.linkDoctor({
      paths,
      candidates,
      getFile: async (p) => {
        const f = await container.getFile(p);
        return { content: f.content, sha: f.sha };
      },
    });
    return new Response(JSON.stringify(output), { status: 200, headers: JSON_HEADERS });
  } catch (err) {
    const detail = err instanceof Error ? err.message : "ai error";
    return new Response(JSON.stringify({ error: "ai_failed", detail }), {
      status: 502,
      headers: JSON_HEADERS,
    });
  }
}
