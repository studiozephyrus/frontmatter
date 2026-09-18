/**
 * gen-api-reference.mjs - generates docs/pack/22-API-REFERENCE.md from the source tree.
 *
 * A hand-written API reference is wrong within a week. This one is read out of
 * `src/app/**\/route.ts` every time it is run, so it is wrong only if the source is.
 *
 * What it extracts, and how:
 *   route          the directory path under src/app, with route groups "(name)" stripped
 *   methods        `export async function GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS`
 *                  and the re-export form `export const { GET, POST } = handlers`
 *   summary        the file's leading block comment, dashes normalised (see below)
 *   flags          `export const dynamic | revalidate | runtime | maxDuration | dynamicParams`
 *   auth           a `getActor()` call, an `auth()` call, or nothing found
 *   query          every `searchParams.get("...")`
 *   segments       `[name]` and `[...name]` in the route path
 *   body           zod schemas reached by `.safeParse(`, plus inline `await req.json() as {...}`
 *   responses      every `status: NNN`, paired with the nearest preceding `error: "..."`
 *   effects        `container.X(`, `shareApi.X(`, `revalidatePath(`, `redirect(`
 *
 * Every field is a textual read of the file. It is a PROXY for behaviour, not a
 * test of it: a status code that appears in a branch that can never run is still
 * listed here. Treat the table as the contract the source claims, and the test
 * suite as the evidence that it holds.
 *
 * Dash normalisation: the repository's writing gate forbids em dashes and en
 * dashes, and several route comments contain them. A spaced dash becomes a
 * comma, an unspaced one becomes a plain hyphen. Nothing else in the comment is
 * changed.
 *
 * Zero dependencies. Node only.
 *
 * Run:    node docs/pack/tools/gen-api-reference.mjs > docs/pack/22-API-REFERENCE.md
 * Check:  node docs/pack/tools/gen-api-reference.mjs --check   (non-zero if stale)
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, relative, sep } from "node:path";

const ROOT = "src/app";
const OUT = "docs/pack/22-API-REFERENCE.md";
const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

// ---------------------------------------------------------------- utilities

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir).sort()) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (entry === "route.ts") out.push(full);
  }
  return out;
}

function routePath(file) {
  const parts = relative(ROOT, file)
    .split(sep)
    .slice(0, -1)
    .filter((p) => !p.startsWith("("));
  return `/${parts.join("/")}`.replace(/\/+/g, "/");
}

/** Strip the dashes the writing gate forbids, without touching anything else. */
function plainDashes(s) {
  // Escapes, not literals, so this file itself carries none of the characters it strips.
  return s.replace(/\s+[\u2014\u2013]\s+/g, ", ").replace(/[\u2014\u2013]/g, "-");
}

/** Collapse to one line and make it safe inside a markdown table cell. */
function cell(s) {
  const t = plainDashes(String(s)).replace(/\s+/g, " ").replace(/\|/g, "\\|").trim();
  return t.length ? t : "none";
}

/** A table row always ends in a full stop so each row reads as its own sentence. */
function row(cells) {
  const line = cells.join(" | ").replace(/\s+$/, "");
  return /[.:]$/.test(line) ? line : `${line}.`;
}

function uniq(a) {
  return [...new Set(a)];
}

/** The glance table wants `container.getFile`, not the specifier after it. */
function shortEffects(effects) {
  return uniq(effects.map((e) => e.replace(/\s+from\s+`[^`]+`/, "")));
}

/** Effects reached from a module or the shared kernel rather than the container. */
function bypasses(effects) {
  return effects.filter((e) => /from `@\/(modules|shared)/.test(e));
}

// ------------------------------------------------------------- extraction

function leadingComment(src) {
  const m = /^\s*\/\*\*([\s\S]*?)\*\//.exec(src);
  if (!m) return "";
  return m[1]
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, "").trimEnd())
    .join("\n")
    .trim();
}

function methodsOf(src) {
  const found = [];
  for (const m of METHODS) {
    if (new RegExp(`export\\s+(?:async\\s+)?function\\s+${m}\\b`).test(src)) found.push(m);
  }
  const reexport = /export\s+const\s*\{([^}]*)\}\s*=/.exec(src);
  if (reexport) {
    for (const name of reexport[1].split(",").map((s) => s.trim())) {
      if (METHODS.includes(name) && !found.includes(name)) found.push(name);
    }
  }
  return found.sort((a, b) => METHODS.indexOf(a) - METHODS.indexOf(b));
}

