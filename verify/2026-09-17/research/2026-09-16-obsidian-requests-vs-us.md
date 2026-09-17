# Obsidian's 30 most-liked open requests, against what frontmatter would ship

Source: forum.obsidian.md, category "Feature requests" (6,051 topics), described on the
forum itself as "Likes (Hearts) = Votes". Ranked by total hearts on the thread, read
2026-09-16. None of the 30 has been moved to the implemented archive.

Our column was checked against the source the same day.

| # | Request | Hearts | frontmatter | Size |
|---|---|---|---|---|
| 1 | Edit transcluded (embedded) notes in place | 1,078 | Live mode already opens any block for editing on click (`live/InlineBlockEditor.tsx`). Extend it to embeds | S |
| 2 | File explorer custom sort | 979 | Build: sort by name, date, manual | S |
| 3 | **Obsidian for web** | 949 | **We are a web app.** Not on Obsidian's roadmap | ships |
| 4 | Open links in a new tab by default | 907 | Build: modifier and setting; tabs already exist | S |
| 5 | Typed links and link metadata | 822 | Later |  |
| 6 | Mass tag add, rename, delete | 811 | Build: rename and merge in the tags panel | S |
| 7 | **Fully visual editor (WYSIWYG)** | 792 | **Live mode ships today** | ships |
| 8 | Nested YAML in properties | 790 | Later |  |
| 9 | Ignore accents in search and the switcher | 773 | Build: normalise before matching. Ours lowercases only (`fuzzy.ts`) | S |
| 10 | Use the H1 or a title property as the display name | 712 | Build: setting | S |
| 11 | IDE-style tab reuse and management | 671 | Tabs ship; add reuse and switch-to-open | S |
| 12 | Choose how dates display | 657 | Later |  |
| 13 | **Global search and replace** | 650 | Build. Obsidian still has none | M |
| 14 | Render block embeds inline | 554 | With request 1 | S |
| 15 | Reminders and notifications | 554 | Later |  |
| 16 | Open single .md files outside a vault | 550 | The desktop app opens a folder; add file association | S |
| 17 | One settings set across vaults | 520 | Settings live on the account, so this is ours by design | ships |
| 18 | Links to folders | 513 | Later |  |
| 19 | Drawing and pen support in Canvas | 509 | The drawing block covers drawing, not canvas | partial |
| 20 | PDF annotation | 498 | Later. On Obsidian's roadmap as Planned |  |
| 21 | Canvas links in the graph | 469 | Later |  |
| 22 | Switch off auto-save | 459 | Later |  |
| 23 | Sketching with a stylus | 434 | The drawing block | partial |
| 24 | Insert, rename, remove a property across files | 431 | Later | M |
| 25 | Nested tags in the graph | 396 | Later |  |
| 26 | Background sync on mobile | 363 | Our sync is server-side, so the phone syncs when it opens | ships |
| 27 | A default template for a new note | 362 | With templates | S |
| 28 | Definition lists | 357 | Later |  |
| 29 | Password-protect or encrypt a folder | 352 | Later. Already parked in the plan |  |
| 30 | Auto-update links when a heading is renamed | 351 | The link doctor is adjacent; add rename tracking | S |

**Score.** Of the 30 most-liked open requests, frontmatter would answer **16**: three of them
already ship (a web version, a visual editor, one settings set), eleven are small builds, one is
medium, and two are partly covered by the drawing block. Fourteen stay on the later list.

**The three that matter most for a switch.**
1. **A web version is their third most-liked request, at 949 hearts, and is absent from their published roadmap.** We are web-first.
2. **Editing an embedded note in place is their most-liked request at 1,078 hearts.** Our Live mode already edits any block on click, so this is an extension rather than a rewrite.
3. **Global search and replace, 650 hearts, still does not exist in Obsidian.** It is a medium build for us.

## Two more openings from Obsidian's own documentation

- **Sync conflicts.** Obsidian's help says markdown conflicts are merged with "Google's diff-match-patch algorithm" and that the result "may sometimes create duplicate text or formatting problems". Our rule is the opposite: compare versions, show both, never merge silently.
- **Collaboration.** "Multiplayer" ("Share notes and edit them collaboratively") sits on Obsidian's roadmap as Planned, not shipped. Sharing a vault today needs every collaborator to hold a Sync subscription, capped at 20 people. Our free tier includes one live collaborator.

## What Obsidian charges, for the comparison

Sync Standard is "$4" a month billed annually for "1 synced vault", "1 GB total storage",
"5 MB maximum file size" and "1 month version history". Sync Plus is "$8" for 10 GB and
"12 month version history". Publish is "$8" per site per month. A commercial licence is
"$50" per user per year, though the FAQ answers "No" to whether commercial use must be paid.

frontmatter Pro at ₹299 is about $3.12: below Sync Standard, with unlimited documents,
90-day history, 5 GB of uploads, publishing included and no separate commercial licence.
