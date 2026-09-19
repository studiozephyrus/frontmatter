---
id: 29-PLATFORM-AND-DESKTOP-SPEC
title: Platform, desktop and phone
mode: reference
tier: canonical
status: living
updated: 2026-09-19
owner: sagnik
verified_against: 6c44319
covers: [platform, desktop-capabilities, pwa, phone, parity]
---

# 29. Platform, desktop and phone

Three surfaces from one source tree: the web app, a Tauri v2 desktop shell, and the phone layout of
the same web app. A progressive web app already partly ships. A native mobile app is eventually
planned.

**A note on the line citations in this file.** They were resolved against commit `e532e32` on
2026-09-18. `docs/mvp0/PRODUCT-PLAN.md` is being edited by other writers in the same pass and its
line numbers moved by twelve while this file was written. **Confirm a citation by the phrase rather
than by the number** if the two disagree.

**When the desktop is built** `[Z]` (D09, 18 September): early, alongside the web editor, not after
sync. Phase F is batch 8, and it runs at step 4 of `50-ROADMAP.md`, straight after the editor.

- **What it has at that step:** the editor, Doc mode, the AI box, the engine, the change queue's
  first form, and our canonical copy from batch 2.
- **What it lacks until later steps:** sharing and publishing (batch 4, step 6), agent proposals
  through the server (batch 10a, step 7), and the GitHub and Drive mirror (batch 5, step 8).
- **What moved with it:** a signed Windows build, from Later. Its certificate is priced in batch 1,
  per `35-RELEASE-AND-VERSIONING.md` section 6.2a.

---

## 1. The rule that decides every row below

**The web is the product. The desktop app is the web app with four things the web cannot do.**

That is not a preference, it is the 18 September decision applied. The founders were asked whether
idea mode should be desktop-only and the answer was both, with the desktop app earning its download
on capability rather than on exclusivity (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:243`).

**The four things.** The local model, the watched folder, quick capture, and no caps. Everything else
is identical by construction, because the desktop shell loads the same web application.

---

## 2. Idea mode is on the web, and why

`[Z]` Decided 18 September. Idea mode, the blueprint and the map are on the web, not desktop-only.
Five reasons, each of which is a constraint rather than an opinion.

1. **The blueprint exists to be handed to an agent.** Its output is an unlisted link and a kickoff
   prompt. **If the making is desktop-only but the output must be web-reachable, the feature is split
   from its purpose** (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:247`).
2. **Agents read over the web, close to two to one against humans**, and 83 per cent of that arrives
   by the markdown route. A desktop-only surface cannot serve an agent in continuous integration, on
   a teammate's machine, or one running while the laptop is shut.
3. **It is one of the two funnels.** Phase 0's gate is twenty blueprints made for twenty people
   outside the studio (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:253`). Those people will not install
   an app first.
4. **It fights the founders' own rule.** No captchas, no puzzles, no tour, one tap. **A required
   download is a larger barrier than any of those**
   (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:256`).
