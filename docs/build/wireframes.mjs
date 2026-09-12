// Low-fidelity screen wireframes for the product brief, as inline SVG.
//
//   node docs/build/wireframes.mjs > docs/_wireframes.md
//
// Inline SVG rather than image files: no binary dependency, renders the same in the
// PDF and in any markdown viewer, and a screen change shows as a readable line diff
// instead of an opaque blob.
//
// Fidelity is deliberately mid — enough to argue about structure and placement, not
// enough to argue about corner radii. Anatomy, not aesthetics.

const INK = '#14161a', LINE = '#8a93a3', FAINT = '#c9cfda', HAIR = '#e4e7ec'
const BLUE = '#1a5cff', WASH = '#f2f6ff', GREY = '#fafbfc', PANEL = '#f4f6fa'
const MACHINE = '#e3edff', MTEXT = '#a8c4f5'
const AI = '#efe7fd', AIB = '#7c4dff'

// The SVG lands INSIDE a paragraph, so remark treats it as inline HTML and parses
// inline markdown within it: `**GitHub App**` became `<strong>` inside a <text>
// element and broke the whole drawing. Every character that can start an inline
// construct becomes a numeric reference — same glyph, invisible to the parser.
const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/`/g, '&#96;').replace(/\*/g, '&#42;').replace(/_/g, '&#95;')
  .replace(/\[/g, '&#91;').replace(/\]/g, '&#93;')
const t = (x, y, s, o = {}) =>
  `<text x="${x}" y="${y}" font-family="${o.mono ? 'ui-monospace,monospace' : 'system-ui,-apple-system,sans-serif'}" ` +
  `font-size="${o.size || 8.5}" fill="${o.fill || INK}"${o.weight ? ` font-weight="${o.weight}"` : ''}` +
  `${o.anchor ? ` text-anchor="${o.anchor}"` : ''}>${esc(s)}</text>`
const r = (x, y, w, h, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.fill || 'none'}"` +
  `${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 1}"` : ''}` +
  `${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}${o.rx ? ` rx="${o.rx}"` : ''}/>`
const ln = (x1, y1, x2, y2, o = {}) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.stroke || HAIR}" stroke-width="${o.sw || 1}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`
/** Real prose, not grey bars. Placeholder bars read as an unfinished sketch; actual
 *  sentences let a reader judge line length, density and hierarchy — which is the
 *  whole reason to draw a screen before building it. */
const PROSE = [
  'We use the GitHub App installation flow rather than an OAuth app, because the App',
  'grants permission per repository instead of across the whole account.',
  'The installation token is scoped to the repositories the user selected and expires',
  'after one hour, which means a leaked token has a bounded blast radius.',
  'Refresh happens transparently on the next request; the user never sees it.',
  'If the installation is revoked the next call fails cleanly and we surface it once,',
  'rather than retrying silently and appearing broken.',
]
const prose = (x, y, w, n, o = {}) => {
  const size = o.size || 7.6, lh = o.lh || 11.5
  return Array.from({ length: n }, (_, i) =>
    t(x, y + i * lh, (o.lines || PROSE)[(o.from || 0) + i] || PROSE[i % PROSE.length],
      { size, fill: o.fill || '#3a4048' })).join('')
}
/** kept for dense thumbnails where real text would be illegible */
const bars = (x, y, w, n, gap = 8, o = {}) =>
  Array.from({ length: n }, (_, i) =>
    r(x, y + i * gap, i === n - 1 ? w * (o.last || 0.6) : w, 3, { fill: o.fill || HAIR })).join('')
const btn = (x, y, w, h, label, o = {}) =>
  r(x, y, w, h, { fill: o.fill || '#fff', stroke: o.stroke || FAINT, rx: 3 }) +
  t(x + w / 2, y + h / 2 + 3, label, { size: o.size || 7.5, anchor: 'middle', fill: o.tf || INK, weight: o.weight })

const out = []
const add = (id, name, note, w, h, body, caption) => out.push(
  `::exhibit ${id} | ${name}\n\n` +
  `<svg viewBox="0 0 ${w} ${h + 22}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${w}px;height:auto">` +
  r(1, 1, w - 2, h, { fill: '#fff', stroke: INK, sw: 1.5, rx: 4 }) + body +
  t(2, h + 17, note, { size: 7.5, fill: '#4a5160' }) + `</svg>\n\n${caption}\n`)

