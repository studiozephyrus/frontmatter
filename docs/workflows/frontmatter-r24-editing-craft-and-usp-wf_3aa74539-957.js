// SPAWN-GATE: q1=y q2=y q3=y
export const meta = {
  name: 'frontmatter-r24-editing-craft-and-usp',
  description: 'The editor as an editor: table stakes, the beloved details, and the features only a byte-exact engine can build',
  phases: [
    { title: 'Ground', detail: 'what every serious editor does, and what people actually love' },
    { title: 'USP', detail: 'what only we can build, and what AI-native editing means' },
  ],
}

const FM = '/Users/sagnikmitra/Desktop/GitHub/frontmatter/'
const REC = FM + 'docs/FRONTMATTER-RECORD.md'

const HOUSE = [
  '',
  'YOU ARE THE THIRD CO-FOUNDER, and this round exists because we measured a real gap. Across 236,000 words the record mentions `splice` 501 times and `byte` 862 times, but `typewriter mode` 0, `scroll sync` 0, `quick switcher` 0, `semantic diff` 0, `keybinding` 2 and `table editor` 1. We researched the engine underneath the editor and the business around it, and never researched the editor as an editor. That is what you are fixing.',
  '',
  'THE STANDARD:',
  '- OPEN REAL PRODUCTS AND REAL COMPLAINTS. Docs, changelogs, forums, keymap references. Count and quote.',
  '- Name the product and the version or date for every behaviour you describe. Editors change.',
  '- Distinguish TABLE STAKES (absence is disqualifying), DIFFERENTIATOR (a reason to switch), and DELIGHT (why people stay). Conflating these is how a roadmap fills with the wrong work.',
  '- A feature nobody asked for is not innovation, it is surface. Every proposal names who uses it and how often, or it is cut and the cut is recorded.',
  '',
  'HOW TO REACH SOURCES. WebFetch is refused by a security gate here; `curl` is NOT — test before concluding anything is unreachable.',
  '  curl -sL --compressed -A "Mozilla/5.0" "<url>" | sed -e \'s/<[^>]*>//g\' | tr -s "\\n" | head -300',
  '  HN:      curl -sL "https://hn.algolia.com/api/v1/search?query=<q>&tags=comment&hitsPerPage=100"',
  '  Reddit:  curl -sL -A "Mozilla/5.0" "https://www.reddit.com/r/<sub>/search.json?q=<q>&restrict_sr=1&sort=top&t=year&limit=100"',
  '  GitHub:  curl -sL "https://api.github.com/search/issues?q=<q>&per_page=100"',
  '  Forums:  forum.obsidian.md, discuss.logseq.com and most docs sites respond to plain curl.',
  'Report a status code when a host refuses. Unopened is [SS], never [fetched].',
  '',
  'STYLE: NO H2 heading and NO section number — you return a RESEARCH REPORT for synthesis. Open with your sharpest finding in one sentence. Tables over prose. Evidence tags: [fetched] · [measured] · [derived] · [inference] · [SS].',
  '',
  'THE PRODUCT AND THE THING THAT MAKES THIS ROUND DIFFERENT:',
  'frontmatter is a markdown editor whose engine does BYTE-PRESERVING SPLICE EDITS — locate the exact byte range, replace only those bytes, leave every other byte bit-identical, and REFUSE rather than guess when the range cannot be located unambiguously. It also computes a cross-engine degradation certificate: how the same file renders across seven markdown engines.',
  '',
  'Why that matters for YOUR round, and it is the thread to pull on: every other editor with rich features REGENERATES the document from a parse tree or an internal model. That is why Notion exports lossy markdown, why block editors mangle files, and why round-tripping breaks. We do not regenerate. **Some editor features are impossible or unsafe for a regenerating editor and become safe for us.** Those features are the USP. Find them.',
  '',
  'The repo already has: CodeMirror 6, unified/remark/rehype, an OffsetMap with branded byte/UTF-16 offsets, 19 construct detectors, a fold normaliser, and four editor modes (edit · live · reading · split).',
  '',
  'CONSTRAINTS: two founders, small AI budget, one person on call. The record has REFUSED: arbitrary client-side code execution, plugins, project management, live multiplayer cursors, template galleries. Do not propose them.',
  '',
  'HARD CONSTRAINTS (RULE 4): read-only. No file writes, no commits, no mutating commands.',
  'EMIT EARLY: full report as your FIRST substantial message. If a hook interrupts, answer in ONE line then RE-STATE THE FULL REPORT.',
  'Your entire final message IS the report.',
].join('\n')

