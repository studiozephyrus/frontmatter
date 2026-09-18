# Lens I. Internal reconciliation: what our own research found and the plan never picked up

**Scope.** No web at all. Every source is a file in this repository. The baseline is
`docs/mvp0/PRODUCT-PLAN.md` v6, 2,129 lines, read in full. Anything present there is not a gap.

**Method.** For every candidate I quote the research with a verified file and line, then show the
grep against the plan that returns nothing. Every line number in this file was read back with
`sed -n 'Np'` before it was written, and all 75 of them were then re-checked mechanically. Where a
grep returns lines, I say what they say and why the candidate still counts or does not.

**Three things I changed inside quotations, so nobody reads a mismatch as a fabrication.**
A checker matched every quoted string of 45 characters or more against the source files; 126 of
162 matched byte for byte and the rest differ only in these three ways.

1. **Signal tags lose their backticks.** Our files write the signals as `[Z]`, `[R]`, `[M]`, `[O]`
   and `[opened]` inside backticks. A backtick cannot nest inside a backticked quotation, so those
   appear here as bare `[Z]`, `[R]` and so on.
2. **Dashes and arrows are plain hyphens.** The brief forbids em and en dashes in this output, so a
   source's em dash is written here as `-` and a source's arrow as `->`. The file contains zero of
   either character.
3. **An elision is marked with `...` and a pipe inside a table cell is escaped.** Nothing is cut
   silently.

**Prefix.** FI.

---

**Where the brief's five asks live.** Ask 1, what the research has and the plan lacks, is section 1
plus section 4, FI1 to FI13 and FI25 to FI28. Ask 2, dropped between versions, is section 3,
FI19 to FI24. Ask 3, contradictions, is section 2, FI14 to FI18. Ask 4, pain mapped to screen, is
section 5. Ask 5, the unanswered cards, is section 6.

**Twenty-eight findings. One is a must-have**, FI3, the missing refusal surface. Two more are
must-resolve rather than must-build, FI14 and FI15, because each is a contradiction that will
otherwise be discovered by a builder. Everything else is good-to-have, which is what the brief
asked for.

---

## 1. In our research, absent from the plan

### FI1. Global search and replace across the whole workspace

- **Demand:** the plan's own section 2 lists it in the table headed "The three that matter most",
  with 650 hearts, and the note "Still does not exist in Obsidian".
  `docs/mvp0/PRODUCT-PLAN.md:162` reads:
  `Global search and replace | 650 | Still does not exist in Obsidian`
- **Source:** our own corpus. The Obsidian forum count is carried at
  `docs/mvp0/PRODUCT-PLAN.md:162`, sourced in that document to
  `docs/mvp0/PRODUCT-PLAN.md:2112`, the feature-requests board.
- **Evidence the plan lacks it:** `grep -n -i "search and replace" docs/mvp0/PRODUCT-PLAN.md`
  returns exactly one line, 162, the demand row itself. The only other mention is
  `docs/mvp0/PRODUCT-PLAN.md:797`, `Find and replace, word count | N | Tools`, which is a row in
  the Google Docs classification table and means find-and-replace **inside one open document**.
  The capability does not appear in section 6's twenty built-in capabilities
  (`docs/mvp0/PRODUCT-PLAN.md:714` to `:734`), in any of the 38 screens, or in any phase of
  section 26.
- **The problem it solves:** the plan counts 6,051 open Obsidian requests and says frontmatter
  answers sixteen of the top thirty. This is one of the three it singles out as mattering most,
  and it is the only one of those three the plan does not answer. A web version is answered by
  existing. Editing an embedded note in place is answered by Live mode. This one is answered by
  nothing.
- **Fit:** it is the splice engine's natural second job. One locate-and-replace per file, every
  hunk into the change queue of S20, and a refusal where the match is ambiguous or inside a
  fence. It needs no new format and no new store.
- **Effort:** medium. The engine already does single-file splices; the work is the multi-file
  driver, the preview, and the refusal rules.
- **Verdict:** good-to-have, and the strongest good-to-have in this lens, because it is the only
  feature in the whole corpus whose demand was counted as votes on a specific named request.

### FI2. Rename a tag, heading or key across the vault, with every hunk reviewable

- **Demand:** 86 likes on a request for broken-links-on-rename, and it was a costed feature row
  in the older brief. `docs/PRODUCT-BRIEF.md:63` reads, in full:
  `| F9 | **Vault-wide refactor** | Rename a tag, heading or key across the vault; every hunk reviewable; ambiguity refused | Engine splice across files; refusal on fenced or ambiguous matches | 8d | MVP-1 | Yes | Yes | Public: 86 likes on broken-links-on-rename |`
- **Source:** `docs/PRODUCT-BRIEF.md:63`, and the decision card F11 at
  `decisions/v2/features.json:1932`, whose question is
  `"Does vault-wide refactor move into the pilot as the one capability with a counted public vote?"`
  and whose lede at `decisions/v2/features.json:1933` calls it
  `"The only feature in the plan whose demand was measured as votes on a specific request."`
- **Evidence the plan lacks it:** `grep -n -i "refactor" docs/mvp0/PRODUCT-PLAN.md` returns one
  line, 2117, which is a URL, `- [Tolaria](https://github.com/refactoringhq/tolaria)`.
  `grep -n -i "rename" docs/mvp0/PRODUCT-PLAN.md` returns one line, 727,
  `Tags | Joplin, Bear, Craft, Logseq | Shipped today, rename and merge added` - which is renaming
  a **tag** in a tag pane, not a rename that rewrites every link and every front-matter key that
  pointed at the old name. The eight-day estimate, the refusal rule and the per-hunk review are
  all gone.
- **The problem it solves:** it is the one operation where refusing beats guessing in a way a
  user can feel in five seconds. Every other editor's rename either silently rewrites inside a
  code fence or does not rename at all. This is the differentiation made visible.
- **Fit:** exactly the shape of the product. Splice across files, refuse on ambiguity, every hunk
  into the change queue.
- **Effort:** medium; the brief costed the build at 8 engineering days
  (`docs/PRODUCT-BRIEF.md:63`).
- **Verdict:** good-to-have. It is the demo for the refusal promise, and FI1 shares most of its
  machinery, so the two should be scoped as one piece of work.

### FI3. A refusal has no screen, although refusing is the product's whole differentiation

- **Demand:** two of our own decision cards ask for it and neither was answered.
  `decisions/v2/design-ui-attention.json:3221` is card D16,
  `"Do refusals become visible before the pilot, when a refusal and a no-op look alike?"` and
  `decisions/v2/flow-interaction.json:1410` is card FL8,
  `"Do we build the typed refusal return and adopt the placement ladder before review state?"`
- **Source:** our own corpus, plus `AGENTS.md:13`, which states the rule as
  `2. **Refuse rather than guess.** Returning the input unchanged is a correct outcome for this`
  and `AGENTS.md:14`, `product. Guessing is not. This is the whole differentiation.`
- **Evidence the plan lacks it:** `grep -n -iE "refus(e|es|ed|ing)" docs/mvp0/PRODUCT-PLAN.md`
  returns eight lines, 243, 543, 641, 743, 1005, 1348, 1362 and 1570. Not one of them is a
  screen for a refused edit. Line 1348 is the invariant itself,
  `2. Splice-only writes, which refuse when a range is ambiguous.` Line 543 is a Google Doc over
  10 MB. Line 641 is every AI provider being down, which is S32. Line 243 is Doc mode declining
  a formatting feature. The 38 screens listed at `docs/mvp0/PRODUCT-PLAN.md:299` include S31
  conflict, S32 AI unavailable and S33 over the cap, and no S for "this edit was refused, and
  here is why".
- **The problem it solves:** a refusal and a no-op look identical. A user who asks for an edit,
  gets nothing back, and is told nothing, concludes the product is broken rather than careful.
  The single most defensible thing about frontmatter is invisible at the moment it happens.
