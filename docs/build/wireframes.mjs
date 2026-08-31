// Generate the low-fidelity screen wireframes for the product brief.
//
//   node docs/build/wireframes.mjs > docs/_wireframes.md
//
// Inline SVG rather than an image file, for three reasons: it stays in the markdown
// so the brief has no binary dependency, it renders identically in the PDF and in any
// markdown viewer, and it is diffable — a change to a screen shows up as a readable
// line change rather than an opaque blob.
//
// Deliberately low fidelity. These say what goes where and what talks to what. They
// do not say what anything looks like; that decision belongs to a design pass with
// the real system, and pretending otherwise in a plan invites bikeshedding about
// corner radii instead of argument about structure.

const W = 720, H = 400
const INK = '#14161a', LINE = '#8a93a3', FAINT = '#c9cfda'
const BLUE = '#1a5cff', WASH = '#f2f6ff', GREY = '#fafbfc', MACHINE = '#e3edff'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const t = (x, y, s, o = {}) =>
  `<text x="${x}" y="${y}" font-family="system-ui,sans-serif" font-size="${o.size || 9}" ` +
  `fill="${o.fill || INK}" ${o.weight ? `font-weight="${o.weight}"` : ''} ` +
  `${o.anchor ? `text-anchor="${o.anchor}"` : ''}>${esc(s)}</text>`
const r = (x, y, w, h, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.fill || 'none'}" ` +
  `stroke="${o.stroke || LINE}" stroke-width="${o.sw || 1}" ` +
  `${o.dash ? `stroke-dasharray="${o.dash}"` : ''} ${o.rx ? `rx="${o.rx}"` : ''}/>`
/** a run of grey bars standing in for body text */
const lines = (x, y, w, n, gap = 9, o = {}) =>
  Array.from({ length: n }, (_, i) =>
    r(x, y + i * gap, i === n - 1 ? w * 0.62 : w, 3.5, { fill: o.fill || FAINT, stroke: 'none' })).join('')
const frame = (title, body, note) => `
<svg viewBox="0 0 ${W} ${H + 26}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${W}px;height:auto">
  ${r(1, 1, W - 2, H, { stroke: INK, sw: 1.5, fill: '#fff' })}
  ${body}
  ${t(2, H + 20, note || '', { size: 8.5, fill: '#4a5160' })}
</svg>`

const out = []
const add = (id, name, caption, svg, note) => out.push(
  `::exhibit ${id} | ${name}\n\n${frame(name, svg, note)}\n\n${caption}\n`)

// ── S1 · first run ──────────────────────────────────────────────────────────
add('W1', 'S1 · First run — the only screen before you are working',
  '**One button, no account.** The line about files never leaving the machine is doing real work: it is the objection every privacy-conscious developer raises, answered before they ask.',
  [
    r(1, 1, W - 2, 30, { fill: GREY, stroke: LINE }),
    t(14, 20, 'frontmatter', { weight: 600, size: 11 }),
    t(W - 14, 20, '— ▫ ✕', { anchor: 'end', fill: LINE }),
    t(W / 2, 130, 'Open a folder of markdown', { anchor: 'middle', size: 16, weight: 600 }),
    t(W / 2, 152, 'Point it at a vault, a repo, or any folder. It reads what is already there.', { anchor: 'middle', size: 9.5, fill: '#4a5160' }),
    r(W / 2 - 90, 176, 180, 32, { fill: BLUE, stroke: BLUE, rx: 3 }),
    t(W / 2, 196, 'Choose folder', { anchor: 'middle', fill: '#fff', weight: 600, size: 10 }),
    t(W / 2, 228, 'or connect a GitHub repository', { anchor: 'middle', size: 9, fill: BLUE }),
    r(W / 2 - 150, 258, 300, 1, { fill: FAINT, stroke: 'none' }),
    t(W / 2, 282, 'Recent', { anchor: 'middle', size: 8, fill: LINE }),
    t(W / 2, 300, '~/work/product-docs      ~/notes', { anchor: 'middle', size: 9, fill: '#4a5160' }),
    t(W / 2, 356, 'Nothing leaves your machine. No account needed.', { anchor: 'middle', size: 8.5, fill: LINE }),
  ].join(''),
  'No sign-up, no email field, no onboarding tour. The single change most likely to hurt adoption is a form here.')

