// Render a technical PRD markdown file to a paginated A4 PDF in the sgnk design system,
// with Google Sans typography and client-rendered Mermaid diagrams.
//
//   node docs/build/build-prd-pdf.mjs <input.md> <output-basename> ["Cover title"] ["Lede"]
//
// Differences from build-plan-pdf.mjs (the narrative builder):
//   - Google Sans / Google Sans Code instead of Mosvita, per the sgnk design system.
//   - ```mermaid fences become real rendered diagrams, so the document can carry flowcharts.
//   - Section numbering is derived, and H3s enter the table of contents.
//
// Fonts and the Mermaid bundle are inlined as base64 / source text, so the print HTML is
// fully self-contained and Chrome needs no network. That makes the intermediate HTML large
// (~3.5 MB, almost all of it Mermaid) but the PDF itself carries none of it.
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const [input, outBase, coverTitle, coverLede] = process.argv.slice(2)
if (!input || !outBase) {
  console.error('usage: node docs/build/build-prd-pdf.mjs <input.md> <output-basename> ["title"] ["lede"]')
  process.exit(2)
}

const HOME = process.env.HOME
const FONTDIR = path.join(HOME, 'Desktop/GitHub/finance-ai-90/assets/fonts')
const MERMAID = path.resolve('node_modules/mermaid/dist/mermaid.min.js')

const face = (file, family, weight) => {
  const p = path.join(FONTDIR, file)
  if (!fs.existsSync(p)) {
    console.error('missing font, falling back to system:', p)
    return ''
  }
  return `@font-face{font-family:"${family}";font-style:normal;font-weight:${weight};font-display:block;` +
    `src:url(data:font/woff2;base64,${fs.readFileSync(p).toString('base64')}) format("woff2")}`
}
const FONTCSS = [
  face('GoogleSans-400.woff2', 'Google Sans', 400),
  face('GoogleSans-500.woff2', 'Google Sans', 500),
  face('GoogleSans-600.woff2', 'Google Sans', 600),
  face('GoogleSans-700.woff2', 'Google Sans', 700),
  face('GoogleSansCode-400.woff2', 'Google Sans Code', 400),
  face('GoogleSansCode-500.woff2', 'Google Sans Code', 500),
  face('GoogleSansCode-600.woff2', 'Google Sans Code', 600),
].join('')

const raw = fs.readFileSync(input, 'utf8')
const src = raw.replace(/^---\n[\s\S]*?\n---\n/, '')

const proc = unified()
  .use(remarkParse).use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeStringify, { allowDangerousHtml: true })

const slug = (t) => t.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 70)

// Split on H2. Everything before the first H2 is front matter for the intro page.
const lines = src.split('\n')
const h1 = (lines.find((l) => /^# /.test(l)) || '# Document').replace(/^# /, '').trim()
const chunks = []
let head = []
let cur = null
for (const line of lines) {
  const m = /^## (.+)$/.exec(line)
  if (m) {
    if (cur) chunks.push(cur)
    cur = { title: m[1].trim(), body: [] }
  } else if (cur) {
    cur.body.push(line)
  } else if (!/^# /.test(line)) {
    head.push(line)
  }
}
if (cur) chunks.push(cur)

// Heading text reaches the contents list as raw markdown, so inline code and emphasis
// would print their delimiters literally there. Strip the markers, keep the words.
const plain = (s) => s
  .replace(/`([^`]*)`/g, '$1')
  .replace(/\*\*([^*]*)\*\*/g, '$1')
  .replace(/\*([^*]*)\*/g, '$1')
  .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  .trim()

const subs = (body) =>
  body.filter((l) => /^### /.test(l)).map((l) => plain(l.replace(/^### /, '')))

const render = (md) => {
  let h = String(proc.processSync(md))
  // A ```mermaid fence must become a live diagram container, not a code block.
  // Mermaid reads textContent, which decodes the entities remark escaped, so the
  // fence body survives the round trip unchanged.
  h = h.replace(
    /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    (m, code) => `<figure class="dia"><div class="mermaid">${code}</div></figure>`
  )
  h = h.replace(/<table>/g, '<div class="tw"><table>').replace(/<\/table>/g, '</table></div>')
  h = h.replace(/<(h[3456])>([\s\S]*?)<\/\1>/g, (m, t, i) =>
    `<${t} id="${slug(i.replace(/<[^>]+>/g, ''))}">${i}</${t}>`)
  return h
}