// ═══ W1 · the launcher ══════════════════════════════════════════════════════
{
  const W = 760, H = 430
  const cards = ['Blank\ndocument', 'Handover', 'Decision\nrecord', 'Spec', 'Changelog']
  add('W1', 'S0 · The launcher — what you see before a document is open',
    'Templates are markdown skeletons, not a gallery. Five, and they are the document types the research found actually recur.',
    W, H, [
      r(1, 1, W - 2, 34, { fill: GREY }), ln(1, 35, W - 1, 35, { stroke: FAINT }),
      btn(12, 9, 34, 18, 'fm', { fill: INK, tf: '#fff', weight: 700 }),
      r(56, 9, W - 190, 18, { fill: '#fff', stroke: FAINT, rx: 9 }),
      t(66, 22, '⌕  Search every document', { size: 8, fill: LINE }),
      btn(W - 126, 9, 46, 18, 'Open…'), btn(W - 72, 9, 60, 18, 'New', { fill: BLUE, stroke: BLUE, tf: '#fff', weight: 600 }),
      t(20, 60, 'START SOMETHING', { size: 7.5, weight: 700, fill: LINE }),
      ...cards.map((c, i) => {
        const x = 20 + i * 146, first = i === 0
        return r(x, 70, 132, 84, { fill: first ? WASH : '#fff', stroke: first ? BLUE : FAINT, rx: 4 }) +
          c.split('\n').map((s, j) => t(x + 14, 100 + j * 14, s, { size: 9.5, weight: 600, fill: first ? BLUE : INK })).join('') +
          t(x + 14, 142, first ? 'empty file' : 'markdown skeleton', { size: 7, fill: LINE })
      }),
      ln(20, 176, W - 20, 176, { stroke: FAINT }),
      t(20, 196, 'RECENT', { size: 7.5, weight: 700, fill: LINE }),
      t(W - 20, 196, 'unreviewed first  ▾', { size: 7.5, fill: BLUE, anchor: 'end' }),
      ...[['auth.md', 'specs', 64], ['0004-sync.md', 'adr', 88], ['pricing.md', 'notes', 31],
          ['billing.md', 'specs', 12], ['README.md', '', 0], ['0003-scope.md', 'adr', 45],
          ['onboarding.md', 'notes', 0], ['api.md', 'specs', 22]].map(([f, dir, pct], i) => {
        const x = 20 + (i % 4) * 182, y = 208 + Math.floor(i / 4) * 92
        return r(x, y, 168, 78, { fill: '#fff', stroke: FAINT, rx: 4 }) +
          t(x + 12, y + 20, f, { size: 9, weight: 600 }) +
          t(x + 12, y + 34, dir ? `${dir}/` : 'root', { size: 7.5, fill: LINE }) +
          bars(x + 12, y + 44, 144, 2, 7) +
          r(x + 12, y + 62, 144, 4, { fill: '#eceff4' }) +
          (pct ? r(x + 12, y + 62, 144 * pct / 100, 4, { fill: pct > 50 ? BLUE : MTEXT }) : '') +
          t(x + 12, y + 74, pct ? `${pct}% unreviewed` : 'all reviewed', { size: 7, fill: pct ? BLUE : '#0d8a4f' })
      }),
      r(1, H - 26, W - 2, 25, { fill: GREY }), ln(1, H - 26, W - 1, H - 26, { stroke: FAINT }),
      t(14, H - 10, '3 projects · 128 documents · 7 unreviewed', { size: 7.5, fill: LINE }),
      t(W - 14, H - 10, '⌘K commands   ⌘P files', { size: 7.5, fill: LINE, anchor: 'end' }),
    ].join(''),
    '**The bar at the bottom of every card is the product showing itself before you open anything.** Recent documents sort by unreviewed share, so the thing most likely to need you is first.')
}