// ── S2 · the editor ─────────────────────────────────────────────────────────
add('W2', 'S2 · The editor — the 95% screen, with the side drawer open',
  '**The document is the interface.** No toolbar: formatting is markdown, typed. The left drawer collapses to nothing. Each file in the tree carries a thin bar showing how much of it is unreviewed machine text — the only ambient signal in the product.',
  [
    // top bar
    r(1, 1, W - 2, 26, { fill: GREY, stroke: LINE }),
    t(12, 18, 'product-docs  ›  specs  ›  auth.md', { size: 9, fill: '#4a5160' }),
    t(W - 120, 18, '● synced', { size: 8.5, fill: '#0d8a4f' }),
    t(W - 34, 18, '⋯', { size: 12, fill: LINE }),
    // left drawer
    r(1, 27, 168, H - 27, { fill: GREY, stroke: LINE }),
    t(12, 46, 'FILES', { size: 7.5, weight: 600, fill: LINE }),
    ...[['README.md', 0], ['adr/', 0], ['  0001-sync.md', 32], ['  0002-engine.md', 0],
        ['specs/', 0], ['  auth.md', 64], ['  billing.md', 12], ['notes/', 0]]
      .map(([n, pct], i) => {
        const y = 64 + i * 20
        const sel = n.includes('auth.md')
        return (sel ? r(6, y - 11, 158, 18, { fill: WASH, stroke: 'none' }) : '') +
          t(14, y, n, { size: 8.5, fill: sel ? BLUE : INK, weight: sel ? 600 : null }) +
          (pct ? r(140, y - 8, 20, 3, { fill: '#dfe3ea', stroke: 'none' }) +
                 r(140, y - 8, 20 * pct / 100, 3, { fill: BLUE, stroke: 'none' }) : '')
      }),
    t(12, H - 14, 'unreviewed share ▔▔', { size: 7, fill: LINE }),
    // document
    t(196, 56, 'Authentication', { size: 14, weight: 700 }),
    lines(196, 74, 480, 3),
    // machine span
    r(192, 108, 494, 40, { fill: MACHINE, stroke: 'none' }),
    lines(196, 118, 480, 3, 9, { fill: '#a8c4f5' }),
    t(688, 122, '◆', { size: 7, fill: BLUE }),
    lines(196, 162, 480, 2),
    t(196, 198, 'The GitHub App', { size: 11, weight: 600 }),
    lines(196, 212, 480, 4),
    r(192, 258, 380, 34, { fill: MACHINE, stroke: 'none' }),
    lines(196, 268, 366, 2, 9, { fill: '#a8c4f5' }),
    lines(196, 304, 480, 3),
    // status bar
    r(169, H - 22, W - 170, 21, { fill: GREY, stroke: LINE }),
    t(180, H - 8, '2,140 words', { size: 8, fill: LINE }),
    t(300, H - 8, 'Ln 84, Col 12', { size: 8, fill: LINE }),
    t(W - 16, H - 8, '2 unreviewed', { size: 8, fill: BLUE, anchor: 'end', weight: 600 }),
  ].join(''),
  'Tinted spans are machine-written and unreviewed. No borders, no gutter icons — it has to be ignorable while you read.')

// ── S3 · hover ──────────────────────────────────────────────────────────────
add('W3', 'S3 · The provenance panel — on hover, never uninvited',
  '**This is the whole product in one interaction.** Everything above it is a text editor; this is the part nothing else can do, because every other tool rewrote the whole file and does not know which bytes were its own.',
  [
    lines(40, 40, 620, 2),
    r(36, 66, 628, 34, { fill: MACHINE, stroke: 'none' }),
    lines(40, 76, 614, 2, 9, { fill: '#a8c4f5' }),
    r(120, 108, 400, 128, { fill: '#fff', stroke: INK, sw: 1.2, rx: 3 }),
    r(120, 108, 400, 26, { fill: WASH, stroke: 'none' }),
    t(132, 125, 'Written by claude-opus-5', { size: 9.5, weight: 600, fill: BLUE }),
    t(508, 125, '✕', { size: 9, anchor: 'end', fill: LINE }),
    t(132, 152, 'Prompt', { size: 7.5, weight: 600, fill: LINE }),
    t(132, 168, '"Document the token refresh flow and note the', { size: 9 }),
    t(132, 182, ' 8-hour expiry we settled on."', { size: 9 }),
    t(132, 206, 'Tuesday 09:14  ·  312 bytes  ·  not reviewed', { size: 8.5, fill: '#4a5160' }),
    r(132, 214, 118, 20, { fill: BLUE, stroke: BLUE, rx: 2 }),
    t(191, 228, 'Keep — mark reviewed', { size: 8, fill: '#fff', anchor: 'middle', weight: 600 }),
    r(260, 214, 90, 20, { fill: '#fff', stroke: LINE, rx: 2 }),
    t(305, 228, 'Revert  ⌘Z', { size: 8, anchor: 'middle' }),
    t(370, 228, 'Jump to next  ⇥', { size: 8, fill: BLUE }),
    lines(40, 260, 620, 3),
  ].join(''),
  'Hover only, after a delay, dismissible with Escape. Reverting restores the exact bytes and moves nothing else.')