- **Fit:** it is not a feature so much as a missing surface for a feature that already exists. A
  typed refusal return from the engine, one card in the editor naming the byte range and the
  reason, and a link to the ambiguity.
- **Effort:** small. The engine's refusal paths exist; this is a return type and one component.
- **Verdict:** must-have, and the only must-have I will name in this lens. Everything else here
  is an addition; this one is a hole in something already being built.

### FI4. Search has no screen, and retrieval at scale has no feature at all

- **Demand:** T11 of our own pain taxonomy, `docs/research/frontmatter-pain-taxonomy.md:182`,
  headed `## T11. Capture is easy, retrieval is impossible (organization at scale)`, severity at
  `:184` `**Severity: CHURNS USERS** - inboxes become graveyards; the system collapses past ~2,000 notes.`
  Three quotations are carried, `:188` `"Capturing is too easy. Synthesis is too hard."`, `:190`
  `"A few thousand notes later, it's just an unreadable hairball."` and `:192`
  `"Right now, capturing information feels easy  finding it later feels impossible."`
  The remedy it proposes is at `:194`: `Automatic resurfacing over manual linking: "you saved this idea 4 times - merge?", context-based related-note surfacing, dedup, and search that actually works at 10k notes.`
- **Source:** `docs/research/frontmatter-pain-taxonomy.md:182` to `:194`, our own synthesis of
  eleven research slices.
- **Evidence the plan lacks it:** two separate holes.
  1. **No search screen.** `docs/mvp0/PRODUCT-PLAN.md:299` says
     `**Thirty-eight screens, each on desktop and on the phone.**` and the headings S01 to S38 run
     from `:311` to `:697`. None of them is search. Search appears at `:351` folded into a More
     menu, at `:1068` as one of five phone bottom-bar destinations, and at `:1323` as an
     infrastructure row, `Search | The browser, across the open workspace, because Firestore has no full-text index`.
     Meanwhile `:769` calls `ranked search` one of `**The big six:**`. A capability named in the
     big six has no screen and no phase row.
  2. **No retrieval feature.** `grep -c -i "resurfac" docs/mvp0/PRODUCT-PLAN.md` returns 0.
     `grep -c -i "related note" docs/mvp0/PRODUCT-PLAN.md` returns 0.
     `grep -c -i "embedding" docs/mvp0/PRODUCT-PLAN.md` returns 0.
     `grep -c -i "similar" docs/mvp0/PRODUCT-PLAN.md` returns 0.
     `grep -n -iE "duplicat|dedup" docs/mvp0/PRODUCT-PLAN.md` returns two lines, 879 and 1313,
     and neither is about documents: 879 is `- **D2**, which is MPL and duplicates Mermaid.` and
     1313 is `- **Store deltas, or deduplicate versions.** Full-copy saves grow 18 GB a month per 1,000 users, and that is the only line that compounds.`
- **The problem it solves:** the plan's own pilot recruits ten Obsidian users with vaults of at
  least 200 files (`docs/mvp0/PRODUCT-PLAN.md:1683`). A person who imports 200 to 2,000 files and
  then cannot find anything has met the exact failure the taxonomy ranks as a churn driver, on
  day one, inside our product.
- **Fit:** the search half is a screen over something the plan already has. The retrieval half
  (related documents, "you have written this four times") is a projection over the map of S16,
  which is already rebuilt on every save and already costs no credits.
- **Effort:** small for a search screen with ranking. Medium for related-document surfacing, and
  it would be the first feature that needs an index the plan does not have.
- **Verdict:** the search screen is good-to-have and close to must-have, because a screen missing
  from a 38-screen set is a build gap rather than a scope choice. Resurfacing and dedup are
  good-to-have and belong after the pilot.

### FI5. Import from Evernote, OneNote and Apple Notes, the refugee funnel

- **Demand:** T5 of the taxonomy, `docs/research/frontmatter-pain-taxonomy.md:92`:
  `**OPPORTUNITY:** frontmatter never needs an "export" feature - the data already lives as .md in the user's GitHub repo. Add the offense side: one-click importers from Evernote ENEX, Notion ZIPs (fix UUID filenames/broken links), and OneNote - migration friction is the #1 force keeping refugees hostage.`
  The taxonomy ranks T5 fifth of fourteen and marks it `Kills adoption`.
- **Source:** `docs/research/frontmatter-pain-taxonomy.md:92`, and the T3 price-backlash section
  at `:50`, which quotes a departing Evernote user.
- **Evidence the plan lacks it:** `docs/mvp0/PRODUCT-PLAN.md:543` names the import sources in
  full: `- Six sources: a folder, GitHub, Google Drive, Google Docs, Word, a Notion export. A Google Doc over 10 MB is refused with the reason (F024).`
  `grep -c -i "ENEX" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "OneNote" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "Apple Notes" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "Roam" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -n -i "Evernote" docs/mvp0/PRODUCT-PLAN.md` returns lines 240, 1077 and 1882, all three
  of which use Evernote only as a pricing comparable; 1882 is the URL
  `- [Evernote](https://evernote.com/compare-plans)`.
  `grep -n -i "Logseq" docs/mvp0/PRODUCT-PLAN.md` returns eleven lines, every one of them an
  ecosystem comparable in the section 6 table or a URL, none an import source.
- **The problem it solves:** the plan's six sources cover the people who already live in
  markdown or Google. The people with the loudest stated reason to leave, the Evernote price
  refugees, cannot bring their notes.
- **Fit:** ENEX is XML with embedded base64 attachments and converts in the browser, the same
  shape as the Word path the plan already takes with mammoth. It needs no server.
- **Effort:** small per format. ENEX first, because it is one well-documented file.
- **Verdict:** good-to-have. ENEX alone, not the whole list. OneNote's format is proprietary and
  Apple Notes has no export, so both of those are traps rather than features.

### FI6. Offline says whether you are offline, never which documents you will still have

- **Demand:** unmet need 7 in our taxonomy, `docs/research/frontmatter-pain-taxonomy.md:281`:
  `7. **True offline-first in a web app with visible cache state** - see what's available before the flight, full read/write offline, queued sync. Notion's offline excludes the browser entirely.`
  and the same remedy at `:108`:
  `**OPPORTUNITY:** Offline-first PWA with *visible* cache state (user can SEE what's available before the flight), full read/write offline, queued sync on reconnect.`
- **Source:** `docs/research/frontmatter-pain-taxonomy.md:108` and `:281`. T6 is ranked seventh
  of fourteen and marked `Kills adoption`.
- **Evidence the plan lacks it:** S24 is the offline screen and it is three bullets.
  `docs/mvp0/PRODUCT-PLAN.md:562` is `- A banner, last synced time, changes waiting.`
  `:563` is `- AI edit is disabled with a one-line reason; on the desktop the local model takes over (F039).`
  `:564` is `- The desktop card: files on disk, fully offline, no document limit.`
  There is no per-document state. `grep -c -i "available offline" docs/mvp0/PRODUCT-PLAN.md`
  returns 0 and `grep -c -i "cache state" docs/mvp0/PRODUCT-PLAN.md` returns 0.
- **The problem it solves:** the plan is honest that Safari evicts storage after seven days
  (`docs/mvp0/PRODUCT-PLAN.md:1046`) and the screen states that. What it never answers is the
  question the user actually asks before a flight: which of my fifty documents will open. Under
  the 50-document Free cap that is a list, not an architecture.
- **Fit:** a column in the document list and one filter. The bytes are already in IndexedDB or
  the origin private file system, so the state exists and is simply not shown.
- **Effort:** small.
- **Verdict:** good-to-have. It is the cheapest way to turn an honest limitation into a visible
  promise, and the plan already pays the full cost of the limitation.

### FI7. Database views over front matter, which our own briefing calls table stakes