5. **The progressive web app narrows the gap anyway.** Once it ships, the desktop app's real
   advantages are the watched folder, the file system and a local model
   (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:257`).

**The consequence for file 27.** The model routing table sends a desktop edit to a local Ollama
model, and a web edit to the free chain. **Idea mode being on the web means the blueprint's fifteen
calls run against the pooled free chain**, not against somebody's laptop, which is why the capacity
arithmetic in file 27 section 8 counts the blueprint at all.

---

## 3. What is identical, what differs, what is desktop-only

### 3.1 Identical, because it is the same application

Area | Why it cannot differ
The editor, the splice engine, the change queue | One source tree. The desktop shell is a webview over the same build
Doc mode, problems, the formatter, the map | Same
Idea mode, the blueprint, the fifteen files | Section 2
Sign-in, accounts, plans, entitlements | One `limitsFor(account)`, file 28 section 9
Published pages and share links | They are URLs. A desktop app cannot have its own
The design system, the icons, dark mode | One `globals.css`

### 3.2 Differs by surface, and the difference is a platform fact

Thing | Web | Desktop | Phone
Where bytes live while offline | IndexedDB or the origin private file system | **Files on disk** | IndexedDB, with Safari's seven-day rule below
Document cap | the plan's `limits.docs.cloud` | **none** | as web
AI edit when the layer is degraded | the exhaustion ladder of file 27 section 7 | **the local model takes over** (`docs/mvp0/SCREENS.md:269`) | as web
Navigation | tree plus right pane | tree plus right pane, plus a native menu bar | **a five-destination bar**, and the tree and right pane become drawers
Window chrome | the browser's | `titleBarStyle: "Overlay"`, `hiddenTitle: true`, `macOSPrivateApi: true` | none
Storage ceiling | per browser, section 6.1 | the disk | per browser

### 3.3 Desktop-only, and this is the whole reason to download it

Capability | What it is | State
**The local model** | Medium and High idea depth run on the machine, free, with nothing leaving it. `llama3.2:3b` at 2.0 GB, `qwen3:4b` at 2.5 GB, `gemma3:4b` at 3.3 GB and `qwen3:8b` at 5.2 GB fit an 8 GB machine | `specified, not built`
**The watched folder** | An agent editing on disk feeds the change queue (`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:264`) | `specified, not built`, and **blocked by the capability set**, section 4.3
**Quick capture** | A global shortcut opens one box that saves into an inbox note. No credits (`docs/mvp0/SCREENS.md:284`) | `specified, not built`, and **blocked by the capability set**
**No caps** | The document limit does not apply to files on disk | `specified, not built`
**Local speech recognition** | Voice dictation recognised on the machine by `whisper.cpp`, so speech never leaves it, and it works offline. Added 19 September, section 4.5 | `specified, not built`
**Native text recognition for scanned PDFs** | The Tesseract binary reads scanned pages on the machine, with no per-conversion cap. Added 19 September, section 4.5 | `specified, not built`
A native menu bar | Already built. File, Edit, View and Window, with `CmdOrCtrl+N`, `CmdOrCtrl+B`, `CmdOrCtrl+P`, `CmdOrCtrl+K`, `CmdOrCtrl+Shift+F` | **built**

**Three of the four carrots are not built, and two of them cannot be built without changing the
capability set.** That is the single most important sentence in this file, and section 4.3 is why.

---

## 4. The Tauri v2 shell, as it actually is

`[O]` Read from `src-tauri/` at commit `e532e32` on 2026-09-18.

### 4.1 The configuration

Key | Value in `src-tauri/tauri.conf.json`
`productName` | `sgnk-md`
`version` | `0.1.0`
`identifier` | **`ai.sgnk.md`**
`build.frontendDist` | **`https://md.sgnk.ai`**
`build.devUrl` | **`https://md.sgnk.ai`**
`app.windows[0].url` | **`https://md.sgnk.ai`**
`app.windows[0].title` | `sgnk-md`
`app.windows[0]` size | 1280 by 800, minimum 640 by 480, centred, resizable
`app.macOSPrivateApi` | `true`
`app.security.csp` | **`null`**
`bundle.targets` | **`["dmg", "app"]`**
`bundle.macOS.minimumSystemVersion` | `11.0`
`bundle.macOS.signingIdentity` | **`null`**
`bundle.macOS.entitlements` | **`null`**

**The bundle id `ai.sgnk.md` may not change.** `AGENTS.md:188` records it alongside the persistence
keys that keep the legacy prefix on purpose. Changing the identifier makes macOS treat the build as a
different application, which orphans everything the old one stored and breaks the upgrade path for
anyone already running it. **The user-visible brand is `frontmatter`; the identifier is not the
brand.**

### 4.2 A defect that has to be fixed before anybody downloads this

**The desktop shell loads `https://md.sgnk.ai`, which is the sibling product, not frontmatter.**
The string appears three times: `build.frontendDist`, `build.devUrl` and the main window's `url`.
`31-LOCAL-SETUP.md` section 5 records the same state from the setup side, and
`35-RELEASE-AND-VERSIONING.md` section 6 from the release side. **Three files found it independently,
which is the best evidence available that it is real and not a reading error.**

- The shell is a thin webview by design. Its own comment says so: the strategy is a `thin native
  shell that loads https://md.sgnk.ai inside a WKWebView`.
- So the shipped desktop application is a native wrapper around a different product.
- **Fix all three in the same commit**, and point them at the frontmatter origin. Changing one and
  not the others gives a build that develops against one product and ships another.
- **`productName` and the window `title` also read `sgnk-md`**, which is the visible name in the
  macOS menu bar and the Dock. Those are brand, so they change. The identifier does not.

**`app.security.csp` is `null`**, which disables Tauri's content security policy entirely. For a
shell that loads a remote origin over https that is less alarming than it looks, because the remote
page carries its own policy, but it should be a decision written down rather than a default nobody
revisited.

### 4.3 The capability set, and which promises it forbids

`31-LOCAL-SETUP.md` section 5 lists this set as a setup fact. **This section asks a different
question: which of the product's promises the set makes impossible.** The answer is three of the
four.

`src-tauri/capabilities/default.json` grants exactly ten permissions to the one window `main`:

Permission | What it is for
`core:default` | the core command set
`core:event:default` | the event bus the menu bridge uses
`core:window:default` | show, focus, minimise, fullscreen
`core:webview:default` | the webview itself
`shell:default` | opening a URL with the system handler
`os:default` | platform and version
`process:default` | relaunch and exit
`clipboard-manager:allow-read-text` | copy and paste bridging
`clipboard-manager:allow-write-text` | the same
`dialog:default` | native open and save dialogues

**What is absent matters more than what is present.**

Missing | What it blocks | Needed for
**`fs`** | Any read or write to the file system from the app | **The watched folder. Files on disk. The no-caps promise.** All three of the desktop's headline carrots
**`global-shortcut`** | A shortcut that works when the app is not focused | **Quick capture**, whose whole definition is a global shortcut
**`updater`** | Any in-app update | Section 5. There is no update mechanism at all today
**`deep-link`** | Registering a protocol handler | The `Open in the frontmatter app` bar on a published page, which the 18 September decision says appears `when the app has registered its protocol handler`
**`notification`** | A system notification | Nothing promised yet, but a watched folder that finds a conflict will want one
**`http`** | A request that bypasses the webview's origin rules | A local Ollama call, if it is made from Rust rather than from the page
**Microphone access** | Recording in the webview | **Voice**, section 4.5. No Tauri permission: the webview's `getUserMedia` is not a Tauri command, and the locked `wry` 0.55.1 answers every media-capture request with `WKPermissionDecision::Grant` `[O]`. macOS needs `NSMicrophoneUsageDescription` in `src-tauri/Info.plist` and the `com.apple.security.device.audio-input` entitlement, section 4.5

`Cargo.toml` agrees: the only plugins compiled in are `tauri-plugin-shell`, `tauri-plugin-os`,
`tauri-plugin-process`, `tauri-plugin-clipboard-manager` and `tauri-plugin-dialog`.

**So the desktop app cannot currently do any of the four things that justify downloading it.** The
capability set is minimal because the shell was built as a webview wrapper, and the comment in
`default.json` says so: `Keeps the surface minimal`. That was right for what it was and is wrong for
what the plan now asks of it. **Adding `fs` and `global-shortcut` is phase F work, and it is a
security decision, not a configuration one**, because a capability is a grant to the remote page the
shell loads.

**The rule to write down before that grant is made.** A webview pointed at a remote origin plus an
`fs` capability means **the remote page can read and write the user's disk**. Scope the `fs`
permission to the chosen vault directory, never to the whole file system, and make the scope
something the person picks through `dialog` rather than something the configuration hard-codes.

### 4.4 How the page knows it is inside the shell

`src/modules/app-shell/presentation/TauriBridge.tsx` detects `__TAURI_INTERNALS__` on `window`, which
Tauri v2 injects, and returns early when it is absent. Native menu clicks are emitted as a
`sgnk:menu` event from `src-tauri/src/lib.rs` and bridged into the existing event bus.

**That one detection is the seam for every desktop-only feature.** A feature that is desktop-only is
gated on it, and the same build serves both surfaces.

---

### 4.5 Local Whisper and Tesseract, added 19 September

**Two desktop engines, both from the founder's 19 September asks** `[Z]`: voice (`71-VOICE-SPEC.md`
section 10.3) and PDF to Markdown (`72-PDF-TO-MARKDOWN-SPEC.md` sections 3.3 and 10). Neither exists:
`grep -rli 'microphone|whisper|tesseract' src-tauri` returned nothing at `1335518` `[O]`.

