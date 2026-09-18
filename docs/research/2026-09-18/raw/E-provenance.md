# Lens E: provenance and review of agent-written text

Research date: 2026-09-18. Every finding carries the URL and the date it was opened.
British spelling. Plain hyphens only. `INFERENCE:` and `UNVERIFIED:` used as the brief requires.

**One fidelity note, stated up front.** The brief forbids long dashes anywhere in this file, and
this repo forbids putting a paraphrase inside quotation marks. Where a source used U+2014, U+2013 or
a curly quote, that character has been replaced with a plain hyphen or a straight quote and nothing
else was changed. Anyone re-checking a string against the live page should normalise those characters
before matching. Eight load-bearing quotations were re-matched against their fetched source files
after normalisation and all eight matched exactly.

---

### FE1. Zed stakes "attribution down to the span" in public, and the exact claim is narrower than it sounds

- **Demand:** Zed's chief executive Nathan Sobo published a manifesto on 1 September 2026 framing Ted Nelson's
  Xanadu as the design target for DeltaDB. The exact sentence, copied from the page:
  "We're talking about attribution down to the span."
  Read in context that sentence describes **Nelson's Xanadu**, not DeltaDB's shipped behaviour;
  Sobo then writes "When I revisit Nelson's vision now, I recognize DeltaDB's design goals and the
  promise of Delta." The mechanism he does claim for DeltaDB, verbatim:
  "On screen, a file still looks like a one-dimensional string of characters but underneath,
  DeltaDB represents it as fragments with stable identities. Those identities let us create
  anchors: references to spans that can still be resolved after surrounding code changes. A line
  number can express where text appears in one snapshot, while an anchor preserves which span we
  mean across snapshots."
  And the provenance claim, verbatim:
  "By preserving the causal metadata beneath that surface representation, like which operation
  produced each fragment and what prior state it built on, DeltaDB gives the model a way to
  traverse not just the current code, but its provenance, accumulated attention, and prior
  reasoning."
  The bidirectional-lookup claim comes from the earlier DeltaDB post, verbatim:
  "From any line in a past conversation, you can jump to that code as it stands now or as it stood
  the moment the agent wrote it. From any line of code, you can find the conversation that produced
  it and every conversation that has touched it since."
- **Source:** https://zed.dev/blog/agentic-xanadu opened 2026-09-18;
  https://zed.dev/blog/introducing-deltadb opened 2026-09-18
- **Who ships it today:** Zed, in Delta, public beta since 16 September 2026, free during the beta.
- **Nobody ships:** the same thing for prose. Every sentence above is about code in a worktree.
  Nothing on any Zed page mentions markdown, documents, or prose review.
- **The problem it solves for us:** it is the strongest public statement of our own differentiation,
  made by a well-funded competitor, six weeks before we ship. It also tells us the precise shape of
  the claim to rebut: DeltaDB's anchor is **a reference that survives edits**, not **a label saying
  a machine wrote these bytes**. Those are different features that look identical in a blog post.
- **Fit:** the honest read is that Zed solved the harder half (a span identity that survives
  rewriting) and never claimed the half we care about (this span is machine-written and unreviewed).
- **Effort:** n/a, this is a competitive finding.
- **Verdict:** must-read. Card E35's rebuttal should quote the anchor paragraph, not the Xanadu
  sentence, because the Xanadu sentence is about Nelson and we would be attacking a straw man.

### FE2. Zed's CRDT claim, exactly as made, and why it does not actually refute our settled position

- **Demand:** the settled frontmatter position is that sync is git-merge plus a splice journal plus
  content-addressed storage, never a CRDT. Zed's public claim, verbatim from the Xanadu post:
  "Convergence without coordination. CRDTs, formalized in 2011, and the center of Zed's own work for
  the past decade. A Delta worktree can be edited by several people and agents on different
  continents at once."
  And from the DeltaDB post, verbatim:
  "Because DeltaDB embeds conflict-free replicated worktrees, many people and agents can edit the
  same files at once across different machines. The files are real: agents work in them through a
  terminal, and you can mount the whole worktree to disk whenever you want your own tools on it."
  And from the public beta post, verbatim:
  "Delta is built on DeltaDB, which extends Git's content-based versioning with incremental versions
  based on deltas. It records edits between commits alongside messages from humans and agents,
  preserving how the code evolved throughout a thread. A commit remains the checkpoint you push,
  pull, and build from. DeltaDB retains the work between those checkpoints."
- **Source:** https://zed.dev/blog/agentic-xanadu opened 2026-09-18;
  https://zed.dev/blog/introducing-deltadb opened 2026-09-18;
  https://zed.dev/blog/delta-public-beta opened 2026-09-18
- **Who ships it today:** Zed Delta. Public beta from 16 September 2026, macOS, Linux, Windows, web
  and a mobile browser view. Free during the beta; the page says paid plans for individuals and
  teams are coming and that there will always be a free version.
- **Nobody ships:** a CRDT that is the file on disk. Note what Zed actually did: the CRDT lives in
  the database, the worktree is **mounted** to disk as real files, and git remains the checkpoint.
- **The problem it solves for us:** INFERENCE: Zed did not contradict our position, it partitioned
  it. Their CRDT governs the live multiplayer session; git governs the durable artefact; the file on
  disk is a projection. That is structurally the same split frontmatter makes, with a CRDT where we
  put a splice journal. The real disagreement is narrow and worth stating narrowly: whether the
  live-session layer needs conflict-free convergence or an accept-or-reject queue. We chose the
  queue because a converged merge of two agent edits is byte-identical garbage that nobody approved.
  Zed chose convergence because their live session has humans in it who are watching.
- **Fit:** a written rebuttal that names Zed should concede the anchor mechanism, concede that a
  CRDT behind a mounted worktree is not the same as a CRDT as the file format, and then hold the
  line only on the queue versus convergence question. Anything wider is refutable by quoting them.
- **Effort:** small. It is a page of prose, not code.
- **Verdict:** must-have, as a document. The settled position survives but the current one-line
  phrasing does not, because it attacks a claim Zed did not make.

### FE3. Zed turned pull requests off on their own repository, with a measured number

- **Demand:** verbatim from the public beta post, 16 September 2026:
  "Last week, we crossed a key milestone: we disabled pull requests on Delta's own repository. We
  now build and collaborate on Delta entirely within Delta."
  And the number, verbatim:
  "But it's already our daily driver: 33 of us have landed 570 changes to main since we turned off
  pull requests."
  And the framing, verbatim:
  "Since GitHub introduced pull requests over 15 years ago, they've become the standard way to ask
  teammates to review changes to your codebase. But with agents generating so much code, the diffs
  we're asking each other to review have mushroomed."
- **Source:** https://zed.dev/blog/delta-public-beta opened 2026-09-18
- **Who ships it today:** Zed only. Price: free during public beta, paid plans unannounced.
- **Nobody ships:** the same dogfooding claim. It is the strongest available evidence that
  review-in-the-thread is workable and not a demo.
- **The problem it solves for us:** it is a receipt for the premise under our change queue, from an
  independent party: that agent-sized diffs have broken the review unit, and that the fix is to move
  review next to the work rather than to a snapshot. 570 changes by 33 people is a real number on a
  real page, which is rare in this space.
- **Fit:** direct. Their review subthread is our change queue with a conversation attached.
- **Effort:** n/a, competitive evidence.
- **Verdict:** must-have as evidence. The number belongs in the plan wherever we justify the queue.

### FE4. Nobody, including Zed, has shipped span attribution for prose or markdown

- **Demand:** across four Zed posts covering DeltaDB and Delta (11 June, 12 August, 1 September and
  16 September 2026), the words markdown, prose, document review and writing do not appear as a use
  case. Every example is code: "a line of the diff, a step in the plan, a thinking block",
  "any line of code in the worktree, whether an agent touched it yesterday or a human wrote it three
  years ago", "why you chose a Mutex instead of an RwLock".
- **Source:** https://zed.dev/blog/introducing-delta opened 2026-09-18;
  https://zed.dev/blog/delta-public-beta opened 2026-09-18
- **Who ships it today:** for code, Zed. For prose, nobody found in this lens.
- **Nobody ships:** a document editor where you can ask which paragraphs the agent wrote and which
  you did, and review them one at a time.
- **The problem it solves for us:** it is the gap the whole product sits in. The competitor closest
  to our idea aimed it at a different artefact.
- **Fit:** exact.
- **Effort:** n/a.
- **Verdict:** must-have. This is the differentiation, and it survives contact with Zed.

### FE5. There IS a standard for marking which characters a machine wrote, and almost nobody knows it: C2PA 2.3 textual ranges

