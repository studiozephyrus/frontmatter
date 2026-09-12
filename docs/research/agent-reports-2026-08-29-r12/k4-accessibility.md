### Sources opened for this report (all via `curl`; WebFetch was not used)

| Source | Fetch result | Version / date on the document |
|---|---|---|
| W3C WCAG 2.2 | 200, 512,457 B `[measured]` | "W3C Recommendation 12 December 2024" `[fetched]` |
| Directive (EU) 2019/882 (EAA), EUR-Lex CELEX 32019L0882 | 200, 484,791 B `[measured]` | full consolidated text `[fetched]` |
| EN 301 549 (ETSI PDF; 403 on default UA, 200 with browser UA) | 200, 2,285,361 B `[measured]` | "EN 301 549 V3.2.1 (2021-03) HARMONISED EUROPEAN STANDARD" `[fetched]` |
| ada.gov `/resources/2024-03-08-web-rule/` | 200 `[measured]` | page carries a 2026 Interim Final Rule update `[fetched]` |
| RPwD Act 2016 (indiacode.nic.in PDF) | 200, 511,092 B `[measured]` | statute text `[fetched]` |
| Robles v. Domino's, 9th Cir. No. 17-55504 (cdn.ca9.uscourts.gov) | 200, 88,342 B `[measured]` | "Filed January 15, 2019" `[fetched]` |
| W3C ATAG 2.0, WCAG 2.2 Understanding SC 2.5.8, axe-core rule-descriptions.md | 200 `[measured]` | current `[fetched]` |
| ETSI EN 301 549 **v4.1.1** at the predictable path `…/04.01.01_60/en_301549v040101p.pdf` | **404** `[measured]` | cannot confirm a v4 exists from ETSI's deliver tree `[measured]` |
| codemirror.net `/examples/accessibility/` | **404** `[measured]`; the examples index lists 22 examples and **none is an accessibility page** `[measured]` | — |

### Measured: the contrast claim is real, and worse than the PRD states — and it is the wrong token set

- The PRD line at `docs/FRONTMATTER-PRD-2026-08-29.md:816` reads: body-faint `#b8b8b8` at **2.14:1** fails AA `[measured]`.
- Recomputing `#b8b8b8` on `#ffffff` with the WCAG 2.x relative-luminance formula (sRGB linearisation, 0.04045 threshold, 0.2126/0.7152/0.0722) gives **1.984:1** `[derived: L(#b8b8b8)=0.4735, L(#fff)=1.0; (1.0+0.05)/(0.4735+0.05)=1.984]`. My implementation returns **4.542:1** for `#767676` on white, the canonical WCAG AA boundary value, so the formula is correct `[measured]`.
- Same divergence across the whole design-system row: ink `#0a0a0a` PRD 20.2:1 vs measured **19.798:1**; blue `#1a5cff` PRD 5.16:1 vs measured **5.225:1** `[derived]`. Recorded as a **source disagreement, not resolved** — the PRD's numbers are not reproducible by the WCAG formula, and were not produced by any script in this repo that I could find `[measured]`.
- **Bigger finding: `#b8b8b8` is not in the shipped app token set.** `src/app/globals.css` ships a different palette entirely `[measured]`. The failures there are worse and are live:

| Token (`globals.css`) | Value | On `--bg` | Ratio `[derived]` | AA text 4.5 | Non-text 3.0 |
|---|---|---|---|---|---|
| `--fg` | `#18181b` | `#fafafa` | 16.97:1 | PASS | PASS |
| `--fg-muted` | `#6b6b73` | `#fafafa` | 5.06:1 | PASS | PASS |
| **`--muted`** | `#9b9ba3` | `#fafafa` | **2.64:1** | **FAIL** | **FAIL** |
| **`--danger`** | `#b2625e` | `#fafafa` | **4.19:1** | **FAIL** | PASS |
| **`--success`** | `#4f8b6b` | `#fafafa` | **3.84:1** | **FAIL** | PASS |
| `--link` | `#0044cc` | `#fafafa` | 7.46:1 | PASS | PASS |
| **`--border`** | `rgba(10,10,10,.06)` → `#ececec` | `#fafafa` | **1.13:1** | n/a | **FAIL** |
| **`--ring`** (focus) | `rgba(91,33,182,.40)` → `#baa3df` | `#fafafa` | **2.14:1** | n/a | **FAIL** |
| dark **`--muted`** | `rgba(237,237,237,.40)` → `#6e6e6e` | `#1a1a1a` | **3.41:1** | **FAIL** | PASS |
| dark `--border-strong` | → `#3a3a3a` | `#1a1a1a` | 1.53:1 | n/a | **FAIL** |