**Local Whisper, for voice.**

Item | Contract, from `71` section 10.3
Engine | `whisper.cpp` through the `whisper-rs` crate, as a Tauri command in `src-tauri/src/`. Metal on Apple Silicon
Default model | `small.en`, downloaded on first use, not bundled: 466 MiB on disk, about 852 MB in memory, per the whisper.cpp README as the research read it
Optional model | `large-v3-turbo`, downloaded on request. Panel row `routing.desktop.voice`
Why not `base.en` | The Svarah study (2023) measured Whisper base at 13.6 per cent word error on Indian English and large at 7.2
Default engine | Local, once the model is downloaded. V5 in `71` section 1 now carries that answer as a proposal for founder review; the panel key is `voice.desktopEngine`
Before the download | The desktop uses the cloud chain and says so
Offline | Transcription works. Restructuring on the chain needs a connection, and falls back to raw text offline
Restructuring locally | A local Ollama model, when the person chooses "nothing leaves this computer"
The screen says | Whether restructuring leaves the machine, every time the local engine is on
Partial results while speaking | Not in v1. Confirmed: `whisper-rs` 0.16.0 has no streaming call. It transcribes a buffer already recorded, and its segment callback fires during that run. Its docs say only that single-segment output "may be useful for streaming", so partials would mean re-running on a growing buffer `[M]` `https://docs.rs/whisper-rs/latest/whisper_rs/struct.FullParams.html`, 2026-09-19 UTC
Audio | Held in memory only, never written to disk (`71` section 13)

