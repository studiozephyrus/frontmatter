# Feature criteria gap, 18 September 2026

**Working file.** It lists every feature in `docs/pack/10-FEATURE-REGISTER.md` whose `acceptance`
cell read `none yet`, and records what each one got. Like the other files under `tools/`, it
carries no front matter and `validate-pack.py` does not read it.

## 1. How the list was made

Run at commit `4de879d` on 18 September 2026:

```bash
python3 - <<'EOF'
import re
rows = [l.rstrip('\n') for l in open('docs/pack/10-FEATURE-REGISTER.md')
        if re.match(r'^`F\d{3}[a-z]?` \|', l)]
cells = [r.split(' | ') for r in rows if len(r.split(' | ')) == 8]
print(sum(1 for c in cells if c[6] == 'none yet'))   # 43
EOF
```

- **43 features, not 39.** The brief's grep matched `F1NN` rows only. Adding the `F2NN` rows gives 43,
  which is also the figure the register's own section 3 states.
- **21 of the 43 already had criteria** in `19-ACCEPTANCE-CRITERIA.md` section 12a, written from the
  screen specs on 18 September. The register's column was never updated to point at them. Found with
  a grep for each feature id in the `feature` column of that file.
- **22 had nothing.** Those got new criteria in `19-ACCEPTANCE-CRITERIA.md` section 12b, `A729` to
  `A796`, 68 in all, starting after the highest existing id, `A728`.

## 2. The list

A status of `existing` is a feature section 12a already covered; the register now points there. A
status of `new` is a feature whose criteria were written in section 12b. The `spec file` column is
the value before this change; section 3 gives the new ones.

feature | name | screens | spec file | criteria | status
`F106` | Home, returning | S03 | 12-screens/S03.md | A519-A522, A524, A525 | existing
`F107` | The three home tabs | S02, S03 | 12-screens/S03.md | A522 | existing
`F108` | Account settings | S28 | 12-screens/S28.md | A663-A667 | existing
`F109` | Appearance and dark mode | S27, S28 | 12-screens/S27.md | A656-A662 | existing
`F110` | Roles and permissions | S17, S20 | 12-screens/S17.md | A729-A733 | new
`F118` | Add file | S04, S22 | 12-screens/S04.md | A526, A527 | existing
`F119` | Add idea | S04, S12 | 12-screens/S04.md | A526 | existing
`F120` | Ideas as a tree section | S04, S12 | 12-screens/S04.md | A529 | existing
`F125` | Unlinked mentions | S04 | 12-screens/S04.md | A734, A735 | new
`F126` | Tags | S04 | 12-screens/S04.md | A736-A738 | new
`F127` | Bookmarks | S04 | 12-screens/S04.md | A739, A740 | new
`F135` | Templates | S02, S04 | 12-screens/S04.md | A741-A743 | new
`F136` | Daily notes and calendar | S04 | 12-screens/S04.md | A744-A746 | new
`F138` | Trash | S04 | 12-screens/S04.md | A523 | existing
`F139` | Image paste and resize | S04 | 12-screens/S04.md | A747, A748 | new
`F140` | Browser spellcheck | S10, S28 | 12-screens/S28.md | A749, A750 | new
`F142` | Table of contents marker | S04 | none yet | A751, A752 | new
`F143` | Footnotes | S04 | 12-screens/S04.md | A753-A755 | new
`F144` | Emoji input | S04 | 12-screens/S04.md | A756, A757 | new
`F145` | Link previews | S04 | 12-screens/S04.md | A758-A760 | new
`F146` | OCR search | S04 | 12-screens/S04.md | A761, A762 | new
`F147` | Citations | S04 | 12-screens/S04.md | A763-A765 | new
`F149` | Quick capture | S26 | 12-screens/S26.md | A647-A653, A655 | existing
`F164` | Bring your own key | S28, S37 | 12-screens/S37.md | A766-A770 | new
`F173` | Tidy this file | S11 | 12-screens/S11.md | A771-A775 | new
`F179` | Excalidraw block | S08, S12 | none yet | A776-A778 | new
`F180` | Chart from a table | S08 | none yet | A554, A555, A558, A559 | existing
`F199` | Industry templates | S12 | 12-screens/S12.md | A779-A781 | new
`F200` | Attach to an idea | S12 | 12-screens/S12.md | A588 | existing
`F206` | Blueprint versions | S15, S21 | 12-screens/S15.md | A600 | existing
`F210` | Invite credits | S17 | 53-PRICING-AND-ENTITLEMENTS.md | A610 | existing
`F211` | Referral modal | S17 | 12-screens/S17.md | A611 | existing
`F230` | The portfolio | S30 | 12-screens/S30.md | A673-A678 | existing
`F245` | Connections screen | S23 | 12-screens/S23.md | A635-A637 | existing
`F246` | The agents card | S23 | 12-screens/S23.md | A638 | existing
`F251` | The watched folder | S20, S25 | 12-screens/S25.md | A782-A784 | new
`F252` | Desktop signing | S25 | 35-RELEASE-AND-VERSIONING.md | A645, A646 | existing
`F255` | Progressive web app | S22, S26 | 12-screens/S26.md | A654 | existing
`F256` | Protocol handler | S18, S25 | 12-screens/S18.md | A785-A787 | new
`F262` | Razorpay checkout | S29 | 53-PRICING-AND-ENTITLEMENTS.md | A670, A671 | existing
`F263` | The mandate ceiling | S29 | 53-PRICING-AND-ENTITLEMENTS.md | A672 | existing
`F264` | Top-ups | S29 | 53-PRICING-AND-ENTITLEMENTS.md | A788-A792 | new
`F265` | Plans side by side | S29 | 12-screens/S29.md | A793-A796 | new

## 3. Spec file cells repointed in the same change

Register section 8 named three pack files that did not exist. The 18 `spec file` cells that read
`none yet` now point at the file for their subject.

file | features | present on 18 September
`66-FORMAT-SPECIFICATIONS.md` | F142, F167, F174 to F184, F216, F217 | yes, being written
`67-SYNC-AND-CONFLICT.md` | F249, F280 | no, being written
`46-ACCESSIBILITY-SPEC.md` | F170 | yes

## 4. Five criteria that are not yet checkable

id | feature | what it waits on
`A765` | F147 | Where a DOI lookup's formatted reference entry lives
`A770` | F164 | Whether `flag.byok` defaults on (the S37 drawing) or off (`28-CONFIGURATION-PANEL-SPEC.md`)
`A778` | F179 | The stored drawing's format: JSON Canvas 1.0 per the register, or an Excalidraw file per S08
`A784` | F251 | The size at which a watched folder is very large
`A785` | F256 | The desktop app's protocol scheme, open decision `D41` in S18

## 5. The thinnest coverage

A single criterion is a definition of done that tests one thing. These features have exactly one,
all from section 12a, and each is a candidate for more:

F107, F119, F120, F138, F200, F206, F210, F211, F246, F255, F263.
