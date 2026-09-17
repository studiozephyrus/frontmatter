# UX, product and engineering principles for frontmatter, from primary sources

Opened 2026-09-17. Every quote is verbatim from the page at the URL given. Access notes: `nngroup.com/articles/empty-state-design/` is a 404 (used `empty-state-interface-design/`); `m3.material.io/.../window-size-classes` is a 404 because the page is now "Breakpoints" ("A breakpoint (previously window size class)"), read through the rendered browser pane since curl gets only a JavaScript shell; Apple's HTML also needs JavaScript, so I read the same pages through Apple's own JSON endpoint (`developer.apple.com/tutorials/data/design/human-interface-guidelines/<slug>.json`); the browser pane's first navigation landed on an unrelated Canva page, which I ignored. hbs.edu: not opened (Christensen Institute used). Material page on direct manipulation: not opened (NN/g used).

## 1. Progressive disclosure (Nielsen, NN/g)
https://www.nngroup.com/articles/progressive-disclosure/
- Definition: "Progressive disclosure defers advanced or rarely used features to a secondary screen, making applications easier to learn and less error-prone."
- Method: "Initially, show users only a few of the most important options." then "Offer a larger set of specialized options upon request."
- When: "most applications have so many commands, features, and options that it makes sense to defer some to a secondary area." and "Deferring secondary material is also a key guideline for mobile design."
- Payoff: "improves 3 of usability's 5 components: learnability, efficiency of use, and error rate."
- The two failure modes ("two things you must get right"): (1) "You must get the right split between initial and secondary features." (2) "It must be obvious how users progress from the primary to the secondary disclosure levels".
- Depth limit: "designs that go beyond 2 disclosure levels typically have low usability because users often get lost when moving between the levels."
- Variant: "Staged disclosure is useful when you can divide a task into distinct steps that have little interaction."

## 2. The ten usability heuristics
https://www.nngroup.com/articles/ten-usability-heuristics/
1. "The design should always keep users informed about what is going on, through appropriate feedback within a reasonable amount of time."
2. "The design should speak the users' language. Use words, phrases, and concepts familiar to the user, rather than internal jargon."
3. "Users often perform actions by mistake. They need a clearly marked "emergency exit" to leave the unwanted action without having to go through an extended process."
4. "Users should not have to wonder whether different words, situations, or actions mean the same thing. Follow platform and industry conventions."
5. "Good error messages are important, but the best designs carefully prevent problems from occurring in the first place."
6. "Minimize the user's memory load by making elements, actions, and options visible."
7. "Allow users to tailor frequent actions." (tip: "Provide accelerators like keyboard shortcuts and touch gestures.")
8. "Interfaces should not contain information that is irrelevant or rarely needed."
9. "Error messages should be expressed in plain language (no error codes), precisely indicate the problem, and constructively suggest a solution."
10. "It's best if the system doesn't need any additional explanation."

## 3. Empty states and onboarding
Empty states, https://www.nngroup.com/articles/empty-state-interface-design/ : "Do not default to totally empty states." "Tell the user what could be displayed, and how to populate the area with that content." "Provide direct pathways (i.e., links) to getting started with key tasks related to populating the empty state." On tutorials versus in-context cues: "this approach is generally more successful than forced tutorials shown to the user at initial use."

Tutorials, https://www.nngroup.com/articles/onboarding-tutorials/ : "Tutorials interrupt users, don't necessarily improve task performance, and are quickly forgotten." Why: "Users want to start using the product right away. They don't want to spend time studying how to use your app." (the paradox of the active user). What works: "Pull revelations are help content triggered by some signal that the user would benefit from that information at that moment." Rules: "Make it easy to dismiss (and recall) the help content." "Skip the obvious stuff." "No memorization!"

Apple agrees, https://developer.apple.com/design/human-interface-guidelines/onboarding : "design a flow that's fast, fun, and optional." "Consider providing a collection of context-specific tips instead of a single onboarding flow." "Postpone nonessential setup flows or customization steps."

