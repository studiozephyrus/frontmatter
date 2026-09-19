# PDF to Markdown for fmd: research and a v1 specification

Written 19 September 2026 (IST), from the founder's ask of the same day `[Z]`.

Every source below was opened in this session with `curl -sL --compressed`, between 2026-09-18 19:43
UTC and the time of writing. Tags follow the pack: `[M]` opened and matched, `UNVERIFIED:` not
checked, `INFERENCE:` reasoned.

## 0. The answer first

**The ask.** Upload a PDF, get markdown. Not a conversational engine.

Three ways in: an empty document, the AI panel while editing (the PDF kept for that session only),
and a standalone "Convert a PDF to Markdown" tool that files the result into notes.
`docs/pack/56-OPEN-DECISIONS.md:118`.

**Recommended chain for PDFs that carry a text layer.** Everything runs in the browser, so the PDF
never leaves the machine.

Step | Tool | Licence | Why
1 | pdf.js, through `unpdf` 1.8.1 | Apache-2.0 (pdf.js), MIT (unpdf) | Reads the text layer, font sizes and, when the PDF is tagged, its structure tree
2 | Our own markdown writer over that output | ours | Headings from the structure tree or font sizes, lists, pipe tables from tags or ruling lines, escaping, and a flag wherever a rule cannot decide
3 | Our format gate, `66-FORMAT-SPECIFICATIONS.md` section 2.5 | ours | The result must pass the same shape gate as any document before it lands

**Recommended chain for scanned PDFs.** Detected per page, because a PDF can mix both kinds.

Step | Tool | Licence | Where
1 | pdf.js renders each page to an image | Apache-2.0 | browser
2 | Tesseract, as `tesseract.js` 7.0.0 in the browser or the native binary on the desktop, with a per-word confidence | Apache-2.0 | browser or desktop, nothing sent
3, optional, Pro | A vision model on Workers AI, `@cf/google/gemma-4-26b-a4b-it`, one page image per call | Gemma 4 page titled Apache License 2.0; Cloudflare does not train on inputs | a Cloudflare Worker, page image held in memory only

**Why not the famous converters.** Marker and Surya code is now Apache-2.0, but their weights carry
a licence that bars any entity over five million dollars of revenue or funding, and any product that
competes with Datalab's. PyMuPDF4LLM is AGPL-3.0.

Nougat's weights are non-commercial. Section 2.

**What the accuracy evidence says, in one line.** On olmOCR-Bench the best open systems score 75 to
83, and every one is a GPU pipeline or a vision model.

Nothing that runs in a browser tab appears on either public benchmark. Section 4.

**The caps proposed.** Both browser paths cost us nothing, so they are the same on Free and Pro:
1,000 pages and 100 MB a conversion, 100 scanned pages a conversion, no monthly OCR cap.

Only the Pro vision pass is metered, at 200 pages a month. The desktop has no caps. Section 5.4.

**What we ran.** Seven free tools on one fixture in three forms, and pdf.js on 182 real pages.
pdf.js kept reading order where Docling and markitdown lost it; tesseract.js dropped a whole table.
Section 4.4.

---

## 1. How this was checked

**Primary sources only.** Each project's `LICENSE` file was fetched from its default branch on
GitHub.

Each model's licence was read from the Hugging Face model API (`/api/models/<id>`), and from the
model licence file where the project ships one. Pricing and limits came from the vendor's own page.

**Tools were run locally, and nothing was uploaded anywhere.** A one-page fixture was built here
from known markdown, in tagged, untagged and scanned forms, then converted by seven free tools.

Section 4.4 has the outputs. Cloudflare's `toMarkdown` was read about, not called, because calling
it sends a file off the machine.

**What the pack already fixes, and this file does not reopen.**

Fact | Where
Gate A: no provider that trains on inputs, at any position in the chain | `docs/pack/27-MODEL-ROUTING-SPEC.md` section 1
Gate B: no provider whose terms nobody has opened | same
The markdown we accept, and the shape gate that refuses (4 MiB, 200,000 lines, invalid UTF-8) | `docs/pack/66-FORMAT-SPECIFICATIONS.md` sections 2.2 and 2.5
Uploads: 5 MB a file on Free, 25 MB on Pro | `docs/pack/53-PRICING-AND-ENTITLEMENTS.md` section 3.1
Uploads go by presigned URL straight to R2, never through the application | `docs/pack/21-DATA-MODEL.md` section 21.7
Import already promises that Word converts in the browser and never leaves the machine | `docs/pack/12-screens/S22.md`, "What this screen must never do"
Tesseract.js and pdf.js are already listed as key-less integrations that run in the browser | `docs/pack/34-INTEGRATIONS.md` section 12
OCR search over images and PDFs, on the device, is a planned feature | `F146`, `docs/pack/10-FEATURE-REGISTER.md:109`

**The last two rows matter.** fmd already plans to run OCR on the device for search. The converter
can share that engine rather than add a second one.

---

## 2. The converters, and the licence verdict

### 2.1 Licences, read from the files

Licence abbreviations used once and then kept short: MIT is the Massachusetts Institute of
Technology licence, AGPL is the GNU Affero General Public Licence, and CC-BY-NC is the Creative
Commons attribution, non-commercial licence.

