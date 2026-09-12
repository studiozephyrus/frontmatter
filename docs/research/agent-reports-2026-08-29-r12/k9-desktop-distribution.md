### Current state, measured before anything else

- `src-tauri/tauri.conf.json` sets `"frontendDist": "https://md.sgnk.ai"`, `"devUrl": "https://md.sgnk.ai"`, and `windows[0].url` to the same host — the shell loads remote content, not bundled assets [measured, read 2026-08-29].
- `bundle.macOS.signingIdentity: null`, `providerShortName: null`, `entitlements: null`; `bundle.targets: ["dmg","app"]`; `app.security.csp: null` [measured].
- The config's `productName` is `sgnk-md`, `identifier` `ai.sgnk.md`, and `src-tauri/Cargo.toml` describes it as "sgnk-md — Obsidian on the web, as a native macOS app" [measured]. This is **not** a frontmatter-branded bundle; it is a different product's shell living in this repo. Identifier and product name changes force a new App ID, new provisioning profile, and a new Gatekeeper/updater identity later.
- `Cargo.toml` dependencies: `tauri` (feature `macos-private-api`), plugins `shell`, `os`, `process`, `clipboard-manager`, `dialog`. **No `tauri-plugin-fs`, no `tauri-plugin-updater`** [measured]. The shell currently has no local-filesystem capability and no update channel at all.
- `package.json` pins `@tauri-apps/api ^2.11.0`, `@tauri-apps/cli ^2.11.2`; scripts exist for `aarch64-apple-darwin`, `x86_64-apple-darwin`, `universal-apple-darwin` and nothing for Windows or Linux [measured].
- Host macOS is 26.6.2 (build 25G83) [measured] — i.e. past the Sequoia Gatekeeper tightening described below.
- Tauri v2 defaults `bundle.macOS.hardenedRuntime` to `true` (`default = "default_true"`, and `hardened_runtime: true` in the `Default` impl) [fetched, `crates/tauri-utils/src/config.rs`, dev branch]. Hardened runtime is applied to executables **only when a signing identity exists**; with `signingIdentity: null` nothing is signed at all [fetched, `crates/tauri-bundler/src/bundle/macos/sign.rs`].

### Cost table

| Item | Price | Cadence | Source / date |
|---|---|---|---|
| Apple Developer Program | 99 USD | per membership year | developer.apple.com/support/compare-memberships [fetched 2026-08-29] |
| Microsoft Partner Center dev account (Individual **or** Company) | **0 USD** | one-time, new onboarding flow only | learn.microsoft.com Partner Center account-types-locations-and-fees: "there are no registration fees for either account type" [fetched 2026-08-29] |
| Azure Trusted Signing — Basic account | 9.99 USD | per month | prices.azure.com retail API, `serviceName eq 'Trusted Signing'` [fetched 2026-08-29] |
| Azure Trusted Signing — Premium account | 99.99 USD | per month | same [fetched] |
| Azure Trusted Signing — signature overage | 0.005 USD | per signature above quota | same [fetched]. Included-quota count did not appear in the API response — **unverified** |
| Windows OV / IV code-signing cert (Comodo, Sectigo) | 219 USD | per year | ssldragon.com comparison table [fetched 2026-08-29] |
| Windows OV (GoGetSSL) | 289 USD | per year | same [fetched] |
| Windows OV (DigiCert) | 400 USD | per year | same [fetched] |
| Windows EV (Comodo, Sectigo) | 287 USD | per year | same [fetched] |
| Windows EV (GoGetSSL) | 369 USD | per year | same [fetched] |
| Windows EV (DigiCert) | 685 USD | per year | same [fetched] |
| Hardware token surcharge | +50–150 USD typical; DigiCert token +120 USD | one-time | search summary [SS 2026-08-29] |
| GitHub Actions — Linux 2-core x64 | 0.002–0.006 USD | per minute (slim / standard) | docs.github.com actions-minute-multipliers [fetched 2026-08-29] |
| GitHub Actions — Windows 2-core x64 | 0.010 USD | per minute | same [fetched] |
| GitHub Actions — macOS 3/4-core | 0.062 USD | per minute | same [fetched] |
| GitHub Actions — macOS 12-core (`macos_l`) | 0.077 USD | per minute | same [fetched] |
| Included Actions minutes | 2,000 (Free) / 3,000 (Pro) / 3,000 (Team) | per month, private repos only | docs.github.com Actions billing [fetched 2026-08-29] |
| R2 storage | 0.015 USD / GB-month; 10 GB-month free | monthly | developers.cloudflare.com/r2/pricing, page last updated 2026-08-07 [fetched 2026-08-29] |
| R2 egress | **Free**, all storage classes | — | same [fetched] |
| R2 Class B ops (update-manifest reads) | 0.36 USD / million; 10 M free/month | monthly | same [fetched] |
| Mac App Store commission | 15% under Small Business Program (≤1 M USD proceeds prior calendar year), else standard rate | per sale | developer.apple.com/app-store/small-business-program [fetched 2026-08-29] |

