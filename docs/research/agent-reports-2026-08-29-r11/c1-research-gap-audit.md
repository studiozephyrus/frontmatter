### 0. Method and what was actually opened

| Step | Result |
|---|---|
| PRD read in full | 1,551 lines / 20,174 words `[measured]` |
| Report corpus enumerated | R6 dir `agent-reports-2026-08-28/` = 36 files; R7 dir `agent-reports-2026-08-29-r7/` = 16 files `[measured]` |
| Headings read for all 52 reports | `[measured]` — grep of `^#{1,4}` per file |
| PRD evidence-tag census | `[fetched]` 86 · `[SS]` 52 · `[measured]` 50 · `[derived]` 9 · `[inference]` 1 `[measured]` |
| Live re-checks run here | `src/modules` inventory, test-file count, `.github` absence, branch commit count, kepano/obsidian-skills stars, inkeep/open-knowledge stars `[measured]` |
| **Rounds 8/9/10** | **No directory for them exists under `docs/research/`** `[measured]` — only the two dirs above. The PRD (v1.1, file mtime 2026-08-29 01:42 `[measured]`) therefore contains **none** of their findings. Treated as COVERED per instruction, but flagged: the PRD's §31 research record stops at R7 and will need a round-8–10 row before it is handed to a builder. |

---

### 1. Coverage table

`C` = covered · `P` = partial · `M` = missing. "Report" names the strongest source.