// ═══ W2 · the editor, full anatomy ══════════════════════════════════════════
{
  const W = 900, H = 520
  const TREE = 176, RAIL = 176, MAIN = W - TREE - RAIL
  const tabs = [['auth.md', 1], ['0004-sync.md', 0], ['pricing.md', 0], ['README.md', 0]]
  add('W2', 'S2 · The editor — every region named',
    'Tabs across the top, project tree left, outline and tools right, AI at the bottom of the document rather than in a sidebar.',
    W, H, [
      // ── top bar
      r(1, 1, W - 2, 30, { fill: GREY }), ln(1, 31, W - 1, 31, { stroke: FAINT }),
      btn(10, 7, 28, 17, 'fm', { fill: INK, tf: '#fff', weight: 700 }),
      t(46, 19, '⌸  ⟲  ⟳', { size: 9, fill: LINE }),
      ...tabs.map(([n, on], i) => {
        const x = 92 + i * 116
        return r(x, 5, 108, 22, { fill: on ? '#fff' : 'transparent', stroke: on ? FAINT : 'transparent', rx: 3 }) +
          (on ? r(x, 5, 108, 2, { fill: BLUE }) : '') +
          t(x + 10, 20, n, { size: 8, weight: on ? 600 : null, fill: on ? INK : '#4a5160' }) +
          t(x + 98, 20, '×', { size: 8, fill: LINE, anchor: 'end' })
      }),
      r(W - 210, 7, 118, 17, { fill: '#fff', stroke: FAINT, rx: 9 }),
      t(W - 202, 20, '⌕ Search', { size: 7.5, fill: LINE }),
      btn(W - 84, 7, 30, 17, 'sh'), btn(W - 48, 7, 38, 17, 'Pf'),
      // ── left tree
      r(1, 32, TREE, H - 33, { fill: PANEL }), ln(TREE, 32, TREE, H - 1, { stroke: FAINT }),
      t(12, 50, '‹  TREE', { size: 7.5, weight: 700, fill: LINE }), btn(TREE - 46, 41, 34, 14, 'FP+'),
      ...(() => {
        const rows = [['p', 'product-docs'], ['d', 'adr'], ['f', '0003-scope.md'], ['f', '0004-sync.md'],
          ['d', 'specs'], ['f', 'auth.md', 1], ['f', 'billing.md'], ['d', 'notes'], ['f', 'pricing.md'],
          ['p', 'engine'], ['d', 'src'], ['f', 'splice.md'], ['p', 'website']]
        return rows.map(([k, n, sel], i) => {
          const y = 72 + i * 21
          const ind = k === 'p' ? 10 : k === 'd' ? 18 : 28
          return (sel ? r(6, y - 12, TREE - 12, 19, { fill: '#fff', stroke: BLUE, rx: 3 }) : '') +
            (k === 'p' ? r(0, y - 13, TREE, 21, { fill: '#eef1f6' }) : '') +
            (k === 'f' ? ln(23, y - 12, 23, y + 7, { stroke: FAINT }) : '') +
            t(ind, y + 2, (k === 'p' ? '' : k === 'd' ? '\u25be  ' : '') + n, {
              size: k === 'p' ? 7.6 : 8, weight: k === 'p' || sel ? 700 : null,
              fill: sel ? BLUE : k === 'p' ? '#2c3038' : '#3a4048' }) +
            (k === 'p' ? t(TREE - 14, y + 2, '+', { size: 10, anchor: 'end', fill: LINE }) : '')
        }).join('')
      })(),
      // ── mode bar
      r(TREE + 1, 32, MAIN, 28, { fill: '#fff' }), ln(TREE + 1, 60, TREE + MAIN, 60, { stroke: FAINT }),
      ...['Edit', 'Live', 'Split', 'Read'].map((m, i) => {
        const x = TREE + 10 + i * 52, on = m === 'Live'
        return r(x, 39, 48, 16, { fill: on ? BLUE : '#fff', stroke: on ? BLUE : FAINT, rx: 3 }) +
          t(x + 24, 50, m, { size: 7.5, anchor: 'middle', fill: on ? '#fff' : '#3a4048', weight: on ? 600 : null })
      }),
      ln(TREE + 224, 38, TREE + 224, 56, { stroke: FAINT }),
      t(TREE + 236, 50, 'B  I  “  ≡  ⌗  ⌗⌗  ⟨⟩  ⊞  ⛓  ☑', { size: 8.5, fill: '#4a5160' }),
      btn(TREE + MAIN - 34, 39, 26, 16, '↓'),
      // document body, LIVE mode — rendered, editable, real sentences
      t(TREE + 26, 96, 'Authentication', { size: 16, weight: 700 }),
      prose(TREE + 26, 118, MAIN - 62, 2),
      r(TREE + 20, 138, MAIN - 52, 30, { fill: MACHINE }),
      prose(TREE + 26, 151, MAIN - 62, 2, { from: 2, fill: '#2c4a86' }),
      t(TREE + MAIN - 28, 156, '\u25c6', { size: 7, fill: BLUE }),
      prose(TREE + 26, 186, MAIN - 62, 1, { from: 4 }),
      t(TREE + 26, 216, 'Scopes we request', { size: 11.5, weight: 700 }),
      ...(() => {
        const tx = TREE + 20, tw = MAIN - 52, c0 = 0.3
        return [r(tx, 228, tw, 62, { fill: '#fff', stroke: HAIR }),
          r(tx, 228, tw, 18, { fill: GREY }),
          ln(tx, 246, tx + tw, 246, { stroke: FAINT }),
          ln(tx + tw * c0, 228, tx + tw * c0, 290, { stroke: HAIR }),
          t(tx + 10, 241, 'scope', { size: 7, weight: 700, fill: LINE }),
          t(tx + tw * c0 + 10, 241, 'what it lets us do', { size: 7, weight: 700, fill: LINE }),
          t(tx + 10, 261, 'contents:read', { size: 7.4, mono: true }),
          t(tx + tw * c0 + 10, 261, 'read the file tree and file contents', { size: 7.4 }),
          ln(tx, 270, tx + tw, 270, { stroke: HAIR }),
          t(tx + 10, 283, 'contents:write', { size: 7.4, mono: true }),
          t(tx + tw * c0 + 10, 283, 'commit a splice, only when you ask', { size: 7.4 })].join('')
      })(),
      r(TREE + 20, 302, MAIN - 52, 42, { fill: '#f4f6fa', stroke: HAIR, rx: 3 }),
      t(TREE + 28, 318, 'gh api /repos/:owner/:repo/installation', { size: 7.4, mono: true, fill: '#2c3038' }),
      t(TREE + 28, 332, '  --jq .permissions', { size: 7.4, mono: true, fill: '#6b7280' }),
      prose(TREE + 26, 362, MAIN - 62, 2, { from: 5 }),
      // ── AI strip
      r(TREE + 14, H - 96, MAIN - 40, 58, { fill: AI, stroke: AIB, rx: 4 }),
      t(TREE + 28, H - 74, 'Ask, or select text and transform', { size: 8.5, fill: '#4a2a8a', weight: 600 }),
      r(TREE + 28, H - 66, MAIN - 130, 18, { fill: '#fff', stroke: '#c9b8f0', rx: 9 }),
      t(TREE + 36, H - 53, 'Document the token refresh flow…', { size: 7.5, fill: LINE }),
      btn(TREE + MAIN - 92, H - 66, 60, 18, 'Propose', { fill: AIB, stroke: AIB, tf: '#fff', weight: 600 }),
      t(TREE + 28, H - 26, 'Proposals arrive as marked spans. Nothing is written until you keep it.', { size: 7, fill: '#6b5a9a' }),
      // ── right rail
      r(W - RAIL, 32, RAIL - 1, H - 33, { fill: PANEL }), ln(W - RAIL, 32, W - RAIL, H - 1, { stroke: FAINT }),
      t(W - RAIL + 12, 50, 'OUTLINE', { size: 7.5, weight: 700, fill: LINE }),
      r(W - RAIL + 8, 58, RAIL - 18, 178, { fill: WASH, stroke: FAINT, rx: 3 }),
      ...['Authentication', '  The GitHub App', '  Scopes', '  Token refresh', 'Sessions', '  Expiry', 'Open questions']
        .map((h, i) => t(W - RAIL + 18, 78 + i * 22, h, { size: 7.5, weight: h.startsWith(' ') ? null : 600,
          fill: i === 3 ? BLUE : '#3a4048' })),
      ...[['Tags & bookmarks', 0], ['Document history', 0], ['Comments', 2]].map(([l, n], i) =>
        r(W - RAIL + 8, 248 + i * 26, RAIL - 18, 20, { fill: '#fff', stroke: FAINT, rx: 3 }) +
        t(W - RAIL + 18, 262 + i * 26, l, { size: 7.5 }) +
        t(W - 14, 262 + i * 26, n ? `${n}  ›` : '›', { size: 7.5, anchor: 'end', fill: n ? BLUE : LINE })),
      btn(W - RAIL + 8, 332, 74, 20, 'Add file'), btn(W - RAIL + 88, 332, 80, 20, 'Shortcuts'),
      r(W - RAIL + 8, 362, RAIL - 18, 26, { fill: AI, stroke: AIB, rx: 3 }),
      t(W - RAIL + 88, 379, 'AI edit', { size: 9, anchor: 'middle', weight: 700, fill: '#4a2a8a' }),
      r(W - RAIL + 8, 396, RAIL - 18, 60, { fill: '#fff', stroke: FAINT, rx: 3 }),
      t(W - RAIL + 18, 412, 'UNREVIEWED', { size: 7, weight: 700, fill: LINE }),
      t(W - RAIL + 18, 432, '2', { size: 18, weight: 700, fill: BLUE }),
      t(W - RAIL + 44, 432, 'spans in this file', { size: 7, fill: '#4a5160' }),
      t(W - RAIL + 18, 448, 'Review them  ›', { size: 7.5, fill: BLUE }),
      // ── status bar
      r(TREE + 1, H - 26, W - TREE - RAIL, 25, { fill: GREY }), ln(TREE, H - 26, W - RAIL, H - 26, { stroke: FAINT }),
      t(TREE + 12, H - 10, '2,140 words · Ln 84, Col 12', { size: 7.5, fill: LINE }),
      t(W - RAIL - 12, H - 10, 'main ✓ · saved', { size: 7.5, fill: '#0d8a4f', anchor: 'end' }),
    ].join(''),
    '**The AI strip sits under the document, not in a sidebar.** A sidebar makes AI a separate place you go; under the document it is a thing you do to what you are looking at. It collapses to one line when idle.')
}

