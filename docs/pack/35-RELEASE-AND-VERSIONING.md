---
id: 35-RELEASE-AND-VERSIONING
title: Release and versioning
mode: how-to
tier: canonical
status: living
updated: 2026-09-19
owner: sagnik
verified_against: 6c44319
covers: [release, versioning, deprecation, desktop-build, signing]
---

# 35. Release and versioning

**The starting position, measured** `[O]`. At `0af3c90`:

Fact | Command | Result
Git tags | `git tag \| wc -l` | `0`
Package version | `node -e 'console.log(require("./package.json").version)'` | `0.1.0`
Desktop version | `src-tauri/tauri.conf.json` | `0.1.0`
Rust crate version | `src-tauri/Cargo.toml` | `0.1.0`
Continuous integration | `ls .github` | **does not exist**

**So there is no release process today.** A push to `main` deploys, and nothing records what
shipped. This file specifies the scheme rather than describing one, and says so throughout.

---

## 1. The version scheme

**Three numbers, `MAJOR.MINOR.PATCH`, and what changes each is defined by the file on disk rather
than by feeling.**

Bump | When | Examples
**MAJOR** | A change that makes an existing file, export or address unreadable by the previous version | A format's carrier changes; an export's folder layout changes; a published-page URL shape changes
**MINOR** | New capability, existing files unaffected | A new block kind; a new screen; a new import source; a new provider in the chain
**PATCH** | A defect fixed, no new capability | An engine refusal corrected; a layout fix; a copy change

**The rule that decides a MAJOR, and it is the product's own law.** The file on disk is the record.
**If a document written by the previous version no longer round-trips byte-exact through the new
one, that is a MAJOR.** Nothing else is.

**Two consequences worth stating, because they are counterintuitive:**

- **A visible rewrite of the whole interface is a MINOR** if every file still reads and writes
  identically. Screens are projections.
- **A one-character change to a splice rule can be a MAJOR.** The size of the diff has no bearing.

**Pre-1.0.** The product is at `0.1.0` and unreleased. Until `1.0.0`, **MINOR carries the breaking
changes and PATCH carries everything else**, which is the ordinary pre-1.0 convention. `1.0.0` is
the first version a stranger pays for, and the plan puts money at phase H.

---

## 2. Where the version lives, and the three that must agree

File | Field | Today
`package.json` | `version` | `0.1.0`
`src-tauri/tauri.conf.json` | `version` | `0.1.0`
`src-tauri/Cargo.toml` | `[package] version` | `0.1.0`

**All three must hold the same string.** They already do, and keeping them in step is the release
step people forget. **Add a gate that fails when they diverge**, in the same spirit as `npm run
arch`; it does not exist yet.

**The desktop build is versioned against the web one, not separately.** One source tree, one
version. **What differs is the release cadence, not the number:** the web ships on every push to
`main`, and the desktop ships when somebody builds and signs it.

**So a desktop build at `0.4.0` may be weeks behind a web app at `0.4.0`.** That is the honest
position and it must be visible. **Print the build's commit, not just its version**, in the About
surface, so a bug report from the desktop can be placed in time.

**Three identifiers never change with the version**, and `AGENTS.md` section 8 explains why:
the Tauri bundle id `ai.sgnk.md`, and the legacy persistence keys. Renaming any of them orphans a
user's local state. `36-DATA-MIGRATION-PLAN.md` carries the prohibition in full.

**One naming inconsistency to record rather than paper over.** `src-tauri/tauri.conf.json` sets
`"productName": "sgnk-md"` and the window title `sgnk-md`, while the brand is **frontmatter**. The
bundle identifier must not change; **the product name and window title are display strings and
can.** Whether to change them before or with the phase F desktop rebuild is an open item.

---

## 3. Tagging, which does not exist yet

**The proposal.** An annotated tag per release, on `main`, named `v<MAJOR>.<MINOR>.<PATCH>`.

```bash
git tag -a v0.2.0 -m "0.2.0"
source /Users/sagnikmitra/.config/codex-env/tokens.zsh && git push origin v0.2.0
```

**Why annotated rather than lightweight.** A lightweight tag carries no date, no author and no
message, so it cannot answer "who released this and when" six months later.