| # | Topic area | State | Report / where | Gap note |
|---|---|---|---|---|
| 1 | Engine fidelity / byte-splice | **C** | `h2`,`h4`,`x6`,`x7`; PRD §7 | 7,959-file foreign run `[measured]` |
| 2 | Competitor teardowns | **C** | `h3`,`h4`,`x7`; §15 | Code executed, not read `[measured]` |
| 3 | Projection law / core concept | **C** | `c1`,`x12`; §5 | |
| 4 | Computation budget / render surface | **C** | `c2`,`x12`; §9 | |
| 5 | Review loop | **C** | `ed5`,`x10`; §12 | Deepest single extraction |
| 6 | Agent protocols (MCP/ACP/A2A) | **C** | `aj1`,`x10`; §11 | |
| 7 | Capture loop / chat-to-artifact | **C** | `aj2`,`x11`; §11.1 | G1–G12 laws verbatim |
| 8 | Knowledge formats (OKF, llms.txt, SKILL.md) | **C** | `aj3`,`x11`; §8.1 | |
| 9 | Import / export breakage | **C** | `e5`,`x4`; §17 | n=215 + n=230 issues `[fetched]` |
| 10 | Naming / trademark | **C** | `e6`,`x4`; D3 | |
| 11 | Pricing / FX / rails | **C** | `c4`,`x13`,`g1`; §19–20 | |
| 12 | Unit economics / funnel | **C** | `g1`; §19–21 | See §5 for arithmetic defects |
| 13 | Legal & compliance | **C**(holed) | `g3`; §27 | §31.1 self-declares GST + DPDP Rules unverified |
| 14 | Security posture | **C** | `g3`; §28 | OWASP LLM Top-10 `[fetched]` |
| 15 | Internal systems fusion | **C** | `i1`–`i6`,`g2`,`x1`,`x2`; §16 | |
| 16 | Home / dashboard surface | **C** | `e2`,`x3`; §14 screen 2 | 1,294,057 dl `[fetched]` |
| 17 | Screens / interaction grammar | **C** | `c6`,`x13`; §14 | |
| 18 | Build references / licences | **C** | `c5`,`x13`; §33 | |
| 19 | GTM / content machinery | **C** | `i1`,`x1`; §22 | |
| 20 | Community demand signal | **C** | `e7`,`x5`; §3.3 | Fresh window `[fetched]` |
| 21 | Mobile | **C** (r8–10) | `ed3` §5, `x9`; PRD has **1** mention (`mobile pass`, T1) `[measured]` | Research exists; PRD does not carry it |
| 22 | Search | **C** (r8–10) | `x9`, MiniSearch CJK 18.1% `[measured]` | PRD covers indexing policy, not ranking/UX |
| 23 | Real-time collaboration | **C** (r8–10) | `ed3` §3, `h4`; D2 | Deferred to T6 |
| 24 | Performance & scale | **P** | shape-gate quadratics `[measured]`; Dataview ~30s past 3k `[SS]` | No vault-scale targets, index build time, memory ceiling, cold-start budget |
| 25 | Offline & sync | **P** | `ed5` §5; T0 exit condition | **No sync-engine research at all**; `service worker` 0 hits corpus-wide `[measured]` |
| 26 | Onboarding & activation | **P** | `c6`/`x13` Screen 1 | Screen designed; `aha moment` 0 hits, `time-to-value` 0 hits, `activation` 3 hits `[measured]` |
| 27 | Data model & migrations | **P** | §8.2, `knowledge/meta/schema.md` | `schema version` 0 hits `[measured]`; no forward/back-compat contract for schemas, sidecars, cert JSON |
| 28 | Testing strategy | **P** | §25 standards (strong) | `testing strategy` 0, `Playwright` 0, `e2e` 0 word-boundary hits `[measured]`; 98 tests all in `./test/`, 0 in `src/`, no `.github/` `[measured]` |
| 29 | i18n / CJK | **P** | CJK as defect (NF-1/NF-4, D17) | `i18n` 2 · `l10n` 0 · `localization` 0 · `RTL` 0 word-boundary hits `[measured]`; `IME` 12 corpus / **0 PRD** |
| 30 | Support tooling | **P** | §21.1 load model; `c3` deflection | Tool choice, ticket taxonomy, SLA, own status page all absent |
| 31 | Open-source strategy | **P** | §33 licence landmines | Our **own** licence posture unchosen; session-interchange format is "publish ours" with no licence/governance |
| 32 | Community building | **P** | `e7`,`x5` | Ranked moat #1, "does not exist yet"; `moderation` 0 hits `[measured]` |
| 33 | Accessibility | **M** | one 4-bullet block in `ed3` §6 / `x9`, all `[SS]` bar one README | PRD: `accessib` 0 · `WCAG` 0 · `screen reader` 0 `[measured]` |
| 34 | Error handling / refusal UX | **M** | — | `error handling` 0 hits `[measured]`. Refusal is Principle #2 and has no corpus |
| 35 | Backup / restore / DR | **M** | — | `disaster` 0 hits; `RTO`/`RPO` 0 word-boundary hits, corpus **and** PRD `[measured]`. All `backup` hits are the studio's own Supabase |
| 36 | API design (public, non-MCP) | **M** | — | `API design` 0 hits; `rate limit` 0 in PRD `[measured]` |
| 37 | Observability / incident response | **M** | `Sentry` 1 hit `[measured]` | §29 says "buy error tracking"; nothing on what to instrument, alerting, log retention vs DPDP |
| 38 | SEO for published pages | **M** | 27 `SEO` hits are naming-risk + AEO + one publish toggle `[measured]` | `sitemap` 1 · `meta tag` 0 · `open graph` 0 `[measured]` |
| 39 | Email & notifications | **M** | — | `transactional` 6, all non-product; §21.1 lists email as "not modelled" |
| 40 | Product analytics & consent | **M** | §10.4 covers *document* telemetry only | `PostHog` 0 · `privacy policy` 0 · `cookie` 0 hits `[measured]` |
| 41 | Trust & safety / abuse / takedown | **M** | `abuse` 4 · `takedown` 2 · `trust and safety` 0 `[measured]` | D15 names the obligation, never researches it |
| 42 | Roles / permissions / invites | **M** | §14 team row; §12 "suggester role" | No role model, no invite flow, no per-folder ACL |
| 43 | Desktop distribution (Tauri) | **M** | — | Code signing, notarisation, auto-update, Win/Linux — zero hits |
| 44 | Own documentation / help | **M** | `documentation` hits are competitors' | Dev-tool ICP treats docs as a purchase input |
| 45 | Billing ops (dunning, GSTIN, e-invoice) | **M** | `dunning` 1 hit `[measured]` | Indian B2B buyers need GSTIN on invoice |

---

### 2. MISSING, ranked by build risk

Rank = P(hits us) × cost-to-retrofit × does-it-block-a-decision. `[inference]` throughout unless tagged.

