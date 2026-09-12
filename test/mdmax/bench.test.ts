/**
 * THE ENGINE BENCH. (PLAN §3.3.3, §3.3.7)
 *
 * These tests exist to hold three lines that a measurement already crossed once:
 *   - kramdown must run under JEKYLL's options, not kramdown-parser-gfm's, because `hard_wrap`
 *     differs between them and every soft line break in every document turns on it;
 *   - two configurations of ONE library (markdown-it at html:false and html:true) must be allowed to
 *     disagree, because they do;
 *   - a bench that cannot load an engine must refuse, not shrink.
 */
import { describe, it, expect, beforeAll, afterEach } from "vitest";
import {
  loadBench,
  computeBenchId,
  stripJekyllFrontMatter,
  BENCH_ENGINE_IDS,
  type BenchOk,
} from "@/modules/mdmax/infrastructure/bench";
import type { Engine } from "@/modules/mdmax/domain/cert-contract";

let bench: BenchOk;

beforeAll(async () => {
  const r = await loadBench();
  if (!r.ok) throw new Error(`bench refused to load: ${r.reason} ${JSON.stringify(r)}`);
  bench = r;
}, 60_000);

function engine(id: string): Engine {
  const e = bench.engines.find((x) => x.id === id);
  if (!e) throw new Error(`no engine ${id} in the bench`);
  return e;
}

describe("the bench loads", () => {
  it("builds every engine, in registry order", () => {
    expect(bench.engines.map((e) => e.id)).toEqual([...BENCH_ENGINE_IDS]);
  });

  it("stamps every engine with a version and a non-empty option set", () => {
    for (const e of bench.engines) {
      expect(e.version, `${e.id} version`).not.toBe("");
      expect(Object.keys(e.options).length, `${e.id} options`).toBeGreaterThan(0);
    }
  });

  it("carries the resolved versions the plan pins", () => {
    expect(engine("marked").version).toBe("16.4.2");
    expect(engine("markdown-it").version).toBe("15.0.0");
    expect(engine("commonmark").version).toBe("0.31.2");
    expect(engine("react-markdown").version).toBe("10.1.0");
    expect(engine("remark-app").version).toContain("remark-parse@11.0.0");
    expect(engine("kramdown-jekyll").version).toBe("kramdown@2.5.2+kramdown-parser-gfm@1.1.0");
  });
});

describe("every engine renders", () => {
  it.each([...BENCH_ENGINE_IDS])("%s renders '# Hello' to something containing Hello", async (id) => {
    const html = await engine(id).render("# Hello\n");
    expect(html).toContain("Hello");
  });
});

describe("kramdown runs under Jekyll's options, not the gfm parser's", () => {
  it("records hard_wrap false", () => {
    expect(engine("kramdown-jekyll").options.hard_wrap).toBe(false);
  });

  it("records all nine Jekyll kramdown options", () => {
    const o = engine("kramdown-jekyll").options;
    for (const k of [
      "auto_ids",
      "toc_levels",
      "entity_output",
      "smart_quotes",
      "input",
      "hard_wrap",
      "guess_lang",
      "footnote_nr",
      "show_warnings",
    ]) {
      expect(o, `missing ${k}`).toHaveProperty(k);
    }
    expect(o.input).toBe("GFM");
  });

  it("emits NO <br> for a soft line break", async () => {
    // The measured pair. hard_wrap ON gives `<p>Line one<br />\nLine two</p>`; Jekyll gives this.
    // Reproduced byte-for-byte 2026-08-02 against ruby 2.5.2 + kramdown-parser-gfm 1.1.0.
    const html = await engine("kramdown-jekyll").render("Line one\nLine two\n");
    expect(html).not.toContain("<br");
    expect(html).toBe("<p>Line one\nLine two</p>\n");
  });
});

describe("Jekyll strips front matter before kramdown sees it", () => {
  it("drops an opening block and keeps the body", () => {
    expect(stripJekyllFrontMatter("---\ntitle: x\n---\n\n# Hello\n")).toBe("\n# Hello\n");
  });

  it("treats an UNTERMINATED block as content, as Jekyll does", () => {
    const src = "---\ntitle: x\n\n# Hello\n";
    expect(stripJekyllFrontMatter(src)).toBe(src);
  });

  it("leaves a document that does not open with --- alone", () => {
    const src = "# Hello\n\n---\nnot: front matter\n---\n";
    expect(stripJekyllFrontMatter(src)).toBe(src);
  });

  it("the engine itself applies the strip, so front matter does not LEAK on this target", async () => {
    const html = await engine("kramdown-jekyll").render("---\ntitle: secret\n---\n\n# Hello\n");
    expect(html).not.toContain("secret");
    expect(html).toContain("Hello");
    expect(engine("kramdown-jekyll").options.prePipeline).toEqual(["jekyll-strip-front-matter"]);
  });
});

