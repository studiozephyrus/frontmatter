// @vitest-environment jsdom
/**
 * share-modal.test.tsx — UI tests for ShareModal.
 *
 * Coverage:
 *  - renders nothing when closed
 *  - default slug suggested from the note title
 *  - submit POSTs /api/share with slug + path
 *  - 409 conflict surfaces inline; suggests <slug>-2 fallback
 *  - 422 invalid_slug surfaces the detail
 *  - success shows public URL + Copy + Open
 *  - Unpublish only renders when currentSlug is set
 *  - Close calls onClose
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ShareModal } from "@/modules/share/presentation/ShareModal";

const fetchMock = vi.fn();
beforeEach(() => { fetchMock.mockReset(); vi.stubGlobal("fetch", fetchMock); });
afterEach(() => { vi.unstubAllGlobals(); });

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

const baseProps = {
  notePath: "Projects/Apollo.md",
  noteTitle: "Apollo Mission",
  onClose: vi.fn(),
};

describe("ShareModal — render", () => {
  it("renders nothing when closed", () => {
    const { container } = render(<ShareModal open={false} {...baseProps} />);
    expect(container.firstChild).toBeNull();
  });

  it("seeds the slug input from suggestSlug(title) when no current slug", () => {
    render(<ShareModal open {...baseProps} />);
    const input = screen.getByPlaceholderText("my-public-note") as HTMLInputElement;
    expect(input.value).toBe("apollo-mission");
  });

  it("seeds the slug input from currentSlug when shared already", () => {
    render(<ShareModal open {...baseProps} currentSlug="apollo-1" />);
    const input = screen.getByPlaceholderText("my-public-note") as HTMLInputElement;
    expect(input.value).toBe("apollo-1");
  });

  it("only shows Unpublish when a currentSlug exists", () => {
    const { rerender } = render(<ShareModal open {...baseProps} />);
    expect(screen.queryByRole("button", { name: /unpublish/i })).toBeNull();
    rerender(<ShareModal open {...baseProps} currentSlug="x" />);
    expect(screen.getByRole("button", { name: /unpublish/i })).toBeInTheDocument();
  });
});

describe("ShareModal — submit", () => {
  it("POSTs /api/share with the slug + path on Share", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { slug: "apollo", publicUrl: "https://md.sgnk.ai/apollo", sha: "s" }));
    const onShared = vi.fn();
    render(<ShareModal open {...baseProps} onShared={onShared} />);
    const input = screen.getByPlaceholderText("my-public-note") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "apollo" } });
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: /^share$/i })); });
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const call = fetchMock.mock.calls[0]!;
    expect(call[0]).toBe("/api/share");
    expect(call[1]?.method).toBe("POST");
    expect(JSON.parse(call[1]?.body as string)).toEqual({ path: "Projects/Apollo.md", slug: "apollo" });
    await waitFor(() => expect(onShared).toHaveBeenCalledWith(expect.objectContaining({ slug: "apollo", publicUrl: "https://md.sgnk.ai/apollo" })));
  });

  it("surfaces 409 slug_conflict with the conflicting path", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(409, { error: "slug_conflict", slug: "apollo", conflictPath: "B.md", detail: "Slug 'apollo' taken" }));
    render(<ShareModal open {...baseProps} />);
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: /^share$/i })); });
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/already used by B\.md/i);
    });
    // Offers a `<slug>-2` retry button.
    expect(screen.getByRole("button", { name: /apollo-2/i })).toBeInTheDocument();
  });

  it("surfaces 422 invalid_slug error detail", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(422, { error: "invalid_slug", detail: "slug: lowercase letters/digits/hyphens" }));
    render(<ShareModal open {...baseProps} />);
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: /^share$/i })); });
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/lowercase letters/i);
    });
  });

  it("displays the public URL on success", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { slug: "apollo", publicUrl: "https://md.sgnk.ai/apollo", sha: "s" }));
    render(<ShareModal open {...baseProps} />);
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: /^share$/i })); });
    await waitFor(() => {
      expect(screen.getByText("https://md.sgnk.ai/apollo")).toBeInTheDocument();
    });
  });
});

describe("ShareModal — close", () => {
  it("calls onClose on Close button", () => {
    const onClose = vi.fn();
    render(<ShareModal open {...baseProps} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });
  it("clicking the overlay calls onClose", () => {
    const onClose = vi.fn();
    render(<ShareModal open {...baseProps} onClose={onClose} />);
    // The overlay carries role="dialog"; clicking it (outside the modal-body
    // which stops propagation) fires onClose.
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalled();
  });
});

describe("ShareModal — unpublish", () => {
  it("DELETEs /api/share and calls onUnshared on success", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { path: "Projects/Apollo.md", sha: "s" }));
    const onUnshared = vi.fn();
    render(<ShareModal open {...baseProps} currentSlug="apollo" onUnshared={onUnshared} />);
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: /unpublish/i })); });
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const call = fetchMock.mock.calls[0]!;
    expect(call[1]?.method).toBe("DELETE");
    expect(JSON.parse(call[1]?.body as string)).toEqual({ path: "Projects/Apollo.md" });
    expect(onUnshared).toHaveBeenCalled();
  });
});
