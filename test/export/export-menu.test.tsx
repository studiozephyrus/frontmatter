// @vitest-environment jsdom

/**
 * export-menu.test.tsx — RTL test for ExportMenu.
 *
 * Mocks the export-doc helpers so no real DOM download / window.open calls
 * happen. Guards the B4 class of infinite-render loops: if any Zustand
 * selector returns a new object/array on every call, React's update depth
 * limit will throw and this test catches it.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// --------------- mock export-doc helpers (hoisted before imports) ----------

const mockTriggerDownload = vi.fn();
const mockOpenPrintView = vi.fn();
// renderNoteHtmlDocument is now async — return a resolved Promise
const mockRenderNoteHtmlDocument = vi.fn(
  (_md: string, _title: string): Promise<string> => Promise.resolve("<html/>"),
);

vi.mock("@/modules/export/presentation/export-doc", () => ({
  triggerDownload: (...args: unknown[]) => mockTriggerDownload(...args),
  openPrintView: (...args: unknown[]) => mockOpenPrintView(...args),
  renderNoteHtmlDocument: (...args: unknown[]) =>
    mockRenderNoteHtmlDocument(...(args as [string, string])),
}));

// --------------------------------------------------------------------------

import { useEditorStore } from "@/modules/editor/presentation/editor-store";
import { ExportMenu } from "@/modules/export/presentation/ExportMenu";

beforeEach(() => {
  vi.clearAllMocks();
  // Seed the store with a known active note and content
  useEditorStore.setState({
    tabs: [{ path: "Notes/My Note.md", title: "My Note", dirty: false }],
    activePath: "Notes/My Note.md",
    mode: "reading",
    contentByPath: { "Notes/My Note.md": "# Hello\n\nworld" },
  });
});

describe("ExportMenu", () => {
  it("renders without crashing", () => {
    render(<ExportMenu />);
    expect(screen.getByRole("button", { name: /Export/i })).toBeInTheDocument();
  });

  it("does not show dropdown items initially", () => {
    render(<ExportMenu />);
    expect(screen.queryByText("Download .md")).not.toBeInTheDocument();
  });

  it("opens the dropdown when the button is clicked", () => {
    render(<ExportMenu />);
    fireEvent.click(screen.getByRole("button", { name: /Export/i }));
    expect(screen.getByText("Download .md")).toBeInTheDocument();
    expect(screen.getByText("Export HTML")).toBeInTheDocument();
    expect(screen.getByText("Open PDF (print)")).toBeInTheDocument();
  });

  it("calls triggerDownload with .md filename and content on Download .md", () => {
    render(<ExportMenu />);
    fireEvent.click(screen.getByRole("button", { name: /Export/i }));
    fireEvent.click(screen.getByText("Download .md"));
    expect(mockTriggerDownload).toHaveBeenCalledWith(
      "My Note.md",
      "# Hello\n\nworld",
      "text/markdown",
    );
  });

  it("closes the menu after clicking an action", () => {
    render(<ExportMenu />);
    fireEvent.click(screen.getByRole("button", { name: /Export/i }));
    fireEvent.click(screen.getByText("Download .md"));
    expect(screen.queryByText("Download .md")).not.toBeInTheDocument();
  });

  it("calls renderNoteHtmlDocument + triggerDownload on Export HTML", async () => {
    render(<ExportMenu />);
    fireEvent.click(screen.getByRole("button", { name: /Export/i }));
    fireEvent.click(screen.getByText("Export HTML"));
    expect(mockRenderNoteHtmlDocument).toHaveBeenCalledWith(
      "# Hello\n\nworld",
      "My Note",
    );
    await waitFor(() => {
      expect(mockTriggerDownload).toHaveBeenCalledWith(
        "My Note.html",
        "<html/>",
        "text/html",
      );
    });
  });

  it("opens the server PDF in a new tab on Open PDF (print)", () => {
    const openSpy = vi.spyOn(window, "open").mockReturnValue(null);
    render(<ExportMenu />);
    fireEvent.click(screen.getByRole("button", { name: /Export/i }));
    fireEvent.click(screen.getByText("Open PDF (print)"));
    // Server PDF endpoint, path segments encoded (space → %20), in a new tab.
    expect(openSpy).toHaveBeenCalledWith(
      "/api/export/pdf/Notes/My%20Note.md",
      "_blank",
      "noopener",
    );
    // The clean server render is used — NOT the browser print path.
    expect(mockOpenPrintView).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });

  it("navigates to the server PDF endpoint on Download PDF", () => {
    const assignSpy = vi.fn();
    const original = window.location;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...original, assign: assignSpy },
    });
    render(<ExportMenu />);
    fireEvent.click(screen.getByRole("button", { name: /Export/i }));
    fireEvent.click(screen.getByText("Download PDF"));
    expect(assignSpy).toHaveBeenCalledWith("/api/export/pdf/Notes/My%20Note.md");
    Object.defineProperty(window, "location", { configurable: true, value: original });
  });

  it("is disabled (button disabled) when no activePath", () => {
    useEditorStore.setState({ tabs: [], activePath: null, contentByPath: {} });
    render(<ExportMenu />);
    const btn = screen.getByRole("button", { name: /Export/i });
    expect(btn).toBeDisabled();
  });

  it("closes on Escape key", () => {
    render(<ExportMenu />);
    fireEvent.click(screen.getByRole("button", { name: /Export/i }));
    expect(screen.getByText("Download .md")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("Download .md")).not.toBeInTheDocument();
  });
});
