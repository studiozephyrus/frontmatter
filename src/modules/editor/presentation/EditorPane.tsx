"use client";

import { memo, useCallback, useEffect, useDeferredValue, useMemo, useRef, useState } from "react";
import { openSearchPanel } from "@codemirror/search";
import { useEditorStore } from "@/modules/editor/presentation/editor-store";
import type { EditorMode } from "@/modules/editor/presentation/editor-store";
import { useEditorSettings } from "@/modules/editor/presentation/editor-settings";
import { useBookmarks } from "@/modules/editor/presentation/bookmarks";
import { getActiveView } from "@/modules/editor/presentation/active-view";
import { createSplitScrollSync } from "@/modules/editor/presentation/split-scroll-sync";
import { useNoteContent } from "@/modules/editor/presentation/use-note-content";
import { CodeMirrorEditor } from "@/modules/editor/presentation/CodeMirrorEditor";
import type { CompletionData } from "@/modules/editor/presentation/CodeMirrorEditor";
import { LivePreview } from "@/modules/editor/presentation/live/LivePreview";
import { Toolbar } from "@/modules/editor/presentation/Toolbar";
import { HistoryModal } from "@/modules/editor/presentation/HistoryModal";
import { Markdown, PropertiesPanel } from "@/modules/preview";
import { useSnapshot } from "@/modules/vault";
import { setBasenameEntry } from "@/modules/vault/domain/link-index";
import { resolveWikilink } from "@/modules/preview";
import { saveDraft } from "@/modules/drafts";
import { ExportMenu } from "@/modules/export";
import { AIMenu } from "@/modules/editor/presentation/AIMenu";
import { ShareMenu } from "@/modules/share";
import { GoogleIcon } from "@/shared/presentation/GoogleIcon";

// ---------------------------------------------------------------------------
// Editor statusbar — word/char count, reading time, view toggles, find
// ---------------------------------------------------------------------------

function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed === "") return 0;
  return trimmed.split(/\s+/).length;
}

/** True on phone-width viewports (≤767px). SSR-safe (false until mounted). */
function useIsNarrow(): boolean {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return narrow;
}

