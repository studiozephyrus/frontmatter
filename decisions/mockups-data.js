window.MOCKUPS = [
 {
  "id": "m01",
  "screen": "Launcher",
  "name": "Templates, with recent files sorted unreviewed first",
  "why": "You see what needs reading before you pick anything. The cost is a moment of looking around every time you open the app.",
  "card": "FL12",
  "cardq": "What a stranger meets in the first thirty seconds",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><h2>Open something</h2><div style=\"display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0\"><div class=\"tmpl\">Blank document</div><div class=\"tmpl\">Spec</div><div class=\"tmpl\">Meeting note</div><div class=\"tmpl\">Decision record</div></div><div class=\"rh\">Recent</div><div class=\"row\"><span>spec.md <span class=\"pill n\">6 unreviewed</span></span><span style=\"color:var(--muted)\">2h</span></div><div class=\"row\"><span>api.md <span class=\"pill n\">2 unreviewed</span></span><span style=\"color:var(--muted)\">yesterday</span></div><div class=\"row\"><span>notes.md</span><span style=\"color:var(--muted)\">3d</span></div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "m02",
  "screen": "Launcher",
  "name": "One folder button and nothing else",
  "why": "The fastest first thirty seconds there is. Nothing to read, one thing to do. But it hides review state until a document is open, so a first-time user never sees what the product is for.",
  "card": "FL12",
  "cardq": "What a stranger meets in the first thirty seconds",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><div class=\"center\"><h2 style=\"font-size:22px\">Open a folder</h2><div style=\"color:var(--fg-muted);max-width:38ch;text-align:center\">Your files stay yours. Nothing is uploaded and no account is needed.</div><div style=\"background:var(--accent);color:var(--accent-fg);padding:8px 18px;border-radius:var(--r);font-size:13px\">Choose folder</div></div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n01",
  "screen": "Launcher",
  "name": "Templates are files you start from",
  "why": "Plain and predictable. A template opens as a document you edit. It asks nothing of you, and it teaches nothing about the kit.",
  "card": "F27",
  "cardq": "Are the launcher's four templates files or generator prompts",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><h2>Start something</h2><div style=\"display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0\"><div class=\"tmpl\">Blank document</div><div class=\"tmpl\">Spec</div><div class=\"tmpl\">Meeting note</div><div class=\"tmpl\">Decision record</div></div><div class=\"rh\">Recent</div><div class=\"row\"><span>booking-app/00-BRIEF.md</span><span style=\"color:var(--muted)\">2h</span></div><div class=\"row\"><span>notes/reading.md</span><span style=\"color:var(--muted)\">yesterday</span></div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n02",
  "screen": "Launcher",
  "name": "The first template starts a project from a prompt",
  "why": "The funnel is on the first screen. A stranger meets the thing that makes us different before they meet an empty page. The risk is that it reads as an AI toy.",
  "card": "F27",
  "cardq": "Are the launcher's four templates files or generator prompts",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><h2>Start something</h2><div style=\"display:grid;gap:10px;margin:14px 0\"><div class=\"tmpl\" style=\"border-color:var(--border-strong)\"><b>Start a project from a prompt</b><div style=\"color:var(--fg-muted);font-size:12px;margin-top:4px\">Describe it, answer a few questions, get a document set and a prompt for your coding agent</div></div></div><div style=\"display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0\"><div class=\"tmpl\">Blank document</div><div class=\"tmpl\">Spec</div><div class=\"tmpl\">Meeting note</div><div class=\"tmpl\">Decision record</div></div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n03",
  "screen": "Launcher",
  "name": "Two ways in, kept apart",
  "why": "A row for writing and a row for generating. Nobody has to work out which one they want, and the generator does not crowd the blank page.",
  "card": "F27",
  "cardq": "Are the launcher's four templates files or generator prompts",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><h2>Start something</h2><div class=\"rh\">Write</div><div style=\"display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0\"><div class=\"tmpl\">Blank document</div><div class=\"tmpl\">Meeting note</div></div><div class=\"rh\">Generate a project</div><div style=\"display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0\"><div class=\"tmpl\">From a prompt</div><div class=\"tmpl\">From a repository</div></div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n04",
  "screen": "Launcher",
  "name": "Search in the header, always there",
  "why": "One place, on every screen. Costs a slot in the top bar and needs an index that works before the first document is open.",
  "card": "F25",
  "cardq": "Where the search index lives",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><div class=\"row\" style=\"border:1px solid var(--border-strong);border-radius:var(--r);padding:8px 10px;margin-bottom:14px\"><span style=\"color:var(--muted)\">Search your documents</span><span style=\"color:var(--muted)\">/</span></div><h2>Recent</h2><div class=\"row\"><span>booking-app/00-BRIEF.md</span><span style=\"color:var(--muted)\">2h</span></div><div class=\"row\"><span>notes/reading.md</span><span style=\"color:var(--muted)\">yesterday</span></div><div class=\"row\"><span>booking-app/01-PRODUCT.md</span><span style=\"color:var(--muted)\">3d</span></div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n05",
  "screen": "Launcher",
  "name": "Search is a shortcut, not a box",
  "why": "Keeps the screen quiet. Cmd K opens it over whatever you are doing. People who do not know the shortcut never find it.",
  "card": "F25",
  "cardq": "Where the search index lives",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><h2>Start something</h2><div style=\"display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0\"><div class=\"tmpl\">Blank document</div><div class=\"tmpl\">Spec</div><div class=\"tmpl\">Meeting note</div><div class=\"tmpl\">Decision record</div></div><div style=\"margin-top:18px;color:var(--muted);font-size:12px\">Press <span class=\"pill\">Cmd K</span> to search</div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "m09",
  "screen": "Editor",
  "name": "Four modes: Live, Edit, Split and Read",
  "why": "This is what your July screenshot showed and what the plan still carries. Four is one more than most editors have, and Live is the one mode that cannot work inside a VS Code extension.",
  "card": "D8",
  "cardq": "Four editor modes for MVP-0, or cut to three?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Outline</div><div class=\"tr\">Retry policy</div><div class=\"tr\">Backoff</div><div class=\"tr\">Idempotency</div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "m10",
  "screen": "Editor",
  "name": "Three modes: Edit, Split and Read",
  "why": "Drops Live, the one mode that cannot be built inside VS Code, so the same three work everywhere. That only matters if you decide to ship as an extension.",
  "card": "D8",
  "cardq": "Four editor modes for MVP-0, or cut to three?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Outline</div><div class=\"tr\">Retry policy</div><div class=\"tr\">Backoff</div><div class=\"tr\">Idempotency</div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "m23",
  "screen": "Editor",
  "name": "Dark mode in the pilot",
  "why": "The highlight is harder to see on a dark background, and none of the review design has been tested there. Shipping it means the five-second readability test has to pass twice.",
  "card": "D21",
  "cardq": "Does dark mode ship at the pilot?",
  "html": "<div style=\"--bg:#0d0e11;--panel:#141519;--panel-2:rgba(255,255,255,.03);--fg:#e8e8ea;--fg-muted:#9b9ba3;--muted:#6b6b73;--border:rgba(255,255,255,.08);--border-strong:rgba(255,255,255,.14);--accent:#e8e8ea;--accent-fg:#0d0e11;--hover:rgba(255,255,255,.05);--link:#60a5fa;--tint:rgba(96,165,250,.12)\"><div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Unreviewed</div><div class=\"big\">6</div></div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n06",
  "screen": "Editor",
  "name": "Plain tabs, as the shell ships today",
  "why": "Nothing to build. The tab strip is the sibling's, unchanged, which is also the point of the fork question.",
  "card": "FF3",
  "cardq": "What to do about the shell being a fork",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Projects</div><div class=\"row on\"><span>booking app</span></div><div class=\"row\"><span style=\"padding-left:12px\">00-BRIEF.md</span></div><div class=\"row\"><span style=\"padding-left:12px\">01-PRODUCT.md</span></div><div class=\"row\"><span>notes</span></div></div><div class=\"doc\"><div class=\"tabs\"><span class=\"tab on\">00-BRIEF</span><span class=\"tab\">01-PRODUCT</span><span class=\"tab\">notes</span></div><h2>Booking app brief</h2><p style=\"color:var(--fg-muted);line-height:1.6\">A small service that takes a slot, holds it for ten minutes, and confirms on payment. The first user is a studio owner with one room to let.</p></div><div class=\"rail\"><div class=\"rh\">This document</div><div class=\"row\"><span>Outline</span></div><div class=\"row\"><span>Tags</span></div><div class=\"row\"><span>Bookmarks</span></div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n07",
  "screen": "Editor",
  "name": "Coloured tabs, one per project",
  "why": "You can tell two documents apart at a glance when six are open. It is the one visible difference from the sibling on the first screen.",
  "card": "FF3",
  "cardq": "What to do about the shell being a fork",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Projects</div><div class=\"row on\"><span>booking app</span></div><div class=\"row\"><span style=\"padding-left:12px\">00-BRIEF.md</span></div><div class=\"row\"><span style=\"padding-left:12px\">01-PRODUCT.md</span></div><div class=\"row\"><span>notes</span></div></div><div class=\"doc\"><div class=\"tabs\"><span class=\"tab on\" style=\"border-bottom:2px solid var(--link)\">00-BRIEF</span><span class=\"tab\" style=\"border-bottom:2px solid var(--success)\">01-PRODUCT</span><span class=\"tab\" style=\"border-bottom:2px solid var(--danger)\">notes</span></div><h2>Booking app brief</h2><p style=\"color:var(--fg-muted);line-height:1.6\">A small service that takes a slot, holds it for ten minutes, and confirms on payment. The first user is a studio owner with one room to let.</p></div><div class=\"rail\"><div class=\"rh\">This document</div><div class=\"row\"><span>Outline</span></div><div class=\"row\"><span>Tags</span></div><div class=\"row\"><span>Bookmarks</span></div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n08",
  "screen": "Editor",
  "name": "Tab indents the line",
  "why": "What a writer expects in a markdown editor, and what every editor they came from does. It traps keyboard users who need Tab to move on.",
  "card": "D15",
  "cardq": "Does Tab indent in the editor, or move focus",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><div class=\"tabs\"><span class=\"tab on\">00-BRIEF</span><span class=\"tab\">01-PRODUCT</span><span class=\"tab\">notes</span></div><p style=\"line-height:1.7\">- a list item<br><span style=\"padding-left:22px;background:var(--selected)\">- indented by Tab</span></p><div style=\"color:var(--muted);font-size:12px;margin-top:10px\">Tab indents. Escape then Tab moves focus out.</div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n09",
  "screen": "Editor",
  "name": "Tab moves focus, Cmd bracket indents",
  "why": "Keyboard users can always leave the editor. Every writer who types Tab gets a surprise the first time.",
  "card": "D15",
  "cardq": "Does Tab indent in the editor, or move focus",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><div class=\"tabs\"><span class=\"tab on\">00-BRIEF</span><span class=\"tab\">01-PRODUCT</span><span class=\"tab\">notes</span></div><p style=\"line-height:1.7\">- a list item<br>- another</p><div style=\"color:var(--muted);font-size:12px;margin-top:10px\">Tab leaves the editor. <span class=\"pill\">Cmd ]</span> indents.</div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n20",
  "screen": "Editor",
  "name": "Toolbar visible, everything within reach",
  "why": "A stranger can bold a word without knowing markdown. It is a row of controls on a screen whose whole claim is that it stays out of the way.",
  "card": "FL3",
  "cardq": "Do the table stakes interaction days go into the pilot",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Projects</div><div class=\"row on\"><span>booking app</span></div><div class=\"row\"><span style=\"padding-left:12px\">00-BRIEF.md</span></div><div class=\"row\"><span style=\"padding-left:12px\">01-PRODUCT.md</span></div><div class=\"row\"><span>notes</span></div></div><div class=\"doc\"><div class=\"tabs\"><span class=\"tab on\">00-BRIEF</span><span class=\"tab\">01-PRODUCT</span><span class=\"tab\">notes</span></div><div class=\"strip\" style=\"margin-bottom:10px\"><span class=\"pill\">B</span><span class=\"pill\">I</span><span class=\"pill\">Link</span><span class=\"pill\">List</span><span class=\"pill\">Code</span><span class=\"pill\">Export</span></div><h2>Booking app brief</h2><p style=\"color:var(--fg-muted);line-height:1.6\">A small service that takes a slot, holds it for ten minutes, and confirms on payment. The first user is a studio owner with one room to let.</p></div><div class=\"rail\"><div class=\"rh\">This document</div><div class=\"row\"><span>Outline</span></div><div class=\"row\"><span>History</span></div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n21",
  "screen": "Editor",
  "name": "No toolbar, shortcuts and the palette",
  "why": "The document is the screen. Everything is a keystroke, and a stranger who does not know markdown has nothing to click.",
  "card": "FL3",
  "cardq": "Do the table stakes interaction days go into the pilot",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Projects</div><div class=\"row on\"><span>booking app</span></div><div class=\"row\"><span style=\"padding-left:12px\">00-BRIEF.md</span></div><div class=\"row\"><span style=\"padding-left:12px\">01-PRODUCT.md</span></div><div class=\"row\"><span>notes</span></div></div><div class=\"doc\"><div class=\"tabs\"><span class=\"tab on\">00-BRIEF</span><span class=\"tab\">01-PRODUCT</span><span class=\"tab\">notes</span></div><h2>Booking app brief</h2><p style=\"color:var(--fg-muted);line-height:1.6\">A small service that takes a slot, holds it for ten minutes, and confirms on payment. The first user is a studio owner with one room to let.</p><div style=\"margin-top:14px;color:var(--muted);font-size:12px\"><span class=\"pill\">Cmd K</span> for everything</div></div><div class=\"rail\"><div class=\"rh\">This document</div><div class=\"row\"><span>Outline</span></div><div class=\"row\"><span>History</span></div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n10",
  "screen": "Right rail",
  "name": "Everything stays, as it ships today",
  "why": "No work. The rail carries six things and a stranger has to learn all of them before the one they wanted.",
  "card": "F18",
  "cardq": "Do bookmarks and graph view get deleted, demoted, or left",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Projects</div><div class=\"row on\"><span>booking app</span></div><div class=\"row\"><span style=\"padding-left:12px\">00-BRIEF.md</span></div><div class=\"row\"><span style=\"padding-left:12px\">01-PRODUCT.md</span></div><div class=\"row\"><span>notes</span></div></div><div class=\"doc\"><div class=\"tabs\"><span class=\"tab on\">00-BRIEF</span><span class=\"tab\">01-PRODUCT</span><span class=\"tab\">notes</span></div><h2>Booking app brief</h2><p style=\"color:var(--fg-muted);line-height:1.6\">A small service that takes a slot, holds it for ten minutes, and confirms on payment. The first user is a studio owner with one room to let.</p></div><div class=\"rail\"><div class=\"rh\">This document</div><div class=\"row\"><span>Outline</span></div><div class=\"row\"><span>Tags</span></div><div class=\"row\"><span>Bookmarks</span></div><div class=\"row\"><span>Graph</span></div><div class=\"row\"><span>History</span></div><div class=\"row\"><span>Comments</span></div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n11",
  "screen": "Right rail",
  "name": "Outline and history only, the rest in the palette",
  "why": "Two things in the rail, the rest one keystroke away. The plan's own rule is one job per screen, and this is it applied.",
  "card": "F18",
  "cardq": "Do bookmarks and graph view get deleted, demoted, or left",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Projects</div><div class=\"row on\"><span>booking app</span></div><div class=\"row\"><span style=\"padding-left:12px\">00-BRIEF.md</span></div><div class=\"row\"><span style=\"padding-left:12px\">01-PRODUCT.md</span></div><div class=\"row\"><span>notes</span></div></div><div class=\"doc\"><div class=\"tabs\"><span class=\"tab on\">00-BRIEF</span><span class=\"tab\">01-PRODUCT</span><span class=\"tab\">notes</span></div><h2>Booking app brief</h2><p style=\"color:var(--fg-muted);line-height:1.6\">A small service that takes a slot, holds it for ten minutes, and confirms on payment. The first user is a studio owner with one room to let.</p></div><div class=\"rail\"><div class=\"rh\">This document</div><div class=\"row\"><span>Outline</span></div><div class=\"row\"><span>History</span></div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n12",
  "screen": "Right rail",
  "name": "Collapsed by default, opens on click",
  "why": "The document gets the width. The rail is there when you want it and invisible when you do not. People may never open it.",
  "card": "F18",
  "cardq": "Do bookmarks and graph view get deleted, demoted, or left",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Projects</div><div class=\"row on\"><span>booking app</span></div><div class=\"row\"><span style=\"padding-left:12px\">00-BRIEF.md</span></div><div class=\"row\"><span style=\"padding-left:12px\">01-PRODUCT.md</span></div><div class=\"row\"><span>notes</span></div></div><div class=\"doc\" style=\"flex:1\"><div class=\"tabs\"><span class=\"tab on\">00-BRIEF</span><span class=\"tab\">01-PRODUCT</span><span class=\"tab\">notes</span></div><h2>Booking app brief</h2><p style=\"color:var(--fg-muted);line-height:1.6\">A small service that takes a slot, holds it for ten minutes, and confirms on payment. The first user is a studio owner with one room to let.</p></div><div class=\"rail\" style=\"width:38px;text-align:center;color:var(--muted)\"><div style=\"writing-mode:vertical-rl;padding:10px 0;font-size:11px\">Outline</div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "m11",
  "screen": "AI panel",
  "name": "AI prompt docked under the document",
  "why": "Always there and never in the way, with room to show what the AI is doing. Your mockup put it here. It is also the furthest point on the screen from where you are typing.",
  "card": "D7",
  "cardq": "Does the AI prompt summon at the cursor, or stay docked?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Outline</div><div class=\"tr\">Retry policy</div></div></div><div class=\"strip\"><span style=\"color:var(--muted)\">Ask frontmatter to edit this document</span><span class=\"pill\" style=\"margin-left:auto\">&#8984;K</span></div></div>",
  "stage": "mvp"
 },
 {
  "id": "m12",
  "screen": "AI panel",
  "name": "AI prompt that opens at the cursor",
  "why": "It opens where you are already looking, and the edit lands right there. An earlier review of your mockup asked for exactly this change.",
  "card": "D7",
  "cardq": "Does the AI prompt summon at the cursor, or stay docked?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><div class=\"cursor-pop\" style=\"left:30px;top:132px;width:290px\"><span style=\"color:var(--muted)\">Edit this paragraph&hellip;</span><span class=\"pill\" style=\"float:right\">&#8984;K</span></div><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Outline</div><div class=\"tr\">Retry policy</div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n13",
  "screen": "AI panel",
  "name": "Two verbs, as the plan specifies",
  "why": "Fix this, or critique this. Two things to learn, and the panel fits on one line. Anything else the code already does becomes unreachable.",
  "card": "F8",
  "cardq": "Two verbs or the eight the code already has",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><div class=\"tabs\"><span class=\"tab on\">00-BRIEF</span><span class=\"tab\">01-PRODUCT</span><span class=\"tab\">notes</span></div><h2>Booking app brief</h2><p style=\"color:var(--fg-muted);line-height:1.6\">A small service that takes a slot, holds it for ten minutes, and confirms on payment. The first user is a studio owner with one room to let.</p><div class=\"strip\" style=\"margin-top:16px\"><span class=\"pill\">Fix this</span><span class=\"pill\">Critique this</span></div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n14",
  "screen": "AI panel",
  "name": "Eight verbs, grouped",
  "why": "Everything the code can already do is reachable. It is a menu on the first screen, and the positioning says we hide AI until it is asked for.",
  "card": "F8",
  "cardq": "Two verbs or the eight the code already has",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><div class=\"tabs\"><span class=\"tab on\">00-BRIEF</span><span class=\"tab\">01-PRODUCT</span><span class=\"tab\">notes</span></div><h2>Booking app brief</h2><p style=\"color:var(--fg-muted);line-height:1.6\">A small service that takes a slot, holds it for ten minutes, and confirms on payment. The first user is a studio owner with one room to let.</p><div class=\"strip\" style=\"margin-top:16px;flex-wrap:wrap;gap:6px\"><span class=\"pill\">Fix</span><span class=\"pill\">Critique</span><span class=\"pill\">Summarise</span><span class=\"pill\">Expand</span><span class=\"pill\">Shorten</span><span class=\"pill\">Rewrite</span><span class=\"pill\">Translate</span><span class=\"pill\">Explain</span></div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n15",
  "screen": "AI panel",
  "name": "One switch, and the surfaces go",
  "why": "Flip it and no AI control appears anywhere. It is the promise in the positioning, kept literally, and it is easy to demonstrate.",
  "card": "F9",
  "cardq": "What the hide all AI switch actually hides",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><div class=\"tabs\"><span class=\"tab on\">00-BRIEF</span><span class=\"tab\">01-PRODUCT</span><span class=\"tab\">notes</span></div><h2>Booking app brief</h2><p style=\"color:var(--fg-muted);line-height:1.6\">A small service that takes a slot, holds it for ten minutes, and confirms on payment. The first user is a studio owner with one room to let.</p><div style=\"margin-top:16px;color:var(--muted);font-size:12px\">AI is off. No writing box, no edit menu, no suggestions.</div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n16",
  "screen": "AI panel",
  "name": "The switch hides the surfaces, the menu stays",
  "why": "The feature is still discoverable for someone who wants it back. A person who turned it off still sees the word AI, which is the thing they objected to.",
  "card": "F9",
  "cardq": "What the hide all AI switch actually hides",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><div class=\"tabs\"><span class=\"tab on\">00-BRIEF</span><span class=\"tab\">01-PRODUCT</span><span class=\"tab\">notes</span></div><h2>Booking app brief</h2><p style=\"color:var(--fg-muted);line-height:1.6\">A small service that takes a slot, holds it for ten minutes, and confirms on payment. The first user is a studio owner with one room to let.</p><div class=\"strip\" style=\"margin-top:16px\"><span class=\"pill\" style=\"color:var(--muted)\">AI is off</span></div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n17",
  "screen": "Kit page",
  "name": "The kit, with the prompt to copy",
  "why": "One screen, one job: hand the work to an agent. The files are listed so a person can see what they are handing over.",
  "card": "G12",
  "cardq": "Do exported and shared pages carry a frontmatter mark",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><h2>Booking app</h2><div style=\"color:var(--fg-muted);font-size:12px;margin-bottom:12px\">Seven documents, version 1</div><div class=\"row\"><span>00-BRIEF.md</span><span style=\"color:var(--muted)\">1.2 kB</span></div><div class=\"row\"><span>01-PRODUCT.md</span><span style=\"color:var(--muted)\">3.4 kB</span></div><div class=\"row\"><span>02-DATA-AND-API.md</span><span style=\"color:var(--muted)\">2.8 kB</span></div><div class=\"row\"><span>specs/booking.md</span><span style=\"color:var(--muted)\">1.9 kB</span></div><div class=\"dwhy\" style=\"margin-top:14px\"><b>Copy this into your agent</b><div style=\"font-family:var(--font-mono,monospace);font-size:11px;margin-top:6px;color:var(--fg-muted)\">mkdir -p docs/kit &amp;&amp; curl -sL .../kit.tar.gz | tar xz -C docs/kit</div></div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n18",
  "screen": "Kit page",
  "name": "The kit, with a mark back to us",
  "why": "Every shared kit carries a line home. It is the whole organic channel in the plan, and paying removes it.",
  "card": "G12",
  "cardq": "Do exported and shared pages carry a frontmatter mark",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><h2>Booking app</h2><div class=\"row\"><span>00-BRIEF.md</span><span style=\"color:var(--muted)\">1.2 kB</span></div><div class=\"row\"><span>01-PRODUCT.md</span><span style=\"color:var(--muted)\">3.4 kB</span></div><div style=\"margin-top:18px;padding-top:10px;border-top:1px solid var(--border);color:var(--muted);font-size:12px\">Made with frontmatter <span class=\"pill\">Open in frontmatter</span></div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "n19",
  "screen": "Kit page",
  "name": "No mark, and the link is bare",
  "why": "Nothing about us on a page someone shares with their team. Cleaner for them, and the funnel loses its only free channel.",
  "card": "G12",
  "cardq": "Do exported and shared pages carry a frontmatter mark",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">booking app</span></div><div class=\"body\"><div class=\"doc\"><h2>Booking app</h2><div class=\"row\"><span>00-BRIEF.md</span><span style=\"color:var(--muted)\">1.2 kB</span></div><div class=\"row\"><span>01-PRODUCT.md</span><span style=\"color:var(--muted)\">3.4 kB</span></div><div class=\"row\"><span>02-DATA-AND-API.md</span><span style=\"color:var(--muted)\">2.8 kB</span></div></div></div></div>",
  "stage": "mvp"
 },
 {
  "id": "m03",
  "screen": "Launcher",
  "name": "A summary card the first time you open a repository",
  "why": "Tells you what you are looking at before you touch anything. On a repository frontmatter has never seen, nothing has been reviewed yet, so the card says zero rather than implying otherwise.",
  "card": "FL14",
  "cardq": "The baseline on first open of a repo we have never seen",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span></div><div class=\"body\"><div class=\"doc\"><h2>fm/spec-kit</h2><div style=\"display:flex;gap:26px;margin:16px 0 18px\"><div><div class=\"big\">41</div><div class=\"rh\">markdown files</div></div><div><div class=\"big\">0</div><div class=\"rh\">reviewed by anyone</div></div><div><div class=\"big\">none</div><div class=\"rh\">agent writes seen</div></div></div><p style=\"color:var(--fg-muted)\">Nothing here has been reviewed in frontmatter yet. That is the starting point, not a warning.</p><div style=\"background:var(--accent);color:var(--accent-fg);padding:7px 14px;border-radius:var(--r);display:inline-block;font-size:12.5px;margin-top:8px\">Start from the newest change</div></div></div></div>",
  "stage": "after"
 },
 {
  "id": "m13",
  "screen": "Review panel",
  "name": "A list of every change, that you can finish",
  "why": "You can get to the end of it, and reaching the end means something. But research on hospital alert systems found people ignore 55 to 98% of warnings once a list gets too long to finish.",
  "card": "FL19",
  "cardq": "An exhaustible list of every changed span, or only unreviewed?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\"><h2>Review</h2><div class=\"rh\">All changes since your last review: 4</div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Backoff is exponential&hellip;</span></span><span class=\"pill\">reviewed</span></div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Idempotency keys are&hellip;</span></span><span class=\"pill\">unreviewed</span></div><div class=\"row\"><span><b style=\"font-weight:600\">api.md</b> <span style=\"color:var(--fg-muted)\">The client retries on&hellip;</span></span><span class=\"pill\">reviewed</span></div><div class=\"row\"><span><b style=\"font-weight:600\">api.md</b> <span style=\"color:var(--fg-muted)\">Every other status is&hellip;</span></span><span class=\"pill\">unreviewed</span></div></div><div class=\"rail\"><div class=\"rh\">Progress</div><div class=\"big\">2/4</div></div></div></div>",
  "stage": "after"
 },
 {
  "id": "m14",
  "screen": "Review panel",
  "name": "A list of only what is still unreviewed",
  "why": "The list stays short and everything on it needs doing. But you never get the feeling of having finished, and nothing shows you what you already approved.",
  "card": "FL19",
  "cardq": "An exhaustible list of every changed span, or only unreviewed?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\"><h2>Review</h2><div class=\"rh\">Unreviewed: 2</div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Idempotency keys are&hellip;</span></span><span class=\"pill\">unreviewed</span></div><div class=\"row\"><span><b style=\"font-weight:600\">api.md</b> <span style=\"color:var(--fg-muted)\">Every other status is&hellip;</span></span><span class=\"pill\">unreviewed</span></div></div><div class=\"rail\"><div class=\"rh\">Progress</div><div class=\"big\">2</div><div style=\"color:var(--fg-muted);font-size:11.5px\">left to look at</div></div></div></div>",
  "stage": "after"
 },
 {
  "id": "m15",
  "screen": "Review panel",
  "name": "Three states: changed, seen and reviewed",
  "why": "It separates \"I looked at it\" from \"I approved it\", which is how people actually read. The cost is a third state to learn, and every screen has to show it.",
  "card": "FL18",
  "cardq": "Does a span have a seen state between changed and reviewed?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\"><h2>Review</h2><div class=\"rh\">Three states</div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Backoff is exponential&hellip;</span></span><span class=\"pill\">reviewed</span></div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Idempotency keys are&hellip;</span></span><span class=\"pill\">seen</span></div><div class=\"row\"><span><b style=\"font-weight:600\">api.md</b> <span style=\"color:var(--fg-muted)\">Every other status is&hellip;</span></span><span class=\"pill\">changed</span></div></div><div class=\"rail\"><div class=\"rh\">Legend</div><div class=\"row\"><span>changed</span></div><div class=\"row\"><span>seen</span></div><div class=\"row\"><span>reviewed</span></div></div></div></div>",
  "stage": "after"
 },
 {
  "id": "m16",
  "screen": "Review panel",
  "name": "Two states: changed and reviewed",
  "why": "Each change is either reviewed or it is not. Nothing to explain and nothing to set wrongly. But it cannot say \"I read it and I am not signing off yet\", which is honestly where most things sit.",
  "card": "FL18",
  "cardq": "Does a span have a seen state between changed and reviewed?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\"><h2>Review</h2><div class=\"rh\">Two states</div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Backoff is exponential&hellip;</span></span><span class=\"pill\">reviewed</span></div><div class=\"row\"><span><b style=\"font-weight:600\">spec.md</b> <span style=\"color:var(--fg-muted)\">Idempotency keys are&hellip;</span></span><span class=\"pill\">changed</span></div></div><div class=\"rail\"><div class=\"rh\">Legend</div><div class=\"row\"><span>changed</span></div><div class=\"row\"><span>reviewed</span></div></div></div></div>",
  "stage": "after"
 },
 {
  "id": "m17",
  "screen": "Review panel",
  "name": "The counter as a number",
  "why": "It is precise, and you know how big the job is before you start. But a number that never reaches zero stops getting noticed, which is what happens to most notification badges.",
  "card": "FL6",
  "cardq": "What does the review counter count, and may it be a dot?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md <span class=\"pill n\">6</span></span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode on\">Edit</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Unreviewed</div><div class=\"big\">6</div></div></div></div>",
  "stage": "after"
 },
 {
  "id": "m18",
  "screen": "Review panel",
  "name": "The counter as a dot",
  "why": "It tells you something is there without handing you a number to ignore or to race to zero. But you cannot tell one change from forty.",
  "card": "FL6",
  "cardq": "What does the review counter count, and may it be a dot?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md <span class=\"cnt-dot\"></span></span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode on\">Edit</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Unreviewed</div><div style=\"padding-top:6px\"><span class=\"cnt-dot\"></span></div></div></div></div>",
  "stage": "after"
 },
 {
  "id": "m19",
  "screen": "Review panel",
  "name": "The count in one place, the side panel",
  "why": "The number lives in one place. Nothing competes with it, nothing counts twice, and there is only one thing to keep correct.",
  "card": "D4",
  "cardq": "How many surfaces carry the unreviewed count?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Unreviewed</div><div class=\"big\">6</div></div></div></div>",
  "stage": "after"
 },
 {
  "id": "m20",
  "screen": "Review panel",
  "name": "The count in the file list, the tab and the side panel",
  "why": "You see it wherever you are. But three places showing one number means three places that can disagree, and the plan already has one count that contradicts itself.",
  "card": "D4",
  "cardq": "How many surfaces carry the unreviewed count?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md <span class=\"pill n\">6</span></span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode on\">Edit</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md <span class=\"pill n\" style=\"float:right\">6</span></div><div class=\"tr\"><span class=\"dot\"></span>api.md <span class=\"pill\" style=\"float:right\">2</span></div><div class=\"tr\">notes.md</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Unreviewed</div><div class=\"big\">6</div></div></div></div>",
  "stage": "after"
 },
 {
  "id": "m21",
  "screen": "Review panel",
  "name": "A percentage of the repository shown as unreviewed",
  "why": "The boldest version of the idea, and the one with the weakest evidence behind it. Hospital alert research found people ignore 55 to 98% of warnings once a number can never reach zero, and a repository percentage never does.",
  "card": "D23",
  "cardq": "Does any surface state a share of a repository as unreviewed?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\"><h2>fm/spec-kit</h2><div style=\"margin:18px 0\"><div class=\"big\" style=\"color:var(--danger)\">68%</div><div class=\"rh\">of this repository is unreviewed</div><div style=\"height:6px;background:var(--panel-2);border-radius:3px;margin-top:12px;overflow:hidden\"><div style=\"width:68%;height:100%;background:var(--danger);opacity:.5\"></div></div></div><p style=\"color:var(--fg-muted)\">28 of 41 files have spans nobody has looked at.</p></div><div class=\"rail\"><div class=\"rh\">By file</div><div class=\"row\"><span>spec.md</span><span>6</span></div><div class=\"row\"><span>api.md</span><span>2</span></div></div></div></div>",
  "stage": "after"
 },
 {
  "id": "m04",
  "screen": "Review highlight",
  "name": "Colour wash only, as it ships today",
  "why": "This is what ships now. The highlight is barely darker than the page, at 1.11 to 1 where accessibility guidance asks for 3 to 1, and a colour-blind reader cannot see it at all.",
  "card": "D1",
  "cardq": "Does the tint stay colour-only, or gain a second channel?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Changed</div><div class=\"row\"><span>1 span</span><span class=\"pill\">unreviewed</span></div></div></div></div>",
  "stage": "after"
 },
 {
  "id": "m05",
  "screen": "Review highlight",
  "name": "Colour wash plus a line down the left edge",
  "why": "The same wash, plus a thin line on the left that still shows in greyscale and to colour-blind readers. It costs one extra column of pixels and fixes the accessibility problem.",
  "card": "D1",
  "cardq": "Does the tint stay colour-only, or gain a second channel?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint-rule'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Changed</div><div class=\"row\"><span>1 span</span><span class=\"pill\">unreviewed</span></div></div></div></div>",
  "stage": "after"
 },
 {
  "id": "m06",
  "screen": "Review highlight",
  "name": "Underline only, with no wash",
  "why": "The quietest of the three, and the only one that still works on a printed page. But you lose the quick sense of how much changed, so on a long document you have to scan it to find out.",
  "card": "D1",
  "cardq": "Does the tint stay colour-only, or gain a second channel?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint-ul'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Changed</div><div class=\"row\"><span>1 span</span><span class=\"pill\">unreviewed</span></div></div></div></div>",
  "stage": "after"
 },
 {
  "id": "m07",
  "screen": "Review highlight",
  "name": "Two colours, one for suggested and one for unreviewed",
  "why": "Separates what the AI is suggesting from what it has already written. The cost is two colours to learn, and the second one is hard to tell apart unless you see both together.",
  "card": "D2",
  "cardq": "Two washes, or one bordered highlight?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='prop'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p><span class='tint'>Idempotency keys are required on every write.</span> The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Legend</div><div class=\"row\"><span><span class=\"prop\">&nbsp;&nbsp;&nbsp;</span> proposed</span></div><div class=\"row\"><span><span class=\"tint\">&nbsp;&nbsp;&nbsp;</span> unreviewed</span></div></div></div></div>",
  "stage": "after"
 },
 {
  "id": "m08",
  "screen": "Review highlight",
  "name": "One bordered highlight, with the detail in the side panel",
  "why": "The document stays simple with one kind of mark, and the side panel says whether it is suggested or unreviewed. You need one extra glance to tell which is which.",
  "card": "D2",
  "cardq": "Two washes, or one bordered highlight?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='bord'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">This span</div><div class=\"row\"><span>State</span><span class=\"pill\">proposed</span></div><div class=\"row\"><span>By</span><span>claude-opus</span></div><div style=\"margin-top:10px;display:flex;gap:6px\"><span class=\"pill n\">Accept</span><span class=\"pill\">Revert</span></div></div></div></div>",
  "stage": "after"
 },
 {
  "id": "m22",
  "screen": "Attribution",
  "name": "A hover card showing who changed the text and how",
  "why": "The whole idea of tracking who wrote what, in one small card. But in the pilot there is usually no record of the prompt, so most cards would say \"prompt not recorded\".",
  "card": "D6",
  "cardq": "Does the attribution hover card ship in MVP-0?",
  "html": "<div class=\"app\"><div class=\"bar\"><span class=\"logo\">frontmatter</span><div class=\"tabs\"><span class=\"tab on\">spec.md</span><span class=\"tab\">notes.md</span></div><div class=\"modes\"><span class=\"mode\">Live</span><span class=\"mode on\">Edit</span><span class=\"mode\">Split</span><span class=\"mode\">Read</span></div></div><div class=\"body\"><div class=\"tree\"><div class=\"rh\">Vault</div><div class=\"tr on\"><span class=\"dot\"></span>spec.md</div><div class=\"tr\"><span class=\"dot\"></span>api.md</div><div class=\"tr\">notes.md</div><div class=\"tr\">readme.md</div><div class=\"rh\" style=\"margin-top:14px\">Tags</div><div class=\"tr\">#draft</div><div class=\"tr\">#review</div></div><div class=\"doc\" style=\"position:relative\"><div class=\"hovercard\" style=\"left:32px;top:126px\"><b>Changed 2 hours ago</b><div style=\"color:var(--fg-muted);margin-top:6px\"><div class=\"row\"><span>Author</span><span>claude-opus-5</span></div><div class=\"row\"><span>Bytes</span><span>1204&ndash;1251</span></div><div class=\"row\"><span>Prompt</span><span style=\"color:var(--muted)\">not recorded</span></div></div></div><h2>Retry policy</h2><p>The client retries on 429 and 503 only. Every other status is terminal and surfaces to the caller.</p><p><span class='tint'>Backoff is exponential with full jitter, capped at thirty seconds.</span> The cap exists because a synchronised retry storm is worse than a slow recovery.</p><p>Idempotency keys are required on every write. The server deduplicates for twenty-four hours.</p></div><div class=\"rail\"><div class=\"rh\">Outline</div><div class=\"tr\">Retry policy</div></div></div></div>",
  "stage": "after"
 }
];
