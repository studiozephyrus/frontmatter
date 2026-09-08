# Mobbin reference pass — what 20 shipped screens say about this UI

Run 2026-09-09 after the taint gate was fixed. Four queries, twenty screens, images read.

## What every reference agrees on (convention — ignoring it is a bug, not a style choice)

**1. The position is stated as text, not only as a bar.**
Zillow labels the bar with the current section; [Laravel Cloud](https://mobbin.com/screens/f678c7df-a0f1-4979-b8e1-2d9930bb601e) prints "Question 1 of 3" above the question; [OKX](https://mobbin.com/screens/f6875918-0dc0-4271-b771-e26d9fe6ddc9) uses numbered step dots. **We had a bar and a rail row, and no statement of position where the eye lands.**

**2. There is always one primary forward action.**
"Continue" ([Brilliant](https://mobbin.com/screens/69fbd1a0-3b32-4266-812d-59f43c663963), [Uxcel](https://mobbin.com/screens/9e7e615a-754a-45a9-af67-1fe7049b87c9), Laravel), "Next" ([Zillow](https://mobbin.com/screens/6cc1181d-07d7-414b-b279-22d99c82c2e0)), "Submit" (OKX), "Submit review" ([Hex](https://mobbin.com/screens/b6d30984-785d-4ae1-a740-986428e63945), [Graphite](https://mobbin.com/screens/b16e3604-0116-4db7-8fbe-effb138c49d6)). **We had two equal-weight pager cards and no primary action on desktop.** This is the real miss: a reader who answers has nothing telling them what happens next.

**3. Option = title plus one line of consequence, selected by border.**
Zillow, Brilliant and Hex all set a bold label with a muted description under it, selection shown as a coloured border. We already do this, and it is confirmed rather than changed.

**4. Progress lives with the work, not only in the chrome.**
[GitHub](https://mobbin.com/screens/72783a50-4cc2-4e3d-83f9-048f9a2455cf) prints "0 / 2 files viewed" beside the diff and gives every file its own "Viewed" checkbox; Graphite groups its inbox by state with a count per group.

## Where they diverge (a real choice, not a default)

**Where the decision action sits.** Hex and Graphite put the review action in a **right rail** — radio options with one-line descriptions, then Submit. Zillow and Laravel put it **inline under the question**, with the forward action in a fixed footer.

Chosen: inline, because a decision here needs its evidence in the same column, and our right rail carries provenance. Hex's rail works because its options are three fixed verbs; ours are four bespoke sentences.

**Dense list treatment.** [Plain](https://mobbin.com/screens/b83cf467-b501-4c8f-b28c-e638a48d8a51) uses a status glyph per row and a count per section, muted at zero. [Notion Mail](https://mobbin.com/screens/b7984686-57ca-4497-82d1-104103f74419) uses weight — unread is bold. [Devin](https://mobbin.com/screens/e48cb198-fd26-4a92-b17a-a988aa5cbef8) puts +/− counts per file in the tree.

Chosen: weight plus a dot. With 319 rows, bold-for-unanswered scans faster than a glyph vocabulary nobody has learned.

## Applied

| # | Change | Reference |
|---|---|---|
| A | A primary **Next decision** action, and after answering it becomes the emphasised step | Brilliant, Zillow, Laravel, Uxcel |
| B | **"Decision 12 of 319"** stated above the question, plus position within the area | Laravel, OKX, Zillow |
| C | Keyboard hint sits **with** the action — "or press ↵" | Uxcel |
| D | The meter is labelled with the **current area** and its progress, not only the global total | Zillow |
| E | Nav: unanswered is **bold**, answered recedes; counts muted at zero | Notion Mail, Plain |
| F | Clicking an area opens an **area index** — every question with its state — instead of jumping to the first | Graphite |

## Rejected

**Hex's right-rail decision panel.** Our options are long sentences with consequences; they need the reading column.
**Step dots (OKX).** They work for six questions. At 319 they are noise.
**Per-row avatars and dates (Notion Mail, ClickUp).** We have neither authors nor dates per decision.