| # | Missing | Research this | Why it matters |
|---|---|---|---|
| 1 | **Backup / restore / DR** | RPO/RTO for a git-backed + R2-backed doc store; point-in-time restore on R2 (versioning, lifecycle, cost `[fetched]` from Cloudflare docs); restore-drill runbook; what "the file is yours" means when *our* copy is the one that dies | D8-B stores customer documents under a **₹250 crore** s.8(5) ceiling `[fetched, §27.2]`. LR#55 killed this studio's own nightly backups for weeks. Retrofitting restore after the first loss is impossible |
| 2 | **Sync engine choice** | git-only vs git+operational-log vs CRDT; what actually caused Obsidian Sync's silent corruption (forum post-mortems, `[fetched]`); two-device convergence oracles; clock skew; partial-write recovery | T0's exit condition is "two-device offline-edit convergence, zero loss" and it is the product's #1 claimed pain (`561/3,220` HN comments). It is the largest build in the plan with the thinnest evidence base — `service worker` 0 hits `[measured]` |
| 3 | **Error / refusal UX** | Corpus of refusal messages that users tolerate (compilers, linters, git); ≤200-char actionable-error patterns; recovery affordance per refusal class; how a refusal reads when the user did nothing wrong | Principle #2 makes refusal the signature behaviour. NF-1 shows **83% of foreign files refuse today** `[measured]`. A refusal that reads as a bug destroys the trust the engine was built to earn |
| 4 | **Accessibility** | WCAG 2.2 AA audit plan for a CM6 single-textbox surface; screen-reader model for hunks/diff/kanban-drag; keyboard equivalent for every drag; focus management in the review surface; VPAT/ACR cost | Entire corpus evidence = 4 bullets, all `[SS]` `[measured]`. B2B ICP #1 and #3 procurement asks for an ACR. §16.3 already ships `body-faint #b8b8b8 at 2.14:1` failing AA `[measured]` |
| 5 | **Public API + rate limiting + versioning** | REST surface vs MCP-only; auth for programmatic access; idempotency; pagination; error-code taxonomy; deprecation policy; per-key rate limits and abuse quotas | ICP #1 is dev-tool startups. `rate limit` appears **0 times in the PRD** `[measured]` while §11 opens an agent write path to a document store |
| 6 | **Trust & safety / takedown** | India IT Rules 2021 intermediary duties (grievance officer, timelines); DMCA agent for US; phishing/CSAM abuse of one-toggle publish; per-account publish quotas | D15 names "content-liability/abuse/takedown obligations" as a consequence and stops `[measured]`. Publishing globally from India without this is the second-largest legal hole after #1 |
| 7 | **Product analytics + consent** | Event schema for activation/funnel; consent basis under GDPR + DPDP; opt-out; whether D8-A (local-first/E2E) makes §21.3 unmeasurable | §21.3's 5,675 / 28,377 / 113,507 signups `[derived]` cannot be observed without it. `privacy policy` and `cookie` = 0 hits `[measured]` |
| 8 | **Own docs + support tooling** | Helpdesk choice; ticket taxonomy; canned responses; self-serve KB for frontmatter itself; SLA wording for a solo founder | §21.1 puts the wall at **46.4 founder-hours/month at 10,000 users** `[derived]`. Docs and deflection are the only levers on it, and neither is researched |
| 9 | **Email & notifications** | Deliverability from an India-domiciled sender (SPF/DKIM/DMARC); provider; review-queue digests; conflict alerts; unsubscribe under DPDP+GDPR | The review surface and team dashboard are inert without notification. §21.1 lists email as "not modelled" `[measured]` |
| 10 | **Open-source / licence posture** | Open-core vs proprietary vs source-available; licence for the certificate spec, the session-interchange format, the MCP server, the Obsidian bridge plugin | Every one of the seven free self-hosted competitors (21,501–76,040★ `[fetched]`) is OSS and §23 calls them the price floor. Reflect Open took 1,441★ in 11 weeks by open-sourcing `[fetched]` — cited as thesis validation, never as a strategy option |
| 11 | **i18n / IME / RTL** | CM6 IME composition regressions (`x9` has 12 hits, PRD 0 `[measured]`); UI string extraction; locale dates in the calendar profile; CJK line-breaking in a 760px column; RTL mirroring | India-first distribution + CJK vaults inside NF-1/NF-4 `[measured]`. D17 scopes CJK *correctness* and never touches CJK or RTL *interface* |
| 12 | **Roles / permissions / invites** | Owner/editor/commenter/viewer model; per-folder ACL; guest links; how "the suggester role has no byte-writing code path" is enforced across the GitHub App scope | Monetisation is B2B self-serve teams of 2–20 (§18). One table row is the entire design |
| 13 | **Desktop distribution** | macOS notarisation + hardened runtime, Windows signing, auto-update channel, crash reporting | ACP client "when a desktop surface exists" (§11) has no shipping path researched |
| 14 | **SEO for published pages** | Sitemap/robots/canonical for `/p/[slug]`, custom domains, Core Web Vitals, structured data, noindex policy | Publish is half the Power tier. `open graph` and `meta tag` = 0 hits `[measured]` |
| 15 | **Schema migration contract** | Versioning for user frontmatter schemas, render profiles, sidecars, cert JSON; what happens to a vault when a profile changes | `schema version` 0 hits `[measured]`. The file is the source of truth — so a schema change is a data migration on someone else's disk |

