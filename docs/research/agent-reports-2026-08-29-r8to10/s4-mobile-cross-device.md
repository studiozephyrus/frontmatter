Reconciliation: I mutated nothing — this session ran only `cat`/`grep`/`find`/`sed` reads and outbound `curl` GETs; no writes, no commits, no `~/.claude` or `~/.sgnk` touches (the reported dirt predates me).

---

### Read-only confirmation

Nothing was mutated: no files written, edited, or created; no git or network-mutating command run. All work was `cat`/`grep`/`find` and outbound `curl` GETs.

---

### Our current mobile posture (measured, this repo, 2026-08-29)

| Surface | State | Evidence |
|---|---|---|
| `src/app/manifest.ts` | `display: "standalone"`, `scope: "/"`, `orientation: "any"`, 3 icon entries **all pointing at the same `/favicon.png`** (192, 512, 512-maskable) | [measured] |
| Manifest gaps | no `share_target`, no `shortcuts`, no `file_handlers`, no `display_override`, no `protocol_handlers` | [measured] grep returned 0 hits |
| `public/sw.js` | 98 lines, `CACHE = "sgnk-md-v2"`, `SHELL = ["/favicon.png","/theme-init.js"]`; HTML navigations **network-only**; `/_next/static/*` stale-while-revalidate; `/api/` and `/login` never intercepted | [measured] |
| Offline reading | **impossible today** — note content arrives via `/api/`, which the SW explicitly passes through | [derived] from the two rows above |
| `PWARegister.tsx` | registers `/sw.js` with `updateViaCache:"none"`, reload-once-per-session on activation, 60 s update poll, `window.sgnkResetPWA()` escape hatch | [measured] |
| `src/app/layout.tsx` viewport | `width: device-width`, `initialScale: 1`, `viewportFit: "cover"` — no `maximumScale`, no `userScalable:false` | [measured] |
| `src-tauri/tauri.conf.json` | `bundle.targets: ["dmg","app"]`, `macOS.minimumSystemVersion: "11.0"`, **no iOS or Android block**, `frontendDist` and window `url` = `https://md.sgnk.ai`, single 1280×800 window, `minWidth: 640` | [measured] |
| Mobile-specific code | `visualViewport` 0, `inputMode` 0, `safe-area` 0, `touchstart` 0, `accessory` 0; `pointerdown` 5; `max-width` 15 | [measured] |
| CSS media queries, whole app | **3 total**: 2 × `prefers-color-scheme`, 1 × `max-width: 1023px` (hides the scroll indicator) | [measured], 1057 CSS lines |
| Editor | CodeMirror 6 (`@codemirror/view ^6.43.0`); `useIsNarrow()` at `(max-width: 767px)` used in exactly two places — hide Split mode, force mode off split | [measured] |
| `Toolbar.tsx` | formatting row rendered **above** the editor in EDIT/SPLIT; actions already exist as `wrapSelection`, `prefixLine`, `insertCodeBlock`, `insertLink`, `insertTable` | [measured] |

- **Posture in one line**: an installable desktop-web PWA with a responsive-*ish* layout, zero offline content, zero mobile input model, and a Tauri config that is a remote-URL macOS wrapper — not a mobile shell. [derived]
- The Tauri config's shape (`frontendDist` = a live https URL) is the exact shape App Store guideline 4.2 targets. [derived from [fetched] guideline text below]

---

### What mobile users of this category actually do

App Store metadata, `itunes.apple.com/search`, US storefront, all read **2026-08-29**: [fetched]