- `--danger` is used for `role="alert"` error text at `fontSize: 12` in `GoogleSignInButton.tsx` and `SgnkAiButton.tsx` `[measured]` — small text, so 4.5:1 applies, so it fails 1.4.3 today.
- The focus ring at 2.14:1 fails 1.4.11 for focus indicators `[derived + inference]`. Note it lands on the same numeral as the PRD's body-faint claim; different token, coincidence, stated so it is not conflated `[inference]`.

### 1. What is legally required, by jurisdiction, dated

**EU — European Accessibility Act, Directive (EU) 2019/882**

| Provision | Text | Date |
|---|---|---|
| Art. 2(2) | Applies to services **provided to consumers after 28 June 2025** `[fetched]` | 2025-06-28 |
| Art. 2(2)(f) | **"e-commerce services"** are in scope `[fetched]`; Art. 3(30) defines them as services provided at a distance by electronic means at the individual request of a consumer with a view to concluding a consumer contract `[fetched]` | live |
| Art. 31 | Transposition by **28 June 2022**; measures applied from **28 June 2025** `[fetched]` | done |
| Art. 32(1) | Transitional period ending **28 June 2030**; service contracts agreed before 28 June 2025 may run to expiry, **max 5 years** from that date `[fetched]` | 2030-06-28 |
| **Art. 4(5)** | **"Microenterprises providing services shall be exempt from complying with the accessibility requirements referred to in paragraph 3 … and any obligations relating to the compliance with those requirements."** `[fetched]` | live |
| Art. 3(23) | Microenterprise = **fewer than 10 persons** AND turnover ≤ **EUR 2 million** or balance sheet ≤ **EUR 2 million** `[fetched]` | live |
| Art. 2(4)(d) | Out of scope: **"third-party content that is neither funded, developed by, or under the control of, the economic operator concerned"** `[fetched]` | live |
| Art. 2(4)(b) | Out of scope: **office file formats published before 28 June 2025** `[fetched]` | live |
| Annex I §III | Services must make **"websites, including the related online applications … perceivable, operable, understandable and robust"**, present **"sufficient contrast"**, and **"supplement any non-textual content with an alternative presentation"** `[fetched]` | live |
| Art. 15 | **Presumption of conformity** for products/services conforming to harmonised standards referenced in the OJEU `[fetched]` | live |

- **Net position for a solo founder in India selling to EU consumers today:** the e-commerce/checkout surface is in scope as an e-commerce service `[fetched + inference]`, but a one-person company under EUR 2M turnover meets Art. 3(23) and is therefore exempt under Art. 4(5) `[fetched + inference]`. **The exemption is a headcount cliff, not a grace period** — it disappears on the 10th hire or at EUR 2M, with no transitional runway in Art. 4(5) `[fetched + inference]`.
- **Anti-recommendation:** do not treat Art. 4(5) as a reason to build nothing. Art. 4(5) exempts you from the *service* requirements; it does not exempt you from a public-sector or enterprise buyer's contractual accessibility clause, and it does not exist in the US or India `[inference]`.
- **Do not claim the Art. 2(4)(d) third-party-content carve-out for your own chrome.** User documents published through frontmatter are content you neither fund, develop, nor control `[fetched + inference]`; the surrounding page template, navigation, share dialog and theme *are* under your control and are in scope `[inference]`.

**EN 301 549 — the standard that operationalises the EAA**

- Version obtained: **V3.2.1 (2021-03)** `[fetched]`. It states: "The present document reflects the content of the **W3C WCAG 2.1** Recommendation" `[fetched]`. **The harmonised European standard therefore points at WCAG 2.1, not 2.2** `[fetched]`. Building to 2.2 AA satisfies 2.1 AA as a superset `[inference]`.
- **Clause 11.8 "Authoring tools" applies to frontmatter directly** `[fetched]`:
  - **11.8.2** "Authoring tools shall enable and guide the production of content that conforms to clauses 9 (Web content) or 10 (Non-Web content)" `[fetched]`.
  - **11.8.3 Preservation of accessibility information in transformations** — "If the authoring tool provides restructuring transformations or re-coding transformations, then accessibility information shall be preserved in the output if equivalent mechanisms exist in the content technology of the output" `[fetched]`.
  - **11.8.4 Repair assistance** — if the tool can detect non-conformance, it **shall provide repair suggestion(s)** `[fetched]`.
  - **11.8.5 Templates** — at least one supplied template must produce conforming content and be identified as such `[fetched]`.
