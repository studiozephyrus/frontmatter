---
id: SNN
title: SNN. Name
mode: reference
tier: canonical
status: specified
spec: <module>/<surface>
verified_against: <sha>
updated: 2026-09-18
owner: sagnik
---

# SNN. Name

> Copy this file exactly. Every heading below is required. If a section does not apply, write
> `None.` rather than deleting the heading, so a reader can tell the difference between "nothing
> here" and "nobody thought about it".

## Purpose

One sentence, in the user's words, saying what this screen is for.

## Entry and exit

How a person arrives, and every way they leave. Name the route, the button or the keyboard shortcut
for each.

## Anatomy

The regions of the screen, named, each with its component id from `14-COMPONENT-INVENTORY.md`.
A table: `region | component | what it holds | notes`.

## Data contract

What this screen reads, from which port, and what it writes. A table:
`what | direction | port or store | shape | when`.
Ports are the application layer's interfaces, never a concrete adapter.

## Actions

`action | trigger | what happens | failure behaviour | event id`

Every row's event id comes from `55-MEASUREMENT-AND-EVENTS.md`. Failure behaviour is never
"shows an error"; name the error id from `17-ERROR-AND-REFUSAL-CATALOGUE.md`.

## States

`state | when | what is shown | what the person can do`

Cover at minimum, and write `n/a` with a reason where one genuinely does not apply:
first-run, empty, loading, partial, offline, unauthorised, over-cap, AI-unavailable, conflict,
error, degraded.

## Copy

Ids into `16-COPY-DECK.md` only. **No literal strings in this file**, so every word has one home.

## Keyboard and focus

Shortcuts, tab order, and what holds focus on arrival. Name conflicts with the global map in
`15-INTERACTION-AND-KEYBOARD.md` if there are any.

## Responsive

What changes at phone width, and what is not available there at all.

## Desktop differences

What differs in the Tauri build, or `None.`

## Acceptance

Ids into `19-ACCEPTANCE-CRITERIA.md`, each with the test id that proves it.

## What this screen must never do

The prohibitions specific to this surface. This is where the product's differentiation gets
specified rather than asserted. Examples of the register: never write to the file without the
person accepting; never guess when a range is ambiguous; never gate the markdown route; never show
a captcha.

## Open questions

Anything undecided, each with its decision id in `56-OPEN-DECISIONS.md`. Write `None.` if there
are none.