Tool | Code licence `[M]` | Model weights `[M]` | Verdict for a paid product
Docling (IBM) | MIT, `docling-project/docling/LICENSE` | `docling-layout-heron` Apache-2.0; `docling-models` CDLA-Permissive-2.0 and Apache-2.0; `granite-docling-258M` Apache-2.0 | **Usable.** Clean on code and weights
Marker (Datalab) | **Apache-2.0**, `datalab-to/marker/LICENSE` | Modified AI Pubs Open RAIL-M, `MODEL_LICENSE` | **Refuse the weights.** See 2.2
Surya (Datalab) | Apache-2.0 | Same `MODEL_LICENSE`, byte-identical to Marker's; Hugging Face tags `surya_layout` as CC-BY-NC-SA-4.0 | **Refuse.** Two licences disagree, and both restrict us
MinerU (OpenDataLab) | Apache-2.0 plus added terms, `LICENSE.md` | `MinerU2.5-2509-1.2B` tagged AGPL-3.0 | **Avoid.** Attribution duty and an AGPL model
PyMuPDF4LLM (Artifex) | AGPL-3.0, `pymupdf/pymupdf4llm/LICENSE` | none | **Refuse** unless a commercial licence is bought. `UNVERIFIED:` its price
pdfplumber | MIT | none | Usable. Python only
pdf.js (Mozilla) | Apache-2.0 | none | **Usable.** Runs in the browser and in Workers
`unpdf` | MIT | none | **Usable.** A serverless build of pdf.js
unstructured | Apache-2.0 | depends on the chosen detector | Usable, but it outputs elements rather than markdown
olmOCR (Allen AI) | Apache-2.0 | `olmOCR-2-7B-1025` Apache-2.0 | Usable on licence. Needs a GPU
Nougat (Meta) | MIT | **CC-BY-NC**, per its README and Hugging Face | **Refuse.** Non-commercial weights
markitdown (Microsoft) | MIT | none | Usable. A thin wrapper, see 4.4
Tesseract and `tesseract.js` | Apache-2.0, both | the `eng` data ships with the binary | **Usable**
PaddleOCR | Apache-2.0 | `PaddleOCR-VL` Apache-2.0 | Usable. Python and a model server
docTR (Mindee) | Apache-2.0 | `UNVERIFIED:` per-model licences not opened | Usable on code
Scribe.js | AGPL-3.0 | none | **Refuse.** Tesseract.js's own README points to it for PDF support

### 2.2 The Marker and Surya weights, quoted

The founder's brief expected a GPL-3.0 code licence on Marker. **That changed.** Both repositories
now ship Apache-2.0 in `LICENSE`, and the Marker README says `Our code is licensed under **Apache
2.0**` `[M]`.

The code is not the problem any more. The weights are.

`MODEL_LICENSE`, section "Use restrictions", clause 2, opened 2026-09-19 `[M]`:

- (a) bars use `if You ... generated more than five million US Dollars ($5,000,000) in gross revenue
  in the prior year`, unless personal or research use.
- (b) bars use if the entity `has raised more than five million US dollars ($5,000,000)`.
- (c) bars use `for any purpose if You ... provides or otherwise makes available any product or
  service that competes with any product or service offered by or made available by Licensor`.

**Clause (c) decides it.** Datalab sells a hosted PDF-to-markdown service, per the same README.

`INFERENCE:` a PDF-to-markdown converter inside fmd is a competing service under (c) from the day it
ships, whatever our revenue. So the default Marker pipeline, which runs Surya, is out.

### 2.3 MinerU's added terms, quoted

MinerU's `LICENSE.md` adds three things to Apache-2.0 `[M]`:

- A commercial licence is needed above `100 million` monthly active users or `USD 20 million` monthly
  revenue. That does not bind us.
- **`If you provide online services to third parties based on MinerU, you must clearly and
  prominently indicate ... that MinerU is used.`** That does bind us.
- Breaking either terminates the licence automatically.

Its 2.5 vision model is tagged AGPL-3.0 on Hugging Face. **Avoid, not refuse:** the attribution duty
is survivable, the AGPL model is not, and the pipeline would need a server we do not otherwise run.

### 2.4 What each converter handles

From each project's README, opened this session. A tick here is the project's own claim, not a
measurement. Section 4 has the measurements.

Tool | Runs where | Tables | Headings | Lists | Images | Maths | Multi-column | Scanned pages
Docling | Python, CPU or GPU. **1.2 GiB installed, plus 0.5 GiB of models**, measured in 4.4 | yes | yes | yes | exported | formulas | reading order | yes, RapidOCR by default
Marker | Python and PyTorch | yes | yes | yes | extracted | yes, through the VLM | yes | yes, through Surya
MinerU | Python; ONNX on CPU, llama.cpp for its VLM | yes | yes | yes | yes | yes | yes | yes
PyMuPDF4LLM | Python over the MuPDF C engine | yes | from font sizes | yes | yes | no claim | yes | selective OCR
pdfplumber | Python | cell grids | no | no | positions only | no | no | no
pdf.js and `unpdf` | browser, Node, Workers | no, positions only | the structure tree when tagged; font sizes otherwise | the structure tree when tagged | `extractImages` | no | text order as written in the file | no
unstructured | Python, with Tesseract and Poppler | yes, `hi_res` | as element types | as element types | yes | no claim | yes | yes, Tesseract
olmOCR | a GPU with `at least 12 GB` of RAM | yes | yes | yes | no claim | yes | yes | yes, it is an OCR model
Nougat | GPU | LaTeX tables | yes | yes | no | yes | academic papers | yes, but `Chinese, Russian, Japanese etc. will not work`
markitdown | Python, over pdfminer.six and pdfplumber | pipe tables | no | numbered only | no | no | no | no, unless given an LLM client
Cloudflare `toMarkdown` | Workers AI, binding or REST | from a tagged PDF only | from a tagged PDF only | from a tagged PDF only | no claim for PDF | no | no claim | **no**, see 2.5

