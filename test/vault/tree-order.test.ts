import { describe, it, expect } from "vitest";
import { orderTree } from "@/modules/vault/presentation/tree-order";
import type { TreeNode } from "@/modules/vault/application/dto";

describe("orderTree", () => {
  it("sorts folders before files, alphabetical within each group, _Archive last", () => {
    const input: TreeNode = {
      name: "root",
      path: "",
      type: "folder",
      children: [
        { name: "z-file.md", path: "z-file.md", type: "file" },
        { name: "beta", path: "beta", type: "folder", children: [] },
        { name: "a-file.md", path: "a-file.md", type: "file" },
        {
          name: "_Archive",
          path: "_Archive",
          type: "folder",
          children: [{ name: "old.md", path: "_Archive/old.md", type: "file" }],
        },
        { name: "alpha", path: "alpha", type: "folder", children: [] },
        { name: "m-file.md", path: "m-file.md", type: "file" },
      ],
    };

    const result = orderTree(input);
    const children = result.children!;

    expect(children).toHaveLength(6);

    // folders come first
    expect(children[0]!.type).toBe("folder");
    expect(children[1]!.type).toBe("folder");
    expect(children[2]!.type).toBe("folder");

    // files come after
    expect(children[3]!.type).toBe("file");
    expect(children[4]!.type).toBe("file");
    expect(children[5]!.type).toBe("file");

    // non-_Archive folders are sorted alphabetically
    expect(children[0]!.name).toBe("alpha");
    expect(children[1]!.name).toBe("beta");

    // _Archive is last among folders
    expect(children[2]!.name).toBe("_Archive");

    // files are sorted alphabetically
    expect(children[3]!.name).toBe("a-file.md");
    expect(children[4]!.name).toBe("m-file.md");
    expect(children[5]!.name).toBe("z-file.md");
  });

  it("returns a deep copy — does not mutate the original", () => {
    const original: TreeNode = {
      name: "root",
      path: "",
      type: "folder",
      children: [
        { name: "b.md", path: "b.md", type: "file" },
        { name: "a.md", path: "a.md", type: "file" },
      ],
    };
    const originalOrder = original.children!.map((c) => c.name);
    orderTree(original);
    expect(original.children!.map((c) => c.name)).toEqual(originalOrder);
  });

  it("recursively orders nested children", () => {
    const input: TreeNode = {
      name: "root",
      path: "",
      type: "folder",
      children: [
        {
          name: "folder",
          path: "folder",
          type: "folder",
          children: [
            { name: "z.md", path: "folder/z.md", type: "file" },
            { name: "a.md", path: "folder/a.md", type: "file" },
          ],
        },
      ],
    };
    const result = orderTree(input);
    const inner = result.children![0]!;
    expect(inner.children![0]!.name).toBe("a.md");
    expect(inner.children![1]!.name).toBe("z.md");
  });

  it("handles nodes with no children gracefully", () => {
    const input: TreeNode = { name: "file.md", path: "file.md", type: "file" };
    const result = orderTree(input);
    expect(result).toEqual(input);
    expect(result.children).toBeUndefined();
  });
});
