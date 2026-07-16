/**
 * Optimistic tree insertion for the file sidebar.
 *
 * Creating a note/folder commits to GitHub (~1s, several sequential API calls)
 * before the snapshot refresh shows it in the tree — so the file appeared to
 * "not happen" for over a second. `insertNodeIntoTree` lets the UI drop the new
 * node into the tree IMMEDIATELY; the background snapshot refresh then fully
 * replaces the tree with server truth, so this is a purely visual bridge and
 * never diverges from the source of truth.
 *
 * Pure and immutable: returns a new tree (changed nodes get new identities so
 * memoised consumers re-render); existing nodes on untouched branches keep
 * their identity. Inserting a path whose leaf already exists is a no-op.
 */
import type { TreeNode } from "@/modules/vault/application/dto";

export function insertNodeIntoTree(
  root: TreeNode,
  path: string,
  type: "file" | "folder",
): TreeNode {
  const segments = path.split("/").filter((s) => s.length > 0);
  if (segments.length === 0) return root;

  function insert(node: TreeNode, segs: string[], prefix: string): TreeNode {
    const head = segs[0]!;
    const rest = segs.slice(1);
    const childPath = prefix ? `${prefix}/${head}` : head;
    const children = node.children ? [...node.children] : [];
    const idx = children.findIndex((c) => c.name === head);

    if (rest.length === 0) {
      if (idx >= 0) return node; // leaf already exists — no-op
      const leaf: TreeNode =
        type === "folder"
          ? { name: head, path: childPath, type: "folder", children: [] }
          : { name: head, path: childPath, type: "file" };
      return { ...node, children: [...children, leaf] };
    }

    // Intermediate folder — reuse if present, else create it.
    const existing = idx >= 0 ? children[idx]! : null;
    const childFolder: TreeNode =
      existing ?? { name: head, path: childPath, type: "folder", children: [] };
    const updatedChild = insert(childFolder, rest, childPath);
    const newChildren =
      idx >= 0
        ? children.map((c, i) => (i === idx ? updatedChild : c))
        : [...children, updatedChild];
    return { ...node, children: newChildren };
  }

  return insert(root, segments, "");
}