phase('Ground')

const GROUND = [
  ['v1-table-stakes',
   'ESTABLISH THE FLOOR. What must a markdown editor do before anyone will take it seriously, and what does ours currently do?\n\n' +
   'Survey properly, opening docs and keymaps: Obsidian, Typora, iA Writer, Bear, Ulysses, Zed, VS Code + markdown extensions, Logseq, Craft, Notion, Reflect, Marktext, Zettlr, and Vim/Emacs markdown modes. Do not describe from memory — open the keymap or the docs page and date it.\n\n' +
   'Produce THE FLOOR TABLE: | Capability | Who has it | Is it disqualifying if absent? | Cost to build on CodeMirror 6 | Do we have it today? |\n\n' +
   'Cover at minimum: keyboard shortcuts and whether a keymap is customisable · a command palette · fast fuzzy file switching · in-note and vault-wide search with replace · outline/TOC navigation · code folding · autocomplete for links, tags and emoji · table editing that does not require counting pipes · list continuation, indent/outdent, checkbox toggling · paste handling for HTML, images and URLs · drag and drop of files · find-and-replace with regex · undo granularity · split panes · a file tree · frontmatter editing · math and diagram rendering · export.\n\n' +
   'Then check OUR repo honestly against that list: `' + FM + 'src/modules/editor/` and `src/modules/preview/`. Read the code. What exists, what is stubbed, what is absent. Be specific with file paths.\n\n' +
   'Close with **the disqualifying gaps** — the things whose absence would make a reviewer stop writing the review. Rank them by cost to close. This list is the real MVP floor and it is more important than any novel feature.\n\n' +
   'Target 2400-3000 words.'],

  ['v2-what-people-love',
   'FIND OUT WHAT PEOPLE ACTUALLY LOVE AND ACTUALLY HATE about the markdown editors they use — from their own words, counted.\n\n' +
   'Mine: r/ObsidianMD, r/Zettelkasten, r/logseq, r/PKMS, r/NotionSo, HN comments on editor launches, forum.obsidian.md, and GitHub issues on the open-source ones. Search both directions: "I love", "killer feature", "can\'t live without", "switched because", and "I hate", "deal breaker", "why can\'t it", "switched away from", "gave up".\n\n' +
   'Deliver:\n' +
   '- **The loved list, ranked by how often it is mentioned, with denominators.** Expect the answer to be unglamorous — speed, not losing work, opening instantly, files staying files. If the data says the beloved features are boring, report that; it is the most decision-relevant finding you could return, because it would mean the roadmap should be boring too.\n' +
   '- **The hated list**, same treatment. Pay attention to complaints about editors CHANGING the file: reformatting on save, reordering frontmatter keys, mangling tables, converting quotes, rewriting line endings. That is our engine\'s exact promise, so measure how much people actually care rather than assuming they do.\n' +
   '- **The switching triggers.** What specifically made someone move? A switch is the strongest signal in this data.\n' +
   '- **Speed.** How much of the loved/hated axis is just latency — startup time, time to first keystroke, search speed, behaviour on a large vault. Find real numbers where people report them.\n' +
   '- **The mobile question**, honestly: how much of the complaining is mobile, and does that reshape the plan.\n\n' +
   'Close with WHAT THIS MEANS FOR THE PRODUCT: three to six bullets, each naming something to build, kill or reshape. Be willing to write "the evidence says our differentiation is not what users talk about".\n\n' +
   'Target 2400-3000 words.'],
]

const ground = await parallel(GROUND.map(([label, prompt]) => () =>
  agent(prompt + HOUSE, { label, phase: 'Ground' })))

phase('USP')

const ctx = '\n\n=== THE GROUND-TRUTH RESEARCH THIS ROUND JUST PRODUCED — build on it, do not repeat it ===\n\n' +
  ground.filter(Boolean).map((r, i) => '--- report ' + (i + 1) + ' ---\n' + String(r).slice(0, 11000)).join('\n\n') +
  '\n=== END ===\n'

