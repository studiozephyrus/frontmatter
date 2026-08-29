### 1. Real role models, as documented

| Product | Role set (verbatim) | Scope levels | Documented resolution rule |
|---|---|---|---|
| GitHub (org repos) | Read, Triage, Write, Maintain, Admin (+ custom roles on GHEC) [fetched 2026-08-29, docs.github.com repository-roles-for-an-organization] | org base permission → repo → team → individual [fetched] | "If someone with admin access… grants a member a higher level of access for the repository, the higher level of access overrides the base permission" — **max wins** [fetched, setting-base-permissions-for-an-organization] |
| Notion | Full access, Can edit, Can edit content, Can create, Can comment, Can view (+ workspace roles: Workspace owner, Membership admin, Member, Temporary member; Guest) [fetched 2026-08-29, notion.com/help/sharing-and-permissions + /add-members-admins-guests-and-groups] | workspace → teamspace → page → subpage → database page-level rules [fetched] | "Notion respects the **broadest** level of access given to a user" — **max wins** [fetched] |
| Google Drive/Docs | Viewer, Commenter, Editor, Owner [fetched 2026-08-29, support.google.com/drive/answer/2494822] | drive → folder → file [fetched] | "Access you apply to a folder is inherited by all files within it. You can no longer give someone **less** access to an individual file if they have higher access to its parent folder" — **inheritance is a floor** [fetched] |
| GitBook | Guest, Reader, Commenter, Editor, Reviewer, Creator, Admin [fetched 2026-08-29, gitbook.com/docs/…/roles] | organization → site → collection → space [fetched] | "Permissions… resolve by **precedence, not by the highest role** across every level": space override → site → collection → org [fetched] |
| Confluence (DC 10.2) | global permissions / space permissions / page restrictions (3 layers, not a role ladder) [fetched 2026-08-29, confluence.atlassian.com/doc/permissions-and-restrictions-139557.html] | site → space → page [fetched] | Page restrictions can subtract from space permission; group membership **unions** upward [fetched] |
| Outline (OSS) | UserRole: admin, member, viewer, guest; CollectionPermission/DocumentPermission: read, read_write, admin; GroupPermission: member, admin [fetched 2026-08-29, raw.githubusercontent.com/outline/outline/main/shared/types.ts] | workspace → collection → document [fetched] | not documented in the enum file [fetched] |
| Figma | Full member / Limited access member / Admin (Starter, Pro); can view / can edit / Team admin / Owner (Org, Enterprise) [fetched 2026-08-29, help.figma.com Team permissions] | org/workspace → team → folder → file [fetched] | broadest-to-most-specific share modal ordering [fetched] |
| Linear | workspace owners, admins, team owners, members, **Guest** [fetched 2026-08-29, linear.app/docs/private-teams + /pricing] | workspace → team (public/private) → issue [fetched] | "Use Guests when you want to limit a person's access, rather than make the entire team private" [fetched] |
| Slite | not retrievable — help.slite.com/en/articles/6262633 returned marketing chrome only, no article body [measured 2026-08-29, curl] | — | — |

### 2. Documented confusion points (primary-source, not anecdote)