- **Demand:** the brief asked whether any standard at all exists. The answer is yes, and it is more
  specific than expected. C2PA Technical Specification 2.3 defines five range types for a region of
  interest. Verbatim from section 18.2.2.1:
  "All ranges consist of a type field whose value is either "spatial", "temporal", "frame",
  "textual" or "identified"."
  Verbatim from section 18.2.1:
  "In some use cases, a given assertion, such as an actions assertion, may only be relevant to a
  specific portion of an asset as opposed to the entire asset. In those cases, it is necessary to
  have a way to describe that region - whether it be temporal, spatial, textual or a combination of
  them. A region definition serves that purpose."
  Verbatim from section 18.2.2.5, Textual:
  "A text object defines a range using a one or more URL fragment identifiers, as defined by the W3C
  Web Annotation fragment selector. It may also refine the range using offsets to the starting and
  ending characters (inclusive). If no start is provided, the range shall start at the beginning of
  the fragment. If no end is provided, the range shall end at the end of the fragment. If neither is
  provided, the range shall represent the entire fragment."
  The schema, written in the Concise Data Definition Language (CDDL), verbatim:
  `text-map = { "selectors": [1* $text-selector-range-map] ; array of (possibly discontinuous) ranges of text }`
  and
  `text-selector-range-map = { "selector": $text-selector-map, ; start (or only) text selector ? "end": $text-selector-map ; if present, represents the end of the text range }`
  The AI-origin vocabulary already exists too. Verbatim from section on actions:
  "EXAMPLE: A generative AI model generates a video in response to a text prompt. The resulting video
  asset's active manifest would have a c2pa.actions assertion starting with a c2pa.created action,
  itself having a value of
  http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia in the corresponding
  digitalSourceType field."
- **Source:** https://spec.c2pa.org/specifications/specifications/2.3/specs/C2PA_Specification.html
  opened 2026-09-18
- **Who ships it today:** C2PA is backed by Adobe, Microsoft, the British Broadcasting Corporation, Google and others; Content
  Credentials ships in Adobe products, on LinkedIn images and in some cameras. For **text** we found
  no shipping implementation in this lens.
- **Nobody ships:** the textual-range plus AI-source-type combination in a text editor. The pieces
  are all specified. Nobody has assembled them for markdown.
- **The problem it solves for us:** the honest answer to question 1 is not "no standard exists". It
  is "a standard exists, it is unimplemented for text, and its own text mechanism is unusable for
  us" (see FE6). That is a stronger and more defensible position than claiming a vacuum, and it is
  also the position that will not be embarrassed by an investor who has heard of C2PA.
- **Fit:** the `regionOfInterest` textual range with character offsets is close to our span model.
  We could emit it as an export, from the version record, without ever touching the file bytes.
- **Effort:** medium to emit a valid signed manifest (certificates, the JUMBF box format, and CBOR binary encoding); small to emit the
  region JSON alone as an unsigned sidecar shape.
- **Verdict:** good-to-have, later. The value now is rhetorical: we can say the standard exists,
  point at the clause, and explain why we do not put it in the file.

### FE6. C2PA's own way of putting provenance in a text file is invisible Unicode, and it is disqualifying for us

- **Demand:** C2PA 2.3 added text embedding in December 2025. The changelog entry, verbatim:
  "Added comprehensive support for embedding C2PA manifests in unstructured text files."
  The mechanism, verbatim from Appendix A.7.1:
  "For unstructured text where traditional file-based embedding is not practical, such as content
  intended for copy-paste operations across different systems, C2PA Manifests may be embedded
  directly into a Unicode-encoded text stream. This method uses a sequence of Unicode Variation
  Selectors to encode a C2PA Manifest Store in a way that is not visually rendered, ensuring that
  Content Credentials persist with the content itself across platforms."
  And A.7.2:
  "Unicode variation selectors (U+FE00-U+FE0F and U+E0100-U+E01EF) are used because they are
  specifically designed to be visually non-rendering while remaining part of the valid Unicode
  character set."
  The placement rules, verbatim from A.7.4.1:
  "The wrapper shall be prefixed with a single Zero-Width No-Break Space (U+FEFF) character to ensure
  forward compatibility with future Unicode standards."
  "The wrapper should be placed at the end of the visible text content to simplify parsing and
  exclusion."
- **Source:** https://spec.c2pa.org/specifications/specifications/2.3/specs/C2PA_Specification.html
  Appendix A.7, opened 2026-09-18
- **Who ships it today:** it is in the published specification. We found no editor that writes it.
- **Nobody ships:** a provenance carrier for markdown that a human can see and a diff can show.
- **The problem it solves for us:** it is a clean, quotable reason to reject in-file provenance. One
  byte of invisible Unicode appended to every document breaks byte-exactness, breaks the corpus gate,
  survives copy-paste into places the author never intended, and is indistinguishable from the
  invisible-character tricks used to smuggle prompt injections. It is also exactly the class of thing
  the founder's own slop gate blocks on sight.
- **Fit:** it is the anti-pattern. Our carrier decision (callout for prose, fence for data) already
  went the other way, and this is the evidence that the other way exists and is worse.
- **Effort:** n/a, this is a decision input.
- **Verdict:** skip the mechanism, keep the quote. UNVERIFIED: whether any tool writes C2PA text
  manifests in the wild. We found the clause, not an implementation.

### FE7. Git has no span-level AI attribution and nobody has proposed one; the whole fight is over one commit trailer

- **Demand:** the entire industry conversation about machine authorship in git is happening at the
  granularity of a **commit message line**, not a byte range. Three positions, all opened:
  1. The Apache Software Foundation, verbatim from its Generative Tooling Guidance:
     "When providing contributions authored using generative AI tooling, a recommended practice is
     for contributors to indicate the tooling used to create the contribution. This should be
     included as a token in the source control commit message, for example including the phrase
     "Generated-by: ". This allows for future release tooling to be considered that pulls this
     content into a machine parsable Tooling-Provenance file."
     The same page dates itself, verbatim: "while the above seems like a reasonable set of
     guidelines in August 2026, this is a rapidly evolving area."
  2. An open pull request on apache/jmeter, #6760, "docs: require an `Assisted-by:` commit trailer
     for AI-assisted work", state **Open** when read. Its evidence, verbatim:
     "Sixteen commits since March 2026 name a tool in a trailer, in two capitalizations of the key
     and four spellings of the model" and
     "Fifteen of those use Co-authored-by:, and in this same history that trailer also carries nine
     human names. One field is doing two different jobs, and nothing in the message distinguishes
     them: git and GitHub read every name there as an author of the commit, so a tool listed there
     makes a claim about authorship rather than a note about tooling."
     It quotes Mesa's rule verbatim: "Do not use the Co-authored-by tag as this one is reserved for
     human co-authors." It records that Kubernetes takes the other side, verbatim:
     "Kubernetes forbids AI trailers outright - Co-authored-by:, Assisted-by: and Co-developed-by:
     alike - and asks for a sentence in the pull request description instead, on the grounds that an
     AI cannot sign a CLA."
  3. The measured baseline, from a paper I verified independently rather than trusting the PR's
     citation. Verbatim from the arXiv abstract: "We analyzed 1,000 popular GitHub repositories and
     identified 118 AI policies for contributors. Our results show that (1) 78% of the AI policies
     allow AI-assisted contributions, while 22% explicitly discourage AI use. (2) 51% of the AI
     policies require the disclosure of AI-assisted contributions; and (3) 74% of the AI policies
     require a human in the loop during contribution."
- **Source:** https://www.apache.org/legal/generative-tooling.html opened 2026-09-18;
  https://github.com/apache/jmeter/pull/6760 opened 2026-09-18;
  http://export.arxiv.org/api/query?id_list=2605.16706 opened 2026-09-18 (paper
  "AI Policy, Disclosure, and Human in the Loop: How Are Contribution Guidelines Adapting to
  GenAI?", published 2026-05-15)
- **Who ships it today:** Claude Code writes `Co-Authored-By:` by default; the JMeter PR records that
  OpenAI Codex does the same with its own address, and that "VS Code 1.118 shipped Copilot as a
  commit co-author by default before reversing it". Free, all of them.
- **Nobody ships:** anything below commit granularity. There is no `Assisted-by` for a paragraph. A
  trailer says a machine touched this commit; it cannot say which of the 400 changed lines.