function EditorStatusBar({ content, path }: { content: string; path: string }) {
  const settings = useEditorSettings();
  const bookmarks = useBookmarks();
  const bookmarked = bookmarks.paths.includes(path);
  const narrow = useIsNarrow();
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const words = countWords(content);
  const readMin = Math.max(1, Math.ceil(words / 200));

  const toggles: { key: "lineNumbers" | "vimMode" | "spellcheck" | "focusMode" | "aiGhostText"; label: string }[] = [
    { key: "aiGhostText", label: "AI autocomplete" },
    { key: "lineNumbers", label: "Line numbers" },
    { key: "vimMode", label: "Vim mode" },
    { key: "spellcheck", label: "Spellcheck" },
    { key: "focusMode", label: "Focus mode" },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "11px",
        color: "var(--muted)",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {!narrow && <span style={{ marginRight: 2 }}>{words} words · {readMin} min</span>}
      {/* Icon-only controls, sized at par with the formatting toolbar
          (GoogleIcon size 18 in .sgnk-tool-btn) so the whole row reads as
          one consistent set. */}
      <button
        className="sgnk-tool-btn"
        style={bookmarked ? { color: "var(--accent)" } : undefined}
        onClick={() => bookmarks.toggle(path)}
        title={bookmarked ? "Remove bookmark" : "Bookmark this note"}
        aria-label={bookmarked ? "Remove bookmark" : "Bookmark this note"}
        aria-pressed={bookmarked}
      >
        <GoogleIcon name={bookmarked ? "bookmark" : "bookmark_border"} size={18} weight={500} />
      </button>
      <button
        className="sgnk-tool-btn"
        onClick={() => {
          const v = getActiveView();
          if (v) {
            openSearchPanel(v);
            v.focus();
          }
        }}
        title="Find / replace (Mod+F)"
        aria-label="Find / replace"
      >
        <GoogleIcon name="search" size={18} weight={500} />
      </button>
      <button
        className="sgnk-tool-btn"
        onClick={() => setHistoryOpen(true)}
        title="Version history"
        aria-label="Version history"
      >
        <GoogleIcon name="history" size={18} weight={500} />
      </button>
      <button
        className="sgnk-tool-btn"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-label="View options"
        onClick={() => setMenuOpen((v) => !v)}
        title="View options"
      >
        <GoogleIcon name="tune" size={18} weight={500} />
      </button>
      <HistoryModal path={path} open={historyOpen} onClose={() => setHistoryOpen(false)} />
      {menuOpen && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 90 }} onClick={() => setMenuOpen(false)} />
          <div
            role="menu"
            className="sgnk-surface sgnk-fade-in"
            style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", minWidth: 180, padding: 4, zIndex: 100 }}
          >
            {toggles.map((tg) => (
              <button
                key={tg.key}
                role="menuitemcheckbox"
                aria-checked={settings[tg.key]}
                onClick={() => settings.toggle(tg.key)}
                className="sgnk-tree-row"
                style={{ justifyContent: "space-between" }}
              >
                <span>{tg.label}</span>
                <span style={{ color: settings[tg.key] ? "var(--accent)" : "transparent", display: "inline-flex" }}>
                  <GoogleIcon name="check" size={14} weight={500} />
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mode toggle
// ---------------------------------------------------------------------------

const MODES: { value: EditorMode; label: string }[] = [
  { value: "edit", label: "Edit" },
  { value: "live", label: "Live" },
  { value: "reading", label: "Reading" },
  { value: "split", label: "Split" },
];

function ModeToggle() {
  // Stable primitive selector — no object/array returned
  const mode = useEditorStore((s) => s.mode);
  // Stable function selector — setMode ref never changes in Zustand
  const setMode = useEditorStore((s) => s.setMode);

  // Hide Split mode on narrow viewports (unusable below ~768px).
  // Force the active mode away from split if the viewport shrinks under it.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  useEffect(() => {
    if (narrow && mode === "split") setMode("edit");
  }, [narrow, mode, setMode]);

  const visibleModes = narrow ? MODES.filter((m) => m.value !== "split") : MODES;

  return (
    <div className="sgnk-seg" style={{ flexShrink: 0 }}>
      {visibleModes.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setMode(value)}
          aria-pressed={mode === value}
          className="sgnk-seg-item"
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Note view — renders the active note in the correct mode
// ---------------------------------------------------------------------------

/**
 * SyncedSplitScroll — wires proportional, two-way scroll syncing between
 * the CodeMirror editor on the left (`.cm-scroller`) and the markdown
 * preview on the right (`[data-scroll-region]`) of a split pane.
 *
 * Scrolling either side updates the other so they share the same
 * fractional position. A small guard flag suppresses feedback echo
 * (programmatic scroll → handler → would re-trigger).
 *
 * Renders nothing — pure side-effect component. Lives inline because
 * it needs the same `splitRef` the gutter and panes share.
 */
function SyncedSplitScroll({ containerRef, signalKey }: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Bumped whenever the underlying note (path) changes so we can
   *  re-bind to the freshly-mounted CodeMirror scroller. */
  signalKey: string;
}) {
  useEffect(() => {
    let cancelled = false;
    let leftEl: HTMLElement | null = null;
    let rightEl: HTMLElement | null = null;
    // Scroll-sync follows only the pane the user is actively driving (wheel /
    // pointer / keydown within a short window), so a preview re-render's
    // reflow scroll never yanks the editor — see split-scroll-sync.ts. This
    // also subsumes the old echo guard: a programmatic scrollTop write lands
    // on the NON-driver pane, so its echo fails the intent check and stops.
    const sync = createSplitScrollSync();

    function fractionOf(el: HTMLElement): number {
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 0) return 0;
      return Math.min(1, Math.max(0, el.scrollTop / max));
    }
    function applyFraction(el: HTMLElement, f: number): void {
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 0) return;
      el.scrollTop = f * max;
    }

    function onLeftScroll() {
      if (!sync.shouldSync("left")) return;
      const c = containerRef.current;
      const left = leftEl ?? c?.querySelector<HTMLElement>(".cm-scroller") ?? null;
      const right = rightEl ?? c?.querySelector<HTMLElement>("[data-scroll-region]") ?? null;
      if (!left || !right) return;
      applyFraction(right, fractionOf(left));
    }
    function onRightScroll() {
      if (!sync.shouldSync("right")) return;
      const c = containerRef.current;
      const left = leftEl ?? c?.querySelector<HTMLElement>(".cm-scroller") ?? null;
      const right = rightEl ?? c?.querySelector<HTMLElement>("[data-scroll-region]") ?? null;
      if (!left || !right) return;
      applyFraction(left, fractionOf(right));
    }
    const onLeftGesture = () => sync.noteGesture("left");
    const onRightGesture = () => sync.noteGesture("right");

    function unbind(): void {
      if (leftEl) {
        leftEl.removeEventListener("scroll", onLeftScroll);
        leftEl.removeEventListener("wheel", onLeftGesture);
        leftEl.removeEventListener("pointerdown", onLeftGesture);
        leftEl.removeEventListener("keydown", onLeftGesture);
      }
      if (rightEl) {
        rightEl.removeEventListener("scroll", onRightScroll);
        rightEl.removeEventListener("wheel", onRightGesture);
        rightEl.removeEventListener("pointerdown", onRightGesture);
      }
    }

    // Bind whenever both scrollers are in the DOM. CodeMirror mounts
    // its `.cm-scroller` asynchronously; on initial render we may need
    // a few frames. Use a MutationObserver scoped to the split
    // container so we don't poll the whole document.
    function tryBind() {
      if (cancelled) return;
      const c = containerRef.current;
      if (!c) return;
      const left = c.querySelector<HTMLElement>(".cm-scroller");
      const right = c.querySelector<HTMLElement>("[data-scroll-region]");
      if (!left || !right) return;
      // Already bound to the same elements? Skip — avoids leaking
      // duplicate listeners on every observer tick.
      if (left === leftEl && right === rightEl) return;
      unbind(); // remove old listeners if elements changed (e.g. note swap)
      leftEl = left;
      rightEl = right;
      // keydown on the editor (typing / arrow nav) makes it the driver, so its
      // caret-follow scroll propagates to the preview — but a preview reflow
      // (no gesture on the right) never propagates back.
      left.addEventListener("scroll", onLeftScroll, { passive: true });
      left.addEventListener("wheel", onLeftGesture, { passive: true });
      left.addEventListener("pointerdown", onLeftGesture, { passive: true });
      left.addEventListener("keydown", onLeftGesture, { passive: true });
      right.addEventListener("scroll", onRightScroll, { passive: true });
      right.addEventListener("wheel", onRightGesture, { passive: true });
      right.addEventListener("pointerdown", onRightGesture, { passive: true });
    }

    tryBind();
    const observer = new MutationObserver(() => tryBind());
    const c = containerRef.current;
    if (c) {
      observer.observe(c, { childList: true, subtree: true });
    }

    return () => {
      cancelled = true;
      observer.disconnect();
      unbind();
    };
  }, [containerRef, signalKey]);

  return null;
}

function scheduleAfterPaint(callback: () => void): () => void {
  if (typeof window === "undefined") {
    callback();
    return () => {};
  }

  let timeoutId: number | null = null;
  const run = () => {
    timeoutId = window.setTimeout(callback, 0);
  };

  if (typeof window.requestAnimationFrame === "function") {
    const frameId = window.requestAnimationFrame(run);
    return () => {
      window.cancelAnimationFrame(frameId);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }

  timeoutId = window.setTimeout(callback, 0);
  return () => {
    if (timeoutId !== null) window.clearTimeout(timeoutId);
  };
}

function PreviewPending() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "160px",
        color: "var(--muted)",
        fontSize: "13px",
      }}
    >
      Rendering preview…
    </div>
  );
}

