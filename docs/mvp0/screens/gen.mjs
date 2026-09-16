// Generates the MVP 0 screen designs as static HTML in the md.sgnk.ai theme
// (src/app/globals.css tokens and component classes), one file per screen.
// Icons are Google Material Symbols Rounded as inline SVG. Fonts are the app's
// Google Sans faces, embedded so headless Chrome renders them offline.
//   node docs/mvp0/screens/gen.mjs
import fs from 'node:fs';
import path from 'node:path';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const ICONS = '/private/tmp/claude-501/-Users-sagnikmitra-Desktop-GitHub-frontmatter/2e90ab3b-4a90-4362-bce4-042a842a2af5/scratchpad/icons';
const FONTS = fs.readFileSync(path.join(HERE, 'fonts.css'), 'utf8');

const iconCache = {};
function ic(name, size = 18, cls = '') {
  if (!iconCache[name]) {
    const f = path.join(ICONS, name + '.svg');
    if (!fs.existsSync(f)) throw new Error('icon missing: ' + name);
    const raw = fs.readFileSync(f, 'utf8');
    const m = /<path[^>]*d="([^"]+)"/.exec(raw);
    if (!m) throw new Error('no path in icon ' + name);
    iconCache[name] = m[1];
  }
  return `<svg class="ic ${cls}" width="${size}" height="${size}" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true"><path d="${iconCache[name]}"/></svg>`;
}

const CSS = `
${FONTS}
:root{
  --bg:#fafafa;--bg-subtle:#fafafa;--panel:#fafafa;--panel-2:rgba(10,10,10,.025);--fg:#18181b;--fg-muted:#6b6b73;--muted:#9b9ba3;
  --border:rgba(10,10,10,.06);--border-strong:rgba(10,10,10,.10);--accent:#18181b;--accent-hover:#0a0a0a;--accent-fg:#fafafa;
  --accent-soft:rgba(10,10,10,.04);--hover:rgba(10,10,10,.04);--active:rgba(10,10,10,.05);--selected:rgba(10,10,10,.09);
  --ring:rgba(91,33,182,.40);--link:#0044cc;--link-hover:#0055ff;--danger:#b2625e;--success:#4f8b6b;--ai:#0055ff;
  --radius-sm:6px;--radius:8px;--radius-lg:12px;
  --font-sans:"Google Sans","Roboto",ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
  --font-mono:"Google Sans Code","JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;
}
.dark{--bg:#1a1a1a;--bg-subtle:#161616;--panel:#1a1a1a;--panel-2:rgba(255,255,255,.035);--fg:#ededed;--fg-muted:rgba(237,237,237,.62);--muted:rgba(237,237,237,.40);
  --border:rgba(255,255,255,.09);--border-strong:rgba(255,255,255,.14);--accent:#ededed;--accent-hover:#fff;--accent-fg:#1a1a1a;
  --accent-soft:rgba(255,255,255,.05);--hover:rgba(255,255,255,.04);--active:rgba(255,255,255,.05);--selected:rgba(255,255,255,.12);
  --link:#5b9eff;--link-hover:#80b6ff;--danger:#d49391;--success:#7fb09a;--ai:#5b9eff}
*{box-sizing:border-box}
html,body{margin:0;height:100%;background:var(--bg);color:var(--fg);font-family:var(--font-sans);font-size:13px;line-height:1.5;
  -webkit-font-smoothing:antialiased;overflow:hidden}
button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
.ic{flex:none;vertical-align:-3px}
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
.search{display:flex;align-items:center;gap:7px;height:30px;padding:0 10px;min-width:210px;border:1px solid var(--border);border-radius:6px;color:var(--muted);background:var(--bg)}
.search kbd{margin-left:auto;font-family:var(--font-mono);font-size:10px;color:var(--muted);border:1px solid var(--border-strong);border-radius:4px;padding:1px 5px}
.avatar{width:28px;height:28px;border-radius:50%;display:inline-grid;place-items:center;font-size:11px;font-weight:600;color:#fff;background:#4f6b8b}
.avatars{display:flex;align-items:center}
.avatars .avatar{margin-left:-6px;border:2px solid var(--bg);width:26px;height:26px;font-size:10px}
.avatars .avatar:first-child{margin-left:0}
/* body */
.body{display:grid;grid-template-columns:264px minmax(0,1fr) 304px;min-height:0}
.body.noright{grid-template-columns:264px minmax(0,1fr)}
.body.noleft{grid-template-columns:minmax(0,1fr) 304px}
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
.main{display:flex;flex-direction:column;min-width:0;min-height:0;background:var(--bg)}
.modebar{display:flex;align-items:center;gap:2px;padding:6px 10px;border-bottom:1px solid var(--border);background:var(--bg-subtle);overflow:hidden}
.seg{display:inline-flex;padding:2px;gap:2px;background:var(--panel-2);border:1px solid var(--border);border-radius:8px}
.seg span{padding:3px 11px;font-size:12px;font-weight:500;color:var(--fg-muted);border-radius:6px}
.seg span.on{color:var(--fg);background:var(--bg)}
.tools{display:flex;align-items:center;gap:2px;flex-wrap:nowrap;flex-shrink:0}
.tool{display:inline-flex;align-items:center;justify-content:center;min-width:28px;height:26px;padding:0 7px;font-family:var(--font-mono);font-size:12px;color:var(--fg-muted);border-radius:6px;border:1px solid transparent}
.tool.h{font-weight:500}
.tsep{width:1px;height:16px;background:var(--border-strong);margin:0 5px}
.modebar .right{margin-left:auto;display:flex;align-items:center;gap:8px;color:var(--muted);font-size:11px;flex-shrink:0}
.doc{flex:1;min-height:0;overflow:hidden;padding:34px 48px 0;position:relative}
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
.md .mark-live{outline:2px solid transparent}
.cursor{position:absolute;width:2px;height:20px;background:#b2625e}
.cursor i{position:absolute;top:-18px;left:-1px;font-style:normal;font-size:10.5px;font-weight:600;color:#fff;background:#b2625e;padding:1px 6px;border-radius:4px;white-space:nowrap}
.aibox{margin:0 48px 22px;border:1px solid var(--border);border-radius:12px;background:var(--panel-2);padding:14px 16px 12px}
.aibox .in{display:flex;align-items:center;gap:10px;height:40px;border:1px solid var(--border-strong);border-radius:10px;background:var(--bg);padding:0 12px;color:var(--muted);font-size:14px}
.aibox .in .go{margin-left:auto;width:28px;height:28px;border-radius:7px;background:var(--ai);color:#fff;display:grid;place-items:center}
.chips{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
.chip{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border:1px solid var(--border);border-radius:999px;font-size:12px;color:var(--fg-muted);background:var(--bg)}
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
.rail{border-left:1px solid var(--border);display:flex;flex-direction:column;min-height:0;overflow:hidden}
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
.tagline{display:flex;flex-wrap:wrap;gap:6px}
.tag{font-size:11px;padding:2px 8px;border-radius:999px;border:1px solid var(--border);background:var(--panel-2);color:var(--fg-muted)}
.credits{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--fg-muted)}
.meter{flex:1;height:6px;border-radius:3px;background:var(--panel-2);border:1px solid var(--border);overflow:hidden}
.meter i{display:block;height:100%;background:var(--ai)}
/* overlays */
.dim{position:absolute;inset:0;background:rgba(10,10,10,.28);display:grid;place-items:center}
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
.toast{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);background:var(--accent);color:var(--accent-fg);padding:8px 14px;border-radius:8px;font-size:12.5px;display:flex;gap:10px;align-items:center;box-shadow:0 8px 24px rgba(0,0,0,.2)}
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
.usage{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;max-width:820px;margin:0 0 22px}
.ucard{border:1px solid var(--border);border-radius:12px;padding:14px 16px}
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
/* mobile */
.phone{width:390px;height:844px;background:var(--bg);display:grid;grid-template-rows:auto 1fr auto;overflow:hidden}
.phone .top{padding:0 10px}
.phone .bottombar{display:flex;justify-content:space-around;align-items:center;height:56px;border-top:1px solid var(--border);color:var(--fg-muted)}
.install{position:absolute;left:12px;right:12px;bottom:70px;background:var(--bg);border:1px solid var(--border-strong);border-radius:12px;padding:12px 14px;display:flex;gap:10px;align-items:center;box-shadow:0 12px 40px rgba(17,18,22,.16)}
.install b{display:block;font-size:13px}
.install span{font-size:12px;color:var(--fg-muted)}
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
.src .dim{position:static;background:none;display:inline;color:var(--muted)}
.elsewhere{margin-top:18px;border:1px dashed var(--border-strong);border-radius:8px;padding:10px 12px;font-size:12px;color:var(--fg-muted)}
.elsewhere b{color:var(--fg)}
.qcard{border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:10px;background:var(--panel)}
.qcard .q{font-weight:600;font-size:13.5px;margin-bottom:8px}
.qcard .opt{display:flex;gap:8px;align-items:flex-start;padding:6px 8px;border-radius:6px;border:1px solid var(--border);margin-bottom:5px;font-size:12.5px}
.qcard .opt.rec{border-color:var(--accent)}
.qcard .opt .k{font-family:var(--font-mono);font-size:10.5px;color:var(--muted);min-width:14px}
.qcard .opt small{display:block;color:var(--muted);font-size:11.5px}
.qcard .rec-tag{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--ai);margin-left:6px;font-weight:600}
.steps{display:flex;gap:6px;align-items:center;font-size:12px;color:var(--muted);margin-bottom:14px}
.steps b{color:var(--fg)}
.kit .file{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border);font-size:12.5px}
.kit .file .ic{color:var(--muted)}
.kit .file .sp{flex:1}
.kit .file .ok{color:var(--success)}
.linkbox{display:flex;align-items:center;gap:8px;border:1px solid var(--border);border-radius:8px;padding:8px 10px;font-family:var(--font-mono);font-size:11.5px;color:var(--fg);background:var(--panel-2);margin:8px 0}
.prompt{border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-family:var(--font-mono);font-size:11px;line-height:1.55;color:var(--fg-muted);background:var(--bg);white-space:pre-wrap;margin:8px 0}
`;