---

### 3. Researched but thin — mostly `[SS]`, stale, or single-source

| Claim | Weakness | Where it is load-bearing |
|---|---|---|
| Deflection: 18% median, 40–60% with AI, $25–35/ticket | All `[SS]`, **single source** `c3`/`x12` `[measured]` | ICP #3 pricing $99–249 |
| "Median solo B2B founder >4× median solo B2C by month 24" | `[SS]`, no source named in PRD | The entire two-motion strategy (§18) |
| "No organised India Obsidian meetup or Discord found" | `[SS]` **absence claim**, single source `e3`/`x3` | §19.1, §23 moat #1, India-as-top-of-funnel |
| "Zero category-specific WTP evidence for markdown tools in India" | `[SS]` absence claim, same source | D-level market sequencing |
| `561 of 3,220` HN comments | PRD tags it `[SS]` **and** `[fetched]` in one cell `[measured]`; originates in a 2026-07-12 internal doc via `i6`/`x2` | Problem #2, the headline pain |
| "under 4% of GitHub notebooks reproduce" (Pimentel 2019) | `[SS]`, never opened | §2 #5 and §5's survivors/traps table |
| Princeton GEO 25–40% visibility lift | `[SS]` | The AEO linter's justification |
| Vanta/Drata $7,000–$30,000/yr | `[SS]` | The audit-trail wedge (§18) |
| UPI absence loses 30–40% of Indian checkouts | `[SS, vendor-sourced]`, self-flagged | The Razorpay rail decision |
| Dataview: "100k advertised, ~30s past 3,000 notes" | `[SS]` | The stated honest ceiling of the whole render thesis (§9.1) |
| Docs-as-code pricing (GitBook/Mintlify/Outline/Confluence) | **Source disagreement**: `e3`/`x3` says "all `[SS]`; pricing pages could not be opened directly"; `g1` and PRD §20.7 present the same products as `[fetched 2026-08-29]` `[measured]` | §18 wedge, §20.7 table |
| Consolidation wedge $1,163–1,223 | `g1` tags components `[SS]`, sum `[derived]`; PRD §18 tags whole thing `[derived]`; §20.7 tags two components `[fetched]` `[measured]` | The B2B ROI headline |
| Accessibility block | 4 bullets, `[SS]` except one README `[measured]` | Everything in §4 above |
| kepano/obsidian-skills 47,418★ | Number **stands** — live re-check **47,444★, 3,410 forks, pushed 2026-06-08** `[fetched 2026-08-28T23:36Z]`. But `e2`'s citation URL is a `search/repositories?q=obsidian+homepage` query that cannot return one repo's stars `[measured]`, and PRD §3.2 calls it "obsidian agent-skills", not its real name |
| inkeep/open-knowledge "3,239 → 3,673 in 27 days" | Live now **3,679, pushed 2026-08-28T23:33Z** `[fetched]` — restate as 3,239 → 3,679 in 28 days |
| Craft India pricing ₹526.7–658.3 | `[fetched]` but single-IP, single-moment geo-price | §20.3's "leaves money on the table" argument |
| `mdmax/fold@1` 43.71% → 4.28% | Self-flagged: prototype only, never run over the pinned corpus `[measured]` | **Good discipline — keep the flag, do not quietly promote it** |

