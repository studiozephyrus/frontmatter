// Render docs/MVP-PLAN-2026-09-13.md into one self-contained page for the Artifact.
// The markdown file stays the source; this only dresses it. Fonts are the decisions site's own
// inlined faces (Google Sans, Google Sans Code, Mosvita), so nothing loads from a font CDN.
import fs from 'node:fs';
import { createRequire } from 'node:module';
const REPO = '/Users/sagnikmitra/Desktop/GitHub/frontmatter';
const require = createRequire(REPO + '/package.json');
const { marked } = require('marked');

const OUT = process.argv[2];
let md = fs.readFileSync(`${REPO}/docs/MVP-PLAN-2026-09-13.md`, 'utf8');
md = md.replace(/^---\n[\s\S]*?\n---\n/, '');           // YAML block: metadata, not reading matter
md = md.replace(/^\s*# .*\n+Version 1[^\n]*\n[^\n]*\n[^\n]*\n/, ''); // title + byline: set in the header instead

marked.setOptions({ gfm: true });
let body = marked.parse(md);

// Section ids and the side list. Sections are numbered in the source because the text refers to
// them by number ("section 6"), so the numbers carry information and stay.
const toc = [];
body = body.replace(/<h2>(.*?)<\/h2>/g, (_, t) => {
  const plain = t.replace(/<[^>]+>/g, '');
  const m = plain.match(/^(\d+)\.\s*(.*)$/);
  const id = m ? `s${m[1]}` : plain.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  toc.push({ id, n: m ? m[1] : '', t: m ? m[2] : plain });
  return `<h2 id="${id}">${m ? `<span class="sn">${m[1]}</span>` : ''}${m ? m[2] : plain}</h2>`;
});
body = body.replace(/<table>/g, '<div class="tbl"><table>').replace(/<\/table>/g, '</table></div>');
body = body.replace(/<td>([SML])<\/td>/g, '<td><span class="size s-$1">$1</span></td>');
// The scope table's four headings are four states; mark them so they read at a glance.
body = body.replace('<th>In the MVP</th>', '<th class="st-in">In the MVP</th>')
  .replace('<th>Beta during the pilot, only if it earns it</th>', '<th class="st-beta">Beta during the pilot, only if it earns it</th>')
  .replace('<th>After the pilot</th>', '<th class="st-after">After the pilot</th>')
  .replace('<th>Not now</th>', '<th class="st-no">Not now</th>');
body = body.replace(/<pre><code class="language-text">/, '<figure class="prompt"><figcaption>Kickoff prompt, as the user copies it</figcaption><pre><code>')
  .replace(/(<figure class="prompt">[\s\S]*?<\/code><\/pre>)/, '$1</figure>');

const fonts = fs.readFileSync(`${REPO}/decisions/fonts.css`, 'utf8');
const nav = toc.map((s) => `<a href="#${s.id}">${s.n ? `<span class="tn">${s.n}</span>` : ''}${s.t}</a>`).join('');

const html = `<title>frontmatter MVP Plan</title>
<meta name="description" content="The reset: a bare-bones editor as the MVP and a document-kit generator as the funnel, with the development plan and the decisions still open.">
<style>
${fonts}
:root{
  --ground:#f8f9fb; --paper:#ffffff; --well:#eef1f6;
  --ink:#0c1017; --ink-2:#39414f; --ink-3:#6b7382; --line:#e3e7ee; --line-2:#cfd5df;
  --accent:#1a5cff; --accent-ink:#0b3ec9; --accent-soft:#e9f0ff;
  --beta:#b8791b; --beta-soft:#fcf3e3; --muted-soft:#f0f2f6;
  --sans:"Google Sans",ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --mono:"Google Sans Code",ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  --display:"Mosvita","Google Sans",ui-sans-serif,system-ui,sans-serif;
}
@media (prefers-color-scheme: dark){ :root:not([data-theme="light"]){
  --ground:#080a0e; --paper:#10141c; --well:#161b25;
  --ink:#eaeef5; --ink-2:#b3bbc9; --ink-3:#848c9a; --line:#232935; --line-2:#2f3745;
  --accent:#6f9bff; --accent-ink:#a9c3ff; --accent-soft:#131d33;
  --beta:#e0a63f; --beta-soft:#2a2011; --muted-soft:#171c26; } }
:root[data-theme="dark"]{
  --ground:#080a0e; --paper:#10141c; --well:#161b25;
  --ink:#eaeef5; --ink-2:#b3bbc9; --ink-3:#848c9a; --line:#232935; --line-2:#2f3745;
  --accent:#6f9bff; --accent-ink:#a9c3ff; --accent-soft:#131d33;
  --beta:#e0a63f; --beta-soft:#2a2011; --muted-soft:#171c26; }
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:24px}
@media (prefers-reduced-motion: reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--ground);color:var(--ink);font:400 16px/1.65 var(--sans);-webkit-font-smoothing:antialiased}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline;text-underline-offset:3px}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px;border-radius:2px}
.wrap{max-width:1180px;margin:0 auto;padding:0 28px;display:grid;grid-template-columns:230px minmax(0,1fr);gap:56px}
header.top{grid-column:1 / -1;padding:52px 0 30px;border-bottom:1px solid var(--line);margin-bottom:8px}
.eyebrow{font:500 11px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3)}
h1{font:700 clamp(34px,4.6vw,52px)/1.05 var(--display);letter-spacing:-.02em;margin:14px 0 14px;text-wrap:balance}
.by{color:var(--ink-2);font-size:15px;margin:0;max-width:62ch}
.by b{color:var(--ink);font-weight:600}
.glance{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:0;margin:28px 0 0;border:1px solid var(--line);background:var(--paper)}
.glance div{padding:14px 16px;border-right:1px solid var(--line)}
.glance div:last-child{border-right:0}
.glance dt{font:500 10.5px/1.2 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3);margin-bottom:6px}
.glance dd{margin:0;font-size:14.5px;line-height:1.45;color:var(--ink)}
nav.toc{position:sticky;top:24px;align-self:start;padding:26px 0;font-size:13.5px}
nav.toc .eyebrow{display:block;margin-bottom:12px}
nav.toc a{display:grid;grid-template-columns:22px 1fr;gap:4px;padding:5px 0;color:var(--ink-2);line-height:1.35}
nav.toc a:hover{color:var(--accent);text-decoration:none}
nav.toc .tn{font:500 11.5px/1.6 var(--mono);color:var(--ink-3);font-variant-numeric:tabular-nums}
main{padding:18px 0 90px;min-width:0}
main > p, main > ul, main > ol{max-width:68ch}
h2{font:700 25px/1.2 var(--display);letter-spacing:-.01em;margin:58px 0 16px;padding-top:22px;border-top:1px solid var(--line);text-wrap:balance;display:flex;gap:14px;align-items:baseline}
h2 .sn{font:500 13px/1 var(--mono);color:var(--accent);min-width:22px;font-variant-numeric:tabular-nums}
main > h2:first-child{margin-top:18px}
h3{font:600 17px/1.35 var(--sans);margin:30px 0 8px;text-wrap:balance}
p{margin:0 0 14px}
ul,ol{margin:0 0 16px;padding-left:22px;display:grid;gap:7px}
li > p{margin:0}
strong{font-weight:600;color:var(--ink)}
code{font:500 .86em/1.4 var(--mono);background:var(--well);padding:1px 5px;border-radius:3px;color:var(--ink)}
.tbl{overflow-x:auto;margin:6px 0 22px;border:1px solid var(--line);background:var(--paper)}
table{border-collapse:collapse;width:100%;font-size:14px;line-height:1.45}
th{font:500 10.5px/1.3 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3);text-align:left;padding:11px 14px;border-bottom:1px solid var(--line-2);background:var(--muted-soft);vertical-align:bottom}
td{padding:10px 14px;border-bottom:1px solid var(--line);vertical-align:top;color:var(--ink-2)}
tr:last-child td{border-bottom:0}
td:first-child{color:var(--ink)}
td code{white-space:nowrap}
th.st-in{color:var(--accent-ink);background:var(--accent-soft)}
th.st-beta{color:var(--beta);background:var(--beta-soft)}
th.st-after{color:var(--ink-2)}
th.st-no{color:var(--ink-3)}
.size{display:inline-block;min-width:24px;text-align:center;font:600 12px/22px var(--mono);border:1px solid var(--line-2);color:var(--ink-2);background:var(--paper)}
.size.s-L{border-color:var(--accent);color:var(--accent-ink);background:var(--accent-soft)}
figure.prompt{margin:8px 0 24px;border:1px solid var(--line-2);background:var(--paper)}
figure.prompt figcaption{font:500 10.5px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3);padding:11px 16px;border-bottom:1px solid var(--line)}
pre{margin:0;padding:16px 18px;overflow-x:auto;background:var(--well)}
pre code{background:none;padding:0;font:500 13px/1.65 var(--mono);white-space:pre}
main > h2#sources ~ p{font-size:13.5px;color:var(--ink-3);max-width:none}
footer{grid-column:1 / -1;border-top:1px solid var(--line);padding:22px 0 40px;font-size:13px;color:var(--ink-3)}
@media (max-width:900px){
  .wrap{grid-template-columns:minmax(0,1fr);gap:0;padding:0 20px}
  nav.toc{display:none}
  header.top{padding-top:34px}
  .glance div{border-right:0;border-bottom:1px solid var(--line)}
  .glance div:last-child{border-bottom:0}
}
</style>
<div class="wrap">
  <header class="top">
    <span class="eyebrow">Studio Zephyrus · frontmatter · proposal</span>
    <h1>The frontmatter MVP plan</h1>
    <p class="by">Version 1, 13 September 2026. For <b>Sagnik</b> and <b>Amit</b> to settle in the founders' meeting. Every number comes from a listed source or is marked as an estimate with its working shown.</p>
    <dl class="glance">
      <div><dt>The MVP</dt><dd>A bare-bones markdown editor, with md.sgnk.ai's look, rebranded</dd></div>
      <div><dt>The funnel</dt><dd>Prompt, then questions, then a seven-file kit at an unlisted link, then a kickoff prompt for your agent</dd></div>
      <div><dt>The pace</dt><dd>41 to 71 engineering days to the pilot (estimate): 34 to 59 weeks at the measured rate</dd></div>
      <div><dt>First</dt><dd>Settle five decisions, and run the funnel by hand for 20 people</dd></div>
    </dl>
  </header>
  <nav class="toc" aria-label="Sections"><span class="eyebrow">Sections</span>${nav}</nav>
  <main>
${body}
  </main>
  <footer>Source: docs/MVP-PLAN-2026-09-13.md in the frontmatter repository. The markdown file is the source; this page is rendered from it.</footer>
</div>
`;
// Every non-ASCII character as an entity, so the page reads the same whatever charset wraps it.
const safe = html.replace(/[^\x00-\x7F]/gu, (c) => `&#x${c.codePointAt(0).toString(16)};`);
fs.writeFileSync(OUT, safe);
console.log('wrote', OUT, (html.length / 1024).toFixed(0) + ' KB', '| sections', toc.length);
