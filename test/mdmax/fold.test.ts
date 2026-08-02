/**
 * THE EQUIVALENCE FOLD. (PLAN §3.3.6)
 *
 * The fold defines `PASS`, so this suite has two halves that pull against each other and both
 * matter:
 *
 *   1. Each documented rule fires, in isolation, and says that it fired.
 *   2. The fold does NOT hide a real difference. Kill condition (1) in §3.3.10 is "the fold
 *      swallows everything" — if it over-folds, the certificate is a curiosity. Every assertion in
 *      the "does not hide" block is a difference a user must still be told about.
 */
import { describe, it, expect } from "vitest";
import {
  fold,
  foldEqual,
  foldStamp,
  FOLD_VERSION,
  FOLD_RULES,
} from "@/modules/mdmax/domain/fold";

describe("the version stamp", () => {
  it("is the exact string stored in Certificate.fold.version", () => {
    expect(FOLD_VERSION).toBe("mdmax/fold@1");
    expect(foldStamp()).toBe(FOLD_VERSION);
  });

  it("reports rules in a fixed order so an audit trail is comparable", () => {
    expect([...FOLD_RULES]).toEqual([
      "entity-decode",
      "smart-punctuation",
      "void-element-spelling",
      "whitespace",
      "id-prefix",
      "heading-anchor-id",
    ]);
  });
});

describe("rule 1 — full HTML entity decode", () => {
  it("decodes named entities a five-entity replace would miss", () => {
    // The original bug: `&mdash;` and `&hellip;` fell straight through a hand-rolled
    // `&amp;/&lt;/&gt;/&quot;/&#39;` replace.
    const r = fold("<p>&mdash;&hellip;</p>");
    expect(r.text).toBe("<p>--...</p>");
    expect(r.applied).toContain("entity-decode");
  });

  it("decodes numeric and hex references", () => {
    expect(fold("<p>&#8212;</p>").text).toBe("<p>--</p>");
    expect(fold("<p>&#x2014;</p>").text).toBe("<p>--</p>");
    expect(foldEqual("<p>&#x2019;</p>", "<p>&rsquo;</p>")).toBe(true);
  });

  it("canonicalises a bare ampersand against its entity spelling", () => {
    expect(foldEqual("<p>a & b</p>", "<p>a &amp; b</p>")).toBe(true);
    expect(foldEqual("<p>a &#38; b</p>", "<p>a &amp; b</p>")).toBe(true);
  });

  it("canonicalises a bare less-than against its entity spelling", () => {
    // `< ` is not a tag start, so a renderer may emit it raw. Both spellings are the same text.
    expect(foldEqual("<p>a < b</p>", "<p>a &lt; b</p>")).toBe(true);
  });

  it("does not fire when the text is already canonical", () => {
    expect(fold("<p>a &amp; b</p>").applied).not.toContain("entity-decode");
    expect(fold("<p>plain</p>").applied).toEqual([]);
  });

  it("keeps a non-breaking space distinguishable from a plain one", () => {
    // U+00A0 is not collapsible whitespace. Folding it away would change what the reader sees.
    expect(foldEqual("<p>a&nbsp;b</p>", "<p>a b</p>")).toBe(false);
    expect(foldEqual("<p>a b</p>", "<p>a&nbsp;b</p>")).toBe(true);
  });
});

describe("rule 2 — smart punctuation", () => {
  it("folds all five substitutions", () => {
    const r = fold("<p>‘a’ “b” c–d e—f g…</p>");
    expect(r.text).toBe("<p>'a' \"b\" c-d e--f g...</p>");
    expect(r.applied).toEqual(["smart-punctuation"]);
  });

  it("makes a smartypants engine agree with one that leaves the source alone", () => {
    expect(foldEqual("<p>He said “no”—twice…</p>", '<p>He said "no"--twice...</p>')).toBe(
      true,
    );
  });
});