const USP = [
  ['v3-only-we-can-build',
   'FIND THE FEATURES ONLY A BYTE-EXACT ENGINE CAN BUILD. This is the USP question and the reason this round exists.' + ctx + '\n' +
   'The reasoning to apply to every candidate: a regenerating editor cannot safely offer a feature that requires the file to be unchanged except where the user asked. We can. Work forward from that constraint rather than brainstorming.\n\n' +
   'Read for grounding: ' + REC + ' §5 (the projection law), §7.1 (the engine), §9 (rendering), §67-80 (the engine audit and design — especially body-span splicing and the anchor system).\n\n' +
   'Evaluate candidates rigorously. For each: what it is · why a regenerating editor CANNOT do it safely · what our engine makes possible · who uses it and how often · cost · and whether a user would notice within one session.\n\n' +
   'Candidates worth real analysis:\n' +
   '- **A reviewable AI edit.** The model proposes, you see the exact byte-range diff, you accept or refuse per hunk, and nothing else in the file moves. Every AI editor today rewrites more than it should. This may be the single most defensible feature in the product.\n' +
   '- **Refusal as an interaction.** The editor says "I cannot address this unambiguously" rather than guessing. Nobody ships this. Is it a feature or a bug in the eyes of a user? Argue both sides — it is the product\'s soul and it might be its worst demo.\n' +
   '- **The degradation certificate, live.** Show, while typing, how this file will render on GitHub versus Obsidian versus Slack. Nobody has this. Who needs it?\n' +
   '- **Byte-level time travel** — scrub through the splice journal, not through git commits.\n' +
   '- **Structural editing that provably round-trips** — reorder sections, move a block, fix a table, with a guarantee nothing else changed.\n' +
   '- **A table editor that edits the actual pipes** rather than a model of them.\n' +
   '- **Frontmatter as a real form**, given the engine addresses keys by byte range.\n' +
   '- **Two-way renders**: edit the rendered view, splice back to source, provably.\n' +
   '- **Cross-file refactors** — rename a heading and fix every wikilink, with a reviewable diff.\n' +
   '- **A trustworthy paste**: paste rich content and get markdown that survives round-trip.\n\n' +
   'Add any candidate the constraint suggests that is not listed. Then RANK, cut at least half, and name **the one feature that goes in the first demo** — the thing that makes someone say "wait, do that again".\n\n' +
   'Be honest about the ones that are technically lovely and commercially irrelevant. Target 2600-3200 words.'],

  ['v4-ai-native-editing',
   'DESIGN WHAT EDITING LOOKS LIKE WHEN AI IS NATIVE RATHER THAN BOLTED ON.' + ctx + '\n' +
   'Nearly every AI editor today is a chat sidebar next to a text area. That is AI adjacent to editing, not AI in it. Your job is to design the alternative and be specific enough to build from.\n\n' +
   'Read: ' + REC + ' §11 (the AI layer and its explicit refusals), §13 (the protocol), §9 (rendering).\n\n' +
   'Work through:\n' +
   '- **The interaction inventory.** Where can AI legitimately touch editing? Inline completion · select-and-transform · a whole-document pass · ambient suggestion · a question about the vault · generating a structure · reviewing a diff. For each: is it wanted, is it affordable given a very small AI budget, and does it survive being wrong? That last test is the important one — a feature that is annoying when wrong is worse than no feature.\n' +
   '- **The cursor question.** Inline autocomplete in prose is either magic or maddening. Find real evidence on how writers respond to it, as opposed to programmers. Recommend.\n' +
   '- **What AI should NOT touch**, and why refusing is a feature. The record already refuses the eval lane and arbitrary execution; extend that reasoning to editing.\n' +
   '- **The undo and trust model.** If AI edits bytes, what does undo mean, what does the history look like, and how does a user stay confident? This is where our engine and our AI layer meet, and it is the make-or-break interaction.\n' +
   '- **Local and cheap models.** Which interactions can run on a tiny or on-device model — a frontmatter fill is not a reasoning task. This is the direct answer to having almost no AI budget, so be concrete about which model for which interaction.\n' +
   '- **The zero-budget path.** What still works with no key and no network, and is that still a product worth opening?\n\n' +
   'Then design THE ONE AI INTERACTION that defines the product. Write it as a step-by-step flow with what the user sees at each step, including the failure and refusal paths. One interaction, designed properly, beats ten listed.\n\n' +
   'Include one mermaid diagram of that interaction. Target 2600-3200 words.'],
]

const usp = await parallel(USP.map(([label, prompt]) => () =>
  agent(prompt + HOUSE, { label, phase: 'USP' })))

return { ground: ground.filter(Boolean).length, usp: usp.filter(Boolean).length }