| App | Vendor | Version | Released | Rating | Ratings *n* | Min iOS | Price |
|---|---|---|---|---|---|---|---|
| Google Docs | Google LLC | 1.2026.34101 | 2026-08-24 | 4.79 | **3,211,357** | 17.0 | $0 |
| Microsoft OneNote | Microsoft | 16.113.2 | 2026-08-24 | 4.71 | 1,059,746 | 18.0 | $0 |
| Notes | Apple Inc. | 2.0 | 2025-12-12 | 4.84 | **632,431** | 10.0 | $0 |
| Notion | Notion Labs | 1.7.331 | 2026-08-25 | 4.78 | 89,887 | 17.0 | $0 |
| Drafts | Agile Tortoise | 53.0 | 2026-06-03 | 4.79 | **10,733** | 15.6 | $0 |
| Bear | Shiny Frog | 2.9.3 | 2026-08-03 | 4.68 | 6,853 | 15.6 | $0 |
| Craft | Craft Docs | 3.5.6 | 2026-08-24 | 4.84 | 6,596 | 17.0 | $0 |
| Working Copy | Anders Borum | 6.9.4 | 2026-08-24 | 4.85 | 3,740 | 18.2 | $0 |
| Obsidian | Dynalist Inc. | 1.13.7 | 2026-08-15 | 4.48 | **2,689** | 15.6 | $0 |
| Textastic | Alexander Blach | 10.9.7 | 2026-08-11 | 4.70 | 2,504 | 16.0 | $0 |
| Ulysses | Ulysses GmbH | 40.4 | 2026-08-25 | 4.58 | 2,095 | 18.6 | $0 |
| iA Writer | Information Architects | 8.0.6 | 2026-08-10 | 4.56 | 1,531 | 15.0 | **$19.99** |

- Google Docs iOS / Obsidian iOS = 3,211,357 ÷ 2,689 = **1,194.3×**. [derived]
- Apple Notes / (Bear + Craft + Ulysses + iA Writer + Obsidian = 19,764) = **32.0×**. [derived]
- Drafts (capture-first, no folders, no vault) / iA Writer (full authoring) = 10,733 ÷ 1,531 = **7.01×**. [derived]
- **Reading of this**: within markdown-native tools, capture-shaped apps outsell authoring-shaped apps ~7:1; the whole markdown-native mobile category is ~1/32 the size of the default OS notes app. [inference]
- Working Copy (a *git client*, 3,740) outranks Obsidian mobile (2,689) on rating volume — the git-on-iOS workflow is not a fringe of the vault workflow, it is comparably sized. [derived]

Behavioural evidence from the products themselves:

- **Craft** front page: "capture ideas instantly across all your devices, then refine them when you're ready. Transform quick iPhone notes into documents you're proud to share." Phone = capture; desktop = refine. [fetched]
- **Google Docs iOS** offline is **opt-in and selective**: a "Make recent files available offline" toggle, a per-file "Make available offline", and a separate "Offline" list in the menu. It does not sync the corpus. [fetched, support.google.com/docs/answer/6388102?co=GENIE.Platform%3DiOS]
- **iA Writer**: "fewer features, by design", plain text + Markdown, formatting deferred to a separate Preview, paid **per platform** ($19.99 iOS). The most opinionated authoring app in the set has the *smallest* mobile ratings count in the set. [fetched + derived]
- **Working Copy's own manual** tells you its editor is not the destination: it handles "neither programming languages, markdown nor regular text" as a specialist would and points to "external editors such as Textastic"; files move via **the Files app** and the **share sheet**. Conflicts are resolved by hand-editing conflict markers. [fetched]
- **Obsidian Sync** plan limits: Standard = 1 vault / 5 MB max file / 1 GB total / 1 month history; Plus = 10 vaults / 200 MB / 10–100 GB / 12 months. Hitting the cap **stops syncing entirely** until you prune. [fetched]

Obsidian forum, Discourse `search.json`, read 2026-08-29 — post counts are real; `views` returned `null` and `like_count` returned `0` for every row, so **do not read those as zeros**: [measured]

