/**
 * GATE: the four verdicts, each anchored to a real engine's real output. (PLAN §3.3.5)
 *
 * Where a case can be measured in-process it IS measured: `marked` 16.4.2, `commonmark` 0.31.2
 * (the designated spec oracle) and `markdown-it` 15.0.0 are driven here rather than transcribed.
 * Where an output cannot be produced in-process it is labelled DECLARED and carries the command or
 * the PLAN citation that produced it, so a reader can tell a measurement from a transcription.
 *
 * DECLARED fixtures used below, with provenance:
 *   kramdown 2.5.2 + kramdown-parser-gfm 1.1.0 at Jekyll's `hard_wrap: false` — reproduced this
 *   session with:
 *     ruby -e 'require "kramdown"; require "kramdown-parser-gfm";
 *              puts Kramdown::Document.new(SRC, input: "GFM", hard_wrap: false).to_html'
 *   github-blob — cannot be probed without pushing content (§3.3.3). Behaviours quoted from the
 *   PLAN's own live measurements: HTML comments deleted outright, `id` prefixed to
 *   `user-content-`, `class`/`style`/`data-*` stripped.
 */
import { describe, it, expect } from "vitest";
import { marked } from "marked";
// commonmark 0.31.2 ships no type declarations, and installing `@types/commonmark` would be a
// dependency change. The two constructors this file uses are asserted locally instead, so the
// module is narrowed here rather than left implicitly `any` for the whole file.
// @ts-expect-error -- untyped module, shape asserted immediately below
import * as commonmarkUntyped from "commonmark";
import MarkdownIt from "markdown-it";
import { decodeHTML } from "entities";
import {
  classify,
  extractPayload,
  missingPayloadTokens,
  producesNoOutput,
  renderedHaystack,
  VERDICT_VERSION,
  type FoldOutput,
} from "@/modules/mdmax/domain/verdict";

// ---------------------------------------------------------------- engines under test

const commonmark = commonmarkUntyped as unknown as {
  Parser: new () => { parse: (src: string) => unknown };
  HtmlRenderer: new () => { render: (node: unknown) => string };
};

const md = (src: string): string => marked.parse(src, { async: false });

/** The designated spec oracle, §3.3.3. */
const spec = (src: string): string =>
  new commonmark.HtmlRenderer().render(new commonmark.Parser().parse(src));

/** markdown-it at its shipped default `html:false` — one of the two configurations, of 24, that
 *  render an HTML comment as visible escaped text. */
const mit = new MarkdownIt();

/**
 * A stand-in for the versioned equivalence fold (§3.3.6). Deliberately minimal, because the
 * classifier must not depend on any fold rule beyond "give me the visible text": comments first
 * (a real comment is never visible), then tags, then `entities.decodeHTML` — not a hand-rolled
 * five-entity replace, which §3.3.6 records as the original bug — then whitespace.
 */
function testFold(html: string): FoldOutput {
  const applied: string[] = [];
  let s = html;
  if (/<!--[\s\S]*?-->/.test(s)) {
    s = s.replace(/<!--[\s\S]*?-->/g, "");
    applied.push("drop-html-comments");
  }
  if (/<[^>]*>/.test(s)) {
    s = s.replace(/<[^>]*>/g, " ");
    applied.push("strip-tags");
  }
  const decoded = decodeHTML(s);
  if (decoded !== s) {
    applied.push("decode-entities");
    s = decoded;
  }
  s = s.replace(/\s+/g, " ").trim();
  applied.push("collapse-whitespace");
  return { text: s, applied };
}

const cell = (source: string, rendered: string, referenceRendered?: string) =>
  referenceRendered === undefined
    ? classify({ source, rendered, foldFn: testFold })
    : classify({ source, rendered, referenceRendered, foldFn: testFold });

// ---------------------------------------------------------------- PASS