const MarkdownPreviewPane = memo(function MarkdownPreviewPane({
  content,
  onWikilink,
  basenameToPath,
  onToggleTask,
  onEdit,
}: {
  content: string;
  onWikilink: (target: string) => void;
  basenameToPath: Map<string, string>;
  onToggleTask: (newContent: string) => void;
  onEdit: (newContent: string) => void;
}) {
  const [renderContent, setRenderContent] = useState<string | null>(null);
  const ready = renderContent === content;

  useEffect(() => {
    if (ready) return;
    setRenderContent(null);
    return scheduleAfterPaint(() => setRenderContent(content));
  }, [content, ready]);

  if (!ready || renderContent === null) return <PreviewPending />;

  return (
    <Markdown
      content={renderContent}
      onWikilink={onWikilink}
      basenameToPath={basenameToPath}
      onToggleTask={onToggleTask}
      onEdit={onEdit}
    />
  );
});

function NoteView({
  path,
  basenameToPath,
  completionData,
}: {
  path: string;
  basenameToPath: Map<string, string>;
  completionData: CompletionData;
}) {
  const { loading, error, initialContent, baseSha } = useNoteContent(path);

  // Stable primitive selector — contentByPath[path] is a string or undefined
  const liveContent = useEditorStore((s) => s.contentByPath[path]);
  // Stable primitive selector
  const mode = useEditorStore((s) => s.mode);
  const reload = useEditorStore((s) => s.reloadByPath[path] ?? 0);
  const focusMode = useEditorSettings((s) => s.focusMode);

  // Split-mode resizable divider (fraction of width given to the editor pane).
  const splitRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [splitRatio, setSplitRatio] = useState(0.5);
  useEffect(() => {
    try {
      const v = parseFloat(localStorage.getItem("sgnk-split") ?? "");
      if (v >= 0.2 && v <= 0.8) setSplitRatio(v);
    } catch {
      /* ignore */
    }
  }, []);
  function onGutterDown(e: React.PointerEvent) {
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }
  function onGutterMove(e: React.PointerEvent) {
    if (!draggingRef.current || !splitRef.current) return;
    const r = splitRef.current.getBoundingClientRect();
    const frac = Math.min(0.8, Math.max(0.2, (e.clientX - r.left) / r.width));
    setSplitRatio(frac);
  }
  function onGutterUp(e: React.PointerEvent) {
    if (draggingRef.current) {
      draggingRef.current = false;
      try {
        localStorage.setItem("sgnk-split", String(splitRatio));
      } catch {
        /* ignore */
      }
    }
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  }

  // The content shown in the preview: prefer live (typed) content, fall back to initialContent
  // `liveContent` is updated SYNCHRONOUSLY on every keystroke by the
  // CodeMirror update listener (instant preview). For the actual
  // re-render we wrap it in `useDeferredValue` so React schedules
  // markdown re-rendering at a lower priority than the input keypress
  // — typing stays at 60fps even on long notes, the preview catches
  // up within a frame or two. The non-deferred value still flows into
  // status bar and properties panel where the lag would be visible.
  const previewContentRaw = liveContent ?? initialContent ?? "";
  const previewContent = useDeferredValue(previewContentRaw);

  // Seed the store with the loaded content once, so the Outline (and any other
  // consumer of contentByPath) has the note's headings before the user edits.
  // Guarded so it never overwrites live edits — no render loop.
  useEffect(() => {
    if (initialContent === null) return;
    const store = useEditorStore.getState();
    if (store.contentByPath[path] === undefined) {
      store.setContent(path, initialContent);
    }
    // Record the loaded blob sha so out-of-editor writes (AI apply, history
    // restore) can use a real OCC baseSha instead of the "" create-sentinel.
    if (baseSha !== null) store.setBaseSha(path, baseSha);
  }, [path, initialContent, baseSha]);

  const handleWikilink = useCallback((target: string) => {
    const resolved = resolveWikilink(target, basenameToPath);
    if (resolved !== null) {
      useEditorStore.getState().openTab(resolved);
    }
  }, [basenameToPath]);

  const handleToggleTask = useCallback((newContent: string) => {
    useEditorStore.getState().setContent(path, newContent);
    useEditorStore.getState().setDirty(path, true);
    void saveDraft(path, { content: newContent, baseSha: baseSha ?? "" });
  }, [baseSha, path]);

  const handleEdit = useCallback((newContent: string) => {
    useEditorStore.getState().setContent(path, newContent);
    useEditorStore.getState().setDirty(path, true);
    void saveDraft(path, { content: newContent, baseSha: baseSha ?? "" });
  }, [baseSha, path]);

  // "live" is preview-first: a single full-width pane that renders markdown
  // and opens a clicked block's source inline (see LivePreview). "edit" is the
  // raw CodeMirror surface. Only "reading" and "split" show the dedicated
  // preview pane.
  const showEditor = mode !== "reading";
  const showPreview = mode === "reading" || mode === "split";
  const editorFull = mode === "edit" || mode === "live";
  const [editorHasOpened, setEditorHasOpened] = useState(showEditor);
  const [previewHasOpened, setPreviewHasOpened] = useState(showPreview);
  const [lastPreviewContent, setLastPreviewContent] = useState(previewContent);

  useEffect(() => {
    if (showEditor) setEditorHasOpened(true);
  }, [showEditor]);

  useEffect(() => {
    if (showPreview) {
      setPreviewHasOpened(true);
      setLastPreviewContent(previewContent);
    }
  }, [previewContent, showPreview]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "var(--muted)",
          fontSize: "14px",
        }}
      >
        Loading…
      </div>
    );
  }

  if (error !== null) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "var(--muted)",
          fontSize: "14px",
        }}
      >
        Error: {error}
      </div>
    );
  }

  if (initialContent === null || baseSha === null) {
    return null;
  }

  const cmMaxWidth = focusMode ? "720px" : "none";
  const toolbarVisible = mode !== "reading" && !focusMode;
  const statusVisible = mode !== "reading";
  const previewSource = showPreview ? previewContent : lastPreviewContent;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {toolbarVisible && (
        <Toolbar
          key="toolbar"
          extras={
            statusVisible ? <EditorStatusBar content={previewContent} path={path} /> : undefined
          }
        />
      )}
      {mode === "split" && <SyncedSplitScroll containerRef={splitRef} signalKey={`${path}:${reload}`} />}
      <div key="content" ref={splitRef} style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div
          key="editor"
          aria-hidden={!showEditor}
          style={{
            display: showEditor ? "block" : "none",
            flexGrow: editorFull ? 1 : 0,
            flexBasis: editorFull ? "0%" : "auto",
            width: mode === "split" ? `${splitRatio * 100}%` : undefined,
            flexShrink: 0,
            overflow: "hidden",
            ["--cm-max-width" as string]: cmMaxWidth,
          }}
        >
          {mode === "live" ? (
            <LivePreview
              content={previewContentRaw}
              onChange={handleEdit}
              onWikilink={handleWikilink}
              basenameToPath={basenameToPath}
            />
          ) : (
            editorHasOpened && (
              <CodeMirrorEditor
                key={`${path}:${reload}`}
                path={path}
                initialContent={initialContent}
                baseSha={baseSha}
                completionData={completionData}
              />
            )
          )}
        </div>
        {mode === "split" && (
          <div
            key="gutter"
            className="sgnk-gutter"
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize editor and preview"
            onPointerDown={onGutterDown}
            onPointerMove={onGutterMove}
            onPointerUp={onGutterUp}
            onPointerCancel={onGutterUp}
            onDoubleClick={() => {
              setSplitRatio(0.5);
              try {
                localStorage.setItem("sgnk-split", "0.5");
              } catch {
                /* ignore */
              }
            }}
          />
        )}
        <div
          key="preview"
          data-scroll-region
          aria-hidden={!showPreview}
          style={{
            display: showPreview ? "block" : "none",
            flex: 1,
            overflow: "auto",
            padding: "16px",
          }}
        >
          {previewHasOpened ? (
            <>
              <PropertiesPanel content={previewSource} onEdit={handleEdit} />
              <MarkdownPreviewPane
                content={previewSource}
                onWikilink={handleWikilink}
                basenameToPath={basenameToPath}
                onToggleTask={handleToggleTask}
                onEdit={handleEdit}
              />
            </>
          ) : (
            <PreviewPending />
          )}
        </div>
      </div>
      {/* Doc stats + Find/History/View now ride on the formatting toolbar's
          right slot (see Toolbar `extras` above) — no separate bottom bar. */}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Two-note split — independent second editor pane (edit surface)
