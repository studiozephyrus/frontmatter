"use client";

/**
 * SgnkAiButton — floating bottom-right ⌘J trigger that opens a Notion-AI-
 * style popover. Same UX pattern as Notion's "Ask AI":
 *
 *   • Small logo button anchored bottom-right of the viewport.
 *   • Click (or ⌘J) opens a floating panel that does NOT block the editor.
 *   • Scope picker: Selection (when a range exists) · This note (default)
 *     · Vault (reserved for v2 — disabled chip).
 *   • Preset chips: Summarize · Continue writing · Improve · Find action
 *     items · Explain. Plus a free-form prompt (⌘+Enter submits).
 *   • Result actions: Insert below · Replace selection · Copy · Discard.
 *
 * ALL styling is inline. This component is mounted late in the tree and we
 * were repeatedly bitten by a globals.css class block not being live under
 * turbopack HMR — which left the panel completely unstyled (content
 * flowing top-left) and both theme logos painting at once. Inline styles
 * are self-contained and can't be dropped by a stale stylesheet.
 *
 * Logo is theme-resolved at runtime (single <img>, src picked from the
 * <html> class) — not two <img> + CSS display toggle.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { getActiveView, getActivePath } from "@/modules/editor/presentation/active-view";
import { useEditorStore, showAiSuggestion, clearAiSuggestion } from "@/modules/editor";
import { Markdown } from "@/modules/preview";

type Scope = "selection" | "note" | "vault";
type Preset = "summarize" | "continue" | "improve" | "action-items" | "explain";

interface Result {
  text: string;
  selRange: [number, number] | null;
}

/** A suggestion that has been inserted into the doc and is awaiting
 *  Keep / Undo. `range` is highlighted in the editor via the
 *  ai-suggestion decoration. */
interface Applied {
  from: number;
  to: number;
}

const PRESETS: { key: Preset; label: string; instruction?: string }[] = [
  { key: "summarize", label: "Summarize" },
  {
    key: "continue",
    label: "Continue writing",
    instruction:
      "Continue this note from where it leaves off. Match the existing tone, voice, and formatting. Output only the continuation, no preamble.",
  },
  {
    key: "improve",
    label: "Improve writing",
    instruction:
      "Improve the prose for clarity and concision without changing meaning. Keep markdown formatting and tone. Output only the rewritten text.",
  },
  {
    key: "action-items",
    label: "Find action items",
    instruction:
      "Extract every actionable item from this content as a markdown checklist (- [ ] item). If there are none, reply with 'No action items found.'",
  },
  {
    key: "explain",
    label: "Explain",
    instruction:
      "Explain this content clearly to a smart non-expert. Use short paragraphs and concrete examples where helpful.",
  },
];

/** Idea mode: turn the note's idea/requirement into a structured document.
 *  `kind` must match the /api/ai/generate-doc enum. */
const DOC_PRESETS: { kind: string; label: string }[] = [
  { kind: "prd", label: "PRD" },
  { kind: "frd", label: "FRD" },
  { kind: "brd", label: "BRD" },
  { kind: "product-note", label: "Product note" },
  { kind: "spec", label: "Spec" },
];

function captureSelection(): { text: string; range: [number, number] | null } {
  const view = getActiveView();
  if (!view) return { text: "", range: null };
  const sel = view.state.selection.main;
  if (sel.empty) return { text: "", range: null };
  return { text: view.state.sliceDoc(sel.from, sel.to), range: [sel.from, sel.to] };
}

function captureNote(): string {
  const view = getActiveView();
  return view ? view.state.doc.toString() : "";
}

