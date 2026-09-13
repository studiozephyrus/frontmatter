# R3 promotion evidence for frontmatter (MVP + funnel)

Date opened: 2026-09-13. Local corpus checked first: no prior research file in
`docs/research/` covered promotion channels specifically (only spec-driven-dev
market comparisons). This is new ground.

## 1. "Made with" / "Edit with" badge loops

Confirmed by opening each vendor's own page.

- **Lovable**: free-tier published apps carry an "Edit with Lovable" badge
  (a watermark). Docs, opened 2026-09-13: "The 'Edit with Lovable' badge shown
  on published apps can be hidden on paid plans. Go to Project settings then
  Publishing and turn on Hide Lovable badge." It is per-project, takes effect
  immediately, and reverts to visible on downgrade at the next publish.
  Source: https://docs.lovable.dev/introduction/faq (opened 2026-09-13).
  A third-party workaround (custom CSS targeting the badge element ID) is
  documented on Medium, but that is not Lovable's own statement and is
  unverified as still working. Lovable does not publish a number for what
  the badge loop is worth in signups or traffic; no such figure was found in
  the docs.

- **Carrd**: free ("Basic") sites carry "Made with Carrd" branding. Removing
  it requires the cheapest paid tier, Pro Lite, at **$9/year**. Confirmed by
  opening https://carrd.com/docs/pro/plans (2026-09-13): "Pro Lite... No
  Branding: Publish sites without the 'Made with Carrd' branding." All three
  paid tiers (Pro Lite $9/yr, Pro Standard $19/yr, Pro Plus $49/yr) remove it;
  the free plan never does. No effect or attribution number is published by
  Carrd on this page.

