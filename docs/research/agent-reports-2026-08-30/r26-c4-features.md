Reconcile verified — `~/.claude` HEAD `6e390828` unchanged, all 20 dirty paths pre-existing, no writes or commits by this subagent.

---

**The record contains a written five-gate feature-admission test (§103) whose first gate demands a named user and a named frequency — and of the 163 features in its own inventory, 11 name a frequency and 1 names a persona, which means 162 of 163 fail gate one on the document's own text, and the reason the roadmap holds 650 points is that nothing has ever been made to earn its place.** [measured: `grep` over `PRODUCT.md:655-862`]

---

**WHAT IS GOOD, SPECIFICALLY**

| | Why it is genuinely good |
|---|---|
| **§103's admission test** | Five gates, each answered by an *artifact* not an opinion, with an asymmetric burden (proposer carries the clock) and a tie-break that converts "users want this" into "we disagree about G1". Companies twenty times this size do not have one. The failure is not the test — it is that only 10 of 163 features were ever run through it (6.1%) |
| **`r24-v1`** | The best report in the 97. It read the source, ran the module in Node, and produced the company's single most persuasive artifact: `table-edit.ts` turning 100 bytes into 84, rewriting 3 of 5 lines on a one-cell edit, and taking a CRLF file from 4 carriage returns to 1. That is a working demonstration, in your own repo, of exactly what regenerating costs |
| **§40's refusal taxonomy** | 11 codes, 4 fixed slots, 280-char budget derived from Postgres + RFC 9457 + rustc with the divergences written down, `modal: never`, and an explicit ban on badging the guarantee. This is better than what most funded editors ship |
| **The measured numbers hold** | I re-verified two at random. `splice-frontmatter.ts` has exactly **20** `return src` sites today [measured]. USD/INR is **95.39** [fetched frankfurter.app 2026-08-31, rate date 2026-08-28], so §93's ₹95.39 is right and `r25-w2`'s ₹88 is the outlier — ₹299 = **$3.13**, not $3.40 |
| **`r24-v4` step 5** | `57,039 bytes unchanged — hash verified` is the only sentence in this entire corpus that a competitor structurally cannot write. Keep it |

**STEELMAN.** Agents now write more markdown per week than humans do, every incumbent that writes it regenerates the file, and regeneration silently drops reference-link definitions, doubles blank lines and destroys carriage returns — Cursor staff called this "a known issue we're tracking" three days before you looked, and Cline shipped four line-ending PRs in eight months and still has an open issue (`r24-v3`, `r25-w2`). A byte-addressing engine that refuses rather than guesses is the correct architecture for that world, it exists, it is tested against 8,513 files, and no competitor can retrofit it because their write path is a serializer. The product is the one editor that can print a hash proof of what it did *not* touch. That is a real technical position and I am not going to pretend otherwise.

Now the audit.

---

**FATAL — 1 finding**

**F1. The feature inventory cannot be audited, because it does not record what an audit needs — and 130 of its 650 points are committed to features whose own evidence column reads NONE.**

| Measurement | Value |
|---|---|
| Inventory rows | 163 |
| Total build cost | **650 pts** = 708.5 calendar days at §95's own 1.09 conversion = **1.94 years solo** [derived] |
| Rows whose Evidence column is literally `NONE` | **36 (22.1%)** |
| Rows whose only evidence is `[inference]` | 7 (4.3%) |
| **Rows with no observed signal at all** | **43 (26.4%)** |
| Points in the NONE rows | **130 pts = 141.7 calendar days** |
| Points in the entire MVP-0 + MVP-1 + MVP-2 plan | **125 pts = 136 days** |
| Rows naming a frequency | **11 (6.7%)** |
| Rows naming a persona (P1–P5) | **1 (0.6%)** |
| Rows ever run through §103's admission test | **10 (6.1%)** |

The NONE block costs **104% of the entire three-stage plan through 2027-01-14.** It contains, at M or larger: tag rename/merge/nest, continuous certificate, vault-level engine ops, decision card, Marp slides, named-version history, publish/unpublish (L), custom domains + wildcard TLS, AEO linter, CriticMarkup interchange, **a 29-endpoint typed RPC HTTP API (XL)**, PATs/webhooks, retro-capture, quick capture + `HOME.md`, browser plugin, Windows/Linux builds, multi-vault bindings, and roles/permissions/sharing (L).

