import type { TreeNode } from "@/modules/vault/application/dto";

/** Imperative bridge so TreeItem rows can open the FileTreeActions dialogs. */
export interface FileTreeActionsInterface {
  rename: (node: TreeNode) => void;
  delete: (node: TreeNode) => void;
  renameFolder: (node: TreeNode) => void;
  deleteFolder: (node: TreeNode) => void;
  newNoteInFolder: (folder: string) => void;
  newFolderIn: (folder: string) => void;
}

export interface WindowWithFileTreeActions extends Window {
  __fileTreeActions?: FileTreeActionsInterface;
}

/** A single entry in the context menu / header dropdown. */
export interface MenuEntry {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

export interface TreeItemProps {
  node: TreeNode;
  depth: number;
  onOpen: (path: string) => void;
  dirtyPaths: ReadonlySet<string>;
  activePath: string | null;
}