- **Demand:** the 9 September briefing puts it in the list headed `## 2. What is now table stakes`
  at `docs/research/2026-09-09/BRIEFING.md:70`. The row is `:87` to `:88`:
  `- **Database views over YAML frontmatter** - Obsidian Bases is core; kanban since 2026-09-02`
  `  [opened]`. It is also candidate decision 43,
  `docs/research/2026-09-09/BRIEFING.md:283`.
- **Source:** `docs/research/2026-09-09/BRIEFING.md:87`, tagged `[opened]` by that round.
- **Evidence the plan defers it:** `docs/mvp0/PRODUCT-PLAN.md:881` reads
  `**One thing that waits.** Database views over front matter, as Obsidian's Bases, have no open renderer.`
  `grep -c -i "database view" docs/mvp0/PRODUCT-PLAN.md` returns 1, that line.
  `grep -n -i "Bases" docs/mvp0/PRODUCT-PLAN.md` returns 881, 1989 and one unrelated substring;
  1989 is the URL `- [Obsidian Bases](https://help.obsidian.md/bases)`.
- **The problem it solves:** a person importing an Obsidian vault of at least 200 files, which is
  the plan's own pilot qualifier, arrives from a product where this is a core feature. The plan
  ships a kanban view (MVP 1) and a chart block (MVP 1), both of which are narrower cases of the
  same thing: read a property across many files and lay the results out.
- **Fit:** it is a projection, and the projection law permits it exactly. A saved view is a
  markdown file with front matter, so it stays a file a stranger's tool can read.
- **Effort:** large if built as a query language. Small if built as one table view over the
  front-matter keys already indexed for tags and backlinks.
- **Verdict:** good-to-have, and the cheap version should be scoped rather than the Bases-shaped
  one. Note the disagreement in itself: one of our own rounds classified this as table stakes and
  the plan classifies it as a thing that waits, with no line reconciling them.

### FI8. Right-to-left, system text scaling and high contrast are in no screen and no phase

- **Demand:** candidate decision 35, `docs/research/2026-09-09/BRIEFING.md:271`:
  `35. RTL, system text scaling and high contrast in v1? - both competitors shipped this in six weeks.`
  and the table-stakes row at `:85` to `:86`:
  `- **Accessibility** - Notion high contrast 2026-07-30; Obsidian RTL and system text scaling in`
  `  1.14.x [opened]`. Decision card D22, at
  `decisions/v2/design-ui-attention.json:4173`, asks the same:
  `"What is v1's scope for CJK, RTL, text scaling and high contrast, and where is it stated?"`
- **Source:** `docs/research/2026-09-09/BRIEFING.md:85` and `:271`.
- **Evidence the plan lacks it:** `grep -c -i "high contrast" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "text scaling" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "CJK" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -n "RTL" docs/mvp0/PRODUCT-PLAN.md` returns one line, 793, and it is a row in the
  Google Docs classification table:
  `Outline, rulers, non-printing characters, zoom, dark theme, RTL view, shortcuts, copy and paste | N | Editor chrome, no file impact`
  That row says the feature has no file impact, not that we build it. The plan's accessibility paragraph at `:1339` commits to WCAG 2.2 AA and IS 17802
  and names contrast tokens, and names none of these three.
- **The problem it solves:** the draft Indian rule the plan itself quotes at `:1576` asks for an
  Accessibility Conformance Report against IS 17802. A conformance report has rows for text
  resize and for reading order. Committing to the standard while naming none of its visible
  features is how that row turns into a build surprise late.
- **Fit:** text scaling and high contrast are CSS and a settings row. RTL is a document-direction
  property that belongs in front matter, which the plan already uses for `title` and `page`.
- **Effort:** small for text scaling and high contrast. Medium for RTL done honestly.
- **Verdict:** good-to-have, with text scaling and high contrast close to must-have because the
  plan has already signed up to the standard that implies them.

### FI9. The change queue enumerates, and our own attention research says enumeration fails

- **Demand:** the briefing's second headline finding,
  `docs/research/2026-09-09/BRIEFING.md:21`, is headed
  `**2. The attention literature says an "18% unreviewed" surface produces dismissal, not review.**`
  and it ends at `:34` with `**Forces:** suppression, not` and `:35` `enumeration.`
  Candidate decision 34 at `:270` is
  `34. Full list or exception-first? - MHRA has adjudicated this and permits exception reporting.`
  Candidate 32 at `:268` asks `What caps the spans surfaced in one sitting - a time budget or a span count?`
  and candidate 40 at `:278` asks `Instrument a dismissal-rate kill threshold? - Tricorder disables a category at 10%.`
  Decision card D24, at `decisions/v2/design-ui-attention.json:1138`, puts it as
  `"Does a review sitting enumerate everything that changed, or suppress to exceptions?"`
- **Source:** `docs/research/2026-09-09/BRIEFING.md:21` to `:35`, and the figures it carries at
  `:150` to `:157`, which include `Cisco: 250-line ceiling; 87% below average above 450 LOC/hr; 60-minute wear-out; 13 defects/hr`
  and `DDI alert override 55-98% across 34 studies`.
- **Evidence the plan lacks it:** S20 is the change queue and it enumerates without limit.
  `docs/mvp0/PRODUCT-PLAN.md:518` reads
  `- Changes waiting, each with who made it: a person, an AI edit you asked for, or an agent that edited the file on disk through the desktop folder.`
  `grep -c -i "suppress" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "dismissal" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "habituation" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -n -i "exception" docs/mvp0/PRODUCT-PLAN.md` returns eight lines, 85, 239, 512, 701, 708,
  1294, 1790 and 1794, and every one of them is either the Yjs exception to the CRDT rule or a
  per-account limit exception in the configuration panel. None is exception reporting over a
  change list.
  Section 28 does measure the behaviour, at `:1676`,
  `- Proposals accepted against rejected, individually against Accept all.`, so the plan watches
  the symptom without designing against the cause.
- **The problem it solves:** the plan's own security control 6 at `:1221` is
  `6. The change queue, so every agent change is read before it lands.` If an agent rewrites forty
  spans and the queue lists forty items, the measured outcome across every adjacent literature we
  read is that people clear the list rather than read it, and control 6 becomes a ceremony.
- **Fit:** a grouping and a cap. Group an agent's run into one item with its files, expand on
  demand, and put a ceiling on what one sitting presents. No new store.
- **Effort:** small to medium, and far cheaper now than after the queue is built flat.
- **Verdict:** good-to-have, and the single most under-priced item in this lens, because it is
  the difference between the plan's central control working and looking like it works.

### FI10. An always-visible sync status, which our own corpus calls the most concrete trust ask

- **Demand:** the gap map names it twice.
  `docs/research/frontmatter-competitor-gapmap.md:76` reads, in part:
  `an always-visible sync-status indicator (the corpus's most concrete trust ask)`.
  `docs/research/frontmatter-competitor-gapmap.md:60` carries the count:
  `plus *"Obsidians sync price is nutty"* (HN 33219781) and the 14-upvote ask to *"put the sync status somewhere easily visible"* (r/ObsidianMD).`
  Wedge C at `:59` is built on it:
  `**Wedge C - "Sync you can see, history you can't lose."** Free git-native sync (vault = repo) with an always-visible sync status, default-on version history, and a non-destructive merge UI`.
  The pain taxonomy's T1 remedy at `docs/research/frontmatter-pain-taxonomy.md:22` asks for
  `always-visible per-file sync status, loud failure states (never silent read-only)`.
- **Source:** `docs/research/frontmatter-competitor-gapmap.md:43`, `:59`, `:60`, `:76` and
  `docs/research/frontmatter-pain-taxonomy.md:22`.