### 2.5 Cloudflare Workers AI `toMarkdown`, in detail

**It is free for PDF.** `toMarkdown is free for most format conversions`, and only images call paid
models `[M]` (`workers-ai/features/markdown-conversion/index`, opened 2026-09-19). The page badges
the feature Beta.

**It does no OCR on a PDF.** The how-it-works page, quoted `[M]`:

- `We try to obtain a StructTree object from the PDF file.`
- `If none is obtained, we extract the text of the page _as-is_ and return it.`
- `If we manage to obtain a StructTree, we traverse its nodes to build a semantic Markdown representation`.

**So its whole structure depends on the PDF being tagged,** the ISO 14289 PDF/UA kind.

An untagged PDF comes back as flat text, and a scanned one comes back with nothing to read. pdf.js
exposes the same structure tree in the browser, `getStructTree()` at `src/display/api.js:1790`
`[M]`.

**Data terms pass gate A.** `Cloudflare does not use your Customer Content to (1) train any AI
models made available on Workers AI or (2) improve any Cloudflare or third-party services` `[M]`,
`workers-ai/platform/data-usage`.

Content is stored only `if you specifically use a storage service`.

**Limits.** No page, size or file-count limit for `toMarkdown` was found on the pages opened.
`UNVERIFIED:` needs a support answer or a test with a synthetic file.

The Worker in front of it gets a 100 MB request body on the Free Cloudflare plan `[M]`,
`workers/platform/limits`.

**Verdict.** Not the default, because the browser does the same job over the same structure tree
without sending the file anywhere. It is a reasonable server fallback for the desktop's absence.

### 2.6 Hosted options with a free tier

Service | Free allowance `[M]` | Price after | Gate A | Verdict
Mistral OCR | Studio's Free plan carries API credits; OCR `is per 1,000 pages` | `UNVERIFIED:` the per-page price is rendered by script and did not appear in the fetched page | Free-tier training is conditional on an opt-out, so the pack refuses Mistral Free under gate B (`27-MODEL-ROUTING-SPEC.md` section 2.2) | **Refuse on Free.** Revisit only on a paid, no-training contract
LlamaParse | `Free $0 /month`, `Includes 10K credits`; `1,000 credits = $1.25` | Starter `$50 /month` | `Cached data is retained only for 48 hours`; `UNVERIFIED:` no training clause was opened | **Refuse** until gate B is met
Google Document AI | Enterprise Document OCR: `0 count to 1,000 count $0.00 (Free)` | `$1.50` per 1,000 pages to 5 million; Layout Parser `$10.00` per 1,000 | `UNVERIFIED:` Google Cloud's service terms not opened this session | **Hold.** Needs a card and a billing account, and gate B

**The pattern.** Every hosted parser is cheap per page and fails our gates on paper, not on price.
None is needed for v1, because the text-layer path is free and local, and the OCR path has an
Apache-2.0 answer.

---

## 3. OCR for scanned pages

### 3.1 Engines we could run ourselves

Engine | Licence `[M]` | Runs where | Evidence on accuracy
Tesseract 5 | Apache-2.0 | native binary on the desktop; `tesseract.js` 7.0.0 in the browser as WebAssembly | OmniDocBench text OCR, English, normalised edit distance **0.096** (lower is better)
PaddleOCR | Apache-2.0 | Python; a model server | Same table, English **0.071**
Surya | Apache-2.0 code, restricted weights (2.2) | Python and PyTorch | Same table, English **0.057**. Refused on licence
docTR | Apache-2.0 | Python, TensorFlow or PyTorch | Not in either benchmark opened. `UNVERIFIED:` accuracy
olmOCR 2 | Apache-2.0, code and weights | a GPU with 12 GB or more, or a paid host | olmOCR-Bench **82.4** overall, section 4.1

The edit distances are from the OmniDocBench README's text OCR table, block level, English column,
opened 2026-09-19 `[M]`. The same table gives GPT4o **0.020** and EasyOCR **0.26**.

**Tesseract is the one engine that runs everywhere fmd runs.** The browser gets it as WebAssembly,
the desktop gets the native binary, and the licence is Apache-2.0 on both.

It is weaker than the Python engines on layout, and section 4.4 shows exactly where.

**One property decides it for this product.** Tesseract gives a confidence per word.

A vision model gives fluent text with no such signal. fmd refuses rather than guesses, so an engine
that can say "I am not sure of this word" fits the product better than a stronger one that cannot.

### 3.2 Vision models already inside our chain

Gate A and gate B are the pack's, `27-MODEL-ROUTING-SPEC.md` section 1. Only providers already in
the chain are considered, and only models that accept an image.

