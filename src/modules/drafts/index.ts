/**
 * Public surface of the drafts module.
 * Client-side draft persistence via IndexedDB + localStorage dirty index.
 */

export type { Draft } from "./infrastructure/draft-store";
export {
  deleteDraft,
  getDraft,
  hasDraft,
  listDirtyPaths,
  saveDraft,
} from "./infrastructure/draft-store";