const SW = { blue: '#5b8cff', green: '#4f8b6b', red: '#b2625e', amber: '#b8791b', grey: '#9b9ba3' };

function top({ tabs, share = true, presence = null, signedIn = true, extra = '' }) {
  // Header mirrors src/app/(vault)/layout.tsx: 52px, --panel, 0 14px padding,
  // a 26px/7px mark, the wordmark, then the icon cluster, a 1px divider and
  // the 26px avatar. Tabs live in their own 38px strip, as EditorPane renders
  // them with .sgnk-tab.
  const strip = tabs && tabs.length
    ? `<nav class="tabs">${tabs.map(t => `<span class="tab${t.on ? ' on' : ''}"><i class="sw" style="background:${SW[t.c] || t.c}"></i>${t.n}<span class="x">${ic('close', 15)}</span></span>`).join('')}<span class="tab newtab">${ic('add', 16)}</span></nav>`
    : '';
  return `<header class="top">
  <span class="topleft">
    <span class="ibtn">${ic('menu', 18)}</span>
    <span class="mark">fm</span>
    <span class="wordmark">frontmatter</span>
  </span>
  <span class="topright">
    ${presence ? `<span class="avatars">${presence.map(p => `<span class="avatar" style="background:${p.c}">${p.i}</span>`).join('')}</span>` : ''}
    ${share ? `<span class="btn ghost">${ic('share', 16)} Share</span>` : ''}
    <span class="search">${ic('search', 16)} Search<kbd>⌘K</kbd></span>
    ${extra}
    <span class="ibtn">${ic('share', 18)}</span>
    <span class="ibtn">${ic('visibility', 18)}</span>
    <span class="ibtn">${ic('dark_mode', 18)}</span>
    <i class="vsep"></i>
    ${signedIn ? `<span class="avatar" style="background:#18181b">SM</span><span class="uname">Sagnik</span>` : `<span class="btn primary">Sign in</span>`}
  </span></header>${strip}`;
}

function tree({ projects, foot = '' }) {
  return `<aside class="side">
  <div class="sidehead">${ic('chevron_right', 16)} Tree<span class="sp"></span><span class="pill">${ic('add', 14)} project</span></div>
  ${projects.map(p => `<div class="proj"><div class="projrow">${ic(p.icon || 'folder', 16)} ${p.n}<span class="sp"></span><span class="mini" title="New file">${ic('note_add', 15)}</span><span class="mini" title="New folder">${ic('create_new_folder', 15)}</span></div>
    ${p.rows.map(r => `<div class="row d${r.d || 1}${r.on ? ' on' : ''}">${ic(r.f ? 'description' : 'folder', 15)}<span class="n">${r.n}</span>${r.b ? `<span class="badge">${r.b}</span>` : ''}</div>`).join('')}</div>`).join('')}
  <div class="sidefoot">${foot}</div></aside>`;
}

function modebar(mode = 'Live', right = '', stats = '412 words \u00b7 3 min') {
  // One consolidated control row, as Toolbar.tsx renders it: twelve buttons in
  // this exact order, then the right-hand extras (stats, bookmark, find,
  // history, more) and the Edit/Live/Reading/Split segment from EditorPane.
  const modes = ['Edit', 'Live', 'Reading', 'Split'];
  const tools = [['format_bold', ''], ['format_italic', ''], ['format_strikethrough', ''], ['code', ''],
    ['H1', 'h'], ['H2', 'h'], ['format_list_bulleted', ''], ['check_box', ''], ['format_quote', ''],
    ['data_object', ''], ['link', ''], ['table_chart', '']];
  return `<div class="modebar">
  <span class="tools">${tools.map(x => x[1] === 'h' ? `<span class="tool h">${x[0]}</span>` : `<span class="tool">${ic(x[0], 18)}</span>`).join('')}</span>
  <span class="right">${stats ? `<span>${stats}</span>` : ''}${right}
    <span class="tool">${ic('bookmark', 18)}</span><span class="tool">${ic('search', 18)}</span><span class="tool">${ic('history', 18)}</span><span class="tool">${ic('more_horiz', 18)}</span>
    <span class="seg">${modes.map(m => `<span class="${m === mode ? 'on' : ''}">${m}</span>`).join('')}</span>
  </span></div>`;
}

function rail({ outline, extra = '', showFoot = true, credits = [7, 10], counts = [4, 2, 3] }) {
  const cnt = (n) => n == null ? '' : `<span class="cnt">${n}</span>`;
  return `<aside class="rail">
  <div class="rsec grow"><div class="rh">${ic('format_list_bulleted', 14)} Outline<span class="sp"></span></div><div class="ol">${outline}</div></div>
  ${extra}
  <div class="rrow">${ic('sell', 16)} Tags and bookmarks<span class="sp"></span>${cnt(counts[0])}${ic('chevron_right', 16)}</div>
  <div class="rrow">${ic('link', 16)} Backlinks<span class="sp"></span>${cnt(counts[1])}${ic('chevron_right', 16)}</div>
  <div class="rrow">${ic('history', 16)} Document history<span class="sp"></span><span class="pill">Pro</span>${ic('chevron_right', 16)}</div>
  <div class="rrow">${ic('comment', 16)} Comments<span class="sp"></span>${cnt(counts[2])}${ic('chevron_right', 16)}</div>
  ${showFoot ? `<div class="railfoot"><div class="two"><span class="btn">${ic('note_add', 16)} Add file</span><span class="btn">${ic('keyboard', 16)} Shortcuts</span></div>
  <span class="btn ai">${ic('auto_awesome', 16)} AI edit</span>
  <div class="credits">${ic('auto_awesome', 13)} ${credits[0]} of ${credits[1]} credits left <span class="meter"><i style="width:${Math.round(100 * credits[0] / credits[1])}%"></i></span></div></div>` : ''}
  </aside>`;
}

