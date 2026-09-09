export const meta = {
  name: 'frontmatter-untapped-research',
  description: 'Research the nine market seams the frontmatter corpus never covered, from opened primary sources',
  phases: [
    { title: 'Research', detail: 'ten lenses, each opening primary sources with curl' },
    { title: 'Verify', detail: 'adversarially check every load-bearing number' },
    { title: 'Critic', detail: 'what is still missing' },
  ],
}

const GROUND = `
You are researching for STUDIO ZEPHYRUS, on a product called **frontmatter**: a byte-exact
markdown editor for repositories whose documents are increasingly written by AI agents. Its
current headline claim is that it shows **review state** — what an agent changed in a working
tree that has NO pull request, and what nobody has read. Its engine is splice-only: it locates
a byte range and replaces only those bytes, and REFUSES rather than guess.

Two weeks of research already covered, deeply: Obsidian, Notion, Cursor, Zed, Bear, iA Writer,
Typora, GitBook, HackMD, Ulysses, Craft, Logseq, Tana, Anytype, AFFiNE, AppFlowy, Outline,
Docmost, Coda, Confluence, Decap/TinaCMS/Keystatic, Docusaurus/MkDocs/Mintlify, CommonMark,
remark/rehype/mdast, Pandoc, Automerge/Yjs, Reviewable, Graphite, Linear. DO NOT re-research
those unless your specific lens needs a NEW fact about them.

METHOD — this is the part that matters:
- OPEN PRIMARY SOURCES. \`curl\` is available and is NOT blocked. Use it.
  Working patterns proven on this machine:
    curl -sL --compressed "https://<site>" | sed -e 's/<[^>]*>//g' | tr -s '[:space:]' ' '
    curl -sL "http://export.arxiv.org/api/query?search_query=all:<terms>&max_results=20"
    curl -sL "https://api.github.com/search/repositories?q=<q>&sort=stars"
    curl -sL "https://hn.algolia.com/api/v1/search?query=<q>&hitsPerPage=50"
    curl -sL "https://www.reddit.com/r/<sub>/search.json?q=<q>&restrict_sr=1&limit=50" -A "research"
    curl -sL "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=<q>&retmode=json"
- A number you did not read out of an opened page is NOT a finding. Mark it unverified or drop it.
- Quote at most 15 words from any source, in quotation marks, with attribution.
- Distinguish "I read this on the page" from "I inferred this". Say which.
- Dead products matter MORE than live ones here. A startup that tried this and died is the
  single most valuable evidence class available. Find out WHEN it died and WHY, from a source.
`

const FINDING = {
  type: 'object',
  additionalProperties: false,
  required: ['lens', 'findings', 'implications_for_frontmatter', 'decisions_this_forces', 'sources_opened', 'what_i_could_not_verify'],
  properties: {
    lens: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['claim', 'evidence', 'url', 'opened', 'confidence'],
        properties: {
          claim: { type: 'string', description: 'One sentence. A fact, with its number if it has one.' },
          evidence: { type: 'string', description: 'What the opened page actually said. Quote <=15 words.' },
          url: { type: 'string' },
          opened: { type: 'boolean', description: 'true only if you fetched this URL in this session' },
          confidence: { type: 'string', enum: ['read-it', 'inferred', 'unverified'] },
        },
      },
    },
    implications_for_frontmatter: { type: 'array', items: { type: 'string' } },
    decisions_this_forces: {
      type: 'array',
      description: 'Product decisions this research creates or changes. These become questions in the decision site.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['question', 'why_it_is_a_decision', 'options', 'recommendation', 'area'],
        properties: {
          question: { type: 'string', description: 'Plain human question ending in ?. No jargon. No AI cadence.' },
          why_it_is_a_decision: { type: 'string' },
          options: { type: 'array', items: { type: 'string' } },
          recommendation: { type: 'string' },
          area: { type: 'string', enum: ['Product & definition', 'Form factor & surfaces', 'Features', 'Flow & interaction', 'Design, UI & attention', 'Engine & technical', 'Access, offline & install', 'Market & competition', 'Pricing & tiers', 'Go-to-market & channels', 'Business & operations', 'Legal, privacy & data', 'Name & identity', 'Plan, scope & sequencing', 'Research & evidence'] },
        },
      },
    },
    sources_opened: { type: 'array', items: { type: 'string' } },
    what_i_could_not_verify: { type: 'array', items: { type: 'string' } },
  },
}