- **Evidence the plan lacks it:** `grep -n -i "sync status\|synced\|sync state\|last synced" docs/mvp0/PRODUCT-PLAN.md`
  returns three lines, 562, 760 and 1409. Line 760 is a Notion block type, `synced block`. Line
  1409 is a data-model row, `Local draft | IndexedDB or the origin private file system, and the desktop folder | the device's quota | until synced or evicted | not ours | the device`.
  Only line 562 is a surface, `- A banner, last synced time, changes waiting.`, and it is on S24,
  the **offline** screen, so by construction it appears when the connection has already gone.
  There is no persistent indicator in the workspace chrome of S04 and no per-file state anywhere.
- **The problem it solves:** the plan's strongest promise is that nothing merges silently and
  every version is kept. A promise that only appears at the moment it is being broken is a
  promise the user has to take on faith for the other 99 percent of the time. Every competitor
  that lost this audience lost it to a silent failure, and our own taxonomy ranks that first of
  fourteen.
- **Fit:** it is the cheapest possible expression of the whole thesis, and it is chrome rather
  than architecture. The state already exists: the plan tracks a document head, a version key, a
  Drive poll token and a GitHub blob sha.
- **Effort:** small. One indicator in the header, one column in the tree, three states, and a
  loud state for failure.
- **Verdict:** good-to-have, close to must-have. It is Wedge C's entire visible surface and the
  plan currently ships Wedge C's engine with no face on it.

### FI11. Whether a link recipient needs an account is never stated, and the two answers conflict

- **Demand:** whitespace 5 in the gap map,
  `docs/research/frontmatter-competitor-gapmap.md:45`:
  `5. **Google-Docs-grade sharing (link + Viewer/Commenter/Editor + anonymous access + comments + suggest mode) on files stored in a repo the user owns.**`
  and the taxonomy's unmet need 2 at `docs/research/frontmatter-pain-taxonomy.md:271`, which asks
  for `share-link roles` on files that stay the source of truth. Both name anonymous access as
  part of the shape.
- **Source:** `docs/research/frontmatter-competitor-gapmap.md:45`.
- **Evidence the plan does not resolve it:** the plan says both things and never joins them.
  `docs/mvp0/PRODUCT-PLAN.md:111` is
  `1. You sign in with Google or GitHub and land on your documents. Nothing is reachable without an account, exactly as Google Docs works [Z].`
  `:238` is the front-door decision, `Sign in first. No anonymous editing.`
  But the permission matrix at `:1427` and `:1428` grants link roles rights that imply a session:
  `Link, read | yes | no | no | no | no | no | no | own copy | no | no | no` and
  `Link, edit | yes | yes | yes | yes | yes | no | no | yes | no | no | no`.
  A `Link, edit` holder may edit, propose, apply and comment. Nothing in section 10, section 19 or
  S17 says whether that person must first sign in. `grep -n -i "anonymous" docs/mvp0/PRODUCT-PLAN.md`
  returns one line, 238, and it forbids anonymous editing; the matrix then grants editing to a
  link. The only unambiguous no-account surface is the published page, at `:498`,
  `- Reads without an account. Download the markdown. Open in frontmatter. A quiet card offers sign-in once.`
- **The problem it solves:** the case our research says people abandon markdown for is sending a
  document to someone who will not make an account. If a `Link, edit` needs a Google or GitHub
  account, the product does not solve it and should say so; if it does not, then `No anonymous
  editing` is wrong and the legal floor of section 23 has an unnamed class of user acting on the
  platform.
- **Fit:** it is a one-line decision with a screen consequence on S17, not a feature.
- **Effort:** small to decide, medium to build the no-account editing path if the answer is yes.
- **Verdict:** good-to-have as a feature, must-answer as a question. The plan cannot ship S17 and
  section 19 without knowing which it means.

### FI12. A writing gate that names the AI tell, which one whole research round says nobody ships

- **Demand:** the 13 September round ran four lenses on exactly this and reported the category as
  empty. `docs/research/2026-09-13/round1-writing-tools-and-funnels.json:63`:
  `"Nobody surveyed ships a standalone, git-native, agent-facing prose/slop linter that specifically targets AI writing tells (leaked model artefacts like 'oaicite', invisible unicode, em-dash floods, promotional register) as a distinct product from general style linting (Vale/alex/write-good/textlint all check human-authored style rules - grammar, inclusivity, passive voice - not AI-specific leakage). Frontmatter's tiered gate (block/warn/jargon-counter) is that missing category."`
  The counts it opened, at `:240`:
  `"figure": "0 of 6 commercial tools' fetched pages mention 'markdown', 'repo', 'git', or 'CI'; the one CI-aimed open-source tool has 3 GitHub stars"`
  and at `:222`:
  `"figure": "slop-gate: 3 GitHub stars, 43 npm downloads in the week of 2026-09-05 to 2026-09-11; awesome-slop (the curator list): 5 GitHub stars, last updated 2026-08-30"`
  The peer-reviewed basis, at `:231`:
  `"figure": "delves r=28.0; underscores r=13.8; showcasing r=10.7; >=13.5% of 2024 abstracts estimated LLM-processed (up to 40% in some subcorpora)"`
  Decision card F39, at `decisions/v2/features.json:6743`, asks it directly:
  `"Does the writing gate ship as a feature, telling the reader a paragraph drifted and naming the tell?"`
- **Source:** `docs/research/2026-09-13/round1-writing-tools-and-funnels.json:63`, `:222`, `:231`,
  `:240`, and card F39 at `decisions/v2/features.json:6743`.
- **Evidence the plan lacks it:** the plan carries one clause.
  `docs/mvp0/PRODUCT-PLAN.md:414` is
  `- Broken links, heading skips, missing alt text, table shape, and one advisory writing note, each true of the document shown (F022).`
  That is the whole of it. Section 6's row at `:728` is
  `Lint, style and spelling | VS Code 12.2M and 71.6M, Docs, iA | The problems panel, the formatter, the browser's spellcheck`,
  and `:1036` defers the rest: `Grammar beyond spelling waits for a self-hosted LanguageTool.`
  `grep -c -i "slop" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "em-dash" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "detector" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "AI-written" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "Vale" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "Grammarly" docs/mvp0/PRODUCT-PLAN.md` returns 0.
- **The problem it solves:** the product's stated audience is people whose documents are
  increasingly written by agents. The one check that only matters for that audience, does this
  paragraph read as though a model wrote it and which word gave it away, is the one check the
  problems panel does not do.
- **Fit:** it is a rule set in the problems panel, runs on the device, costs no credits, and
  fits the plan's own line at `:1208` that structural checks are free. The tiered posture the
  research recommends, warn rather than block, matches `:418`, `the plain-language note never blocks, as our own gate works`.
- **Effort:** small as a rule set on top of the existing panel. The studio already runs this gate
  on its own writing, so the rules exist and the work is porting and tiering them.
- **Verdict:** good-to-have, and the one with the best evidence in this lens after FI1. A whole research
  round set out to find a competitor and came back with a three-star repository.

### FI13. No free public tool as a funnel, although the plan's own funnels both sit behind sign-in

- **Demand:** two of the round-1 gaps are about exactly this.
  `docs/research/2026-09-13/round1-writing-tools-and-funnels.json:64`:
  `"Nobody found in this pass exposes their linter as a public, zero-install web check the way frontmatter's decision cards propose a 'rendering certificate' - Vale/Fern Writer require repo/CI setup; a paste-a-URL-get-a-slop-score funnel (parallel to the existing ?src= and docs-scan ideas) appears genuinely unoccupied."`
  and `:145`:
  `"Nobody found in this pass ships a free AGENTS.md/CLAUDE.md linter that also checks for AI-slop writing quality (leaked model artefacts, em-dash floods, vague attribution) - every linter found (cclint, claudelint, AgentLint, AgentLinter) checks structural/schema correctness of the instruction file, not the prose quality of what an agent then writes using it. frontmatter's founder already built exactly that quality gate for his own use; packaging it as a free 'lint your AGENTS.md, and the docs your agents write against it' tool sits in a near-empty category (largest incumbent ~22 GitHub stars) and is a natural extension of an asset that already exists."`
  Decision card G20, at `decisions/v2/go-to-market-channels.json:3030`, asks
  `"Do we build the public frontmatter validator?"`