/** Resolve the current theme from the <html> class set by theme-init.js. */
function useIsDark(): boolean {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const read = () => {
      const cl = document.documentElement.classList;
      if (cl.contains("dark")) return true;
      if (cl.contains("light")) return false;
      return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    };
    setDark(read());
    const obs = new MutationObserver(() => setDark(read()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

export function SgnkAiButton(): React.JSX.Element | null {
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<Scope>("note");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [applied, setApplied] = useState<Applied | null>(null);
  const [busyLabel, setBusyLabel] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const activePath = useEditorStore((s) => s.activePath);
  const isDark = useIsDark();

  // Dark mode → light-coloured glyph (sgnkai-light.png). Light mode →
  // dark glyph (sgnkai.png).
  const logoSrc = isDark ? "/sgnkai-light.png" : "/sgnkai.png";

  const hasSelection = useMemo(() => captureSelection().range !== null, [open]);

  useEffect(() => {
    if (!open) return;
    setScope(hasSelection ? "selection" : "note");
  }, [open, hasSelection]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && (e.key === "j" || e.key === "J")) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    function onClickOutside(e: MouseEvent) {
      if (!open) return;
      const el = panelRef.current;
      if (el && !el.contains(e.target as Node)) {
        const trigger = document.getElementById("sgnk-ai-trigger");
        if (trigger && trigger.contains(e.target as Node)) return;
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClickOutside);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => promptRef.current?.focus());
    else setError(null);
  }, [open]);

  const resolveTarget = useCallback((): { text: string; range: [number, number] | null } => {
    if (scope === "selection") return captureSelection();
    return { text: captureNote(), range: null };
  }, [scope]);

  const runRequest = useCallback(
    async (preset: Preset | "custom", instruction?: string) => {
      setBusy(true);
      setError(null);
      setResult(null);
      setApplied(null);
      const label =
        preset === "custom"
          ? "Working on your request"
          : (PRESETS.find((p) => p.key === preset)?.label ?? "Generating");
      setBusyLabel(label);
      try {
        const { text, range } = resolveTarget();
        if (!text.trim()) {
          setError(scope === "selection" ? "No selection — pick text first." : "Note is empty.");
          return;
        }
        const endpoint = preset === "summarize" ? "/api/ai/summarize" : "/api/ai/refine";
        const body: Record<string, unknown> = { text };
        if (preset !== "summarize" && instruction) body["instruction"] = instruction;
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error((await safeDetail(res)) || `Request failed (${res.status}).`);
        const data = (await res.json()) as { text?: string; summary?: string };
        const out = preset === "summarize" ? data.summary : data.text;
        if (typeof out !== "string") throw new Error("Empty response from AI.");
        setResult({ text: out, selRange: range });
      } catch (err) {
        setError(err instanceof Error ? err.message : "AI request failed.");
      } finally {
        setBusy(false);
      }
    },
    [resolveTarget, scope],
  );

  /** Idea mode — generate a PRD/FRD/BRD/product-note/spec from the note's idea
   *  and surface it for review + insert (reuses the result pipeline). */
  const runDoc = useCallback(
    async (kind: string, label: string) => {
      setBusy(true);
      setError(null);
      setResult(null);
      setApplied(null);
      setBusyLabel(`Generating ${label}`);
      try {
        const { text, range } = resolveTarget();
        if (!text.trim()) {
          setError(
            scope === "selection" ? "No selection — pick an idea first." : "Write an idea in the note first.",
          );
          return;
        }
        const res = await fetch("/api/ai/generate-doc", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ kind, idea: text }),
        });
        if (!res.ok) throw new Error((await safeDetail(res)) || `Request failed (${res.status}).`);
        const data = (await res.json()) as { document?: string };
        if (typeof data.document !== "string") throw new Error("Empty response from AI.");
        setResult({ text: data.document, selRange: range });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Generation failed.");
      } finally {
        setBusy(false);
      }
    },
    [resolveTarget, scope],
  );

  // Insert at end-of-selection / end-of-doc, then HIGHLIGHT the inserted
  // range and switch to the inline Keep/Undo state — the user sees exactly
  // what changed in the doc before committing.
  const insertBelow = useCallback(() => {
    if (!result) return;
    const view = getActiveView();
    const path = getActivePath() ?? activePath;
    if (!view || !path) return;
    const anchor = result.selRange !== null ? result.selRange[1] : view.state.doc.length;
    const body = result.text.trim();
    const block = `\n\n${body}\n`;
    // The highlighted range is the inserted body (skip the leading blank
    // lines so the tint hugs the text, not the gap).
    const from = anchor + 2;
    const to = from + body.length;
    view.dispatch({
      changes: { from: anchor, to: anchor, insert: block },
      effects: showAiSuggestion.of({ from, to }),
      scrollIntoView: true,
    });
    setApplied({ from, to });
  }, [result, activePath]);

  const replaceSelection = useCallback(() => {
    if (!result || !result.selRange) return;
    const view = getActiveView();
    if (!view) return;
    const [from, to] = result.selRange;
    const body = result.text;
    view.dispatch({
      changes: { from, to, insert: body },
      effects: showAiSuggestion.of({ from, to: from + body.length }),
      scrollIntoView: true,
    });
    setApplied({ from, to: from + body.length });
  }, [result]);

  // Keep — accept the suggestion: clear the highlight, leave the text.
  const keepApplied = useCallback(() => {
    const view = getActiveView();
    if (view) view.dispatch({ effects: clearAiSuggestion.of(null) });
    setApplied(null);
    setResult(null);
    setOpen(false);
    view?.focus();
  }, []);

  // Undo — reject: delete the inserted range, clear the highlight, go back
  // to the result so the user can try a different action.
  const undoApplied = useCallback(() => {
    if (!applied) return;
    const view = getActiveView();
    if (view) {
      view.dispatch({
        changes: { from: applied.from, to: applied.to, insert: "" },
        effects: clearAiSuggestion.of(null),
      });
    }
    setApplied(null);
  }, [applied]);

  const copyToClipboard = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.text);
    } catch {
      /* clipboard blocked */
    }
  }, [result]);

  const submitCustom = useCallback(() => {
    const p = customPrompt.trim();
    if (p) void runRequest("custom", p);
  }, [customPrompt, runRequest]);

  // ── Inline style objects ────────────────────────────────────────────
  const panelBg = isDark ? "#1f1f1f" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.12)" : "rgba(10,10,10,0.10)";
  const fg = isDark ? "#ededed" : "#18181b";
  const muted = isDark ? "rgba(237,237,237,0.55)" : "#6b6b73";
  const chipBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(10,10,10,0.04)";
  const accent = "#0055ff";

  const triggerStyle: CSSProperties = {
    position: "fixed",
    right: 18,
    bottom: 18,
    zIndex: 90,
    width: 44,
    height: 44,
    padding: 0,
    overflow: "hidden",
    borderRadius: 999,
    border: `1px solid ${border}`,
    background: panelBg,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.5)" : "0 4px 16px rgba(0,0,0,0.12)",
  };

  const panelStyle: CSSProperties = {
    position: "fixed",
    right: 18,
    bottom: 72,
    zIndex: 89,
    width: "min(440px, calc(100vw - 36px))",
    maxHeight: "min(560px, calc(100dvh - 120px))",
    overflow: "auto",
    padding: 14,
    borderRadius: 14,
    border: `1px solid ${border}`,
    background: panelBg,
    color: fg,
    boxShadow: isDark ? "0 16px 48px rgba(0,0,0,0.6)" : "0 16px 48px rgba(0,0,0,0.18)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
    fontSize: 13,
  };

  const rowStyle: CSSProperties = { display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" };

  function scopeChipStyle(active: boolean, disabled: boolean): CSSProperties {
    return {
      height: 26,
      padding: "0 10px",
      borderRadius: 999,
      border: `1px solid ${active ? "transparent" : border}`,
      background: active ? accent : "transparent",
      color: active ? "#ffffff" : disabled ? muted : fg,
      fontSize: 12,
      fontWeight: 500,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
    };
  }

  const presetChipStyle: CSSProperties = {
    height: 26,
    padding: "0 10px",
    borderRadius: 6,
    border: `1px solid ${border}`,
    background: chipBg,
    color: fg,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
  };

  const actionStyle: CSSProperties = {
    height: 28,
    padding: "0 10px",
    borderRadius: 6,
    border: `1px solid ${border}`,
    background: chipBg,
    color: fg,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
  };

  return (
    <>
      <button
        id="sgnk-ai-trigger"
        type="button"
        onClick={() => setOpen((v) => !v)}
        title="Ask sgnk AI (⌘J)"
        aria-label="Ask sgnk AI"
        aria-expanded={open}
        className={busy ? "sgnk-ai-busy" : undefined}
        style={triggerStyle}
      >
        <img
          src={logoSrc}
          alt=""
          width={20}
          height={20}
          style={{
            width: 20,
            height: 20,
            objectFit: "contain",
            display: "block",
            // Spin the logo gently while a request is in flight so the
            // trigger itself signals progress even when the panel is closed.
            animation: busy ? "sgnk-spin 1.1s linear infinite" : undefined,
          }}
        />
      </button>

      {open && (
        <div ref={panelRef} role="dialog" aria-label="sgnk AI" style={panelStyle}>
          {/* Scope */}
          <div style={rowStyle}>
            <button type="button" disabled={!hasSelection} aria-pressed={scope === "selection"}
              style={scopeChipStyle(scope === "selection", !hasSelection)}
              onClick={() => setScope("selection")}>Selection</button>
            <button type="button" aria-pressed={scope === "note"}
              style={scopeChipStyle(scope === "note", false)}
              onClick={() => setScope("note")}>This note</button>
            <button type="button" disabled aria-pressed={false}
              style={scopeChipStyle(false, true)} title="Coming soon">Vault</button>
          </div>

          {/* Presets */}
          <div style={{ ...rowStyle, gap: 4 }}>
            {PRESETS.map((p) => (
              <button key={p.key} type="button" disabled={busy} style={presetChipStyle}
                onClick={() => void runRequest(p.key, p.instruction)}>{p.label}</button>
            ))}
          </div>

          {/* Idea mode — generate structured docs from the note's idea */}
          <div style={{ ...rowStyle, gap: 4, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "var(--muted)", marginRight: 2 }}>Idea →</span>
            {DOC_PRESETS.map((d) => (
              <button key={d.kind} type="button" disabled={busy} style={presetChipStyle}
                title={`Generate a ${d.label} from this note's idea`}
                onClick={() => void runDoc(d.kind, d.label)}>{d.label}</button>
            ))}
          </div>

          {/* Prompt */}
          <textarea
            ref={promptRef}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                submitCustom();
              }
            }}
            placeholder="Ask sgnk AI… (⌘+Enter)"
            rows={2}
            disabled={busy}
            style={{
              width: "100%",
              minHeight: 44,
              padding: "8px 10px",
              fontFamily: "inherit",
              fontSize: 13,
              lineHeight: 1.45,
              color: fg,
              background: isDark ? "#161616" : "#fafafa",
              border: `1px solid ${border}`,
              borderRadius: 8,
              outline: "none",
              resize: "vertical",
            }}
          />

          {/* Progress — visible, animated. A shimmer bar + the action
              label so the user always knows something is happening. */}
          {busy && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: fg }}>
                <span
                  aria-hidden
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    border: `2px solid ${border}`,
                    borderTopColor: accent,
                    animation: "sgnk-spin 0.8s linear infinite",
                    display: "inline-block",
                  }}
                />
                <span>{busyLabel}…</span>
              </div>
              <div className="sgnk-ai-shimmer" style={{ height: 6, borderRadius: 999, background: chipBg }} />
            </div>
          )}

          {error && (
            <div role="alert" style={{ fontSize: 12, color: "#d4534e", padding: "6px 8px", borderRadius: 6, background: "rgba(212,83,78,0.12)" }}>
              {error}
            </div>
          )}

          {/* Applied — the suggestion is in the doc, highlighted. Keep or
              Undo, inline. */}
          {applied && !busy && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 12, color: muted }}>
                Applied to your note — highlighted below. Keep it or undo.
              </div>
              <div style={{ ...rowStyle, gap: 6 }}>
                <button
                  type="button"
                  style={{ ...actionStyle, background: accent, color: "#fff", border: "1px solid transparent" }}
                  onClick={keepApplied}
                >
                  Keep
                </button>
                <button
                  type="button"
                  style={{ ...actionStyle, background: "transparent", color: muted }}
                  onClick={undoApplied}
                >
                  Undo
                </button>
              </div>
            </div>
          )}

          {/* Result preview + initial actions. */}
          {result && !busy && !applied && (
            <>
              <div style={{ maxHeight: 320, overflow: "auto", padding: "8px 10px", borderRadius: 8, border: `1px solid ${border}`, background: isDark ? "#161616" : "#fafafa" }}>
                <Markdown content={result.text} />
              </div>
              <div style={{ ...rowStyle, gap: 6 }}>
                <button type="button" style={{ ...actionStyle, background: accent, color: "#fff", border: "1px solid transparent" }} onClick={insertBelow}>Insert below</button>
                {result.selRange && (
                  <button type="button" style={actionStyle} onClick={replaceSelection}>Replace selection</button>
                )}
                <button type="button" style={actionStyle} onClick={() => void copyToClipboard()}>Copy</button>
                <button type="button" style={{ ...actionStyle, background: "transparent", color: muted }} onClick={() => setResult(null)}>Discard</button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

async function safeDetail(res: Response): Promise<string> {
  try {
    const j = (await res.json()) as { detail?: string; error?: string };
    return j.detail ?? j.error ?? "";
  } catch {
    return "";
  }
}