const LENSES = [
  {
    key: 'prose-diff',
    prompt: `LENS: **Document comparison and redlining tools** — the closest competitive set to
"show me what changed in this prose", and the frontmatter corpus mentions it 11 times in 1.24
million words. That is the gap.

Cover, by opening their real pages: Draftable (draftable.com, incl. its API and desktop pricing),
Litera Compare (formerly Workshare Compare), Workshare, Microsoft Word's Compare and Track
Changes, Google Docs "Compare documents" and version history, Adobe Acrobat Compare,
Diffchecker, Kryon/Juro/Ironclad redlining if they surface.

Answer with numbers where they exist: what do these cost, who buys them, how big is the
category, what does the diff actually LOOK like (side-by-side? inline? change bar?), and what
granularity do they diff at (character, word, sentence, paragraph)?

Then the question that matters most: these tools have existed for 20+ years and are profitable.
Why has none of them become the thing developers use on a markdown repo? Find the reason from a
source, not from reasoning.`,
  },
  {
    key: 'diff-granularity',
    prompt: `LENS: **Diff algorithms and granularity for PROSE, not code** — 4 mentions in the
whole corpus, and it decides whether the review UI is readable at all.

Open primary sources on: Myers diff (the 1986 paper), patience diff, histogram diff, the
git --word-diff and --color-words implementations, diff-match-patch (Google), difftastic
(structural/AST diff), semantic-diff research on arXiv, and the CommonMark/remark AST-diff
attempts. Search arXiv for text/document diff and semantic diff work.

Answer: what granularity does a HUMAN reviewing prose actually need — character, word,
sentence, paragraph, or semantic block? Is there research measuring reviewer accuracy or speed
against diff granularity? What does word-level diff cost computationally on a 50,000-word file?
What breaks when you diff markdown as text vs as an AST?

Note explicitly: this project has ALREADY measured diff-match-patch as non-idempotent while it
returned true, and has ALREADY decided sync is git-merge + splice journal + CAS, never a CRDT.
So do not re-litigate CRDTs. The open question is the READING granularity for the review UI.`,
  },
  {
    key: 'git-for-writers-graveyard',
    prompt: `LENS: **The git-for-writers graveyard** — 2 mentions in the corpus, and it is the
exact space frontmatter is entering. This is the highest-value lens in the batch.

Every product that tried to give writers version control or pull-request-shaped review, and what
happened to it. At minimum: Penflip, Draft (draftin.com), Editorially, Poetica, Authorea,
Manuscripts, Fictionary, Prose.io, GitBook v1 (the git-backed one, before the rewrite),
Gitbook's own pivot away from git, Ghost's editor history, Substack's lack of versioning,
Atlassian's Confluence page history, Almanac (almanac.io — a well-funded startup doing doc
review state that appears to have wound down; find out exactly what happened and when).

For EACH: what it did, when it launched, when it died or pivoted, who funded it, and the stated
reason. Find shutdown posts, HN threads, archived pages, GitHub archive notices. Use
hn.algolia.com and web.archive.org.

The finding I need is not "some of these died". It is: is there a REPEATED failure mode, named
by the people who lived it?`,
  },
  {
    key: 'review-fatigue',
    prompt: `LENS: **Review fatigue and the attention economics of reviewing machine output** —
8 mentions in the corpus. frontmatter's own pitch says a repo can be 18% unread agent output.
If that is true, the reviewer has an attention problem, and there is real literature on it.

Open primary sources on: the SmartBear/Cisco code review study (defect detection vs LOC
reviewed), Google's code review data and its "Modern Code Review" paper (Sadowski et al.),
Microsoft's code review research, PR size vs review quality studies, alert fatigue in security
operations and clinical alerting (PubMed has real numbers on clinical alert override rates),
and any research on reviewing AI-generated content specifically.

Answer with numbers: at what volume does review quality collapse? What is the measured defect
detection rate per hour of review? What is the override/dismiss rate for automated alerts, and
what does that predict for a UI that marks 200 spans "unreviewed"?

This lens should end with a hard warning if the evidence supports one.`,
  },
  {
    key: 'market-size',
    prompt: `LENS: **Actual market size** — note-taking, document editing, and docs-as-code. The
corpus sizes this ONCE in 1.24 million words.

Get real numbers from opened sources, with dates: note-taking app market size and CAGR (find the
actual research-firm pages, and be honest that these firms disagree wildly), Notion's revenue and
valuation and user count, Obsidian's user count and revenue if disclosed, Atlassian Confluence
revenue, GitBook/Mintlify/ReadMe funding and disclosed ARR, the developer-tool prosumer segment.

Then the number that actually matters to a two-person studio: how many people PAY for a markdown
editor, and what do they pay? Obsidian's Catalyst/Sync/Publish numbers, iA Writer's pricing,
Typora's one-time price, Bear's subscription, Ulysses. Cross-check against app-store or
Setapp-style disclosures if any exist.

Flag loudly where a number is a vendor's own marketing claim rather than an audited figure.`,
  },
  {
    key: 'legal-redlining',
    prompt: `LENS: **Legal and regulated-document review as an adjacent buyer** — 1 mention in the
corpus. Lawyers redline documents all day, pay a lot, and have habits worth learning from even if
we never sell to them.

Open sources on: how contract review actually works (redline, blackline, clean version), what
lawyers pay for Litera / Draftable / Kira / Luminance / Ironclad / Juro, the "compare against the
last version I approved" workflow, and whether any of it has moved to markdown or plain text.

Also cover: regulated-document review outside law — clinical trial protocols, aviation manuals,
pharma SOPs — where "who approved which version of which paragraph" is a legal requirement. Is
there a compliance driver that would make per-span review state a REQUIREMENT rather than a nicety?

End by answering plainly: is this an adjacent market frontmatter could serve, a source of UI
patterns only, or a distraction?`,
  },
  {
    key: 'unmentioned-products',
    prompt: `LENS: **The 34 products the corpus never names.** I scanned 1.24M words of our own
research against a 138-product list. These 34 appear ZERO times. Sweep them and report only the
ones that are material — I expect most to be dead or tiny, and saying so with evidence is a
valid finding.

Amplenote, Supernotes, Almanac, Mark Text, Ghostwriter, Abricotine, MWeb, Taio, 1Writer, Byword,
Bike, Forestry, Pages CMS, Fumadocs, Draftable, Workshare, Authorea, Cambria (Ink & Switch),
Milanote, Diarium, Kortex, Tangent, Flotes, Athens Research, CherryTree, Turtl, Laverna,
Boostnote, Quiver, nvALT, FSNotes, Bear Publish, Bearblog, Micro.blog.

For each: alive or dead, what it does that our covered set does not, user/star/download numbers
if findable, price. Use GitHub API for stars and last-commit dates, the App Store / product pages
for pricing.

Give special weight to: **Almanac** (doc review state, well funded), **Draftable** (prose diff as
a business), **Bike** (an outliner with a genuinely novel plain-text file format), **Cambria**
(Ink & Switch's schema-evolution work, directly relevant to a sidecar format that must survive
version drift), and **Pages CMS / Forestry** (git-backed editing, our exact substrate).`,
  },
  {
    key: 'sidecar-formats',
    prompt: `LENS: **Sidecar and manifest file formats** — frontmatter stores review state in a
\`.frontmatter/review.jsonl\` sidecar next to the user's files. 8 mentions in the corpus. What is
the prior art, and what breaks?

Open sources on: SBOM formats (SPDX, CycloneDX) and why they are sidecars, C2PA content
credentials, XMP sidecars in photography (.xmp next to RAW), Git LFS pointers, .gitattributes,
EditorConfig, DVC's .dvc files, Adobe Lightroom sidecars, macOS extended attributes and resource
forks, Cambria/Ink & Switch on schema evolution, and JSON Lines as a format.

Answer: what happens to a sidecar when the file it points at is renamed, moved, edited by another
tool, or merged? How do the mature formats ANCHOR to content — path, hash, or both? What did
photography learn in 20 years of .xmp files that we should copy? What is the failure mode when a
sidecar and its file disagree, and how does each format resolve it?

This is an engine-decision lens. End with concrete anchoring recommendations.`,
  },
  {
    key: 'scope-edges',
    prompt: `LENS: **Two scope edges the corpus barely touches** — templates/snippets (8 mentions)
and voice/dictation (4 mentions). Both are candidate features and both may be traps.

Templates and snippets: do markdown editors ship them, do users ask for them, is there a template
marketplace with real money in it? Look at Obsidian Templater plugin download counts, Notion's
template gallery and the people selling templates, VS Code snippets, and any markdown-specific
template business.

Voice and dictation: is there real demand for dictating into a markdown editor? What does Apple's
built-in dictation already cover for free, and what does Whisper-based tooling cost now? Is
anyone paying for this in a writing app?

Also sweep, briefly, for anything a 2026 markdown/document editor is EXPECTED to have that our
feature list might be missing — check current release notes and changelogs for Obsidian, Notion,
Craft and iA Writer from the last six months, and report only genuinely new expectations.`,
  },
  {
    key: 'agent-writes-docs-now',
    prompt: `LENS: **What shipped in agent-written-documentation between mid-2026 and today
(2026-09-09)** — the corpus's newest research is from late August. The single fastest-moving risk
to this product is a platform shipping review state for free.

Open and read the ACTUAL changelogs and release notes: Claude Code's changelog, Cursor's
changelog and blog, GitHub Copilot / Copilot Workspace release notes, VS Code's monthly iteration
notes for the last three releases, JetBrains AI, Zed's blog, Windsurf, Google Antigravity if it
exists, and the OpenAI/Anthropic developer blogs.

The specific questions: has ANY of them shipped (a) a per-file or per-span "reviewed" marker,
(b) a view of what an agent changed in an uncommitted working tree, (c) attribution marking of
AI-written text, or (d) a markdown-specific review surface?

Also check: the GitHub issue claude-code#33932 and any successors, VS Code issues asking for
agent-diff review, and whether the "agents write into a local repo with no PR" workflow now has a
first-party answer.

Report DATES. A feature that shipped last week changes the plan; one rumoured for next year does not.`,
  },
]