const OUTLINE_BRIEF = `<div class="on">00-BRIEF</div><div class="l2">What it is</div><div class="l2 on">The first user</div><div class="l3">Who they are</div><div class="l3">What they do today</div><div class="l2">The one metric</div><div class="l2">The kickoff prompt</div>`;
const DOC_BRIEF = `<h1>Zephyrus booking, in one page</h1>
<p>A booking page for small studios that take appointments by WhatsApp today. One link, a calendar of open slots, a deposit, and a reminder the day before.</p>
<h2>The first user</h2>
<p>A two-chair salon in Kolkata that loses about four bookings a week to double-booking and no-shows. The owner runs everything from a phone.</p>
<ul><li>Books from WhatsApp messages, by hand, into a paper diary</li><li>Takes deposits by UPI, then forgets who paid</li><li>Wants a link to put in the Instagram bio</li></ul>
<h2>The one metric</h2>
<p>No-shows per hundred bookings, before and after the deposit step. If it does not fall below eight, the deposit is not the answer.</p>`;

const PROJECTS_MAIN = [
  { n: 'Zephyrus booking', icon: 'rocket_launch', rows: [
    { n: 'SKILL.md', f: 1 }, { n: 'AGENTS.md', f: 1 },
    { n: '00-BRIEF.md', f: 1, on: 1 }, { n: '01-PRODUCT.md', f: 1 }, { n: '02-DATA-AND-API.md', f: 1 }, { n: '03-ARCHITECTURE.md', f: 1 }, { n: '04-SETUP.md', f: 1 },
    { n: 'specs', d: 1 }, { n: 'booking.md', f: 1, d: 2 }, { n: 'payments.md', f: 1, d: 2 }, { n: 'MANIFEST.json', f: 1 } ] },
  { n: 'Notes', rows: [ { n: 'meeting-16-sep.md', f: 1, b: '2 new' }, { n: 'ideas.md', f: 1 } ] },
];
const TABS_MAIN = [{ n: '00-BRIEF.md', c: 'blue', on: 1 }, { n: 'specs/booking.md', c: 'blue' }, { n: 'meeting-16-sep.md', c: 'green' }, { n: 'ideas.md', c: 'green' }];

function page(title, body, cls = '') {
  return `<!doctype html><html lang="en" class="${cls}"><head><meta charset="utf-8"><title>${title}</title><style>${CSS}</style></head><body>${body}</body></html>`;
}

const screens = {};

// S01 first run, no account
screens['s01-first-run'] = page('First run', `<div class="app">
${top({ tabs: [{ n: 'Untitled.md', c: 'grey', on: 1 }], share: false, signedIn: false })}
<div class="body">
${tree({ projects: [{ n: 'On this device', icon: 'folder', rows: [{ n: 'Untitled.md', f: 1, on: 1 }] }], foot: `${ic('lock', 14)} Saved on this device only` })}
<main class="main">${modebar('Live', '<span class="pill">Not signed in</span>')}
<div class="doc"><div class="md"><h1 style="color:var(--muted);border:0">Untitled</h1><p style="color:var(--muted)">Start writing, paste anything, or ask for a first draft below. Everything stays on this device until you sign in.</p></div></div>
<div class="aibox"><div class="in">${ic('auto_awesome', 18)} Describe a product, paste a chat, or say what you want to write<span class="go">${ic('arrow_forward', 16)}</span></div>
<div class="chips"><span class="chip on">${ic('rocket_launch', 14)} Start a blueprint</span><span class="chip">${ic('content_copy', 14)} Paste a chat and clean it up</span><span class="chip">${ic('description', 14)} Write a spec</span><span class="chip">${ic('checklist', 14)} Turn notes into a plan</span></div>
<div class="chips alt"><span class="lbl">Or start from</span><span class="chip">${ic('code', 14)} Open from GitHub</span><span class="chip">${ic('note_add', 14)} Drop a .md file</span><span class="chip">${ic('table_view', 14)} A template</span></div>
<div class="foot">${ic('lock', 12)} AI needs a free account: 1 blueprint and 10 edits a month, no card. Editing and export never need one.</div></div>
</main>
${rail({ outline: '<div style="color:var(--muted)">Headings appear here as you write.</div>', showFoot: true, credits: [0, 10], counts: [null, null, null] })}
</div></div>`);

// S02 sign in
screens['s02-sign-in'] = page('Sign in', `<div class="app">
${top({ tabs: [{ n: 'Untitled.md', c: 'grey', on: 1 }], share: false, signedIn: false })}
<div class="body">
${tree({ projects: [{ n: 'On this device', icon: 'folder', rows: [{ n: 'Untitled.md', f: 1, on: 1 }] }] })}
<main class="main" style="position:relative">${modebar('Live')}
<div class="doc"><div class="md"><h1>Booking page for Studio 12</h1><p>A booking page for small studios that take appointments by WhatsApp today.</p></div></div>
<div class="dim"><div class="modal"><h2>Keep this, and switch on AI</h2><p>An account saves your documents to the cloud, opens sharing, and gives you 1 blueprint and 10 AI edits a month. Free, no card.</p>
<div class="stack"><span class="btn">${ic('public', 18)} Continue with Google</span><span class="btn">${ic('terminal', 18)} Continue with GitHub</span></div>
<p class="fine">Your document stays on this device either way. We never train on your documents. <u>Privacy</u> · <u>Terms</u></p></div></div>
</main>
${rail({ outline: '<div class="on">Booking page for Studio 12</div>', credits: [0, 10], counts: [null, null, null] })}
</div></div>`);

