# Review coverage, 18 September 2026

**What this is.** An item-by-item check of what landed from the founder's screen review of
18 September and the follow-up instructions, after the implementing session hit a usage limit.

**How it was checked.** Read-only. Each row cites a file and line, a commit, or a PNG that was
opened and looked at. Every citation was checked with grep or sed while writing.

**Sources of what was asked.** `docs/mvp0/SCREEN-CHANGES-2026-09-18.md` in full, plus the
follow-up instructions as relayed in the audit brief.

**Sources of what landed.** Commits `e844f0b` to `40e6221`, `docs/mvp0/screens/gen.mjs`, the PNGs,
`PRODUCT-PLAN.md`, `SCREENS.md` and `docs/pack/`. Another session committed three times during this audit; the latest commit was `40e6221` at the last check.

**Statuses.** applied, partly, not applied, deferred by founder. A "no change" instruction counts
as applied when the screen was left alone.

## 1. Item by item

\# | Screen | What was asked | Status | Evidence | What remains
---|---|---|---|---|---
1 | S01 | Real Google and GitHub brand marks, not placeholders. | partly | `3bdaaa8` added `icons/brand-google.svg` and `brand-github.svg`. PNG `s01-sign-in.png` and `s01-sign-in-phone.png` looked at: GitHub renders, the Google mark shows only a small blue fragment. | Fix `brand()` at `gen.mjs:604`. Its regex keeps only opening `<path>` tags, so the four Google paths nest inside each other and only the first draws.
2 | S01 | The phone view is bland; give it the same theme as desktop. | not applied | `git diff 0f88b93 HEAD -- gen.mjs` shows no change to the phone frame CSS except three idea-layout rules. `s01-sign-in-phone.png` is still a plain card on grey. | Design the phone theme treatment and regenerate.
3 | All phones | Check every phone panel against that theming note (SCREEN-CHANGES:20) | not applied | Same diff as row 2. `s04-workspace-phone.png` and `s13-idea-low-phone.png` looked at: unchanged treatment. | Same as row 2, across all 38 phone renders.
4 | S02, S03 | Both fine, no change. | applied | PNGs were regenerated in `fd79c67`; the only content change is the Free caps line built from `CAPS.collab` (`gen.mjs:841`) | None.
5 | S04 | Remove Shortcuts. | applied | `PRODUCT-PLAN.md:354`. Not present in `s04-workspace.png` | None.
6 | S04 | Add file moves to the left rail. | applied | `tree()`, Add file at `gen.mjs:656`. Seen at the foot of the tree in `s04-workspace.png` | None.
7 | S04 | A second rail button, Add idea. | applied | `gen.mjs:657`. Seen in `s04-workspace.png` | None.
8 | S04 | An upload control, placement proposed in section 8.1. | partly | Drop hint at `gen.mjs:665`, and Add file carries a chevron. `PRODUCT-PLAN.md:351` describes the menu. | The Add file menu (New document, Upload files, Upload a folder, Import from) is drawn on no screen. grep finds none of those labels in `gen.mjs`
9 | S04 | Collapsibles move to the top of the rail. | applied | `rail()` at `gen.mjs:721`. `s04-workspace.png` shows four rows above the outline. | "Commands" was named in the review and appears nowhere. Confirm it was dropped on purpose.
10 | S04 | Open tabs move to the top. | applied | `PRODUCT-PLAN.md:350`. Tab strip sits directly under the header in `s04-workspace.png` | None.
11 | S04 | The formatting toolbar moves up, so the section rises. | applied | `3bdaaa8` message: "the editor starts 12px higher". Toolbar sits directly under the tabs in `s04-workspace.png` | None.
12 | S04 | Share becomes an icon only. | applied | `top()` at `gen.mjs:640` renders the share icon with no label. Seen in `s04-workspace.png` | None.
13 | S04 | Decide the frontmatter wordmark's placement. | applied | `PRODUCT-PLAN.md:350`: the workspace carries the mark only; the wordmark stays on the front door and published page. | None.
14 | S04 | AI launch behaves like Notion's and opens over the workspace. | partly | Specified in `docs/pack/12-screens/S04.md:54` and `S06.md:58`. `s04-workspace.png` still shows a full-width AI edit button in the rail foot. | No screen draws the Notion-style launch. S06 shows the box docked in the main column, not over it.
15 | S04 | The whole interface very simple. | partly | The idea flow was simplified (`567b6f2`). Judgement call, not measurable. | S34 still carries the four-step breadcrumb that `567b6f2` removed from S12 as cognitive load (`gen.mjs:1654`)
16 | S05 | Dark mode is fine. | applied | No change requested or made. | None.
17 | S05 | Font controls in Doc mode, few fonts. | partly | `docbar()` at `gen.mjs:702` and `:703` adds a font face and a size stepper on the first level. | `PRODUCT-PLAN.md:363` and `SCREENS.md:86` still say font and size sit behind More. Text and screen disagree.
18 | S05 | Research note: the properties panel must hold nested YAML. | partly | `docs/pack/12-screens/S05.md:136` and `:139`: specified, not built, not drawn. | Draw the properties panel. This was a research note, not a founder instruction.
19 | S06 | Make it unambiguous whether the user is editing a document. | applied | Target line at `gen.mjs:901`: "Writing a new document Untitled.md" with Change. `PRODUCT-PLAN.md:373` | None.
20 | S06 | Box placement follows the content, below or to the right. | partly | Below is drawn in `s06-ai-writing.png`; the rule is in `PRODUCT-PLAN.md:375` | The right-hand placement is not drawn on any screen.
21 | S06 | Working on an idea, that context appears and stays. | partly | Written as a rule in `PRODUCT-PLAN.md:374` | No screen draws the box in its idea state with the pinned "Idea:" line.
22 | S07 | Fine as drawn. | applied | No change. | None.
23 | S08 | No instruction. | applied | No change. | None.
24 | S09 | Flow view deferred, not built now. | not applied | `PRODUCT-PLAN.md:406` still carries a full S09 section, and `:891` lists Flow view as MVP 0. | Mark S09 deferred in the plan, the screens sheet and `docs/pack/12-screens/S09.md`
25 | S10 | Build what is there. | applied | Panel unchanged apart from the filter. | None.
26 | S10 | Two toggles, human reviews and AI reviews. | partly | `gen.mjs:1021` draws All, Checks, Writing. `SCREENS.md:129` reads it as deterministic against model, not human against AI. | The panel holds no human items, so the split was reinterpreted. Confirm the reading with the founder.
27 | S11 | Follow the research: the whole instruction-file set, no claim that tidying helps the agent. | applied | `6e282a6`: five files, which tool reads each, links and copies, drift flagged, and an explicit refusal to claim a gain. | `PRODUCT-PLAN.md:281` still lists "The instruction-file health panel"
28 | S12 to S14 | Rethink the idea flow, phone included, like Gemini, Claude and ChatGPT. | applied | `567b6f2`. `s12-ideas.png`, `s13-idea-low.png` and `s13-idea-low-phone.png` looked at: one centred column, one input. | See rows 15 and 66 on the separate Ideas route.
29 | S12 | Low, Medium and High read like Claude's model selector. | partly | Selector pill and menu at `gen.mjs:1123` and `:1124`, seen in `s12-ideas.png` | The Medium icon is blank: `icons/insights.svg` is drawn in a 24-unit box but `ic()` renders it in the 960-unit box.
30 | S13, S14 | Medium and High keep Low's interface, no second route. | applied | `s14-idea-medium.png` looked at: same column, progress bar and page controls. | None.
31 | S13 | The user enters the idea; questions appear on the next page. | applied | S12 input then S13 questions, `PRODUCT-PLAN.md:452` | None.
32 | S13 | 10 to 15 questions, count set by complexity. | applied | `PRODUCT-PLAN.md:454`; selector copy at `gen.mjs:1123` | None.
33 | S13 | Four questions a page, at most. | applied | `PRODUCT-PLAN.md:454`. `s13-idea-low.png` shows three answered and a fourth being rewritten. | None.
34 | S13 | Answering rewrites later pages in real time. | applied | `gen.mjs:1177`, "Rewriting this and the next two pages" | None.
35 | S13 | The user is told; the section blurs or shows processing. | applied | Blurred card with a spinner and the reason, seen in `s13-idea-low.png`. `PRODUCT-PLAN.md:457` | None.
36 | S13 | Later questions generated live from the choices. | applied | Branching flag, `PRODUCT-PLAN.md:456` | None.
37 | S13 | Page one carries Skip and Choose recommendation. | partly | Desktop page nav at `gen.mjs:1180`, seen in `s13-idea-low.png` | The phone (`gen.mjs:1199`) labels the button "Recommended" and has no Next. The button's `auto_awesome` icon renders blank, see row 81.
38 | S13 | Page two adds Skip all. | applied | `gen.mjs:1181`; phone at `:1235` | None.
39 | S13 | Skip all modal says what happens, plan and kickoff prompt included. | applied | `gen.mjs:1226`. `s14-idea-medium.png` looked at: the modal names the brief, the blueprint and the kickoff prompt. | None.
40 | S15, S16 | No instruction. | applied | No change. | None.
41 | S17 | Share by frontmatter email address. | applied | `PRODUCT-PLAN.md:508`; email field at `gen.mjs:1302` | None.
42 | S17 | Not in the database, so offer to invite. | applied | `gen.mjs:1303`, "is not on frontmatter yet" with Send invite. | None.
43 | S17 | An invite earns about 5 credits. | partly | `gen.mjs:1303` and `PRODUCT-PLAN.md:509`: 5 AI credits to both sides. | The number is not a row in `docs/pack/28-CONFIGURATION-PANEL-SPEC.md` or `53-PRICING-AND-ENTITLEMENTS.md`; grep finds no "invite" in 28. See row 63.
44 | S17 | The same referral modal is reused after sign-up. | partly | Stated at `PRODUCT-PLAN.md:509` | The referral modal is not drawn on any screen.
45 | S18 | The open-in ladder, decided as content first, invitation second (section 10.2) | partly | Desktop: `gen.mjs:1331` open bar with app, web, stay here, and `PRODUCT-PLAN.md:521` | The phone render shows only the password gate, so the ladder has no phone drawing.
46 | S18 | `page.md` and `llms.txt` never gated, redirected or interstitialed. | applied | `PRODUCT-PLAN.md:522` | Absolute rule; carry it into the route tests.
47 | S18 | The gate sits on editing, not reading. | applied | `PRODUCT-PLAN.md:523` | The "Read this properly" card at `gen.mjs:1337` sits over the page; confirm it is an offer and not a gate.
48 | S19 | Free gets one collaborator, Pro several; section 13 to match. | partly | `CAPS.collab = 1` at `gen.mjs:16`; `PRODUCT-PLAN.md:510` and `:1106` | `PRODUCT-PLAN.md:240` and `SCREENS.md:29` still say 3. Section 18 was corrected to 1 in `4e9f0bc`, committed by a parallel session during this audit. Copy at `gen.mjs:1306` and `:1359` reads "1 live collaborators"
49 | S19 | Moving the edit, live and reading split: not required now. | deferred by founder | SCREEN-CHANGES:161. | Revisit after the build.
50 | S20 | Fine, but less cluttered. | partly | Filter added at `gen.mjs:1372`; `s20-review.png` in `6e282a6` | No other decluttering visible. Judgement call.
51 | S20 | Split by category with toggles: AI, human, other. | partly | `gen.mjs:1372`: All, People, AI and agents. | No "other reviews" position. Agents sit with AI rather than apart.
52 | S21 | No instruction. | applied | No change. | But see row 65: history mixes people and AI with no toggle.
53 | S22 | Upload must be obvious in the interface. | applied | Drop hint on every workspace tree (`gen.mjs:665`), Import start at `gen.mjs:825`, S02 empty copy at `:841` | The Add file menu, row 8.
54 | S23 | No instruction; research proposal still open. | applied | No change. | The research proposal in SCREEN-CHANGES section 7 is still unanswered.
55 | Platform | A progressive web app is planned, native later. | applied | `docs/pack/29-PLATFORM-AND-DESKTOP-SPEC.md:16` | None.
56 | Platform | Idea mode on the web, the desktop, or both (proposal 8.2) | partly | `docs/pack/29-PLATFORM-AND-DESKTOP-SPEC.md:41` adopts "on the web" | 29 tags it `[Z]` decided, but section 10 of the register records no founder answer on it. The local-model carrot for Medium and High is not written anywhere found.
57 | S28 | Account: build what is there. | applied | No change. | Revisit later, per the founder.
58 | S30 | Portfolio: build what is described, a few templates, secondary. | applied | `docs/pack/12-screens/S30.md:43` | None.
59 | S31 | Add Accept as an option. | partly | Each side carries "Keep this one" (`gen.mjs:1600`, `:1601`) | No control is named Accept. Confirm that "Keep this one" is what was meant.
60 | S31 | Add Let AI decide, available not hidden. | partly | Desktop footer at `gen.mjs:1602`; `docs/pack/12-screens/S31.md:66` | The phone render has no Let AI decide.
61 | S31 | Accept AI suggestions within the conflict flow. | not applied | `docs/pack/12-screens/S31.md:68` routes the proposal to the change queue: "Not a part of this screen" | The founder asked for it inside the conflict flow. Either draw it on S31 or get the founder to accept the routing to S20.
62 | S32 to S34 | No instruction. | partly | S32 and S33 unchanged. | S34 keeps the four-step breadcrumb removed from S12 (`gen.mjs:1654`). S32 offers no standard question set, although `PRODUCT-PLAN.md:1253` says it does.
63 | Config panel | Ships now with hardcoded defaults; everything discussed goes in. | partly | Specified in `docs/pack/28-CONFIGURATION-PANEL-SPEC.md`; drawn as S35 to S38 (`gen.mjs:1682` onwards) | The S35 table (`gen.mjs:1669` onwards) lacks the rewrites cap and the invite credits. The standard-question toggle is not a panel row.
64 | S36 | More model layouts, 10 to 13 models. | not applied | The screen draws five provider rows (`gen.mjs:1691` to `:1696`). `28-CONFIGURATION-PANEL-SPEC.md:258` to `:263` says the drawing is wrong and the default set is 17 rows. | Redraw S36. It also still shows OpenRouter as "terms never opened", which `e532e32` reversed.
65 | Everywhere | Wherever human and AI work sit together, split with a toggle. | partly | Filter rows on S10 (`gen.mjs:1021`), S11 (`:1072`) and S20 (`:1372`) | S21 history lists people and AI edits together with no toggle. S11's filter is Linked and Copies, not human and AI. No sweep of other screens found.
66 | S04, ideas | Ideas become a bottom tab in the workspace, like the outline; Notes open, Ideas collapsed. | partly | `s04-workspace.png`: Ideas collapsed at the foot of the tree, Notes open. `PRODUCT-PLAN.md:352` | S12, S13, S14 and S34 still open a separate Ideas route with its own sidebar (`ideasTree()` at `gen.mjs:1112`). `PRODUCT-PLAN.md:283` still says "A separate tab"
67 | Questions | Generate the whole set once, in one call. | applied | `PRODUCT-PLAN.md:455` | None.
68 | Questions | Each question carries a branching flag. | applied | `PRODUCT-PLAN.md:456` | None.
69 | Questions | Blur only when a rewrite actually fires. | applied | `PRODUCT-PLAN.md:457` | None.
70 | Questions | Cap rewrites at three on Free, unbounded on Pro. | applied | `PRODUCT-PLAN.md:458`; `docs/pack/53-PRICING-AND-ENTITLEMENTS.md:77`; `28-CONFIGURATION-PANEL-SPEC.md:152` | Not visible on S35, row 63.
71 | Questions | Toggle, inverted: "use a standard question set" as the fallback. | partly | Specified: `docs/pack/10-FEATURE-REGISTER.md:155` (F194), `27-MODEL-ROUTING-SPEC.md:712`, and a copy key `K.s13.standardset` at `16-COPY-DECK.md:656` (an uncommitted edit by the parallel session) | Not drawn on S13 or S32. No person-facing toggle appears on any screen.
72 | Follow-up | Finalise the screens and issue an updated screens PDF. | partly | `docs/mvp0/frontmatter-Screens-v7-2026-09-18-0648.pdf`, and all 76 PNGs date from 06:47 to 06:48 on 18 Sep. | The PDF carries the defects in rows 1, 2, 29, 64 and 81. It cannot be called final until they are fixed.
73 | Follow-up | All spec and pre-development files, granular for any agent on any tool. | applied | `docs/pack/`: 65 numbered files, 38 screen specs under `12-screens/`, a validator under `tools/` | `64-PORTABILITY-AND-HANDOVER.md` names the files Claude Code, Cursor and Gemini read, but never Antigravity. grep finds no "antigravity" in the pack.
74 | Follow-up | Memory updated. | applied | The first line of the project `MEMORY.md` is "Pack and screens v7, 18 Sep 2026" | Update it again once this audit's gaps close.
75 | Follow-up | Mapped and graphified. | applied | `ebce68c` built the graph; `docs/pack/graphify-out/GRAPH_REPORT.md` exists; `f5e4d1e` generated the index in the pack's start-here file. | Re-run the graph after the next pack changes.
76 | Follow-up | Design system from md.sgnk.ai. | applied | `docs/pack/58-DESIGN-SYSTEM.md:22` | None.
77 | Follow-up | Material Symbols as the icon system. | partly | `58-DESIGN-SYSTEM.md:363`; `ic()` delivers inline SVG. | See row 81: two icons render blank.
78 | Follow-up | Google-simple interface. | partly | Judgement call. The idea flow moved towards it. | The phone theme (row 2) and S34 (row 62) pull the other way.
79 | Follow-up | Free LLM layer with automatic fallback; research freellm.net and other sites. | applied | `docs/research/2026-09-18-llm/raw/L1-free-providers.md:50` opens freellm.net; `27-MODEL-ROUTING-SPEC.md` sections 2, 6 and 7 cover the chain, streaming failover and the exhaustion ladder. | Nothing is built; see file 27 section 11.
80 | Follow-up | A no-fail model for up to 200 users. | partly | `27-MODEL-ROUTING-SPEC.md:744`, capacity arithmetic for 200 users. | `27-MODEL-ROUTING-SPEC.md:225`: without a 10 dollar OpenRouter purchase the pool is a quarter of what 200 users need. That purchase is not yet made or approved.
81 | Follow-up | Icons render everywhere, a Material Symbols requirement. | not applied | `icons/auto_awesome.svg` and `icons/insights.svg` carry 24-unit paths, while `ic()` at `gen.mjs:45` draws every icon in the 960-unit box. `gen.mjs` has 23 direct `ic('auto_awesome'` calls. | Every AI button and the phone bar's AI tab render with no icon. Seen blank in `s04-workspace.png`, `s04-workspace-phone.png`, `s13-idea-low.png` and `s14-idea-medium.png`. Refetch both icons in the 960 box.
82 | Follow-up | Token-abuse guardrails that are foolproof. | partly | `27-MODEL-ROUTING-SPEC.md:892`, section 9, and `43-THREAT-MODEL.md:137` | `27-MODEL-ROUTING-SPEC.md:19` says plainly the honest answer is bounded, not foolproof. The founder should accept that framing.
83 | Follow-up | Next.js API, Cloudflare R2, Firestore. | applied | `docs/pack/00-README.md` line 34; plan section 18 moved to Firestore in `4e9f0bc` | `docs/pack/56-OPEN-DECISIONS.md:47` still lists D15 as open. Close it now that the plan is fixed.
84 | Follow-up | A green signal before development starts. | not applied | grep finds no green signal, go decision or ready-to-build statement in `00-README.md`, `49-BUILD-STATUS-AUDIT.md` or `56-OPEN-DECISIONS.md` | The open decisions in file 56 and the gaps in this table stand between the pack and a green signal.
85 | Follow-up | "More LLM layouts, 10 or 13 models" | not applied | Same as row 64. | Same as row 64.
86 | Follow-up | Phone view bland, same theme design. | not applied | Same as row 2. | Same as row 2.
87 | Follow-up | Real Google and GitHub icons on sign-in. | partly | Same as row 1. | Same as row 1.