Provider | Model | Accepts images `[M]` | Model licence | Free allowance
Cloudflare Workers AI | `@cf/google/gemma-4-26b-a4b-it` | `vision: true` in Cloudflare's model catalogue | the linked Gemma 4 page is titled `Apache License 2.0` | shares the account's 10,000 neurons a day
Cloudflare Workers AI | `@cf/meta/llama-3.2-11b-vision-instruct` | `vision: true` | Llama 3.2 Community Licence | same
Cloudflare Workers AI | `@cf/meta/llama-4-scout-17b-16e-instruct` | `vision: true` | Llama 4 licence | same
Groq | `qwen/qwen3.8-27b`, already in the chain | `Each image counts as 2048 input tokens`; `a maximum of 3 images` per request | `UNVERIFIED:` Qwen 3.8 licence not opened | 200,000 tokens a day per model
Ollama, desktop | `gemma3:4b`, already listed at 3.3 GB | `UNVERIFIED:` vision on this tag not checked | Gemma terms | the machine

**Cloudflare also runs Gemma 4 inside `toMarkdown` itself,** for image descriptions, per its
how-it-works page `[M]`. That makes it the vision model with the most direct evidence that
Cloudflare meant it for document work.

**None of these models appears on either OCR benchmark opened.** Gemini 3 Flash scores 92.62 on
OmniDocBench and is refused under gate A (`27-MODEL-ROUTING-SPEC.md` section 2.2).

`UNVERIFIED:` how Gemma 4 or Qwen 3.8 read a scanned page. Measure on our fixtures before any of
them ships.

### 3.3 What a vision model costs, per page

The inputs, and which of them are measured.

Input | Value | Tag
Groq image cost | 2,048 input tokens per image | `[M]`, Groq's vision page
Workers AI Gemma 4 price | 9,091 neurons per million input tokens; 27,273 per million output | `[M]`, Workers AI pricing
Workers AI rate | `$0.011 per 1,000 Neurons`; `10,000 Neurons per day at no charge` | `[M]`, same page
Image tokens for Gemma 4 on Workers AI | 1,100 to 2,048 per page | `INFERENCE:` Groq's figure used as the upper bound
Prompt, per page | 300 tokens | `INFERENCE:`
Markdown out, per page | 800 tokens | `INFERENCE:` a dense page of prose

The arithmetic, run in `python3` this session.

Route | Per page | Free pages a day | Cost per 100 pages
Groq `qwen3.8-27b` | 2,048 + 300 + 800 = 3,148 tokens | 200,000 / 3,148 = **63** for the whole organisation | $0 inside the free pool
Workers AI Gemma 4, 1,100 image tokens | (1,400 x 9,091 + 800 x 27,273) / 1,000,000 = 34.55 neurons | 10,000 / 34.55 = **289** | 3,455 neurons x $0.011 / 1,000 = **$0.038**
Workers AI Gemma 4, 2,048 image tokens | (2,348 x 9,091 + 800 x 27,273) / 1,000,000 = 43.16 neurons | 10,000 / 43.16 = **231** | **$0.047**
Tesseract, browser or desktop | none | unlimited | **$0**

**The free neurons are not ours to spend on OCR alone.** The same 10,000 a day serve every AI edit
on Free, per `27-MODEL-ROUTING-SPEC.md` section 2.1.

So a vision pass belongs on Pro, where a paid neuron is 4 to 5 cents per 100 pages.

---

## 4. Accuracy evidence

### 4.1 olmOCR-Bench, from the Allen AI README

1,403 PDFs, over 7,000 pass-or-fail tests, eight categories. Overall is the mean across categories.
Numbers copied from `allenai/olmocr/README.md`, opened 2026-09-19 `[M]`.

System | arXiv maths | Old scans maths | Tables | Old scans | Headers and footers | Multi-column | Long tiny text | Base | Overall
Mistral OCR API | 77.2 | 67.5 | 60.6 | 29.3 | 93.6 | 71.3 | 77.1 | 99.4 | 72.0
Marker 1.10.1 | 83.8 | 66.8 | 72.9 | 33.5 | 86.6 | 80.0 | 85.7 | 99.3 | 76.1
MinerU 2.5.4 | 76.6 | 54.6 | 84.9 | 33.7 | 96.6 | 78.2 | 83.5 | 93.7 | 75.2
DeepSeek-OCR | 77.2 | 73.6 | 80.2 | 33.3 | 96.1 | 66.4 | 79.4 | 99.8 | 75.7
Nanonets-OCR2-3B | 75.4 | 46.1 | 86.8 | 40.9 | 32.1 | 81.9 | 93.0 | 99.6 | 69.5
PaddleOCR-VL | 85.7 | 71.0 | 84.1 | 37.8 | 97.0 | 79.9 | 85.7 | 98.5 | 80.0
Infinity-Parser 7B | 84.4 | 83.8 | 85.0 | 47.9 | 88.7 | 84.2 | 86.4 | 99.8 | 82.5
Chandra OCR 0.1.0 | 82.2 | 80.3 | 88.0 | 50.4 | 90.8 | 81.2 | 92.3 | 99.9 | 83.1
olmOCR v0.4.0 | 83.0 | 82.3 | 84.9 | 47.7 | 96.1 | 83.7 | 81.9 | 99.7 | 82.4

**Tools it does not cover.** Docling, markitdown, pdf.js, pdfplumber, PyMuPDF4LLM and Tesseract are
absent. So the one table with the widest coverage says nothing about the tools we can actually run
in a browser.

**What it does not measure, which matters most to us.** The bench's own README, quoted `[M]`:
`Markdown syntax is allowed, but ignored.` A converter that loses every heading and list loses no
points.

