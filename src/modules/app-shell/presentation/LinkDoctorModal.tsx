"use client";

/**
 * LinkDoctorModal — vault-wide AI sweep that proposes wikilink rewrites across
 * many notes at once. Workflow:
 *
 *   1. Pick a batch of notes (default: first 20 non-Archive vault notes).
 *   2. Server scans each (concurrent suggest-links calls, capped) and returns
 *      grouped suggestions with each note's content + sha.
 *   3. User ticks per-note suggestions to apply.
 *   4. "Apply & commit" rebuilds new content per note and posts a single
 *      atomic /api/commit (with per-file baseSha conflict protection).
 */

import { useEffect, useMemo, useState } from "react";
import { GoogleIcon } from "@/shared/presentation/GoogleIcon";
import { useSnapshot } from "@/modules/vault";
import type { LinkDoctorNoteResult, Suggestion } from "@/modules/ai";
import { applyWikilinkSuggestion } from "@/modules/ai";

interface LinkDoctorModalProps {
  open: boolean;
  onClose: () => void;
}

type Phase =
  | { kind: "setup" }
  | { kind: "scanning" }
  | { kind: "results"; results: LinkDoctorNoteResult[]; chosen: boolean[][] }
  | { kind: "committing" }
  | { kind: "error"; message: string }
  | { kind: "done"; commitSha: string; touched: number };

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

function pickDefaultPaths(allPaths: string[], limit: number): string[] {
  return allPaths
    .filter((p) => !p.startsWith("_Archive/") && p !== "_Archive.md")
    .slice(0, limit);
}

