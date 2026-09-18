# Screen change register, 18 September 2026

**Source.** Founder review of `frontmatter-Screens-PRINT-2026-09-17-1723.pdf`, given on 18 September
2026 at about 06:00 IST, plus the research round of the same morning
(`docs/research/2026-09-18/`, 178 findings).

**Status.** Captured. The five open items were answered on 18 September and are recorded in section 10. Application to `PRODUCT-PLAN.md` and `SCREENS.md` is in progress.
Five items marked **CONFLICT** need a founder answer before they can be drawn.

**Tags.** `[Z]` founder instruction, given directly. `[O]` measured in the research round.
`[?]` my question back. `[X]` conflicts with the plan of record or with another instruction.

---

## 1. Getting in

### S01. Sign in

- `[Z]` Google and GitHub icons must be the real brand marks, not placeholders.
- `[Z]` **The phone view is bland.** It needs the same theme treatment as the desktop view.
- Note: this is a theming instruction, not a layout one. It likely applies to more phone views than
  S01 alone. Check every phone panel in the set against it.

### S02. Home, first time, and S03. Home

- `[Z]` Both are fine. No change.

---

## 2. Writing

### S04. Workspace

The heaviest set of instructions in the review. All of them are `[Z]`.

Move | What
Remove | **Shortcuts.** Not needed anywhere.
Move | **Add file** leaves the bottom right and goes to the left rail.
Add | A second left-rail button, **Add idea**.
Add | An **upload** control. Placement was left to me. See section 8 below for the proposal.
Move | Collapsibles (Commands, Backlinks, Tags, Bookmarks, Outline) move to the top.
Move | Open tabs move to the top.
Move | The formatting toolbar (bold and the rest) moves up, so the whole section rises.
Change | **Share** becomes an icon only, no label.
Decide | The placement and treatment of the **frontmatter** wordmark. Open.
Add | The AI launch behaves like Notion's, and the AI bar opens over the workspace.

- `[Z]` Overall constraint, quoted: the user interface should be very simple.

### S05. Doc mode

- `[Z]` Dark mode is fine.
- `[Z]` **Font editing is missing.** Doc mode needs font controls. Few fonts, but they must exist.
- `[O]` Research note, not an instruction: four of the top fourteen all-time requests on the largest
  markdown forum are about front matter, and the properties editor that cannot hold nested YAML is
  the defect behind them. Doc mode's properties panel is where that lands.

### S06. AI writing box

- `[Z]` Markdown mode is fine. **The AI writing box is confusing.**
- `[Z]` It must be unambiguous whether the user is editing a document.
- `[Z]` Placement follows the content: if the documents sit below, the box opens below or to the
  right, whichever fits.
- `[Z]` If the user is working on an idea, that context appears and **stays**.

### S07. AI edit

- `[Z]` Fine as drawn.

### S08. Custom blocks

- No instruction given. Unchanged.

### S09. Flow view

- `[Z]` **Deferred.** Noted, not built now.

### S10. Problems

- `[Z]` Build what is there. No problems with it.
- `[Z]` Add **two toggles**, given as human reviews and AI reviews, so the panel is filtered by
  category rather than being one flat list.
- `[?]` The words used were "it is just reviews". S10 is the problems panel and S20 is review. If
  the toggle instruction was meant for S20 only, say so and I will drop it here.

### S11. Instruction files

- `[Z]` Fine as drawn.
- `[X]` **This conflicts with the research and I am flagging it once.** The screen today is a health
  panel on one AGENTS.md. `[O]` The single loudest artefact in the whole research round is 6,644
  reactions on a request about **several** instruction files, and a three-tool team keeps four or
  more. `[O]` Two independent studies also find these files do not raise task success, one measuring
  over 20 per cent added cost, so the screen must not imply that tidying the file makes the agent
  smarter. Your call. Recorded either way.

---

## 3. Ideas

### S12 to S14. The whole idea flow

- `[Z]` **Rethink the complete user interface, phone included.** It is cognitive-load-heavy today.
- `[Z]` The reference points are Gemini, Claude chat and ChatGPT chat.
- `[Z]` Low, Medium and High should read like **Claude's model selector**, not like three routes.
- `[Z]` Medium and High keep the same interface as Low. Do not fork the route, it confuses people.

### S13. Idea mode, Low. The dynamic question flow

This is a new mechanic, not a restyle.

- `[Z]` The user enters the idea. Questions are generated on the next page.
- `[Z]` **10 to 15 questions**, the count set by the complexity of the idea.
- `[Z]` **Four questions a page, maximum.**
- `[Z]` Answering on one page **rewrites the later pages in real time**. Pages two, three and four
  can change based on what was answered.
- `[Z]` The user is told it is happening. The affected section blurs or shows a processing state.
- `[Z]` Questions after that are generated live from the choices made.

### S13. The skip model

- `[Z]` Page one carries **Skip** and **Choose recommendation**.
- `[Z]` Page two carries both again, plus **Skip all**.
- `[Z]` Skip all opens a modal that says plainly: the recommended option is chosen for every
  remaining question, the plan is generated from those defaults, and the kickoff prompt follows the
  same defaults.