For fmd, headings and lists are half the value of markdown.

### 4.2 The same bench, run by Datalab on its competitors

From the Marker README, opened 2026-09-19 `[M]`. **Datalab ran this, on its own product and its
rivals, so treat it as a vendor's table.** It is the only public run found that includes Docling.

System | Overall | Born-digital only | Throughput on one B200 GPU
Chandra 2, hosted | 85.8 | not given | not given
Gemini Flash 3.5, API | 76.4 | 79.1 | not given
Marker, balanced | 76.0 | 83.5 | 2.9 pages a second
MinerU, pipeline | 72.7 | 83.3 | 0.54 pages a second
Marker, fast | 66.6 | 71.6 | 7.4 pages a second
**Docling** | **50.3** | **64.0** | 2.1 pages a second
Marker, fast, no OCR, CPU | 43.6 | 55.8 | 23.7 pages a second
liteparse, no OCR, CPU | 20.4 | 25.0 | 1,721 pages a second

**The row worth reading is the last but one.** A CPU-only text-layer path, with a small layout model
and no OCR, scores 55.8 on born-digital pages.

A plain text dump with no layout model scores 25.0. `INFERENCE:` our browser path sits between those
two until it gains a layout step.

### 4.3 OmniDocBench v1.6, from the OpenDataLab README

End-to-end parsing of whole pages to markdown. Overall is the mean of text accuracy, table TEDS and
formula CDM. A selection of rows, copied from the v1.6 table, opened 2026-09-19 `[M]`.

System | Kind | Overall | Text edit distance | Table TEDS | Reading-order edit distance
PaddleOCR-VL-1.6 | specialised vision model, 0.9B | 96.34 | 0.0326 | 94.76 | 0.1278
MinerU2.5-Pro | specialised vision model, 1.2B | 95.75 | 0.036 | 93.42 | 0.120
Gemini 3 Flash | general vision model | 92.62 | 0.066 | 89.29 | 0.172
MinerU pipeline | pipeline tool | 86.47 | 0.055 | 81.88 | 0.153
olmOCR | specialised vision model, 7B | 85.74 | 0.139 | 83.00 | 0.216
Mistral OCR | specialised vision model | 85.66 | 0.097 | 76.78 | 0.171
Marker | pipeline tool | 78.44 | 0.157 | 65.77 | 0.243

**Docling is not in the v1.6 table.** The README's changelog says it was `Added` on 2025/01/16, so
it was measured on an earlier version.

`UNVERIFIED:` its score there, because the older table was not opened. Tesseract appears only in the
text OCR table used in section 3.1.

**What the two benchmarks agree on.** The top of both is a small specialised vision model on a GPU.
PaddleOCR-VL is Apache-2.0 and near the top of both, which makes it the candidate for any later
server-side OCR tier.

### 4.4 What we ran here, on three fixtures

**The fixture.** One page, built in this session from known markdown: three heading levels, a
bulleted list, a numbered list, a four-column table, a two-column passage and a one-line formula.
Headless Chrome printed it twice, once tagged and once untagged.

**The scan.** The same page rendered to a 1700 by 2200 pixel image, which is a Letter page at 200
dots an inch, and wrapped back into a PDF with no text layer.

**Where and what.** All runs were local, on an arm64 Mac, on 19 September 2026, and nothing was
uploaded. Versions `[O]`: unpdf 1.8.1, tesseract.js 7.0.0, Tesseract 5.5.2, pdfplumber 0.11.9,
markitdown 0.1.7 over pdfminer.six 20260107, Docling 2.129.0, and Poppler's pdftotext 26.04.0.

**pdftotext is a reference point, not a candidate.** Its licence was not opened this session.

Tool | Tagged PDF | Untagged PDF | Scanned PDF | Time, tagged / untagged / scanned
pdf.js, through unpdf | All text, right reading order, both columns whole. Structure tree roles `H1 H2 H3 L LI Lbl Table TR TH TD` | Same text, no structure tree. Four font sizes, 24, 16, 13 and 11 points, one per heading level plus body | **0 characters**, which is the scan signal | 54, 60, 39 ms
pdfplumber | The table as a 4 by 4 grid, every cell right | Same | 0 characters, no table | 31, 16, 1 ms
markitdown | A correct pipe table, then the two-column passage turned into a second, broken table | Table exploded into one cell per line; the right column moved below the next heading | Empty | 0.42, 0.21, 0.19 s
pdftotext, plain | Table exploded, one cell per line | Same, plus `ﬁ` ligatures | Empty | 0.01 s each
Docling | Every heading written as H2, so H1 and H3 are lost. Lists and table right. The right column moved below "A formula" | Same | Bullets and numbers re-ordered 1, 3, 2, and a garbled fragment appended | 434 s on first run, 212 s of it downloading models; 4 s for the scan once cached
Tesseract, native | n/a | n/a | Words right. Bullets and list numbers lost. Table as spaced text with stray bars. The two columns merged line by line. Formula read `r= 1n/ b` | 0.43 s
tesseract.js | n/a | n/a | Bullets read as `«` and `¢`. **The three table rows missing entirely**, the header read as `TGlinie [Bookings`. Columns merged line by line | 96 ms to load, 416 ms to read; mean confidence 92

**Five things this table settles.**

- **The browser text layer is enough to start.** pdf.js kept reading order where markitdown and
  Docling did not, and its font sizes map cleanly onto heading levels. `INFERENCE:` Chrome writes
  column text in order; other producers may not.
