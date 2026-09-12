// Concatenate the tree into one paginated A4 document and render to PDF via headless Chrome.
import fs from 'node:fs'; import path from 'node:path'
import { unified } from 'unified'
import remarkParse from 'remark-parse'; import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'; import rehypeStringify from 'rehype-stringify'
const ROOT=path.resolve('.'), TREE=path.join(ROOT,'docs/mdmax/tree'), OUT=path.join(ROOT,'docs/mdmax')
const FONTS=path.join(process.env.HOME,'Library/Fonts')
const face=(f,w)=>{const p=path.join(FONTS,f); if(!fs.existsSync(p))return''
  return `@font-face{font-family:Mosvita;font-weight:${w};font-display:block;src:url(data:font/otf;base64,${fs.readFileSync(p).toString('base64')}) format("opentype")}`}
const FONTCSS=[face('Mosvita-Regular.otf',400),face('Mosvita-Bold.otf',700),face('Mosvita-Black.otf',900)].join('')
const graph=JSON.parse(fs.readFileSync(path.join(TREE,'graph.json'),'utf8'))
const proc=unified().use(remarkParse).use(remarkGfm).use(remarkRehype,{allowDangerousHtml:true}).use(rehypeStringify,{allowDangerousHtml:true})
const strip=s=>{const m=s.match(/^---\n[\s\S]*?\n---\n/); return m?s.slice(m[0].length):s}
const slug=t=>t.toLowerCase().replace(/[^\w\s-]/g,'').trim().replace(/\s+/g,'-').slice(0,60)
let toc='', body=''
for(const s of graph){
  const raw=strip(fs.readFileSync(path.join(TREE,`${s.slug}.md`),'utf8'))
  // drop the nav + links blocks — they are web affordances, meaningless in print
  const clean=raw.replace(/^\[← Index\][\s\S]*?\n\n/,'').replace(/\n---\n\n### Links\n[\s\S]*$/,'')
  let h=String(proc.processSync(clean))
  h=h.replace(/href="([^"#]*)\.md(#[^"]*)?"/g,(_,p,f)=>`href="${f||'#sec-'+p.slice(0,2).replace(/^0/,'')}"`)
  h=h.replace(/<(h[23])>([\s\S]*?)<\/\1>/g,(m,t,i)=>`<${t} id="${slug(i.replace(/<[^>]+>/g,''))}">${i}</${t}>`)
  h=h.replace(/<table>/g,'<div class="tw"><table>').replace(/<\/table>/g,'</table></div>')
  toc+=`<div class="tr"><span class="tn">${String(s.n).padStart(2,'0')}</span><a href="#sec-${s.n}">${s.title}</a><span class="tp">${s.lines.toLocaleString()} ln</span></div>`
  body+=`<section class="chap" id="sec-${s.n}"><div class="chead"><span class="cn">§${s.n}</span><h2>${s.short}</h2></div><p class="csub">${s.title}</p>${h}</section>`
}
const L=graph.reduce((a,s)=>a+s.lines,0), W=graph.reduce((a,s)=>a+s.words,0)
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>MDMAX — the complete build plan</title><style>
${FONTCSS}
@page{size:A4;margin:18mm 16mm 16mm}
*,*::before,*::after{box-sizing:border-box}
:root{--blue:#1a5cff;--ink:#111318;--ink2:#4a5160;--ink3:#7b8393;--hair:#e4e7ec;--bg2:#fafbfc;
 --mono:ui-monospace,SFMono-Regular,Menlo,monospace;--sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;--disp:Mosvita,var(--sans)}
body{margin:0;color:var(--ink);font:400 9.6pt/1.55 var(--sans)}
a{color:var(--blue);text-decoration:none}
h1{font:900 30pt/1.05 var(--disp);letter-spacing:-.02em;margin:0 0 8mm}
h2{font:700 15pt/1.15 var(--disp);margin:0}
h3{font:700 11.5pt/1.25 var(--sans);margin:7mm 0 2.5mm;break-after:avoid}
h4{font:600 10pt/1.3 var(--sans);margin:5mm 0 2mm;break-after:avoid}
p{margin:0 0 3.2mm}
li{margin:0 0 1.4mm}
code{font:400 .86em var(--mono);background:var(--bg2);border:.4pt solid var(--hair);padding:.3mm 1mm}
pre{background:var(--bg2);border:.4pt solid var(--hair);padding:3mm;margin:3.5mm 0;overflow:hidden;break-inside:avoid}
pre code{border:0;background:none;padding:0;font-size:7.6pt;line-height:1.45;white-space:pre-wrap;word-break:break-word}
.tw{margin:3.5mm 0;break-inside:avoid}
table{border-collapse:collapse;width:100%;font-size:8pt}
th,td{padding:1.5mm 2mm;text-align:left;border-bottom:.4pt solid var(--hair);vertical-align:top}
th{font:400 7pt var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--ink3);background:var(--bg2)}
blockquote{margin:3.5mm 0;padding-left:4mm;border-left:1.2pt solid var(--blue);color:var(--ink2)}
hr{border:0;border-top:.4pt solid var(--hair);margin:6mm 0}
.cover{height:255mm;display:flex;flex-direction:column;justify-content:space-between;break-after:page}
.ctop .k{font:400 8pt var(--mono);letter-spacing:.2em;text-transform:uppercase;color:var(--blue)}
.cover .lede{font:400 12pt/1.5 var(--sans);color:var(--ink2);max-width:120mm;margin:6mm 0 0}
.cmeta{display:flex;gap:8mm;flex-wrap:wrap;font:400 8pt/1.6 var(--mono);color:var(--ink3);
 border-top:.4pt solid var(--hair);padding-top:5mm}
.cmeta b{display:block;font:900 16pt/1 var(--disp);color:var(--blue);margin-bottom:1.5mm}
.toc{break-after:page}
.toc h2{margin:0 0 6mm}
.tr{display:flex;align-items:baseline;gap:3mm;padding:2.2mm 0;border-bottom:.4pt solid var(--hair)}
.tn{font:400 8pt var(--mono);color:var(--blue);min-width:8mm}
.tr a{flex:1;color:var(--ink);font-size:9.5pt}
.tp{font:400 7.5pt var(--mono);color:var(--ink3)}
.chap{break-before:page}
.chead{display:flex;align-items:baseline;gap:3mm;border-bottom:1.2pt solid var(--blue);padding-bottom:2.5mm}
.cn{font:900 15pt/1 var(--disp);color:var(--blue)}
.csub{font:400 8.5pt var(--mono);color:var(--ink3);margin:2mm 0 6mm}
</style></head><body>
<div class="cover"><div class="ctop"><p class="k">SGNK · Engineering record · v2.1.0</p>
<h1>MDMAX</h1><p class="lede"><b>frontmatter is Google Docs for markdown.</b> MDMAX is the small library underneath it that makes writing to those files safe.</p>
<p class="lede" style="font-size:9.5pt;margin-top:5mm">The complete build plan. Consolidates three research workflows, one deep-reasoning pass and the full conversation record. Research is closed; what follows is a build order.</p></div>
<div class="cmeta"><div><b>${graph.length}</b>sections</div><div><b>${L.toLocaleString()}</b>lines</div><div><b>${(W/1000).toFixed(0)}k</b>words</div><div><b>95</b>agents</div><div><b>~18M</b>research tokens</div></div></div>
<section class="toc"><h2>Contents</h2>${toc}</section>${body}</body></html>`
fs.writeFileSync(path.join(OUT,'plan.print.html'),html)
console.log('print html:', (html.length/1024/1024).toFixed(2),'MB')
