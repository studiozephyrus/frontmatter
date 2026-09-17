// Render a single markdown plan document to a paginated A4 PDF in the sgnk design system.
//
// Generic version of docs/mdmax/build/build-pdf.mjs: that one concatenates a tree of
// section files, this one takes ONE markdown file and paginates it by H2. Same type
// scale, same blue, and Google Sans as the display face, so the two documents sit together.
//
//   node docs/build/build-plan-pdf.mjs <input.md> <output-basename> ["Cover title"] ["Lede"]
//
// Writes <basename>.print.html next to the input and renders <basename>.pdf via headless
// Chrome. Fonts are embedded as base64 so the PDF is self-contained on any machine.
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const [input, outBase, coverTitle, coverLede, kicker] = process.argv.slice(2)
if (!input || !outBase) {
  console.error('usage: node docs/mvp0/build-pdf.mjs <input.md> <output-basename> ["title"] ["lede"]')
  process.exit(2)
}

// The display and text face is Google Sans, embedded as base64 in the screens' fonts.css
// (with Google Sans Code for code), both under the SIL Open Font License; see
// THIRD-PARTY-NOTICES.md. Mosvita was dropped on 17 September 2026 because no licence for
// it could be produced (audit finding F070).
const HERE = path.dirname(new URL(import.meta.url).pathname)
const FONTCSS = fs.readFileSync(path.join(HERE, 'screens', 'fonts.css'), 'utf8')

const raw = fs.readFileSync(input, 'utf8')
// Strip YAML frontmatter — it is metadata for the vault, not for the printed page.
const src = raw.replace(/^---\n[\s\S]*?\n---\n/, '')

const proc = unified().use(remarkParse).use(remarkGfm).use(remarkRehype, { allowDangerousHtml: true }).use(rehypeStringify, { allowDangerousHtml: true })
const slug = (t) => t.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60)

