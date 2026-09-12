// Render a research brief to the SGNK synthesis layout — the Perccent-NRI format.
//
//   node docs/build/build-brief-pdf.mjs <input.md> <out-basename> "Title" "Subtitle" "PROJECT"
//
// This is a different document class from build-prd-pdf.mjs. That one renders a long
// reference record; this renders a SHORT, dense, decision-grade brief: key figures at
// the top, exhibits with graded chips, coloured callouts, a corrections table, and a
// risk register. Compact and bulleted by construction — a paragraph that runs long
// simply looks wrong in this grid, which is the point.
//
// AUTHORING CONVENTIONS the builder styles automatically:
//   # Title / ## Subtitle          the masthead (subtitle renders blue)
//   > intro paragraph              the lede under the masthead
//   ::keyfigures                   a block of `VALUE — caption` lines, one per line
//   ## PART N — Name               a part divider
//   ### N. Name                    a numbered section with a blue chip
//   #### N.N Name                  a subsection
//   ::exhibit N | Caption          an exhibit label above the next table
//   > [!test] > [!risk] > [!good] > [!warn] > [!note]    coloured callouts
//   Any table cell whose whole text is an ALLCAPS grade becomes a chip:
//     DURABLE PERMANENT GOOD SHIP CONFIRMED  -> green
//     OPEN PARTIAL LATER REVISED WATCH       -> amber
//     DECAYING CRITICAL FATAL REFUTED KILL   -> red
//     UNEVIDENCED SIMULATED UNVERIFIED       -> outline
import fs from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const [input, outBase, title, subtitle, project] = process.argv.slice(2)
if (!input || !outBase) {
  console.error('usage: node docs/build/build-brief-pdf.mjs <in.md> <out> "Title" "Subtitle" "PROJECT"')
  process.exit(2)
}

const HOME = process.env.HOME
const FONTDIR = path.join(HOME, 'Desktop/GitHub/finance-ai-90/assets/fonts')
const MERMAID = path.resolve('node_modules/mermaid/dist/mermaid.min.js')

const face = (file, family, weight) => {
  const p = path.join(FONTDIR, file)
  if (!fs.existsSync(p)) return ''
  return `@font-face{font-family:"${family}";font-style:normal;font-weight:${weight};font-display:block;` +
    `src:url(data:font/woff2;base64,${fs.readFileSync(p).toString('base64')}) format("woff2")}`
}
const FONTCSS = [
  face('GoogleSans-400.woff2', 'Google Sans', 400), face('GoogleSans-500.woff2', 'Google Sans', 500),
  face('GoogleSans-600.woff2', 'Google Sans', 600), face('GoogleSans-700.woff2', 'Google Sans', 700),
  face('GoogleSansCode-400.woff2', 'Google Sans Code', 400), face('GoogleSansCode-500.woff2', 'Google Sans Code', 500),
].join('')

let md = fs.readFileSync(input, 'utf8')