- **Source:** `docs/research/2026-09-13/round1-writing-tools-and-funnels.json:64` and `:145`.
- **Evidence the plan lacks it:** the plan names its funnels twice and both need an account.
  `docs/mvp0/PRODUCT-PLAN.md:374` is `**Why.** [R] the funnel is the box.` - the AI box on S06,
  which is inside the app. `:502` opens `**Why.** [R] the published page is the funnel. ...` - which
  needs an author who has already signed up. `grep -n -i "funnel" docs/mvp0/PRODUCT-PLAN.md`
  returns only 374, 502 and 1077, and 1077 is a caps argument.
  `grep -c -i "validator" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  Meanwhile section 29 question 17, at `:1764`, records that the plan has no other channel:
  `17. Whether published pages are indexed. Added from the audit's growth angle, because not indexing removes search as a channel and the plan has no other.`
- **The problem it solves:** the plan admits at `:1764` that it has one growth channel and that
  channel is currently switched off. A free page that takes a repository URL or a pasted
  AGENTS.md and returns a report is a channel that costs a weekend, needs no account, and
  demonstrates the engine rather than describing it.
- **Fit:** it is the same rule set as FI12, served on a public route. The plan already has public
  routes for `/privacy`, `/terms` and published pages, so the no-account path exists.
- **Effort:** small if it reuses the problems panel's rules. The cost is the public route, rate
  limiting and the abuse surface, which section 23 already has language for.
- **Verdict:** good-to-have. On its own it is marketing; paired with FI12 it is the cheapest
  distribution the corpus found, and the plan currently has none.

---

## 2. Contradictions: where two of our own documents disagree

### FI14. The plan says it is written to K1 rec b, and the sentence it carries is K1 option a

This is the largest one, because 23 other cards were closed on the strength of it.

- `docs/mvp0/PRODUCT-PLAN.md:95` states the product sentence:
  `**frontmatter is a markdown editor for people whose documents are increasingly written with, and for, AI agents.**`
- `docs/mvp0/PRODUCT-PLAN.md:101` names it: `That sentence is K1, and the founders confirm or replace it in section 29 [Z].`
- `docs/mvp0/PRODUCT-PLAN.md:1771` says which answer the plan is written to:
  `- **K1, K2 and K3** were taken implicitly by revision 4. They are now defaults, with the cards' recommendations beside them: K1 rec b, K2 rec b, K3 rec c in `decisions/v2`.`
- But `decisions/v2/_final.json:16` is option **b**:
  `"label": "Where you write, review and keep current the files your agents obey",`
  and its `what` at `:17` scopes it to `An editor scoped to AGENTS.md, CLAUDE.md and rules files, with the kit as the way in and review state on those files.`
- `decisions/v2/_final.json:11` is option **a**:
  `"label": "A markdown editor, with a document kit as the way in",`
  which is what `docs/mvp0/PRODUCT-PLAN.md:95` actually says.
- The card's own reasoning at `decisions/v2/_final.json:31` rejects the plan's sentence by name:
  `Options a and d put the product on the free-editor shelf, where the price is zero.`

**Why it matters beyond wording.** `decisions/v2/_final.json:2` sets the rule:
`A taken card re-opens when an answer it assumed changes; deps lists what each one assumes, as [card or decision, the answer assumed].`
K1's `settles` list, beginning at `decisions/v2/_final.json:33`, names 23 cards: P1, P2, MK4,
F35, F26, F13, E21, P26, F39, FL21, FL12, F27, P11, P24, F34, PR24, P25, MK31, MK16, MK25, F1,
F33, F3. Each of those carries `[["K1","b"]]` in the `deps` map. On the compact set's own rule,
if K1 is in fact a, all 23 re-open. Three of them are findings in this file: F39 is the writing
gate (FI12), F26 is agent write scoping, F35 is whether instruction files are the reason the
product exists.

**What to do.** Say which one it is, in one line, and if it is a, mark the 23 as re-opened rather
than settled. Verdict: must-resolve, and it costs a sentence.

### FI15. Free is capped at 50 documents; the pilot recruits vaults of at least 200 files

- `docs/mvp0/PRODUCT-PLAN.md:240` sets the cap:
  `Free caps | 50 cloud documents, 1 GB of uploads at 5 MB a file, 5 published pages, 3 live collaborators, 7-day history, 1 GitHub repository with 20 pushes a month, 1 Low blueprint and 10 AI edits a month | ...`
- `docs/mvp0/PRODUCT-PLAN.md:1683` sets the pilot qualifier:
  `Obsidian users | 10 | A vault of at least 200 files, and a post in the web-version or sync threads`
- `docs/mvp0/PRODUCT-PLAN.md:1483` sets the performance target:
  `Import of 2,000 files | under two minutes, byte-exact | our own`
- `docs/mvp0/PRODUCT-PLAN.md:650` says what happens at the cap:
  `- What happened: the 50th cloud document, or the tenth edit, or the fifth page. What still works: every document opens, edits and exports.`
- The plan's own justification for 50 over 5, at `:1077`, states the problem and then stops one
  factor of ten short: `A blueprint alone is 15 files and an imported vault is hundreds, so 5 would block both funnels on the first day`.

Half of the pilot cohort hits the over-cap wall during step 2 of the scripted first five minutes
(`:1692`, `2. Import a vault, or write a document.`). Nothing in section 13, section 28 or S33
says whether pilot accounts are given Pro, whether an import is exempt, or whether the cap counts
imported files at all. Verdict: must-resolve before the pilot recruits anyone.

### FI16. Database views are table stakes in one round and a thing that waits in the plan

- `docs/research/2026-09-09/BRIEFING.md:70` heads the section `## 2. What is now table stakes` and
  `:87` lists `- **Database views over YAML frontmatter** - Obsidian Bases is core; kanban since 2026-09-02`.
- `docs/mvp0/PRODUCT-PLAN.md:881` disposes of it in one line:
  `**One thing that waits.** Database views over front matter, as Obsidian's Bases, have no open renderer.`

The two statements use different tests. The briefing asks what a competitor has shipped; the plan
asks whether a renderer can be borrowed. Both are reasonable and neither cites the other, so the
reader cannot tell whether the plan considered the briefing and disagreed or never saw it. The
same is true of the kanban and chart blocks, which the plan builds itself at `:869` and `:870`
for exactly the reason it uses to defer Bases. Verdict: state the test, or the deferral reads as
an oversight.

### FI17. The front door forbids anonymous editing and the permission matrix grants it

Set out in full in FI11 above. `docs/mvp0/PRODUCT-PLAN.md:238` reads `Sign in first. No anonymous
editing.` and `:1428` grants `Link, edit | yes | yes | yes | yes | yes | no | no | yes | no | no | no`,
which is read, edit, propose, apply and comment. Whether that link holder must hold an account is
stated nowhere.

### FI18. Voice typing is a shipped Doc mode row and the research's clearest negative

- `docs/mvp0/PRODUCT-PLAN.md:798` classifies it as lossless and therefore in scope:
  `Translate, voice typing | N | Tools; output is text`
  Section 7 at `:780` calls that table `the specification a contractor builds from (F002)`, and
  `:776` counts the N column as `Plain markdown | 20`, so a contractor reads this row as work.
- `docs/research/2026-09-09/BRIEFING.md:281` is candidate decision 41:
  `41. Ship voice dictation? - Apple made it free at the OS layer; the clearest negative found.`
  and `:84` carries the reason: `- **Dictation** - Apple gave every app on-device speech-to-text in iOS/macOS 26 [opened]`.

The plan is probably right in substance, because a browser dictating into a text field is the
operating system's job and not ours. But the table says build and the research says do not, with
no line reconciling them, and section 7 is explicitly the document a contractor is handed.
Verdict: annotate the row.

