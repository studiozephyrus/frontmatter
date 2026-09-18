// Generates the product-plan screen designs as static HTML in the md.sgnk.ai theme
// (src/app/globals.css tokens and component classes): one desktop file and one
// phone file per screen. Icons are Google Material Symbols Rounded as inline SVG.
// Fonts are the app's Google Sans faces, embedded so headless Chrome renders them
// offline.
//   node docs/mvp0/screens/gen.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const ICONS = path.join(HERE, 'icons');
const FONTS = fs.readFileSync(path.join(HERE, 'fonts.css'), 'utf8');

// The free-tier caps, in one place. The plan document quotes the same numbers.
const CAPS = { docs: 50, pub: 5, collab: 1, edits: 10, kits: 1, repos: 1, pushes: 20, uploads: '1 GB', history: 7 };

const iconCache = {};
// Fetch a Material Symbol on demand and keep it in the repo, so adding an icon to a
// screen needs no separate step and no scratchpad. Rounded first, outlined as a fallback.
function fetchIcon(name) {
  fs.mkdirSync(ICONS, { recursive: true });
  // Only the 960-unit Material Symbols box is accepted. Some files in the GitHub repository
  // are the older 24-unit drawings, which ic() would render blank (audit row 81), so the
  // Google Fonts copy is tried first and anything else is refused.
  const urls = [`https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsrounded/${name}/default/24px.svg`]
    .concat(['materialsymbolsrounded', 'materialsymbolsoutlined'].map(style => `https://raw.githubusercontent.com/google/material-design-icons/master/symbols/web/${name}/${style}/${name}_24px.svg`));
  for (const u of urls) {
    try {
      const body = execFileSync('curl', ['-sfL', '-m', '25', u], { encoding: 'utf8' });
      if (/<path[^>]*\sd="/.test(body) && body.includes('viewBox="0 -960 960 960"')) {
        fs.writeFileSync(path.join(ICONS, name + '.svg'), body);
        return true;
      }
    } catch { /* try the next style */ }
  }
  return false;
}

function ic(name, size = 18, cls = '') {
  if (!iconCache[name]) {
    const f = path.join(ICONS, name + '.svg');
    if (!fs.existsSync(f) && !fetchIcon(name)) throw new Error('icon missing and could not be fetched: ' + name);
    const raw = fs.readFileSync(f, 'utf8');
    if (!raw.includes('viewBox="0 -960 960 960"')) throw new Error('icon not in the 960-unit box, refetch it: ' + name);
    const m = /<path[^>]*d="([^"]+)"/.exec(raw);
    if (!m) throw new Error('no path in icon ' + name);
    iconCache[name] = m[1];
  }
  return `<svg class="ic ${cls}" width="${size}" height="${size}" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="${iconCache[name]}"/></svg>`;
}