| Thread | Posts | Opened | Class |
|---|---|---|---|
| How do I work with Obsidian on Mobile? | 282 | 2020-05-25 | orientation |
| iOS & iCloud slow to start: "Waiting for iCloud to synchronize…" | 140 | 2022-12-28 | sync latency |
| Make Obsidian Sync work in background (on Mobile) | 124 | 2021-10-20 | **no background sync** |
| Obsidian Sync incorrectly duplicates sections of files | 105 | 2025-01-12 | **data corruption** |
| iCloud sync issues | 71 | 2021-12-09 | sync |
| [Mobile] Automatic sync with GitHub on iOS via a-shell | 68 | 2022-10-25 | users building their own git sync |
| Mobile, startup: reduce time until the user can write | 64 | 2023-04-03 | **cold-start to caret** |
| [Mobile] iOS git syncing via Working Copy | 59 | 2021-04-14 | git bridge |
| Android: no editor toolbar when physical keyboard connected | 16 | 2025-04-30 | accessory row |
| iOS: text selection and cursor showing on top of header and toolbar | 12 | 2023-08-06 | **accessory/selection collision** |
| iPad reliably crashing after writing a few paragraphs | 11 | 2024-01-03 | stability |

- The two dominant complaint families are **sync trust** and **time-to-caret**, not missing features. [inference from the table]

---

### iOS platform limits, each cited

| Capability | iOS status | Source |
|---|---|---|
| `showOpenFilePicker` / `showSaveFilePicker` | `safari: false`; `safari_ios: mirror` | [fetched] MDN BCD `api/Window.json`, 2026-08-29 |
| File System Access API (feature-level) | `"n"` at **every** iOS Safari version listed, 3.2 → **26.6** | [fetched] caniuse `native-filesystem-api.json` |
| `FileSystemFileHandle` / `DirectoryHandle` interfaces | `safari: 15.2` | [fetched] BCD — **disagrees in appearance with caniuse; see disagreements below** |
| OPFS `navigator.storage.getDirectory()` | `safari: 15.2`, iOS mirrors | [fetched] BCD `api/StorageManager.json` |
| Background Sync (`SyncManager`) | `safari: false`, impl bug `webkit.org/b/182565` | [fetched] BCD |
| Periodic Background Sync | `safari: false` | [fetched] BCD |
| Push (`PushManager`) | `safari_ios: 16.4`, "supported in web apps **saved to the home screen**" | [fetched] BCD; caniuse `push-api` iOS 26.6 = `a #7` "Requires website to first be added to the Home Screen" |
| `Notification` | `safari_ios: 16.4`, *partial*: interface **undefined** unless home-screen web app **and** manifest has a **non-default `display`** | [fetched] BCD note |
| `beforeinstallprompt` | `safari: false` | [fetched] BCD |
| Add to Home Screen | iOS 26.6 = `a` (partial); note 2: **not supported in iOS WebViews** (Chrome/Firefox on iOS cannot install) | [fetched] caniuse `web-app-manifest` |
| Service Workers, IndexedDB, Wake Lock, `env()` | `y` at iOS 26.6 | [fetched] caniuse |
| `VisualViewport` | `safari: 13`, iOS mirrors | [fetched] BCD |
| `VirtualKeyboard` API | `safari: false`, `webkit.org/b/230225` | [fetched] BCD |
| `env(keyboard-inset-bottom)` | `safari: false` | [fetched] BCD `css/types/env.json` |
| `env(safe-area-inset-bottom)` | `safari: 11` | [fetched] BCD |
| `navigator.share` | `safari: 12.1` | [fetched] BCD |

Storage, from WebKit's own policy post (Safari 17.0 / iOS 17+): [fetched] `webkit.org/blog/14403/updates-to-storage-policy/`

- Browser app origin quota **up to 60%** of total disk; overall **up to 80%**.
- Non-browser apps (i.e. an embedded WKWebView — Capacitor, Tauri iOS) origin quota **up to 15%**, overall **20%**.
- A standalone Home Screen Web App gets the **same quota as the browser app** — 60/80.
- Eviction is **LRU by last user interaction or last storage op**; an origin is spared if it has an active page or is in **persistent mode**; `persist()` is granted "based on heuristics like whether the website is opened as a Home Screen Web App".
- Derived: a 10,000-note vault at 4 KB/note = 40 MB; against a 128 GB device the *worst* case (WKWebView, 15%) is 19.2 GB → 40 MB ÷ 19.2 GB = **0.21%** of quota. **Quota is a non-issue for us; eviction is the entire risk.** [derived]

