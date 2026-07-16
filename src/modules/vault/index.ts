/**
 * Public surface of the vault module.
 * Import vault types and use-case factories from here.
 */

// Presentation
export { FileTree } from "./presentation/FileTree";
export { FileTreeActions } from "./presentation/file-tree/FileTreeActions";
export { TrashModal } from "./presentation/TrashModal";
export { SnapshotProvider, useSnapshotRefresh } from "./presentation/SnapshotProvider";
// Re-exported via the indirection module so test `vi.mock` targets keep working.
export { useSnapshot } from "./presentation/use-snapshot";
export type { SnapshotState } from "./presentation/use-snapshot";
export { dailyNotePath, dailyNoteTemplate } from "./presentation/daily-notes";
export { substituteTemplateVars } from "./presentation/template-vars";
export type { TemplateContext } from "./presentation/template-vars";

// Application
export { makeGetSnapshot } from "./application/get-snapshot";
export type { SnapshotCache } from "./application/get-snapshot";
export type { VaultReader } from "./application/ports";
export type { VaultSnapshot, NoteMeta, TreeNode } from "./application/dto";
export { VaultSnapshotSchema, NoteMetaSchema, TreeNodeSchema } from "./application/dto";
