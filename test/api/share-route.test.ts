/**
 * share-route.test.ts — API route tests for POST/DELETE/GET /api/share.
 *
 * Auth-gated. Returns 409 on slug conflict, 422 on invalid slug, 200 on success.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the container BEFORE importing the route.
const setShare = vi.fn();
const removeShare = vi.fn();
const listShares = vi.fn();
const clearSnapshotCache = vi.fn();
const getActor = vi.fn();

vi.mock("@/container/dependency-container", () => ({
  shareApi: {
    setShare: (input: { path: string; slug: string }) => setShare(input),
    removeShare: (p: string) => removeShare(p),
    listShares: () => listShares(),
  },
  container: { clearSnapshotCache: () => clearSnapshotCache() },
}));

vi.mock("@/modules/auth", () => ({
  getActor: () => getActor(),
}));

import { GET, POST, DELETE } from "@/app/api/share/route";
import { InvalidSlugError, SlugConflictError } from "@/modules/share/domain/slug";

beforeEach(() => {
  setShare.mockReset();
  removeShare.mockReset();
  listShares.mockReset();
  clearSnapshotCache.mockReset();
  getActor.mockReset();
});

function jsonReq(method: "POST" | "DELETE", body: unknown): Request {
  return new Request("https://x/api/share", {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("GET /api/share — auth", () => {
  it("401 when not authenticated", async () => {
    getActor.mockResolvedValueOnce(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });
  it("200 with shares when authenticated", async () => {
    getActor.mockResolvedValueOnce({ id: "u" });
    listShares.mockResolvedValueOnce([{ path: "A.md", slug: "a", title: "A" }]);
    const res = await GET();
    expect(res.status).toBe(200);
    const body = (await res.json()) as { shares: unknown[] };
    expect(body.shares).toHaveLength(1);
  });
});

describe("POST /api/share — validation + auth", () => {
  it("401 when not authenticated", async () => {
    getActor.mockResolvedValueOnce(null);
    const res = await POST(jsonReq("POST", { path: "A.md", slug: "x" }));
    expect(res.status).toBe(401);
    expect(setShare).not.toHaveBeenCalled();
  });
  it("400 on bad body schema", async () => {
    getActor.mockResolvedValueOnce({ id: "u" });
    const res = await POST(jsonReq("POST", { path: "" }));
    expect(res.status).toBe(400);
  });
  it("400 on non-JSON body", async () => {
    getActor.mockResolvedValueOnce({ id: "u" });
    const req = new Request("https://x/api/share", { method: "POST", body: "not json" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("POST /api/share — use-case errors", () => {
  it("409 on SlugConflictError, surfaces conflictPath", async () => {
    getActor.mockResolvedValueOnce({ id: "u" });
    setShare.mockRejectedValueOnce(new SlugConflictError("x", "B.md"));
    const res = await POST(jsonReq("POST", { path: "A.md", slug: "x" }));
    expect(res.status).toBe(409);
    const body = (await res.json()) as { error: string; slug: string; conflictPath: string };
    expect(body.error).toBe("slug_conflict");
    expect(body.slug).toBe("x");
    expect(body.conflictPath).toBe("B.md");
  });
  it("422 on InvalidSlugError", async () => {
    getActor.mockResolvedValueOnce({ id: "u" });
    setShare.mockRejectedValueOnce(new InvalidSlugError("bad"));
    const res = await POST(jsonReq("POST", { path: "A.md", slug: "BAD" }));
    expect(res.status).toBe(422);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("invalid_slug");
  });
  it("502 on unknown upstream error", async () => {
    getActor.mockResolvedValueOnce({ id: "u" });
    setShare.mockRejectedValueOnce(new Error("github down"));
    const res = await POST(jsonReq("POST", { path: "A.md", slug: "x" }));
    expect(res.status).toBe(502);
  });
});

describe("POST /api/share — success", () => {
  it("200 + clears snapshot cache", async () => {
    getActor.mockResolvedValueOnce({ id: "u" });
    setShare.mockResolvedValueOnce({ path: "A.md", slug: "x", publicUrl: "https://md.sgnk.ai/x", sha: "s" });
    const res = await POST(jsonReq("POST", { path: "A.md", slug: "x" }));
    expect(res.status).toBe(200);
    expect(clearSnapshotCache).toHaveBeenCalledTimes(1);
    const body = (await res.json()) as { publicUrl: string };
    expect(body.publicUrl).toBe("https://md.sgnk.ai/x");
  });
});

describe("DELETE /api/share", () => {
  it("401 when not authenticated", async () => {
    getActor.mockResolvedValueOnce(null);
    const res = await DELETE(jsonReq("DELETE", { path: "A.md" }));
    expect(res.status).toBe(401);
  });
  it("400 on bad body", async () => {
    getActor.mockResolvedValueOnce({ id: "u" });
    const res = await DELETE(jsonReq("DELETE", {}));
    expect(res.status).toBe(400);
  });
  it("200 + clears snapshot cache on success", async () => {
    getActor.mockResolvedValueOnce({ id: "u" });
    removeShare.mockResolvedValueOnce({ path: "A.md", sha: "s" });
    const res = await DELETE(jsonReq("DELETE", { path: "A.md" }));
    expect(res.status).toBe(200);
    expect(clearSnapshotCache).toHaveBeenCalledTimes(1);
  });
});
