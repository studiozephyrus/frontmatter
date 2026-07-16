/**
 * Shared domain error types.
 * Importable by any layer (domain, application, infrastructure, presentation, app).
 */

export class FileNotFoundError extends Error {
  readonly kind = "FileNotFound" as const;
  constructor(path: string) {
    super(`File not found: ${path}`);
    this.name = "FileNotFoundError";
  }
}
