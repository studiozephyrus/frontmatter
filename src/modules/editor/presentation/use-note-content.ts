"use client";

import { useEffect, useState } from "react";
import { getDraft } from "@/modules/drafts";

export type NoteContentState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: string; path: string }
  | { status: "ready"; initialContent: string; baseSha: string; path: string };

/** Convenience accessors that match the task's described shape. */
export type NoteContentResult = {
  loading: boolean;
  error: string | null;
  initialContent: string | null;
  baseSha: string | null;
};

/**
 * Translate a state into the public result shape, BUT only when the state's
 * recorded path matches the path the caller is asking about. Without this
 * gate, a fast tab switch A→B would briefly return A's content while React
 * has B as the current `path` prop — that stale closure caused other consumers
 * (preview, outline, backlinks, the seed-content effect) to bind to the wrong
 * note. When the path doesn't match yet, we report `loading` instead.
 */
function toResult(s: NoteContentState, currentPath: string | null): NoteContentResult {
  switch (s.status) {
    case "idle":
      return { loading: false, error: null, initialContent: null, baseSha: null };
    case "loading":
      return { loading: true, error: null, initialContent: null, baseSha: null };
    case "error":
      if (s.path !== currentPath) {
        return { loading: true, error: null, initialContent: null, baseSha: null };
      }
      return { loading: false, error: s.error, initialContent: null, baseSha: null };
    case "ready":
      if (s.path !== currentPath) {
        return { loading: true, error: null, initialContent: null, baseSha: null };
      }
      return { loading: false, error: null, initialContent: s.initialContent, baseSha: s.baseSha };
  }
}

export function useNoteContent(path: string | null): NoteContentResult {
  const [state, setState] = useState<NoteContentState>({ status: "idle" });

  useEffect(() => {
    if (path === null) {
      setState({ status: "idle" });
      return;
    }

    setState({ status: "loading" });

    let cancelled = false;
    const controller = new AbortController();

    void (async () => {
      // 1. Draft wins — preserves unsaved edits
      const draft = await getDraft(path);
      if (cancelled) return;

      if (draft !== undefined) {
        setState({
          status: "ready",
          initialContent: draft.content,
          baseSha: draft.baseSha,
          path,
        });
        return;
      }

      // 2. Fetch from vault API
      let res: Response;
      try {
        res = await fetch(
          `/api/vault/file?path=${encodeURIComponent(path)}`,
          { signal: controller.signal },
        );
      } catch (err) {
        if (cancelled) return;
        setState({
          status: "error",
          error: err instanceof Error ? err.message : "network error",
          path,
        });
        return;
      }

      if (cancelled) return;

      if (res.status === 401) {
        setState({ status: "error", error: "unauthorized", path });
        return;
      }
      if (res.status === 404) {
        setState({ status: "error", error: "not found", path });
        return;
      }
      if (!res.ok) {
        setState({ status: "error", error: `HTTP ${res.status}`, path });
        return;
      }

      let json: unknown;
      try {
        json = await res.json();
      } catch {
        if (cancelled) return;
        setState({ status: "error", error: "invalid response", path });
        return;
      }

      if (cancelled) return;

      if (
        typeof json === "object" &&
        json !== null &&
        "content" in json &&
        "sha" in json &&
        typeof (json as Record<string, unknown>)["content"] === "string" &&
        typeof (json as Record<string, unknown>)["sha"] === "string"
      ) {
        const typed = json as { content: string; sha: string };
        setState({
          status: "ready",
          initialContent: typed.content,
          baseSha: typed.sha,
          path,
        });
      } else {
        setState({ status: "error", error: "unexpected response shape", path });
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [path]);

  return toResult(state, path);
}