- **The problem it solves for us:** this is the direct answer to question 1 for the git world, and it
  is a strong finding on its own. The industry wants disclosure (51% of policies that exist require
  it), has standardised nothing below the commit, and is currently arguing about the **spelling of a
  single key**. Meanwhile 88% of the 1,000 repositories surveyed had no AI policy at all
  (1000 minus 118 = 882, my arithmetic from the paper's own numbers).
- **Fit:** a document editor with a per-span version record can answer a question git cannot answer
  at any granularity, and can export the commit trailer as a by-product.
- **Effort:** small to emit a trailer on our GitHub push. We already push commits.
- **Verdict:** good-to-have for the trailer itself. The finding that matters is the vacuum below it.

### FE8. Answer to question 1, stated plainly

There is no standard for marking which bytes of a **text file** a machine wrote that is both
specified and implemented.

- Specified but unimplemented for text: C2PA 2.3 `regionOfInterest` with a `textual` range and
  character offsets (FE5), whose only in-file carrier is invisible Unicode variation selectors (FE6).
- Implemented but far too coarse: the git commit trailer, in at least four competing spellings, with
  no agreement on which key means what (FE7).
- Proprietary and code-only: DeltaDB anchors, which identify a span across edits but are not a claim
  about who wrote it (FE1).

INFERENCE: the reason no standard exists is that the two candidate homes are both bad. In the file
means invisible bytes or visible clutter, and the file is the thing users copy, paste and diff. Out
of the file means a sidecar that goes stale the moment someone edits with another tool. Frontmatter's
version record is the third answer, and the honest framing is that it works because we control the
editor, not because we solved provenance in general.

### FE9. AI code review is a crowded, priced market, and one of them already reviews prose

- **Demand:** six products, all with public price pages, all selling review of agent-written diffs.
  Prices copied from the pages on 2026-09-18:
  - **CodeRabbit**: Essentials $24 per developer per month billed annually, Team $48, Advanced $72,
    Enterprise custom. Verbatim from the FAQ: "Essentials retains the current Pro price of $30 per
    developer per month, or $24 per developer per month when billed annually." Agent add-on,
    verbatim: "CodeRabbit Agent costs $0.40 per agent minute for cloud coding tasks, Slack, and
    automations." Free forever for public repositories.
  - **Greptile**: verbatim, "Starter is free for one active developer and includes unlimited
    repositories and 50 credits per month. Pro is $30 per seat per month and includes 50 credits per
    seat. One standard review uses 1 credit, one TREX review uses 3 credits, and additional credits
    are $1 each." Verbatim: "Greptile is free for qualified non-commercial projects with MIT or
    Apache licenses."
  - **Graphite**: Hobby free, Starter $20 per user per month billed annually.
  - **cubic**: Team $40 per developer per month billed monthly with "40,000 reviewed lines of code
    per developer"; Pro $99 with "80,000 reviewed lines of code per developer". cubic also sells
    "5 private wikis" on Team and "20 private wikis" on Pro.
  - **Ellipsis**: verbatim, "For individuals FREE with a Claude Code or Codex subscription"; for
    organisations "Tokens + 10%", "No per-seat fees or idle charges", CPU "$0.142 / vCPU-hour",
    memory "$0.024 / GB-hour".
  - **Qodo**: no permanent free tier. Verbatim: "We don't offer a permanent free tier. After your
    trial, pick a paid plan to keep reviewing." Tiers are described in reviews per month, listed on
    the page as "~18 Reviews/Mo", "~36 Reviews/Mo", "~144 Reviews/Mo".
- **Source:** https://www.coderabbit.ai/pricing, https://www.greptile.com/pricing,
  https://graphite.com/pricing, https://www.cubic.dev/pricing, https://www.ellipsis.dev/pricing,
  https://www.qodo.ai/pricing/ all opened 2026-09-18
- **Who ships it today:** all six, for code.
- **Nobody ships:** review of a document as a document. But CodeRabbit is closer than expected, see
  FE10.
- **The problem it solves for us:** it establishes the price of reviewing machine output. Somewhere
  between $20 and $99 per person per month, and the market is full. That is the number a document
  reviewer is competing with in a buyer's head.
- **Fit:** none of these touch a markdown file outside a git repository.
- **Effort:** n/a.
- **Verdict:** good-to-have as a pricing anchor. The absence of a document equivalent is the finding.

### FE10. CodeRabbit already reviews markdown prose, and has done since 2024. We are not first

- **Demand:** the claim is not marketing, it is in their own changelog with dates. Verbatim, dated
  **August 24, 2026**:
  "CodeRabbit now runs Vale on changed .md, .markdown, and .txt files, checking prose against your
  team's own checked-in editorial style rules - terminology, voice, and phrasing - and reporting
  violations as review findings, the same way a linter catches code issues. Vale is enabled by
  default when your repository has a supported root configuration. Teams can disable it with
  reviews.tools.vale.enabled: false in .coderabbit.yaml."
  And, verbatim, dated **March 2, 2024**, entry titled "Enhanced Markdown Review":
  "CodeRabbit now offers a more comprehensive review of the markdown changes. In addition to the AI
  suggestions, we do a thorough check for spelling, grammar, word choice, language style, as well as
  improvements in paraphrasing and punctuation."
  They also run linters on prose. Verbatim: "Currently, CodeRabbit runs markdownlint, shellcheck,
  ruff, and languagetool."
  And a documentation-aware command, verbatim: "Comment @coderabbitai generate project vocabulary on
  a pull request to receive an alphabetized Markdown list of up to 50 terms specific to that
  repository."
- **Source:** https://docs.coderabbit.ai/changelog opened 2026-09-18
- **Who ships it today:** CodeRabbit, from $24 per developer per month, free on public repositories.
- **Nobody ships:** prose review **outside a pull request**. Every one of these findings lands as a
  comment on a diff in a git host. A writer with a markdown file and an agent has no equivalent.
- **The problem it solves for us:** this is the uncomfortable one, and the brief asked me to be
  willing to say we are wrong. "Nobody reviews AI-written prose" is **false** as stated. What is
  true is narrower: nobody reviews AI-written prose **for someone who is not doing a pull request**.
  The gap is the workflow, not the capability.
- **Fit:** it changes the pitch. Our claim should be about the **place** review happens (in the
  document, before a commit exists) rather than about the **existence** of prose review.
- **Effort:** n/a.
- **Verdict:** must-read. A positioning correction, not a feature.

### FE11. The review burden is measured, and Google's own engineers describe it in their own words

- **Demand:** DORA published a qualitative study on 10 March 2026 based on, verbatim,
  "a thematic deep dive into 1,110 open-ended survey responses from Google software engineers in
  Q3 2025". The framing sentence, verbatim:
  "While AI successfully accelerates initial code generation and reduces the friction of starting new
  tasks, the time saved in creation is frequently re-allocated to auditing and verification."
  On who pays that cost, verbatim:
  "This dynamic is creating a shifting burden within engineering teams, specifically during the code
  review process. Velocity gains for an individual author frequently translate into a significantly
  increased cognitive load for the reviewer. While an author can use AI to quickly generate a massive
  changelist (CL) or pull request (PR), the reviewer is still expected to manually audit every single
  line for correctness and style."
  Two engineer quotes, both verbatim from the page:
  "Reviewing [another's] code is so much harder than writing it. AI tools are increasing the rate at
  which people can churn out code that needs to be reviewed…"
  "I feel somewhat more productive, but it's at a cost. While I end up spending less time writing
  code, I spend more time babysitting the AI and reviewing what it is trying to do."
  The trust number, verbatim: "the 2025 DORA report highlights a critical vulnerability, noting that
  30% of developers currently report little to no trust in the code generated by AI."
  And the outcome measure, verbatim: "higher AI adoption is associated with an increase in both
  software delivery throughput and software delivery instability."
  **Writing documentation is one of the ten use cases in their table**, with "50+ comments", and it
  carries both negative themes that every use case carries: "Verification overhead" and
  "Hallucinations". The page also says, verbatim: "The drive for rapid output risks introducing subtle
  bugs, technical debt, and hollow documentation" and "the combination of mediocre code and generic
  documentation risks lowering codebase quality, effectively polluting the ecosystem."
- **Source:** https://dora.dev/insights/balancing-ai-tensions/ opened 2026-09-18
- **Who ships it today:** nobody sells a fix for the document half. The code half is FE9's six
  vendors.
- **Nobody ships:** a tool that reduces the reviewer's load on a **document**. DORA names hollow
  documentation as a cost and offers no remedy.
- **The problem it solves for us:** this is the strongest receipt in the lens for the change queue.
  The burden is not "AI writes bad text", it is "AI writes plausible text faster than a person can
  audit it, and the audit lands on someone other than the author". Our queue moves the audit back to
  the author, one change at a time, before anyone else has to read it.
- **Fit:** direct. A queue is the product form of "manually audit every single line" made cheap.
- **Effort:** already in the plan.
- **Verdict:** must-have evidence. Quote the reviewer-load paragraph wherever we justify the queue.

### FE12. Trust in AI output is falling while use rises, with two different numbers from the same source

- **Demand:** Stack Overflow's 2025 developer survey, read on its own site. Verbatim from the AI
  section:
  "More developers actively distrust the accuracy of AI tools (46%) than trust it (33%), and only a
  fraction (3%) report "highly trusting" the output. Experienced developers are the most cautious,
  with the lowest "highly trust" rate (2.6%) and the highest "highly distrust" rate (20%), indicating
  a widespread need for human verification for those in roles with accountability."
  Verbatim on frustration:
  "The biggest single frustration, cited by 66% of developers, is dealing with "AI solutions that are
  almost right, but not quite," which often leads to the second-biggest frustration: "Debugging
  AI-generated code is more time-consuming" (45%)"
  Verbatim on what people still want a human for:
  "In a future with advanced AI, the #1 reason developers would still ask a person for help is "When
  I don't trust AI's answers" (75%)."
  Stack Overflow's own blog, 18 February 2026, gives a different trust figure, verbatim:
  "Developers' use of AI rose, with more than 84% of respondents using or planning to use AI tools in
  2025. But their trust in those tools dropped sharply: Only 29% of 2025 respondents said they trust
  AI, down 11 percentage points from 2024."
  And verbatim: "In 2023, roughly 70% of developers reported using or planning to use AI tools. Trust
  levels hovered around 40%: not great, but understandable for a new category of tech. In 2025, we
  saw usage rise to 84% even as trust dropped to 29%".
- **Source:** https://survey.stackoverflow.co/2025/ai opened 2026-09-18;
  https://stackoverflow.blog/2026/02/18/closing-the-developer-ai-trust-gap/ opened 2026-09-18
- **Who ships it today:** n/a, this is survey data.
- **Nobody ships:** n/a.
- **The problem it solves for us:** "almost right, but not quite" at 66% is the single best one-line
  statement of what the change queue is for. Almost-right is exactly the output that a silent merge
  accepts and a per-change accept-or-reject catches.
- **Fit:** it is a headline, not a feature.
- **Effort:** n/a.
- **Verdict:** must-have as a quotation. **Caveat, stated because the brief demands it:** Stack
  Overflow publishes 33% trust on the survey page and 29% on its own blog for what appears to be the
  same year. I did not find the reconciliation. Use the survey page's 46% distrust versus 33% trust,
  cite the page, and do not use the 29% as if it were the same measure.

### FE13. "The cost to create outran the cost to review" is GitHub's own headline, with the volume number

- **Demand:** GitHub published this on 18 June 2026, under a section heading copied verbatim,
  "The cost to create outran the cost to review". The opening, verbatim:
  "More people are contributing to open source than ever, most of them trying to help. The challenge
  is keeping up with the volume. Creating a pull request has never been easier. Reviewing one still
  takes a human about as long as it ever did. When great contributions and low-quality noise land in
  the same queue, the ones that deserve attention are harder to find."
  The number, verbatim: "In January 2023, developers merged about 25 million pull requests a month
  across GitHub. Today that number tops 90 million", which the page calls a roughly 3.6x increase.
  Three named maintainers on the page, all verbatim:
  Nicholas Tindle, AutoGPT: "It's helped us want to review pull requests again. Knowing that someone
  hasn't just opened 5-10 pull requests that are slop makes it much easier to want to look."
  Mike McQuaid, Homebrew: "We've had problems on Homebrew for a while with enthusiastic users
  submitting many pull requests that need near identical review. AI further accelerated it."
  Vincent Koc, OpenClaw: "At OpenClaw we get a huge volume of pull requests from the community and
  had to build our own bots for fighting spam."
  The mechanism, verbatim: "A pull request limit sets the maximum number of pull requests a user
  without write access can have open at once in your repository." And, verbatim: "Pull requests
  opened by Copilot or another AI agent will counts toward your limit." (typo theirs)
  The roadmap includes, verbatim: "Archiving pull requests (shipping soon): Repository admins will be
  able to archive pull requests, hiding low-quality or spammy pull requests out of the main pull
  request view."
  GitHub also links its own February framing, verbatim: "In February, we wrote that open source was
  hitting its own Eternal September."
- **Source:** https://github.blog/open-source/maintainers/how-pull-request-limits-are-cutting-down-the-noise/
  opened 2026-09-18
- **Who ships it today:** GitHub, free, in repository settings.
- **Nobody ships:** a rate limit on how much an agent can change **inside one document** before a
  person looks. GitHub's answer to volume is to cap the number of submissions, not to make each one
  cheaper to review.
- **The problem it solves for us:** the largest code host in the world publicly stated that review
  cost is now the binding constraint, and its first shipped remedy is a quota. A quota is a blunt
  instrument; the change queue is the sharp one. This is the receipt for the premise.
- **Fit:** an accept-or-reject queue per change is the per-item version of what GitHub built per
  contributor.
- **Effort:** already in the plan.
- **Verdict:** must-have as evidence.

### FE14. curl's AI policy, opened and read in full, and it is about disclosure and tone, not a ban

- **Demand:** the brief asked me to curl any policy pages, so here is curl's own, read from the raw
  file rather than the rendered page. The section is headed "On AI use in curl". Verbatim:
  "If you asked an AI tool to find problems in curl, you **must** make sure to reveal this fact in
  your report."
  Verbatim: "AI-based tools frequently generate inaccurate or fabricated results."
  Verbatim: "Further: it is *rarely* a good idea to copy and paste an AI generated report to the
  project. Those generated reports typically are too wordy and rarely to the point (in addition to
  the common fabricated details)."
  Verbatim: "Fake and otherwise made up security problems effectively prevent us from doing real
  project work and make us waste time and resources."
  Verbatim: "We ban users immediately who submit made up fake reports to the project."
  On pull requests, verbatim: "A basic rule of thumb is that if someone can spot that the
  contribution was made with the help of AI, you have more work to do."
  And, crucially, verbatim: "We can accept code written with the help of AI into the project, but the
  code must still follow coding standards, be written clearly, be documented, feature test cases and
  adhere to all the normal requirements we have."
  On translation, verbatim: "As AI-based translation tools sometimes have a way to make the output
  sound a little robotic and add an "AI tone" to the text, you may want to consider mentioning that
  you used such a tool. Failing to do so risks that maintainers wrongly dismiss translated texts as
  AI slop."
- **Source:** https://raw.githubusercontent.com/curl/curl/master/docs/CONTRIBUTE.md opened 2026-09-18
- **Who ships it today:** curl, as a written policy in the repository.
- **Nobody ships:** a tool that helps a contributor meet the curl bar. The policy asks for two things
  no tool provides: disclose that AI was used, and make the output not look like AI output.
- **The problem it solves for us:** the most-cited AI-hostile project in open source is **not**
  banning AI. It is asking for disclosure plus a human pass. That is precisely the pair of things a
  document editor with a change queue and a version record can produce as a by-product. It also
  validates the founder's own slop gate as a product feature rather than a personal habit: curl's
  own rule is that a spottable contribution means more work to do.
- **Fit:** strong. "Disclose, then make it not read like a machine" is two features: the version
  record and a de-slop pass.
- **Effort:** small for disclosure export, medium for a genuinely good prose pass.
- **Verdict:** good-to-have. INFERENCE: the second half is the more valuable one and the harder to
  copy.

### FE15. Google Docs already ships a per-change accept-or-reject for AI edits. Our change queue is not novel

- **Demand:** this is the finding the brief asked me to be willing to deliver. Verbatim from Google's
  own help page, "Write & edit with Gemini in Docs":
  "Gemini will show suggestions directly in your document."
  "To apply changes individually, click Accept suggestion ."
  "To apply all changes, click Accept all."
  "To reject all changes, click Reject all."
  The same accept-one-at-a-time flow exists for the one-click refine path, verbatim:
  "Review the suggested changes. To apply changes individually, click Accept suggestion . To apply
  the changes, click Accept all. To reject the changes, click Reject all."
  The human equivalent has existed for years. Verbatim from "Suggest edits in Google Docs":
  "Accept suggestions one by one" and "Click Tools Review suggested edits" with "Accept all or
  Reject all", plus a preview, verbatim: "To preview what your document will look like with or
  without the changes, click the Down arrow and choose an option."
  And interoperability, verbatim: "Any tracked changes in Microsoft Office become suggestions in
  Google Docs editors. Any suggestions in Google Docs editors become tracked changes in Microsoft
  Office."
- **Source:** https://support.google.com/docs/answer/13951448?hl=en opened 2026-09-18;
  https://support.google.com/docs/answer/6033474?hl=en opened 2026-09-18
- **Who ships it today:** Google, inside a Workspace or Google AI plan. Verbatim on gating: "This
  feature requires an eligible Google Workspace or Google AI plan."
- **Nobody ships:** a record that survives the accept. Once a Gemini suggestion is accepted, the text
  is ordinary document text. There is no persistent mark saying a machine wrote that sentence, and
  the version history attributes the change to the human who accepted it. UNVERIFIED: I did not drive
  a live Google Doc to confirm the post-accept state; this is read from the documentation, which
  describes no persistent mark.
- **The problem it solves for us:** it means "accept or reject every AI change, one by one" is a
  **table-stakes feature, not a differentiator.** Saying it as our headline invites the reply "Google
  Docs does that". The defensible claims are narrower and they are all about durability and place:
  the change queue applies to changes an **external agent** made to the file while the editor was
  closed, not only to changes the built-in assistant proposes in-session; the decision is recorded in
  a version record that outlives the accept; and it works over a markdown file that other tools own.
- **Fit:** the plan does not change. The **pitch** changes.
- **Effort:** n/a.
- **Verdict:** must-read. A correction to how we describe ourselves, and the most useful thing in
  this lens after FE4.

### FE16. The bypass: Google's own side panel inserts AI text with no review step at all

- **Demand:** the same product has two doors and only one of them has a queue. Verbatim from
  "Collaborate with Gemini in Google Docs", in the table of actions:
  "Insert | Insert generated text into your document."
  "Insert image | Insert a generated image into your document."
  And, verbatim: "Clear history | Remove all generated text and images you didn't insert into the
  document yet."
  There is no accept step on that path. The side panel writes the text in.
- **Source:** https://support.google.com/docs/answer/14206696?hl=en opened 2026-09-18
- **Who ships it today:** Google, same plans as FE15.
- **Nobody ships:** a guarantee. The reviewable path and the unreviewable path sit in the same
  product, and the unreviewable one is the faster one.
- **The problem it solves for us:** INFERENCE, and I am flagging it as inference because it is a
  design judgement rather than a claim on the page: a review queue that can be bypassed is a
  convenience, not a property of the document. Ours is a property, because it derives from the bytes
  on disk rather than from a UI mode the user is in. That is the difference worth saying out loud,
  and it is the difference the projection law already buys us.
- **Fit:** exact. This is what "no silent merge, ever" should be pointed at.
- **Effort:** n/a.
- **Verdict:** must-have as the framing for the queue.

### FE17. Nobody calls it "what the agent changed while I was away", and the closest shipped things are for code

- **Demand:** I looked for a named feature and did not find one. What exists:
  - **GitHub mission control**, shipped 1 December 2025. Verbatim: "you can now assign tasks to
    Copilot across repos, pick a custom agent, watch real-time session logs, steer mid-run (pause,
    refine, or restart), and jump straight into the resulting pull requests". The away case is
    described but unnamed, verbatim: "You have two choices: watch your agents work so you can
    intervene if needed, or step away and come back when they're done." Their list of warning signs
    includes, verbatim: "Scope creep beyond what you requested: The agent starts refactoring adjacent
    code or "improving" things you didn't ask for."
  - **Cursor cloud agents.** Verbatim: "Cloud agents run in remote sandboxes, which means you can
    close your laptop and check results later." The review step is a pull request. Verbatim from the
    same page: "Agents can produce many code changes at once. This can result in one large commit
    with hundreds of changed lines. That's hard for anyone to review." And their statement of the
    problem, verbatim: "AI-generated code can look correct but be subtly wrong. It might follow
    existing patterns, compile, and pass tests you wrote, but still miss edge cases, have security
    issues, or duplicate logic that exists somewhere else in your codebase."
  - **Google Docs**, for humans only, and it is a dot rather than a view. Verbatim from the help
    page: "Tip: If there is a blue dot on the Last edit icon, that means someone updated the file
    since you last viewed it."
  - **Zed Delta review subthreads** (FE3), which is the closest in spirit and is code-only.
- **Source:** https://github.blog/ai-and-ml/github-copilot/how-to-orchestrate-agents-using-mission-control/
  opened 2026-09-18; https://cursor.com/docs/agent/review opened 2026-09-18;
  https://support.google.com/docs/answer/190843?hl=en opened 2026-09-18
- **Who ships it today:** for code, GitHub and Cursor, both bundled into existing paid plans. For
  documents, nobody.
- **Nobody ships:** a document view that answers "I left, an agent worked, what is different now".
  Google Docs gives a dot and a version history keyed to people. GitHub gives a pull request.
- **The problem it solves for us:** it is a real, unnamed, unfilled gap, and the naming is available.
  The plan already has the machinery: the file on disk is the truth, so a diff against the last state
  the person saw is computable without any cooperation from whatever tool made the change.
- **Fit:** excellent, and it falls out of the projection law almost free. The hard part is storing
  "the last state this person saw", which is a per-reader marker, not a per-span one, so it does not
  reopen the read-state design that was dropped in September.
- **Effort:** small to medium. One stored hash or snapshot per document per reader, plus a diff view
  that already has to exist for the change queue.
- **Verdict:** good-to-have, and the one with the biggest payoff for the work in this lens. It is the single
  feature that turns the change queue from a mode into a reason to open the app in the morning.

### FE18. Ghostty's policy asks for "the extent that the work was AI-assisted", and nothing in the world measures that

- **Demand:** Ghostty ships a separate `AI_POLICY.md` in the repository root. Verbatim, the first
  rule:
  "**All AI usage in any form must be disclosed.** You must state the tool you used (e.g. Claude
  Code, Cursor, Amp) along with the extent that the work was AI-assisted."
  Verbatim, the second:
  "**The human-in-the-loop must fully understand all code.** If you can't explain what your changes
  do and how they interact with the greater system without the aid of AI tools, do not contribute to
  this project."
  Verbatim, on issues and discussions:
  "any content generated with AI must have been reviewed _and edited_ by a human before submission.
  AI is very good at being overly verbose and including noise that distracts from the main point.
  Humans must do their research and trim this down."
  Verbatim, on why:
  "It is rude and disrespectful to approach this boundary with low-effort, unqualified work, since it
  puts the burden of validation on the maintainer."
  Verbatim, on the position being misread:
  "**Our reason for the strict AI policy is not due to an anti-AI stance**, but instead due to the
  number of highly unqualified people using AI. It's the people, not the tools, that are the
  problem."
  And a public sanction, verbatim: "**Bad AI drivers will be denounced** People who produce bad
  contributions that are clearly AI (slop) will be added to our public denouncement list. This list
  will block all future contributions."
  The main `CONTRIBUTING.md` carries a vouch gate, verbatim: "If you aren't vouched, any pull
  requests you open will be automatically closed. This system exists because open source works on a
  system of trust, and AI has unfortunately made it so we can no longer trust-by-default because it
  makes it too trivial to generate plausible-looking but actually low-quality contributions."
  And, verbatim: "Write in your own voice, don't have an AI write this".