- **Two products state opposite resolution rules.** Notion: broadest wins [fetched]. GitBook: precedence wins, and warns that this is unintuitive — "Example 1: A member has a Creator role at the organization level… the member gets **Commenter** access" [fetched]. Any user carrying a mental model between the two will be wrong in one of them [inference].
- **Notion documents its own footgun inline:** "If you're noticing that someone is able to take actions that don't align with the permissions you set for them… Notion respects the broadest level of access" [fetched] — i.e. a page-level *restriction* is silently defeated by a workspace-level grant.
- **Google removed downward file-level overrides** and now routes users to the parent folder instead: "Drive will guide you to manage their permissions on the parent folder" [fetched]. Documented workaround is to create a subfolder — a structural change forced by a permission need [fetched].
- **Confluence's group-union trap is in the docs:** "You may have revoked permission for that individual user to add pages… but if they're a member of a group that *is* allowed to add pages, they'll still be able to create new pages" [fetched].
- **Confluence needs a dedicated diagnostic UI** — "People who can view", "Inspect permissions" [fetched]. A model that ships a debugger is a model that is too complex to reason about unaided [inference].
- **Linear's admin escape hatch is a warning dialog, not a wall:** admins "can see all private teams… or join a private team by adding themselves as a member… they will receive a pop-up warning before confirming" [fetched]. Private ≠ private from admins.
- **Linear names the API/webhook bypass explicitly:** "Webhooks can also expose data from private teams" and personal API keys inherit private-team access [fetched].
- **"Suggester" is not a role anywhere I opened.** Google Docs: "People can suggest edits when you give them permission to **comment on or edit**" — Suggesting is a *mode* on the Commenter and Editor roles [fetched 2026-08-29, support.google.com/docs/answer/6033474]. The PRD's "suggester role" has no precedent in the nine products checked [derived from the nine role sets above].

### 3. Per-folder vs per-document vs workspace

- Every product surveyed has ≥3 scope levels; none has fewer [derived from table §1].
- GitBook has 4 (org/site/collection/space) and needed a dedicated "permissions and inheritance" page plus three inheritance modes (Inherit / Specific role / No access) to explain it [fetched].
- Confluence's page restrictions are the only surveyed mechanism that can *subtract* below the container [fetched]; Google explicitly removed that capability [fetched]; Notion's max-wins rule means its page-level rules cannot subtract either [fetched].
- [inference] Subtractive per-document permission is the single feature that generates the most documentation, the most support surface, and the most "why can this person see it" bugs. Two of the three surveyed products that had it have restricted or removed it.

### 4. Link sharing modes and their failure modes

| Mode | Where documented | Failure mode |
|---|---|---|
| Anyone-with-link (unlisted URL) | Notion "Anyone on the web with link" [fetched]; Google "Anyone with the link" [fetched] | Token space is enumerable at small lengths: 5–6 character tokens "can be scanned using brute-force search… effectively public"; 7% of exposed OneDrive accounts were **writable** [fetched 2026-08-29, arXiv 1604.02734, Georgiev & Shmatikov, published 2016-04-10] |
| Publish-to-web (separate channel) | Google "Publish to web" is a distinct action from sharing; "To stop sharing a file with collaborators… change sharing permissions" [fetched]; Notion Sites is "different from making a Notion page public using the Anyone on the web with link setting" [fetched] | Two independent public channels. Notion's own doc: "Even if your Notion Site has been unpublished, it's possible your page's general access settings have been set to Anyone on the w[eb]" [fetched] — unpublishing one channel revokes nothing on the other |
| Search-indexed publish | Notion "Search engine indexing → Discoverable on the web"; "can take up to four weeks to be indexed" [fetched] | Revocation is not symmetric with publication: de-listing from an index is not under the product's control, and the 4-week indexing lag implies a comparable de-indexing lag [inference] |
| Cascade publish | "Publishing a Notion page to the web means all of its subpages will be published too" [fetched] | Publishing one node exposes an unbounded subtree |
| Metadata leak | "the webpage's metadata will include the names, profile photos, and **email addresses** associated with any Notion users that have contributed to the page" [fetched] | Identity disclosure independent of content access |
| Link expiry | Notion: "Link expires" dropdown [fetched]; Google: "Add expiration" on eligible work/school accounts only [fetched] | Expiry is a plan-gated feature in Google, i.e. most users have no TTL [fetched] |

### 5. Guests, external collaborators, billing — the models disagree