App Store guideline **4.2 Minimum Functionality**, verbatim: an app "should include features, content, and UI that elevate it beyond a repackaged website. If your app is not particularly useful, unique, or 'app-like,' it doesn't belong on the App Store." 4.2.2: apps "shouldn't primarily be… web clippings, content aggregators, or a collection of links." [fetched] developer.apple.com/app-store/review/guidelines/

Shell toolchains, versions read 2026-08-29 from the npm registry: [fetched]

| Tool | Latest | Registry `modified` | Fit for us |
|---|---|---|---|
| `@capacitor/core` | **8.5.0** | 2026-08-28 | needs `package.json` + a **static** built dir + `index.html` with `<head>`; `npx cap add ios`; `npx cap sync` [fetched capacitorjs.com/docs/getting-started] |
| `@tauri-apps/cli` | **2.11.4** | 2026-06-28 | iOS needs Xcode, `tauri ios init`, **Apple Developer Program enrolment**, code signing, a macOS build machine [fetched v2.tauri.app] |
| `@capacitor/filesystem` | 8.1.3 | 2026-08-19 | the only credible path to a real user-visible file on iOS |
| `yjs` | 13.6.32 | 2026-08-04 | — |
| `@automerge/automerge` | 3.4.1 | 2026-08-12 | — |
| `isomorphic-git` | 1.41.9 | 2026-08-23 | — |

- We are Next.js 16 with live `/api/` and `/login` routes [measured] — there is no static `webDir` to hand Capacitor, so a Capacitor build today would ship a shell that loads remote content, which is the 4.2 shape. [derived]

---

### PWA vs native: the decision

**Ship PWA for v1. Do not ship a native or wrapped mobile app.**

Forces toward PWA:
- Every capability our v1 scope needs — SW, IndexedDB, `env()`, `VisualViewport`, `navigator.share` — is `y` on iOS Safari 26.6. [fetched]
- A Home Screen Web App gets the **full 60%/80% quota**, identical to Safari, and is the documented heuristic for `persist()` being granted. A wrapped WKWebView would get **15%/20%** — strictly worse. [fetched] This inverts the usual "native gives you more storage" intuition.
- Guideline 4.2 is a live rejection risk for exactly the artefact we'd ship first (a shell around `md.sgnk.ai`). [fetched]
- Tauri iOS costs an Apple Developer enrolment, code signing, and a macOS CI leg before a single user benefits. [fetched]

Forces toward native, and why each is survivable now:
- **No user-directory file access.** `showOpenFilePicker` false at every iOS version. → Our source of truth is GitHub-backed, not a local folder; we never needed the picker. [fetched + inference]
- **No Background Sync / Periodic Sync.** → Sync on foreground/visibility change only. This is precisely Obsidian's 124-post complaint, and a native app is the only fix. Accept the gap in v1; it is a *reason to go native later*, not now. [fetched]
- **No install prompt, and no install at all in iOS Chrome/Firefox.** → An instructional sheet on iOS Safari; count the loss. [fetched]
- **Eviction.** → Mitigate with `persist()` + server as the durable copy; never treat IndexedDB as the record. [fetched]

Trigger conditions to revisit (write these down now): background sync becomes the top-2 support theme; measured install-to-home-screen conversion on iOS Safari < 15%; or a paying customer requires Files.app integration. [inference]

---

### Minimum credible mobile scope for v1

