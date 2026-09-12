// Build the MDMAX plan tree into a static site on the sgnk design chassis.
// Source of truth is docs/mdmax/tree/*.md — the site is a PROJECTION, never edited by hand.
// Pipeline: remark-parse -> remark-gfm -> remark-rehype -> rehype-stringify.
// That is deliberately the same toolchain the engine spec specifies.

import fs from 'node:fs'
import path from 'node:path'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const ROOT = path.resolve(process.argv[2] ?? '.')
const TREE = path.join(ROOT, 'docs/mdmax/tree')
const OUT = path.join(ROOT, 'docs/mdmax/site')
const FONTS = path.join(process.env.HOME, 'Library/Fonts')

fs.mkdirSync(OUT, { recursive: true })

// ---------- fonts: Mosvita, embedded as data URIs so the page needs zero network ----------
function face(file, weight) {
  const p = path.join(FONTS, file)
  if (!fs.existsSync(p)) return ''
  const b64 = fs.readFileSync(p).toString('base64')
  return `@font-face{font-family:Mosvita;font-style:normal;font-weight:${weight};font-display:block;` +
    `src:url(data:font/otf;base64,${b64}) format("opentype")}`
}
const FONTCSS = [
  face('Mosvita-Regular.otf', 400),
  face('Mosvita-Bold.otf', 700),
  face('Mosvita-Black.otf', 900),
].join('')

// ---------- icons: Material Symbols as INLINE SVG. Never a web font, never emoji (LR#52) ----------
const ICON = {
  menu: 'M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z',
  north: 'M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z',
  link: 'M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z',
  desc: 'M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T760-80H240Zm280-520v-200H240v640h520v-440H520ZM240-800v200-200 640-640Z',
  dark: 'M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z',
}
const svg = (n, s = 20) =>
  `<svg viewBox="0 -960 960 960" width="${s}" height="${s}" fill="currentColor" aria-hidden="true"><path d="${ICON[n]}"/></svg>`

// ---------- read the tree ----------
const graph = JSON.parse(fs.readFileSync(path.join(TREE, 'graph.json'), 'utf8'))
const files = fs.readdirSync(TREE).filter(f => f.endsWith('.md')).sort()

function splitFm(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n/)
  if (!m) return [{}, src]
  const fm = {}
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':')
    if (i > 0) fm[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '')
  }
  return [fm, src.slice(m[0].length)]
}

const proc = unified().use(remarkParse).use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true }).use(rehypeStringify, { allowDangerousHtml: true })