const CSS = `
${FONTS}
:root{
  --bg:#fafafa;--bg-subtle:#fafafa;--panel:#fafafa;--panel-2:rgba(10,10,10,.025);--fg:#18181b;--fg-muted:#6b6b73;--muted:#73737b;
  --border:rgba(10,10,10,.06);--border-strong:rgba(10,10,10,.10);--accent:#18181b;--accent-hover:#0a0a0a;--accent-fg:#fafafa;
  --accent-soft:rgba(10,10,10,.04);--hover:rgba(10,10,10,.04);--active:rgba(10,10,10,.05);--selected:rgba(10,10,10,.09);
  --ring:rgba(91,33,182,.40);--link:#0044cc;--link-hover:#0055ff;--danger:#aa5e5a;--success:#487d60;--ai:#0055ff;
  --radius-sm:6px;--radius:8px;--radius-lg:12px;
  --font-sans:"Google Sans","Roboto",ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
  --font-mono:"Google Sans Code","JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;
}
.dark{--bg:#1a1a1a;--bg-subtle:#161616;--panel:#1a1a1a;--panel-2:rgba(255,255,255,.035);--fg:#ededed;--fg-muted:rgba(237,237,237,.62);--muted:rgba(237,237,237,0.50);
  --border:rgba(255,255,255,.09);--border-strong:rgba(255,255,255,.14);--accent:#ededed;--accent-hover:#fff;--accent-fg:#1a1a1a;
  --accent-soft:rgba(255,255,255,.05);--hover:rgba(255,255,255,.04);--active:rgba(255,255,255,.05);--selected:rgba(255,255,255,.12);
  --link:#5b9eff;--link-hover:#80b6ff;--danger:#d49391;--success:#7fb09a;--ai:#5b9eff}
*{box-sizing:border-box}
html,body{margin:0;height:100%;background:var(--bg);color:var(--fg);font-family:var(--font-sans);font-size:13px;line-height:1.5;
  -webkit-font-smoothing:antialiased;overflow:hidden}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
.ic{flex:none;vertical-align:-3px}
u{text-decoration-thickness:1px;text-underline-offset:2px}
.app{display:flex;flex-direction:column;height:100vh;width:100vw}
.top{height:52px;flex-shrink:0}
.tabs{flex-shrink:0}
.body{flex:1;min-height:0}
/* top bar */
.top{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:0 14px;border-bottom:1px solid var(--border);background:var(--panel)}
.topleft{display:flex;align-items:center;gap:6.4px;flex-shrink:0}
.wordmark{font-weight:650;font-size:15.2px;letter-spacing:-.02em;color:var(--fg)}
.vsep{width:1px;height:20px;background:var(--border);margin:0 2.4px}
.uname{font-size:13.6px;color:var(--fg-muted);font-weight:450}
.mark{display:inline-grid;place-items:center;width:26px;height:26px;border-radius:7px;background:var(--accent);color:var(--accent-fg);
  font-size:13px;font-weight:800;letter-spacing:-.04em}
.mark.lg{width:44px;height:44px;border-radius:11px;font-size:20px}
.topicons{display:flex;gap:2px;margin-left:2px}
.ibtn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;color:var(--fg-muted)}
.ibtn:hover{background:var(--hover);color:var(--fg)}
.tabs{display:flex;align-items:stretch;height:38px;overflow:hidden;min-width:0;border-bottom:1px solid var(--border);background:var(--bg-subtle)}
.tab{display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 10px 0 14px;font-size:13px;font-weight:450;color:var(--muted);
  border-right:1px solid var(--border);position:relative;white-space:nowrap}
.tab .sw{width:7px;height:7px;border-radius:50%;flex:none}
.tab.on{color:var(--fg);background:var(--bg)}
.tab.on::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--accent)}
.tab .x{width:18px;height:18px;display:inline-grid;place-items:center;border-radius:4px;color:var(--muted);font-size:13px}
.tab.on .x{color:var(--fg-muted)}
.tab.newtab{padding:0 10px;border-right:0;color:var(--muted)}
.topright{display:flex;align-items:center;gap:6px;margin-left:auto}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:30px;padding:0 12px;font-size:13px;font-weight:500;color:var(--fg);
  background:var(--panel-2);border:1px solid var(--border);border-radius:var(--radius-sm);white-space:nowrap}
.btn.primary{background:var(--accent);border-color:transparent;color:var(--accent-fg)}
.btn.ghost{background:transparent;border-color:transparent;color:var(--fg-muted)}
.btn.ai{background:var(--ai);border-color:transparent;color:#fff}
.btn.sm{height:26px;padding:0 9px;font-size:12px}
.btn.lg{height:40px;font-size:14px;padding:0 16px}
.search{display:flex;align-items:center;gap:7px;height:30px;padding:0 10px;min-width:210px;border:1px solid var(--border);border-radius:6px;color:var(--muted);background:var(--bg)}
.search kbd{margin-left:auto;font-family:var(--font-mono);font-size:10px;color:var(--muted);border:1px solid var(--border-strong);border-radius:4px;padding:1px 5px}
.avatar{width:28px;height:28px;border-radius:50%;display:inline-grid;place-items:center;font-size:11px;font-weight:600;color:#fff;background:#4f6b8b;flex:none}
.avatars{display:flex;align-items:center}
.avatars .avatar{margin-left:-6px;border:2px solid var(--bg);width:26px;height:26px;font-size:10px}
.avatars .avatar:first-child{margin-left:0}
/* body */
.body{display:grid;grid-template-columns:264px minmax(0,1fr) 304px;min-height:0}
.body.noright{grid-template-columns:264px minmax(0,1fr)}
.body.noleft{grid-template-columns:minmax(0,1fr) 304px}
.body.wide{grid-template-columns:264px minmax(0,1fr) 360px}
.side{border-right:1px solid var(--border);background:var(--bg-subtle);padding:8px;display:flex;flex-direction:column;min-height:0;overflow:hidden}
.sidehead{display:flex;align-items:center;gap:6px;padding:4px 6px 8px;color:var(--fg-muted);font-size:12px;font-weight:500}
.sidehead .sp{flex:1}
.proj{margin-top:6px}
.projrow{display:flex;align-items:center;gap:6px;padding:4px 8px;border-radius:6px;font-weight:600;font-size:12.5px;color:var(--fg)}
.projrow .sp{flex:1}
.projrow .mini{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:5px;color:var(--muted)}
.row{display:flex;align-items:center;gap:6px;width:100%;text-align:left;font-size:13px;border-radius:6px;padding:4px 8px;color:var(--fg-muted);height:26px}
.row.on{background:var(--selected);color:var(--fg);font-weight:500;box-shadow:inset 2px 0 0 var(--accent)}
.row .ic{color:var(--muted)}
.row.on .ic{color:var(--fg-muted)}
.row .n{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.row .badge{margin-left:auto;font-family:var(--font-mono);font-size:10px;color:var(--ai);background:color-mix(in srgb,var(--ai) 10%,transparent);border-radius:4px;padding:1px 5px}
.d1{padding-left:22px}.d2{padding-left:38px}
.sidefoot{margin-top:auto;padding:8px 6px 2px;font-size:11.5px;color:var(--muted);display:flex;align-items:center;gap:6px}
/* The left rail's make-and-put block, added 18 September on the founder's review:
   two primary creates plus one always-there drop hint, so upload has a home. */
.makerow{display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:6px 4px 2px}
.fseg{display:flex;gap:2px;padding:3px;margin:0 0 8px;background:var(--bg-subtle);border:1px solid var(--border);border-radius:var(--r)}
.fseg span{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:5px;height:26px;font-size:12px;font-weight:500;
  color:var(--muted);border-radius:calc(var(--r) - 2px);cursor:default}
.fseg span.on{background:var(--panel);color:var(--fg);box-shadow:0 1px 2px rgba(0,0,0,.06)}
.fseg span i{font-style:normal;font-size:11px;font-variant-numeric:tabular-nums;opacity:.75}
.sizer{display:inline-flex;align-items:center;gap:1px}
.sizer .num{min-width:22px;text-align:center;font-size:12.5px;font-variant-numeric:tabular-nums;color:var(--fg)}
.tool.sq{width:22px;min-width:22px;justify-content:center;font-size:14px}
.btn.sm{height:28px;padding:0 9px;font-size:12px;gap:5px}
.drophint{display:flex;align-items:center;gap:6px;margin:6px 4px 0;padding:7px 8px;font-size:11.5px;color:var(--muted);
  border:1px dashed var(--border);border-radius:var(--r);background:transparent}
.proj.shut .projrow{opacity:.82}
.proj .projrow .cnt{font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums;padding:0 4px}
.main{display:flex;flex-direction:column;min-width:0;min-height:0;background:var(--bg);position:relative}
.modebar{display:flex;align-items:center;gap:2px;padding:6px 10px;border-bottom:1px solid var(--border);background:var(--bg-subtle);overflow:hidden}
.seg{display:inline-flex;padding:2px;gap:2px;background:var(--panel-2);border:1px solid var(--border);border-radius:8px}
.seg span{padding:3px 11px;font-size:12px;font-weight:500;color:var(--fg-muted);border-radius:6px;white-space:nowrap}
.seg span.on{color:var(--fg);background:var(--bg)}
.seg.tight span{padding:2px 8px;font-size:11.5px}
.tools{display:flex;align-items:center;gap:2px;flex-wrap:nowrap;flex-shrink:0}
.tool{display:inline-flex;align-items:center;justify-content:center;min-width:28px;height:26px;padding:0 7px;font-family:var(--font-mono);font-size:12px;color:var(--fg-muted);border-radius:6px;border:1px solid transparent}
.tool.h{font-weight:500}
.tool.txt{font-family:var(--font-sans);font-size:12px;gap:4px;padding:0 8px;border-color:var(--border)}
.tool.on{background:var(--selected);color:var(--fg)}
.tsep{width:1px;height:16px;background:var(--border-strong);margin:0 5px}
.modebar .right{margin-left:auto;display:flex;align-items:center;gap:8px;color:var(--muted);font-size:11px;flex-shrink:0}
.doc{flex:1;min-height:0;overflow:hidden;padding:22px 48px 0;position:relative}
.md{max-width:65ch;margin:0 auto;font-size:15px;line-height:1.7;color:var(--fg)}
.md h1{font-size:1.9em;font-weight:650;letter-spacing:-.02em;line-height:1.3;margin:0 0 .6em;border-bottom:1px solid var(--border);padding-bottom:.3em}
.md h2{font-size:1.5em;font-weight:650;letter-spacing:-.01em;margin:1.6em 0 .6em;border-bottom:1px solid var(--border);padding-bottom:.25em}
.md h3{font-size:1.25em;font-weight:650;margin:1.4em 0 .5em}
.md p{margin:1em 0}
.md ul{padding-left:1.6em;margin:.6em 0}.md li{margin:.25em 0}
.md code{font-family:var(--font-mono);font-size:.86em;background:color-mix(in srgb,var(--fg) 8%,transparent);padding:.12em .38em;border-radius:5px}
.md pre{background:var(--panel-2);padding:1em 1.1em;border-radius:8px;border:1px solid var(--border);font-family:var(--font-mono);font-size:.85em;line-height:1.5;overflow:hidden;margin:.9em 0;white-space:pre}
.md table{border-collapse:collapse;margin:.9em 0;font-size:.95em}
.md th,.md td{border:1px solid var(--border);padding:.45em .8em;text-align:left}
.md th{background:var(--panel-2);font-weight:650}
.md blockquote{margin:.9em 0;padding:.3em 1.1em;border-left:3px solid var(--accent);background:var(--accent-soft);border-radius:0 6px 6px 0;color:var(--fg-muted)}
.md .callout{margin:1em 0;padding:.8em 1.1em;border:1px solid var(--border);border-left:3px solid var(--accent);border-radius:8px;background:var(--accent-soft)}
.md .callout .t{font-size:.72em;letter-spacing:.06em;text-transform:uppercase;font-weight:650;margin-bottom:.3em}
.md .ai-sug{background:color-mix(in srgb,#0055ff 16%,transparent);border-radius:3px;box-shadow:inset 0 0 0 1px color-mix(in srgb,#0055ff 30%,transparent)}
.md .ai-del{text-decoration:line-through;color:var(--muted)}
.md .chg{background:color-mix(in srgb,#b8791b 14%,transparent);border-radius:3px}
.md .cmt{background:color-mix(in srgb,#b8791b 22%,transparent);border-bottom:2px solid #b8791b}
.md.docmode{font-family:var(--font-sans);max-width:none}
.cursor{position:absolute;width:2px;height:20px;background:#b2625e}
.cursor i{position:absolute;top:-18px;left:-1px;font-style:normal;font-size:10.5px;font-weight:600;color:#fff;background:#b2625e;padding:1px 6px;border-radius:4px;white-space:nowrap}
.aibox{margin:0 48px 22px;border:1px solid var(--border);border-radius:12px;background:var(--panel-2);padding:14px 16px 12px}
.aibox .in{display:flex;align-items:center;gap:10px;height:40px;border:1px solid var(--border-strong);border-radius:10px;background:var(--bg);padding:0 12px;color:var(--muted);font-size:14px}
.aibox .in .go{margin-left:auto;width:28px;height:28px;border-radius:7px;background:var(--ai);color:#fff;display:grid;place-items:center}
.chips{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
.chip{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border:1px solid var(--border);border-radius:999px;font-size:12px;color:var(--fg-muted);background:var(--bg);white-space:nowrap}
.chip.on{border-color:var(--ai);color:var(--ai)}
.aibox .foot{display:flex;align-items:center;gap:10px;margin-top:10px;font-size:11.5px;color:var(--muted)}
.aibox .chips.alt{margin-top:8px}.aibox .lbl{font-size:11.5px;color:var(--muted);align-self:center;margin-right:2px}
.soon{display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:820px;margin-top:14px}.soon>div{border:1px dashed var(--border-strong);border-radius:12px;padding:12px 16px;font-size:12.5px;color:var(--muted)}.soon b{color:var(--fg)}
.kit .file.d2{padding-left:18px}.kit .hint{font-style:normal;font-size:10.5px;color:var(--muted);white-space:nowrap}
.chk{display:flex;align-items:flex-start;gap:8px;padding:5px 0;font-size:12.5px;color:var(--fg)}.chk .ic{margin-top:1px}.chk em{font-style:normal;color:var(--muted);font-size:11.5px;display:block}
.prob{display:flex;align-items:flex-start;gap:8px;padding:7px 0;border-bottom:1px solid var(--border);font-size:12.5px}
.prob .dot{width:7px;height:7px;border-radius:50%;margin-top:5px;flex:0 0 auto}.prob .warn{background:#d97706}.prob .err{background:#dc2626}.prob .info{background:var(--muted)}
.prob b{font-weight:550}.prob em{font-style:normal;color:var(--muted);font-size:11.5px;display:block;margin-top:1px}.prob .ln{margin-left:auto;color:var(--muted);font-size:11px;white-space:nowrap}
.attach{display:flex;gap:10px;align-items:center;border:1px solid var(--border);border-radius:10px;padding:8px 10px;margin-top:10px;background:var(--panel)}
.attach .thumb{width:74px;height:52px;border:1px solid var(--border-strong);border-radius:6px;background:var(--bg);flex:0 0 auto;overflow:hidden}
.attach .meta{font-size:12px}.attach .meta em{font-style:normal;color:var(--muted);font-size:11px;display:block}
.rail{border-left:1px solid var(--border);display:flex;flex-direction:column;min-height:0;overflow:hidden;background:var(--bg-subtle)}
.rsec{padding:12px 14px 10px;border-bottom:1px solid var(--border)}
.rsec.grow{flex:1;min-height:0;overflow:hidden}
.rh{display:flex;align-items:center;gap:6px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);font-weight:600;margin-bottom:8px}
.rh .sp{flex:1}
.ol{font-size:12.5px;color:var(--fg-muted)}
.ol div{padding:3px 0 3px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ol .l2{padding-left:12px}.ol .l3{padding-left:24px;color:var(--muted)}
.ol .on{color:var(--fg);font-weight:500}
.rrow{display:flex;align-items:center;gap:8px;height:34px;padding:0 14px;border-bottom:1px solid var(--border);font-size:13px;color:var(--fg)}
.rrow .ic{color:var(--fg-muted)}
.rrow .sp{flex:1}
.rrow .cnt{font-family:var(--font-mono);font-size:10.5px;color:var(--muted)}
.railfoot{margin-top:auto;padding:10px 12px 12px;display:flex;flex-direction:column;gap:8px}
.railfoot .two{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.tag{font-size:11px;padding:2px 8px;border-radius:999px;border:1px solid var(--border);background:var(--panel-2);color:var(--fg-muted)}
.credits{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--fg-muted)}
.meter{flex:1;height:6px;border-radius:3px;background:var(--panel-2);border:1px solid var(--border);overflow:hidden}
.meter i{display:block;height:100%;background:var(--ai)}
/* overlays */
.dim{position:absolute;inset:0;background:rgba(10,10,10,.28);display:grid;place-items:center;z-index:6}
.modal{width:440px;background:var(--bg);border:1px solid var(--border);border-radius:12px;box-shadow:0 12px 40px rgba(17,18,22,.16);padding:22px 22px 18px}
.modal h2{margin:0 0 4px;font-size:18px;font-weight:650;letter-spacing:-.01em}
.modal p{margin:0 0 14px;color:var(--fg-muted);font-size:13px}
.modal .stack{display:flex;flex-direction:column;gap:8px}
.modal .btn{height:38px;font-size:14px;justify-content:flex-start;padding:0 14px}
.modal .fine{font-size:11.5px;color:var(--muted);margin-top:12px}
.pop{position:absolute;background:var(--bg);border:1px solid var(--border-strong);border-radius:10px;box-shadow:0 12px 40px rgba(17,18,22,.16);padding:6px;min-width:250px;z-index:5}
.pop .mi{display:flex;flex-direction:column;padding:7px 10px;border-radius:6px}
.pop .mi b{font-size:13px;font-weight:500}
.pop .mi span{font-size:11.5px;color:var(--muted)}
.pop .mi.on{background:var(--hover)}
.pop .mi.row2{flex-direction:row;align-items:center;gap:10px}
.toast{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);background:var(--accent);color:var(--accent-fg);padding:8px 14px;border-radius:8px;font-size:12.5px;display:flex;gap:10px;align-items:center;box-shadow:0 8px 24px rgba(0,0,0,.2);white-space:nowrap}
.toast b{color:var(--accent-fg)}
.banner{display:flex;align-items:center;gap:10px;padding:8px 14px;background:color-mix(in srgb,#b8791b 12%,var(--bg));border-bottom:1px solid var(--border);font-size:12.5px;color:var(--fg)}
.banner .sp{flex:1}
.card{position:absolute;right:22px;bottom:22px;width:340px;background:var(--bg);border:1px solid var(--border-strong);border-radius:12px;box-shadow:0 12px 40px rgba(17,18,22,.16);padding:16px}
.card h3{margin:0 0 4px;font-size:14px;font-weight:650}
.card p{margin:0 0 12px;font-size:12.5px;color:var(--fg-muted)}
.card .acts{display:flex;gap:8px}
.suggest{display:inline-flex;gap:4px;margin-left:8px;vertical-align:middle}
.suggest .btn{height:22px;padding:0 8px;font-size:11px}
.chg-list .it{padding:10px 0;border-bottom:1px solid var(--border);font-size:12.5px}
.chg-list .it .who{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--muted);margin-bottom:4px}
.chg-list .it .q{color:var(--fg-muted)}
.chg-list .it .acts{display:flex;gap:6px;margin-top:6px}
.chg-list .it .acts .btn{height:24px;font-size:11.5px;padding:0 9px}
.pill{display:inline-flex;align-items:center;gap:5px;height:22px;padding:0 9px;font-size:11px;font-weight:500;color:var(--fg-muted);background:var(--panel-2);border:1px solid var(--border);border-radius:999px;white-space:nowrap}
.pill.ok{color:var(--success)}
.pill.ai{color:var(--ai);border-color:color-mix(in srgb,var(--ai) 30%,transparent)}
.pill.pro{color:var(--accent);border-color:var(--accent)}
.kbd{font-family:var(--font-mono);font-size:10.5px;border:1px solid var(--border-strong);border-radius:4px;padding:1px 5px;color:var(--fg-muted)}
/* generic page (settings, pricing, public) */
.page{padding:36px 56px;overflow:hidden;height:100%}
.page h1{font-size:24px;font-weight:650;letter-spacing:-.02em;margin:0 0 6px}
.page .sub{color:var(--fg-muted);margin:0 0 22px;font-size:14px}
.plans{display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:820px}
.plan{border:1px solid var(--border);border-radius:12px;padding:18px 20px;background:var(--panel)}
.plan.pro{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}
.plan .nm{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);font-weight:600}
.plan .pr{font-size:28px;font-weight:650;letter-spacing:-.02em;margin:4px 0 2px}
.plan .pr small{font-size:13px;color:var(--muted);font-weight:400;letter-spacing:0}
.plan ul{list-style:none;padding:0;margin:12px 0 14px}
.plan li{display:flex;gap:8px;align-items:flex-start;padding:4px 0;font-size:13px;color:var(--fg)}
.plan li .ic{color:var(--success);margin-top:2px}
.plan li.no{color:var(--muted)}.plan li.no .ic{color:var(--muted)}
.usage{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;max-width:920px;margin:0 0 22px}
/* configuration panel, founders only */
.cfgcols{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:28px;align-items:start}
.cfgcols .cfgt{max-width:none}
.cfgt.cfgm td{padding:0 10px;font-size:12px;height:22px;line-height:22px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cfgt.cfgm{table-layout:fixed}
.cfgt.cfgm .mid{font-family:var(--font-mono);font-size:11.5px;color:var(--fg)}
.cfgt.cfgm tr.grp td{padding:6px 10px 2px;height:28px;border-bottom:1px solid var(--border-strong);background:transparent}
.cfgt.cfgm tr.grp td>*{vertical-align:middle}
.cfgt.cfgm tr.grp b{font-weight:600;font-size:13px;margin:0 8px 0 2px}
.cfgm .gi,.pgrp .gi{display:inline-grid;place-items:center;width:18px;height:18px;border-radius:5px;background:var(--panel-2);border:1px solid var(--border);font:500 10.5px/1 var(--font-mono);color:var(--fg-muted);margin-right:6px}
.cfgt.cfgm .gcap{float:right;font-family:var(--font-mono);font-size:11px;color:var(--muted)}
.cfgt.cfgm tr.off td{opacity:.6}
.cfgt.cfgm .st{font-size:11px;color:var(--muted)}
.cfgt.cfgm .st.pro{color:var(--accent);font-weight:500}
.cfgt.cfgm .cfgsw{display:inline-block;width:26px;height:15px;vertical-align:middle}
.cfgt.cfgm .cfgsw i{width:9px;height:9px;top:2px;left:2px}
.cfgt.cfgm .cfgsw.on i{left:auto;right:2px}
.cfgcols .cfgv{min-width:0;height:24px;font-size:11.5px;white-space:nowrap}
.cfgcols td{white-space:nowrap}

.cfgref .l{display:flex;gap:8px;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);font-size:12px;color:var(--fg-muted)}
.cfgref .l b{color:var(--fg);font-weight:500;white-space:nowrap}
.cfgref .l .ic{color:var(--danger)}
.cfgnote{font-size:12px;color:var(--muted);margin-top:12px;line-height:1.5}
.pgrp{border:1px solid var(--border);border-radius:10px;background:var(--panel);margin-bottom:8px;overflow:hidden}
.pgrp.off{opacity:.6}
.pgrp .ph{display:flex;align-items:center;gap:6px;padding:10px 10px;font-size:13px}
.pgrp .ph b{font-weight:600}
.pgrp .ph .sp{flex:1}
.pgrp .ph .cnt{font-size:11px;color:var(--muted);font-family:var(--font-mono)}
.pgrp .pm{display:flex;flex-direction:column;padding:6px 12px;border-top:1px solid var(--border)}
.pgrp .pm .mid{font-family:var(--font-mono);font-size:11px}
.pgrp .pm .u{font-size:11.5px;color:var(--muted)}

.cfgt{width:100%;border-collapse:collapse;font-size:13px;max-width:900px}
.cfgt th{text-align:left;font:500 11px/1 var(--font-mono);letter-spacing:.07em;text-transform:uppercase;color:var(--muted);padding:0 12px 9px;border-bottom:1px solid var(--border)}
.cfgt td{padding:9px 12px;border-bottom:1px solid var(--border);vertical-align:middle}
.cfgt tr:hover td{background:var(--panel)}
.cfgt .lim{color:var(--fg)}
.cfgt .was{display:block;font-size:11px;color:var(--muted);margin-top:2px}
.cfgv{display:inline-flex;align-items:center;justify-content:flex-end;min-width:74px;height:28px;padding:0 9px;border:1px solid var(--border);border-radius:7px;background:var(--bg);font-family:var(--font-mono);font-size:12.5px;color:var(--fg)}
.cfgv.ed{border-color:var(--accent);color:var(--accent);background:color-mix(in srgb,var(--accent) 7%,var(--bg))}
.cfgv.inf{color:var(--muted);font-family:var(--font-ui)}
.cfgbar{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;gap:12px;padding:12px 56px;border-top:1px solid var(--border);background:var(--panel);font-size:12.5px}
.cfgbar .sp{flex:1}
.cfgbar b{font-weight:600}
.cfgwarn{color:#b8791b}
.cfgprov{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--border);border-radius:9px;background:var(--panel);margin-bottom:8px;font-size:13px;max-width:900px}
.cfgprov .hd{color:var(--muted);font-family:var(--font-mono);font-size:11px;width:14px}
.cfgprov .nm{font-weight:500}
.cfgprov .sp{flex:1}
.cfgprov.off{opacity:.55}
.cfgsw{width:34px;height:20px;border-radius:999px;background:var(--panel-2);border:1px solid var(--border);position:relative;flex-shrink:0}
.cfgsw i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:var(--muted);display:block}
.cfgsw.on{background:color-mix(in srgb,var(--accent) 22%,var(--bg));border-color:var(--accent)}
.cfgsw.on i{left:auto;right:2px;background:var(--accent)}
.cfgflag{display:flex;gap:12px;align-items:flex-start;padding:13px 14px;border:1px solid var(--border);border-radius:10px;background:var(--panel);margin-bottom:9px;max-width:900px}
.cfgflag .b{flex:1}
.cfgflag .t{font-size:13.5px;font-weight:500}
.cfgflag .d{font-size:12px;color:var(--fg-muted);margin-top:3px;line-height:1.45}
.cfgflag.lock{background:var(--panel-2);border-style:dashed}
.cfgflag.lock .t{color:var(--fg-muted)}
.cfglog{font-size:12px;max-width:900px}
.cfglog .l{display:flex;gap:10px;padding:7px 12px;border-bottom:1px solid var(--border);color:var(--fg-muted)}
.cfglog .l .w{font-family:var(--font-mono);font-size:11px;color:var(--muted);white-space:nowrap}
.cfglog .l b{color:var(--fg);font-weight:500}
.cfgsec{font:500 11px/1 var(--font-mono);letter-spacing:.07em;text-transform:uppercase;color:var(--muted);margin:22px 0 10px}
.cfgsec:first-child{margin-top:0}
.cfgacc{display:flex;align-items:center;gap:10px;padding:12px 14px;border:1px solid var(--border);border-radius:10px;background:var(--panel);max-width:900px;margin-bottom:14px}

.ucard{border:1px solid var(--border);border-radius:12px;padding:14px 16px;background:var(--panel)}
.ucard .k{font-size:12px;color:var(--muted)}
.ucard .v{font-size:22px;font-weight:650;letter-spacing:-.02em;margin:2px 0 8px}
.ucard .v small{font-size:12px;color:var(--muted);font-weight:400}
/* public view */
.pub{display:grid;grid-template-rows:52px 1fr;height:100vh}
.pubtop{display:flex;align-items:center;gap:10px;padding:0 24px;border-bottom:1px solid var(--border)}
.pubtop .t{font-weight:500}
.pubtop .r{margin-left:auto;display:flex;gap:8px;align-items:center}
.pubbody{overflow:hidden;padding:44px 24px 0;position:relative}
.pubbody .md{max-width:68ch}
/* mac window */
.macwin{position:absolute;inset:26px 40px;border-radius:12px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.28);border:1px solid rgba(0,0,0,.2);background:var(--bg)}
.macwin .app{height:100%;width:100%;grid-template-rows:52px 1fr}
.lights{display:flex;gap:7px;margin-right:6px}
.lights i{width:12px;height:12px;border-radius:50%;display:block}
.desk{position:absolute;inset:0;background:linear-gradient(135deg,#d9dee8,#c7d3e6 60%,#e8e2d5)}
/* phone */
.phone{width:390px;height:844px;background:var(--bg);display:flex;flex-direction:column;overflow:hidden;position:relative}
.phone .top{padding:0 10px 0 6px;gap:6px;height:56px}
.phone .top .ttlbox{display:flex;flex-direction:column;flex:1;min-width:0;line-height:1.25;margin-left:2px}
.phone .top .ttl{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0;font-size:14.5px;letter-spacing:-.01em}
.phone .top .ttlbox .ttl{flex:none}
.phone .top .tsub{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden}
.phone .top .tsub .ic{color:var(--success)}
.phone .top .dotsep{width:3px;height:3px;border-radius:50%;background:var(--border-strong)}
.phone .top .ibtn{width:32px;height:32px}
.phone .topright{gap:4px;margin-left:0}
.phone .pbody{flex:1;min-height:0;overflow:hidden;position:relative;display:flex;flex-direction:column}
.phone .pdoc{flex:1;min-height:0;overflow:hidden;padding:18px 18px 0}
.phone .md{font-size:15px;max-width:none}
.phone .bottombar{display:flex;justify-content:space-around;align-items:center;height:68px;border-top:1px solid var(--border);color:var(--muted);flex-shrink:0;background:var(--panel);padding:4px 4px 6px}
.phone .bottombar .bi{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:11px;font-weight:500;color:var(--fg-muted);width:68px}
.phone .bottombar .bpill{display:grid;place-items:center;width:56px;height:30px;border-radius:15px}
.phone .bottombar .bi.on{color:var(--fg);font-weight:600}
.phone .bottombar .bi.on .bpill{background:var(--selected)}
.phone .bottombar .bi.ai .ic{color:var(--ai)}
.phone .bottombar .bi.ai.on .bpill{background:color-mix(in srgb,var(--ai) 12%,transparent)}
.phone .bottombar .bi .ic{width:22px;height:22px}
.phone .modebar{padding:6px 8px;gap:4px}
.phone .modebar .tools{overflow:hidden}
.phone .pdim{position:absolute;inset:0;background:rgba(10,10,10,.32);z-index:6}
.phone .drawer{position:absolute;top:0;bottom:0;left:0;width:280px;background:var(--bg-subtle);border-right:1px solid var(--border);z-index:7;padding:8px;display:flex;flex-direction:column;overflow:hidden}
.phone .drawer.right{left:auto;right:0;width:300px;border-right:0;border-left:1px solid var(--border);padding:0}
.phone .sheet{position:absolute;left:0;right:0;bottom:0;background:var(--bg);border-top:1px solid var(--border-strong);border-radius:16px 16px 0 0;padding:10px 16px 18px;z-index:7;box-shadow:0 -12px 40px rgba(17,18,22,.14)}
.phone .sheet .grab{width:36px;height:4px;border-radius:2px;background:var(--border-strong);margin:0 auto 12px}
.phone .sheet h2{margin:0 0 4px;font-size:17px;font-weight:650;letter-spacing:-.01em}
.phone .sheet p{margin:0 0 12px;color:var(--fg-muted);font-size:13px}
.phone .sheet .stack{display:flex;flex-direction:column;gap:8px}
.phone .sheet .btn{height:42px;font-size:14px;justify-content:flex-start;padding:0 14px}
.phone .sheet .fine{font-size:11.5px;color:var(--muted);margin-top:10px}
.phone .page{padding:16px 16px 0}
.phone .page h1{font-size:20px}
.phone .page .sub{font-size:13px;margin-bottom:14px}
.phone .plans{grid-template-columns:1fr;gap:10px;max-width:none}
.phone .usage{grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
.phone .ucard{padding:10px 12px}.phone .ucard .v{font-size:18px}
.phone .aibox{margin:0 12px 12px;padding:12px 12px 10px}
.phone .aibox .in{font-size:13px}
.phone .rsec{padding:12px 14px 10px}
.phone .card{left:12px;right:12px;bottom:74px;width:auto}
.phone .toast{bottom:74px;white-space:normal;width:calc(100% - 24px);justify-content:center;text-align:center}
.phone .settings{grid-template-columns:1fr}
.phone .set{padding:0}
.install{position:absolute;left:12px;right:12px;bottom:70px;background:var(--bg);border:1px solid var(--border-strong);border-radius:12px;padding:12px 14px;display:flex;gap:10px;align-items:center;box-shadow:0 12px 40px rgba(17,18,22,.16)}
.install b{display:block;font-size:13px}
.install span{font-size:12px;color:var(--fg-muted)}
.iosbar{height:44px;display:flex;align-items:center;justify-content:space-between;padding:0 22px;font-size:14px;font-weight:600}
.iosbar .pillbox{display:flex;gap:4px;align-items:center;font-size:12px}
.iosbar .ic{vertical-align:0}
.homeind{height:24px;display:grid;place-items:center}
.homeind i{width:134px;height:5px;border-radius:3px;background:var(--fg);opacity:.85}
/* diff */
.diff{font-family:var(--font-mono);font-size:12px;line-height:1.6;border:1px solid var(--border);border-radius:8px;overflow:hidden}
.diff div{padding:0 12px;white-space:pre}
.diff .add{background:color-mix(in srgb,var(--success) 14%,transparent)}
.diff .del{background:color-mix(in srgb,var(--danger) 14%,transparent);color:var(--fg-muted)}
.vers .it{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);font-size:12.5px}
.vers .it .sp{flex:1}
.vers .it.on{color:var(--fg);font-weight:500}
.split{display:grid;grid-template-columns:1fr 7px 1fr;flex:1;min-height:0}
.split .gut{background:var(--border)}
.split .pane{padding:26px 28px;overflow:hidden}
.src{font-family:var(--font-mono);font-size:12.5px;line-height:1.7;color:var(--fg);white-space:pre}
.src .kw{color:var(--link)}
.elsewhere{margin-top:18px;border:1px dashed var(--border-strong);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--fg-muted)}
.elsewhere b{color:var(--fg)}
.qcard{border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:10px;background:var(--panel)}
.qcard .q{font-weight:600;font-size:13.5px;margin-bottom:8px}
.qcard .opt{display:flex;gap:8px;align-items:flex-start;padding:6px 8px;border-radius:6px;border:1px solid var(--border);margin-bottom:5px;font-size:12.5px}
.qcard .opt.rec{border-color:var(--accent)}
.qcard .opt .k{font-family:var(--font-mono);font-size:10.5px;color:var(--muted);min-width:14px}
.qcard .opt small{display:block;color:var(--muted);font-size:11.5px}
.qcard .rec-tag{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--ai);margin-left:6px;font-weight:600}
.steps{display:flex;gap:6px;align-items:center;font-size:12px;color:var(--muted)}
.steps b{color:var(--fg)}
.kit .file{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);font-size:12.5px}
.kit .file .ic{color:var(--muted)}
.kit .file .sp{flex:1}
.kit .file .ok{color:var(--success)}
.linkbox{display:flex;align-items:center;gap:8px;border:1px solid var(--border);border-radius:8px;padding:8px 10px;font-family:var(--font-mono);font-size:11.5px;color:var(--fg);background:var(--panel-2);margin:8px 0}
.prompt{border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-family:var(--font-mono);font-size:11px;line-height:1.55;color:var(--fg-muted);background:var(--bg);white-space:pre-wrap;margin:8px 0}
/* sign-in on the phone: the desktop's preview window and three verbs, stacked */
.pgate{padding:6px 22px 0;display:block}
.pgate .preview{border:1px solid var(--border-strong);border-radius:12px;overflow:hidden;background:var(--bg);box-shadow:0 14px 40px rgba(17,18,22,.10);margin:4px 0 22px}
.pgate .preview .top{height:38px;padding:0 10px;border-bottom:1px solid var(--border)}
.pgate .preview .pv{padding:14px 16px 4px}
.pgate .preview .md{font-size:12.5px;max-width:none}
.pgate .preview .md h1{font-size:17px;margin:0 0 8px;padding-bottom:6px}
.pgate .preview .md p{margin:0 0 10px;color:var(--fg-muted)}
.pgate h1{font-size:24px;font-weight:650;letter-spacing:-.02em;margin:0 0 6px}
.pgate .lede{color:var(--fg-muted);font-size:14px;margin:0 0 18px;line-height:1.5}
.pgate .stack{display:flex;flex-direction:column;gap:8px}
.pgate .stack .btn{height:46px;font-size:15px;justify-content:center;padding:0 14px;border-radius:10px}
.pgate .three{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin:16px 0 0}
.pgate .three div{display:flex;align-items:center;justify-content:center;gap:6px;height:36px;border:1px solid var(--border);border-radius:999px;font-size:12.5px;color:var(--fg-muted);background:var(--panel-2)}
.pgate .three b{font-weight:600;color:var(--fg)}
.pgate .fine{font-size:11.5px;color:var(--muted);margin-top:14px;line-height:1.55}
/* sign-in and home */
.gate{height:100vh;display:grid;grid-template-columns:1fr 1fr}
.gate .left{display:grid;place-items:center;padding:40px;border-right:1px solid var(--border);background:var(--bg-subtle)}
.gate .cardx{width:380px}
.gate h1{font-size:26px;font-weight:650;letter-spacing:-.02em;margin:18px 0 6px}
.gate .lede{color:var(--fg-muted);font-size:14px;margin:0 0 20px}
.gate .stack{display:flex;flex-direction:column;gap:8px}
.gate .stack .btn{height:42px;font-size:14px;justify-content:flex-start;padding:0 14px}
.gate .fine{font-size:11.5px;color:var(--muted);margin-top:14px;line-height:1.55}
.gate .right{position:relative;overflow:hidden;display:grid;place-items:center;padding:40px}
.gate .preview{width:100%;max-width:640px;border:1px solid var(--border-strong);border-radius:12px;overflow:hidden;background:var(--bg);box-shadow:0 20px 60px rgba(17,18,22,.10)}
.gate .preview .top{height:40px;padding:0 12px}
.gate .preview .pv{padding:22px 26px;font-size:13px}
.gate .three{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;max-width:640px;margin-top:18px}
.gate .three div{font-size:12px;color:var(--fg-muted);line-height:1.5}
.gate .three b{display:block;color:var(--fg);font-weight:600;margin-bottom:2px}
.home{flex:1;min-height:0;overflow:hidden;padding:26px 56px 0}
.home .hh{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.home h1{font-size:22px;font-weight:650;letter-spacing:-.02em;margin:0}
.home .htabs{display:flex;gap:2px;border-bottom:1px solid var(--border);margin:6px 0 18px}
.home .htabs span{padding:8px 12px;font-size:13px;color:var(--muted);position:relative}
.home .htabs span.on{color:var(--fg);font-weight:500}
.home .htabs span.on::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--accent)}
.starts{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:26px;max-width:1040px}
.start{border:1px solid var(--border);border-radius:12px;padding:14px 14px 12px;background:var(--panel);min-height:112px;display:flex;flex-direction:column;gap:6px}
.start .ic{color:var(--fg-muted)}
.start b{font-size:13px;font-weight:600}
.start span{font-size:11.5px;color:var(--muted);line-height:1.45}
.start.ai .ic{color:var(--ai)}
.start.plus{border-style:dashed;justify-content:center;align-items:center;color:var(--muted)}
.recent{max-width:1040px}
.recent .r{display:grid;grid-template-columns:minmax(0,1.8fr) 1fr 1fr .8fr 40px;gap:12px;align-items:center;height:40px;border-bottom:1px solid var(--border);font-size:13px;color:var(--fg-muted)}
.recent .r.h{color:var(--muted);font-size:11px;letter-spacing:.06em;text-transform:uppercase;font-weight:600;height:30px}
.recent .r b{font-weight:500;color:var(--fg);display:flex;align-items:center;gap:8px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.recent .r .ic{color:var(--muted)}
.phone .starts{grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.phone .start{min-height:96px;padding:12px}
.phone .recent .r{grid-template-columns:minmax(0,1fr) auto;height:52px}
.phone .home{padding:14px 16px 0}
/* settings */
.settings{display:grid;grid-template-columns:220px minmax(0,1fr);height:100%}
.setnav{border-right:1px solid var(--border);background:var(--bg-subtle);padding:14px 8px}
.setnav .row{height:30px}
.set{padding:30px 40px;overflow:hidden}
.set h1{font-size:22px;font-weight:650;letter-spacing:-.02em;margin:0 0 4px}
.set .sub{color:var(--fg-muted);font-size:13px;margin:0 0 20px}
.set h2{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);font-weight:600;margin:20px 0 6px}
.srow{display:flex;align-items:center;gap:14px;padding:11px 0;border-bottom:1px solid var(--border);max-width:720px}
.srow .t{flex:1;font-size:13.5px}
.srow .t em{display:block;font-style:normal;font-size:12px;color:var(--muted);margin-top:1px}
.tog{width:36px;height:20px;border-radius:10px;background:var(--border-strong);position:relative;flex:none}
.tog i{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2)}
.tog.on{background:var(--success)}.tog.on i{left:auto;right:2px}
.sel{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;border:1px solid var(--border);border-radius:6px;font-size:12.5px;background:var(--bg)}
/* flow view */
.flow{flex:1;min-height:0;overflow:hidden;display:flex;gap:14px;padding:18px 20px 0}
.col{width:250px;flex:none;display:flex;flex-direction:column;gap:8px}
.col .ch{padding:0 2px 4px}
.col .ch .t{font-size:13.5px;font-weight:650}
.col .ch .m{font-size:11px;color:var(--muted)}
.col .ch .d{font-size:11.5px;color:var(--fg-muted);margin-top:2px}
.step{border:1px solid var(--border);border-radius:8px;background:var(--panel);padding:8px 10px;font-size:12px}
.step .st{display:flex;align-items:center;gap:6px;font-weight:600;font-size:12.5px;margin-bottom:3px}
.step .st .b{margin-left:auto;font-family:var(--font-mono);font-size:9.5px;letter-spacing:.04em;color:var(--fg-muted);border:1px solid var(--border-strong);border-radius:4px;padding:0 4px}
.step .st .b.t-gate,.step .st .b.t-alarm{color:#b8791b;border-color:#b8791b}.step .st .b.t-hard{color:#b2625e;border-color:#b2625e}.step .st .b.t-loop,.step .st .b.t-io{color:var(--link);border-color:var(--link)}
.step .sb{color:var(--fg-muted);line-height:1.45}
.step .sr{font-family:var(--font-mono);font-size:10px;color:var(--muted);margin-top:5px}
.legend{display:flex;gap:14px;font-size:11.5px;color:var(--fg-muted);padding:0 20px 8px}
.legend i{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:5px;vertical-align:-1px}
.phone .flow{flex-direction:column;gap:10px;padding:12px 14px 0}
.phone .col{width:100%}
/* depth chooser */
/* Idea mode, rebuilt 18 September. The founder's note was that the old flow carried too
   much at once: a four-step breadcrumb, three large depth cards and two columns. The
   reference he gave was Claude and ChatGPT: one centred column, one input, and the depth
   chosen from a small selector the way a model is chosen. */
.icol{max-width:720px;margin:0 auto;padding:6px 0 0}
.icol.wide{max-width:780px}
.ihead{font-size:26px;font-weight:600;letter-spacing:-.02em;margin:10px 0 18px;text-align:center}
.ihead em{font-style:normal;color:var(--muted);font-weight:400;font-size:15px;display:block;margin-top:6px;letter-spacing:0}
.bigin{border:1px solid var(--border-strong);border-radius:14px;background:var(--panel);box-shadow:0 1px 3px rgba(0,0,0,.05)}
.bigin .txt{padding:14px 16px 4px;font-size:14.5px;line-height:1.6;color:var(--fg);min-height:74px}
.bigin .txt.ph{color:var(--muted)}
.bigin .barrow{display:flex;align-items:center;gap:6px;padding:8px 10px 10px}
.bigin .barrow .sp{flex:1}
.selpill{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 9px;font-size:12.5px;font-weight:500;color:var(--fg);
  border:1px solid var(--border);border-radius:999px;background:var(--bg-subtle)}
.selpill .mut{color:var(--muted);font-weight:400}
.iconbtn{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:1px solid var(--border);border-radius:999px;color:var(--muted);background:var(--panel)}
.sendbtn{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:999px;background:var(--accent);color:var(--accent-fg)}
.selmenu{position:absolute;border:1px solid var(--border);border-radius:12px;background:var(--panel);box-shadow:var(--shadow);padding:5px;min-width:320px;z-index:9}
.selmenu .mi{display:block;padding:9px 10px;border-radius:8px;font-size:13px}
.selmenu .mi.on{background:var(--bg-subtle)}
.selmenu .mi b{display:flex;align-items:center;gap:7px;font-weight:600}
.selmenu .mi span{display:block;color:var(--muted);font-size:11.5px;margin-top:2px;padding-left:25px}
.prog{display:flex;align-items:center;gap:10px;font-size:12px;color:var(--muted);margin:2px 0 14px}
.prog .bar{flex:1;height:4px;border-radius:999px;background:var(--border);overflow:hidden}
.prog .bar i{display:block;height:100%;background:var(--accent)}
.qstack .qcard{border-radius:11px;padding:11px 13px;margin-bottom:9px}
.qstack .qcard .q{font-size:13.5px;margin-bottom:7px}
.qstack .qcard .opt{padding:6px 9px;font-size:12.5px;border-radius:7px;margin-bottom:4px;align-items:center}
.qstack .qcard .opt small{font-size:11px;margin-top:1px}
.qskip{font-size:11.5px;color:var(--muted);text-decoration:underline;text-underline-offset:2px;margin-top:6px}
/* The AI box names its target, so there is never a question about what it will touch. */
.aibox .target{display:flex;align-items:center;gap:6px;padding:7px 12px;font-size:12px;color:var(--muted);
  border-bottom:1px solid var(--border);background:var(--bg-subtle);border-radius:var(--r) var(--r) 0 0}
.aibox .target b{color:var(--fg);font-weight:600}
.aibox .target .sp{flex:1}
.aibox .target .swap{color:var(--accent);font-weight:500}
/* Sharing to somebody who is not on frontmatter yet. */
.invite{display:flex;align-items:center;gap:10px;padding:10px 12px;margin-bottom:10px;border:1px solid var(--accent);
  border-radius:var(--r);background:var(--bg-subtle)}
.invite .t{flex:1;font-size:12.5px}
.invite .t b{display:block}
.invite .t em{display:block;font-style:normal;color:var(--muted);font-size:11.5px;margin-top:2px}
/* The published page offers, and never gates. page.md and llms.txt never see this bar. */
.openbar{display:flex;align-items:center;gap:8px;padding:9px 20px;font-size:12.5px;color:var(--fg-muted);
  background:var(--bg-subtle);border-bottom:1px solid var(--border)}
.openbar .t{margin-right:4px}
.openbar .x{margin-left:auto;color:var(--muted)}
.pagenav{display:flex;align-items:center;gap:8px;margin-top:4px}
.pagenav .sp{flex:1}
/* The rewriting state. Only appears when an answer actually changes a later page. */
.ghost{position:relative;border:1px solid var(--border);border-radius:11px;padding:11px 13px;margin-bottom:9px;background:var(--panel);overflow:hidden}
.ghost .blurred{filter:blur(3.5px);opacity:.5;pointer-events:none}
.ghost .work{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:8px;font-size:12.5px;font-weight:500;color:var(--ai)}
.ghost .work .spin{width:13px;height:13px;border:2px solid var(--ai);border-right-color:transparent;border-radius:50%}
.skipmodal{position:absolute;inset:0;background:rgba(15,15,17,.42);display:grid;place-items:center;z-index:20}
.skipmodal .card{width:430px;background:var(--panel);border:1px solid var(--border);border-radius:14px;box-shadow:var(--shadow);padding:20px}
.skipmodal h3{font-size:16px;font-weight:600;margin:0 0 8px}
.skipmodal p{font-size:13px;color:var(--fg-muted);line-height:1.6;margin:0 0 6px}
.phone .icol{max-width:none}
.phone .ihead{font-size:19px;margin:6px 0 14px}
.phone .bigin .txt{font-size:13.5px;min-height:62px}
.depths{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
.depth{border:1px solid var(--border);border-radius:12px;padding:14px;background:var(--panel);font-size:12.5px;display:flex;flex-direction:column;gap:6px}
.depth.on{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}
.depth .nm{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:650}
.depth .nm .pill{margin-left:auto}
.depth ul{margin:2px 0 0;padding-left:16px;color:var(--fg-muted)}
.depth li{margin:2px 0}
.phone .depths{grid-template-columns:1fr;gap:8px}
.ideas .row{height:auto;padding:6px 8px;align-items:flex-start}
.ideas .row .n{white-space:normal;line-height:1.35}
.ideas .row em{display:block;font-style:normal;font-size:11px;color:var(--muted)}
/* decision card */
.dcard{border:1px solid var(--border);border-radius:12px;background:var(--panel);padding:16px 18px;max-width:760px}
.dcard .dq{font-size:16px;font-weight:650;letter-spacing:-.01em;margin-bottom:8px}
.dcard .dsec{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);font-weight:600;margin:12px 0 4px}
.dcard p{margin:0;font-size:13px;color:var(--fg)}
.dopts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px}
.dopt{border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-size:12.5px}
.dopt.rec{border-color:var(--accent)}
.dopt b{display:block;font-weight:600;margin-bottom:4px}
.dopt .g{color:var(--success)}.dopt .c{color:var(--danger)}
.ev{display:flex;gap:8px;align-items:flex-start;padding:5px 0;font-size:12px;border-bottom:1px solid var(--border)}
.ev .src{font-family:var(--font-mono);font-size:10px;color:var(--muted);white-space:nowrap;margin-left:auto;padding-top:2px}
.phone .dopts{grid-template-columns:1fr}
/* portfolio */
.pf{max-width:760px;margin:0 auto;padding:44px 24px 0}
.pf .head{display:flex;gap:18px;align-items:center;margin-bottom:22px}
.pf .head .avatar{width:64px;height:64px;font-size:22px}
.pf h1{font-size:26px;font-weight:650;letter-spacing:-.02em;margin:0}
.pf .role{color:var(--fg-muted);font-size:14px;margin-top:2px}
.pf .links{display:flex;gap:8px;margin-top:8px}
.pf h2{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);font-weight:600;margin:22px 0 8px}
.pf .pj{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pf .pjc{border:1px solid var(--border);border-radius:10px;padding:12px 14px;font-size:12.5px}
.pf .pjc b{display:block;font-weight:600;font-size:13.5px;margin-bottom:3px}
.pf .pjc span{color:var(--fg-muted)}
.pf .wr{display:flex;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);font-size:13px}
.pf .wr .dt{color:var(--muted);font-family:var(--font-mono);font-size:11px;margin-left:auto;white-space:nowrap}
.phone .pf .head{align-items:flex-start}
.phone .pf .head>div{min-width:0}
.phone .pf .links{flex-wrap:wrap}
.phone .pf h1{font-size:22px}
.phone .top>.mark:first-child{margin-left:10px}
.phone .pf{padding:18px 16px 0}
.phone .pf .pj{grid-template-columns:1fr}
/* import */
.drop{border:2px dashed var(--border-strong);border-radius:14px;padding:26px;text-align:center;color:var(--fg-muted);font-size:13.5px;background:var(--panel-2)}
.drop b{display:block;color:var(--fg);font-size:15px;font-weight:600;margin-bottom:4px}
.sources{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:14px}
.srcb{display:flex;gap:10px;align-items:center;border:1px solid var(--border);border-radius:10px;padding:10px 12px;font-size:12.5px;background:var(--panel)}
.srcb .ic{color:var(--fg-muted)}
.srcb b{display:block;font-weight:600}
.srcb span{color:var(--muted);font-size:11.5px}
.phone .sources{grid-template-columns:1fr}
.conn{border:1px solid var(--border);border-radius:12px;padding:14px 16px;background:var(--panel);max-width:720px;margin-bottom:12px}
.conn .ch{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.conn .ch b{font-size:14px;font-weight:650}
.conn .ch .pill{margin-left:auto}
.conn .cl{display:flex;gap:8px;align-items:flex-start;font-size:12.5px;color:var(--fg-muted);padding:3px 0}
.conn .cl .ic{color:var(--muted);margin-top:2px}
.conn .acts{display:flex;gap:8px;margin-top:10px}
/* doc mode toolbar */
.docbar{display:flex;align-items:center;gap:2px;padding:6px 10px;border-bottom:1px solid var(--border);background:var(--bg-subtle);overflow:hidden}
.docbar .tool.txt{min-width:0}
.paper{background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.08),0 0 0 1px var(--border);max-width:720px;margin:0 auto;padding:56px 64px;min-height:100%}
.dark .paper{background:#202020}
.ruler{height:18px;border-bottom:1px solid var(--border);background:var(--bg-subtle);display:flex;align-items:flex-end;justify-content:center;font-family:var(--font-mono);font-size:8.5px;color:var(--muted);letter-spacing:.2em}
.cmtbox{position:absolute;right:26px;top:150px;width:230px;background:var(--bg);border:1px solid var(--border-strong);border-radius:10px;padding:10px 12px;font-size:12px;box-shadow:0 12px 40px rgba(17,18,22,.12)}
.cmtbox .who{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--muted);margin-bottom:4px}
.cmtbox .rep{margin-top:8px;border:1px solid var(--border);border-radius:6px;padding:5px 8px;color:var(--muted);font-size:11.5px}
/* capture */
.capwin{position:absolute;left:50%;top:26%;transform:translateX(-50%);width:560px;background:var(--bg);border:1px solid var(--border-strong);border-radius:14px;box-shadow:0 24px 70px rgba(17,18,22,.22);padding:14px 16px 12px;z-index:7}
.capwin .in{display:flex;align-items:flex-start;gap:10px;min-height:88px;border:1px solid var(--border-strong);border-radius:10px;background:var(--bg);padding:10px 12px;font-size:14px}
.capwin .foot{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:12px;color:var(--muted)}
.capwin .foot .sp{flex:1}
`;

