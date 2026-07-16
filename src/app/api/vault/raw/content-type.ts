/**
 * MIME type inference for the vault raw serving route.
 * Extracted to a standalone module so it can be unit-tested
 * without importing Next.js / next-auth machinery.
 */

const EXT_TO_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  pdf: "application/pdf",
};

/**
 * Infers the MIME type from a file path extension.
 * Falls back to "application/octet-stream" for unknown extensions.
 */
export function inferContentType(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_MIME[ext] ?? "application/octet-stream";
}
