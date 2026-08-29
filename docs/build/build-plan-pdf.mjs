// Render a single markdown plan document to a paginated A4 PDF in the sgnk design system.
//
// Generic version of docs/mdmax/build/build-pdf.mjs: that one concatenates a tree of
// section files, this one takes ONE markdown file and paginates it by H2. Same type
// scale, same blue, same Mosvita display face, so the two documents sit together.
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

const [input, outBase, coverTitle, coverLede] = process.argv.slice(2)
if (!input || !outBase) {
  console.error('usage: node docs/build/build-plan-pdf.mjs <input.md> <output-basename> ["title"] ["lede"]')
  process.exit(2)
}

const FONTS = path.join(process.env.HOME, 'Library/Fonts')
const face = (file, weight) => {
  const p = path.join(FONTS, file)
  if (!fs.existsSync(p)) return ''
  return `@font-face{font-family:Mosvita;font-weight:${weight};font-display:block;src:url(data:font/otf;base64,${fs.readFileSync(p).toString('base64')}) format("opentype")}`
}
const FONTCSS = [face('Mosvita-Regular.otf', 400), face('Mosvita-Bold.otf', 700), face('Mosvita-Black.otf', 900)].join('')

const raw = fs.readFileSync(input, 'utf8')
// Strip YAML frontmatter — it is metadata for the vault, not for the printed page.
const src = raw.replace(/^---\n[\s\S]*?\n---\n/, '')

const proc = unified().use(remarkParse).use(remarkGfm).use(remarkRehype, { allowDangerousHtml: true }).use(rehypeStringify, { allowDangerousHtml: true })
const slug = (t) => t.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60)

// Split on H2 so every top-level section starts a fresh page, mirroring the mdmax build.
const lines = src.split('\n')
const h1 = (lines.find((l) => /^# /.test(l)) || '# Plan').replace(/^# /, '').trim()
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

const render = (md) => {
  let h = String(proc.processSync(md))
  // Wrap tables so a wide one can scroll/shrink instead of blowing the page box.
  h = h.replace(/<table>/g, '<div class="tw"><table>').replace(/<\/table>/g, '</table></div>')
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
  toc += `<div class="tr"><span class="tn">${String(label).padStart(2, '0')}</span><a href="#sec-${label}">${title}</a></div>`
  body += `<section class="chap" id="sec-${label}"><div class="chead"><span class="cn">§${label}</span><h2>${title}</h2></div>${render(c.body.join('\n'))}</section>`
})

const words = src.split(/\s+/).filter(Boolean).length
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${h1}</title><style>
${FONTCSS}
@page{size:A4;margin:18mm 16mm 16mm}
*,*::before,*::after{box-sizing:border-box}
:root{--blue:#1a5cff;--ink:#111318;--ink2:#4a5160;--ink3:#7b8393;--hair:#e4e7ec;--bg2:#fafbfc;
 --mono:ui-monospace,SFMono-Regular,Menlo,monospace;--sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;--disp:Mosvita,var(--sans)}
body{margin:0;color:var(--ink);font:400 9.6pt/1.6 var(--sans)}
a{color:var(--blue);text-decoration:none}
h1{font:900 30pt/1.05 var(--disp);letter-spacing:-.02em;margin:0 0 8mm}
h2{font:700 15pt/1.15 var(--disp);margin:0}
h3{font:700 11.5pt/1.25 var(--sans);margin:7mm 0 2.5mm;break-after:avoid}
h4{font:600 10pt/1.3 var(--sans);margin:5mm 0 2mm;break-after:avoid}
p{margin:0 0 3.2mm}
ul,ol{margin:0 0 3.2mm;padding-left:5mm}
li{margin:0 0 1.4mm}
strong{font-weight:700}
code{font:400 .86em var(--mono);background:var(--bg2);border:.4pt solid var(--hair);padding:.3mm 1mm}
pre{background:var(--bg2);border:.4pt solid var(--hair);padding:3mm;margin:3.5mm 0;break-inside:avoid}
pre code{border:0;background:none;padding:0;font-size:7.6pt;line-height:1.45;white-space:pre-wrap;word-break:break-word}
.tw{margin:3.5mm 0;break-inside:avoid}
table{border-collapse:collapse;width:100%;font-size:8pt}
th,td{padding:1.5mm 2mm;text-align:left;border-bottom:.4pt solid var(--hair);vertical-align:top}
th{font:400 7pt var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--ink3);background:var(--bg2)}
blockquote{margin:3.5mm 0;padding-left:4mm;border-left:1.2pt solid var(--blue);color:var(--ink2)}
hr{border:0;border-top:.4pt solid var(--hair);margin:6mm 0}
.cover{height:255mm;display:flex;flex-direction:column;justify-content:space-between;break-after:page}
.ctop .k{font:400 8pt var(--mono);letter-spacing:.2em;text-transform:uppercase;color:var(--blue)}
.cover .lede{font:400 12pt/1.5 var(--sans);color:var(--ink2);max-width:126mm;margin:6mm 0 0}
.cmeta{display:flex;gap:8mm;flex-wrap:wrap;font:400 8pt/1.6 var(--mono);color:var(--ink3);border-top:.4pt solid var(--hair);padding-top:5mm}
.cmeta b{display:block;font:900 16pt/1 var(--disp);color:var(--blue);margin-bottom:1.5mm}
.toc{break-after:page}
.toc h2{margin:0 0 6mm}
.tr{display:flex;align-items:baseline;gap:3mm;padding:2.2mm 0;border-bottom:.4pt solid var(--hair)}
.tn{font:400 8pt var(--mono);color:var(--blue);min-width:8mm}
.tr a{flex:1;color:var(--ink);font-size:9.5pt}
.chap{break-before:page}
.chead{display:flex;align-items:baseline;gap:3mm;border-bottom:1.2pt solid var(--blue);padding-bottom:2.5mm;margin-bottom:6mm}
.cn{font:900 15pt/1 var(--disp);color:var(--blue)}
.intro{break-after:page}
</style></head><body>
<div class="cover"><div class="ctop"><p class="k">SGNK · Product &amp; strategy record</p>
<h1>${coverTitle || h1}</h1>
<p class="lede">${coverLede || ''}</p></div>
<div class="cmeta"><div><b>${chunks.length}</b>sections</div><div><b>${(words / 1000).toFixed(1)}k</b>words</div><div><b>35</b>research agents</div><div><b>6</b>rounds</div></div></div>
<section class="intro">${intro}</section>
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