**Source disagreement, recorded not resolved:** ssldragon.com is a reseller, not the issuing CA. Its DigiCert OV/EV figures (400 / 685 USD) sit above the 549–560 USD reseller figures returned by other resellers in search results, and SSL.com's own product pages returned HTTP 404 through curl on 2026-08-29 so no CA-direct list price was obtained [measured]. Treat all Windows cert prices as reseller quotes, not CA list.

**Two dated deadlines from search summary, not opened, therefore unverified:** publicly-trusted cert max validity drops to 460 days from 2026-03-01, and DigiCert stops issuing 2- and 3-year code-signing certs from Feb 2026 [SS 2026-08-29]. If true, multi-year cert prepayment is no longer a lever.

### Derived CI cost per release

Build minutes are estimates, not measurements — no release build was run here [inference: Linux 12 min, Windows 15 min, macOS universal 30 min for a cold Rust release build with `lto = true`, `codegen-units = 1`, which is what `[profile.release]` sets [measured]].

- Linux: 12 × 0.006 = **0.072 USD** [derived]
- Windows: 15 × 0.010 = **0.150 USD** [derived]
- macOS universal (one runner, both arches): 30 × 0.062 = **1.860 USD** [derived]
- **Per release: 2.082 USD** [derived]
- Two releases/week: 104 × 2.082 = **216.53 USD/year** [derived]
- macOS is 89.3% of that (1.860 / 2.082) [derived] — the only CI line worth optimising.
- Public repository → all of the above is 0 USD; Actions minutes are free for public repos [fetched].

**Year-1 floor, direct distribution, three platforms, private repo:** 99 (Apple) + 219 (Windows OV) + 216.53 (CI) + 0 (Partner Center) + ~0 (R2 under free tier) = **534.53 USD** [derived]. Substituting Azure Trusted Signing Basic for the OV cert: 99 + 119.88 + 216.53 = **435.41 USD** [derived], a 99.12 USD/year saving [derived].

**R2 hosting sizing:** 3 artifacts × ~15 MB × 104 releases = 4.68 GB/year cumulative [derived, artifact size = inference]. Under the 10 GB-month free tier if you prune old releases; egress is free regardless of download volume [fetched].

### macOS signing + notarisation runbook

