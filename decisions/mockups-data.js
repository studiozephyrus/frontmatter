window.MOCKUPS = [
 {
  "id": "m01",
  "screen": "S0 · Launcher",
  "name": "Templates, and recent sorted unreviewed-first",
  "why": "Puts unreviewed work in front of you before you choose anything. Costs a beat of orientation on every open, which is the trade.",
  "card": "FL12",
  "cardq": "What a stranger meets in the first thirty seconds",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><h2>Open something</h2><div style=\"display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0\"><div class=\"tmpl\">Blank document</div><div class=\"tmpl\">Spec</div><div class=\"tmpl\">Meeting note</div><div class=\"tmpl\">Decision record</div></div><div class=\"rh\">Recent</div><div class=\"row\"><span>spec.md <span class=\"pill n\">6 unreviewed</span></span><span style=\"color:var(--muted)\">2h</span></div><div class=\"row\"><span>api.md <span class=\"pill n\">2 unreviewed</span></span><span style=\"color:var(--muted)\">yesterday</span></div><div class=\"row\"><span>notes.md</span><span style=\"color:var(--muted)\">3d</span></div></div></div></div>"
 },
 {
  "id": "m02",
  "screen": "S0 · Launcher",
  "name": "One folder button, nothing else",
  "why": "The fastest possible first thirty seconds. Nothing to read, one thing to do. Hides review state until a document is open, so the product's claim is invisible at first contact.",
  "card": "FL12",
  "cardq": "What a stranger meets in the first thirty seconds",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><div class=\"center\"><h2 style=\"font-size:22px\">Open a folder</h2><div style=\"color:var(--fg-muted);max-width:38ch;text-align:center\">Your files stay yours. Nothing is uploaded and no account is needed.</div><div style=\"background:var(--accent);color:var(--accent-fg);padding:8px 18px;border-radius:var(--r);font-size:13px\">Choose folder</div></div></div></div></div>"
 },
 {
  "id": "m03",
  "screen": "S0 · Launcher",
  "name": "A baseline card on first open of an unseen repo",
  "why": "Answers \"what am I looking at\" before you touch anything. The number is the honest one: on a repo we have never seen, everything is unreviewed, and pretending otherwise is the lie.",
  "card": "FL14",
  "cardq": "The baseline on first open of a repo we have never seen",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><h2>fm/spec-kit</h2><div style=\"display:flex;gap:26px;margin:16px 0 18px\"><div><div class=\"big\">41</div><div class=\"rh\">markdown files</div></div><div><div class=\"big\">0</div><div class=\"rh\">reviewed by anyone</div></div><div><div class=\"big\">—</div><div class=\"rh\">agent writes seen</div></div></div><p style=\"color:var(--fg-muted)\">Nothing here has been reviewed in frontmatter yet. That is the starting point, not a warning.</p><div style=\"background:var(--accent);color:var(--accent-fg);padding:7px 14px;border-radius:var(--r);display:inline-block;font-size:12.5px;margin-top:8px\">Start from the newest change</div></div></div></div>"
 },
 {
  "id": "m04",
  "screen": "S2 · Review tint",
  "name": "Colour wash only — the shipped 1.11:1",
  "why": "What exists today. It fails WCAG non-text contrast at 1.11:1 and disappears entirely for a colour-blind reader, so the state is carried on one channel that not everyone has.",
  "card": "D1",
  "cardq": "Does the tint stay colour-only, or gain a second channel?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Changed</div><div class=\"row\"><span>1 span</span><span class=\"pill\">unreviewed</span></div></div></div></div>"
 },
 {
  "id": "m05",
  "screen": "S2 · Review tint",
  "name": "Wash plus a left rule — two channels",
  "why": "The same wash, plus a rule that survives greyscale and colour blindness. One extra pixel column buys the accessibility claim outright.",
  "card": "D1",
  "cardq": "Does the tint stay colour-only, or gain a second channel?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint-rule'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Changed</div><div class=\"row\"><span>1 span</span><span class=\"pill\">unreviewed</span></div></div></div></div>"
 },
 {
  "id": "m06",
  "screen": "S2 · Review tint",
  "name": "Underline only — no wash at all",
  "why": "Quietest of the three, and the only one that survives a printed page. Loses the at-a-glance density read: you cannot see how much of a long document changed without scanning it.",
  "card": "D1",
  "cardq": "Does the tint stay colour-only, or gain a second channel?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint-ul'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Changed</div><div class=\"row\"><span>1 span</span><span class=\"pill\">unreviewed</span></div></div></div></div>"
 },
 {
  "id": "m07",
  "screen": "S2 · Two states",
  "name": "Two washes — proposed and unreviewed",
  "why": "Distinguishes what the agent is proposing from what it already wrote. Two colours means two things to learn, and the second one is only readable next to the first.",
  "card": "D2",
  "cardq": "Two washes, or one bordered highlight?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='prop'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p><span class='tint'>Idempotency keys are required on every write.</span> The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Legend</div><div class=\"row\"><span><span class=\"prop\">&nbsp;&nbsp;&nbsp;</span> proposed</span></div><div class=\"row\"><span><span class=\"tint\">&nbsp;&nbsp;&nbsp;</span> unreviewed</span></div></div></div></div>"
 },
 {
  "id": "m08",
  "screen": "S2 · Two states",
  "name": "One bordered highlight, state in the rail",
  "why": "One visual language in the document; the distinction moves to the rail where there is room to name it. Costs a glance to tell proposed from unreviewed.",
  "card": "D2",
  "cardq": "Two washes, or one bordered highlight?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='bord'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">This span</div><div class=\"row\"><span>State</span><span class=\"pill\">proposed</span></div><div class=\"row\"><span>By</span><span>claude-opus</span></div><div style=\"margin-top:10px;display:flex;gap:6px\"><span class=\"pill n\">Accept</span><span class=\"pill\">Revert</span></div></div></div></div>"
 },
 {
  "id": "m09",
  "screen": "S2 · Modes",
  "name": "Four modes — Live, Edit, Split, Read",
  "why": "What the July screenshot showed and what the plan carries. Four is one more than most editors ship, and Live is the one that cannot exist inside a host extension.",
  "card": "D8",
  "cardq": "Four editor modes for MVP-0, or cut to three?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Outline</div><div class=\"tr\">Retry policy</div><div class=\"tr\">Backoff</div><div class=\"tr\">Idempotency</div></div></div></div>"
 },
 {
  "id": "m10",
  "screen": "S2 · Modes",
  "name": "Three modes — Edit, Split, Read",
  "why": "Drops Live. Cuts the mode nobody can build inside VS Code, so the same three work on every surface — which is only an argument if the extension path wins.",
  "card": "D8",
  "cardq": "Four editor modes for MVP-0, or cut to three?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Outline</div><div class=\"tr\">Retry policy</div><div class=\"tr\">Backoff</div><div class=\"tr\">Idempotency</div></div></div></div>"
 },
 {
  "id": "m11",
  "screen": "S2 · AI prompt",
  "name": "Docked strip under the document",
  "why": "Always present, never in the way, and it has room for state. The founder mockup put it here. It is also the furthest point on screen from where you are typing.",
  "card": "D7",
  "cardq": "Does the AI prompt summon at the cursor, or stay docked?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Outline</div><div class=\"tr\">Retry policy</div></div></div><div class=\"strip\"><span style=\"color:var(--muted)\">Ask frontmatter to edit this document</span><span class=\"pill\" style=\"margin-left:auto\">&#8984;K</span></div></div>"
 },
 {
  "id": "m12",
  "screen": "S2 · AI prompt",
  "name": "Summons at the cursor",
  "why": "Appears where your attention already is, and the edit lands where you are looking. The reconciliation note against the founder mockup asked for exactly this move.",
  "card": "D7",
  "cardq": "Does the AI prompt summon at the cursor, or stay docked?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><div class=\"cursor-pop\" style=\"left:30px;top:132px;width:290px\"><span style=\"color:var(--muted)\">Edit this paragraph&hellip;</span><span class=\"pill\" style=\"float:right\">&#8984;K</span></div><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Outline</div><div class=\"tr\">Retry policy</div></div></div></div>"
 },
 {
  "id": "m13",
  "screen": "S4 · Review panel",
  "name": "Every changed span, exhaustible",
  "why": "You can finish it. The list ends, and ending it means something. The attention literature is against enumeration at volume: 55-98% override rates once a list stops being finishable.",
  "card": "FL19",
  "cardq": "An exhaustible list of every changed span, or only unreviewed?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\"><h2>Review</h2><div class=\"rh\">All changes since your last review — 4</div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Backoff is exponential&hellip;</span></span><span class=\"pill\">reviewed</span></div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Idempotency keys are&hellip;</span></span><span class=\"pill\">unreviewed</span></div><div class=\"row\"><span><b style=\"font-weight:600\">api.md</b> <span style=\"color:var(--fg-muted)\">The client retries on&hellip;</span></span><span class=\"pill\">reviewed</span></div><div class=\"row\"><span><b style=\"font-weight:600\">api.md</b> <span style=\"color:var(--fg-muted)\">Every other status is&hellip;</span></span><span class=\"pill\">unreviewed</span></div></div><div class=\"rail\"><div class=\"rh\">Progress</div><div class=\"big\">2/4</div></div></div></div>"
 },
 {
  "id": "m14",
  "screen": "S4 · Review panel",
  "name": "Only what is unreviewed",
  "why": "The list is always short and always actionable. You lose the sense of a finished pass, and there is no surface that tells you what you already approved.",
  "card": "FL19",
  "cardq": "An exhaustible list of every changed span, or only unreviewed?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\"><h2>Review</h2><div class=\"rh\">Unreviewed — 2</div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Idempotency keys are&hellip;</span></span><span class=\"pill\">unreviewed</span></div><div class=\"row\"><span><b style=\"font-weight:600\">api.md</b> <span style=\"color:var(--fg-muted)\">Every other status is&hellip;</span></span><span class=\"pill\">unreviewed</span></div></div><div class=\"rail\"><div class=\"rh\">Progress</div><div class=\"big\">2</div><div style=\"color:var(--fg-muted);font-size:11.5px\">left to look at</div></div></div></div>"
 },
 {
  "id": "m15",
  "screen": "S4 · States",
  "name": "Three states — changed, seen, reviewed",
  "why": "Separates \"I looked\" from \"I approved\", which is how people actually read. Adds a third state to teach and a third thing every surface must render.",
  "card": "FL18",
  "cardq": "Does a span have a seen state between changed and reviewed?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\"><h2>Review</h2><div class=\"rh\">Three states</div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Backoff is exponential&hellip;</span></span><span class=\"pill\">reviewed</span></div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Idempotency keys are&hellip;</span></span><span class=\"pill\">seen</span></div><div class=\"row\"><span><b style=\"font-weight:600\">api.md</b> <span style=\"color:var(--fg-muted)\">Every other status is&hellip;</span></span><span class=\"pill\">changed</span></div></div><div class=\"rail\"><div class=\"rh\">Legend</div><div class=\"row\"><span>changed</span></div><div class=\"row\"><span>seen</span></div><div class=\"row\"><span>reviewed</span></div></div></div></div>"
 },
 {
  "id": "m16",
  "screen": "S4 · States",
  "name": "Two states — changed, reviewed",
  "why": "One bit per span. Nothing to explain, nothing to mis-set. Cannot express \"I read it and I am not signing off\", which is the honest state most of the time.",
  "card": "FL18",
  "cardq": "Does a span have a seen state between changed and reviewed?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\"><h2>Review</h2><div class=\"rh\">Two states</div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Backoff is exponential&hellip;</span></span><span class=\"pill\">reviewed</span></div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Idempotency keys are&hellip;</span></span><span class=\"pill\">changed</span></div></div><div class=\"rail\"><div class=\"rh\">Legend</div><div class=\"row\"><span>changed</span></div><div class=\"row\"><span>reviewed</span></div></div></div></div>"
 },
 {
  "id": "m17",
  "screen": "S4 · Counter",
  "name": "A number",
  "why": "Precise, and it tells you the size of the job before you start. A number that never reaches zero becomes wallpaper, which is the documented failure of every badge.",
  "card": "FL6",
  "cardq": "What does the review counter count, and may it be a dot?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md <span class=\"pill n\">6</span></span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode on\">Edit</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Unreviewed</div><div class=\"big\">6</div></div></div></div>"
 },
 {
  "id": "m18",
  "screen": "S4 · Counter",
  "name": "A dot",
  "why": "Presence without arithmetic. It cannot become a number you learn to ignore, and it cannot be gamed to zero. You also cannot tell one span from forty.",
  "card": "FL6",
  "cardq": "What does the review counter count, and may it be a dot?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md <span class=\"cnt-dot\"></span></span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode on\">Edit</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Unreviewed</div><div style=\"padding-top:6px\"><span class=\"cnt-dot\"></span></div></div></div></div>"
 },
 {
  "id": "m19",
  "screen": "D4 · Count surfaces",
  "name": "One place only — the rail",
  "why": "A single home for the number. Nothing competes, nothing double-counts, and there is exactly one thing to keep correct.",
  "card": "D4",
  "cardq": "How many surfaces carry the unreviewed count?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Unreviewed</div><div class=\"big\">6</div></div></div></div>"
 },
 {
  "id": "m20",
  "screen": "D4 · Count surfaces",
  "name": "Tree, tab and rail all carry it",
  "why": "You see it wherever you are. Three renderers of one truth is three places to drift, and the plan already has one count that disagrees with itself.",
  "card": "D4",
  "cardq": "How many surfaces carry the unreviewed count?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md <span class=\"pill n\">6</span></span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode on\">Edit</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md <span class=\"pill n\" style=\"float:right\">6</span></div><div class=\"tr\"><span class=\"dot\"></span>api.md <span class=\"pill\" style=\"float:right\">2</span></div><div class=\"tr\">notes.md</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Unreviewed</div><div class=\"big\">6</div></div></div></div>"
 },
 {
  "id": "m21",
  "screen": "D23 · Repo share",
  "name": "A percentage of the repository, unreviewed",
  "why": "The most ambitious version of the claim, and the worst-evidenced element in the plan. Clinical alerting shows 55-98% override once a number cannot be driven to zero, and a repo percentage never can be.",
  "card": "D23",
  "cardq": "Does any surface state a share of a repository as unreviewed?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\"><h2>fm/spec-kit</h2><div style=\"margin:18px 0\"><div class=\"big\" style=\"color:var(--danger)\">68%</div><div class=\"rh\">of this repository is unreviewed</div><div style=\"height:6px;background:var(--panel-2);border-radius:3px;margin-top:12px;overflow:hidden\"><div style=\"width:68%;height:100%;background:var(--danger);opacity:.5\"></div></div></div><p style=\"color:var(--fg-muted)\">28 of 41 files have spans nobody has looked at.</p></div><div class=\"rail\"><div class=\"rh\">By file</div><div class=\"row\"><span>spec.md</span><span>6</span></div><div class=\"row\"><span>api.md</span><span>2</span></div></div></div></div>"
 },
 {
  "id": "m22",
  "screen": "D6 · Attribution",
  "name": "Hover card with author, prompt and bytes",
  "why": "The whole provenance claim in one surface. Neither MVP-0 source can fill the prompt field, so it ships showing \"prompt not recorded\" more often than not.",
  "card": "D6",
  "cardq": "Does the attribution hover card ship in MVP-0?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><div class=\"hovercard\" style=\"left:32px;top:126px\"><b>Changed 2 hours ago</b><div style=\"color:var(--fg-muted);margin-top:6px\"><div class=\"row\"><span>Author</span><span>claude-opus-5</span></div><div class=\"row\"><span>Bytes</span><span>1204&ndash;1251</span></div><div class=\"row\"><span>Prompt</span><span style=\"color:var(--muted)\">not recorded</span></div></div></div><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Outline</div><div class=\"tr\">Retry policy</div></div></div></div>"
 },
 {
  "id": "m23",
  "screen": "D21 · Dark",
  "name": "Dark mode at the pilot",
  "why": "The tint is quieter on a dark ground and nothing in the review design has been tested there. Shipping it doubles the surface the five-second test has to clear.",
  "card": "D21",
  "cardq": "Does dark mode ship at the pilot?",
  "html": "<div style=\"--bg:#0d0e11;--panel:#141519;--panel-2:rgba(255,255,255,.03);--fg:#e8e8ea;--fg-muted:#9b9ba3;--muted:#6b6b73;--border:rgba(255,255,255,.08);--border-strong:rgba(255,255,255,.14);--accent:#e8e8ea;--accent-fg:#0d0e11;--hover:rgba(255,255,255,.05);--link:#60a5fa;--tint:rgba(96,165,250,.12)\"><div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Unreviewed</div><div class=\"big\">6</div></div></div></div></div>"
 }
];