---

## 3. Dropped between versions, still supported by the research

Revision 3, `docs/mvp0/MVP0-PLAN-v3.md`, carried a section 22 headed `## 22. Parked, with the
evidence` at `:795`, whose note at `:797` reads
`Not in MVP 0, each already rated by our own record. These are the next arguments, not forgotten ideas.`
Fourteen rows sat under it. Revision 6 has no equivalent section. Some rows landed elsewhere
(the MCP server, Windows signing, bring-your-own key, the twenty kits, review state, attribution).
These did not, and each still has the evidence that put it on the list.

### FI19. A reverse blueprint, from an existing repository back to a brief

- **Demand:** `docs/mvp0/MVP0-PLAN-v3.md:813`:
  `Reverse blueprint from a repository | Mintlify charges "$450/mo" for repo-sourced docs `[M]`; spec-kit's reverse-engineering issue drew 39 reactions `[O]` | MVP 1, Pro`
- **Evidence it is gone:** `grep -c -i "reverse" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "Mintlify" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "spec-kit" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  Idea mode in revision 6 runs one direction only: `docs/mvp0/PRODUCT-PLAN.md:113`,
  `3. You describe an idea, answer questions at the depth you choose, and get a brief and a blueprint an agent can build from.`
- **Why it still stands:** it is the same fifteen files, the same consistency check and the same
  kickoff prompt, pointed at a repository that already exists rather than at an idea that does
  not. Every person in the plan's own second pilot group (`:1684`,
  `Founders and product people | 5 | Have run Claude Code, Cursor or Codex on a project in the last month`)
  has a repository and no brief. The forward direction only serves people at the start.
- **Effort:** medium, and most of the machinery is Idea mode's.
- **Verdict:** good-to-have, and the strongest of the parked rows, because it doubles the reach of
  the feature the plan is spending phase C on.

### FI20. A public gallery of kits, forkable

- **Demand:** `docs/mvp0/MVP0-PLAN-v3.md:809`:
  `A public forkable gallery of kits | ranked second of three in the promotion research `[R]` | not sized`
- **Evidence it is gone:** `grep -c -i "gallery" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "forkable" docs/mvp0/PRODUCT-PLAN.md` returns 0. The plan keeps the private half:
  `docs/mvp0/PRODUCT-PLAN.md:661`, `- One hand-made example kit to open and read, so the person sees the fifteen files before spending a credit.`
  One example, inside the app, behind sign-in.
- **Why it still stands:** Phase 0 makes twenty hand-made kits (`:1617`). Twenty real kits are a
  gallery already made and then not published. It also answers FI13's channel problem and section
  29 question 17's admission at `:1764` that the plan has one growth channel.
- **Effort:** small, because the kits are already built and the published-page route already
  exists.
- **Verdict:** good-to-have. It is the cheapest thing on this list per unit of reach.

### FI21. A changelog from the git log, and decision records from the decisions

- **Demand:** `docs/mvp0/MVP0-PLAN-v3.md:810`:
  `Changelog from the git log, decision records from decisions | each "days, Small" `[R]` | days`
- **Evidence it is gone:** `grep -c -i "changelog" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -n -i "decision record" docs/mvp0/PRODUCT-PLAN.md` returns one line, 890, and it is a
  Pro-tier line inside Idea mode High: `... a decision record you can publish | A background job of about an hour ...`
  A decision record generated from an answered DECISIONS.md, outside Idea mode, does not exist.
- **Why it still stands:** the plan already connects to GitHub, already writes DECISIONS.md, and
  already builds a map from the files on every save. Both artefacts are projections of data the
  product holds, which is the shape of everything else it ships.
- **Effort:** small, days per the original rating.
- **Verdict:** good-to-have, and the changelog is the weaker half; the decision record is the one
  that matters, because it turns a private answer file into something a team can read.

### FI22. A glossary generated from the documents

- **Demand:** `docs/mvp0/MVP0-PLAN-v3.md:804`:
  `A glossary generated from the documents | The ninth artefact in §2; nobody ships it | days`
- **Evidence it is gone:** `grep -c -i "glossary" docs/mvp0/PRODUCT-PLAN.md` returns 0.
- **Why it still stands:** it is the one row on the parked list whose evidence line says
  `nobody ships it`. For a product whose buyer is a person handing documents to agents, a
  generated glossary is the smallest way to make a document set self-consistent, and inconsistent
  vocabulary across a kit is exactly what the plan's own consistency check (`:465`) is for.
- **Effort:** small. Term extraction across a project, one markdown file out.
- **Verdict:** good-to-have, and the least certain item in this file, because the only evidence
  behind it is our own judgement that nobody ships it.

### FI23. Nested constructs rendering correctly inside lists

- **Demand:** `docs/mvp0/MVP0-PLAN-v3.md:803`:
  `Nested constructs rendering correctly in lists | 501 likes, 117 posts, 18,331 views `[R]` | not sized`
  Card F23, at `decisions/v2/features.json:4107`, carries it forward as `"Does nested-construct rendering become a feature row in our own editor, now that the plugin is cut?"`
- **Evidence it is gone:** `grep -n -i "nested" docs/mvp0/PRODUCT-PLAN.md` returns one line, 787,
  and it is a Doc mode classification row: `Bulleted, numbered, nested lists | N | CommonMark`,
  which classifies the list itself, not a callout or a table or a fence inside one.
- **Why it still stands:** 501 likes is the second-largest counted vote in our whole corpus after
  the 1,078 and 949 the plan already answers, and this is a rendering correctness matter rather
  than a feature, which puts it squarely in the deterministic-rendering invariant at `:1357`.
- **Effort:** unsized in the original, and a renderer correctness job rather than a feature build.
- **Verdict:** good-to-have. Worth a row in section 8 rather than a screen.

### FI24. Two-way GitHub sync, where today only Drive is two-way

- **Demand:** `docs/mvp0/MVP0-PLAN-v3.md:812`:
  `Two-way GitHub sync | The merge rule is settled `[R]`; others charge by volume `[M]` | MVP 1, Pro`
- **Evidence of the asymmetry in revision 6:** `grep -n -i "two-way" docs/mvp0/PRODUCT-PLAN.md`
  returns one line, 246, and it is Drive:
  `Google Drive | Free. Two-way sync of the files the app created or you picked, with the `drive.file` scope, polled every five minutes | ...`
  GitHub is push only. `:1001` reads `- **Free:** one repository, 20 pushes a month. **Pro:** unlimited.`
  and S23's GitHub bullet at `:553` reads
  `- GitHub: "GitHub grants this app the whole repository; frontmatter only ever writes under docs/" (F034). Pushes used, revocable on GitHub.`
  Nothing polls or pulls a change an agent made in the repository.
- **Why it still stands, and why it is larger than it looks:** the plan's own change queue
  depends on catching an agent's edit. S20 at `:518` says the sources are
  `a person, an AI edit you asked for, or an agent that edited the file on disk through the desktop folder`.
  **Through the desktop folder** is the only agent path. A person on the web whose agent commits
  to the GitHub repository has no way for that change to reach the queue, which means the
  headline control does not work on the web for the most common 2026 agent setup.
- **Effort:** medium. A webhook or a poll, the blob sha the plan already carries, and the existing
  conflict screen.
- **Verdict:** good-to-have as sync; close to must-have as the web half of the change queue.
  This is the one parked row whose absence quietly narrows a shipped promise.

---

## 4. Four more from the playbook and the gap register

### FI25. A model that runs in the browser, which the plan gives only to the desktop

- **Demand:** the playbook's Drill 5 recommendation 9,
  `docs/research/frontmatter-pain-playbook.md:402`:
  `9. **[L - new:ai]** R2 Local-first embeddings with cost visibility: default index computed client-side (transformers.js/WebGPU) or against a user endpoint; any cloud bulk-embed shows estimated tokens+cost and requires confirmation. Embeddings versioned by model id; model change -> incremental re-embed.`
  and its resolution of tension T7 at `:536`:
  `**Resolution:** Tier by data class: note *content* inference defaults to local (transformers.js) or user-configured endpoints with pre-run cost display; server-side features handle transport/anchoring only, never third-party inference on vault content without explicit BYO configuration.`
  The pattern it cites, at `:388`, is
  `Smart Connections | Local transformers.js embeddings, related-notes panel scoped to open note | ... the scoped related-notes panel is the most-loved AI retrieval pattern found`.
- **Evidence the plan lacks it:** `grep -c -i "transformers.js" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "WebGPU" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -n -i "local model" docs/mvp0/PRODUCT-PLAN.md` returns four lines, 563, 641, 1155 and
  1648, and every one of them is the desktop. `:1155` is the routing row:
  `On the desktop | A local model for edits, with nothing leaving the machine`.
  `:563` is `- AI edit is disabled with a one-line reason; on the desktop the local model takes over (F039).`
  So on the web, offline means no AI at all.
- **The problem it solves:** it is the only lever section 22 does not already list. `:1536` reads
  `- **At full-cap use the product loses money below about 5 percent conversion, at any scale.** The loss is the free users' model cost, not the fixed costs.`
  and `:1540` heads the next block `**Three levers move it.**`, whose rows at `:1543` to `:1545` are
  routing, the free caps and prompt caching. A small model running in the reader's
  own browser is a fourth: its marginal cost is zero, it works offline in the browser where the
  plan currently ships nothing, and it never sends the document anywhere, which is the sign-in
  page's promise made structural rather than contractual.