describe("PASS — the engine agrees with the spec oracle and nothing leaked, voided or vanished", () => {
  it.each([
    ["heading", "# Heading"],
    ["paragraph", "hello world"],
    ["emphasis", "**bold** and _em_ and `code`"],
    ["bullet list", "- one\n- two"],
    ["blockquote", "> quoted text"],
    ["inline link", "[text](http://example.com)"],
    ["resolved reference link", "[text][lbl]\n\n[lbl]: https://example.com"],
  ])("%s", (_name, source) => {
    const v = cell(source, md(source), spec(source));
    expect(v.verdict).toBe("PASS");
    expect(v.class).toBeUndefined();
  });

  it("does not report DESTROY for the markdown syntax characters it consumed", () => {
    // The whole point of counting only [\p{L}\p{N}] runs. `#`, `*`, `_`, backtick, `|`, `-` and
    // `>` all disappear here and none of them is a lost character.
    const source = "# H\n\n**b** _i_ `c`\n\n| a |\n| - |\n| 1 |\n\n> q\n\n- l";
    expect(missingPayloadTokens(extractPayload(source), renderedHaystack(md(source), testFold(md(source)).text))).toEqual([]);
  });

  it("a GFM table is MUTATE against the CommonMark oracle, and that is the oracle's doing", () => {
    // Found by this test, not predicted: commonmark 0.31.2 is CommonMark, NOT GFM, so it has no
    // tables. Measured here — marked returns "<table>...", the oracle returns
    // "<p>| a | b |\n| --- | --- |\n| 1 | 2 |</p>". Every GFM-only construct (tables, strikethrough,
    // task lists, autolinks) will therefore read MUTATE against this oracle. That is a real
    // divergence and the classifier is right to report it; whoever wires the bench must choose the
    // oracle per target, or a cert of a GFM document against a CommonMark oracle is noise.
    const source = "| a | b |\n| --- | --- |\n| 1 | 2 |";
    expect(md(source)).toContain("<table>");
    expect(spec(source)).toContain("<p>| a | b |");
    const v = cell(source, md(source), spec(source));
    expect(v.verdict).toBe("CORRUPT");
    expect(v.class).toBe("MUTATE");
    // No character was lost — the cells are all still there. Only the structure moved.
    expect(missingPayloadTokens(extractPayload(source), renderedHaystack(md(source), testFold(md(source)).text))).toEqual([]);
  });

  it("a mermaid fence is a PASS, not a VOID — the payload survives inside the <pre>", () => {
    // §3.3.5's explicit contrast with `![[Some Note]]`. Measured: marked 16.4.2 emits
    // <pre><code class="language-mermaid">graph TD\n  A--&gt;B\n</code></pre>
    const source = "```mermaid\ngraph TD\n  A-->B\n```";
    const rendered = md(source);
    expect(rendered).toContain('class="language-mermaid"');
    const v = cell(source, rendered, spec(source));
    expect(v.verdict).toBe("PASS");
    expect(v.after).toContain("graph TD");
  });
});

// ---------------------------------------------------------------- VOID

describe("VOID — the payload was by reference and the reference did not resolve", () => {
  it("`![[Some Note]]` under marked 16.4.2, reproduced here", () => {
    const source = "![[Some Note]]";
    const rendered = md(source);
    expect(rendered).toBe("<p>![[Some Note]]</p>\n"); // measured, not assumed
    const v = cell(source, rendered, spec(source));
    expect(v.verdict).toBe("VOID");
    expect(v.before).toBe(source);
    expect(v.after).toBe("![[Some Note]]");
  });

  it("VOID outranks oracle agreement — commonmark 0.31.2 emits the identical bytes", () => {
    // If PASS were decided on "the outputs are equal" this cell would be certified clean, because
    // the spec oracle fails in exactly the same way. Measured this session: both engines return
    // "<p>![[Some Note]]</p>\n".
    const source = "![[Some Note]]";
    expect(spec(source)).toBe(md(source));
    expect(cell(source, md(source), spec(source)).verdict).toBe("VOID");
  });

  it("a bare wikilink is VOID too", () => {
    const source = "[[Some Note]]";
    expect(cell(source, md(source), spec(source)).verdict).toBe("VOID");
  });

  it("an unresolved explicit reference link is VOID", () => {
    const source = "see [text][missing] here";
    expect(md(source)).toBe("<p>see [text][missing] here</p>\n");
    expect(cell(source, md(source), spec(source)).verdict).toBe("VOID");
  });

  it("a RESOLVED reference link is not VOID", () => {
    const source = "[text][lbl]\n\n[lbl]: https://example.com";
    expect(cell(source, md(source), spec(source)).verdict).toBe("PASS");
  });

  it("a wikilink inside a code span is not VOID — it is supposed to be visible", () => {
    const source = "write `[[Some Note]]` to link";
    expect(cell(source, md(source), spec(source)).verdict).toBe("PASS");
  });

  it("does not VOID ordinary bracketed prose", () => {
    // The shortcut reference form is excluded on purpose: `[TODO] ...` is prose in every corpus.
    const source = "[TODO] finish this";
    expect(cell(source, md(source), spec(source)).verdict).toBe("PASS");
  });
});

