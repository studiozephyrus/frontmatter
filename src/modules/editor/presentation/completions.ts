import type {
  CompletionContext,
  CompletionResult,
  CompletionSource,
} from "@codemirror/autocomplete";

// ---------------------------------------------------------------------------
// matchTrigger — pure helper, easy to unit-test without a DOM
// ---------------------------------------------------------------------------

export type TriggerMatch =
  | { type: "wikilink"; query: string; from: number }
  | { type: "tag"; query: string; from: number };

/**
 * Given the text before the cursor, returns the active autocomplete trigger or
 * null when no trigger is detected.
 *
 * Wikilink takes priority: `[[partial` → wikilink
 * Tag: `#partial` preceded by start-of-string or whitespace → tag
 */
export function matchTrigger(textBefore: string): TriggerMatch | null {
  // Wikilink: [[ followed by optional partial (no ] or newline)
  const wikilinkRe = /\[\[([^\]\n]*)$/;
  const wm = wikilinkRe.exec(textBefore);
  if (wm !== null) {
    const query = wm[1] ?? "";
    const from = wm.index + 2; // position right after '[['
    return { type: "wikilink", query, from };
  }

  // Tag: # preceded by start or whitespace, then word chars / - /
  const tagRe = /(^|\s)#([\w/-]*)$/;
  const tm = tagRe.exec(textBefore);
  if (tm !== null) {
    const prefix = tm[1] ?? "";
    const query = tm[2] ?? "";
    // from = index of the character right after '#'
    const hashIndex = tm.index + prefix.length + 1; // skip leading whitespace + '#'
    const from = hashIndex;
    return { type: "tag", query, from };
  }

  return null;
}

// ---------------------------------------------------------------------------
// makeVaultCompletionSource — factory that wraps getData in a CompletionSource
// ---------------------------------------------------------------------------

export function makeVaultCompletionSource(
  getData: () => { noteNames: string[]; tags: string[] },
): CompletionSource {
  return function vaultCompletionSource(
    context: CompletionContext,
  ): CompletionResult | null {
    const textBefore = context.state.sliceDoc(0, context.pos);
    const m = matchTrigger(textBefore);
    if (m === null) return null;

    const { noteNames, tags } = getData();

    if (m.type === "wikilink") {
      const q = m.query.toLowerCase();
      const options = noteNames
        .filter((name) => name.toLowerCase().includes(q))
        .map((name) => ({ label: name, apply: name + "]]" }));
      return {
        from: context.pos - m.query.length,
        options,
        validFor: /^[\w/ -]*$/,
      };
    }

    // tag
    const q = m.query.toLowerCase();
    const options = tags
      .filter((tag) => tag.toLowerCase().includes(q))
      .map((tag) => ({ label: tag, apply: tag }));
    return {
      from: context.pos - m.query.length,
      options,
      validFor: /^[\w/ -]*$/,
    };
  };
}