export function LinkDoctorModal({ open, onClose }: LinkDoctorModalProps): React.ReactNode {
  const { snapshot } = useSnapshot();
  const [phase, setPhase] = useState<Phase>({ kind: "setup" });
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  // Reset phase when modal opens.
  useEffect(() => {
    if (open) setPhase({ kind: "setup" });
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const allPaths = useMemo(() => {
    if (!snapshot) return [] as string[];
    return snapshot.notes.map((n) => n.path);
  }, [snapshot]);

  const selectedPaths = useMemo(
    () => pickDefaultPaths(allPaths, Math.min(limit, MAX_LIMIT)),
    [allPaths, limit],
  );

  async function runScan() {
    if (selectedPaths.length === 0) {
      setPhase({ kind: "error", message: "No vault notes available." });
      return;
    }
    setPhase({ kind: "scanning" });
    try {
      const res = await fetch("/api/ai/link-doctor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ paths: selectedPaths }),
      });
      if (!res.ok) {
        let detail = "";
        try {
          detail = ((await res.json()) as { detail?: string }).detail ?? "";
        } catch {
          /* non-JSON */
        }
        if (/free tier/i.test(detail)) {
          throw new Error("AI needs credits on this Vercel account — add AI credits to use Link Doctor.");
        }
        throw new Error(detail || `Scan failed (HTTP ${res.status}).`);
      }
      const data = (await res.json()) as { results: LinkDoctorNoteResult[] };
      setPhase({
        kind: "results",
        results: data.results,
        chosen: data.results.map((r) => r.suggestions.map(() => true)),
      });
    } catch (err) {
      setPhase({
        kind: "error",
        message: err instanceof Error ? err.message : "AI failed",
      });
    }
  }

  function toggle(noteIdx: number, suggIdx: number) {
    if (phase.kind !== "results") return;
    const next = phase.chosen.map((arr) => arr.slice());
    const row = next[noteIdx];
    if (!row) return;
    row[suggIdx] = !row[suggIdx];
    setPhase({ ...phase, chosen: next });
  }

  function toggleAllInNote(noteIdx: number, value: boolean) {
    if (phase.kind !== "results") return;
    const next = phase.chosen.map((arr) => arr.slice());
    const row = next[noteIdx];
    if (!row) return;
    for (let i = 0; i < row.length; i++) row[i] = value;
    setPhase({ ...phase, chosen: next });
  }

  async function applyAndCommit() {
    if (phase.kind !== "results") return;
    interface CommitFile {
      path: string;
      content: string;
      baseSha: string;
    }
    const files: CommitFile[] = [];
    for (let i = 0; i < phase.results.length; i++) {
      const r = phase.results[i];
      const sel = phase.chosen[i];
      if (!r || !sel) continue;
      const chosenSugg: Suggestion[] = r.suggestions.filter((_, j) => sel[j]);
      if (chosenSugg.length === 0) continue;
      let newContent = r.content;
      for (const s of chosenSugg) {
        newContent = applyWikilinkSuggestion(newContent, s);
      }
      if (newContent !== r.content) {
        files.push({ path: r.path, content: newContent, baseSha: r.sha });
      }
    }

    if (files.length === 0) {
      setPhase({ kind: "error", message: "Nothing selected to apply." });
      return;
    }

    setPhase({ kind: "committing" });
    try {
      const res = await fetch("/api/commit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          files,
          message: `AI Link Doctor: wikilink ${files.length} note(s) via sgnk-md`,
        }),
      });
      if (!res.ok) {
        if (res.status === 409) {
          throw new Error("Some notes changed since the scan — close this and re-run Link Doctor.");
        }
        const body = (await res.json().catch(() => ({}))) as { error?: string; detail?: string };
        throw new Error(body.detail ?? body.error ?? `Commit failed (HTTP ${res.status}).`);
      }
      const data = (await res.json()) as { commitSha?: string };
      setPhase({
        kind: "done",
        commitSha: data.commitSha ?? "",
        touched: files.length,
      });
      window.dispatchEvent(new CustomEvent("sgnk:vault-changed"));
    } catch (err) {
      setPhase({
        kind: "error",
        message: err instanceof Error ? err.message : "Commit failed",
      });
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="AI Link Doctor"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "60px 20px",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="sgnk-surface sgnk-fade-in"
        style={{
          width: "min(720px, 95vw)",
          maxHeight: "calc(100dvh - 120px)",
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <strong style={{ fontSize: "14px" }}>AI Link Doctor</strong>
          <button className="sgnk-icon-btn" onClick={onClose} aria-label="Close"><GoogleIcon name="close" size={16} weight={500} /></button>
        </div>

        {phase.kind === "setup" && (
          <SetupView
            limit={limit}
            setLimit={setLimit}
            available={allPaths.length}
            willScan={selectedPaths.length}
            onScan={runScan}
          />
        )}

        {phase.kind === "scanning" && (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--muted)" }}>
            Scanning {selectedPaths.length} notes… this can take a minute.
          </div>
        )}

        {phase.kind === "results" && (
          <ResultsView
            results={phase.results}
            chosen={phase.chosen}
            onToggle={toggle}
            onToggleAll={toggleAllInNote}
            onApply={applyAndCommit}
            onBack={() => setPhase({ kind: "setup" })}
          />
        )}

        {phase.kind === "committing" && (
          <div style={{ padding: "20px", textAlign: "center", color: "var(--muted)" }}>
            Committing changes to GitHub…
          </div>
        )}

        {phase.kind === "done" && (
          <div style={{ padding: "16px", color: "var(--fg)" }}>
            Updated {phase.touched} note(s){" "}
            {phase.commitSha && (
              <span style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                ({phase.commitSha.slice(0, 7)})
              </span>
            )}
            .
            <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
              <button className="sgnk-btn sgnk-btn-primary" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        )}

        {phase.kind === "error" && (
          <div style={{ padding: "12px 0" }}>
            <div style={{ fontSize: "13px", color: "var(--fg-muted)" }}>{phase.message}</div>
            <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button className="sgnk-btn sgnk-btn-ghost" onClick={() => setPhase({ kind: "setup" })}>
                Back
              </button>
              <button className="sgnk-btn sgnk-btn-primary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── subviews ────────────────────────────────────────────────────────────────

function SetupView({
  limit,
  setLimit,
  available,
  willScan,
  onScan,
}: {
  limit: number;
  setLimit: (n: number) => void;
  available: number;
  willScan: number;
  onScan: () => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <p style={{ margin: 0, fontSize: "13px", color: "var(--fg-muted)", lineHeight: 1.55 }}>
        Sweeps the vault and proposes <code>[[wikilink]]</code> rewrites where
        phrases match existing notes. Reviews each suggestion before any commit.
        Excludes <code>_Archive/</code>.
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <label style={{ fontSize: "12px", color: "var(--muted)" }} htmlFor="ld-limit">
          Notes to scan
        </label>
        <input
          id="ld-limit"
          type="number"
          min={1}
          max={MAX_LIMIT}
          value={limit}
          onChange={(e) => setLimit(Math.max(1, Math.min(MAX_LIMIT, Number(e.target.value) || 1)))}
          className="sgnk-input"
          style={{ width: "80px" }}
        />
        <span style={{ fontSize: "12px", color: "var(--muted)" }}>
          will scan {willScan} of {available} (max {MAX_LIMIT})
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="sgnk-btn sgnk-btn-primary" onClick={onScan} disabled={willScan === 0}>
          Scan
        </button>
      </div>
    </div>
  );
}

function ResultsView({
  results,
  chosen,
  onToggle,
  onToggleAll,
  onApply,
  onBack,
}: {
  results: LinkDoctorNoteResult[];
  chosen: boolean[][];
  onToggle: (noteIdx: number, suggIdx: number) => void;
  onToggleAll: (noteIdx: number, value: boolean) => void;
  onApply: () => void;
  onBack: () => void;
}) {
  const totalChecked = chosen.reduce((acc, row) => acc + row.filter(Boolean).length, 0);
  const totalNotes = chosen.filter((row, i) => row.some(Boolean) && (results[i]?.suggestions.length ?? 0) > 0).length;

  if (results.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ padding: "10px 0", color: "var(--fg-muted)", fontSize: "13px" }}>
          No clear wikilink suggestions across the scanned notes.
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="sgnk-btn sgnk-btn-ghost" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, minHeight: 0 }}>
      <div style={{ overflowY: "auto", flex: 1, minHeight: 0, paddingRight: "4px" }}>
        {results.map((r, i) => {
          const rowChosen = chosen[i] ?? [];
          const allOn = rowChosen.every(Boolean);
          return (
            <div
              key={r.path}
              style={{
                borderBottom: "1px solid var(--border)",
                padding: "8px 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={allOn}
                    onChange={(e) => onToggleAll(i, e.target.checked)}
                  />
                  <span style={{ fontSize: "13px", color: "var(--fg)", fontWeight: 500 }}>{r.path}</span>
                </label>
                <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--muted)" }}>
                  {rowChosen.filter(Boolean).length}/{r.suggestions.length}
                </span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 0 18px" }}>
                {r.suggestions.map((s, j) => (
                  <li key={j} style={{ padding: "3px 0" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={!!rowChosen[j]}
                        onChange={() => onToggle(i, j)}
                      />
                      <span style={{ fontSize: "12.5px" }}>
                        <span style={{ color: "var(--fg)" }}>{s.phrase}</span>
                        <span style={{ color: "var(--muted)" }}> → </span>
                        <span style={{ color: "var(--link)" }}>[[{s.basename}]]</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "12px", color: "var(--muted)" }}>
          {totalChecked} change{totalChecked === 1 ? "" : "s"} across {totalNotes} note{totalNotes === 1 ? "" : "s"}
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="sgnk-btn sgnk-btn-ghost" onClick={onBack}>
            Back
          </button>
          <button className="sgnk-btn sgnk-btn-primary" onClick={onApply} disabled={totalChecked === 0}>
            Apply & commit
          </button>
        </div>
      </div>
    </div>
  );
}
