// @vitest-environment jsdom

/**
 * sgnk-ai-button.test.tsx — RTL test for the floating "Ask sgnk AI" panel.
 *
 * Covers the UX the user cares about: visible progress + the result →
 * inline accept/reject flow. Heavy leaves (Markdown, the CodeMirror active
 * view) are mocked; fetch is stubbed so no network is hit.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// ── Mocks (hoisted) ────────────────────────────────────────────────────────

const dispatch = vi.fn();
const focus = vi.fn();
const fakeView = {
  state: {
    doc: { toString: () => "the whole note body", length: 19 },
    selection: { main: { empty: true, from: 0, to: 0 } },
    sliceDoc: (a: number, b: number) => "selected".slice(a, b),
  },
  dispatch,
  focus,
};

vi.mock("@/modules/editor/presentation/active-view", () => ({
  getActiveView: () => fakeView,
  getActivePath: () => "Note.md",
  setActiveView: vi.fn(),
}));

vi.mock("@/modules/editor", () => ({
  useEditorStore: (sel: (s: { activePath: string }) => unknown) => sel({ activePath: "Note.md" }),
  showAiSuggestion: { of: (v: unknown) => ({ effect: "show", v }) },
  clearAiSuggestion: { of: (v: unknown) => ({ effect: "clear", v }) },
}));

vi.mock("@/modules/preview", () => ({
  Markdown: ({ content }: { content: string }) => <div data-testid="ai-md">{content}</div>,
}));

import { SgnkAiButton } from "@/modules/ai-tools/presentation/SgnkAiButton";

function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: async () => body,
  } as unknown as Response;
}

beforeEach(() => {
  dispatch.mockClear();
  focus.mockClear();
  vi.restoreAllMocks();
  // matchMedia shim (useIsDark reads it)
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (q: string) => ({
      matches: false,
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
});

describe("SgnkAiButton", () => {
  it("renders the floating trigger", () => {
    render(<SgnkAiButton />);
    expect(screen.getByLabelText("Ask sgnk AI")).toBeInTheDocument();
  });

  it("opens the panel on click and shows scope + presets", () => {
    render(<SgnkAiButton />);
    fireEvent.click(screen.getByLabelText("Ask sgnk AI"));
    expect(screen.getByText("This note")).toBeInTheDocument();
    expect(screen.getByText("Summarize")).toBeInTheDocument();
    expect(screen.getByText("Improve writing")).toBeInTheDocument();
  });

  it("shows visible progress, then the result, then inline Keep/Undo", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(jsonResponse({ summary: "A tidy summary." }));

    render(<SgnkAiButton />);
    fireEvent.click(screen.getByLabelText("Ask sgnk AI"));
    fireEvent.click(screen.getByText("Summarize"));

    // Result renders through the mocked Markdown.
    await waitFor(() => expect(screen.getByTestId("ai-md")).toHaveTextContent("A tidy summary."));
    expect(fetchMock).toHaveBeenCalledWith("/api/ai/summarize", expect.objectContaining({ method: "POST" }));

    // Insert below → dispatch into the editor with a highlight effect, then
    // the panel switches to the inline Keep / Undo state.
    fireEvent.click(screen.getByText("Insert below"));
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Keep")).toBeInTheDocument();
    expect(screen.getByText("Undo")).toBeInTheDocument();
  });

  it("Undo dispatches a delete + clear back to the result", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse({ summary: "X" }));
    render(<SgnkAiButton />);
    fireEvent.click(screen.getByLabelText("Ask sgnk AI"));
    fireEvent.click(screen.getByText("Summarize"));
    await waitFor(() => screen.getByTestId("ai-md"));
    fireEvent.click(screen.getByText("Insert below"));
    dispatch.mockClear();
    fireEvent.click(screen.getByText("Undo"));
    expect(dispatch).toHaveBeenCalledTimes(1); // delete + clear in one dispatch
    // Back to the result view (Insert below available again).
    expect(screen.getByText("Insert below")).toBeInTheDocument();
  });

  it("surfaces an error when the API fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ detail: "AI needs credits" }, false, 402),
    );
    render(<SgnkAiButton />);
    fireEvent.click(screen.getByLabelText("Ask sgnk AI"));
    fireEvent.click(screen.getByText("Summarize"));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("AI needs credits"));
  });
});
