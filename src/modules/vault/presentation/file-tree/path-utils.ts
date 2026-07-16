/** Join a user-typed filename with its parent folder, appending `.md` if absent. */
export function buildPath(raw: string, folder: string): string {
  const trimmed = raw.trim();
  const withExt = trimmed.endsWith(".md") ? trimmed : `${trimmed}.md`;
  if (!folder) return withExt;
  return `${folder}/${withExt}`;
}

/** Return the directory portion of a vault-relative path (`""` for root). */
export function folderOf(path: string): string {
  const idx = path.lastIndexOf("/");
  return idx === -1 ? "" : path.slice(0, idx);
}