- **11.8.3 is the same claim frontmatter already makes as its engine thesis** — deterministic reversible projection and cross-engine degradation certification are literally a preservation-in-transformation guarantee `[inference]`. Extending `mdmax cert` to certify *accessibility information* (heading level, alt, table header role, lang) across the md→HTML→PDF chain converts an existing engine into a standards claim at near-zero marginal cost `[inference]`.
- **Anti-recommendation:** do not commission an ATAG 2.0 conformance claim. ATAG 2.0 is cited by EN 301 549 clause 11.8.0 only as **informative** — "provides information that can be of interest to those who want to go beyond these requirements" `[fetched]`. Full ATAG Part A + Part B conformance is expensive and legally buys nothing the EAA asks for `[inference]`.

**United States**

| Item | Status | Date |
|---|---|---|
| DOJ Title II web rule; technical standard **WCAG 2.1 Level AA** `[fetched]` | final rule, state/local government only | published 2024-03-08 fact sheet `[fetched]` |
| Interim Final Rule extending Title II compliance | "**On April 20, 2026**, the Federal Register published the Department's Interim Final Rule (IFR)" `[fetched]` | 2026-04-20 |
| Title II compliance, population ≥ 50,000 | **April 26, 2027** `[fetched]` | 2027-04-26 |
| Title II compliance, population < 50,000 or special district | **April 26, 2028** `[fetched]` | 2028-04-28 → text says **April 26, 2028** `[fetched]` |
| **ADA Title III** (private businesses) | **no technical standard has been promulgated**; exposure is judge-made `[SS]` | — |
| Robles v. Domino's Pizza, 9th Cir. No. 17-55504 | Panel held "the ADA applied to Domino's website and app"; "the ADA applies to the **services of** a public accommodation, not services **in a place** of public accommodation" `[fetched]` | filed 2019-01-15 `[fetched]` |
| Robles on WCAG | plaintiff "did not seek to impose liability … for failure to comply with the Web Content Accessibility Guidelines 2.0, private industry standards"; WCAG 2.0 compliance was "a possible" **remedy**, not the legal duty `[fetched]` | 2019 |

- **Practical read:** in the US the enforceable standard against a private SaaS is not a regulation but a settlement/injunction referencing WCAG `[fetched + inference]`. Title II's WCAG 2.1 AA becomes *your* problem the first time a university or state agency buys frontmatter, via procurement flow-down `[inference]`.
- Circuit split on whether a website with no physical nexus is a "place of public accommodation" remains unresolved; 9th Cir. relied on the nexus to physical restaurants `[fetched]`, other circuits differ `[SS]`. **Recorded as disagreement, not resolved.**

**India — Rights of Persons with Disabilities Act, 2016**

- s.2(i): "**'establishment' includes a Government establishment and private establishment**" `[fetched]`.
- s.40: Central Government "shall … formulate rules … laying down the **standards of accessibility** for … **information and communications, including appropriate technologies and systems**" `[fetched]`.
- s.42: appropriate Government shall ensure "**all contents available in audio, print and electronic media are in accessible format**" `[fetched]` — obligation on Government, not directly on you `[fetched]`.
- **s.46 is the one that reaches you:** "**The service providers whether Government or private shall provide services in accordance with the rules on accessibility formulated by the Central Government under section 40 within a period of two years from the date of notification of such rules**" `[fetched]`.
- s.89 penalty: first contravention fine up to **₹10,000**; subsequent, not less than **₹50,000**, up to **₹5,00,000** `[fetched]`. s.90 attaches liability to "every person who at the time the offence was committed, was in charge of, and was responsible to, the company" — a solo founder-director is that person `[fetched]`.
- The bite of s.46 is entirely conditional on which ICT standards are notified under s.40 and when; the RPwD Rules 2017 PDF at disabilityaffairs.gov.in returned an **HTML error page, not a PDF** `[measured]`, so the current notified ICT standard is **unverified here** `[measured]`. Do not state a compliance date for India `[inference]`.