- **Source:** https://raw.githubusercontent.com/ghostty-org/ghostty/main/AI_POLICY.md and
  https://raw.githubusercontent.com/ghostty-org/ghostty/main/CONTRIBUTING.md both opened 2026-09-18
- **Who ships it today:** Ghostty, as a written policy. Free.
- **Nobody ships:** a way to answer the question the policy asks. "The extent that the work was
  AI-assisted" is a **number**, and there is no tool anywhere that produces it honestly. Today a
  contributor guesses, in prose, in a pull request description.
- **The problem it solves for us:** this is the most concrete unmet demand in the whole lens. A
  project with real users has written down a requirement that no tool satisfies, and a per-span
  version record satisfies it exactly: "37 of 210 lines in this file came from an agent, 12 of those
  were edited afterwards by a person". That is a number a document editor can compute and a git
  history cannot.
- **Fit:** it falls directly out of the change queue plus the version record. The queue already knows
  which changes came from an agent; the extent is a count over those records.
- **Effort:** small once the version record exists. It is a report over data the queue already holds.
- **Verdict:** must-have, and it is the cheapest must-have here. Call it an AI extent summary or a
  disclosure line; the point is that it is computed, not claimed. **Caveat:** it is only honest for
  changes made through frontmatter. A file edited elsewhere and re-opened has an unknown history, and
  the report has to say so rather than report zero. Reporting zero for unknown is the exact class of
  bug the repo's own rules warn about.