1. Enrol in the Apple Developer Program (99 USD/yr). Only the **Account Holder** can create a Developer ID Application certificate, though the CSR may carry a different Apple ID's email [fetched, Tauri macOS signing guide].
2. Generate a CSR on the Mac, create a **Developer ID Application** certificate (not Apple Distribution — that is App Store only), download the `.cer`, open it into the **login** keychain [fetched, same].
3. `security find-identity -v -p codesigning` → the printed name is the value for `bundle.macOS.signingIdentity` or the `APPLE_SIGNING_IDENTITY` env var [fetched].
4. For CI: export the `.p12` from Keychain Access → `openssl base64 -A -in cert.p12 -out cert-b64.txt` → set `APPLE_CERTIFICATE` and `APPLE_CERTIFICATE_PASSWORD` [fetched]. Tauri verifies the certificate identity matches the configured identity and errors if not [fetched, `sign.rs`].
5. Hardened runtime: leave `hardenedRuntime` at its `true` default; it is applied per-executable during signing [fetched, `sign.rs` line 68]. Apple requires it for notarisation [fetched, Apple "Notarizing macOS software before distribution"].
6. Entitlements: create `src-tauri/Entitlements.plist`, point `bundle.macOS.entitlements` at it [fetched, Tauri macOS App Bundle guide]. Apple forbids `com.apple.security.get-task-allow` set true in anything submitted for notarisation [fetched, Apple].
7. Notarisation credentials, either triple: `APPLE_ID` + `APPLE_PASSWORD` (an app-specific password) + `APPLE_TEAM_ID`, **or** `APPLE_API_KEY` + `APPLE_API_ISSUER` + `APPLE_API_KEY_PATH` (Tauri also auto-searches `./private_keys`, `~/private_keys`, `~/.private_keys`, `~/.appstoreconnect/private_keys` for `AuthKey_<key>.p8`) [fetched, `sign.rs` lines 99–140]. Prefer the API key: it is scoped and revocable without touching the Apple ID.
8. Under the hood the flow is `xcrun notarytool submit <zip|dmg> --keychain-profile … --wait`, then staple. `altool` has been dead since **2023-11-01** [fetched, Apple].
9. Ship `.dmg`; the notary service accepts UDIF disk images and processes nested containers, generating tickets for the dmg, any pkg, and the inner `.app` [fetched, Apple].
10. Also set `bundle.macOS.minimumSystemVersion`. Current config says `"11.0"` [measured]; Tauri's default floor is 10.13 [fetched].

**Without notarisation, on current macOS:** since macOS Sequoia, users can **no longer Control-click to override Gatekeeper**; they must go to System Settings → Privacy & Security and explicitly allow the app [fetched, developer.apple.com/news, dated 2024-08-06]. That is a three-step detour on a first launch, on a machine at 26.6.2 [measured]. Separately, unsigned Apple Silicon builds downloaded from GitHub releases are frequently reported by macOS as "damaged"; Tauri's own guidance is to configure an **ad-hoc signing identity** to avoid this if you build without a certificate [fetched, Tauri GitHub pipeline guide].

### Windows signing runbook