// ═══ W3 · the four modes ════════════════════════════════════════════════════
{
  const W = 900, H = 330, w = (W - 50) / 4
  const panel = (i, title, sub, inner) => {
    const x = 12 + i * (w + 8)
    return r(x, 44, w, H - 60, { fill: '#fff', stroke: i === 1 ? BLUE : FAINT, sw: i === 1 ? 1.4 : 1, rx: 3 }) +
      r(x, 44, w, 22, { fill: i === 1 ? BLUE : GREY }) +
      t(x + 10, 59, title, { size: 8.5, weight: 700, fill: i === 1 ? '#fff' : INK }) +
      t(x + w - 10, 59, sub, { size: 7, anchor: 'end', fill: i === 1 ? '#cfe0ff' : LINE }) + inner(x)
  }
  add('W3', 'The four modes — how the same file looks in each',
    'One file, four projections. Nothing about the bytes on disk changes between them.',
    W, H, [
      t(12, 26, 'Edit \\ Live \\ Split \\ Read — the same document, four ways of looking at it', { size: 9.5, weight: 600 }),
      panel(0, 'Edit', 'raw', (x) => [
        t(x + 10, 86, '# Authentication', { size: 7.5, mono: true, fill: BLUE }),
        t(x + 10, 102, '', { size: 7.5 }),
        t(x + 10, 114, 'We use the **GitHub App**', { size: 7.5, mono: true }),
        t(x + 10, 128, 'flow, not OAuth.', { size: 7.5, mono: true }),
        t(x + 10, 152, '## Scopes', { size: 7.5, mono: true, fill: BLUE }),
        t(x + 10, 170, '| scope | why |', { size: 7.5, mono: true, fill: '#3a4048' }),
        t(x + 10, 182, '|---|---|', { size: 7.5, mono: true, fill: LINE }),
        t(x + 10, 194, '| read | tree |', { size: 7.5, mono: true, fill: '#3a4048' }),
        t(x + 10, 218, '```bash', { size: 7.5, mono: true, fill: LINE }),
        t(x + 10, 230, 'gh api /repos', { size: 7.5, mono: true, fill: '#3a4048' }),
        t(x + 10, 242, '```', { size: 7.5, mono: true, fill: LINE }),
        t(x + 10, 272, 'Every character', { size: 7, fill: LINE }),
        t(x + 10, 284, 'you typed.', { size: 7, fill: LINE }),
      ].join('')),
      panel(1, 'Live', 'default', (x) => [
        t(x + 10, 88, 'Authentication', { size: 12, weight: 700 }),
        bars(x + 10, 100, w - 24, 2, 8),
        r(x + 6, 122, w - 12, 26, { fill: MACHINE }),
        bars(x + 10, 130, w - 24, 2, 8, { fill: MTEXT }),
        t(x + 10, 168, 'Scopes', { size: 9.5, weight: 700 }),
        r(x + 6, 178, w - 12, 34, { fill: GREY, stroke: HAIR }),
        ln(x + 6, 190, x + w - 6, 190, { stroke: FAINT }),
        t(x + 12, 187, 'scope', { size: 6.5, weight: 600, fill: LINE }),
        t(x + 12, 204, 'read', { size: 6.5 }),
        r(x + 6, 220, w - 12, 26, { fill: '#f4f6fa', stroke: HAIR }),
        t(x + 12, 236, 'gh api /repos', { size: 6.5, mono: true }),
        t(x + 10, 272, 'Rendered, and', { size: 7, fill: BLUE }),
        t(x + 10, 284, 'still editable.', { size: 7, fill: BLUE }),
      ].join('')),
      panel(2, 'Split', 'both', (x) => [
        ln(x + w / 2, 66, x + w / 2, H - 16, { stroke: FAINT, dash: '3 2' }),
        t(x + 8, 84, '# Authentication', { size: 6, mono: true, fill: BLUE }),
        t(x + 8, 98, 'We use the', { size: 6, mono: true }),
        t(x + 8, 110, '**GitHub App**', { size: 6, mono: true }),
        t(x + 8, 130, '## Scopes', { size: 6, mono: true, fill: BLUE }),
        t(x + 8, 148, '| scope |', { size: 6, mono: true, fill: '#3a4048' }),
        t(x + w / 2 + 8, 86, 'Authentication', { size: 8.5, weight: 700 }),
        bars(x + w / 2 + 8, 96, w / 2 - 18, 2, 7),
        t(x + w / 2 + 8, 132, 'Scopes', { size: 7.5, weight: 700 }),
        r(x + w / 2 + 6, 140, w / 2 - 14, 22, { fill: GREY, stroke: HAIR }),
        t(x + 8, 262, 'Source left,', { size: 7, fill: LINE }),
        t(x + 8, 274, 'result right,', { size: 7, fill: LINE }),
        t(x + 8, 286, 'scroll-locked.', { size: 7, fill: LINE }),
      ].join('')),
      panel(3, 'Read', 'clean', (x) => [
        t(x + 12, 92, 'Authentication', { size: 12, weight: 700 }),
        bars(x + 12, 106, w - 28, 3, 9),
        t(x + 12, 152, 'Scopes', { size: 9.5, weight: 700 }),
        bars(x + 12, 164, w - 28, 2, 9),
        r(x + 8, 190, w - 16, 32, { fill: GREY, stroke: HAIR }),
        bars(x + 12, 236, w - 28, 3, 9),
        t(x + 12, 272, 'No cursor, no', { size: 7, fill: LINE }),
        t(x + 12, 284, 'chrome. Print', { size: 7, fill: LINE }),
        t(x + 12, 296, 'from here.', { size: 7, fill: LINE }),
      ].join('')),
    ].join(''),
    '**Live is the default and the one that matters.** Edit is for when the markdown itself is the thing you are working on. Split is for learning the syntax or checking a render. Read is for review and printing. Provenance tinting shows in Live, Split and Read — it is information about the document, not about the source.')
}