// ---------------------------------------------------------------------------

function SplitPane({
  path,
  completionData,
  onClose,
}: {
  path: string;
  completionData: CompletionData;
  onClose?: () => void;
}) {
  const { loading, error, initialContent, baseSha } = useNoteContent(path);
  const reload = useEditorStore((s) => s.reloadByPath[path] ?? 0);
  const title = path.split("/").pop()?.replace(/\.md$/, "") ?? path;
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minWidth: 0, flex: 1 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          height: 30,
          padding: "0 10px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-subtle)",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--fg-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {title}
        </span>
        {onClose && (
          <button className="sgnk-icon-btn" style={{ marginLeft: "auto", width: 22, height: 22 }} onClick={onClose} aria-label="Close split pane"><GoogleIcon name="close" size={16} weight={500} /></button>
        )}
      </div>
      <div style={{ flex: 1, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 16, color: "var(--muted)", fontSize: 13 }}>Loading…</div>
        ) : error !== null ? (
          <div style={{ padding: 16, color: "var(--muted)", fontSize: 13 }}>Error: {error}</div>
        ) : initialContent !== null && baseSha !== null ? (
          <CodeMirrorEditor key={`${path}:${reload}`} path={path} initialContent={initialContent} baseSha={baseSha} completionData={completionData} />
        ) : null}
      </div>
    </div>
  );
}

