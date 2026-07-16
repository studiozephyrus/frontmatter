/**
 * Rewrites a vault-relative image src to the authed raw-serving endpoint.
 * http/https/data URIs are passed through unchanged.
 * Exported for unit-testing in isolation.
 */
export function rewriteVaultImageSrc(src: string): string {
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:")
  ) {
    return src;
  }
  const normalised = src.startsWith("/") ? src.slice(1) : src;
  return `/api/vault/raw/${normalised}`;
}