1. **Read, offline, selectively.** Cache note bodies in IndexedDB for the *N* most-recently-opened notes plus explicitly pinned ones; call `navigator.storage.persist()` once. Mirrors Google Docs' shipped selective model rather than Obsidian's whole-vault one. [fetched]
2. **Capture.** One tap from the home-screen icon to a new note at one configured path (inbox or daily). Justified by Drafts 7.01× iA Writer. [derived]
3. **Light edit, single-writer.** Reuse the existing byte-preserving splice path. Guard every write with a precondition check against the file's known SHA; on mismatch **refuse and show the diff** — never auto-merge. The 105-post "Sync incorrectly duplicates sections of files" thread is the failure mode being avoided. [fetched + inference]
4. **Projections read-only.** Board, calendar, decision card render on phone and tap through to the source line. No drag, no inline mutation.
5. **Accessory row** (below).
6. **Manifest repair**: real 192 and 512 PNGs (today one `favicon.png` serves all three entries [measured]); add `shortcuts` for "New note" and "Today"; keep `display: "standalone"` — a non-default `display` is the documented precondition for `Notification` ever working. [fetched]
7. **Time-to-caret budget.** Treat cold-start-to-typeable as the headline mobile metric; it is what the forum actually complains about. [fetched, 64-post thread]

**Explicitly deferred**: multi-note offline write queue; any conflict-merge UI; background sync; push; `share_target`; `file_handlers`; native/Capacitor/Tauri mobile builds; CRDT; attachments and image capture; multi-vault; iPad multi-window; physical-keyboard shortcut map; graph view on phone; mobile settings surface beyond a single "keep offline" toggle.

---

### Accessory-keyboard and markup-entry design

Mechanics (the part that is actually hard):

- `position: fixed; bottom: 0` **does not track the iOS keyboard** — the visual viewport shrinks, the layout viewport does not, and `env(keyboard-inset-*)` is `false` on Safari. The only primitive is `VisualViewport` (Safari 13+). [fetched ×2]
- Implementation: subscribe to `visualViewport` `resize` + `scroll`; position the bar with `transform: translate3d(0, Δ, 0)` where `Δ = layoutHeight − vv.height − vv.offsetTop`. Transform, not `bottom` — avoids per-frame reflow. [inference]
- Keyboard down: `padding-bottom: env(safe-area-inset-bottom)` (Safari 11+). Keyboard up: zero it. [fetched]
- Editor font-size ≥ 16px to suppress iOS focus auto-zoom. **Do not** add `maximum-scale=1` / `user-scalable=no` — our viewport correctly omits both today. [measured + inference]
- Obsidian's toolbar sits "at the bottom of the app" and is swipe-scrollable when it overflows; it also has open bugs where selection and cursor render *on top of* the toolbar. [fetched] Our row must fit one screen width so it never scrolls, and must sit outside the CodeMirror scroller.

Buttons — one row, fixed, non-customizable, each mapping to one deterministic splice:

| Slot | Action | Backed by |
|---|---|---|
| 1 | Heading cycle H1→H2→H3→none | `prefixLine` [measured, exists] |
| 2–4 | Bold, italic, inline code | `wrapSelection` [measured, exists] |
| 5 | Link | `insertLink` [measured, exists] |
| 6 | List toggle (`-` ↔ `1.` ↔ none) | `prefixLine` |
| 7 | Task checkbox toggle `[ ]` ↔ `[x]` | `prefixLine` |
| 8–9 | Outdent / indent | CodeMirror commands |
| 10–11 | Caret ← / → ; long-press = by word | `moveByChar` / `moveByGroup` |
| 12–13 | Undo / redo | `@codemirror/commands` |

Behaviour rules:

- **Collapsed cursor must work.** Wrap actions with no selection insert the delimiter pair and place the caret between them. Requiring a selection first is the single largest markup-entry friction on touch, because iOS selection handles are the most-complained-about interaction in the forum data. [inference from [fetched] threads]
- Caret nudge buttons exist **to avoid selection handles entirely** — this is why they earn slots ahead of tables, quotes, or images.
- Long-press = key repeat, never a submenu.
- No overflow row, no user reordering, no plugin-contributed buttons — Obsidian ships all three [fetched]; each violates the simplified-surface intent.
- Textastic ("Additional keys above the on-screen keyboard make entering code easy") and Working Copy (word suggestions and an undo button above the keyboard) both ship exactly this pattern, and both are top-rated (4.70, 4.85). [fetched] The pattern is settled; do not innovate on it.