// ---------------------------------------------------------------- CORRUPT / LEAK

describe("CORRUPT/LEAK — metadata became visible text", () => {
  it("YAML front matter, visible in 23 of 24 bench configurations", () => {
    const source = "---\ntitle: Hello\n---\n";
    const rendered = md(source);
    expect(rendered).toBe("<hr>\n<h2>title: Hello</h2>\n"); // measured
    const v = cell(source, rendered, spec(source));
    expect(v.verdict).toBe("CORRUPT");
    expect(v.class).toBe("LEAK");
    expect(v.after).toContain("title: Hello");
  });

  it("`{#id}`, which leaks in 21 of 24 — and leaks IDENTICALLY on the spec oracle", () => {
    // The case that forces PASS to be gated rather than decided by oracle equality. Measured:
    // marked 16.4.2 and commonmark 0.31.2 both return "<h2>Heading {#custom}</h2>\n".
    const source = "## Heading {#custom}";
    expect(md(source)).toBe(spec(source));
    const v = cell(source, md(source), spec(source));
    expect(v.verdict).toBe("CORRUPT");
    expect(v.class).toBe("LEAK");
  });

  it("an HTML comment rendered as escaped text — markdown-it 15.0.0 at its default html:false", () => {
    const source = "<!-- note -->";
    const rendered = mit.render(source);
    expect(rendered).toBe("<p>&lt;!-- note --&gt;</p>\n"); // measured
    const v = cell(source, rendered, spec(source));
    expect(v.verdict).toBe("CORRUPT");
    expect(v.class).toBe("LEAK");
  });

  it("does not LEAK a `{#id}` written inside a code span", () => {
    const source = "the `{#custom}` syntax";
    const v = cell(source, md(source), spec(source));
    expect(v.verdict).toBe("PASS");
  });

  it("kramdown consumes `{#id}` into an attribute, so there is no leak to report", () => {
    // DECLARED, kramdown 2.5.2 + kramdown-parser-gfm 1.1.0, hard_wrap:false (command in header).
    const source = "## Heading {#custom}";
    const kramdown = '<h2 id="custom">Heading</h2>\n';
    const v = cell(source, kramdown, spec(source));
    expect(v.class).not.toBe("LEAK");
  });
});

// ---------------------------------------------------------------- CORRUPT / DESTROY

describe("CORRUPT/DESTROY — a character the author typed is reachable nowhere in the output", () => {
  it("`Array<string>` renders as `Array`", () => {
    const source = "Array<string>";
    // DECLARED github-blob shape; the same loss is what a browser performs on marked's own output.
    const v = cell(source, "<p>Array</p>", "<p>Array<string></p>");
    expect(v.verdict).toBe("CORRUPT");
    expect(v.class).toBe("DESTROY");
    expect(v.before).toBe("Array<string>");
    expect(v.after).toBe("Array");
  });

  it("`<cat>` is swallowed as an unknown tag even when the engine passes the bytes through", () => {
    // Measured: marked 16.4.2 emits "<p>a <cat> b</p>\n". The bytes are in the HTML and the reader
    // still sees "a  b", because a browser deletes an unknown element's tag. That is the
    // asymmetry the classifier encodes: source tags are payload unless they are known elements.
    const source = "a <cat> b";
    const rendered = md(source);
    expect(rendered).toBe("<p>a <cat> b</p>\n");
    const v = cell(source, rendered);
    expect(v.verdict).toBe("CORRUPT");
    expect(v.class).toBe("DESTROY");
  });

  it("an HTML comment deleted outright", () => {
    // DECLARED github-blob: 5 standalone `<!--` lines in the nodejs/node README source, 0 in the
    // 91,223-byte rendered blob (§3.3.3).
    const v = cell("<!-- note -->", "");
    expect(v.verdict).toBe("CORRUPT");
    expect(v.class).toBe("DESTROY");
  });

  it("class, style and data-* stripped from a raw HTML block", () => {
    // DECLARED, from the PLAN's live GitHub re-verification:
    // <div id="x" class="c" style="color:red" data-k="v">hi</div> -> <div id="user-content-x">hi</div>
    const source = '<div id="x" class="c" style="color:red" data-k="v">hi</div>';
    const v = cell(source, '<div id="user-content-x">hi</div>', source);
    expect(v.verdict).toBe("CORRUPT");
    expect(v.class).toBe("DESTROY");
  });

  it("but the SAME raw HTML passed through untouched is a PASS", () => {
    // Without the known-element rule, `div`, `id`, `class`, `style` and `data` would all read as
    // destroyed characters here and every raw HTML block in every document would be CORRUPT.
    const source = '<div id="x" class="c" style="color:red" data-k="v">hi</div>';
    expect(cell(source, source, source).verdict).toBe("PASS");
  });

  it("does not DESTROY a link whose text is short and whose URL lives only in an attribute", () => {
    const source = "[t](https://example.com/very/long/path)";
    const v = cell(source, md(source), spec(source));
    expect(v.verdict).toBe("PASS");
  });
});