// Brand marks are NOT Material Symbols. Google's is the official four-colour G and keeps
// its own fills; GitHub's is a single path and follows currentColor.
const brandCache = {};
function brand(name, size = 18) {
  if (!brandCache[name]) {
    const raw = fs.readFileSync(path.join(ICONS, 'brand-' + name + '.svg'), 'utf8');
    // Each path is closed on its own. Keeping only the opening tags nested the four
    // Google paths inside one another, so only the blue one drew (audit row 1).
    const paths = [...raw.matchAll(/<path\b[^>]*?\/?>/g)].map(m => m[0])
      .map(s => s.replace(/\s(height|width|style|class)="[^"]*"/g, '').replace(/\s*\/?>$/, '/>'));
    brandCache[name] = paths.join('');
  }
  const fill = name === 'github' ? ' fill="currentColor"' : '';
  return `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24"${fill} aria-hidden="true">${brandCache[name]}</svg>`;
}

const SW = { blue: '#5b8cff', green: '#4f8b6b', red: '#b2625e', amber: '#b8791b', grey: '#9b9ba3' };

// WCAG 2.x contrast, asserted at generation so a token change cannot ship below 4.5:1 (F030).
function lum(hex) {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrast(a, b) { const [x, y] = [lum(a), lum(b)]; return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
for (const [fg, bg] of [['#73737b', '#fafafa'], ['#aa5e5a', '#fafafa'], ['#487d60', '#fafafa'], ['#d49391', '#1a1a1a'], ['#7fb09a', '#1a1a1a']]) {
  if (contrast(fg, bg) < 4.5) throw new Error(`contrast ${fg} on ${bg} is ${contrast(fg, bg).toFixed(2)}, below 4.5`);
}

function top({ tabs, share = true, presence = null, extra = '' }) {
  // Header mirrors src/app/(vault)/layout.tsx: 52px, --panel, 0 14px padding,
  // a 26px/7px mark, the wordmark, then the icon cluster, a 1px divider and
  // the 26px avatar. Tabs live in their own 38px strip, as EditorPane renders
  // them with .sgnk-tab. There is no signed-out state: the workspace exists
  // only behind sign-in.
  const strip = tabs && tabs.length
    ? `<nav class="tabs">${tabs.map(t => `<span class="tab${t.on ? ' on' : ''}"><i class="sw" style="background:${SW[t.c] || t.c}"></i>${t.n}<span class="x">${ic('close', 15)}</span></span>`).join('')}<span class="tab newtab">${ic('add', 16)}</span></nav>`
    : '';
  return `<header class="top">
  <span class="topleft">
    <span class="ibtn">${ic('menu', 18)}</span>
    <span class="mark">fm</span>
  </span>
  <span class="topright">
    ${presence ? `<span class="avatars">${presence.map(p => `<span class="avatar" style="background:${p.c}">${p.i}</span>`).join('')}</span>` : ''}
    ${share ? `<span class="ibtn" title="Share">${ic('share', 18)}</span>` : ''}
    <span class="search">${ic('search', 16)} Search<kbd>⌘K</kbd></span>
    ${extra}
    <span class="ibtn">${ic('home', 18)}</span>
    <span class="ibtn">${ic('visibility', 18)}</span>
    <span class="ibtn">${ic('dark_mode', 18)}</span>
    <i class="vsep"></i>
    <span class="avatar" style="background:#18181b">SM</span><span class="uname">Sagnik</span>
  </span></header>${strip}`;
}

function tree({ projects, foot = '', ideas = true }) {
  // The two primary creates live here, on the left, not in the right rail.
  // Upload is inside Add file rather than a third button, and the whole tree is a
  // drop target, so there is one place to put things and one place to make them.
  const make = `<div class="makerow">
    <span class="btn primary sm">${ic('note_add', 16)} Add file ${ic('expand_more', 14)}</span>
    <span class="btn sm">${ic('lightbulb', 16)} Add idea</span></div>`;
  // Ideas is a collapsed section at the foot of the tree, the way the outline sits on
  // the right. Notes stays open, Ideas stays shut until it is wanted.
  const ideaSec = ideas ? `<div class="proj shut"><div class="projrow">${ic('chevron_right', 15)} ${ic('lightbulb', 16)} Ideas<span class="sp"></span><span class="cnt">3</span></div></div>` : '';
  return `<aside class="side">
  <div class="sidehead">${ic('chevron_right', 16)} Tree<span class="sp"></span><span class="pill">${ic('add', 14)} project</span></div>
  ${treeRows(projects)}
  ${ideaSec}
  <div class="drophint">${ic('upload', 15)} Drop files or a folder anywhere</div>
  ${make}
  <div class="sidefoot">${foot}</div></aside>`;
}
function treeRows(projects) {
  return projects.map(p => `<div class="proj"><div class="projrow">${ic(p.icon || 'folder', 16)} ${p.n}<span class="sp"></span><span class="mini" title="New file">${ic('note_add', 15)}</span><span class="mini" title="New folder">${ic('create_new_folder', 15)}</span></div>
    ${p.rows.map(r => `<div class="row d${r.d || 1}${r.on ? ' on' : ''}">${ic(r.f ? 'description' : 'folder', 15)}<span class="n">${r.n}</span>${r.b ? `<span class="badge">${r.b}</span>` : ''}</div>`).join('')}</div>`).join('');
}

function modebar(mode = 'Live', right = '', stats = '412 words · 3 min', { docSwitch = 'Markdown' } = {}) {
  // One consolidated control row, as Toolbar.tsx renders it: twelve buttons in
  // this exact order, then the right-hand extras (stats, bookmark, find,
  // history, more), the Markdown/Doc switch that only appears in Live, and
  // the Edit/Live/Reading/Split segment from EditorPane.
  const modes = ['Edit', 'Live', 'Reading', 'Split'];
  const tools = [['format_bold', ''], ['format_italic', ''], ['format_strikethrough', ''], ['code', ''],
    ['H1', 'h'], ['H2', 'h'], ['format_list_bulleted', ''], ['check_box', ''], ['format_quote', ''],
    ['data_object', ''], ['link', ''], ['table_chart', '']];
  // In Live the Markdown/Doc switch takes the room the word count used; the
  // count stays in the status line, as EditorPane shows it today.
  const sw = mode === 'Live' ? `<span class="seg tight">${['MD', 'Doc'].map(m => `<span class="${(m === 'MD' ? 'Markdown' : m) === docSwitch ? 'on' : ''}">${m}</span>`).join('')}</span>` : '';
  if (sw) stats = '';
  return `<div class="modebar">
  <span class="tools">${tools.map(x => x[1] === 'h' ? `<span class="tool h">${x[0]}</span>` : `<span class="tool">${ic(x[0], 18)}</span>`).join('')}</span>
  <span class="right">${stats ? `<span>${stats}</span>` : ''}${right}
    <span class="tool" title="Bookmark, find, history">${ic('more_horiz', 18)}</span>
    ${sw}<span class="seg">${modes.map(m => `<span class="${m === mode ? 'on' : ''}">${m}</span>`).join('')}</span>
  </span></div>`;
}

function docbar() {
  // Doc mode: the Google-Docs-shaped toolbar. Everything here writes markdown
  // or a front-matter key; nothing here is a second file format.
  const t = (h) => `<span class="tool">${h}</span>`;
  return `<div class="docbar">
  <span class="tools">
    <span class="tool txt">Normal text ${ic('arrow_drop_down', 16)}</span><i class="tsep"></i>
    <span class="tool txt" title="Four faces only: Google Sans, a serif, a mono, and the system face">Google Sans ${ic('arrow_drop_down', 16)}</span>
    <span class="sizer"><span class="tool sq">&minus;</span><span class="num">15</span><span class="tool sq">+</span></span><i class="tsep"></i>
    ${t(ic('format_bold', 18))}${t(ic('format_italic', 18))}${t(ic('format_underlined', 18))}${t(ic('format_strikethrough', 18))}<i class="tsep"></i>
    ${t(ic('format_list_numbered', 18))}${t(ic('format_list_bulleted', 18))}${t(ic('check_box', 18))}<i class="tsep"></i>
    ${t(ic('image', 18))}${t(ic('table_chart', 18))}${t(ic('link', 18))}${t(ic('comment', 18))}${t(ic('insert_page_break', 18))}<i class="tsep"></i>
    <span class="tool txt" title="Font, size, colour, highlight, alignment: render here, export to PDF, plain elsewhere">${ic('more_horiz', 18)} More</span>
  </span>
  <span class="right"><span class="pill ai">${ic('edit', 13)} Suggesting</span>
    <span class="seg tight"><span>MD</span><span class="on">Doc</span></span>
    <span class="seg"><span>Edit</span><span class="on">Live</span><span>Reading</span><span>Split</span></span></span></div>`;
}

// Founder rule, 18 September: wherever human work and machine work sit in one list,
// split them with a toggle rather than combining them. Used by S10 and S20.
function filterseg(items, on = 0) {
  return `<div class="fseg">${items.map((x, i) =>
    `<span class="${i === on ? 'on' : ''}">${x[0]}${x[1] != null ? `<i>${x[1]}</i>` : ''}</span>`).join('')}</div>`;
}

function rail({ outline, extra = '', showFoot = true, credits = [7, CAPS.edits], counts = [4, 2, 3], history = `${CAPS.history} days`, aiOff = '' }) {
  const cnt = (n) => n == null ? '' : `<span class="cnt">${n}</span>`;
  // Every collapsible sits at the top, closed, so the outline gets the height and the
  // AI panel has somewhere to open. Founder instruction, 18 September.
  return `<aside class="rail">
  <div class="rrow">${ic('sell', 16)} Tags and bookmarks<span class="sp"></span>${cnt(counts[0])}${ic('chevron_right', 16)}</div>
  <div class="rrow">${ic('link', 16)} Backlinks<span class="sp"></span>${cnt(counts[1])}${ic('chevron_right', 16)}</div>
  <div class="rrow">${ic('history', 16)} Document history<span class="sp"></span><span class="cnt">${history}</span>${ic('chevron_right', 16)}</div>
  <div class="rrow">${ic('comment', 16)} Comments<span class="sp"></span>${cnt(counts[2])}${ic('chevron_right', 16)}</div>
  <div class="rsec grow"><div class="rh">${ic('format_list_bulleted', 14)} Outline<span class="sp"></span></div><div class="ol">${outline}</div></div>
  ${extra}
  ${showFoot ? `<div class="railfoot">
  ${aiOff ? `<span class="btn" style="opacity:.55;cursor:default">${ic('auto_awesome', 16)} AI edit</span><div style="font-size:11.5px;color:var(--muted)">${aiOff}</div>` : `<span class="btn ai">${ic('auto_awesome', 16)} AI edit</span>`}
  <div class="credits">${ic('auto_awesome', 13)} ${credits[0]} of ${credits[1]} edits left <span class="meter"><i style="width:${Math.round(100 * credits[0] / credits[1])}%"></i></span></div></div>` : ''}
  </aside>`;
}

// Phone frame. Mirrors VaultWorkspace below the lg breakpoint: a 52px bar, the
// editor full width, the tree as a 280px left drawer and the right pane as a
// 300px right drawer over a backdrop. The bottom bar is new: five actions at
// thumb height (Material's compact-width pattern).
// Founder review, 18 September: the phone view was bland and must carry the desktop
// theme. So every phone header now has what the desktop header has, adapted to 390px:
// the menu, the fm mark, the title with its project and save state underneath, the
// share icon, and either the mode segment or the avatar. The bottom bar follows
// Material's navigation bar, with the active item in a pill and AI in the accent blue.
const IOSBAR = `<div class="iosbar"><span>9:41</span><span class="pillbox">${ic('signal_cellular_alt', 16)}${ic('wifi', 16)}${ic('battery_full', 18)}</span></div>`;
function phone({ title, body, bottom = 'doc', overlay = '', right = '', ttlExtra = '', bar = true, mode = null, sub = null }) {
  if (mode && !right) right = pmodeseg(mode);
  if (sub === null) sub = mode ? `Zephyrus booking ${ic('cloud_done', 13)}` : '';
  const items = [['home', 'Home'], ['search', 'Search'], ['auto_awesome', 'AI'], ['format_list_bulleted', 'Outline'], ['more_horiz', 'More']];
  const tail = right ? right : `<span class="ibtn">${ic('search', 20)}</span><span class="avatar" style="background:#18181b">SM</span>`;
  return `<div class="phone">
  ${IOSBAR}
  <header class="top"><span class="ibtn">${ic('menu', 22)}</span><span class="mark">fm</span><span class="ttlbox"><span class="ttl">${title}</span>${sub ? `<span class="tsub">${sub}</span>` : ''}</span>${ttlExtra}<span class="topright">${mode ? `<span class="ibtn">${ic('share', 18)}</span>` : ''}${tail}</span></header>
  <div class="pbody">${body}${overlay}</div>
  ${bar ? `<div class="bottombar">${items.map(([n, l]) => `<span class="bi${n === bottom ? ' on' : ''}${n === 'auto_awesome' ? ' ai' : ''}"><span class="bpill">${ic(n, 22)}</span><span>${l}</span></span>`).join('')}</div>` : ''}
  <div class="homeind"><i></i></div></div>`;
}
function pdrawer(inner, side = 'left') {
  return `<div class="pdim"></div><div class="drawer ${side}">${inner}</div>`;
}
function psheet(inner) {
  return `<div class="pdim"></div><div class="sheet"><div class="grab"></div>${inner}</div>`;
}
function pmodebar(mode = 'Live', doc = 'Markdown') {
  // The phone toolbar: seven tools and, in Live, the Markdown/Doc switch. The
  // Edit/Live/Read segment sits in the header (pmodeseg), as S17 did.
  const tools = ['format_bold', 'format_italic', 'format_list_bulleted', 'check_box', 'link', 'image', 'more_horiz'];
  return `<div class="modebar"><span class="tools">${tools.map(n => `<span class="tool">${ic(n, 18)}</span>`).join('')}</span><span class="right">${mode === 'Live' ? `<span class="seg tight"><span class="${doc === 'Markdown' ? 'on' : ''}">MD</span><span class="${doc === 'Doc' ? 'on' : ''}">Doc</span></span>` : ''}</span></div>`;
}
function pmodeseg(mode = 'Live') {
  return `<span class="seg tight"><span class="${mode === 'Edit' ? 'on' : ''}">Edit</span><span class="${mode === 'Live' ? 'on' : ''}">Live</span><span class="${mode === 'Reading' ? 'on' : ''}">Read</span></span>`;
}

const OUTLINE_BRIEF = `<div class="on">00-BRIEF</div><div class="l2">What it is</div><div class="l2 on">The first user</div><div class="l3">Who they are</div><div class="l3">What they do today</div><div class="l2">The one metric</div><div class="l2">The kickoff prompt</div>`;
const DOC_BRIEF = `<h1>Zephyrus booking, in one page</h1>
<p>A booking page for small studios that take appointments by WhatsApp today. One link, a calendar of open slots, a deposit, and a reminder the day before.</p>
<h2>The first user</h2>
<p>A two-chair salon in Kolkata that loses about four bookings a week to double-booking and no-shows. The owner runs everything from a phone.</p>
<ul><li>Books from WhatsApp messages, by hand, into a paper diary</li><li>Takes deposits by UPI, then forgets who paid</li><li>Wants a link to put in the Instagram bio</li></ul>
<h2>The one metric</h2>
<p>No-shows per hundred bookings, before and after the deposit step. If it does not fall below eight, the deposit is not the answer.</p>`;
const DOC_BRIEF_SHORT = `<h1>Zephyrus booking, in one page</h1>
<p>A booking page for small studios that take appointments by WhatsApp today. One link, a calendar of open slots, a deposit, and a reminder the day before.</p>
<h2>The first user</h2>
<p>A two-chair salon in Kolkata that loses about four bookings a week to double-booking and no-shows. The owner runs everything from a phone.</p>
<ul><li>Books from WhatsApp messages, by hand, into a paper diary</li><li>Takes deposits by UPI, then forgets who paid</li></ul>`;

const PROJECTS_MAIN = [
  { n: 'Zephyrus booking', icon: 'rocket_launch', rows: [
    { n: 'SKILL.md', f: 1 }, { n: 'AGENTS.md', f: 1 },
    { n: '00-BRIEF.md', f: 1, on: 1 }, { n: '01-PRODUCT.md', f: 1 }, { n: '02-DATA-AND-API.md', f: 1 }, { n: '03-ARCHITECTURE.md', f: 1 }, { n: '04-SETUP.md', f: 1 }, { n: '05-FRONTEND-SPEC.md', f: 1 },
    { n: 'specs', d: 1 }, { n: 'booking.md', f: 1, d: 2 }, { n: 'payments.md', f: 1, d: 2 }, { n: 'DECISIONS.md', f: 1 }, { n: 'MAP.md', f: 1 }, { n: 'graph.json', f: 1 }, { n: 'MANIFEST.json', f: 1 }, { n: 'SHA256SUMS', f: 1 } ] },
  { n: 'Notes', rows: [ { n: 'meeting-16-sep.md', f: 1, b: '2 new' }, { n: 'ideas.md', f: 1 } ] },
];
const TABS_MAIN = [{ n: '00-BRIEF.md', c: 'blue', on: 1 }, { n: 'specs/booking.md', c: 'blue' }, { n: 'meeting-16-sep.md', c: 'green' }, { n: 'ideas.md', c: 'green' }];
// The phone's tree drawer, used by the drawer screens below.
const PHONE_TREE = `<div class="sidehead">${ic('chevron_right', 16)} Tree<span class="sp"></span><span class="pill">${ic('add', 14)} project</span></div>${treeRows(PROJECTS_MAIN)}<div class="sidefoot">${ic('sync', 14)} Synced 2 min ago</div>`;
void PHONE_TREE;

function page(title, body, cls = '') {
  return `<!doctype html><html lang="en" class="${cls}"><head><meta charset="utf-8"><title>${title}</title><style>${CSS}</style></head><body>${body}</body></html>`;
}

const screens = {};
// Each screen is written twice: sNN-name.html (1440x900) and sNN-name-phone.html (390x844).
function screen(id, title, desktop, phoneHtml, cls = '') {
  screens[id] = page(title, desktop, cls);
  screens[id + '-phone'] = page(title + ' (phone)', phoneHtml, cls);
}

// ---------------------------------------------------------------------------
// S01 sign in. The front door. Nothing behind it is reachable without an account.
const GATE_CARD = `<div class="cardx"><span class="mark lg">fm</span>
<h1>Sign in to frontmatter</h1>
<p class="lede">Your documents, your ideas and your agents' briefs, in one place. Same account on the web, the desktop app and your phone.</p>
<div class="stack"><span class="btn primary">${brand('google', 18)} Continue with Google</span><span class="btn">${brand('github', 18)} Continue with GitHub</span></div>
<p class="fine">No password, no puzzle, no tour. We never train on your documents, and <u>here are the providers</u> that keep that true. <u>Privacy</u> · <u>Terms</u></p></div>`;
screen('s01-sign-in', 'Sign in', `<div class="gate">
<div class="left">${GATE_CARD}</div>
<div class="right"><div><div class="preview"><header class="top"><span class="topleft"><span class="mark">fm</span><span class="wordmark">frontmatter</span></span><span class="topright"><span class="seg tight"><span>Edit</span><span class="on">Live</span><span>Reading</span></span></span></header>
<div class="pv"><div class="md" style="font-size:13px;max-width:none">${DOC_BRIEF_SHORT}</div></div></div>
<div class="three"><div><b>Write</b>Markdown that stays yours, in a Doc mode or a plain one.</div><div><b>Decide</b>Turn an idea into a brief your agent can build from.</div><div><b>Ship</b>Share, publish, or push to GitHub and Google Drive.</div></div></div></div></div>`,
`<div class="phone">${IOSBAR}
<header class="top" style="border-bottom:0"><span class="topleft" style="padding-left:8px"><span class="mark">fm</span><span class="wordmark">frontmatter</span></span></header>
<div class="pbody pgate"><div class="preview"><header class="top"><span class="topleft"><span class="ttl" style="font-size:12.5px;font-weight:600">00-BRIEF.md</span></span><span class="topright"><span class="seg tight"><span>Edit</span><span class="on">Live</span><span>Read</span></span></span></header>
<div class="pv"><div class="md"><h1>Zephyrus booking, in one page</h1><p>A booking page for small studios that take appointments by WhatsApp today. One link, a calendar of open slots, a deposit.</p></div></div></div>
<h1>Sign in to frontmatter</h1>
<p class="lede">Your documents, your ideas and your agents' briefs, in one place. Same account on the web, the desktop app and your phone.</p>
<div class="stack"><span class="btn primary">${brand('google', 18)} Continue with Google</span><span class="btn">${brand('github', 18)} Continue with GitHub</span></div>
<div class="three"><div>${ic('edit_note', 18)}<b>Write</b></div><div>${ic('lightbulb', 18)}<b>Decide</b></div><div>${ic('rocket_launch', 18)}<b>Ship</b></div></div>
<p class="fine">No password, no puzzle, no tour. We never train on your documents, and <u>here are the providers</u> that keep that true. <u>Privacy</u> · <u>Terms</u></p></div>
<div class="homeind"><i></i></div></div>`);

// S02 home, first time. Empty, so the five ways to start are the whole page.
const STARTS = [
  ['note_add', 'Blank document', 'Markdown, saved as you type', ''],
  ['lightbulb', 'From an idea', 'Describe it. Answer questions. Get a brief and a blueprint', 'ai'],
  ['upload', 'Import', 'Drop files or a whole folder. Google Docs, Word, Notion, Obsidian', ''],
  ['code', 'From GitHub', 'Open a repository’s docs and write back to it', ''],
  ['table_view', 'A template', 'Spec, meeting notes, decision record, README, 14 more', ''],
];
function starts(list = STARTS) {
  return `<div class="starts">${list.map(s => `<div class="start ${s[3]}">${ic(s[0], 22)}<b>${s[1]}</b><span>${s[2]}</span></div>`).join('')}</div>`;
}
function homeTop(extra = '') {
  return `<header class="top"><span class="topleft"><span class="mark">fm</span><span class="wordmark">frontmatter</span></span>
  <span class="topright"><span class="search" style="min-width:360px">${ic('search', 16)} Search documents, ideas and shared pages<kbd>⌘K</kbd></span>${extra}<span class="ibtn">${ic('settings', 18)}</span><span class="ibtn">${ic('dark_mode', 18)}</span><i class="vsep"></i><span class="avatar" style="background:#18181b">SM</span><span class="uname">Sagnik</span></span></header>`;
}
screen('s02-home-first', 'Home, first time', `<div class="app">${homeTop()}
<div class="home"><div class="hh"><h1>Good evening, Sagnik</h1></div>
<div class="htabs"><span class="on">Documents</span><span>Ideas</span><span>Shared with me</span></div>
${starts()}
<div class="recent"><div class="r h"><span>Recent</span><span>Project</span><span>Opened</span><span>Owner</span><span></span></div>
<div style="padding:34px 0;color:var(--muted);font-size:13px;text-align:center;border-bottom:1px solid var(--border)">Nothing yet. Start above, or drop a folder anywhere on this page.<br><span style="font-size:12px">Free: ${CAPS.docs} documents in the cloud, ${CAPS.pub} published pages, ${CAPS.collab} live collaborators. Unlimited on the desktop app.</span></div></div></div></div>`,
phone({ title: 'Home', bottom: 'home', right: `<span class="avatar" style="background:#18181b">SM</span>`, body: `<div class="home"><div class="htabs" style="margin-top:0"><span class="on">Documents</span><span>Ideas</span><span>Shared</span></div>
${starts(STARTS.slice(0, 4))}
<div style="padding:22px 0;color:var(--muted);font-size:13px;text-align:center">Nothing yet. Start above.<br><span style="font-size:12px">Free: ${CAPS.docs} documents, ${CAPS.pub} published pages, ${CAPS.collab} live collaborators.</span></div></div>` }));

// S03 home, returning. Recent documents, the ideas tab count, shared pages.
const RECENT = [
  ['00-BRIEF.md', 'Zephyrus booking', '2 min ago', 'You'], ['specs/booking.md', 'Zephyrus booking', 'Today 11:40', 'Amit'],
  ['meeting-16-sep.md', 'Notes', 'Yesterday', 'You'], ['AGENTS.md', 'Zephyrus booking', '12 Sep', 'You'], ['portfolio.md', 'Personal', '10 Sep', 'You'], ['ideas.md', 'Notes', '8 Sep', 'You'],
];
screen('s03-home', 'Home', `<div class="app">${homeTop()}
<div class="home"><div class="hh"><h1>Good evening, Sagnik</h1><span class="sp" style="flex:1"></span><span class="pill">${ic('cloud_done', 13)} 12 of ${CAPS.docs} cloud documents used</span></div>
<div class="htabs"><span class="on">Documents</span><span>Ideas · 3</span><span>Shared with me · 2</span></div>
${starts()}
<div class="recent"><div class="r h"><span>Recent</span><span>Project</span><span>Opened</span><span>Owner</span><span></span></div>
${RECENT.map(r => `<div class="r"><b>${ic('description', 16)} ${r[0]}</b><span>${r[1]}</span><span>${r[2]}</span><span>${r[3]}</span><span class="ibtn">${ic('more_horiz', 16)}</span></div>`).join('')}</div></div></div>`,
phone({ title: 'Home', bottom: 'home', body: `<div class="home"><div class="htabs" style="margin-top:0"><span class="on">Documents</span><span>Ideas · 3</span><span>Shared · 2</span></div>
${starts(STARTS.slice(0, 4))}
<div class="recent"><div class="r h"><span>Recent</span><span></span></div>${RECENT.slice(0, 5).map(r => `<div class="r"><b style="flex-direction:column;align-items:flex-start;gap:1px;white-space:normal">${r[0]}<span style="font-size:11px;color:var(--muted);font-weight:400">${r[1]} · ${r[2]}</span></b><span class="ibtn">${ic('more_horiz', 16)}</span></div>`).join('')}</div></div>` }));

// S04 workspace, Markdown mode, Live
screen('s04-workspace', 'Workspace', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body">
${tree({ projects: PROJECTS_MAIN, foot: `${ic('sync', 14)} Synced 2 min ago` })}
<main class="main">${modebar('Live', '<span class="pill ok">' + ic('check', 13) + ' Saved</span>')}
<div class="doc"><div class="md">${DOC_BRIEF}</div></div>
</main>
${rail({ outline: OUTLINE_BRIEF })}
</div></div>`,
phone({ mode: 'Live', title: '00-BRIEF.md', body: `${pmodebar('Live')}<div class="pdoc"><div class="md">${DOC_BRIEF}</div></div>` }));

// S05 doc mode. Same file, a Google-Docs-shaped surface.
const DOC_DOCMODE = `<h1 style="border:0;font-size:2em">Zephyrus booking, in one page</h1>
<p>A booking page for small studios that take appointments by WhatsApp today. One link, a calendar of open slots, a deposit, and a reminder the day before.</p>
<h2 style="border:0">The first user</h2>
<p>A two-chair salon in Kolkata that loses about four bookings a week to double-booking and no-shows. <span class="cmt">The owner runs everything from a phone.</span></p>
<ul><li>Books from WhatsApp messages, by hand, into a paper diary</li><li>Takes deposits by UPI, then forgets who paid</li><li>Wants a link to put in the Instagram bio</li></ul>
<table><tr><th>Channel</th><th>Bookings</th></tr><tr><td>Instagram</td><td>312</td></tr><tr><td>WhatsApp</td><td>186</td></tr></table>
<h2 style="border:0">The one metric</h2>
<p>No-shows per hundred bookings, before and after the deposit step.</p>`;
screen('s05-doc-mode', 'Doc mode', `<div class="app">
${top({ tabs: TABS_MAIN, presence: [{ i: 'AM', c: '#b2625e' }, { i: 'SM', c: '#18181b' }] })}
<div class="body noright">
${tree({ projects: PROJECTS_MAIN, foot: `${ic('sync', 14)} Synced 2 min ago` })}
<main class="main">${docbar()}<div class="ruler">1 · 2 · 3 · 4 · 5 · 6 · 7 · 8 · 9 · 10 · 11 · 12 · 13 · 14 · 15 · 16</div>
<div class="doc" style="padding:22px 48px 0;background:var(--bg-subtle)"><div class="paper"><div class="md docmode">${DOC_DOCMODE}</div></div>
<div class="cmtbox"><div class="who"><span class="avatar" style="width:16px;height:16px;font-size:8px;background:#b2625e">AM</span> Amit · 10 min ago</div>Is this still true after the laptop they bought in August?<div class="rep">Reply</div></div></div>
<div class="toast">${ic('description', 15)} <span>Doc mode is a view. The file is still <b>00-BRIEF.md</b>. Page setup lives in its front matter; colours and fonts render here and export to PDF only.</span></div>
</main>
</div></div>`,
phone({ mode: 'Live', title: '00-BRIEF.md', body: `${pmodebar('Live', 'Doc')}<div class="pdoc" style="background:var(--bg-subtle);padding:12px"><div class="paper" style="padding:26px 22px"><div class="md docmode" style="font-size:14px">${DOC_DOCMODE}</div></div></div>` }));

// S06 AI writing on an empty document
screen('s06-ai-writing', 'AI writing box', `<div class="app">
${top({ tabs: [...TABS_MAIN.map(t => ({ ...t, on: 0 })), { n: 'Untitled.md', c: 'green', on: 1 }] })}
<div class="body">
${tree({ projects: [PROJECTS_MAIN[0], { n: 'Notes', rows: [{ n: 'meeting-16-sep.md', f: 1 }, { n: 'ideas.md', f: 1 }, { n: 'Untitled.md', f: 1, on: 1 }] }] })}
<main class="main">${modebar('Live')}
<div class="doc"><div class="md"><h1 style="color:var(--muted);border:0">Untitled</h1></div></div>
<div class="aibox"><div class="target">${ic('description', 14)} Writing a new document <b>Untitled.md</b><span class="sp"></span><span class="swap">Change</span></div>
<div class="in">${ic('auto_awesome', 18)} A booking page for small salons, deposits by UPI, reminders the day before<span class="go">${ic('arrow_forward', 16)}</span></div>
<div class="chips"><span class="chip on">${ic('description', 14)} One document</span><span class="chip">${ic('lightbulb', 14)} Take it to Ideas: a brief and a blueprint</span><span class="chip">${ic('content_copy', 14)} Clean up a paste</span><span class="chip">${ic('checklist', 14)} Plan from notes</span></div>
<div class="chips alt"><span class="lbl">Or start from</span><span class="chip">${ic('code', 14)} Open from GitHub</span><span class="chip">${ic('upload', 14)} Drop a file or folder</span><span class="chip">${ic('table_view', 14)} A template</span></div>
<div class="foot">${ic('auto_awesome', 12)} A document uses 1 edit credit. This month: 7 of ${CAPS.edits} edits left. <u>Get more</u></div></div>
</main>
${rail({ outline: '<div style="color:var(--muted)">Nothing yet.</div>', counts: [0, 0, 0] })}
</div></div>`,
phone({ mode: 'Live', title: 'Untitled.md', bottom: 'auto_awesome', body: `${pmodebar('Live')}<div class="pdoc"><div class="md"><h1 style="color:var(--muted);border:0">Untitled</h1></div></div>
<div class="aibox"><div class="target">${ic('description', 14)} Writing <b>Untitled.md</b></div>
<div class="in">${ic('auto_awesome', 18)} A booking page for small salons…<span class="go">${ic('arrow_forward', 16)}</span></div>
<div class="chips"><span class="chip on">${ic('description', 14)} One document</span><span class="chip">${ic('lightbulb', 14)} Take it to Ideas</span><span class="chip">${ic('content_copy', 14)} Clean up a paste</span></div>
<div class="foot">${ic('auto_awesome', 12)} 1 edit credit · 7 of ${CAPS.edits} left</div></div>` }));

// S07 AI edit with inline suggestion
const DOC_AIEDIT = `<h1>Zephyrus booking, in one page</h1>
<p>A booking page for small studios that take appointments by WhatsApp today. One link, a calendar of open slots, a deposit, and a reminder the day before.</p>
<h2>The first user</h2>
<p><span class="ai-del">A two-chair salon in Kolkata that loses about four bookings a week to double-booking and no-shows.</span> <span class="ai-sug">A two-chair salon in Kolkata. It loses about four bookings a week to double-booking and no-shows, which is a day's takings.</span><span class="suggest"><span class="btn primary">${ic('check', 13)} Accept</span><span class="btn">Reject</span></span> The owner runs everything from a phone.</p>
<ul><li>Books from WhatsApp messages, by hand, into a paper diary</li><li>Takes deposits by UPI, then forgets who paid</li></ul>`;
const AI_MENU = `<div class="mi on"><b>Refine selection</b><span>Polish prose, fix grammar</span></div><div class="mi"><b>Expand</b><span>Add detail and depth</span></div><div class="mi"><b>Shorten</b><span>More concise, same meaning</span></div><div class="mi"><b>Change tone</b><span>Professional or casual</span></div><div class="mi"><b>Translate</b><span>Keep the markdown intact</span></div><div class="mi"><b>Summarise into a callout</b><span>Adds a summary block</span></div><div class="mi"><b>Suggest links</b><span>Wiki links to your notes</span></div><div class="mi" style="border-top:1px solid var(--border);margin-top:4px;padding-top:8px"><span>1 credit each · 7 left · runs on a free model this month</span></div>`;
screen('s07-ai-edit', 'AI edit', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body">
${tree({ projects: PROJECTS_MAIN })}
<main class="main">${modebar('Edit', '<span class="pill ai">' + ic('auto_awesome', 13) + ' Suggesting</span>')}
<div class="doc"><div class="md">${DOC_AIEDIT}</div>
<div class="pop" style="top:140px;right:60px">${AI_MENU}</div>
</div></main>
${rail({ outline: OUTLINE_BRIEF })}
</div></div>`,
phone({ mode: 'Edit', title: '00-BRIEF.md', bottom: 'auto_awesome', body: `${pmodebar('Edit')}<div class="pdoc"><div class="md">${DOC_AIEDIT}</div></div>`, overlay: psheet(`<h2>AI edit the selection</h2><div class="pop" style="position:static;box-shadow:none;border:0;padding:0">${AI_MENU}</div>`) }));

// S08 custom blocks, split view
function pieSvg() {
  const slices = [[52, '#18181b'], [31, '#5b8cff'], [17, '#b8791b']];
  let a0 = -Math.PI / 2, out = '';
  const cx = 110, cy = 110, r = 90;
  for (const [pct, col] of slices) {
    const a1 = a0 + (pct / 100) * Math.PI * 2;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    out += `<path d="M${cx},${cy} L${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${pct > 50 ? 1 : 0},1 ${x1.toFixed(1)},${y1.toFixed(1)} Z" fill="${col}"/>`;
    a0 = a1;
  }
  return `<svg width="220" height="220" viewBox="0 0 220 220">${out}</svg>`;
}
const SRC_BLOCKS = `## Where bookings came from

| Channel   | Bookings |
|-----------|---------:|
| Instagram |      312 |
| WhatsApp  |      186 |
| Walk-in   |      102 |

<span class="kw">\`\`\`fm-chart</span>
kind: pie
table: above
<span class="kw">\`\`\`</span>

<span class="kw">\`\`\`mermaid</span>
flowchart LR
  A[Link in bio] --> B[Pick a slot]
  B --> C[Pay deposit] --> D[Reminder]
<span class="kw">\`\`\`</span>

> [!tip] Deposits
> A refundable deposit cut no-shows to 6 in 100.

The deposit is $ d = 0.2 \\times p $ of the price.`;
const RENDER_BLOCKS = `<h2 style="margin-top:0">Where bookings came from</h2>
<div style="display:flex;gap:26px;align-items:center;margin:.6em 0 .4em">${pieSvg()}<div style="font-size:13px"><div style="display:flex;gap:8px;align-items:center;margin:6px 0"><i style="width:10px;height:10px;background:#18181b;border-radius:2px"></i>Instagram · 312 · 52%</div><div style="display:flex;gap:8px;align-items:center;margin:6px 0"><i style="width:10px;height:10px;background:#5b8cff;border-radius:2px"></i>WhatsApp · 186 · 31%</div><div style="display:flex;gap:8px;align-items:center;margin:6px 0"><i style="width:10px;height:10px;background:#b8791b;border-radius:2px"></i>Walk-in · 102 · 17%</div></div></div>
<div style="font-size:12px;color:var(--muted);margin:0 0 1.2em">${ic('table_chart', 14)} Table folded. Click to show the three rows.</div>
<div style="display:flex;gap:10px;align-items:center;margin:1em 0;font-size:13px;flex-wrap:wrap">${['Link in bio', 'Pick a slot', 'Pay deposit', 'Reminder'].map((s, i) => `<span style="border:1px solid var(--border-strong);border-radius:6px;padding:6px 10px;background:var(--panel-2)">${s}</span>${i < 3 ? ic('arrow_forward', 16) : ''}`).join('')}</div>
<div class="callout"><div class="t">Tip · Deposits</div>A refundable deposit cut no-shows to 6 in 100.</div>
<p>The deposit is <i>d</i> = 0.2 × <i>p</i> of the price.</p>`;
screen('s08-custom-blocks', 'Custom blocks', `<div class="app">
${top({ tabs: [{ n: 'bookings-q3.md', c: 'amber', on: 1 }] })}
<div class="body noright">
${tree({ projects: [{ n: 'Notes', rows: [{ n: 'bookings-q3.md', f: 1, on: 1 }, { n: 'ideas.md', f: 1 }] }] })}
<main class="main">${modebar('Split')}
<div class="split"><div class="pane"><div class="src">${SRC_BLOCKS}</div>
<div class="elsewhere"><b>Elsewhere</b> (GitHub, Obsidian, VS Code): the table is still a table, and the chart block is a two-line code block under it. Mermaid renders on GitHub, GitLab and in Obsidian. The callout renders on GitHub as a note. Math renders on GitHub.</div></div><div class="gut"></div>
<div class="pane"><div class="md" style="max-width:none">${RENDER_BLOCKS}</div></div></div>
</main></div></div>`,
phone({ mode: 'Reading', title: 'bookings-q3.md', body: `${pmodebar('Reading')}<div class="pdoc"><div class="md" style="font-size:14px">${RENDER_BLOCKS.replace('width="220" height="220"', 'width="150" height="150"')}</div></div>` }));

// S09 the flow view: a document read as phases and steps
const FLOW = [
  { t: 'Pre-open lock', m: '09:00 to 09:14 IST · 3 steps', d: 'The only hard deadline in the system', steps: [
    ['Revise today’s predictions', '', 'Any prediction maturing today may be edited until 09:14. Every revision is stored with its time; nothing is overwritten.', 'Akhil · P4'],
    ['Lock at 09:14', 'GATE', 'All predictions maturing today freeze. Past this instant the day cannot be reconstructed.', 'W1'],
    ['Alert if the lock did not run', 'ALARM', 'Hard timeout and alert. A missed lock silently destroys one day of accuracy data.', 'W1(c)'] ] },
  { t: 'Market hours', m: '09:15 to 15:30 IST · 6 steps', d: 'Live tracking. The shadow book trades itself', steps: [
    ['Live quotes', 'IO', 'get_ltp, get_ohlc, get_quote on the paid plan. Scopes confirmed active.', '§19.1'],
    ['Watch open positions', 'LOOP', 'For every open position, compare live price against its stop, its partial level and its target.', 'A1 · A2 · A6'],
    ['No real broker order, ever', 'HARD', 'No broker write path exists in the codebase and none will.', 'H4 · T5'] ] },
  { t: 'Close', m: '15:30 IST · 1 step', d: 'Nothing is decided on live prices', steps: [
    ['Session closes', '', 'All decisions use closing data. The engine never acts on an intraday print.', 'H1'] ] },
  { t: 'Ingest', m: '16:00 IST · 5 steps', d: 'The full universe, bhavcopy, corporate actions', steps: [
    ['Universe = every tradeable equity', 'NEW', '812 symbols, plus new listings. No screener decides who gets scored.', 'owner, 11 Aug'],
    ['Data-health gate', 'GATE', 'One health number. Below the floor the day is skipped rather than traded on bad data.', 'G6 · H2'] ] },
];
function flowCols(cols) {
  return cols.map(c => `<div class="col"><div class="ch"><div class="t">${c.t}</div><div class="m">${c.m}</div><div class="d">${c.d}</div></div>
  ${c.steps.map(s => `<div class="step"><div class="st">${s[0]}${s[1] ? `<span class="b t-${s[1].toLowerCase()}">${s[1]}</span>` : ''}</div><div class="sb">${s[2]}</div><div class="sr">${s[3]}</div></div>`).join('')}</div>`).join('');
}
const VIEWAS = `<div class="pop" style="top:44px;right:190px;min-width:220px"><div class="mi row2"><b>Page</b><span>The document</span></div><div class="mi row2 on"><b>Flow</b><span>Headings as phases, items as steps</span></div><div class="mi row2"><b>Slides</b><span>One heading per slide</span></div><div class="mi row2"><b>Mind map</b><span>The outline, radial</span></div><div class="mi row2"><b>Kanban</b><span>Task lists as columns</span></div><div class="mi row2"><b>Outline</b><span>Headings only</span></div></div>`;
screen('s09-flow-view', 'Flow view', `<div class="app">
${top({ tabs: [{ n: 'execution-flow.md', c: 'amber', on: 1 }, { n: '00-BRIEF.md', c: 'blue' }] })}
<div class="body noright">
${tree({ projects: [{ n: 'Trade system', icon: 'rocket_launch', rows: [{ n: 'execution-flow.md', f: 1, on: 1 }, { n: 'runbook.md', f: 1 }, { n: 'decisions', d: 1 }] }, PROJECTS_MAIN[1]], foot: `${ic('account_tree', 14)} 17 phases · 76 steps` })}
<main class="main">${modebar('Reading', `<span class="tool txt on">${ic('account_tree', 16)} View as: Flow ${ic('arrow_drop_down', 16)}</span>`, '17 phases · 76 steps')}
${VIEWAS}
<div class="legend"><span><i style="background:#5b8cff"></i>Data</span><span><i style="background:#4f8b6b"></i>Signal</span><span><i style="background:#b8791b"></i>Portfolio</span><span><i style="background:#18181b"></i>Prediction</span><span style="margin-left:auto;color:var(--muted)">Scroll sideways · arrow keys · a phase is an H2, a step is an H3, the tag is the first word in brackets</span></div>
<div class="flow">${flowCols(FLOW)}</div>
</main></div></div>`,
phone({ mode: 'Reading', title: 'execution-flow.md', body: `${pmodebar('Reading')}<div style="display:flex;gap:6px;padding:8px 14px;overflow:hidden;border-bottom:1px solid var(--border)"><span class="chip on">Flow</span><span class="chip">Page</span><span class="chip">Slides</span><span class="chip">Mind map</span><span class="chip">Kanban</span></div>
<div class="flow">${flowCols(FLOW.slice(0, 2)).replace('· 6 steps', '· 6 steps')}</div>` }));

// S10 problems panel
const PROBS = `${filterseg([['All', 5], ['Checks', 4], ['Writing', 1]], 0)}<div class="prob"><i class="dot err"></i><div><b>Link goes nowhere</b><em>[[06-BACKEND-SPEC]] does not exist in this project</em></div><span class="ln">L9</span></div>
<div class="prob"><i class="dot warn"></i><div><b>Heading level skips</b><em>H1 to H3 with no H2 between them</em></div><span class="ln">L11</span></div>
<div class="prob"><i class="dot warn"></i><div><b>Image has no alt text</b><em>Screen readers and exports will show nothing</em></div><span class="ln">L13</span></div>
<div class="prob"><i class="dot warn"></i><div><b>Table row has 3 cells, header has 2</b><em>It will render wrong on GitHub</em></div><span class="ln">L18</span></div>
<div class="prob"><i class="dot info"></i><div><b>Sentence is 61 words</b><em>Longer than anything else you have written. Split it, or add the "because" that earns it</em></div><span class="ln">L7</span></div>`;
const DOC_PROBLEMS = `<h1>Zephyrus booking, in one page</h1>
<p>A booking page for small studios that take appointments by WhatsApp today. One link, a calendar of open slots, a deposit, and a reminder the day before.</p>
<p>The owner of a two-chair salon in Kolkata loses about four bookings a week to double-booking and no-shows because the diary is on paper and the deposits arrive by UPI with no name attached, so the plan is to put one link in the Instagram bio that shows open slots, takes a deposit and sends a reminder the day before, and to measure whether no-shows fall.</p>
<p>The payments flow is in [[06-BACKEND-SPEC]].</p>
<h3>Deposits</h3>
<p><img src="deposit-flow.png"></p>
<table><tr><th>Channel</th><th>Bookings</th></tr><tr><td>Instagram</td><td>312</td><td>52%</td></tr><tr><td>WhatsApp</td><td>186</td></tr></table>`;
screen('s10-problems', 'Problems', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body">
${tree({ projects: PROJECTS_MAIN })}
<main class="main">${modebar('Live', '<span class="pill">' + ic('warning', 13) + ' 5 problems</span>')}
<div class="doc"><div class="md">${DOC_PROBLEMS}</div></div>
</main>
<aside class="rail"><div class="rsec grow"><div class="rh">${ic('warning', 14)} Problems<span class="sp"></span><span class="pill">5</span></div>
${PROBS}
<div style="font-size:11.5px;color:var(--muted);margin-top:10px">Structural checks run on this device and cost nothing. The writing note is advisory and never blocks.</div></div>
<div class="rrow">${ic('sell', 16)} Tags and bookmarks<span class="sp"></span><span class="cnt">4</span>${ic('chevron_right', 16)}</div>
<div class="rrow">${ic('format_list_bulleted', 16)} Outline<span class="sp"></span>${ic('chevron_right', 16)}</div>
<div class="railfoot"><div class="two"><span class="btn">${ic('check', 16)} Fix all safe</span><span class="btn">${ic('settings', 16)} Rules</span></div>
<span class="btn ai">${ic('auto_awesome', 16)} AI edit</span></div>
</aside></div></div>`,
phone({ mode: 'Live', title: '00-BRIEF.md', bottom: 'more_horiz', body: `${pmodebar('Live')}<div class="pdoc"><div class="md">${DOC_PROBLEMS}</div></div>`, overlay: pdrawer(`<div class="rsec grow"><div class="rh">${ic('warning', 14)} Problems<span class="sp"></span><span class="pill">5</span></div>${PROBS}</div><div class="railfoot"><span class="btn">${ic('check', 16)} Fix all safe</span></div>`, 'right') }));

// S11 instruction files: AGENTS.md with a health panel
const DOC_AGENTS = `<h1>AGENTS.md</h1>
<p>Onboarding contract for AI agents and new developers. Last verified 16 September 2026.</p>
<h2>Setup commands</h2>
<ul><li>Install: <code>npm install</code></li><li>Dev server: <code>npm run dev</code></li><li>Everything must pass: <code>npm run verify</code></li></ul>
<h2>Code style</h2>
<ul><li>TypeScript strict, no default exports</li><li>British spelling in prose</li><li>Cross-module imports go through the barrel, never a deep path</li></ul>
<h2>Do not</h2>
<ul><li>Never commit a file you did not author in this session</li><li>Never write to <code>main</code> without a passing verify</li></ul>`;
// S11 rewritten 18 September. It was a health panel on one AGENTS.md. The research of
// that morning found the demand is about SEVERAL files: 6,644 reactions on one request,
// and an ordinary three-tool team keeps four or more near-identical copies. It also found
// two studies saying these files do not raise task success, so the panel may claim the
// file is CORRECT and must not claim it makes an agent smarter.
const FILESET = [
  ['AGENTS.md', 'the source', 'ok', 'Claude Code, Codex, Cursor, Jules, Amp, opencode, Zed, Warp'],
  ['CLAUDE.md', 'one-line import', 'ok', 'Claude Code'],
  ['.github/copilot-instructions.md', 'copy, in step', 'ok', 'Copilot coding agent'],
  ['.cursor/rules/style.mdc', 'copy, drifted', 'warn', 'Cursor'],
  ['GEMINI.md', 'missing', 'off', 'Gemini CLI'],
];
const AGENTS_HEALTH = `<div class="rsec"><div class="rh">${ic('account_tree', 14)} Instruction files<span class="sp"></span><span class="pill">4 of 5</span></div>
${filterseg([['All', 5], ['Linked', 2], ['Copies', 2]], 0)}
<div class="kit">${FILESET.map(([f, s, k, who]) => `<div class="file ${k}">${ic(k === 'ok' ? 'check' : k === 'warn' ? 'warning' : 'add', 14, k === 'ok' ? 'ok' : '')}<span class="sp"><b style="display:block">${f}</b><em style="display:block;margin-top:1px">${s} &middot; ${who.split(',')[0]}${who.includes(',') ? ' and ' + (who.split(',').length - 1) + ' more' : ''}</em></span></div>`).join('')}</div>
<div class="drophint" style="margin:10px 0 0">${ic('add', 15)} Add GEMINI.md as an import</div></div>

<div class="rsec"><div class="rh">${ic('warning', 14)} One copy has drifted</div>
<div class="chk">${ic('warning', 15)}<div><b>.cursor/rules/style.mdc</b> is 3 lines behind AGENTS.md<em>Cursor does not read a plain .md in that folder, so this one has to be a copy. Diff it, or replace it with a generated copy that cannot drift</em></div></div>
<div style="display:flex;gap:6px;margin-top:8px"><span class="btn sm">${ic('visibility', 14)} Diff</span><span class="btn sm">${ic('refresh', 14)} Regenerate</span></div></div>

<div class="rsec"><div class="rh">${ic('checklist', 14)} Checks<span class="sp"></span><span class="pill ok">4 of 6</span></div>
<div class="chk">${ic('check', 15, 'ok')}<div>Under every published size limit<em>1,363 words, 9.4 KB. Codex caps this file at 32 KiB</em></div></div>
<div class="chk">${ic('check', 15, 'ok')}<div>Setup commands present<em>Install, dev and verify all named</em></div></div>
<div class="chk">${ic('warning', 15)}<div>Two claims unverified since 10 Sep<em>Line 14 and line 31 name commands nobody has run this week</em></div></div>
<div class="chk">${ic('warning', 15)}<div>Rules a linter already enforces<em>Lines 22 to 26 restate what Prettier and ESLint check. They cost tokens in every session and change nothing</em></div></div>
<div class="foot" style="margin-top:8px">These checks say the file is correct. They do not claim it makes an agent better at its job: two studies measured no gain in task success, and one measured over 20 per cent added cost.</div></div>`;

screen('s11-instruction-files', 'Instruction files', `<div class="app">
${top({ tabs: [{ n: 'AGENTS.md', c: 'amber', on: 1 }, { n: '00-BRIEF.md', c: 'blue' }, { n: 'ideas.md', c: 'green' }] })}
<div class="body">
${tree({ projects: [{ ...PROJECTS_MAIN[0], rows: PROJECTS_MAIN[0].rows.map(r => ({ ...r, on: r.n === 'AGENTS.md' ? 1 : 0 })) }, PROJECTS_MAIN[1]], foot: `${ic('account_tree', 14)} 5 instruction files, 1 drifted` })}
<main class="main">${modebar('Live', '<span class="pill ok">' + ic('check', 13) + ' Saved</span>')}
<div class="doc"><div class="md">${DOC_AGENTS}</div></div>
</main>
<aside class="rail">${AGENTS_HEALTH}
<div class="railfoot"><span class="btn ai">${ic('auto_awesome', 16)} Tidy this file</span>
<div class="credits">${ic('auto_awesome', 13)} 7 of ${CAPS.edits} edits left <span class="meter"><i style="width:70%"></i></span></div></div>
</aside></div></div>`,
phone({ mode: 'Live', title: 'AGENTS.md', bottom: 'more_horiz', body: `${pmodebar('Live')}<div class="pdoc"><div class="md">${DOC_AGENTS}</div></div>`, overlay: pdrawer(AGENTS_HEALTH, 'right') }));

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// S12 to S14 rebuilt 18 September on the founder's review. The old flow put a
// four-step breadcrumb, three large depth cards and two columns on the screen at
// once. The reference given was Claude and ChatGPT: one centred column, one input,
// and the depth picked from a small selector the way a model is picked. Medium and
// High reuse this exact layout so there is no second route to learn.
const IDEAS = [
  { n: 'Zephyrus booking', e: 'Blueprint v1 · 15 files', on: 1 },
  { n: 'Salon loyalty stamps', e: '9 of 12 answered' },
  { n: 'Clinic reminders over WhatsApp', e: 'Draft' },
];
function ideasTree() {
  return `<aside class="side ideas"><div class="sidehead">${ic('lightbulb', 16)} Ideas<span class="sp"></span><span class="pill">${ic('add', 14)} new</span></div>
  ${IDEAS.map(i => `<div class="row${i.on ? ' on' : ''}">${ic('lightbulb', 15)}<span class="n">${i.n}<em>${i.e}</em></span></div>`).join('')}
  <div class="sidefoot">${ic('auto_awesome', 14)} 1 blueprint credit left this month</div></aside>`;
}

// The depth selector. Three depths, one control, the shape of a model picker.
function depthPill(cur = 'Low') {
  return `<span class="selpill">${ic(cur === 'Low' ? 'bolt' : cur === 'Medium' ? 'insights' : 'psychology', 15)} ${cur} <span class="mut">depth</span> ${ic('expand_more', 15)}</span>`;
}
const DEPTH_MENU = `<div class="selmenu" style="left:0;top:calc(100% + 8px)">
<div class="mi on"><b>${ic('bolt', 16)} Low <span class="pill ok">Free</span></b><span>10 to 15 questions, each with a recommendation</span></div>
<div class="mi"><b>${ic('insights', 16)} Medium <span class="pill pro">Pro</span></b><span>20 to 30 questions, and every option says where it stands</span></div>
<div class="mi"><b>${ic('psychology', 16)} High <span class="pill pro">Pro · 3 credits</span></b><span>Medium, plus a research pass before the questions</span></div></div>`;

const IDEA_TEXT = 'A booking page for small salons that take appointments on WhatsApp today. One link for the Instagram bio, a calendar of open slots, a deposit, and a reminder the day before.';

function ideaInput({ text = IDEA_TEXT, depth = 'Low', menu = '' } = {}) {
  return `<div style="position:relative">
  <div class="bigin"><div class="txt">${text}</div>
    <div class="barrow">
      ${depthPill(depth)}
      <span class="iconbtn" title="Attach a drawing or a screenshot">${ic('image', 16)}</span>
      <span class="iconbtn" title="Attach a document">${ic('description', 16)}</span>
      <span class="iconbtn" title="Point at a repository">${ic('code', 16)}</span>
      <span class="sp"></span>
      <span class="sendbtn">${ic('arrow_forward', 17)}</span>
    </div></div>${menu}</div>`;
}

screen('s12-ideas', 'Ideas', `<div class="app">
${top({ tabs: [{ n: 'Ideas', c: 'blue', on: 1 }, { n: '00-BRIEF.md', c: 'blue' }] })}
<div class="body noright">
${ideasTree()}
<main class="main"><div class="doc" style="padding:40px 48px">
<div class="icol">
  <div class="ihead">What do you want to build?<em>Describe it in your own words. Questions come next, and you can skip any of them.</em></div>
  ${ideaInput({ menu: DEPTH_MENU })}
  <div class="attach" style="margin-top:12px"><span class="thumb"><svg viewBox="0 0 74 52" width="74" height="52"><rect x="5" y="6" width="28" height="14" rx="2" fill="none" stroke="var(--border-strong)"/><rect x="41" y="6" width="28" height="14" rx="2" fill="none" stroke="var(--border-strong)"/><rect x="5" y="26" width="64" height="20" rx="2" fill="none" stroke="var(--border-strong)"/></svg></span>
  <span class="meta">booking-flow.excalidraw<em>Attached. The blueprint will describe these screens and name them in the frontend spec.</em></span><span style="margin-left:auto">${ic('close', 16)}</span></div>
  <div class="chips" style="margin-top:14px;justify-content:center"><span class="lbl">Start from</span><span class="chip on">${ic('store', 14)} Local service business</span><span class="chip">SaaS</span><span class="chip">Marketplace</span><span class="chip">Internal tool</span><span class="chip">${ic('auto_awesome', 14)} One for my industry</span></div>
  <div class="foot" style="text-align:center;margin-top:16px">Low uses your blueprint credit for the month. Nothing is sent to a model until you press the arrow.</div>
</div></div></main></div></div>`,
phone({ title: 'Ideas', bottom: 'auto_awesome', body: `<div class="pdoc" style="padding:14px 14px 0">
<div class="icol"><div class="ihead">What do you want to build?<em>Questions come next. Skip any of them.</em></div>
${ideaInput()}
<div class="chips" style="margin-top:12px"><span class="chip on">${ic('store', 14)} Local service</span><span class="chip">SaaS</span><span class="chip">${ic('image', 14)} Drawing</span></div>
<div class="foot" style="margin-top:12px">Uses your blueprint credit for the month.</div></div></div>` }));

// S13 idea mode, Low. Four questions to a page, and the later pages are rewritten
// live when an answer changes what is worth asking.
const QCARDS = [
  { q: 'Who is the first user?', opts: [['a', 'A solo studio owner working from a phone', 'Fastest to reach, and deposits matter most to them', 1], ['b', 'A small chain with a front desk', 'Bigger ticket, slower to sell']] },
  { q: 'What ships first?', opts: [['a', 'Booking link, calendar, deposit, reminder', 'The four things your idea names', 1], ['b', 'Booking link and calendar only', 'Cheaper, but the deposit is the point']] },
  { q: 'Where does it run?', opts: [['a', 'A web page, no app', 'One link in the bio', 1], ['b', 'A web page and a WhatsApp bot', 'Two surfaces on day one']] },
  { q: 'Who takes the money?', opts: [['a', 'Razorpay, UPI and cards', 'Works in India, one mandate for repeat customers', 1], ['b', 'Cash on arrival', 'No deposit, so no-shows stay']] },
];
const qhtml = (list, from = 0) => list.map((c, i) => `<div class="qcard"><div class="q">${from + i + 1}. ${c.q}</div>${c.opts.map(o => `<div class="opt${o[3] ? ' rec' : ''}"><span class="k">${o[0]}</span><span>${o[1]}${o[3] ? '<span class="rec-tag">recommended</span>' : ''}${o[3] ? `<small>${o[2]}</small>` : ''}</span></div>`).join('')}<div class="qskip">Not sure, leave it open in DECISIONS.md</div></div>`).join('');
const QHTML = qhtml(QCARDS.slice(0, 3));

// The rewrite state. It shows only when a branching answer has actually changed the
// questions further on, so it means something when a person sees it.
const GHOST = `<div class="ghost"><div class="blurred"><div class="q" style="font-weight:600;font-size:13.5px;margin-bottom:7px">4. How does a customer pay the deposit?</div>
<div class="opt"><span class="k">a</span><span>UPI AutoPay mandate<small>Approved once, charged each time</small></span></div>
<div class="opt"><span class="k">b</span><span>A one-off UPI request<small>One attempt per booking</small></span></div></div>
<div class="work"><span class="spin"></span> Rewriting this and the next two pages from your answer to question 2</div></div>`;

function pageNav({ all = false }) {
  return `<div class="pagenav"><span class="btn">Skip</span><span class="btn">${ic('auto_awesome', 15)} Choose the recommendation</span>
  ${all ? `<span class="btn">Skip all remaining</span>` : ''}<span class="sp"></span>
  <span class="btn primary">Next ${ic('arrow_forward', 15)}</span></div>`;
}

screen('s13-idea-low', 'Idea mode, Low', `<div class="app">
${top({ tabs: [{ n: 'Ideas', c: 'blue', on: 1 }] })}
<div class="body noright">
${ideasTree()}
<main class="main"><div class="doc" style="padding:30px 48px">
<div class="icol wide">
  <div class="prog"><span>Page 1 of 3</span><span class="bar"><i style="width:33%"></i></span><span>4 of 12 questions</span>${depthPill('Low')}</div>
  <div class="qstack">${QHTML}${GHOST}</div>
  ${pageNav({})}
  <div class="foot" style="margin-top:10px">Anything you skip stays open in DECISIONS.md, and the blueprint says it is open rather than guessing.</div>
</div></div></main></div></div>`,
phone({ title: 'Ideas', bottom: 'auto_awesome', body: `<div class="pdoc" style="padding:12px 14px 0">
<div class="prog"><span>1 of 3</span><span class="bar"><i style="width:33%"></i></span>${depthPill('Low')}</div>
<div class="qstack">${qhtml(QCARDS.slice(0, 2))}${GHOST}</div>
<div style="display:flex;gap:6px;margin-top:4px"><span class="btn" style="flex:1">Skip</span><span class="btn primary" style="flex:1.4">${ic('auto_awesome', 14)} Recommended</span></div></div>` }));

const DCARD = `<div class="dcard"><div class="dq">4. Deposit before the booking is confirmed, or after?</div>
<div class="dsec">Where it stands</div><p>Your brief says no-shows cost about four bookings a week. Every comparable booking tool for salons in the template takes a deposit before confirming, and refunds it on cancellation inside a window.</p>
<div class="dsec">What forces the choice</div><p>UPI AutoPay needs a mandate the customer approves once; a card gets one attempt. A deposit after confirmation is a request the customer can ignore, which is the no-show again in a different shape.</p>
<div class="dsec">Options</div><div class="dopts">
<div class="dopt rec"><b>Deposit before confirmation <span class="rec-tag">recommended</span></b><span class="g">Gains</span>: no-show falls with the deposit; one payment step.<br><span class="c">Costs</span>: some customers drop at the pay step.</div>
<div class="dopt"><b>Deposit after, within 24 hours</b><span class="g">Gains</span>: more bookings start.<br><span class="c">Costs</span>: a second message, a second chance to vanish; the diary is provisional for a day.</div></div>
<div class="dsec">Evidence</div>
<div class="ev">${ic('description', 14)}<span>Your 00-BRIEF: "loses about four bookings a week to double-booking and no-shows"</span><span class="src">00-BRIEF.md:6</span></div>
<div class="ev">${ic('public', 14)}<span>RBI: UPI AutoPay mandates need a 24-hour pre-debit notice; ₹15,000 is the cap per transaction</span><span class="src">template source · last checked 16 Sep</span></div>
<div class="ev">${ic('public', 14)}<span>Razorpay: 2% plus GST a transaction on the standard plan</span><span class="src">template source · last checked 16 Sep</span></div>
<div style="display:flex;gap:8px;margin-top:14px;align-items:center"><span class="btn primary">${ic('check', 14)} Deposit before</span><span class="btn">Deposit after</span><span class="btn ghost">Not sure, take the recommendation</span><span style="margin-left:auto;font-size:11.5px;color:var(--muted)">Recorded in DECISIONS.md with the evidence</span></div></div>`;

// S14 Medium and High. The same layout, the same controls, one question at a time with
// the evidence opened out. Deliberately not a second route.
screen('s14-idea-medium', 'Idea mode, Medium and High', `<div class="app">
${top({ tabs: [{ n: 'Ideas', c: 'blue', on: 1 }] })}
<div class="body noright">
${ideasTree()}
<main class="main"><div class="doc" style="padding:30px 48px">
<div class="icol wide">
  <div class="prog"><span>Page 2 of 7</span><span class="bar"><i style="width:29%"></i></span><span>8 of 26 questions</span>${depthPill('Medium')}</div>
  ${DCARD}
  ${pageNav({ all: true })}
  <div class="foot" style="margin-top:10px">Medium and High ask more, and show where each option stands. Everything else works exactly as it does on Low.</div>
</div></div></main>
<div class="skipmodal"><div class="card"><h3>Skip the remaining 18 questions?</h3>
<p>Every one of them takes its recommended answer. You can see what was chosen, and change any of it, before the blueprint is written.</p>
<p>The brief, the blueprint and the kickoff prompt are all generated from those defaults.</p>
<div style="display:flex;gap:8px;margin-top:14px;justify-content:flex-end"><span class="btn">Keep answering</span><span class="btn primary">${ic('auto_awesome', 15)} Use the recommendations</span></div></div></div>
</div></div>`,
phone({ title: 'Ideas', bottom: 'auto_awesome', body: `<div class="pdoc" style="padding:12px 14px 0">
<div class="prog"><span>2 of 7</span><span class="bar"><i style="width:29%"></i></span>${depthPill('Medium')}</div>
${DCARD}
<div style="display:flex;gap:6px;margin-top:4px"><span class="btn" style="flex:1">Skip</span><span class="btn primary" style="flex:1.4">${ic('auto_awesome', 14)} Recommended</span></div>
<div style="margin-top:6px"><span class="btn" style="width:100%">Skip all remaining</span></div></div>` }));

// S15 blueprint ready
const KITLIST = [['SKILL.md', 0, 'Loaded first'], ['AGENTS.md', 0, 'Every agent reads it'], ['00-BRIEF.md', 0], ['01-PRODUCT.md', 0], ['02-DATA-AND-API.md', 0], ['03-ARCHITECTURE.md', 0], ['04-SETUP.md', 0], ['05-FRONTEND-SPEC.md', 0, 'From the drawing'], ['specs/', 1], ['booking.md', 2], ['payments.md', 2], ['DECISIONS.md', 0, '12 decisions, 2 open'], ['MAP.md', 0], ['graph.json', 0, 'For the agent'], ['MANIFEST.json', 0], ['SHA256SUMS', 0]];
const KIT_RAIL = `<div class="rsec"><div class="rh">${ic('rocket_launch', 14)} Blueprint<span class="sp"></span><span class="pill">v1</span></div>
<div class="kit">${KITLIST.map(f => `<div class="file${f[1] === 2 ? ' d2' : ''}">${ic(f[1] === 1 ? 'folder' : 'description', 14)}<span class="sp">${f[0]}</span>${f[2] ? `<em class="hint">${f[2]}</em>` : ic('check', 14, 'ok')}</div>`).join('')}</div>
<div style="font-size:12px;color:var(--fg-muted);margin-top:8px">A skill folder, so any agent that follows the standard can install it. SKILL.md loads first; the rest only when the agent needs them.</div>
<div style="font-size:12px;color:var(--fg-muted);margin-top:6px">Consistency check: every name in 02-DATA-AND-API appears in specs. Two names were fixed before you saw them.</div></div>
<div class="rsec"><div class="rh">${ic('link', 14)} Link, unlisted</div><div class="linkbox">${ic('public', 14)} frontmatter.in/k/7f3a…c91e/<span style="margin-left:auto">${ic('content_copy', 14)}</span></div>
<div class="linkbox">${ic('fingerprint', 14)} sha256 9c1e…4b7a<span style="margin-left:auto">${ic('content_copy', 14)}</span></div>
<div style="font-size:11.5px;color:var(--muted)">Anyone with the link can read it. Not indexed. Revoke any time. The hash is printed here so an agent can check the kit before it unpacks it.</div></div>
<div class="rsec"><div class="rh">${ic('terminal', 14)} Kickoff prompt<span class="sp"></span></div><div style="margin:-2px 0 8px"><span class="seg" style="padding:2px"><span class="on" style="padding:2px 9px">Claude Code</span><span style="padding:2px 9px">Cursor</span><span style="padding:2px 9px">Codex</span></span></div>
<div class="prompt">The documents for this project are at https://frontmatter.in/k/7f3a…c91e/ (version 1). Their hash is sha256 9c1e…4b7a.
1. curl -sL …/v1/kit.tar.gz -o kit.tar.gz && shasum -a 256 kit.tar.gz   (stop unless it prints 9c1e…4b7a)
2. mkdir -p docs/kit && tar xzf kit.tar.gz -C docs/kit
3. Read 00-BRIEF.md, then the rest in order. Do not build until you have read them. Build against specs/*.md.</div>
<span class="btn primary" style="width:100%">${ic('content_copy', 15)} Copy the kickoff prompt</span></div>`;
screen('s15-blueprint-ready', 'Blueprint ready', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body wide">
${tree({ projects: PROJECTS_MAIN, foot: `${ic('verified', 14)} Blueprint v1 · 15 files` })}
<main class="main">${modebar('Reading', '<span class="pill ok">' + ic('verified', 13) + ' Files agree</span>')}
<div class="doc"><div class="md">${DOC_BRIEF}</div></div>
</main>
<aside class="rail">${KIT_RAIL}<div class="railfoot"><span class="btn">${ic('edit', 15)} Edit, then publish v2</span></div></aside>
</div></div>`,
phone({ title: 'Blueprint v1', bottom: 'more_horiz', body: `<div class="pdoc" style="padding:0">${KIT_RAIL}</div>` }));

// S16 the map
const MAPNODES = [
  { n: '00-BRIEF', x: 386, y: 74, k: 'doc' }, { n: '01-PRODUCT', x: 190, y: 176, k: 'doc' }, { n: '02-DATA-AND-API', x: 386, y: 198, k: 'doc' }, { n: '03-ARCHITECTURE', x: 600, y: 176, k: 'doc' },
  { n: 'specs/booking', x: 262, y: 318, k: 'spec' }, { n: 'specs/payments', x: 470, y: 330, k: 'spec' }, { n: '04-SETUP', x: 652, y: 306, k: 'doc' },
  { n: 'Deposit before booking', x: 120, y: 258, k: 'why' }, { n: 'UPI, not cards', x: 578, y: 428, k: 'why' }, { n: 'AGENTS.md', x: 386, y: 432, k: 'agent' },
  { n: 'SKILL.md', x: 160, y: 74, k: 'agent' },
  { n: '05-FRONTEND-SPEC', x: 690, y: 250, k: 'doc' },
  { n: 'DECISIONS', x: 250, y: 470, k: 'doc' },
  { n: 'MAP', x: 640, y: 480, k: 'doc' },
];
const MAPEDGES = [[0, 1], [0, 2], [0, 3], [1, 4], [2, 4], [2, 5], [3, 6], [7, 1], [8, 5], [4, 9], [5, 9], [6, 9], [10, 0], [3, 11], [11, 4], [7, 12], [8, 12], [12, 9], [13, 0]];
const KCOL = { doc: 'var(--fg)', spec: 'var(--link)', why: 'var(--success)', agent: 'var(--accent)' };
function mapSvg(style = 'width:100%;height:100%;max-height:640px') {
  return `<svg viewBox="0 0 780 500" style="${style}">
${MAPEDGES.map(([a, b]) => `<line x1="${MAPNODES[a].x}" y1="${MAPNODES[a].y}" x2="${MAPNODES[b].x}" y2="${MAPNODES[b].y}" stroke="var(--border-strong)" stroke-width="1.2"/>`).join('')}
${MAPNODES.map(n => { const w = Math.max(96, n.n.length * 7.2 + 26); return `<g><rect x="${n.x - w / 2}" y="${n.y - 14}" width="${w}" height="28" rx="7" fill="var(--bg)" stroke="${KCOL[n.k]}" stroke-width="${n.k === 'doc' ? 1.2 : 1}"/><text x="${n.x}" y="${n.y + 4}" text-anchor="middle" font-family="var(--font-sans)" font-size="11.5" fill="${n.k === 'doc' ? 'var(--fg)' : KCOL[n.k]}">${n.n}</text></g>`; }).join('')}</svg>`;
}
const MAP_RAIL = `<div class="rsec"><div class="rh">${ic('link', 14)} The map<span class="sp"></span><span class="pill">v1</span></div>
<div style="font-size:12.5px;color:var(--fg-muted);margin-bottom:10px">What an agent reads before it writes anything: the documents, what each one governs, and the decision behind it.</div>
<div class="chk">${ic('description', 15)}<div>12 documents, 3 data files<em>Every document reachable from 00-BRIEF; graph.json, MANIFEST.json and SHA256SUMS are not nodes</em></div></div>
<div class="chk">${ic('link', 15)}<div>19 links, 0 orphans<em>Nothing in specs names an entity 02-DATA-AND-API does not define</em></div></div>
<div class="chk">${ic('check', 15, 'ok')}<div>2 decisions carried through<em>"Deposit before booking" and "UPI, not cards" each point at the spec they explain</em></div></div>
<div class="chk">${ic('code', 15)}<div>Rebuilt on every save<em>Structure is read from the files, so it costs no credits</em></div></div></div>
<div class="rsec"><div class="rh">${ic('terminal', 14)} In the kit</div>
<div class="kit">${[['MAP.md', 'Readable'], ['graph.json', 'For the agent']].map(f => `<div class="file">${ic('description', 14)}<span class="sp">${f[0]}</span><em class="hint">${f[1]}</em></div>`).join('')}</div>
<div style="font-size:11.5px;color:var(--muted);margin-top:8px">Both ship inside the blueprint, so the agent can ask "what governs payments" instead of reading all twelve documents.</div></div>`;
screen('s16-map', 'The map', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body">
${tree({ projects: PROJECTS_MAIN, foot: `${ic('verified', 14)} 12 documents, 19 links, 0 orphans` })}
<main class="main">${modebar('Reading', `<span class="tool txt on">${ic('hub', 16)} View as: Map ${ic('arrow_drop_down', 16)}</span>`, '12 documents · 19 links · 0 orphans')}
<div class="doc" style="padding:20px 28px 0">${mapSvg()}</div>
</main>
<aside class="rail">${MAP_RAIL}</aside></div></div>`,
phone({ title: 'Zephyrus booking · Map', bottom: 'more_horiz', body: `<div style="display:flex;gap:6px;padding:8px 14px;overflow:hidden;border-bottom:1px solid var(--border)"><span class="chip">Page</span><span class="chip on">Map</span><span class="chip">Flow</span><span class="chip">Outline</span></div><div style="padding:10px">${mapSvg('width:100%;height:auto')}</div><div style="padding:0 14px;font-size:12px;color:var(--fg-muted)">12 documents · 19 links · 0 orphans. Tap a node to open it.</div>` }));

// ---------------------------------------------------------------------------
// S17 share: people, link with password and expiry, publish
const SHARE_BODY = `<div class="rh" style="margin-top:6px">People</div>
<div style="display:flex;gap:8px;margin-bottom:8px"><span class="search" style="flex:1;min-width:0">${ic('mail', 16)} priya@studio.in</span><span class="btn">Can edit ${ic('expand_more', 14)}</span></div>
<div class="invite">${ic('person', 16)}<span class="t"><b>priya@studio.in is not on frontmatter yet</b><em>Invite her and you both get 5 AI credits when she signs in for the first time.</em></span><span class="btn primary sm">${ic('mail', 14)} Send invite</span></div>
<div class="vers"><div class="it on"><span class="avatar" style="width:24px;height:24px;font-size:9px;background:#18181b">SM</span> You <span class="sp"></span><span style="color:var(--muted)">Owner</span></div>
<div class="it"><span class="avatar" style="width:24px;height:24px;font-size:9px;background:#b2625e">AM</span> Amit Kumar <span class="sp"></span><span style="color:var(--muted)">Can edit · live</span></div></div>
<p class="fine" style="margin:8px 0 14px">${ic('lock', 12)} Free includes ${CAPS.collab} live collaborators per document. Pro removes the limit. <u>See Pro</u></p>
<div class="rh">Link</div>
<div class="srow" style="padding:8px 0"><span class="t">Anyone with the link<em>Can read. Not indexed by search engines.</em></span><span class="sel">Can read ${ic('expand_more', 14)}</span></div>
<div class="srow" style="padding:8px 0">${ic('password', 18)}<span class="t">Password <span class="pill pro" style="margin-left:6px">Pro</span><em>Asked once per browser. You choose it; we store only a hash.</em></span><span class="tog on"><i></i></span></div>
<div class="srow" style="padding:8px 0">${ic('schedule', 18)}<span class="t">Expires<em>The link stops working after this. The document stays.</em></span><span class="sel">In 7 days ${ic('expand_more', 14)}</span></div>
<div class="linkbox">${ic('link', 14)} frontmatter.in/s/8kq2…n41d<span style="margin-left:auto">${ic('content_copy', 14)}</span></div>
<div class="rh" style="margin-top:12px">Publish</div>
<div class="srow" style="padding:8px 0;border:0">${ic('public', 18)}<span class="t">Published page<em>frontmatter.in/p/zephyrus-booking-brief · 3 of ${CAPS.pub} free published pages used</em></span><span class="tog on"><i></i></span></div>`;
screen('s17-share', 'Share', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body">
${tree({ projects: PROJECTS_MAIN })}
<main class="main">${modebar('Live')}
<div class="doc"><div class="md">${DOC_BRIEF}</div></div>
<div class="dim"><div class="modal" style="width:560px"><h2>Share 00-BRIEF.md</h2><p>People you add need a frontmatter account. Links and published pages need nothing.</p>${SHARE_BODY}
<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:6px"><span class="btn">Done</span></div></div></div>
</main>
${rail({ outline: OUTLINE_BRIEF })}
</div></div>`,
phone({ mode: 'Live', title: '00-BRIEF.md', bottom: 'more_horiz', body: `${pmodebar('Live')}<div class="pdoc"><div class="md">${DOC_BRIEF}</div></div>`, overlay: psheet(`<h2>Share</h2>${SHARE_BODY.replace('<span class="btn">Can edit ' + ic('expand_more', 14) + '</span>', '')}`) }));

// S18 published page, and the password gate on the phone
screen('s18-public-view', 'Published page', `<div class="pub">
<header class="pubtop"><span class="mark">fm</span><span class="t">Zephyrus booking, in one page</span><span class="pill" style="margin-left:6px">Published 16 Sep</span>
<span class="r"><span class="btn ghost">${ic('download', 16)} Download .md</span><span class="btn primary">${ic('open_in_new', 15)} Open in frontmatter</span></span></header>
<div class="openbar">${ic('desktop_mac', 16)}<span class="t">You have the frontmatter desktop app. Open this there?</span>
<span class="btn sm primary">${ic('desktop_mac', 14)} Open in the app</span><span class="btn sm">${ic('public', 14)} Open on the web</span><span class="btn sm">Stay here</span>
<span class="x">${ic('close', 16)}</span></div>
<div class="pubbody"><div class="md">${DOC_BRIEF}<h2>The kickoff prompt</h2><p>Copy this into Claude Code, Cursor or Codex and it builds from these documents.</p><pre>curl -sL https://frontmatter.in/k/7f3a…c91e/v1/kit.tar.gz -o kit.tar.gz
shasum -a 256 kit.tar.gz   # must print 9c1e…4b7a, the hash on this page
mkdir -p docs/kit && tar xzf kit.tar.gz -C docs/kit</pre></div>
<div class="card"><h3>Read this properly in frontmatter</h3><p>Outline, dark mode, comments and a copy you can edit. Free, no card.</p><div class="acts"><span class="btn primary">${ic('public', 15)} Sign in with Google</span><span class="btn ghost">Not now</span></div></div>
<div style="position:absolute;left:24px;right:24px;bottom:18px;font-size:11.5px;color:var(--fg-muted);display:flex;gap:14px">Made with frontmatter <span>·</span> <u>Report this page</u> <span>·</span> <u>Privacy</u> <span>·</span> <u>Terms</u> <span style="margin-left:auto">also at <u>frontmatter.in/p/zephyrus-booking-brief.md</u></span></div></div></div>`,
`<div class="phone">${IOSBAR}
<header class="top"><span class="mark">fm</span><span class="ttl">Shared document</span></header>
<div class="pbody" style="display:grid;place-items:center;padding:24px"><div style="width:100%"><div style="display:grid;place-items:center;margin-bottom:14px">${ic('password', 40)}</div><h2 style="margin:0 0 6px;font-size:18px;text-align:center">This link needs a password</h2><p style="color:var(--fg-muted);font-size:13px;text-align:center;margin:0 0 16px">Sagnik shared <b>00-BRIEF.md</b> with a password. Ask them for it.</p>
<div class="search" style="height:42px;font-size:14px;margin-bottom:8px">${ic('key', 18)} Password</div><span class="btn primary lg" style="width:100%">Open</span>
<p style="font-size:11.5px;color:var(--fg-muted);text-align:center;margin-top:12px">Link expires in 6 days. No account needed to read.</p><p style="font-size:11.5px;color:var(--fg-muted);text-align:center;margin-top:18px"><u>Report</u> · <u>Privacy</u> · <u>Terms</u></p></div></div>
<div class="homeind"><i></i></div></div>`);

// S19 live collaboration
const DOC_LIVE = `<h1>Zephyrus booking, in one page</h1>
<p>A booking page for small studios that take appointments by WhatsApp today. One link, a calendar of open slots, a deposit, and a reminder the day before.</p>
<h2>The first user</h2>
<p>A two-chair salon in Kolkata that loses about four bookings a week to double-booking and no-shows. The owner runs everything from a phone<span style="background:color-mix(in srgb,#b2625e 22%,transparent)">, and has never used a laptop for the business</span>.</p>
<ul><li>Books from WhatsApp messages, by hand, into a paper diary</li><li>Takes deposits by UPI, then forgets who paid</li></ul>`;
screen('s19-live-collab', 'Live collaboration', `<div class="app">
${top({ tabs: TABS_MAIN, presence: [{ i: 'AM', c: '#b2625e' }, { i: 'SM', c: '#18181b' }] })}
<div class="body">
${tree({ projects: PROJECTS_MAIN, foot: `${ic('group', 14)} Amit is editing this document` })}
<main class="main">${modebar('Edit', '<span class="pill ok">' + ic('sync', 13) + ' Live</span>')}
<div class="doc" style="position:relative"><div class="md">${DOC_LIVE}</div>
<span class="cursor" style="left:calc(50% + 214px);top:246px"><i>Amit</i></span></div>
<div class="toast">${ic('group', 15)} <span>Free includes <b>${CAPS.collab}</b> live collaborators per document.</span> <span class="btn sm" style="background:var(--accent-fg);color:var(--accent)">Invite more with Pro</span></div>
</main>
${rail({ outline: OUTLINE_BRIEF })}
</div></div>`,
phone({ mode: 'Edit', title: '00-BRIEF.md', right: `<span class="avatars"><span class="avatar" style="background:#b2625e">AM</span><span class="avatar" style="background:#18181b">SM</span></span>`, body: `${pmodebar('Edit')}<div class="pdoc" style="position:relative"><div class="md">${DOC_LIVE}</div><span class="cursor" style="left:236px;top:300px"><i>Amit</i></span></div>` }));

// S20 document review
const REVIEW_DOC = `<h1>Zephyrus booking, in one page</h1>
<p>A booking page for small studios that take appointments by WhatsApp today. <span class="chg">One link, a calendar of open slots, a refundable deposit, and a reminder the day before.</span></p>
<h2>The first user</h2>
<p>A two-chair salon in Kolkata that loses about four bookings a week to double-booking and no-shows. The owner runs everything from a phone.</p>
<ul><li>Books from WhatsApp messages, by hand, into a paper diary</li><li><span class="chg">Takes deposits by UPI, then reconciles them on Sunday night</span></li><li>Wants a link to put in the Instagram bio</li></ul>
<h2>The one metric</h2><p><span class="chg">No-shows per hundred bookings, measured for four weeks before the deposit step and four after.</span></p>`;
const REVIEW_LIST = `${filterseg([['All', 3], ['People', 1], ['AI and agents', 2]], 0)}<div class="chg-list">
<div class="it"><div class="who"><span class="avatar" style="width:16px;height:16px;font-size:8px;background:#b2625e">AM</span> Amit · 10 min ago</div><div class="q">Changed "a deposit" to "a refundable deposit" in the summary.</div><div class="acts"><span class="btn">${ic('check', 13)} Accept</span><span class="btn">${ic('close', 13)} Reject</span><span class="btn">${ic('comment', 13)} Reply</span></div></div>
<div class="it"><div class="who">${ic('auto_awesome', 13)} AI edit · you asked to tighten · 25 min ago</div><div class="q">Rewrote the deposit bullet to say when reconciliation happens.</div><div class="diff" style="margin:6px 0;font-size:11px"><div class="del">-Takes deposits by UPI, then forgets who paid</div><div class="add">+Takes deposits by UPI, then reconciles them on Sunday night</div></div><div class="acts"><span class="btn">${ic('check', 13)} Accept</span><span class="btn">${ic('close', 13)} Reject</span></div></div>
<div class="it"><div class="who">${ic('terminal', 13)} Claude Code · edited the file on disk · 1 h ago</div><div class="q">Metric now says how long it is measured for.</div><div class="acts"><span class="btn">${ic('visibility', 13)} Show diff first</span><span class="btn">${ic('close', 13)} Reject</span></div></div>
</div><div style="margin-top:12px"><span class="btn" style="width:100%">Accept Amit’s 1 change</span><div style="font-size:11px;color:var(--muted);margin-top:6px;text-align:center">Asks you to confirm the count. AI and agent items are accepted one at a time.</div></div>`;
screen('s20-review', 'Document review', `<div class="app">
${top({ tabs: TABS_MAIN, presence: [{ i: 'AM', c: '#b2625e' }, { i: 'SM', c: '#18181b' }] })}
<div class="body">
${tree({ projects: PROJECTS_MAIN })}
<main class="main">${modebar('Reading', '<span class="pill">3 changes to review</span>')}
<div class="doc"><div class="md">${REVIEW_DOC}</div></div>
</main>
<aside class="rail"><div class="rsec grow"><div class="rh">${ic('checklist', 14)} Review<span class="sp"></span><span class="cnt">3 waiting</span></div>${REVIEW_LIST}</div>
<div class="rrow">${ic('comment', 16)} Comments<span class="sp"></span><span class="cnt">2 open</span>${ic('chevron_right', 16)}</div>
<div class="rrow">${ic('history', 16)} Document history<span class="sp"></span><span class="cnt">${CAPS.history} days</span>${ic('chevron_right', 16)}</div>
<div class="railfoot"><span class="btn ai">${ic('auto_awesome', 16)} AI edit</span></div></aside>
</div></div>`,
phone({ mode: 'Reading', title: '00-BRIEF.md', bottom: 'more_horiz', body: `${pmodebar('Reading')}<div class="pdoc"><div class="md">${REVIEW_DOC}</div></div>`, overlay: pdrawer(`<div class="rsec grow"><div class="rh">${ic('checklist', 14)} Review<span class="sp"></span><span class="cnt">3 waiting</span></div>${REVIEW_LIST}</div>`, 'right') }));

// S21 document history (Pro)
const HIST_DIFF = `<div class="diff"><div> A booking page for small studios that take appointments by WhatsApp today.</div><div class="del">-One link, a calendar of open slots, a deposit, and a reminder the day before.</div><div class="add">+One link, a calendar of open slots, a refundable deposit, and a reminder the day before.</div><div> </div><div> ## The first user</div><div> A two-chair salon in Kolkata that loses about four bookings a week to double-booking</div><div class="del">-and no-shows.</div><div class="add">+and no-shows, which is a day's takings. The owner runs everything from a phone.</div></div>`;
const HIST_LIST = `<div class="vers">${[['Today 14:02', 'Amit', 1], ['Today 11:40', 'You'], ['Today 10:05', 'AI edit, accepted by you'], ['Yesterday 18:30', 'You'], ['12 Sep 09:12', 'Blueprint v1 written'], ['12 Sep 09:10', 'Created']].map(v => `<div class="it${v[2] ? ' on' : ''}"><span class="avatar" style="width:20px;height:20px;font-size:8px;background:${v[1] === 'Amit' ? '#b2625e' : v[1].startsWith('AI') ? '#0055ff' : '#18181b'}">${v[1].startsWith('AI') ? ic('auto_awesome', 11) : v[1] === 'Amit' ? 'AM' : v[1] === 'You' ? 'SM' : 'fm'}</span><span><div>${v[0]}</div><div style="font-size:11px;color:var(--muted)">${v[1]}</div></span><span class="sp"></span>${v[2] ? ic('check', 14) : ''}</div>`).join('')}</div>`;
screen('s21-history', 'Document history', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body">
${tree({ projects: PROJECTS_MAIN })}
<main class="main">${modebar('Reading', '<span class="pill">Viewing 14:02 version</span>')}
<div class="doc" style="padding:28px 48px 0"><div class="md"><h1>Zephyrus booking, in one page</h1>${HIST_DIFF}
<div style="display:flex;gap:8px;margin-top:14px"><span class="btn primary">${ic('history', 15)} Restore this version</span><span class="btn">Copy as new document</span></div></div></div>
</main>
<aside class="rail"><div class="rsec grow"><div class="rh">${ic('history', 14)} Document history<span class="sp"></span><span class="pill">Pro · 90 days</span></div>${HIST_LIST}</div>
<div class="railfoot"><span class="btn">${ic('download', 15)} Export history as .zip</span></div></aside>
</div></div>`,
phone({ title: '00-BRIEF.md · History', bottom: 'more_horiz', body: `<div class="pdoc" style="padding:14px 14px 0"><div class="rh">${ic('history', 14)} Document history<span class="sp"></span><span class="pill">Pro · 90 days</span></div>${HIST_LIST}<div style="margin-top:12px;font-size:12px">${HIST_DIFF}</div><div style="display:flex;gap:8px;margin-top:12px"><span class="btn primary" style="flex:1">Restore</span><span class="btn" style="flex:1">Copy as new</span></div></div>` }));

// ---------------------------------------------------------------------------
// S22 import: files, a folder, and the other places documents live
const SOURCES = [['folder_open', 'A folder', 'Keeps the structure. Obsidian vaults work as they are'], ['code', 'GitHub', 'A repository’s docs, with write-back'], ['add_to_drive', 'Google Drive', 'Pick a folder; it stays in sync'], ['article', 'Google Docs', 'Converted to markdown on import'], ['description', 'Word (.docx)', 'Converted in your browser, nothing uploaded'], ['inventory_2', 'Notion export', 'The .zip Notion gives you']];
const IMPORT_BODY = `<div class="drop">${ic('upload', 36)}<b>Drop files or a folder here</b>Markdown, text, images, PDF, Word. A folder keeps its structure and becomes a project.</div>
<div class="sources">${SOURCES.map(s => `<div class="srcb">${ic(s[0], 22)}<div><b>${s[1]}</b><span>${s[2]}</span></div></div>`).join('')}</div>`;
const IMPORT_PROGRESS = `<div class="rsec"><div class="rh">${ic('folder_open', 14)} Importing ~/notes<span class="sp"></span><span class="pill">142 of 168</span></div>
<div class="meter" style="margin-bottom:10px"><i style="width:84%;background:var(--accent)"></i></div>
<div class="chk">${ic('check', 15, 'ok')}<div>131 markdown files<em>Front matter kept byte for byte</em></div></div>
<div class="chk">${ic('check', 15, 'ok')}<div>24 images, 3 PDFs<em>Uploaded to the project’s attachments</em></div></div>
<div class="chk">${ic('warning', 15)}<div>3 files need a look<em>Two wikilinks point at notes that are not in the folder; one file is not UTF-8</em></div></div>
<div class="chk">${ic('block', 15)}<div>1 Google Doc refused<em>Google exports up to 10 MB; this one is 14 MB. Split it in Docs and try again</em></div></div>
<div class="chk">${ic('description', 15)}<div>Obsidian settings found<em>Daily-note path and templates folder read from .obsidian, nothing else touched</em></div></div></div>`;
screen('s22-import', 'Import', `<div class="app">
${top({ tabs: [{ n: 'Import', c: 'grey', on: 1 }, { n: '00-BRIEF.md', c: 'blue' }] })}
<div class="body">
${tree({ projects: [{ n: 'notes', icon: 'folder', rows: [{ n: 'journal', d: 1 }, { n: '2026-09-16.md', f: 1, d: 2 }, { n: 'ideas.md', f: 1 }, { n: 'reading', d: 1 }] }, PROJECTS_MAIN[0]], foot: `${ic('upload', 14)} Importing 142 of 168` })}
<main class="main"><div class="page" style="padding:30px 48px"><h1>Bring your documents in</h1><p class="sub">Nothing is converted unless it has to be. Markdown stays markdown, byte for byte.</p>${IMPORT_BODY}</div></main>
<aside class="rail">${IMPORT_PROGRESS}<div class="railfoot"><span class="btn">${ic('folder', 15)} Open the project</span></div></aside>
</div></div>`,
phone({ title: 'Import', bottom: 'home', body: `<div class="page"><h1>Bring your documents in</h1><p class="sub">Markdown stays markdown, byte for byte.</p><div class="drop" style="padding:18px">${ic('upload', 30)}<b>Choose files or a folder</b>On Android, after you add frontmatter to your home screen, you can also share from any app. iOS has no share sheet for web apps.</div><div class="sources">${SOURCES.slice(0, 4).map(s => `<div class="srcb">${ic(s[0], 22)}<div><b>${s[1]}</b><span>${s[2]}</span></div></div>`).join('')}</div></div>` }));

// S23 connections: Google Drive and GitHub, what each is allowed to do
const CONN_DRIVE = `<div class="conn"><div class="ch">${ic('add_to_drive', 22)}<b>Google Drive</b><span class="pill ok">${ic('check', 13)} Connected · sagnik@…</span></div>
<div class="cl">${ic('folder', 15)}<span>Folder: <b>My Drive / frontmatter</b>. Every save writes the .md there; a change made in Drive shows up here within a few minutes.</span></div>
<div class="cl">${ic('lock', 15)}<span>Scope: only files this app created or you picked. We cannot see the rest of your Drive.</span></div>
<div class="cl">${ic('sync', 15)}<span>Conflicts are never merged silently. Both versions are kept and you choose.</span></div>
<div class="acts"><span class="btn">Change folder</span><span class="btn">Pause sync</span><span class="btn ghost">Disconnect</span></div></div>`;
const CONN_GH = `<div class="conn"><div class="ch">${ic('code', 22)}<b>GitHub</b><span class="pill ok">${ic('check', 13)} Installed on 1 repository</span></div>
<div class="cl">${ic('description', 15)}<span><b>studiozephyrus/frontmatter</b>. GitHub grants this app the whole repository; frontmatter only ever writes under <code>docs/</code>, and that rule is tested. Commits are made as you, with the message you type.</span></div>
<div class="cl">${ic('bolt', 15)}<span>${CAPS.pushes} pushes a month on Free, 14 used. Pull is unlimited.</span></div>
<div class="cl">${ic('lock', 15)}<span>A GitHub App, not a personal token: you chose the repositories, and you can revoke it on GitHub at any time.</span></div>
<div class="acts"><span class="btn">Add a repository</span><span class="btn ghost">Manage on GitHub</span></div></div>`;
const CONN_MCP = `<div class="conn" style="opacity:.6"><div class="ch">${ic('terminal', 22)}<b>Your agents</b><span class="pill">Later · with the MCP server</span></div>
<div class="cl">${ic('key', 15)}<span><b>Claude Code on this Mac</b> · may read and propose · never applies or publishes · last used today 14:02</span></div>
<div class="cl">${ic('key', 15)}<span><b>Cursor</b> · may read · created 12 Sep</span></div>
<div class="acts"><span class="btn">New token</span><span class="btn ghost">Show the MCP setup</span></div></div>`;
screen('s23-connections', 'Connections', `<div class="app">
${top({ tabs: [{ n: 'Settings', c: 'grey', on: 1 }], share: false })}
<div class="body noright" style="grid-template-columns:220px minmax(0,1fr)">
<aside class="side setnav" style="padding:14px 8px">${['Account', 'Appearance', 'Editor', 'Writing', 'AI', 'Connections', 'Sharing', 'Data and export', 'Shortcuts', 'Plan and usage'].map(s => `<div class="row${s === 'Connections' ? ' on' : ''}">${ic({ Account: 'account_circle', Appearance: 'palette', Editor: 'edit', Writing: 'spellcheck', AI: 'auto_awesome', Connections: 'hub', Sharing: 'share', 'Data and export': 'database', Shortcuts: 'keyboard', 'Plan and usage': 'credit_card' }[s], 15)}<span class="n">${s}</span></div>`).join('')}</aside>
<main class="main"><div class="set"><h1>Connections</h1><p class="sub">Each connection asks for the least it can. Every one can be removed here or at the other end.</p>${CONN_DRIVE}${CONN_GH}${CONN_MCP}</div></main>
</div></div>`,
phone({ title: 'Settings · Connections', bottom: 'more_horiz', body: `<div class="pdoc" style="padding:14px 14px 0">${CONN_DRIVE}${CONN_GH}</div>` }));

// ---------------------------------------------------------------------------
// S24 offline in the browser
screen('s24-offline', 'Offline', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body">
${tree({ projects: PROJECTS_MAIN, foot: `${ic('cloud_off', 14)} Offline · 2 changes waiting to sync` })}
<main class="main"><div class="banner">${ic('cloud_off', 16)} <span>You are offline. Everything you type is saved on this device and syncs when you are back.</span><span class="sp"></span><span class="pill">Last synced 14:02</span></div>
${modebar('Live')}
<div class="doc"><div class="md">${DOC_BRIEF}</div></div>
<div class="card"><h3>frontmatter for Mac</h3><p>Keeps every document as a file on disk, works fully offline with a local model for edits, no document limit. Same account, same documents.</p><div class="acts"><span class="btn primary">${ic('download', 15)} Download for Mac</span><span class="btn ghost">Remind me later</span></div></div>
</main>
${rail({ outline: OUTLINE_BRIEF, aiOff: 'Needs a connection. The desktop app has a local model.' })}
</div></div>`,
phone({ mode: 'Live', title: '00-BRIEF.md', body: `<div class="banner">${ic('cloud_off', 16)} <span>Offline. Saved on this phone, syncs when you are back.</span></div>${pmodebar('Live')}<div class="pdoc"><div class="md">${DOC_BRIEF}</div></div>` }));

// S25 desktop app
const DESK_TREE = [{ n: 'Cloud · Zephyrus booking', icon: 'rocket_launch', rows: [{ n: '00-BRIEF.md', f: 1, on: 1 }, { n: '01-PRODUCT.md', f: 1 }, { n: 'specs', d: 1 }, { n: 'booking.md', f: 1, d: 2 }] }, { n: 'On this Mac · ~/Documents/notes', icon: 'folder', rows: [{ n: 'ideas.md', f: 1 }, { n: 'journal', d: 1 }, { n: '2026-09-16.md', f: 1, d: 2 }] }];
screen('s25-desktop', 'Desktop app', `<div class="desk"></div><div class="macwin"><div class="app">
<header class="top"><span class="lights"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></span><span class="mark">fm</span>
<span class="topicons">${['menu', 'terminal', 'settings'].map(n => `<span class="ibtn">${ic(n, 18)}</span>`).join('')}</span>
<nav class="tabs">${[{ n: '00-BRIEF.md', c: 'blue', on: 1 }, { n: 'ideas.md', c: 'amber' }].map(t => `<span class="tab${t.on ? ' on' : ''}"><i class="sw" style="background:${SW[t.c]}"></i>${t.n}<span class="x">×</span></span>`).join('')}<span class="tab newtab">${ic('add', 16)}</span></nav>
<span class="topright"><span class="btn ghost">${ic('share', 16)} Share</span><span class="search">${ic('search', 16)} Search<kbd>⌘K</kbd></span><span class="avatar" style="background:#18181b">SM</span></span></header>
<div class="body">
${tree({ projects: DESK_TREE, foot: `${ic('sync', 14)} Synced 1 min ago · files on disk · no document limit` })}
<main class="main">${modebar('Live', '<span class="pill ok">' + ic('check', 13) + ' Saved to disk</span>')}
<div class="doc"><div class="md">${DOC_BRIEF}</div></div></main>
${rail({ outline: OUTLINE_BRIEF })}
</div></div></div>`,
phone({ title: 'frontmatter', bottom: 'home', bar: true, body: `<div class="page"><h1>Get the desktop app</h1><p class="sub">Every document as a file on disk. Fully offline. No document limit. Your agents can read the folder directly.</p>
<div class="srcb" style="margin-bottom:8px">${ic('desktop_mac', 22)}<div><b>Mac</b><span>Apple silicon and Intel · notarised</span></div></div>
<div class="srcb" style="margin-bottom:8px;opacity:.6">${ic('devices', 22)}<div><b>Windows</b><span>Coming. A signing certificate an Indian company can buy is being priced</span></div></div>
<div class="srcb" style="margin-bottom:14px">${ic('terminal', 22)}<div><b>Linux</b><span>AppImage and .deb</span></div></div>
<span class="btn primary lg" style="width:100%">${ic('mail', 16)} Email me the link</span><p style="font-size:12px;color:var(--muted);margin-top:10px;text-align:center">The web app and this phone stay in sync with it. Same account.</p></div>` }));

// S26 quick capture: a global box on the desktop, the share sheet on the phone
screen('s26-quick-capture', 'Quick capture', `<div class="desk" style="background:linear-gradient(135deg,#e6e9f0,#d8dfec 60%,#efe9dc)"></div><div class="capwin"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><span class="mark">fm</span><b style="font-size:13px">Quick capture</b><span class="pill" style="margin-left:auto">${ic('description', 13)} Into Notes / inbox.md</span><span class="kbd">⌘⇧Space</span></div>
<div class="in">${ic('edit', 18)}<span>Call the salon about the deposit copy before Friday. Their WhatsApp said "we lose the ones who pay late".</span></div>
<div class="foot"><span class="chip">${ic('sell', 13)} #zephyrus</span><span class="chip">${ic('schedule', 13)} Friday</span><span class="sp"></span><span>Enter to save · Esc to close · no credits used</span></div></div>`,
`<div class="phone">${IOSBAR}
<div class="pbody" style="background:#e8e8ec"><div style="padding:60px 22px 0;color:#6b6b73;font-size:13px"><div style="background:#fff;border-radius:14px;padding:14px;margin-bottom:12px;color:#18181b"><b>WhatsApp · Studio 12</b><br>we lose the ones who pay late, can the deposit go first?</div></div>
<div class="sheet" style="height:560px"><div class="grab"></div><div style="display:flex;align-items:center;gap:10px;margin-bottom:12px"><span class="mark">fm</span><b>Save to frontmatter</b><span class="pill" style="margin-left:auto">Notes / inbox.md</span></div>
<div class="aibox" style="margin:0"><div class="in" style="height:auto;padding:10px;align-items:flex-start;color:var(--fg);font-size:14px">we lose the ones who pay late, can the deposit go first?<br><span style="color:var(--muted);font-size:12px">From WhatsApp · Studio 12 · 9:40</span></div>
<div class="chips"><span class="chip on">${ic('sell', 13)} #zephyrus</span><span class="chip">${ic('description', 13)} Into 00-BRIEF instead</span></div></div>
<span class="btn primary lg" style="width:100%;margin-top:12px">Save</span>
<div class="install" style="position:static;margin-top:14px">${ic('download', 22)}<span><b>Add frontmatter to your home screen</b><span>Opens like an app and keeps working offline.</span></span><span class="btn primary sm">Install</span></div></div></div>
<div class="homeind"><i></i></div></div>`);

// S27 dark mode
screen('s27-workspace-dark', 'Workspace, dark', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body">
${tree({ projects: PROJECTS_MAIN, foot: `${ic('sync', 14)} Synced 2 min ago` })}
<main class="main">${modebar('Live', '<span class="pill ok">' + ic('check', 13) + ' Saved</span>')}
<div class="doc"><div class="md">${DOC_BRIEF}</div></div>
</main>
${rail({ outline: OUTLINE_BRIEF })}
</div></div>`,
phone({ mode: 'Live', title: '00-BRIEF.md', body: `${pmodebar('Live')}<div class="pdoc"><div class="md">${DOC_BRIEF}</div></div>` }), 'dark');

// ---------------------------------------------------------------------------
// S28 settings
const SET_NAV = ['Account', 'Appearance', 'Editor', 'Writing', 'AI', 'Connections', 'Sharing', 'Data and export', 'Shortcuts', 'Plan and usage'];
const SET_ICON = { Account: 'account_circle', Appearance: 'palette', Editor: 'edit', Writing: 'spellcheck', AI: 'auto_awesome', Connections: 'hub', Sharing: 'share', 'Data and export': 'database', Shortcuts: 'keyboard', 'Plan and usage': 'credit_card' };
function srow(t, e, ctl) { return `<div class="srow"><span class="t">${t}<em>${e}</em></span>${ctl}</div>`; }
const TOG = (on) => `<span class="tog${on ? ' on' : ''}"><i></i></span>`;
const SEL = (v) => `<span class="sel">${v} ${ic('expand_more', 14)}</span>`;
const SET_EDITOR = `<h2>Editor</h2>
${srow('Default mode', 'How a document opens', SEL('Live'))}
${srow('Doc mode by default in Live', 'Off shows plain markdown; on shows the Doc surface', TOG(false))}
${srow('Line width', 'Characters per line in the writing area', SEL('65'))}
${srow('Spellcheck', 'Your browser’s own. Where your browser sends text to its vendor, that is your browser’s setting', TOG(true))}
${srow('Vim keys', 'Modal editing in Edit mode', TOG(false))}
<h2>Writing checks</h2>
${srow('Structural problems', 'Broken links, heading skips, table shape, missing alt text', TOG(true))}
${srow('Plain-language notes', 'Long sentences and ornamental words. Advisory, never blocks', TOG(true))}
<h2>AI</h2>
${srow('Model for edits', 'Free uses a free provider this month; Pro uses Claude', SEL('Automatic'))}
${srow('AI on a selection and in the box', 'Sends only the text you select or type into the box, when you ask', TOG(true))}
${srow('Ghost text as I type', 'Sends what you are typing to the model as you go. Off by default', TOG(false))}
${srow('Mark AI text', 'Every accepted AI edit is recorded in the version record with the model and the ask. Inline marks in the file are off by default', TOG(true))}`;
screen('s28-settings', 'Settings', `<div class="app">
${top({ tabs: [{ n: 'Settings', c: 'grey', on: 1 }], share: false })}
<div class="body noright" style="grid-template-columns:220px minmax(0,1fr)">
<aside class="side setnav" style="padding:14px 8px">${SET_NAV.map(s => `<div class="row${s === 'Editor' ? ' on' : ''}">${ic(SET_ICON[s], 15)}<span class="n">${s}</span></div>`).join('')}</aside>
<main class="main"><div class="set"><h1>Settings</h1><p class="sub">Settings live on your account, so the web app, the desktop app and your phone agree. Nothing here needs a restart.</p>${SET_EDITOR}</div></main>
</div></div>`,
phone({ title: 'Settings', bottom: 'more_horiz', body: `<div class="pdoc" style="padding:6px 14px 0">${SET_NAV.map(s => `<div class="rrow" style="padding:0 2px;height:44px">${ic(SET_ICON[s], 18)} ${s}<span class="sp"></span>${ic('chevron_right', 18)}</div>`).join('')}<div style="font-size:12px;color:var(--muted);margin-top:12px">Signed in as sagnik@… · <u>Sign out</u></div></div>` }));

// S29 plan and usage
const USAGE = `<div class="usage"><div class="ucard"><div class="k">AI edits</div><div class="v">7 <small>of ${CAPS.edits} left</small></div><div class="meter"><i style="width:70%"></i></div></div>
<div class="ucard"><div class="k">Blueprints</div><div class="v">1 <small>of ${CAPS.kits} left · Low</small></div><div class="meter"><i style="width:100%"></i></div></div>
<div class="ucard"><div class="k">Documents in the cloud</div><div class="v">12 <small>of ${CAPS.docs}</small></div><div class="meter"><i style="width:24%;background:var(--accent)"></i></div></div>
<div class="ucard"><div class="k">Published pages</div><div class="v">3 <small>of ${CAPS.pub}</small></div><div class="meter"><i style="width:60%;background:var(--accent)"></i></div></div></div>`;
const PLANS = `<div class="plans"><div class="plan"><div class="nm">Free</div><div class="pr">₹0</div><ul>
<li>${ic('check', 15)} Every feature: the editor, Doc mode, offline in the browser, every export, every view</li><li>${ic('check', 15)} ${CAPS.docs} documents in the cloud, ${CAPS.pub} published pages, ${CAPS.uploads} of uploads</li><li>${ic('check', 15)} ${CAPS.kits} blueprint at Low and ${CAPS.edits} AI edits a month</li><li>${ic('check', 15)} ${CAPS.collab} live collaborators per document · ${CAPS.repos} GitHub repository, ${CAPS.pushes} pushes a month · Google Drive sync</li><li>${ic('check', 15)} Document history, ${CAPS.history} days · expiring links · the desktop app with unlimited documents on disk</li><li class="no">${ic('close', 15)} Password on links · Medium and High ideas · portfolio</li></ul><span class="btn" style="width:100%">Current plan</span></div>
<div class="plan pro"><div class="nm">Pro</div><div class="pr">₹299 <small>a month incl. GST, or ₹2,499 a year</small></div><ul>
<li>${ic('check', 15)} Unlimited documents, published pages and collaborators</li><li>${ic('check', 15)} 5 blueprints at any depth and 100 AI edits a month, on Claude</li><li>${ic('check', 15)} Document history, 90 days · unlimited repositories and pushes</li><li>${ic('check', 15)} Password and expiry on every link · no "made with" line</li><li>${ic('check', 15)} Your portfolio at frontmatter.in/@you</li></ul><span class="btn primary" style="width:100%">Upgrade to Pro</span>
<div style="margin-top:10px;font-size:11.5px;color:var(--muted)">UPI, cards. Cancel any time. Top-up: 50 edits for ₹99, 3 blueprints for ₹149.</div></div></div>
<div class="soon"><div><b>Team</b> · seats, shared workspaces, one bill · after Pro</div><div><b>Enterprise</b> · later · talk to us</div></div>`;
screen('s29-plan-usage', 'Plan and usage', `<div class="app">
${top({ tabs: [{ n: 'Settings', c: 'grey', on: 1 }], share: false })}
<div class="body noright" style="grid-template-columns:220px minmax(0,1fr)">
<aside class="side setnav" style="padding:14px 8px">${SET_NAV.map(s => `<div class="row${s === 'Plan and usage' ? ' on' : ''}">${ic(SET_ICON[s], 15)}<span class="n">${s}</span></div>`).join('')}</aside>
<main class="main"><div class="page" style="padding:30px 40px"><h1>Plan and usage</h1><p class="sub">Free plan · Sagnik Mitra · Allowances reset 1 October</p>${USAGE}${PLANS}</div></main></div></div>`,
phone({ title: 'Plan and usage', bottom: 'more_horiz', body: `<div class="page">${USAGE}${PLANS.replace('<div class="soon">', '<div class="soon" style="grid-template-columns:1fr;gap:8px">')}</div>` }));

// S30 portfolio (Pro, late): one markdown file, a public page
const PF_PAGE = `<div class="pf"><div class="head"><span class="avatar" style="background:#18181b">SM</span><div><h1>Sagnik Mitra</h1><div class="role">Builds small software for small businesses. Kolkata.</div><div class="links"><span class="chip">${ic('public', 13)} sgnk.ai</span><span class="chip">${ic('code', 13)} github.com/sagnikmitra</span><span class="chip">${ic('mail', 13)} Email</span></div></div></div>
<h2>Projects</h2><div class="pj"><div class="pjc"><b>Zephyrus booking</b><span>A booking link for salons that live on WhatsApp. Deposits by UPI.</span></div><div class="pjc"><b>frontmatter</b><span>The markdown editor this page is written in.</span></div><div class="pjc"><b>Trade system</b><span>An execution flow with 76 steps and a hard lock at 09:14.</span></div><div class="pjc"><b>pdf.sgnk.ai</b><span>Nineteen PDF tools that run in the browser.</span></div></div>
<h2>Writing</h2><div class="wr">Why a deposit beats a reminder<span class="dt">12 Sep 2026</span></div><div class="wr">What an agent should read before it writes<span class="dt">28 Aug 2026</span></div><div class="wr">Markdown that stays yours<span class="dt">3 Aug 2026</span></div></div>`;
screen('s30-portfolio', 'Portfolio', `<div class="app">
${top({ tabs: [{ n: 'portfolio.md', c: 'green', on: 1 }] })}
<div class="body noright">
${tree({ projects: [{ n: 'Personal', icon: 'person', rows: [{ n: 'portfolio.md', f: 1, on: 1 }, { n: 'writing', d: 1 }, { n: 'deposit-beats-reminder.md', f: 1, d: 2 }, { n: 'what-an-agent-reads.md', f: 1, d: 2 }] }], foot: `${ic('public', 14)} Live at frontmatter.in/@sagnik` })}
<main class="main">${modebar('Split', `<span class="pill pro">${ic('public', 13)} Published · frontmatter.in/@sagnik</span>`, '')}
<div class="split"><div class="pane"><div class="src">---
name: Sagnik Mitra
handle: sagnik
title: Builds small software for small businesses. Kolkata.
links:
  site: https://sgnk.ai
  github: sagnikmitra
projects:
  - title: Zephyrus booking
    line: A booking link for salons that live on WhatsApp.
  - title: frontmatter
    line: The markdown editor this page is written in.
writing: writing/
theme: plain
---

## About

Small software, shipped weekly. Reach me by email.</div>
<div class="elsewhere"><b>One file.</b> The front matter is the profile, the folder is the writing. Nothing here is a second format: the same file renders as a page in any markdown tool.</div></div><div class="gut"></div>
<div class="pane" style="padding:0;overflow:hidden;background:var(--bg)">${PF_PAGE.replace('class="pf"', 'class="pf" style="padding:30px 28px 0"')}</div></div>
</main></div></div>`,
`<div class="phone">${IOSBAR}
<header class="top"><span class="mark">fm</span><span class="ttl">frontmatter.in/@sagnik</span></header>
<div class="pbody"><div class="pdoc" style="padding:0">${PF_PAGE}</div></div><div class="homeind"><i></i></div></div>`);

// S31 conflict: two versions kept, the person chooses (no silent merge)
const CONFLICT_L = `<div class="md" style="max-width:none;font-size:13.5px"><h2 style="margin-top:0">The first user</h2><p>A two-chair salon in Kolkata that loses about four bookings a week to double-booking and no-shows. <span class="chg">The owner runs everything from a phone and has never used a laptop for the business.</span></p></div>`;
const CONFLICT_R = `<div class="md" style="max-width:none;font-size:13.5px"><h2 style="margin-top:0">The first user</h2><p>A two-chair salon in Kolkata that loses about four bookings a week to double-booking and no-shows. <span class="chg">The owner runs everything from a phone, and the front desk closes at eight.</span></p></div>`;
screen('s31-conflict', 'Conflict', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body noright">
${tree({ projects: PROJECTS_MAIN, foot: `${ic('warning', 14)} 1 conflict to resolve` })}
<main class="main"><div class="banner">${ic('warning', 16)} <span>Two versions of <b>00-BRIEF.md</b> changed the same paragraph while one of them was offline. Nothing was merged. Choose one, or keep both.</span></div>
<div class="split"><div class="pane"><div class="rh">${ic('devices', 14)} This browser · you · today 14:02</div>${CONFLICT_L}<div style="margin-top:14px"><span class="btn primary">${ic('check', 15)} Keep this one</span></div></div><div class="gut"></div>
<div class="pane"><div class="rh">${ic('add_to_drive', 14)} Google Drive · Amit · today 14:05</div>${CONFLICT_R}<div style="margin-top:14px"><span class="btn primary">${ic('check', 15)} Keep this one</span></div></div></div>
<div style="padding:10px 28px 16px;display:flex;gap:10px;align-items:center;border-top:1px solid var(--border)"><span class="btn">${ic('content_copy', 15)} Keep both as two files</span><span class="btn ai">${ic('auto_awesome', 15)} Let AI decide</span><span style="font-size:12px;color:var(--fg-muted)">Whichever you choose, the other version stays in history. The same screen appears for a desktop edit against a GitHub change.</span></div>
</main></div></div>`,
phone({ mode: 'Reading', title: '00-BRIEF.md', body: `<div class="banner">${ic('warning', 16)} <span>Two versions changed the same paragraph. Nothing was merged.</span></div>
<div class="pdoc" style="padding:12px 14px 0"><div class="rh">${ic('devices', 14)} This phone · you · 14:02</div>${CONFLICT_L}<span class="btn primary" style="width:100%;margin:8px 0 16px">${ic('check', 15)} Keep this one</span>
<div class="rh">${ic('add_to_drive', 14)} Google Drive · Amit · 14:05</div>${CONFLICT_R}<span class="btn primary" style="width:100%;margin:8px 0 10px">${ic('check', 15)} Keep this one</span>
<span class="btn" style="width:100%">${ic('content_copy', 15)} Keep both as two files</span><div style="font-size:12px;color:var(--fg-muted);margin-top:8px">The other version stays in history.</div></div>` }));

// S32 AI unavailable: every provider in the chain refused or timed out
const AI_DOWN = `<div class="aibox" style="border-color:var(--danger)"><div class="in" style="color:var(--fg)">${ic('cloud_off', 18)} AI is unavailable right now. Your document is untouched and nothing was charged.<span class="go" style="background:var(--panel-2);color:var(--fg-muted)">${ic('refresh', 16)}</span></div>
<div class="kit" style="margin-top:10px">${[['Groq', 'rate limit, resets in 41 s'], ['Cloudflare Workers AI', 'daily pool used, resets 00:00 UTC'], ['Cerebras', 'trial ended 12 Oct'], ['SambaNova', 'timed out']].map(r => `<div class="file">${ic('close', 14)}<span class="sp">${r[0]}</span><em class="hint">${r[1]}</em></div>`).join('')}</div>
<div class="chips" style="margin-top:10px"><span class="chip">${ic('refresh', 14)} Try again in a minute</span><span class="chip">${ic('desktop_mac', 14)} Use the local model on the desktop app</span><span class="chip">${ic('key', 14)} Use my own key</span></div>
<div class="foot">${ic('auto_awesome', 12)} Your 7 remaining edits are still yours. Nothing is deducted for a failed call.</div></div>`;
screen('s32-ai-unavailable', 'AI unavailable', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body">
${tree({ projects: PROJECTS_MAIN })}
<main class="main">${modebar('Live')}
<div class="doc"><div class="md">${DOC_BRIEF}</div></div>
${AI_DOWN}
</main>
${rail({ outline: OUTLINE_BRIEF, aiOff: 'Every provider is down. Try again in a minute.' })}
</div></div>`,
phone({ mode: 'Live', title: '00-BRIEF.md', bottom: 'auto_awesome', body: `${pmodebar('Live')}<div class="pdoc"><div class="md">${DOC_BRIEF_SHORT}</div></div>${AI_DOWN}` }));

// S33 over the cap: what happened, what still works, what to do
const OVERCAP = `<div class="modal" style="width:520px"><h2>That is your 50th cloud document</h2><p>Free keeps 50 documents in the cloud. Everything you have still opens, edits and exports. Nothing is deleted.</p>
<div class="kit"><div class="file">${ic('check', 14, 'ok')}<span class="sp">Open, edit and export every document</span></div><div class="file">${ic('check', 14, 'ok')}<span class="sp">Share and publish what you have</span></div><div class="file">${ic('close', 14)}<span class="sp">Create a new cloud document until you are under 50</span></div></div>
<div class="stack" style="margin-top:14px"><span class="btn">${ic('delete', 18)} Delete or export something</span><span class="btn">${ic('desktop_mac', 18)} Use the desktop app, which has no cap</span><span class="btn primary">${ic('bolt', 18)} Move to Pro, ₹299 a month incl. GST</span></div>
<p class="fine">A downgraded account meets this same screen: nothing is removed, nothing new is created until it is under the cap.</p></div>`;
screen('s33-over-cap', 'Over the cap', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body">
${tree({ projects: PROJECTS_MAIN, foot: `${ic('cloud_done', 14)} 50 of 50 cloud documents` })}
<main class="main">${modebar('Live')}
<div class="doc"><div class="md">${DOC_BRIEF}</div></div>
<div class="dim">${OVERCAP}</div>
</main>
${rail({ outline: OUTLINE_BRIEF })}
</div></div>`,
phone({ mode: 'Live', title: '00-BRIEF.md', body: `${pmodebar('Live')}<div class="pdoc"><div class="md">${DOC_BRIEF_SHORT}</div></div>`, overlay: psheet(OVERCAP.replace('<div class="modal" style="width:520px">', '<div>').replace(/<\/div>$/, '')) }));

// S34 ideas, empty: what a blueprint is, the three depths, one box, one example kit
const IDEAS_EMPTY = `<div style="max-width:640px;margin:0 auto"><div class="rh">Ideas</div>
<div class="md" style="font-size:14px"><p>Describe an idea. Answer a few questions. Get a brief and a blueprint of fifteen files that an agent can build from, checked for consistency, at a link you can hand to Claude Code, Cursor or Codex.</p></div>
<div class="kit" style="margin:10px 0 16px"><div class="file">${ic('bolt', 14)}<span class="sp">Low, free: 10 to 15 questions with a recommendation each</span></div><div class="file">${ic('insights', 14)}<span class="sp">Medium, Pro: 20 to 30 questions, each with where it stands and what forces the choice</span></div><div class="file">${ic('psychology', 14)}<span class="sp">High, Pro: Medium plus a research pass with sources opened and dated</span></div></div>
<div class="aibox" style="margin:0"><div class="in">${ic('lightbulb', 18)} What are you building, and for whom?<span class="go">${ic('arrow_forward', 16)}</span></div>
<div class="chips"><span class="chip">${ic('description', 14)} Open the example: a booking page for salons</span><span class="chip">${ic('table_view', 14)} Pick an industry template</span></div>
<div class="foot">${ic('auto_awesome', 12)} The example is a real kit, made by hand, so you can read all fifteen files before spending your blueprint credit.</div></div></div>`;
screen('s34-ideas-empty', 'Ideas, empty', `<div class="app">
${top({ tabs: [{ n: 'Ideas', c: 'blue', on: 1 }] })}
<div class="body noright">
<aside class="side ideas"><div class="sidehead">${ic('lightbulb', 16)} Ideas<span class="sp"></span><span class="pill">${ic('add', 14)} new</span></div><div style="padding:10px 8px;font-size:12.5px;color:var(--muted)">Your ideas will be listed here with where each one stands.</div><div class="sidefoot">${ic('auto_awesome', 14)} 1 blueprint credit this month</div></aside>
<main class="main"><div class="modebar"><span class="steps"><b>1 Describe</b> ${ic('chevron_right', 14)} 2 Decide ${ic('chevron_right', 14)} 3 Write ${ic('chevron_right', 14)} 4 Hand off</span></div>
<div class="doc" style="padding:40px 48px">${IDEAS_EMPTY}</div></main></div></div>`,
phone({ title: 'Ideas', bottom: 'auto_awesome', body: `<div class="pdoc" style="padding:14px 14px 0">${IDEAS_EMPTY.replace('<div style="max-width:640px;margin:0 auto">', '<div>')}</div>` }));


// ---------------------------------------------------------------- S35 to S38
// The configuration panel. Only a founder sees these; plan section 30 says what
// it may and may not set, and why two rows are locked.
const CFG_NAV = ['Plans and limits', 'Models and providers', 'Features and flags', 'Accounts and usage', 'Audit log'];
const CFG_ICON = { 'Plans and limits': 'tune', 'Models and providers': 'auto_awesome', 'Features and flags': 'toggle_on', 'Accounts and usage': 'account_circle', 'Audit log': 'history' };
const cfgNav = (on) => `<aside class="side setnav" style="padding:14px 8px">${CFG_NAV.map(s => `<div class="row${s === on ? ' on' : ''}">${ic(CFG_ICON[s], 15)}<span class="n">${s}</span></div>`).join('')}</aside>`;
const cfgTop = `${top({ tabs: [{ n: 'Configuration', c: 'grey', on: 1 }], share: false })}`;
const cfgSw = (on) => `<span class="cfgsw${on ? ' on' : ''}"><i></i></span>`;

const LIMITS = [
  ['Documents in the cloud', String(CAPS.docs), 'Unlimited', 'Sagnik · 50 from 25 · 14 Sep'],
  ['Published pages', String(CAPS.pub), 'Unlimited', ''],
  ['Live collaborators', String(CAPS.collab), 'Unlimited', ''],
  ['Document history', `${CAPS.history} days`, '90 days', ''],
  ['Uploads', `${CAPS.uploads} · 5 MB a file`, '10 GB · 25 MB a file', ''],
  ['AI edits a month', String(CAPS.edits), '100', 'Amit · 10 from 15 · 2 Sep'],
  ['Blueprints a month', `${CAPS.kits} · Low only`, '5 · any depth', ''],
  ['GitHub repositories', String(CAPS.repos), 'Unlimited', ''],
  ['GitHub pushes a month', String(CAPS.pushes), 'Unlimited', ''],
];
const CFG_TABLE = `<table class="cfgt"><thead><tr><th style="width:38%">Limit</th><th>Free</th><th>Pro</th><th style="width:26%">Last change</th></tr></thead><tbody>
${LIMITS.map(([k, f, p, w], i) => `<tr><td class="lim">${k}</td><td><span class="cfgv${i === 5 ? ' ed' : ''}">${f}</span></td><td><span class="cfgv inf">${p}</span></td><td style="font-size:11.5px;color:var(--muted)">${w || '—'}</td></tr>`).join('\n')}
</tbody></table>`;
screen('s35-config-plans', 'Configuration, plans and limits', `<div class="app">
${cfgTop}
<div class="body noright" style="grid-template-columns:220px minmax(0,1fr)">
${cfgNav('Plans and limits')}
<main class="main" style="position:relative"><div class="page" style="padding:30px 40px 70px"><h1>Plans and limits</h1><p class="sub">What each plan allows. The product reads this table and nothing else; there is no copy of these numbers in the source.</p>${CFG_TABLE}</div>
<div class="cfgbar">${ic('edit', 15)} <b>1 change</b> · AI edits on Free, 15 to 10<span class="cfgwarn">${ic('warning', 14)} 2 accounts go over their cap</span><span class="sp"></span><span class="btn sm ghost">See who</span><span class="btn sm">Discard</span><span class="btn sm primary">Review and save</span></div>
</main></div></div>`,
phone({ title: 'Plans and limits', bottom: 'more_horiz', body: `<div class="pdoc" style="padding:10px 14px 0">${LIMITS.slice(0, 6).map(([k, f, p]) => `<div style="padding:9px 0;border-bottom:1px solid var(--border)"><div style="font-size:13px">${k}</div><div style="display:flex;gap:8px;margin-top:5px"><span class="cfgv" style="min-width:0;flex:1">Free ${f}</span><span class="cfgv inf" style="min-width:0;flex:1">Pro ${p}</span></div></div>`).join('')}<div style="margin-top:12px;font-size:12px;color:var(--muted)">Editing is on the desktop. The phone shows what is set.</div></div>` }));

// S36 redrawn 18 September, afternoon. The founder asked for 10 to 13 model layouts; the
// real default set is 17 rows across 7 providers (docs/pack/28 section 5.1), plus the two
// OpenRouter models admitted to the chain the same day (docs/pack/27 section 2.1 and 2.4).
// Order, caps and states are copied from file 27 section 2.1, not invented.
const CHAIN = [
  { n: 'Cloudflare Workers AI', cap: '10,000 neurons a day', pool: 'account', on: 1, models: [
    ['@cf/meta/llama-3.2-1b-instruct', 'Cheap edits', 'catalogue'],
    ['@cf/meta/llama-3.2-3b-instruct', 'Default document and question set', 'catalogue', 1],
    ['@cf/meta/llama-3.1-8b-instruct-fp8-fast', 'Larger edits', 'catalogue'],
    ['@cf/qwen/qwen3-30b-a3b-fp8', 'Named edit fallback', 'catalogue'],
    ['@cf/openai/gpt-oss-20b', 'Reserve', 'catalogue'],
    ['@cf/openai/gpt-oss-120b', 'Reserve', 'catalogue']] },
  { n: 'Groq', cap: '1,000 a day per model', pool: 'organisation', on: 1, models: [
    ['openai/gpt-oss-120b', 'Default edit', 'catalogue', 1],
    ['openai/gpt-oss-20b', 'Edit fallback', 'catalogue'],
    ['qwen/qwen3.8-27b', 'Reserve', 'catalogue']] },
  { n: 'Cerebras', cap: '1,000,000 tokens a day per model', pool: 'organisation', on: 1, tag: 'trial', models: [
    ['gpt-oss-120b', 'Default blueprint', 'trial', 1],
    ['qwen-3.8-27b', 'Blueprint fallback', 'trial']] },
  { n: 'OpenRouter', cap: '50 a day, 1,000 after 10 credits once', pool: 'account', on: 1, tag: 'admitted 18 Sep', models: [
    ['z-ai/glm-5.2:free', 'Edit and document fallback', 'catalogue'],
    ['qwen/qwen3.8-27b:free', 'Edit and document fallback', 'catalogue']] },
  { n: 'SambaNova', cap: '20 a day per model', pool: 'unverified', on: 0, lock: 'Nobody has opened this provider’s terms.', models: [] },
  { n: 'Ollama, desktop only', cap: 'none, on the machine', pool: 'the machine', on: 1, tag: 'desktop', models: [
    ['llama3.2:3b', 'Desktop edit · 2.0 GB', 'desktop', 1],
    ['qwen3:4b', 'Desktop · 2.5 GB', 'desktop'],
    ['gemma3:4b', 'Desktop · 3.3 GB', 'desktop'],
    ['qwen3:8b', 'Desktop · 5.2 GB', 'desktop']] },
  { n: 'The paid link', cap: '300 a minute', pool: 'account', on: 1, paid: 1, tag: 'last in every chain', models: [
    ['claude-haiku-4-5', 'Pro edit and document', 'Pro only', 1],
    ['claude-sonnet-5', 'Pro blueprint, through batch', 'Pro only', 1]] },
];
const MODEL_ROWS = CHAIN.reduce((a, p) => a + p.models.length, 0);
function chainTable() {
  return `<table class="cfgt cfgm"><thead><tr><th style="width:43%">Model</th><th>Used for</th><th style="width:13%">State</th><th style="width:62px">Default</th></tr></thead><tbody>
${CHAIN.map((p, i) => `<tr class="grp${p.on ? '' : ' off'}"><td colspan="4"><span class="gi">${i + 1}</span>${ic('expand_more', 15)}<b>${p.n}</b>${p.tag ? `<span class="pill${p.paid ? ' pro' : ''}">${p.tag}</span>` : ''}<span class="gcap">${p.cap}</span>${p.lock ? '' : ''}</td></tr>
${p.lock ? `<tr class="off"><td colspan="3" style="color:var(--muted);font-size:12px">${ic('lock', 13)} ${p.lock} Disabled and explained, never hidden.</td><td>${cfgSw(0)}</td></tr>` : p.models.map(m => `<tr><td class="mid">${m[0]}</td><td>${m[1]}</td><td><span class="st${m[2] === 'Pro only' ? ' pro' : ''}">${m[2]}</span></td><td>${cfgSw(m[3] ? 1 : 0)}</td></tr>`).join('\n')}`).join('\n')}
</tbody></table>`;
}
const ROUTING = `<table class="cfgt"><thead><tr><th style="width:26%">Call</th><th>Free</th><th>Pro</th><th style="width:22%">One call costs</th></tr></thead><tbody>
<tr><td class="lim">An edit</td><td><span class="cfgv inf">The free chain</span></td><td><span class="cfgv">Haiku 4.5</span></td><td style="font-family:var(--font-mono);font-size:12px;color:var(--muted)">₹0.68</td></tr>
<tr><td class="lim">A document</td><td><span class="cfgv inf">The free chain</span></td><td><span class="cfgv">Haiku 4.5</span></td><td style="font-family:var(--font-mono);font-size:12px;color:var(--muted)">₹1.20</td></tr>
<tr><td class="lim">A blueprint</td><td><span class="cfgv inf">The free chain</span></td><td><span class="cfgv ed">Sonnet 5, batch</span></td><td style="font-family:var(--font-mono);font-size:12px;color:var(--muted)">₹31.40</td></tr>
</tbody></table>`;
screen('s36-config-models', 'Configuration, models and providers', `<div class="app">
${cfgTop}
<div class="body noright" style="grid-template-columns:220px minmax(0,1fr)">
${cfgNav('Models and providers')}
<main class="main" style="overflow:hidden"><div class="page" style="padding:22px 40px 0"><h1>Models and providers</h1><p class="sub">${MODEL_ROWS} models across ${CHAIN.length} providers, in fallback order. The list scrolls and groups by provider; a provider row is a base URL, a key name and a model id.</p>
<div class="cfgcols"><div>${chainTable()}</div>
<div><div class="cfgsec">Routing, per call and per plan</div>${ROUTING}
<div class="cfgsec">Refused, and why</div>
<div class="cfgref">${[['Google AI Studio, unpaid', 'Uses what you submit to improve its products'], ['Cohere trial keys', 'Shares API data with third parties'], ['NVIDIA NIM', 'Licence lets it improve its products, no training carve-out'], ['DeepSeek', 'Trains on what you send'], ['Mistral Free', 'Opt-out page returns 404']].map(([n, w]) => `<div class="l">${ic('block', 14)}<b>${n}</b><span>${w}</span></div>`).join('')}</div>
<div class="cfgnote">A provider whose terms nobody has opened cannot be switched on, and one that trains on inputs cannot be switched on at all. The sign-in page promises we never train on documents, and that promise is only as true as this list.</div></div></div></div></main></div></div>`,
phone({ title: 'Models', bottom: 'more_horiz', sub: `${MODEL_ROWS} models · ${CHAIN.length} providers`, body: `<div class="pdoc" style="padding:8px 14px 0">${CHAIN.map((p, i) => `<div class="pgrp${p.on ? '' : ' off'}"><div class="ph"><span class="gi">${i + 1}</span><b>${p.n}</b><span class="sp"></span><span class="cnt">${p.lock ? 'terms not opened' : p.models.length + (p.models.length === 1 ? ' model' : ' models')}</span>${cfgSw(p.on)}</div>${i < 1 ? p.models.map(m => `<div class="pm"><span class="mid">${m[0]}</span><span class="u">${m[1]}</span></div>`).join('') : ''}</div>`).join('')}<div style="margin:10px 0;font-size:12px;color:var(--muted)">Tap a provider to see its models. Editing is on the desktop.</div></div>` }));

const FLAGS = [
  ['Live editing', 'Two people in one document at once. Turns S19 on. Free up to ' + CAPS.collab + ', unlimited on Pro.', 1, 0],
  ['Bring your own key', 'A key field in Settings AI. A person\'s own calls run on their key. Both plans.', 1, 0],
  ['Email magic link', 'A third way in, beside Google and GitHub. Changes S01.', 0, 0],
  ['Index published pages', 'Off means every published page stays out of search. Changes robots and S17.', 0, 0],
  ['We never train on your documents', 'A promise on the sign-in page, not a setting. It changes only when the provider list does.', 1, 1],
  ['Age floor, eighteen', 'In the terms people already accepted. Changing it needs new consent, not a switch.', 1, 1],
];
screen('s37-config-flags', 'Configuration, features and flags', `<div class="app">
${cfgTop}
<div class="body noright" style="grid-template-columns:220px minmax(0,1fr)">
${cfgNav('Features and flags')}
<main class="main"><div class="page" style="padding:30px 40px"><h1>Features and flags</h1><p class="sub">Four switches, and two rows that look like switches and are not.</p>
<div class="cfgsec">Flags</div>
${FLAGS.filter(f => !f[3]).map(([t, d, on]) => `<div class="cfgflag"><div class="b"><div class="t">${t}</div><div class="d">${d}</div></div>${cfgSw(on)}</div>`).join('')}
<div class="cfgsec">Locked, and why</div>
${FLAGS.filter(f => f[3]).map(([t, d]) => `<div class="cfgflag lock"><div class="b"><div class="t">${ic('lock', 14)} ${t}</div><div class="d">${d}</div></div><span class="pill">locked</span></div>`).join('')}
</div></main></div></div>`,
phone({ title: 'Flags', bottom: 'more_horiz', body: `<div class="pdoc" style="padding:10px 14px 0">${FLAGS.map(([t, d, on, lock]) => `<div class="cfgflag${lock ? ' lock' : ''}" style="padding:11px 12px"><div class="b"><div class="t" style="font-size:12.5px">${lock ? ic('lock', 13) + ' ' : ''}${t}</div><div class="d" style="font-size:11.5px">${d}</div></div>${lock ? '<span class="pill">locked</span>' : cfgSw(on)}</div>`).join('')}</div>` }));

const ACC_USAGE = `<div class="usage" style="grid-template-columns:repeat(4,1fr);margin-bottom:18px">
<div class="ucard"><div class="k">Documents</div><div class="v">48 <small>of ${CAPS.docs}</small></div><div class="meter"><i style="width:96%;background:var(--accent)"></i></div></div>
<div class="ucard"><div class="k">AI edits this month</div><div class="v">10 <small>of ${CAPS.edits}</small></div><div class="meter"><i style="width:100%"></i></div></div>
<div class="ucard"><div class="k">Blueprints</div><div class="v">1 <small>of ${CAPS.kits}</small></div><div class="meter"><i style="width:100%"></i></div></div>
<div class="ucard"><div class="k">Spent on us</div><div class="v">₹19.40 <small>this month</small></div><div class="meter"><i style="width:34%;background:var(--success)"></i></div></div></div>`;
const LEDGER = `<table class="cfgt"><thead><tr><th style="width:22%">When</th><th>What</th><th>Model</th><th style="width:16%">Cost</th></tr></thead><tbody>
<tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--muted)">17 Sep 14:02</td><td class="lim">Tighten a paragraph</td><td>groq gpt-oss-120b</td><td style="font-family:var(--font-mono);font-size:12px">₹0.00</td></tr>
<tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--muted)">17 Sep 11:20</td><td class="lim">Blueprint, Low, 15 files</td><td>cloudflare qwen3-30b</td><td style="font-family:var(--font-mono);font-size:12px">₹0.00</td></tr>
<tr><td style="font-family:var(--font-mono);font-size:12px;color:var(--muted)">16 Sep 19:44</td><td class="lim">Rewrite a section</td><td>groq gpt-oss-120b</td><td style="font-family:var(--font-mono);font-size:12px">₹0.00</td></tr>
</tbody></table>`;
screen('s38-config-accounts', 'Configuration, accounts and usage', `<div class="app">
${cfgTop}
<div class="body noright" style="grid-template-columns:220px minmax(0,1fr)">
${cfgNav('Accounts and usage')}
<main class="main"><div class="page" style="padding:30px 40px"><h1>Accounts and usage</h1><p class="sub">One account against every limit. An exception here moves one person, never the plan.</p>
<div class="cfgacc">${ic('search', 16)}<span style="color:var(--muted);font-size:13px">priya@</span><span style="font-weight:500">priya@studio.in</span><span class="pill">Free</span><span style="color:var(--muted);font-size:12px">joined 2 Aug · 48 documents</span><span class="sp"></span><span class="btn sm">${ic('add', 14)} Grant an exception</span></div>
${ACC_USAGE}
<div style="font-size:12px;color:var(--muted);margin:-6px 0 0;max-width:900px">An exception carries an expiry. When it lapses the account returns to its plan, and if it is over the cap it meets S33: everything readable, nothing new created.</div>
<div class="cfgsec">This account's ledger</div>
${LEDGER}</div></main></div></div>`,
phone({ title: 'Accounts', bottom: 'more_horiz', body: `<div class="pdoc" style="padding:10px 14px 0"><div class="cfgacc" style="padding:10px 12px;margin-bottom:12px">${ic('search', 15)}<span style="font-weight:500;font-size:12.5px">priya@studio.in</span><span class="pill">Free</span></div>${ACC_USAGE.replace('grid-template-columns:repeat(4,1fr)', 'grid-template-columns:1fr 1fr')}</div>` }));

for (const [name, html] of Object.entries(screens)) {
  fs.writeFileSync(path.join(HERE, name + '.html'), html);
}
console.log(Object.keys(screens).length, 'screens written to', HERE);
