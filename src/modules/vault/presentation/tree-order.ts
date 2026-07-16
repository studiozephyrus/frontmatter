/**
 * orderTree — returns a sorted deep-copy of a TreeNode.
 *
 * Ordering rules:
 *  1. Folders before files.
 *  2. Within each group, ascending alphabetical (locale-aware).
 *  3. The `_Archive` folder is forced to be the very last folder.
 */

import type { TreeNode } from "@/modules/vault/application/dto";

export function orderTree(node: TreeNode): TreeNode {
  if (!node.children) {
    return { ...node };
  }

  const sorted = [...node.children]
    .map(orderTree) // recurse first
    .sort((a, b) => {
      const aFolder = a.type === "folder";
      const bFolder = b.type === "folder";

      // folders before files
      if (aFolder !== bFolder) return aFolder ? -1 : 1;

      // within folders: _Archive is always last
      if (aFolder && bFolder) {
        const aArchive = a.name === "_Archive";
        const bArchive = b.name === "_Archive";
        if (aArchive !== bArchive) return aArchive ? 1 : -1;
      }

      // alphabetical
      return a.name.localeCompare(b.name);
    });

  return { ...node, children: sorted };
}