describe("rule 3 — void-element spelling", () => {
  it("treats the three spellings of a bare void element as one", () => {
    expect(fold("<hr />").text).toBe("<hr>");
    expect(fold("<hr/>").text).toBe("<hr>");
    expect(foldEqual("<hr>", "<hr />")).toBe(true);
    expect(foldEqual("<br>", "<br/>")).toBe(true);
    expect(fold("<hr />").applied).toEqual(["void-element-spelling"]);
  });

  it("folds the spelling of void elements that carry attributes", () => {
    expect(foldEqual('<img src="a.png" alt="a" />', '<img src="a.png" alt="a">')).toBe(true);
    expect(foldEqual('<input type="checkbox" disabled />', '<input type="checkbox" disabled>')).toBe(
      true,
    );
  });

  it("does not strip a slash that belongs to an attribute value", () => {
    // Quoted: the `/` is inside the value.
    expect(fold('<img src="a/">').text).toBe('<img src="a/">');
    // Unquoted: HTML's unquoted-attribute-value state consumes `/`, so the value really is `a/`.
    expect(fold("<img src=a/>").text).toBe("<img src=a/>");
  });

  it("leaves non-void elements alone", () => {
    expect(fold("<span/>").text).toBe("<span/>");
    expect(foldEqual("<span/>", "<span>")).toBe(false);
  });
});

describe("rule 4 — trailing and inter-block whitespace", () => {
  it("folds a newline between two blocks", () => {
    expect(foldEqual("<p>a</p>\n<p>b</p>", "<p>a</p><p>b</p>")).toBe(true);
    expect(fold("<p>a</p>\n<p>b</p>").applied).toEqual(["whitespace"]);
  });

  it("folds leading and trailing whitespace inside a block, and around the document", () => {
    expect(fold("  <p>  a  </p>  ").text).toBe("<p>a</p>");
  });

  it("folds a list emitted one item per line against one emitted on a single line", () => {
    expect(foldEqual("<ul>\n<li>a</li>\n<li>b</li>\n</ul>", "<ul><li>a</li><li>b</li></ul>")).toBe(
      true,
    );
  });

  it("keeps a space between two inline elements", () => {
    const r = fold("<p><em>a</em> <em>b</em></p>");
    expect(r.text).toBe("<p><em>a</em> <em>b</em></p>");
    expect(r.applied).toEqual([]);
    expect(foldEqual("<p><em>a</em> <em>b</em></p>", "<p><em>a</em><em>b</em></p>")).toBe(false);
  });

  it("collapses a run inside a paragraph, which HTML renders identically", () => {
    expect(foldEqual("<p>a\nb</p>", "<p>a b</p>")).toBe(true);
  });
});

describe("rule 5 — id prefixing", () => {
  // Tested on a DIV, not a heading. Heading ids are removed outright by rule 6 (they are
  // renderer-generated anchors), which would hide this rule's effect. GitHub prefixes the id on
  // any element -- measured: <div id="x" class="c" style="color:red" data-k="v">hi</div> comes
  // back as <div id="user-content-x">hi</div> -- so a div is where the prefix stays observable.
  it("treats GitHub's user-content- prefix as the same id", () => {
    const r = fold('<div id="user-content-intro">Intro</div>');
    expect(r.text).toBe('<div id="intro">Intro</div>');
    expect(r.applied).toEqual(["id-prefix"]);
    expect(foldEqual('<div id="user-content-a">x</div>', '<div id="a">x</div>')).toBe(true);
  });

  it("handles single-quoted ids and spaced attribute syntax", () => {
    expect(fold("<div id='user-content-a'>x</div>").text).toBe("<div id='a'>x</div>");
    expect(fold('<div id = "user-content-a">x</div>').text).toBe('<div id = "a">x</div>');
  });

  it("does not touch an attribute that merely ends in `id`", () => {
    expect(fold('<div data-id="user-content-a"></div>').applied).toEqual([]);
  });

  it("does not touch the prefix inside an href, which is a real finding", () => {
    // Only the `id` attribute is folded. A cross-reference that points at a different anchor
    // string is an attribute value, and §3.3.6 folds no attribute value but the id prefix.
    expect(foldEqual('<a href="#user-content-a">x</a>', '<a href="#a">x</a>')).toBe(false);
  });
});

