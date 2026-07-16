// @vitest-environment jsdom

/**
 * Regression test for the drag-into-own-descendant guard in moveNote().
 * Before the fix, dropping a folder onto one of its own children silently
 * sent a `Folder/Sub/Folder` rename request to the API, creating phantom
 * paths and breaking the tree.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

const toasts: string[] = [];
beforeEach(() => {
  toasts.length = 0;
  // Capture sgnk:toast events so we can assert the guard fired without
  // pulling in a full RTL render.
  if (typeof window !== "undefined") {
    window.addEventListener("sgnk:toast", (e) => {
      const detail = (e as CustomEvent<{ message: string }>).detail;
      if (detail?.message) toasts.push(detail.message);
    });
  }
});

describe("moveNote drag guard", () => {
  it("rejects moving a folder into one of its own descendants", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const { moveNote } = await import("@/modules/vault/presentation/file-tree/TreeItem");
    // Drag "Projects" onto "Projects/HQ" — newPath would be Projects/HQ/Projects.
    await moveNote("Projects", "Projects/HQ");
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(toasts.some((t) => /move a folder into itself/i.test(t))).toBe(true);
  });

  it("rejects moving a folder onto itself", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const { moveNote } = await import("@/modules/vault/presentation/file-tree/TreeItem");
    await moveNote("Projects/HQ", "Projects/HQ");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("still blocks moves into system folders", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const { moveNote } = await import("@/modules/vault/presentation/file-tree/TreeItem");
    await moveNote("Notes/foo.md", "_Trash");
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