// ---------------------------------------------------------------- CORRUPT / MUTATE

describe("CORRUPT/MUTATE — the characters survive, the structure does not", () => {
  it("`1) first` is a paragraph on kramdown and an <ol> on every other engine", () => {
    const source = "1) first\n2) second";
    // DECLARED kramdown 2.5.2 + kramdown-parser-gfm 1.1.0 at Jekyll's hard_wrap:false; command in
    // the file header. Reproduced this session, byte for byte.
    const kramdown = "<p>1) first\n2) second</p>\n";
    // Measured here: marked, commonmark and markdown-it all produce the <ol>.
    expect(md(source)).toBe("<ol>\n<li>first</li>\n<li>second</li>\n</ol>\n");
    expect(spec(source)).toBe(md(source));
    expect(mit.render(source)).toBe(md(source));

    const v = cell(source, kramdown, spec(source));
    expect(v.verdict).toBe("CORRUPT");
    expect(v.class).toBe("MUTATE");
    expect(v.before).toBe(source);
    expect(v.after).toBe("1) first 2) second");
  });

  it("MUTATE is not reachable without the oracle, and the classifier does not pretend otherwise", () => {
    // Stated as a limitation rather than guessed at: inferring "this should have been an <ol>"
    // from a hand-written construct list is the move §3.3.5 records as information-free.
    const v = cell("1) first\n2) second", "<p>1) first\n2) second</p>\n");
    expect(v.verdict).toBe("PASS");
  });

  it("a block that produced no output is never MUTATE — it has no structure to differ", () => {
    const source = "[orphan]: https://example.com \"Title\"";
    const v = cell(source, "", "<p>something</p>");
    expect(v.verdict).toBe("STRIP");
  });
});

// ---------------------------------------------------------------- STRIP

describe("STRIP — output differs, the payload is invisible, no source character was lost", () => {
  it("a tail-placed orphan link reference definition: 0 bytes of HTML in 24 of 24", () => {
    const source = '[orphan]: https://example.com "Title"';
    expect(md(source)).toBe(""); // measured
    expect(spec(source)).toBe(""); // measured
    const v = cell(source, md(source), spec(source));
    expect(v.verdict).toBe("STRIP");
    expect(v.class).toBeUndefined();
    expect(v.before).toBe(source);
    expect(v.after).toBe("");
  });

  it("front matter consumed upstream of the engine (Jekyll, Hugo, Astro, Eleventy)", () => {
    const v = cell("---\ntitle: Hello\n---\n", "");
    expect(v.verdict).toBe("STRIP");
  });

  it("an HTML comment preserved as a comment is STRIP, not DESTROY", () => {
    // Measured: marked 16.4.2 returns the comment verbatim. Invisible by design, nothing lost.
    const source = "<!-- note -->";
    expect(md(source)).toBe("<!-- note -->");
    const v = cell(source, md(source), spec(source));
    expect(v.verdict).toBe("STRIP");
  });

  it("distinguishes a preserved comment from a deleted one on identical folded text", () => {
    // Both fold to "". The only difference is whether the characters are still in the HTML, which
    // is exactly what separates STRIP from DESTROY.
    expect(cell("<!-- note -->", "<!-- note -->").verdict).toBe("STRIP");
    expect(cell("<!-- note -->", "").verdict).toBe("CORRUPT");
  });
});