phase('Research')
const raw = await parallel(LENSES.map((l) => () =>
  agent(`${GROUND}\n\n${l.prompt}`, { label: `research:${l.key}`, phase: 'Research', schema: FINDING, effort: 'high' })
))

const research = raw.filter(Boolean)
log(`${research.length}/${LENSES.length} lenses returned; ${research.reduce((a, r) => a + r.findings.length, 0)} findings, ${research.reduce((a, r) => a + r.decisions_this_forces.length, 0)} candidate decisions`)

// Only claims that carry a NUMBER or a death-date can mislead the plan; verify those.
const loadBearing = research.flatMap((r) =>
  r.findings
    .filter((f) => /\d/.test(f.claim) || /died|shut|acquir|pivot|discontinu|sunset/i.test(f.claim))
    .map((f) => ({ lens: r.lens, ...f }))
)
log(`${loadBearing.length} load-bearing claims (carry a number or a death-date) go to verify`)

const VERDICT = {
  type: 'object',
  additionalProperties: false,
  required: ['claim', 'verdict', 'what_the_source_actually_says', 'corrected_claim', 'url_checked'],
  properties: {
    claim: { type: 'string' },
    verdict: { type: 'string', enum: ['CONFIRMED', 'CORRECTED', 'REFUTED', 'UNVERIFIABLE'] },
    what_the_source_actually_says: { type: 'string' },
    corrected_claim: { type: 'string', description: 'If CORRECTED, the accurate version. Else repeat the claim.' },
    url_checked: { type: 'string' },
  },
}

