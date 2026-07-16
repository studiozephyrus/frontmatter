/**
 * remove-share.test.ts — application unit tests for the RemoveShare use-case.
 */
import { describe, it, expect, vi } from "vitest";
import { makeRemoveShare } from "@/modules/share/application/remove-share";
import type { ShareWriter } from "@/modules/share/application/ports";

describe("makeRemoveShare", () => {
  it("calls writer.writeSlug(path, null) and returns sha", async () => {
    const writer: ShareWriter = { writeSlug: vi.fn(async () => ({ sha: "sha-1" })) };
    const removeShare = makeRemoveShare({ writer });
    const result = await removeShare("A.md");
    expect(result).toEqual({ path: "A.md", sha: "sha-1" });
    expect(writer.writeSlug).toHaveBeenCalledWith("A.md", null);
  });
  it("propagates writer errors", async () => {
    const writer: ShareWriter = {
      writeSlug: vi.fn(async () => { throw new Error("upstream"); }),
    };
    const removeShare = makeRemoveShare({ writer });
    await expect(removeShare("A.md")).rejects.toThrow("upstream");
  });
});
