---
mdmap: 1
scope: docs/mdmap/07-open
title: Open — naming, spec strategy, risks
parent: ../MAP.md
rank: 0.52
---

# Open

## Orientation

Two decisions are genuinely unresolved and belong to Sagnik, not to the research: **what
this is called**, and **whether the format is published as an open spec at all**. Both are
argued here rather than assumed.

## Invariants

- **A spec with no consuming implementation is a blog post.** Ship the tool first, publish
  the format only once something real reads and writes it.
- **Design for the failure case.** A `MAP.md` that no tool understands must still be a
  useful markdown document — a nested list of links with headings. `.canvas` fails this test.
- **Never claim a trademark position from an unverified search.** No trademark database
  could be reached this session.

## The naming decision

**`MD3` is dead.** `m3.material.io` is Google's Material Design 3 and "MD3"/"M3" is its
universal shorthand; npm returns **142 packages** under that name, essentially all Material
Design. Same audience, unwinnable. `M3D` and `MMD3` are also out.

**`MDMAP` / `MD Map` is legally clear but carries a permanent shadow.** markmap is **13,006
stars**, **40,931 weekly npm downloads** for `markmap-view`, and **258,454 VS Code
installs**. The crucial distinction, and it is real: **markmap is single-document scoped** —
it renders one file's heading hierarchy as a mindmap. It does not touch folder trees, link
graphs, or backlinks. So the collision converts into positioning:

> *markmap maps a document. mdmap maps a project.*

Availability, verified directly (curl against the registries and RDAP, 2026-07-29):

| | npm | PyPI | .dev | .org | .in | .ai |
|---|---|---|---|---|---|---|
| **mdmap** | FREE (404) | FREE (404) | FREE $8.75 | FREE $7.98 | FREE $7.83 | FREE $82.70 |
| mdax | FREE | FREE | free | free | free | free |
| mdatlas | TAKEN | FREE | free | free | free | TAKEN |
| mdgraph | TAKEN | TAKEN | free | free | free | free |

`mdmap.com` is registered to GoDaddy's NameFind investment arm — parked for resale, not a
competing product. The `.md` TLD is thematically perfect and priced accordingly:
**$183.99/yr to register, $219.99/yr to renew, no WHOIS privacy, 1–3 year terms only** —
and `map.md` and `atlas.md` are both already taken.

**The file name is `MAP.md`, and this matters more than the brand.** `llms.txt` and
`AGENTS.md` both prove the file *is* the brand. SCREAMING_CASE sorts it into the convention
cluster near README and LICENSE, renders on GitHub when clicked, and collides with nothing.
`INDEX.md` is disqualified — `index.md` is the universal SSG homepage convention.

And the structural argument is unusually tight: the machine layer lives in the file's YAML
**frontmatter**, the human layer in the body. One file, both readers, and the product name
explains the mechanism.

**Recommendation: `mdmap` as the concept and CLI, `MAP.md` as the artifact.** Register
`mdmap.dev` and `mdmap.org`. Treat `mdmap.md` as an optional flex.

## The flag nobody asked for

**`frontmatter` already collides.** [Front Matter CMS](https://frontmatter.codes) —
*"Headless CMS right in your code editor"* — is a VS Code extension by Elio Struyf,
**2,528 stars, last pushed 2026-07-25**, targeting Hugo/Jekyll/Docusaurus/Next/Astro. Same
word, same ecosystem, same editor-adjacent space. Not fatal, but not clean ground either —
and it means the `mdmap` layer may end up being the cleaner trademark asset than the
product it ships inside. Worth deciding deliberately rather than by default.

## Regions

| node | status | what it holds |
|---|---|---|
| [[naming]] | planned | 30 candidates, collisions, the full RDAP table |
| [[spec-strategy]] | planned | ship-tool-first; the llms.txt and JSON Canvas cautionary data |
| [[licence]] | planned | MIT for the spec; what the CLI should be |
| [[governance]] | planned | who says no to v2; the SCIP-vs-LSIF lesson |
| [[conformance]] | planned | what a conforming reader must do |
| [[risks]] | planned | Obsidian ships it; context windows eat it; nobody authors |
| [[trademark]] | planned | **blocked** — no database reachable this session |
| [[prior-names]] | planned | DocMaps, markmap, md2map, mdBook — and what each taught |
| [[open-questions]] | planned | the four unresolved format questions |

## Relations

| from | edge | to | why |
|---|---|---|---|
| spec-strategy | contradicts | ../03-spec/MAP | the spec should not be published yet |
| naming | supersedes | "MD3" | Material Design 3 owns it |
| risks | contradicts | ../06-product/MAP | item 1 invalidates the roadmap outright |
| trademark | — | — | blocked; do not act on the reasoning in it |

## Gaps

- **`trademark` is blocked**, not planned. USPTO and EUIPO serve JS shells to a fetcher;
  Trademarkia 403s. Anything said about marks in this region is inference.
- **`governance` is unwritten and is the thing that kills open specs.** JSON Canvas has had
  zero spec changes in 28 months and 22 open issues; the HN critique was governance, not
  design: *"Publishing 1.0 without consulting with anybody else… is rather egregious."*

## Navigate

The naming recommendation above is actionable today. Everything else here should wait until
`mdmap check` exists and someone other than its author has run it.