- The June 2023 CA/Browser Forum change is real and is the whole story: §6.2.7.4.2, effective **2023-06-01**, requires code-signing subscriber private keys in a Hardware Crypto Module meeting §6.2.7.4.1(7-9); the document also references FIPS 140-2 level 2 (or equivalent) for subscriber key protection and FIPS 140-2 level 3 / 140-3 level 3 for CA-transported keys. Latest Code Signing Baseline Requirements: **v3.11.0, dated June 16, 2026** [fetched, cabforum.org 2026-08-29].
- Consequence: you cannot receive a `.pfx` by email any more. Every OV or EV cert arrives on a USB token, an HSM, or a cloud-signing service.
- Tauri's Windows signing guide explicitly scopes itself to "OV code signing certificates acquired **before June 1st 2023**" and to Azure Key Vault; for EV and post-2023 OV it defers to the issuer's own documentation and the custom-sign-command escape hatch [fetched].
- SmartScreen, from Tauri's guide verbatim in substance: an **EV** cert receives immediate Microsoft SmartScreen reputation and shows no warning; an **OV** cert is cheaper and available to individuals but **SmartScreen still warns** until reputation accumulates, with manual submission to Microsoft as an unguaranteed accelerator [fetched].
- Reputation is per-file-hash for OV [fetched, ssldragon comparison table] — meaning every release restarts the climb. For a solo founder shipping weekly, OV reputation may never converge.
- **Azure Trusted Signing** (Microsoft's managed service, now labelled "Artifact Signing" in the live docs) does zero-touch lifecycle management inside FIPS 140-3 level 3 HSMs [fetched, learn.microsoft.com]. Basic 9.99 USD/mo [fetched]. This sidesteps the token entirely — no USB dongle to plug into a CI machine that does not exist.
- Individual eligibility for Trusted Signing was not confirmed from the fetched pages — the overview page text extracted did not state the identity-validation requirements. **Unverified.** Verify before budgeting on it.

### Linux packaging: which formats actually reach users

- Tauri v2 produces AppImage, deb, rpm, and documents Flathub and Snapcraft as separate distribution guides [fetched, Tauri distribute nav].
- Flathub, live totals: **4,613,773,522 downloads, 3,631 apps, 2,164 verified apps**; India 96,252,930, Germany 489,832,076, Brazil 377,790,156, US not shown in the head of the response [fetched, flathub.org/api/v2/stats, 2026-08-29]. This is the only Linux channel with a public, verifiable install denominator.
- Flatpak packaging for Tauri is genuinely painful: you must vendor both npm and cargo sources offline via `flatpak-node-generator` and `flatpak-cargo-generator.py`, add `flatpak-builder-tools` as a git submodule, and hand-author AppStream metainfo XML [fetched, Tauri Flathub guide]. This is a multi-day task, not an afternoon.
- AppImage is what Tauri's updater natively re-uses on Linux: it ships `myapp.AppImage` plus `myapp.AppImage.sig` and updates in place [fetched, Tauri updater doc].
- Snap is absent from the updater's artifact list [fetched] and its store backend is single-vendor.

### Updater design, rollback, and key custody

**Mechanism, as documented:**
- Signature verification "cannot be disabled" [fetched, Tauri updater doc]. Two keys from `tauri signer generate -w ~/.tauri/myapp.key`; the **public** key goes into `plugins.updater.pubkey` as literal content — a file path is rejected [fetched].
- `bundle.createUpdaterArtifacts: true` emits `.sig` alongside `myapp.app.tar.gz` (macOS), `myapp-setup.exe` / `myapp.msi` (Windows), `myapp.AppImage` (Linux) [fetched].
- Endpoints are an array; TLS enforced in production; the updater advances to the next URL only on a non-2XX [fetched]. Template variables: `{{current_version}}`, `{{target}}` (`linux|windows|darwin`), `{{arch}}` (`x86_64|i686|aarch64|armv7`) [fetched].
- Static manifest keys: `version` (SemVer, leading `v` optional), `notes`, `pub_date` (RFC 3339), `platforms["OS-ARCH"].{url,signature}`. Required: `version`, `platforms.[target].url`, `platforms.[target].signature`. **Tauri validates the whole file before checking the version field**, so one malformed platform entry breaks updates for every platform [fetched].
- Windows `installMode`: `passive` (default, progress bar, no interaction), `basicUi`, `quiet` (cannot self-elevate; user-wide installs only) [fetched].

**Rollback — the only supported mechanism:** run a *dynamic* update server and override the plugin's `version_comparator`; the doc states this installs the version the server sends and is "useful if you need to roll back your app" [fetched, `UpdaterBuilder::version_comparator`]. A static JSON on R2 cannot roll back, because the client's internal SemVer check refuses a lower version. **Design consequence:** if you want rollback, the endpoint must be a Cloudflare Worker in front of R2 from day one, not a static file you promise to upgrade later — the comparator override is compiled into the client binary, so retrofitting it requires shipping a new build to the exact population you are trying to rescue [inference].

**Key custody for a solo founder.** The failure mode is stated plainly in Tauri's own docs: lose the private key and "you will NOT be able to publish new updates to the users that have the app already installed" [fetched]. There is no revocation, no second signer, no key rotation path in the manifest format. Concretely:
- `TAURI_SIGNING_PRIVATE_KEY` and `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` must be env vars; **`.env` files do not work** [fetched].
- Recommended custody: password-protect the key (the optional password field), store the encrypted key in a password manager **and** on two offline media in two physical locations, and put the CI copy in GitHub Actions secrets. Three independent copies, because the recovery cost is "every installed user is stranded forever."
- Do not conflate this key with the Apple certificate or the Windows cert. Apple and Windows certs expire and can be re-issued; the minisign key cannot be replaced without abandoning the installed base [inference, from the doc's own wording].
- Note the asymmetry: `signingIdentity: null` today is a recoverable mistake; a lost updater key is not.

### Is the thin shell a legitimate v1, or a trap?

**It is legitimate as a v0 marketing artifact and a trap as a v1 product — and for this specific product the trap is sharper than usual.**

Reasoning, in order of force:

1. **The remote origin is itself an unsigned auto-update channel.** With `frontendDist: "https://md.sgnk.ai"` [measured], every web deploy silently changes what the installed desktop app executes, with no minisign signature, no version gate, no rollback, and no user consent. You would be running two update channels: one cryptographically verified and un-disableable (the Tauri updater), and one that bypasses it entirely. Shipping a signed, notarised binary around that is security theatre — the notarisation attests to a shell whose contents you can swap at will [inference, from `frontendDist` value [measured] + updater signature model [fetched]].
2. **`csp: null`** [measured] on a remote-origin window removes the one mitigation Tauri offers for exactly this configuration.
3. **The shell cannot do the product's core job.** frontmatter's thesis is "the file is the only source of truth" and byte-preserving splice edits that refuse rather than guess. There is no `tauri-plugin-fs` in `Cargo.toml` [measured] — the desktop app cannot open a local file. What the desktop build adds over a browser tab today is: a dock icon, a window chrome (`titleBarStyle: "Overlay"`, `hiddenTitle: true` [measured]), and a worse offline story than a PWA. A user who downloads a *desktop markdown editor* and finds it cannot open `~/notes/x.md` has been mis-sold.
4. **Offline is not degraded, it is absent.** No bundled assets means no window content without a network.
5. **The costs you'd pay are not the costs you'd learn from.** 99 USD + 219 USD + notarisation plumbing buys you a signed wrapper around a URL. None of that work is wasted later — but none of it validates the thing that is actually hard (local file access under sandbox/entitlement constraints).

**The narrow case where it is legitimate:** as an unsigned or ad-hoc-signed internal/beta artifact, distributed to people you can tell "this is a wrapper", to smoke-test window chrome, menus, deep links, and the OS integration surface before committing to bundled assets. That is a week of value, not a shipping posture.

**Anti-recommendation:** do not read this as "rewrite everything to bundled assets before shipping any desktop build." A hybrid is defensible and cheaper: bundle the editor shell locally (`frontendDist` → a real build directory), keep auth/sync/AI as network calls, and set a real CSP. That gets file-truth, offline, and a single verified update channel without abandoning the web codebase. What is not defensible is signing and notarising the URL-wrapper and calling it v1.

### Which platforms to ship in v1

**Ship macOS only. Direct download, Developer ID, notarised, `.dmg`, Tauri updater with a Worker-backed dynamic endpoint on R2.**

- Cost: 99 USD/yr + ~193 USD/yr CI if macOS-only and private (104 × 1.860) [derived], or 99 USD/yr flat on a public repo [fetched].
- macOS is where paid, opinionated, file-first markdown editors have their buying population, and it is the platform where notarisation converts a scary three-step Settings detour into a normal open [fetched, Apple news 2024-08-06].
- You own a Mac [measured, `sw_vers` 26.6.2], so local signing and notarisation are debuggable without CI in the loop.

**Windows in v1.5, gated on validating Azure Trusted Signing individual eligibility.** If eligible: 9.99 USD/mo, no dongle, HSM-backed [fetched]. If not eligible, the honest options are a 219 USD/yr OV cert with a persistent SmartScreen warning [fetched] or a 287 USD/yr EV cert with immediate reputation [fetched] — and for a solo founder selling globally from India, EV's business-vetting is the real cost, not the 287 USD.

**Linux in v2 as AppImage only**, because it is the format Tauri's updater natively re-uses [fetched] and it requires no store relationship. Flathub only if a user asks twice.

**Do not ship to the Mac App Store in v1.** App Sandbox is mandatory for MAS [fetched, Apple App Sandbox doc]. The sandbox gives unrestricted access to a container directory and explicitly **not** to the user's home folder [fetched]. A vault-shaped editor that wants to hold a folder open across launches must route every path through user-selected open panels and persist security-scoped bookmarks — a real architecture constraint on an engine whose entire premise is "locate the byte range in *the* file" [inference; the bookmark mechanics were not opened, so treat the specifics as unverified]. Add MAS-only requirements: provisioning profile embedded as `embedded.provisionprofile`, `bundle.category` set, `ITSAppUsesNonExemptEncryption` declared, a separate `tauri.appstore.conf.json`, and a `universal-apple-darwin` build [fetched, Tauri App Store guide] — plus 15% commission [fetched].

**Anti-recommendation to the macOS-only call:** if your actual early buyers are Windows-first (check your web analytics before deciding — that number was not measured here), then macOS-only is vanity and you should invert the order. And if you ship macOS-only, say so on the download page rather than shipping a broken Windows build to look complete.

### Anti-recommendations

- **Do not buy an EV certificate first.** 287–685 USD/yr [fetched] plus business vetting, to solve a warning you have not yet observed a user hit. Ship OV or Trusted Signing, measure the drop-off, then escalate. *Counter-case:* if you ever sign a kernel-mode driver — you will not — EV is the only path [fetched].
- **Do not skip notarisation to save time.** The Control-click escape hatch is gone as of Sequoia [fetched 2024-08-06]; the cost of not notarising is now a Settings pane visit on first run, on every current Mac.
- **Do not use a static JSON manifest if you want rollback.** Only the dynamic-server + `version_comparator` override path supports serving a lower version [fetched]. *Counter-case:* if you accept forward-only fixes, static JSON on R2 is materially simpler and the egress is free [fetched].
- **Do not generate the updater key on a CI runner or paste it into a `.env`.** `.env` files are explicitly non-functional for `TAURI_SIGNING_PRIVATE_KEY` [fetched], and the key is unrecoverable [fetched].
- **Do not put Flatpak in v1.** The offline npm+cargo source vendoring plus AppStream metainfo is a multi-day build [fetched]. *Counter-case:* Flathub is the only Linux channel with a verifiable 4.6 B-download denominator [fetched] — it is the right v2 target, not the wrong idea.
- **Do not ship Snap.** Absent from Tauri's updater artifact matrix [fetched] and single-vendor.
- **Do not rename `sgnk-md` → `frontmatter` after you have shipped signed builds.** `identifier` is the Bundle ID that must match the App Store Connect record and the provisioning profile [fetched]. Rename now, while the installed base is zero.
- **Do not run the release matrix on a private repo while iterating.** macOS is 89.3% of per-release CI cost [derived]; public repos are free [fetched]. *Counter-case:* if the repo must stay private, cache aggressively (`swatinem/rust-cache@v2` is in Tauri's own reference workflow [fetched]) and gate the matrix on tags, not on pushes.
- **Do not treat "signed and notarised" as "secure" while `frontendDist` is a URL and `csp` is `null`** [measured]. Signing attests to the shell; the payload is whatever you deployed to `md.sgnk.ai` thirty seconds ago.