// ---------------------------------------------------------------- contract obligations

describe("every cell carries before and after — contract rule 2", () => {
  const cases: Array<[string, string, string | undefined]> = [
    ["# Heading", "<h1>Heading</h1>", "<h1>Heading</h1>"],
    ["![[Some Note]]", "<p>![[Some Note]]</p>", undefined],
    ["---\ntitle: Hello\n---\n", "<h2>title: Hello</h2>", undefined],
    ["Array<string>", "<p>Array</p>", "<p>Array<string></p>"],
    ["1) first", "<p>1) first</p>", "<ol><li>first</li></ol>"],
    ['[orphan]: https://example.com "T"', "", ""],
  ];

  it.each(cases)("%s always has both", (source, rendered, reference) => {
    const v = cell(source, rendered, reference);
    expect(typeof v.before).toBe("string");
    expect(typeof v.after).toBe("string");
    expect(v.before).toBe(source);
    expect(v.foldApplied).toBeDefined();
  });

  it("a CORRUPT verdict always names its class, and no other verdict does", () => {
    for (const [source, rendered, reference] of cases) {
      const v = cell(source, rendered, reference);
      if (v.verdict === "CORRUPT") expect(["LEAK", "DESTROY", "MUTATE"]).toContain(v.class);
      else expect(v.class).toBeUndefined();
    }
  });

  it("is versioned, so a stored cell can be traced to the definition that produced it", () => {
    expect(VERDICT_VERSION).toBe("mdmax/verdict@1");
  });
});

describe("it does not throw on anything a document can contain", () => {
  it("survives degenerate input", () => {
    const junk = [
      "",
      " ",
      "\n\n\n",
      "```\nunclosed",
      "[",
      "]",
      "[[",
      "{#",
      "<!--",
      "<",
      "---\nno close",
      " ",
      "日本語 \u{1F600}",
      "&amp;&#65;&#x41;",
      "a".repeat(20_000),
    ];
    for (const source of junk) {
      expect(() => cell(source, md(source), spec(source)), JSON.stringify(source)).not.toThrow();
    }
  });

  it("propagates a fold that throws instead of inventing a verdict", () => {
    // A fold that throws is a bench defect, not a user document. Swallowing it would put a
    // measurement in the artifact that was never measured; CertFailure.ENGINE_THREW is where that
    // refusal belongs, and CellVerdict has no cell for "unknown" by design.
    expect(() =>
      classify({
        source: "x",
        rendered: "<p>x</p>",
        foldFn: () => {
          throw new Error("fold is broken");
        },
      }),
    ).toThrow("fold is broken");
  });
});

describe("the helpers the DESTROY test is built from", () => {
  it("producesNoOutput ignores comments and whitespace but not an <hr> or an <img>", () => {
    expect(producesNoOutput("")).toBe(true);
    expect(producesNoOutput("\n  \n")).toBe(true);
    expect(producesNoOutput("<!-- note -->\n")).toBe(true);
    expect(producesNoOutput("<hr>")).toBe(false);
    expect(producesNoOutput('<img src="x.png" alt="a">')).toBe(false);
  });

  it("extractPayload removes the constructs that vanish by design on every engine", () => {
    expect(extractPayload("---\ntitle: Hello\n---\nbody").trim()).toBe("body");
    expect(extractPayload('[orphan]: https://example.com "Title"').trim()).toBe("");
    expect(extractPayload("```js\ncode\n```")).toContain("code");
    expect(extractPayload("```js\ncode\n```")).not.toContain("js");
    expect(extractPayload("[text][lbl]")).toBe("[text]");
    expect(extractPayload("A &amp; B").trim()).not.toContain("amp");
  });

  it("missingPayloadTokens counts, so one surviving copy does not cover two lost ones", () => {
    expect(missingPayloadTokens("cat cat", "cat")).toEqual(["cat"]);
    expect(missingPayloadTokens("cat cat", "cat cat")).toEqual([]);
    expect(missingPayloadTokens("# * _ ` | - >", "")).toEqual([]);
  });

  it("renderedHaystack reaches attribute values and preserved comment bodies", () => {
    const html = '<a href="https://example.com">t</a><!-- hidden -->';
    const hay = renderedHaystack(html, testFold(html).text);
    expect(hay).toContain("https://example.com");
    expect(hay).toContain("hidden");
  });
});
