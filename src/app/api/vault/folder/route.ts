/**
 * POST /api/vault/folder
 *
 * Body:
 *   { op: "create", path: "Foo/Bar" }
 *     → creates Foo/Bar/.gitkeep (so folder is visible in git + tree).
 *
 *   { op: "rename", oldPath: "Foo", newPath: "Baz" }
 *     → renames every file under Foo/* to Baz/*, in ONE commit (atomic).
 *     → inbound wikilinks are NOT rewritten (Obsidian doesn't either for
 *       folder moves — only file renames). Files keep their basenames.
 *
 *   { op: "delete", path: "Foo" }
 *     → deletes every file in Foo/ recursively, in ONE commit.
 *
 * Folder ops use commitChanges so they're conflict-detected (baseSha per file).
 * Auth-gated.
 */

export const dynamic = "force-dynamic";

import { z } from "zod";
import { getActor } from "@/modules/auth";
import { container } from "@/container/dependency-container";
import { ConflictError } from "@/modules/repository";

const JSON_HEADERS = { "content-type": "application/json" } as const;
const unauth = () => new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: JSON_HEADERS });

const schema = z.discriminatedUnion("op", [
  z.object({ op: z.literal("create"), path: z.string().min(1) }),
  z.object({ op: z.literal("rename"), oldPath: z.string().min(1), newPath: z.string().min(1) }),
  z.object({ op: z.literal("delete"), path: z.string().min(1) }),
]);

// Repo code/config dirs + the soft-delete bucket are off-limits to folder ops.
const BLOCKED_FOLDER_PREFIXES = ["src", "docs", "specs", "public", ".github", ".claude", ".vercel", "node_modules", "_Trash"];

// Forbid traversal, leading/trailing slashes, empty segments, and out-of-vault
// targets (so e.g. `op:create path:"src"` can't write into the app source tree).
function validateFolderPath(p: string): string {
  if (p.includes("..") || p.startsWith("/") || p.endsWith("/") || /\/\/+/.test(p)) {
    throw new Error("invalid folder path");
  }
  const trimmed = p.trim();
  const top = trimmed.split("/")[0] ?? "";
  if (BLOCKED_FOLDER_PREFIXES.includes(top)) {
    throw new Error("folder is outside the vault");
  }
  return trimmed;
}

export async function POST(req: Request): Promise<Response> {
  const actor = await getActor();
  if (!actor) return unauth();
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: "bad_request", detail: parsed.error.message }), { status: 400, headers: JSON_HEADERS });
  }

  try {
    if (parsed.data.op === "create") {
      const folder = validateFolderPath(parsed.data.path);
      const keep = `${folder}/.gitkeep`;
      // Idempotent: if .gitkeep already exists, treat as success.
      const existing = await container.getBlobSha(keep);
      if (existing) {
        return new Response(JSON.stringify({ ok: true, path: folder, created: false }), { status: 200, headers: JSON_HEADERS });
      }
      await container.commitChanges({
        files: [{ path: keep, content: "", baseSha: "" }],
        message: `folder: create ${folder}`,
      });
      container.clearSnapshotCache();
      return new Response(JSON.stringify({ ok: true, path: folder, created: true }), { status: 200, headers: JSON_HEADERS });
    }

    if (parsed.data.op === "rename") {
      const oldPath = validateFolderPath(parsed.data.oldPath);
      const newPath = validateFolderPath(parsed.data.newPath);
      if (oldPath === newPath) {
        return new Response(JSON.stringify({ ok: true, moved: 0 }), { status: 200, headers: JSON_HEADERS });
      }
      const snapshot = await container.getSnapshot();
      const prefix = `${oldPath}/`;
      const affected = snapshot.notes.filter((n) => n.path.startsWith(prefix));
      if (affected.length === 0) {
        return new Response(JSON.stringify({ error: "not_found", detail: `${oldPath} is empty or absent` }), { status: 404, headers: JSON_HEADERS });
      }
      // Read every file content + sha, build move set: delete old + create new.
      const moves = await Promise.all(
        affected.map(async (note) => {
          const file = await container.getFile(note.path);
          const newFilePath = `${newPath}/${note.path.slice(prefix.length)}`;
          return { oldPath: note.path, newFilePath, content: file.content, sha: file.sha };
        }),
      );
      await container.commitChanges({
        files: moves.map((m) => ({ path: m.newFilePath, content: m.content, baseSha: "" })),
        deletions: moves.map((m) => ({ path: m.oldPath, baseSha: m.sha })),
        message: `folder: rename ${oldPath} → ${newPath}`,
      });
      container.clearSnapshotCache();
      return new Response(JSON.stringify({ ok: true, moved: moves.length }), { status: 200, headers: JSON_HEADERS });
    }

    if (parsed.data.op === "delete") {
      const folder = validateFolderPath(parsed.data.path);
      const snapshot = await container.getSnapshot();
      const prefix = `${folder}/`;
      const affected = snapshot.notes.filter((n) => n.path.startsWith(prefix));
      if (affected.length === 0) {
        // No notes — try to remove .gitkeep only.
        const keep = `${folder}/.gitkeep`;
        const sha = await container.getBlobSha(keep);
        if (sha) {
          await container.commitChanges({
            files: [], deletions: [{ path: keep, baseSha: sha }],
            message: `folder: delete ${folder}`,
          });
          container.clearSnapshotCache();
        }
        return new Response(JSON.stringify({ ok: true, deleted: 0 }), { status: 200, headers: JSON_HEADERS });
      }
      const deletions = await Promise.all(
        affected.map(async (n) => ({ path: n.path, baseSha: (await container.getBlobSha(n.path)) ?? "" })),
      );
      await container.commitChanges({
        files: [], deletions,
        message: `folder: delete ${folder} (${affected.length} files)`,
      });
      container.clearSnapshotCache();
      return new Response(JSON.stringify({ ok: true, deleted: affected.length }), { status: 200, headers: JSON_HEADERS });
    }
  } catch (err) {
    if (err instanceof ConflictError) {
      return new Response(JSON.stringify({ error: "conflict", detail: err.message }), { status: 409, headers: JSON_HEADERS });
    }
    const message = err instanceof Error ? err.message : "upstream error";
    return new Response(JSON.stringify({ error: "upstream_failure", detail: message }), { status: 502, headers: JSON_HEADERS });
  }

  return new Response(JSON.stringify({ error: "bad_request" }), { status: 400, headers: JSON_HEADERS });
}