**Native Tesseract, for scanned PDFs.**

Item | Contract, from `72` sections 2, 3.3 and 10
Engine | The Tesseract 5 binary, language `eng`, run by a Tauri command in `src-tauri/src/`
Input | One PNG per page, rendered by pdf.js in the webview at `pdf.ocr.dpi`, 200 by default
Temporary files | Written to the app's temporary directory, deleted when the page returns, and swept on app start for any left over
Bundled | The binary and its English data ship inside the app, as a **sidecar**: a separate executable in `bundle.externalBin`, one per target triple, started from the Rust command. Resolved (proposed 19 Sep, founder review). Rejected: linking `libtesseract` into the app, because a crash in C++ OCR code would then take the editor down with it. **Size, measured on one machine** `[O]`: the Homebrew build of Tesseract 5.5.2 on arm64 macOS and its 14 Homebrew libraries come to 8,943,184 bytes, plus 4,113,088 for `eng.traineddata` (the `tessdata_fast` file), 13.1 MB in all. That build links its libraries dynamically, so it cannot ship as is. `INFERENCE:` a self-contained build per target is of the same order; nobody has made one
Licence | Apache-2.0; the desktop's third-party notice lists Tesseract with its licence text, because the desktop redistributes the binary
Why native, not `tesseract.js` | On the research fixture, `tesseract.js` dropped three table rows the native binary kept (`72` section 3.3)
Caps | None on the desktop (`72` section 9)
Vision pass | Not offered on the desktop in v1

**What each needs from section 4.3.**

- **Model storage.** `small.en` is 466 MiB written after install. It goes in `models/whisper/` under
  the app's data directory (Tauri's `app_data_dir`), resolved (proposed 19 Sep, founder review): a
  narrower grant than the vault `fs` scope, and never synced. Rejected: the vault, where the sync
  would upload it.
- **The Tesseract temporary directory** needs a write grant scoped to the app's own temporary
  directory, never the vault.