**Never move a tag.** `65-CONVENTIONS.md` rule 3 is the general form: never renumber, supersede and
name the successor in the old record. A moved tag makes every reference to it wrong at once.

**Without tags, the only record of what shipped is the Vercel deployment list**, and a deployment
is keyed by a commit sha rather than by a version. **That is the gap tagging closes**, and it is
why section 5's rollback in `32-DEPLOYMENT-AND-OPS.md` has to work from deployment URLs.

---

## 4. The release checklist

**The gate before any release is `npm run verify`**, which is typecheck, lint, test, build, arch
and spec, in that order, failing on the first.

```bash
npm run verify
```

**The full checklist, in order. Every step is a command or a check with a result, not a judgement.**

Step | What | Pass condition
1 | `git fetch` and compare `origin/main` to `HEAD` | Not behind. **Building on a stale clone is how a version collision happens**
2 | `npm run verify` | Exit 0. Six gates
3 | `npm run corpus` | Exit 0. 8,513 byte-pinned files, **exits 1 on one changed byte**
4 | `node specs/harness/restamp-prd.mjs --check` | The specs still cite sections that exist
5 | The three version fields in section 2 | All equal
6 | `git show --name-only HEAD \| grep -vcE '<your paths>'` | Prints `0`
7 | Push, then confirm a Vercel deployment exists | An entry appears. **No entry at all means `vercel.json` is probably invalid**
8 | `curl -sI https://frontmatter.in/` | First line is a 200. **Never `-sL`**
9 | Tag, per section 3 | The tag pushed
10 | Write the release note, per section 7 | A file exists

**Two rules that override the checklist.**

- **Red proof before green.** A fix for a rare fault proves nothing until the test **fails** against
  the unfixed code. If you cannot make it fail, say the test does not cover the bug rather than
  reporting a pass. `AGENTS.md` rule 1.
- **A lane is done when its spec reaches `state: verified`, which only the harness writes.** You do
  not get to write that state by hand, and `65-CONVENTIONS.md` section 6 says a hand edit is
  reverted by the next build.

**Where the gates run.** Wherever a person or an agent runs them. There is no continuous
integration, so **a push that skipped `npm run verify` reaches production if it builds on Vercel**,
and Vercel only runs `next build`. That is recorded as the largest operational gap in
`32-DEPLOYMENT-AND-OPS.md` section 6.

---

## 5. What may ship on a Friday

**Two people run this company.** There is no on-call rota, no second shift, and nobody to hand a
broken deploy to. **The Friday rule follows from that arithmetic and not from superstition.**

May ship on a Friday | May not
A documentation change, which does not rebuild | Anything that writes to a user's files for the first time
A copy or a layout change behind no new write path | A change to the splice engine or a refusal
A fix with a red proof, whose blast radius is one screen | A schema or key-layout change. See `36-DATA-MIGRATION-PLAN.md`
A change fully covered by the corpus gate | A billing change, or anything that moves money
A revert | A new provider in the model chain
| A new integration's first write

**The test, in one sentence.** **If it goes wrong, can one person fix it alone, on a phone, without
a second person's account?** If not, it waits for Monday.

**What "waits for Monday" means precisely.** The commit lands on the branch, verified and reviewed.
It is **not pushed to `main`**, because `main` deploys.

**The honest exception.** A CRITICAL fix ships whenever it is ready, Friday included. **The reason
to delay a risky change is that nobody is watching, and a CRITICAL defect means somebody already
is.** `38-INCIDENT-AND-SEVERITY.md` defines CRITICAL: data loss, a security hole, or money moving
wrongly.

---

## 6. The desktop release

**State at `0af3c90`.** The shell loads `https://md.sgnk.ai`, builds nothing from this tree, and is
unsigned. `31-LOCAL-SETUP.md` section 5 has the detail. The phase F rebuild is where this becomes
real (`docs/mvp0/PRODUCT-PLAN.md` section 26).

**Phase F now comes early** `[Z]` (D09, 18 September): desktop alongside the web editor, not after
sync. It is batch 8, step 4 of `50-ROADMAP.md`, straight after the editor.

So the desktop release, its continuous integration and its signing are all needed sooner than this
file first assumed.