### 2. WCAG 2.2 AA criteria a markdown editor most commonly fails — with fix and anti-fix

| SC (level) | Typical editor failure | Fix | Anti-recommendation |
|---|---|---|---|
| **1.4.3 Contrast (Min)** AA | muted/secondary/help text below 4.5:1 — **measured live in this repo at 2.64:1, 4.19:1, 3.84:1** `[derived]` | Raise `--muted`/`--danger`/`--success`; gate token contrast in CI as arithmetic, not as a visual review | Do not add a "high contrast mode" toggle and leave the default failing — a compliant alternative does not cure a non-compliant default `[inference]` |
| **1.4.11 Non-text Contrast** AA | hairline borders and focus rings under 3:1 — **measured 1.13:1 border, 2.14:1 ring** `[derived]` | Ring at ≥3:1 against both adjacent colours; borders that *identify* a control (inputs, buttons) at ≥3:1 | Do not raise every decorative divider to 3:1; 1.4.11 covers boundaries needed to identify the component, not aesthetics `[inference]` |
| **2.1.1 / 2.1.2 Keyboard, No Trap** A | Tab captured for indentation inside the editor traps keyboard users | CM6 leaves Tab as focus-move unless `indentWithTab` is added; **`indentWithTab` appears 0 times in `src/`** `[measured]` — keep it that way, or gate it behind Escape-then-Tab | Do not "fix" a trap by documenting the escape key in a help modal — 2.1.2 requires the mechanism be discoverable at the point of trap `[inference]` |
| **2.4.3 Focus Order / focus return** A | modal opens, focus stays on body; on close, focus is lost | Move focus into the dialog on open, restore to the invoking control on close | Do not `autoFocus` the first text input in every panel — it fires before the dialog is announced and the name is lost `[inference]` |
| **4.1.2 Name, Role, Value** A | `role="dialog"` without `aria-modal`, without an accessible name | **Measured: 10 × `role="dialog"`, 9 × `aria-modal` — `src/modules/ai-tools/presentation/SgnkAiButton.tsx` has the role and not the attribute** `[measured]` | Do not sprinkle `aria-label` on containers to silence a linter; a name on a `<div role="presentation">` is noise `[inference]` |
| **1.3.1 Info and Relationships** A | preview renders visual headings that are not real headings, or skips levels | Preview renders real `h1`–`h6` with `id` from rehype-slug `[measured, `components.tsx:111-114`]` — keep it; add a heading-order lint on the *document*, surfaced as an author warning | Do not auto-renumber the user's headings. Byte-preserving splice is the product thesis; silently rewriting `###` to `##` violates it `[inference]` |
| **1.1.1 Non-text Content** A | image with no alt silently rendered as decorative | **Measured: `components.tsx:180` renders `alt={alt ?? ""}`** `[measured]` — an un-alt'd image becomes `alt=""`, i.e. asserted decorative. Distinguish *absent* from *empty*: absent → author warning + repair suggestion (EN 301 549 **11.8.4** `[fetched]`); explicit `![](…)` → honour as decorative | Do not generate alt text with the AI SDK and write it into the file without author confirmation. Auto-alt is the highest-volume false-accessibility generator there is `[inference]` |
| **2.5.8 Target Size (Min)** AA | 20px icon buttons | SC text: "at least **24 by 24 CSS pixels**" `[fetched]`. **Measured: `.sgnk-icon-btn` is `width:28px; height:28px`** `[measured]` — passes | Do not add invisible padded hitboxes that overlap each other; the Spacing exception requires non-intersecting 24px circles `[fetched]` |
| **2.1.4 Character Key Shortcuts** A | single-letter shortcuts fire while a screen reader passes keys through | Provide remap or a modifier requirement, or restrict to focus | Do not disable all shortcuts — the criterion allows active-focus-only shortcuts `[inference]` |
| **1.4.12 Text Spacing** AA | fixed line-height on the preview breaks under user stylesheets | Use `line-height` ≥1.5 in relative units, no fixed-height text containers | Do not test this by eye; it needs the bookmarklet/override run `[inference]` |
| **2.4.11 Focus Not Obscured (Min)** AA — new in 2.2 | sticky toolbar covers the focused element when tabbing | `scroll-margin-top` equal to the sticky header height | Do not remove the sticky toolbar; the SC requires *not entirely hidden*, not *never overlapped* `[inference]` |
| **3.3.7 Redundant Entry / 3.3.8 Accessible Authentication (Min)** AA — new in 2.2 | auth flow requiring a cognitive test or re-typing | next-auth v5 OAuth with a password-manager-pasteable field satisfies 3.3.8 `[inference]` | Do not add a CAPTCHA to the share page. 3.3.8 forbids a cognitive function test with no alternative `[inference]` |