### S15, S16. Blueprint and map

- No instruction given. Unchanged.

---

## 4. Sharing

### S17. Share

- `[Z]` Share by **frontmatter email address**.
- `[Z]` If the address is not in the frontmatter database, the person is not a user. Offer to invite.
- `[Z]` An invite earns credits, about **5**, number not final.
- `[Z]` The same referral modal is reused once the invited person creates an account.

### S18. Published page

- `[Z]` Fine as drawn, with one addition: an **open-in** ladder.
  1. If the reader has the desktop app, open it there by default.
  2. If not, open in frontmatter, signed in with Google.
  3. **Continue in browser anyway** as the third option.
- `[Z]` It still reads without an account, but there is a gate.
- `[X]` **Conflict, and it is the one I would most like you to look at again.** `[O]` In August 2026
  agents made 257 million requests against 131 million human page loads on comparable sites, close
  to two to one, and 83 per cent of agent traffic arrives by the markdown route. An app-detection
  gate on a published page is invisible to every one of those readers, and a redirect can break the
  `.md` twin that S18's footer already carries. The ladder can stand for humans **only if** the raw
  markdown route stays ungated. Say whether that is what you mean.

### S19. Live collaboration

- `[Z]` **Free gets one collaborator. Pro gets several.**
- `[X]` The plan's section 13 currently recommends **three** on Free, against HackMD's three
  invitees and AFFiNE's three members. Your original candidate was one. This instruction reverts to
  one. Confirm and I will change section 13 as well, since the two must agree.
- `[Z]` The edit, live and reading split could move to save space. **Not required now.** Build first.

### S20. Document review

- `[Z]` Fine, but **less cluttered**.
- `[Z]` Split by category with toggles: AI reviews, human reviews, other reviews.

### S21. Document history

- No instruction given. Unchanged.

---

## 5. Bringing things in and out

### S22. Import

- `[Z]` **Upload your documents must be obvious in the interface.** People need to see where to
  upload. Placement left to me, proposal in section 8.

### S23. Connections

- No instruction given in this review. Research proposal still open, see section 7.

---

## 6. Everywhere, account, and the states

### Platform

- `[Z]` **A progressive web app is planned**, and a native app eventually.
- `[?]` **Idea mode: desktop only, or on the web too?** Asked of me directly. Answer in section 8.

### S28 to S30. Account, plan and usage, portfolio

- `[Z]` Account: build what is there. Revisit later.
- `[Z]` Portfolio: build the features already described, with a few templates. **Secondary.**

### S31. Conflict

- `[Z]` Add **Accept** as an option.
- `[Z]` Add **Let AI decide**, and make it available rather than hidden.
- `[Z]` Add **Accept AI suggestions** within the conflict flow.

### S32 to S34

- No instruction given. Unchanged.

---

## 7. The configuration panel

- `[Z]` **Later. Build the product first.**
- `[Z]` S36 needs **more model layouts, 10 to 13 models**, when it is built.
- `[X]` **Consequence you should see before agreeing.** Plan revision 6 moved **11 of the 18 founder
  questions** into this panel, on the reasoning that they stop being decisions if a founder can set
  them from a screen. Deferring the panel puts all 11 back on the table as hardcoded values that
  need answers now. Either we answer them, or phase A ships a values file only we can edit, which is
  the panel with a worse interface. Worth ten minutes.

---

## 8. The two questions you asked me to answer

Written as proposals, not decisions.

### 8.1 Where upload lives

**Two buttons on the left rail, not three.**

- **Add file** and **Add idea** are the only two, as instructed.
- **Add file opens a small menu:** New document, Upload files, Upload a folder, Import from.
  That folds upload and import into a button that already had to exist.
- **The workspace is a drop target everywhere.** Drag a file or a folder onto it at any time. Folder
  upload is already in the plan and works in every browser since Safari 11.1 and iOS 18.4.
- **The empty states carry the words.** S02 first-time home and S34 empty ideas say *drop a folder
  here* in plain words, because that is the only moment a person is actually looking for it.

That satisfies "upload must be clear" without a third button competing with the two you named.

### 8.2 Idea mode: web, desktop, or both

**My recommendation is both, with the desktop app earning the download on things only it can do.**

**Why not desktop only.**

1. **The blueprint exists to be handed to an agent.** Its output is an unlisted link and a kickoff
   prompt. If the making is desktop-only but the output must be web-reachable, the feature is split
   from its purpose.
2. `[O]` **Agents read over the web.** Two to one against humans, and 83 per cent of that arrives by
   markdown route. A desktop-only surface cannot serve an agent in continuous integration, on a
   teammate's machine, or one running while the laptop is shut.
3. **It is one of the two funnels.** Phase 0's gate is twenty blueprints made for twenty people
   outside the studio. Those people will not install an app first.
4. **It fights the founders' own rule.** No captchas, no puzzles, no tour, one tap. A required
   download is a larger barrier than any of those.
5. **The progressive web app narrows the gap anyway.** Once that ships, the desktop app's real
   advantages are a watched folder, the file system, and a local model.