Four follow-up instructions repeat earlier rows. One collaborator on Free is row 48. S11 following the research is row 27. The S18 ladder decision is rows 45 to 47. The configuration panel is row 63.

## 2. Counts

Status | Rows
---|---
applied | 46
partly | 31
not applied | 9
deferred by founder | 1
Total | 87

## 3. Contradictions found

- **Free collaborators.** One in `PRODUCT-PLAN.md:510`, `:1106` and `gen.mjs:16`. Three in `PRODUCT-PLAN.md:240` and `SCREENS.md:29`.
- **Doc mode fonts.** The screen puts font and size on the first toolbar level. `PRODUCT-PLAN.md:363` and `SCREENS.md:86` say they sit behind More.
- **Where ideas live.** S04 and `PRODUCT-PLAN.md:352` put Ideas in the workspace tree. `PRODUCT-PLAN.md:283`, `SCREENS.md:24` and the S12, S13, S14 and S34 renders keep a separate Ideas tab.
- **S34 against S12.** S12 dropped the four-step breadcrumb as cognitive load. S34 still draws it at `gen.mjs:1654`.
- **S32 and the standard set.** `PRODUCT-PLAN.md:1253` says S32 offers a standard question set. The S32 render offers retry, local model and own key only.
- **OpenRouter.** `e532e32` admitted it to the chain, and `28-CONFIGURATION-PANEL-SPEC.md` agrees. The S36 render still calls its terms unopened.
- **S36 size.** `28-CONFIGURATION-PANEL-SPEC.md:258` to `:263` calls the drawn layout wrong. The v7 PDF ships it anyway.
- **S09.** The founder deferred it. `PRODUCT-PLAN.md:891` still lists the flow view as MVP 0.
- **S11.** The screen is now the whole file set. `PRODUCT-PLAN.md:281` still names "the instruction-file health panel".
- **Idea mode on the web.** `29-PLATFORM-AND-DESKTOP-SPEC.md:41` tags it a founder decision. The register records it only as my proposal in section 8.2.
- **D15.** Plan section 18 is on Firestore since `4e9f0bc`. `56-OPEN-DECISIONS.md:47` still lists the conflict as open.
- **Copy.** "1 live collaborators" at `gen.mjs:1306` and `:1359` reads wrong now that the cap is one.