// Split on H2. Sections flow one after another; only a "# Part ..." heading
// starts a fresh page, so short sections do not each leave half a blank page.
const lines = src.split('\n')
const h1 = (lines.find((l) => /^# /.test(l)) || '# Plan').replace(/^# /, '').trim()
const chunks = []
let head = []
let cur = null
let pendingPart = null
for (const line of lines) {
  const m = /^## (.+)$/.exec(line)
  const pm = /^# (Part .+)$/.exec(line)
  if (pm) {
    pendingPart = pm[1].trim()
    continue
  }
  if (m) {
    if (cur) chunks.push(cur)
    cur = { title: m[1].trim(), body: [], part: pendingPart }
    pendingPart = null
  } else if (cur) {
    cur.body.push(line)
  } else if (!/^# /.test(line)) {
    head.push(line)
  }
}
if (cur) chunks.push(cur)

// The corpus writes tables as bare pipe rows with no GFM delimiter line, so markdown
// parsed them as ONE run-on paragraph and every table in every PDF built before this
// was prose with pipes in it. Insert the delimiter: a run is two or more consecutive
// lines carrying the same number of " | " separators, outside a fence, not a bullet.
const gfmTables = (md) => {
  const L = md.split('\n')
  const out = []
  let fence = false
  let inTable = false
  const width = (s) => {
    if (s === undefined) return 0
    if (/^\s*(```|[-*>+]\s|\||#)/.test(s)) return 0
    if (!s.includes(' | ')) return 0
    return s.split(' | ').length
  }
  for (let i = 0; i < L.length; i++) {
    const l = L[i]
    if (/^\s*```/.test(l)) { fence = !fence; inTable = false; out.push(l); continue }
    if (fence) { out.push(l); continue }
    const w = width(l)
    if (w >= 2 && !inTable && width(L[i + 1]) === w) {
      out.push(l)
      out.push(Array(w).fill('---').join(' | '))
      inTable = true
      continue
    }
    if (w === 0) inTable = false
    out.push(l)
  }
  return out.join('\n')
}

const render = (md) => {
  let h = String(proc.processSync(gfmTables(md)))
  // Keep a screen block (heading + shot + the note under it) on one page.
  h = h.replace(/<h3>(S\d\d\.[\s\S]*?)(?=<h3>|$)/g, (m) => `<div class="sblock">${m}</div>`)
  // Wrap tables so a wide one can scroll/shrink instead of blowing the page box.
  h = h.replace(/<(ol|ul)>[\s\S]*?<\/\1>/g, (lst) => {
    const items = (lst.match(/<li>/g) || []).length
    return items > 8 ? lst.replace(/^<(ol|ul)>/, (m, tag) => `<${tag} class="long">`) : lst
  })
  h = h.replace(/<table>[\s\S]*?<\/table>/g, (tbl) => {
    const rows = (tbl.match(/<tr>/g) || []).length
    return `<div class="tw${rows > 14 ? ' tall' : ''}">${tbl}</div>`
  })
  h = h.replace(/<(h[34])>([\s\S]*?)<\/\1>/g, (m, t, i) => `<${t} id="${slug(i.replace(/<[^>]+>/g, ''))}">${i}</${t}>`)
  return h
}

const intro = render(head.join('\n'))
let toc = ''
let body = ''
chunks.forEach((c, i) => {
  const n = i + 1
  // "3. The gap map" -> number is already in the heading; keep the author's numbering.
  const num = /^(\d+)\./.exec(c.title)
  const label = num ? num[1] : String(n)
  const title = c.title.replace(/^\d+\.\s*/, '')
  if (c.part) toc += `<div class="tpart">${c.part}</div>`
  toc += `<div class="tr"><span class="tn">${String(label).padStart(2, '0')}</span><a href="#sec-${label}">${title}</a></div>`
  const part = c.part ? `<div class="part">${c.part}</div>` : ''
  body += `<section class="chap${c.part ? ' newpage' : ''}" id="sec-${label}">${part}<div class="chead"><span class="cn">§${label}</span><h2>${title}</h2></div>${render(c.body.join('\n'))}</section>`
})

const words = src.split(/\s+/).filter(Boolean).length
const screensCount = (src.match(/^### S\d\d\./gm) || []).length
const printDate = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date())
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${h1}</title><style>
${FONTCSS}
@page{size:A4;margin:15mm 15mm 14mm}
*,*::before,*::after{box-sizing:border-box}
:root{--blue:#1a5cff;--ink:#111318;--ink2:#4a5160;--ink3:#7b8393;--hair:#e4e7ec;--bg2:#fafbfc;
 --mono:"Google Sans Code",ui-monospace,SFMono-Regular,Menlo,monospace;--sans:"Google Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;--disp:"Google Sans",var(--sans)}
body{margin:0;color:var(--ink);font:400 9.6pt/1.6 var(--sans);orphans:3;widows:3}
a{color:var(--blue);text-decoration:none}
h1{font:700 30pt/1.05 var(--disp);letter-spacing:-.02em;margin:0 0 8mm}
h2{font:700 15pt/1.15 var(--disp);margin:0}
h3{font:700 11.5pt/1.25 var(--sans);margin:4.5mm 0 1.6mm;break-after:avoid}
.sblock h3{margin-top:2.5mm}
h4{font:600 9.6pt/1.3 var(--sans);margin:3.4mm 0 1.4mm;break-after:avoid}
p{margin:0 0 2.8mm;orphans:3;widows:3}
ul{margin:0 0 3mm;padding-left:5mm;break-inside:avoid}
ol{margin:0 0 3mm;padding-left:8mm;break-inside:avoid}
li{margin:0 0 1.4mm;orphans:2;widows:2}
strong{font-weight:700}
code{font:400 .86em var(--mono);background:var(--bg2);border:.4pt solid var(--hair);padding:.3mm 1mm}
pre{background:var(--bg2);border:.4pt solid var(--hair);padding:3mm;margin:3.5mm 0;break-inside:avoid}
pre code{border:0;background:none;padding:0;font-size:7.6pt;line-height:1.45;white-space:pre-wrap;word-break:break-word}
.tw{margin:2.6mm 0;break-inside:avoid}
.tw.tall,.tw.tall table{break-inside:auto}
tr{break-inside:avoid}
table{break-inside:avoid}
table{border-collapse:collapse;width:100%;font-size:7.4pt}
th,td{padding:.85mm 1.5mm;text-align:left;border-bottom:.4pt solid var(--hair);vertical-align:top}
th{font:400 7pt var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--ink3);background:var(--bg2)}
blockquote{margin:3.5mm 0;padding-left:4mm;border-left:1.2pt solid var(--blue);color:var(--ink2)}
hr{border:0;border-top:.4pt solid var(--hair);margin:6mm 0}
.cover{height:255mm;display:flex;flex-direction:column;justify-content:space-between;break-after:page}
.ctop .k{font:400 8pt var(--mono);letter-spacing:.2em;text-transform:uppercase;color:var(--blue)}
.cover .lede{font:400 12pt/1.5 var(--sans);color:var(--ink2);max-width:126mm;margin:5mm 0 0}
.cover .intro{font-size:8.6pt;line-height:1.55;color:var(--ink2);max-width:150mm;margin:7mm 0 0;border-top:.4pt solid var(--hair);padding-top:5mm}
.cover .intro p{margin:0 0 2mm}
.cmeta{display:flex;gap:8mm;flex-wrap:wrap;font:400 8pt/1.6 var(--mono);color:var(--ink3);border-top:.4pt solid var(--hair);padding-top:5mm}
.cmeta b{display:block;font:700 16pt/1 var(--disp);color:var(--blue);margin-bottom:1.5mm}
.toc{break-after:page}
.toc h2{font:700 18pt/1.1 var(--disp)}
.toc h2{margin:0 0 6mm}
.tr{display:flex;align-items:baseline;gap:3mm;padding:1.5mm 0;border-bottom:.4pt solid var(--hair)}
.tn{font:400 8pt var(--mono);color:var(--blue);min-width:8mm}
.tr a{flex:1;color:var(--ink);font-size:9.5pt}
.chap{break-before:auto;margin-top:6mm}
.chap.newpage{break-before:auto;margin-top:7mm;border-top:1.2pt solid var(--ink);padding-top:3.5mm}
.part{font:700 9pt/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--blue);margin:0 0 3mm}
.tpart{font:700 8pt/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--ink3);margin:3.5mm 0 1mm}
.chead{display:flex;align-items:baseline;gap:3mm;border-bottom:1.2pt solid var(--blue);padding-bottom:2mm;margin-bottom:4mm;break-after:avoid}
.cn{font:700 15pt/1 var(--disp);color:var(--blue)}
.intro{margin-bottom:5mm;padding-bottom:4mm;border-bottom:.4pt solid var(--hair);font-size:9pt}
figure{margin:2.5mm 0 3mm;break-inside:avoid}
figure img{display:block;max-width:180mm;max-height:92mm;width:auto;height:auto;border:.4pt solid var(--hair);border-radius:1.2mm}
figcaption{font:400 7.4pt/1.4 var(--mono);color:var(--ink3);margin-top:1.4mm}
.shot{break-inside:avoid}
.pair{display:flex;gap:3mm;align-items:flex-start;margin:2mm 0 2.4mm;break-inside:avoid}
.pair img{display:block;border:.4pt solid var(--hair);border-radius:1.2mm}
.pair img:first-child{width:137mm}
.pair img:last-child{width:39.6mm}
.pair.solo img:first-child{width:180mm}
.onit{margin:0 0 1.5mm;font-size:8.8pt}
.onit li{margin:0 0 .7mm}
.why{font-size:8.6pt;color:var(--ink2);margin:0 0 3mm}
.sblock{break-inside:avoid;margin:0 0 1mm}
.two{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
.note{border:.4pt solid var(--hair);border-left:1.2pt solid var(--blue);background:var(--bg2);padding:2.5mm 3.5mm;margin:3.5mm 0;font-size:9pt}
.kv{display:grid;grid-template-columns:1fr 1fr 1fr;gap:3mm;margin:3mm 0}
.kv div{border:.4pt solid var(--hair);padding:2.5mm 3mm}
.kv b{display:block;font:700 13pt/1.1 var(--disp);color:var(--blue)}
.kv span{font-size:8pt;color:var(--ink3)}
</style></head><body>
<div class="cover"><div class="ctop"><p class="k">${kicker || 'Studio Zephyrus · frontmatter · MVP 0'}</p>
<h1>${coverTitle || h1}</h1>
<p class="lede">${coverLede || ''}</p>
<div class="intro">${intro}</div></div>
<div class="cmeta"><div><b>${chunks.length}</b>sections</div><div><b>${(words / 1000).toFixed(1)}k</b>words</div><div><b>${screensCount}</b>screens</div><div><b>print</b>${printDate}</div></div></div>

<section class="toc"><h2>Contents</h2>${toc}</section>${body}</body></html>`

const dir = path.resolve(path.dirname(input))
const htmlPath = path.join(dir, `${outBase}.print.html`)
fs.writeFileSync(htmlPath, html)
console.log('print html:', htmlPath, (html.length / 1024 / 1024).toFixed(2), 'MB')

const pdfPath = path.join(dir, `${outBase}.pdf`)
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
if (fs.existsSync(chrome)) {
  // Chrome needs a writable profile dir; the default location is not always creatable
  // under a sandbox, and file:// needs absolute paths.
  const profile = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'fm-pdf-'))
  // Chrome's new headless (the only one left — --headless=old was removed in Chrome 132)
  // writes the PDF and then keeps running, so waiting on its exit hangs forever. And
  // stdio must not be inherited, because its helper processes hold the inherited pipe
  // open and block any caller that pipes us. So: launch detached, watch the FILE, and
  // kill the process group once the PDF is complete.
  fs.rmSync(pdfPath, { force: true })
  const child = spawn(chrome, [
    '--headless', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer',
    '--no-first-run', '--disable-crash-reporter',
    `--user-data-dir=${profile}`,
    `--print-to-pdf=${pdfPath}`,
    `file://${htmlPath}`,
  ], { stdio: 'ignore', detached: true })

  const done = () => {
    // A complete PDF ends with %%EOF; a half-flushed one does not.
    if (!fs.existsSync(pdfPath)) return 0
    const size = fs.statSync(pdfPath).size
    if (size < 1024) return 0
    const fd = fs.openSync(pdfPath, 'r')
    const tail = Buffer.alloc(32)
    fs.readSync(fd, tail, 0, 32, size - 32)
    fs.closeSync(fd)
    return tail.toString('latin1').includes('%%EOF') ? size : 0
  }
  const DEADLINE = Date.now() + 120_000
  let size
  while (!(size = done()) && Date.now() < DEADLINE) {
    await new Promise((r) => setTimeout(r, 250))
  }
  try { process.kill(-child.pid, 'SIGKILL') } catch { /* already gone */ }
  fs.rmSync(profile, { recursive: true, force: true })
  if (!size) {
    console.error('chrome did not produce a complete pdf at', pdfPath)
    process.exit(1)
  }
  console.log('pdf:', pdfPath, (size / 1024 / 1024).toFixed(2), 'MB')
} else {
  console.log('chrome not found — print html written, render manually')
}