// ---------- shell ----------
const CSS = `
${FONTCSS}
*,*::before,*::after{box-sizing:border-box}
:root{
  --blue:#1a5cff; --ink:#111318; --ink-2:#4a5160; --ink-3:#7b8393;
  --bg:#fff; --bg-2:#fafbfc; --hair:#e4e7ec; --sel:#1a5cff1a;
  --mono:"Google Sans Code",ui-monospace,SFMono-Regular,Menlo,monospace;
  --sans:"Google Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
  --disp:Mosvita,var(--sans);
  --col:760px; --rail:280px;
}
@media (prefers-color-scheme:dark){:root{--ink:#e8eaf0;--ink-2:#a8b0c0;--ink-3:#767e8f;--bg:#0d0f14;--bg-2:#12151c;--hair:#232833;--sel:#1a5cff33}}
:root[data-theme=dark]{--ink:#e8eaf0;--ink-2:#a8b0c0;--ink-3:#767e8f;--bg:#0d0f14;--bg-2:#12151c;--hair:#232833;--sel:#1a5cff33}
:root[data-theme=light]{--ink:#111318;--ink-2:#4a5160;--ink-3:#7b8393;--bg:#fff;--bg-2:#fafbfc;--hair:#e4e7ec;--sel:#1a5cff1a}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:400 16px/1.65 var(--sans);
  font-feature-settings:"kern","liga";text-rendering:optimizeLegibility}
::selection{background:var(--sel)}
a{color:var(--blue);text-decoration:none;text-underline-offset:2px}
a:hover{text-decoration:underline}
.prog{position:fixed;top:0;left:0;height:2px;background:var(--blue);width:0;z-index:60;transition:width .1s linear}
.top{position:fixed;top:0;left:0;right:0;height:56px;display:flex;align-items:center;gap:16px;
  padding:0 20px;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(12px);
  border-bottom:1px solid transparent;z-index:50;transition:border-color .2s}
.top.lift{border-bottom-color:var(--hair)}
.brand{font:900 15px/1 var(--disp);letter-spacing:.14em;text-transform:uppercase;color:var(--ink)}
.brand b{color:var(--blue)}
.top .meta{font:400 11px/1 var(--mono);color:var(--ink-3);letter-spacing:.08em;text-transform:uppercase}
.top .sp{flex:1}
.iconbtn{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;
  border:1px solid var(--hair);background:transparent;color:var(--ink-2);cursor:pointer;padding:0}
.iconbtn:hover{color:var(--blue);border-color:var(--blue)}
.wrap{display:grid;grid-template-columns:var(--rail) minmax(0,1fr) var(--rail);gap:0;
  max-width:1440px;margin:0 auto;padding-top:56px}
.side{position:sticky;top:56px;height:calc(100vh - 56px);overflow-y:auto;padding:32px 20px 64px;
  border-right:1px solid var(--hair)}
.side h4,.toc h4{font:400 10px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;
  color:var(--ink-3);margin:0 0 14px}
.side ol{list-style:none;margin:0;padding:0;counter-reset:s}
.side li{margin:0 0 1px}
.side a{display:flex;gap:10px;padding:7px 10px;color:var(--ink-2);font-size:13.5px;line-height:1.35;
  border-left:2px solid transparent}
.side a:hover{background:var(--bg-2);color:var(--ink);text-decoration:none}
.side a.on{border-left-color:var(--blue);color:var(--blue);background:var(--bg-2);font-weight:500}
.side .num{font:400 11px/1.5 var(--mono);color:var(--ink-3);min-width:18px}
.side a.on .num{color:var(--blue)}
main{min-width:0;padding:56px 56px 120px;max-width:calc(var(--col) + 112px);margin:0 auto}
.toc{position:sticky;top:56px;height:calc(100vh - 56px);overflow-y:auto;padding:32px 20px 64px;
  border-left:1px solid var(--hair)}
.toc a{display:block;padding:5px 0 5px 12px;color:var(--ink-3);font-size:12.5px;line-height:1.4;
  border-left:1px solid var(--hair)}
.toc a:hover{color:var(--ink)}
.toc a.on{color:var(--blue);border-left-color:var(--blue)}
.toc a.h3{padding-left:24px;font-size:12px}
.kick{font:400 11px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--blue);
  margin:0 0 14px}
h1{font:900 clamp(34px,5vw,52px)/1.06 var(--disp);letter-spacing:-.02em;margin:0 0 20px}
h2{font:700 clamp(24px,3.2vw,32px)/1.14 var(--disp);letter-spacing:-.01em;margin:72px 0 18px;
  scroll-margin-top:76px}
h3{font:700 19px/1.28 var(--sans);margin:44px 0 12px;scroll-margin-top:76px}
h4{font:600 16px/1.35 var(--sans);margin:32px 0 10px}
p{margin:0 0 18px;max-width:68ch}
main>ul,main>ol{max-width:66ch}
li{margin:0 0 7px}
strong{font-weight:600;color:var(--ink)}
blockquote{margin:26px 0;padding:2px 0 2px 20px;border-left:2px solid var(--blue);color:var(--ink-2)}
blockquote p:last-child{margin:0}
hr{border:0;border-top:1px solid var(--hair);margin:56px 0}
code{font:400 .875em/1.5 var(--mono);background:var(--bg-2);border:1px solid var(--hair);padding:1px 5px}
pre{background:var(--bg-2);border:1px solid var(--hair);padding:18px 20px;overflow-x:auto;margin:24px 0}
pre code{background:none;border:0;padding:0;font-size:12.5px;line-height:1.6}
.tw{overflow-x:auto;margin:26px 0;border:1px solid var(--hair)}
table{border-collapse:collapse;width:100%;font-size:14px}
th,td{padding:9px 13px;text-align:left;border-bottom:1px solid var(--hair);vertical-align:top}
th{font:400 10.5px/1.3 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3);
  background:var(--bg-2);white-space:nowrap}
tr:last-child td{border-bottom:0}
img{max-width:100%;height:auto}
.nav{display:flex;gap:10px;flex-wrap:wrap;font-size:13px;margin:0 0 40px;padding-bottom:20px;
  border-bottom:1px solid var(--hair)}
.links{margin-top:72px;padding-top:28px;border-top:1px solid var(--hair);font-size:13.5px}
.links h3{margin:0 0 12px;font:400 10px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--ink-3)}
.chips{display:flex;flex-wrap:wrap;gap:7px;margin:0 0 22px}
.chip{display:inline-flex;align-items:center;gap:6px;padding:5px 11px;border:1px solid var(--hair);
  font-size:12.5px;color:var(--ink-2)}
.chip:hover{border-color:var(--blue);color:var(--blue);text-decoration:none}
.pager{display:flex;justify-content:space-between;gap:16px;margin-top:56px;padding-top:28px;
  border-top:1px solid var(--hair)}
.pager a{display:block;max-width:46%}
.pager .l{font:400 10px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--ink-3);
  display:block;margin-bottom:5px}
.pager .t{font-weight:600;color:var(--ink);font-size:14px}
.pager a:hover .t{color:var(--blue)}
.pager .r{text-align:right}
.up{position:fixed;right:24px;bottom:24px;width:40px;height:40px;border-radius:999px;
  display:flex;align-items:center;justify-content:center;background:var(--bg);border:1px solid var(--hair);
  color:var(--ink-2);opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;z-index:40;
  box-shadow:0 2px 12px rgba(0,0,0,.07);cursor:pointer}
.up.on{opacity:1;pointer-events:auto}
.up:hover{color:var(--blue);border-color:var(--blue);transform:translateY(-2px)}
.hero{border:1px solid var(--hair);border-left:2px solid var(--blue);padding:26px 28px;margin:0 0 46px;background:var(--bg-2)}
.hero p{margin:0;font-size:16.5px;color:var(--ink-2)}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:0;margin:34px 0;
  border:1px solid var(--hair)}
.stat{padding:16px 18px;border-right:1px solid var(--hair)}
.stat:last-child{border-right:0}
.stat .v{font:900 24px/1 var(--disp);color:var(--blue)}
.stat .k{font:400 10px/1.4 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--ink-3);margin-top:6px}
.mermaid{background:var(--bg-2);border:1px solid var(--hair);padding:20px;margin:26px 0;text-align:center}
.skip{position:absolute;left:-9999px}
.skip:focus{left:12px;top:12px;background:var(--bg);border:1px solid var(--blue);padding:8px 14px;z-index:99}
@media(max-width:1240px){.wrap{grid-template-columns:var(--rail) minmax(0,1fr)}.toc{display:none}}
@media(max-width:900px){.wrap{grid-template-columns:1fr}.side{display:none;position:static;height:auto;border-right:0;border-bottom:1px solid var(--hair)}
  .side.open{display:block}main{padding:32px 20px 90px}}
@media print{.top,.side,.toc,.up,.prog,.nav,.pager{display:none}.wrap{display:block;padding:0}
  main{max-width:none;padding:0}a{color:var(--ink)}pre,table,.tw{break-inside:avoid}h2,h3{break-after:avoid}}
`

