/**
 * Domain types and errors for the repository commit workflow.
 *
 * Pure domain: no framework, no infrastructure, no env access.
 */

export type FileChange = {
  path: string;
  content: string;
  baseSha: string;
};

export type Deletion = {
  path: string;
  baseSha: string;
};

export type CommitRequest = {
  files: FileChange[];
  deletions?: Deletion[];
  message: string;
};

export type CommitResult = {
  commitSha: string;
};

export type CommitAuthor = {
  name: string;
  email: string;
};

export class ConflictError extends Error {
  readonly paths: string[];

  constructor(paths: string[]) {
    super(`Commit conflict on: ${paths.join(", ")}`);
    this.name = "ConflictError";
    this.paths = paths;
  }
}