function TwoPaneView({
  primary,
  secondary,
  completionData,
}: {
  primary: string;
  secondary: string;
  completionData: CompletionData;
}) {
  const closeSecondary = useEditorStore((s) => s.closeSecondary);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <SplitPane path={primary} completionData={completionData} />
        <div style={{ width: 1, background: "var(--border)", flexShrink: 0 }} />
        <SplitPane path={secondary} completionData={completionData} onClose={closeSecondary} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EditorPane — tab bar + mode toggle + content area
// ---------------------------------------------------------------------------

export function EditorPane() {
  // Stable array selector — returns the stored array reference (not a derived copy)
  const tabs = useEditorStore((s) => s.tabs);
  // Stable primitive selector
  const activePath = useEditorStore((s) => s.activePath);
  // Stable function selectors
  const setActive = useEditorStore((s) => s.setActive);
  const closeTab = useEditorStore((s) => s.closeTab);
  const reconcileDirtyFlags = useEditorStore((s) => s.reconcileDirtyFlags);
  const secondaryPath = useEditorStore((s) => s.secondaryPath);
  const openSecondary = useEditorStore((s) => s.openSecondary);
  const closeSecondary = useEditorStore((s) => s.closeSecondary);
  const narrow = useIsNarrow();

  // After rehydration from sessionStorage, dirty flags may be stale (they
  // reflect the state at last page-exit, not the actual draft index).
  // Reconcile once on mount so tabs never show false dirty dots.
  useEffect(() => {
    reconcileDirtyFlags();
    // Run once on mount — reconcileDirtyFlags is a stable store action.
  }, [reconcileDirtyFlags]);

  // Build basenameToPath from snapshot — memoized so the Map reference is stable.
  // Collisions (two notes sharing a basename) are resolved deterministically
  // via setBasenameEntry — same rule as the domain link index, so every
  // surface (editor completion, preview wikilinks, graph) agrees on what
  // `[[Foo]]` resolves to.
  const { snapshot } = useSnapshot();
  const basenameToPath = useMemo<Map<string, string>>(() => {
    if (!snapshot) return new Map();
    const map = new Map<string, string>();
    for (const note of snapshot.notes) {
      setBasenameEntry(map, note.path);
    }
    return map;
    // snapshot.notes is the stored array from useSnapshot — stable reference per fetch
  }, [snapshot]);

  // Compute completionData for autocomplete: unique note basenames + unique sorted tags
  const completionData = useMemo<CompletionData>(() => {
    if (!snapshot) return { noteNames: [], tags: [] };
    const nameSet = new Set<string>();
    const tagSet = new Set<string>();
    for (const note of snapshot.notes) {
      const base = note.path.split("/").pop() ?? note.path;
      const basename = base.endsWith(".md") ? base.slice(0, -3) : base;
      nameSet.add(basename);
      for (const tag of note.tags) {
        tagSet.add(tag);
      }
    }
    return {
      noteNames: Array.from(nameSet),
      tags: Array.from(tagSet).sort(),
    };
    // snapshot.notes is the stored array from useSnapshot — stable reference per fetch
  }, [snapshot]);

  if (tabs.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
          height: "100%",
          color: "var(--muted)",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div
          aria-hidden
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "var(--panel-2)",
            border: "1px solid var(--border)",
            fontSize: "24px",
          }}
        >
          ✎
        </div>
        <div>
          <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--fg)", marginBottom: "4px" }}>
            No note open
          </div>
          <div style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>
            Pick a note from the sidebar, or press{" "}
            <kbd
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                padding: "1px 6px",
                borderRadius: "5px",
                background: "var(--panel-2)",
                border: "1px solid var(--border)",
                color: "var(--fg-muted)",
              }}
            >
              ⌘K
            </kbd>{" "}
            to search.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Tab bar + controls */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-subtle)",
        }}
      >
        {/* Controls cluster — mode toggle + split / share / AI / export.
            Lives on the LEFT (before the tab strip), separated by a hair-
            line divider, so the actions sit up front instead of stranded
            far-right. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
            padding: "0 10px",
            borderRight: "1px solid var(--border)",
            alignSelf: "stretch",
          }}
        >
          <ModeToggle />
          {!narrow && (
            <button
              className="sgnk-icon-btn"
              aria-pressed={secondaryPath !== null}
              title={secondaryPath !== null ? "Close split editor" : "Split editor (open active note on the right)"}
              onClick={() => {
                if (secondaryPath !== null) {
                  closeSecondary();
                } else {
                  const other = tabs.find((t) => t.path !== activePath)?.path;
                  if (other) openSecondary(other);
                  else window.dispatchEvent(new CustomEvent("sgnk:toast", { detail: { message: "Open another note to split" } }));
                }
              }}
              style={{ color: secondaryPath !== null ? "var(--accent)" : undefined }}
            >
              <GoogleIcon name="splitscreen_right" size={18} fill={secondaryPath !== null} weight={500} />
            </button>
          )}
          <ShareMenu />
          <AIMenu />
          <ExportMenu />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            overflowX: "auto",
            flex: 1,
            minWidth: 0,
          }}
        >
        {tabs.map((tab) => {
          const isActive = tab.path === activePath;
          // Container is a focusable role="tab" (not a <button>) so the close
          // control can be a real nested <button> — interactive-in-interactive
          // (button-in-button) is invalid HTML and breaks AT semantics.
          return (
            <div
              key={tab.path}
              role="tab"
              tabIndex={0}
              aria-selected={isActive}
              onClick={() => setActive(tab.path)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(tab.path);
                }
              }}
              className="sgnk-tab"
              data-active={isActive || undefined}
            >
              {tab.dirty && (
                <span
                  style={{ color: "var(--accent)", fontSize: "9px", lineHeight: 1 }}
                  aria-label="unsaved"
                >
                  ●
                </span>
              )}
              <span>{tab.title}</span>
              <button
                type="button"
                aria-label={`Close ${tab.title}`}
                className="sgnk-tab__close"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.path);
                }}
              ><GoogleIcon name="close" size={16} weight={500} /></button>
            </div>
          );
        })}
        </div>
      </div>

      {/* Editor area */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {activePath !== null && secondaryPath !== null && secondaryPath !== activePath && !narrow ? (
          <TwoPaneView primary={activePath} secondary={secondaryPath} completionData={completionData} />
        ) : activePath !== null ? (
          <NoteView path={activePath} basenameToPath={basenameToPath} completionData={completionData} />
        ) : null}
      </div>
    </div>
  );
}
