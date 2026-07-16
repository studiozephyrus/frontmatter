import type { ReactNode } from "react";
import { resolveWikilink } from "@/modules/preview/presentation/wikilink";
import { EmbeddedNote } from "@/modules/preview/presentation/EmbeddedNote";

/**
 * Combined regex that matches both `![[target]]` (embed) and `[[target]]` (wikilink).
 * Group 1 captures the optional leading `!` (present → embed, absent → wikilink).
 * Group 2 captures the inner target string.
 */
const COMBINED_WIKILINK_RE = /(!?)\[\[([^\]]+)\]\]/g;

/**
 * Split a plain text string into React nodes, converting:
 *   - `![[target]]` → `<EmbeddedNote>` (transclusion)
 *   - `[[target]]`  → clickable anchor (resolved) or dimmed span (unresolved)
 *
 * Only called from text nodes outside of code elements — react-markdown's
 * component override system keeps code nodes separate, so wikilinks inside
 * `` `code` `` are never processed here.
 */
export function renderTextWithWikilinks(
  text: string,
  basenameToPath: Map<string, string> | undefined,
  onWikilink: ((target: string) => void) | undefined,
  depth: number,
): ReactNode {
  if (!basenameToPath && !onWikilink) return text;
  if (!COMBINED_WIKILINK_RE.test(text)) return text;

  COMBINED_WIKILINK_RE.lastIndex = 0;

  const nodes: ReactNode[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = COMBINED_WIKILINK_RE.exec(text)) !== null) {
    const [full, bang, inner] = match;
    const matchStart = match.index;

    if (matchStart > lastIdx) {
      nodes.push(text.slice(lastIdx, matchStart));
    }

    const rawInner = inner ?? "";
    const isEmbed = bang === "!";

    if (isEmbed) {
      nodes.push(
        <EmbeddedNote
          key={`embed-${matchStart}`}
          target={rawInner}
          basenameToPath={basenameToPath}
          depth={depth}
        />,
      );
    } else {
      const pipeIdx = rawInner.indexOf("|");
      // Resolve a non-empty display text. Handles [[a|b]]→b, [[a#h]]→a,
      // and the same-note heading link [[#h]]→h (previously rendered empty).
      const computeDisplay = (): string => {
        if (pipeIdx !== -1) {
          const alias = rawInner.slice(pipeIdx + 1).trim();
          if (alias) return alias;
        }
        const beforeHash = (rawInner.split("#")[0] ?? "").trim();
        if (beforeHash) return beforeHash;
        const hashIdx = rawInner.indexOf("#");
        if (hashIdx !== -1) return rawInner.slice(hashIdx + 1).trim() || rawInner;
        return rawInner;
      };
      const displayText = computeDisplay();

      const resolvedPath = basenameToPath
        ? resolveWikilink(rawInner, basenameToPath)
        : null;

      if (resolvedPath !== null && onWikilink) {
        nodes.push(
          <a
            key={`wl-${matchStart}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onWikilink(rawInner);
            }}
            style={{
              color: "var(--link)",
              fontWeight: 500,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            {displayText}
          </a>,
        );
      } else {
        nodes.push(
          <span
            key={`wl-unresolved-${matchStart}`}
            style={{ color: "var(--muted)", opacity: 0.6 }}
          >
            {displayText}
          </span>,
        );
      }
    }

    lastIdx = matchStart + full.length;
  }

  if (lastIdx < text.length) {
    nodes.push(text.slice(lastIdx));
  }

  return nodes;
}

/**
 * Walk React children and replace plain string nodes with wikilink-aware nodes.
 * Leaves all non-string children (React elements) intact so existing formatting
 * (bold, italic, inline code, etc.) is preserved.
 */
export function transformChildren(
  children: ReactNode,
  basenameToPath: Map<string, string> | undefined,
  onWikilink: ((target: string) => void) | undefined,
  depth: number,
): ReactNode {
  if (!basenameToPath && !onWikilink) return children;

  const arr = Array.isArray(children) ? children : [children];
  return arr.map((child, i) => {
    if (typeof child === "string") {
      const result = renderTextWithWikilinks(child, basenameToPath, onWikilink, depth);
      if (typeof result === "string") return result;
      return (
        <span key={`wt-${i}`} style={{ display: "contents" }}>
          {result}
        </span>
      );
    }
    return child;
  });
}
