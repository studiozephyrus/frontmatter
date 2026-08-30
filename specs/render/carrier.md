---
spec: 1
id: render/carrier
title: Render carrier selection — how a profile is written on disk
type: render
state: draft
track: T2
prd_file: docs/FRONTMATTER-PRD-v2-2026-08-29.md
prd_sha256: "400aef0d4008c19d4f4ae85515bbc058d638be309090af8411b17ff280c0442d"
prd_sections: ["9", "9.1", "9.2", "5", "6.2"]
governs:
  - src/modules/preview/presentation/markdown/components.tsx
verify:
  - node specs/harness/spec-report.mjs --id render/carrier
budget: 2400
owner: sagnik
updated: 2026-08-29
commit: 5e0d5a5
x:
  supersedes_prd_claim: >-
    PRD §9 names the fenced-code info string as THE dispatch mechanism. Round 9 measured
    the carriers against four local engines plus GitHub live and found the blockquote
    callout strictly better for prose-bearing profiles. This spec is the corrected answer.
---

# Render carrier selection

## Contract

A render profile is a projection, so its on-disk form must survive a renderer that has never heard of it. Two carriers are permitted and no others: a **blockquote callout** `> [!kind]` for profiles whose payload is prose, and a **fenced code block with a structured info string** for profiles whose payload is opaque data. Everything else — generic directives, HTML comments, frontmatter-as-block-carrier, link and footnote abuse — is refused. A profile that cannot be expressed in one of the two carriers does not ship.

## Invariants

| # | Rule | Failure mode | Executable check |
|---|---|---|---|
| 1 | Prose-bearing profiles use `> [!kind]`; there is **no closing marker** | A dropped closer changes the meaning of the rest of the file | `test/render/carrier/callout-has-no-closer.test.ts` |
| 2 | Opaque profiles use a fence, and the open/close pair is spliced **atomically** | CommonMark §4.5: an unclosed fence swallows every following line into `<pre>` — measured, document-wide blast radius | `test/render/carrier/fence-atomic-splice.test.ts` |
| 3 | Non-GFM callout kinds are namespaced `> [!fm-<kind>]` | A bare unknown kind collides with a future GFM alert type | `test/render/carrier/namespace.test.ts` |
| 4 | An unknown carrier payload **degrades**, never throws and never disappears | A board fence becomes a blank region in a dumb renderer | `test/render/carrier/degrade.test.ts` |
| 5 | Titles are a heading **inside** the container, never an attribute | An attribute-borne title is invisible on GitHub; a heading survives as a real `<h2>` in every engine measured | `test/render/carrier/title-survives.test.ts` |
| 6 | `:::directive` is accepted on **input** and normalised to a permitted carrier on save; it is never the on-disk form | Prettier rewrites `:::note\nHello\n:::` into `::: note Hello:::`, documented by Docusaurus | `test/render/carrier/directive-normalise.test.ts` |
| 7 | No inline profile mechanism in v1 | Every inline candidate measured degrades to brace soup or a fake `href` | absence check in `spec-report.mjs` |
| 8 | Fence info strings use `~~~` when the payload may contain backticks | A backtick in the payload terminates the fence early | `test/render/carrier/tilde-fence.test.ts` |

## Interface

- **Blocking prerequisite.** `src/modules/preview/presentation/markdown/components.tsx` extracts the fence language with `/language-(\w+)/`. `\w` excludes `-`, so every hyphenated language collides with its prefix. Cite the pattern, not the line — it was line 133 on 2026-08-29. **Fix this before any profile ships.**
- Splice writer: `src/modules/share/domain/splice-frontmatter.ts` (13,324 bytes, exists).
- GFM alert kinds reused verbatim for free native GitHub rendering: `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`.

## Behaviour

Measured against `commonmark@0.31.2`, `markdown-it@15.0.0`, `marked@16.4.2`, `micromark@4.0.2`, plus GitHub live.

| Carrier | Dumb-renderer result | Splice safety |
|---|---|---|
| `> [!kind]` callout | Correct blockquote container, 7 stray marker chars; unknown kinds degrade cleanly on GitHub | **No closing marker exists** — an unclosed callout is structurally impossible |
| Fenced code + info string | Markers hidden; body shown verbatim; GitHub preserves the info string as `data-meta` | Unclosed fence swallows the rest of the document |
| `:::` generic directive | Fence text visible as prose; a multi-paragraph container **silently splits** on the closer | Unclosed container runs to the end of its parent |
| HTML comment | Printed as visible text under `html:false` — the default in three of our seven bench engines | — |
| Frontmatter as block carrier | Renders as `<hr>` + `<h2>title: x</h2>` | — |

**Carrier choice rule:** if a human would want to read the payload as prose in a plain renderer, use the callout. If the payload is data a human would not read, use the fence.

## Refusals

| Condition | Message |
|---|---|
| Profile requests an inline carrier | "Inline profiles are not supported. Use a block carrier." |
| Profile requests `:::` as its on-disk form | "Directives are accepted on input only. This profile will be saved as `<carrier>`." |
| Fence payload contains the fence delimiter | "Refused: payload contains the fence delimiter. Use a longer `~~~` run." |
| Callout kind is neither a GFM kind nor `fm-` prefixed | "Callout kind `<k>` must be a GFM alert type or namespaced `fm-<k>`." |

## Verification

- Red proof: `test/render/carrier/fence-atomic-splice.test.ts` must **fail** against a splice that treats the open fence independently of its closer, before it may certify anything.
- Degradation evidence is re-measured, not assumed: the matrix above is regenerated by the certificate bench across all seven engines.

<!-- SPEC:DRIFT:START -->
generated: never
<!-- SPEC:DRIFT:END -->

## Decisions

- 2026-08-29 — Two carriers only: callout for prose, fence for data. Generic directives are input sugar, never on-disk. Reason: measured, the callout is the only container scoring best on both degradation and splice safety, because it has no closing marker to lose.
- 2026-08-29 — This corrects PRD §9, which named the fence info string as the single mechanism.

## Open

- Do we normalise a pasted `:::note` silently, or show the user what changed? Silent normalisation edits bytes the user did not touch, which cuts against the whole product.
- Does the callout carrier need a parameter syntax at all, or is one short token on the marker line enough?

## Next

    node specs/harness/spec-report.mjs --id render/carrier