// ═══ W4 · provenance interaction ════════════════════════════════════════════
{
  const W = 820, H = 300
  add('W4', 'S3 · The provenance panel — the interaction nothing else can do',
    'Hover only, after a delay, dismissible with Escape.',
    W, H, [
      prose(40, 44, 720, 2),
      r(36, 66, 728, 30, { fill: MACHINE }), prose(40, 80, 714, 2, { from: 2, fill: '#2c4a86' }),
      r(150, 106, 460, 132, { fill: '#fff', stroke: INK, sw: 1.2, rx: 4 }),
      r(150, 106, 460, 26, { fill: WASH }), ln(150, 132, 610, 132, { stroke: FAINT }),
      t(164, 124, 'Written by claude-opus-5', { size: 9, weight: 700, fill: BLUE }),
      t(596, 124, '✕', { size: 9, anchor: 'end', fill: LINE }),
      t(164, 152, 'PROMPT', { size: 7, weight: 700, fill: LINE }),
      t(164, 168, '"Document the token refresh flow and note the 8-hour', { size: 8.5 }),
      t(164, 182, ' expiry we settled on."', { size: 8.5 }),
      t(164, 204, 'Tue 09:14  ·  312 bytes  ·  not reviewed  ·  span 4 of 6', { size: 8, fill: '#4a5160' }),
      btn(164, 212, 122, 19, 'Keep — mark reviewed', { fill: BLUE, stroke: BLUE, tf: '#fff', weight: 600, size: 7.5 }),
      btn(294, 212, 74, 19, 'Revert  ⌘Z'), btn(376, 212, 92, 19, 'Show the diff'),
      t(478, 226, 'Next span  ⇥', { size: 7.5, fill: BLUE }),
      prose(40, 262, 720, 2, { from: 5 }),
    ].join(''),
    '**"Show the diff" is the trust control.** A sceptical user clicks it once, sees that only those bytes differ, and never clicks it again. That single interaction is what converts the claim into belief.')
}

// ═══ W5 · review drawer + AI proposal ═══════════════════════════════════════
{
  const W = 900, H = 380, RAIL = 300
  add('W5', 'S4 · The review drawer, and an AI proposal arriving',
    'Left: the document with a proposal in place. Right: everything waiting for you.',
    W, H, [
      r(1, 1, W - 2, 26, { fill: GREY }), ln(1, 27, W - 1, 27, { stroke: FAINT }),
      t(12, 18, 'specs / auth.md', { size: 8, fill: '#4a5160' }),
      t(W - RAIL - 12, 18, 'Live', { size: 7.5, anchor: 'end', fill: BLUE, weight: 600 }),
      prose(28, 60, W - RAIL - 60, 3),
      r(24, 96, W - RAIL - 52, 44, { fill: AI, stroke: AIB, rx: 3 }),
      t(34, 112, 'PROPOSED — not written', { size: 7, weight: 700, fill: '#4a2a8a' }),
      prose(34, 122, W - RAIL - 76, 2, { from: 3, fill: '#5a3a9a' }),
      btn(34, 142, 54, 16, 'Keep', { fill: AIB, stroke: AIB, tf: '#fff', weight: 600, size: 7 }),
      btn(94, 142, 54, 16, 'Discard', { size: 7 }),
      t(158, 154, 'nothing has touched the file yet', { size: 7, fill: '#6b5a9a' }),
      prose(28, 182, W - RAIL - 60, 2, { from: 5 }),
      r(24, 208, W - RAIL - 52, 30, { fill: MACHINE }), prose(34, 222, W - RAIL - 76, 2, { from: 2, fill: '#2c4a86' }),
      prose(28, 258, W - RAIL - 60, 3, { from: 1 }),
      r(W - RAIL, 27, RAIL - 1, H - 28, { fill: PANEL }), ln(W - RAIL, 27, W - RAIL, H - 1, { stroke: FAINT }),
      t(W - RAIL + 14, 50, 'UNREVIEWED IN THIS FILE', { size: 7, weight: 700, fill: LINE }),
      t(W - 16, 52, '4', { size: 13, weight: 700, fill: BLUE, anchor: 'end' }),
      ...[['"Document the token refresh…"', 1], ['"Add the rate-limit note"', 0],
          ['"Clarify the scope wording"', 0], ['"List the error codes"', 0]].map(([q, on], i) => {
        const y = 66 + i * 68
        return r(W - RAIL + 10, y, RAIL - 26, 58, { fill: '#fff', stroke: on ? BLUE : FAINT, sw: on ? 1.4 : 1, rx: 3 }) +
          t(W - RAIL + 20, y + 17, q, { size: 8, weight: on ? 600 : null }) +
          t(W - RAIL + 20, y + 31, 'claude-opus-5 · 312 B · Tue 09:14', { size: 7, fill: '#4a5160' }) +
          btn(W - RAIL + 20, y + 38, 46, 14, 'Keep', { fill: on ? BLUE : '#fff', stroke: on ? BLUE : FAINT, tf: on ? '#fff' : INK, size: 7 }) +
          btn(W - RAIL + 72, y + 38, 46, 14, 'Revert', { size: 7 }) +
          t(W - RAIL + 128, y + 48, 'Go to  ›', { size: 7, fill: BLUE })
      }),
      ln(W - RAIL + 10, H - 46, W - 16, H - 46, { stroke: FAINT }),
      t(W - RAIL + 14, H - 28, 'j / k move    a keep    r revert    ⇧A keep all', { size: 7, fill: LINE }),
      t(W - RAIL + 14, H - 12, 'Keeping does not change bytes — only the review flag.', { size: 7, fill: '#0d8a4f' }),
    ].join(''),
    '**Two states that look similar and are not.** Purple is *proposed* and has not touched the file. Blue is *written but unreviewed* — the bytes are on disk, nobody has read them. Keeping a blue span changes no bytes at all; it only flips a flag.')
}

