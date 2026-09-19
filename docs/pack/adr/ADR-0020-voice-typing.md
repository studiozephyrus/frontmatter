---
id: ADR-0020-voice-typing
title: Voice typing on free speech-to-text, restructured through the change queue
mode: explanation
tier: canonical
status: decided
verified_against: cb7c16f
updated: 2026-09-20
owner: sagnik
covers: [ADR-0020]
---

# ADR-0020. Voice typing on free speech-to-text, restructured through the change queue

**Decision id:** ADR-0020. **Decided:** 19 September 2026 `[Z]`, widening D14 in
`56-OPEN-DECISIONS.md` section 0. **Specified in:** `71-VOICE-SPEC.md`. **Recorded here:** 19 September
2026.

## Context

- On 18 September the founder kept voice typing in Doc mode. On 19 September he widened it into a full
  voice feature `[Z]`.
- The ask: free speech-to-text APIs, English only for now; transcripts restructured automatically, as
  Wispr Flow does, with a setting for raw text.
- Levels low, medium and high, plus a tone; a command mode that tells dictation from an instruction
  by context; a 1 to 2 second model call is acceptable.
- `[O]` no voice code exists in `src/` at `cb7c16f`. The plan had called it a shipped Doc mode row.
- Two rules bind any design: gate A and gate B of ADR-0016, and the change queue of ADR-0008.

## Decision

- **Speech-to-text runs on a chain**: Groq `whisper-large-v3-turbo`, then Cloudflare Workers AI
  `@cf/openai/whisper-large-v3-turbo`, then paid Cloudflare neurons. The desktop defaults to local
  `whisper.cpp`, so nothing leaves the machine.
- **Every call goes through the model layer of `27-MODEL-ROUTING-SPEC.md`.** Voice adds call types,
  not a second router.
- **Restructuring has a raw setting and three levels**, each with a fixed prompt and a mechanical check
  in our code. A failed check falls back to a lower level or to the raw transcript. Tone applies at
  high only.
- **Command detection is a hybrid**: a sure key, a free rule on the client, then a small classifier.
  The classifier only proposes, and `unsure` means dictation with a one-tap chip.
- **Restructured dictation and every command that edits land as proposals.** Restructured text is a
  pending insertion that `Tab` accepts. Nothing auto-accepts on a timer.
- **Audio is never stored and never trained on.**

## Evidence

- `docs/research/2026-09-19-voice/VOICE.md` section 2.1, the verdict table, from provider pages opened
  with `curl` on 2026-09-19.
- Its section 1.1 found Wispr Flow's Command Mode is a separate hold-key plus a spoken prefix, not
  context detection. So the ask goes further than the product it names.
- Its section 1.1 also found Wispr's onboarding pre-selects training on dictation. Gate A forbids
  that shape for us.
- The training clauses for Groq and Cloudflare are quoted in `27-MODEL-ROUTING-SPEC.md` section 2.1.
- `71-VOICE-SPEC.md` section 12.1 re-derives the paid cost of a minute: `$0.000636` to `$0.000818`.
  SIMULATED, list prices only.

## Alternatives rejected and why

Alternative | Why rejected
The browser's server-based Web Speech API | Fails gate B: there are no developer terms to open. Its on-device mode stays, as a live preview only
AssemblyAI | Fails gate A. Its terms allow training on customer data
Deepgram as a chain link | A one-time signup credit. `27` section 2.3 says a credit cannot be a link in a chain
OpenRouter audio | No transcription model at zero price
One audio-in model call for transcription and restructuring together | The raw transcript is needed for the checks and the "show raw" control, and each half should fail over alone
Pure context detection, no sure key | A classifier is wrong some of the time, and this product refuses rather than guesses
Pasting restructured text straight in, as Wispr does | A silent AI edit. It breaks ADR-0008
Sending the screen or other documents as context, as Wispr does | Not needed, and it is what privacy-minded users resent

## Consequences

- Four new routes under `/api/voice/`, a new module `src/modules/voice/`, and a `whisper-rs` command
  in `src-tauri/`. All `specified, not built`.
- New entitlement rows for `53-PRICING-AND-ENTITLEMENTS.md` and panel rows for
  `28-CONFIGURATION-PANEL-SPEC.md`, listed in `71` section 17 for the coordinator.
- Voice commands that call a model spend `limits.ai.edits`, so voice is not a side door around the
  edit cap.
- The sign-in promise must name voice as well as documents.
- `flag.voice` stays off until a fifty-clip test bench has measured accuracy and latency, per `71`
  section 15.
- Founder actions: turn off Groq's audio logging in its Data Controls, and read the free
  organisation's limits signed in.

## Still open inside this decision

The research's questions V1 to V5 were resolved as proposals on 20 September, in `71` section 1. V2,
V3 and V5 need only review. V1, the one-key pending insertion, and V4, the minutes per plan, need the
founder, with the default level; they are items VP-01 to VP-03 in `review/voice-pdf-19sep.md`. The
broad decision above does not depend on them.

## What would reverse it

- Groq or Cloudflare changing its terms to allow training. Gate A removes it at once.
- The test bench finding the chain too inaccurate on Indian English to be useful.
- Pilot owners accepting pending insertions unread, which would make the one key a rubber stamp.

## Limits of this record

- No latency or accuracy was measured. Every timing is arithmetic on stated speeds.
- Indian-English accuracy rests on one 2023 paper, Svarah, which predates the turbo model.
- No provider page was re-opened for this record. The quotes are the research's, from 2026-09-19.
- Cloudflare's data usage page, opened 2026-09-20, says audio is stored only if a storage service is used, and names no retention period `[M]`. `71-VOICE-SPEC.md` section 3.3 quotes it.