### 6.1 Building

Script | Target
`npm run tauri:build` | The host platform
`npm run tauri:build:mac-arm` | `aarch64-apple-darwin`
`npm run tauri:build:mac-intel` | `x86_64-apple-darwin`
`npm run tauri:build:mac-universal` | `universal-apple-darwin`

**Each target builds on its own runner in continuous integration.** Tauri's own documentation calls
cross-compiling Windows from macOS "a last resort", and signing it needs an external tool (F072).
**So the desktop release needs the continuous integration that does not exist yet.** It is a
dependency, not a nicety.

### 6.2 Signing, per platform

Platform | What we do | Why
macOS | **Signed on the Apple programme, 99 USD a year** | Available to us
Linux | **Unsigned, by choice** | Nothing to gain
Windows | **Signed in batch 8**, once a founder buys a route. **Shown as coming** until then | Azure Artifact Signing's public trust is closed to organisations in India (F071), re-checked below. Commercial certificates are priced below

**The Apple Developer Program is "not opened"** at `docs/mvp0/PRODUCT-PLAN.md` section 24.
It is due in phase F, which is now batch 8 at step 4.
**Until it is, every macOS build is unsigned and Gatekeeper will say so.** `src-tauri/tauri.conf.json`
has `signingIdentity`, `providerShortName` and `entitlements` all `null`.

**Do not ship an unsigned build to a stranger and explain the warning in a message.** That teaches
people to click through a security warning, which is a worse outcome than not shipping.
`39-SHARING-A-BUILD.md` covers what to do instead.

### 6.2a Pricing the Windows route

**Why now.** D09 `[Z]` put the desktop straight after the editor, and the answer itself says the
Windows certificate "is now needed sooner". Batch 1 of `50-ROADMAP.md` chooses and prices a route.

Every figure below was read from the page named, opened with `curl -sL --compressed` on 2026-09-18
UTC `[M]`. Prices are the vendor's list prices on that day, before tax.

Route | Price as the page states it | Can Studio Zephyrus, an Indian company, use it? | Source
Sectigo code signing | "starts at $536.25 per year when customers choose the five-year option". Shorter terms and EV cost more | `UNVERIFIED:` no country restriction was seen on the page. The guessed validation article returned 404 on 2026-09-19 UTC. needs: Sectigo's validation terms, asked of Sectigo when buying | `https://sectigo.com/ssl-certificates-tls/code-signing`
Certum Standard code signing | "price from € 139.00". Validity 1 to 3 years; for an individual or a company; issue time 1 to 5 days; "Cloud-based certificate availability" | **Yes, on the published terms.** Checked 2026-09-19 UTC `[M]`: the required-documents page names no country. For a company it asks an identity check of the applicant (a passport is accepted), a power of attorney only if the applicant cannot represent the company alone, and "company registration document, when the company is not listed in the registry". `UNVERIFIED:` that Certum's automatic identity check accepts an Indian passport. needs: Certum's answer at purchase | `https://www.certum.eu/en/code-signing-certificates/` and `https://support.certum.eu/en/code-signing-required-documents/`
Certum EV code signing | "price from € 329.00". Validity 1 to 3 years; organisations only | **Yes, on the published terms**, the same page as Standard, which adds a utility bill issued for the organisation. **Not worth the premium**: see the SmartScreen note below | the same two pages
Certum Open Source | "price from € 25.00". Dedicated to open source licences | **No.** frontmatter is not an open source licence product. The required-documents page adds that it is issued only for individuals and is revoked if used on software distributed commercially `[M]` | same two pages
Azure Trusted Signing, Basic | 9.99 USD a month, meter "Basic Account" | **No.** Public trust is for organisations in a listed set of countries, and India is not among them | `https://prices.azure.com/api/retail/prices?$filter=contains(serviceName,'Signing')` and `https://learn.microsoft.com/en-us/azure/artifact-signing/quickstart`
Azure Trusted Signing, Premium | 99.99 USD a month, meter "Premium Account" | **No**, for the same reason | the same two pages
Microsoft Store | No registration fee for a company account, per Microsoft's page. **It does not remove the certificate**: Tauri's Store route submits an MSI or EXE, and Microsoft requires that binary "digitally signed with a code signing certificate that chains up to" a CA in its Trusted Root Program | Yes, as a second channel once a certificate exists | `https://learn.microsoft.com/en-us/windows/apps/publish/partner-center/account-types-locations-and-fees`, `https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/msi/app-package-requirements` and `https://v2.tauri.app/distribute/microsoft-store/`, all 2026-09-19 UTC `[M]`

