/**
 * folder-route.test.ts — POST /api/vault/folder { op: create | rename | delete }.
 *
 * Validates: auth gate, path-traversal rejection, idempotent create,
 * bulk rename, recursive delete, missing-folder 404, ConflictError 409.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ConflictError } from "@/modules/repository/domain/commit";
import type { VaultSnapshot } from "@/modules/vault/application/dto";

// Mock container before importing the route.
const commitChanges = vi.fn();
const getBlobSha = vi.fn();
const getFile = vi.fn();
const getSnapshot = vi.fn<() => Promise<VaultSnapshot>>();
const clearSnapshotCache = vi.fn();
const getActor = vi.fn();

vi.mock("@/container/dependency-container", () => ({
  container: {
    commitChanges: (r: unknown) => commitChanges(r),
    getBlobSha: (p: string) => getBlobSha(p),
    getFile: (p: string) => getFile(p),
    getSnapshot: () => getSnapshot(),
    clearSnapshotCache: () => clearSnapshotCache(),
  },
}));
vi.mock("@/modules/auth", () => ({ getActor: () => getActor() }));

import { POST } from "@/app/api/vault/folder/route";

beforeEach(() => {
  commitChanges.mockReset();
  getBlobSha.mockReset();
  getFile.mockReset();
  getSnapshot.mockReset();
  clearSnapshotCache.mockReset();
  getActor.mockReset();
});

function req(body: unknown): Request {
  return new Request("https://x/api/vault/folder", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function emptySnapshot(): VaultSnapshot {
  return { sha: "x", generatedAt: "2026-01-01", tree: { name: "", path: "", type: "folder", children: [] }, notes: [] };
}

describe("auth gate", () => {
  it("401 unauthenticated", async () => {
    getActor.mockResolvedValueOnce(null);
    const res = await POST(req({ op: "create", path: "Foo" }));
    expect(res.status).toBe(401);
  });
});

describe("op: create", () => {
  beforeEach(() => getActor.mockResolvedValue({ id: "u" }));

  it("400 on path traversal", async () => {
    const res = await POST(req({ op: "create", path: "../etc" }));
    expect(res.status).toBe(502); // path validation throws → caught as upstream
    const body = (await res.json()) as { detail: string };
    expect(body.detail).toMatch(/invalid folder path/i);
  });

  it("400 on leading slash", async () => {
    const res = await POST(req({ op: "create", path: "/Foo" }));
    expect(res.status).toBe(502);
  });

  it("creates .gitkeep when folder doesn't exist", async () => {
    getBlobSha.mockResolvedValueOnce(null);
    commitChanges.mockResolvedValueOnce({ commitSha: "c1" });
    const res = await POST(req({ op: "create", path: "Foo/Bar" }));
    expect(res.status).toBe(200);
    expect(commitChanges).toHaveBeenCalledTimes(1);
    const call = commitChanges.mock.calls[0]?.[0] as { files: Array<{ path: string }> };
    expect(call.files[0]?.path).toBe("Foo/Bar/.gitkeep");
    expect(clearSnapshotCache).toHaveBeenCalledTimes(1);
    const body = (await res.json()) as { created: boolean };
    expect(body.created).toBe(true);
  });

  it("is idempotent when .gitkeep already exists", async () => {
    getBlobSha.mockResolvedValueOnce("existing-sha");
    const res = await POST(req({ op: "create", path: "Foo" }));
    expect(res.status).toBe(200);
    expect(commitChanges).not.toHaveBeenCalled();
    const body = (await res.json()) as { created: boolean };
    expect(body.created).toBe(false);
  });
});

describe("op: rename", () => {
  beforeEach(() => getActor.mockResolvedValue({ id: "u" }));

  it("404 when source folder has no files", async () => {
    getSnapshot.mockResolvedValueOnce(emptySnapshot());
    const res = await POST(req({ op: "rename", oldPath: "Empty", newPath: "Renamed" }));
    expect(res.status).toBe(404);
  });

  it("200 + bulk-moves every file under oldPath", async () => {
    getSnapshot.mockResolvedValueOnce({
      ...emptySnapshot(),
      notes: [
        { path: "Old/a.md", title: "a", tags: [], outbound: [], backlinks: [], excludeFromGraph: false },
        { path: "Old/sub/b.md", title: "b", tags: [], outbound: [], backlinks: [], excludeFromGraph: false },
        { path: "Other/c.md", title: "c", tags: [], outbound: [], backlinks: [], excludeFromGraph: false },
      ],
    });
    getFile.mockImplementation(async (p: string) => ({ content: `body of ${p}`, sha: `sha-${p}` }));
    commitChanges.mockResolvedValueOnce({ commitSha: "c2" });
    const res = await POST(req({ op: "rename", oldPath: "Old", newPath: "New" }));
    expect(res.status).toBe(200);
    const call = commitChanges.mock.calls[0]?.[0] as { files: Array<{ path: string }>; deletions: Array<{ path: string }> };
    // Only "Old/*" files moved; "Other/c.md" untouched.
    expect(call.files.map((f) => f.path).sort()).toEqual(["New/a.md", "New/sub/b.md"]);
    expect(call.deletions.map((d) => d.path).sort()).toEqual(["Old/a.md", "Old/sub/b.md"]);
    const body = (await res.json()) as { moved: number };
    expect(body.moved).toBe(2);
  });

  it("is a no-op when oldPath === newPath", async () => {
    const res = await POST(req({ op: "rename", oldPath: "Same", newPath: "Same" }));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { moved: number };
    expect(body.moved).toBe(0);
  });
});

describe("op: delete", () => {
  beforeEach(() => getActor.mockResolvedValue({ id: "u" }));

  it("recursively deletes every file under the folder in one commit", async () => {
    getSnapshot.mockResolvedValueOnce({
      ...emptySnapshot(),
      notes: [
        { path: "Old/a.md", title: "a", tags: [], outbound: [], backlinks: [], excludeFromGraph: false },
        { path: "Old/sub/b.md", title: "b", tags: [], outbound: [], backlinks: [], excludeFromGraph: false },
      ],
    });
    getBlobSha.mockImplementation(async (p: string) => `sha-${p}`);
    commitChanges.mockResolvedValueOnce({ commitSha: "c3" });
    const res = await POST(req({ op: "delete", path: "Old" }));
    expect(res.status).toBe(200);
    const call = commitChanges.mock.calls[0]?.[0] as { deletions: Array<{ path: string }>; files: unknown[] };
    expect(call.deletions.map((d) => d.path).sort()).toEqual(["Old/a.md", "Old/sub/b.md"]);
    expect(call.files).toEqual([]);
    const body = (await res.json()) as { deleted: number };
    expect(body.deleted).toBe(2);
  });

  it("removes a stray .gitkeep when the folder is empty of notes", async () => {
    getSnapshot.mockResolvedValueOnce(emptySnapshot());
    getBlobSha.mockResolvedValueOnce("keep-sha");
    commitChanges.mockResolvedValueOnce({ commitSha: "c4" });
    const res = await POST(req({ op: "delete", path: "Empty" }));
    expect(res.status).toBe(200);
    const call = commitChanges.mock.calls[0]?.[0] as { deletions: Array<{ path: string }> };
    expect(call.deletions[0]?.path).toBe("Empty/.gitkeep");
  });
});

describe("ConflictError mapping", () => {
  beforeEach(() => getActor.mockResolvedValue({ id: "u" }));

  it("returns 409 when commitChanges raises ConflictError", async () => {
    getBlobSha.mockResolvedValueOnce(null);
    commitChanges.mockRejectedValueOnce(new ConflictError(["Foo/.gitkeep"]));
    const res = await POST(req({ op: "create", path: "Foo" }));
    expect(res.status).toBe(409);
  });
});