- **The microphone** needs no Tauri capability, and three macOS pieces the bundle lacks today. Checked
  2026-09-19 UTC, replacing an `UNVERIFIED:`.
  - **No Tauri permission.** Recording is `getUserMedia` in the webview, which never crosses Tauri's
    IPC. The locked `wry` 0.55.1 (`Cargo.lock`) grants every capture request itself, in
    `wry_web_view_ui_delegate.rs`, `request_media_capture_permission` `[O]`.
  - **A usage string.** `NSMicrophoneUsageDescription` in a new `src-tauri/Info.plist`. Tauri's own
    example shows exactly this key, and `tauri-utils` 2.9.2 merges that file into the bundle `[M]`
    `https://v2.tauri.app/distribute/macos-application-bundle/` and `[O]` its `config.rs`. The
    wording is a row for `16-COPY-DECK.md`, not written yet.
  - **An entitlement.** `com.apple.security.device.audio-input`, which Apple describes as whether the
    app "may record audio using the built-in microphone" `[M]`
    `https://developer.apple.com/documentation/bundleresources/entitlements/com.apple.security.device.audio-input`.
    It is needed because `hardened_runtime` defaults to `true` in `tauri-utils` 2.9.2 `[O]`, while
    `bundle.macOS.entitlements` is `null` in `src-tauri/tauri.conf.json` today.
  - **So the macOS prompt is the only gate.** `INFERENCE:` since `wry` grants any frame's request, the
    desktop must never load a remote origin in a frame, or that origin could record once the person
    has allowed the app.
- Both engines are Rust commands, so neither needs the `http` permission.

**Where they are built.** `INFERENCE:` Whisper in batch 4a and Tesseract in batch 5 of
`50-ROADMAP.md`, both after the desktop's batch 8.

The capability grants belong in batch 8's
decision, step 2 of section 8's build order, so they are not discovered one at a time.

## 5. Update and signing

### 5.1 There is no update mechanism

`[O]` No `tauri-plugin-updater` in `Cargo.toml`, no `updater` key in `tauri.conf.json`, no
`updater` permission in the capability set, and no signing keys.

**So a desktop user today is on the version they downloaded, for ever.** In practice the webview
loads a remote origin, so the *web* half updates on every deploy and the *shell* half never does.
That hides the problem until the day a shell change is needed, which is exactly the day it is worst.

**What phase F has to add.** The updater plugin, an update endpoint, a signing key pair whose private
half never enters the repository, and a `View` menu item so a person can check by hand. Until it
exists, S25 should say plainly that the app does not update itself.

### 5.2 Signing has a home, and it is not this file

**`35-RELEASE-AND-VERSIONING.md` section 6 owns release signing**, and `31-LOCAL-SETUP.md` section 5
owns the local Tauri toolchain. One fact, one home. The position in three lines, so this file is
readable on its own, with the detail there:

Platform | Position | Cost
macOS | Signed on the Apple programme. The account is not opened, and moves to the company in phase F | **99 USD a year**
Linux | Unsigned, by choice. No Linux bundle target is configured, so today it means not built | none
Windows | **Signed in batch 8**, once a founder buys a route; **shown as coming** until then | List prices opened 2026-09-18 UTC: Certum Standard from €139, Sectigo from $536.25 a year on a five-year term. Azure's route is closed to India. Detail in `35-RELEASE-AND-VERSIONING.md` section 6.2a

**The two facts this file adds to those, because they are platform consequences rather than release
steps.**

1. **Signing and notarising are two steps.** A signed macOS app that is not notarised still meets
   Gatekeeper on first launch. Budget both, and neither is configured today.
2. **Windows has a build problem as well as a signing problem, and they are independent.** Tauri
   calls cross-compiling Windows from macOS `a last resort` (F072), so Windows needs its own runner,
   which needs continuous integration. **`.github/workflows/` is empty**, and `package.json` carries
   only the three macOS build scripts. So even a free certificate would not produce a build today.