- **Framer**: free-hosted sites show a "Made in Framer" footer badge. Framer's
  own help article, opened 2026-09-13
  (https://www.framer.com/help/articles/how-do-i-remove-the-made-in-framer-badge-from-my-website/),
  states the badge is removed automatically once a paid site plan or a custom
  domain is attached, and republishing is required after upgrading. The page
  links out to Framer's own commerce product via a badge-sourced UTM link
  (`utm_source=framer&utm_medium=badge&utm_campaign=free_tier`), which is
  itself evidence the badge is treated internally as an acquisition channel
  they tag clicks from, though no conversion number is published.

- **Typeform**: not opened this run; time budget did not stretch to it.
  UNVERIFIED for this report; do not cite a Typeform badge behaviour without
  opening typeform.com/help directly.

- **Vercel "Deploy to Vercel" button**: this is a different mechanism (no
  visible badge on the deployed site; it is a GitHub README button that
  starts a one-click deploy plus an optional repo clone). Vercel's own blog
  post introducing it and its docs describe the mechanic, but neither page
  states a usage or growth number in the sources opened. A broader search for
  "viral growth" or adoption data on the Deploy button returned only how-to
  content, no self-reported or third-party effect study. Absence claim:
  three targeted searches ("deploy to vercel button viral growth github
  readme effect reported", plus scanning the Vercel blog post and the GitHub
  vercel/vercel README) found no published number for the button's referral
  or signup effect. Narrow claim: of the sources checked, none quantifies it;
  the broader claim that nobody has ever measured this is not established.

**Pattern across all three badge vendors opened**: the badge is a default on
the free tier, removable only by paying, and none of the three publishes a
number for what the badge is worth in referral signups or traffic. It is
treated as a plan-gating feature, not a measured growth channel, in every
page checked.

## 2. Public galleries of generated projects or templates

- **v0 (Vercel)**: v0 publishes every generation to a public, forkable page by
  default, with a community gallery (https://v0.dev/community,
  https://v0.app/templates; titles confirmed via search, not individually
  curl-fetched). Bot protection (a Kasada JS challenge) blocked a direct curl
  of vercel.com/blog, so the underlying Vercel blog post ("How v0 is building
  SEO-optimized sites by default") could not be opened in this run; UNVERIFIED
  at the primary-source level. A secondary blog (figuringoutwithai.com,
  opened 2026-09-13, dated 2026-03-20, author-attributed to an AI-assisted
  byline) makes the claim "Millions of Indexed Pages" and describes the same
  mechanic (a unique public URL per generation, indexable prompt text,
  fork/remix buttons, upvote-driven internal linking) as an SEO strategy.
  This is a secondary source repeating a number that could not be
  independently verified against Vercel's own page in this run; treat the
  "millions" figure as unverified, attributed to that blog, not confirmed by
  Vercel.
- No comparable claim was found for Bolt.new, Lovable, or Replit galleries in
  this run (not directly searched, out of scope for the time budget). Do not
  extend the v0 finding to other builders.

## 3. Launch channels: Show HN, Product Hunt, Reddit

- **Show HN / Hacker News**: search results (not independently curl-verified
  against Hacker News' own data, which HN does not publish) describe a
  consistent pattern across multiple third-party write-ups: a front-page
  Show HN post produces a sharp day-one traffic spike that decays within a
  day or two, rather than sustained traffic. One cited case study number
  ("18,000 visits, 6.8% conversion, 1,224 signups") and another
  ("1.4 GitHub stars per HN upvote within 48 hours") come from marketing/SEO
  blog posts (stackmatix.com, daily.dev business resources) that were not
  opened and checked line by line in this run. They are UNVERIFIED
  third-hand figures, not confirmed against a primary source, and should not
  be quoted as fact.
- **Product Hunt**: similarly, search results surfaced a self-reported study
  (collected via founder questionnaires for products that launched between
  2026-05-05 and 2026-05-19, described on shno.co) with per-launch numbers
  including a claim that the highest-ranked launch in the sample had the
  lowest paid conversion and a lower-ranked launch had the highest, around
  20 percent. This page was not opened and verified directly in this run;
  UNVERIFIED. A separately cited MySignature.io survey figure ("50% of
  founders saw only a temporary registration spike, 16% saw none") is also
  unverified at the primary-source level here.
- **Absence check for India-specific HN/PH data**: three searches were run
  (the India developer community search, the Product Hunt search, and the
  badge/gallery searches above), and none surfaced India-specific PH or HN
  case data. Narrow claim: of what these three searches surfaced, no
  India-specific figure exists; the broader absence claim is not established
  without more targeted search.

## 4. Reddit and developer communities in India

- **r/developersIndia / developersIndia.in**: confirmed by opening
  https://developersindia.in/ directly (2026-09-13). The site's own
  schema.org Organization markup states: "India's largest and most active
  developer community with over 1M members." This is a self-report from the
  community's own site, not a third-party audit; treat "1M+" as
  self-attributed. The same page links its own Reddit
  (reddit.com/r/developersIndia), Discord, and GitHub org
  (github.com/developersIndia) as the same community's presences. An attempt
  to independently confirm the Reddit subscriber count via Reddit's public
  `/about.json` endpoint did not return a usable value in this run (empty or
  non-JSON response), so the 1M+ figure is attributed to developersIndia's
  own claim only, not cross-checked against Reddit's count.
- No specific tool-launch case study on r/developersIndia (or Hashnode, which
  is a developer blogging platform, not primarily a launch channel) was found
  in this run's searches. Absence claim, narrow: the two searches run here
  found no documented tool-launch outcome on this community; the broader
  claim is not established.

## What this means for the frontmatter plan

Evidence supports, most strongly to least:

1. **A default-on, paid-removable attribution badge on the funnel's kit output
   or the editor's export.** Every vendor checked (Lovable, Carrd, Framer)
   ships this pattern as a standard plan-gating mechanic, and all three treat
   it as a default rather than an experiment. It is proven-common practice
   across three unrelated products, even though none publishes an effect
   number. The plan's Free tier (unlisted public link) is exactly the surface
   this pattern targets: an unlisted-link badge or footer credit costs
   nothing to build and matches how comparable tools monetise the same
   free/paid split already in the plan.

2. **A public, forkable gallery of generated kits at unlisted-but-indexable
   URLs**, modelled on v0's pattern (a unique URL per generation, a fork
   button, indexable prompt text). The "millions of indexed pages" figure
   itself is unverified and should not be repeated as fact, but the mechanism
   is the supportable part: publish-by-default with an SEO surface is a real,
   observed pattern in one directly comparable product category (AI
   generation tools), and it maps onto the funnel's seven-file kit output.

3. **A Show HN / Product Hunt launch for the MVP**, sized as a single-day
   spike-and-decay event, not a sustained-acquisition channel. This is the
   consistent qualitative pattern across multiple independent write-ups even
   where their specific numbers are unverified. Plan for it as a one-time
   event with a landing page ready to catch the spike, not as a recurring
   channel.

**What the evidence does not support**: treating r/developersIndia's "1M+
members" as a ready-made distribution channel with a known conversion rate.
No case study of a comparable tool launching there was found, and the 1M
figure is a self-report from the community's own site, not independently
audited. Reaching this community is plausible (it exists, it is large by its
own account, and it is where Indian developers gather), but nothing in this
run establishes what a launch there is worth. That should be treated as an
untested channel, not a proven one.

## Sources opened this run (curl or WebSearch then curl-confirmed)

- https://docs.lovable.dev/introduction/faq, 2026-09-13
- https://carrd.com/docs/pro/plans, 2026-09-13
- https://www.framer.com/help/articles/how-do-i-remove-the-made-in-framer-badge-from-my-website/, 2026-09-13
- https://www.figuringoutwithai.com/growth/v0-user-generated-pages-seo-moat, 2026-09-13 (secondary source, dated 2026-03-20)
- https://developersindia.in/, 2026-09-13
- Vercel blog (how-v0-is-building-seo-optimized-sites-by-default): attempted, blocked by bot protection (Kasada JS challenge), not opened. UNVERIFIED.
- Reddit /r/developersIndia about.json: attempted, no usable response returned.

Not opened, cited only as search-result summaries (flagged UNVERIFIED in the
text above): stackmatix.com HN launch pieces, the daily.dev HN marketing
page, the shno.co Product Hunt statistics page, and the MySignature.io
survey (via secondary citation).