// S03 workspace
screens['s03-workspace'] = page('Workspace', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body">
${tree({ projects: PROJECTS_MAIN, foot: `${ic('sync', 14)} Synced 2 min ago` })}
<main class="main">${modebar('Live', '<span class="pill ok">' + ic('check', 13) + ' Saved</span>')}
<div class="doc"><div class="md">${DOC_BRIEF}</div></div>
</main>
${rail({ outline: OUTLINE_BRIEF })}
</div></div>`);

// S04 AI writing on an empty document
screens['s04-ai-writing'] = page('AI writing box', `<div class="app">
${top({ tabs: [...TABS_MAIN.map(t => ({ ...t, on: 0 })), { n: 'Untitled.md', c: 'green', on: 1 }] })}
<div class="body">
${tree({ projects: [PROJECTS_MAIN[0], { n: 'Notes', rows: [{ n: 'meeting-16-sep.md', f: 1 }, { n: 'ideas.md', f: 1 }, { n: 'Untitled.md', f: 1, on: 1 }] }] })}
<main class="main">${modebar('Live')}
<div class="doc"><div class="md"><h1 style="color:var(--muted);border:0">Untitled</h1></div></div>
<div class="aibox"><div class="in">${ic('auto_awesome', 18)} A booking page for small salons, deposits by UPI, reminders the day before<span class="go">${ic('arrow_forward', 16)}</span></div>
<div class="chips"><span class="chip on">${ic('rocket_launch', 14)} Blueprint: 7 files for an agent</span><span class="chip">${ic('description', 14)} One document</span><span class="chip">${ic('content_copy', 14)} Clean up a paste</span><span class="chip">${ic('checklist', 14)} Plan from notes</span></div>
<div class="chips alt"><span class="lbl">Or start from</span><span class="chip">${ic('code', 14)} Open from GitHub</span><span class="chip">${ic('note_add', 14)} Drop a .md file</span><span class="chip">${ic('table_view', 14)} A template</span></div>
<div class="foot">${ic('auto_awesome', 12)} A blueprint uses your 1 blueprint credit, a document 1 edit credit. This month: blueprint available, 7 edits left. <u>Get more</u></div></div>
</main>
${rail({ outline: '<div style="color:var(--muted)">Nothing yet.</div>' })}
</div></div>`);

// S05 idea mode: questions
const QCARDS = [
  { q: '1. Who is the first user?', opts: [['a', 'A solo studio owner working from a phone', 'Fastest to reach; deposits matter most', 1], ['b', 'A small chain with a front desk', 'Bigger ticket, slower sale'], ['c', 'Not sure', 'Takes the recommendation']] },
  { q: '2. What ships first?', opts: [['a', 'Booking link, calendar, deposit, reminder', 'The four things the brief names', 1], ['b', 'Booking link and calendar only', 'Cheaper, but the deposit is the point'], ['c', 'Not sure', 'Takes the recommendation']] },
  { q: '3. Where does it run?', opts: [['a', 'A web page, no app', 'One link in the bio', 1], ['b', 'A web page and a WhatsApp bot', 'Two surfaces on day one']] },
];
screens['s05-idea-mode'] = page('Idea mode', `<div class="app">
${top({ tabs: [{ n: 'New blueprint', c: 'blue', on: 1 }] })}
<div class="body noright">
${tree({ projects: [{ n: 'Zephyrus booking', icon: 'rocket_launch', rows: [{ n: 'Blueprint, in progress', f: 1, on: 1 }] }, PROJECTS_MAIN[1]] })}
<main class="main"><div class="modebar"><span class="steps"><b>1 Describe</b> ${ic('chevron_right', 14)} <b>2 Decide</b> ${ic('chevron_right', 14)} 3 Write ${ic('chevron_right', 14)} 4 Hand off</span><span class="right"><span class="pill ai">${ic('auto_awesome', 13)} 1 blueprint credit</span></span></div>
<div class="doc" style="padding:28px 48px"><div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;max-width:1040px;margin:0 auto">
<div><div class="rh">Your idea</div><div class="md" style="font-size:14px"><p>A booking page for small salons that take appointments on WhatsApp today. One link for the Instagram bio, a calendar of open slots, a UPI deposit, and a reminder the day before. The owner runs everything from a phone.</p></div>
<div class="rh" style="margin-top:22px">What the blueprint will hold</div><div class="kit">${['00-BRIEF.md', '01-PRODUCT.md', '02-DATA-AND-API.md', '03-ARCHITECTURE.md', '04-SETUP.md', 'specs/booking.md, specs/payments.md', 'MANIFEST.json and SHA256SUMS'].map(f => `<div class="file">${ic('description', 15)}<span class="sp">${f}</span></div>`).join('')}</div></div>
<div><div class="rh">Six decisions, then it writes. <span style="text-transform:none;letter-spacing:0;font-weight:400">Not sure takes the recommendation.</span></div>
${QCARDS.map(c => `<div class="qcard"><div class="q">${c.q}</div>${c.opts.map(o => `<div class="opt${o[3] ? ' rec' : ''}"><span class="k">${o[0]}</span><span>${o[1]}${o[3] ? '<span class="rec-tag">recommended</span>' : ''}<small>${o[2]}</small></span></div>`).join('')}</div>`).join('')}
<div style="display:flex;gap:8px;justify-content:flex-end"><span class="btn">Back</span><span class="btn primary">Next: three more ${ic('arrow_forward', 14)}</span></div></div>
</div></div></main></div></div>`);

// S06 blueprint ready
screens['s06-blueprint-ready'] = page('Blueprint ready', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body">
${tree({ projects: PROJECTS_MAIN, foot: `${ic('verified', 14)} Blueprint v1 · 11 files` })}
<main class="main">${modebar('Read', '<span class="pill ok">' + ic('verified', 13) + ' Files agree</span>')}
<div class="doc"><div class="md">${DOC_BRIEF}</div></div>
</main>
<aside class="rail"><div class="rsec"><div class="rh">${ic('rocket_launch', 14)} Blueprint<span class="sp"></span><span class="pill">v1</span></div>
<div class="kit">${[['SKILL.md', 0, 'Loaded first'], ['AGENTS.md', 0, 'Every agent reads it'], ['00-BRIEF.md', 0], ['01-PRODUCT.md', 0], ['02-DATA-AND-API.md', 0], ['03-ARCHITECTURE.md', 0], ['04-SETUP.md', 0], ['specs/', 1], ['booking.md', 2], ['payments.md', 2], ['MANIFEST.json', 0], ['SHA256SUMS', 0]].map(f => `<div class="file${f[1] === 2 ? ' d2' : ''}">${ic(f[1] === 1 ? 'folder' : 'description', 14)}<span class="sp">${f[0]}</span>${f[2] ? `<em class="hint">${f[2]}</em>` : ic('check', 14, 'ok')}</div>`).join('')}</div>
<div style="font-size:12px;color:var(--fg-muted);margin-top:8px">A skill folder, so any agent that follows the standard can install it. SKILL.md loads first; the rest only when the agent needs them.</div>
<div style="font-size:12px;color:var(--fg-muted);margin-top:6px">Consistency check: every name in 02-DATA-AND-API appears in specs. Two names were fixed before you saw them.</div></div>
<div class="rsec"><div class="rh">${ic('link', 14)} Link, unlisted</div><div class="linkbox">${ic('public', 14)} frontmatter.in/k/7f3a…c91e/<span style="margin-left:auto">${ic('content_copy', 14)}</span></div>
<div style="font-size:11.5px;color:var(--muted)">Anyone with the link can read it. Not indexed. Revoke any time.</div></div>
<div class="rsec"><div class="rh">${ic('terminal', 14)} Kickoff prompt<span class="sp"></span></div><div style="margin:-2px 0 8px"><span class="seg" style="padding:2px"><span class="on" style="padding:2px 9px">Claude Code</span><span style="padding:2px 9px">Cursor</span><span style="padding:2px 9px">Codex</span></span></div>
<div class="prompt">The documents for this project are at https://frontmatter.in/k/7f3a…c91e/ (version 1).
1. mkdir -p docs/kit && curl -sL …/v1/kit.tar.gz | tar xz -C docs/kit
2. cd docs/kit && shasum -a 256 -c SHA256SUMS  (stop if any line fails)
3. Read 00-BRIEF.md, then the rest in order. Build against specs/*.md.</div>
<span class="btn primary" style="width:100%">${ic('content_copy', 15)} Copy the kickoff prompt</span></div>
<div class="railfoot"><span class="btn">${ic('edit', 15)} Edit, then publish v2</span></div></aside>
</div></div>`);

