"use client";

/**
 * AIMenu — toolbar dropdown that calls the AI API routes and applies the
 * results to the active editor with a preview/accept step.
 *
 *   • Refine selection (or whole note) → /api/ai/refine
 *   • Summarize note                   → /api/ai/summarize
 *   • Suggest wikilinks                → /api/ai/suggest-links
 *
 * Edits go through the active CodeMirror view (active-view singleton) and
 * also persist via the editor store's setContent + setDirty + IndexedDB
 * draft (mirroring how toolbar transforms work).
 */

import { useEffect, useRef, useState } from "react";
import { getActiveView, getActivePath } from "./active-view";
import { useEditorStore } from "./editor-store";
import { saveDraft } from "@/modules/drafts";
import { useSnapshot } from "@/modules/vault";
import type { Suggestion } from "@/modules/ai";
import { applyWikilinkSuggestion } from "@/modules/ai";
import { GoogleIcon } from "@/shared/presentation/GoogleIcon";

type Action = "refine" | "summarize" | "suggest-links";
type Mode =
  | { kind: "idle" }
  | { kind: "loading"; action: Action }
  | { kind: "refine"; original: string; refined: string; selRange: [number, number] | null }
  | { kind: "summarize"; summary: string }
  | { kind: "suggest"; suggestions: Suggestion[]; chosen: boolean[] }
  | { kind: "error"; message: string };

