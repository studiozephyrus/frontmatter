// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { EditorState } from "@codemirror/state";
import { CompletionContext, type CompletionResult } from "@codemirror/autocomplete";
import {
  matchTrigger,
  makeVaultCompletionSource,
} from "@/modules/editor/presentation/completions";

// ---------------------------------------------------------------------------
// matchTrigger
// ---------------------------------------------------------------------------

describe("matchTrigger", () => {
  it("detects a wikilink partial", () => {
    const m = matchTrigger("see [[HQ");
    expect(m).not.toBeNull();
    expect(m!.type).toBe("wikilink");
    expect(m!.query).toBe("HQ");
    // 'from' should point to the char right after '[['
    // 'see [[' = indices 0-5, so after '[[' is index 6
    expect(m!.from).toBe(6);
  });

  it("detects a tag after whitespace", () => {
    const m = matchTrigger("a #pro");
    expect(m).not.toBeNull();
    expect(m!.type).toBe("tag");
    expect(m!.query).toBe("pro");
  });

  it("detects a tag at start of string", () => {
    const m = matchTrigger("#mid");
    expect(m).not.toBeNull();
    expect(m!.type).toBe("tag");
    expect(m!.query).toBe("mid");
  });

  it("returns null when # is not preceded by whitespace or start", () => {
    const m = matchTrigger("word#notag");
    expect(m).toBeNull();
  });

  it("returns null for plain text", () => {
    const m = matchTrigger("plain text");
    expect(m).toBeNull();
  });

  it("returns null when wikilink is closed — [[Note] ", () => {
    // '[[Note] ' — the ] closes the match candidate, so no active trigger
    const m = matchTrigger("[[Note] ");
    expect(m).toBeNull();
  });

  it("returns null for empty string", () => {
    const m = matchTrigger("");
    expect(m).toBeNull();
  });

  it("detects wikilink with empty query [[", () => {
    const m = matchTrigger("some text [[");
    expect(m).not.toBeNull();
    expect(m!.type).toBe("wikilink");
    expect(m!.query).toBe("");
  });
});

// ---------------------------------------------------------------------------
// makeVaultCompletionSource
// ---------------------------------------------------------------------------

function makeContext(doc: string): CompletionContext {
  const state = EditorState.create({ doc });
  // explicit: true so the source fires even when not after a word character
  return new CompletionContext(state, doc.length, true);
}

/** Our source is always synchronous — cast away the Promise union. */
function callSource(
  source: ReturnType<typeof makeVaultCompletionSource>,
  ctx: CompletionContext,
): CompletionResult | null {
  return source(ctx) as CompletionResult | null;
}

describe("makeVaultCompletionSource", () => {
  it("returns matching note options for a wikilink trigger", () => {
    const source = makeVaultCompletionSource(() => ({
      noteNames: ["HQ PRD", "Home"],
      tags: [],
    }));

    const ctx = makeContext("x [[hq");
    const result = callSource(source, ctx);

    expect(result).not.toBeNull();
    const labels = result!.options.map((o) => o.label);
    expect(labels).toContain("HQ PRD");
    expect(labels).not.toContain("Home");
  });

  it("apply value appends ]] for wikilink completions", () => {
    const source = makeVaultCompletionSource(() => ({
      noteNames: ["Daily Note"],
      tags: [],
    }));
    const ctx = makeContext("[[Daily");
    const result = callSource(source, ctx);
    expect(result).not.toBeNull();
    const opt = result!.options.find((o) => o.label === "Daily Note");
    expect(opt).toBeDefined();
    expect(opt!.apply).toBe("Daily Note]]");
  });

  it("returns null when no trigger", () => {
    const source = makeVaultCompletionSource(() => ({
      noteNames: ["Home"],
      tags: ["work"],
    }));
    const ctx = makeContext("no trigger here");
    const result = callSource(source, ctx);
    expect(result).toBeNull();
  });

  it("returns matching tag options for a tag trigger", () => {
    const source = makeVaultCompletionSource(() => ({
      noteNames: [],
      tags: ["project/alpha", "work", "personal"],
    }));
    const ctx = makeContext("notes #pro");
    const result = callSource(source, ctx);
    expect(result).not.toBeNull();
    const labels = result!.options.map((o) => o.label);
    expect(labels).toContain("project/alpha");
    expect(labels).not.toContain("work");
    expect(labels).not.toContain("personal");
  });

  it("from is computed from query length", () => {
    const source = makeVaultCompletionSource(() => ({
      noteNames: ["HQ PRD", "Home"],
      tags: [],
    }));
    // doc = 'x [[hq' (length 6), query = 'hq' (length 2), from = 6 - 2 = 4
    const ctx = makeContext("x [[hq");
    const result = callSource(source, ctx);
    expect(result!.from).toBe(4);
  });
});
