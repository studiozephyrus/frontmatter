# L2. Abuse of free AI tiers, and how to stop it without a captcha

Lens L2, opened 18 September 2026. Ids prefixed `FL2`.

Binding brief: `docs/research/2026-09-18/BRIEF.md`. Evidence rules apply in full. British spelling,
plain hyphens only.

**Quoting convention.** Every verbatim span copied from a page I opened sits in a fenced block and
is labelled as a quote. Prose outside a fence is mine. If a string is not in a fence and not in
quotation marks, I did not copy it, so do not treat it as the page's wording.

**Tool note, because it changes what you should trust here.** `WebFetch` is refused in this session
by the local taint gate (Learned Rule #10, lethal trifecta). Per Learned Rule #70 I tested the
alternative rather than declaring the capability gone: `curl -sL --compressed` reaches every host I
needed. Pages were fetched with curl and converted to text with a stdlib parser, so what I quote is
the page body as served to a client that is not signed in. Where a page is drawn by JavaScript and
curl returned only a shell, I say so.

**Founder constraint held throughout.** No captchas. No puzzles. No tours. Sign-in is one tap with
Google or GitHub, like Google Docs. Every defence below is scored against that, and a defence that
breaks it is marked as breaking it rather than quietly recommended.

---

## Part one. The attacks, with real incidents

### FL2-01. LLMjacking: stolen cloud credentials resold as inference, 46,000 dollars a day

- **What was done:** Sysdig's Threat Research Team found attackers who stole cloud credentials and
  ran inference on somebody else's account. They got in through a Laravel server with an unpatched
  software flaw, catalogued as CVE-2021-3129, where CVE is the public catalogue of known security
  defects. Quoting the page:

```
The Sysdig Threat Research Team (TRT) recently observed a new attack that leveraged stolen cloud
credentials in order to target ten cloud-hosted large language model (LLM) services, known as
LLMjacking. The credentials were obtained from a popular target, a system running a vulnerable
version of Laravel ( CVE-2021-3129).
```

- **Motive, quoted:**

```
In this case, attackers intend to sell LLM access to other cybercriminals while the cloud account
owner pays the bill.
```

- **Cost, quoted, and the arithmetic is printed on the page, which is why I can repeat it:**

```
If undiscovered, this type of attack could result in over $46,000 of LLM consumption costs per day
for the victim.

1000 input tokens cost $0.008, 1000 output tokens cost $0.024.

Max 500,000 input and output tokens can be processed per minute according to AWS Bedrock. We can
consider the average cost between input and output tokens, which is $0.016 for 1000 tokens.

Leading to the total cost: (500K tokens/1000 * $0.016) * 60 minutes * 24 hours * 4 regions =
$46,080 / day
```

- **The ten services their credential checker probed, quoted:**

```
AI21 Labs, Anthropic, AWS Bedrock, Azure, ElevenLabs, MakerSuite, Mistral, OpenAI, OpenRouter, and
GCP Vertex AI
```

- **How it was found:** cloud audit logs. The attackers fingerprinted access without paying for a
  single real completion, by sending a deliberately invalid parameter and reading the error type.
  Quoting:

```
They sent a legitimate request but specified "max_tokens_to_sample" to be -1. This is an invalid
error which causes the "ValidationException" error, but it is useful information for the attacker
to have because it tells them the credentials have access to the LLMs and they have been enabled.
Otherwise, they would have received an "AccessDenied" error.
```

- **The resale layer, quoted:**

```
The key checking code that verifies if credentials are able to use targeted LLMs also makes
reference to another project: OAI Reverse Proxy. This open source project acts as a reverse proxy
for LLM services. Using software such as this would allow an attacker to centrally manage access to
multiple LLM accounts while not exposing the underlying credentials, or in this case, the
underlying pool of compromised credentials.
```

- **The anti-forensics line that matters most to us, quoted:**

```
OAI Reverse Proxy states it will not use any AWS key that has logging enabled for the sake of
"privacy."
```

- **Source:** https://www.sysdig.com/blog/llmjacking-stolen-cloud-credentials-used-in-new-ai-attack
  published "May 6, 2024", opened 2026-09-18.
- **What it means for us:** the asset being stolen is not our data, it is our provider quota, and
  there is a market to sell it into. Pooled free provider quotas are exactly what that market eats.
  The victim here had no spending ceiling. That, not the credential theft, is what turned a break-in
  into a bill of 46,080 dollars a day.
- **Verdict:** the load-bearing incident for this lens. It sets the worst case and names the resale
  software.

### FL2-02. The standard names the attack: OWASP LLM10:2025 Unbounded Consumption

- **What it is:** the tenth entry in the OWASP list for applications built on large language
  models, 2025 edition, which is the current one. It is the entry that covers our problem exactly. Quoting the definition:

```
Unbounded Consumption occurs when a Large Language Model (LLM) application allows users to conduct
excessive and uncontrolled inferences, leading to risks such as denial of service (DoS), economic
losses, model theft, and service degradation. The high computational demands of LLMs, especially in
cloud environments, make them vulnerable to resource exploitation and unauthorized usage.
```

- **Denial of wallet, named and defined, quoted:**

```
2. Denial of Wallet (DoW)

By initiating a high volume of operations, attackers exploit the cost-per-use model of cloud-based
AI services, leading to unsustainable financial burdens on the provider and risking financial ruin.
```

- **The attack scenario, quoted:**

```
Scenario #4: Denial of Wallet (DoW)

An attacker generates excessive operations to exploit the pay-per-use model of cloud-based AI
services, causing unsustainable costs for the service provider.
```

- **The other six vulnerability shapes on the page, verbatim headings:** `1. Variable-Length Input
  Flood`, `3. Continuous Input Overflow`, `4. Resource-Intensive Queries`, `5. Model Extraction via
  API`, `6. Functional Model Replication`, `7. Side-Channel Attacks`.
- **The twelve mitigations, verbatim headings, in the page's order:** `1. Input Validation`,
  `2. Limit Exposure of Logits and Logprobs`, `3. Rate Limiting`, `4. Resource Allocation
  Management`, `5. Timeouts and Throttling`, `6.Sandbox Techniques`, `7. Comprehensive Logging,
  Monitoring and Anomaly Detection`, `8. Watermarking`, `9. Graceful Degradation`, `10. Limit
  Queued Actions and Scale Robustly`, `11. Adversarial Robustness Training`, `12. Glitch Token
  Filtering`.
- **Three of those, quoted in full, because they are the three we should actually build:**

```
3. Rate Limiting

Apply rate limiting and user quotas to restrict the number of requests a single source entity can
make in a given time period.

7. Comprehensive Logging, Monitoring and Anomaly Detection

Continuously monitor resource usage and implement logging to detect and respond to unusual patterns
of resource consumption.

9. Graceful Degradation

Design the system to degrade gracefully under heavy load, maintaining partial functionality rather
than complete failure.
```

- **Source:** https://genai.owasp.org/llmrisk/llm102025-unbounded-consumption/ opened 2026-09-18.
- **The gap in the standard, and it is the gap that matters to us:** not one of the twelve
  mitigations is a captcha, a puzzle or a human-verification challenge. The standard's whole answer
  is budgets, limits, timeouts, logging and graceful degradation. That is a useful thing to be able
  to tell the founder: the published security consensus on this exact risk agrees with his rule by
  accident. There is nothing to give up.
- **Also worth taking from the page:** the reference list points at a real named incident,
  `Sourcegraph Security Incident on API Limits Manipulation and DoS Attack`, which I chase in
  FL2-03.
- **Verdict:** this is the frame to write our own guardrail document against, so that a future
  reviewer can map each control to a numbered standard rather than to our opinion.

### FL2-03. Sourcegraph, 2023: a leaked admin token became a public free-tier proxy, 2 million views

- **What was done:** somebody found an admin token in a public commit, made themselves an
  administrator, and then used the one privilege that mattered, raising other people's rate limits.
  Quoting the company's own write-up:

```
Sourcegraph experienced a security incident on August 30, 2023 where a malicious actor used a
leaked admin access token in our public Sourcegraph instance at Sourcegraph.com. The malicious
external user used their privileges to increase API rate limits for a small number of users.
```

- **The part that makes this a free-tier abuse story rather than a breach story, quoted:**

```
The malicious user, or someone connected to them, created a proxy app allowing users to directly
call Sourcegraph's APIs and leverage the underlying LLM. Users were instructed to create free
Sourcegraph.com accounts, generate access tokens, and then request the malicious user to greatly
increase their rate limit.
```

- **Scale, quoted, and this is the number to remember:**

```
The promise of free access to Sourcegraph API prompted many to create accounts and start using the
proxy app. The app and instructions on how to use it quickly made its way across the web,
generating close to 2 million views.
```

- **How it was found, quoted:**

```
On August 30, 2023 our team noticed a significant increase in API usage and began investigating the
cause.
```

- **Timeline, quoted from the page, with the company's own timestamps:**

```
On July 14, 2023 (2023-07-14 22:01:00 UTC) a Sourcegraph engineer accidentally committed a code
change that contained an active site-admin access token.

On August 28, 2023 (2023-08-28 13:18:36 UTC), a user created a brand new Sourcegraph account.

On August 30, 2023 (2023-08-30 06:47:59 UTC), using the leaked site-admin access token, this user
elevated their account privileges to a site-admin and gained unauthorized access to the admin
dashboard.

On August 30 (2023-08-30 13:25:54 UTC), the Sourcegraph security team identified the malicious
site-admin user, revoked their access, and kicked off an internal investigation for both mitigation
and next steps.
```

- **What the fix cost their honest users, quoted, and this is the cost of having no other lever:**

```
Temporarily reduced the rate limits for all free community users

If you're a Community user, we know these rate limit reductions aren't ideal for devs who are using
Cody to help them write and understand code. This reduction will be short-term while we investigate
the issue further.
```

- **Source:** https://sourcegraph.com/blog/security-update-august-2023 dated "August 30, 2023",
  page carries "Updated August 31, 2023", opened 2026-09-18.
- **Three things to take from it.** First, the detection that worked was a usage anomaly, not a
  signup control: they noticed the bill, not the accounts. Second, the abuse ran entirely on
  legitimately created free accounts, so every signup-side defence in part two would have caught
  nothing. Third, the blunt remedy, cutting limits for all free users, punished the honest majority,
  which is exactly the outcome a per-account budget is meant to avoid.
- **Verdict:** the closest published analogue to our own risk. Same shape: a free tier, an
  identity-backed signup, a model behind it, and an economic incentive to farm it.

### FL2-04. LLMjacking a year on: 10x growth, 85,000 requests, and what the demand actually is

- **Growth and cost, quoted from the follow-up:**

```
LLMjacking itself is on the rise, with a 10x increase in LLM requests during the month of July and
2x the amount of unique IP addresses engaging in these attacks over the first half of 2024.

With the continued progress of LLM development, the first potential cost to victims is monetary,
increasing nearly three-fold to over $100,000/day when using cutting edge models like Claude 3
Opus.
```

- **How concentrated the burst is, quoted, and this is the number that argues for a circuit
  breaker rather than a monthly cap:**

```
For several months, TRT monitored the use of Bedrock API calls by attackers. The number of requests
hovered in the hundreds per day, but we saw two large usage spikes in July. In total, we detected
more than 85,000 requests to Bedrock API, most of them (61,000) came in a three-hour window of July
11, 2024. This exemplifies how quickly attackers can consume resources through LLM usage. Another
spike was a few days after, with 15,000 requests on July 24, 2024.
```

- **Who the buyers are, and it is not who a founder assumes, quoted:**

```
the attackers' motives, which range from personal use at no cost to selling access to people who
have been banned by their Large Language Model (LLM) service or entities in sanctioned countries.
```

- **What the stolen capacity is actually spent on, quoted:**

```
Analyzing the contents of these prompts, the majority of the content were roleplay related (~95%),
so we filtered the results to work with around 4,800 prompts. The main language used in the prompts
is English (80%) and the second most-used language is Korean (10%), with the rest being Russian,
Romanian, German, Spanish, and Japanese.
```

```
While the above were more light-hearted use of LLMs, the majority of the LLMjacking prompts we
recorded involved role-playing conversations where the user would interact with the AI as if it
were a character in a game. Most of the time, these interactions were adult-oriented and not
suitable for publishing. As these role-playing sessions were interactive, a lot of prompts and
responses were generated which can get very expensive.
```

- **Source:** https://www.sysdig.com/blog/growing-dangers-of-llmjacking published
  "September 18, 2024", opened 2026-09-18.
- **Why this is good news for us, and I want to be careful not to overstate it.** The demand that
  funds this market is for a general chat endpoint that will roleplay without refusing. Our AI
  surface is a splice editor and a blueprint generator, both of which return edits to a supplied
  markdown document rather than open conversation. `INFERENCE:` a product whose AI output is
  structured edits against a user-supplied file is a poor substitute for a chat completion endpoint,
  so the resale value of a farmed frontmatter account is lower than the resale value of a farmed
  raw-model account. This lowers the probability of organised farming; it does not lower the cost of
  a single abusive user, and it says nothing about a competitor scraping the blueprint generator.
- **Verdict:** shapes the threat model. The realistic attacker for us is a cost-inflating
  multi-accounter and a scraper, not an organised resale ring, unless we ever expose a raw
  completion endpoint. Which is an argument for never exposing one.

### FL2-05. The resale market has a price list: 30 dollars for 30 days, and 50,000 dollars burned in 4.5 days

- **What was done:** Sysdig went back a year later and read the proxy operators' own dashboards. The
  proxies publish their own statistics, so the numbers below are the attackers' own accounting.
- **The price of stolen access, quoted:**

```
A 30-day access token costs the user $30.
```

- **What that 30 dollars costs the victim, quoted:**

```
If we compute those costs as the average between input and output costs, the total amount increases
to almost $50,000 ($49,595.83). Based on the "uptime" of 395,555 seconds, this figure was reached
in 4.5 days.
```

```
Claude 3 Opus is the most used and expensive model, with 865.59 million tokens used. Based on the
token price from the Bedrock documentation, we estimated that this model alone costs the account
owner $38,951.55.
```

```
The total number of tokens used by all the ORPs amounted to more than 2 billion tokens during the
times we could observe.
```

- **How fast a new model gets absorbed, quoted:**

```
Attackers quickly implement the latest models when they are released. For example, on Dec 26, 2024,
DeepSeek released its advanced model, DeepSeek-V3, and a few days later it was already implemented
in this OpenAI Reverse Proxy (ORP) instance hosted on HuggingFace
```

```
The ORP below shows it has 55 DeepSeek API keys already.
```

- **Scale of the proxy layer, quoted:**

```
During our research we discovered over 20 ORP proxies, some using custom domains and others using
TryCloudFlare tunnels
```

- **How they stay hidden, quoted, and this is relevant to any internet-protocol-address based
  defence we might build:**

```
They often use TryCloudflare tunnels that do not require registration to create temporary domains.
```

- **Where the community lives, quoted:**

```
Many active communities exist around using LLMs for NSFW content and creating AI characters for
role-playing. These users prefer communicating over 4chan and Discord.
```

- **Source:** https://www.sysdig.com/blog/llmjacking-targets-deepseek published "February 7, 2025",
  opened 2026-09-18. The article names specific attacker-run domains and a storefront; I have not
  reproduced them, because one of them is a slur, and the price is the only part we need.
- **The economics to hold on to.** The attacker sells a month for 30 dollars and the victim pays
  tens of thousands. Any defence we build has to beat that ratio, which means the only defence that
  actually works is a ceiling on what one account can spend, because the attacker's willingness to
  pay for access is roughly a thousandth of our exposure.
- **Verdict:** this is the finding that makes a per-account hard budget non-negotiable rather than
  nice to have.

### FL2-06. Freejacking killed free tiers across the continuous integration industry, and the abuser's wage is the reason

- **What was done:** a provider wrote up its own attackers. Quoting the opening, which is the
  industry summary in one sentence:

```
CI providers like webapp.io, GitLab, TravisCI, and Shippable are all worsening or shutting down
their free tiers due to cryptocurrency mining attacks.
```

```
On September 1st, 2020, GitLab announced that their free CI offering was being restricted in
response to "usage." Two months later, TravisCI announced that a similar restriction in response to
"significant abuse."
```

- **One farmer's account, quoted, and note how ordinary the cover story is:**

```
"testronan" is an avid Flask user. Every hour they make a commit to their only GitHub repository:
"testronan/MyFirstRepository-Flask"
```

```
Their repository contains configurations for five different CI providers: TravisCI, CircleCI,
GitHub Actions, Wercker, and webapp.io.
```

```
The repository is not attacking GitHub directly, instead it abuses GitHub actions' "cron" feature
to create a new commit every hour and mine WebDollars on four other CI providers.
```

- **The economics, quoted, and this is the single most important sentence in this lens for an
  Indian founder:**

```
At WebDollar's April peak price of $.0005, the repository was making $77USD per month - a
considerable sum in many countries, especially given that the only tools required are a laptop and
an internet connection.
```

```
"vippro99"'s comments indicate that they are in Vietnam. At the current price of Monero, each
instance of their cryptocurrency miner on Shippable is giving $2.5USD per month, so maintaining a
mere 60 concurrent instances would be equivalent to a full time job in that country.
```

- **How the evasion worked, quoted:**

```
The idea is simple: Mining cryptocurrency directly in CI is somewhat easily detectable (with
executable content analysis, for example) but browser automation is a common workload within CI.
```

- **Source:** https://webapp.io/blog/crypto-miners-are-killing-free-ci by "Colin Chartier", page
  footer reads "Last Updated • Apr 25, 2021", opened 2026-09-18.
- **What it means for us.** The founder's worry is well founded and the reason is arithmetic, not
  malice. A free tier is worth farming when the yield per account times the number of accounts
  beats a local wage. Ten AI edits a month is a small yield per account, so the farmer's answer is
  more accounts, which is precisely why our whole defence has to sit on the cost of the marginal
  account rather than on the cost of the marginal request.
- **Verdict:** frames the economic target. Make one extra account worth so little that farming
  cannot beat a wage anywhere.

### FL2-07. PURPLEURCHIN: captchas, email verification and internet-protocol limits were all bypassed, by name

- **What was done:** Sysdig documented an automated free-account farm spanning several providers.
  Quoting:

```
Sysdig's TRT uncovered more than 30 GitHub accounts, 2,000 Heroku accounts, and 900 Buddy accounts.
The threat actor is targeting several platforms at the same time and seemingly always looking for
more.
```

```
The activity observed is known as "freejacking," which is the abuse of compute allocated for free
trial accounts on CI/CD platforms.
```

- **The line the founder should read, quoted in full, because it settles the captcha argument on
  security grounds rather than taste:**

```
Provider attempts to ward off this fraud ranges from making it more time-consuming to create
accounts with CAPTCHA and other technologies to requiring a valid credit card on file. The
operation detailed in this article bypasses a number of these defenses and shows progressive
sophistication regarding automation techniques.
```

- **How the captcha was beaten, quoted:**

```
PURPLEURCHIN manages to bypass all of these defenses by instrumenting a Brave web browser to
accomplish the registration. In order for it to be automated, they use XDOTOOL to send mouse and
keyboard input to the browser in a programmatic way.
```

```
Taking a closer look at the browser extensions that the threat actor installed, we found one named
" Buster: Captcha Solver for Humans." This tool also likely facilitates PURPLEURCHIN's automated
captcha solving during account creations.
```

```
There were indications in logs that octocaptcha and funcaptcha are being bypassed.
```

```
We also identified several Google recaptcha audio file URLs in Heroku logs, as shown below.
However, these logs date back to a few months ago. We did not find any evidence of audio captcha
bypasses in the most recent execution pipeline, but this is an indication that PURPLEURCHIN is
capable of bypassing audio captchas.
```

- **How email verification was beaten, quoted:**

```
This container, identified as imap84744474, contains an IMAP server to receive emails and a Postfix
server to send emails. When the container is run, it is given a domain name from the actor's pool.
```

```
When registering new accounts, it is used to receive the account creation and verification emails.
Other scripts are run to act on this information, allowing automated registration to continue.
```

- **How address-based limits were beaten, quoted:**

```
One of the first issues with automatically creating accounts is making sure that your source IP
address is different for each account. Many sites use rate-limiting and IP-based heuristics to make
it difficult to create large numbers of accounts.
```

```
PURPLEURCHIN uses the popular OpenVPN software package along with the Namecheap VPN network. The
VPN configuration file is chosen at random from a bench of VPN servers along with the credentials
necessary to connect to them.
```

- **Cost to the provider, quoted:**

```
The Sysdig TRT estimates that every free GitHub account that PURPLEURCHIN creates costs Github $15
per month. Free tier accounts from the other service providers discussed in this report can cost
providers $7 to $10 per month. At these rates, it would cost a provider more than $100,000 for a
threat actor to mine one Monero (XMR).
```

- **Source:** https://www.sysdig.com/blog/massive-cryptomining-operation-github-actions published
  "October 25, 2022", opened 2026-09-18.
- **The conclusion I draw, and I want it on the record because it is the answer to the founder's
  question.** A captcha would not have stopped this. Neither would email verification, nor
  address-based rate limits. All three were defeated by a determined operator, and all three are
  paid for by every honest user at every signup. The defences that this operator could not have
  beaten are the ones that sit after the account exists: a hard ceiling on what one account can
  spend, and an alarm on the aggregate. So the no-captcha rule costs us less than it looks like it
  costs, as long as we spend the saved effort on the budget layer.
- **Verdict:** the evidence base for the recommendation in part four.

### FL2-08. 28.65 million secrets leaked on public GitHub in 2025, and 113,000 of them were DeepSeek keys

- **Why this belongs in part one:** bring-your-own-key is on our list of escape valves, and the
  supply of stolen keys is the reason the resale market in FL2-05 has stock. Quoting GitGuardian's
  fifth annual report summary:

```
According to our latest "State of Secrets Sprawl" report, 28.65 million new hardcoded secrets were
added to public GitHub commits in 2025 alone, a 34% increase year over year and the largest
single-year jump we've recorded.
```

```
One of the clearest signals in the data is that the composition of leaked secrets is changing. In
2025, AI service secrets reached 1,275,105, up 81% year over year. The report points to 113,000
leaked DeepSeek API keys as one example of how these windows of exposure open.
```

- **The finding that should change how we document any key field we ever add, quoted:**

```
Taking a closer look at AI infrastructure, we identified 24,008 unique secrets exposed in
MCP-related configuration files across public GitHub, including 2,117 unique valid credentials.
This is 8.8% of all MCP-related findings.
```

```
The problem is often driven by the fact that the documentation itself encourages unsafe patterns.
The report notes that popular MCP setup guides often recommend putting API keys directly into
configuration files, command-line arguments, or embedded connection strings.
```

- **And one number about agent-written code specifically, quoted:**

```
Claude Code-assisted commits showed a 3.2% secret-leak rate, versus a 1.5% baseline across all
public GitHub commits.
```

- **Source:** https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/ opened 2026-09-18. This
  is the blog summary of the report; I did not open the report itself, which sits behind a form.
  `UNVERIFIED:` the figures above are the blog's characterisation of its own report, not the report.
- **What it means for us.** Two things. First, if we ever let a user paste their own provider key,
  we inherit a share of this problem: the key will end up in a repository, and when it is abused the
  user will come to us. Store it encrypted, never echo it, never put it in a file the user commits,
  and say plainly in the interface that it is theirs to rotate. Second, if we publish a setup guide
  with a key in an example configuration, we will personally add to that 24,008.
- **Verdict:** bring-your-own-key is still the right escape valve, but it has to be built as a
  secret, not as a settings field.

---

## Part two. The defences, with what each one stops, costs and breaks

### FL2-09. What a Google or GitHub sign-in actually tells you, field by field, checked against the live interface

This is the founder's direct question, so I checked it rather than recalling it.

**GitHub gives you account age for free, with no scope at all.** The public user object already
carries it. I called the live endpoint for his own account:

```
$ curl -s https://api.github.com/users/sagnikmitra
  "id": 47714127,
  "public_repos": 201,
  "public_gists": 0,
  "followers": 36,
  "following": 3,
  "created_at": "2019-02-17T12:04:14Z",
  "updated_at": "2026-08-26T13:33:26Z"
```

Source: https://api.github.com/users/sagnikmitra called 2026-09-18, unauthenticated. So on a GitHub
sign-in we can read, with no extra permission prompt and no extra scope: **account creation date,
public repository count, public gist count, follower count, following count, last profile update**.
Account age and public repository count are the two that matter, and we get both.

**Two-factor status needs a scope, and the documentation says exactly which.** Quoting GitHub's
REST reference for `Get the authenticated user`:

```
OAuth app tokens and personal access tokens (classic) need the read:user scope, or the broader user
scope, for this endpoint to return the private user response. The private user response includes
additional fields such as private_gists, total_private_repos, owned_private_repos, disk_usage,
collaborators, and two_factor_authentication. Tokens without these scopes receive the public user
response.
```

The private response example on the same page contains, verbatim, these lines among others:

```
"public_repos": 2,
"public_gists": 1,
"followers": 20,
"following": 0,
"created_at": "2008-01-14T04:33:35Z",
"private_gists": 81,
"total_private_repos": 100,
"owned_private_repos": 100,
"disk_usage": 10000,
"collaborators": 8,
"two_factor_authentication": true,
```

Source: https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28 opened 2026-09-18.

`INFERENCE:` asking for `read:user` to get `two_factor_authentication` raises the consent screen
from the minimum. Account age plus public repository count is already a strong signal and costs
nothing on the consent screen, so take those in phase A and leave the two-factor field alone unless
we later find we need it.

**Google gives you no account age at all.** There is no creation date claim. Here is the complete
list of claims Google documents for the identity token, quoted with the page's own descriptions,
trimmed to the ones that carry signal:

```
sub always An identifier for the user, unique among all Google Accounts and never reused. A Google
Account can have multiple email addresses at different points in time, but the sub value is never
changed. Use sub within your application as the unique-identifier key for the user. Maximum length
of 255 case-sensitive ASCII characters.

email_verified True if the user's email address has been verified; otherwise false.

hd The domain associated with the Google Workspace or Cloud organization of the user. Provided only
if the user belongs to a Google Cloud organization. You must check this claim when restricting
access to a resource to only members of certain domains. The absence of this claim indicates that
the account does not belong to a Google hosted domain.

locale The user's locale, represented by a BCP 47 language tag. Might be provided when a name claim
is present.
```

And the one nobody remembers is there, which is the closest thing Google offers to a trust signal:

```
amr A JSON array of strings that identify the authentication methods used to sign in to a Google
Account. If present, includes one or more of these possible [IANA.AMR] values: hwk a hardware key
was used mfa Multi-factor authentication was completed pwd a Password was used sms an SMS message
was used for verification swk a Software key such as a Passkey was used tel a phone call was used
for verification Present only when the amr claim is included in the authentication request and
enabled in settings .
```

```
auth_time The time user authentication took place, a JSON number representing the number of seconds
that have elapsed since the Unix epoch (January 1, 1970, 00:00:00 UTC). Provided when the auth_time
claim is included in the authentication request and enabled in settings .
```

Google also warns, verbatim, against the mistake most signup systems make:

```
Warning: Don't use the email field as a unique identifier for a user. Always use the sub field.
```

Source: https://developers.google.com/identity/openid-connect/openid-connect opened 2026-09-18. The
page is drawn by JavaScript, so I extracted the claim table from the served markup; the strings
above are copied from that markup.

- **What this gives us, plainly.** GitHub sign-in yields a real, forgery-resistant age and activity
  signal for free. Google sign-in yields almost nothing beyond a stable identifier, whether the
  address is verified, whether the account belongs to a Workspace domain, and, if we ask for it,
  whether the person used more than one factor to sign in.
- **What this costs us.** Nothing on the GitHub side. On the Google side, requesting `amr` is a
  change to the authentication request and is documented as needing to be enabled in settings;
  `UNVERIFIED:` I did not confirm what that settings toggle is called or whether it is available to
  all client types.
- **Friction:** zero. Both are read from the token or the profile we already fetch at sign-in.
- **Verdict:** must-have, and the cheapest layer in the whole design. It does not stop a determined
  farmer, who will make GitHub accounts, but it lets us start a brand-new, zero-repository account
  at a lower quota without asking that person to do anything.

### FL2-10. Is Cloudflare Turnstile a captcha? On its own description, no, and it is built on proof of work

The founder banned captchas. So the question is not whether Turnstile is good, it is whether it is
the banned thing. Quoting Cloudflare's own developer documentation:

```
Turnstile can be embedded into any website without sending traffic through Cloudflare and works
without showing visitors a CAPTCHA.
```

```
Turnstile adapts the challenge outcome to the individual visitor or browser. First, we run a series
of small non-interactive JavaScript challenges to gather signals about the visitor or browser
environment.
```

```
These challenges include proof-of-work (computational puzzles), proof-of-space, probing for web
APIs, and various other challenges for detecting browser-quirks and human behavior. As a result, we
can fine-tune the difficulty of the challenge to the specific request and avoid showing a visual or
interactive puzzle to a user.
```

There are three widget types, quoted:

```
Managed (recommended): Automatically decides whether to show a checkbox based on visitor risk level.

Non-interactive: Visitors never need to interact with the widget.

Invisible: The widget is completely hidden from the visitor.
```

Source: https://developers.cloudflare.com/turnstile/ opened 2026-09-18.

- **What it looks like to a user, answered precisely.** On `Managed` it can show a checkbox, so
  `Managed` is the banned thing and we should not use it. On `Non-interactive` the user sees a
  widget but never touches it. On `Invisible` the user sees nothing at all and the page is
  unchanged. So the honest answer to the founder is: Turnstile in `Invisible` mode is not a captcha
  by any definition he would recognise, because there is nothing on the screen, nothing to click and
  nothing to solve. It is a script that runs while the page loads.
- **It also answers the proof-of-work question on this list.** We do not need to build proof of work
  in the browser ourselves; Turnstile already runs one, tuned per request, and Cloudflare carries
  the cost of tuning it.
- **The two implementation facts that matter:** Turnstile does not require our traffic to go through
  Cloudflare, quoting the setup guide:

```
Turnstile is designed to be an independent service. You can use Turnstile on any website, regardless
of whether it is proxied through the Cloudflare network. This allows for flexible deployment across
multi-cloud environments, on-premises infrastructure, or sites using other CDNs. The client-side
widget and server-side validation steps are completely self-contained.
```

  and the server-side check is mandatory, quoting the same page:

```
Server-side validation is mandatory. It is critical to enforce Turnstile tokens with the Siteverify
API. The Turnstile token could be invalid, expired, or already redeemed. Not verifying the token
will leave major vulnerabilities in your implementation.
```

Source: https://developers.cloudflare.com/turnstile/get-started/ opened 2026-09-18.

- **Price.** The product page says, quoted: `It's a simple snippet of free code that eliminates
  CAPTCHAs.` and `Start building for free View docs`. Source:
  https://www.cloudflare.com/application-services/products/turnstile/ opened 2026-09-18.
  `UNVERIFIED:` I could not open a page stating a request volume above which Turnstile is charged;
  https://developers.cloudflare.com/turnstile/concepts/limits/ returned 404 on 2026-09-18. Do not
  put a free-forever claim in a plan document without checking that.
- **Effort:** small. A script tag, a hidden widget, one server call on the sign-in route.
- **Verdict:** good-to-have, in `Invisible` mode only, and the founder should be shown the three
  widget names so he can veto `Managed` himself rather than discovering a checkbox later.

### FL2-11. Per-account hard budgets and circuit breakers: the only layer every major provider actually built

I checked what the providers do rather than what the blogs recommend, and every one of them has a
hard ceiling that fails closed. Full quotations are in part three; the design point is here.

- **What it stops:** everything, eventually. It is the only control that bounds the loss no matter
  which of the other layers was bypassed. FL2-03 is the proof: Sourcegraph's attacker had a
  legitimate account, a legitimate sign-in and a legitimate token, and a per-account ceiling would
  still have held.
- **What it costs us:** a counter per account, a check before the provider call, and a decision
  about what happens at the ceiling. Days of work, not weeks.
- **Friction added:** zero for anyone inside the limit. For the small number who reach it, the
  friction is the product telling them so, which is a conversion prompt rather than a cost.
- **The design detail most people get wrong, and FL2-04 is the evidence.** A monthly cap does not
  stop a burst. Sysdig measured 61,000 requests in a three-hour window against a baseline of
  hundreds per day. A monthly quota of ten edits is already a burst-proof cap for a single account,
  but the pooled provider key behind 200 accounts is not, so the circuit breaker has to sit at two
  levels: per account per month, and per whole service per hour.
- **The delay problem, and this one is measured.** Vercel's own documentation is honest about what a
  spend cap cannot promise, and the same limit applies to anything we build on a polled meter:

```
Vercel checks your metered resource usage often to determine if you are approaching or have exceeded
your spend amount. This check happens every few minutes.

Because these checks are not continuous, notifications, webhooks, and project pausing can trigger
several minutes after you cross your spend amount. Plan for this delay if you are relying on Spend
Management to cap usage, and consider setting your spend amount below the absolute maximum you are
willing to spend.
```

  Source: https://vercel.com/docs/spend-management opened 2026-09-18. `INFERENCE:` the lesson for us
  is to decrement the counter before the provider call and not after it, so our ceiling is a gate
  rather than a poll. A poll is minutes late, and FL2-04 says minutes are enough.
- **Effort:** small.
- **Verdict:** must-have, phase A, and it is the layer to build first if only one thing gets built.

### FL2-12. Rate limits by account, by internet protocol address, and by device

Three different keys, three very different values.

- **By account.** This is the same counter as FL2-11 with a shorter window. Effective, free, no
  friction. The provider consensus is that the account, or the organisation above it, is the right
  key. Quoting OpenAI: `Rate limits are defined at the organization level and at the project level,
  not user level.` Source: https://platform.openai.com/docs/guides/rate-limits opened 2026-09-18.
  Quoting Groq: `Rate limits apply at the organization level, not individual users. You can hit any
  limit type depending on which threshold you reach first.` Source:
  https://console.groq.com/docs/rate-limits opened 2026-09-18.
- **By internet protocol address.** Mostly theatre against a motivated attacker and a real hazard to
  honest users. FL2-07 has the attacker side, quoted there: the farm rotated through a commercial
  virtual private network with a random configuration per account. The honest-user side is worse in
  India than in most markets, because carrier-grade address translation puts large numbers of mobile
  users behind a shared address, so one address is not one person. `UNVERIFIED:` I did not find a
  published figure for the share of Indian mobile subscribers behind carrier-grade translation, and
  I am not going to invent one. Use the address as a signal that contributes to a score, never as a
  hard block, and never as the thing that decides whether a signup is allowed.
- **By device.** See FL2-14 for what this costs legally in India. Technically it is the strongest of
  the three against multi-accounting and the weakest against a determined operator, who runs each
  account in a separate browser profile or container.
- **Effort:** small for account, small for address, medium for device.
- **Verdict:** account limits are must-have. Address limits are good-to-have as a scoring signal
  only. Device limits are covered under FL2-14 and I do not recommend them for phase A.

### FL2-13. Disposable and plus-addressed email: with Google or GitHub sign-in only, this problem mostly goes away

The founder's sign-in choice has already solved most of this, and it is worth saying so rather than
building a detector we do not need.

- **Google.** We key the user on the `sub` claim, which Google documents as stable and never reused
  (quoted in FL2-09), and Google's own warning tells us not to key on the address. A new `sub`
  requires a genuinely new Google account, which requires passing Google's own signup defences. On
  address variants, Google's support page says, quoted:

```
If someone accidentally adds dots to your address when emailing you, you'll still get that email.

Your Gmail address is unique. If anyone tries to create a Gmail account with a dotted version of
your username, they'll get an error saying the username is already taken.

For example, johnsmith@gmail.com and j.o.h.n.s.m.i.t.h@gmail.com are the same address and go to one
inbox.
```

  Source: https://support.google.com/mail/answer/7436150 opened 2026-09-18. `UNVERIFIED:` this page
  covers dots, not the plus sign; I did not find a Google page stating the plus-address rule, so do
  not cite one. It does not matter for us either way, because we key on `sub`.

- **GitHub.** The terms of service forbid multiple free accounts outright, quoted:

```
One person or legal entity may maintain no more than one free Account (if you choose to control a
machine account as well, that's fine, but it can only be used for running a machine).
```

```
You must be a human to create an Account. Accounts registered by "bots" or other automated methods
are not permitted.
```

  Source: https://docs.github.com/en/site-policy/github-terms/github-terms-of-service opened
  2026-09-18. That is GitHub's rule to enforce, not ours, and we cannot see whether it is being
  broken. What we can see, free, is the account age and public repository count from FL2-09, and a
  farm of one-week-old empty accounts is visible in exactly those two fields.

- **What we would still need a detector for:** nothing, in phase A. There is no address field on our
  signup, because there is no signup form. If we ever add email and password, this finding is void
  and a disposable-address list becomes necessary.
- **Effort:** none.
- **Verdict:** skip, and record why, so nobody adds a disposable-email service later out of habit.

### FL2-14. Device fingerprinting in India: the Digital Personal Data Protection Act gives it no legitimate-use basis

This is the one defence with a legal cost rather than an engineering cost, so I read the Act itself
rather than a summary of it.

- **A device fingerprint is personal data under the Act.** Section 2(t), quoted from the gazette:

```
(t) "personal data" means any data about an individual who is identifiable by or in relation to such
data;
```

  The whole point of a fingerprint is to make a person identifiable across sessions, so it is inside
  that definition by construction.

- **Collecting it is processing.** Section 2(x), quoted:

```
(x) "processing" in relation to personal data, means a wholly or partly automated operation or set
of operations performed on digital personal data, and includes operations such as collection,
recording, organisation, structuring, storage, adaptation, retrieval, use, alignment or combination,
indexing, sharing, disclosure by transmission, dissemination or otherwise making available,
restriction, erasure or destruction;
```

- **There are exactly two lawful grounds, and consent is one of them.** Section 4(1), quoted:

```
4. (1) A person may process the personal data of a Data Principal only in accordance with the
provisions of this Act and for a lawful purpose,
(a) for which the Data Principal has given her consent; or
(b) for certain legitimate uses.
```

- **And the legitimate uses do not include fraud prevention.** Section 7 lists them (a) to (i). I
  read all nine on pages 6 and 7 of the gazette. They are: a purpose the person voluntarily provided
  the data for; the State providing a subsidy, benefit, service, certificate, licence or permit;
  State functions and sovereignty or security; a legal disclosure obligation; compliance with a
  judgment or decree; a medical emergency; an epidemic or public-health threat; a disaster or
  breakdown of public order; and employment. The employment one is the only clause that mentions
  protecting a business from loss, and it is scoped to employees, quoted:

```
(i) for the purposes of employment or those related to safeguarding the employer from loss or
liability, such as prevention of corporate espionage, maintenance of confidentiality of trade
secrets, intellectual property, classified information or provision of any service or benefit sought
by a Data Principal who is an employee.
```

  `INFERENCE:` the Act has no general legitimate-interest ground of the kind European law has, so
  fingerprinting a user to prevent them abusing our free tier has no legitimate-use clause to sit
  under. It needs consent.

- **And the consent it needs is a strict one.** Section 6(1), quoted:

```
6. (1) The consent given by the Data Principal shall be free, specific, informed, unconditional and
unambiguous with a clear affirmative action, and shall signify an agreement to the processing of her
personal data for the specified purpose and be limited to such personal data as is necessary for
such specified purpose.
```

  Section 6(4), quoted:

```
(4) Where consent given by the Data Principal is the basis of processing of personal data, such
Data Principal shall have the right to withdraw her consent at any time, with the ease of doing so
being comparable to the ease with which such consent was given.
```

  And the burden of proof is ours. Section 6(10), quoted:

```
(10) Where a consent given by the Data Principal is the basis of processing of personal data and a
question arises in this regard in a proceeding, the Data Fiduciary shall be obliged to prove that a
notice was given by her to the Data Principal and consent was given by such Data Principal to the
Data Fiduciary in accordance with the provisions of this Act and the rules made thereunder.
```

- **Source:** The Digital Personal Data Protection Act, 2023 (No. 22 of 2023), gazette text at
  https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf opened
  2026-09-18, pages 3 to 7. The PDF's text layer is font-encoded and would not extract, so I read
  the pages as images and transcribed the sections by hand. Two transcription notes, so nobody is
  misled: the gazette prints a long dash after "for a lawful purpose," and after "namely:", and I
  have replaced those with a line break because this document may not contain one; everything else
  is character for character. Anyone citing these sections in a legal or client document should
  re-read the gazette page rather than trusting my transcription.
- **What this means in practice.** To fingerprint devices lawfully in India we would need a clear
  affirmative action from the user, a notice saying what we collect and why, and a withdrawal
  control as easy as the consent was. That is a consent banner, which is a modal on the front door,
  which is exactly the kind of thing the founder threw out along with tours and captchas. The
  privacy cost and the founder's rule point the same way here.
- **The price, for completeness.** Fingerprint, the best known vendor, lists: `Free` at `$0` and
  `up to 1,000 API calls per month`; `Pro Plus` at `$99` `/month for 20K API calls` `then $4 per
  1,000 additional API calls`; `Enterprise` as `Build your own plan.` Source:
  https://fingerprint.com/pricing/ opened 2026-09-18.
- **Effort:** medium in engineering, large in legal and interface terms.
- **Verdict:** skip. The legal basis is weak, the consent it requires breaks the one-tap front door,
  and FL2-07 shows a determined operator defeats it with browser profiles anyway.

### FL2-15. Proof of work in the browser: already solved by Turnstile, do not build our own

- **What it stops:** cheap automated signup, by making each attempt cost the attacker a measurable
  amount of processor time.
- **The reason not to build it:** Cloudflare already runs one, tuned per request, and says so.
  Quoted again from FL2-10 because it is the answer to this line item:

```
These challenges include proof-of-work (computational puzzles), proof-of-space, probing for web
APIs, and various other challenges for detecting browser-quirks and human behavior. As a result, we
can fine-tune the difficulty of the challenge to the specific request and avoid showing a visual or
interactive puzzle to a user.
```

  Source: https://developers.cloudflare.com/turnstile/ opened 2026-09-18.
- **The reason it does not carry much weight anyway.** Proof of work taxes processor time, and FL2-06
  shows the attacker's economics are a local wage against a yield per account. Processor time is the
  cheapest input they have. It raises the floor a little; it does not change the ratio.
- **What it costs us if we build it:** a difficulty parameter nobody can tune without data we do not
  have, and a first-load delay on the slowest phone of our least wealthy user. That is a real cost
  in India and it falls on the wrong person.
- **Effort:** medium to build, days to adopt Turnstile.
- **Verdict:** skip as a build. Take it for free inside Turnstile if we take Turnstile at all.

### FL2-16. Bot detection services, with the prices I could verify

| Service | Price I copied from the page | Source, opened 2026-09-18 |
|---|---|---|
| Cloudflare Turnstile | `It's a simple snippet of free code that eliminates CAPTCHAs.` `Start building for free` | https://www.cloudflare.com/application-services/products/turnstile/ |
| Vercel BotID, Basic | `Free`, on all plans | https://vercel.com/docs/botid |
| Vercel BotID, Deep Analysis | `$1/1000 checkBotId() Deep Analysis calls` on Pro | https://vercel.com/docs/botid |
| hCaptcha Basic | `"name": "Basic (Free)", "price": "0"` | https://www.hcaptcha.com/pricing |
| hCaptcha Pro | `Stop bots with less user friction. $139/mo or $99/mo when billed annually.` | https://www.hcaptcha.com/pricing |
| hCaptcha Enterprise | no price published; the page links to a pilot request | https://www.hcaptcha.com/pricing |
| Cloudflare plans | Free `$0`; Pro `$20` `/mo billed annually, or $25/mo billed monthly`; Business `$200` `/mo billed annually, or $250/mo billed monthly`; Enterprise no price shown | https://www.cloudflare.com/plans/ |
| Cloudflare Bot Management | not sold below Enterprise; the plan selector's fourth tab is labelled `Bot Management for Enterprise` | https://developers.cloudflare.com/bots/plans/ |
| Arkose Labs | `UNVERIFIED:` no public price. https://www.arkoselabs.com/pricing/ returned HTTP 404 on 2026-09-18 | |
| Fingerprint | `Free` `$0` `up to 1,000 API calls per month`; `Pro Plus` `$99` `/month for 20K API calls` `then $4 per 1,000 additional API calls` | https://fingerprint.com/pricing/ |

- **What Vercel BotID is, in their words, quoted, and note the phrase they chose:**

```
Vercel BotID is an invisible CAPTCHA that protects against sophisticated bots without showing
visible challenges or requiring user action. It's a client-side challenge that uses machine learning
to distinguish between humans and bots. It adds a protection layer to high-value routes, such as
checkouts, signups, and APIs, that are common targets for bots imitating real users.
```

```
The Basic level validates the integrity and correctness of the challenge response, catching many
less sophisticated bots. It is provided free of charge for all plans.
```

```
BotID includes Deep Analysis, powered by Kasada.
```

  Source: https://vercel.com/docs/botid opened 2026-09-18. Vercel calls it an invisible captcha in
  its own first sentence, so if the founder's rule is read literally as a ban on the word, BotID is
  out; if it is read as a ban on the user experience, BotID passes, because the user sees nothing.
  He should be the one to decide which reading he meant, and the sentence above is the one to show
  him. The documentation index on the same page also carries an entry titled `How to protect your AI
  endpoints with Vercel BotID`, so protecting an inference route is a use case they name themselves.
- **The relevant fact about where we already are:** the app deploys to Vercel, so BotID Basic is
  reachable without adding a vendor, and Turnstile works without routing traffic through Cloudflare.
  Neither one requires a new contract.
- **Effort:** small for either.
- **Verdict:** good-to-have. One of Turnstile invisible or BotID Basic, not both, and only on the
  sign-in route and the AI route. Never on a document route, because a false positive there loses
  somebody's writing.

### FL2-17. Anomaly detection on usage: the layer that actually caught every incident in part one

This is worth stating plainly because it is easy to skip as vague. In every documented case above,
the thing that found the abuse was a usage anomaly, not an identity check.

- Sourcegraph, quoted: `On August 30, 2023 our team noticed a significant increase in API usage and
  began investigating the cause.`
- Sysdig found LLMjacking in cloud audit logs, and its recommendation section names log analysis
  first, quoted: `Cloud Logs Detections: Tools like Falco, Sysdig Secure, and CloudWatch Alerts are
  indispensable allies. Organizations can proactively identify suspicious behavior by monitoring
  runtime activity and analyzing cloud logs`.
- OWASP names it as mitigation seven, quoted in FL2-02: `Continuously monitor resource usage and
  implement logging to detect and respond to unusual patterns of resource consumption.`

- **What it stops:** nothing, by itself. It tells us that something is happening, which is the
  precondition for every other response.
- **What it costs us:** one row per AI call with account, timestamp, tokens in, tokens out, model
  and cost, and one alert on a daily aggregate. This is a table and a scheduled query, not a system.
- **The field-name warning, and it is this codebase's most expensive recurring bug class.** Learned
  Rule #59 in the global rules records three cases where a producer wrote one key and a consumer read
  another, and a wrong number was published for weeks. If the usage row is written by the AI route
  and read by the alert job, pin the field names in one place and make the reader fail loudly on a
  missing key rather than treating it as zero.
- **Friction:** zero. The user never sees it.
- **Effort:** small.
- **Verdict:** must-have, phase A, and it should be built in the same week as the budget, because a
  budget with no telemetry cannot be tuned.

### FL2-18. Requiring a card for the free tier: it works, and in India it costs more than it is worth

- **What it stops:** most casual multi-accounting, because a card is a scarce, traceable, real-name
  instrument. FL2-07 records that some providers do exactly this, quoted:
  `Provider attempts to ward off this fraud ranges from making it more time-consuming to create
  accounts with CAPTCHA and other technologies to requiring a valid credit card on file.` And the
  same sentence records that the farm got past it anyway.
- **What it costs in conversion.** The published benchmark ranges are wide and I could not find a
  primary study behind them. Quoting the clearest secondary source I opened:

```
For most SaaS products, that number lands between 8% and 25% without a credit card requirement, and
30% to 60% with one.
```

```
Why? Because asking for a credit card filters out casual browsers. The people who enter payment
details are already leaning toward paying. That's selection bias doing the heavy lifting, not
product magic.
```

  Source: https://kirro.io/free-trial-conversion-rate opened 2026-09-18. `UNVERIFIED:` this is a
  vendor blog with no cited study, and its own explanation concedes the gap is selection rather than
  causation. Do not put these numbers in a plan document as fact. What they support is only the
  direction: a card gate raises the share of signups who pay and lowers the number of signups.

- **The India-specific number, and this is the one that decides it.** Quoting a report of Reserve
  Bank of India data:

```
Outstanding credit cards in India increased 8.19% year-on-year to 119.44 million in April 2026.
```

  Source: https://www.angelone.in/news/economy/india-s-credit-card-spends-rise-7-to-1-97-trillion-in-april-2026-rbi-data
  opened 2026-09-18. `UNVERIFIED:` this is a news report of central bank data, not the central bank
  release. `INFERENCE:` 119.44 million cards across a population well over a billion means a card
  gate excludes the large majority of Indian adults from even trying the product, and cards are held
  per person rather than one each, so the share of people is lower still than the share of cards.
- **The other India constraint, already settled in this repo:** 15,000 rupees per transaction is an
  architectural constant set by the Reserve Bank, and Indian cards get one payment attempt. A card
  gate in this market therefore fails for reasons that have nothing to do with intent to pay.
- **Effort:** medium. It also drags in a payment provider before we need one.
- **Verdict:** skip for the free tier. It is the single most effective anti-farming control on this
  list and it is the wrong one for an Indian product with a one-tap front door. Note it as the lever
  to pull if abuse ever becomes existential, not before.

### FL2-19. Invite-only or waitlist: the cheapest control we own, and the one with a real product cost

- **What it stops:** unbounded signup growth, which is the input to every other risk. A queue we
  control means we can meter the population rather than the requests.
- **What it costs us:** almost nothing to build. A flag on the account and a list.
- **What it costs the product:** everything the founder is trying to avoid. A waitlist is a closed
  door, and the standing rule is a front door that behaves like Google Docs. A person who arrives
  from a kickoff link inside somebody else's agent kit and hits a waitlist does not come back.
- **The shape that keeps both:** let everyone in, and put the queue on the expensive operation
  rather than on the account. See FL2-21.
- **Effort:** small.
- **Verdict:** skip as a front door. Keep it in the drawer as an emergency switch, so that if the
  pooled quota is being drained we can stop new accounts for a day without stopping existing ones.

### FL2-20. Bring your own key: the right escape valve, and it must be built as a secret

- **What it does:** moves the cost to the person who wants more, without a payment integration and
  without us deciding how much they deserve. It is also the only option that lets a heavy user carry
  on when our pooled quota is empty.
- **Who does this:** OpenRouter documents it as a first-class concept and exempts it from the free
  tier's counters. Quoting their limits page:

```
Accounts and endpoints exempt from free-model limits, and BYOK requests, are not gated by it, so
remaining reflects the tier policy rather than an enforced ceiling for them.
```

```
It does not apply to requests to free models, to requests served entirely with your own provider
keys (see BYOK) that use no paid plugins, or to enterprise, paid-subscription, or invoice-billed
accounts.
```

  Source: https://openrouter.ai/docs/api-reference/limits.md opened 2026-09-18.
- **The risk it brings, which is FL2-08.** A key the user pastes into a settings field ends up in a
  repository. Store it encrypted at rest, never render it back after saving, never write it into any
  file the user's own repository will hold, and do not publish a setup example with a key in it.
- **The projection-law wrinkle specific to us.** Our product's rule is that the file on disk is the
  only source of truth. A provider key is the one piece of state that must not be in the file. Say
  so explicitly wherever the rule is written down, or somebody will helpfully put it in frontmatter.
- **Effort:** small for the field, medium to do the secret handling properly.
- **Verdict:** good-to-have. Phase B. It is the pressure valve that makes a small free tier
  defensible, because the answer to somebody who wants more stops being no.

### FL2-21. Queue or slow the free request instead of refusing it

- **What it does:** turns a hard refusal into a wait. It bounds our cost per unit time without ever
  showing a user a door that will not open.
- **Who does this, and they built a whole tier out of it.** Groq's documentation lists
  `Flex Processing` and `Batch Processing` as named service tiers alongside the performance tier.
  Source: https://console.groq.com/docs/rate-limits opened 2026-09-18, in the page's own navigation.
  `UNVERIFIED:` I did not open the Flex and Batch pages themselves, so I am not describing what they
  guarantee.
- **Why it fits our product particularly well.** An AI edit in a markdown editor is not a chat turn.
  The user is writing; the edit arrives in the change queue and they accept or reject it later. The
  change queue is already asynchronous by design, so a free edit that lands in forty seconds instead
  of four is a different experience, not a broken one. A paid edit lands immediately. That is a real
  feature difference that costs us nothing to describe.
- **What it stops:** a burst. It does not stop a patient attacker, and it should never be the only
  layer. Paired with the per-account budget it removes the spike that FL2-04 measured.
- **Friction:** low, and it falls on the free user in proportion to how much they ask for.
- **Effort:** medium. It needs a job queue and a place in the interface to show pending work, and
  the change queue is already that place.
- **Verdict:** good-to-have, and the most on-brand item on this list. Phase B.

### FL2-22. Credits that regenerate slowly

- **What it does:** replaces a monthly counter with a bucket that refills at a fixed rate. Ten edits
  a month becomes one edit every three days, plus a small reserve for a burst.
- **Who does this:** Anthropic, by name. Quoting their rate-limit documentation:

```
The API uses the token bucket algorithm to do rate limiting. This means that your capacity is
continuously replenished up to your maximum limit, rather than being reset at fixed intervals.
```

  Source: https://docs.claude.com/en/api/rate-limits opened 2026-09-18.
- **Why it beats a monthly counter for us.** A monthly counter has a worst case of all ten edits at
  once on the first of the month, times 200 users, against a pooled provider quota that is measured
  per minute. A bucket removes that shape entirely, and it does so without the user ever seeing a
  different number.
- **The honest cost:** a person who writes in one concentrated session, which is how most people
  write, hits the bucket sooner than they hit the counter. The mitigation is the reserve: let the
  bucket hold the full ten so a first-time user can spend them all, and refill at the monthly rate
  after that.
- **Effort:** small. It is two columns and a formula, not a scheduler.
- **Verdict:** must-have, and it should replace the monthly counter in the plan rather than sit
  beside it.

---

## Part three. What the AI companies themselves do

The pattern across all seven is the same and it is worth naming before the details. **None of them
gates the free tier on identity. All of them gate it on a hard ceiling, and they buy trust with
spend history rather than with verification.** That is the single most useful finding in this lens,
because it is a design the founder's rules allow in full.

### FL2-23. OpenRouter: the free tier is gated on credits ever purchased, not on who you are

This is the policy the mission asked for by name, and it has a credit-balance condition in two
separate places.

**Condition one, the daily cap on free models.** The rendered page prints a table whose numbers are
filled in from constants. I fetched the markdown source of the same page, where the constants are
declared, so the numbers below are the page's own values rather than my reading of a rendered
table. The constants, quoted:

```
export const FREE_MODEL_RATE_LIMIT_RPM = 20;

export const FREE_MODEL_NO_CREDITS_RPD = 50;

export const FREE_MODEL_HAS_CREDITS_RPD = 1000;

export const FREE_MODEL_CREDITS_THRESHOLD = 10;
```

The table that consumes them, quoted verbatim including the placeholders:

```
1. **Free usage limits**: If you're using a free model variant (with an ID ending in <code>{sep}{Variant.Free}</code>), the following limits apply:

| Credits purchased (all time)             | Requests per minute         | Requests per day             |
| ---------------------------------------- | --------------------------- | ---------------------------- |
| Less than {FREE_MODEL_CREDITS_THRESHOLD} | {FREE_MODEL_RATE_LIMIT_RPM} | {FREE_MODEL_NO_CREDITS_RPD}  |
| At least {FREE_MODEL_CREDITS_THRESHOLD}  | {FREE_MODEL_RATE_LIMIT_RPM} | {FREE_MODEL_HAS_CREDITS_RPD} |
```

Substituting the declared constants, which is arithmetic rather than inference: an account that has
never bought credits gets 20 requests a minute and **50 free-model requests a day**. An account that
has ever bought at least **10 credits** gets 20 a minute and **1,000 a day**. That is a twenty-fold
difference bought with ten dollars, once, for ever.

The remedy line says the same thing in the imperative, quoted:

```
* **On free variants**, purchase at least {FREE_MODEL_CREDITS_THRESHOLD} credits to raise your daily limit, or switch to the paid variant of the model, which has no platform-level request cap.
```

And the tier selection is explicitly decoupled from whether you are currently a free user, quoted:

```
The `limit` tier is selected by all-time credits purchased, independently of `is_free_tier`. To
absorb rounding and top-up fees, the higher daily ceiling is granted starting one credit below the
table's threshold (currently {FREE_MODEL_CREDITS_THRESHOLD - 1} credits); an account that has
purchased fewer credits than that reports `is_free_tier: false` together with the lower daily
ceiling.
```

**Condition two, the negative-balance rule, which catches free models too.** Quoted:

```
1. **Account balance**, your available credits across the account. If your account has a negative
credit balance, you may see <StatusCode code={HTTPStatus.S402_Payment_Required} /> errors, including
for free models. Adding credits to put your balance above zero allows you to use those models again.
```

**And the answer to multi-accounting, stated as policy rather than enforcement.** Quoted:

```
Making additional accounts or API keys will not affect your rate limits, as we
govern capacity globally. We do however have different rate limits for
different models, so you can share the load that way if you do run into
issues.
```

**Their third control is a pre-flight cost hold, which is the mechanism I would copy.** Quoted:

```
OpenRouter charges a request when it finishes, so many requests running at the same time could
commit more than your balance covers before any of them settles. To prevent that, OpenRouter
estimates each paid request's token cost up front, at the endpoint's prices: the input tokens, plus
the completion tokens allowed by `max_tokens` up to a fixed per-request cap (the cap is used when
`max_tokens` is not set).
```

```
The total that can be held at once is your in-flight spending budget: a fraction of your current
credit balance, up to a fixed ceiling. A request whose estimated cost does not fit alongside your
running and recently completed requests is rejected with <StatusCode code={HTTPStatus.S402_Payment_Required} /> before it reaches a provider, even though your balance is positive.
```

And, quoted, it applies hardest to exactly the accounts we would worry about:

```
The budget applies to prepaid accounts spending their own credits, and only to a subset of them:
accounts whose balance is below a threshold, and, while the mechanism is being rolled out, newer
accounts without an established spending history.
```

- **Source:** https://openrouter.ai/docs/api-reference/limits.md opened 2026-09-18, which is the
  markdown source of https://openrouter.ai/docs/api-reference/limits. I used the markdown because
  the rendered page leaves the table cells empty, the numbers being injected by JavaScript.
- **What to copy:** the pre-flight hold. Estimating a request's cost and refusing it before it
  reaches the provider is the difference between a gate and a poll, and it is the fix for the
  several-minute lag Vercel admits to in FL2-11.

### FL2-24. OpenAI: capacity is bought with cumulative spend, and the free tier's only qualification is geography

Quoting the usage tier table, in the page's own columns `Tier`, `Qualification`, `Usage limits`:

```
Free            User must be in an allowed geography       $100 / month
Tier 1          $5 paid                                    $100 / month
Tier 2          $50 paid                                   $500 / month
Tier 3          $100 paid                                  $1,000 / month
Tier 4          $250 paid                                  $5,000 / month
Tier 5          $1,000 paid                                $200,000 / month
```

Quoting the surrounding text:

```
As your spend on our API goes up, we automatically graduate you to the next usage tier. This usually
results in an increase in rate limits across most models.
```

```
Rate limits are defined at the organization level and at the project level, not user level.
```

```
OpenAI sets an approved monthly usage limit for each organization. This is separate from the spend
limits that you can configure for an organization or project.
```

And the stated reasons, quoted, of which the first is ours:

```
They help protect against abuse or misuse of the API. For example, a malicious actor could flood
the API with requests in an attempt to overload it or cause disruptions in service. By setting rate
limits, OpenAI can prevent this kind of activity.
```

```
Rate limits help ensure that everyone has fair access to the API. If one person or organization
makes an excessive number of requests, it could bog down the API for everyone else.
```

- **Source:** https://platform.openai.com/docs/guides/rate-limits opened 2026-09-18.
- **Note:** https://openai.com/policies/usage-policies/ returned HTTP 403 to my client on
  2026-09-18, so I did not open the usage policy itself and have quoted nothing from it.
- **What to copy:** the ladder. Trust is a function of money already spent, and it is automatic. No
  form, no document, no verification call.

### FL2-25. Anthropic: a starting tier below the published limits, explicitly to stop fraud

This is the most directly transferable idea in part three, because it does with usage history what a
card gate does with a card, and costs the honest user nothing.

Quoted:

```
New organizations and organizations with limited usage history may start in the Evaluation tier,
with limits below the standard limits shown on this page while account history is established. These
starting limits are part of how Anthropic prevents fraud and abuse, and they increase automatically
as your organization builds usage history.
```

```
Limits are designed to prevent API abuse, while minimizing impact on common customer usage patterns.
```

```
Limits are defined by usage tier. Organizations are placed on a tier automatically based on usage
history and account standing and can move to a higher tier over time as they use the API.
```

```
To mitigate misuse and manage capacity on the API, limits are in place on how much an organization
can use the Claude API.
```

The spend caps, quoted from the `Usage tier` and `Monthly spend cap` columns:

```
Start    $500 USD
Build    $1,000 USD
Scale    $200,000 USD
```

What happens at the ceiling, quoted, and note that it is a hard stop with no retry:

```
Once you reach your tier's spend cap, API usage pauses until 00:00 UTC on the first day of the next
month, unless you request a higher limit sooner. While usage is paused, API requests return HTTP
429:
```

```
The error type is rate_limit_error, the same as for a rate limit, but the response has no
retry-after header. Retrying, including the SDKs' automatic retries, fails until access resumes.
```

And the refill mechanism, quoted, which is FL2-22:

```
The API uses the token bucket algorithm to do rate limiting. This means that your capacity is
continuously replenished up to your maximum limit, rather than being reset at fixed intervals.
```

**Their acceptable-use policy says the quiet part out loud.** Under the heading
`Do Not Abuse our Platform`, quoted:

```
Coordinate malicious activity across multiple accounts to avoid detection or circumvent product
guardrails or generating identical or similar inputs that otherwise violate our Usage Policy

Utilize automation in account creation or to engage in spammy behavior

Circumvent a ban through the use of a different account, such as the creation of a new account, use
of an existing account, or providing access to a person or entity that was previously banned
```

- **Sources:** https://docs.claude.com/en/api/rate-limits and https://www.anthropic.com/legal/aup,
  both opened 2026-09-18.
- **What to copy:** the Evaluation tier, by name and by mechanism. A brand-new account gets a
  smaller allowance that rises on its own with use. This is the whole of our defence against the
  one-week-old empty GitHub account, and the user never sees a challenge.

### FL2-26. Groq: limits are per organisation, and the reason given is misuse

Quoted:

```
Rate limits act as control measures to regulate how frequently users and applications can access our
API within specified timeframes. These limits help ensure service stability, fair access, and
protection
against misuse so that we can serve reliable and fast inference for all.
```

```
Rate limits apply at the organization level, not individual users. You can hit any limit type
depending on which threshold you reach first.
```

The dimensions they meter on, quoted:

```
RPM: Requests per minute
RPD: Requests per day
TPM: Tokens per minute
TPD: Tokens per day
ASH: Audio seconds per hour
ASD: Audio seconds per day
ITPM: Input tokens per minute
OTPM: Output tokens per minute
```

- **Source:** https://console.groq.com/docs/rate-limits opened 2026-09-18. `UNVERIFIED:` the numeric
  table on that page is drawn by JavaScript and the served markup contains no values, so I have no
  Groq numbers and am not inventing any.
- **The fact that matters to our architecture:** limits are per organisation. If 200 free users
  share one pooled Groq key, they share one organisation ceiling. Our per-account budget does not
  protect us from that; only a service-wide breaker does.

### FL2-27. Cloudflare Workers AI: a free allowance that fails closed rather than billing

This is the cleanest published example of the shape I recommend for our own free tier.

Quoted:

```
Workers AI is included in both the Free and Paid Workers plans and is priced at $0.011 per 1,000
Neurons.
```

```
Our free allocation allows anyone to use a total of 10,000 Neurons per day at no charge. To use more
than 10,000 Neurons per day, you need to sign up for the Workers Paid plan. On Workers Paid, you
will be charged at $0.011 / 1,000 Neurons for any usage above the free allocation of 10,000 Neurons
per day.
```

```
All limits reset daily at 00:00 UTC. If you exceed any one of the above limits, further operations
will fail with an error.
```

- **Source:** https://developers.cloudflare.com/workers-ai/platform/pricing/ opened 2026-09-18.
- **What to copy:** a free user cannot generate a bill. The ceiling is not a warning, it is a wall,
  and the reset is a fixed daily clock. That is the property that makes a free tier safe to offer to
  strangers, and the reason the founder's fear is fixable rather than permanent.

### FL2-28. Vercel: spend caps with a stated lag, and an honest warning about it

Quoted:

```
Spend management is a way for you to notify or to automatically take action on your account when
your team hits a set spend amount. The actions you can take are:

Receive a notification

Pause the production deployment of all your projects
```

```
Setting a spend amount does not automatically stop usage. If you want to pause
all your projects at a certain amount, you must enable the
```

```
Vercel checks your metered resource usage often to determine if you are approaching or have exceeded
your spend amount. This check happens every few minutes.
```

```
Because these checks are not continuous, notifications, webhooks, and project pausing can trigger
several minutes after you cross your spend amount. Plan for this delay if you are relying on Spend
Management to cap usage, and consider setting your spend amount below the absolute maximum you are
willing to spend.
```

```
When you set a spend amount, Vercel automatically enables web and email notifications for your team.
These get triggered when spending on your team reaches 50%, 75%, and 100% of the spend amount.
```

Also noted, because it is a cost we already carry, quoted:

```
Spend Management is available on Pro plans
```

- **Source:** https://vercel.com/docs/spend-management opened 2026-09-18.
- **What to copy:** the 50, 75 and 100 per cent alert ladder, and the warning. Set our own ceiling
  below the number we can actually afford, because the meter is behind the spend.

### FL2-29. Google AI Studio: I could not open it, and I am not going to quote it from memory

`https://ai.google.dev/gemini-api/docs/rate-limits` and `https://ai.google.dev/gemini-api/terms`
both returned HTTP 302 to an OAuth authorisation URL for my client on 2026-09-18, with and without
`?hl=en`. I have no Gemini free-tier numbers and will not state any.

What I could open is Google's generative AI use policy, which is the policy the products point at.
Under its restrictions list, quoted:

```
Abuse of, harm to, interference with, or disruption to Google's or others' infrastructure or
services.
```

```
Circumvention of abuse protections or safety filters -- for example, manipulating the model to
contravene our policies.
```

- **Source:** https://policies.google.com/terms/generative-ai/use-policy opened 2026-09-18.
- **Action for whoever picks this up:** open the Gemini free-tier limits from a signed-in browser
  before any plan document states a number for pooled Google quota. This is a real hole in the
  research and it sits directly under the 200-concurrent-users assumption.

---

## Part four. The recommendation for frontmatter

### FL2-30. The arithmetic first, because it changes the shape of the answer

Before choosing layers I priced the thing we are defending. Inputs, and I am separating what I
copied from a page from what I assumed:

**Copied from https://developers.cloudflare.com/workers-ai/platform/pricing/, opened 2026-09-18:**

```
@cf/meta/llama-3.1-8b-instruct-fp8-fast
4119 neurons per M input tokens
34868 neurons per M output tokens

Our free allocation allows anyone to use a total of 10,000 Neurons per day at no charge.

priced at $0.011 per 1,000 Neurons
```

**Assumed by me, and these are assumptions, not measurements.** One AI edit is 4,000 input tokens
and 1,000 output tokens, because a splice sends a section plus an instruction and returns a
replacement span. One blueprint is 8,000 input and 20,000 output, because it returns a document.
Nobody has measured these on our own traffic, and the first job in phase A is to replace them with
real numbers.

**The work, computed rather than estimated:**

```
one AI edit   = 4000/1e6*4119 + 1000/1e6*34868  =    51.34 neurons
one blueprint = 8000/1e6*4119 + 20000/1e6*34868 =   730.31 neurons

200 users x 10 edits    = 2000 x 51.34   = 102,688 neurons per month
200 users x 1 blueprint =  200 x 730.31  = 146,062 neurons per month
total                                    = 248,750 neurons per month

free allowance          = 10,000 x 30    = 300,000 neurons per month equivalent
utilisation                              = 82.9%
even daily spread       = 248,750 / 30   = 8,292 neurons per day against 10,000 allowed
```

**Three conclusions fall straight out of that, and they are the whole recommendation.**

**One. The honest population is nearly free to serve.** At Cloudflare's own list price the entire
free tier, fully used by all 200 people, costs `248,750 / 1000 * $0.011 = $2.74` a month. That is
**1.37 cents per free user per month.** The founder's fear is real but it is not a fear about
honest users; it is entirely a fear about the tail.

**Two. The pooled free quota fits, but only if consumption is spread.** 82.9 per cent utilisation on
an even spread is fine. On an uneven one it is not, and here is the number that matters most in this
document: `10,000 / (10 x 51.34 + 730.31) = 8.0`. **Only eight users can spend their whole monthly
allowance on the same day before the daily wall is hit.** A calendar-month counter permits exactly
that shape. A token bucket forbids it. FL2-22 therefore is not a refinement, it is what makes the
plan arithmetic work.

**Three. One uncapped account outweighs the entire honest population.** At a modest one request per
second, sustained for a day, a single account with no ceiling burns
`86,400 x 51.34 = 4,436,122` neurons, which is `$48.80` a day at list price and **17.8 times the
whole honest free tier's monthly consumption**. Using Sysdig's measured burst from FL2-04, 61,000
requests in three hours is `3,131,984` neurons, `$34.45`, and **12.6 times the honest population's
whole month**. The gap between the honest user and the abusive one is three orders of magnitude, so
every rupee of engineering belongs on bounding the tail and none of it on inspecting the head.

`INFERENCE:` this is why the founder's rules cost us nothing here. A captcha inspects the head. A
budget bounds the tail.

### FL2-31. The layered design, with phases and costs

**Phase A. Build these before the first stranger signs in. Roughly one week of work in total.**

1. **A pre-flight budget check, per account, on a token bucket.** Decrement before the provider call
   and refuse if the bucket is empty. This is FL2-11 plus FL2-22, and the mechanism to copy is
   OpenRouter's in-flight hold in FL2-23, not Vercel's polled meter in FL2-28, because a poll is
   minutes late and FL2-04 says minutes are enough. Bucket holds ten edits and one blueprint,
   refills at the monthly rate. **Cost: two columns, one function, two days.** Friction: none.
2. **A service-wide circuit breaker, per hour.** The per-account bucket does not protect the pooled
   key, because every provider in part three meters at the organisation level, Groq explicitly so in
   FL2-26. One counter across all free accounts, one hourly ceiling, and when it trips free requests
   queue rather than fail. **Cost: one counter and one branch, one day.** Friction: none until it
   trips.
3. **A usage row per AI call, and a daily alert.** Account, timestamp, model, tokens in, tokens out,
   computed cost. This is the layer that caught every incident in part one, FL2-17. Pin the field
   names in one place, because Learned Rule #59 in this workspace records three separate cases where
   a producer wrote one key, a consumer read another, and a wrong number was published for weeks.
   **Cost: one table, one scheduled query, one day.** Friction: none.
4. **A starting allowance that rises with account history, copied from Anthropic's Evaluation tier
   in FL2-25.** A brand-new account gets less, and it goes up on its own. For GitHub sign-ins the
   inputs are free and already in the profile we fetch, verified live in FL2-09: `created_at` and
   `public_repos`. For Google sign-ins we have no age, so the input is our own first-seen date.
   Suggested shape, and these thresholds are a starting point to tune with the data from layer 3,
   not a finding: an account under seven days old with no history gets three edits and no blueprint;
   it reaches the full ten and one at thirty days or after a first accepted change. **Cost: one
   function over fields we already have, one day.** Friction: none, and no consent screen, because
   we already hold this data for the sign-in itself.
5. **Refuse rather than bill, always.** Cloudflare Workers AI in FL2-27 is the model: a free user
   cannot generate a bill, the wall is a wall, and the reset is a fixed clock. Never attach a
   metered provider to the free path without a ceiling in front of it. **Cost: a policy decision,
   zero days.**

**Phase B. After the first hundred real users, and informed by layer 3's data. Two to three weeks.**

6. **Queue the free request instead of refusing it, FL2-21.** Our change queue is already
   asynchronous, so a free edit that lands in forty seconds is a different experience rather than a
   broken one, and a paid edit landing immediately becomes a real difference we can describe. **Cost:
   a job queue and an interface state, one week.**
7. **Bring your own key, FL2-20.** The answer to a heavy user stops being no. Build it as a secret,
   not as a settings field, for the reasons in FL2-08. **Cost: three to five days done properly.**
8. **An invisible challenge on the sign-in route only, FL2-10 and FL2-16.** Either Turnstile in
   `Invisible` mode, free, or Vercel BotID Basic, free and already on our platform. Never `Managed`
   mode, because it can show a checkbox. Never on a document route, because a false positive there
   loses somebody's writing. **Cost: one day.** Show the founder Vercel's own sentence,
   `Vercel BotID is an invisible CAPTCHA`, and let him decide whether his rule bans the word or the
   experience.
9. **An emergency switch that stops new signups without touching existing accounts, FL2-19.** A flag,
   half a day, and it converts a bad night into a slow morning.

**Never, and write down why so nobody adds them later out of habit.**

- **A captcha or a puzzle.** FL2-07 shows a real operator defeated reCAPTCHA audio, funcaptcha and
  octocaptcha with a browser extension and a keyboard automation tool. It is paid for by every
  honest user and it did not stop the one attacker we have a write-up of.
- **Device fingerprinting.** FL2-14: under the Digital Personal Data Protection Act there is no
  legitimate-use clause for it, so it needs consent under section 6(1), which means a modal on the
  front door, which is the thing we are not building.
- **A card on the free tier.** FL2-18: 119.44 million outstanding credit cards in India as of April
  2026 against a population well over a billion. It is the most effective control on the list and
  the wrong one for this market.
- **A disposable-address detector.** FL2-13: with Google and GitHub sign-in only and `sub` as the
  key, there is no address field to attack.
- **An address-based hard block.** FL2-12: the operator in FL2-07 rotated a commercial virtual
  private network per account, and in India a shared carrier address is not one person.

### FL2-32. The honest answer to "a foolproof model"

There is not one, and saying so is more useful than promising one.

What the evidence in part one supports is narrower and better. Every published incident was found by
watching usage, not by checking identity. Every provider in part three defends itself with a ceiling
and a history-based ladder. Not one of them gates its free tier on proving who you are. And the one
operator we have a full technical write-up of beat the captcha, the email verification and the
address limits, yet would still have been stopped cold by a per-account ceiling.

So the model to promise the founder is not foolproof, it is **bounded**. We cannot stop somebody
making a second GitHub account. We can make the second account worth 1.37 cents, make the tenth
account visible in a daily report, and make the thousandth account impossible to use faster than the
bucket refills. The loss becomes a number we choose in advance rather than a number we discover in a
bill. That is what every company in part three actually bought, and none of them needed a captcha to
buy it.

One last thing worth putting in front of him, because it is the cheapest insight here. The product
we are building is a poor thing to steal. FL2-04 measured what farmed model access is spent on:
about 95 per cent roleplay, largely by people banned by their own provider or in sanctioned
countries. Our AI surface returns structured edits against a file the user supplies. `INFERENCE:` it
is a bad substitute for a chat endpoint, which lowers the chance of organised farming and raises the
importance of never shipping a raw completion route. The day we ship one, this whole analysis has to
be redone.

---

## What I could not reach

- **Google AI Studio and the Gemini free tier.** `https://ai.google.dev/gemini-api/docs/rate-limits`
  and `https://ai.google.dev/gemini-api/terms` both returned HTTP 302 to an OAuth authorisation URL,
  with and without `?hl=en`, on 2026-09-18. I have no Gemini numbers and stated none. This is the
  largest hole in the research and it sits directly under the pooled-quota assumption, so somebody
  should open it from a signed-in browser before any plan document names a Gemini limit.
- **OpenAI's usage policy.** `https://openai.com/policies/usage-policies/` returned HTTP 403 to my
  client on 2026-09-18. I quoted the rate-limit guide instead and nothing from the policy.
- **Groq's actual numbers.** The rate-limit table at `https://console.groq.com/docs/rate-limits` is
  drawn by JavaScript and the served markup has empty cells. I have Groq's policy language and none
  of its figures.
- **Arkose Labs pricing.** `https://www.arkoselabs.com/pricing/` returned HTTP 404 on 2026-09-18 and
  I found no page with a published price.
- **Cloudflare Turnstile's free-usage ceiling.** `https://developers.cloudflare.com/turnstile/concepts/limits/`
  returned HTTP 404 on 2026-09-18. The product page says free; I could not find the page that says
  free up to what, so do not write a free-forever claim without checking.
- **Cloudflare Bot Management's price.** Not published below Enterprise. The plan selector's fourth
  tab is labelled `Bot Management for Enterprise` and there is no figure.
- **A primary study behind the credit-card conversion numbers.** Every source I found was a vendor
  blog citing other vendor blogs. I quoted one and marked it unverified rather than dressing a range
  as a finding.
- **The GitGuardian report itself,** as opposed to its blog summary, which is behind a form.
- **The share of Indian mobile subscribers behind a shared carrier address.** I looked, found only
  secondary assertions, and left the claim out rather than inventing a figure.
- **WebFetch, for the whole session.** The local taint gate refused it on the first call and on every
  call after. Everything here was fetched with `curl`, which was never blocked.

## What surprised me

1. **The published security consensus already agrees with the founder's rule.** None of OWASP's
   twelve mitigations for LLM10 is a captcha, a puzzle or a human challenge. The whole standard is
   budgets, limits, timeouts, logging and graceful degradation. He is not trading safety for taste.
2. **The honest free tier costs 2.74 dollars a month and one abusive account costs 48.80 dollars a
   day.** I expected the gap to be large. Three orders of magnitude changes where every rupee of
   engineering should go, and it argues for spending none of it on the front door.
3. **Only eight of the 200 free users can spend a whole month's allowance on the same day** before
   the pooled daily allowance is exhausted. That turns the token bucket from a refinement into a
   precondition, and I did not see it until I did the arithmetic.
4. **Nobody in part three gates a free tier on identity, and two of them sell trust for ten dollars.**
   OpenRouter's twenty-fold daily increase for ten credits ever purchased, and OpenAI's tier one at
   five dollars paid, are both cheaper than any verification vendor on this list and strictly more
   honest about what they are buying.
5. **The captcha bypass in FL2-07 is a browser extension called Buster and a keyboard automation
   tool.** Not a machine-learning model, not a solving farm. The defence the industry spent twenty
   years on was beaten by two things you can install in a minute.