### FE19. Telemetry from 22,000 developers: review time up 441.5%, and more code merging with no review at all

- **Demand:** Faros AI published "The AI Engineering Report 2026: The Acceleration Whiplash" from
  telemetry rather than a survey. Methodology, verbatim: "draws on two years of telemetry data from
  22,000 developers and more than 4,000 teams across the Faros platform, tracking metric change
  between each organization's periods of lowest and highest AI adoption."
  The review-cost numbers, verbatim, under a heading they call "the senior engineer tax":
  "Median time to first PR review is up 156.6%. Average time spent in code review is up 199.6%.
  Median time in review is up 441.5%."
  Why, verbatim, and this sentence is the best description of the problem I found anywhere:
  "AI-generated code presents a specific and under-appreciated challenge for reviewers. It is often
  superficially convincing: idiomatic, well-named, stylistically consistent with the surrounding
  codebase. It looks like code written by someone who knows what they are doing. The structural and
  logical failures, when they exist, are beneath the surface."
  The unreviewed number, verbatim, under the heading "More code is entering production with no review
  at all":
  "Pull requests merged without any review, human or agentic, are up 31.3%. We do not believe this
  reflects a deliberate decision to bypass oversight. The more likely explanation is that reviewers
  cannot keep pace with the volume of AI-generated code arriving for their attention."
  Supporting numbers, all verbatim: "The acceptance rate of AI-generated code has risen from 20% to
  60%"; "Code churn, the ratio of lines deleted to lines added for merged code in a given quarter,
  has increased 861% under high AI adoption"; "The incidents-to-PR ratio is up 242.7%"; "Monthly
  incidents are up 57.9%"; on bugs, "In our 2025 AI engineering report on the AI Productivity
  Paradox, bugs per developer were up 9% as AI adoption grew. In this dataset, that figure has risen
  to 54%."
  And their own conclusion, which is our thesis in someone else's words, verbatim:
  "the ability to push quality back to where it belongs, at the point of authorship, before the code
  ever reaches review."
