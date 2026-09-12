# specs/

Machine-checkable contracts. `specs/harness/` already held the architecture gates; this is
the same idea extended from "how the code is shaped" to "what the code must do".

## How to read one

Body sections are in a fixed order, chosen so the non-derivable content sits first and the
next action sits last: **Contract → Invariants → Interface → Behaviour → Refusals →
Verification → Drift → Decisions → Open → Next**. If you read only two, read Contract and
Invariants.

## How to add one

1. Copy the shape of `specs/render/carrier.md`.
2. `id` must equal the path minus `specs/` and `.md`.
3. Start at `state: draft`. You do not get to write a later state — the harness does.
4. Every invariant needs an executable check. No check, no row.
5. `npm run spec` must be clean before you commit.

## The six states

`draft → ready → in-progress → implemented → verified`, plus `superseded` from anywhere.
Full entry conditions in `_schema/states.md`. Two rules matter most: `verified` requires a
**red proof** — a test that fails against the unfixed code — and any change to a governed
file **automatically demotes** `verified` back to `implemented`.