phase('Verify')
const verdicts = (await parallel(loadBearing.map((c, i) => () =>
  agent(`You are a skeptic. Another researcher made this claim about the document-editing market:

CLAIM: ${c.claim}
THEIR EVIDENCE: ${c.evidence}
THEIR URL: ${c.url}
THEY SAY THEY: ${c.opened ? 'opened this URL' : 'did NOT open this URL'}

OPEN THAT URL YOURSELF with curl and check it. If the URL is dead, find the fact elsewhere or
say UNVERIFIABLE. Default to CORRECTED or REFUTED when the source does not plainly support the
number as stated — vendor marketing pages, research-firm press releases and paraphrases of
paraphrases are all weak evidence and should be labelled as such in your answer.

Be specific about WHICH number is wrong when you correct one.`,
    { label: `verify:${c.lens}:${i}`, phase: 'Verify', schema: VERDICT, effort: 'high' })
))).filter(Boolean)

const bad = verdicts.filter((v) => v.verdict === 'CORRECTED' || v.verdict === 'REFUTED')
log(`verify: ${verdicts.filter(v => v.verdict === 'CONFIRMED').length} confirmed, ${bad.length} corrected or refuted, ${verdicts.filter(v => v.verdict === 'UNVERIFIABLE').length} unverifiable`)

phase('Critic')
const critique = await agent(`${GROUND}

Ten research lenses just ran on the seams our corpus never covered. Here is what came back,
compressed:

${research.map((r) => `## ${r.lens}
FINDINGS: ${r.findings.map((f) => `- ${f.claim} [${f.confidence}]`).join('\n')}
IMPLICATIONS: ${r.implications_for_frontmatter.join(' | ')}
DECISIONS RAISED: ${r.decisions_this_forces.map((d) => d.question).join(' | ')}
COULD NOT VERIFY: ${r.what_i_could_not_verify.join(' | ')}`).join('\n\n')}

And the skeptical pass corrected or refuted these:
${bad.map((v) => `- ${v.claim}\n  -> ${v.verdict}: ${v.corrected_claim}`).join('\n') || '(none)'}

You are the completeness critic. Answer four things, hard:

1. What seam is STILL untapped? Not "more research would help" — name a specific question about
   this market that nobody asked and that would change the product if answered.
2. Which of these findings, if true, most damages the current plan? Say it plainly. The plan's
   own adversarial round already came back negative on its headline, so we are not fragile.
3. Which candidate decisions are duplicates of each other, and which are not decisions at all but
   research tasks in disguise?
4. What did the researchers assert without opening a source? Name them.

Return prose, not a list of pleasantries. Be specific and be short.`, { label: 'completeness-critic', phase: 'Critic', effort: 'high' })

return {
  lenses: research.length,
  findings: research.reduce((a, r) => a + r.findings.length, 0),
  candidate_decisions: research.flatMap((r) => r.decisions_this_forces),
  research,
  verdicts,
  corrections: bad,
  critique,
}
