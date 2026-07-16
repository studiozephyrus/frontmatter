/**
 * daily-notes.ts — pure helpers for daily note path generation and templates.
 * No framework imports, no side effects.
 */

/**
 * Returns the vault path for a daily note based on the given date.
 * Uses local (wall-clock) date components so the note matches the user's day.
 * Example: new Date("2026-05-25") → "Daily/2026-05-25.md"
 */
export function dailyNotePath(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `Daily/${year}-${month}-${day}.md`;
}

/**
 * Returns a simple frontmatter + heading template for a daily note.
 * @param dateStr - ISO-ish date string used as title (e.g. "2026-05-25")
 */
export function dailyNoteTemplate(dateStr: string): string {
  return `---\ntitle: ${dateStr}\ntags: [daily]\n---\n\n# ${dateStr}\n\n## Notes\n\n`;
}
