// @vitest-environment jsdom
/**
 * duplicate-conflict-modal.test.tsx — UI tests.
 *
 * Covers:
 *  - renders nothing when conflicts is empty
 *  - lists every claiming note per slug
 *  - Rename inline editor calls POST /api/share with new slug
 *  - 409 from rename surfaces inline
 *  - Unpublish calls DELETE
 *  - Dismiss closes the modal but leaves remaining conflicts intact in state
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { DuplicateConflictModal } from "@/modules/share/presentation/DuplicateConflictModal";

const fetchMock = vi.fn();
beforeEach(() => { fetchMock.mockReset(); vi.stubGlobal("fetch", fetchMock); });
afterEach(() => { vi.unstubAllGlobals(); });

const conflicts = [{
  slug: "shared",
  notes: [
    { path: "A.md", title: "Alpha" },
    { path: "B.md", title: "Beta" },
  ],
}];

function ok(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

describe("DuplicateConflictModal", () => {
  it("renders nothing on empty conflicts", () => {
    const { container } = render(<DuplicateConflictModal conflicts={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("lists every conflicting slug + every claiming note", () => {
    render(<DuplicateConflictModal conflicts={conflicts} />);
    expect(screen.getByText("/shared")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("Rename opens inline editor and POSTs /api/share with new slug", async () => {
    fetchMock
      .mockResolvedValueOnce(ok({ slug: "alpha-2", publicUrl: "https://md.sgnk.ai/alpha-2", sha: "s" }))
      .mockResolvedValueOnce(ok({ conflicts: [] }));
    render(<DuplicateConflictModal conflicts={conflicts} />);
    const renameButtons = screen.getAllByRole("button", { name: /^rename$/i });
    fireEvent.click(renameButtons[0]!);
    // Slug suggestion uses the file basename ("A" → "a-2"), not the title.
    const slugInput = screen.getByDisplayValue(/a-2/i);
    expect(slugInput).toBeInTheDocument();
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: /apply/i })); });
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const call = fetchMock.mock.calls[0]!;
    expect(call[0]).toBe("/api/share");
    expect(call[1]?.method).toBe("POST");
    const body = JSON.parse(call[1]?.body as string);
    expect(body.path).toBe("A.md");
    expect(body.slug).toMatch(/^a-2$/);
  });

  it("surfaces 409 from the rename POST inline", async () => {
    fetchMock.mockResolvedValueOnce(ok({ error: "slug_conflict", conflictPath: "C.md" }, 409));
    render(<DuplicateConflictModal conflicts={conflicts} />);
    fireEvent.click(screen.getAllByRole("button", { name: /^rename$/i })[0]!);
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: /apply/i })); });
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/Taken by C\.md/);
    });
  });

  it("Unpublish DELETEs /api/share", async () => {
    fetchMock
      .mockResolvedValueOnce(ok({ ok: true }))
      .mockResolvedValueOnce(ok({ conflicts: [] }));
    render(<DuplicateConflictModal conflicts={conflicts} />);
    const unpubs = screen.getAllByRole("button", { name: /unpublish/i });
    await act(async () => { fireEvent.click(unpubs[0]!); });
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const call = fetchMock.mock.calls[0]!;
    expect(call[1]?.method).toBe("DELETE");
    expect(JSON.parse(call[1]?.body as string)).toEqual({ path: "A.md" });
  });

  it("Dismiss hides the modal", () => {
    render(<DuplicateConflictModal conflicts={conflicts} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /dismiss/i }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