**What ships in the meantime.** S25's phone page already says it: `Mac now, Linux unsigned, Windows
coming` (`docs/mvp0/SCREENS.md:278`). **Say "coming" with no date**, because a date nobody can hold
is worse than an absence.

---

## 6. The web, the progressive web app, and the phone

### 6.1 Browser storage, which is the constraint nobody expects

Browser | What it allows
Chrome | about 60 per cent of the disk, per origin
Firefox | the smaller of 10 per cent or 10 GiB
Safari | about 60 per cent since macOS 14 and iOS 17, but **deletes all script-writable storage after seven days of Safari use without a visit**, unless the app is on the home screen

**Background sync and the share target exist only in Chromium**
(`docs/mvp0/PRODUCT-PLAN.md` section 12).

**The one rule: never let the browser be the only copy**
(`docs/mvp0/PRODUCT-PLAN.md` section 12). Persist is requested inside a user gesture, and the first
connection pushes everything to the server.

**Safari's seven-day rule is the strongest argument for the install prompt** that exists in this
document, and it is a better argument than any of the usual ones. Adding the app to the home screen
exempts it. So the prompt is not a growth tactic, it is data protection, and it should be worded that
way to the person.

### 6.2 A progressive web app already partly ships, which corrects the plan

The plan says `[Z]` **A progressive web app is planned**, and a native app eventually
(`docs/mvp0/SCREEN-CHANGES-2026-09-18.md:191`). `[O]` Three pieces of it are already in the
repository at `e532e32`.

Piece | File | What it does today
A web app manifest | `src/app/manifest.ts` | `short_name` is `frontmatter`, and the long `name` continues `Your markdown vault, in any browser`, joined in the source by a dash this pack may not reproduce. Then `display: "standalone"`, `scope: "/"`, `start_url: "/"`, three icons, `theme_color: "#1a1a1a"`
A service worker | `public/sw.js`, 98 lines | Cache `sgnk-md-v2`. Never caches HTML navigations, so a deploy is picked up instantly. Stale-while-revalidate on `/_next/static/*`. Passes API and auth straight through
A registration component | `src/modules/app-shell/presentation/PWARegister.tsx` | Registers with `updateViaCache: "none"`, reloads once per session on activation, polls for a new worker every 60 seconds, and exposes `window.sgnkResetPWA()`

**So the app is installable today and is not offline-capable today.** The service worker's own comment
says its job is `minimal shell cache for installability`, and it deliberately does not cache
navigations. **That is the honest description to use**: installability ships, offline is phase F.

**Three things to fix when the offline work happens.**

1. **The cache name is `sgnk-md-v2`.** Leave it alone unless there is a migration, for the same reason
   the bundle id stays: renaming it orphans every cached shell. It is the same family as the
   `sgnk-md` IndexedDB store and `sgnk-md:dirty` recorded at `AGENTS.md:188`.
2. **The manifest's icons are all `/favicon.png`** at three declared sizes including a maskable one.
   One file cannot be correct at 192, 512 and maskable at once. Real icons are a phase F task.
3. **`background_color` and `theme_color` are both `#1a1a1a`**, which is neither of the brand values
   recorded at `AGENTS.md`, `#0055ff` light and `#0d0e11` dark. The splash screen is off-brand.

**The `View` menu already carries `Reset App Cache`**, wired to `view.reset-pwa`, which is the desktop
shell offering a fix for a service-worker problem. That is a sign the cache has bitten before, and the
comment in `PWARegister.tsx` confirms it: the hardening followed a version that `served stale chunks`.

### 6.3 The phone

**Material's rule**, confirmed on developer.android.com: under 600 dp use a navigation bar with three
to five destinations, and one pane (`docs/mvp0/PRODUCT-PLAN.md` section 12).

**Ours has five**: Home, Search, AI, Outline, More (`docs/mvp0/PRODUCT-PLAN.md` section 12).

- The tree and the right pane are drawers, as the shipped code already does.
- Targets are large and spaced, which is Fitts's law. The number is Material's, not Fitts's (F015).
- The share sheet from any app lands in the quick-capture inbox, on Android after install.

**The phone is the web app, not a third build.** Every screen in `12-screens/` carries a phone
drawing beside its desktop one for that reason.

### 6.4 The native app, eventually

`[Z]` Planned, with no date and no phase. It is not in the appetite table at
`docs/mvp0/PRODUCT-PLAN.md` section 26, and `Later` does not name it.

**What it would change, stated so nobody assumes it is free.**

- **Two more signing identities and two more stores**, each with a review process that can refuse a
  release.
- **A payment question.** Both mobile stores take a commission on digital goods sold inside an app,
  which collides with the Razorpay mandate design and the `₹299` price.
- **Tauri v2 does target mobile**, and `lib.rs` already carries
  `#[cfg_attr(mobile, tauri::mobile_entry_point)]`, so the entry point exists. That is the cheapest
  possible start and it is not the same as a shipped app.
- **The progressive web app removes most of the reason to do it.** Installable, home-screen, share
  target on Android, and no store review. **The native app's only unique wins are the iOS share sheet
  and a place in the App Store's search results.**

---

## 7. The parity audit

**How to read it.** `same` means one implementation serves both. `differs` means a platform fact
forces a difference and the difference is specified above. `gap` means the surfaces differ for no
good reason and somebody should close it.

Capability | Web | Desktop | Phone | Verdict
Editor, splice engine, refusals | yes | yes | yes | same
Change queue | yes | yes | yes | same
Doc mode, problems, formatter | yes | yes | yes | same
**Idea mode and the blueprint** | **yes** | yes | yes | same, by the 18 September decision
Published pages and share links | yes | yes | yes | same
Sign-in, one tap | yes | yes | yes | same
Caps and entitlements | applied | **not applied to files on disk** | applied | differs, and it is the carrot
AI edit on the free chain | yes | yes | yes | same
**AI edit with no network** | no | **local model** | no | differs, and it is the carrot
**Watched folder** | impossible | **specified, not built, and blocked by the capability set** | impossible | **gap**
Voice dictation | the cloud chain | **local Whisper**, `specified, not built` | the cloud chain, toggle mode only | differs, section 4.5
Scanned PDF to Markdown | `tesseract.js`, 100 scanned pages a conversion | **native Tesseract**, no cap, `specified, not built` | as web | differs, section 4.5
**Quick capture** | share target, Chromium only | **specified, not built, and blocked by the capability set** | share sheet after install | **gap**
Files on disk | origin private file system | **specified, not built** | origin private file system | **gap**
Offline editing | **installable but not offline** | webview, so also not offline | same as web | **gap**, and it is phase F for all three
Native menu bar | no | **built** | no | differs, correctly
Deep link `Open in the app` | the bar is specified | **no protocol handler registered** | n/a | **gap**
In-app update | n/a | **none** | n/a | **gap**
Dark mode | yes | yes | yes | same
Install prompt | manifest ships | n/a | manifest ships | same
Signed build | n/a | **macOS unsigned in config, Linux not built, Windows not built** | n/a | **gap**

**Seven gaps, and six of them are the same gap.** The watched folder, quick capture, files on disk,
offline, the deep link and the update mechanism are all phase F, and four of the six are blocked by
the capability set of section 4.3 rather than by the work itself. **Grant the capabilities first, or
phase F will discover them one at a time.**

---

## 8. What exists, and what does not

`[O]` Checked at commit `e532e32` on 2026-09-18.

Item | State | Evidence
The Tauri v2 shell | **built** | `src-tauri/`, Tauri `2.0`, five plugins
The native menu bar and its event bridge | **built** | `src-tauri/src/lib.rs`, `TauriBridge.tsx`
macOS build scripts | **built** | `tauri:build:mac-arm`, `:mac-intel`, `:mac-universal`
The shell pointing at the right product | **defect** | three occurrences of `https://md.sgnk.ai`
Web app manifest | **built** | `src/app/manifest.ts`
Service worker and registration | **built**, installability only | `public/sw.js`, `PWARegister.tsx`
Offline editing | `specified, not built` | the service worker deliberately never caches navigations
Local model on the desktop | `specified, not built` | no Ollama client anywhere in `src/`
Watched folder | `specified, not built` | and no `fs` capability
Quick capture | `specified, not built` | and no `global-shortcut` capability
Deep link protocol handler | `specified, not built` | no `deep-link` plugin
In-app update | `specified, not built` | no `updater` plugin, no keys
macOS signing | `specified, not built` | `signingIdentity: null`
Windows build | `specified, not built` | no target, no runner, no certificate
Linux build | `specified, not built` | no target
Continuous integration for any of it | **absent** | `.github/workflows/` is empty
Phone layouts | partly built | the tree and right pane are already drawers
Native mobile app | not planned into a phase | `lib.rs` carries the mobile entry point and nothing else
Local Whisper | `specified, not built` | no `whisper` in `src-tauri/`; no microphone permission
Native Tesseract | `specified, not built` | no `tesseract` in `src-tauri/`

**The build order for phase F**, which is now batch 8 at step 4 (D09 `[Z]`), so this order is needed
straight after the editor rather than after sync.

1. **Point the shell at frontmatter.** One commit, three strings, and it is the only item here that is
   a live defect rather than missing work.
2. **Decide and grant the capability set**, with the `fs` scope question answered in writing.
3. **Continuous integration with one runner per target**, because Tauri says cross-compiling Windows
   is a last resort and nothing can be signed by hand twice.
4. **macOS signing and notarisation**, on the company's Apple account.
5. **The updater**, before the first build a stranger downloads.
6. **The local model, the watched folder and quick capture**, which are the reason the download
   exists. Local Whisper and native Tesseract follow in batches 4a and 5, on the grants of step 2.
7. **Offline in the browser**, which is the same phase and a different codebase.
8. **Windows, on the route batch 1 chose.** D09 brought it into phase F. The prices are in
   `35-RELEASE-AND-VERSIONING.md` section 6.2a, and buying one is a founder's paid action.

---

## 9. The limits of this document

**What was not assessed.**

- The Ollama integration. No client exists, so how the desktop calls a local model, whether from the
  page or from Rust, is an open design question that decides whether the `http` capability is needed.
- Whether the watched folder should use a Rust file watcher or the page's own file system access. The
  answer changes the capability set.
- The commission both mobile stores take on digital goods, which decides whether a native app can
  carry the `₹299` price at all. No store policy page was opened in this session.
- Accessibility on any of the three surfaces. The plan carries a WCAG 2.2 AA commitment and an IS
  17802 target, and nothing here tests either.
- The Tesseract size is one Homebrew build on one arm64 Mac (section 4.5), not a shipped sidecar.
  Windows and Intel sizes were not measured.
- The webview's own behaviour on an unreliable connection, which is the case an Indian user meets most
  often and which no shell setting addresses.

**What could not be verified.**

- Whether a commercial Windows certificate can be bought by an Indian private company. Certum's
  required-documents page, read 2026-09-19 UTC, names no country bar; Sectigo's terms were not
  found. Detail and the recommendation in `35-RELEASE-AND-VERSIONING.md` section 6.2a. Nobody has
  applied, so no vendor has actually said yes.
- Whether notarisation adds a cost beyond the 99 USD a year. It should not, and it was not checked.
- Safari's seven-day figure, and the Chrome and Firefox quota figures, which are carried from the
  plan's section 12 and were not re-opened here.
- The microphone's wiring was checked on 2026-09-19 UTC (section 4.5) against the locked crates and
  two vendor pages, not against a built app. Nobody has recorded audio in this shell yet.
- Whether `macOSPrivateApi: true` has any App Store consequence, which would matter if the native app
  is ever distributed through it.

**What is not established.**

- That the desktop app is worth building before the progressive web app is finished. Section 6.4's
  own argument cuts both ways: **if installability plus offline plus the share target covers most of
  the need, the desktop app's four carrots reduce to two**, the local model and the watched folder.
- Question 11, the desktop's timing, was answered on 18 September `[Z]` (D09): desktop early. The
  argument above stays as the caveat the founder decided against, not as an open question.
- That anybody wants a watched folder. It is the most technically ambitious item here and no user
  evidence in the pack asks for it by name.

**What would falsify this document.**

- A pilot user installing the desktop app and not using any of the four desktop-only capabilities.
  That would mean the download is buying a window, and the web app should be the whole product.
- A published page's `Open in the app` bar measurably reducing reads. Section 2's decision assumes the
  bar is quiet and dismissible, and a measured drop would mean it is not.
- No Windows route being available to an Indian company at a price the founder accepts. D09 moved
  Windows into phase F; that would move it back to "coming" and change the parity table.