- **Drawn bullets vanish without tags.** The untagged text layer holds the numbers of a numbered
  list, because they are text, but no bullet marks, because Chrome draws them. Only the structure
  tree recovers a bulleted list.
- **Tables need a step of our own.** pdfplumber rebuilt the grid from its ruling lines. No browser
  tool here did that for an untagged PDF, so our writer needs the same idea, or it flags the table.
- **Ligatures are a search defect.** pdftotext and markitdown wrote `ﬁ` (U+FB01) on the untagged
  PDF, so a search for "field" misses it. pdf.js wrote `fi`. Our writer normalises U+FB00 to U+FB06.
- **The browser OCR engine is not the native one.** Same Tesseract family and the same English data
  file, yet tesseract.js dropped three table rows that the binary kept. `UNVERIFIED:` why. Test the
  browser build on its own.

**The confidence signal does what section 3.1 hoped, imperfectly.** Native Tesseract rated 149
words. Five fell below 80: the two formula misreads at 42, a stray `on` at 64, a stray bar, and the
correct number `12` at 66.

**Measured on real PDFs, text layer only.** Nine PDFs already on this machine from earlier research,
182 pages in all, read by pdf.js through unpdf in 1,768 ms in Node.

That is about 10 ms a page, or 103 pages a second, on this machine.

- Four of the nine were tagged, 96 of the 182 pages, and all four came from Microsoft Word.
- The five untagged ones came from iTextSharp, Microsoft Print to PDF and pikepdf.
- Every one of the 182 pages had a text layer.
- The nine were not chosen to be representative. The tagged share is not a population figure.

---

## 5. Where it runs for us

### 5.1 Text PDFs: the browser, and not a Worker

**The browser is the default,** because the file never leaves the machine and the work costs us
nothing. The pdf.js build inside unpdf is 1,676,063 bytes, or 495,781 gzipped `[O]`. It loads on the
first conversion only.

**A Cloudflare Worker cannot be the text path on its Free plan.** The limits page gives `10 ms` of
CPU time per request on Free and `5 min` on Paid.

Memory is 128 MB either way `[M]`, `workers/platform/limits`, opened 2026-09-19.

`INFERENCE:` at the 10 ms a page measured in 4.4, a Free Worker has CPU for about one page. Workers
Paid is recommended in `27-MODEL-ROUTING-SPEC.md` section 8.6 and not yet on.

**The desktop runs the same pdf.js.** No second code path.

### 5.2 Scanned PDFs: detected per page, read on the device

Step | Where | What
Detect | browser or desktop | A page whose text layer holds no characters goes to OCR. The scan fixture returned 0 characters; the 182 real pages all returned text
Render | browser or desktop | pdf.js draws the page to an image, 200 dots an inch as in the fixture
Read, default | browser | tesseract.js, on a background worker so the editor stays live
Read, default | desktop | the native Tesseract binary
Read, optional | a Worker, Pro only | one page image to Workers AI Gemma 4, held in memory, never written to R2 and never logged

**What the browser downloads for OCR, and only when a scanned page appears.** One WebAssembly build
of Tesseract, 2,855,361 bytes for the smallest here, plus English data.

The Homebrew English file is 4,113,088 bytes. `UNVERIFIED:` which data file tesseract.js fetches by
default, and its size.

**No server OCR in v1.** A server Tesseract needs a container we do not otherwise run. PaddleOCR-VL
is the candidate if one is ever needed, per 4.3.

### 5.3 Latency

Path | Measured here `[O]` | Not measured
Text layer | about 10 ms a page, in Node, arm64 Mac | a browser tab; a phone
Tesseract, native | 0.43 s for one 200-dot page | 300 dots; dense small print
tesseract.js | 0.10 s to load, 0.42 s to read one page, in Node | a browser tab; a phone
Vision pass | nothing | `UNVERIFIED:` the whole round trip

`INFERENCE:` a 20-page text PDF converts in well under a second, and a 20-page scan in about ten
seconds on a laptop. Both need a browser measurement before any number goes into copy.

### 5.4 Caps, proposed

**The principle.** The browser paths cost us nothing, so they are capped for the tab's sake, not for
ours, and the same on both plans. That follows `53-PRICING-AND-ENTITLEMENTS.md` section 3.2: every
editing feature free, and only quantities differ.

Cap | Free | Pro | Desktop | Where the number comes from
Pages per conversion | 1,000 | 1,000 | none | The 4 MiB shape gate over 2,885 characters a page, the mean of the 182 real pages at one byte a character, is 1,453 pages. 1,000 leaves room for markup
File size per conversion | 100 MB | 100 MB | none | `INFERENCE:` the file is not uploaded, so the 5 and 25 MB upload caps do not apply. Measure on a phone before ship
Scanned pages per conversion, in the browser | 100 | 100 | none | 100 pages at the measured 0.42 s is 42 s on a laptop
Browser OCR pages a month | no cap | no cap | none | Costs us nothing
Vision pass pages a month | 0 | 200 | a local model, `UNVERIFIED:` | Priced below
Documents the tool creates | 50 in total, `limits.docs.cloud` | unlimited | none | The existing cap, unchanged
Images kept | `limits.uploads.*`, 5 MB a file | same, 25 MB a file | none | The existing caps, unchanged