- **Fit:** it does not touch the file, the engine or any format. It is a provider at the end of
  the chain the configuration panel of S36 already manages.
- **Effort:** medium. The model download, the cache, and honest first-run messaging about size.
- **Verdict:** good-to-have, and the one item here with a direct line to the financial model.

### FI26. Capture stops at the share sheet: no clipper, no email address, no duplicate warning

- **Demand:** the playbook's Drill 5 table names the benchmark at
  `docs/research/frontmatter-pain-playbook.md:382`:
  `Evernote clipper + email-in (legacy benchmark) | Multi-mode clipping, tag-at-clip, OCR, per-account email address | Proprietary, restricted free tier, bloated - but the capture bar it set is unmatched by anything markdown-native`
  and the ranked requirements at `:399`:
  `6. **[L - new:clipper]** C6 Clipper v1 hard requirements (from obsidian-clipper's ranked backlog): clean extraction with fall-back-to-selection; images downloaded into the repo; frontmatter records source URL/date/author/title; duplicate-URL warning (+13); a clip NEVER silently produces an empty note (regression #895 class).`
  The failure modes, with counts, at `:353`:
  `- **Web clipper failure modes are specific and repeated:** images saved as remote URLs that 404 later (#1 issue, +32); per-site extraction breakage (YouTube #905, CJK #893); silent regressions (empty note after 1.7.0, #895); no already-clipped signal (#112, +13).`