describe("rule 6 — renderer-generated heading anchors", () => {
  // Measured: on `# A Heading`, kramdown 2.5.2 emits <h1 id="a-heading"> where commonmark.js
  // 0.31.2 and marked 16.4.2 emit <h1>. Without this rule EVERY heading in EVERY document is a
  // MUTATE on github-pages -- 356 MUTATEs on a five-file sample, nearly all false.
  it("folds away an auto-generated heading anchor", () => {
    const r = fold('<h1 id="a-heading">A Heading</h1>');
    expect(r.text).toBe("<h1>A Heading</h1>");
    expect(r.applied).toEqual(["heading-anchor-id"]);
  });

  it("makes kramdown's heading equal to marked's", () => {
    expect(foldEqual('<h1 id="a-heading">A Heading</h1>', "<h1>A Heading</h1>")).toBe(true);
  });

  it("applies to every heading level and not to other elements", () => {
    for (const h of ["h1", "h2", "h3", "h4", "h5", "h6"]) {
      expect(fold(`<${h} id="x">t</${h}>`).text).toBe(`<${h}>t</${h}>`);
    }
    expect(fold('<div id="x">t</div>').text).toBe('<div id="x">t</div>');
    expect(fold('<p id="x">t</p>').text).toBe('<p id="x">t</p>');
  });

  it("does NOT hide the {#id} finding, which lives in the TEXT stream", () => {
    // This is the check that keeps rule 6 safe against kill condition (1). kramdown CONSUMES
    // `{#custom}` into an attribute; every other engine leaks it as visible text. Folding the
    // attribute away leaves the leaked text, so the finding survives.
    const consumed = '<h2 id="custom">Another</h2>';
    const leaked = "<h2>Another {#custom}</h2>";
    expect(foldEqual(consumed, leaked)).toBe(false);
  });

  it("leaves other heading attributes alone", () => {
    expect(fold('<h1 class="c" id="x">t</h1>').text).toContain('class="c"');
  });
});

describe("the fold does NOT hide a real difference", () => {
  it("keeps different tag names different", () => {
    expect(foldEqual("<p><em>a</em></p>", "<p><strong>a</strong></p>")).toBe(false);
  });

  it("keeps deleted text different (DESTROY)", () => {
    // Measured: `Array<string>` renders as `Array` on at least one target.
    expect(foldEqual("<p>Array&lt;string&gt;</p>", "<p>Array</p>")).toBe(false);
    expect(foldEqual("<p>a b</p>", "<p>a</p>")).toBe(false);
  });

  it("keeps escaped text distinct from raw markup (LEAK)", () => {
    // THE load-bearing assertion. A naive full decode of the whole document turns
    // `<p>&lt;cat&gt;</p>` into `<p><cat></p>` and the LEAK vanishes from the certificate.
    expect(foldEqual("<p><cat></p>", "<p>&lt;cat&gt;</p>")).toBe(false);
    expect(fold("<p>&lt;cat&gt;</p>").text).toBe("<p>&lt;cat&gt;</p>");
  });

  it("keeps different element nesting different", () => {
    expect(foldEqual("<p>a</p><p>b</p>", "<p>a b</p>")).toBe(false);
    expect(foldEqual("<blockquote><p>a</p></blockquote>", "<p>a</p>")).toBe(false);
  });

  it("keeps attribute values different", () => {
    expect(foldEqual('<a href="/a">x</a>', '<a href="/b">x</a>')).toBe(false);
    expect(foldEqual('<img src="a.png">', '<img src="b.png">')).toBe(false);
    // Smart punctuation is text-position only; an attribute value is not text position.
    expect(foldEqual('<a title="a—b">x</a>', '<a title="a--b">x</a>')).toBe(false);
  });

  it("keeps the kramdown hard_wrap difference visible", () => {
    // Measured: kramdown-parser-gfm defaults hard_wrap ON where Jekyll sets it OFF. On
    // "Line one\nLine two" that is a `<br />` that one target emits and the other does not. The
    // fix for this is recording the target's full option set, NOT folding the <br> away.
    expect(foldEqual("<p>Line one<br />\nLine two</p>", "<p>Line one\nLine two</p>")).toBe(false);
  });

  it("keeps whitespace inside <pre> significant", () => {
    expect(foldEqual("<pre><code>a  b</code></pre>", "<pre><code>a b</code></pre>")).toBe(false);
    expect(fold("<pre><code>a\n  b\n</code></pre>").text).toBe("<pre><code>a\n  b\n</code></pre>");
  });

  it("does not smarten punctuation inside verbatim text", () => {
    // In a code block a substituted character is a DESTROY, not a typographic variant.
    expect(foldEqual("<pre><code>a—b</code></pre>", "<pre><code>a--b</code></pre>")).toBe(false);
    expect(foldEqual("<p><code>a—b</code></p>", "<p><code>a--b</code></p>")).toBe(false);
  });

  it("does not fold the contents of an HTML comment", () => {
    expect(foldEqual("<!-- a—b -->", "<!-- a--b -->")).toBe(false);
    expect(fold("<!-- a—b -->").text).toBe("<!-- a—b -->");
  });

  it("keeps a mermaid fence (payload survives) distinct from an unresolved reference (VOID)", () => {
    // §3.3.5: `![[Some Note]]` -> `<p>![[Some Note]]</p>` is VOID; a mermaid fence is not,
    // because its payload is still in the output.
    expect(
      foldEqual(
        '<pre><code class="language-mermaid">graph TD;</code></pre>',
        "<p>![[Some Note]]</p>",
      ),
    ).toBe(false);
  });
});