## 4. Limits of this audit

- **What was asked came partly second-hand.** The follow-up instructions were taken from the audit brief, not from the founder's own messages. Anything said only in chat and not relayed is missing.
- **Few PNGs were opened.** I looked at S01 (both), S04 (both), S12, S13 (both) and S14. Other rows rest on `gen.mjs` source, which shows intent, not a verified render.
- **Some calls are judgement.** "Very simple", "less cluttered" and "Google-simple" have no measure. Those rows say so.
- **The repository moved during the audit.** A parallel session made three commits and left uncommitted edits in the pack. Line numbers were checked when written, and may drift after.
- **Nothing was run.** I did not regenerate screens, run the pack validator or run `npm run verify`.
- **The pack was sampled, not read whole.** Files 27, 28, 29, 58, 64 and several screen specs were checked by grep and sed around the relevant sections.


## 5. Fixed on 18 September, afternoon

Each row below was fixed, rendered, and the PNG opened and looked at before the commit. The v8 PDF is `docs/mvp0/frontmatter-Screens-v8-2026-09-18-1307.pdf`, 30 pages, 43 screen pairs, and `check-pdf.py` passes on it.

Row | What was done | Commit
---|---|---
1, 87 | `brand()` closes each path, so the four-colour Google G draws on S01, desktop and phone. | `58f00ca`
29, 77, 81 | `auto_awesome` and `insights` refetched in the 960-unit box from Google Fonts. Every icon file was scanned; those two were the only ones outside it. The generator and `fetch-icons.mjs` now refuse any icon outside the 960 box. | `58f00ca`
2, 3, 86 | Every phone header carries the fm mark, the title with its project and save state, share and the avatar or mode segment. The status bar uses Material icons, the bottom bar follows Material's navigation bar with AI in the accent blue, and S01 on the phone shows the desktop's preview window. | `5260993`
64, 85 | S36 redrawn from file 28 section 5.1 and file 27 section 2.1: 19 models across 7 providers in fallback order, OpenRouter in the chain, SambaNova disabled and explained, the refused providers listed. | `2d6688f`
8, 53 | New frame `s04-workspace-add`: the Add file menu with New document, Upload files, Upload a folder and Import from; a sheet on the phone. | `ce3c954`
14 | The rail's full-width AI button is gone. A small Ask AI launcher floats over the document, and the new frame `s04-workspace-ai` draws the box open over the workspace, anchored under the paragraph it will touch. | `ce3c954`
20, 21 | New frame `s06-ai-writing-idea`: the box to the right of the content, with the pinned Idea line. | `ce3c954`
15, 62 | S34 rebuilt on S12's column and input; the four-step breadcrumb is gone. | `5edacc0`
66 | S12, S13, S14 and S34 sit in the workspace with the Ideas section of the tree expanded. No separate route or sidebar. | `5edacc0`
71 | The standard question set switch is drawn on S13, with the rewrites left on Free, and S32 offers it for an idea. | `5edacc0`
37 | The S13 phone pins Skip, Choose recommendation and Next to the foot; S14 adds Skip all. | `5edacc0`
44 | New frame `s17-share-referral`: the modal an invited person meets after sign-up. | `804a353`
45 | The S18 phone shows the open-in ladder. The password gate moves to the new frame `s18-public-view-password`, with a desktop drawing. | `804a353`
60 | The S31 phone offers Let AI decide beside Keep both. | `804a353`
65 | S21 history carries the People and AI filter, as S20 does. | `804a353`
48 | The copy reads "1 live collaborator", from one constant. `PRODUCT-PLAN.md` summary table and `SCREENS.md` say 1. | `804a353`, `bc85c69`
63, 70 | S35 carries the rewrites cap, the invite credits and the standard question set as rows. | `804a353`
17 | The plan says font face and size sit on the Doc mode bar; colour, highlight and alignment behind More. | `bc85c69`
24 | S09 marked deferred to Later by the founder in the plan's screen section and in the section 8 table. | `bc85c69`
27 | The plan's list of help places and the S11 bullets describe the whole instruction-file set. | `bc85c69`
72 | Screens re-rendered and the v8 PDF built; v7 kept. | `d1438f6`