**What the desktop app should get instead, so the download still has a reason.**

- **The local model.** Medium and High depth run on the machine, free, with nothing leaving it. That
  is a genuine carrot and it costs us nothing per use.
- **The watched folder**, so an agent editing on disk feeds the change queue.
- **Quick capture**, already planned.
- **No caps**, already planned.

**On the other reading of your sentence.** If you meant the web should be markdown only with no
editing at all, I would argue against that harder. It removes Doc mode from the surface most people
meet first, and Doc mode is the thing that makes a person who knows Google Docs stay.

### 8.3 Making the AI box unambiguous, since it was left open

- The box always names its target on its own first line: **Editing: `<document>`**, or
  **Idea: `<name>`**, with the selected range shown when there is one.
- It anchors to the content, below when there is room and to the right when there is not, as
  instructed.
- When an idea is in progress that line is pinned and does not scroll away, as instructed.

---

## 9. What still needs a founder answer

1. S10: were the two toggles meant for the problems panel, or only for S20?
2. S11: keep the one-file health panel, against the research?
3. S18: does the open-in ladder apply to human readers only, leaving the markdown route ungated?
4. S19: confirm one collaborator on Free, so section 13 can be changed to match.
5. The configuration panel: defer it and answer the 11 questions now, or keep it in phase A?

---

## 10. The founder's answers, 18 September, and the two decisions handed to me

### 10.1 Answered

1. `[Z]` **Toggles everywhere, on both S10 and S20.** Wherever human and AI work sit together, split
   them with a toggle rather than combining them into one list. The stated reason is cognitive load,
   and it is a general rule, not a per-screen instruction. Apply it to every screen that mixes the
   two.
2. `[Z]` **Ideas become a bottom tab in the workspace**, the same way the outline sits on the right.
   Notes expanded by default, Ideas collapsed. This resolves the S04 layout question and removes the
   need for a separate route into ideas.
3. `[Z]` **S11 follows the research.** The one-file health panel becomes the whole instruction-file
   set.
4. `[Z]` **One collaborator on Free.** Confirmed, on cost grounds. Section 13 changes from three to
   one to match.
5. `[Z]` **The configuration panel ships, with hardcoded defaults.** Everything we have discussed
   goes into it, carrying our recommended values, and the values are revisited later. It is not
   deferred. This resolves the eleven founder questions: they become rows with defaults.

### 10.2 S18, decided: content first, invitation second

The instruction was to pick the implementation that serves scalability, accessibility and the
product. Those three point the same way, against a gate.

- `[O]` Agents outread humans close to two to one, and 83 per cent of them arrive by the markdown
  route. An app-detection gate is invisible to every one of those readers.
- An install prompt in front of a shared link is hostile to the person who was sent it, and the
  published page is the top of the funnel.
- Probing for a desktop app on every page load costs latency on the one surface that must be fast.

**What ships.**

- The page renders immediately. No gate, no redirect, no probe before first paint.
- **`page.md` and `llms.txt` are never gated, never redirected, and never given an interstitial.**
  That rule is absolute and applies to every non-HTML route.
- After first paint, a quiet dismissible bar offers **Open in the frontmatter app** when the app has
  registered its protocol handler, and **Open in frontmatter** otherwise. Dismissal is remembered.
- **The gate belongs on editing, not reading.** A reader who presses Edit meets sign-in. That is
  the natural boundary and it costs nothing at the top of the funnel.

### 10.3 Dynamic questions, decided: dynamic for everyone, bounded

`[O]` I costed it rather than guessing. Against the plan's Low blueprint baseline of 15 calls,
81,825 tokens in and 31,365 out:

Regenerations | Extra tokens | Extra cost on a free model | 200 free users a month
0 | 1,500 in, 2,500 out | $0.0009 | $3.12
3 | 10,500 in, 7,000 out | $0.0029 | $3.51
4 | 13,500 in, 8,500 out | $0.0035 | $3.64

**Dynamic questioning costs about three tenths of a cent per blueprint.** Making it a Pro feature
would mean the free product asks worse questions, and the free product is the funnel. So it is not
a Pro feature.

**What ships instead, and it is cheaper than the naive version.**

- **Generate the whole question set once**, from the idea, in one call. Page one renders instantly
  with all 10 to 15 questions already planned.
- Each question is generated carrying a **branching flag**. Only an answer to a branching question
  triggers a rewrite of the later pages. Most answers do not, so most page turns cost nothing and
  are instant.
- The blur and the processing state appear **only when a rewrite actually fires**, which makes them
  informative rather than constant noise.
- **Cap rewrites at three per blueprint on Free**, unbounded on Pro. That bounds both the cost and
  the abuse surface.
- The real cost is latency and request count against per-organisation free pools, not money.

**The toggle the founder suggested, inverted.** Dynamic is the default. The toggle reads *use a
standard question set*, and it is what we fall back to when the model layer is degraded or the
person is over their cap. That turns it from a paywall into the graceful-degradation path, and it
gives S32 "AI unavailable" something useful to offer instead of an apology.