function flagsOf(src) {
  const out = [];
  const re = /export\s+const\s+(dynamic|revalidate|runtime|maxDuration|dynamicParams|fetchCache)\s*=\s*([^;\n]+)/g;
  let m;
  while ((m = re.exec(src)) !== null) out.push(`${m[1]} = ${m[2].trim()}`);
  return out;
}

function authOf(src) {
  if (/\bgetActor\s*\(/.test(src)) return "session, `getActor()`";
  if (/\bhandlers\b/.test(src) && /@\/auth/.test(src)) return "Auth.js owns it";
  if (/\bauth\s*\(\s*\)/.test(src)) return "session, `auth()`";
  return "**none found in the file**";
}

function queryOf(src) {
  const out = [];
  const re = /searchParams\.get\(\s*["'`]([^"'`]+)["'`]\s*\)/g;
  let m;
  while ((m = re.exec(src)) !== null) out.push(m[1]);
  return uniq(out);
}

function segmentsOf(route) {
  return (route.match(/\[[^\]]+\]/g) ?? []).map((s) => s.replace(/[[\]]/g, ""));
}

/** Schema names that actually reach a `.safeParse(` or `.parse(` call, with their source. */
function bodyOf(src) {
  const used = new Set();
  const re = /(\w+)\s*\.\s*(?:safeParse|parse)\s*\(/g;
  let m;
  while ((m = re.exec(src)) !== null) used.add(m[1]);

  const schemas = [];
  for (const name of used) {
    const decl = new RegExp(`const\\s+${name}\\s*=\\s*([\\s\\S]*?);\\n`).exec(src);
    if (decl) schemas.push({ name, source: decl[1].replace(/\s+/g, " ").trim() });
  }

  const inline = [];
  const ire = /await\s+req\.json\(\)\)?\s*as\s*(\{[^}]*\})/g;
  while ((m = ire.exec(src)) !== null) inline.push(m[1].replace(/\s+/g, " ").trim());

  const readsJson = /req\.json\s*\(/.test(src);
  const readsFormData = /req\.formData\s*\(/.test(src);
  return { schemas, inline, readsJson, readsFormData };
}

/** Every `status: NNN`, labelled with the nearest `error: "..."` before it. */
function responsesOf(src) {
  const out = [];
  const re = /status:\s*(\d{3})/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    // Scope the lookbehind to the current `return` statement. A 400-character
    // window leaked the error code of the PREVIOUS branch onto every success
    // path, so the first run of this generator reported "200 bad_request".
    const start = Math.max(src.lastIndexOf("return", m.index), src.lastIndexOf("new Response", m.index), src.lastIndexOf("NextResponse", m.index));
    const before = src.slice(start < 0 ? m.index : start, m.index);
    const err = [...before.matchAll(/error:\s*["'`]([^"'`]+)["'`]/g)].pop();
    out.push({ status: m[1], code: err ? err[1] : "" });
  }
  const seen = new Map();
  for (const r of out) {
    const key = `${r.status}:${r.code}`;
    if (!seen.has(key)) seen.set(key, r);
  }
  // A 200 with no explicit `status:` is common; note it when the file returns
  // a bare NextResponse.json or Response with no status.
  if (/NextResponse\.json\(\s*[^,)]*\s*\)/.test(src) && !out.some((r) => r.status === "200")) {
    seen.set("200:", { status: "200", code: "implicit" });
  }
  return [...seen.values()].sort((a, b) => a.status.localeCompare(b.status));
}

/**
 * Local bindings imported from the composition root, a module or the shared
 * kernel, mapped to the specifier they came from. Aliases matter: one route
 * imports `container as dependencyContainer`, and a regex fixed on the word
 * "container" missed every call it makes.
 */
function importsOf(src) {
  const map = new Map();
  const re = /import\s+(?:type\s+)?(?:\{([^}]*)\}|(\w+))\s+from\s+["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const spec = m[3];
    if (!/^@\/(container|modules|shared)/.test(spec)) continue;
    if (m[2]) {
      map.set(m[2], spec);
      continue;
    }
    for (const part of m[1].split(",")) {
      const t = part.trim();
      if (!t || t.startsWith("type ")) continue;
      const as = /^(\w+)\s+as\s+(\w+)$/.exec(t);
      map.set(as ? as[2] : t, spec);
    }
  }
  return map;
}

function effectsOf(src) {
  const out = [];
  const imported = importsOf(src);
  for (const [local, spec] of imported) {
    if (local === "getActor") continue; // reported in the Auth column instead
    const dotted = new RegExp(`\\b${local}\\.(\\w+)\\s*\\(`, "g");
    let m;
    let sawDotted = false;
    while ((m = dotted.exec(src)) !== null) {
      sawDotted = true;
      out.push(`\`${local}.${m[1]}\` from \`${spec}\``);
    }
    if (!sawDotted && new RegExp(`\\b${local}\\s*\\(`).test(src)) {
      out.push(`\`${local}()\` from \`${spec}\``);
    }
  }
  if (/revalidatePath\s*\(/.test(src)) out.push("`revalidatePath`");
  if (/revalidateTag\s*\(/.test(src)) out.push("`revalidateTag`");
  if (/\bredirect\s*\(/.test(src)) out.push("`redirect`");
  return uniq(out);
}

function describe(file) {
  const src = readFileSync(file, "utf8");
  const route = routePath(file);
  return {
    file,
    route,
    methods: methodsOf(src),
    summary: leadingComment(src),
    flags: flagsOf(src),
    auth: authOf(src),
    query: queryOf(src),
    segments: segmentsOf(route),
    body: bodyOf(src),
    responses: responsesOf(src),
    effects: effectsOf(src),
    lines: src.split("\n").length,
  };
}

// ---------------------------------------------------------------- rendering

function firstSentence(summary) {
  if (!summary) return "";
  const body = summary
    .split("\n")
    .filter((l) => !new RegExp(`^(?:${METHODS.join("|")})\\s`).test(l.trim()))
    .join(" ")
    .trim();
  const m = /^(.*?[.!?])(\s|$)/.exec(body);
  return (m ? m[1] : body).trim();
}

function render(routes, meta) {
  const L = [];
  const p = (s = "") => L.push(s);

  p("---");
  p("id: 22-API-REFERENCE");
  p("title: API reference");
  p("mode: reference");
  p("tier: derived");
  p("status: living");
  p(`updated: ${meta.date}`);
  p("owner: sagnik");
  p("generated_by: node docs/pack/tools/gen-api-reference.mjs > docs/pack/22-API-REFERENCE.md");
  p(`verified_against: ${meta.commit}`);
  p("covers: [api, routes, handlers]");
  p("---");
  p();
  p("# 22. API reference");
  p();
  p("**This file is generated. Do not edit it.** Every edit is lost the next time the command in");
  p("the `generated_by` key runs. To change a row, change the route handler it came from.");
  p();
  p("```");
  p("node docs/pack/tools/gen-api-reference.mjs > docs/pack/22-API-REFERENCE.md");
  p("node docs/pack/tools/gen-api-reference.mjs --check   # non-zero when this file is stale");
  p("```");
  p();
  p(`Read out of \`${ROOT}\` at commit \`${meta.commit}\` on ${meta.date}.`);
  p(`**${routes.length} route files, ${meta.handlerCount} handlers.**`);
  p();
  p("**What the generator can and cannot tell you.** It reads the source text. A status code that");
  p("appears in an unreachable branch is still listed, and a side effect hidden behind an indirection");
  p("is not. The table is the contract the source claims. `npm run test` is the evidence it holds.");
  p();

  p("## 22.1 Every route, at a glance");
  p();
  p("Route | Methods | Auth | Runtime flags | Side effects");
  for (const r of routes) {
    p(row([
      `\`${r.route}\``,
      r.methods.length ? r.methods.join(", ") : "none exported",
      r.auth,
      r.flags.length ? r.flags.map((f) => `\`${f}\``).join(", ") : "defaults",
      r.effects.length ? shortEffects(r.effects).join(", ") : "none detected",
    ]));
  }
  p();

  p("## 22.2 Routes that reach past the composition root");
  p();
  p("`AGENTS.md:96` says app routes never import infrastructure directly and go through");
  p("`src/container/dependency-container.ts`. These routes call something imported from a module or");
  p("the shared kernel instead. A pure helper is fine. A gateway or an adapter is a finding.");
  p();
  const bp = routes.filter((r) => bypasses(r.effects).length);
  if (!bp.length) {
    p("**None.** Every route reaches the outside world through the container.");
  } else {
    p("Route | What it calls directly");
    for (const r of bp) p(row([`\`${r.route}\``, bypasses(r.effects).join(", ")]));
  }
  p();

  p("## 22.3 Status codes across the surface");
  p();
  const tally = new Map();
  for (const r of routes) {
    for (const s of r.responses) {
      const k = `${s.status} ${s.code}`.trim();
      tally.set(k, (tally.get(k) ?? 0) + 1);
    }
  }
  p("Status and code | Routes that return it");
  for (const [k, n] of [...tally.entries()].sort()) p(row([`\`${k}\``, String(n)]));
  p();

  p("## 22.4 Each route in full");
  p();

  for (const r of routes) {
    p(`### ${r.methods.join(", ") || "no method"} \`${r.route}\``);
    p();
    p(`\`${r.file}\`, ${r.lines} lines.`);
    p();
    const s = firstSentence(r.summary);
    if (s) {
      p(cell(s));
      p();
    }

    p("Property | Value");
    p(row(["Methods", r.methods.length ? r.methods.join(", ") : "none exported"]));
    p(row(["Auth", r.auth]));
    p(row(["Path segments", r.segments.length ? r.segments.map((x) => `\`${x}\``).join(", ") : "none"]));
    p(row(["Query parameters", r.query.length ? r.query.map((x) => `\`${x}\``).join(", ") : "none"]));
    p(row(["Reads a JSON body", r.body.readsJson ? "yes" : "no"]));
    p(row(["Reads form data", r.body.readsFormData ? "yes" : "no"]));
    p(row(["Runtime flags", r.flags.length ? r.flags.map((f) => `\`${f}\``).join(", ") : "defaults"]));
    p(row(["Side effects", r.effects.length ? r.effects.join(", ") : "none detected"]));
    p(row(["Reaches past the container", bypasses(r.effects).length ? bypasses(r.effects).join(", ") : "no"]));
    p();

    if (r.body.schemas.length || r.body.inline.length) {
      p("**Body, as the handler validates it.**");
      p();
      p("```ts");
      for (const sc of r.body.schemas) p(`const ${sc.name} = ${sc.source};`);
      for (const inl of r.body.inline) p(`await req.json() as ${inl}`);
      p("```");
      p();
    }

    if (r.responses.length) {
      p("Status | Error code in the body");
      for (const resp of r.responses) {
        p(row([`\`${resp.status}\``, resp.code ? `\`${resp.code}\`` : "no error code, this is a success path"]));
      }
      p();
    }

    if (r.summary) {
      p("<details><summary>The handler's own comment, verbatim apart from dashes</summary>");
      p();
      p("```");
      p(plainDashes(r.summary));
      p("```");
      p();
      p("</details>");
      p();
    }
  }

  p("## 22.5 Limits of this file");
  p();
  p("- **What was not assessed.** Behaviour. Nothing here was executed. Every field is a read of the");
  p("  source text, which makes each one a proxy for the thing it describes.");
  p("- **What could not be verified.** Whether a listed status is reachable, and whether a route");
  p("  enforces the auth it appears to. The proxy in `src/proxy.ts` does not gate `/api/*`, by design,");
  p("  so each handler gates itself. A route whose Auth column says none found is a finding.");
  p("- **What is not established.** Rate limits, quotas and entitlement checks. None is in the handlers");
  p("  at this commit.");
  p("- **What would falsify this file.** `node docs/pack/tools/gen-api-reference.mjs --check` exiting");
  p("  non-zero, which means the source moved and this file did not.");
  p();

  return L.join("\n") + "\n";
}

// -------------------------------------------------------------------- main

const files = walk(ROOT);
const routes = files.map(describe).sort((a, b) => a.route.localeCompare(b.route));
const handlerCount = routes.reduce((n, r) => n + r.methods.length, 0);

let commit = "unknown";
try {
  // execFileSync, not execSync: no shell, and the argument list is fixed.
  commit = execFileSync("git", ["rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();
} catch {
  /* not a git checkout, leave it unknown */
}
const date = new Date().toISOString().slice(0, 10);

const markdown = render(routes, { commit, date, handlerCount });

if (process.argv.includes("--check")) {
  if (!existsSync(OUT)) {
    console.error(`STALE: ${OUT} does not exist. Run the generator.`);
    process.exit(1);
  }
  // The commit and date lines move on every run, so compare everything else.
  const drop = (s) =>
    s
      .split("\n")
      .filter((l) => !/^(updated|verified_against):/.test(l) && !/^Read out of/.test(l))
      .join("\n");
  if (drop(readFileSync(OUT, "utf8")) !== drop(markdown)) {
    console.error(`STALE: ${OUT} does not match ${ROOT}. Run the generator.`);
    process.exit(1);
  }
  console.log(`FRESH: ${OUT} matches ${ROOT} (${routes.length} routes, ${handlerCount} handlers).`);
  process.exit(0);
}

process.stdout.write(markdown);
