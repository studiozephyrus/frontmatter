"use client";

import { useDeferredValue, useMemo } from "react";
import { useEditorStore } from "@/modules/editor";
import { extractOutline } from "@/modules/preview/presentation/outline-utils";
import type { HeadingEntry } from "@/modules/preview/presentation/outline-utils";

/** Indent each heading level relative to the shallowest present. */
function indentPx(depth: number, minDepth: number): number {
  return (depth - minDepth) * 12;
}

export function Outline() {
  // Stable scalar selectors — never returns a new object
  const activePath = useEditorStore((s) => s.activePath);
  // contentByPath is a Record — we select the whole map but it is stable
  // unless a note is actually edited (zustand replaces the entire record on
  // setContent, but that is the correct identity change).
  const contentRaw = useEditorStore((s) => (activePath ? (s.contentByPath[activePath] ?? "") : ""));
  // Defer outline re-derivation so a keystroke never blocks on a full-document
  // re-parse + sidebar reflow (a contributor to the typing/scroll jank).
  const content = useDeferredValue(contentRaw);

  // Memoize outline derivation — only re-runs when content changes
  const outline = useMemo<HeadingEntry[]>(() => {
    if (!activePath || content === "") return [];
    return extractOutline(content);
  }, [activePath, content]);

  if (!activePath) {
    return (
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        Open a note to see its outline
      </p>
    );
  }

  if (outline.length === 0) {
    return (
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        —
      </p>
    );
  }

  const minDepth = Math.min(...outline.map((h) => h.depth));

  return (
    <ul className="space-y-0.5">
      {outline.map((entry, idx) => (
        <li key={`${entry.slug}-${idx}`}>
          <button
            className="w-full truncate rounded px-1 py-0.5 text-left text-xs hover:bg-black/5 dark:hover:bg-white/5"
            style={{
              paddingLeft: `${4 + indentPx(entry.depth, minDepth)}px`,
              color: entry.depth === 1 ? "var(--fg)" : "var(--muted)",
            }}
            onClick={() => {
              document
                .getElementById(entry.slug)
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            {entry.text}
          </button>
        </li>
      ))}
    </ul>
  );
}