export function AIMenu(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>({ kind: "idle" });
  const menuRef = useRef<HTMLDivElement>(null);
  const { snapshot } = useSnapshot();

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function activePathAndContent(): { path: string; content: string } | null {
    const view = getActiveView();
    if (!view) return null;
    // Focused pane's path (two-note split aware), falling back to primary.
    const path = getActivePath() ?? useEditorStore.getState().activePath;
    if (!path) return null;
    return { path, content: view.state.doc.toString() };
  }

  async function runRefine(instruction?: string) {
    setOpen(false);
    const view = getActiveView();
    const ctx = activePathAndContent();
    if (!view || !ctx) {
      setMode({ kind: "error", message: "No active note." });
      return;
    }
    const sel = view.state.selection.main;
    const hasSel = !sel.empty;
    const range: [number, number] | null = hasSel ? [sel.from, sel.to] : null;
    const target = hasSel ? ctx.content.slice(sel.from, sel.to) : ctx.content;
    setMode({ kind: "loading", action: "refine" });
    try {
      const res = await fetch("/api/ai/refine", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: target, ...(instruction ? { instruction } : {}) }),
      });
      if (!res.ok) throw new Error(await aiErrorMessage(res));
      const data = (await res.json()) as { text: string };
      setMode({ kind: "refine", original: target, refined: data.text, selRange: range });
    } catch (err) {
      setMode({ kind: "error", message: err instanceof Error ? err.message : "AI failed" });
    }
  }

  async function runSummarize() {
    setOpen(false);
    const ctx = activePathAndContent();
    if (!ctx) {
      setMode({ kind: "error", message: "No active note." });
      return;
    }
    setMode({ kind: "loading", action: "summarize" });
    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: ctx.content }),
      });
      if (!res.ok) throw new Error(await aiErrorMessage(res));
      const data = (await res.json()) as { summary: string };
      setMode({ kind: "summarize", summary: data.summary });
    } catch (err) {
      setMode({ kind: "error", message: err instanceof Error ? err.message : "AI failed" });
    }
  }

  async function runSuggest() {
    setOpen(false);
    const ctx = activePathAndContent();
    if (!ctx) {
      setMode({ kind: "error", message: "No active note." });
      return;
    }
    if (!snapshot) {
      setMode({ kind: "error", message: "Vault snapshot not loaded yet." });
      return;
    }
    // Build candidate basenames from snapshot, excluding the current note.
    const candidates: string[] = [];
    for (const n of snapshot.notes) {
      const last = n.path.split("/").pop() ?? n.path;
      const base = last.endsWith(".md") ? last.slice(0, -3) : last;
      if (n.path !== ctx.path) candidates.push(base);
    }
    setMode({ kind: "loading", action: "suggest-links" });
    try {
      const res = await fetch("/api/ai/suggest-links", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: ctx.content, candidates }),
      });
      if (!res.ok) throw new Error(await aiErrorMessage(res));
      const data = (await res.json()) as { suggestions: Suggestion[] };
      setMode({
        kind: "suggest",
        suggestions: data.suggestions,
        chosen: data.suggestions.map(() => true),
      });
    } catch (err) {
      setMode({ kind: "error", message: err instanceof Error ? err.message : "AI failed" });
    }
  }

  // ── Apply helpers ──────────────────────────────────────────────────────────

  function applyContent(newContent: string) {
    const view = getActiveView();
    const path = getActivePath() ?? useEditorStore.getState().activePath;
    if (!view || !path) return;
    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: newContent },
    });
    const store = useEditorStore.getState();
    store.setContent(path, newContent);
    store.setDirty(path, true);
    // Use the real loaded blob sha (not the "" create-sentinel) so a commit
    // immediately after an AI apply isn't falsely flagged as a conflict.
    void saveDraft(path, { content: newContent, baseSha: store.baseShaByPath[path] ?? "" });
  }

  function applyRefine() {
    if (mode.kind !== "refine") return;
    const view = getActiveView();
    if (!view) return;
    if (mode.selRange) {
      const [from, to] = mode.selRange;
      view.dispatch({ changes: { from, to, insert: mode.refined } });
      const content = view.state.doc.toString();
      const store = useEditorStore.getState();
      const path = getActivePath() ?? store.activePath;
      if (path) {
        store.setContent(path, content);
        store.setDirty(path, true);
        void saveDraft(path, { content, baseSha: store.baseShaByPath[path] ?? "" });
      }
    } else {
      applyContent(mode.refined);
    }
    setMode({ kind: "idle" });
  }

  function applySummary() {
    if (mode.kind !== "summarize") return;
    const view = getActiveView();
    if (!view) return;
    const content = view.state.doc.toString();
    // Insert after frontmatter (if present), else at top.
    const after = endOfFrontmatter(content);
    const summaryBlock = `\n> [!summary] Summary\n> ${mode.summary.replace(/\n/g, "\n> ")}\n\n`;
    const newContent = content.slice(0, after) + summaryBlock + content.slice(after);
    applyContent(newContent);
    setMode({ kind: "idle" });
  }

  function applySuggestions() {
    if (mode.kind !== "suggest") return;
    const view = getActiveView();
    if (!view) return;
    let content = view.state.doc.toString();
    for (let i = 0; i < mode.suggestions.length; i++) {
      if (!mode.chosen[i]) continue;
      const s = mode.suggestions[i];
      if (!s) continue;
      content = applyWikilinkSuggestion(content, s);
    }
    applyContent(content);
    setMode({ kind: "idle" });
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const inflight = mode.kind === "loading";

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="sgnk-icon-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={inflight ? "AI tools (working…)" : "AI tools"}
        disabled={inflight}
        title="AI tools"
        // Glow when a request is in flight so users see the action is
        // running without a text label or spinner taking up room.
        style={inflight ? { color: "var(--link, var(--accent))" } : undefined}
      >
        <GoogleIcon name="auto_awesome" size={18} fill={inflight} weight={500} />
      </button>

      {open && (
        <div
          role="menu"
          className="sgnk-surface sgnk-fade-in"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 6px)",
            minWidth: "220px",
            zIndex: 100,
            padding: "4px",
          }}
        >
          <MenuItem label="Refine selection / note" sub="Polish prose, fix grammar" onClick={() => runRefine()} />
          <MenuItem label="Expand" sub="Add detail and depth" onClick={() => runRefine("Expand this with more detail and depth, keeping the same voice.")} />
          <MenuItem label="Shorten" sub="Make it more concise" onClick={() => runRefine("Make this more concise without losing meaning.")} />
          <MenuItem label="Change tone: professional" sub="Formal, polished" onClick={() => runRefine("Rewrite in a professional, formal tone.")} />
          <MenuItem label="Change tone: casual" sub="Friendly, relaxed" onClick={() => runRefine("Rewrite in a casual, friendly tone.")} />
          <MenuItem label="Translate to English" sub="Keep markdown intact" onClick={() => runRefine("Translate the text to English, preserving all markdown.")} />
          <MenuItem label="Summarize note" sub="Add a > [!summary] block" onClick={runSummarize} />
          <MenuItem label="Suggest wikilinks" sub="Link phrases to existing notes" onClick={runSuggest} />
        </div>
      )}

      {/* Preview modals */}
      {(mode.kind === "refine" || mode.kind === "summarize" || mode.kind === "suggest" || mode.kind === "error") && (
        <ModalOverlay onClose={() => setMode({ kind: "idle" })}>
          {mode.kind === "refine" && (
            <RefinePreview
              original={mode.original}
              refined={mode.refined}
              onAccept={applyRefine}
              onCancel={() => setMode({ kind: "idle" })}
              onChange={(t) => setMode({ ...mode, refined: t })}
            />
          )}
          {mode.kind === "summarize" && (
            <SummaryPreview
              summary={mode.summary}
              onAccept={applySummary}
              onCancel={() => setMode({ kind: "idle" })}
              onChange={(t) => setMode({ ...mode, summary: t })}
            />
          )}
          {mode.kind === "suggest" && (
            <SuggestPreview
              suggestions={mode.suggestions}
              chosen={mode.chosen}
              onToggle={(i) => {
                const next = mode.chosen.slice();
                next[i] = !next[i];
                setMode({ ...mode, chosen: next });
              }}
              onAccept={applySuggestions}
              onCancel={() => setMode({ kind: "idle" })}
            />
          )}
          {mode.kind === "error" && (
            <ErrorPanel message={mode.message} onClose={() => setMode({ kind: "idle" })} />
          )}
        </ModalOverlay>
      )}
    </div>
  );
}

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Turn an AI route error response into a user-actionable message. */
async function aiErrorMessage(res: Response): Promise<string> {
  let detail = "";
  try {
    detail = ((await res.json()) as { detail?: string }).detail ?? "";
  } catch {
    /* non-JSON body */
  }
  if (/free tier/i.test(detail)) {
    return "AI needs credits on this Vercel account — add AI credits to enable AI features.";
  }
  return detail || `AI request failed (HTTP ${res.status}).`;
}

