import type { ReactNode } from "react";

export type CalloutType = string;

// Obsidian's full callout vocabulary (+ aliases). Unknown types fall back to a
// neutral note style rather than degrading to a plain blockquote.
export const CALLOUT_REGEX =
  /^\[!([\w-]+)\]([+-]?)\s*(.*)/;

const CALLOUT_COLORS: Record<string, string> = {
  note: "var(--accent)",
  abstract: "#06b6d4", summary: "#06b6d4", tldr: "#06b6d4",
  info: "var(--accent)", todo: "var(--accent)",
  tip: "#22c55e", hint: "#22c55e", important: "#22c55e",
  success: "#22c55e", check: "#22c55e", done: "#22c55e",
  question: "#eab308", help: "#eab308", faq: "#eab308",
  warning: "#f59e0b", caution: "#f59e0b", attention: "#f59e0b",
  failure: "#ef4444", fail: "#ef4444", missing: "#ef4444",
  danger: "#ef4444", error: "#ef4444", bug: "#ef4444",
  example: "#a855f7", quote: "var(--muted)", cite: "var(--muted)",
};

function calloutColor(type: string): string {
  return CALLOUT_COLORS[type] ?? "var(--accent)";
}

/**
 * Detect an Obsidian-style callout header in the first child of a blockquote:
 *   > [!warning] optional title
 *   > body…
 *
 * Returns the parsed parts, or null if the blockquote isn't a callout.
 */
export function parseCalloutHeader(
  children: ReactNode,
): { type: CalloutType; title: string; body: ReactNode } | null {
  const childArray = Array.isArray(children) ? children : [children];
  const first = childArray[0];
  if (!first) return null;

  if (typeof first !== "object" || first === null || !("props" in first)) {
    return null;
  }

  const firstEl = first as React.ReactElement<{ children?: ReactNode }>;
  const innerChildren = firstEl.props.children;
  const innerArr = Array.isArray(innerChildren) ? innerChildren : [innerChildren];
  const firstText = innerArr.find((c): c is string => typeof c === "string");
  if (!firstText) return null;

  // Match only the FIRST line — a same-paragraph body follows after a soft
  // break (`\n`) within this text node and must not be swallowed into the title.
  const nl = firstText.indexOf("\n");
  const headerLine = nl === -1 ? firstText : firstText.slice(0, nl);
  const match = CALLOUT_REGEX.exec(headerLine);
  if (!match) return null;

  const type = (match[1] ?? "note").toLowerCase();
  const title = (match[3] ?? "").trim();

  // Body = remainder of the first text node after the header line, plus any
  // following siblings in the first paragraph, plus subsequent blockquote
  // children (separate paragraphs).
  const bodyParts: ReactNode[] = [];
  const restInFirstNode = nl === -1 ? "" : firstText.slice(nl + 1).trim();
  if (restInFirstNode) bodyParts.push(restInFirstNode);
  const firstTextIdx = innerArr.indexOf(firstText);
  for (let i = firstTextIdx + 1; i < innerArr.length; i++) {
    const node = innerArr[i];
    if (typeof node === "string" && node.trim() === "") continue;
    bodyParts.push(node);
  }
  if (childArray.length > 1) bodyParts.push(...childArray.slice(1));

  return { type, title, body: bodyParts.length > 0 ? bodyParts : null };
}

export function CalloutBox({
  type,
  title,
  body,
}: {
  type: CalloutType;
  title: string;
  body: ReactNode;
}): React.JSX.Element {
  const color = calloutColor(type);
  return (
    <div className="callout" data-callout-type={type} style={{ borderLeftColor: color }}>
      <div className="callout__header" style={{ color }}>
        <span className="callout__type">{type.toUpperCase()}</span>
        {title ? <span className="callout__title">{title}</span> : null}
      </div>
      {body ? <div className="callout__body">{body}</div> : null}
    </div>
  );
}