// ── S4 · review drawer ──────────────────────────────────────────────────────
add('W4', 'S4 · Review panel — the right drawer',
  '**For catching up on a document you did not watch being written.** Keyboard-first: `j` and `k` to move, `a` to accept, `r` to revert. The counter going to zero is the entire point of the screen.',
  [
    r(1, 1, W - 2, 26, { fill: GREY, stroke: LINE }),
    t(12, 18, 'specs / auth.md', { size: 9, fill: '#4a5160' }),
    lines(30, 60, 380, 3),
    r(26, 100, 388, 30, { fill: MACHINE, stroke: 'none' }),
    lines(30, 110, 374, 2, 9, { fill: '#a8c4f5' }),
    lines(30, 146, 380, 4),
    // drawer
    r(440, 27, W - 441, H - 27, { fill: GREY, stroke: LINE }),
    t(456, 50, 'UNREVIEWED', { size: 7.5, weight: 600, fill: LINE }),
    t(W - 20, 50, '4', { size: 12, weight: 700, fill: BLUE, anchor: 'end' }),
    ...[0, 1, 2, 3].map((i) => {
      const y = 70 + i * 74
      return r(452, y, W - 472, 62, { fill: '#fff', stroke: i === 0 ? BLUE : FAINT, sw: i === 0 ? 1.4 : 1, rx: 2 }) +
        t(464, y + 18, i === 0 ? '"Document the token refresh…"' : ['"Add the rate-limit note"', '"Clarify scope wording"', '"List the error codes"'][i - 1], { size: 8.5, weight: i === 0 ? 600 : null }) +
        t(464, y + 34, 'claude-opus-5 · 312 B · Tue 09:14', { size: 7.5, fill: '#4a5160' }) +
        r(464, y + 42, 52, 14, { fill: i === 0 ? BLUE : '#fff', stroke: i === 0 ? BLUE : LINE, rx: 2 }) +
        t(490, y + 52, 'Keep', { size: 7.5, anchor: 'middle', fill: i === 0 ? '#fff' : INK }) +
        r(522, y + 42, 52, 14, { fill: '#fff', stroke: LINE, rx: 2 }) +
        t(548, y + 52, 'Revert', { size: 7.5, anchor: 'middle' })
    }),
    t(456, H - 12, 'j / k  move      a  keep      r  revert', { size: 7.5, fill: LINE }),
  ].join(''),
  'The drawer is the only persistent panel in the product, and it can be closed entirely.')