- **Source:** https://www.faros.ai/blog/ai-acceleration-whiplash-takeaways opened 2026-09-18
- **Who ships it today:** Faros sells the dashboard that produces these numbers. That is worth saying
  plainly: the report is evidence and it is also marketing for the product it recommends.
- **Nobody ships:** the same measurement for documents. Nobody knows how many AI-written paragraphs
  ship unread, because nobody records which paragraphs were AI-written (FE8).
- **The problem it solves for us:** this is the number the brief asked for, and it is telemetry
  rather than opinion. Two cautions before it goes in a deck. First, every figure is a **relative
  change** between each organisation's low-AI and high-AI periods, not an absolute share: "up 31.3%"
  does not mean 31.3% of pull requests go unreviewed, and writing it that way would be a fabricated
  number of exactly the kind this repo has been burned by. Second, Faros explicitly contradicts DORA
  (FE11) on whether good engineering practice protects a team, verbatim: "High-performing engineering
  organizations, those with mature DevOps practices, high DORA metrics scores, and disciplined
  delivery processes, are experiencing the same downstream deterioration as everyone else." Cite both
  and name the disagreement rather than picking the one that suits us.
- **Fit:** "push quality back to the point of authorship, before it reaches review" is the change
  queue, written by someone selling a dashboard instead of an editor.
- **Effort:** n/a.
- **Verdict:** must-have as evidence, with both cautions attached.

### FE20. The cleanest number for "how much goes unread": 96% do not fully trust it, 48% always check it

- **Demand:** Sonar's press release of 8 January 2026, read from their own site. Verbatim:
  "The study, which surveyed over 1,100 developers globally, confirms that AI adoption in coding has
  reached critical mass: 72% of developers who have tried AI use it every day, and AI accounts for
  42% of all committed code" and the page adds that developers expect this to rise to 65% by 2027.
  The headline pair, verbatim:
  "while 96% of developers report they do not fully trust that AI-generated code is functionally
  correct, only 48% state they always check their AI-assisted code before committing it."
  Verbatim on cost: "The verification burden to avoid this debt is significant, with 38% of
  developers noting that reviewing AI-generated code requires more effort than reviewing code written
  by their human colleagues."
  And the borrowed term, verbatim: "This creates what Amazon Web Services (AWS) CTO Werner Vogels has
  termed "verification debt.""
  Their own headline names the gap, verbatim: "Sonar Data Reveals Critical "Verification Gap" in AI
  Coding: 96% Don't Fully Trust Output, Yet Only 48% Verify It".
- **Source:** https://www.sonarsource.com/company/press-releases/sonar-data-reveals-critical-verification-gap-in-ai-coding/
  opened 2026-09-18
- **Who ships it today:** Sonar sells code review and verification, so the same marketing caveat as
  FE19 applies.
- **Nobody ships:** the equivalent measurement for prose. Nobody has asked 1,100 writers what share
  of AI-written text they read before publishing it.
- **The problem it solves for us:** it is the answer to question 4 in one line. Just over half of
  developers do not always check AI output before committing it, and that is self-reported, which
  means the true figure is probably worse rather than better. The reason given is not laziness, it is
  volume, and Faros's telemetry (FE19) agrees.
- **Fit:** it is the headline for why the queue exists.
- **Verdict:** must-have as a quotation. It is the most quotable number in this lens, and it is the
  one to use if only one number survives into the plan.

### FE21. GitHub named the whole problem in February 2026 and named curl and Ghostty as casualties

- **Demand:** Ashley Wolf, GitHub, 12 February 2026, updated 13 February 2026. Verbatim:
  "Today, a pull request can be generated in seconds. Generative AI makes it easy for people to
  produce code, issues, or security reports at scale. The cost to create has dropped but the cost to
  review has not."
  On the economics, verbatim: "The ease of creation often adds a burden to the maintainer because
  there is an imbalance of benefit. The contributor maybe gets the credit (or the CVE, or the
  visibility), while the maintainer gets the maintenance burden."
  Naming names, verbatim:
  "curl ended its bug bounty program after AI-generated security reports exploded, each taking hours
  to validate."
  "Projects like Ghostty are moving to invitation-only contribution models, requiring discussion
  before accepting code contributions."
  "Multiple projects are adopting explicit rules about AI-generated contributions."
  And, verbatim: "These are rational responses to an imbalance."
  They also push back on the idea that this is new, verbatim: "It is tempting to frame "low-quality
  contributions" or "AI slop" contributions as a unique recent phenomenon. It isn't. Maintainers have
  always dealt with noisy inbound."
  The maintainer's own question, verbatim: "Are you really trying to help me, or just help yourself?"
- **Source:** https://github.blog/open-source/maintainers/welcome-to-the-eternal-september-of-open-source-heres-what-we-plan-to-do-for-maintainers/
  opened 2026-09-18
- **Who ships it today:** GitHub shipped repository controls, pinned comments, comment-noise banners,
  faster diffs and temporary interaction limits. All free. Verbatim on what is next: "coming soon:
  pull request deletion from the UI."
- **Nobody ships:** a way to make one contribution cheaper to review. Every shipped remedy on that
  list reduces the **number** of things a maintainer must look at. None makes the looking faster.
- **The problem it solves for us:** it corroborates FE13 and FE14 from the platform's own voice, and
  it gives us the sentence that frames the product in eleven words: the cost to create has dropped
  but the cost to review has not.
- **Fit:** the change queue is a bet on the second half of that sentence.
- **Effort:** n/a.
- **Verdict:** must-have as framing.

### FE22. Answer to question 3: what a document reviewer wants that a code reviewer already has

This is the affordance gap, stated as a table. Everything in the "code" column was read on a primary
page during this lens. The "documents" column is what a markdown writer has today.

| Affordance | Code reviewer has | Document writer has | Gap |
|---|---|---|---|
| Diff view | Yes. Zed Delta opens them in full, verbatim: "In Delta, diffs open in full, transcripts stay whole". Cursor, verbatim: "The diff view shows changes as they happen." | Google Docs shows AI suggestions inline before accept; after accept, nothing. No diff against a version you choose. | Large |
| Accept or reject one change | Yes, per hunk, everywhere | Yes, in Google Docs, verbatim: "To apply changes individually, click Accept suggestion ." | **None.** FE15. |
| Request changes | Yes, a first-class state on a pull request. Zed Delta, verbatim: "If a reviewer spots a problem, they can request a revision" | No. A document comment is not a blocking state. | Large |
| Suggestion, meaning propose exact replacement text | Yes, GitHub suggested changes, and Cursor Bugbot, verbatim: "With autofix enabled, you can commit the fix directly from a comment on the pull request." | Yes, Google Docs suggesting mode | None |
| Resolve a thread | Yes | Yes | None |
| Blame, meaning who wrote this line | Yes, `git blame`, per line, for people. For machines, only at commit granularity (FE7). Zed Delta anchors survive edits (FE1). | **No.** Google Docs version history is a list of revisions by person, not a per-span authorship view. | **The gap.** |
| Checkpoint and restore | Yes. Cursor, verbatim: "Checkpoints save snapshots of your codebase during an Agent session." Claude Code, verbatim: "Every prompt you send that starts a turn creates a new checkpoint". | Google Docs named versions, verbatim: "You can create a named version to track your version history". | Small |
| Undo an agent's work specifically | Partly, and it leaks. Claude Code, verbatim: "Checkpointing does not track files modified by Bash commands." Cursor, verbatim: "Checkpoints are stored locally and separate from Git." | No. Undo is keystroke-ordered, not actor-ordered. | Large |
| What changed while I was away | No named feature anywhere (FE17) | A blue dot (FE17) | Large |
| How much of this was AI | **Nothing, anywhere** (FE8, FE18) | Nothing | Total |