// ---- pull the masthead out before markdown sees it -------------------------
const H1 = /^#\s+(.+)$/m.exec(md)
const H2 = /^##\s+(?!PART)(.+)$/m.exec(md)
const docTitle = title || (H1 ? H1[1] : outBase)
const docSub = subtitle || (H2 ? H2[1] : '')
md = md.replace(/^#\s+.+$\n?/m, '')
if (H2) md = md.replace(/^##\s+(?!PART).+$\n?/m, '')   // it is the masthead, not a section

// the lede: the first blockquote before any part divider
let lede = ''
const LEDE = /^>\s+(?!\[!)(.+(?:\n>\s+.+)*)/m.exec(md)
if (LEDE && (md.indexOf('## PART') === -1 || LEDE.index < md.indexOf('## PART'))) {
  // the lede bypasses the markdown pass, so run the inline marks by hand
  lede = LEDE[1].replace(/\n>\s+/g, ' ')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+?)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+?)`/g, '<code>$1</code>')
  md = md.replace(LEDE[0], '')
}

// ---- ::keyfigures ---------------------------------------------------------
let keyfigs = ''
md = md.replace(/^::keyfigures\n([\s\S]*?)\n::\n/m, (_m, body) => {
  const items = body.split('\n').filter((l) => l.trim()).map((l) => {
    const [v, ...rest] = l.split(/\s+—\s+/)
    return `<div class="kf"><div class="kfv">${v.trim()}</div><div class="kfc">${rest.join(' — ')}</div></div>`
  })
  keyfigs = `<div class="kfrow"><div class="kflabel">KEY FIGURES</div><div class="kfs">${items.join('')}</div></div>`
  return ''
})

// ---- ::exhibit N | Caption ------------------------------------------------
md = md.replace(/^::exhibit\s+([^|\n]+)\|\s*(.+)$/gm,
  (_m, n, cap) => `<div class="exl">EXHIBIT ${n.trim()}</div><div class="exc">${cap.trim()}</div>`)

// ---- part dividers --------------------------------------------------------
md = md.replace(/^##\s+PART\s+([IVX]+)\s*[—-]\s*(.+)$/gm,
  (_m, n, t) => `<div class="part"><div class="partn">PART ${n}</div><h2 class="parth">${t}</h2></div>`)

const html0 = String(unified().use(remarkParse).use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true }).use(rehypeStringify, { allowDangerousHtml: true })
  .processSync(md))

let h = html0

// numbered section chips: <h3>4. Name</h3> -> chip + title
h = h.replace(/<h3>(\d+)\.\s*(.*?)<\/h3>/g,
  (_m, n, t) => `<h3 class="sec"><span class="secn">${n}</span>${t}</h3>`)
h = h.replace(/<h4>([\d.]+)\s*(.*?)<\/h4>/g,
  (_m, n, t) => `<h4 class="sub"><span class="subn">${n}</span>${t}</h4>`)

// callouts
const KINDS = { test: 'ct-test', risk: 'ct-risk', good: 'ct-good', warn: 'ct-warn', note: 'ct-note' }
h = h.replace(/<blockquote>\s*<p>\[!(\w+)\]\s*([\s\S]*?)<\/blockquote>/g, (_m, kind, body) => {
  const cls = KINDS[kind.toLowerCase()] || 'ct-note'
  const label = kind.toUpperCase()
  return `<div class="ct ${cls}"><div class="ctl">${label}</div><div class="ctb"><p>${body}</div></div>`
})

// grade chips — a cell whose entire content is a known ALLCAPS grade
const GREEN = /^(DURABLE|PERMANENT|GOOD|SHIP|CONFIRMED|LIVE|BUILT|DONE|YES|PASS)$/
const AMBER = /^(OPEN|PARTIAL|LATER|REVISED|WATCH|DECAYING|SERIOUS|MINOR|HIGH|CONDITIONAL)$/
const RED = /^(CRITICAL|FATAL|SEVERE|REFUTED|KILL|ABSENT|DEAD|NO|FAIL|BLOCKED)$/
const OUTLINE = /^(UNEVIDENCED|SIMULATED|UNVERIFIED|UNKNOWN|SS|DIRECTIONAL|NOT SIZED|N\/A)$/
h = h.replace(/<td>([A-Z][A-Z /]{1,22})<\/td>/g, (m, txt) => {
  const t = txt.trim()
  const cls = GREEN.test(t) ? 'g-green' : AMBER.test(t) ? 'g-amber' : RED.test(t) ? 'g-red'
    : OUTLINE.test(t) ? 'g-out' : null
  return cls ? `<td><span class="grade ${cls}">${t}</span></td>` : m
})

// mermaid
h = h.replace(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
  (_m, code) => `<div class="mermaid">${code.replace(/&#x26;/g, '&').replace(/&#x3C;/g, '<')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')}</div>`)
const diagrams = (h.match(/class="mermaid"/g) || []).length

const words = md.split(/\s+/).filter(Boolean).length
const stamp = new Date().toISOString().slice(0, 10)
/* The masthead/footer label. Defaults to the internal research wording; a
   PUBLISHED brief overrides both via env so the same renderer serves an internal
   memo and a document that goes out to strangers:
     BRIEF_LABEL="Sagnik Mitra"  BRIEF_CLASS="" node build-brief-pdf.mjs ...
   BRIEF_CLASS='' drops the trailing INTERNAL entirely. */
const LABEL = process.env.BRIEF_LABEL ?? 'A SGNK RESEARCH SYNTHESIS'
const CLASSN = process.env.BRIEF_CLASS ?? 'INTERNAL'
const FOOT = [LABEL, (project || 'FRONTMATTER').toUpperCase(), stamp.toUpperCase(), CLASSN]
  .filter(Boolean).join(' &nbsp;·&nbsp; ')

const CSS = `
${FONTCSS}
@page { size: A4; margin: 15mm 14mm 16mm 14mm; }
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{font-family:"Google Sans",system-ui,sans-serif;font-size:8.6pt;line-height:1.42;color:#14161a;
  -webkit-font-smoothing:antialiased;orphans:2;widows:2}
code,pre{font-family:"Google Sans Code",ui-monospace,monospace;font-size:7.7pt}
p{margin:0 0 5pt}
strong{font-weight:600;color:#000}
em{font-style:italic}
a{color:#1a5cff;text-decoration:none}
hr{border:0;border-top:1px solid #dfe3ea;margin:9pt 0}
img{display:block;max-width:100%;height:auto;border:1px solid #dfe3ea;margin:2pt 0 8pt;break-inside:avoid}

/* masthead */
.mast{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #14161a;padding-bottom:7pt;margin-bottom:8pt}
.mt{font-size:21pt;line-height:1.06;font-weight:700;letter-spacing:-.4pt;margin:0}
.mt .b{color:#1a5cff;display:block}
.mlabel{font-size:6.6pt;letter-spacing:.9pt;font-weight:600;color:#4a5160;text-align:right;padding-top:3pt;white-space:nowrap}
.lede{font-size:8.8pt;line-height:1.5;color:#2b3038;margin:0 0 9pt;max-width:none}

/* key figures */
.kfrow{border-top:1px solid #dfe3ea;border-bottom:1px solid #dfe3ea;padding:7pt 0 8pt;margin:0 0 10pt}
.kflabel{font-size:6.3pt;letter-spacing:1pt;font-weight:600;color:#6b7280;margin-bottom:5pt}
.kfs{display:flex;gap:16pt}
.kf{flex:1}
.kfv{font-size:15pt;font-weight:700;color:#1a5cff;line-height:1.05;letter-spacing:-.3pt}
.kfc{font-size:6.9pt;line-height:1.32;color:#4a5160;margin-top:2.5pt}

/* parts and sections */
.part{border-top:2px solid #14161a;margin:13pt 0 7pt;padding-top:6pt;break-after:avoid}
.partn{font-size:6.6pt;letter-spacing:1pt;font-weight:600;color:#1a5cff;margin-bottom:1pt}
.parth{font-size:15pt;font-weight:700;margin:0;letter-spacing:-.3pt}
h2{font-size:11.5pt;font-weight:700;margin:11pt 0 5pt;letter-spacing:-.2pt;break-after:avoid}
h3.sec{font-size:10.2pt;font-weight:700;margin:10pt 0 5pt;display:flex;align-items:center;gap:5pt;break-after:avoid}
.secn{background:#1a5cff;color:#fff;font-size:7pt;font-weight:700;padding:1.5pt 4pt;border-radius:2px;min-width:13pt;text-align:center}
h4.sub{font-size:8.9pt;font-weight:600;margin:8pt 0 4pt;display:flex;gap:5pt;break-after:avoid}
.subn{color:#1a5cff;font-weight:700}
h5,h6{font-size:8.2pt;font-weight:600;margin:7pt 0 3pt}

/* exhibits */
.exl{font-size:6.3pt;letter-spacing:1pt;font-weight:600;color:#1a5cff;margin:9pt 0 1pt;break-after:avoid}
.exc{font-size:8.7pt;font-weight:600;margin:0 0 4pt;break-after:avoid}

/* tables */
table{width:100%;border-collapse:collapse;margin:4pt 0 8pt;font-size:7.6pt;break-inside:auto}
thead{display:table-header-group}
tr{break-inside:avoid}
th{text-align:left;font-size:6.4pt;letter-spacing:.6pt;font-weight:600;color:#4a5160;
  border-bottom:1px solid #14161a;padding:3.5pt 5pt 3pt 0;vertical-align:bottom}
td{padding:4pt 5pt 4pt 0;border-bottom:1px solid #eceff4;vertical-align:top;line-height:1.34}
tbody tr:nth-child(even){background:#f7f9fc}
td:last-child,th:last-child{padding-right:0}

/* grade chips */
.grade{display:inline-block;font-size:6.2pt;font-weight:700;letter-spacing:.4pt;padding:1.5pt 4pt;border-radius:2px;white-space:nowrap}
.g-green{background:#d9f2e3;color:#0d6b3f}
.g-amber{background:#fdf0d5;color:#8a5a06}
.g-red{background:#fde0e0;color:#a51c1c}
.g-out{background:#fff;color:#6b7280;border:1px solid #c9cfda}

/* callouts */
.ct{border-left:2.5pt solid;padding:6pt 8pt;margin:7pt 0;break-inside:avoid;font-size:7.8pt;line-height:1.4}
.ct .ctl{font-size:6.3pt;letter-spacing:.9pt;font-weight:700;margin-bottom:3pt}
.ct p{margin:0 0 3pt}
.ct p:last-child{margin:0}
.ct ul{margin:2pt 0 0;padding-left:11pt}
.ct-test{border-color:#1a5cff;background:#f2f6ff}.ct-test .ctl{color:#1a5cff}
.ct-risk{border-color:#c92a2a;background:#fdf3f3}.ct-risk .ctl{color:#c92a2a}
.ct-good{border-color:#0d8a4f;background:#f1faf5}.ct-good .ctl{color:#0d8a4f}
.ct-warn{border-color:#b8860b;background:#fffbf0}.ct-warn .ctl{color:#8a5a06}
.ct-note{border-color:#8a93a3;background:#f7f9fc}.ct-note .ctl{color:#4a5160}

ul,ol{margin:3pt 0 6pt;padding-left:12pt}
li{margin:0 0 2.5pt;line-height:1.38}
li>ul,li>ol{margin:2pt 0 0}
blockquote{margin:6pt 0;padding-left:8pt;border-left:2pt solid #dfe3ea;color:#3a4048}
.mermaid{margin:7pt 0;text-align:center;break-inside:avoid}
.mermaid svg{max-width:100%!important;height:auto!important;max-height:190mm}
pre{background:#f7f9fc;border:1px solid #eceff4;padding:5pt 7pt;overflow-x:auto;margin:5pt 0;line-height:1.36}
`

const html = `<!doctype html><html><head><meta charset="utf-8"><title>${docTitle}</title><style>${CSS}</style></head>
<body>
<div class="mast"><h1 class="mt">${docTitle}${docSub ? `<span class="b">${docSub}</span>` : ''}</h1>
<div class="mlabel">${LABEL}<br>${[stamp, CLASSN].filter(Boolean).join(' &nbsp;·&nbsp; ')}</div></div>
${lede ? `<p class="lede">${lede}</p>` : ''}
${keyfigs}
${h}
<script>${fs.existsSync(MERMAID) ? fs.readFileSync(MERMAID, 'utf8') : ''}</script>
<script>
(function(){
  if (typeof __esbuild_esm_mermaid_nm === 'undefined') { document.documentElement.setAttribute('data-mermaid','none'); return }
  var ns = __esbuild_esm_mermaid_nm.mermaid; var M = ns.default || ns;
  M.initialize({ startOnLoad:false, securityLevel:'loose', theme:'base',
    flowchart:{htmlLabels:true,curve:'basis',nodeSpacing:30,rankSpacing:34,useMaxWidth:true},
    themeVariables:{fontFamily:'"Google Sans",system-ui,sans-serif',fontSize:'12px',
      background:'#ffffff',primaryColor:'#ffffff',primaryTextColor:'#14161a',primaryBorderColor:'#1a5cff',
      secondaryColor:'#f2f6ff',tertiaryColor:'#f7f9fc',lineColor:'#8a93a3',textColor:'#14161a',
      nodeBorder:'#1a5cff',clusterBkg:'#f7f9fc',clusterBorder:'#dfe3ea',mainBkg:'#ffffff'}});
  var nodes = [].slice.call(document.querySelectorAll('.mermaid')); var failed = 0;
  Promise.all(nodes.map(function(node,i){
    return M.render('d'+i, node.textContent).then(function(out){
      node.innerHTML = out.svg; var s = node.querySelector('svg');
      if (s) { s.removeAttribute('style'); s.removeAttribute('width'); s.removeAttribute('height');
               s.setAttribute('preserveAspectRatio','xMidYMid meet'); }
    }).catch(function(e){ failed++; node.innerHTML = '<div style="border:1px solid #c00;padding:6px;color:#c00;font:11px monospace">DIAGRAM '+i+' FAILED: '+String(e&&e.message)+'</div>'; });
  })).then(function(){ document.documentElement.setAttribute('data-mermaid', failed?'failed:'+failed:'done'); });
})();
</script>
</body></html>`

const dir = path.resolve(path.dirname(input))
const htmlPath = path.join(dir, `${outBase}.print.html`)
fs.writeFileSync(htmlPath, html)
console.log('print html:', htmlPath, (html.length / 1048576).toFixed(2), 'MB |', words, 'words |', diagrams, 'diagrams')

const pdfPath = path.join(dir, `${outBase}.pdf`)
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
if (!fs.existsSync(chrome)) { console.log('chrome not found — html written'); process.exit(0) }

// Chrome writes the PDF then keeps running; watch the FILE and its %%EOF trailer,
// never the process (LR#74). Chrome also cannot spawn inside the Bash sandbox.
//
// REMOVE THE TARGET FIRST. Without this, a complete PDF left by a previous run
// satisfies the %%EOF check on the first poll, so the builder reports success
// instantly and hands back the OLD document. An artifact check is only as good as
// its guarantee that the artifact is fresh.
try { fs.unlinkSync(pdfPath) } catch {}
const child = spawn(chrome, ['--headless', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer',
  '--no-first-run', '--disable-crash-reporter', '--virtual-time-budget=60000',
  '--run-all-compositor-stages-before-draw',
  `--user-data-dir=${fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'fm-brief-'))}`,
  `--print-to-pdf=${pdfPath}`, `file://${htmlPath}`], { stdio: 'ignore', detached: true })

const complete = () => {
  if (!fs.existsSync(pdfPath)) return 0
  const size = fs.statSync(pdfPath).size
  if (size < 1024) return 0
  const fd = fs.openSync(pdfPath, 'r'); const tail = Buffer.alloc(32)
  fs.readSync(fd, tail, 0, 32, size - 32); fs.closeSync(fd)
  return tail.toString('latin1').includes('%%EOF') ? size : 0
}
const DEADLINE = Date.now() + Number(process.env.FM_PDF_TIMEOUT_MS || 300_000)
let size = 0
while (!(size = complete()) && Date.now() < DEADLINE) await new Promise((r) => setTimeout(r, 350))
try { process.kill(-child.pid, 'SIGKILL') } catch {}
if (!size) { console.error('chrome did not produce a complete pdf'); process.exit(1) }
const pages = (fs.readFileSync(pdfPath, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length
console.log(`pdf: ${pdfPath} ${(size / 1048576).toFixed(2)} MB · ${pages} pages`)