// ── S5/S6 · overlays ────────────────────────────────────────────────────────
add('W5', 'S5 and S6 · Quick switcher and command palette',
  '**Table stakes, and their absence is disqualifying.** A reviewer who cannot find a file in two keystrokes stops reviewing before they reach anything we built. The palette shows what a command does *before* you run it, which is how people learn a product without a tour.',
  [
    r(20, 20, 330, 250, { fill: GREY, stroke: FAINT, dash: '4 3' }),
    t(30, 38, 'S5  ⌘P  Quick switch', { size: 8.5, weight: 600, fill: LINE }),
    r(36, 50, 298, 200, { fill: '#fff', stroke: INK, sw: 1.2, rx: 3 }),
    r(36, 50, 298, 30, { fill: '#fff', stroke: 'none' }),
    t(48, 70, 'auth', { size: 10 }), r(48, 74, 26, 1, { fill: BLUE, stroke: 'none' }),
    r(36, 80, 298, 1, { fill: FAINT, stroke: 'none' }),
    ...['specs/auth.md', 'adr/0003-auth-scope.md', 'notes/auth-questions.md', 'README.md'].map((f, i) =>
      (i === 0 ? r(36, 86 + i * 28, 298, 28, { fill: WASH, stroke: 'none' }) : '') +
      t(48, 104 + i * 28, f, { size: 9, fill: i === 0 ? BLUE : INK, weight: i === 0 ? 600 : null })),
    r(370, 20, 330, 250, { fill: GREY, stroke: FAINT, dash: '4 3' }),
    t(380, 38, 'S6  ⌘K  Command palette', { size: 8.5, weight: 600, fill: LINE }),
    r(386, 50, 298, 200, { fill: '#fff', stroke: INK, sw: 1.2, rx: 3 }),
    t(398, 70, 'rename', { size: 10 }), r(398, 74, 40, 1, { fill: BLUE, stroke: 'none' }),
    r(386, 80, 298, 1, { fill: FAINT, stroke: 'none' }),
    ...[['Rename heading across vault', '⇧⌘R'], ['Rename tag', ''], ['Rename property key', ''], ['Revert all unreviewed', '']]
      .map(([c, k], i) =>
        (i === 0 ? r(386, 86 + i * 28, 298, 28, { fill: WASH, stroke: 'none' }) : '') +
        t(398, 104 + i * 28, c, { size: 9, fill: i === 0 ? BLUE : INK, weight: i === 0 ? 600 : null }) +
        (k ? t(672, 104 + i * 28, k, { size: 8, fill: LINE, anchor: 'end' }) : '')),
    t(30, 300, 'Both are overlays on the document. Escape returns you exactly where you were, with nothing lost.', { size: 9, fill: '#4a5160' }),
  ].join(''),
  'Neither is a destination. Every overlay hands you back to the document.')

// ── S8 · refactor ───────────────────────────────────────────────────────────
add('W6', 'S8 · Refactor preview — the engine made visible',
  '**This is the screen that sells the engine.** Rename something and every file that will change is listed as an accept-or-reject hunk. The refusal box at the bottom is the differentiator: where a competitor guesses, we stop and say why.',
  [
    r(1, 1, W - 2, 30, { fill: WASH, stroke: LINE }),
    t(14, 20, 'Rename heading  "Token refresh"  →  "Refreshing tokens"', { size: 9.5, weight: 600 }),
    t(W - 14, 20, '11 files · 14 changes', { size: 8.5, fill: BLUE, anchor: 'end' }),
    ...[['specs/auth.md', 3], ['adr/0003-auth-scope.md', 2], ['README.md', 1], ['notes/auth-questions.md', 4]]
      .map(([f, n], i) => {
        const y = 44 + i * 54
        return r(14, y, W - 28, 46, { fill: '#fff', stroke: FAINT, rx: 2 }) +
          t(26, y + 17, f, { size: 9, weight: 600 }) +
          t(150, y + 17, `${n} change${n > 1 ? 's' : ''}`, { size: 8, fill: LINE }) +
          r(24, y + 24, 420, 3.5, { fill: '#fde0e0', stroke: 'none' }) +
          r(24, y + 32, 400, 3.5, { fill: '#d9f2e3', stroke: 'none' }) +
          r(W - 150, y + 12, 56, 18, { fill: BLUE, stroke: BLUE, rx: 2 }) +
          t(W - 122, y + 25, 'Accept', { size: 8, fill: '#fff', anchor: 'middle' }) +
          r(W - 86, y + 12, 56, 18, { fill: '#fff', stroke: LINE, rx: 2 }) +
          t(W - 58, y + 25, 'Skip', { size: 8, anchor: 'middle' })
      }),
    r(14, 266, W - 28, 52, { fill: '#fffbf0', stroke: '#b8860b', sw: 1.2, rx: 2 }),
    t(26, 286, 'Refused — 2 files', { size: 9, weight: 600, fill: '#8a5a06' }),
    t(26, 302, 'drafts/old-auth.md — the heading appears twice and we cannot tell which one you meant.', { size: 8.5, fill: '#8a5a06' }),
    r(14, H - 40, 130, 24, { fill: BLUE, stroke: BLUE, rx: 2 }),
    t(79, H - 24, 'Apply 12 changes', { size: 8.5, fill: '#fff', anchor: 'middle', weight: 600 }),
    t(160, H - 24, 'Nothing else in any file will change.', { size: 8.5, fill: '#4a5160' }),
  ].join(''),
  'Refusing two files and saying why is the product working, not failing.')