// ═══ W6 · refactor ══════════════════════════════════════════════════════════
{
  const W = 820, H = 380
  add('W6', 'S8 · Refactor preview — the engine made visible',
    'Rename once; every file that would change is a reviewable hunk.',
    W, H, [
      r(1, 1, W - 2, 34, { fill: WASH }), ln(1, 35, W - 1, 35, { stroke: FAINT }),
      t(14, 16, 'RENAME HEADING', { size: 7, weight: 700, fill: LINE }),
      t(14, 28, '"Token refresh"  →  "Refreshing tokens"', { size: 9.5, weight: 600 }),
      t(W - 14, 24, '11 files · 14 changes · 2 refused', { size: 8, fill: BLUE, anchor: 'end' }),
      ...[['specs/auth.md', 3], ['adr/0003-auth-scope.md', 2], ['README.md', 1], ['notes/auth-questions.md', 4]]
        .map(([f, n], i) => {
          const y = 46 + i * 56
          return r(12, y, W - 24, 48, { fill: '#fff', stroke: FAINT, rx: 3 }) +
            t(24, y + 17, f, { size: 8.5, weight: 600 }) +
            t(180, y + 17, `${n} change${n > 1 ? 's' : ''}`, { size: 7.5, fill: LINE }) +
            t(24, y + 32, '−', { size: 8, fill: '#a51c1c' }) + r(34, y + 28, 380, 4, { fill: '#fde0e0' }) +
            t(24, y + 42, '+', { size: 8, fill: '#0d6b3f' }) + r(34, y + 38, 360, 4, { fill: '#d9f2e3' }) +
            btn(W - 168, y + 14, 56, 18, 'Accept', { fill: BLUE, stroke: BLUE, tf: '#fff', weight: 600 }) +
            btn(W - 106, y + 14, 46, 18, 'Skip') + t(W - 50, y + 27, 'View ›', { size: 7.5, fill: BLUE })
        }),
      r(12, 274, W - 24, 54, { fill: '#fffbf0', stroke: '#b8860b', sw: 1.2, rx: 3 }),
      t(24, 292, 'REFUSED — 2 files', { size: 8, weight: 700, fill: '#8a5a06' }),
      t(24, 308, 'drafts/old-auth.md — the heading appears twice; we cannot tell which one you meant.', { size: 7.5, fill: '#8a5a06' }),
      t(24, 320, 'archive/2024.md — inside a code fence. Changing it would alter an example.', { size: 7.5, fill: '#8a5a06' }),
      btn(12, H - 34, 128, 22, 'Apply 12 changes', { fill: BLUE, stroke: BLUE, tf: '#fff', weight: 600, size: 8 }),
      btn(148, H - 34, 60, 22, 'Cancel'),
      t(220, H - 19, 'Nothing else in any file will change. Reversible as one commit.', { size: 7.5, fill: '#4a5160' }),
    ].join(''),
    '**The amber box is the feature, not the failure.** A competitor silently renames both and you find out later. We stop, name the file, and say exactly why — which is the entire product argument in one panel.')
}

// ═══ W7 · team ══════════════════════════════════════════════════════════════
{
  const W = 820, H = 340
  add('W7', 'S10 · Team view — the only screen behind the paywall',
    'One repo, everyone, and what nobody has read.',
    W, H, [
      r(1, 1, W - 2, 30, { fill: GREY }), ln(1, 31, W - 1, 31, { stroke: FAINT }),
      t(14, 20, 'product-docs · Team', { size: 9.5, weight: 700 }),
      t(W - 14, 20, '4 seats · $8/seat', { size: 8, fill: LINE, anchor: 'end' }),
      ...[['7', 'documents nobody has reviewed'], ['18%', 'of all text is unread machine output'],
          ['42', 'spans reviewed this week']].map(([v, l], i) => {
        const x = 14 + i * 266
        return r(x, 44, 252, 56, { fill: '#fff', stroke: FAINT, rx: 3 }) +
          t(x + 14, 72, v, { size: 18, weight: 700, fill: BLUE }) +
          t(x + 14, 88, l, { size: 7.5, fill: '#4a5160' })
      }),
      t(14, 122, 'DOCUMENTS', { size: 7, weight: 700, fill: LINE }),
      t(W - 14, 122, 'sorted by risk  ▾', { size: 7.5, fill: BLUE, anchor: 'end' }),
      ...[['adr/0004-sync.md', 'Sagnik', 88, 'nobody'], ['specs/auth.md', 'Sagnik', 64, 'nobody'],
          ['notes/pricing.md', 'Amit', 31, 'partly'], ['specs/billing.md', 'Amit', 12, 'Sagnik'],
          ['README.md', 'Amit', 0, 'Sagnik']].map(([f, who, pct, rev], i) => {
        const y = 134 + i * 32
        return r(14, y, W - 28, 26, { fill: '#fff', stroke: FAINT, rx: 3 }) +
          t(26, y + 17, f, { size: 8.5 }) + t(190, y + 17, who, { size: 8, fill: '#4a5160' }) +
          r(280, y + 10, 130, 5, { fill: '#eceff4' }) +
          (pct ? r(280, y + 10, 130 * pct / 100, 5, { fill: pct > 50 ? BLUE : MTEXT }) : '') +
          t(422, y + 17, `${pct}% machine`, { size: 7.5, fill: LINE }) +
          t(W - 26, y + 17, rev === 'nobody' ? 'unread' : `read by ${rev}`, {
            size: 7.5, anchor: 'end', fill: rev === 'nobody' ? '#a51c1c' : rev === 'partly' ? '#8a5a06' : '#0d8a4f' })
      }),
      r(14, H - 44, W - 28, 30, { fill: WASH, stroke: BLUE, rx: 3 }),
      t(26, H - 25, 'Machine-written and nobody has read it  —  7 documents, 3 of them decisions', { size: 8, fill: BLUE, weight: 600 }),
    ].join(''),
    '**The blue bar is why a team lead opens this screen.** Not the numbers at the top — the filter that says which decisions were written by a machine and never read by a human.')
}

