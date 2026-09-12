/**
 * §6.5 — get-snapshot.ts used a non-fatal `new TextDecoder()`, so a file with
 * invalid UTF-8 bytes silently decoded to mojibake (U+FFFD) and entered the
 * snapshot. If that note is later saved from the editor, the corrupted text
 * is what gets written back to git — a one-way, silent loss of the original
 * bytes. Strict decode must REFUSE that file rather than guess at it.
 */
import { describe, it, expect } from "vitest";
import { zipSync } from "fflate";
import { makeGetSnapshot } from "@/modules/vault/application/get-snapshot";
import type { VaultReader } from "@/modules/vault/application/ports";
import type { VaultSnapshot } from "@/modules/vault/application/dto";
import { parseMarkdown } from "@/modules/vault/infrastructure/markdown-parser";

/** "Caf" + an invalid UTF-8 lead byte (0xE9 not followed by a continuation
 *  byte) + " notes" — the exact shape from the handoff's own probe
 *  (`…436166e9206e…` → `"Caf<FFFD> notes"`). */
function invalidUtf8Bytes(): Uint8Array {
  const enc = new TextEncoder();
  const prefix = enc.encode("Caf");
  const suffix = enc.encode(" notes\n");
  return new Uint8Array([...prefix, 0xe9, ...suffix]);
}

function buildTestZip(): ArrayBuffer {
  const enc = new TextEncoder();
  const files: Record<string, Uint8Array> = {
    "repo-abc123/Home.md": enc.encode("# Home\n\nValid note.\n"),
    "repo-abc123/Broken.md": invalidUtf8Bytes(),
  };
  return zipSync(files).buffer as ArrayBuffer;
}

function makeMockReader(): VaultReader {
  const zip = buildTestZip();
  return {
    getHeadSha: async () => "abc123",
    getZipball: async () => zip,
    getFile: async () => ({ content: "", sha: "" }),
    listHistory: async () => [],
    getFileAtSha: async () => null,
  };
}

function makeFreshCache() {
  const store = new Map<string, VaultSnapshot>();
  return {
    get: (sha: string) => store.get(sha) ?? null,
    set: (sha: string, snap: VaultSnapshot) => { store.set(sha, snap); },
  };
}

describe("GetSnapshot refuses invalid UTF-8 instead of decoding it lossily", () => {
  it("excludes the invalid-UTF-8 file from the snapshot rather than mojibake-ing it in", async () => {
    const getSnapshot = makeGetSnapshot({
      reader: makeMockReader(),
      cache: makeFreshCache(),
      parseNote: parseMarkdown,
    });
    const snap = await getSnapshot();
    const paths = snap.notes.map((n) => n.path);

    expect(paths).toContain("Home.md");
    expect(paths).not.toContain("Broken.md");
    expect(snap.notes).toHaveLength(1);
  });
});
