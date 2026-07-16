"use client";

/**
 * VaultWorkspace — responsive 3-pane workspace wrapped in one <SnapshotProvider>.
 *
 * Desktop (lg+): CSS grid — sidebar | editor | (right pane | scroll indicator).
 *   Desktop panes are CSS-gated (`hidden lg:…`) so there's no hydration flicker.
 * Mobile/tablet (<lg): editor is full-width; the file tree and right pane are
 *   slide-in drawers (state-gated, default closed) toggled from the header
 *   (sgnk:toggle-sidebar / sgnk:toggle-right-pane), with a tap-to-dismiss
 *   backdrop. Opening a note closes the file drawer.
 *
 * The desktop right-pane open state persists to localStorage; the mobile drawers
 * always start closed. The toggle decides which to act on by checking the
 * viewport at click time (no isDesktop state needed).
 */

import { useEffect, useState } from "react";
import { SnapshotProvider, useSnapshot } from "@/modules/vault";
import { FileTree, FileTreeActions } from "@/modules/vault";
import { EditorPane } from "@/modules/editor";
import { RightPane } from "@/modules/preview";
import { KnowledgeUI } from "./KnowledgeUI";
import { ScrollIndicator } from "./ScrollIndicator";
import { DuplicateConflictModal, useShareConflicts } from "@/modules/share";
import { SgnkAiButton } from "@/modules/ai-tools";

const DESKTOP = "(min-width: 1024px)";

/**
 * Right-pane mode mirrors what <RightPaneCycle /> manages:
 *   "hidden"  — column 3 not rendered (grid collapses to 2 columns)
 *   "sidebar" — backlinks + outline pane rendered
 *   "scroll"  — slim lane rendered with <ScrollIndicator />
 *
 * Read from `sgnk-right-pane-mode` on mount and updated by listening
 * to `sgnk:right-pane-mode` events the cycle dispatches.
 */
type RightPaneMode = "hidden" | "sidebar" | "scroll";

function readRightPaneMode(): RightPaneMode {
  try {
    const raw = localStorage.getItem("sgnk-right-pane-mode");
    if (raw === "sidebar" || raw === "scroll" || raw === "hidden") return raw;
  } catch {
    /* fall through */
  }
  return "hidden";
}

