import { describe, it, expect } from "vitest";
import { insertNodeIntoTree } from "@/modules/vault/presentation/tree-insert";
import type { TreeNode } from "@/modules/vault/application/dto";

function root(children: TreeNode[]): TreeNode {
  return { name: "", path: "", type: "folder", children };
}

describe("insertNodeIntoTree", () => {
  it("inserts a top-level file", () => {
    const tree = root([{ name: "A.md", path: "A.md", type: "file" }]);
    const next = insertNodeIntoTree(tree, "B.md", "file");
    const names = next.children!.map((c) => c.name);
    expect(names).toContain("B.md");
    const b = next.children!.find((c) => c.name === "B.md")!;
    expect(b.type).toBe("file");
    expect(b.path).toBe("B.md");
  });

  it("inserts a file into an existing folder", () => {
    const tree = root([
      { name: "Folder", path: "Folder", type: "folder", children: [{ name: "X.md", path: "Folder/X.md", type: "file" }] },
    ]);
    const next = insertNodeIntoTree(tree, "Folder/Y.md", "file");
    const folder = next.children!.find((c) => c.name === "Folder")!;
    expect(folder.children!.map((c) => c.path)).toEqual(["Folder/X.md", "Folder/Y.md"]);
  });

  it("creates intermediate folders for a nested path", () => {
    const tree = root([]);
    const next = insertNodeIntoTree(tree, "A/B/C.md", "file");
    const a = next.children!.find((c) => c.name === "A")!;
    expect(a.type).toBe("folder");
    const b = a.children!.find((c) => c.name === "B")!;
    expect(b.path).toBe("A/B");
    const c = b.children!.find((n) => n.name === "C.md")!;
    expect(c).toMatchObject({ path: "A/B/C.md", type: "file" });
  });

  it("inserts a folder leaf with an empty children array", () => {
    const next = insertNodeIntoTree(root([]), "NewFolder", "folder");
    const f = next.children!.find((c) => c.name === "NewFolder")!;
    expect(f).toMatchObject({ type: "folder", path: "NewFolder" });
    expect(f.children).toEqual([]);
  });

  it("is a no-op when the leaf already exists", () => {
    const tree = root([{ name: "A.md", path: "A.md", type: "file" }]);
    const next = insertNodeIntoTree(tree, "A.md", "file");
    expect(next).toBe(tree); // same identity — nothing changed
  });

  it("returns a new root identity but preserves untouched branches", () => {
    const untouched: TreeNode = { name: "Keep", path: "Keep", type: "folder", children: [] };
    const tree = root([untouched]);
    const next = insertNodeIntoTree(tree, "New.md", "file");
    expect(next).not.toBe(tree); // root changed
    const keep = next.children!.find((c) => c.name === "Keep")!;
    expect(keep).toBe(untouched); // untouched branch keeps identity
  });
});
