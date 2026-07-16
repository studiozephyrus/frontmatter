"use client";

/**
 * EmbeddedNote.tsx — renders a transcluded `![[target]]` embed.
 *
 * Depth guard: if depth >= 2, render a non-expanded link instead of fetching.
 * Unresolved target: render a dim fallback span.
 * Resolved + shallow: fetch content and render nested <Markdown />.
 */

import React, { useEffect, useState } from "react";
import { resolveWikilink } from "@/modules/preview/presentation/wikilink";
import { useEditorStore } from "@/modules/editor";

// Lazy import to avoid circular dependency (Markdown → EmbeddedNote → Markdown).
// We import lazily at render time through a dynamic approach.
// To avoid a module-level circular import, we use React.lazy via a local wrapper.
// Actually, for SSR-compat we do a direct import and rely on Next.js tree-shaking.
// The circularity is Markdown → EmbeddedNote → Markdown (via JSX), which is fine
// at runtime as long as both modules are fully evaluated. We guard with a local
// re-export-style pattern: import the component type only and render dynamically.

// We break the circular dep by deferring the Markdown import into a state-driven
// lazy load. This is cleaner than React.lazy for our case.

interface EmbeddedNoteProps {
  target: string;
  basenameToPath?: Map<string, string> | undefined;
  depth: number;
}

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; content: string };

// We need to import Markdown lazily to avoid a compile-time circular dep.
// Use dynamic import inside the component (returns a Promise<module>).
async function importMarkdown(): Promise<React.ComponentType<{
  content: string;
  basenameToPath?: Map<string, string>;
  depth?: number;
}>> {
  const mod = await import("@/modules/preview/presentation/Markdown");
  return mod.Markdown;
}

export function EmbeddedNote({
  target,
  basenameToPath,
  depth,
}: EmbeddedNoteProps): React.JSX.Element {
  const path = basenameToPath ? resolveWikilink(target, basenameToPath) : null;

  // Unresolved — dim fallback
  if (path === null) {
    return (
      <span
        data-embed-unresolved
        style={{ color: "var(--muted)", opacity: 0.6, fontStyle: "italic" }}
      >
        ![[{target}]]
      </span>
    );
  }

  // Depth guard — render a shallow link instead of expanding
  if (depth >= 2) {
    return (
      <DepthGuardLink target={target} path={path} />
    );
  }

  return <EmbedLoader target={target} path={path} basenameToPath={basenameToPath} depth={depth} />;
}

// ---------------------------------------------------------------------------
// Depth guard link
// ---------------------------------------------------------------------------

function DepthGuardLink({ target, path }: { target: string; path: string }): React.JSX.Element {
  function handleClick(e: React.MouseEvent): void {
    e.preventDefault();
    useEditorStore.getState().openTab(path);
  }

  const basename = target.split("/").pop()?.split("#")[0]?.split("|")[0] ?? target;

  return (
    <span
      data-embed-depth-guard
      style={{
        color: "var(--accent)",
        cursor: "pointer",
        fontStyle: "italic",
        opacity: 0.8,
      }}
      onClick={handleClick}
    >
      ↪ {basename}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Actual embed loader
// ---------------------------------------------------------------------------

function EmbedLoader({
  target,
  path,
  basenameToPath,
  depth,
}: {
  target: string;
  path: string;
  basenameToPath?: Map<string, string> | undefined;
  depth: number;
}): React.JSX.Element {
  const [fetchState, setFetchState] = useState<FetchState>({ status: "idle" });
  const [MarkdownComponent, setMarkdownComponent] = useState<React.ComponentType<{
    content: string;
    basenameToPath?: Map<string, string>;
    depth?: number;
  }> | null>(null);

  // Load the Markdown component (deferred to avoid compile-time circular dep)
  useEffect(() => {
    let cancelled = false;
    importMarkdown().then((Component) => {
      if (!cancelled) {
        setMarkdownComponent(() => Component);
      }
    }).catch(() => {
      // If import fails, we simply won't render
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch note content
  useEffect(() => {
    setFetchState({ status: "loading" });
    const controller = new AbortController();

    fetch(`/api/vault/file?path=${encodeURIComponent(path)}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          setFetchState({ status: "error" });
          return;
        }
        const data = (await res.json()) as { content: string };
        setFetchState({ status: "success", content: data.content });
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        setFetchState({ status: "error" });
      });

    return () => {
      controller.abort();
    };
  }, [path]);

  const basename = target.split("/").pop()?.split("#")[0]?.split("|")[0] ?? target;

  function handleHeaderClick(e: React.MouseEvent): void {
    e.preventDefault();
    useEditorStore.getState().openTab(path);
  }

  if (fetchState.status === "idle" || fetchState.status === "loading") {
    return (
      <div data-embed-container data-embed-loading style={containerStyle}>
        <span style={{ color: "var(--muted)", opacity: 0.6, fontSize: "0.85em" }}>
          Loading embed…
        </span>
      </div>
    );
  }

  if (fetchState.status === "error") {
    return (
      <div data-embed-container data-embed-error style={containerStyle}>
        <span style={{ color: "var(--muted)", opacity: 0.6, fontSize: "0.85em", fontStyle: "italic" }}>
          Could not embed {target}
        </span>
      </div>
    );
  }

  return (
    <div data-embed-container style={containerStyle}>
      <div
        data-embed-header
        style={headerStyle}
        onClick={handleHeaderClick}
      >
        {basename}
      </div>
      <div data-embed-body>
        {MarkdownComponent !== null ? (
          <MarkdownComponent
            content={fetchState.content}
            depth={depth + 1}
            {...(basenameToPath !== undefined ? { basenameToPath } : {})}
          />
        ) : null}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Styles (inline, themed via CSS vars)
// ---------------------------------------------------------------------------

const containerStyle: React.CSSProperties = {
  borderLeft: "3px solid var(--accent)",
  padding: "0.5rem 0.75rem",
  marginBlock: "0.5rem",
  background: "var(--embed-bg, rgba(0,0,0,0.04))",
  borderRadius: "0 4px 4px 0",
};

const headerStyle: React.CSSProperties = {
  fontSize: "0.8em",
  fontWeight: 600,
  color: "var(--accent)",
  cursor: "pointer",
  marginBottom: "0.4rem",
  textDecoration: "none",
  userSelect: "none",
};
