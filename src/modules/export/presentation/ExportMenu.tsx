"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { useEditorStore } from "@/modules/editor";
import { GoogleIcon } from "@/shared/presentation/GoogleIcon";
import {
  renderNoteHtmlDocument,
  triggerDownload,
} from "@/modules/export/presentation/export-doc";

/** Build the server PDF endpoint URL for a vault path (segments encoded,
 *  slashes preserved). */
function serverPdfUrl(path: string): string {
  const encodedPath = path
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
  return `/api/export/pdf/${encodedPath}`;
}

// ---------------------------------------------------------------------------
// Derive title from a path: strip directory components + .md extension
// ---------------------------------------------------------------------------

function deriveTitleFromPath(path: string): string {
  const base = path.split("/").pop() ?? path;
  return base.endsWith(".md") ? base.slice(0, -3) : base;
}

// ---------------------------------------------------------------------------
// ExportMenu
// ---------------------------------------------------------------------------

export function ExportMenu(): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Stable primitive selectors — no object returned
  const activePath = useEditorStore((s) => s.activePath);
  const content = useEditorStore((s) =>
    s.activePath !== null ? (s.contentByPath[s.activePath] ?? undefined) : undefined,
  );

  const title = useMemo(
    () => (activePath !== null ? deriveTitleFromPath(activePath) : ""),
    [activePath],
  );

  // FIX D: also disabled when content hasn't loaded yet (undefined → empty export)
  const disabled = activePath === null || content === undefined || exporting;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent): void {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent): void {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  function handleDownloadMd(): void {
    setOpen(false);
    triggerDownload(`${title}.md`, content ?? "", "text/markdown");
  }

  function handleExportHtml(): void {
    setOpen(false);
    setExporting(true);
    void renderNoteHtmlDocument(content ?? "", title).then((doc) => {
      triggerDownload(`${title}.html`, doc, "text/html");
    }).finally(() => {
      setExporting(false);
    });
  }

  function handleExportDoc(): void {
    setOpen(false);
    setExporting(true);
    // Word opens HTML-based .doc files natively; reuse the HTML renderer.
    void renderNoteHtmlDocument(content ?? "", title).then((doc) => {
      triggerDownload(`${title}.doc`, doc, "application/msword");
    }).finally(() => {
      setExporting(false);
    });
  }

  function handlePrint(): void {
    if (activePath === null) return;
    setOpen(false);
    // Open the SERVER-rendered PDF in a new tab to review / print. Unlike the
    // browser's window.print(), the server PDF has no injected date/title
    // header or footer and keeps the proper per-page margins. The user can
    // Cmd+P or save from the PDF viewer.
    window.open(serverPdfUrl(activePath), "_blank", "noopener");
  }

  function handleServerPdf(): void {
    if (activePath === null) return;
    setOpen(false);
    window.location.assign(serverPdfUrl(activePath));
  }

  return (
    <div
      ref={menuRef}
      style={{ position: "relative", flexShrink: 0 }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={exporting ? "Exporting…" : "Export note"}
        title={exporting ? "Exporting…" : "Export (HTML, Word, PDF)"}
        className="sgnk-icon-btn"
        // While a download is in flight, tint the icon with the link
        // accent so users see the action took (same idiom as ShareMenu /
        // AIMenu when busy).
        style={exporting ? { color: "var(--link, var(--accent))" } : undefined}
      >
        <GoogleIcon name="file_download" size={18} fill={exporting} weight={500} />
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            right: 0,
            minWidth: "160px",
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          {(
            [
              { label: "Download .md", action: handleDownloadMd },
              { label: "Export HTML", action: handleExportHtml },
              { label: "Export Word (.doc)", action: handleExportDoc },
              { label: "Open PDF (print)", action: handlePrint },
              { label: "Download PDF", action: handleServerPdf },
            ] as const
          ).map(({ label, action }) => (
            <button
              key={label}
              role="menuitem"
              onClick={action}
              style={{
                display: "block",
                width: "100%",
                padding: "8px 14px",
                fontSize: "13px",
                textAlign: "left",
                background: "transparent",
                color: "var(--fg)",
                border: "none",
                cursor: "pointer",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