// ── S10 · team dashboard ────────────────────────────────────────────────────
add('W7', 'S10 · Team view — the only paid screen',
  '**Provenance for one person is a convenience; provenance across a team is a record.** That is the whole reason this screen is behind the paywall and everything else is free.',
  [
    r(1, 1, W - 2, 30, { fill: GREY, stroke: LINE }),
    t(14, 20, 'product-docs  ·  Team', { size: 10, weight: 600 }),
    t(W - 14, 20, '4 seats', { size: 8.5, fill: LINE, anchor: 'end' }),
    ...[['Unreviewed documents', '7'], ['Machine-written, unread', '18%'], ['Reviewed this week', '42']]
      .map(([l, v], i) => {
        const x = 14 + i * 232
        return r(x, 44, 220, 58, { fill: GREY, stroke: FAINT, rx: 2 }) +
          t(x + 14, 68, v, { size: 17, weight: 700, fill: BLUE }) +
          t(x + 14, 86, l, { size: 8, fill: '#4a5160' })
      }),
    t(14, 128, 'DOCUMENTS', { size: 7.5, weight: 600, fill: LINE }),
    ...[['specs/auth.md', 'Sagnik', 64, 'not reviewed'], ['specs/billing.md', 'Amit', 12, 'reviewed'],
        ['adr/0004-sync.md', 'Sagnik', 88, 'not reviewed'], ['README.md', 'Amit', 0, 'reviewed'],
        ['notes/pricing.md', 'Sagnik', 31, 'partial']]
      .map(([f, who, pct, st], i) => {
        const y = 148 + i * 34
        return r(14, y, W - 28, 28, { fill: '#fff', stroke: FAINT, rx: 2 }) +
          t(26, y + 18, f, { size: 9 }) +
          t(200, y + 18, who, { size: 8.5, fill: '#4a5160' }) +
          r(300, y + 11, 120, 5, { fill: '#eceff4', stroke: 'none' }) +
          r(300, y + 11, 120 * pct / 100, 5, { fill: pct > 50 ? BLUE : '#a8c4f5', stroke: 'none' }) +
          t(430, y + 18, `${pct}% machine`, { size: 8, fill: LINE }) +
          t(W - 26, y + 18, st, { size: 8, anchor: 'end', fill: st === 'reviewed' ? '#0d8a4f' : st === 'partial' ? '#8a5a06' : '#a51c1c' })
      }),
    t(14, H - 14, 'Filter:  machine-written and nobody has read it  ·  7 documents', { size: 8.5, fill: BLUE }),
  ].join(''),
  'The filter at the bottom is the feature a team lead actually opens this for.')