**Why the vision pass is Pro only, and why 200.** The 10,000 free neurons a day already serve every
Free AI edit (3.3). On Pro the arithmetic, run in `python3`, is:

```
200 pages x $0.047 / 100 pages      = $0.094 a month, at the dearer rate in 3.3
rupees per dollar, from 27 s.3.2    = 191 / 1.99 = 95.98
$0.094 x 95.98                      = about 9 rupees a month
```

That is about a sixth of the roughly 55 rupees a fully active Pro user leaves, per
`27-MODEL-ROUTING-SPEC.md` section 3.2. At 1,000 pages it would be about 45 rupees, most of the
margin.

### 5.5 Cost per 100 pages

Path | Cost to us
Text layer, browser or desktop | $0
Tesseract, browser or desktop | $0
Vision pass, Workers AI Gemma 4 | $0.038 to $0.047, section 3.3
Cloudflare `toMarkdown` | $0 for PDF, but it sends the file off the machine, so it is not used

---

## 6. Feature specification: fmd PDF to Markdown v1

### 6.1 The three ways in

Entry | Where | What the person does | Where the result lands
1. An empty document | S04, the empty state of a document | "Start from a PDF", one line beside the existing empty-state words | This document, as its first version. Nothing is overwritten, so no queue item
2. The AI panel | S06, the AI writing box, `11-SCREEN-INDEX.md:55` | "Convert a PDF", with an optional page range | At the cursor, as **one change-queue item** on S20
3. The standalone tool | A seventh source on S22, "PDF", and its own view named "Convert a PDF to Markdown" | Drop or choose one PDF, pick a folder | A new document in the chosen notes folder

**Entry 3 adds no button.** S22 forbids a third creation button, so the tool is a source on the
Import screen and a command, not a control in the rail.

**A name collision keeps both,** as S22 already rules for import. The new file is suffixed.

### 6.2 The pipeline, in order

1. **Open** the PDF with pdf.js in the browser. A password-protected file is refused (6.6).
2. **Split pages** into text pages and scanned pages, per 5.2.
3. **Read structure.** Use the structure tree where the PDF is tagged. Otherwise rank font sizes:
   the body is the most common size, and each larger size, largest first, is a heading level.
4. **Build blocks.** Numbered lists from leading `1.` text; bulleted lists only from tags or a bullet
   character; tables from tags or ruling lines; everything else a paragraph.
5. **Write markdown** under the contract in 6.3.
6. **Gate it.** The shape gate and the product's own parser, before anything is shown.
7. **Show a preview** with the report of flags, and let the person accept or discard.

### 6.3 The output contract

**It must pass `66-FORMAT-SPECIFICATIONS.md` sections 2.2 and 2.5**, and use only what 2.2 lists as
built. Everything below serves that.

Rule | Why
UTF-8, LF endings, one final newline | The shape gate and section 3.1
`#` headings, `-` bullets, `1.` numbers, GFM pipe tables | Readable by any stranger's parser, section 2
**One paragraph on one line** | `remark-breaks` renders every soft break as a line break, section 2.3, so PDF line wraps would show
No raw HTML, and no front matter written | The file is the person's; a converter adds no keys
Ligatures U+FB00 to U+FB06 written as letters; nothing else normalised | 4.4, and byte honesty
Running headers, footers and page numbers dropped when a line repeats on most pages | They are print furniture. The count goes in the report

**Escaping, tested against the product's parser stack this session `[O]`.**

Input text in the PDF | Written as | What the stack does with it
`It cost $5 and $10` | `It cost \$5 and \$10` | Unescaped, `remark-math` renders `5 and ` as inline maths
`H~2~O` | `H\~2\~O` | Unescaped, GFM strikes the 2 through
`a | b` inside a table cell | `a \| b` | Unescaped, the cell splits in two

`UNVERIFIED:` the other CommonMark escapes (a leading `#`, `>`, `-` or `1.` in body text, and `[[`,
`<`, `*`, `_`) were not run against the stack. Each needs a fixture.

**Flagged, and listed in the report, never written into the file.** Default is nothing in the file,
as with the AI mark in section 4.9.

- OCR words below a confidence floor. 80 is the starting value, from 4.4.
- Headings inferred from font size rather than tags.
- Tables inferred from ruling lines rather than tags, and tables that could not be rebuilt.
- Pages with two or more text columns where the order is uncertain.
- Maths. Formulas are kept as the text the PDF holds, never rebuilt into LaTeX.
- Every image dropped, by page.

**Refused, with the number, and nothing written.** A refusal that does not say why is a failure.

- A page whose OCR confidence is below a page floor is left out and named; the rest converts.
  `UNVERIFIED:` the floor, to be set from fixtures.
- Output over the shape gate, `E016`, `E017` or `E018`, with the remedy "convert a page range".

### 6.4 Images

**Default: dropped, and each one listed in the report by page.** Nothing is uploaded unless asked.

**With "Keep images" on,** pdf.js extracts each image, the browser encodes it as PNG, and it goes to
`Uploads.put` under the project. The markdown gets `![Image from page N](path)`.

- Each image counts against `limits.uploads.file` and `limits.uploads.total`.
- One over the per-file cap takes `E038` by name, and the rest continue.
- No AI alt text in v1. The alt text says which page, which is true.

### 6.5 Landing as a change-queue proposal

**Entry 2 never edits the document directly.** The converted markdown is one item on S20, with the
fields S20 already reads: `{ id, source, author, ask, span, proposedBytes, at }`.

