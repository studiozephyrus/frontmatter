/**
 * share-conflicts-route.test.ts — GET /api/share/conflicts.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

const listConflicts = vi.fn();
const getActor = vi.fn();

vi.mock("@/container/dependency-container", () => ({
  shareApi: { listConflicts: () => listConflicts() },
}));
vi.mock("@/modules/auth", () => ({
  getActor: () => getActor(),
}));

import { GET } from "@/app/api/share/conflicts/route";

beforeEach(() => {
  listConflicts.mockReset();
  getActor.mockReset();
});

describe("GET /api/share/conflicts", () => {
  it("401 unauthenticated", async () => {
    getActor.mockResolvedValueOnce(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });
  it("200 with conflicts array", async () => {
    getActor.mockResolvedValueOnce({ id: "u" });
    listConflicts.mockResolvedValueOnce([{ slug: "x", notes: [{ path: "A.md", title: "A" }, { path: "B.md", title: "B" }] }]);
    const res = await GET();
    expect(res.status).toBe(200);
    const body = (await res.json()) as { conflicts: unknown[] };
    expect(body.conflicts).toHaveLength(1);
  });
  it("200 with [] when no conflicts", async () => {
    getActor.mockResolvedValueOnce({ id: "u" });
    listConflicts.mockResolvedValueOnce([]);
    const res = await GET();
    expect(res.status).toBe(200);
    const body = (await res.json()) as { conflicts: unknown[] };
    expect(body.conflicts).toEqual([]);
  });
});
