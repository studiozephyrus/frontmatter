Everything I can open is opened. Writing up.

## 1. Indian and India-priced comparables

| Product | Price (verbatim) | Free tier | Markdown? | URL |
|---|---|---|---|---|
| **Zoho Writer** | "Yes, Zoho Writer is free for both individual users and organizations. You will get unrestricted access to all its features as soon as you sign up." Automation credits: "200 Free credits / month / org", "1000 Free credits / month / org" | Yes — whole product | **not opened** (3 markdown URLs 404'd) | zoho.com/writer/pricing.html |
| **Zoho Zia** (AI in Writer) | "Yes, Zoho Writer's AI-powered writing assistant, Zia, helps users with content creation, modification, and review." No separate rupee add-on price on the page | Included | — | zoho.com/writer/pricing.html |
| Zoho Workplace Standard | "₹99 /User /Month" billed annually; "₹129 /User" monthly | "Forever Free Plan — Email hosting for one domain for up to 5 users" | — | zoho.com/en-in/workplace/pricing.html |
| Zoho Workplace Professional | "₹399 /User /Month" annually; "₹489 /User" monthly | same | — | same |
| Zoho Mail Lite | "₹59 /User /Month" (5 GB), "₹75 /User /Month" (10 GB) | same | — | same |
| Zoho Mail Premium | "₹199 /User /Month" | same | — | same |
| Zoho Notebook | "we also have a Pro plan" — Pro rupee price **not opened** | "Zoho Notebook offers a free plan… with no ads, hidden fees, or paywalls" | **not opened** | zoho.com/notebook/ |
| Google Workspace **Base** | "₹99" /user/month ("₹49.50" — "50% off for 3 months") | 14-day trial | — | workspace.google.com/pricing?hl=en_in |
| Google Workspace Starter | "₹270 /user/month" | " | — | same |
| Google Workspace Standard | "₹1,080" ("₹864", "20% Introductory", "Limited to 20 users") | " | — | same |
| **Notion** | "Free $0 per member / month"; "Plus $10"; "Business $20" — **shown in USD, no rupee figure on the page** | Yes | — | notion.com/pricing |
| **JetBrains Writerside** | "Writerside – now available only as a free plugin for JetBrains IDEs." | Free | — | jetbrains.com/writerside/ |
| **Typora** | "$ 14.99" | "15 days free trial / up to 3 devices" | Yes (markdown editor) | typora.io |
| Canva Docs | **not opened** (HTTP 403) | — | — | canva.com/en_in/pricing/ |
| Freshworks doc product | **not opened** (not found quickly) | — | — | — |

Zoho prices carry: "Local taxes (VAT, GST, etc.) will be charged in addition to the prices mentioned." Google's: "Price is per user/month and does not include tax".

## 2. The name

**Trademark — all three registries: not opened.**
- `tmrsearch.ipindia.gov.in` returns 200 but the app is gated: "Login with OTP / Email: / OR / Mobile No.: / Enter Captcha / Send OTP". I do not solve CAPTCHAs or log in, so **no Indian trademark result was obtained**. This risk is still completely unchecked.
- `branddb.wipo.int` returns only the Angular shell; the API POST returned HTML, not JSON. **Not opened.**
- `tmsearch.uspto.gov` returns 200 shell; the API POST returned `MethodNotAllowed`. **Not opened.**

**Domains** (RDAP, 2026-09-16):

| Domain | State | Registrar | Created |
|---|---|---|---|
| frontmatter.in | **Registered** | GoDaddy | 2026-06-24 (expires 2029-06-24) |
| frontmatter.com | **Registered** | PlanetHoster Inc. | 2001-07-24 |
| frontmatter.io | **Undetermined** — "No RDAP service is available for this resource" | — | — |
| frontmatter.dev | **Registered** | Hosting Concepts B.V. d/b/a Registrar.eu | 2026-03-11 |
| frontmatter.app | **Registered** | Namecheap Inc. | 2024-01-28 |
| getfrontmatter.com | **Not registered** (404) | — | — |
| usefrontmatter.com | **Not registered** (404) | — | — |
| frontmatter.ai | **Registered** | GoDaddy.com, LLC | 2021-09-26 |
| mdmax.com | **Registered** | GoDaddy Online Services Cayman Islands Ltd. | 2001-04-05 |
| mdmax.in | **Available** — "Domain mdmax.in is available for registration" | — | — |
| mdmax.ai | **Not registered** ("Object not found") | — | — |

Note `frontmatter.in` was created 2026-06-24, consistent with it being your own registration (AGENTS.md §8 names it the live domain).

**npm**
- `frontmatter` — **exists**, latest `0.0.3`, created 2016-01-10, last modified 2022-06-18. Description: "Parsing YAML frontmatter from a string."
- `mdmax` — `{"error":"Not found"}` → **free**
- `@frontmatter/cli` — returned no name or version → that package does not exist. This does **not** prove the `@frontmatter` scope is unclaimed; I did not verify scope ownership.

**GitHub**
- `github.com/FrontMatter` — **exists**, id `91119031`, an Organization
- `github.com/mdmax` — **exists**, id `2910952`, a User

**VS Code Marketplace** (gallery API, `eliostruyf.vscode-front-matter`):
- displayName: `Front Matter CMS`; publisher `eliostruyf / Elio Struyf`
- **install = 82819.0**; version `10.12.0`
- lastUpdated `2026-08-21T14:32:26.627Z`; published `2019-08-26T09:04:42.62Z`

So the extension has grown from your recorded 82,265 to 82,819 and is actively maintained (updated three weeks ago).

## 3. Razorpay and payment edge cases

**International cards are not on by default.** From `razorpay.com/docs/.../international-debit-credit-cards.md`:

> "International payments require special security and risk checks. We enable this feature only after our banking partners have approved it, ensuring compliance and protecting against fraud."

Eligibility, verbatim: "You must have an active Razorpay account with KYC verification completed" and "a valid website with the following sections/pages clearly defined: **Terms and Conditions**, **Privacy policy**, **Refund and Cancellation policy**, **Shipping policy**", followed by: "International payments cannot be enabled for your account without these sections/pages on your website." Onboarding needs "Complete video KYC: Requires Aadhaar and PAN card."

**Card mandates — the ₹15,000 rule** (`recurring-payments/cards/faqs.md`):

> "You can register mandates up to a maximum of ₹15,000 without any intervention from customers and process subsequent payments."
> "For others to register and process mandates of amounts greater than ₹15,000, an Additional Factor Authentication (AFA) is required from customers for every subsequent debit."
> "**Debits greater than 15K**: Initial or subsequent debits greater than 15,000 INR are not allowed for RuPay card recurring transactions."

₹2,499/year sits far below ₹15,000, so an annual plan clears this without AFA.

**UPI AutoPay** (`recurring-payments/upi.md`) — no rupee limit is stated on that page. It does state: "A critical regulatory requirement mandates notifying the customer at least 24 hours prior to initiating each debit. This is called Pre-Debit Notification (PDN)." A UPI AutoPay rupee cap is **not opened**.

**GST** (razorpay.com/pricing/):
> "Razorpay charges 2% + GST per transaction. This includes payment processing for all modes cards, UPI, wallets, and net banking with no additional fees for setup, AMC, refunds, or settlement."
> "* Platform fee 2.15% + GST" (International Payments)
> "The transaction fee and applicable GST are automatically deducted from the customer's payment at the source."
> Launch offer on the page: "at just 2% / 0% * platform fees for first 90 days".

**Export of services / FIRC** (`firs-automated-process.md`):
> "FIRS Certificate is a document that acts as evidence that you have received funds from a foreign country. The document is recognised as proof in scenarios such as getting GST refunds, claiming drawbacks from the government."

**Stripe India** (stripe.com/in/pricing): "2% for Mastercard and Visa cards issued in India*"; "3% for Mastercard and Visa cards issued outside India" + "2% if currency conversion is required"; "3.5% for American Express cards issued outside India"; "4.3% for international cards with USD or other currency presentment". Also: "Domestic debit card transactions have the Merchant Discount Rate (MDR) of 0.4% capped to ₹200."

**PayPal India merchant fees: not opened** (not attempted).

## 4. India developer population

From "Octoverse 2025: The state of open source", github.blog:

> "India added more than 5.2 million developers in 2025, which accounts for a little over 14% of GitHub's total +36 million new developers in 2025. That makes India the single largest source of new developers on GitHub this year."
> "India alone added more than 5 million developers this year (over 14% of all new accounts) and is on track to account for one in every three new developers on GitHub by 2030."
> "The U.S. remains the largest source of contributions (~12.8M, 31.8%). India ranks second (~5M, 12.5%) and leads by distinct repositories (405k vs. 342k)."

## What this means for a ₹299 India-first launch

- ₹299/month is priced above every India-anchored comparable opened: Zoho Workplace Standard is ₹99 and Professional ₹399 for an entire suite; Google Workspace Base is ₹99 and Starter ₹270.
- The direct document competitor is free, not cheap. Zoho Writer is free "for both individual users and organizations", Zia AI included; Writerside is free; Notion and Zoho Notebook have free tiers. ₹299 must be justified against ₹0, not against Notion's $10.
- ₹2,499/year clears the ₹15,000 card-mandate line, so annual billing avoids per-debit AFA. RuPay cannot take recurring debits above ₹15,000 at all — irrelevant at this price, relevant if a team tier is ever priced high.
- Razorpay's 2% + GST applies domestically; selling in dollars costs 2.15% + GST and needs bank approval plus four published policy pages, so dollar pricing is not a same-week switch.
- India's developer supply is the strongest verified number here: 5.2 million new GitHub developers in 2025, the world's largest source.
- The name is the sharpest unresolved risk. Front Matter CMS is at 82,819 installs and was updated 2026-08-21; the GitHub org `FrontMatter`, npm `frontmatter`, and `frontmatter.com/.dev/.app/.ai` are all taken. `mdmax.in` and `mdmax.ai` are free and npm `mdmax` is free.
- **No trademark search succeeded.** Treat Indian trademark as entirely unchecked, not as clear.

## Not opened

- India trademark registry (`tmrsearch.ipindia.gov.in`) — OTP login plus CAPTCHA; I do not solve CAPTCHAs
- WIPO Global Brand Database — JS shell only, API returned HTML
- USPTO `tmsearch.uspto.gov` — JS shell; API POST returned `MethodNotAllowed`
- Canva India pricing — HTTP 403
- Zoho Writer markdown support — no page found (3 candidate URLs 404)
- Zoho Notebook Pro rupee price
- Razorpay UPI AutoPay rupee cap — not stated on the page opened
- PayPal India merchant fees — not attempted
- Notion India rupee pricing — page served USD only
- `frontmatter.io` — no RDAP service for `.io` at rdap.org
- Freshworks document product
- npm `@frontmatter` **scope** ownership (only the `@frontmatter/cli` package was checked)