describe("the disagreements the bench exists to catch", () => {
  it("markdown-it html:false and html:true actually differ on raw HTML", async () => {
    const src = "<div>hi</div>\n";
    const off = await engine("markdown-it").render(src);
    const on = await engine("markdown-it-html-true").render(src);
    expect(off).not.toBe(on);
    expect(off).toContain("&lt;div&gt;");
    expect(on).toContain("<div>hi</div>");
    expect(engine("markdown-it").options.html).toBe(false);
    expect(engine("markdown-it-html-true").options.html).toBe(true);
  });

  it("react-markdown escapes raw HTML where the app's own remark pipeline passes it through", async () => {
    const src = "<div>hi</div>\n";
    expect(await engine("react-markdown").render(src)).toContain("&lt;div&gt;");
    expect(await engine("remark-app").render(src)).toContain("<div>hi</div>");
  });

  it("reproduces the measured VOID pair: a wikilink embed carries no payload, a mermaid fence does", async () => {
    // §3.3.5. `![[Some Note]]` under marked 16.4.2 emits the literal text and nothing else — the
    // payload was by reference and never in the file. The fence keeps its payload inside the <pre>,
    // which is why it is not VOID.
    expect(await engine("marked").render("![[Some Note]]\n")).toBe("<p>![[Some Note]]</p>\n");
    const fence = await engine("marked").render("```mermaid\ngraph TD;\n```\n");
    expect(fence).toContain("language-mermaid");
    expect(fence).toContain("graph TD;");
  });
});

describe("the bench id", () => {
  it("is a sha256 hex digest", () => {
    expect(bench.benchId).toMatch(/^[0-9a-f]{64}$/);
  });

  it("is stable across two loads of the same bench", async () => {
    const again = await loadBench();
    expect(again.ok).toBe(true);
    if (again.ok) expect(again.benchId).toBe(bench.benchId);
  }, 60_000);

  it("changes when ONE option changes — a cert under different options is a different bench", () => {
    const base = [{ id: "kramdown-jekyll", version: "2.5.2", options: { hard_wrap: false } }];
    const flipped = [{ id: "kramdown-jekyll", version: "2.5.2", options: { hard_wrap: true } }];
    expect(computeBenchId(base)).not.toBe(computeBenchId(flipped));
  });

  it("ignores key order inside options but not the values", () => {
    const a = [{ id: "e", version: "1", options: { b: 2, a: 1 } }];
    const b = [{ id: "e", version: "1", options: { a: 1, b: 2 } }];
    expect(computeBenchId(a)).toBe(computeBenchId(b));
  });

  it("differs for a subset — a smaller bench is visibly a different bench", async () => {
    const subset = await loadBench({ require: ["marked", "commonmark"] });
    expect(subset.ok).toBe(true);
    if (subset.ok) {
      expect(subset.engines).toHaveLength(2);
      expect(subset.benchId).not.toBe(bench.benchId);
    }
  }, 60_000);
});

describe("a missing engine is a hard refusal, never a smaller matrix", () => {
  const saved = process.env.MDMAX_RUBY_BIN;
  afterEach(() => {
    if (saved === undefined) delete process.env.MDMAX_RUBY_BIN;
    else process.env.MDMAX_RUBY_BIN = saved;
  });

  it("refuses when ruby is not where the bench looks for it", async () => {
    process.env.MDMAX_RUBY_BIN = "/nonexistent/ruby-that-is-not-installed";
    const r = await loadBench({ require: ["kramdown-jekyll"] });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toBe("ENGINE_MISSING");
      if (r.reason === "ENGINE_MISSING") expect(r.engineId).toBe("kramdown-jekyll");
      expect(r.detail.length).toBeLessThan(200);
    }
    expect(r).not.toHaveProperty("engines");
  }, 30_000);

  it("refuses the WHOLE bench when one engine of many is unavailable", async () => {
    process.env.MDMAX_RUBY_BIN = "/nonexistent/ruby-that-is-not-installed";
    const r = await loadBench({ require: ["marked", "kramdown-jekyll"] });
    expect(r.ok).toBe(false);
    expect(r).not.toHaveProperty("engines");
  }, 30_000);

  it("refuses an engine id it does not build", async () => {
    const r = await loadBench({ require: ["pandoc"] });
    expect(r.ok).toBe(false);
    if (!r.ok && r.reason === "ENGINE_MISSING") {
      expect(r.engineId).toBe("pandoc");
      expect(r.detail).toContain("no such engine");
    } else {
      throw new Error("expected ENGINE_MISSING");
    }
  });

  it("refuses an empty require rather than returning an empty bench", async () => {
    const r = await loadBench({ require: [] });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("SHAPE_REFUSED");
    expect(r).not.toHaveProperty("engines");
  });

  it("refuses a duplicated engine id instead of quietly de-duplicating it", async () => {
    const r = await loadBench({ require: ["marked", "marked"] });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe("SHAPE_REFUSED");
  });

  it("returns failures as values — no throw on any refusal path", async () => {
    await expect(loadBench({ require: ["nope"] })).resolves.toMatchObject({ ok: false });
  });
});