// S07 AI edit with inline suggestion
screens['s07-ai-edit'] = page('AI edit', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body">
${tree({ projects: PROJECTS_MAIN })}
<main class="main" style="position:relative">${modebar('Edit', '<span class="pill ai">' + ic('auto_awesome', 13) + ' Suggesting</span>')}
<div class="doc"><div class="md"><h1>Zephyrus booking, in one page</h1>
<p>A booking page for small studios that take appointments by WhatsApp today. One link, a calendar of open slots, a deposit, and a reminder the day before.</p>
<h2>The first user</h2>
<p><span class="ai-del">A two-chair salon in Kolkata that loses about four bookings a week to double-booking and no-shows.</span> <span class="ai-sug">A two-chair salon in Kolkata. It loses about four bookings a week to double-booking and no-shows, which is a day's takings.</span><span class="suggest"><span class="btn primary">${ic('check', 13)} Accept</span><span class="btn">Reject</span></span> The owner runs everything from a phone.</p>
<ul><li>Books from WhatsApp messages, by hand, into a paper diary</li><li>Takes deposits by UPI, then forgets who paid</li></ul></div>
<div class="pop" style="top:140px;right:60px"><div class="mi on"><b>Refine selection</b><span>Polish prose, fix grammar</span></div><div class="mi"><b>Expand</b><span>Add detail and depth</span></div><div class="mi"><b>Shorten</b><span>More concise, same meaning</span></div><div class="mi"><b>Change tone</b><span>Professional or casual</span></div><div class="mi"><b>Translate</b><span>Keep the markdown intact</span></div><div class="mi"><b>Summarise into a callout</b><span>Adds a summary block</span></div><div class="mi"><b>Suggest links</b><span>Wiki links to your notes</span></div><div class="mi" style="border-top:1px solid var(--border);margin-top:4px;padding-top:8px"><span>1 credit each · 7 left</span></div></div>
</div></main>
${rail({ outline: OUTLINE_BRIEF })}
</div></div>`);

// S08 document review
screens['s08-review'] = page('Document review', `<div class="app">
${top({ tabs: TABS_MAIN, presence: [{ i: 'AM', c: '#b2625e' }, { i: 'SM', c: '#18181b' }] })}
<div class="body">
${tree({ projects: PROJECTS_MAIN })}
<main class="main">${modebar('Read', '<span class="pill">3 changes to review</span>')}
<div class="doc"><div class="md"><h1>Zephyrus booking, in one page</h1>
<p>A booking page for small studios that take appointments by WhatsApp today. <span class="chg">One link, a calendar of open slots, a refundable deposit, and a reminder the day before.</span></p>
<h2>The first user</h2>
<p>A two-chair salon in Kolkata that loses about four bookings a week to double-booking and no-shows. The owner runs everything from a phone.</p>
<ul><li>Books from WhatsApp messages, by hand, into a paper diary</li><li><span class="chg">Takes deposits by UPI, then reconciles them on Sunday night</span></li><li>Wants a link to put in the Instagram bio</li></ul>
<h2>The one metric</h2><p><span class="chg">No-shows per hundred bookings, measured for four weeks before the deposit step and four after.</span></p></div></div>
</main>
<aside class="rail"><div class="rsec grow"><div class="rh">${ic('checklist', 14)} Review<span class="sp"></span><span class="cnt">3 waiting</span></div>
<div class="chg-list">
<div class="it"><div class="who"><span class="avatar" style="width:16px;height:16px;font-size:8px;background:#b2625e">AM</span> Amit · 10 min ago</div><div class="q">Changed "a deposit" to "a refundable deposit" in the summary.</div><div class="acts"><span class="btn primary">${ic('check', 13)} Accept</span><span class="btn">Reject</span><span class="btn ghost">Reply</span></div></div>
<div class="it"><div class="who">${ic('auto_awesome', 13)} AI edit · you asked to tighten · 25 min ago</div><div class="q">Rewrote the deposit bullet to say when reconciliation happens.</div><div class="acts"><span class="btn primary">${ic('check', 13)} Accept</span><span class="btn">Reject</span></div></div>
<div class="it"><div class="who"><span class="avatar" style="width:16px;height:16px;font-size:8px;background:#b2625e">AM</span> Amit · 1 h ago</div><div class="q">Metric now says how long it is measured for.</div><div class="acts"><span class="btn primary">${ic('check', 13)} Accept</span><span class="btn">Reject</span><span class="btn ghost">Reply</span></div></div>
</div><div style="margin-top:12px"><span class="btn" style="width:100%">Accept all three</span></div></div>
<div class="rrow">${ic('comment', 16)} Comments<span class="sp"></span><span class="cnt">2 open</span>${ic('chevron_right', 16)}</div>
<div class="rrow">${ic('history', 16)} Document history<span class="sp"></span><span class="pill">Pro</span>${ic('chevron_right', 16)}</div>
<div class="railfoot"><span class="btn ai">${ic('auto_awesome', 16)} AI edit</span></div></aside>
</div></div>`);

// S09 share dialog
screens['s09-share'] = page('Share', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body">
${tree({ projects: PROJECTS_MAIN })}
<main class="main" style="position:relative">${modebar('Live')}
<div class="doc"><div class="md">${DOC_BRIEF}</div></div>
<div class="dim"><div class="modal" style="width:520px"><h2>Share 00-BRIEF.md</h2><p>People you add need a frontmatter account. Published pages need nothing.</p>
<div class="rh" style="margin-top:6px">People</div>
<div style="display:flex;gap:8px;margin-bottom:10px"><span class="search" style="flex:1">${ic('person', 16)} Add by email or Google account</span><span class="btn">Can edit ${ic('expand_more', 14)}</span><span class="btn primary">Invite</span></div>
<div class="vers"><div class="it on"><span class="avatar" style="width:24px;height:24px;font-size:9px;background:#18181b">SM</span> You <span class="sp"></span><span style="color:var(--muted)">Owner</span></div>
<div class="it"><span class="avatar" style="width:24px;height:24px;font-size:9px;background:#b2625e">AM</span> Amit Kumar <span class="sp"></span><span style="color:var(--muted)">Can edit · live</span></div></div>
<p class="fine" style="margin:8px 0 14px">${ic('lock', 12)} Free includes one collaborator per document, live. Pro removes the limit. <u>See Pro</u></p>
<div class="rh">Publish</div>
<div style="display:flex;align-items:center;gap:10px;border:1px solid var(--border);border-radius:8px;padding:10px 12px"><span style="width:34px;height:20px;border-radius:10px;background:var(--success);position:relative;flex:none"><i style="position:absolute;right:2px;top:2px;width:16px;height:16px;border-radius:50%;background:#fff"></i></span><span style="flex:1"><b style="font-size:13px">Published to the web</b><br><span style="font-size:12px;color:var(--muted)">Anyone with the link can read. Not indexed. 3 of 5 free publishes used.</span></span></div>
<div class="linkbox">${ic('public', 14)} frontmatter.in/p/zephyrus-booking-brief<span style="margin-left:auto">${ic('content_copy', 14)}</span></div>
<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:6px"><span class="btn">Done</span></div></div></div>
</main>
${rail({ outline: OUTLINE_BRIEF })}
</div></div>`);

// S10 public view
screens['s10-public-view'] = page('Published page', `<div class="pub">
<header class="pubtop"><span class="mark">fm</span><span class="t">Zephyrus booking, in one page</span><span class="pill" style="margin-left:6px">Published 16 Sep</span>
<span class="r"><span class="btn ghost">${ic('download', 16)} Download .md</span><span class="btn primary">${ic('open_in_new', 15)} Open in frontmatter</span></span></header>
<div class="pubbody"><div class="md">${DOC_BRIEF}<h2>The kickoff prompt</h2><p>Copy this into Claude Code, Cursor or Codex and it builds from these documents.</p><pre>mkdir -p docs/kit && curl -sL https://frontmatter.in/k/7f3a…c91e/v1/kit.tar.gz | tar xz -C docs/kit
cd docs/kit && shasum -a 256 -c SHA256SUMS</pre></div>
<div class="card"><h3>Read this properly in frontmatter</h3><p>Outline, dark mode, comments and a copy you can edit. Free, no card.</p><div class="acts"><span class="btn primary">${ic('public', 15)} Sign in with Google</span><span class="btn ghost">Not now</span></div></div>
<div style="position:absolute;left:24px;bottom:18px;font-size:11.5px;color:var(--muted)">Made with frontmatter</div></div></div>`);

// S11 live collaboration
screens['s11-live-collab'] = page('Live collaboration', `<div class="app">
${top({ tabs: TABS_MAIN, presence: [{ i: 'AM', c: '#b2625e' }, { i: 'SM', c: '#18181b' }] })}
<div class="body">
${tree({ projects: PROJECTS_MAIN, foot: `${ic('group', 14)} Amit is editing this document` })}
<main class="main" style="position:relative">${modebar('Edit', '<span class="pill ok">' + ic('sync', 13) + ' Live</span>')}
<div class="doc" style="position:relative"><div class="md"><h1>Zephyrus booking, in one page</h1>
<p>A booking page for small studios that take appointments by WhatsApp today. One link, a calendar of open slots, a deposit, and a reminder the day before.</p>
<h2>The first user</h2>
<p>A two-chair salon in Kolkata that loses about four bookings a week to double-booking and no-shows. The owner runs everything from a phone<span style="background:color-mix(in srgb,#b2625e 22%,transparent)">, and has never used a laptop for the business</span>.</p>
<ul><li>Books from WhatsApp messages, by hand, into a paper diary</li><li>Takes deposits by UPI, then forgets who paid</li></ul></div>
<span class="cursor" style="left:calc(50% + 214px);top:246px"><i>Amit</i></span></div>
<div class="toast">${ic('group', 15)} <span>Free includes <b>one</b> live collaborator per document.</span> <span class="btn sm" style="background:var(--accent-fg);color:var(--accent)">Invite more with Pro</span></div>
</main>
${rail({ outline: OUTLINE_BRIEF })}
</div></div>`);