// ═══ W8 · overlays + settings ═══════════════════════════════════════════════
{
  const W = 900, H = 300
  add('W8', 'S5, S6, S11 · Quick switch, command palette, settings',
    'Two overlays and one page. Escape always returns you to the document.',
    W, H, [
      ...[['⌘P  Quick switch', ['specs/auth.md', 'adr/0003-auth-scope.md', 'notes/auth-questions.md'], 'auth'],
          ['⌘K  Commands', ['Rename heading across vault', 'Review unreviewed spans', 'Switch to Split'], 'ren']]
        .map(([title, items, q], i) => {
          const x = 12 + i * 296
          return r(x, 34, 282, H - 60, { fill: GREY, stroke: FAINT, dash: '4 3', rx: 3 }) +
            t(x + 12, 52, title, { size: 8, weight: 700, fill: LINE }) +
            r(x + 10, 62, 262, 176, { fill: '#fff', stroke: INK, sw: 1.2, rx: 3 }) +
            t(x + 24, 84, q, { size: 9.5 }) + r(x + 24, 88, 30, 1, { fill: BLUE }) +
            ln(x + 10, 96, x + 272, 96, { stroke: FAINT }) +
            items.map((it, j) =>
              (j === 0 ? r(x + 10, 100 + j * 30, 262, 30, { fill: WASH }) : '') +
              t(x + 24, 120 + j * 30, it, { size: 8, fill: j === 0 ? BLUE : INK, weight: j === 0 ? 600 : null })).join('')
        }),
      r(604, 34, W - 616, H - 60, { fill: '#fff', stroke: INK, sw: 1.2, rx: 3 }),
      r(604, 34, W - 616, 24, { fill: GREY }), ln(604, 58, W - 12, 58, { stroke: FAINT }),
      t(616, 50, 'S11 · Settings — one page', { size: 8, weight: 700 }),
      ...[['Appearance', 'theme, font size'], ['Keyboard', 'keymap, vim mode'],
          ['AI provider', 'Anthropic · key stored locally'], ['Provenance', 'show spans  ●━'],
          ['Git identity', 'name, email, signing'], ['About', 'version, licence']]
        .map(([g, s], i) => {
          const y = 76 + i * 34
          return t(616, y, g, { size: 8.5, weight: 600 }) +
            t(616, y + 12, s, { size: 7, fill: '#4a5160' }) +
            ln(616, y + 20, W - 24, y + 20, { stroke: HAIR })
        }),
    ].join(''),
    '**Settings is one page with six groups and no tabs.** Every toggle we add is a decision we failed to make, so the page staying short is a design constraint rather than an aspiration.')
}

// ═══ W9 · the screen map ════════════════════════════════════════════════════
{
  const W = 860, H = 420
  const box = (x, y, w, h, id, label, o = {}) =>
    r(x, y, w, h, { fill: o.fill || '#fff', stroke: o.stroke || INK, sw: o.sw || 1.2, rx: 4 }) +
    t(x + 10, y + 17, id, { size: 7.5, weight: 700, fill: o.idf || BLUE }) +
    t(x + 10, y + 32, label, { size: 8.5, weight: 600, fill: o.tf || INK }) +
    (o.sub ? t(x + 10, y + 46, o.sub, { size: 7, fill: LINE }) : '')
  const arrow = (x1, y1, x2, y2, label, o = {}) =>
    ln(x1, y1, x2, y2, { stroke: o.stroke || LINE, sw: 1.2, dash: o.dash }) +
    (label ? t((x1 + x2) / 2, (y1 + y2) / 2 - 4, label, { size: 6.5, anchor: 'middle', fill: o.stroke || LINE }) : '')
  add('W9', 'How the screens connect',
    'Everything returns to the editor. Escape never loses work.',
    W, H, [
      box(20, 30, 150, 56, 'S0', 'Launcher', { sub: 'templates + recent' }),
      box(340, 170, 180, 70, 'S2', 'The editor', { fill: WASH, stroke: BLUE, sw: 2, sub: 'Edit / Live / Split / Read' }),
      box(20, 170, 150, 56, 'S1', 'Open a folder', { sub: 'first run only' }),
      box(20, 300, 150, 56, 'S5 · S6', 'Switch / palette', { sub: '⌘P   ⌘K' }),
      box(340, 30, 180, 56, 'S3', 'Provenance panel', { sub: 'on hover' }),
      box(340, 310, 180, 56, 'S7', 'Search', { sub: 'vault-wide' }),
      box(620, 30, 200, 56, 'S4', 'Review drawer', { sub: 'everything unreviewed' }),
      box(620, 120, 200, 56, 'S8', 'Refactor preview', { sub: 'rename → hunks' }),
      box(620, 210, 200, 56, 'S9', 'Conflict', { stroke: '#a51c1c', idf: '#a51c1c', sub: 'the only blocking modal' }),
      box(620, 300, 200, 56, 'S10', 'Team view', { fill: '#f1faf5', stroke: '#0d8a4f', idf: '#0d8a4f', sub: 'paid' }),
      arrow(170, 58, 340, 62, 'open'),
      arrow(170, 198, 340, 200, 'first run'),
      arrow(170, 320, 340, 224, '⌘P ⌘K'),
      arrow(430, 170, 430, 86, 'hover'),
      arrow(430, 240, 430, 310, '⌘⇧F'),
      arrow(520, 190, 620, 70, 'unreviewed'),
      arrow(520, 200, 620, 148, 'rename'),
      arrow(520, 215, 620, 238, 'divergence', { stroke: '#a51c1c' }),
      arrow(620, 328, 520, 228, 'open a doc', { stroke: '#0d8a4f', dash: '4 3' }),
      r(20, H - 46, W - 40, 34, { fill: GREY, stroke: FAINT, rx: 3 }),
      t(32, H - 26, 'Three rules:  everything returns to S2  ·  Escape goes back one step and never loses work  ·  no modal blocks the document except S9', { size: 8, fill: '#3a4048' }),
    ].join(''),
    '**S2 is the only destination.** Every other screen is a detour that hands you back to the document — which is why there is no navigation chrome, no breadcrumbs beyond the file path, and no back button.')
}

