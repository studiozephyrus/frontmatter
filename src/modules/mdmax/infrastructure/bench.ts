/**
 * THE ENGINE BENCH — the pinned renderers `mdmax cert` measures against. (PLAN §3.3.3, §3.3.7)
 *
 * This is the INFRASTRUCTURE layer: it does IO and spawns a ruby subprocess. Nothing here may be
 * imported from src/app or from any React tree.
 *
 * Three rules from cert-contract.ts are enforced HERE and nowhere else:
 *
 *  - RULE 3, a certificate without the target's FULL option set is a lie. Every engine records the
 *    complete option set it was constructed with, and `benchId` is a sha256 over it. Measured:
 *    `kramdown-parser-gfm` defaults `hard_wrap` ON where Jekyll sets it OFF, and on
 *    `Line one\nLine two` that is `<p>Line one<br />\nLine two</p>` versus `<p>Line one\nLine two</p>`
 *    (reproduced here 2026-08-02, both bytes). Recording `kramdown 2.5.2` alone would have made every
 *    soft line break in every document a false MUTATE.
 *
 *  - RULE 4, a missing engine is a HARD REFUSAL. `loadBench` never returns a shorter engine list than
 *    it was asked for. LR#67: a tool that quietly shrinks its population and reports green is the
 *    same disease as a gate that prints 100% over 23 files.
 *
 *  - The bench id changes when the options change, so a certificate produced under a different
 *    option set is visibly a different bench rather than a silently different one.
 */
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Engine, CertFailure } from "@/modules/mdmax/domain/cert-contract";

// ---------------------------------------------------------------- public shape

export interface BenchOk {
  readonly ok: true;
  readonly engines: Engine[];
  readonly benchId: string;
}

export type BenchResult = BenchOk | CertFailure;

/**
 * Every engine this bench can build, in a fixed order. `markdown-it` appears twice on purpose:
 * at `html:false` it escapes raw HTML to visible text and at `html:true` it passes it through, and
 * that disagreement between two configurations of ONE library is a measured finding, not a setting.
 */
export const BENCH_ENGINE_IDS = [
  "remark-app",
  "react-markdown",
  "marked",
  "markdown-it",
  "markdown-it-html-true",
  "commonmark",
  "kramdown-jekyll",
] as const;

export type BenchEngineId = (typeof BENCH_ENGINE_IDS)[number];

/**
 * Jekyll's nine kramdown options (`lib/jekyll/configuration.rb`), NOT kramdown-parser-gfm's.
 * `hard_wrap: false` is the one that matters — see the file header for the two measured outputs.
 */
export const JEKYLL_KRAMDOWN_OPTIONS = {
  auto_ids: true,
  toc_levels: [1, 2, 3, 4, 5, 6],
  entity_output: "as_char",
  smart_quotes: "lsquo,rsquo,ldquo,rdquo",
  input: "GFM",
  hard_wrap: false,
  guess_lang: true,
  footnote_nr: 1,
  show_warnings: false,
} as const;

/** Overridable because ruby is not at the same path on CI as it is on this Mac. */
const DEFAULT_RUBY_BIN = "/opt/homebrew/opt/ruby/bin/ruby";

function rubyBin(): string {
  return process.env.MDMAX_RUBY_BIN ?? DEFAULT_RUBY_BIN;
}

// ---------------------------------------------------------------- option hashing