### 3. CodeMirror 6 — measured posture and its real limits

Installed: `@codemirror/view` **6.43.0**, `state` 6.6.0, `autocomplete` 6.20.2, `search` 6.7.0, `language` 6.12.3, `commands` 6.10.3, `lint` 6.9.6 `[measured]`.

**What CM6 ships for you (read out of `node_modules/@codemirror/view/dist/index.js`):**
- The content DOM is built with `role: "textbox"`, `"aria-multiline": "true"`, and `aria-readonly:"true"` when `state.readOnly` `[measured, exact source string]`.
- A polite live region is created at construction: `this.announceDOM.className = "cm-announced"; this.announceDOM.setAttribute("aria-live", "polite")`, positioned `{position:"fixed", top:"-10000px"}` and `display:none` under `@media print` `[measured]`.
- `EditorView.announce` is a documented StateEffect: "State effect used to include screen reader announcements in a transaction … should be used to describe effects that are visually obvious but may not be noticed by screen reader users (such as moving to the next search match)" `[measured, docstring in dist]`.
- Placeholder support emits `aria-placeholder` via `contentAttributes` `[measured]`.
- ARIA attribute inventory in the shipped bundle: `aria-hidden` ×5, `aria-live` ×2, `aria-label` ×2, `aria-readonly` ×1, `aria-placeholder` ×1, `aria-multiline` ×1 `[measured]`.

**Known limits — say these out loud in a VPAT rather than hiding them:**
- **CodeMirror publishes no accessibility notes page.** `codemirror.net/examples/accessibility/` is a **404** and the examples index lists none `[measured]`. Any plan that says "follow CodeMirror's accessibility guidance" is planning against a document that does not exist `[measured]`.
- `role="textbox"` + `aria-multiline` means most screen readers enter forms/edit mode and read the buffer as a flat text field. **Decorations, folds, widgets, gutters, and the ghost-text/AI suggestion overlay in `ghost-text.ts` are not part of the accessibility tree the user is reading** `[inference from the measured attribute set]`. Anything shown as a decoration must also be `EditorView.announce`d or it is invisible `[inference]`.
- **`aria-live="polite"` announcements are coalesced and dropped under rapid updates** — a per-keystroke AI ghost-text suggestion will either flood or silently lose announcements `[inference]`. Announce on settle, not on change.
- **There is no `EditorView.announce` call anywhere in `src/`** `[measured: grep returned 0]`. Search-match navigation, fold/unfold, AI suggestion accept/reject, and splice-refusal errors are currently silent to a screen reader `[measured + inference]`.
- The editor content DOM carries **no `aria-label`** from this repo `[measured: 0 hits for `ariaLabel`/`contentAttributes` in `src/`]` — the textbox is unnamed, a 4.1.2 failure `[inference]`.
- **Anti-recommendation:** do not replace CodeMirror with a `contenteditable` rich-text surface for accessibility reasons. A raw `contenteditable` gives you the same flat-textbox screen-reader model with none of CM6's announce plumbing, and costs you the byte-preserving engine `[inference]`.
- **Anti-recommendation:** do not build a parallel "accessible mode" that swaps CM6 for a `<textarea>`. It doubles the surface, and the shipped `<textarea>` loses every affordance you would then have to re-announce anyway `[inference]`.

### 4. The published page — where the exposure actually concentrates