export function VaultWorkspace() {
  const [leftOpen, setLeftOpen] = useState(true); // desktop sidebar column
  const [rightMode, setRightMode] = useState<RightPaneMode>("hidden"); // desktop right column tri-state
  const [rightDrawer, setRightDrawer] = useState(false); // mobile drawer
  const [navDrawer, setNavDrawer] = useState(false); // mobile file drawer

  useEffect(() => {
    try {
      const initialMode = readRightPaneMode();
      setRightMode(initialMode);
      setLeftOpen(localStorage.getItem("sgnk-left-pane") !== "closed");
      // Mirror to a body dataset attr so RightPaneCycle can read the
      // current mode without re-implementing this branching.
      document.body.dataset["rightPaneMode"] = initialMode;
    } catch {
      /* ignore */
    }
    function applyMode(next: RightPaneMode) {
      try {
        localStorage.setItem("sgnk-right-pane-mode", next);
        document.body.dataset["rightPaneMode"] = next;
      } catch {
        /* ignore */
      }
      setRightMode(next);
    }
    // New tri-state event dispatched by RightPaneCycle.
    function onSetMode(e: Event) {
      const detail = (e as CustomEvent<{ mode?: RightPaneMode }>).detail;
      const next = detail?.mode;
      if (next === "hidden" || next === "sidebar" || next === "scroll") {
        if (window.matchMedia(DESKTOP).matches) applyMode(next);
        else setRightDrawer(next === "sidebar");
      }
    }
    // Back-compat: legacy `sgnk:toggle-right-pane` still flips between
    // "sidebar" and "hidden" (matches the old RightPaneToggle's
    // open/closed semantics).
    function onToggleRight() {
      if (window.matchMedia(DESKTOP).matches) {
        setRightMode((prev) => {
          const next: RightPaneMode = prev === "sidebar" ? "hidden" : "sidebar";
          try {
            localStorage.setItem("sgnk-right-pane-mode", next);
            document.body.dataset["rightPaneMode"] = next;
          } catch {
            /* ignore */
          }
          return next;
        });
      } else {
        setRightDrawer((v) => !v);
      }
    }
    function onToggleNav() {
      if (window.matchMedia(DESKTOP).matches) {
        setLeftOpen((prev) => {
          const next = !prev;
          try {
            localStorage.setItem("sgnk-left-pane", next ? "open" : "closed");
          } catch {
            /* ignore */
          }
          return next;
        });
      } else {
        setNavDrawer((v) => !v);
      }
    }
    window.addEventListener("sgnk:right-pane-mode", onSetMode);
    window.addEventListener("sgnk:toggle-right-pane", onToggleRight);
    window.addEventListener("sgnk:toggle-sidebar", onToggleNav);
    return () => {
      window.removeEventListener("sgnk:right-pane-mode", onSetMode);
      window.removeEventListener("sgnk:toggle-right-pane", onToggleRight);
      window.removeEventListener("sgnk:toggle-sidebar", onToggleNav);
    };
  }, []);

  const rightOpen = rightMode === "sidebar";
  const showScrollLane = rightMode === "scroll";

  const drawerBorder = { borderColor: "var(--border)", background: "var(--bg-subtle)" } as const;

  return (
    <SnapshotProvider>
      <div
        className="relative h-[calc(100dvh-52px)] lg:grid"
        style={{
          gridTemplateColumns: `${leftOpen ? "264px " : ""}1fr${rightOpen ? " 304px" : showScrollLane ? " 46px" : ""}`,
        }}
      >
        {/* Mobile backdrop */}
        {(navDrawer || rightDrawer) && (
          <div
            className="fixed inset-0 top-[52px] z-30 bg-black/40 lg:hidden"
            onClick={() => {
              setNavDrawer(false);
              setRightDrawer(false);
            }}
            aria-hidden
          />
        )}

        {/* Desktop sidebar (grid col 1) — collapsible via hamburger.
            `min-h-0` + `overflow-hidden` let the FileTree's internal
            overflow-y-auto engage so the sidebar scrolls independently of
            the editor pane. */}
        {leftOpen && (
          <aside
            className="hidden min-h-0 flex-col overflow-hidden border-r p-2 lg:flex"
            style={drawerBorder}
          >
            <FileTree />
          </aside>
        )}

        {/* Mobile sidebar drawer */}
        <aside
          className={`fixed inset-y-0 left-0 top-[52px] z-40 flex w-[280px] flex-col overflow-hidden border-r p-2 transition-transform duration-200 lg:hidden ${
            navDrawer ? "translate-x-0" : "-translate-x-full"
          }`}
          style={drawerBorder}
        >
          <FileTree onOpen={() => setNavDrawer(false)} />
        </aside>

        {/* Center editor */}
        <main style={{ overflow: "hidden", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
          <EditorPane />
        </main>

        {/* Desktop right column — three states:
              "sidebar" → backlinks + outline aside
              "scroll"  → slim 46px lane with the scroll indicator
              "hidden"  → not rendered at all (grid drops to 2 cols) */}
        {rightOpen ? (
          <aside className="hidden border-l lg:block" style={{ ...drawerBorder, overflow: "hidden" }}>
            <RightPane />
          </aside>
        ) : showScrollLane ? (
          <div className="hidden border-l lg:block" style={{ borderColor: "var(--border)" }}>
            <ScrollIndicator />
          </div>
        ) : null}

        {/* Mobile right drawer */}
        <aside
          className={`fixed inset-y-0 right-0 top-[52px] z-40 w-[300px] border-l transition-transform duration-200 lg:hidden ${
            rightDrawer ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ ...drawerBorder, overflow: "hidden" }}
        >
          <RightPane />
        </aside>

        {/* Spotlight (Cmd+K) + CommandPalette (Cmd+P) */}
        <KnowledgeUI />

        {/* File-tree dialog state machine — mounted ONCE at the workspace
            level so the two FileTree instances (desktop sidebar + mobile
            drawer) share one window.__fileTreeActions bridge instead of
            racing each other. */}
        <FileTreeActions />

        {/* Duplicate public_slug detection (Obsidian/git sync bypass) */}
        <ShareConflictGate />

        {/* Vault load-failure banner (so a 502 isn't mistaken for empty vault) */}
        <SnapshotErrorBanner />

        {/* Floating "Ask sgnk AI" button — bottom-right of the viewport,
            Notion-AI-style popover. Lives at the workspace root so it
            persists across mode toggles + survives the right-pane cycle. */}
        <SgnkAiButton />
      </div>
    </SnapshotProvider>
  );
}

function SnapshotErrorBanner() {
  const s = useSnapshot();
  // "unauthorized" is handled by the auth redirect; only surface real load errors.
  if (!s.error || s.error === "unauthorized") return null;
  return (
    <div
      role="alert"
      className="fixed left-1/2 top-[60px] z-50 -translate-x-1/2"
      style={{
        background: "var(--danger)",
        color: "#fff",
        padding: "8px 14px",
        borderRadius: 8,
        fontSize: 13,
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <span>Couldn’t load your vault.</span>
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("sgnk:vault-changed"))}
        style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 5, padding: "2px 8px", cursor: "pointer", fontSize: 12 }}
      >
        Retry
      </button>
    </div>
  );
}

function ShareConflictGate() {
  const { conflicts, refresh } = useShareConflicts();
  return <DuplicateConflictModal conflicts={conflicts} onResolved={() => { void refresh(); }} />;
}