| Product | Guest billing | Source |
|---|---|---|
| Notion | "Guests are free of charge – but they can only access individual pages they are invited to"; external guest limit **10** on Free, **Unlimited** on paid tiers | [fetched 2026-08-29, notion.com/pricing] |
| GitBook | "Guest members **count toward** the total number of members… for billing purposes"; "Reader seats are paid for organizations on all plans" | [fetched 2026-08-29] |
| GitHub | "Unless you are on a free plan, adding an outside collaborator to a private repository will **use one of your paid licenses**" | [fetched 2026-08-29, data/reusables/organizations/outside-collaborators-use-seats.md] |
| Figma | "If you're on a paid plan, you can let others **view and comment** on your files without purchasing extra seats" — yet a priced Collab seat exists: Professional $3/mo, Organization $5/mo, Enterprise $5/mo (vs Full seat $16 / $55 / $90) | [fetched 2026-08-29, figma.com/pricing] — **source internally ambiguous; recorded, not resolved** |
| Linear | Guest accounts gated to Business ($16/user/mo billed yearly) and Enterprise | [fetched 2026-08-29, linear.app/pricing] |
| Decap Turbo | "billing is per-org-seat rather than per-site-grant: once someone has a seat in your organization, you can give them access to as many of your sites as you like at no extra cost" | [fetched 2026-08-29, decapcms.org/docs/turbo-how-it-works] |
| Notion (consultants) | "Temporary members don't use a paid seat" — member-level access with a hard expiry up to one year | [fetched 2026-08-29] |

- [derived] Collab-seat as fraction of Full seat: Professional 3/16 = 18.8%; Organization 5/55 = 9.1%; Enterprise 5/90 = 5.6%. Figma prices read-and-comment cheaper the larger the account, approaching free.
- [derived] Two of six surveyed products bill guests, three don't, one is ambiguous. There is no industry norm to copy.

### 6. Invite flows

- **GitHub:** invitation-first, seat-checked before send — "an unused license must be available **before** you can invite a new member"; "Invitations expire after **7 days**"; expired invites are retryable/cancellable in bulk [fetched 2026-08-29]. 2FA-required orgs force the invitee to enable 2FA *before* accepting [fetched].
- **Notion:** three parallel paths — per-email invite, a **secret join link** ("join your workspace automatically as a paid member, without you having to add their email address"), and **allowed email domains** (auto-join on signup, "you will be billed accordingly") [fetched]. Both automatic paths convert to *billable members* without an explicit per-person approval step [fetched].
- **Notion guest→member coercion:** on Enterprise, "if the owner has prevented members from inviting guests to pages, then any people you invite to a page will automatically be added as **members**" [fetched] — a sharing action silently becomes a billing action.
- **Figma:** on Starter/Pro a full member "can only invite others to join with a View seat" [fetched] — invite capability is decoupled from seat-granting capability.
- [SS/inference] I found no primary source quantifying invite→activation conversion for any of these products. Do not put a conversion number in the PRD without one; every figure I could reach was a vendor marketing page or a secondhand blog.

### 7. The git-layer problem: three shipped architectures

| Architecture | Exemplar | Mechanism | Cost |
|---|---|---|---|
| **Mirror** (duplicate the provider ACL) | Sourcegraph | Polls the code host both user-centric and repo-centric, "resulting in double polling", stores results internally; unmatched identities held as "pending permissions" [fetched 2026-08-29, sourcegraph.com/docs/admin/permissions/syncing] | Staleness is structural: "in the worst case the lag time is as long as the time it takes to completely sync all user or repository permissions" — worked example: 5000 users ÷ 40 users/min = **125 minutes** worst case [fetched; arithmetic re-derived here as 5000/40 = 125] [derived]. Requires every user to link a code-host identity or "repository permissions cannot be enforced" [fetched] |
| **Bypass** (single service identity, own ACL) | Decap Git Gateway; Decap Turbo; GitBook Git Sync | Git Gateway "allows you to add editors to your site CMS **without giving them direct write access** to your GitHub or GitLab repository" [fetched 2026-08-29, decapcms.org/docs/git-gateway-backend]. Turbo: "API calls to your Git hosting platform are made server-side… using Turbo's own app/token installation — not their own Git hosting identity… Editors don't need an account on your Git hosting platform at all" [fetched] | Every commit is attributable to the app installation, not the human, unless the product adds authorship itself [inference]. GitBook restricts config: "Only administrators and creators can enable and configure Git Sync" [fetched] |
| **Delegate** (provider identity is the identity) | GitHub Apps installation tokens | Installation access token usable as the git HTTP password: `git clone https://x-access-token:TOKEN@…`; requires the "Contents" repository permission [fetched 2026-08-29, docs.github.com authenticating-as-a-github-app-installation] | The app's permission set, not the user's, bounds every action [fetched] |