INFERENCE, and it is the one I would stake the positioning on: the two rows that are total gaps for
both columns are **per-span machine authorship** and **how much of this was AI**. Every other row is
either solved or nearly solved for code and partly solved for documents. So the honest ranking of
what to build is: the away view (FE17), then the extent report (FE18), then actor-ordered undo,
then request-changes. Accept-or-reject alone is table stakes (FE15).

One more asymmetry worth naming. A code reviewer gets a **free correctness oracle**: tests, types and
linters. Cursor says so, verbatim: "Tests catch behavioral regressions, Type checking catches
structural errors, Linting catches style and pattern violations", and adds, verbatim: "The more of
these checks you have in place, the more confidently you can delegate work to agents."
A document has no compiler. The nearest equivalents found in this lens are Vale and languagetool
running inside CodeRabbit (FE10), which check style and grammar, not truth. That is why the reviewing
burden on a document falls entirely on a person, and why the change queue matters more for prose than
it does for code, not less.

### FE23. Answer to question 2: what users actually say about Delta, including a comment that attacks our thesis too

- **Demand:** three Hacker News submissions, counts from the Algolia API rather than the rendered page:
  - "Delta" (the Introducing Delta post), 12 August 2026: **679 points, 260 comments**, item 49276574.
  - "Zed DeltaDB", item 49187256: **529 points, 314 comments**.
  - "Replacing Pull Requests with Delta" (the public beta post), 16 September 2026: **14 points,
    1 comment**, item 49727245. The launch that matters got almost no discussion.
  Real comments, copied from the thread, with the commenter's handle:
  The strongest challenge to Zed **and to us**, from `karma_daemon`:
  "To me it this seems a bit backwards looking. Increasingly code review is more on verifying the
  functional requirements, and less about reading every line an agent has written (or watching it
  write those lines live)"
  On whether provenance ages well, from `lukaszkorecki`:
  "I'm not sure what is the value of preserving hundreds of lines of conversations about how code
  came to be if the code keeps changing? What happens in 5 years? Do I have to read the whole
  transcript just to understand what's going on? AI will summarize it for me?"
  On lock-in, from `Vinnl`: "I can imagine this being useful, but unlike Zed, this looks like it'll
  come with some fairly significant lock-in. Great for the investors, but it makes me hesitant..."
  The loudest objection, from `SwellJoe`, which drew 18 direct replies: "Coding is a single-player
  game and I can't think of a single thing that would be improved by having someone else in the same
  editor."
  Unprompted demand for the thing we are building, from `markusw`:
  "I'm mostly looking for a product now that lets me review large amounts of code easily, add
  comments, and interact with many agents working on the same codebase in worktrees (or similar) at
  once."
  And unprompted demand for the **document** case, from `jerieljan`:
  "Funnily enough, my first impression for this project was to use it for non-code and planning
  first."
  And the mood, from `xyst`: "When will this ai slop era end? Hopefully soon because I am tired of
  reviewing junk PRs"
  On the earlier DeltaDB thread, the privacy objection, from a commenter in that thread:
  "Letting them read my conversations is okay. Systematically reconstructing a timeline of every
  keystroke that went into a project, then immortalizing this timeline into a VCS, that's the creepy
  part."
- **Source:** https://hn.algolia.com/api/v1/items/49276574 and
  https://hn.algolia.com/api/v1/search?query=Delta%20Zed&tags=story opened 2026-09-18;
  https://news.ycombinator.com/item?id=49187256 opened 2026-09-18
- **Who ships it today:** Zed. Free during the public beta.
- **Nobody ships:** an answer to `lukaszkorecki`. Nobody has shown that a preserved agent transcript
  is worth reading a year later.
- **The problem it solves for us:** three things we should carry forward rather than dismiss.
  (1) `karma_daemon`'s objection is the real bear case for the change queue: if review moves to
  "does it meet the requirement" rather than "did you write this line", a per-span queue is work
  nobody wants. Our counter has to be that a **document** is different from code because there is no
  test that says a paragraph is true (FE22). (2) Keeping the whole transcript is not obviously
  valuable; keeping the **decision** is. Our version record should store what was accepted and by
  whom, not a chat log. (3) Storing a keystroke-level history is read by some people as surveillance,
  which is an argument for recording accepted changes rather than everything.
- **Fit:** it sharpens the queue's scope rather than changing it.
- **Verdict:** must-read. The 14 points on the public beta is the quiet fact here: this category has
  less pull than its blog posts suggest.

### FE24. Somebody already built an agent-annotated diff reviewer, it is MIT licensed, and it is for code

- **Demand:** a Hacker News commenter (`tudorg`) named it unprompted while asking Zed for it:
  "I kind of like the Hunk workflow for reviews (of both AI and human-generated code), you basically
  tell the agent "walk me through the diff by annotating and controlling this diff viewer"."
  The project describes itself, verbatim from its README:
  "Hunk is a review-first terminal diff viewer for agent-authored changesets"
  Its feature list, verbatim, includes: "multi-file review stream with sidebar navigation", "inline AI
  and agent annotations beside the code", "watch mode for auto-reloading file and Git-backed
  reviews", "keyboard, mouse, pager, and Git difftool support".
  Its own comparison table claims "Inline agent / AI annotations" as the one row where every other
  tool in the table is marked absent.
- **Source:** https://raw.githubusercontent.com/modem-dev/hunk/main/README.md opened 2026-09-18;
  the commenter quote from https://hn.algolia.com/api/v1/items/49276574 opened 2026-09-18
- **Who ships it today:** modem-dev, MIT licence, free, installable by npm, Homebrew, mise or Nix.
- **Nobody ships:** the same thing for a document. And nothing here marks which spans the agent
  wrote; the annotations are the agent's **explanation** of the diff, not a claim of authorship.
- **The problem it solves for us:** "have the agent walk me through what it changed" is a distinct,
  cheap, and apparently wanted feature that we do not have in the plan. It is not the change queue.
  It is the thing that makes the queue bearable when there are forty items in it: each item arrives
  with one sentence from the agent saying what it did and why.
- **Fit:** very good, and it costs almost nothing once the queue exists, because the agent that made
  the change is the one that writes the note. It also fits the Idea-mode brief work already planned.
- **Effort:** small. One field per queued change, written at the time the change is proposed.
- **Verdict:** good-to-have, high value for the cost. It is the difference between a queue of forty
  diffs and a queue of forty explained diffs.

### FE25. CORRECTION to FE8. A line-level AI authorship standard exists, is implemented, has 2,743 stars, and 14 agents write it

- **Demand:** I was wrong in FE8 and this is the correction. The Git AI project publishes
  `specs/git_ai_standard_v3.0.0.md`, written in RFC 2119 language. Verbatim from its first line:
  "This document defines the Git AI Authorship Log format for tracking AI-generated code
  contributions within Git repositories."
  The carrier, verbatim:
  "Git AI uses [Git Notes](https://git-scm.com/docs/git-notes) to attach authorship metadata to
  commits without modifying commit history."
  "Authorship logs MUST be stored under the `refs/notes/ai` namespace"
  "Implementations MUST NOT use the default `refs/notes/commits` namespace to avoid conflicts with
  other tools"
  The granularity is a **file path plus line ranges**, verbatim from the example:
  ```
  src/main.rs
    s_c9883b05a2487d::t_9f8e7d6c5b4a32 1-10,15-20
    s_c9883b05a2487d::t_a1b2c3d4e5f678 25-30
    h_31dce776f88375 35-40
  ```
  And the honest part of the design, verbatim:
  "Lines not covered by any key (e.g. 11-14, 21-24, 31-34) are "untracked" -- git-ai has no data on
  their provenance."
  The known limitation, verbatim from the spec's own opening:
  "The line numbers are only accurate in the context of that commit, with the version of each file at
  the time of committing."
  Openness, verbatim: "Another project would be considered compliant with this standard if it also
  attached AI Authorship Logs with Git Notes, even if it was implemented in another way."
  And it computes the number Ghostty asks for (FE18), verbatim from the README:
  "Calculates % AI-code, AI-lines generated vs committed, accepted rates, human overrides broken down
  by tool and model."
  The README also shows the bar it prints on every commit: "you 6% ... 94% ai".