**The Azure answer is re-checked, not carried.** Microsoft's quickstart lists the countries whose
organisations can get public trust certificates. India is not on the list, which confirms F071.

**Two vendors could not be read from this network** `[O]`.

- DigiCert's page returned a bot-protection page instead of prices. Retried 2026-09-19 UTC: it
  redirects to a health probe. `UNVERIFIED:` its prices. needs: a browser read.
- SSL.com failed the TLS handshake through the sandbox's proxy, again on 2026-09-19 UTC.
  `UNVERIFIED:` its prices. needs: a browser read.

**What the prices do not tell us**, rechecked 2026-09-19 UTC.

- **Settled: EV buys nothing against SmartScreen.** Microsoft's page says "EV certificates no longer
  bypass SmartScreen", and that a premium for EV to avoid the warning "is no longer justified" `[M]`
  `https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/smartscreen-reputation`.
  A signed app starts with a warning either way, and reputation builds with clean installs.
- **Settled for Certum: validation of a company.** No country is named, per the Certum row above.
  Sectigo's terms were not found.
- `UNVERIFIED:` which term Certum's "price from" refers to. The page shows 1 to 3 years beside it,
  and the store (`shop.certum.eu`) did not answer from this network. needs: the store's price list.
- `UNVERIFIED:` whether cloud key storage costs extra. Certum advertises "Cloud-based certificate
  availability" and does not price it. needs: the same price list.

**Recommended route: Certum Standard, with the company's data**, needs founder (proposed 19 Sep,
founder review). It is the cheapest route seen that names no bar to an Indian company, and EV's
extra €190 buys no SmartScreen standing. Rejected: Sectigo, dearer and its terms unread.

Then list the signed app in the Microsoft Store as well, which costs nothing more.

The founder chooses, because it is money. **Buying one is a paid action for a founder, never for an
agent.**

`INFERENCE:` the certificate belongs to the company, not a founder, because D10 `[Z]` moves every
account to the company before the first stranger.

### 6.3 Desktop bundle facts

Field | Value
Bundle identifier | `ai.sgnk.md`. **Never change it**
Product name | `sgnk-md`. A display string; see section 2
Targets | `dmg` and `app`
Minimum macOS | `11.0`
Category | `Productivity`
Capabilities | `core`, `event`, `window`, `webview`, `shell`, `os`, `process`, `dialog`, clipboard read and write. **Adding one is a security change**

---

## 7. Release notes

**One file per release**, and the shape is fixed so it can be read by a person and by a tool:

```
## v0.2.0 - 2026-10-14
Commit: <sha>

### Changed for a person
- ...

### Changed for a file
- ...   (any change to what gets written to disk)

### Refusals added or changed
- nf-NNN-slug: ...

### Migrations
- ...   (or: none)

### Known, not fixed
- ...
```

**The second and third headings are the ones that matter here and would be missing from a generic
template.** The product's promise is about bytes and about refusing rather than guessing. **A
release that changed either must say so in its own section**, where somebody scanning cannot miss
it.

**"Known, not fixed" is not optional.** A release note with no known issues is either a very small
release or a dishonest one.

---

## 8. Deprecation

**The rule from `65-CONVENTIONS.md`, applied to shipped things.** Never renumber, never reuse, never
silently remove. **Supersede, and name the successor in the old record.**

### 8.1 A format

`docs/mvp0/PRODUCT-PLAN.md` section 20 sets the procedure, and it is short:

- **The version field rises.**
- **The old version is still read.**
- **The map shows which version a kit carries.**

**Every format carries four things**, without exception (`docs/mvp0/PRODUCT-PLAN.md` section 20): a
version field, a rule for unknown fields, a stated degradation in a plain markdown reader, and a
test. **Unknown fields are ignored and kept, never dropped**, which is what makes a forward version
safe to open in an older build.