// ── S9/S11 ──────────────────────────────────────────────────────────────────
add('W8', 'S9 and S11 · Conflict view, and settings',
  '**The conflict view is the only modal in the product that blocks the document**, because proceeding without a decision loses work. Settings is one screen with six groups and stays one screen — every toggle is a decision we failed to make.',
  [
    r(16, 16, 400, 330, { fill: '#fff', stroke: INK, sw: 1.2, rx: 3 }),
    r(16, 16, 400, 26, { fill: '#fdf3f3', stroke: 'none' }),
    t(28, 34, 'S9 · Two versions of specs/auth.md', { size: 9, weight: 600, fill: '#a51c1c' }),
    t(28, 62, 'This device', { size: 8, weight: 600, fill: LINE }),
    r(28, 70, 174, 110, { fill: GREY, stroke: FAINT }),
    lines(36, 84, 158, 3), r(32, 116, 166, 16, { fill: '#fde0e0', stroke: 'none' }), lines(36, 142, 158, 3),
    t(230, 62, 'Other device', { size: 8, weight: 600, fill: LINE }),
    r(230, 70, 174, 110, { fill: GREY, stroke: FAINT }),
    lines(238, 84, 158, 3), r(234, 116, 166, 16, { fill: '#d9f2e3', stroke: 'none' }), lines(238, 142, 158, 3),
    t(28, 204, 'Result', { size: 8, weight: 600, fill: LINE }),
    r(28, 212, 376, 76, { fill: '#fff', stroke: BLUE }),
    lines(36, 226, 360, 5),
    r(28, 300, 110, 22, { fill: '#fff', stroke: LINE, rx: 2 }), t(83, 315, 'Keep this device', { size: 8, anchor: 'middle' }),
    r(146, 300, 110, 22, { fill: '#fff', stroke: LINE, rx: 2 }), t(201, 315, 'Keep the other', { size: 8, anchor: 'middle' }),
    r(264, 300, 140, 22, { fill: BLUE, stroke: BLUE, rx: 2 }), t(334, 315, 'Edit the result', { size: 8, fill: '#fff', anchor: 'middle', weight: 600 }),
    r(440, 16, 264, 330, { fill: '#fff', stroke: INK, sw: 1.2, rx: 3 }),
    r(440, 16, 264, 26, { fill: GREY, stroke: 'none' }),
    t(452, 34, 'S11 · Settings', { size: 9, weight: 600 }),
    ...['Appearance', 'Keyboard', 'AI provider and key', 'Provenance', 'Git identity', 'About']
      .map((g, i) => {
        const y = 62 + i * 46
        return t(452, y, g, { size: 9, weight: 600 }) +
          r(452, y + 8, 200, 3, { fill: FAINT, stroke: 'none' }) +
          (i === 3 ? t(452, y + 26, 'Show machine-written spans   ●━', { size: 8, fill: '#4a5160' }) : '') +
          (i === 2 ? t(452, y + 26, 'Anthropic  ·  key stored locally', { size: 8, fill: '#4a5160' }) : '')
      }),
    t(452, H - 22, 'One screen. No tabs. Six groups.', { size: 8, fill: LINE }),
  ].join(''),
  'Everything else in the product is a document with things drawn on it.')

// ── the AI edit flow ────────────────────────────────────────────────────────
add('W9', 'The AI edit, as three frames',
  '**Read left to right — this is the loop the whole product exists to make safe.** The middle frame is where every other tool has already rewritten your file; we have only proposed a byte range. The third frame is the promise, and it is testable on every release.',
  [
    ...[0, 1, 2].map((i) => {
      const x = 14 + i * 236
      const titles = ['1 · You ask', '2 · Proposed, not written', '3 · You decide']
      return r(x, 30, 220, 300, { fill: '#fff', stroke: LINE, rx: 2 }) +
        r(x, 30, 220, 24, { fill: i === 1 ? WASH : GREY, stroke: 'none' }) +
        t(x + 12, 46, titles[i], { size: 8.5, weight: 600, fill: i === 1 ? BLUE : INK })
    }),
    lines(26, 76, 190, 3),
    r(22, 110, 200, 40, { fill: GREY, stroke: FAINT, rx: 2 }),
    t(32, 128, '"Document the token', { size: 8.5 }), t(32, 142, ' refresh flow"', { size: 8.5 }),
    lines(26, 172, 190, 4),
    lines(262, 76, 190, 2),
    r(258, 104, 200, 44, { fill: MACHINE, stroke: BLUE, rx: 2 }),
    lines(266, 116, 184, 3, 9, { fill: '#a8c4f5' }),
    t(262, 166, 'nothing written to disk yet', { size: 8, fill: BLUE }),
    lines(262, 186, 190, 3),
    lines(498, 76, 190, 2),
    r(494, 104, 200, 30, { fill: '#f1faf5', stroke: '#0d8a4f', rx: 2 }),
    lines(502, 114, 184, 2, 9, { fill: '#9ad3b4' }),
    t(498, 152, 'kept — now ordinary text', { size: 8, fill: '#0d8a4f' }),
    r(494, 172, 200, 26, { fill: '#fff', stroke: FAINT, rx: 2 }),
    t(504, 189, '$ git diff  →  1 file, 4 lines', { size: 8, fill: '#4a5160' }),
    lines(498, 214, 190, 3),
    t(14, 356, 'At frame 2 a regenerating editor has already rewritten the whole file. We have written nothing.', { size: 9, fill: '#4a5160' }),
  ].join(''),
  'The proof is frame 3: git diff shows your change and nothing else. Every release is tested against that.')

console.log(out.join('\n'))
