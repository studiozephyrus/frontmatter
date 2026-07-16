/**
 * Public surface of the repository module.
 * Import commit use-case factories, domain types, and port types from here.
 */

// Application
export { makeCommitChanges } from "./application/commit-changes";
export { makeCreateNote } from "./application/create-note";
export { makeRenameNote } from "./application/rename-note";
export { makeMergeNote } from "./application/merge-note";
export { makeUploadAttachment } from "./application/upload-attachment";
export type { CreateNoteInput, CreateNoteResult } from "./application/create-note";
export type { RenameNoteInput, RenameNoteResult, NoteContentReader } from "./application/rename-note";
export type { MergeNoteInput, MergeNoteResult, MergeReader } from "./application/merge-note";
export { merge3 } from "./domain/merge3";
export type { Merge3Result } from "./domain/merge3";
export type { UploadAttachmentInput, UploadAttachmentResult } from "./application/upload-attachment";
export {
  validateNotePath,
  basenameNoExt,
  defaultNoteContent,
  rewriteWikilinks,
  InvalidPathError,
  NoteExistsError,
} from "./application/file-ops";
export type { RepositoryWriter, TreeItem } from "./application/ports";

// Domain
export type {
  FileChange,
  Deletion,
  CommitRequest,
  CommitResult,
  CommitAuthor,
} from "./domain/commit";
export { ConflictError } from "./domain/commit";

// Presentation
export { CommitBar } from "./presentation/CommitBar";