const intro = render(head.join('\n'))
let toc = ''
let body = ''
chunks.forEach((c, i) => {
  const num = /^(\d+)\./.exec(c.title)
  const label = num ? num[1] : String(i + 1)
  const title = plain(c.title.replace(/^\d+\.\s*/, ''))
  const kids = subs(c.body)
  toc += `<div class="tr"><span class="tn">${String(label).padStart(2, '0')}</span>` +
    `<a href="#sec-${label}">${title}</a></div>`
  if (kids.length) {
    toc += `<div class="ts">${kids.map((k) => `<a href="#${slug(k)}">${k}</a>`).join('<i>·</i>')}</div>`
  }
  body += `<section class="chap" id="sec-${label}"><div class="chead">` +
    `<span class="cn">§${label}</span><h2>${title}</h2></div>${render(c.body.join('\n'))}</section>`
})

const words = src.split(/\s+/).filter(Boolean).length
const diagrams = (src.match(/```mermaid/g) || []).length
const tables = (src.match(/^\|/gm) || []).length ? (src.match(/^\|\s*---/gm) || []).length : 0

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${h1}</title><style>
${FONTCSS}
@page{size:A4;margin:17mm 15mm 15mm}
*,*::before,*::after{box-sizing:border-box}
:root{--blue:#1a5cff;--ink:#111318;--ink2:#454c5a;--ink3:#79818f;--hair:#e4e7ec;--bg2:#fafbfc;
 --mono:"Google Sans Code",ui-monospace,SFMono-Regular,Menlo,monospace;
 --sans:"Google Sans","Product Sans",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
body{margin:0;color:var(--ink);font:400 9.4pt/1.58 var(--sans);-webkit-font-smoothing:antialiased}
a{color:var(--blue);text-decoration:none}
h1{font:700 30pt/1.06 var(--sans);letter-spacing:-.025em;margin:0 0 7mm}
h2{font:700 15pt/1.15 var(--sans);letter-spacing:-.015em;margin:0}
h3{font:600 11.4pt/1.25 var(--sans);margin:7mm 0 2.5mm;break-after:avoid;letter-spacing:-.008em}
h4{font:600 9.8pt/1.3 var(--sans);margin:5mm 0 1.8mm;break-after:avoid;color:var(--ink2)}
h5{font:600 7.6pt/1.3 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--ink3);margin:4.5mm 0 1.5mm;break-after:avoid}
p{margin:0 0 3mm}
ul,ol{margin:0 0 3mm;padding-left:4.6mm}
li{margin:0 0 1.2mm}
li>ul,li>ol{margin:1.2mm 0 0}
strong{font-weight:600;color:var(--ink)}
em{font-style:italic}
code{font:400 .87em var(--mono);background:var(--bg2);border:.4pt solid var(--hair);padding:.2mm 1mm;white-space:nowrap}
pre{background:var(--bg2);border:.4pt solid var(--hair);border-left:1.2pt solid var(--blue);padding:2.8mm 3mm;margin:3.2mm 0;break-inside:avoid}
pre code{border:0;background:none;padding:0;font-size:7.4pt;line-height:1.45;white-space:pre-wrap;word-break:break-word}
.tw{margin:3.2mm 0;break-inside:avoid}
table{border-collapse:collapse;width:100%;font-size:7.7pt;line-height:1.4}
th,td{padding:1.4mm 1.8mm;text-align:left;border-bottom:.4pt solid var(--hair);vertical-align:top}
th{font:600 6.6pt var(--mono);letter-spacing:.07em;text-transform:uppercase;color:var(--ink3);background:var(--bg2);border-bottom:.7pt solid var(--hair)}
td code{font-size:.9em;white-space:normal}
blockquote{margin:3.2mm 0;padding:2.5mm 0 2.5mm 4mm;border-left:1.5pt solid var(--blue);color:var(--ink2);background:var(--bg2)}
blockquote p:last-child{margin:0}
hr{border:0;border-top:.4pt solid var(--hair);margin:6mm 0}
.dia{margin:4mm 0;padding:3.5mm 3mm;border:.4pt solid var(--hair);background:var(--bg2);text-align:center;break-inside:avoid}
/* A Mermaid graph has no natural page sense: a tall one would overflow the page box and
   then get pushed whole to the next page, leaving a hole. Capping height (and width) with
   auto on the other axis makes the viewBox scale down to fit instead. Mermaid's own inline
   max-width is stripped at render time or it wins over this rule. */
.dia svg{display:block;margin:0 auto;max-width:100%;max-height:203mm;width:auto;height:auto}
.dia figcaption{margin-top:2.5mm;font:400 7pt var(--mono);color:var(--ink3);letter-spacing:.04em}
.cover{height:258mm;display:flex;flex-direction:column;justify-content:space-between;break-after:page}
.ctop .k{font:600 8pt var(--mono);letter-spacing:.19em;text-transform:uppercase;color:var(--blue);margin:0 0 5mm}
.cover .lede{font:400 11.5pt/1.5 var(--sans);color:var(--ink2);max-width:124mm;margin:5mm 0 0}
.cmeta{display:flex;gap:7mm;flex-wrap:wrap;font:400 7.4pt/1.5 var(--mono);color:var(--ink3);border-top:.4pt solid var(--hair);padding-top:4.5mm}
.cmeta b{display:block;font:700 15pt/1 var(--sans);color:var(--blue);margin-bottom:1mm;letter-spacing:-.02em}
.toc{break-after:page}
.toc h2{margin:0 0 5mm}
.tr{display:flex;align-items:baseline;gap:3mm;padding:1.8mm 0 .8mm}
.tn{font:600 7.4pt var(--mono);color:var(--blue);min-width:7mm}
.tr a{flex:1;color:var(--ink);font-size:9.4pt;font-weight:600}
.ts{padding:0 0 1.8mm 10mm;border-bottom:.4pt solid var(--hair);font:400 7.4pt/1.5 var(--sans);color:var(--ink3)}
.ts a{color:var(--ink3)}
.ts i{font-style:normal;color:var(--hair);padding:0 1.5mm}
.chap{break-before:page}
.chead{display:flex;align-items:baseline;gap:3mm;border-bottom:1.2pt solid var(--blue);padding-bottom:2.2mm;margin-bottom:5.5mm}
.cn{font:700 15pt/1 var(--sans);color:var(--blue);letter-spacing:-.02em}
.intro{break-after:page}
</style></head><body>
<div class="cover"><div class="ctop"><p class="k">SGNK · Zephyrus Studio · Product requirements &amp; research record</p>
<h1>${coverTitle || h1}</h1>
<p class="lede">${coverLede || ''}</p></div>
<div class="cmeta"><div><b>${chunks.length}</b>sections</div><div><b>${(words / 1000).toFixed(1)}k</b>words</div><div><b>${diagrams}</b>diagrams</div><div><b>${tables}</b>tables</div><div><b>38</b>research agents</div><div><b>7</b>rounds</div></div></div>
<section class="intro">${intro}</section>
<section class="toc"><h2>Contents</h2>${toc}</section>${body}
<script>${fs.readFileSync(MERMAID, 'utf8')}</script>
<script>
(function(){
  var ns = __esbuild_esm_mermaid_nm.mermaid; var M = ns.default || ns;
  M.initialize({
    startOnLoad: false, securityLevel: 'loose', theme: 'base',
    flowchart: { htmlLabels: true, curve: 'basis', nodeSpacing: 34, rankSpacing: 40, useMaxWidth: true },
    sequence: { useMaxWidth: true }, gantt: { useMaxWidth: true },
    themeVariables: {
      fontFamily: '"Google Sans", system-ui, sans-serif', fontSize: '13px',
      background: '#ffffff', primaryColor: '#ffffff', primaryTextColor: '#111318',
      primaryBorderColor: '#1a5cff', secondaryColor: '#f2f5ff', secondaryBorderColor: '#1a5cff',
      tertiaryColor: '#fafbfc', tertiaryBorderColor: '#e4e7ec',
      lineColor: '#79818f', textColor: '#111318',
      nodeBorder: '#1a5cff', clusterBkg: '#fafbfc', clusterBorder: '#e4e7ec',
      edgeLabelBackground: '#ffffff', mainBkg: '#ffffff'
    }
  });
  // Render one diagram at a time. mermaid.run() over a whole selector rejects the
  // single shared promise on the first bad graph, which would leave every LATER
  // diagram unrendered and silently missing from the PDF. Per-node isolation means a
  // syntax error costs exactly one diagram, and that one shows a loud red box instead
  // of vanishing.
  var nodes = Array.prototype.slice.call(document.querySelectorAll('.mermaid'));
  var failed = 0;
  var jobs = nodes.map(function(node, i){
    var src = node.textContent;
    return M.render('dia-' + i, src)
      .then(function(out){
        node.innerHTML = out.svg;
        var svg = node.querySelector('svg');
        if (svg) {
          // Mermaid stamps an inline max-width in px that overrides the print stylesheet,
          // so a graph laid out wider or taller than the page box never scales down.
          svg.removeAttribute('style');
          svg.removeAttribute('width');
          svg.removeAttribute('height');
          svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        }
      })
      .catch(function(e){
        failed++;
        node.innerHTML = '<div style="border:1.5px solid #c00;background:#fff5f5;color:#c00;'
          + 'padding:8px;text-align:left;font:12px monospace">DIAGRAM ' + i
          + ' FAILED TO RENDER: ' + String(e && e.message).replace(/</g,'&lt;')
          + '<pre style="white-space:pre-wrap">' + src.replace(/</g,'&lt;') + '</pre></div>';
      });
  });
  Promise.all(jobs).then(function(){
    document.documentElement.setAttribute('data-mermaid', failed ? 'failed:' + failed : 'done');
    document.title = document.title + (failed ? ' [' + failed + ' DIAGRAMS FAILED]' : '');
  });
})();
</script>
</body></html>`

const dir = path.resolve(path.dirname(input))
const htmlPath = path.join(dir, `${outBase}.print.html`)
fs.writeFileSync(htmlPath, html)
console.log('print html:', htmlPath, (html.length / 1024 / 1024).toFixed(2), 'MB |',
  chunks.length, 'sections |', words, 'words |', diagrams, 'diagrams')

const pdfPath = path.join(dir, `${outBase}.pdf`)
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
if (!fs.existsSync(chrome)) {
  console.log('chrome not found — print html written, render manually')
  process.exit(0)
}

// Chrome's new headless (the only one left since 132) writes the PDF and then keeps
// running, and its helper processes hold any inherited stdio open. So launch detached
// with stdio ignored and watch the FILE, not the process. --virtual-time-budget gives
// Mermaid time to lay out every diagram before the print snapshot is taken.
fs.rmSync(pdfPath, { force: true })
const child = spawn(chrome, [
  '--headless', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer',
  '--no-first-run', '--disable-crash-reporter',
  '--virtual-time-budget=60000',
  '--run-all-compositor-stages-before-draw',
  `--user-data-dir=${fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'fm-prd-'))}`,
  `--print-to-pdf=${pdfPath}`,
  `file://${htmlPath}`,
], { stdio: 'ignore', detached: true })

const complete = () => {
  // %%EOF is the PDF's own end-of-file marker; size alone would pass on a partial flush.
  if (!fs.existsSync(pdfPath)) return 0
  const size = fs.statSync(pdfPath).size
  if (size < 1024) return 0
  const fd = fs.openSync(pdfPath, 'r')
  const tail = Buffer.alloc(32)
  fs.readSync(fd, tail, 0, 32, size - 32)
  fs.closeSync(fd)
  return tail.toString('latin1').includes('%%EOF') ? size : 0
}
const DEADLINE = Date.now() + 300_000
let size = 0
while (!(size = complete()) && Date.now() < DEADLINE) {
  await new Promise((r) => setTimeout(r, 400))
}
try { process.kill(-child.pid, 'SIGKILL') } catch { /* already gone */ }
if (!size) {
  console.error('chrome did not produce a complete pdf at', pdfPath)
  process.exit(1)
}
console.log('pdf:', pdfPath, (size / 1024 / 1024).toFixed(2), 'MB')