---

### 4. Load-bearing `[SS]` claims that could embarrass publicly

Ranked by (would be quoted in public) × (refutable by a reader in one search).

| # | Claim | Risk |
|---|---|---|
| 1 | **Princeton GEO "25–40% visibility lift from quotes, statistics and citations"** `[SS]`, §13 L4 | Sits **in the same sentence** as "the 'serve markdown and get cited' claim is measurably refuted and will never appear in our marketing". Publishing an unopened 25–40% next to a refutation boast is the highest-embarrassment pairing in the document |
| 2 | **"under 4% of GitHub notebooks reproduce"** `[SS]`, §2 #5 + §5 | Specific figure from a specific paper with a specific reproducibility definition. Exactly LR#72's class — we already caught one novelty claim |
| 3 | **"No organised India Obsidian meetup or Discord found"** `[SS]`, §19.1 + §23 | An absence claim about a community that can refute it with one reply. Highest social blowback per word |
| 4 | **"OpenAI removed Canvas May 2026"** `[SS]`, §3.1 + §3.3 | Falsifiable claim about a named company; §3.3's entire "structural hedge" rests on it |
| 5 | **"Notion cut free AI to 20 responses *for life*"; "Microsoft +43% Copilot bundling drew a CMA probe"** `[SS]`, §2 #8 | Names a regulator and two competitors' pricing policies from unopened sources, in a section whose whole point is that *they* lie |
| 6 | **Deflection economics 18% / 40–60% / $25–35** `[SS]`, §18 | Goes straight into B2B collateral against Intercom/Zendesk/Document360, who publish their own numbers |
| 7 | **"Median solo B2B founder revenue >4× B2C by month 24"** `[SS]`, §18 | Strategy-shaping stat with no named study; the first investor or HN commenter asks for the source |
| 8 | **Vanta/Drata "$7,000–$30,000/yr"** `[SS]`, §18 | Two named vendors' prices |
| 9 | **"Perplexity Pro free via Airtel to ~400M subscribers, nominally worth ₹17,000/yr"** `[SS]`, §20.5 | Three checkable numbers about a named telco |
| 10 | **"21.9M India GitHub contributors, +5.2M in a year"** `[SS]`, §20.6 | Octoverse is one click away; will be checked |
| 11 | **Dataview ceiling "~30s past 3,000 notes"** `[SS]`, §9.1 | We promise to "publish the ceiling honestly" — publishing an **unopened** ceiling is self-defeating |
| 12 | **r/ObsidianMD ~344,000 / Discord ~195,000; Relay 172,544 downloads** (§22, first two **untagged** in the PRD) `[measured: no tag present]` | Untagged numbers in the GTM section read as measured |
| 13 | **§21.1 support assumptions** (0.02 / 0.10 tickets per user-month, 12 min each) | Labelled assumptions in prose, then the derived **46.4 founder-hours** is quoted as a conclusion in §21.1's "Three conclusions" and again in §29 |
| 14 | **"obsidian agent-skills 47,418★"** §3.2 | Correct magnitude, **wrong repo name** and a citation URL that cannot produce it. Fix to `kepano/obsidian-skills`, 47,444★ `[fetched 2026-08-28T23:36Z]` |

---

### 5. Internal contradictions in the PRD