Field | Value
`author` | the person who asked
`model` | the engine: `pdf.js text layer`, `Tesseract 5`, or the vision model's id
`ask` | `Convert PDF: <file name>, pages a to b`
`span` | the cursor position when the conversion started

**Open for the owners of S20 and file 21: the `source` value.** A conversion is machine-made text
the person did not type, so it must not sit under People.

- Recommended: `ai` when the vision pass touched any page, and a new `convert` value otherwise, shown
  under the AI filter.
- Rejected: `person`, which would mix machine work into the human list against S20's first rule.

**If the document changed while the conversion ran,** the item still lands in the queue. The splice
at accept time follows the same rule as any other queue item, `E027` if its range is stale.

### 6.6 The PDF's life, and training

Path | Where the PDF is | When it goes
Text layer and browser OCR | Tab memory only. Never IndexedDB, never R2, never our server | When the conversion ends, for entries 1 and 3
The AI panel, entry 2 | Tab memory, so a second page range needs no second pick | When the panel closes or the tab closes
Vision pass, Pro | One page image per request, to our Worker and on to Workers AI, in memory | When the response ends. Not written to R2, not logged
Desktop | Where the person keeps it. We copy nothing | n/a

**Never trained on.** Gate A already bars any provider that trains on inputs, and Cloudflare's terms
pass it (2.5). Our own rule on top: no converted page, PDF or output enters an evaluation set, a
fixture, or a log.

**What we log.** One line per conversion: path, page counts by kind, flags by kind, milliseconds,
and the outcome. Never the file name, never a byte of text, per `27-MODEL-ROUTING-SPEC.md` section
10.3.

### 6.7 Failure states

Proposed ids go to the owner of `17-ERROR-AND-REFUSAL-CATALOGUE.md`; none is numbered here.

Condition | What happens | Id
Not a PDF | Named, nothing done | `E560`
Password protected | Refused: "Remove the password in the app that made it, then try again" | new
Damaged or unreadable | Refused, with pdf.js's reason in plain words | new
Over the page cap | Refused with both numbers, and a page-range picker offered | new
Over the size cap | Refused with both numbers | new
No text layer and OCR could not start | Refused: offline on first use, since the OCR files are not yet cached | new
Output over the shape gate | Refused with the number, and a page range offered | `E016`, `E017`, `E018`
Vision pass out of pages or unavailable | The Tesseract result is used, and the report says so | new
Cancelled | Nothing written. The PDF is released | none

**One difference from Word import, on purpose.** A failed Word conversion keeps the original as an
attachment, `E561`. A failed PDF conversion keeps nothing, because the founder's rule is that the
PDF is not stored.

### 6.8 Acceptance, proposed for the register

Criterion | Test
No request carries the PDF's bytes off the machine on the text or browser OCR path | the same shape as `A123`
The tagged fixture yields H1 to H3, both lists and the table equal to its source markdown, ignoring spacing | fixture `pdf/tagged`
`$5 and $10` in a PDF is written `\$5 and \$10`, and renders as text | fixture `pdf/dollar`
Every OCR word below the floor appears in the report, and none is silently changed | fixture `pdf/scan`
After a conversion, no IndexedDB entry and no R2 object holds the PDF | an inspection test
Entry 2 creates exactly one queue item and changes no byte of the document | fixture `pdf/panel`

### 6.9 Never build

- **No chat over the PDF.** No questions, no summary, no "ask this document".
- **No storing the PDF,** not in R2, IndexedDB, a cache, or a log.
- **No training** on the PDF or its output, by us or any provider.
- **No embedding or search index** of a PDF the person did not keep as a document.
- **No silent AI clean-up.** A model never rewrites the converted text in the same step. That is an
  AI edit, with its own ask, afterwards.
- **No server conversion of a text PDF.** The browser does it without the file leaving.
- **No Marker, Surya, Nougat, PyMuPDF4LLM, Scribe.js or MinerU,** per section 2.
- **No LaTeX rebuilt from a formula** in v1. The text stays as the PDF holds it, flagged.

---

## 7. Limits

**What was tested is small.** One English page, printed by Chrome, in three forms. No LaTeX paper,
no InDesign layout, no phone photo, no rotated or skewed scan, no handwriting and no Indian script.

**Where the timings come from.** One arm64 Mac, in Node, not in a browser tab and not on a phone.
Every latency and every cap derived from one is provisional until measured in a tab.

**The real-PDF sample is nine files that happened to be here.** 182 pages. The tagged share and the
characters a page are not population figures.

**Unmeasured.**

- Gemma 4's reading of a scanned page, and its latency. No vision model has touched our fixtures.
- Why tesseract.js lost three table rows the native binary kept.
- Which language data tesseract.js downloads by default, and how large it is.
- The page floor for OCR confidence.
- Eight of the eleven CommonMark escapes the writer needs.
- `toMarkdown`'s own page and size limits (2.5).

**The public benchmarks do not cover what we would ship,** and olmOCR-Bench ignores markdown syntax
(4.1). Section 4.4 is the only evidence here on pdf.js, pdfplumber or Tesseract, and it is one page.

**Docling's run is from earlier the same day,** read from its saved output and log. The others were
rerun for this section.

**One process note.** The escape test in 6.3 ran a script from the repository root, so that Node
could resolve the installed parser packages. The script was deleted in the same command, and `git
status` showed no trace.