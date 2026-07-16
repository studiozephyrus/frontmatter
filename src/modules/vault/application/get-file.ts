/**
 * Application use-case: GetFile.
 *
 * Fetches a single markdown file from the vault by its relative path.
 *
 * Pure application logic: no framework imports, no infrastructure imports,
 * no env access. All side-effecting dependencies are injected via ports.
 */

import type { VaultReader } from "./ports";
import { FileNotFoundError } from "@/shared/domain/errors";

export { FileNotFoundError };

// ---------------------------------------------------------------------------
// Typed errors
// ---------------------------------------------------------------------------

export class InvalidPathError extends Error {
  readonly kind = "InvalidPath" as const;
  constructor(message: string) {
    super(message);
    this.name = "InvalidPathError";
  }
}

// ---------------------------------------------------------------------------
// Path validation
// ---------------------------------------------------------------------------

function validatePath(path: string): void {
  if (!path || path.trim() === "") {
    throw new InvalidPathError("path must not be empty");
  }
  if (path.startsWith("/")) {
    throw new InvalidPathError(`path must be relative, not absolute: ${path}`);
  }
  // Reject any segment that is ".." — prevents directory traversal
  const segments = path.split("/");
  for (const seg of segments) {
    if (seg === "..") {
      throw new InvalidPathError(`path must not contain ".." traversal: ${path}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export interface GetFileResult {
  path: string;
  content: string;
  sha: string;
}

export function makeGetFile(deps: { reader: VaultReader }): (path: string) => Promise<GetFileResult> {
  const { reader } = deps;

  return async function getFile(path: string): Promise<GetFileResult> {
    validatePath(path);
    const { content, sha } = await reader.getFile(path);
    return { path, content, sha };
  };
}