---

### Source disagreements, recorded not resolved

- **File System Access on Safari.** MDN BCD reports `FileSystemFileHandle` and `FileSystemDirectoryHandle` as `safari: 15.2`; caniuse reports the feature as `"n"` at every iOS Safari version through 26.6. Both are correct at different granularity — the *interfaces* exist (reachable via OPFS and drag-and-drop), the *picker entry points* (`showOpenFilePicker`, `showSaveFilePicker`) are `false`. Cite the picker, not the interface, when saying "we cannot open the user's folder". [fetched ×3]
- **Push on iOS.** BCD labels it `version_added: 16.4`; caniuse labels the same state `a` (partial, note 7). Same substance, different label.
- **Chrome Android `showOpenFilePicker`**: BCD says `132`; the FSA caniuse entry says `and_chr 151: "n"`. Unreconciled — do not build Android-specific file access on either number without re-testing.
- **Obsidian forum metrics**: `views` came back `null` and `like_count` `0` on every row from `search.json`. Post counts above are real; treat views/likes as unmeasured. [measured]

---

### Anti-recommendations (each explicit)

1. **Do not ship a Tauri or Capacitor shell that loads `https://md.sgnk.ai` remotely.** That is the current `tauri.conf.json` shape [measured] and the literal 4.2 "repackaged website" [fetched].
2. **Do not attempt to open the user's iCloud/Files vault folder from the web app.** `showOpenFilePicker` is `false` on Safari; caniuse shows `n` through iOS 26.6. [fetched ×2]
3. **Do not design any feature that depends on Background Sync or Periodic Sync.** Both `false` on Safari. [fetched ×2]
4. **Do not build push into v1.** It requires a home-screen install [fetched], and a markdown editor has nothing to push.
5. **Do not ship a custom install banner driven by `beforeinstallprompt`.** The event does not exist on Safari [fetched], and Add-to-Home-Screen does not work at all in iOS Chrome/Firefox [fetched].
6. **Do not make board/calendar/decision-card editable on phone.** They are projections; drag-to-mutate on a 375 px viewport is where a reversible projection quietly becomes a Notion-style PM tool.
7. **Do not introduce a CRDT for v1.** `yjs` 13.6.32 and `automerge` 3.4.1 are current and healthy [fetched], and both impose an internal document model — a tree-of-record through the back door, against a settled constraint.
8. **Do not add swipe gestures for editor commands.** They collide with iOS text selection and system edge gestures; the forum already has toolbar-vs-cursor collision bugs. [fetched]
9. **Do not add `maximum-scale=1` or `user-scalable=no`.** Our viewport is correct today [measured]; solve auto-zoom with ≥16px type instead.
10. **Do not "fix" split view on phone.** It is already disabled at ≤767 px [measured]; that is the right call.
11. **Do not queue offline writes across multiple notes in v1.** Multi-document offline writes are what produce 105-post data-duplication threads. [fetched]
12. **Do not make the accessory row customizable.** Obsidian's is, including "Add global command" [fetched]; that is feature density, which is the thing we are explicitly not building.
13. **Do not ship a native iOS app before the mobile web surface has measured usage.** iA Writer — the best-executed opinionated authoring app in the set — has 1,531 ratings against Apple Notes' 632,431. [derived]
14. **Do not treat IndexedDB or OPFS as the record.** Eviction is LRU on last user interaction; `persist()` is heuristic, not a guarantee. [fetched]
15. **Do not benchmark against Obsidian's mobile feature list.** Its mobile rating (4.48) is the lowest in the entire comparison table while its feature count is the highest. [derived]
16. **Do not use `env(keyboard-inset-*)`.** `false` on Safari; a layout built on it silently breaks on the only platform that matters here. [fetched]