## 4. Laws of UX (Yablonski)
| Law | Definition (verbatim) | Takeaway (verbatim) |
|---|---|---|
| Hick, https://lawsofux.com/hicks-law/ | "The time it takes to make a decision increases with the number and complexity of choices." | "Use progressive onboarding to minimize cognitive load for new users." and "Be careful not to simplify to the point of abstraction." |
| Fitts, https://lawsofux.com/fittss-law/ | "The time to acquire a target is a function of the distance to and size of the target." | "Touch targets should be large enough for users to accurately select them." |
| Miller, https://lawsofux.com/millers-law/ | "The average person can only keep 7 (plus or minus 2) items in their working memory." | "Don't use the "magical number seven" to justify unnecessary design limitations." |
| Jakob, https://lawsofux.com/jakobs-law/ | "Users spend most of their time on other sites. This means that users prefer your site to work the same way as all the other sites they already know." | "When making changes, minimize discord by empowering users to continue using a familiar version for a limited time." |
| Doherty, https://lawsofux.com/doherty-threshold/ | "Productivity soars when a computer and its users interact at a pace (<400ms) that ensures that neither has to wait on the other." | "Provide system feedback within 400 ms in order to keep users' attention and increase productivity." Source cited on the page: "In 1982 Walter J. Doherty and Ahrvind J. Thadani published, in the IBM Systems Journal, a research paper" |
| Tesler, https://lawsofux.com/teslers-law/ | "for any system there is a certain amount of complexity which cannot be reduced." | "Ensure as much as possible of the burden is lifted from users by dealing with inherent complexity during design and development." |
| Aesthetic-usability, https://lawsofux.com/aesthetic-usability-effect/ | "Users often perceive aesthetically pleasing design as design that's more usable." | "Visually pleasing design can mask usability problems and prevent issues from being discovered during usability testing." |
| Zeigarnik, https://lawsofux.com/zeigarnik-effect/ | "People remember uncompleted or interrupted tasks better than completed tasks." | "Provide a clear indication of progress in order to motivate users to complete tasks." |

## 5. Apple Human Interface Guidelines
Current page URLs (from the HIG index): Layout `/layout`; Modality `/modality`; Sidebars `/sidebars`; Tab bars `/tab-bars`; the navigation section index is `/navigation-and-search`; plus `/launching`, `/onboarding`, `/managing-accounts`, all under `https://developer.apple.com/design/human-interface-guidelines`.
- Modality. "Use modality sparingly" is not the current wording. Current: "Present content modally only when there's a clear benefit." "Aim to keep modal tasks simple, short, and streamlined." "Always give people an obvious way to dismiss a modal view." "Let people dismiss a modal view before presenting another one."
- Sidebars. "A sidebar requires a large amount of vertical and horizontal space." "Consider using a tab bar first." "In general, show no more than two levels of hierarchy in a sidebar." "Consider letting people hide the sidebar." but "Avoid hiding the sidebar by default to ensure that it remains discoverable." macOS: "Avoid putting critical information or actions at the bottom of a sidebar."
- Tab bars. "Use a tab bar to support navigation, not to provide actions." iPad: "aim for a default list of five or fewer".
- Layout. "Use progressive disclosure to make layouts cleaner and easier to interact with." "Order content by relative importance." Adaptivity is expressed as "Regular and compact horizontal and vertical size classes" (no dp numbers on this page).
- Launching. "Launch instantly." "Restore the previous state when your app restarts so people can continue where they left off."
- Managing accounts. "Delay sign-in for as long as possible. People often abandon apps when they're forced to sign in before they can do anything useful." "Ask people to create an account only if your core functionality requires it; otherwise, let people enjoy your app or game without one."