// S12 plan and usage
screens['s12-plan-usage'] = page('Plan and usage', `<div class="app">
${top({ tabs: TABS_MAIN.map(t => ({ ...t, on: 0 })), share: false })}
<div class="body noright">
${tree({ projects: PROJECTS_MAIN.map(p => ({ ...p, rows: p.rows.map(r => ({ ...r, on: 0 })) })) })}
<main class="main"><div class="page"><h1>Plan and usage</h1><p class="sub">Free plan · Sagnik Mitra · Renews 1 October</p>
<div class="usage"><div class="ucard"><div class="k">AI edits</div><div class="v">7 <small>of 10 left · 1 blueprint left</small></div><div class="meter"><i style="width:70%"></i></div></div>
<div class="ucard"><div class="k">Documents in the cloud</div><div class="v">7 <small>of 10</small></div><div class="meter"><i style="width:70%;background:var(--accent)"></i></div></div>
<div class="ucard"><div class="k">Published pages</div><div class="v">3 <small>of 5</small></div><div class="meter"><i style="width:60%;background:var(--accent)"></i></div></div></div>
<div class="plans"><div class="plan"><div class="nm">Free</div><div class="pr">₹0</div><ul>
<li>${ic('check', 15)} The editor, offline in the browser, every export</li><li>${ic('check', 15)} 10 documents in the cloud, 5 published pages</li><li>${ic('check', 15)} 1 blueprint and 10 AI edits a month</li><li>${ic('check', 15)} One live collaborator per document, 1 GitHub repository</li><li class="no">${ic('close', 15)} Document history</li></ul><span class="btn" style="width:100%">Current plan</span></div>
<div class="plan pro"><div class="nm">Pro</div><div class="pr">₹299 <small>a month, or ₹2,499 a year</small></div><ul>
<li>${ic('check', 15)} Unlimited documents and published pages</li><li>${ic('check', 15)} 5 blueprints and 100 AI edits a month, top up any time</li><li>${ic('check', 15)} Unlimited live collaborators and GitHub repositories</li><li>${ic('check', 15)} Document history, 90 days</li><li>${ic('check', 15)} No "made with frontmatter" line on published pages</li></ul><span class="btn primary" style="width:100%">Upgrade to Pro</span>
<div style="margin-top:10px;font-size:11.5px;color:var(--muted)">UPI, cards. Cancel any time. Top-up: 50 edits for ₹99, 3 blueprints for ₹149.</div></div></div>
<div class="soon"><div><b>Team</b> · seats, shared workspaces, one bill · coming after Pro</div><div><b>Enterprise</b> · later · talk to us</div></div></div></main></div></div>`);

// S13 offline + desktop nudge
screens['s13-offline'] = page('Offline', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body">
${tree({ projects: PROJECTS_MAIN, foot: `${ic('cloud_off', 14)} Offline · 2 changes waiting to sync` })}
<main class="main" style="position:relative"><div class="banner">${ic('cloud_off', 16)} <span>You are offline. Everything you type is saved on this device and syncs when you are back.</span><span class="sp"></span><span class="pill">Last synced 14:02</span></div>
${modebar('Live')}
<div class="doc"><div class="md">${DOC_BRIEF}</div></div>
<div class="card"><h3>frontmatter for Mac</h3><p>Keeps your documents as files on disk, works fully offline, and syncs when you are back. Same account, same documents.</p><div class="acts"><span class="btn primary">${ic('download', 15)} Download for Mac</span><span class="btn ghost">Remind me later</span></div></div>
</main>
${rail({ outline: OUTLINE_BRIEF })}
</div></div>`);

// S14 desktop app
screens['s14-desktop'] = page('Desktop app', `<div class="desk"></div><div class="macwin"><div class="app">
<header class="top"><span class="lights"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></span><span class="mark">fm</span>
<span class="topicons">${['menu', 'terminal', 'settings'].map(n => `<span class="ibtn">${ic(n, 18)}</span>`).join('')}</span>
<nav class="tabs">${[{ n: '00-BRIEF.md', c: 'blue', on: 1 }, { n: 'ideas.md', c: 'amber' }].map(t => `<span class="tab${t.on ? ' on' : ''}"><i class="sw" style="background:${SW[t.c]}"></i>${t.n}<span class="x">×</span></span>`).join('')}<span class="tab newtab">${ic('add', 16)}</span></nav>
<span class="topright"><span class="btn ghost">${ic('share', 16)} Share</span><span class="search">${ic('search', 16)} Search<kbd>⌘K</kbd></span><span class="avatar" style="background:#18181b">SM</span></span></header>
<div class="body">
${tree({ projects: [{ n: 'Cloud · Zephyrus booking', icon: 'rocket_launch', rows: [{ n: '00-BRIEF.md', f: 1, on: 1 }, { n: '01-PRODUCT.md', f: 1 }, { n: 'specs', d: 1 }, { n: 'booking.md', f: 1, d: 2 }] }, { n: 'On this Mac · ~/Documents/notes', icon: 'folder', rows: [{ n: 'ideas.md', f: 1 }, { n: 'journal', d: 1 }, { n: '2026-09-16.md', f: 1, d: 2 }] }], foot: `${ic('sync', 14)} Synced 1 min ago · files on disk` })}
<main class="main">${modebar('Live', '<span class="pill ok">' + ic('check', 13) + ' Saved to disk</span>')}
<div class="doc"><div class="md">${DOC_BRIEF}</div></div></main>
${rail({ outline: OUTLINE_BRIEF })}
</div></div></div>`);

// S15 document history (Pro)
screens['s15-history'] = page('Document history', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body">
${tree({ projects: PROJECTS_MAIN })}
<main class="main">${modebar('Read', '<span class="pill">Viewing 14:02 version</span>')}
<div class="doc" style="padding:28px 48px 0"><div class="md"><h1>Zephyrus booking, in one page</h1>
<div class="diff"><div> A booking page for small studios that take appointments by WhatsApp today.</div><div class="del">-One link, a calendar of open slots, a deposit, and a reminder the day before.</div><div class="add">+One link, a calendar of open slots, a refundable deposit, and a reminder the day before.</div><div> </div><div> ## The first user</div><div> A two-chair salon in Kolkata that loses about four bookings a week to double-booking</div><div class="del">-and no-shows.</div><div class="add">+and no-shows, which is a day's takings. The owner runs everything from a phone.</div></div>
<div style="display:flex;gap:8px;margin-top:14px"><span class="btn primary">${ic('history', 15)} Restore this version</span><span class="btn">Copy as new document</span></div></div></div>
</main>
<aside class="rail"><div class="rsec grow"><div class="rh">${ic('history', 14)} Document history<span class="sp"></span><span class="pill">Pro · 90 days</span></div>
<div class="vers">${[['Today 14:02', 'Amit', 1], ['Today 11:40', 'You'], ['Today 10:05', 'AI edit, accepted by you'], ['Yesterday 18:30', 'You'], ['12 Sep 09:12', 'Blueprint v1 written'], ['12 Sep 09:10', 'Created']].map(v => `<div class="it${v[2] ? ' on' : ''}"><span class="avatar" style="width:20px;height:20px;font-size:8px;background:${v[1].startsWith('A') && v[1] !== 'AI edit, accepted by you' ? '#b2625e' : v[1].startsWith('AI') ? '#0055ff' : '#18181b'}">${v[1].startsWith('AI') ? '✦' : v[1].slice(0, 2).toUpperCase()}</span><span><div>${v[0]}</div><div style="font-size:11px;color:var(--muted)">${v[1]}</div></span><span class="sp"></span>${v[2] ? ic('check', 14) : ''}</div>`).join('')}</div></div>
<div class="railfoot"><span class="btn">${ic('download', 15)} Export history as .zip</span></div></aside>
</div></div>`);

