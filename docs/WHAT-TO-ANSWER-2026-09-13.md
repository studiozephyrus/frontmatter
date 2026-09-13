---
title: What you are answering, and why
date: 2026-09-13
for: Sagnik and Amit
status: the reading order for the decisions site
---

# What you are answering

You said you could not tell what the questions were. Fair. There were 204 of them in one flat
list, every one looking as urgent as the next, and nothing on the page saying which ones stop
the build and which ones are for a product that does not exist yet.

That is fixed. Every card now carries a stage and a one line reason, and the site opens on the
ones that block the MVP.

## What changed today

The 13 September reset said: build the bare bones editor, use the kit generator as the way in,
and let the pilot decide the rest. The 204 cards were written before that, against a much wider
product. Most of them are still good questions about work that now comes later.

So each card was read and sorted against the plan:

| Stage | Cards | What it means |
|---|---|---|
| Answer now, it blocks the MVP | 60 | The build cannot start, or starts wrong, without this |
| Beta slot in the pilot | 2 | Only if the pilot earns it |
| After the pilot | 119 | Good question, wrong month |
| Not now | 9 | The plan rules the surface out |
| A task, not a decision | 9 | Somebody does it, nobody chooses |

The 119 are not deleted. They are still there, still answerable, just not in your way.

Five more were then merged, because each was the same decision written twice. `FF16` into `FF1`,
`FF14` into `FF8`, `D12` into `D11`, `D22` into `E33`, and `F16` into `AC14`. Each survivor names
what it absorbed, so nothing was dropped quietly. That is what took the set from 204 to 199 and
the MVP group from 65 to 60.

## The order to answer in

Five questions settle a lot of the others. Take these first, in this order, because each one
narrows what the next one can be.

**1. Do we hold document bytes?** `L1`

This is the hinge. The old plan promised we hold nothing. The kit funnel cannot work without
holding kits. Answering yes starts a six hour breach clock, a privacy policy, and a named
person on the paperwork. Answering no means no funnel. Six other cards wait on this one:
`L3`, `L4`, `L6`, `L7`, `L12`, `L17`, and the storage design in `AC1` and `AC14`.

**2. What are we building, and on what surface?** `FF1`, with `F5` and `R17`

`FF1` now carries the editor-first question too, because the card that asked it separately was
the same decision written twice. Plan v15 cut the kickoff prompt on evidence and you brought it
back on 13 September, so the plan carries both, and the gate is twenty kits made by hand before
any of it is written as code. `F5` asks whether generation ships at all, and `R17` asks for the
founder test notes that were never attached.

**3. What do Pro and Max gate?** `PR24`, then `PR1` and `PR21`

The plan proposes giving the editor away and charging for where the files live. `PR24` is that
question. The other two follow from it.

**4. What is the pace, and who builds?** `B1`, then `PL2` and `B2`

Every date in the plan rests on this. The measured rate is one person's. If Amit is building,
the number changes and so does every phase estimate.

**5. What is frontmatter?** `P1` and `P2`

You have answered this already: an editor, with a kit generator as the way in. It still needs
recording on the site, because `P2` is where review state formally moves to after the pilot.

## Then the rest, in sittings

The five groups above are twelve cards. The other 48 group cleanly. One sitting each.

**The shape of the product** (`FF1`, `FF3`, `FF8`, `MK4`, `P15`). Standalone web first,
one surface, and what to do about the shell being a fork of md.sgnk.ai. `FF3` matters more than
it looks: the MVP wears the sibling's face, so merge, freeze or own is a week one call.

**The editor itself** (`D8`, `D7`, `D11`, `D13`, `D15`, `D21`, `FL3`, `FL12`,
`F18`, `F25`, `F27`, `E21`). Four modes or three, where the AI box sits, what a template is,
what Tab does, dark mode, and which scripts and screen readers are in scope. Small questions
individually. Together they are the first screen a stranger meets.

**The engine, only what blocks opening a file** (`E1`, `E12`, `E33`). The editor refuses most
real vaults over a flush left list in the frontmatter. Strangers cannot open their own notes
until that is fixed. `E12` is one day of automated checks that guards everything after it.

**Storage, keys and access** (`AC1`, `AC3`, `AC13`, `F10`, `AC14`, `F19`, `F9`, `F8`,
`F21`). Where bytes travel, whose key pays for the AI, what happens to the share page, and two
shipped surfaces that contradict claims the product makes.

**Money and the free tier** (`PR7`, `PR10`). Each kit costs about $0.35 in model tokens. Free
without a cap is an open tab.

**Law before the first stored kit** (`L3`, `L4`, `L6`, `L7`, `L12`, `L17`, `B14`). These all
depend on `L1`. If we hold nothing, most of them close on their own.

**The name** (`N1`, `N2`, `N3`). It goes on the landing page, the launcher and every kit badge.
A register check is cheap and it is due before any of that is public.

**Getting the first twenty people** (`G15`, `G16`, `G12`). Phase zero needs twenty people
outside the studio. `G16` asks whether md.sgnk.ai's existing users are on that list, and they
are the closest thing to a warm audience this product has.

**How we judge it** (`PL5`, `PL3`, `PL10`). What passing means, what order the fixes run in,
and which kill lines are live. Kill lines only work if they are set before the work starts.

## How to answer

The site is at **https://frontmatter-decisions-sagnik.vercel.app** and it now opens on the MVP
set.

- `a` to `d` picks an option, Enter moves on, `j` and `k` move, `/` searches.
- Each card shows a stage chip and a reason. Cards that settle others link to them.
- The recommendation is a position, not an answer. Disagreeing is a normal outcome and the
  export records it.
- **Export the JSON after every sitting.** Your answers live in one browser, in one place, and
  clearing site data loses all of them. Export, then it gets committed as
  `decisions/answers-<date>.json`, and the specification is generated from that file rather than
  from a conversation.

## What I would not do

Answer all 60 in one go. The first five decide the shape of the rest, and several of them read
differently once the first five are settled. Take the five, then stop, then come
back.

## What happens after

Once the five are answered, phase zero can start while you work through the rest: the repo
default is already fixed, the pace gets published, and the first of the twenty hand made kits
goes out. The specification comes after the answers, from the exported file, and not before.