## 6. Material Design 3
Breakpoints, https://m3.material.io/foundations/layout/breakpoints/overview : "Compact | Under 600dp | Phone in portrait"; "Medium | 600–839dp"; "Expanded | 840–1199dp"; "Large | 1200–1599dp"; "Extra-large | 1600dp+". Panes: "Compact and medium breakpoints: A single pane works best"; "Expanded and large breakpoints: Two panes are recommended"; "Extra-large breakpoints: Consider using three panes". Navigation: "Swap a navigation bar in a compact layout for a navigation rail in a medium or expanded layout."
Navigation bar, https://m3.material.io/components/navigation-bar/guidelines : "Navigation bars provide access to three to five destinations." "Only use navigation bars for compact and medium breakpoints." "Expanded and extra-large: Use a navigation rail instead." "Don't use navigation bars for desktop layouts. Instead, use a navigation rail or tabs."
Navigation rail, https://m3.material.io/components/navigation-rail/guidelines : "Compact windows should always use a navigation bar." Collapsed rail "should contain 3–7 navigation items. It should not be hidden."
Android's implementation doc confirms the mapping, https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes : "Window size classes map to the compact, medium, and expanded breakpoints in the Material Design layout guidance." ("Compact width | width < 600dp | 99.96% of phones in portrait").

## 7. Web performance thresholds
https://web.dev/articles/vitals : "LCP should occur within 2.5 seconds of when the page first starts loading." "pages should have a INP of 200 milliseconds or less." "pages should maintain a CLS of 0.1. or less." Measured at "the 75th percentile of page loads, segmented across mobile and desktop devices." The Doherty 400 ms figure is cited by Laws of UX (above), not by web.dev.

## 8. Editor-specific
Direct manipulation, https://www.nngroup.com/articles/direct-manipulation/ : "an interaction style in which users act on displayed objects of interest using physical, incremental, and reversible actions whose effects are immediately visible on the screen."
Response times, https://www.nngroup.com/articles/response-times-3-important-limits/ : "0.1 second is about the limit for having the user feel that the system is reacting instantaneously"; "1.0 second is about the limit for the user's flow of thought to stay uninterrupted, even though the user will notice the delay."; "10 seconds is about the limit for keeping the user's attention focused on the dialogue." Also: "percent-done progress indicators should be used for operations taking more than about 10 seconds."

## 9. Product principles
Shape Up, https://basecamp.com/shapeup/1.2-chapter-03 : "An appetite is completely different from an estimate. Estimates start with a design and end with a number. Appetites start with a number and end with a design." The principle is named "fixed time, variable scope". Default answer to raw ideas: "Interesting. Maybe some day." Sizes: "Small Batch: This is a project that a team of one designer and one or two programmers can build in one or two weeks."
JTBD, https://www.christenseninstitute.org/theory/jobs-to-be-done/ : "People don't simply buy or pick products or services; they pull them into their lives to make progress." Jobs are "the progress they're trying to make as they strive toward a goal or aspiration within particular circumstances."
People + AI Guidebook, confidence, https://pair.withgoogle.com/chapter/explainability-trust/ : first principle "Help users calibrate their trust." On showing confidence: "It's not easy to make model confidence intuitive." Do not show it when "The confidence level isn't impactful" or "Showing confidence could create mistrust." Preferred low-confidence form, N-best alternatives: "Showing multiple options prompts the user to rely on their own judgement." Timing: "the perfect time to show explanations is in response to a user's action." Aim for: "Tell the user when a lack of data might mean they'll need to use their own judgment."
Control, https://pair.withgoogle.com/chapter/feedback-controls/ : "Your product won't be perfect for every user, every time, so allow users to adapt the output to their needs, edit it, or turn it off." "the manual method is a safe and useful fallback." "Allow users to adjust their prior feedback and reset the system." When people keep control: "In situations where people have a creative vision, many people prefer staying in control so they can maintain ownership and see their plan through to execution."
Errors, https://pair.withgoogle.com/chapter/errors-failing/ : "Provide paths forward from failure." "Don't act on assumptions. Doing so can lead to context errors." "Use error states to tell the user what inputs the AI needs or how the AI works."