// ═══ W10 · generate a site ══════════════════════════════════════════════════
{
  const W = 860, H = 400
  add('W10', 'S12 \u00b7 Generate — a site, a page, or a deck from the folder you already have',
    'Static output, generated locally. We hand you files; you choose where they live.',
    W, H, [
      r(1, 1, W - 2, 32, { fill: GREY }), ln(1, 33, W - 1, 33, { stroke: FAINT }),
      t(14, 21, 'Generate from  product-docs', { size: 9.5, weight: 700 }),
      t(W - 14, 21, '128 documents \u00b7 3 projects', { size: 8, fill: LINE, anchor: 'end' }),
      t(16, 52, 'OUTPUT', { size: 7, weight: 700, fill: LINE }),
      ...[['Static site', 'the whole folder, tree as navigation', 1],
          ['Single page', 'one document, one file to send', 0],
          ['Slide deck', 'H2 becomes a slide', 0],
          ['One-page brief', 'document plus its frontmatter', 0]].map(([n2, sub, on], i) => {
        const x = 16 + i * 206
        return r(x, 60, 194, 62, { fill: on ? WASH : '#fff', stroke: on ? BLUE : FAINT, rx: 4 }) +
          t(x + 12, 82, n2, { size: 9, weight: 600, fill: on ? BLUE : INK }) +
          t(x + 12, 98, sub, { size: 7, fill: LINE }) +
          t(x + 12, 113, on ? 'selected' : '', { size: 7, fill: BLUE })
      }),
      t(16, 148, 'WHAT GOES IN', { size: 7, weight: 700, fill: LINE }),
      r(16, 156, 410, 118, { fill: '#fff', stroke: FAINT, rx: 3 }),
      ...[['product-docs', 1, 0], ['  adr  (4 files)', 1, 1], ['  specs  (6 files)', 1, 1],
          ['  notes  (9 files)', 0, 1], ['  drafts  (3 files)', 0, 1]].map(([n2, on, ind], i) => {
        const y = 176 + i * 21
        return r(28 + ind * 14, y - 8, 10, 10, { fill: on ? BLUE : '#fff', stroke: on ? BLUE : LINE, rx: 2 }) +
          (on ? t(30 + ind * 14, y + 1, '\u2713', { size: 7, fill: '#fff' }) : '') +
          t(46 + ind * 14, y + 1, n2, { size: 8, weight: ind ? null : 600 })
      }),
      t(28, 264, '13 of 22 documents \u00b7 drafts excluded by default', { size: 7, fill: LINE }),
      t(444, 148, 'PREVIEW', { size: 7, weight: 700, fill: LINE }),
      r(444, 156, W - 460, 118, { fill: '#fff', stroke: FAINT, rx: 3 }),
      r(444, 156, W - 460, 20, { fill: GREY }), ln(444, 176, W - 16, 176, { stroke: FAINT }),
      t(456, 170, 'product-docs', { size: 7.5, weight: 700 }),
      t(W - 26, 170, 'Home   Decisions   Specs', { size: 7, fill: LINE, anchor: 'end' }),
      r(444, 176, 96, 98, { fill: '#fcfdff' }), ln(540, 176, 540, 274, { stroke: HAIR }),
      ...['Decisions', '  Sync', '  Engine', 'Specs', '  Auth'].map((n2, i) =>
        t(454, 194 + i * 16, n2, { size: 6.8, fill: i === 4 ? BLUE : '#3a4048' })),
      t(552, 198, 'Authentication', { size: 10, weight: 700 }),
      prose(552, 216, 280, 3, { size: 6.4, lh: 9 }),
      r(552, 248, 286, 18, { fill: '#f4f6fa', stroke: HAIR }),
      t(560, 260, 'gh api /repos/:owner/:repo', { size: 6.2, mono: true, fill: '#3a4048' }),
      r(16, 292, W - 32, 56, { fill: PANEL, stroke: FAINT, rx: 3 }),
      t(28, 310, 'WHERE IT GOES', { size: 7, weight: 700, fill: LINE }),
      ...[['A folder on disk', 1], ['GitHub Pages', 0], ['Vercel', 0], ['Netlify', 0]].map(([n2, on], i) =>
        btn(28 + i * 116, 318, 106, 20, n2, { fill: on ? BLUE : '#fff', stroke: on ? BLUE : FAINT,
          tf: on ? '#fff' : INK, weight: on ? 600 : null, size: 7.5 })),
      t(500, 332, 'Your account, your domain. We never host it.', { size: 7.5, fill: '#4a5160' }),
      btn(16, H - 34, 132, 24, 'Generate', { fill: BLUE, stroke: BLUE, tf: '#fff', weight: 700, size: 8.5 }),
      t(160, H - 18, 'Runs locally. No network, no model, no upload.', { size: 7.5, fill: '#0d8a4f' }),
    ].join(''),
    '**A site is another projection of the same file.** There is no site editor and no theme builder — those would each need their own state, and state is what the architecture forbids. Edits happen in the markdown; the site is regenerated.')
}

console.log(out.join('\n'))