| # | Contradiction | Evidence |
|---|---|---|
| 1 | **§31 points the build team at the wrong directory.** "Reports at `docs/research/agent-reports-2026-08-28/`" — R7's 16 reports (a third of the corpus) live in `agent-reports-2026-08-29-r7/` | `[measured]` |
| 2 | **Agent count off by one.** §0 says "51 agents"; §31's table sums 7+8+4+5+4+6+16 = **50** (the fetch sweep is "main loop", not an agent) | `[derived]` |
| 3 | **§7.2 module count.** States "14" then names **13**. On disk: 13 module directories + `README.md` + `.gitkeep` + `.DS_Store`. The "175 files" figure counts `.DS_Store` and `.gitkeep`; the module table's own rows sum to **172** | `[measured]` + `[derived]` |
| 4 | **§7.2 commit count.** "40 commits on `engine/plan-and-diagnostics`"; live `git rev-list --count main..HEAD` = **37**, HEAD `a485326` | `[measured 2026-08-29]` |
| 5 | **§32 Learned Rules row.** "76 entries, newest #74" — 76 numbered matches with a maximum index of 74 means two duplicate indices; the row presents both figures as consistent | `[measured]` |
| 6 | **GTM spends an embargoed asset.** §22 lists "the 907/907 result, the foreign-vault run" as Funnel-1 launch content, while §24's R0 heading is "**before we market any fidelity number**", §26.1's mitigation is "Ship NF-1 before any marketing number", §29 says "R0 precedes marketing any number" — and **D16 is still an open decision** | `[measured]` |
| 7 | **Two conversion rates, adjacent sections.** §21.1 sizes infrastructure at **4%** free→paid; §21.3 sizes the funnel at **5%**; §21.2's governing quote is the 5% dev median | `[derived]` |
| 8 | **Every §19.2 margin is a best case.** The tier table applies **$0.153/paid user** to all tiers; §21.1 says that holds only at 1,000 users and is **8.2× worse at 100** ($1.250) — i.e. at launch scale no row in §19.2 is true | `[derived]` |
| 9 | **§19.2 annual row's "% gross" uses the wrong denominator.** ₹118.79 ÷ ₹299 = 39.7% is printed; that row's actual monthly gross is ₹2,499÷12 = ₹208.25, giving **57.0%**. The annual plan is made to look ~17 points worse than the same arithmetic gives | `[derived]` |
| 10 | **One number, two tags.** GitBook Premium $65 and Statuspage Business $399 are `[SS]` inside §18's `[derived]` wedge and `[fetched 2026-08-29]` in §20.7 | `[measured]` |
| 11 | **Moat duration disagrees with itself.** §3.2 calls daemon-free fidelity "**Durable — architectural**"; §23 rank 2 gives the splice engine "**18–36 months**" and names an incumbent byte-exact writer as the eroder | `[measured]` |
| 12 | **L-tiers and T-tracks disagree on ordering.** §13 puts "Verified importers (T4)" and "HOME.md (T1)" inside **L0, the simplest trustworthy editor**, while §24 sequences T4 after T2/T3 | `[measured]` |
| 13 | **Three different things called "plugin".** §6.2 bans "a plugin marketplace"; §22 makes "the **Open in frontmatter** plugin" the primary distribution play; §16.2 ships user-authorable SKILL.md automations as the **flagship**. Externally this reads as a contradiction unless the distinction is stated in §6.2 itself | `[measured]` |
| 14 | **§14 is a 12-screen heading over 16 rows.** "Right rail" is inserted as #4, renumbering everything against the `c6`/`x13` inventory, and Doc Health / Settings / Pricing / Team are left unnumbered | `[measured]` |
| 15 | **Two "open" decisions are already priced.** D9 (BYO vs platform key) and D8 (do documents leave the device?) are listed as founder's-call-pending, yet §19.2's tier table, §20.2's Free tier, §21.1's whole cost model, §11's MCP server, §12's review surface and §17's importers all assume **server-stored + BYO-free/capped-paid**. D8 Option A would invalidate §19–§21 outright | `[measured]` |
| 16 | **The document does not apply §25 to its own headline.** "Tests passing 1,575/1,575" (§7.2) sits three rows above "**CI: None. `.github/` does not exist**" `[measured, confirmed here]`, while §25 requires "run it three times" and "a verifier written beside its subject inherits its blind spots". The passing figure has no standing gate behind it and should be tagged as a single local run |
| 17 | **§4 "Proven" over-scopes the internal substrate.** "the internal markdown-OS substrate works at scale" sits against §16.1's own measurements: `shadow-log.jsonl` = **1 row**, `insights/` **does not exist after 14 months**, and §16.4 forbids marketing the learning claim | `[measured]` |