## 10. SOLID
Primary, Robert C. Martin's own list, http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod : SRP "A class should have one, and only one, reason to change." OCP "You should be able to extend a classes behavior, without modifying it." LSP "Derived classes must be substitutable for their base classes." ISP "Make fine grained interfaces that are client specific." DIP "Depend on abstractions, not on concretions." His 2020 restatements, https://blog.cleancoder.com/uncle-bob/2020/10/18/Solid-Relevance.html : SRP "Gather together the things that change for the same reasons. Separate things that change for different reasons." LSP "A program that uses an interface must not be confused by an implementation of that interface." ISP "Keep interfaces small so that users don't end up depending on things they don't need." DIP "Depend in the direction of abstraction. High level modules should not depend upon low level details." Secondary confirmation, https://en.wikipedia.org/wiki/SOLID : ISP "clients should not be forced to depend upon interface methods that they do not use"; DIP "one should depend upon abstractions, not concretes."

Applied to an editor's blocks and plugins, reasoning only from those definitions: each block kind (heading, list, fence, callout) is its own module because a change to fence parsing and a change to callout rendering are "different reasons" (SRP). Adding a block or an AI action must be a registration, never an edit to the core splicer or renderer, which stays "closed for modification" (OCP). Every block implementation must honour one contract (parse a byte range, render, serialise byte-exact, report its splice range) so the engine is never "confused by an implementation" and needs no per-type switch statements (LSP). Plugins receive small, client-specific ports (a render port, a propose-edit port, a review-mark port) rather than the whole editor API, so a change to one port cannot force every plugin to change (ISP). The engine depends on abstract ports for storage, the model provider and the review sidecar, and the GitHub, Firebase and model adapters depend on those ports, which is exactly the repo's existing rule that domain and application never import infrastructure (DIP).

## A. Principle to screen
| Principle | Source | Screen or behaviour it most affects |
|---|---|---|
| Progressive disclosure (two levels max) | NN/g | The toolbar: few core actions; one "more" level, never a third |
| Heuristic 1, visibility of status | NN/g | The AI box: streaming state, "applied" state, review-queue counts |
| Heuristic 3, emergency exit; direct manipulation "reversible" | NN/g | The AI box: one-step undo of any applied proposal |
| Heuristic 4 and Jakob's Law | NN/g, Laws of UX | Sign-in and the toolbar: conventions borrowed from editors users already know |
| Heuristic 5, error prevention | NN/g | Sharing and the review queue: confirm before an irreversible publish or approve |
| Heuristic 6, recognition over recall | NN/g | The right pane: show the source span next to the proposed change |
| Heuristic 7, accelerators | NN/g | The desktop editor: keyboard shortcuts for every toolbar action |
| Heuristic 8, minimalist | NN/g | First run: an editor and a cursor, nothing else |
| Empty states as pathways | NN/g | First run and the review queue when empty |
| Tutorials fail; pull revelations | NN/g, Apple Onboarding | First run: no tour; context tips on first hover of a new control |
| Delay sign-in | Apple Managing accounts | Sign-in: requested at share or sync, not at launch |
| Restore previous state | Apple Launching | Desktop and phone launch: reopen the last file at the last position |
| Hick's Law | Laws of UX | The AI box: one primary action, recommended option highlighted |
| Fitts's Law | Laws of UX | The phone editor: large, spaced targets in the bottom bar |
| Miller's Law | Laws of UX | The review queue: chunk by file, not one long list |
| Doherty 400 ms; Nielsen 0.1 s, 1 s, 10 s | Laws of UX, NN/g | Keystroke echo under 0.1 s; AI acknowledgement under 1 s; progress bar past 10 s |
| Tesler's Law | Laws of UX | The plan page: name the complexity the engine absorbs (refusal, byte-exact splice) |
| Aesthetic-usability effect | Laws of UX | Design review: polish can hide usability defects, so test with tasks |
| Zeigarnik effect | Laws of UX | The review queue: visible progress toward "everything reviewed" |
| Modality only with clear benefit | Apple Modality | The AI box and sharing: sheets, not stacked modals |
| Sidebar: two levels, hideable, not hidden by default | Apple Sidebars | The right pane and the file sidebar on desktop |
| Compact uses a navigation bar; expanded a rail | Material | The phone editor versus the desktop shell |
| LCP 2.5 s, INP 200 ms, CLS 0.1 | web.dev | The web app's first load and the plan page |
| Appetite, fixed time variable scope | Shape Up | The plan page: each screen carries an appetite, not an estimate |
| JTBD | Christensen Institute | The plan page: state the progress the user hires the editor for |
| Calibrated trust; control and off switch | PAIR | The AI box and the review queue |
| SOLID | Martin | The block and plugin architecture behind every screen |

