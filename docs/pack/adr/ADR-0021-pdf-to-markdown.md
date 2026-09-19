---
id: ADR-0021-pdf-to-markdown
title: PDF to Markdown as an on-device converter, with three entry points
mode: explanation
tier: canonical
status: decided
verified_against: e5fa544
updated: 2026-09-19
owner: sagnik
covers: [ADR-0021]
---

# ADR-0021. PDF to Markdown as an on-device converter, with three entry points

**Decision id:** ADR-0021. **Decided:** 19 September 2026 `[Z]`, recorded in `56-OPEN-DECISIONS.md`
section 0, in the D04 to D14 block. **Specified in:** `72-PDF-TO-MARKDOWN-SPEC.md`. **Recorded here:**
19 September 2026.

## Context

- On 19 September the founder asked for PDF to Markdown: a converter, not a chat feature `[Z]`.
- Three ways in: a document in its empty state; the AI panel while editing, with the PDF not stored
  beyond the session; and a standalone "Convert a PDF to Markdown" tool that files the result into notes.
- Free tools preferred, and OCR for scanned pages.
- `[O]` no PDF reading code exists at `e5fa544`: no `unpdf`, `pdfjs-dist` or `tesseract.js` in
  `package.json`, and no match in `src/` or `src-tauri/`.
- Three rules bind any design: gate A and gate B of ADR-0016, the change queue of ADR-0008, and the
  shape gate of `66-FORMAT-SPECIFICATIONS.md` section 2.5.

## Decision

- **Text PDFs convert in the browser**: pdf.js through `unpdf`, our own markdown writer, then the
  shape gate. The file never leaves the machine. The desktop runs the same code.
- **Scanned pages are detected one by one** and read by Tesseract on the device: `tesseract.js` in the
  browser, the native binary on the desktop. Each word carries a confidence.
- **An optional vision pass on Pro** sends one page image to Workers AI Gemma 4 through the model layer
  of `27-MODEL-ROUTING-SPEC.md`. It stays off behind a flag until measured on fixtures.
- **Low-confidence words, inferred headings, inferred tables and uncertain column order are flagged**
  in a report and the preview, never written into the file. What cannot be rebuilt is not guessed.
- **Entry 2 lands as one change-queue item** at the cursor, never replacing a selection. Entry 1
  writes an empty document's first version on the owner's Accept. Entry 3 creates a new note.
- **The PDF is never stored and never trained on**, by us or any provider.
- **No chat over the PDF**, ever.

## Evidence

- `docs/research/2026-09-19-pdf/PDF-TO-MARKDOWN.md` section 2.1, licences read from each project's own
  file on 2026-09-19.
- Its section 2.2 quotes the Marker and Surya weights licence, whose clause (c) bars any product that
  competes with Datalab's.
- Its section 4.4 ran seven tools on one fixture. pdf.js kept reading order where two others lost it.
  Native Tesseract rated 149 words, five below 80.
- The same section read 182 real pages in 1,768 ms with pdf.js in Node, about 10 ms a page.
- Its section 3.3 prices the vision pass at $0.038 to $0.047 per 100 pages. SIMULATED, list prices.
- Cloudflare's no-training sentence is quoted in `27-MODEL-ROUTING-SPEC.md` section 2.1.

## Alternatives rejected and why

Alternative | Why rejected
Marker or Surya | The weights licence bars a competing product, and this is one. Code licence alone is not enough
Nougat | Non-commercial weights
PyMuPDF4LLM, Scribe.js | AGPL-3.0
MinerU | An attribution duty for online services, an AGPL-3.0 model, and a Python server
Docling or olmOCR on a server | Licence-clean, but the file would leave the machine, and both need Python or a GPU
Cloudflare `toMarkdown` | Free and gate-A clean, but it uploads the file and does no OCR. The browser reads the same structure tree
Mistral OCR, LlamaParse, Google Document AI | Fail gate B on paper today
Text PDFs on a Free Cloudflare Worker | `10 ms` of CPU a request, about one page
A vision model as the default OCR | No per-word confidence, and fmd refuses rather than guesses
A chat or summary over the PDF | The founder's ask is a converter
Writing entry 2 straight into the document | A silent machine edit. It breaks ADR-0008

## Consequences

- A new module `src/modules/pdf-import/`, one route `/api/pdf/vision-page`, and a Tesseract command in
  `src-tauri/`. All `specified, not built`.
- `F146`'s on-device OCR search shares the converter's OCR engine, so there is one engine, not two.
- New entitlement rows `limits.pdf.*` for `53-PRICING-AND-ENTITLEMENTS.md` and panel rows for
  `28-CONFIGURATION-PANEL-SPEC.md`, listed in `72` section 14.
- S22 gains a seventh source card; S04 and S06 each gain one control. The screen owners write them.
- `21-DATA-MODEL.md` must rule on a `convert` value for `source`. Until then a conversion is `ai`.
- A failed PDF conversion keeps nothing, unlike Word import's `E561`, because the PDF is not stored.
- The desktop bundle carries the Tesseract binary and its English data, with licence notices.

## Still open inside this decision

- The OCR page floor, the sparse-page threshold and eight of eleven escapes are unmeasured. `72`
  section 13 lists the fixtures that set them.
- Entry 1 skipping the queue is this record's reading of ADR-0008. Its owner may rule otherwise.
- Whether the vision cap resets monthly or refills daily follows the ruling owed in `53`.

## What would reverse it

- Cloudflare changing its terms to allow training. Gate A removes the vision pass at once.
- The fixture bench finding browser OCR worse than refusing a scanned page.
- A tab or phone that cannot hold the page and size caps, which would push conversion to the desktop.
- A legal reading that clause (c) does not bind us, which would reopen Marker.

## Limits of this record

- Every accuracy claim rests on one English page printed by Chrome, in three forms.
- Every timing is one arm64 Mac in Node, not a browser tab or a phone.
- No provider or licence page was re-opened for this record. The quotes are the research's, from
  2026-09-19.
- No legal opinion was sought on the Marker weights licence.