/** JSON with object keys sorted at every depth, so two equal option sets hash equal. */
function canonical(value: unknown): string {
  if (typeof value === "function") return JSON.stringify(`[function ${value.name || "anonymous"}]`);
  if (value === undefined) return "null";
  if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "null";
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
    a < b ? -1 : a > b ? 1 : 0,
  );
  return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(",")}}`;
}

/**
 * sha256 over each engine's (id, version, sorted options). Rows are sorted so the id depends on the
 * SET of engines, not on the order they happened to load in.
 *
 * `sha` is deliberately not in the digest: all seven engines here are npm/gem-resolved and carry no
 * pinned upstream commit. Adding a sha-pinned engine (cmark-gfm at 499789b) means extending this.
 */
export function computeBenchId(
  engines: readonly Pick<Engine, "id" | "version" | "options">[],
): string {
  const rows = engines
    .map((e) => `${e.id}\u0000${e.version}\u0000${canonical(e.options)}`)
    .sort();
  return createHash("sha256").update(rows.join("\n"), "utf8").digest("hex");
}

/** Function-valued options are recorded by name; no engine here ships one (verified 2026-08-02). */
function describeOptions(source: Readonly<Record<string, unknown>>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(source)) {
    out[k] = typeof v === "function" ? `[function ${v.name || "anonymous"}]` : v;
  }
  return out;
}

// ---------------------------------------------------------------- version reading

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * Read a package's version off disk rather than through `require('<pkg>/package.json')`: six of the
 * seven engines' packages (commonmark, react-markdown, remark-*, rehype-*) do not export
 * `./package.json`, so the require form throws ERR_PACKAGE_PATH_NOT_EXPORTED. Measured 2026-08-02.
 */
function packageVersion(name: string): string | null {
  let dir = HERE;
  for (;;) {
    const manifest = join(dir, "node_modules", name, "package.json");
    if (existsSync(manifest)) {
      try {
        const parsed: unknown = JSON.parse(readFileSync(manifest, "utf8"));
        const version = (parsed as { version?: unknown }).version;
        return typeof version === "string" ? version : null;
      } catch {
        return null;
      }
    }
    const up = dirname(dir);
    if (up === dir) return null;
    dir = up;
  }
}

function missing(engineId: string, detail: string): CertFailure {
  return { ok: false, reason: "ENGINE_MISSING", engineId, detail: detail.slice(0, 199) };
}

/** A version we cannot read is a certificate we cannot honestly stamp. */
function versionsOf(engineId: string, names: readonly string[]): string[] | CertFailure {
  const out: string[] = [];
  for (const n of names) {
    const v = packageVersion(n);
    if (v === null) return missing(engineId, `cannot read a version for ${n}; not installed here`);
    out.push(v);
  }
  return out;
}

function isFailure(value: unknown): value is CertFailure {
  return typeof value === "object" && value !== null && (value as { ok?: unknown }).ok === false;
}

// ---------------------------------------------------------------- kramdown via ruby

const KRAMDOWN_VERSION_SCRIPT = `
require 'json'
require 'kramdown'
require 'kramdown-parser-gfm'
g = Gem.loaded_specs['kramdown-parser-gfm']
$stdout.write(JSON.generate({'kramdown' => Kramdown::VERSION, 'gfm' => (g ? g.version.to_s : '')}))
`;

const KRAMDOWN_RENDER_SCRIPT = `
require 'json'
require 'kramdown'
require 'kramdown-parser-gfm'
opts = {}
JSON.parse(ARGV[0]).each { |k, v| opts[k.to_sym] = v }
src = $stdin.binmode.read.force_encoding('UTF-8')
$stdout.binmode.write(Kramdown::Document.new(src, **opts).to_html)
`;

/**
 * Jekyll strips YAML front matter BEFORE kramdown ever sees the file, so the engine that stands in
 * for github-pages must strip it too — otherwise front matter would score CORRUPT/LEAK on a surface
 * where it is measurably invisible.
 *
 * Mirrors Jekyll's own `YAML_FRONT_MATTER_REGEXP`: the file must OPEN with `---`, and an unterminated
 * block is not front matter at all — it is content.
 */
export function stripJekyllFrontMatter(source: string): string {
  if (!/^---[ \t]*\r?\n/.test(source)) return source;
  const lines = source.split("\n");
  for (let i = 1; i < lines.length; i++) {
    if (/^(---|\.\.\.)[ \t]*\r?$/.test(lines[i] ?? "")) return lines.slice(i + 1).join("\n");
  }
  return source;
}

function runRuby(args: readonly string[], input?: string): { out: string; err: string } | Error {
  const r = spawnSync(rubyBin(), [...args], {
    input: input === undefined ? undefined : Buffer.from(input, "utf8"),
    timeout: 30_000,
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.error) return r.error;
  const out = r.stdout ? r.stdout.toString("utf8") : "";
  const err = r.stderr ? r.stderr.toString("utf8") : "";
  if (r.status !== 0) return new Error(`ruby exited ${r.status ?? "on a signal"}: ${err.trim()}`);
  return { out, err };
}

async function buildKramdownJekyll(): Promise<Engine | CertFailure> {
  const id = "kramdown-jekyll";
  const probe = runRuby(["-e", KRAMDOWN_VERSION_SCRIPT]);
  if (probe instanceof Error) return missing(id, `${rubyBin()}: ${probe.message}`);

  let versions: { kramdown?: unknown; gfm?: unknown };
  try {
    versions = JSON.parse(probe.out) as { kramdown?: unknown; gfm?: unknown };
  } catch {
    return missing(id, `ruby produced no version JSON: ${probe.out.slice(0, 80)}`);
  }
  const kramdown = versions.kramdown;
  const gfm = versions.gfm;
  if (typeof kramdown !== "string" || kramdown === "") {
    return missing(id, "kramdown loaded but reported no version");
  }
  if (typeof gfm !== "string" || gfm === "") {
    return missing(id, "kramdown-parser-gfm reported no version; input:GFM would be a guess");
  }

  const optionsJson = JSON.stringify(JEKYLL_KRAMDOWN_OPTIONS);
  return {
    id,
    name: "kramdown (Jekyll / GitHub Pages configuration)",
    version: `kramdown@${kramdown}+kramdown-parser-gfm@${gfm}`,
    options: {
      ...JEKYLL_KRAMDOWN_OPTIONS,
      // Output-affecting and therefore hashed. The ruby BINARY PATH is deliberately absent: it is
      // environment, and putting it here would make benchId differ between two identical benches.
      prePipeline: ["jekyll-strip-front-matter"],
    },
    render: (markdown: string) => {
      const r = runRuby(["-e", KRAMDOWN_RENDER_SCRIPT, "--", optionsJson], stripJekyllFrontMatter(markdown));
      if (r instanceof Error) throw new Error(`kramdown-jekyll: ${r.message}`.slice(0, 199));
      return r.out;
    },
  };
}

// ---------------------------------------------------------------- javascript engines

/**
 * The app's own preview pipeline. (`src/modules/preview/presentation/Markdown.tsx`)
 *
 * THIS WAS WRONG FIRST, AND IT WAS THE WORST KIND OF WRONG. The engine was named "the app's own
 * remark pipeline" and backed the `frontmatter-app` target while sharing **2 of the app's 9
 * plugins**. Four of four probes diverged from the real component:
 *
 *   "Line one\nLine two"          bench `<p>Line one\nLine two</p>`   app `<p>Line one<br/>…`
 *   "---\ntitle: T\n---\n\n# Body" bench `<hr><h2>title: T</h2>…`      app `<h1 id="body">Body</h1>`
 *   "inline $x^2$ here"            bench literal `$x^2$`               app KaTeX markup
 *   "# My Heading"                 bench `<h1>`                        app `<h1 id="my-heading">`
 *
 * The file's own header explains that `hard_wrap` ON would make every soft line break a false
 * MUTATE, and pins kramdown to `hard_wrap: false` accordingly — and `remark-breaks` IS hard_wrap.
 * The bench modelled the FOREIGN renderer correctly and its own product without it, so every soft
 * line break was a false PASS on `frontmatter-app` and front matter scored LEAK on a surface where
 * `remark-frontmatter` measurably consumes it.
 *
 * The plugin list below is now read from the same order the component uses. What is still NOT
 * replicated is recorded in `options.notReplicated` rather than left implied: the React component
 * mapping, `disallowedElements`, and the content-dependent HTML policy. A certificate that omits
 * the option set is a lie (rule 3); one that omits which options it could not honour is the same
 * lie told more quietly.
 */
async function buildRemarkApp(): Promise<Engine | CertFailure> {
  const id = "remark-app";
  const names = [
    "remark-parse",
    "remark-frontmatter",
    "remark-gfm",
    "remark-breaks",
    "remark-math",
    "remark-rehype",
    "rehype-raw",
    "rehype-slug",
    "rehype-stringify",
  ] as const;
  const versions = versionsOf(id, names);
  if (isFailure(versions)) return versions;

  try {
    const [{ unified }, parse, frontmatter, gfm, breaks, math, rehype, raw, slug, stringify] =
      await Promise.all([
        import("unified"),
        import("remark-parse"),
        import("remark-frontmatter"),
        import("remark-gfm"),
        import("remark-breaks"),
        import("remark-math"),
        import("remark-rehype"),
        import("rehype-raw"),
        import("rehype-slug"),
        import("rehype-stringify"),
      ]);
    const processor = unified()
      .use(parse.default)
      // Order matters and mirrors Markdown.tsx: remarkFrontmatter, remarkGfm, remarkBreaks,
      // remarkMath, then rehypeRaw … rehypeSlug.
      .use(frontmatter.default)
      .use(gfm.default)
      .use(breaks.default)
      .use(math.default)
      .use(rehype.default, { allowDangerousHtml: true })
      .use(raw.default)
      .use(slug.default)
      .use(stringify.default);

    return {
      id,
      name: "the app's own preview pipeline (Markdown.tsx)",
      version: names.map((n, i) => `${n}@${versions[i]}`).join("+"),
      options: {
        pipeline: [...names],
        "remark-rehype": { allowDangerousHtml: true },
        unified: packageVersion("unified") ?? "unknown",
        // Stated, not implied. These change the app's output and are not modelled here, so a
        // verdict on `frontmatter-app` is structural and does not cover them.
        notReplicated: [
          "React component mapping (components={…})",
          "disallowedElements=DISALLOWED_RAW_HTML_ELEMENT_LIST",
          "createRehypeHtmlPolicy(content) — content-dependent sanitiser",
          "rehype-katex (math is parsed by remark-math but not rendered to KaTeX markup)",
          "rehype-highlight (syntax highlighting classes)",
        ],
      },
      render: (markdown: string) => String(processor.processSync(markdown)),
    };
  } catch (e) {
    return missing(id, e instanceof Error ? e.message : String(e));
  }
}

async function buildReactMarkdown(): Promise<Engine | CertFailure> {
  const id = "react-markdown";
  const versions = versionsOf(id, ["react-markdown", "react-dom"]);
  if (isFailure(versions)) return versions;

  try {
    const [react, server, rm] = await Promise.all([
      import("react"),
      import("react-dom/server"),
      import("react-markdown"),
    ]);
    const Markdown = rm.default;
    return {
      id,
      name: "react-markdown at its own defaults",
      version: versions[0] ?? "",
      options: {
        // The whole option surface of react-markdown 10, at its defaults. The load-bearing entry is
        // the ABSENCE of rehype-raw: raw HTML is escaped to visible text here and passed through by
        // remark-app, which is a measured divergence between two pipelines built on the same parser.
        remarkPlugins: [],
        rehypePlugins: [],
        remarkRehypeOptions: {},
        skipHtml: false,
        unwrapDisallowed: false,
        allowedElements: null,
        disallowedElements: null,
        components: null,
        urlTransform: "defaultUrlTransform",
        // React's own serializer is part of the output contract, so it is hashed.
        renderer: "react-dom/server renderToStaticMarkup",
        "react-dom": versions[1] ?? "",
      },
      render: (markdown: string) =>
        server.renderToStaticMarkup(react.createElement(Markdown, null, markdown)),
    };
  } catch (e) {
    return missing(id, e instanceof Error ? e.message : String(e));
  }
}

async function buildMarked(): Promise<Engine | CertFailure> {
  const id = "marked";
  const versions = versionsOf(id, ["marked"]);
  if (isFailure(versions)) return versions;

  try {
    const { marked } = await import("marked");
    return {
      id,
      name: "marked at its defaults",
      version: versions[0] ?? "",
      // Read off the library rather than transcribed, so the record cannot drift from the engine.
      options: describeOptions(marked.getDefaults() as unknown as Record<string, unknown>),
      render: (markdown: string) => marked.parse(markdown),
    };
  } catch (e) {
    return missing(id, e instanceof Error ? e.message : String(e));
  }
}

async function buildMarkdownIt(id: string, html: boolean): Promise<Engine | CertFailure> {
  const versions = versionsOf(id, ["markdown-it"]);
  if (isFailure(versions)) return versions;

  try {
    const { default: MarkdownIt } = await import("markdown-it");
    const md = new MarkdownIt({ html });
    return {
      id,
      name: `markdown-it (html: ${html})`,
      version: versions[0] ?? "",
      // md.options is markdown-it's own resolved option object — the full set, not a summary.
      options: { preset: "default", ...describeOptions(md.options as unknown as Record<string, unknown>) },
      render: (markdown: string) => md.render(markdown),
    };
  } catch (e) {
    return missing(id, e instanceof Error ? e.message : String(e));
  }
}

/** The slice of commonmark 0.31.2's API this bench uses. */
interface CommonmarkModule {
  readonly Parser: new (options?: Record<string, unknown>) => { parse(source: string): unknown };
  readonly HtmlRenderer: new (options?: Record<string, unknown>) => { render(node: unknown): string };
}

async function buildCommonmark(): Promise<Engine | CertFailure> {
  const id = "commonmark";
  const versions = versionsOf(id, ["commonmark"]);
  if (isFailure(versions)) return versions;

  try {
    // commonmark 0.31.2 ships no type declarations, and installing @types/commonmark is a dependency
    // change this component is not authorised to make. The two constructors used below are pinned by
    // the local CommonmarkModule shape and exercised by the tests.
    // @ts-expect-error untyped module — see the note above.
    const loaded: unknown = await import("commonmark");
    const commonmark = loaded as CommonmarkModule;
    // Passed IN explicitly rather than left to defaults, so the options recorded on the certificate
    // are provably the options the engine ran under.
    const parserOptions = { smart: false, time: false };
    const rendererOptions = { softbreak: "\n", safe: false, sourcepos: false };
    const parser = new commonmark.Parser(parserOptions);
    const writer = new commonmark.HtmlRenderer(rendererOptions);
    return {
      id,
      name: "commonmark.js — the spec oracle",
      version: versions[0] ?? "",
      options: { role: "spec-oracle", parser: parserOptions, renderer: rendererOptions },
      render: (markdown: string) => writer.render(parser.parse(markdown)),
    };
  } catch (e) {
    return missing(id, e instanceof Error ? e.message : String(e));
  }
}

function buildOne(id: BenchEngineId): Promise<Engine | CertFailure> {
  switch (id) {
    case "remark-app":
      return buildRemarkApp();
    case "react-markdown":
      return buildReactMarkdown();
    case "marked":
      return buildMarked();
    case "markdown-it":
      return buildMarkdownIt("markdown-it", false);
    case "markdown-it-html-true":
      return buildMarkdownIt("markdown-it-html-true", true);
    case "commonmark":
      return buildCommonmark();
    case "kramdown-jekyll":
      return buildKramdownJekyll();
  }
}

// ---------------------------------------------------------------- the entry point

/**
 * Build the bench.
 *
 * `opts.require` names the engines that MUST load; omit it for all seven. Either every requested
 * engine loads or the whole call refuses — there is no path through this function that returns a
 * shorter list than it was asked for.
 */
export async function loadBench(opts?: { require?: string[] }): Promise<BenchResult> {
  const requested = opts?.require;
  let ids: BenchEngineId[];

  if (requested === undefined) {
    ids = [...BENCH_ENGINE_IDS];
  } else {
    if (requested.length === 0) {
      return {
        ok: false,
        reason: "SHAPE_REFUSED",
        detail: "require was empty; a bench with no engines certifies nothing",
      };
    }
    const seen = new Set<string>();
    for (const id of requested) {
      if (seen.has(id)) {
        return {
          ok: false,
          reason: "SHAPE_REFUSED",
          detail: `engine "${id}" was requested twice; say what you want once`.slice(0, 199),
        };
      }
      seen.add(id);
    }
    const unknown = requested.find((id) => !BENCH_ENGINE_IDS.includes(id as BenchEngineId));
    if (unknown !== undefined) {
      return missing(
        unknown,
        `no such engine. This bench builds: ${BENCH_ENGINE_IDS.join(", ")}`,
      );
    }
    // Registry order, not caller order, so `require` cannot change the engine sequence.
    ids = BENCH_ENGINE_IDS.filter((id) => seen.has(id));
  }

  const engines: Engine[] = [];
  for (const id of ids) {
    const built = await buildOne(id);
    if (isFailure(built)) return built;
    engines.push(built);
  }

  return { ok: true, engines, benchId: computeBenchId(engines) };
}