- The editor is a tool used by your customer; the **published page is content you serve to the world under your domain, with your template** `[inference]`. Art. 2(4)(d)'s third-party carve-out protects the *body*, not the *shell* `[fetched + inference]`.
- Measured pipeline: `remark-parse`, `remark-gfm` 4.0.1, `remark-math` 6.0.0, `remark-breaks`, `remark-frontmatter`, `remark-rehype` 11.1.2, `rehype-raw` 7.0.0, `rehype-katex` 7.0.1, `rehype-highlight` 7.0.2, `rehype-slug` 6.0.0, `rehype-stringify` 10.0.1; `katex` **0.17.0** `[measured, package.json]`. A custom sanitiser exists at `src/modules/preview/presentation/markdown/html-policy.ts` with a `sanitizeProperties()` that strips event handlers `[measured — existence and function name; adequacy not audited here]`.

| Output concern | Position | Fix | Anti-recommendation |
|---|---|---|---|
| **Heading order** | preview emits real `h1`–`h6` with slugs `[measured]`; a document starting at `###` publishes a page whose first heading is h3 | Wrap published body under the page `h1` (the title) and either offset or warn — never silently rewrite the file | Do not auto-demote/promote headings in the file. It breaks the byte-preserving guarantee for a cosmetic AA win `[inference]` |
| **Alt text** | `alt={alt ?? ""}` `[measured]` | Publish-time report: count images with absent alt; block or warn per the author's own setting | Do not refuse to publish. A hard block on 1.1.1 drives users to export HTML and host elsewhere, producing a *less* accessible page with none of your telemetry `[inference]` |
| **Table headers** | GFM tables produce `<thead><th>` via remark-rehype `[inference]`; no `scope` attribute is added | Add `scope="col"` on `th` in the published renderer — free, no file mutation | Do not attempt `headers`/`id` matrices for complex tables; markdown cannot express them and inventing them is fabrication `[inference]` |
| **Link text** | "click here" / bare URLs | Publish-time warning listing non-descriptive link text (2.4.4) | Do not rewrite link text with AI `[inference]` |
| **Math** | KaTeX 0.17.0 `[measured]`; its default output emits MathML alongside visual HTML, which is what screen readers read `[SS — the `output` setting was not locatable in the installed `katex` package here `[measured]`]` | **Verify explicitly** that `rehype-katex` is not passed `output:'html'`; assert the presence of `<annotation encoding="application/x-tex">` in a published fixture | Do not add an `aria-label` with the raw LaTeX onto the rendered span — it double-reads against the MathML `[inference]` |
| **KaTeX CSS from CDN** | `export-doc.ts:98` and `pdf-doc.ts:132` link `cdn.jsdelivr.net` `[measured]` | Self-host for exports | Do not rely on a CDN for a document a user will open offline `[inference]` |
| **`lang`** | `src/app/layout.tsx:67` has `lang="en"` `[measured]` — hardcoded | Published pages must carry the document's own language (3.1.1), from frontmatter | Do not detect language from content heuristics and assert it; a wrong `lang` is worse than a generic one `[inference]` |
| **`prefers-reduced-motion`** | **0 occurrences in `globals.css`** `[measured]` | Add the media query around any transition | Do not remove all animation globally to "be safe" — it degrades the product for everyone and satisfies no AA criterion `[inference]` |

### 5. Testable checklist to gate in CI

| Gate | Tool | Assertion | Blocking? |
|---|---|---|---|
| Token contrast | 30-line script over `globals.css`, WCAG formula | every text token ≥4.5:1 on its background; every focus ring and control border ≥3:1; **fails today on 6 tokens** `[measured]` | **yes** — arithmetic, zero flake |
| Static JSX a11y | `eslint-plugin-jsx-a11y` (README fetched 200 `[measured]`) | error-level, not warn | yes |
| Rendered-page rules | `axe-core` — **105 rules in `doc/rule-descriptions.md`**, tagged `wcag2aa` ×6, `wcag21aa` ×3, `wcag22aa` ×1 `[measured, counted]` | 0 violations at `wcag2a,wcag2aa,wcag21a,wcag21aa,wcag22aa` on 5 published fixtures | yes |
| Published-output fixtures | Playwright + axe, on: heading-skip doc, image-without-alt doc, GFM table doc, math doc, RTL/CJK doc | fixed expected violation set, diffed | yes |
| Keyboard reachability | Playwright: tab through the app, assert every interactive element receives focus and `document.activeElement` is never `body` after a modal opens/closes | 0 unreachable controls | yes |
| Dialog contract | grep-level gate: count of `role="dialog"` == count of `aria-modal` == count of dialogs with an accessible name; **currently 10 / 9 / unverified** `[measured]` | equality | yes |
| Announce coverage | assert `EditorView.announce` is dispatched for: search next/prev, fold/unfold, splice refusal, AI accept/reject; **currently 0 call sites** `[measured]` | ≥4 call sites, unit-tested | yes |
| Degradation certificate extension | extend `mdmax cert` to assert heading level, alt presence, `th` role, and `lang` survive md→HTML→PDF — this is EN 301 549 **11.8.3** stated as a test `[fetched + inference]` | byte-level | yes |
| Manual, quarterly, not in CI | NVDA+Firefox and VoiceOver+Safari on the editor and one published page | scripted 12-step walkthrough, recorded | no |