- **Source disagreement / internal inconsistency, recorded not resolved:** Sourcegraph's own formula `((users × avg_repository_access)/per_page) + ((repositories × avg_users_access)/per_page)` applied to its own stated example (10,000 users, 300 repos each, 40,000 repos, 75 users each, 100/page) yields **60,000** requests [derived: (10000×300)/100 = 30,000; (40000×75)/100 = 30,000; sum 60,000], but the same paragraph states "We need to make 3M requests" and derives 25 days from 3M ÷ 5000/hr = 600 h [fetched]. The published 25-day figure does not follow from the published formula.
- **Deploy keys defeat membership entirely:** "any user who has the private key can read from or write to the repository… even if they're later removed from the organization" [fetched, GitHub repository-roles warning]. Any mirror of GitHub ACLs is therefore already incomplete.

### 8. RECOMMENDED role model for frontmatter

**Four roles. One scope. No inheritance tree.**

| Role | Can | Cannot | Justification | Anti-recommendation |
|---|---|---|---|---|
| **Owner** | everything, incl. connect/disconnect the repo, publish, unpublish, billing, delete workspace | — | Every surveyed product has exactly one terminal role and most bind it to one person: "There is only one owner per team" [fetched, Figma] | Do NOT allow multiple Owners at launch. Anti-rec: with two Owners, either can disconnect the repo the other depends on, and there is no arbiter; add co-owners only when a customer with a bus-factor complaint asks |
| **Editor** | read + write bytes (splice edits commit to the repo) | change repo connection, billing, publish/unpublish | Write is the meaningful boundary because a write is a **commit**, an irreversible external side effect [inference]. GitHub's Write, Notion's Can edit, Outline's read_write, GitBook's Editor all sit here [fetched ×4] | Do NOT split Editor into GitBook's Editor/Reviewer/Creator ladder. Anti-rec: that ladder exists to gate *change-request merges*, a workflow frontmatter does not have; adding it buys three roles and zero enforced invariants |
| **Commenter** | read + attach comments (comments live outside the file, never in the bytes) | write bytes, publish | Universal: present in Notion, Google, GitBook, Figma [fetched ×4]. Keeps the "file is the only source of truth" invariant because a comment is not a byte in the file [inference] | Do NOT ship a **Suggester** role. Anti-rec: Google Docs proves suggestion is a *mode on Commenter*, not a role [fetched]; a fifth role adds a permission cell to every future feature matrix and buys nothing an in-editor suggestion mode on Commenter does not |
| **Viewer** | read | comment, write, publish | Needed only because Commenter implies a write of *some* record; a viewer writes nothing [inference]. Google, Outline, GitBook, Figma all keep it distinct from Commenter [fetched ×4] | Do NOT merge Viewer into Commenter to save a role. Anti-rec: the merged role cannot express "share the doc, no annotation trail", which is the entire client-review use case |