- **Evidence the plan lacks it:** S26 is the capture screen and has three bullets.
  `docs/mvp0/PRODUCT-PLAN.md:582` `- A global shortcut opens one box that saves into an inbox note. No credits.`
  `:583` `- On the phone, the share sheet from any app lands in the same inbox, on Android after install.`
  `:584` `- The install card appears once.`
  `grep -c -i "clipper" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "bookmarklet" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "email capture" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  Email appears only as sign-in fallback and Razorpay notices, at `:1319` and `:1320`.
- **The problem it solves:** the plan's own justification for S26 at `:586` cites QuickAdd's
  2,113,472 downloads, then ships the smallest of the capture surfaces. The share sheet works on
  Android only, by the plan's own admission at `:544`.
- **Fit:** the clipper writes markdown with front matter, which is the product's native output, and
  the failure the research catalogues most (`remote-URL images that 404 later`) is exactly the
  kind of thing a byte-exact product should be proud of getting right.
- **Effort:** medium for a browser extension. Small for an email-in address, which is one inbound
  route and a parser.
- **Verdict:** good-to-have. The email address is the cheaper half and works on iOS, which the
  share sheet does not.

### FI27. Comments export as our JSON and no interchange format

- **Demand:** card F13 at `decisions/v2/features.json:2463`,
  `"Do comments live only in the review file, or do we also export an interchange format?"`
  and the playbook's resolution of T6 at `docs/research/frontmatter-pain-playbook.md:532`:
  `**Resolution:** Sidecar storage + guaranteed materialization: comments/suggestions exportable as JSON and via an optional CriticMarkup exporter into the repo; ...`
  The deadlock it is resolving, at `:99`, is a real six-year-old one:
  `- **The comments-storage deadlock (HedgeDoc #657, open 2020->2026).** Comments IN the markdown (CriticMarkup) pollute every other pipeline and make comment-only permission impossible ... comments OUTSIDE the file were vetoed by the core team ... Neither shipped; users left for HackMD/Google Docs.`
- **Evidence the plan lacks it:** `docs/mvp0/PRODUCT-PLAN.md:1415` is the whole of it:
  `- Comments and change-queue items, as a JSON file beside each document.`
  `grep -c -i "CriticMarkup" docs/mvp0/PRODUCT-PLAN.md` returns 0.
- **The problem it solves:** the plan's own export promise at `:1411` is
  `**Export.** Everything under Documents, Ideas and Settings leaves as files a stranger's tool reads.`
  A JSON file of our own shape is a file a stranger's tool can open and not a file a stranger's
  tool can read. CriticMarkup is the one format in this space that other markdown tools already
  understand, and the research's own recommendation is careful to make it an export rather than a
  storage format, which keeps the projection law intact.
- **Fit:** one exporter. Storage does not move.
- **Effort:** small.
- **Verdict:** good-to-have. It closes a stated promise that is currently one word short.

### FI28. The format landscape, and Djot by name, never reached any version of the plan

- **Demand:** our own gap register said so nine days before revision 6.
  `docs/GAPS-2026-09-08.md:68`, the first row of the table under `## E. Research that exists and never reached the plan`:
  `| **Markdown fundamentals** - CommonMark (69 files), GFM (51), MDX (28), Pandoc (28), kramdown (18), AsciiDoc (8); Djot (10 research reports, 0 lines in the assembled record) | Yes | **No** - §20 states the MDZ verdict and MDMAX and nothing of the dialect landscape | The plan cannot show why "no new format" is right, and never names Djot, which is the canonical "improved markdown" by CommonMark's own author and the reference point any reviewer will raise |`
- **Evidence it still has not:** `grep -c -i "Djot" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "MDX" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "AsciiDoc" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  `grep -c -i "kramdown" docs/mvp0/PRODUCT-PLAN.md` returns 0.
  CommonMark, GFM and Pandoc appear only as carrier names in the section 7 table and as URLs.
- **The problem it solves:** `CLAUDE.md:118` lists under `## Settled - do not re-litigate`:
  `- **The markdown format verdict:** build a compiler and an IDE, not a new format.`
  A settled position with no written comparison is a position that gets re-litigated by the first
  outsider who asks about Djot, and the plan has no paragraph to hand them.
- **Fit:** it is not a feature. It is one table in section 8 or section 20.
- **Effort:** small, and it is writing rather than building.
- **Verdict:** good-to-have, filed as documentation debt rather than product. This is the only
  item in this file that costs nothing to ship and still is not shipped after two revisions of
  being flagged.

---

## 5. Pain mapped to screen, and the ones with no screen

Our pain taxonomy, `docs/research/frontmatter-pain-taxonomy.md`, holds fourteen themes ranked by
severity times frequency at `:246` to `:263`. The plan holds 38 screens. This is the join.

Pain | Rank | Screen in the plan | Verdict
T1 Sync silently destroys data | 1 | S31 conflict, S21 history, S24 offline | **Partly.** No always-visible status, FI10
T2 Trust collapse, shutdown fear | 2 | S28 Data and export, S18 `.md` twin, S22 import | Mapped
T3 Price backlash, subscription fatigue | 3 | S29 plan and usage, S33 over the cap | Mapped
T4 Slow at scale, mobile startup | 4 | No screen, and correctly so; section 21 carries targets | Mapped as targets. One hole: `:1482` targets `Editor with a 10 MB document`, and the taxonomy's need 6 at `:279` asks for a 10,000-note **vault**. A big document and a big vault are different problems
T5 Lock-in, lossy export | 5 | S22 import, S28 export | **Partly.** No Evernote, OneNote or Apple Notes path, FI5
T7 Collaboration impossible in markdown | 6 | S19 live, S17 share, S20 change queue, S05 comments | Mapped, and this is the plan's strongest coverage
T6 Offline failures | 7 | S24 offline | **Partly.** No per-document cache state, FI6
T8 Too complex for normal people | 8 | S05 Doc mode, S02 first-time home | Mapped
T9 Platform gaps, no browser access | 9 | The web app itself, S25 desktop, phone layouts throughout | Mapped
T10 Git-as-sync fails non-engineers | 10 | S23 connections, S31 conflict | **Partly.** GitHub is push only, FI24
T11 Capture easy, retrieval impossible | 11 | **None** | **Unmapped.** No search screen, no retrieval feature, FI4
T12 Capture friction | 12 | S26 quick capture | **Partly.** Share sheet and a shortcut only, FI26
T13 Markdown and front-matter mangling | 13 | The engine, S10 problems | **Partly.** No screen for a refusal, FI3
T14 Publishing and sharing friction | 14 | S17 share, S18 published page, S30 portfolio | Mapped

**Fully unmapped: one, T11.** It is the only theme in the taxonomy with no surface anywhere in
the plan, and it is the theme that arrives exactly when an imported vault succeeds.

**Six are partly mapped**, and in every case the missing half is a visible state rather than a
feature: a sync indicator, an offline list, a refusal card, a search screen, an import source, a
pull direction. That is the shape of this whole lens. The plan has built the mechanisms and has
not everywhere built the place where a person sees them working.

---

## 6. The decision cards that were never answered, and what each one gates

There is no answer store in the repository. `find . -maxdepth 3 -name "*answer*" -not -path "./node_modules/*"`
returns nothing, and the live site keeps answers elsewhere. What exists is the compaction of
15 September, `decisions/v2/_final.json`, whose note at `:2` reads:
`The compact set, written 2026-09-15. Three decisions only the founders can take, five facts only they know, and every other card taken on its own recommendation with the reason on the card.`

So 210 cards became three open decisions, five facts, and 202 taken on their own recommendation.
Of the 23 the compaction put in front of the founders (`decisions/v2/_final.json`, the `meeting`
block), these are the ones the plan still does not answer, and each gates a feature rather than a
preference.

Card | Question | What it gates | Where the plan leaves it
**K1** | `What is frontmatter, in one sentence?` | 23 dependent cards, listed from `decisions/v2/_final.json:33` | Answered two ways at once. See FI14
**K2** | `Which document bytes do we ever hold on our servers, and from which phase?` | 25 dependent cards including AC1 the web byte path, AC3 the GitHub App permissions, F25 the search index, AC13 the AI key, AC21 offline keys, AC22 repository write access | `docs/mvp0/PRODUCT-PLAN.md:1738` keeps it open: `6 · Which bytes we hold, and from which phase \| It is an architecture, not a value`
**F35** | `Do we build authoring for the instruction files agents read, and is that the MVP's reason to exist rather than a later feature?` | Whether S11 is the product or a panel | The plan ships S11 as a panel. The first half is answered, the second is not, and K1 rec b says it should be the reason to exist
**F36** | `Is sharing a live editing session, or a link somebody reads and comments on?` | S19 in its entirety | Both are in the plan, and `:1755` reopens one: `8. Live editing and the CRDT ban.`
**MK4** | `Which buyer does the first version serve, and do idea mode and decision flow stay in the pilot while that is settled?` | Build order for phases C and D | `:39` defers it: `**Deferred on purpose, to be settled during the build** [Z]: the tagline, the positioning and the product-market read.` Meanwhile `:124` says `only the third group is proven to pay today`
**L6** | `Do we close publishing to founder-only, and adopt noindex and system-assigned slugs as a standing rule?` | S18 and the only growth channel | Half open. `:1764` is question 17 on indexing. `grep -c -i "noindex"` returns 0, and `:934` uses `frontmatter.in/p/slug` without saying who assigns the slug
**P26** | `Does the AIOS ship as a product, or do three things from it ship as templates while the rest stays private?` | The templates of section 9 and their source | `grep -c -i "AIOS" docs/mvp0/PRODUCT-PLAN.md` returns 0. The card is not mentioned, refused or answered
**B2** | `How is the build funded: services booked before it starts, one engagement a quarter alongside it, or a raise?` | Twenty-seven weeks of appetite at `:1628` | `grep -c -i "funding" docs/mvp0/PRODUCT-PLAN.md` returns 0. Section 22 costs the product and never says who pays for the build; `:1549` names the founders' time and stops there

**Answered, and worth recording as such**, so nobody reopens them: AC20 the front door at `:238`,
F34 the consistency check at `:465`, F19 the public page as S18, PR24 what is paid at `:239`,
FL21 the empty states as S02 and S34, PL5 the pilot's meaning as section 28, FF1 the form factor
at `:1604` `The extension form factor | earlier plans | Not planned`, FF8 the desktop as S25 and
phase F, G15 recruitment at `:1687`, L3 the legal clocks as section 23, and R17 at `:215` to
`:219`, which relabels the founder tests untested in the plainest terms available.

---

## What I could not reach

- **Any answer a founder actually gave.** There is no answers file in the repository, so I cannot
  say which cards were answered on the live site. Everything in section 6 above is derived from
  `decisions/v2/_final.json` and from what the plan does or does not say.
- **`docs/FRONTMATTER-PRD-v2-2026-08-29.md` and `docs/FRONTMATTER-RECORD.md` beyond grep.** Both
  are too large to open, per this repository's own instruction. I grepped them for the terms in
  this file rather than reading section 57 and the contradictions ledger whole, so a contradiction
  recorded only there and nowhere else would not appear in this document.
- **The v4 and v5 print HTML.** I compared revision 6 against `docs/mvp0/MVP0-PLAN-v3.md`, which
  is markdown. The v4 and v5 artefacts are 250 to 350 KB of generated HTML of the same content,
  so a row dropped between v4 and v5 specifically, rather than between v3 and v6, is not covered.
- **`docs/research/2026-09-09/research-raw.txt`**, 278 KB. I used the BRIEFING and VERIFIED files,
  which that round says override it.
- **Any count that is not already written in one of our files.** This lens opened no web page, so
  every number here is quoted from our corpus and carries whatever tag that corpus gave it.

## What surprised me

1. **The plan names its own top-three demand signal and then does not build it.** Global search and
   replace, 650 hearts, sits at `docs/mvp0/PRODUCT-PLAN.md:162` under a heading that says it is one
   of the three that matter most, and appears nowhere else in 2,129 lines.
2. **There are 38 screens and not one of them is a refusal, and not one of them is search.** Both
   are named in the plan as things the product does.
3. **The plan cites K1 recommendation b and states K1 option a**, and 23 cards were closed on the
   assumption that b was the answer.
4. **The pilot recruits vaults of at least 200 files into a 50-document free tier**, and the plan
   uses the very sentence `an imported vault is hundreds` to argue the cap up from 5 to 50.
5. **The change queue is the plan's central control, and the only agent path into it is the
   desktop folder.** A person on the web whose agent commits to GitHub has no route in, because
   GitHub is push only while Drive is two-way.