function endOfFrontmatter(content: string): number {
  // Tolerate CRLF — otherwise a summary gets inserted ABOVE the frontmatter on
  // Windows-line-ending notes, corrupting the YAML block.
  const m = /^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(content);
  return m ? m[0].length : 0;
}

// ─── presentational subcomponents ────────────────────────────────────────────

function MenuItem({ label, sub, onClick }: { label: string; sub: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "8px 10px",
        background: "transparent",
        border: "none",
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        color: "var(--fg)",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--hover)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
    >
      <div style={{ fontSize: "13px", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "1px" }}>{sub}</div>
    </button>
  );
}

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>
  );
}

function RefinePreview({
  original,
  refined,
  onAccept,
  onCancel,
  onChange,
}: {
  original: string;
  refined: string;
  onAccept: () => void;
  onCancel: () => void;
  onChange: (t: string) => void;
}) {
  return (
    <div
      className="sgnk-surface sgnk-fade-in"
      style={{ width: "min(960px, 95vw)", maxHeight: "85vh", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <strong style={{ fontSize: "14px" }}>Refined</strong>
        <span style={{ fontSize: "11px", color: "var(--muted)" }}>{original.length} → {refined.length} chars</span>
      </div>
      <textarea
        value={refined}
        onChange={(e) => onChange(e.target.value)}
        className="sgnk-input"
        style={{ flex: 1, minHeight: "240px", fontFamily: "var(--font-mono)", fontSize: "13px", padding: "10px", height: "auto" }}
        spellCheck={false}
      />
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <button className="sgnk-btn sgnk-btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="sgnk-btn sgnk-btn-primary" onClick={onAccept}>Accept</button>
      </div>
    </div>
  );
}

function SummaryPreview({
  summary,
  onAccept,
  onCancel,
  onChange,
}: {
  summary: string;
  onAccept: () => void;
  onCancel: () => void;
  onChange: (t: string) => void;
}) {
  return (
    <div
      className="sgnk-surface sgnk-fade-in"
      style={{ width: "min(680px, 95vw)", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <strong style={{ fontSize: "14px" }}>Summary</strong>
      <textarea
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        className="sgnk-input"
        style={{ minHeight: "120px", fontSize: "13px", padding: "10px", height: "auto", lineHeight: 1.5 }}
        spellCheck={false}
      />
      <div style={{ fontSize: "11px", color: "var(--muted)" }}>
        Inserted as a <code>&gt; [!summary]</code> callout after the frontmatter.
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <button className="sgnk-btn sgnk-btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="sgnk-btn sgnk-btn-primary" onClick={onAccept}>Insert</button>
      </div>
    </div>
  );
}

function SuggestPreview({
  suggestions,
  chosen,
  onToggle,
  onAccept,
  onCancel,
}: {
  suggestions: Suggestion[];
  chosen: boolean[];
  onToggle: (i: number) => void;
  onAccept: () => void;
  onCancel: () => void;
}) {
  const any = chosen.some(Boolean);
  return (
    <div
      className="sgnk-surface sgnk-fade-in"
      style={{ width: "min(560px, 95vw)", maxHeight: "85vh", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <strong style={{ fontSize: "14px" }}>Wikilink suggestions</strong>
      {suggestions.length === 0 ? (
        <div style={{ fontSize: "13px", color: "var(--muted)" }}>
          No clear matches found. Try writing more or check that the target notes exist.
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, overflowY: "auto", maxHeight: "60vh" }}>
          {suggestions.map((s, i) => (
            <li key={i} style={{ padding: "6px 4px", borderBottom: "1px solid var(--border)" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input type="checkbox" checked={!!chosen[i]} onChange={() => onToggle(i)} />
                <span style={{ fontSize: "13px" }}>
                  <span style={{ color: "var(--fg)" }}>{s.phrase}</span>
                  <span style={{ color: "var(--muted)" }}> → </span>
                  <span style={{ color: "var(--accent)" }}>[[{s.basename}]]</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <button className="sgnk-btn sgnk-btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="sgnk-btn sgnk-btn-primary" onClick={onAccept} disabled={!any}>
          Apply
        </button>
      </div>
    </div>
  );
}

function ErrorPanel({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="sgnk-surface sgnk-fade-in" style={{ width: "min(440px, 95vw)", padding: "16px" }}>
      <strong style={{ fontSize: "14px", color: "var(--fg)" }}>AI request failed</strong>
      <div style={{ marginTop: "8px", fontSize: "13px", color: "var(--fg-muted)" }}>{message}</div>
      <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
        <button className="sgnk-btn sgnk-btn-ghost" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
