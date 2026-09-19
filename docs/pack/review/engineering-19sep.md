---
id: engineering-19sep
title: Resolution log for the engineering files, second pass
mode: reference
tier: canonical
status: living
verified_against: 6c44319
updated: 2026-09-19
owner: sagnik
covers: [review-engineering-19sep]
---

# Resolution log for the engineering files, second pass

The rows added on 19 September to `27`, `28`, `29` and `35`, swept on 19 September 2026 (UTC)
under the second pass of `docs/pack/tools/RESOLVE-BRIEF.md`.

The other six engineering files (`32`, `33`, `34`, `38`, `39`, `42`) had no change since the first
sweep of 18 September, logged in `files-01-39.md` and `files-40-65.md`. They are touched here only
where that sweep missed an item.

## Counts

What | Count
Decisions resolved as proposals for founder review | 4: the upload margin, the progress delay, the Tesseract sidecar, the Whisper model folder
Needs founder | 1: F-ENG-1, the Windows certificate
`UNVERIFIED:` items checked | 20
Confirmed as written | 3: `whisper-rs` partials, Certum Standard and Certum EV country terms
Fixed, the claim changed | 5: the silence threshold, the microphone wiring, the vision byte bounds, the SmartScreen and validation bullet, the Tesseract size
Still `UNVERIFIED:`, each with a needs | 12
Skipped because a `needs:` already named a person or paid source | 0 among the 19 September rows
Left as swept on 18 September | 19 tags in the unchanged files and the older parts of `27`, `35` and `42`

## Items

