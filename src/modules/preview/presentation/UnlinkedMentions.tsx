"use client";

/**
 * UnlinkedMentions — right-pane section listing notes that mention the active
 * note's title in plain text without a `[[wikilink]]` (Obsidian-style).
 *
 * Fetches /api/vault/unlinked for the active note's title. Lazily — only when
 * expanded — since it scans every note body server-side. Clicking a result
 * opens that note so the user can add the link.
 */
import { useState, useEffect, useCallback } from "react";
import { useSnapshot } from "@/modules/vault";
import { useEditorStore } from "@/modules/editor";

type Mention = { path: string; title: string; snippet: string };

export function UnlinkedMentions(): React.JSX.Element {
  const activePath = useEditorStore((s) => s.activePath);
  const { snapshot } = useSnapshot();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mentions, setMentions] = useState<Mention[]>([]);

  const title = (() => {
    if (!activePath) return "";
    const meta = snapshot?.notes.find((n) => n.path === activePath);
    return meta?.title ?? activePath.split("/").pop()?.replace(/\.md$/, "") ?? "";
  })();

  const load = useCallback(() => {
    if (!activePath || !title) return;
    setLoading(true);
    fetch(`/api/vault/unlinked?title=${encodeURIComponent(title)}&path=${encodeURIComponent(activePath)}`)
      .then((r) => r.json())
      .then((d: { mentions?: Mention[] }) => setMentions(d.mentions ?? []))
      .catch(() => setMentions([]))
      .finally(() => setLoading(false));
  }, [activePath, title]);

  // Reset when the note changes; reload if already expanded.
  useEffect(() => {
    setMentions([]);
    if (expanded) load();
  }, [activePath, expanded, load]);

  if (!activePath) {
    return <p className="text-xs" style={{ color: "var(--muted)" }}>Open a note to see unlinked mentions</p>;
  }

  if (!expanded) {
    return (
      <button
        className="sgnk-btn sgnk-btn-ghost"
        style={{ height: 24, fontSize: 12 }}
        onClick={() => setExpanded(true)}
      >
        Find unlinked mentions
      </button>
    );
  }

  if (loading) return <p className="text-xs" style={{ color: "var(--muted)" }}>Scanning…</p>;
  if (mentions.length === 0) return <p className="text-xs" style={{ color: "var(--muted)" }}>No unlinked mentions</p>;

  return (
    <ul className="space-y-1">
      {mentions.map((m) => (
        <li key={m.path}>
          <button
            className="w-full rounded px-1 py-1 text-left text-xs hover:bg-black/5 dark:hover:bg-white/5"
            onClick={() => useEditorStore.getState().openTab(m.path)}
            title={m.path}
          >
            <span style={{ color: "var(--link)", fontWeight: 500 }}>{m.title}</span>
            <br />
            <span style={{ color: "var(--muted)" }}>{m.snippet}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