- **Anti-recommendation on tooling:** do not report an "axe score". axe-core detects roughly a third of WCAG issues by most published estimates `[SS]` and returns violations, not scores; a green axe run on a page whose focus ring is 2.14:1 is exactly the false-green this codebase's own Learned Rules warn about `[inference]`.
- **Anti-recommendation:** do not add Lighthouse's accessibility number to CI as a threshold. It is a weighted subset of axe and moves when Lighthouse changes weights, producing regressions that are not regressions `[inference]`.

### 6. Accessibility theatre — things that cost money and do not help

- **Overlay/widget scripts** (accessiBe-class). They do not fix the DOM you serve, they are widely litigated against, and they are named in disability-community boycotts `[SS]`. They also cannot fix a CM6 flat-textbox model `[inference]`.
- **A VPAT/ACR written before the audit.** An ACR that says "Supports" where the shipped `--muted` is 2.64:1 `[derived]` is a written misrepresentation to a procurement officer, which is worse than no ACR `[inference]`. Write "Partially Supports" with the measured number.
- **An accessibility statement page with no remediation dates.** EAA Annex I §III(d) asks support services to provide **information on the accessibility of the service and its compatibility with assistive technologies** `[fetched]` — a statement with no specifics does not discharge that.
- **AI-generated alt text written silently into user files.** Violates the file-is-truth thesis, and produces confident wrong descriptions that pass every automated check `[inference]`.
- **`aria-label` on everything.** Adding a name to a `<div role="presentation">` (3 present in `src/` `[measured]`) creates announcements with no corresponding interaction.
- **Skip-links on an editor.** A skip-link to "main content" in a three-pane editor with one textbox is a link to nowhere useful; the real need is a documented pane-cycling shortcut `[inference]`.
- **Chasing WCAG AAA.** EN 301 549 V3.2.1 places the AAA criteria in an informative clause 9.5 `[fetched]`; no jurisdiction above requires AAA `[fetched across all four]`.
- **Auditing the marketing site and not the published-page template.** The template is the artefact that gets replicated across every customer document — one fix there is worth every marketing-page fix combined `[inference]`.

### Open disagreements and unverified items

- **Contrast numbers:** PRD `#b8b8b8` = 2.14:1 vs measured 1.984:1; ink 20.2 vs 19.798; blue 5.16 vs 5.225 `[derived]`. Not reconciled. The verdict (fails AA) is unaffected.
- **Two token sets exist**: the design-system doc set (`#ffffff`/`#1a5cff`/`#b8b8b8`) quoted by the PRD, and the shipped app set in `src/app/globals.css` (`#fafafa`/`#18181b`/`#9b9ba3`) `[measured]`. The PRD's remediation target is not the set the app ships.
- **EN 301 549 v4.x**: not retrievable at ETSI's predictable path (404) `[measured]`. Whether a version newer than V3.2.1 (2021-03) is the currently OJEU-referenced harmonised standard is **unverified**.
- **India**: the ICT accessibility standards notified under RPwD s.40 could not be opened (disabilityaffairs.gov.in returned HTML, not the Rules PDF) `[measured]`. The s.46 two-year clock therefore has **no verifiable start date** in this report.
- **KaTeX MathML output mode**: not confirmed by reading the installed package `[measured]`; treat as unverified until a published fixture is asserted.
- **`html-policy.ts` adequacy**: file existence and a `sanitizeProperties()` function measured `[measured]`; the sanitiser was not audited, and `rehype-raw` 7.0.0 is in the pipeline `[measured]` — raw HTML in a user document can inject inaccessible (and unsafe) markup into a page you serve.