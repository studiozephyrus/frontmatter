"use client";

/**
 * LivePreview — the "Live" view mode (preview-first, click-to-edit).
 *
 * The note is rendered as markdown, block by block. Clicking a block opens its
 * raw source in an inline CodeMirror (InlineBlockEditor); Esc / Cmd-Enter /
 * blur commits and the block re-renders. This is the Notion / Obsidian
 * live-preview feel: you read rendered prose and drop into source only on the
 * block you touch. Round-trip fidelity is guaranteed by block-split (only the
 * edited block's text changes; all other bytes are preserved).
 */
import { useCallback, useMemo, useState } from "react";
import { Markdown } from "@/modules/preview";
import { splitIntoSegments, replaceSegment } from "./block-split";
import { InlineBlockEditor } from "./InlineBlockEditor";

type Props = {
  content: string;
  /** Commit a document edit (block edited or task toggled). */
  onChange: (next: string) => void;
  onWikilink?: ((target: string) => void) | undefined;
  basenameToPath?: Map<string, string> | undefined;
};

/** True when the click landed on an interactive descendant that should keep
 *  its own behaviour (link navigation, task checkbox) instead of opening the
 *  block for editing. */
function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.closest("a, button, input, label, [data-no-edit]") !== null;
}

export function LivePreview({ content, onChange, onWikilink, basenameToPath }: Props): React.JSX.Element {
  const segments = useMemo(() => splitIntoSegments(content), [content]);
  // Index (into `segments`) of the block currently being edited, or null.
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const commit = useCallback(
    (index: number, nextBlockText: string) => {
      setEditingIndex(null);
      const next = replaceSegment(segments, index, nextBlockText);
      if (next !== content) onChange(next);
    },
    [segments, content, onChange],
  );

  return (
    <div
      className="sgnk-live markdown-body"
      data-scroll-region
      style={{ height: "100%", overflow: "auto", padding: "16px", maxWidth: "var(--cm-max-width, none)", margin: "0 auto", width: "100%" }}
    >
      {segments.map((seg, i) => {
        if (seg.kind === "gap") return null;
        if (editingIndex === i) {
          return <InlineBlockEditor key={i} initial={seg.text} onCommit={(next) => commit(i, next)} />;
        }
        return (
          <div
            key={i}
            className="sgnk-live-block"
            title="Click to edit"
            onClick={(e) => {
              if (isInteractiveTarget(e.target)) return;
              setEditingIndex(i);
            }}
          >
            <Markdown
              content={seg.text}
              onWikilink={onWikilink}
              basenameToPath={basenameToPath}
              onToggleTask={(nextBlockText) => commit(i, nextBlockText)}
            />
          </div>
        );
      })}
    </div>
  );
}
