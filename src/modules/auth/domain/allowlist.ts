/**
 * Checks whether a GitHub login is in the configured allowlist.
 * Comparison is case-insensitive and trims surrounding whitespace.
 */
export function isAllowed(login: string | undefined, allowed: string): boolean {
  if (login === undefined || login.trim() === "") {
    return false;
  }
  return login.trim().toLowerCase() === allowed.trim().toLowerCase();
}
