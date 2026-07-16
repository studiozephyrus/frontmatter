/**
 * Pure domain types for vault notes. No framework imports, no env reads.
 */

export interface ParsedNote {
  /** Vault-relative path, e.g. "Projects/HQ/Foo.md" */
  readonly path: string;
  /** Title from frontmatter or derived from basename */
  readonly title: string;
  /** Combined tag list: frontmatter tags + body inline-tags (no # prefix) */
  readonly tags: readonly string[];
  /** Outbound wikilink targets (basename only, no #heading or |alias) */
  readonly outbound: readonly string[];
  /** Embed targets (![[...]]) */
  readonly embeds: readonly string[];
  /** Raw frontmatter key-value pairs */
  readonly frontmatter: Readonly<Record<string, unknown>>;
  /** True when the note lives under _Archive/ at the vault root */
  readonly excludeFromGraph: boolean;
}

/** A resolved wikilink reference */
export interface LinkRef {
  /** Raw target string before stripping (e.g. "Link#heading") */
  readonly raw: string;
  /** Resolved basename (e.g. "Link") */
  readonly target: string;
  /** True when this is an embed (![[...]]) */
  readonly isEmbed: boolean;
}