**Deliberate omissions, each with its reason:**
- No **Admin** distinct from Owner [inference: at solo-founder scale the two always resolve to the same person; add when a customer has >1 workspace administrator].
- No **Triage/Maintain** analogue [inference: GitHub needs them because issues and releases exist; frontmatter has neither].
- No **per-folder** roles at launch [derived from §3: every product with ≥3 scopes ships a permissions debugger].
- No **groups/teams** [inference: groups are the mechanism behind Confluence's documented union trap [fetched]; they are worth adding only when the member count makes per-person grants tedious, which is >~15 people].

### 9. The layering rule vs the git provider

**Rule: INTERSECT on write, DEFER on connect, OWN on read-and-comment.**

- **Connect (defer):** only a GitHub identity with `admin` on the repository may connect it to frontmatter — GitHub already defines that role and it is the role that can install an App [fetched, GitHub repository-roles: manage access is Admin-only]. Anti-recommendation: do NOT let a frontmatter Owner connect a repo they only have Write on; the App installation would outlive their access and reproduce the deploy-key problem GitHub itself warns about [fetched].
- **Write (intersect, checked at commit time):** a frontmatter Editor's commit succeeds only if the acting identity *also* resolves to write access on the repo at the moment of the commit. Anti-recommendation: do NOT pre-compute and cache the intersection — that is Sourcegraph's architecture and it carries a documented worst-case staleness equal to a full sync cycle (125 min in their own example) [fetched/derived]. Check at write time; the write is already a network round-trip to the provider, so the check is free [inference].
- **Read/comment (own):** frontmatter's own Viewer/Commenter grants apply to *frontmatter's rendered projection*, not to the repo. Anti-recommendation: do NOT require a GitHub account for a reader. Decap's entire reason for existing is that "editors don't need an account on your Git hosting platform at all" [fetched]; requiring one converts every client review into a GitHub onboarding.
- **Never grant more than git grants on write; freely grant less.** Anti-recommendation: do NOT adopt Notion's broadest-wins [fetched] — with git underneath, max-wins means a frontmatter grant can exceed a revoked GitHub grant, which is a privilege-escalation bug, not a UX choice.
- **Attribution:** commits made through the bypass path must carry the human's identity in the commit trailer, not just the App's. Anti-recommendation: do NOT rely on the App identity alone — Decap Turbo's server-side model makes every commit look identical [fetched], destroying `git blame` for the user's own repo, which contradicts "the file is the only source of truth".

### 10. Link sharing and revocation semantics

- **Exactly two published states, never more:** `private` and `published-at-slug`. Anti-recommendation: do NOT ship a third "anyone with the secret link" mode. Notion documents the exact failure — unpublishing a Site does not clear the separate anyone-with-link grant [fetched] — and frontmatter has already paid once for a dual-channel revocation gap: `unpublish` called `revalidatePath('/p/<slug>')` while the live ISR page was at `/<slug>` with `revalidate = 60`, so "unpublishing purged nothing and the note kept serving from cache" [fetched 2026-08-29, commit `d50a6b2`, message §6.4].
- **Revocation must be a purge, not a flag flip, and must be verified.** Current code reads the slug *before* removal specifically so it can purge [measured 2026-08-29, `src/app/api/share/route.ts` DELETE handler: "Grab the slug BEFORE removal so we can purge its ISR-cached public page (otherwise an unpublished note stays readable at /<slug> for up to 60s)"]. Anti-recommendation: do NOT treat the `revalidatePath` return as success; add a post-unpublish fetch of `/<slug>` asserting 404, and refuse to report "unpublished" until it does [inference, and this is exactly the LR#67 write-must-be-verified class].
- **Slug entropy:** if any unlisted-URL mode ever ships, tokens must be ≥128 bits, not human-length slugs — the current slug field is 1–60 chars of user-chosen text [measured, `postSchema` in route.ts], which is enumerable by the arXiv 1604.02734 result [fetched].
- **Slug reuse:** Notion refuses reuse after deletion — "once you permanently delete a published page, its slug cannot be reused" [fetched]. Adopt it. Anti-recommendation: do NOT free slugs on unpublish; a stale inbound link would then resolve to a different document.
- **Contributor identity leak:** a published projection of a git repo exposes commit author names and **email addresses** by construction; Notion warns about exactly this for its published pages [fetched]. Strip author emails from the public projection by default. Anti-recommendation: do NOT expose a per-document toggle for it — a default-off privacy control that can be turned on per document is a leak generator.
- **Cascade:** publish exactly one file. Anti-recommendation: do NOT adopt Notion's subtree-publish [fetched] — in a git repo the subtree is the rest of the user's repository.

### 11. Invite flow

1. Owner enters an email, picks one of four roles, sends. Invite expires in **7 days** (GitHub's documented value [fetched]) and is retryable.
2. Invitee lands on the document, **reads it before authenticating** if the role is Viewer or Commenter. Anti-recommendation: do NOT gate reading behind signup — Notion requires a guest to have an account ("your guest will need their own Notion account" [fetched]) and that is the point where a client review dies.
3. Authentication for Editor is GitHub OAuth (needed for the write-time intersect, §9); for Viewer/Commenter it is next-auth email, no GitHub. [inference from §9]
4. No secret join link, no allowed-domain auto-join. Anti-recommendation: Notion's link and domain paths both add **billable members** without per-person approval [fetched] — for a solo founder selling globally, a surprise invoice is a refund and a chargeback, not a growth loop.

### 12. Billing treatment

| Class | Billed? | Justification | Anti-recommendation |
|---|---|---|---|
| Owner, Editor | Yes, per seat | These are the identities that write bytes and consume commit/API budget [inference] | Do NOT bill per document or per repo. Anti-rec: seat-based is what every surveyed vendor does [fetched ×6] and per-repo pricing punishes exactly the git-native user you want |
| Commenter, Viewer | **Never** — matches the published rule | Figma: "you can let others view and comment on your files without purchasing extra seats" [fetched]. Notion: "Guests are free of charge" [fetched] | Do NOT copy GitBook (guests and readers billed [fetched]) or GitHub (outside collaborator consumes a paid license [fetched]). Anti-rec for the rule itself: free commenters are an abuse surface — cap comment volume per workspace, not per person, and never convert the cap into a seat charge silently |
| External Editor on a repo they already have GitHub write on | Billed as an Editor seat | The intersect rule (§9) means they can commit; commits are the metered action [inference] | Do NOT make them free on the grounds that "GitHub already authorised them". Anti-rec: that gives any org with a large GitHub team unlimited free frontmatter Editors |
| Time-boxed collaborator | Editor-equivalent access, hard expiry ≤1 year, **no seat** — Notion's "temporary member" pattern [fetched] | Converts the highest-friction sale (an agency's one-off client) into a zero-decision grant [inference] | Do NOT make it renewable in-product. Anti-rec: a renewable free Editor is a free plan with extra steps |

**Recorded disagreement, unresolved:** Figma simultaneously states view-and-comment needs no extra seat *and* sells a Collab seat at $3/$5/mo [fetched 2026-08-29, same page]. I did not resolve which applies to which surface.

### 13. Anti-recommendations, standalone

- **Do not build a permissions inspector.** Anti-rec to §8's leanness: if you ever need one — Confluence ships "People who can view" and "Inspect permissions" [fetched] — the model is already too big, and the inspector is the symptom, not the cure.
- **Do not add per-folder permissions before a paying customer names the folder.** Google's own migration went the other way, removing per-file downward overrides in favour of folder inheritance [fetched].
- **Do not mirror GitHub ACLs into your database.** Beyond staleness [fetched/derived §7], it requires every user to link a code-host identity or enforcement silently fails [fetched, Sourcegraph WARNING].
- **Do not let a frontmatter role imply a git role.** Deploy keys already prove git access can outlive membership [fetched]; the inverse — frontmatter access outliving git access — is the bug you would be shipping.
- **Do not ship a "suggester" role.** [fetched, Google: suggestion is a mode on Commenter/Editor.]
- **Do not ship link-expiry as a paid-plan gate.** Google gates it to work/school accounts [fetched]; the result is that the majority of links never expire. Expiry is a safety default, not an upsell.