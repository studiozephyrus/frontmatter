"use client";

/**
 * Template variable substitution for "Insert template" / daily-note flows.
 *
 * Supported tokens (Obsidian/Templater-lite):
 *   {{date}}      → YYYY-MM-DD
 *   {{time}}      → HH:MM
 *   {{datetime}}  → YYYY-MM-DD HH:MM
 *   {{title}}     → active note basename (no .md)
 *   {{date:FMT}}  → custom: supports YYYY MM DD HH mm tokens
 *
 * Pure given an injected `now` + `title` so it stays unit-testable.
 */
export type TemplateContext = { now: Date; title: string };

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatDate(d: Date, fmt: string): string {
  // Single pass over known tokens so literal characters between tokens (and
  // sequential replaces like MM→mm) can't corrupt each other.
  const tokens: Record<string, string> = {
    YYYY: String(d.getFullYear()),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
  };
  return fmt.replace(/YYYY|MM|DD|HH|mm|ss/g, (t) => tokens[t] ?? t);
}

export function substituteTemplateVars(content: string, ctx: TemplateContext): string {
  const { now, title } = ctx;
  return content
    // Function replacers throughout so `$`-sequences in values (e.g. a title
    // containing "$&" or "$1") are inserted literally, not as replace patterns.
    .replace(/\{\{\s*date\s*:\s*([^}]+?)\s*\}\}/g, (_m, fmt: string) => formatDate(now, fmt))
    .replace(/\{\{\s*datetime\s*\}\}/g, () => formatDate(now, "YYYY-MM-DD HH:mm"))
    .replace(/\{\{\s*date\s*\}\}/g, () => formatDate(now, "YYYY-MM-DD"))
    .replace(/\{\{\s*time\s*\}\}/g, () => formatDate(now, "HH:mm"))
    .replace(/\{\{\s*title\s*\}\}/g, () => title);
}
