/**
 * Unit tests for the inferContentType helper in the raw serving route.
 */
import { describe, it, expect } from "vitest";
import { inferContentType } from "@/app/api/vault/raw/content-type";

describe("inferContentType", () => {
  it.each([
    ["_attachments/photo.png", "image/png"],
    ["_attachments/photo.jpg", "image/jpeg"],
    ["_attachments/photo.jpeg", "image/jpeg"],
    ["_attachments/anim.gif", "image/gif"],
    ["_attachments/img.webp", "image/webp"],
    ["_attachments/icon.svg", "image/svg+xml"],
    ["_attachments/doc.pdf", "application/pdf"],
    ["_attachments/unknown.bin", "application/octet-stream"],
    ["_attachments/noext", "application/octet-stream"],
    ["_attachments/PHOTO.PNG", "image/png"],  // case-insensitive
  ])("returns correct MIME for %s", (path, expected) => {
    expect(inferContentType(path)).toBe(expected);
  });
});