You asked me to kill anything that cannot name a user and a frequency. Applied literally, the rule removes 26.4% of the inventory and 20% of its cost, and it removes the wrong things — it kills Windows builds (#149, NONE) while sparing Marp slides. **The rule is right; the inventory is unscoreable, so the rule cannot execute.** That is the fatal part: you have a governance mechanism and a corpus it cannot read.

It is FATAL rather than SEVERE because §94's own closing paragraph concedes the alternative — deterministic projections out-install every AI capability 7.25× — and then puts them fourth anyway. A 650-point inventory with no frequency column and a documented tie-break that never ran is how a solo founder spends 1.94 years and arrives with no users. §53's constraint ("One person") makes the arithmetic unsurvivable, not merely uncomfortable.

**Falsifier:** produce a version of §94 with a `frequency` column filled for ≥120 rows from anything other than a founder's guess — support tickets, issue counts per command, or the `U` metric §103 already defines. If ≥60% of rows survive with a weekly-or-better frequency, this finding collapses to SEVERE and the inventory is merely large.

One internal contradiction to fix while you are in there: **#28 "Rename with link rewriting" carries `NONE`** in §94, while `DECIDE.md` §3.2 cites **86 likes** on broken-links-on-rename from `r24-v2` and calls it "byte-exactness sold as a capability." Your two Tier-0 documents disagree about the evidence for the same feature.

---

**SEVERE — 4 findings**

**S1. The table-stakes floor is 17.5 engineering days and appears in exactly zero of the three MVP stages.**

`grep -ci "hotkey|keybind|shortcut|palette|table edit|outline"` over `PRODUCT.md:906-1048` — the entire MVP-0/1/2 plan through 2027-01-14 — returns **0** [measured]. Not "low priority." Absent.

| `r24-v1` gap | Cost | In any MVP? |
|---|---|---|
| ⌘1–6 headings, ⌘K link, list/quote/task toggles, checkbox toggle, move-line-up/down | 0.5 d | No |
| Outline hotkey + fuzzy heading jump | 0.5 d | No |
| Command palette that indexes everything and shows hotkeys | 1–2 d | No |
| Quick-switcher deltas (recents-on-empty, Enter-to-create, ⌘Enter new tab) | 0.5 d | No |
| HTML paste → markdown | 2–3 d | No |
| Table editing: Tab nav, add/remove row+col, alignment | 5–8 d | No |
| Splice-backed table writes | +2 d | No |
| Customisable keymap | 3–4 d | No |
| **Total** | **13–21 d, midpoint 17.5** | **0 of 8** |

Your brief says "a reviewer who cannot find quick-switch stops writing the review." **Correct the premise: you have quick-switch.** `Spotlight.tsx` on `mod+k` with subsequence-ranked fuzzy match, verified live — `useHotkey("mod+k", openSpotlight)` at `KnowledgeUI.tsx:56` [measured]. The floor gap is not discovery. It is *formatting*: `CodeMirrorEditor.tsx:224-226` binds exactly **three** formatting keys — `Mod-b`, `Mod-i`, `Mod-e`. No ⌘1–6. No list. No quote. No task. `toggleTaskAtLine` is already written at `toolbar-transforms.ts:112` and simply unbound.

**And here is the finding nobody in the 97 reports made:** you bound ⌘K to the quick-switcher. In Typora, Bear, iA Writer, Obsidian and VS Code, **⌘K is insert-link** — and every one of them puts the switcher on ⌘O or ⌘P. So the single most-muscle-memoried key in markdown editing does the wrong thing, and the thing it does has a conventional home you left empty. A reviewer discovers this in the first ninety seconds, by pasting a URL over a selection and hitting ⌘K.

**The scheduling arithmetic is worse than the day count.** §95 converts at 1.09 calendar days per point and asserts the measured 25% active-day density is *inside* that rate. I checked the density: **8 distinct commit days in the last 32 = 25.0%** [measured, `git log`] — the record's figure is right. But then 17.5 engineering days of floor work is **70 calendar days if those are person-days, 104–140 if `r24-v1` meant pair-days** — against the ~18 points §94 would assign the same work, which converts to **19.6 calendar days**. The record's conversion rate is optimistic by **3.6× to 7.1×** against the one estimate in the corpus derived by reading the actual source.

**Falsifier:** implement `r24-v1` items 1–4 (claimed 3 days) and time it. If it lands in ≤4 working days, the conversion rate holds at the small end and this drops to SERIOUS. If it takes ≥10, every date in §95 is fiction and MVP-0's 2026-10-11 should be restated.

**S2. The flagship interaction is a free feature of a competitor, and its cost grows with the thing that makes it necessary.**

I re-verified Zed live today rather than trusting `r25-w2`. `https://zed.dev/docs/ai/agent-panel`, HTTP 200, 2026-08-31, verbatim: *"You can accept or reject each individual change hunk, or the whole set of changes made by the agent."* Plus inline: *"the same keep/reject hunk controls as the multi-buffer review pane."* [fetched] Zed's editor is $0.

Now the usability attack you asked for. Model a 40-hunk agent change through `r24-v4`'s own step 6 (`Tab`/`Shift-Tab` walk, `y`/`n` per hunk):

| Quantity | Derivation | Value |
|---|---|---|
| Keystrokes, minimum | 40 × (1 nav + 1 decision) | **80** |
| Words that must be read to judge | 40 hunks × ~110 words (old span + new span + one sentence context either side) | **~4,400** |
| Reading time, careful judging @200 wpm | 4,400 / 200 | **22 min** |
| Reading time, skim @300 wpm | 4,400 / 300 | 15 min |
| Decision latency @3 s/hunk | 40 × 3 s | 2 min |
| **Total review** | | **17–25 min** |
| Agent generation time | | **~60 s** |
| **Review : generation ratio** | | **17–25 ×** |

The ratio is the product's structural problem, and it gets *worse* as agents get better, because better agents produce larger changes. The market's revealed preference is documented and it is not on your side. The person who coined the working style your target users are in wrote the spec himself: *"I 'Accept All' always, I don't read the diffs anymore"* [fetched, HN 44780165, quoting Karpathy]. And empirically, larger agent changes are *less* likely to merge at all — logistic regression over the AIDev dataset finds "larger change sizes ... associated with a lower likelihood of merging" [fetched, arXiv 2602.19441, 2026-02-23]. A 40-hunk review is not a feature you are selling; it is the failure state your users route around.

**Is it better than `git add -p`, which is free?** Partly — and less than the record claims. §95.2 asserts that *"'reject' in every other tool means 'revert to the last commit and lose the four good changes too'."* **That is false and was checkable in ten seconds.** On this machine, git 2.50.1: `git restore -p`, `git checkout -p` and `git add -p` all report `-p, --[no-]patch  select hunks interactively`, and `git restore --patch` "interactively select[s] hunks in the difference between the restore source and the restore location" [measured, `git help restore`]. Per-hunk *discard* of an agent's uncommitted changes ships free, offline, in every git install, and has for years.

What genuinely survives: word-grain hunks instead of line-grain; hunks in an open buffer with unsaved changes, which git cannot see; and the hash line. That is a real but *narrow* delta, and §94 prices `land()` + review surface at **16 of MVP-0's 38 points (42%)** to reach parity with a documented free feature plus a delta you can state in one sentence.

**Falsifier:** put the two side by side in front of ten strangers with a 40-hunk agent change. If ≥6 finish the review in your surface and ≥3 abandon it in `git add -p`, the delta is real and worth 16 points. If ≥5 hit "accept all" in both, the interaction is theatre and MVP-0 has no demo.

**S3. The refusal moment costs the user 100% of an action's value and delivers a benefit that is, by your own rule, unshowable.**

Model the actual moment, using `r24-v4`'s own copy. User selects a paragraph, ⌘J, "restructure." Engine emits `UNLOCATABLE` before any model call: *"Nothing changed. This selection spans the start of a fenced block, so the engine could not find one unambiguous range."* `Show me`.

| What happens next | Why | Cost to us |
|---|---|---|
| Adjust selection, retry | Best case. Requires the user to hold the concept "fenced block boundary" | +5 s, benign |
| Not understand the message | The headline names a **mechanism**, and §40's own anti-pattern table bans implementation nouns in tier 1. "Spans the start of a fenced block" is an implementation noun in a cardigan | Silent confusion |
| **Do it by hand** | **We added a step and removed nothing.** This is the modal outcome for prose selections | Net negative |
| Alt-tab to Claude Code, which will just do it | The competitor never refuses. Its corruption is invisible; our refusal is not | Churn |

The asymmetry is the whole finding: **the refusal's benefit is that nothing happened, and §40 correctly forbids you from celebrating it** — *"do not badge it. A celebration on every refusal becomes chrome."* So the product's founding principle is simultaneously the value proposition and the thing you have written down that you may not show.

The market evidence is one-directional. `r25-w2` counted **323 issue threads about refusal messages across 7 repos** — "String to replace not found" (71), "File has been unexpectedly modified" (102), `"not unique" edit` (150) — and **every one is a complaint about being refused, not a request for it** [measured]. Claude Code already refuses. Users already hate it. You are proposing to sell the thing they file issues about.

And today the refusal is not even renderable: 20 `return src` sites in `splice-frontmatter.ts` make a refusal byte-identical to a successful no-op, and `PropertiesPanel.tsx` drops it at `if (!onEdit || next === content) return;` [measured, re-verified at HEAD]. `r21-s7` is right that the discriminated-union return is the highest-leverage engineering item you own — it is not on MVP-0's list.

**Falsifier, and it is a pincer:** instrument `cert_refusal` per activated user per 30 days, which §94 already proposes. If **fewer than 1 in 20** activated users hits any refusal, the refusal UX is not a churn risk — but then §94's own stated falsifier fires and the six visible engine moments are theatre. If **more than 1 in 5** hits one, this is SEVERE as written. There is no value of that metric at which both the refusal-UX defence and the engine-as-differentiator claim survive together.

**S4. The plan bans configuration, and the shipped settings surface is five booleans — one of which is a feature the record says it refuses.**

`editor-settings.ts` ships exactly: `vimMode`, `lineNumbers`, `spellcheck`, `focusMode`, `aiGhostText` [measured]. §103's gate G5 makes "a configuration surface an automatic fail, not a trade."

`grep -ci "font size|zoom|dark mode|word wrap|appearance"` over all 169 KB of `PRODUCT.md`: **0** [measured]. Font size, zoom, theme, editor width, word wrap and tab size do not appear in a 163-row inventory that includes Marp slides and a companion browser plugin. These are not configuration bloat; they are the first three things a person does in a new editor, two of them are accessibility affordances, and one of them (#34 accessibility baseline, M, evidence "legal exposure") is in the inventory while the actual control that delivers it is not.

Meanwhile `aiGhostText` — which §11.4 explicitly refuses ("no ghost text by default") — is shipped, wired through a CodeMirror compartment, and uploads the **entire document prefix** on every 650 ms idle to a server that keeps the last 1,500 chars: ≈210 KB/min to discard 95% of it [measured, `r24-v4`]. The one setting you built is the one you wrote down that you would not.

**Falsifier:** ship to 20 users and count support contacts. If zero ask for font size or a light/dark control in 30 days, G5 is calibrated correctly and this is MINOR.

---

**SERIOUS — 3 findings**

**R1. Nine of the eleven day-one absences are not in the inventory at all.** §94 claims "omission is the failure mode" and lists borderline items rather than curating them away. Missing entirely: font size / zoom; theme / appearance; word wrap; editor width; tab size; an in-app "report a bug" path (§95.3 provides one email address and no affordance to reach it); and — the important one — **any scope control on what an agent may write.** `grep -ci "allowlist|denylist|scope control|which files|permission to write|gitignore"` over the full inventory returns **0** [measured]. §12's `land()` carries `base_version` for drift, but nothing in 163 rows lets a user say "the agent may touch `docs/` and not `src/`." For a product whose entire pitch is adjudicating agent writes, that is a stranger omission than any of the twenty features it did list with evidence NONE.

Present-but-cut-from-every-stage: Windows/Linux builds (#149, evidence NONE, cut) and mobile (#150, which §16.2 ranks **the #1 churn-risk gap**, cut). The three-stage plan through 2027-01-14 ships a macOS-only desktop product to a globally distributed developer audience.

**R2. The ₹299 tier is not the pricing problem; the fact that the record has two exchange rates is.** §93 uses ₹95.39/$; `r25-w2` uses ₹88/$ [inference; rate unverified]. Live: **95.39, rate date 2026-08-28** [fetched]. So ₹299 = **$3.13** and ₹599 = **$6.28** — `r25-w2`'s $3.40/$6.80 overstate by 8.4%, which makes its conclusion *stronger*: your top tier is 63% of the cheapest anchor in the category ($10 Zed Pro / Copilot Pro / JetBrains AI Pro), and JetBrains already sells AI tooling into India at **$11.80 including 18% GST** [fetched, `r25-w2`]. Cross-referenced with finding #3 in your brief — price is the #1 weekly complaint at 15.7% — the resolution is that *their* price complaints are about $20 tools, not $3 ones, and pricing below the floor of a machismo category signals accessory. Not re-litigated here; see `r25-w3`.

**R3. `r24-v1` found a shipped feature that does the exact thing the company exists to refuse, and it is still in the tree.** `table-edit.ts` regenerates: one cell edited → 3 of 5 lines rewritten, 100 bytes → 84, CRLF file's carriage returns 4 → 1 [measured, `r24-v1`, module executed in Node]. `DECIDE.md` §10 already says delete the UI and keep the measurement as a test. Correct call. Do it this week, because the day a prospect finds it, the demo is over — and per `r24-v4`, ghost text is a *second* instance of the same class in the same tree.

---

**MINOR — 2**

**M1.** §28's R0 header says 58 points; §28.1's thirteen rows sum to 50 [derived, §95.1 already flags it]. Eight points is nine calendar days and nobody has reconciled it.
**M2.** §94 numbers rows 1–163 but the table structure of row 1 differs from the other 162, which is why every count in this report is stated against 162 parsed rows plus row 1 (`∅`, evidence NONE) reconciled by hand.

---

**THE FEATURE SCORE, IN BANDS**

Scoring all 163 in prose is the same error as writing them. Four bands, and the test is §103's own G1 — named user, named frequency:

| Band | What is in it | Rows | Points | Verdict |
|---|---|---|---|---|
| **A — Earns its place** | Splice writer (#40), typed refusals (#41), NF-1/NF-2/NF-3 (#42–44), shape gate (#50), branded offsets (#51), CI (#65), review surface (#124), `land()` (#123), find/replace in file (#13), vault search (#3), file tree, export (#93–95) | ~20 | ~70 | **Ship.** Named user = anyone who opens the app; frequency = per session |
| **B — Table stakes, unscheduled** | `r24-v1`'s eight gaps + ⌘K collision + font size/theme/wrap (unlisted) | ~12 | 13–21 eng-days | **Ship before anything novel.** Absence is disqualifying — every product in the survey has them |
| **C — Plausible but unscored** | Kanban (#81), calendar (#82), table/dashboard render (#84), vault-wide find/replace (#14), rename-with-link-rewriting (#28), Properties types (#36), CJK tokenizer (#23), conflict inbox (#100) | ~35 | ~180 | **Defer until each has a frequency.** #81/#82/#84 have the strongest evidence in the whole inventory (7.25× install ratio, Dataview 4,857,171 downloads) and are cut from all three stages — that ordering is the argument §94 makes against itself and loses |
| **D — Kill or park** | The 36 NONE rows + Marp slides, decision card (0.0004% of registry downloads, `r21-s6`), companion browser plugin, custom domains, AEO linter, typed RPC API (XL), CriticMarkup, retro-capture, multi-vault | ~55 | ~200 | **Kill now.** None names a user; several are refuted by the record's own counted evidence |

That is roughly **200 points removed, 265 deferred, 90 kept.** It does not make the company work. It makes the next six months legible.

---

**WHAT I WOULD DO, IN ORDER**

1. **This week, three days:** `r24-v1` items 1–4. ⌘1–6, ⌘K→link (move Spotlight to ⌘O), list/quote/task toggles, bind `toggleTaskAtLine`, outline hotkey, palette that indexes everything. Delete `table-edit.ts` and `ghost-text.ts`; keep both as red-proof tests. This is the cheapest credibility in the document and it is currently scheduled nowhere.
2. **Give splice the discriminated union before building any AI flow.** `r21-s7` names it the highest-leverage item; 20 `return src` sites make the founding principle unrenderable.
3. **Add a `frequency` column to §94 and run the tie-break clause.** Anything that cannot be filled from an issue count, a support ticket, or an install number goes to band D. §103 exists; use it once.
4. **Change the demo.** Per-hunk review is Zed's, free, verified today. The demo that survives is the one nobody else can run: **point it at the prospect's own repo and print, per file, exactly which constructs will not survive** — §94's own preferred cut, and the only artifact in this corpus that a stranger can check in five seconds against a folder they already own.
5. **Decide finding #1's question before any of the above:** one founder or two. At 650 points and 25% active-day density, the difference is not a schedule variance. It is whether the plan exists.
