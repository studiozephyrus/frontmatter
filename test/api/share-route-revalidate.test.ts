/**
 * §6.4 — unpublish must purge the REAL cached public page, not the legacy
 * /p/[slug] redirect stub (which has `revalidate = false` and no content of
 * its own). Without this, an unpublished note stays readable at /<slug> for
 * up to 60s (the ISR window on src/app/(public)/[slug]/page.tsx).
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

const revalidatePath = vi.fn();
vi.mock("next/cache", () => ({ revalidatePath: (p: string) => revalidatePath(p) }));

const removeShare = vi.fn();
const clearSnapshotCache = vi.fn();
const getSnapshot = vi.fn();
const getActor = vi.fn();

vi.mock("@/container/dependency-container", () => ({
  shareApi: { removeShare: (p: string) => removeShare(p) },
  container: {
    clearSnapshotCache: () => clearSnapshotCache(),
    getSnapshot: () => getSnapshot(),
  },
}));

vi.mock("@/modules/auth", () => ({ getActor: () => getActor() }));

import { DELETE } from "@/app/api/share/route";

beforeEach(() => {
  revalidatePath.mockReset();
  removeShare.mockReset();
  clearSnapshotCache.mockReset();
  getSnapshot.mockReset();
  getActor.mockReset();
});

function jsonReq(body: unknown): Request {
  return new Request("https://x/api/share", {
    method: "DELETE",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("DELETE /api/share — cache revocation", () => {
  it("purges the real public page /<slug>, not the /p/<slug> redirect stub", async () => {
    getActor.mockResolvedValueOnce({ id: "u" });
    getSnapshot.mockResolvedValueOnce({ notes: [{ path: "A.md", publicSlug: "my-note" }] });
    removeShare.mockResolvedValueOnce({ path: "A.md", sha: "s" });

    const res = await DELETE(jsonReq({ path: "A.md" }));

    expect(res.status).toBe(200);
    expect(revalidatePath).toHaveBeenCalledWith("/my-note");
    expect(revalidatePath).not.toHaveBeenCalledWith("/p/my-note");
  });

  it("does nothing when the note had no public slug", async () => {
    getActor.mockResolvedValueOnce({ id: "u" });
    getSnapshot.mockResolvedValueOnce({ notes: [{ path: "A.md", publicSlug: undefined }] });
    removeShare.mockResolvedValueOnce({ path: "A.md", sha: "s" });

    const res = await DELETE(jsonReq({ path: "A.md" }));

    expect(res.status).toBe(200);
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
