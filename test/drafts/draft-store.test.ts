// @vitest-environment jsdom
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import {
  deleteDraft,
  getDraft,
  hasDraft,
  listDirtyPaths,
  saveDraft,
} from "@/modules/drafts/infrastructure/draft-store";

describe("draft-store", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saveDraft then getDraft returns stored content with updatedAt", async () => {
    const before = Date.now();
    await saveDraft("Home.md", { content: "# Hi", baseSha: "abc" });
    const draft = await getDraft("Home.md");
    expect(draft).toBeDefined();
    expect(draft?.content).toBe("# Hi");
    expect(draft?.baseSha).toBe("abc");
    expect(typeof draft?.updatedAt).toBe("number");
    expect(draft!.updatedAt).toBeGreaterThanOrEqual(before);
  });

  it("after saveDraft, listDirtyPaths includes path and hasDraft is true", async () => {
    await saveDraft("Home.md", { content: "# Hi", baseSha: "abc" });
    expect(hasDraft("Home.md")).toBe(true);
    expect(listDirtyPaths()).toContain("Home.md");
    const raw = localStorage.getItem("sgnk-md:dirty");
    expect(raw).not.toBeNull();
    const parsed: unknown = JSON.parse(raw!);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed as string[]).toContain("Home.md");
  });

  it("deleteDraft removes draft and dirty index entry", async () => {
    await saveDraft("Home.md", { content: "# Hi", baseSha: "abc" });
    await deleteDraft("Home.md");
    const draft = await getDraft("Home.md");
    expect(draft).toBeUndefined();
    expect(hasDraft("Home.md")).toBe(false);
    expect(listDirtyPaths()).not.toContain("Home.md");
    const raw = localStorage.getItem("sgnk-md:dirty");
    const parsed: string[] = raw !== null ? (JSON.parse(raw) as string[]) : [];
    expect(parsed).not.toContain("Home.md");
  });

  it("two different paths both tracked; deleting one keeps the other", async () => {
    await saveDraft("Home.md", { content: "# Home", baseSha: "sha1" });
    await saveDraft("Notes.md", { content: "# Notes", baseSha: "sha2" });

    expect(hasDraft("Home.md")).toBe(true);
    expect(hasDraft("Notes.md")).toBe(true);
    expect(listDirtyPaths()).toContain("Home.md");
    expect(listDirtyPaths()).toContain("Notes.md");

    await deleteDraft("Home.md");

    expect(hasDraft("Home.md")).toBe(false);
    expect(hasDraft("Notes.md")).toBe(true);
    expect(listDirtyPaths()).not.toContain("Home.md");
    expect(listDirtyPaths()).toContain("Notes.md");

    const draft = await getDraft("Notes.md");
    expect(draft?.content).toBe("# Notes");
  });
});