// S16 custom blocks
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
screens['s16-custom-blocks'] = page('Custom blocks', `<div class="app">
${top({ tabs: [{ n: 'bookings-q3.md', c: 'amber', on: 1 }] })}
<div class="body noright">
${tree({ projects: [{ n: 'Notes', rows: [{ n: 'bookings-q3.md', f: 1, on: 1 }, { n: 'ideas.md', f: 1 }] }] })}
<main class="main">${modebar('Split')}
<div class="split"><div class="pane"><div class="src">## Where bookings came from

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

The deposit is $ d = 0.2 \\times p $ of the price.</div>
<div class="elsewhere"><b>Elsewhere</b> (GitHub, Obsidian, VS Code): the table is still a table, and the chart block is a two-line code block under it. Mermaid renders on GitHub, GitLab and in Obsidian. The callout renders on GitHub as a note. Math renders on GitHub.</div></div><div class="gut"></div>
<div class="pane"><div class="md" style="max-width:none"><h2 style="margin-top:0">Where bookings came from</h2>
<div style="display:flex;gap:26px;align-items:center;margin:.6em 0 .4em">${pieSvg()}<div style="font-size:13px"><div style="display:flex;gap:8px;align-items:center;margin:6px 0"><i style="width:10px;height:10px;background:#18181b;border-radius:2px"></i>Instagram · 312 · 52%</div><div style="display:flex;gap:8px;align-items:center;margin:6px 0"><i style="width:10px;height:10px;background:#5b8cff;border-radius:2px"></i>WhatsApp · 186 · 31%</div><div style="display:flex;gap:8px;align-items:center;margin:6px 0"><i style="width:10px;height:10px;background:#b8791b;border-radius:2px"></i>Walk-in · 102 · 17%</div></div></div>
<div style="font-size:12px;color:var(--muted);margin:0 0 1.2em">${ic('table_chart', 14)} Table folded. Click to show the three rows.</div>
<div style="display:flex;gap:10px;align-items:center;margin:1em 0;font-size:13px">${['Link in bio', 'Pick a slot', 'Pay deposit', 'Reminder'].map((s, i) => `<span style="border:1px solid var(--border-strong);border-radius:6px;padding:6px 10px;background:var(--panel-2)">${s}</span>${i < 3 ? ic('arrow_forward', 16) : ''}`).join('')}</div>
<div class="callout"><div class="t">Tip · Deposits</div>A refundable deposit cut no-shows to 6 in 100.</div>
<p>The deposit is <i>d</i> = 0.2 × <i>p</i> of the price.</p></div></div></div>
</main></div></div>`);

// S17 mobile PWA
screens['s17-mobile'] = page('Mobile PWA', `<div class="phone" style="position:relative">
<header class="top"><span class="ibtn">${ic('menu', 20)}</span><span style="font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">00-BRIEF.md</span><span class="topright"><span class="seg"><span>Edit</span><span class="on">Read</span></span><span class="avatar" style="background:#18181b">SM</span></span></header>
<div style="overflow:hidden;padding:20px 18px 0"><div class="md" style="font-size:15px">${DOC_BRIEF}</div></div>
<div class="install">${ic('download', 22)}<span><b>Add frontmatter to your home screen</b><span>Opens like an app and keeps working offline.</span></span><span class="btn primary sm">Install</span></div>
<div class="bottombar">${['search', 'format_list_bulleted', 'auto_awesome', 'share', 'more_horiz'].map(n => `<span class="ibtn">${ic(n, 22)}</span>`).join('')}</div></div>`, '');

// S18 dark mode variant of the workspace
screens['s18-workspace-dark'] = page('Workspace, dark', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body">
${tree({ projects: PROJECTS_MAIN, foot: `${ic('sync', 14)} Synced 2 min ago` })}
<main class="main">${modebar('Live', '<span class="pill ok">' + ic('check', 13) + ' Saved</span>')}
<div class="doc"><div class="md">${DOC_BRIEF}</div></div>
</main>
${rail({ outline: OUTLINE_BRIEF })}
</div></div>`, 'dark');

// S19 instruction files: AGENTS.md with a health panel
const DOC_AGENTS = `<h1>AGENTS.md</h1>
<p>Onboarding contract for AI agents and new developers. Last verified 16 September 2026.</p>
<h2>Setup commands</h2>
<ul><li>Install: <code>npm install</code></li><li>Dev server: <code>npm run dev</code></li><li>Everything must pass: <code>npm run verify</code></li></ul>
<h2>Code style</h2>
<ul><li>TypeScript strict, no default exports</li><li>British spelling in prose</li><li>Cross-module imports go through the barrel, never a deep path</li></ul>
<h2>Do not</h2>
<ul><li>Never commit a file you did not author in this session</li><li>Never write to <code>main</code> without a passing verify</li></ul>`;
screens['s19-instruction-files'] = page('Instruction files', `<div class="app">
${top({ tabs: [{ n: 'AGENTS.md', c: 'amber', on: 1 }, { n: '00-BRIEF.md', c: 'blue' }, { n: 'ideas.md', c: 'green' }] })}
<div class="body">
${tree({ projects: [{ n: 'Zephyrus booking', icon: 'rocket_launch', rows: [{ n: 'AGENTS.md', f: 1, on: 1 }, { n: 'SKILL.md', f: 1 }, { n: '00-BRIEF.md', f: 1 }, { n: 'specs', d: 1 }, { n: 'booking.md', f: 1, d: 2 }] }, PROJECTS_MAIN[1]], foot: `${ic('verified', 14)} 1 instruction file, no duplicate` })}
<main class="main">${modebar('Live', '<span class="pill ok">' + ic('check', 13) + ' Saved</span>')}
<div class="doc"><div class="md">${DOC_AGENTS}</div></div>
</main>
<aside class="rail"><div class="rsec"><div class="rh">${ic('verified', 14)} Instruction files<span class="sp"></span><span class="pill ok">Healthy</span></div>
<div class="chk">${ic('check', 15, 'ok')}<div>One file, imported not copied<em>CLAUDE.md is a one-line <code>@AGENTS.md</code> import, so the two cannot drift</em></div></div>
<div class="chk">${ic('check', 15, 'ok')}<div>1,363 words, 9.4 KB<em>Under the 32 KiB cap Codex applies to this file</em></div></div>
<div class="chk">${ic('check', 15, 'ok')}<div>Setup commands present<em>Install, dev and verify all named</em></div></div>
<div class="chk">${ic('warning', 15)}<div>Two claims unverified since 10 Sep<em>Line 14 and line 31 name commands nobody has run this week. Check them</em></div></div></div>
<div class="rsec"><div class="rh">${ic('terminal', 14)} Agents that read this</div>
<div class="kit">${['Claude Code', 'Cursor', 'Codex', 'Jules', 'Copilot coding agent'].map(a => `<div class="file">${ic('check', 14, 'ok')}<span class="sp">${a}</span></div>`).join('')}</div>
<div style="font-size:11.5px;color:var(--muted);margin-top:8px">AGENTS.md is an open format used by over 60,000 projects. Nothing here is ours to invent.</div></div>
<div class="railfoot"><span class="btn ai">${ic('auto_awesome', 16)} Tidy this file</span>
<div class="credits">${ic('auto_awesome', 13)} 7 of 10 credits left <span class="meter"><i style="width:70%"></i></span></div></div>
</aside></div></div>`);

// S20 problems panel
screens['s20-problems'] = page('Problems', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body">
${tree({ projects: PROJECTS_MAIN })}
<main class="main">${modebar('Live', '<span class="pill">' + ic('warning', 13) + ' 5 problems</span>')}
<div class="doc"><div class="md">${DOC_BRIEF}</div></div>
</main>
<aside class="rail"><div class="rsec grow"><div class="rh">${ic('warning', 14)} Problems<span class="sp"></span><span class="pill">5</span></div>
<div class="prob"><i class="dot err"></i><div><b>Link goes nowhere</b><em>[[03-ARCHITECTURE]] does not exist in this project</em></div><span class="ln">L12</span></div>
<div class="prob"><i class="dot warn"></i><div><b>Heading level skips</b><em>H1 to H3 with no H2 between them</em></div><span class="ln">L28</span></div>
<div class="prob"><i class="dot warn"></i><div><b>Image has no alt text</b><em>Screen readers and exports will show nothing</em></div><span class="ln">L34</span></div>
<div class="prob"><i class="dot warn"></i><div><b>Table row has 4 cells, header has 3</b><em>It will render wrong on GitHub</em></div><span class="ln">L41</span></div>
<div class="prob"><i class="dot info"></i><div><b>Sentence is 68 words</b><em>Longer than anything else you have written. Split it, or add the "because" that earns it</em></div><span class="ln">L19</span></div>
<div style="font-size:11.5px;color:var(--muted);margin-top:10px">Structural checks run on this device and cost nothing. The writing note is advisory and never blocks.</div></div>
<div class="rrow">${ic('sell', 16)} Tags and bookmarks<span class="sp"></span><span class="cnt">4</span>${ic('chevron_right', 16)}</div>
<div class="rrow">${ic('format_list_bulleted', 16)} Outline<span class="sp"></span>${ic('chevron_right', 16)}</div>
<div class="railfoot"><div class="two"><span class="btn">${ic('check', 16)} Fix all safe</span><span class="btn">${ic('settings', 16)} Rules</span></div>
<span class="btn ai">${ic('auto_awesome', 16)} AI edit</span></div>
</aside></div></div>`);

