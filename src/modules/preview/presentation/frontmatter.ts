"use client";

/**
 * YAML frontmatter parse/stringify backed by the browser-safe `yaml` package
 * (eemeli/yaml — pure JS, no Node `Buffer`/`fs`, unlike gray-matter).
 *
 * Two layers:
 *  - parseFrontmatter → { data, body, doc }. `doc` is the live YAML Document so
 *    edits mutate the AST and PRESERVE comments / quoting / key order. Returns
 *    null when the block is malformed OR not a map (scalar/sequence) — those
 *    aren't editable as "properties" and must be left byte-untouched (a prior
 *    version erased them).
 *  - stringifyFrontmatterDoc(doc, body) → re-emit the edited document.
 *  - stringifyFrontmatter(data, body) → object-based helper (used by tests),
 *    correct values but does not preserve comments.
 */
import { parseDocument, isMap, type Document } from "yaml";

export type FrontmatterValue = string | string[] | number | boolean;
export type Frontmatter = Record<string, unknown>;

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

export function parseFrontmatter(
  content: string,
): { data: Frontmatter; body: string; doc: Document } | null {
  const m = FM_RE.exec(content);
  if (m === null) return null;
  const yaml = m[1] ?? "";
  const body = content.slice(m[0].length);
  try {
    const doc = parseDocument(yaml);
    // parseDocument is lenient — surface parse errors as "don't touch".
    if (doc.errors.length > 0) return null;
    // Only an editable property MAP is exposed. Scalars/sequences/empty-non-map
    // blocks return null so callers never rewrite (and thus never drop) them.
    if (!isMap(doc.contents)) return null;
    const data = (doc.toJS() ?? {}) as Frontmatter;
    return { data, body, doc };
  } catch {
    return null; // malformed YAML — never rewrite
  }
}

/** Re-emit an edited YAML Document as a frontmatter block (comments preserved). */
export function stringifyFrontmatterDoc(doc: Document, body: string): string {
  const yaml = doc.toString().replace(/\n$/, "");
  // Empty map → drop the block entirely.
  if (yaml.trim() === "" || yaml.trim() === "{}") return body.replace(/^\n+/, "");
  return `---\n${yaml}\n---\n\n${body.replace(/^\n+/, "")}`;
}

/** Object-based stringify (no comment preservation). Kept for tests/simple callers. */
export function stringifyFrontmatter(data: Frontmatter, body: string): string {
  const keys = Object.keys(data);
  if (keys.length === 0) return body.replace(/^\n+/, "");
  const doc = parseDocument("");
  for (const k of keys) doc.set(k, data[k]);
  return `---\n${doc.toString().replace(/\n$/, "")}\n---\n\n${body.replace(/^\n+/, "")}`;
}

/** True when a value is editable in the simple PropertiesPanel UI (scalar/array). */
export function isSimpleValue(v: unknown): v is FrontmatterValue {
  if (Array.isArray(v)) return v.every((x) => typeof x === "string" || typeof x === "number");
  return v === null || ["string", "number", "boolean"].includes(typeof v);
}