/** Inputs that exercise every rule, every exemption, and the ugly edges of the scanner. */
const CORPUS: readonly string[] = [
  "",
  "   ",
  "plain text",
  "<p>plain</p>",
  "<p>&mdash;&hellip;&nbsp;&amp;&lt;&gt;&#38;&#x2014;&ampx</p>",
  "<p>‘a’ “b” c–d e—f g…</p>",
  "<hr /><hr/><hr><br /><img src='a/' /><input disabled />",
  "  <p>  a  b  </p>\n\n<p>c</p>  ",
  '<h1 id="user-content-user-content-a">x</h1>',
  '<h1 id="user-content-a">x</h1><a href="#user-content-a">x</a>',
  "<pre><code>  a\n\n  b—c  </code></pre>",
  "<p><code>a—b</code> and <em>c</em> <em>d</em></p>",
  "<!-- a—b --><p>x</p><!DOCTYPE html>",
  "<p>a < b and 3 > 2</p>",
  "<p>unterminated <tag",
  '<table>\n<tr>\n<td>a</td>\n<td>b</td>\n</tr>\n</table>',
  "<p>&#32;&NewLine;a</p>",
  "<ul>\n<li>a</li>\n<li>b</li>\n</ul>",
  '<img src="a" alt="x / y" />',
  "<p>![[Some Note]]</p>",
];

describe("idempotence", () => {
  it("is a fixed point on every corpus input", () => {
    // The folded text is what a certificate stores. A representative that moves when you
    // re-derive it is not a representative.
    for (const input of CORPUS) {
      const once = fold(input).text;
      const twice = fold(once).text;
      expect(twice, `not idempotent for: ${JSON.stringify(input)}`).toBe(once);
    }
  });

  it("reports no further rules on already-folded text", () => {
    for (const input of CORPUS) {
      const once = fold(input);
      const twice = fold(once.text);
      expect(twice.applied, `re-fired for: ${JSON.stringify(input)}`).toEqual([]);
    }
  });
});

describe("totality and shape", () => {
  it("never throws and always returns both fields", () => {
    for (const input of CORPUS) {
      const r = fold(input);
      expect(typeof r.text).toBe("string");
      expect(Array.isArray(r.applied)).toBe(true);
      for (const rule of r.applied) expect(FOLD_RULES).toContain(rule);
    }
  });

  it("returns an empty rule list for an empty document", () => {
    expect(fold("")).toEqual({ text: "", applied: [] });
  });

  it("reports every rule that fired, and only those", () => {
    // A HEADING with a user-content- id exercises both id rules in sequence: id-prefix strips the
    // prefix, then heading-anchor-id removes what is left. A div would fire only the first.
    const r = fold('  <h1 id="user-content-a">A &mdash; B…</h1>\n<hr />  ');
    expect(r.text).toBe("<h1>A -- B...</h1><hr>");
    expect(r.applied).toEqual([
      "entity-decode",
      "smart-punctuation",
      "void-element-spelling",
      "whitespace",
      "id-prefix",
      "heading-anchor-id",
    ]);
  });

  it("stays linear on a document made of hostile angle brackets", () => {
    // The scanner is index-based rather than slice-based for exactly this input; a `slice(i)`
    // inside the loop makes the fold quadratic. No timing assertion — a quadratic scan blows
    // vitest's own timeout, which is the signal.
    const hostile = "<".repeat(200_000);
    const out = fold(hostile);
    // Every `<` here is text, not a tag start, so it canonicalises to `&lt;`.
    expect(out.text.length).toBe(200_000 * "&lt;".length);
    expect(out.applied).toEqual(["entity-decode"]);
  });
});