// S21 idea mode with a drawing attached
screens['s21-idea-drawing'] = page('Idea with a drawing', `<div class="app">
${top({ tabs: [{ n: 'New blueprint', c: 'blue', on: 1 }] })}
<div class="body noright">
${tree({ projects: [{ n: 'Zephyrus booking', icon: 'rocket_launch', rows: [{ n: 'Blueprint, in progress', f: 1, on: 1 }] }, PROJECTS_MAIN[1]] })}
<main class="main"><div class="modebar"><span class="steps"><b>1 Describe</b> ${ic('chevron_right', 14)} 2 Decide ${ic('chevron_right', 14)} 3 Write ${ic('chevron_right', 14)} 4 Hand off</span><span class="right"><span class="pill ai">${ic('auto_awesome', 13)} 1 blueprint credit</span></span></div>
<div class="doc" style="padding:28px 48px"><div style="max-width:720px;margin:0 auto">
<div class="rh">Your idea</div>
<div class="aibox" style="margin:8px 0 0"><div class="in" style="height:auto;padding:12px;align-items:flex-start;color:var(--fg)">A booking page for small salons that take appointments on WhatsApp today. One link for the Instagram bio, a calendar of open slots, a UPI deposit, and a reminder the day before.</div>
<div class="attach"><span class="thumb"><svg viewBox="0 0 74 52" width="74" height="52"><rect x="5" y="6" width="28" height="14" rx="2" fill="none" stroke="var(--border-strong)"/><rect x="41" y="6" width="28" height="14" rx="2" fill="none" stroke="var(--border-strong)"/><rect x="5" y="28" width="64" height="18" rx="2" fill="none" stroke="var(--border-strong)"/><path d="M33 13 L41 13" stroke="var(--accent)" stroke-width="1.2"/><path d="M19 20 L19 28" stroke="var(--accent)" stroke-width="1.2"/></svg></span>
<span class="meta">booking-flow.excalidraw<em>Attached. The blueprint will describe these screens and name them in 05-FRONTEND-SPEC.</em></span>
<span class="sp" style="margin-left:auto"></span>${ic('close', 16)}</div>
<div class="chips" style="margin-top:12px"><span class="chip">${ic('image', 14)} Add a drawing or screenshot</span><span class="chip">${ic('description', 14)} Add a document</span><span class="chip">${ic('code', 14)} Point at a repository</span></div>
<div class="foot">${ic('auto_awesome', 12)} Drawings are read once, described in words, and never sent again.</div></div>
<div style="margin-top:22px"><span class="btn primary">Next: six decisions ${ic('arrow_forward', 16)}</span></div>
</div></div></main></div></div>`);

// S22 the map: how the preprocessing layer hangs together
const MAPNODES = [
  { n: '00-BRIEF', x: 386, y: 74, k: 'doc' },
  { n: '01-PRODUCT', x: 190, y: 176, k: 'doc' },
  { n: '02-DATA-AND-API', x: 386, y: 198, k: 'doc' },
  { n: '03-ARCHITECTURE', x: 600, y: 176, k: 'doc' },
  { n: 'specs/booking', x: 262, y: 318, k: 'spec' },
  { n: 'specs/payments', x: 470, y: 330, k: 'spec' },
  { n: '04-SETUP', x: 652, y: 306, k: 'doc' },
  { n: 'Deposit before booking', x: 120, y: 258, k: 'why' },
  { n: 'UPI, not cards', x: 578, y: 428, k: 'why' },
  { n: 'AGENTS.md', x: 386, y: 432, k: 'agent' },
];
const MAPEDGES = [[0, 1], [0, 2], [0, 3], [1, 4], [2, 4], [2, 5], [3, 6], [7, 1], [8, 5], [4, 9], [5, 9], [6, 9]];
const KCOL = { doc: 'var(--fg)', spec: 'var(--link)', why: 'var(--success)', agent: 'var(--accent)' };
screens['s22-map'] = page('The map', `<div class="app">
${top({ tabs: TABS_MAIN })}
<div class="body">
${tree({ projects: PROJECTS_MAIN, foot: `${ic('verified', 14)} 10 documents, 12 links, 0 orphans` })}
<main class="main">${modebar('Reading', '', '10 docs · 12 links · 0 orphans')}
<div class="doc" style="padding:20px 28px 0">
<svg viewBox="0 0 780 500" style="width:100%;height:100%;max-height:640px">
${MAPEDGES.map(([a, b]) => `<line x1="${MAPNODES[a].x}" y1="${MAPNODES[a].y}" x2="${MAPNODES[b].x}" y2="${MAPNODES[b].y}" stroke="var(--border-strong)" stroke-width="1.2"/>`).join('')}
${MAPNODES.map(n => {
  const w = Math.max(96, n.n.length * 7.2 + 26);
  return `<g><rect x="${n.x - w / 2}" y="${n.y - 14}" width="${w}" height="28" rx="7" fill="var(--bg)" stroke="${KCOL[n.k]}" stroke-width="${n.k === 'doc' ? 1.2 : 1}" opacity="${n.k === 'why' ? 0.9 : 1}"/>
  <text x="${n.x}" y="${n.y + 4}" text-anchor="middle" font-family="var(--font-sans)" font-size="11.5" fill="${n.k === 'doc' ? 'var(--fg)' : KCOL[n.k]}">${n.n}</text></g>`;
}).join('')}
</svg></div>
</main>
<aside class="rail"><div class="rsec"><div class="rh">${ic('link', 14)} The map<span class="sp"></span><span class="pill">v1</span></div>
<div style="font-size:12.5px;color:var(--fg-muted);margin-bottom:10px">What an agent reads before it writes anything: the documents, what each one governs, and the decision behind it.</div>
<div class="chk">${ic('description', 15)}<div>10 documents<em>Every one reachable from 00-BRIEF</em></div></div>
<div class="chk">${ic('link', 15)}<div>12 links, 0 orphans<em>Nothing in specs names an entity 02-DATA-AND-API does not define</em></div></div>
<div class="chk">${ic('check', 15, 'ok')}<div>2 decisions carried through<em>"Deposit before booking" and "UPI, not cards" each point at the spec they explain</em></div></div>
<div class="chk">${ic('code', 15)}<div>Rebuilt on every save<em>Structure is read from the files, so it costs no credits</em></div></div></div>
<div class="rsec"><div class="rh">${ic('terminal', 14)} In the kit</div>
<div class="kit">${[['MAP.md', 'Readable'], ['graph.json', 'For the agent']].map(f => `<div class="file">${ic('description', 14)}<span class="sp">${f[0]}</span><em class="hint">${f[1]}</em></div>`).join('')}</div>
<div style="font-size:11.5px;color:var(--muted);margin-top:8px">Both ship inside the blueprint, so the agent can ask "what governs payments" instead of reading all ten files.</div></div>
</aside></div></div>`);

for (const [name, html] of Object.entries(screens)) {
  fs.writeFileSync(path.join(HERE, name + '.html'), html);
}
console.log(Object.keys(screens).length, 'screens written to', HERE);