- **Source:** https://raw.githubusercontent.com/git-ai-project/git-ai/main/specs/git_ai_standard_v3.0.0.md
  and https://raw.githubusercontent.com/git-ai-project/git-ai/main/README.md opened 2026-09-18;
  star count read from https://github.com/git-ai-project/git-ai opened 2026-09-18, which reports
  **2,743** stars
- **Who ships it today:** Git AI, open source, free, local-first. Verbatim: "Local-first - Works
  offline, no login required." The README lists fourteen agents as supporting the standard: Claude
  Code, Codex, Cursor, GitHub Copilot, OpenCode, Pi, Windsurf, Droid, Amp, Gemini, Continue, Junie,
  Rovo Dev and Firebender. A competing tool, comarch/git-byline, exists with **3** stars and is not
  meaningful traction.
- **Nobody ships:** a version of this that survives outside a git commit. The whole scheme is keyed
  on commit SHAs, and the line numbers are only valid for the file as committed. Edit the file, and
  every range moves. That is the same weakness a sidecar has, and it is why Zed built anchors.
- **The problem it solves for us:** three consequences, and they are not comfortable.
  1. The claim "nobody marks which lines a machine wrote" is **false**. Somebody does, it is a
     published standard, and the agents we ourselves use already emit it.
  2. It works on **any file in a git repository**, including markdown. Nothing in the spec is
     specific to code. A team using Git AI already gets line-level AI attribution on their `.md`
     files today, for free.
  3. The gap that survives is real but narrow: it needs a git repo, it needs a commit, and the
     attribution is pinned to line numbers in that commit rather than to a span that moves. A
     document being written now, between commits, has no attribution, which is exactly the window
     frontmatter lives in and exactly what Zed named as the gap for code.
- **Fit:** we should **emit** this format, not compete with it. Writing `refs/notes/ai` on our GitHub
  push would make frontmatter the first document editor that speaks an existing AI-authorship
  standard, and it costs us a serialiser over data the change queue already holds.
- **Effort:** medium. The format is specified precisely enough to implement, the hard part is mapping
  our span records onto the committed file's line numbers at commit time.
- **Verdict:** good-to-have, and it changes the story. We are not filling a vacuum, we are covering
  the interval this standard cannot reach. That is a smaller claim and a true one.

## AMENDMENT to FE8, written after FE25 (not a separate finding)

The answer to question 1 given in FE8 was wrong and is corrected here. The accurate answer is:

**Yes, a standard exists for marking which lines of a text file a machine wrote, and it is in use.**
Git AI's Authorship Log, `refs/notes/ai`, file path plus line ranges plus session identity, with an
explicit untracked state, supported by fourteen agents (FE25). A second standard, C2PA 2.3, can
express a character range in text but has no implementation for text and an unusable in-file carrier
(FE5, FE6). Below the commit, in the interval where a document is actually being written, there is
still nothing, and that is the honest gap. Delete the sentence "there is no standard" from any
document that quotes this lens.

### FE26. Microsoft turned AI attribution on by default, and turned it off again in two weeks. People do not want to be marked

- **Demand:** this is the counter-signal, and it is the most important caution in this lens. Microsoft
  posted a public post-mortem on 5 May 2026. The timeline, verbatim from the issue:
  "In 1.110, we added a setting to add Copilot as coauthor in commit messages by appending
  Co-authored-by: Copilot copilot@github.com."
  "The default value of the setting was off."
  "In 1.117 (public rollout started 4/22), we changed the setting default to all. There was a bug in
  the code that was not found in testing that attributed non-Copilot code completions to Copilot.
  This resulted in commit messages containing Co-authored-by: Copilot copilot@github.com even when
  the disableAIfeatures setting was turned on."
  "Because of the bug, we changed the setting value to chatAndAgent in 1.118 (public rollout started
  4/29)."
  "We reverted the default for the AI attribution feature back to off. ... These fixes will be tested
  and released in 1.119 (public rollout starting 5/6)."
  What they committed to afterwards, verbatim:
  "The attribution is never applied for changes that are not AI-related."
  "Before adding a commit trailer, the user will have to give consent, no matter the default value of
  the setting."
  "We'll review the attribution message. A better approach might be using the approach of
  "assisted-by" attribution"
  The three settings values, verbatim: "off - no attribution no matter whether Copilot assisted or
  not with the code in this commit"; "chatAndAgent - add attribution if the commit contains code that
  was generated using the chat feature"; "all - add attribution if the commit contains any kind of
  AI-generated code (chat, inline completions, NES)".
- **Source:** https://github.com/microsoft/vscode/issues/314311 opened 2026-09-18. UNVERIFIED: the
  page states "Reactions are currently unavailable", so I could not get a reaction count, and I am
  not quoting one.
- **Who ships it today:** VS Code, free. Default is off.
- **Nobody ships:** attribution on by default. The largest editor in the world tried it and reversed
  within roughly two weeks of the rollout starting.
- **The problem it solves for us:** it is a warning, and it should change a design decision.
  People will accept a record they **chose** to create and will reject a mark applied **to them**.
  The failure mode was not the idea, it was two specifics: it fired on work that was not AI, and it
  fired without asking. Microsoft's own conclusion is the rule to copy: never attribute something
  that was not machine-written, and get consent before writing the mark anywhere anyone else will
  read it.
  INFERENCE: this is a strong argument for our version record being **local and private by default**,
  with export as a deliberate act. A per-span AI mark that automatically travels with a shared
  document is a feature some users will read as an accusation. Ghostty wants the number (FE18), and
  its own author will be glad to have it; the author's manager may be a different matter, and DORA's
  qualitative study already records engineers worrying about being measured.
- **Fit:** it does not remove anything from the plan. It sets the default.
- **Effort:** none. It is a default.
- **Verdict:** must-have as a design constraint. Record by default, disclose on request, never
  publish without asking.

---

## Pricing correction to FE9

Graphite's tiers, read again in full on 2026-09-18 from https://graphite.com/pricing: Hobby free,
Starter $20 per user per month billed annually, **Team $40 per user per month billed annually** with
"Unlimited AI Reviews", Enterprise custom. I could **not** confirm "Diamond" as a current Graphite
product name: https://graphite.com/features/diamond returns 404, and the site banner now reads
"Cursor Cloud Agents are now in Graphite. Create, review, and ship without leaving your PR."
UNVERIFIED: whether Diamond was renamed, folded in, or retired.

## What I could not reach

- **Zig's AI policy.** `ziglang/zig/CONTRIBUTING.md` and `.github/CONTRIBUTING.md` both return 404 on
  raw.githubusercontent.com and github.com. Loris Cro's post "Contributor Poker and Zig's AI Ban"
  at kristoff.it returns 404 at the URL a search result gave. I did not find the policy text, so
  nothing in this file quotes it, and the Zig ban is UNVERIFIED here. The only sourced statement
  about Zig is the JMeter PR's secondary mention of the kernel and other projects, not Zig itself.
- **Reaction and vote counts on the VS Code attribution issue** (FE26). The page states "Reactions
  are currently unavailable".
- **The full Faros report PDF and the full Sonar report PDF.** Both are behind a download form. Every
  number quoted in FE19 and FE20 comes from the public blog post and public press release
  respectively, not from the gated reports.
- **Whether any tool actually writes a C2PA text manifest** (FE6). I found the clause; I did not find
  an implementation, and I did not construct one to test.
- **The post-accept state of a Gemini suggestion in a live Google Doc** (FE15). Read from
  documentation only. Driving a live document would settle whether any mark persists.
- **A prose-side equivalent of the Faros or Sonar measurements.** I searched and found none. Nobody
  has measured what share of AI-written text ships unread, because nobody records which text was
  AI-written.

## What surprised me

1. A line-level AI authorship standard already exists, has 2,743 stars, works on markdown, and the
   agents we use already write it. My first answer that no standard exists was wrong (FE25, FE8).
2. C2PA's way of putting provenance in a text file is invisible Unicode appended to the document, and
   it is disqualifying for a byte-exact editor (FE6).
3. Google Docs already ships accept-or-reject for every AI edit, so the change queue is table stakes
   and the differentiation has to be elsewhere (FE15).
4. Microsoft switched AI attribution on by default and reversed it in about two weeks, which means
   marking people's work is a consent problem before it is a technical one (FE26).
5. Zed's public beta post, the launch that matters, got 14 points and 1 comment on Hacker News while
   the announcement got 679, which is worth remembering before assuming this category has pull (FE23).

## Note on process, recorded because the brief asks

Every page fetched in this lens was treated as data. Several of the sources are marketing for a
product the same company sells (Faros, Sonar, CodeRabbit, Zed, Graphite, cubic, Git AI), and that is
stated at each finding rather than left implicit. No page instructed me to take an action that I
acted on. The session's tooling flagged pattern matches in fetched page text more than thirty times;
none was followed, and no outbound or credential-touching action was taken at any point.