const JS = `
const d=document,root=d.documentElement;
const prog=d.querySelector('.prog'),top=d.querySelector('.top'),up=d.querySelector('.up');
function onScroll(){const h=d.body.scrollHeight-innerHeight;const y=scrollY;
  if(prog)prog.style.width=(h>0?(y/h*100):0)+'%';
  if(top)top.classList.toggle('lift',y>8);
  if(up)up.classList.toggle('on',y>600);}
addEventListener('scroll',onScroll,{passive:true});onScroll();
up&&up.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
const mb=d.querySelector('#mb');mb&&mb.addEventListener('click',()=>d.querySelector('.side').classList.toggle('open'));
const tb=d.querySelector('#tb');
if(tb){const K='mdmax-theme';const s=localStorage.getItem(K);if(s)root.dataset.theme=s;
  tb.addEventListener('click',()=>{const cur=root.dataset.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
    const nx=cur==='dark'?'light':'dark';root.dataset.theme=nx;localStorage.setItem(K,nx);});}
const links=[...d.querySelectorAll('.toc a')];
const heads=links.map(a=>d.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)))).filter(Boolean);
if(heads.length){const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){
  links.forEach(a=>a.classList.remove('on'));
  const a=links.find(a=>decodeURIComponent(a.getAttribute('href').slice(1))===e.target.id);a&&a.classList.add('on');}})},
  {rootMargin:'-76px 0px -70% 0px'});heads.forEach(h=>io.observe(h));}
`

function slugify(t) {
  return t.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60)
}