### 8.2 An identifier

**An id is never reused and never renumbered.** If `F031` is withdrawn, its row stays and says so.
The status vocabulary carries `withdrawn` for features, `superseded` for documents and `reversed`
for decisions precisely so a thing can be retired in place.

### 8.3 A persistence key

**It cannot be deprecated. It can only be migrated.** `36-DATA-MIGRATION-PLAN.md` carries the
named prohibition, and it is absolute: renaming a legacy `sgnk-md` key silently orphans a user's
local drafts and settings.

### 8.4 An API or a route

Stage | What happens | Minimum
1 | Ship the successor. Both work | one release
2 | The old one warns in its response, and the release note names the successor | one release
3 | The old one returns a refusal that **names where the thing went** | permanent

**Stage 3 is permanent, not a removal.** A 404 tells somebody they are wrong; a refusal that names
the successor tells them what to do. **Refusing usefully is this product's whole differentiation**,
and it applies to its own surfaces too.

---

## 9. Cadence, honestly

**The appetite is twenty-seven weeks at full time** across phases 0 to H
(`docs/mvp0/PRODUCT-PLAN.md` section 26).

**At the measured pace, which the audit recomputed at 0.93 to 1.21 days a week, that is 99 to 129
calendar weeks** `[R]`.

**So a release calendar with dates on it would be fiction.** What the plan commits to instead is
**publishing the pace every Friday** (phase 0). That is a different promise and a keepable one:
not "it ships on this date" but "here is how far it got this week".

**The release cadence that follows.** Ship when a phase's scope is done and verified, tag it, write
the note. **Do not batch releases to hit a date, and do not release to have released.**

---

## 10. Limits of this file

**What was not assessed.**

- **No release has ever been made**, so nothing here has been exercised. Sections 3, 4, 7 and 8 are
  a proposal.
- The Apple notarisation flow. The programme is not opened, so the steps beyond signing were not
  written and would be invented if they were.

**What could not be verified.**

- The three gates, run on 2026-09-18 at `e0f6f89` `[O]`. `npm run corpus` printed `CORPUS CLEAN`
  and `8513/8513 byte-identical`, exit 0. `node specs/harness/restamp-prd.mjs --check` printed `0 broken
  citations`, exit 0. Inside `npm run verify`: typecheck and lint passed, the tests printed `1598
  passed | 6 expected fail (1604)`, `npm run arch` printed `"total": 0`, and `npm run spec` printed
  `0 errors`.
- `UNVERIFIED:` `npm run build`, the fourth step of `verify`. In this session it stopped at
  `Failed to fetch Google Sans from Google Fonts` (quoted without its inner backticks), because the sandbox blocks that host. Needs: the
  same command on an open network, or on Vercel.
- Where Tauri reads its version, answered `[M]` from `https://v2.tauri.app/reference/config/`, opened
  2026-09-18: `version` is `a semver version number or a path to a package.json file`, and `If removed
  the version number from Cargo.toml is used.` So `tauri.conf.json` wins, and it does not read
  `package.json` unless pointed at it. **Resolved (proposed 18 Sep, founder review):** set it to
  `"../package.json"`, so one file carries the version. Rejected: three hand-kept copies, which agree
  today only by care.
- The Windows certificate position. Re-fetched 2026-09-18 UTC `[M]`: Microsoft's quickstart still
  excludes India from public trust, section 6.2a. DigiCert and SSL.com could not be read.

**What is not established.**

- Whether the desktop should carry its own version once it diverges from the web app. Section 2
  argues one version and one commit line; a reader could reasonably argue two.
- Whether `productName` should change from `sgnk-md` to `frontmatter`, and when. Section 2 records
  the inconsistency without resolving it.
- Where the pre-release gates should run. Section 4 restates the gap rather than closing it.

**What would falsify this file.**

- `git tag` returning a tag whose name does not match `v<MAJOR>.<MINOR>.<PATCH>`.
- The three version fields in section 2 disagreeing, which would mean the step-5 check is needed
  and is not happening.
- A shipped release with no note, which would mean section 7 is aspirational rather than a process.