file | id or line | the open point | what you did | basis | needs founder (yes/no)
--- | --- | --- | --- | --- | ---
28 | section 5.6, `voice.cf.silenceThreshold`, two tags | Cloudflare's accepted range for `hallucination_silence_threshold` not opened; default unset. | Checked. The page types it as a number in seconds, optional, with no range and no default. Replaced both tags: the bounds are ours and marked `INFERENCE:`, and unset now means the field is not sent, so Cloudflare's behaviour applies. | [M] `https://developers.cloudflare.com/workers-ai/models/whisper-large-v3-turbo/index.md`, 2026-09-19 UTC. | no
28 | section 5.6, `voice.upload.marginPct` | No default: the research asks for a margin on the upload size check and names no number. | Decided a default of 25, resolved (proposed 19 Sep, founder review). Rejected 0. `71-VOICE-SPEC.md` line 818 still carries the old `UNVERIFIED:`; that file is not mine, so its owner should copy the value. | [O] `32,000 x 300 / 8 x 1.25 = 1,500,000` bytes against the 4.5 MB body limit quoted in `71` section 6.3. | no
28 | section 5.6, `pdf.vision.maxImageBytes`, two tags | Neither the bounds nor the default were known; `72` section 3.5 ties both to the body ceiling of the platform the route runs on. | Bounds tag replaced: the route runs on Vercel, whose body limit is 4.5 MB with a 413 above it, and Cloudflare's Gemma 4 page names no image limit. Default kept `UNVERIFIED:` with a needs: a rendered 200 dpi page from the scan fixture. | [M] `https://vercel.com/docs/functions/limitations` and `https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/index.md`, 2026-09-19 UTC. | no
28 | section 5.6, `voice.timeout.transcribeMs` | Default unset until the voice bench. | Cannot be measured here: the route is not built and the bench clips are personal recordings. Kept `UNVERIFIED:` and added a needs naming the bench and the percentile it sets. Noted that `flag.voice` is off until then, so the unset row serves nobody. | [O] `grep -rn transcribeTurn src` returns nothing; `71` section 15. | no
28 | section 5.6, `pdf.classify.sparseChars` | Default unset until a fixture sets it. | Cannot be measured: the fixtures are not built. Kept `UNVERIFIED:`, added a needs naming the two fixtures, and said what an unset row does. | [O] `ls test/fixtures/pdf` fails; `git ls-files \| grep -ci fixtures/pdf` = 0. | no
28 | section 5.6, `pdf.heading.maxChars` | Default unset until a fixture sets it. | Same as above: kept `UNVERIFIED:` with a needs naming the untagged fixture, and said what an unset row does. | [O] as above; `72` line 382. | no
28 | section 5.6, `pdf.progress.afterMs` | Default unset until a tab measurement. | Decided 2000 ms, resolved (proposed 19 Sep, founder review), on the published response-time limits. Rejected 0. Named the disagreement with `72` section 11, which waits for a device measurement. | [M] `https://www.nngroup.com/articles/response-times-3-important-limits/`, 2026-09-19 UTC. | no
28 | section 5.6, the bullet on defaults marked `UNVERIFIED:` | The rule for how an unset row behaves, not a claim. | Kept. It is the rule the rows above now point to; every row still marked `UNVERIFIED:` also says what unset does. | [P] the rows of section 5.6. | no
29 | section 3 row "Microphone access", section 4.5 grants list, and the limits | Which Tauri v2 permission and which macOS usage string the microphone needs. | Checked and fixed. There is no Tauri permission: `wry` 0.55.1 grants webview capture itself. macOS needs `NSMicrophoneUsageDescription` in a new `src-tauri/Info.plist` and the `audio-input` entitlement, because hardened runtime is on by default. Added a caution that the macOS prompt is then the only gate. `71` section 10.3 carries the same `UNVERIFIED:` and is not mine. | [O] `src-tauri/Cargo.lock`, `wry-0.55.1/src/wkwebview/class/wry_web_view_ui_delegate.rs`, `tauri-utils-2.9.2/src/config.rs`; [M] the Tauri and Apple pages named in the file, 2026-09-19 UTC. | no
29 | section 4.5, Whisper table, "Partial results while speaking" | Whether `whisper-rs` gives partial results by default. | Checked and confirmed. Version 0.16.0 has no streaming call; its segment callback runs inside one pass over recorded audio. Replaced the tag with the evidence; the row stays "Not in v1". | [M] `https://docs.rs/whisper-rs/latest/whisper_rs/struct.FullParams.html`, 2026-09-19 UTC. | no
29 | section 4.5, Tesseract table, "Bundled" | The size of the bundled binary and data, and sidecar or linked library. | Measured and decided. Size 13.1 MB on one arm64 Mac (binary and 14 libraries 8,943,184 bytes, English data 4,113,088). Shape: sidecar, resolved (proposed 19 Sep, founder review); rejected linking, so an OCR crash cannot take the editor down. Said the measured build is dynamic and cannot ship as is. | [O] `otool -L` closure of `/opt/homebrew/bin/tesseract` summed with `stat -Lf %z`, one duplicate path removed; GitHub contents API sizes of the three `eng.traineddata` files; [M] `https://v2.tauri.app/develop/sidecar/`, 2026-09-19 UTC. | no
29 | section 4.5, "Model storage" `INFERENCE:`, and the limits | Where the downloaded Whisper model lives; nobody had specified it. | Decided: `models/whisper/` under the app data directory, resolved (proposed 19 Sep, founder review). Rejected the vault, which syncs. Limits line rewritten to say what the size figure does not cover. | [P] section 4.3 grants. | no
35 | section 6.2a, Certum Standard and EV rows | Whether Certum restricts countries. | Checked. The required-documents page names no country and lists what a company must send. Changed both rows to "Yes, on the published terms", with one residual `UNVERIFIED:` (Certum's automatic check with an Indian passport) and a needs. | [M] `https://support.certum.eu/en/code-signing-required-documents/`, 2026-09-19 UTC. | no
35 | section 6.2a, Sectigo row | Sectigo's validation terms. | Tried; the article returned 404. Kept `UNVERIFIED:` with a needs: ask Sectigo at purchase. | [O] curl 404, 2026-09-19 UTC. | no
35 | section 6.2a, DigiCert and SSL.com | Prices could not be read. | Retried. DigiCert redirects to a health probe; SSL.com still fails the handshake. Kept `UNVERIFIED:` on both with a needs: a browser read. | [O] curl, 2026-09-19 UTC. | no
35 | section 6.2a, "what the prices do not tell us", SmartScreen bullet | Whether standard or only EV avoids the SmartScreen warning. | Settled from Microsoft: EV no longer bypasses SmartScreen and its premium is not justified for that. Bullet rewritten as settled. | [M] `https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/smartscreen-reputation`, 2026-09-19 UTC. | no
35 | section 6.2a, term and key-storage bullets | Which term the Certum price covers, and whether cloud key storage costs extra. | Store unreachable from this network. Kept both `UNVERIFIED:` with a needs: the store price list. | [O] `shop.certum.eu` returned no response, 2026-09-19 UTC. | no
35 | section 6.2a, new Microsoft Store row | Not an open point before; found while checking. Could the Store avoid buying a certificate? | Added the row: no fee for a company account, but Tauri's Store route submits an MSI or EXE, which must already be signed. So it is a second channel, not a substitute. | [M] the three Microsoft and Tauri pages named in the row, 2026-09-19 UTC. | no
35 | section 6.2a, "cheapest route" `INFERENCE:` | Which Windows route to buy. | Wrote a recommendation, Certum Standard with company data, and marked it needs founder because it is money. Rejected Sectigo. | [M] the rows above. | yes, F-ENG-1
29 | limits, the Windows certificate bullet | No vendor's validation terms for an Indian company had been read. | Updated from the file 35 check: Certum names no country bar, Sectigo's terms not found, nobody has applied. The purchase itself is F-ENG-1. | [M] as the file 35 rows. | yes, F-ENG-1
42 | SEC-017 blast radius, the `GITHUB_REPO_TOKEN` scopes | Missed by the first sweep. The token's scopes are unknown. | Kept **UNVERIFIED** and added a needs: its owner reads the scopes on GitHub. An agent must not read the secret. | cannot be checked from here without reading a secret. | no
42 | SEC-005, the published-image defect, "UNVERIFIED against a running app" | Missed by the first sweep. Whether a vault image on a public page breaks for a signed-out reader. | Half checked on the live app: the raw route answers 401 to an anonymous request, and the rewrite line was confirmed. Kept `UNVERIFIED:` on the rendered page, with a needs. | [O] `curl -sI https://frontmatter.in/api/vault/raw/README.md` returned 401; `grep -rn api/vault/raw src`, 2026-09-19 UTC. | no
27 | section 3.4, the four call types added 19 September | Swept for open points. | None found: no `open:`, no `UNVERIFIED:`. Three `INFERENCE:` notes left as allowed (classifier output size, vision image range, vision prompt and output sizes). | [O] `grep -nE "UNVERIFIED\|open:" 27-MODEL-ROUTING-SPEC.md` shows no hit in section 3.4. | no
28 | section 4, the two trial rows added for D08 | Swept for open points. | None found. The bounds are marked `INFERENCE:` and were left. | [O] grep as above. | no
29 | section 4.5, Whisper table, "Default engine" | Waited on the founder's answer to V5. | Carried the state of `71` section 1: V5 is now a proposal (local once downloaded) awaiting founder review. The founder item belongs to `71`'s owner, not repeated here. | [O] `grep -n V5 71-VOICE-SPEC.md`, line 57. | no

## Founder items

id | file and place | the question, in plain words | option A | option B | recommended and why | kind
--- | --- | --- | --- | --- | --- | ---
F-ENG-1 | `35-RELEASE-AND-VERSIONING.md` section 6.2a; `29-PLATFORM-AND-DESKTOP-SPEC.md` build order step 8 | Windows shows a scary "unknown publisher" warning unless the app is signed with a certificate the company buys. Microsoft's own signing service is closed to Indian companies. Which certificate should the company buy? | A: Certum Standard, from €139 on the list price, in the company's name | B: Certum EV, from €329, or Sectigo, from $536.25 a year on a five-year term | A: Microsoft now says the dearer EV kind no longer removes the warning faster, so the extra money buys nothing we need | act
