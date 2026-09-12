window.MOCKUPS = [
 {
  "id": "m01",
  "screen": "Launcher",
  "name": "Templates, with recent files sorted unreviewed first",
  "why": "You see what needs reading before you pick anything. The cost is a moment of looking around every time you open the app.",
  "card": "FL12",
  "cardq": "What a stranger meets in the first thirty seconds",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><h2>Open something</h2><div style=\"display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0\"><div class=\"tmpl\">Blank document</div><div class=\"tmpl\">Spec</div><div class=\"tmpl\">Meeting note</div><div class=\"tmpl\">Decision record</div></div><div class=\"rh\">Recent</div><div class=\"row\"><span>spec.md <span class=\"pill n\">6 unreviewed</span></span><span style=\"color:var(--muted)\">2h</span></div><div class=\"row\"><span>api.md <span class=\"pill n\">2 unreviewed</span></span><span style=\"color:var(--muted)\">yesterday</span></div><div class=\"row\"><span>notes.md</span><span style=\"color:var(--muted)\">3d</span></div></div></div></div>"
 },
 {
  "id": "m02",
  "screen": "Launcher",
  "name": "One folder button and nothing else",
  "why": "The fastest first thirty seconds there is. Nothing to read, one thing to do. But it hides review state until a document is open, so a first-time user never sees what the product is for.",
  "card": "FL12",
  "cardq": "What a stranger meets in the first thirty seconds",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><div class=\"center\"><h2 style=\"font-size:22px\">Open a folder</h2><div style=\"color:var(--fg-muted);max-width:38ch;text-align:center\">Your files stay yours. Nothing is uploaded and no account is needed.</div><div style=\"background:var(--accent);color:var(--accent-fg);padding:8px 18px;border-radius:var(--r);font-size:13px\">Choose folder</div></div></div></div></div>"
 },
 {
  "id": "m03",
  "screen": "Launcher",
  "name": "A summary card the first time you open a repository",
  "why": "Tells you what you are looking at before you touch anything. On a repository frontmatter has never seen, nothing has been reviewed yet, so the card says zero rather than implying otherwise.",
  "card": "FL14",
  "cardq": "The baseline on first open of a repo we have never seen",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><h2>fm/spec-kit</h2><div style=\"display:flex;gap:26px;margin:16px 0 18px\"><div><div class=\"big\">41</div><div class=\"rh\">markdown files</div></div><div><div class=\"big\">0</div><div class=\"rh\">reviewed by anyone</div></div><div><div class=\"big\">none</div><div class=\"rh\">agent writes seen</div></div></div><p style=\"color:var(--fg-muted)\">Nothing here has been reviewed in frontmatter yet. That is the starting point, not a warning.</p><div style=\"background:var(--accent);color:var(--accent-fg);padding:7px 14px;border-radius:var(--r);display:inline-block;font-size:12.5px;margin-top:8px\">Start from the newest change</div></div></div></div>"
 },
 {
  "id": "m04",
  "screen": "Editor · highlight",
  "name": "Colour wash only, as it ships today",
  "why": "This is what ships now. The highlight is barely darker than the page, at 1.11 to 1 where accessibility guidance asks for 3 to 1, and a colour-blind reader cannot see it at all.",
  "card": "D1",
  "cardq": "Does the tint stay colour-only, or gain a second channel?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Changed</div><div class=\"row\"><span>1 span</span><span class=\"pill\">unreviewed</span></div></div></div></div>"
 },
 {
  "id": "m05",
  "screen": "Editor · highlight",
  "name": "Colour wash plus a line down the left edge",
  "why": "The same wash, plus a thin line on the left that still shows in greyscale and to colour-blind readers. It costs one extra column of pixels and fixes the accessibility problem.",
  "card": "D1",
  "cardq": "Does the tint stay colour-only, or gain a second channel?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint-rule'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Changed</div><div class=\"row\"><span>1 span</span><span class=\"pill\">unreviewed</span></div></div></div></div>"
 },
 {
  "id": "m06",
  "screen": "Editor · highlight",
  "name": "Underline only, with no wash",
  "why": "The quietest of the three, and the only one that still works on a printed page. But you lose the quick sense of how much changed, so on a long document you have to scan it to find out.",
  "card": "D1",
  "cardq": "Does the tint stay colour-only, or gain a second channel?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint-ul'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Changed</div><div class=\"row\"><span>1 span</span><span class=\"pill\">unreviewed</span></div></div></div></div>"
 },
 {
  "id": "m07",
  "screen": "Editor · suggested or unreviewed",
  "name": "Two colours, one for suggested and one for unreviewed",
  "why": "Separates what the AI is suggesting from what it has already written. The cost is two colours to learn, and the second one is hard to tell apart unless you see both together.",
  "card": "D2",
  "cardq": "Two washes, or one bordered highlight?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='prop'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p><span class='tint'>Idempotency keys are required on every write.</span> The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Legend</div><div class=\"row\"><span><span class=\"prop\">&nbsp;&nbsp;&nbsp;</span> proposed</span></div><div class=\"row\"><span><span class=\"tint\">&nbsp;&nbsp;&nbsp;</span> unreviewed</span></div></div></div></div>"
 },
 {
  "id": "m08",
  "screen": "Editor · suggested or unreviewed",
  "name": "One bordered highlight, with the detail in the side panel",
  "why": "The document stays simple with one kind of mark, and the side panel says whether it is suggested or unreviewed. You need one extra glance to tell which is which.",
  "card": "D2",
  "cardq": "Two washes, or one bordered highlight?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='bord'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">This span</div><div class=\"row\"><span>State</span><span class=\"pill\">proposed</span></div><div class=\"row\"><span>By</span><span>claude-opus</span></div><div style=\"margin-top:10px;display:flex;gap:6px\"><span class=\"pill n\">Accept</span><span class=\"pill\">Revert</span></div></div></div></div>"
 },
 {
  "id": "m09",
  "screen": "Editor · modes",
  "name": "Four modes: Live, Edit, Split and Read",
  "why": "This is what your July screenshot showed and what the plan still carries. Four is one more than most editors have, and Live is the one mode that cannot work inside a VS Code extension.",
  "card": "D8",
  "cardq": "Four editor modes for MVP-0, or cut to three?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Outline</div><div class=\"tr\">Retry policy</div><div class=\"tr\">Backoff</div><div class=\"tr\">Idempotency</div></div></div></div>"
 },
 {
  "id": "m10",
  "screen": "Editor · modes",
  "name": "Three modes: Edit, Split and Read",
  "why": "Drops Live, the one mode that cannot be built inside VS Code, so the same three work everywhere. That only matters if you decide to ship as an extension.",
  "card": "D8",
  "cardq": "Four editor modes for MVP-0, or cut to three?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Outline</div><div class=\"tr\">Retry policy</div><div class=\"tr\">Backoff</div><div class=\"tr\">Idempotency</div></div></div></div>"
 },
 {
  "id": "m11",
  "screen": "Editor · AI prompt",
  "name": "AI prompt docked under the document",
  "why": "Always there and never in the way, with room to show what the AI is doing. Your mockup put it here. It is also the furthest point on the screen from where you are typing.",
  "card": "D7",
  "cardq": "Does the AI prompt summon at the cursor, or stay docked?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Outline</div><div class=\"tr\">Retry policy</div></div></div><div class=\"strip\"><span style=\"color:var(--muted)\">Ask frontmatter to edit this document</span><span class=\"pill\" style=\"margin-left:auto\">&#8984;K</span></div></div>"
 },
 {
  "id": "m12",
  "screen": "Editor · AI prompt",
  "name": "AI prompt that opens at the cursor",
  "why": "It opens where you are already looking, and the edit lands right there. An earlier review of your mockup asked for exactly this change.",
  "card": "D7",
  "cardq": "Does the AI prompt summon at the cursor, or stay docked?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><div class=\"cursor-pop\" style=\"left:30px;top:132px;width:290px\"><span style=\"color:var(--muted)\">Edit this paragraph&hellip;</span><span class=\"pill\" style=\"float:right\">&#8984;K</span></div><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Outline</div><div class=\"tr\">Retry policy</div></div></div></div>"
 },
 {
  "id": "m13",
  "screen": "Review panel",
  "name": "A list of every change, that you can finish",
  "why": "You can get to the end of it, and reaching the end means something. But research on hospital alert systems found people ignore 55 to 98% of warnings once a list gets too long to finish.",
  "card": "FL19",
  "cardq": "An exhaustible list of every changed span, or only unreviewed?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\"><h2>Review</h2><div class=\"rh\">All changes since your last review: 4</div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Backoff is exponential&hellip;</span></span><span class=\"pill\">reviewed</span></div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Idempotency keys are&hellip;</span></span><span class=\"pill\">unreviewed</span></div><div class=\"row\"><span><b style=\"font-weight:600\">api.md</b> <span style=\"color:var(--fg-muted)\">The client retries on&hellip;</span></span><span class=\"pill\">reviewed</span></div><div class=\"row\"><span><b style=\"font-weight:600\">api.md</b> <span style=\"color:var(--fg-muted)\">Every other status is&hellip;</span></span><span class=\"pill\">unreviewed</span></div></div><div class=\"rail\"><div class=\"rh\">Progress</div><div class=\"big\">2/4</div></div></div></div>"
 },
 {
  "id": "m14",
  "screen": "Review panel",
  "name": "A list of only what is still unreviewed",
  "why": "The list stays short and everything on it needs doing. But you never get the feeling of having finished, and nothing shows you what you already approved.",
  "card": "FL19",
  "cardq": "An exhaustible list of every changed span, or only unreviewed?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\"><h2>Review</h2><div class=\"rh\">Unreviewed: 2</div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Idempotency keys are&hellip;</span></span><span class=\"pill\">unreviewed</span></div><div class=\"row\"><span><b style=\"font-weight:600\">api.md</b> <span style=\"color:var(--fg-muted)\">Every other status is&hellip;</span></span><span class=\"pill\">unreviewed</span></div></div><div class=\"rail\"><div class=\"rh\">Progress</div><div class=\"big\">2</div><div style=\"color:var(--fg-muted);font-size:11.5px\">left to look at</div></div></div></div>"
 },
 {
  "id": "m15",
  "screen": "Review panel · states",
  "name": "Three states: changed, seen and reviewed",
  "why": "It separates \"I looked at it\" from \"I approved it\", which is how people actually read. The cost is a third state to learn, and every screen has to show it.",
  "card": "FL18",
  "cardq": "Does a span have a seen state between changed and reviewed?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\"><h2>Review</h2><div class=\"rh\">Three states</div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Backoff is exponential&hellip;</span></span><span class=\"pill\">reviewed</span></div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Idempotency keys are&hellip;</span></span><span class=\"pill\">seen</span></div><div class=\"row\"><span><b style=\"font-weight:600\">api.md</b> <span style=\"color:var(--fg-muted)\">Every other status is&hellip;</span></span><span class=\"pill\">changed</span></div></div><div class=\"rail\"><div class=\"rh\">Legend</div><div class=\"row\"><span>changed</span></div><div class=\"row\"><span>seen</span></div><div class=\"row\"><span>reviewed</span></div></div></div></div>"
 },
 {
  "id": "m16",
  "screen": "Review panel · states",
  "name": "Two states: changed and reviewed",
  "why": "Each change is either reviewed or it is not. Nothing to explain and nothing to set wrongly. But it cannot say \"I read it and I am not signing off yet\", which is honestly where most things sit.",
  "card": "FL18",
  "cardq": "Does a span have a seen state between changed and reviewed?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\"><h2>Review</h2><div class=\"rh\">Two states</div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Backoff is exponential&hellip;</span></span><span class=\"pill\">reviewed</span></div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Idempotency keys are&hellip;</span></span><span class=\"pill\">changed</span></div></div><div class=\"rail\"><div class=\"rh\">Legend</div><div class=\"row\"><span>changed</span></div><div class=\"row\"><span>reviewed</span></div></div></div></div>"
 },
 {
  "id": "m17",
  "screen": "Review panel · counter",
  "name": "The counter as a number",
  "why": "It is precise, and you know how big the job is before you start. But a number that never reaches zero stops getting noticed, which is what happens to most notification badges.",
  "card": "FL6",
  "cardq": "What does the review counter count, and may it be a dot?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md <span class=\"pill n\">6</span></span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode on\">Edit</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Unreviewed</div><div class=\"big\">6</div></div></div></div>"
 },
 {
  "id": "m18",
  "screen": "Review panel · counter",
  "name": "The counter as a dot",
  "why": "It tells you something is there without handing you a number to ignore or to race to zero. But you cannot tell one change from forty.",
  "card": "FL6",
  "cardq": "What does the review counter count, and may it be a dot?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md <span class=\"cnt-dot\"></span></span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode on\">Edit</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Unreviewed</div><div style=\"padding-top:6px\"><span class=\"cnt-dot\"></span></div></div></div></div>"
 },
 {
  "id": "m19",
  "screen": "Where the count shows",
  "name": "The count in one place, the side panel",
  "why": "The number lives in one place. Nothing competes with it, nothing counts twice, and there is only one thing to keep correct.",
  "card": "D4",
  "cardq": "How many surfaces carry the unreviewed count?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Unreviewed</div><div class=\"big\">6</div></div></div></div>"
 },
 {
  "id": "m20",
  "screen": "Where the count shows",
  "name": "The count in the file list, the tab and the side panel",
  "why": "You see it wherever you are. But three places showing one number means three places that can disagree, and the plan already has one count that contradicts itself.",
  "card": "D4",
  "cardq": "How many surfaces carry the unreviewed count?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md <span class=\"pill n\">6</span></span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode on\">Edit</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md <span class=\"pill n\" style=\"float:right\">6</span></div><div class=\"tr\"><span class=\"dot\"></span>api.md <span class=\"pill\" style=\"float:right\">2</span></div><div class=\"tr\">notes.md</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Unreviewed</div><div class=\"big\">6</div></div></div></div>"
 },
 {
  "id": "m21",
  "screen": "Repository summary",
  "name": "A percentage of the repository shown as unreviewed",
  "why": "The boldest version of the idea, and the one with the weakest evidence behind it. Hospital alert research found people ignore 55 to 98% of warnings once a number can never reach zero, and a repository percentage never does.",
  "card": "D23",
  "cardq": "Does any surface state a share of a repository as unreviewed?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\"><h2>fm/spec-kit</h2><div style=\"margin:18px 0\"><div class=\"big\" style=\"color:var(--danger)\">68%</div><div class=\"rh\">of this repository is unreviewed</div><div style=\"height:6px;background:var(--panel-2);border-radius:3px;margin-top:12px;overflow:hidden\"><div style=\"width:68%;height:100%;background:var(--danger);opacity:.5\"></div></div></div><p style=\"color:var(--fg-muted)\">28 of 41 files have spans nobody has looked at.</p></div><div class=\"rail\"><div class=\"rh\">By file</div><div class=\"row\"><span>spec.md</span><span>6</span></div><div class=\"row\"><span>api.md</span><span>2</span></div></div></div></div>"
 },
 {
  "id": "m22",
  "screen": "Hover card",
  "name": "A hover card showing who changed the text and how",
  "why": "The whole idea of tracking who wrote what, in one small card. But in the pilot there is usually no record of the prompt, so most cards would say \"prompt not recorded\".",
  "card": "D6",
  "cardq": "Does the attribution hover card ship in MVP-0?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><div class=\"hovercard\" style=\"left:32px;top:126px\"><b>Changed 2 hours ago</b><div style=\"color:var(--fg-muted);margin-top:6px\"><div class=\"row\"><span>Author</span><span>claude-opus-5</span></div><div class=\"row\"><span>Bytes</span><span>1204&ndash;1251</span></div><div class=\"row\"><span>Prompt</span><span style=\"color:var(--muted)\">not recorded</span></div></div></div><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Outline</div><div class=\"tr\">Retry policy</div></div></div></div>"
 },
 {
  "id": "m23",
  "screen": "Dark mode",
  "name": "Dark mode in the pilot",
  "why": "The highlight is harder to see on a dark background, and none of the review design has been tested there. Shipping it means the five-second readability test has to pass twice.",
  "card": "D21",
  "cardq": "Does dark mode ship at the pilot?",
  "html": "<div style=\"--bg:#0d0e11;--panel:#141519;--panel-2:rgba(255,255,255,.03);--fg:#e8e8ea;--fg-muted:#9b9ba3;--muted:#6b6b73;--border:rgba(255,255,255,.08);--border-strong:rgba(255,255,255,.14);--accent:#e8e8ea;--accent-fg:#0d0e11;--hover:rgba(255,255,255,.05);--link:#60a5fa;--tint:rgba(96,165,250,.12)\"><div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Unreviewed</div><div class=\"big\">6</div></div></div></div></div>"
 }
];