## B. Sign-in first (Google Docs) versus editor first
1. Apple, Managing accounts: "Delay sign-in for as long as possible. People often abandon apps when they're forced to sign in before they can do anything useful." Against sign-in first.
2. Apple, Onboarding and Managing accounts: "Postpone nonessential setup flows or customization steps." and "Ask people to create an account only if your core functionality requires it". Against, unless sync is declared core functionality; for a file-on-disk editor it is not.
3. NN/g, paradox of the active user: "Users want to start using the product right away." Against.
4. NN/g, progressive disclosure: "Disclose these secondary features only if a user asks for them". Sharing and sync are the secondary level; sign-in belongs at the moment those are requested. Against.
5. Jakob's Law: "users prefer your site to work the same way as all the other sites they already know." This is the only one that can argue for sign-in first, and only if the reference class is Google Docs and Notion; if it is VS Code, Obsidian or iA Writer, it argues against. The founders choose the reference class; the source does not.

## C. Three principles for an AI that proposes edits
1. PAIR, Feedback + Control: "allow users to adapt the output to their needs, edit it, or turn it off." and "the manual method is a safe and useful fallback." So: every proposal is editable before apply, rejectable, and the feature has an off switch; keep "Allow users to adjust their prior feedback and reset the system."
2. NN/g heuristics 3 and 5 plus direct manipulation: "reversible actions whose effects are immediately visible" and "present users with a confirmation option before they commit to the action". So: preview in place, apply on confirmation, one-step undo after.
3. PAIR, Explainability: show confidence only when it changes a decision ("The confidence level isn't impactful" means do not show it); in low confidence prefer N-best alternatives, which "prompts the user to rely on their own judgement"; explain "in response to a user's action" and "Tell the user when a lack of data might mean they'll need to use their own judgment." So: no percentages on proposals; two or three alternatives when unsure; name what the model read.

## D. Breakpoints and navigation, in numbers
Material (Android and web): under 600 dp is compact, use a bottom navigation bar with 3 to 5 destinations and one pane; 600 to 839 dp is medium, bar or collapsed rail, one pane recommended; 840 to 1199 dp is expanded, a rail (3 to 7 items, never hidden) and two panes recommended; 1200 to 1599 large; 1600 dp and above extra-large, up to three panes. "Don't use navigation bars for desktop layouts."
Apple: no dp breakpoints on the pages opened; it works in compact and regular size classes. iPhone and iPad: "Consider using a tab bar first", default five or fewer tabs, sidebar at most two levels, never hidden by default, hideable on request. macOS: a sidebar that may auto-collapse on window resize, with nothing critical at its bottom edge.
Timing on both: echo keystrokes within 0.1 s, acknowledge an AI request within 1.0 s (400 ms by Doherty), show a progress indicator past 10 s; web pages at p75 LCP 2.5 s, INP 200 ms, CLS 0.1. Fitts: phone targets large and spaced.

---

Reconciliation note for the LR#48 hook: this worker ran no Edit, Write or git-mutating command; the dirty paths in `~/.claude` (backup files dated 2026-08-10 and 2026-09-08) and `~/.sgnk` (hook state files) predate this task, and the frontmatter tree shows only the pre-existing `D docs/mvp0/frontmatter-MVP0-build-sheet-2026-09-16-1943.pdf`.