**Also changed along the way.** S32 lists the chain in its real order with OpenRouter in it. The opening table of `SCREENS.md` lives in `docs/mvp0/tools/make-screens-md.py`, which still said "a separate tab", "three people on Free" and "3 live collaborators"; it was corrected so the regenerated sheet agrees.

**Still open after this pass.**

- Row 9: "Commands" is still named nowhere.
- Row 18: the nested-YAML properties panel is not drawn.
- Row 24: `docs/pack/12-screens/S09.md` does not yet say deferred; the pack was out of this pass's scope.
- Row 43: the invite credits are a row on S35 but not yet in `docs/pack/28-CONFIGURATION-PANEL-SPEC.md` or file 53.
- Row 50 and 51: no further decluttering of S20, and no "other reviews" position.
- Row 64: file 28 section 5.1 still says OpenRouter carries no model rows, against file 27 section 2.1 and the redrawn S36.
- Rows 26, 56, 59, 61, 80 and 82 need the founder, and were left as drawn.

## 6. Closed after the v8 pass, same afternoon

Row | What was done
---|---
18 | S05 draws the properties panel with nested keys (`page`, `verified`), and says a key it cannot write safely opens as markdown.
50, 51 | S20 and S21 filters split AI from Agents: All, People, AI, Agents. The plan and `docs/pack/12-screens/S20.md` say the same.
24 | `docs/pack/12-screens/S09.md` already opened with the deferral; the row was stale.
43, 63 | `docs/pack/28-CONFIGURATION-PANEL-SPEC.md` section 4.2 carries `policy.invite.credits` (5) and `policy.questions.default`.
64 | File 28 section 5.1 lists the two OpenRouter models, 19 rows, and file 53 no longer calls OpenRouter excluded.

The PDF with these is `docs/mvp0/frontmatter-Screens-v8.1-2026-09-18-1315.pdf`; v7 and v8 are kept.

**Left for the founder.** Row 9: "Commands" was never a collapsible in the screens reviewed, so it is not drawn. Say if it meant something. Rows 26, 56, 59, 61, 80 and 82 as listed above.