function shell({ title, kicker, bodyHtml, toc, sidebar, pager, meta }) {
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — MDMAX</title>
<meta name="description" content="MDMAX — the complete build plan. ${title}">
<style>${CSS}</style></head><body>
<a class="skip" href="#main">Skip to content</a>
<div class="prog"></div>
<header class="top">
  <button class="iconbtn" id="mb" aria-label="Menu">${svg('menu')}</button>
  <a class="brand" href="index.html">MD<b>MAX</b></a>
  <span class="meta">${meta}</span><span class="sp"></span>
  <button class="iconbtn" id="tb" aria-label="Toggle theme">${svg('dark')}</button>
</header>
<div class="wrap">
  <nav class="side" aria-label="Sections"><h4>The plan</h4><ol>${sidebar}</ol></nav>
  <main id="main">${kicker ? `<p class="kick">${kicker}</p>` : ''}${bodyHtml}${pager}</main>
  <aside class="toc" aria-label="On this page"><h4>On this page</h4>${toc}</aside>
</div>
<button class="up" aria-label="Back to top">${svg('north')}</button>
<script>${JS}</script></body></html>`
}

// ---------- build each section ----------
const bySlug = Object.fromEntries(graph.map(s => [s.slug, s]))
const sidebarFor = (cur) => graph.map(s =>
  `<li><a href="${s.slug}.html"${s.slug === cur ? ' class="on"' : ''}>` +
  `<span class="num">${String(s.n).padStart(2, '0')}</span><span>${s.short}</span></a></li>`).join('')

let built = 0
for (const f of files) {
  if (f === 'README.md') continue
  const raw = fs.readFileSync(path.join(TREE, f), 'utf8')
  const [, body] = splitFm(raw)
  const slug = f.replace(/\.md$/, '')
  const s = bySlug[slug]
  let html = String(proc.processSync(body))

  // .md links -> .html
  html = html.replace(/href="([^"]+)\.md(#[^"]*)?"/g, (_, p, h) => `href="${p === 'README' ? 'index' : p}.html${h || ''}"`)
  // mermaid fences -> native blocks (rendered by the artifact host, no library needed)
  html = html.replace(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
    (_, c) => `<pre class="mermaid">${c}</pre>`)
  // heading ids + TOC
  const toc = []
  html = html.replace(/<(h[23])>([\s\S]*?)<\/\1>/g, (m, tag, inner) => {
    const text = inner.replace(/<[^>]+>/g, '')
    const id = slugify(text)
    toc.push(`<a href="#${id}"${tag === 'h3' ? ' class="h3"' : ''}>${text}</a>`)
    return `<${tag} id="${id}">${inner}</${tag}>`
  })
  // tables get a scroll container so the page body never scrolls sideways
  html = html.replace(/<table>/g, '<div class="tw"><table>').replace(/<\/table>/g, '</table></div>')

  const prev = s.n > 1 ? graph[s.n - 2] : null
  const next = s.n < graph.length ? graph[s.n] : null
  const pager = `<div class="pager">` +
    (prev ? `<a href="${prev.slug}.html"><span class="l">Previous</span><span class="t">§${prev.n} ${prev.short}</span></a>` : '<span></span>') +
    (next ? `<a class="r" href="${next.slug}.html"><span class="l">Next</span><span class="t">§${next.n} ${next.short}</span></a>` : '<span></span>') +
    `</div>`

  fs.writeFileSync(path.join(OUT, `${slug}.html`), shell({
    title: `§${s.n} ${s.short}`, kicker: `Section ${s.n} of ${graph.length}`,
    bodyHtml: html, toc: toc.join(''), sidebar: sidebarFor(slug), pager,
    meta: `${s.lines.toLocaleString()} lines · ${s.words.toLocaleString()} words`,
  }))
  built++
}

// ---------- index ----------
{
  const raw = fs.readFileSync(path.join(TREE, 'README.md'), 'utf8')
  const [, body] = splitFm(raw)
  let html = String(proc.processSync(body))
  html = html.replace(/href="([^"]+)\.md(#[^"]*)?"/g, (_, p, h) => `href="${p === 'README' ? 'index' : p}.html${h || ''}"`)
  const toc = []
  html = html.replace(/<(h[23])>([\s\S]*?)<\/\1>/g, (m, tag, inner) => {
    const text = inner.replace(/<[^>]+>/g, ''); const id = slugify(text)
    toc.push(`<a href="#${id}"${tag === 'h3' ? ' class="h3"' : ''}>${text}</a>`)
    return `<${tag} id="${id}">${inner}</${tag}>`
  })
  html = html.replace(/<table>/g, '<div class="tw"><table>').replace(/<\/table>/g, '</table></div>')
  const L = graph.reduce((a, s) => a + s.lines, 0), W = graph.reduce((a, s) => a + s.words, 0)
  const E = graph.reduce((a, s) => a + s.forward.length, 0)
  const stats = `<div class="stats">
    <div class="stat"><div class="v">${graph.length}</div><div class="k">Sections</div></div>
    <div class="stat"><div class="v">${L.toLocaleString()}</div><div class="k">Lines</div></div>
    <div class="stat"><div class="v">${(W / 1000).toFixed(0)}k</div><div class="k">Words</div></div>
    <div class="stat"><div class="v">${E}</div><div class="k">Links</div></div>
    <div class="stat"><div class="v">95</div><div class="k">Agents</div></div>
  </div>`
  html = html.replace('<hr>', stats + '<hr>')
  fs.writeFileSync(path.join(OUT, 'index.html'), shell({
    title: 'The plan', kicker: 'MDMAX · build plan v2.1.0',
    bodyHtml: html, toc: toc.join(''), sidebar: sidebarFor(''), pager: '',
    meta: `v2.1.0 · ${new Date().toISOString().slice(0, 10)}`,
  }))
  built++
}

console.log(`built ${built} pages -> docs/mdmax/site/`)
console.log(`fonts embedded: ${FONTCSS ? (FONTCSS.match(/@font-face/g) || []).length : 0} Mosvita weights`)
