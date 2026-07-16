import { describe, it, expect } from "vitest";
import { detectEmbed } from "@/modules/preview/presentation/markdown/embeds";

describe("detectEmbed", () => {
  it("detects YouTube across watch/youtu.be/embed/shorts", () => {
    for (const u of [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://youtu.be/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/shorts/dQw4w9WgXcQ",
    ]) {
      expect(detectEmbed(u)).toEqual({ kind: "youtube", id: "dQw4w9WgXcQ" });
    }
  });

  it("detects Vimeo", () => {
    expect(detectEmbed("https://vimeo.com/123456789")).toEqual({ kind: "vimeo", id: "123456789" });
  });

  it("flags remote PDFs as remote (sandboxed) and local PDFs as not-remote", () => {
    expect(detectEmbed("https://example.com/a.pdf")).toEqual({ kind: "pdf", url: "https://example.com/a.pdf", remote: true });
    const local = detectEmbed("attachments/a.pdf");
    expect(local?.kind).toBe("pdf");
    expect((local as { remote: boolean }).remote).toBe(false);
  });

  it("rewrites local media URLs to the raw endpoint (was 404)", () => {
    const v = detectEmbed("attachments/clip.mp4");
    expect(v?.kind).toBe("video");
    // rewriteVaultImageSrc routes vault-relative paths to /api/vault/raw/…
    expect((v as { url: string }).url).toContain("/api/vault/raw/");
  });

  it("returns null for plain images / non-media", () => {
    expect(detectEmbed("https://example.com/pic.png")).toBeNull();
    expect(detectEmbed("notes/page")).toBeNull();
  });
});
