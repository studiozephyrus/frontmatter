# Copy id reconciliation, 18 September 2026

**Working file.** The 38 screen specs in `docs/pack/12-screens/` and `docs/pack/16-COPY-DECK.md` were
written in parallel. On 18 September `docs/pack/tools/validate-pack.py` reported 403 `K` copy ids
cited with no row in the deck. This file records every one of them, what each was decided to be, and
where its string came from.

This file lives under `tools/`, so `validate-pack.py` does not read it and it carries no front
matter, the same as `error-reconciliation.md` beside it. It is kept as the audit trail.

## 1. What the screens cite and the deck lacked

Extracted by a script over `docs/pack/12-screens/S*.md` with the validator's own pattern,
`\bK\.[a-z0-9.]*[a-z0-9]`. `kind` is `family` when every occurrence of the token is followed by
`.*`, `.<` or `*`, meaning the screen wrote a namespace or a template (`K.s03.*`,
`K.s28.nav.<slug>`) rather than an id. `line` is the screen line quoted in `context`.

The tables below hold 404 rows for 403 distinct ids. `K.s06.untouched` is cited from S06 and S07 and
appears twice. `K.err` is cited only from `17-ERROR-AND-REFUSAL-CATALOGUE.md` lines 144 and 389, and
section 1.39 records it. So 402 distinct ids come from the screens, plus `K.err`, gives the
validator's 403.

### 1.1 S01, 10 missing

id | kind | line | context
`K.s01` | family | 23 | > is cited by that screen's id. Copy ids are namespaced K.s01.*, so they cannot collide.
`K.s01.busy` | id | 143 | K.s01.value.ship, K.s01.busy, K.s01.cancelled.
`K.s01.cancelled` | id | 143 | K.s01.value.ship, K.s01.busy, K.s01.cancelled.
`K.s01.fineprint` | id | 65 | Fine print / C017 / K.s01.fineprint and four links / .fine
`K.s01.heading` | id | 61 | Heading and promise / C013 / K.s01.heading, K.s01.promise / .lede
`K.s01.promise` | id | 61 | Heading and promise / C013 / K.s01.heading, K.s01.promise / .lede
`K.s01.providerlist` | id | 49 | Leave, provider list / K.s01.providerlist / the model-provider page / the page that makes the training promise checkable
`K.s01.value.decide` | id | 142 | K.s01.privacy, K.s01.terms, K.s01.providerlist, K.s01.value.write, K.s01.value.decide,
`K.s01.value.ship` | id | 143 | K.s01.value.ship, K.s01.busy, K.s01.cancelled.
`K.s01.value.write` | id | 142 | K.s01.privacy, K.s01.terms, K.s01.providerlist, K.s01.value.write, K.s01.value.decide,

### 1.2 S02, 7 missing

id | kind | line | context
`K.s02` | family | 23 | > is cited by that screen's id. Copy ids are namespaced K.s02.*, so they cannot collide.
`K.s02.desktop.note` | id | 144 | K.s02.desktop.note.
`K.s02.recent.head` | id | 143 | K.s02.start.template.sub, K.s02.recent.head, K.s02.empty, K.s02.caps, K.s02.search,
`K.s02.search` | id | 66 | Global search / C028 / K.s02.search with the Command K hint / .search, wider here than in the workspace
`K.s02.tab.documents` | id | 140 | K.s02.greeting, K.s02.tab.documents, K.s02.tab.ideas, K.s02.tab.shared, K.s02.start.blank,
`K.s02.tab.ideas` | id | 140 | K.s02.greeting, K.s02.tab.documents, K.s02.tab.ideas, K.s02.tab.shared, K.s02.start.blank,
`K.s02.tab.shared` | id | 140 | K.s02.greeting, K.s02.tab.documents, K.s02.tab.ideas, K.s02.tab.shared, K.s02.start.blank,

### 1.3 S03, 18 missing

id | kind | line | context
`K.s03` | family | 23 | > is cited by that screen's id. Copy ids are namespaced K.s03.*, so they cannot collide.
`K.s03.empty.documents` | id | 147 | K.s03.row.trash, K.s03.empty.documents, K.s03.empty.shared, K.s03.offline,
`K.s03.empty.shared` | id | 147 | K.s03.row.trash, K.s03.empty.documents, K.s03.empty.shared, K.s03.offline,
`K.s03.greeting` | id | 58 | Greeting row / C030 / K.s03.greeting, then the usage pill on the right / .hh
`K.s03.noproject` | id | 148 | K.s03.noproject.
`K.s03.offline` | id | 147 | K.s03.row.trash, K.s03.empty.documents, K.s03.empty.shared, K.s03.offline,
`K.s03.recent.head.name` | id | 145 | K.s03.recent.head.name, K.s03.recent.head.project, K.s03.recent.head.opened,
`K.s03.recent.head.opened` | id | 145 | K.s03.recent.head.name, K.s03.recent.head.project, K.s03.recent.head.opened,
`K.s03.recent.head.owner` | id | 146 | K.s03.recent.head.owner, K.s03.row.rename, K.s03.row.duplicate, K.s03.row.export,
`K.s03.recent.head.project` | id | 145 | K.s03.recent.head.name, K.s03.recent.head.project, K.s03.recent.head.opened,
`K.s03.row.duplicate` | id | 146 | K.s03.recent.head.owner, K.s03.row.rename, K.s03.row.duplicate, K.s03.row.export,
`K.s03.row.export` | id | 146 | K.s03.recent.head.owner, K.s03.row.rename, K.s03.row.duplicate, K.s03.row.export,
`K.s03.row.rename` | id | 146 | K.s03.recent.head.owner, K.s03.row.rename, K.s03.row.duplicate, K.s03.row.export,
`K.s03.row.trash` | id | 147 | K.s03.row.trash, K.s03.empty.documents, K.s03.empty.shared, K.s03.offline,
`K.s03.tab.documents` | id | 144 | K.s03.greeting, K.s03.usage, K.s03.tab.documents, K.s03.tab.ideas, K.s03.tab.shared,
`K.s03.tab.ideas` | id | 144 | K.s03.greeting, K.s03.usage, K.s03.tab.documents, K.s03.tab.ideas, K.s03.tab.shared,
`K.s03.tab.shared` | id | 144 | K.s03.greeting, K.s03.usage, K.s03.tab.documents, K.s03.tab.ideas, K.s03.tab.shared,
`K.s03.usage` | id | 144 | K.s03.greeting, K.s03.usage, K.s03.tab.documents, K.s03.tab.ideas, K.s03.tab.shared,

### 1.4 S04, 20 missing

id | kind | line | context
`K.s04` | family | 23 | > is cited by that screen's id. Copy ids are namespaced K.s04.*, so they cannot collide.
`K.s04.addfile.importfrom` | id | 216 | K.s04.addfile.uploadfiles, K.s04.addfile.uploadfolder, K.s04.addfile.importfrom,
`K.s04.addfile.uploadfiles` | id | 216 | K.s04.addfile.uploadfiles, K.s04.addfile.uploadfolder, K.s04.addfile.importfrom,
`K.s04.addfile.uploadfolder` | id | 216 | K.s04.addfile.uploadfiles, K.s04.addfile.uploadfolder, K.s04.addfile.importfrom,
`K.s04.aiedit` | id | 219 | K.s04.aiedit, K.s04.credits, K.s04.newtab, K.s04.closedirty, K.s04.offline,
`K.s04.closedirty` | id | 219 | K.s04.aiedit, K.s04.credits, K.s04.newtab, K.s04.closedirty, K.s04.offline,
`K.s04.credits` | id | 219 | K.s04.aiedit, K.s04.credits, K.s04.newtab, K.s04.closedirty, K.s04.offline,
`K.s04.ideas` | id | 217 | K.s04.addidea, K.s04.ideas, K.s04.drophint, K.s04.sync, K.s04.saved, K.s04.rail.tags,
`K.s04.newtab` | id | 219 | K.s04.aiedit, K.s04.credits, K.s04.newtab, K.s04.closedirty, K.s04.offline,
`K.s04.offline` | id | 219 | K.s04.aiedit, K.s04.credits, K.s04.newtab, K.s04.closedirty, K.s04.offline,
`K.s04.rail.backlinks` | id | 218 | K.s04.rail.backlinks, K.s04.rail.history, K.s04.rail.comments, K.s04.rail.outline,
`K.s04.rail.comments` | id | 218 | K.s04.rail.backlinks, K.s04.rail.history, K.s04.rail.comments, K.s04.rail.outline,
`K.s04.rail.history` | id | 218 | K.s04.rail.backlinks, K.s04.rail.history, K.s04.rail.comments, K.s04.rail.outline,
`K.s04.rail.outline` | id | 218 | K.s04.rail.backlinks, K.s04.rail.history, K.s04.rail.comments, K.s04.rail.outline,
`K.s04.rail.tags` | id | 217 | K.s04.addidea, K.s04.ideas, K.s04.drophint, K.s04.sync, K.s04.saved, K.s04.rail.tags,
`K.s04.saved` | id | 217 | K.s04.addidea, K.s04.ideas, K.s04.drophint, K.s04.sync, K.s04.saved, K.s04.rail.tags,
`K.s04.share` | id | 222 | K.s04.share is a title attribute and an accessible name, not a visible label. The control is an
`K.s04.sync` | id | 217 | K.s04.addidea, K.s04.ideas, K.s04.drophint, K.s04.sync, K.s04.saved, K.s04.rail.tags,
`K.s04.tree.addproject` | id | 215 | K.s04.tree.head, K.s04.tree.addproject, K.s04.addfile, K.s04.addfile.new,
`K.s04.tree.head` | id | 215 | K.s04.tree.head, K.s04.tree.addproject, K.s04.addfile, K.s04.addfile.new,

### 1.5 S05, 11 missing

id | kind | line | context
`K.s05` | family | 23 | > is cited by that screen's id. Copy ids are namespaced K.s05.*, so they cannot collide.
`K.s05.comment.reply` | id | 197 | K.s05.face.system, K.s05.size, K.s05.more, K.s05.suggesting, K.s05.comment.reply,
`K.s05.face.googlesans` | id | 196 | K.s05.toast, K.s05.style, K.s05.face.googlesans, K.s05.face.serif, K.s05.face.mono,
`K.s05.face.mono` | id | 196 | K.s05.toast, K.s05.style, K.s05.face.googlesans, K.s05.face.serif, K.s05.face.mono,
`K.s05.face.serif` | id | 196 | K.s05.toast, K.s05.style, K.s05.face.googlesans, K.s05.face.serif, K.s05.face.mono,
`K.s05.face.system` | id | 197 | K.s05.face.system, K.s05.size, K.s05.more, K.s05.suggesting, K.s05.comment.reply,
`K.s05.nocarrier` | id | 198 | K.s05.properties.head, K.s05.properties.invalid, K.s05.readonly, K.s05.nocarrier.
`K.s05.properties.head` | id | 198 | K.s05.properties.head, K.s05.properties.invalid, K.s05.readonly, K.s05.nocarrier.
`K.s05.properties.invalid` | id | 198 | K.s05.properties.head, K.s05.properties.invalid, K.s05.readonly, K.s05.nocarrier.
`K.s05.readonly` | id | 198 | K.s05.properties.head, K.s05.properties.invalid, K.s05.readonly, K.s05.nocarrier.
`K.s05.size` | id | 197 | K.s05.face.system, K.s05.size, K.s05.more, K.s05.suggesting, K.s05.comment.reply,

### 1.6 S06, 20 missing

id | kind | line | context
`K.s06` | family | 24 | > Copy ids are namespaced K.s06.*, so they cannot collide.
`K.s06.accept` | id | 186 | K.s06.accept, K.s06.reject, K.s06.untouched, K.s06.firstrun, K.s06.provider.
`K.s06.change` | id | 183 | K.s06.change, K.s06.placeholder, K.s06.send, K.s06.chip.onedoc, K.s06.chip.toideas,
`K.s06.chip.cleanpaste` | id | 184 | K.s06.chip.cleanpaste, K.s06.chip.plannotes, K.s06.startfrom.label, K.s06.startfrom.github,
`K.s06.chip.onedoc` | id | 183 | K.s06.change, K.s06.placeholder, K.s06.send, K.s06.chip.onedoc, K.s06.chip.toideas,
`K.s06.chip.plannotes` | id | 184 | K.s06.chip.cleanpaste, K.s06.chip.plannotes, K.s06.startfrom.label, K.s06.startfrom.github,
`K.s06.chip.toideas` | id | 183 | K.s06.change, K.s06.placeholder, K.s06.send, K.s06.chip.onedoc, K.s06.chip.toideas,
`K.s06.firstrun` | id | 186 | K.s06.accept, K.s06.reject, K.s06.untouched, K.s06.firstrun, K.s06.provider.
`K.s06.getmore` | id | 185 | K.s06.startfrom.drop, K.s06.startfrom.template, K.s06.cost, K.s06.getmore,
`K.s06.provider` | id | 186 | K.s06.accept, K.s06.reject, K.s06.untouched, K.s06.firstrun, K.s06.provider.
`K.s06.reject` | id | 186 | K.s06.accept, K.s06.reject, K.s06.untouched, K.s06.firstrun, K.s06.provider.
`K.s06.send` | id | 183 | K.s06.change, K.s06.placeholder, K.s06.send, K.s06.chip.onedoc, K.s06.chip.toideas,
`K.s06.startfrom.drop` | id | 185 | K.s06.startfrom.drop, K.s06.startfrom.template, K.s06.cost, K.s06.getmore,
`K.s06.startfrom.github` | id | 184 | K.s06.chip.cleanpaste, K.s06.chip.plannotes, K.s06.startfrom.label, K.s06.startfrom.github,
`K.s06.startfrom.label` | id | 184 | K.s06.chip.cleanpaste, K.s06.chip.plannotes, K.s06.startfrom.label, K.s06.startfrom.github,
`K.s06.startfrom.template` | id | 185 | K.s06.startfrom.drop, K.s06.startfrom.template, K.s06.cost, K.s06.getmore,
`K.s06.target.editing` | id | 182 | K.s06.target.writing, K.s06.target.editing, K.s06.target.idea, K.s06.target.range,
`K.s06.target.range` | id | 182 | K.s06.target.writing, K.s06.target.editing, K.s06.target.idea, K.s06.target.range,
`K.s06.target.writing` | id | 182 | K.s06.target.writing, K.s06.target.editing, K.s06.target.idea, K.s06.target.range,
`K.s06.untouched` | id | 188 | K.s06.untouched is reused by every failure state and by S32, so it is written once and says the

### 1.7 S07, 22 missing

id | kind | line | context
`K.s06.untouched` | id | 157 | K.s06.untouched is reused here rather than duplicated, so the sentence about the document being
`K.s07` | family | 24 | > Copy ids are namespaced K.s07.*, so they cannot collide.
`K.s07.accept` | id | 154 | K.s07.verb.links, K.s07.verb.links.sub, K.s07.foot, K.s07.accept, K.s07.reject,
`K.s07.foot` | id | 154 | K.s07.verb.links, K.s07.verb.links.sub, K.s07.foot, K.s07.accept, K.s07.reject,
`K.s07.refused` | id | 155 | K.s07.unchanged, K.s07.refused, K.s07.suggesting, K.s06.untouched.
`K.s07.reject` | id | 154 | K.s07.verb.links, K.s07.verb.links.sub, K.s07.foot, K.s07.accept, K.s07.reject,
`K.s07.suggesting` | id | 155 | K.s07.unchanged, K.s07.refused, K.s07.suggesting, K.s06.untouched.
`K.s07.unchanged` | id | 155 | K.s07.unchanged, K.s07.refused, K.s07.suggesting, K.s06.untouched.
`K.s07.verb.callout` | id | 153 | K.s07.verb.translate, K.s07.verb.translate.sub, K.s07.verb.callout, K.s07.verb.callout.sub,
`K.s07.verb.callout.sub` | id | 153 | K.s07.verb.translate, K.s07.verb.translate.sub, K.s07.verb.callout, K.s07.verb.callout.sub,
`K.s07.verb.expand` | id | 151 | K.s07.verb.refine, K.s07.verb.refine.sub, K.s07.verb.expand, K.s07.verb.expand.sub,
`K.s07.verb.expand.sub` | id | 151 | K.s07.verb.refine, K.s07.verb.refine.sub, K.s07.verb.expand, K.s07.verb.expand.sub,
`K.s07.verb.links` | id | 154 | K.s07.verb.links, K.s07.verb.links.sub, K.s07.foot, K.s07.accept, K.s07.reject,
`K.s07.verb.links.sub` | id | 154 | K.s07.verb.links, K.s07.verb.links.sub, K.s07.foot, K.s07.accept, K.s07.reject,
`K.s07.verb.refine` | id | 151 | K.s07.verb.refine, K.s07.verb.refine.sub, K.s07.verb.expand, K.s07.verb.expand.sub,
`K.s07.verb.refine.sub` | id | 151 | K.s07.verb.refine, K.s07.verb.refine.sub, K.s07.verb.expand, K.s07.verb.expand.sub,
`K.s07.verb.shorten` | id | 152 | K.s07.verb.shorten, K.s07.verb.shorten.sub, K.s07.verb.tone, K.s07.verb.tone.sub,
`K.s07.verb.shorten.sub` | id | 152 | K.s07.verb.shorten, K.s07.verb.shorten.sub, K.s07.verb.tone, K.s07.verb.tone.sub,
`K.s07.verb.tone` | id | 152 | K.s07.verb.shorten, K.s07.verb.shorten.sub, K.s07.verb.tone, K.s07.verb.tone.sub,
`K.s07.verb.tone.sub` | id | 152 | K.s07.verb.shorten, K.s07.verb.shorten.sub, K.s07.verb.tone, K.s07.verb.tone.sub,
`K.s07.verb.translate` | id | 153 | K.s07.verb.translate, K.s07.verb.translate.sub, K.s07.verb.callout, K.s07.verb.callout.sub,
`K.s07.verb.translate.sub` | id | 153 | K.s07.verb.translate, K.s07.verb.translate.sub, K.s07.verb.callout, K.s07.verb.callout.sub,

### 1.8 S08, 12 missing

id | kind | line | context
`K.s08` | family | 24 | > Copy ids are namespaced K.s08.*, so they cannot collide.
`K.s08.callout.unknown` | id | 150 | K.s08.chart.kind, K.s08.mermaid.failed, K.s08.maths.failed, K.s08.callout.unknown,
`K.s08.chart.kind` | id | 150 | K.s08.chart.kind, K.s08.mermaid.failed, K.s08.maths.failed, K.s08.callout.unknown,
`K.s08.chart.nonumbers` | id | 149 | K.s08.elsewhere, K.s08.table.folded, K.s08.chart.notable, K.s08.chart.nonumbers,
`K.s08.chart.notable` | id | 149 | K.s08.elsewhere, K.s08.table.folded, K.s08.chart.notable, K.s08.chart.nonumbers,
`K.s08.drawing.missing` | id | 151 | K.s08.fence.unclosed, K.s08.drawing.missing, K.s08.table.shape, K.s08.gutter.
`K.s08.fence.unclosed` | id | 151 | K.s08.fence.unclosed, K.s08.drawing.missing, K.s08.table.shape, K.s08.gutter.
`K.s08.gutter` | id | 151 | K.s08.fence.unclosed, K.s08.drawing.missing, K.s08.table.shape, K.s08.gutter.
`K.s08.maths.failed` | id | 150 | K.s08.chart.kind, K.s08.mermaid.failed, K.s08.maths.failed, K.s08.callout.unknown,
`K.s08.mermaid.failed` | id | 150 | K.s08.chart.kind, K.s08.mermaid.failed, K.s08.maths.failed, K.s08.callout.unknown,
`K.s08.table.folded` | id | 149 | K.s08.elsewhere, K.s08.table.folded, K.s08.chart.notable, K.s08.chart.nonumbers,
`K.s08.table.shape` | id | 151 | K.s08.fence.unclosed, K.s08.drawing.missing, K.s08.table.shape, K.s08.gutter.

### 1.9 S09, 8 missing

id | kind | line | context
`K.s09` | family | 26 | > Copy ids are namespaced K.s09.*, so they cannot collide.
`K.s09.badref` | id | 150 | K.s09.badref, K.s09.notatthiswidth.
`K.s09.convention` | id | 148 | K.s09.view.kanban, K.s09.view.outline, and a .sub for each, K.s09.convention,
`K.s09.counts` | id | 149 | K.s09.legend, K.s09.counts, K.s09.nophases, K.s09.orphanstep, K.s09.toolarge,
`K.s09.nophases` | id | 149 | K.s09.legend, K.s09.counts, K.s09.nophases, K.s09.orphanstep, K.s09.toolarge,
`K.s09.notatthiswidth` | id | 150 | K.s09.badref, K.s09.notatthiswidth.
`K.s09.orphanstep` | id | 149 | K.s09.legend, K.s09.counts, K.s09.nophases, K.s09.orphanstep, K.s09.toolarge,
`K.s09.toolarge` | id | 149 | K.s09.legend, K.s09.counts, K.s09.nophases, K.s09.orphanstep, K.s09.toolarge,

### 1.10 S10, 16 missing

id | kind | line | context
`K.s10` | family | 24 | > Copy ids are namespaced K.s10.*, so they cannot collide.
`K.s10.adddictionary` | id | 188 | K.s10.writing.longsentence, K.s10.adddictionary, K.s10.offline.writing,
`K.s10.check.brokenlink` | id | 186 | K.s10.clean, K.s10.check.brokenlink, K.s10.check.headingskip, K.s10.check.noalt,
`K.s10.check.failed` | id | 189 | K.s10.check.failed.
`K.s10.check.frontmatter` | id | 187 | K.s10.check.tableshape, K.s10.check.spelling, K.s10.check.frontmatter,
`K.s10.check.headingskip` | id | 186 | K.s10.clean, K.s10.check.brokenlink, K.s10.check.headingskip, K.s10.check.noalt,
`K.s10.check.noalt` | id | 186 | K.s10.clean, K.s10.check.brokenlink, K.s10.check.headingskip, K.s10.check.noalt,
`K.s10.check.spelling` | id | 187 | K.s10.check.tableshape, K.s10.check.spelling, K.s10.check.frontmatter,
`K.s10.check.tableshape` | id | 187 | K.s10.check.tableshape, K.s10.check.spelling, K.s10.check.frontmatter,
`K.s10.clean` | id | 186 | K.s10.clean, K.s10.check.brokenlink, K.s10.check.headingskip, K.s10.check.noalt,
`K.s10.costnote` | id | 191 | K.s10.costnote is the sales line. It says the structural checks run on the device and cost
`K.s10.fixallsafe` | id | 185 | K.s10.fixallsafe, K.s10.fixallsafe.count, K.s10.fixallsafe.none, K.s10.rules,
`K.s10.fixallsafe.count` | id | 185 | K.s10.fixallsafe, K.s10.fixallsafe.count, K.s10.fixallsafe.none, K.s10.rules,
`K.s10.fixallsafe.none` | id | 185 | K.s10.fixallsafe, K.s10.fixallsafe.count, K.s10.fixallsafe.none, K.s10.rules,
`K.s10.offline.writing` | id | 188 | K.s10.writing.longsentence, K.s10.adddictionary, K.s10.offline.writing,
`K.s10.writing.longsentence` | id | 188 | K.s10.writing.longsentence, K.s10.adddictionary, K.s10.offline.writing,

### 1.11 S11, 18 missing

id | kind | line | context
`K.s11` | family | 25 | > Copy ids are namespaced K.s11.*, so they cannot collide.
`K.s11.capunknown` | id | 180 | K.s11.tidy.cost, K.s11.capunknown, K.s11.orphan.
`K.s11.check.lintduplicate` | id | 179 | K.s11.check.unverified, K.s11.check.lintduplicate, K.s11.honesty, K.s11.tidy,
`K.s11.check.setup` | id | 178 | K.s11.regenerate, K.s11.regenerate.confirm, K.s11.check.size, K.s11.check.setup,
`K.s11.check.size` | id | 178 | K.s11.regenerate, K.s11.regenerate.confirm, K.s11.check.size, K.s11.check.setup,
`K.s11.check.unverified` | id | 179 | K.s11.check.unverified, K.s11.check.lintduplicate, K.s11.honesty, K.s11.tidy,
`K.s11.drift.head` | id | 177 | K.s11.rel.missing, K.s11.addimport, K.s11.drift.head, K.s11.drift.why, K.s11.diff,
`K.s11.head` | id | 175 | K.s11.head, K.s11.filter.all, K.s11.filter.linked, K.s11.filter.copies,
`K.s11.honesty` | id | 182 | **K.s11.honesty is the one string on this screen that cannot be cut for space.** It says the
`K.s11.orphan` | id | 180 | K.s11.tidy.cost, K.s11.capunknown, K.s11.orphan.
`K.s11.regenerate` | id | 178 | K.s11.regenerate, K.s11.regenerate.confirm, K.s11.check.size, K.s11.check.setup,
`K.s11.regenerate.confirm` | id | 178 | K.s11.regenerate, K.s11.regenerate.confirm, K.s11.check.size, K.s11.check.setup,
`K.s11.rel.copy` | id | 176 | K.s11.rel.source, K.s11.rel.import, K.s11.rel.copy, K.s11.rel.copydrifted,
`K.s11.rel.copydrifted` | id | 176 | K.s11.rel.source, K.s11.rel.import, K.s11.rel.copy, K.s11.rel.copydrifted,
`K.s11.rel.import` | id | 176 | K.s11.rel.source, K.s11.rel.import, K.s11.rel.copy, K.s11.rel.copydrifted,
`K.s11.rel.missing` | id | 177 | K.s11.rel.missing, K.s11.addimport, K.s11.drift.head, K.s11.drift.why, K.s11.diff,
`K.s11.rel.source` | id | 176 | K.s11.rel.source, K.s11.rel.import, K.s11.rel.copy, K.s11.rel.copydrifted,
`K.s11.tidy.cost` | id | 180 | K.s11.tidy.cost, K.s11.capunknown, K.s11.orphan.

### 1.12 S12, 18 missing

id | kind | line | context
`K.s12` | family | 25 | > Copy ids are namespaced K.s12.*, so they cannot collide.
`K.s12.attach.document` | id | 172 | K.s12.depth.suffix, K.s12.attach.drawing, K.s12.attach.document, K.s12.attach.repo,
`K.s12.attach.drawing` | id | 172 | K.s12.depth.suffix, K.s12.attach.drawing, K.s12.attach.document, K.s12.attach.repo,
`K.s12.attach.used` | id | 173 | K.s12.attach.used, K.s12.templates.label, K.s12.template.localservice, K.s12.template.saas,
`K.s12.credits` | id | 175 | K.s12.cost, K.s12.credits, K.s12.state.draft, K.s12.state.answered,
`K.s12.depth.suffix` | id | 172 | K.s12.depth.suffix, K.s12.attach.drawing, K.s12.attach.document, K.s12.attach.repo,
`K.s12.head.sub` | id | 170 | K.s12.head, K.s12.head.sub, K.s12.placeholder, K.s12.depth.low, K.s12.depth.low.sub,
`K.s12.placeholder` | id | 170 | K.s12.head, K.s12.head.sub, K.s12.placeholder, K.s12.depth.low, K.s12.depth.low.sub,
`K.s12.send` | id | 176 | K.s12.state.blueprint, K.s12.send.
`K.s12.state.answered` | id | 175 | K.s12.cost, K.s12.credits, K.s12.state.draft, K.s12.state.answered,
`K.s12.state.blueprint` | id | 176 | K.s12.state.blueprint, K.s12.send.
`K.s12.state.draft` | id | 175 | K.s12.cost, K.s12.credits, K.s12.state.draft, K.s12.state.answered,
`K.s12.template.generate` | id | 174 | K.s12.template.marketplace, K.s12.template.internal, K.s12.template.generate,
`K.s12.template.internal` | id | 174 | K.s12.template.marketplace, K.s12.template.internal, K.s12.template.generate,
`K.s12.template.localservice` | id | 173 | K.s12.attach.used, K.s12.templates.label, K.s12.template.localservice, K.s12.template.saas,
`K.s12.template.marketplace` | id | 174 | K.s12.template.marketplace, K.s12.template.internal, K.s12.template.generate,
`K.s12.template.saas` | id | 173 | K.s12.attach.used, K.s12.templates.label, K.s12.template.localservice, K.s12.template.saas,
`K.s12.templates.label` | id | 173 | K.s12.attach.used, K.s12.templates.label, K.s12.template.localservice, K.s12.template.saas,

### 1.13 S13, 17 missing

id | kind | line | context
`K.s13` | family | 24 | > here. C120 and C121 are S12's. Copy ids are namespaced K.s13.*, so they cannot collide.
`K.s13.files.beforecredit` | id | 229 | K.s13.standardset, K.s13.standardset.why, K.s13.files.head, K.s13.files.beforecredit.
`K.s13.files.head` | id | 229 | K.s13.standardset, K.s13.standardset.why, K.s13.files.head, K.s13.files.beforecredit.
`K.s13.progress.count` | id | 225 | K.s13.progress.page, K.s13.progress.count, K.s13.skip, K.s13.recommendation,
`K.s13.progress.page` | id | 225 | K.s13.progress.page, K.s13.progress.count, K.s13.skip, K.s13.recommendation,
`K.s13.rec.tag` | id | 226 | K.s13.skipall, K.s13.next, K.s13.rec.tag, K.s13.notsure, K.s13.foot,
`K.s13.recommendation` | id | 225 | K.s13.progress.page, K.s13.progress.count, K.s13.skip, K.s13.recommendation,
`K.s13.rewrite.capped` | id | 227 | K.s13.rewrite.working, K.s13.rewrite.cause, K.s13.rewrite.capped, K.s13.rewrite.failed,
`K.s13.rewrite.cause` | id | 233 | - K.s13.rewrite.cause names the answer, so it is a template with the answer substituted, never a
`K.s13.rewrite.failed` | id | 227 | K.s13.rewrite.working, K.s13.rewrite.cause, K.s13.rewrite.capped, K.s13.rewrite.failed,
`K.s13.rewrite.working` | id | 227 | K.s13.rewrite.working, K.s13.rewrite.cause, K.s13.rewrite.capped, K.s13.rewrite.failed,
`K.s13.skipall.confirm` | id | 228 | K.s13.skipall.line1, K.s13.skipall.line2, K.s13.skipall.line3, K.s13.skipall.confirm,
`K.s13.skipall.line1` | id | 228 | K.s13.skipall.line1, K.s13.skipall.line2, K.s13.skipall.line3, K.s13.skipall.confirm,
`K.s13.skipall.line2` | id | 228 | K.s13.skipall.line1, K.s13.skipall.line2, K.s13.skipall.line3, K.s13.skipall.confirm,
`K.s13.skipall.line3` | id | 228 | K.s13.skipall.line1, K.s13.skipall.line2, K.s13.skipall.line3, K.s13.skipall.confirm,
`K.s13.standardset` | id | 229 | K.s13.standardset, K.s13.standardset.why, K.s13.files.head, K.s13.files.beforecredit.
`K.s13.standardset.why` | id | 229 | K.s13.standardset, K.s13.standardset.why, K.s13.files.head, K.s13.files.beforecredit.

### 1.14 S14, 2 missing

id | kind | line | context
`K.s14.researchdone` | id | 168 | K.s14.researchdone / The notice when a background High research pass finishes
`K.s14.src.opened` | id | 167 | K.s14.src.opened / The attribution on a High row, naming the page opened and the date it was opened

### 1.15 S15, 3 missing

id | kind | line | context
`K.s15.checknotrun` | id | 152 | K.s15.checknotrun / The third state of the pill, for a consistency check that did not run
`K.s15.kickoff.copied` | id | 154 | K.s15.kickoff.copied / The confirmation after the prompt is copied
`K.s15.revoked` | id | 153 | K.s15.revoked / What a reader meets on a revoked link

### 1.16 S16, 2 missing

id | kind | line | context
`K.s16.node.kind` | id | 147 | K.s16.node.kind / The four kind names, used as accessible names on the nodes
`K.s16.stale` | id | 148 | K.s16.stale / The marker on a graph kept from before a failed rebuild

### 1.17 S17, 3 missing

id | kind | line | context
`K.s17.invite.sent` | id | 182 | K.s17.invite.sent / The confirmation, and that the credits land at the invited person's first sign-in
`K.s17.lookup.failed` | id | 184 | K.s17.lookup.failed / That the account check could not run, and the invite is offered anyway
`K.s17.referral.title` | id | 183 | K.s17.referral.title / The heading when the same block is opened as a referral

### 1.18 S18, 2 missing

id | kind | line | context
`K.s18.empty` | id | 184 | K.s18.empty / What a published document with no body says
`K.s18.notfound` | id | 183 | K.s18.notfound / What an unpublished slug says, on the page and as plain text on the other routes

### 1.19 S19, 5 missing

id | kind | line | context
`K.s19.dropped` | id | 151 | K.s19.dropped / What is shown when the session drops and the editor falls back to a plain edit.
`K.s19.highlight` | id | 150 | K.s19.highlight / The one-line explanation of what the landed-text highlight means, on a first run.
`K.s19.queued` | id | 152 | K.s19.queued / That offline edits are queued and will sync.
`K.s19.slow` | id | 149 | K.s19.slow / The slow marker on the live pill when the round trip is long enough to feel.
`K.s19.unshared` | id | 153 | K.s19.unshared / What is shown when access is removed under an open session.

### 1.20 S20, 4 missing

id | kind | line | context
`K.s20.confirm.bulk` | id | 185 | K.s20.confirm.bulk / The confirmation before a bulk accept, carrying the name and the exact count.
`K.s20.firstrun` | id | 183 | K.s20.firstrun / That nothing is applied to the file until it is accepted.
`K.s20.readonly` | id | 186 | K.s20.readonly / Why accept is absent for a role that may not apply changes.
`K.s20.stale` | id | 184 | K.s20.stale / The marker on an item whose span can no longer be placed.

### 1.21 S21, 4 missing

id | kind | line | context
`K.s21.outofwindow` | id | 146 | K.s21.outofwindow / That older versions are outside the window, and not that they are deleted.
`K.s21.redrawn` | id | 148 | K.s21.redrawn / That the diff was redrawn because the document changed underneath.
`K.s21.restored` | id | 147 | K.s21.restored / The confirmation after a restore, saying the old bytes were written forward.
`K.s21.window.end` | id | 145 | K.s21.window.end / The line at the end of the list saying how far back this plan keeps versions.

### 1.22 S22, 3 missing

id | kind | line | context
`K.s22.cancelled` | id | 190 | K.s22.cancelled / What a cancelled run kept.
`K.s22.collision` | id | 189 | K.s22.collision / That a matching path kept both files, and which one was suffixed.
`K.s22.nofolderinput` | id | 188 | K.s22.nofolderinput / What a browser with no directory input is offered instead.

### 1.23 S23, 4 missing

id | kind | line | context
`K.s23.drive.connect` | id | 190 | K.s23.drive.connect / The connect control on a Drive card that is not yet connected.
`K.s23.drive.paused` | id | 191 | K.s23.drive.paused / The status pill on a paused connection, and what paused means.
`K.s23.gh.revoked` | id | 192 | K.s23.gh.revoked / What the card says when the installation was removed at GitHub.
`K.s23.lastknown` | id | 193 | K.s23.lastknown / That the state shown is the last known one, because there is no connection.

### 1.24 S24, 3 missing

id | kind | line | context
`K.s24.persist.refused` | id | 150 | K.s24.persist.refused / That the browser would not promise to keep this origin's storage, in one line.
`K.s24.storage.full` | id | 149 | K.s24.storage.full / That keystrokes are no longer being kept, and what to do, shown at once.
`K.s24.storage.low` | id | 151 | K.s24.storage.low / How little local room is left, as a quiet line in the banner.

### 1.25 S25, 4 missing

id | kind | line | context
`K.s25.addfolder` | id | 161 | K.s25.addfolder / The offer to add a folder on a first launch.
`K.s25.group.cloud` | id | 162 | K.s25.group.cloud / The label on a cloud group in the unified tree.
`K.s25.group.local` | id | 163 | K.s25.group.local / The label on a local group, carrying its path.
`K.s25.update.refused` | id | 164 | K.s25.update.refused / That an update whose signature did not verify was refused.

### 1.26 S26, 5 missing

id | kind | line | context
`K.s26.append.failed` | id | 163 | K.s26.append.failed / That the append failed and the text is still here.
`K.s26.ios.absent` | id | 162 | K.s26.ios.absent / That iOS has no share sheet for a web application, in plain words.
`K.s26.queued` | id | 160 | K.s26.queued / That a capture was saved locally and will sync.
`K.s26.shortcut.taken` | id | 161 | K.s26.shortcut.taken / That the global chord is claimed by something else, naming the chord.
`K.s26.source` | id | 159 | K.s26.source / Where the shared text came from, and when.

### 1.27 S27, 8 missing

id | kind | line | context
`K.s27` | family | 21 | > E279 and A270 to A279. Copy ids are namespaced K.s27.*. Decision ids across S27 to S38
`K.s27.appearance.dark` | id | 111 | K.s27.appearance.dark / The third choice
`K.s27.appearance.heading` | id | 108 | K.s27.appearance.heading / The Appearance section heading on S28
`K.s27.appearance.help` | id | 112 | K.s27.appearance.help / The line under the three, saying the choice follows the account to every device
`K.s27.appearance.light` | id | 110 | K.s27.appearance.light / The second choice
`K.s27.appearance.system` | id | 109 | K.s27.appearance.system / The first of the three choices, the one that follows the operating system
`K.s27.toggledark` | id | 107 | K.s27.toggledark / The same when the dark theme would be the result
`K.s27.togglelight` | id | 106 | K.s27.togglelight / The button's label and tooltip when the light theme would be the result

### 1.28 S28, 19 missing

id | kind | line | context
`K.s28` | family | 21 | > E289 and A280 to A289. Copy ids are namespaced K.s28.*. Decision ids across S27 to S38
`K.s28.account.delete` | id | 169 | K.s28.account.delete / The delete control, and the sentence naming the 30-day window
`K.s28.account.signedin` | id | 167 | K.s28.account.signedin / The signed-in line on the phone footer
`K.s28.account.signout` | id | 168 | K.s28.account.signout / The sign-out control
`K.s28.ai.ghost` | id | 165 | K.s28.ai.ghost / Label and help, which says this one sends as you type and is off by default
`K.s28.ai.mark` | id | 166 | K.s28.ai.mark / Label and help for marking AI text in the version record
`K.s28.ai.model` | id | 163 | K.s28.ai.model / Label and help for the model choice, and what Automatic means on each plan
`K.s28.ai.selection` | id | 164 | K.s28.ai.selection / Label and help, which says exactly what is sent and when
`K.s28.degraded` | id | 171 | K.s28.degraded / The single line shown when writes are failing
`K.s28.editor.defaultmode` | id | 156 | K.s28.editor.defaultmode / Label and help for the default opening mode
`K.s28.editor.docdefault` | id | 157 | K.s28.editor.docdefault / Label and help for Doc mode by default in Live
`K.s28.editor.linewidth` | id | 158 | K.s28.editor.linewidth / Label and help for the characters-per-line choice
`K.s28.editor.spellcheck` | id | 159 | K.s28.editor.spellcheck / Label and help, which says whose spellchecker it is and where the text goes
`K.s28.editor.vim` | id | 160 | K.s28.editor.vim / Label and help for modal editing
`K.s28.nav` | family | 155 | K.s28.nav.<slug> / Ten strings, one per section name, matching the slugs above
`K.s28.offline` | id | 170 | K.s28.offline / The line shown on a row that needs the network
`K.s28.sub` | id | 154 | K.s28.sub / The line under it, that settings live on the account and nothing needs a restart
`K.s28.writing.plain` | id | 162 | K.s28.writing.plain / Label and help for the plain-language notes, which says they never block
`K.s28.writing.structural` | id | 161 | K.s28.writing.structural / Label and help for the structural checks

### 1.29 S29, 19 missing

id | kind | line | context
`K.s29` | family | 21 | > E299 and A290 to A299. Copy ids are namespaced K.s29.*. Decision ids across S27 to S38
`K.s29.meter.blueprints` | id | 139 | K.s29.meter.blueprints / The blueprints meter, including the depth it is limited to
`K.s29.pastdue` | id | 155 | K.s29.pastdue / The line shown when a mandate has failed
`K.s29.payment.cancel` | id | 151 | K.s29.payment.cancel / The cancel-any-time line
`K.s29.payment.methods` | id | 150 | K.s29.payment.methods / The methods line
`K.s29.payment.topups` | id | 152 | K.s29.payment.topups / The two top-up offers
`K.s29.pending` | id | 156 | K.s29.pending / The line shown while a payment is being confirmed
`K.s29.plan.free.current` | id | 143 | K.s29.plan.free.current / The control on the current plan, which is a state rather than an action
`K.s29.plan.free.excludes` | id | 145 | K.s29.plan.free.excludes / The one line naming what Free does not have
`K.s29.plan.free.includes` | id | 144 | K.s29.plan.free.includes / The list of what Free includes
`K.s29.plan.free.name` | id | 142 | K.s29.plan.free.name / The Free plan name
`K.s29.plan.pro.cta` | id | 149 | K.s29.plan.pro.cta / The upgrade control
`K.s29.plan.pro.includes` | id | 148 | K.s29.plan.pro.includes / The list of what Pro adds
`K.s29.plan.pro.name` | id | 146 | K.s29.plan.pro.name / The Pro plan name
`K.s29.plan.pro.price` | id | 147 | K.s29.plan.pro.price / The price line, which must carry the GST-inclusive wording, F051
`K.s29.reset` | id | 157 | K.s29.reset / The sentence naming when allowances reset
`K.s29.soon.enterprise` | id | 154 | K.s29.soon.enterprise / The Enterprise line
`K.s29.soon.team` | id | 153 | K.s29.soon.team / The Team line, named and not purchasable
`K.s29.sub` | id | 137 | K.s29.sub / The line under it: plan, account name, and the date allowances reset

### 1.30 S30, 12 missing

id | kind | line | context
`K.s30` | family | 21 | > E309 and A300 to A309. Copy ids are namespaced K.s30.*. Decision ids across S27 to S38
`K.s30.explainer` | id | 140 | K.s30.explainer / The note under the source, saying the front matter is the profile and the folder is the writing
`K.s30.handle.claim` | id | 142 | K.s30.handle.claim / The handle field's label and the shape it accepts
`K.s30.handle.taken` | id | 143 | K.s30.handle.taken / The line when a handle is already held
`K.s30.madewith` | id | 149 | K.s30.madewith / The made-with line on the Free footer
`K.s30.portable` | id | 141 | K.s30.portable / The second half of that note, that the same file renders as a document anywhere
`K.s30.proonly` | id | 150 | K.s30.proonly / The line stating the portfolio is on Pro
`K.s30.publish` | id | 144 | K.s30.publish / The publish control
`K.s30.templates` | family | 148 | K.s30.templates.<slug> / One name and one line per template
`K.s30.templates.heading` | id | 147 | K.s30.templates.heading / The heading over the few starting files
`K.s30.unpublish` | id | 146 | K.s30.unpublish / The unpublish control and its consequence
`K.s30.writing.empty` | id | 151 | K.s30.writing.empty / The line when the writing folder holds nothing yet

### 1.31 S31, 9 missing

id | kind | line | context
`K.s31` | family | 21 | > E319 and A310 to A319. Copy ids are namespaced K.s31.*. Decision ids across S27 to S38
`K.s31.aidown` | id | 152 | K.s31.aidown / The line on the disabled Let AI decide control when no provider answered.
`K.s31.consequence` | id | 151 | K.s31.consequence / The line that the other version stays in history whichever is chosen.
`K.s31.letai.explain` | id | 150 | K.s31.letai.explain / The sentence stating that it proposes and never writes, reviewed span by span.
`K.s31.origin.browser` | id | 143 | K.s31.origin.browser / The provenance line for a browser edit, with author and time.
`K.s31.origin.desktop` | id | 145 | K.s31.origin.desktop / The same for a desktop edit.
`K.s31.origin.drive` | id | 144 | K.s31.origin.drive / The same for a Google Drive edit.
`K.s31.origin.github` | id | 146 | K.s31.origin.github / The same for a GitHub change.
`K.s31.readonly` | id | 153 | K.s31.readonly / The line shown to a person who may read the conflict but not resolve it.

### 1.32 S32, 12 missing

id | kind | line | context
`K.s32` | family | 21 | > E329 and A320 to A329. Copy ids are namespaced K.s32.*. Decision ids across S27 to S38
`K.s32.chain.heading` | id | 175 | K.s32.chain.heading / The label over the provider list.
`K.s32.chip.byok` | id | 184 | K.s32.chip.byok / Use my own key.
`K.s32.chip.local` | id | 183 | K.s32.chip.local / Use the local model on the desktop app.
`K.s32.chip.retry` | id | 181 | K.s32.chip.retry / Try again.
`K.s32.chip.standardset` | id | 182 | K.s32.chip.standardset / Continue with a standard question set, and what changes if you do.
`K.s32.offline` | id | 187 | K.s32.offline / The different line for a device with no network.
`K.s32.rail` | id | 186 | K.s32.rail / The one line on the disabled AI control in the right rail.
`K.s32.reason.exhausted` | id | 176 | K.s32.reason.exhausted / A provider whose pool is finished, with a reset only where the provider states one.
`K.s32.reason.transient` | id | 177 | K.s32.reason.transient / A provider that was busy, with the seconds where the provider gives them.
`K.s32.reason.trialended` | id | 178 | K.s32.reason.trialended / A provider whose trial has ended.
`K.s32.reason.unknown` | id | 180 | K.s32.reason.unknown / A provider that refused for a reason we cannot name, said as such.

### 1.33 S33, 10 missing

id | kind | line | context
`K.s33` | family | 21 | > E339 and A330 to A339. Copy ids are namespaced K.s33.*. Decision ids across S27 to S38
`K.s33.blocked` | family | 140 | K.s33.blocked.<entitlement> / The one not-allowed row, per cap.
`K.s33.exception.lapsed` | id | 147 | K.s33.exception.lapsed / The line when a granted exception has expired.
`K.s33.exit.desktop` | id | 142 | K.s33.exit.desktop / Use the desktop app, which has no document cap.
`K.s33.exit.free` | id | 141 | K.s33.exit.free / Delete or export something.
`K.s33.exit.pro` | id | 143 | K.s33.exit.pro / Move to Pro, with its price marked GST inclusive.
`K.s33.exit.wait` | id | 144 | K.s33.exit.wait / Wait for the reset, with the date, shown only for a monthly allowance.
`K.s33.heading` | family | 137 | K.s33.heading.<entitlement> / One heading per cap, each naming the exact limit and the exact number.
`K.s33.lowered` | id | 146 | K.s33.lowered / The line when a founder lowered the limit rather than the person raising their usage.
`K.s33.offline` | id | 148 | K.s33.offline / The different line when the refusal is the network rather than the cap.

### 1.34 S34, 13 missing

id | kind | line | context
`K.s34` | family | 21 | > E349 and A340 to A349. Copy ids are namespaced K.s34.*. Decision ids across S27 to S38
`K.s34.box.prompt` | id | 146 | K.s34.box.prompt / The question in the start box.
`K.s34.chip.example` | id | 147 | K.s34.chip.example / Open the example, naming what the example is about.
`K.s34.chip.template` | id | 148 | K.s34.chip.template / Pick an industry template.
`K.s34.credits` | id | 150 | K.s34.credits / The remaining blueprint allowance for the month.
`K.s34.depth.high` | id | 145 | K.s34.depth.high / The High row, with its Pro marker and the research pass.
`K.s34.depth.low` | id | 143 | K.s34.depth.low / The Low row, with its free marker and its question range.
`K.s34.depth.medium` | id | 144 | K.s34.depth.medium / The Medium row, with its Pro marker and its question range.
`K.s34.offline` | id | 152 | K.s34.offline / The line saying an idea needs the network to generate its questions.
`K.s34.overcap` | id | 153 | K.s34.overcap / The line saying the allowance is spent and what happens if you start anyway.
`K.s34.standing` | id | 141 | K.s34.standing / The line saying ideas will be listed here with where each one stands.
`K.s34.steps` | id | 151 | K.s34.steps / The four step names.
`K.s34.what` | id | 142 | K.s34.what / The paragraph describing what a blueprint is and what comes out of it.

### 1.35 S35, 14 missing

id | kind | line | context
`K.s35` | family | 21 | > E359 and A350 to A359. Copy ids are namespaced K.s35.*. Decision ids across S27 to S38
`K.s35.col.free` | id | 188 | K.s35.col.free / The Free column heading.
`K.s35.col.pro` | id | 189 | K.s35.col.pro / The Pro column heading.
`K.s35.confirm.lower` | id | 198 | K.s35.confirm.lower / The confirmation shown before a save that lowers a limit, naming the count.
`K.s35.impact.unknown` | id | 199 | K.s35.impact.unknown / The line when the impact could not be computed and the save is blocked.
`K.s35.invariant` | id | 187 | K.s35.invariant / This row is what the product reads, and there is no second copy in the source.
`K.s35.lastchange` | id | 192 | K.s35.lastchange / The per-row line: who, from what, to what, when.
`K.s35.pending.count` | id | 193 | K.s35.pending.count / How many changes are pending, and what they are.
`K.s35.pending.discard` | id | 196 | K.s35.pending.discard / The discard control.
`K.s35.pending.impact` | id | 194 | K.s35.pending.impact / How many accounts a save would move over their cap.
`K.s35.pending.save` | id | 197 | K.s35.pending.save / The review-and-save control.
`K.s35.pending.seewho` | id | 195 | K.s35.pending.seewho / The control that names them.
`K.s35.phone.readonly` | id | 200 | K.s35.phone.readonly / The line saying editing is on the desktop and the phone shows what is set.
`K.s35.row` | family | 191 | K.s35.row.<entitlement> / One label per row, nine of them.

### 1.36 S36, 13 missing

id | kind | line | context
`K.s36` | family | 21 | > E369 and A360 to A369. Copy ids are namespaced K.s36.*. Decision ids across S27 to S38
`K.s36.cost.percall` | id | 199 | K.s36.cost.percall / The cost cell's label, and the fact that it is computed.
`K.s36.phone.readonly` | id | 200 | K.s36.phone.readonly / The line saying editing is on the desktop.
`K.s36.pool.known` | id | 195 | K.s36.pool.known / The remaining pool, where our ledger can state it.
`K.s36.pool.unknown` | id | 196 | K.s36.pool.unknown / The cell where the remaining pool cannot be known before spending it.
`K.s36.routing.col` | family | 198 | K.s36.routing.col.<plan> / One heading per plan column.
`K.s36.sec.chain` | id | 189 | K.s36.sec.chain / The label over the chain block.
`K.s36.sec.local` | id | 191 | K.s36.sec.local / The label over the desktop models block.
`K.s36.sec.routing` | id | 190 | K.s36.sec.routing / The label over the routing block.
`K.s36.sub` | id | 188 | K.s36.sub / The line naming what this screen sets.
`K.s36.terms.missing` | id | 193 | K.s36.terms.missing / The reason on a row whose terms nobody opened.
`K.s36.terms.record` | id | 194 | K.s36.terms.record / The control and fields for recording a provider's terms.
`K.s36.trial.ends` | id | 197 | K.s36.trial.ends / The line on a provider whose trial has an end date.

### 1.37 S37, 17 missing

id | kind | line | context
`K.s37` | family | 21 | > E379 and A370 to A379. Copy ids are namespaced K.s37.*. Decision ids across S27 to S38
`K.s37.flag.byok.desc` | id | 161 | K.s37.flag.byok.desc / Where the key field appears and whose calls run on it.
`K.s37.flag.byok.title` | id | 160 | K.s37.flag.byok.title / The bring-your-own-key flag's title.
`K.s37.flag.indexing.desc` | id | 165 | K.s37.flag.indexing.desc / What off means for a published page, and that it changes the robots rules and S17.
`K.s37.flag.indexing.title` | id | 164 | K.s37.flag.indexing.title / The indexing flag's title.
`K.s37.flag.live.desc` | id | 159 | K.s37.flag.live.desc / What it turns on, which screens, and which plans it reaches.
`K.s37.flag.live.title` | id | 158 | K.s37.flag.live.title / The live editing flag's title.
`K.s37.flag.magiclink.desc` | id | 163 | K.s37.flag.magiclink.desc / That it is a third way in and that it changes S01.
`K.s37.flag.magiclink.title` | id | 162 | K.s37.flag.magiclink.title / The email magic link flag's title.
`K.s37.locked.agefloor.reason` | id | 169 | K.s37.locked.agefloor.reason / That changing it needs new consent rather than a switch.
`K.s37.locked.agefloor.title` | id | 168 | K.s37.locked.agefloor.title / The age floor row's title, carrying the number.
`K.s37.locked.training.reason` | id | 167 | K.s37.locked.training.reason / That it is a promise rather than a setting, and moves only when the provider list does.
`K.s37.locked.training.title` | id | 166 | K.s37.locked.training.title / The training promise row's title, in the same words as the sign-in page.
`K.s37.off.explains` | id | 170 | K.s37.off.explains / The line a screen shows when its flag is off, rather than a not-found page.
`K.s37.sec.flags` | id | 156 | K.s37.sec.flags / The label over the four.
`K.s37.sec.locked` | id | 157 | K.s37.sec.locked / The label over the two, which includes the words and why.
`K.s37.sub` | id | 155 | K.s37.sub / Four switches, and two rows that look like switches and are not.

### 1.38 S38, 16 missing

id | kind | line | context
`K.s38` | family | 21 | > E389 and A380 to A389. Copy ids are namespaced K.s38.*. Decision ids across S27 to S38
`K.s38.audit.heading` | id | 156 | K.s38.audit.heading / The label over the audit log.
`K.s38.audit.row` | id | 157 | K.s38.audit.row / The shape of one audit line: who, which setting, from, to, when, and how many accounts moved.
`K.s38.exception.held` | id | 153 | K.s38.exception.held / The line on an account that already holds one, naming who granted it and why.
`K.s38.exception.lapsed` | id | 154 | K.s38.exception.lapsed / The line after one expires.
`K.s38.exception.note` | id | 152 | K.s38.exception.note / The line saying an exception carries an expiry, and that a lapse returns the account to its plan and to S33 if it is over.
`K.s38.grant.expiry` | id | 150 | K.s38.grant.expiry / The field for the expiry, marked as required.
`K.s38.grant.limit` | id | 148 | K.s38.grant.limit / The field choosing which limit the exception lifts.
`K.s38.grant.reason` | id | 151 | K.s38.grant.reason / The field for why, which is written into the audit row.
`K.s38.grant.value` | id | 149 | K.s38.grant.value / The field for the new value.
`K.s38.ledger.heading` | id | 155 | K.s38.ledger.heading / The label over the ledger.
`K.s38.meter` | family | 145 | K.s38.meter.<entitlement> / One label per meter.
`K.s38.meter.spend` | id | 146 | K.s38.meter.spend / The label on the money meter, and the period it covers.
`K.s38.search.nomatch` | id | 144 | K.s38.search.nomatch / The line when nothing matched.
`K.s38.search.placeholder` | id | 143 | K.s38.search.placeholder / The search field's prompt.
`K.s38.sub` | id | 142 | K.s38.sub / One account against every limit, and that an exception moves one person and never the plan.

### 1.39 Outside the screens, 1 missing

id | kind | line | context
`K.err` | family | 17:144 | These belong in 16-COPY-DECK.md under K.err.* and are not written there yet

## 2. What each id became

Every one of the 370 real ids now opens a row in `16-COPY-DECK.md`, inside a block headed
**Ids cited by `12-screens/SNN.md`, reconciled 18 September** at the end of that screen's section.
The 33 family references open rows in the deck's new section 14q instead.

- **alias.** The string already had a row under another id, because the screen and the deck named it
  differently. The new row's string cell is `(uses ...)` and points at the one home. No wording was
  copied, so one fact still has one home.
- **added, gen.mjs.** The wording is drawn in `docs/mvp0/screens/gen.mjs` and had no row. Verbatim,
  with the line cited against commit `f237ece`, the commit the deck's own provenance names.
- **added, founders' review.** Verbatim from `docs/mvp0/SCREEN-CHANGES-2026-09-18.md`.
- **added, proposed.** No wording existed anywhere. The row is marked `[new]` proposed and has not
  been reviewed by the founders.
- **deliberately no string.** The screen spec says nothing is shown. The row exists so a builder
  does not add a message.

screen | id | decision | string or target
S01 | `K.s01.heading` | alias | (uses `K.s01.title`)
S01 | `K.s01.promise` | alias | (uses `K.s01.lede`)
S01 | `K.s01.fineprint` | alias | (uses `K.s01.fine`)
S01 | `K.s01.providerlist` | added, gen.mjs | here are the providers
S01 | `K.s01.value.write` | alias | (uses `K.s01.write` then `K.s01.writeline`)
S01 | `K.s01.value.decide` | alias | (uses `K.s01.decide` then `K.s01.decideline`)
S01 | `K.s01.value.ship` | alias | (uses `K.s01.ship` then `K.s01.shipline`)
S01 | `K.s01.busy` | added, proposed | Signing in
S01 | `K.s01.cancelled` | deliberately no string | (no string: a cancelled sign-in returns to the card and says nothing)
S02 | `K.s02.tab.documents` | alias | (uses the first label of `K.common.tabs`)
S02 | `K.s02.tab.ideas` | alias | (uses the second label of `K.common.tabs`)
S02 | `K.s02.tab.shared` | alias | (uses the third label of `K.common.tabs`)
S02 | `K.s02.recent.head` | alias | (uses `K.s03.col.recent`, `K.s03.col.project`, `K.s03.col.opened`, `K.s03.col.owner`)
S02 | `K.s02.search` | alias | (uses `K.common.searchlong` with `K.common.searchkbd`)
S02 | `K.s02.desktop.note` | added, proposed | Documents on this computer have no cap.
S03 | `K.s03.greeting` | alias | (uses `K.s02.greeting`)
S03 | `K.s03.usage` | alias | (uses `K.s03.usedpill`)
S03 | `K.s03.tab.documents` | alias | (uses the first label of `K.common.tabs`)
S03 | `K.s03.tab.ideas` | alias | (uses `K.s03.ideascount`)
S03 | `K.s03.tab.shared` | alias | (uses `K.s03.sharedcount`)
S03 | `K.s03.recent.head.name` | alias | (uses `K.s03.col.recent`)
S03 | `K.s03.recent.head.project` | alias | (uses `K.s03.col.project`)
S03 | `K.s03.recent.head.opened` | alias | (uses `K.s03.col.opened`)
S03 | `K.s03.recent.head.owner` | alias | (uses `K.s03.col.owner`)
S03 | `K.s03.row.rename` | added, proposed | Rename
S03 | `K.s03.row.duplicate` | added, proposed | Duplicate
S03 | `K.s03.row.export` | added, proposed | Export
S03 | `K.s03.row.trash` | added, proposed | Move to trash
S03 | `K.s03.empty.documents` | added, proposed | No documents yet. Start one above.
S03 | `K.s03.empty.shared` | added, proposed | Nothing has been shared with you yet.
S03 | `K.s03.offline` | added, proposed | Offline. Showing the list saved on this device.
S03 | `K.s03.noproject` | added, proposed | -
S04 | `K.s04.tree.head` | alias | (uses `K.common.tree`)
S04 | `K.s04.tree.addproject` | alias | (uses `K.s04.newproject`)
S04 | `K.s04.addfile.uploadfiles` | alias | (uses `K.s04.addfile.upload`)
S04 | `K.s04.addfile.uploadfolder` | alias | (uses `K.s04.addfile.folder`)
S04 | `K.s04.addfile.importfrom` | alias | (uses `K.s04.addfile.import`)
S04 | `K.s04.ideas` | alias | (uses `K.s04.ideassection`)
S04 | `K.s04.sync` | alias | (uses `K.common.synced`)
S04 | `K.s04.saved` | alias | (uses `K.common.saved`)
S04 | `K.s04.rail.tags` | alias | (uses `K.common.tags`)
S04 | `K.s04.rail.backlinks` | alias | (uses `K.common.backlinks`)
S04 | `K.s04.rail.history` | alias | (uses `K.common.history`)
S04 | `K.s04.rail.comments` | alias | (uses `K.common.comments`)
S04 | `K.s04.rail.outline` | alias | (uses `K.common.outline`)
S04 | `K.s04.aiedit` | alias | (uses `K.common.aiedit`)
S04 | `K.s04.credits` | alias | (uses `K.common.editsleft`)
S04 | `K.s04.newtab` | added, proposed | New tab
S04 | `K.s04.closedirty` | added, proposed | {file} has changes that are not saved yet. Save them before you close it?
S04 | `K.s04.offline` | alias | (uses `K.s24.banner`, `K.s24.lastsync` and `K.s24.pending`)
S04 | `K.s04.share` | added, gen.mjs | Share
S27 | `K.s27.togglelight` | added, proposed | Switch to light theme
S27 | `K.s27.toggledark` | added, proposed | Switch to dark theme
S27 | `K.s27.appearance.heading` | alias | (uses `K.s28.nav.appearance`)
S27 | `K.s27.appearance.system` | added, proposed | Match this device
S27 | `K.s27.appearance.light` | added, proposed | Light
S27 | `K.s27.appearance.dark` | added, proposed | Dark
S27 | `K.s27.appearance.help` | added, proposed | Your choice is saved to your account, so every device you sign in on uses it.
S05 | `K.s05.face.googlesans` | alias | (uses `K.s05.font`)
S05 | `K.s05.face.serif` | added, proposed | Serif
S05 | `K.s05.face.mono` | added, proposed | Mono
S05 | `K.s05.face.system` | added, proposed | System
S05 | `K.s05.size` | added, proposed | Font size
S05 | `K.s05.comment.reply` | alias | (uses `K.common.reply`)
S05 | `K.s05.properties.head` | added, proposed | Properties
S05 | `K.s05.properties.invalid` | added, proposed | This is not valid YAML, so it was not saved. The front matter you had before is unchanged. Fix the line shown and try again.
S05 | `K.s05.readonly` | added, proposed | You can comment on this document but not edit it.
S05 | `K.s05.nocarrier` | added, proposed | Doc mode cannot show {feature}, so it appears as plain text here. The file is unchanged. Switch to MD to see it as written.
S06 | `K.s06.target.writing` | alias | (uses `K.s06.target.new`)
S06 | `K.s06.target.editing` | alias | (uses `K.s06.target.edit`)
S06 | `K.s06.target.range` | added, proposed | Selected: {count} {unit}
S06 | `K.s06.change` | alias | (uses `K.s06.target.swap`)
S06 | `K.s06.send` | added, proposed | Send
S06 | `K.s06.chip.onedoc` | alias | (uses `K.s06.chip.one`)
S06 | `K.s06.chip.toideas` | alias | (uses `K.s06.chip.ideas`)
S06 | `K.s06.chip.cleanpaste` | alias | (uses `K.s06.chip.paste`)
S06 | `K.s06.chip.plannotes` | alias | (uses `K.s06.chip.plan`)
S06 | `K.s06.startfrom.label` | alias | (uses `K.s06.orstart`)
S06 | `K.s06.startfrom.github` | alias | (uses `K.s06.chip.gh`)
S06 | `K.s06.startfrom.drop` | alias | (uses `K.s06.chip.drop`)
S06 | `K.s06.startfrom.template` | alias | (uses `K.s06.chip.template`)
S06 | `K.s06.getmore` | alias | (uses `K.common.getmore`)
S06 | `K.s06.accept` | alias | (uses `K.common.accept`)
S06 | `K.s06.reject` | alias | (uses `K.common.reject`)
S06 | `K.s06.untouched` | alias | (uses `K.promise.untouched`)
S06 | `K.s06.firstrun` | added, proposed | Each answer the box gives uses 1 edit credit, and only when it succeeds. Nothing is deducted for a failed call.
S06 | `K.s06.provider` | added, proposed | Running on {provider}
S07 | `K.s07.verb.refine` | alias | (uses `K.s07.refine`)
S07 | `K.s07.verb.refine.sub` | alias | (uses `K.s07.refine.sub`)
S07 | `K.s07.verb.expand` | alias | (uses `K.s07.expand`)
S07 | `K.s07.verb.expand.sub` | alias | (uses `K.s07.expand.sub`)
S07 | `K.s07.verb.shorten` | alias | (uses `K.s07.shorten`)
S07 | `K.s07.verb.shorten.sub` | alias | (uses `K.s07.shorten.sub`)
S07 | `K.s07.verb.tone` | alias | (uses `K.s07.tone`)
S07 | `K.s07.verb.tone.sub` | alias | (uses `K.s07.tone.sub`)
S07 | `K.s07.verb.translate` | alias | (uses `K.s07.translate`)
S07 | `K.s07.verb.translate.sub` | alias | (uses `K.s07.translate.sub`)
S07 | `K.s07.verb.callout` | alias | (uses `K.s07.summarise`)
S07 | `K.s07.verb.callout.sub` | alias | (uses `K.s07.summarise.sub`)
S07 | `K.s07.verb.links` | alias | (uses `K.s07.links`)
S07 | `K.s07.verb.links.sub` | alias | (uses `K.s07.links.sub`)
S07 | `K.s07.foot` | alias | (uses `K.s07.cost`)
S07 | `K.s07.accept` | alias | (uses `K.common.accept`)
S07 | `K.s07.reject` | alias | (uses `K.common.reject`)
S07 | `K.s07.suggesting` | alias | (uses `K.s05.suggesting`)
S07 | `K.s07.unchanged` | added, proposed | The model found nothing to change, so your text is as it was.
S07 | `K.s07.refused` | added, proposed | This text changed while the suggestion was being made, so nothing was written. Select it again and ask again.
S08 | `K.s08.table.folded` | alias | (uses `K.s08.tablefolded`)
S08 | `K.s08.chart.notable` | added, proposed | This chart has no table above it to read from, so it is shown as its source. Put the table directly above the chart block.
S08 | `K.s08.chart.nonumbers` | added, proposed | The table above has no column of numbers, so there is nothing to chart. The block is shown as its source.
S08 | `K.s08.chart.kind` | added, proposed | This version cannot draw a {kind} chart, so the block is shown as its source.
S08 | `K.s08.mermaid.failed` | added, proposed | This diagram could not be drawn: {reason}. Its text is shown instead and nothing in the file changed.
S08 | `K.s08.maths.failed` | added, proposed | This maths could not be drawn: {reason}. Its text is shown instead and nothing in the file changed.
S08 | `K.s08.callout.unknown` | added, proposed | {kind} is not a callout kind we know, so it is shown as a plain quote.
S08 | `K.s08.fence.unclosed` | added, proposed | This block has no closing fence, so it runs to the end of the document. Add the closing line to end it.
S08 | `K.s08.drawing.missing` | added, proposed | The drawing file for this block could not be found, so nothing is drawn here. The block in your document is unchanged.
S08 | `K.s08.table.shape` | added, proposed | Row {row} has {cells} cells and the header has {cols}. Nothing was written. Match the header, then try again.
S08 | `K.s08.gutter` | added, proposed | Drag to resize the two panes
S09 | `K.s09.convention` | alias | (uses `K.s09.legend`)
S09 | `K.s09.counts` | alias | (uses `K.s09.count`)
S09 | `K.s09.nophases` | added, proposed | This document has no H2 headings, so there are no phases to draw. Add a heading, or read it in Page view.
S09 | `K.s09.orphanstep` | added, proposed | This step has no phase above it, so it is shown in a column of its own. Give it an H2 above to place it.
S09 | `K.s09.toolarge` | added, proposed | Showing the first {shown} phases. The rest draw as you scroll, or switch to Outline.
S09 | `K.s09.badref` | added, proposed | This reference points to nothing in this project.
S09 | `K.s09.notatthiswidth` | added, proposed | This view needs a wider screen. Try Outline or Page on a phone.
S10 | `K.s10.costnote` | alias | (uses `K.s10.never`)
S10 | `K.s10.fixallsafe` | alias | (uses `K.s10.fixall`)
S10 | `K.s10.fixallsafe.count` | added, proposed | Fix {n} problems that each have one exact fix? You can undo this in one step.
S10 | `K.s10.fixallsafe.none` | added, proposed | None of these has a fix that is certain, so nothing was changed. Fix them one at a time.
S10 | `K.s10.clean` | added, proposed | No problems found in this document.
S10 | `K.s10.check.brokenlink` | alias | (uses `K.s10.link` then `K.s10.link.sub`)
S10 | `K.s10.check.headingskip` | alias | (uses `K.s10.heading` then `K.s10.heading.sub`)
S10 | `K.s10.check.noalt` | alias | (uses `K.s10.alt` then `K.s10.alt.sub`)
S10 | `K.s10.check.tableshape` | alias | (uses `K.s10.table` then `K.s10.table.sub`)
S10 | `K.s10.check.spelling` | added, proposed | Possible misspelling: {word}
S10 | `K.s10.check.frontmatter` | added, proposed | Front matter key {key} does not match this project's schema
S10 | `K.s10.writing.longsentence` | alias | (uses `K.s10.sentence` then `K.s10.sentence.sub`)
S10 | `K.s10.adddictionary` | added, proposed | Add to dictionary
S10 | `K.s10.offline.writing` | added, proposed | Writing notes need a connection. Checks still work on this device.
S10 | `K.s10.check.failed` | added, proposed | The {check} check could not run, so its findings are missing. The other checks ran as usual.
S11 | `K.s11.head` | alias | (uses `K.s11.title` then `K.s11.count`)
S11 | `K.s11.rel.source` | alias | (uses `K.s11.state.source`)
S11 | `K.s11.rel.import` | alias | (uses `K.s11.state.import`)
S11 | `K.s11.rel.copy` | alias | (uses `K.s11.state.instep`)
S11 | `K.s11.rel.copydrifted` | alias | (uses `K.s11.state.drifted`)
S11 | `K.s11.rel.missing` | alias | (uses `K.s11.state.missing`)
S11 | `K.s11.drift.head` | alias | (uses `K.s11.drift.title`)
S11 | `K.s11.regenerate` | alias | (uses `K.s11.regen`)
S11 | `K.s11.regenerate.confirm` | added, proposed | Replace {file} with a fresh copy of {source}? Anything written only in {file} will be lost.
S11 | `K.s11.check.size` | alias | (uses `K.s11.size` then `K.s11.size.sub`)
S11 | `K.s11.check.setup` | alias | (uses `K.s11.setup` then `K.s11.setup.sub`)
S11 | `K.s11.check.unverified` | alias | (uses `K.s11.stale` then `K.s11.stale.sub`)
S11 | `K.s11.check.lintduplicate` | alias | (uses `K.s11.linted` then `K.s11.linted.sub`)
S11 | `K.s11.honesty` | alias | (uses `K.s11.honest`)
S11 | `K.s11.tidy.cost` | added, proposed | Uses 1 edit credit. The result arrives in your change queue for you to accept or reject.
S11 | `K.s11.capunknown` | added, proposed | Size limit unknown for {tool}
S11 | `K.s11.orphan` | added, proposed | Copy of a missing source
S12 | `K.s12.head.sub` | alias | (uses `K.s12.sub`)
S12 | `K.s12.placeholder` | added, gen.mjs | A booking page for small salons that take appointments on WhatsApp today. One link for the Instagram bio, a calendar of open slots, a deposit, and a reminder the day before.
S12 | `K.s12.depth.suffix` | added, gen.mjs | depth
S12 | `K.s12.attach.drawing` | alias | (uses `K.s12.attach.image`)
S12 | `K.s12.attach.document` | alias | (uses `K.s12.attach.doc`)
S12 | `K.s12.attach.used` | alias | (uses `K.s12.attached`)
S12 | `K.s12.templates.label` | alias | (uses `K.s12.startfrom`)
S12 | `K.s12.template.localservice` | added, gen.mjs | Local service business
S12 | `K.s12.template.saas` | added, gen.mjs | SaaS
S12 | `K.s12.template.marketplace` | added, gen.mjs | Marketplace
S12 | `K.s12.template.internal` | added, gen.mjs | Internal tool
S12 | `K.s12.template.generate` | alias | (uses `K.s12.template.own`)
S12 | `K.s12.credits` | alias | (uses `K.s12.rail.credit`)
S12 | `K.s12.state.draft` | added, gen.mjs | Draft
S12 | `K.s12.state.answered` | added, gen.mjs | {answered} of {questions} answered
S12 | `K.s12.state.blueprint` | added, gen.mjs | Blueprint v{version} · {files} files
S12 | `K.s12.send` | alias | (uses `K.s06.send`)
S13 | `K.s13.progress.page` | alias | (uses `K.s13.progress`)
S13 | `K.s13.progress.count` | alias | (uses `K.s13.progress.q`)
S13 | `K.s13.recommendation` | alias | (uses `K.s13.choose`)
S13 | `K.s13.rec.tag` | alias | (uses `K.s13.recommended`)
S13 | `K.s13.rewrite.cause` | alias | (uses `K.s13.rewriting`)
S13 | `K.s13.rewrite.working` | added, proposed | Updating this question
S13 | `K.s13.rewrite.capped` | added, proposed | This blueprint has used its {rewrites} question rewrites on Free, so the later questions stay as planned. Your answer is recorded.
S13 | `K.s13.rewrite.failed` | added, proposed | The later questions could not be rewritten, so they stay as planned. Your answer is recorded. Nothing is deducted for a failed call.
S13 | `K.s13.skipall.line1` | alias | (uses `K.s14.skipall.title` then `K.s14.skipall.body1`)
S13 | `K.s13.skipall.line2` | alias | (uses `K.s14.skipall.body2`)
S13 | `K.s13.skipall.line3` | alias | (uses `K.s14.skipall.body2`)
S13 | `K.s13.skipall.confirm` | alias | (uses `K.s14.skipall.go`)
S13 | `K.s13.standardset` | added, founders' review | Use a standard question set
S13 | `K.s13.standardset.why` | added, proposed | A fixed set of questions for this template. It needs no model, so it works when AI is unavailable or your allowance is used up.
S13 | `K.s13.files.head` | added, proposed | The {files} files in your blueprint
S13 | `K.s13.files.beforecredit` | added, proposed | Nothing has been spent yet. Your blueprint credit is used only when you continue from this list.
S14 | `K.s14.src.opened` | added, proposed | opened {date} · {source}
S14 | `K.s14.researchdone` | added, proposed | The research for {idea} is finished. Your questions are ready.
S15 | `K.s15.checknotrun` | added, proposed | Check did not run
S15 | `K.s15.revoked` | added, proposed | This link was turned off by its owner. Ask them for a new one.
S15 | `K.s15.kickoff.copied` | added, proposed | Copied. Paste it into your agent.
S16 | `K.s16.node.kind` | added, proposed | Document · Spec · Decision · Agent file
S16 | `K.s16.stale` | added, proposed | Showing the map from before the last change. It could not be rebuilt.
S17 | `K.s17.invite.sent` | added, proposed | Invite sent to {email}. You both get the credits when they first sign in.
S17 | `K.s17.referral.title` | added, proposed | Invite someone to frontmatter
S17 | `K.s17.lookup.failed` | added, proposed | We could not check whether {email} has an account. You can send an invite anyway.
S18 | `K.s18.notfound` | added, proposed | Nothing is published at this address.
S18 | `K.s18.empty` | added, proposed | This page has no content yet.
S19 | `K.s19.slow` | added, proposed | Slow
S19 | `K.s19.highlight` | added, proposed | Text another person types is highlighted as it arrives, then fades. Nothing is added to the file.
S19 | `K.s19.dropped` | added, proposed | The live session stopped. You are editing on your own now, and nothing is lost.
S19 | `K.s19.queued` | added, proposed | Offline. Your changes are saved on this device and sync when you are back.
S19 | `K.s19.unshared` | added, proposed | You no longer have access to this document. Your copy on this device stays readable and can be exported.
S20 | `K.s20.firstrun` | added, proposed | Nothing here is applied to the file until you accept it.
S20 | `K.s20.stale` | added, proposed | Could not be placed. The text around it changed, so the original is kept here.
S20 | `K.s20.confirm.bulk` | added, proposed | Accept all {n} changes from {name}? You can undo this in one step.
S20 | `K.s20.readonly` | added, proposed | Your role on this document can read and reply, but not accept changes.
S21 | `K.s21.window.end` | added, proposed | Your plan keeps {history} days of versions. Older versions are outside that window.
S21 | `K.s21.outofwindow` | added, proposed | Outside your plan's {history}-day window. Not deleted yet.
S21 | `K.s21.restored` | added, proposed | Restored. The version from {time} is now the latest, and nothing before it was removed.
S21 | `K.s21.redrawn` | added, proposed | The document changed while you were looking, so this comparison was redrawn against the latest version.
S22 | `K.s22.nofolderinput` | added, proposed | This browser cannot open a whole folder. Choose the files instead, or drop the folder onto this page.
S22 | `K.s22.collision` | added, proposed | {path} already existed, so both were kept. The new one is {newpath}.
S22 | `K.s22.cancelled` | added, proposed | Import stopped. The {done} files already brought in are kept.
S23 | `K.s23.drive.connect` | added, proposed | Connect Google Drive
S23 | `K.s23.drive.paused` | added, proposed | Paused. Nothing syncs until you resume, and nothing is deleted at either end.
S23 | `K.s23.gh.revoked` | added, proposed | frontmatter was removed from this repository on GitHub, so nothing can be pushed. Reinstall the app on GitHub to reconnect.
S23 | `K.s23.lastknown` | added, proposed | Last known state. You are offline, so these cannot be changed right now.
S24 | `K.s24.storage.full` | added, proposed | This device has run out of room, so what you type now is not being kept. Sync, or free up space, before you type more.
S24 | `K.s24.storage.low` | added, proposed | {free} left on this device for offline edits
S24 | `K.s24.persist.refused` | added, proposed | This browser may clear offline edits if it runs low on space.
S25 | `K.s25.addfolder` | added, proposed | Add a folder from this computer to write in it here.
S25 | `K.s25.group.cloud` | added, gen.mjs | Cloud · {project}
S25 | `K.s25.group.local` | added, gen.mjs | On this Mac · {path}
S25 | `K.s25.update.refused` | added, proposed | An update was found but its signature did not check out, so it was not installed. You are still on version {version}.
S26 | `K.s26.source` | added, proposed | From {app} · {time}
S26 | `K.s26.queued` | added, proposed | Saved on this device. It is added to {file} when you are back online.
S26 | `K.s26.shortcut.taken` | added, proposed | {chord} is already used by another app, so quick capture has no shortcut. Choose another in Settings.
S26 | `K.s26.ios.absent` | added, proposed | iOS does not let web apps receive shared text. Open frontmatter and paste instead.
S26 | `K.s26.append.failed` | added, proposed | This could not be added to {file}. Your text is still here. Try again, or copy it.
S28 | `K.s28.sub` | alias | (uses `K.s28.lede`)
S28 | `K.s28.editor.defaultmode` | alias | (uses `K.s28.defaultmode` then `K.s28.defaultmode.sub`)
S28 | `K.s28.editor.docdefault` | alias | (uses `K.s28.docdefault` then `K.s28.docdefault.sub`)
S28 | `K.s28.editor.linewidth` | alias | (uses `K.s28.linewidth` then `K.s28.linewidth.sub`)
S28 | `K.s28.editor.spellcheck` | alias | (uses `K.s28.spellcheck` then `K.s28.spellcheck.sub`)
S28 | `K.s28.editor.vim` | alias | (uses `K.s28.vim` then `K.s28.vim.sub`)
S28 | `K.s28.writing.structural` | alias | (uses `K.s28.checks` then `K.s28.checks.sub`)
S28 | `K.s28.writing.plain` | alias | (uses `K.s28.plain` then `K.s28.plain.sub`)
S28 | `K.s28.ai.model` | alias | (uses `K.s28.model` then `K.s28.model.sub`)
S28 | `K.s28.ai.selection` | alias | (uses `K.s28.aiselection` then `K.s28.aiselection.sub`)
S28 | `K.s28.ai.ghost` | alias | (uses `K.s28.ghost` then `K.s28.ghost.sub`)
S28 | `K.s28.ai.mark` | alias | (uses `K.s28.markai` then `K.s28.markai.sub`)
S28 | `K.s28.account.signedin` | alias | (uses `K.s28.signedin`)
S28 | `K.s28.account.signout` | alias | (uses `K.s28.signout`)
S28 | `K.s28.account.delete` | added, proposed | Delete account. Everything is removed 30 days after you confirm.
S28 | `K.s28.offline` | added, proposed | Needs a connection. Your other settings still work.
S28 | `K.s28.degraded` | added, proposed | Settings are not saving right now. Keep working, nothing is lost on this device.
S29 | `K.s29.sub` | alias | (uses `K.s29.lede`)
S29 | `K.s29.meter.blueprints` | alias | (uses `K.s29.meter.kits` then `K.s29.meter.kits.val`)
S29 | `K.s29.plan.free.name` | alias | (uses `K.common.free`)
S29 | `K.s29.plan.free.includes` | alias | (uses `K.s29.free.everything`, `K.s29.free.caps`, `K.s29.free.ai`, `K.s29.free.collab`, `K.s29.free.history`)
S29 | `K.s29.plan.free.excludes` | alias | (uses `K.s29.free.not`)
S29 | `K.s29.plan.free.current` | alias | (uses `K.s29.current`)
S29 | `K.s29.plan.pro.name` | alias | (uses `K.common.pro`)
S29 | `K.s29.plan.pro.price` | alias | (uses `K.s29.pro.price` then `K.s29.pro.price.sub`)
S29 | `K.s29.plan.pro.includes` | alias | (uses `K.s29.pro.unlimited`, `K.s29.pro.ai`, `K.s29.pro.history`, `K.s29.pro.links`, `K.s29.pro.portfolio`)
S29 | `K.s29.plan.pro.cta` | alias | (uses `K.s29.upgrade`)
S29 | `K.s29.payment.methods` | alias | (uses the first sentence of `K.s29.payment`)
S29 | `K.s29.payment.cancel` | alias | (uses the second sentence of `K.s29.payment`)
S29 | `K.s29.payment.topups` | alias | (uses the third sentence of `K.s29.payment`)
S29 | `K.s29.soon.team` | alias | (uses `K.s29.team`)
S29 | `K.s29.soon.enterprise` | alias | (uses `K.s29.enterprise`)
S29 | `K.s29.reset` | added, proposed | Your allowances reset on {date}.
S29 | `K.s29.pastdue` | added, proposed | Your payment on {date} did not go through. Nothing has been removed or locked. Pay again to keep Pro.
S29 | `K.s29.pending` | added, proposed | Confirming your payment, started at {time}. There is nothing more to do here.
S30 | `K.s30.explainer` | alias | (uses `K.s30.onefile` then the first sentence of `K.s30.onefile.body`)
S30 | `K.s30.portable` | alias | (uses the second sentence of `K.s30.onefile.body`)
S30 | `K.s30.handle.claim` | added, proposed | Your handle, as in frontmatter.in/@you
S30 | `K.s30.handle.taken` | added, proposed | @{handle} is already taken. Try another.
S30 | `K.s30.publish` | added, proposed | Publish portfolio
S30 | `K.s30.unpublish` | added, proposed | Unpublish. The page goes offline and @{handle} stays reserved for you for {days} days.
S30 | `K.s30.templates.heading` | added, proposed | Start from a template
S30 | `K.s30.madewith` | alias | (uses `K.s18.made`)
S30 | `K.s30.proonly` | added, proposed | Your portfolio is part of Pro.
S30 | `K.s30.writing.empty` | added, proposed | Nothing in your writing folder yet. Whatever you add there appears here.
S31 | `K.s31.origin.browser` | added, gen.mjs | This browser · {who} · {time}
S31 | `K.s31.origin.drive` | added, gen.mjs | Google Drive · {who} · {time}
S31 | `K.s31.origin.desktop` | added, proposed | Desktop app · {who} · {time}
S31 | `K.s31.origin.github` | added, proposed | GitHub · {who} · {time}
S31 | `K.s31.letai.explain` | added, proposed | AI proposes a merge. Nothing is written to the file: each change goes to your change queue for you to accept or reject.
S31 | `K.s31.consequence` | alias | (uses the first sentence of `K.s31.note`)
S31 | `K.s31.aidown` | added, proposed | No AI provider is answering, so this is unavailable. The other choices still work and nothing was spent.
S31 | `K.s31.readonly` | added, proposed | You can see this conflict but not resolve it. The document's owner or an editor can choose.
S32 | `K.s32.chain.heading` | added, proposed | Providers tried
S32 | `K.s32.reason.exhausted` | added, proposed | free allowance used
S32 | `K.s32.reason.transient` | added, proposed | busy right now
S32 | `K.s32.reason.trialended` | alias | (uses `K.s32.reason.trial`)
S32 | `K.s32.reason.unknown` | added, proposed | declined, and gave no reason
S32 | `K.s32.chip.retry` | alias | (uses `K.s32.try`)
S32 | `K.s32.chip.local` | alias | (uses `K.s32.local`)
S32 | `K.s32.chip.byok` | alias | (uses `K.s32.ownkey`)
S32 | `K.s32.chip.standardset` | alias | (uses `K.s13.standardset` then `K.s13.standardset.why`)
S32 | `K.s32.rail` | alias | (uses `K.s32.aioff`)
S32 | `K.s32.offline` | added, proposed | You are offline, so AI cannot be reached. The providers did not refuse. Reconnect, or use the local model on the desktop app.
S33 | `K.s33.exit.free` | alias | (uses `K.s33.do.delete`)
S33 | `K.s33.exit.desktop` | alias | (uses `K.s33.do.desktop`)
S33 | `K.s33.exit.pro` | alias | (uses `K.s33.do.pro`)
S33 | `K.s33.exit.wait` | added, proposed | Wait for the reset on {date}
S33 | `K.s33.lowered` | added, proposed | This limit was lowered on {date}. Your usage did not change, and nothing you have was removed.
S33 | `K.s33.exception.lapsed` | added, proposed | The extra allowance on your account ended on {date}, so your plan's usual limit applies again.
S33 | `K.s33.offline` | added, proposed | This needs a connection. You are offline, not over your limit. You can keep writing on this device.
S34 | `K.s34.standing` | alias | (uses `K.s34.railempty`)
S34 | `K.s34.what` | alias | (uses `K.s34.lede`)
S34 | `K.s34.depth.low` | alias | (uses `K.s34.low`)
S34 | `K.s34.depth.medium` | alias | (uses `K.s34.medium`)
S34 | `K.s34.depth.high` | alias | (uses `K.s34.high`)
S34 | `K.s34.box.prompt` | alias | (uses `K.s34.prompt`)
S34 | `K.s34.chip.example` | alias | (uses `K.s34.example`)
S34 | `K.s34.chip.template` | alias | (uses `K.s34.template`)
S34 | `K.s34.credits` | alias | (uses `K.s34.credit`)
S34 | `K.s34.steps` | alias | (uses `K.s34.step1`, `K.s34.step2`, `K.s34.step3`, `K.s34.step4`)
S34 | `K.s34.offline` | added, proposed | An idea needs a connection to write its questions. What you type here is kept until you are back.
S34 | `K.s34.overcap` | added, proposed | Your blueprint allowance for this month is used. If you start now, the standard question set is used, or you can wait for the reset on {date}. The example is always free to read.
S35 | `K.s35.col.free` | alias | (uses `K.common.free`)
S35 | `K.s35.col.pro` | alias | (uses `K.common.pro`)
S35 | `K.s35.invariant` | alias | (uses the second sentence of `K.s35.lede`)
S35 | `K.s35.lastchange` | added, gen.mjs | {who} · {to} from {from} · {date}
S35 | `K.s35.pending.count` | alias | (uses `K.s35.bar.change`)
S35 | `K.s35.pending.impact` | alias | (uses `K.s35.bar.warn`)
S35 | `K.s35.pending.seewho` | alias | (uses `K.s35.bar.seewho`)
S35 | `K.s35.pending.discard` | alias | (uses `K.s35.bar.discard`)
S35 | `K.s35.pending.save` | alias | (uses `K.s35.bar.save`)
S35 | `K.s35.confirm.lower` | added, proposed | This lowers {limit} on {plan} from {from} to {to}. {n} accounts will be over their cap. Nothing of theirs is removed, and they cannot create more until they are under it.
S35 | `K.s35.impact.unknown` | added, proposed | The number of accounts this would affect could not be worked out, so it cannot be saved yet. Try again in a moment.
S35 | `K.s35.phone.readonly` | alias | (uses `K.s35.phone.note`)
S36 | `K.s36.sub` | alias | (uses `K.s36.lede`)
S36 | `K.s36.sec.chain` | alias | (uses `K.s36.chain`)
S36 | `K.s36.sec.routing` | alias | (uses `K.s36.routing`)
S36 | `K.s36.sec.local` | added, proposed | Desktop models
S36 | `K.s36.terms.missing` | alias | (uses `K.s36.note.unopened` then `K.s36.cannotenable`)
S36 | `K.s36.terms.record` | added, proposed | Record the terms: the page, the date you opened it, and what it says about training
S36 | `K.s36.pool.known` | added, proposed | {left} left today
S36 | `K.s36.pool.unknown` | added, proposed | Not known until it runs out
S36 | `K.s36.trial.ends` | alias | (uses `K.s36.note.trial`)
S36 | `K.s36.cost.percall` | alias | (uses `K.s36.col.cost`)
S36 | `K.s36.phone.readonly` | alias | (uses `K.s35.phone.note`)
S37 | `K.s37.sub` | alias | (uses `K.s37.lede`)
S37 | `K.s37.sec.flags` | alias | (uses `K.s37.flags`)
S37 | `K.s37.sec.locked` | alias | (uses `K.s37.locked`)
S37 | `K.s37.flag.live.title` | alias | (uses `K.s37.flag.live`)
S37 | `K.s37.flag.live.desc` | added, gen.mjs | Two people in one document at once. Turns on live collaboration. Free up to {collab}, unlimited on Pro.
S37 | `K.s37.flag.byok.title` | alias | (uses `K.s37.flag.byok`)
S37 | `K.s37.flag.byok.desc` | added, gen.mjs | A key field in Settings AI. A person's own calls run on their key. Both plans.
S37 | `K.s37.flag.magiclink.title` | alias | (uses `K.s37.flag.magic`)
S37 | `K.s37.flag.magiclink.desc` | added, gen.mjs | A third way in, beside Google and GitHub. Changes the sign-in page.
S37 | `K.s37.flag.indexing.title` | alias | (uses `K.s37.flag.index`)
S37 | `K.s37.flag.indexing.desc` | added, gen.mjs | Off means every published page stays out of search. Changes robots and the share dialog.
S37 | `K.s37.locked.training.title` | alias | (uses `K.s37.lock.training`)
S37 | `K.s37.locked.training.reason` | alias | (uses `K.s37.lock.training.sub`)
S37 | `K.s37.locked.agefloor.title` | alias | (uses `K.s37.lock.age`)
S37 | `K.s37.locked.agefloor.reason` | alias | (uses `K.s37.lock.age.sub`)
S37 | `K.s37.off.explains` | added, proposed | This is not available yet. Nothing is wrong with your account or your documents.
S38 | `K.s38.sub` | alias | (uses `K.s38.lede`)
S38 | `K.s38.search.placeholder` | added, proposed | Find an account by email
S38 | `K.s38.search.nomatch` | added, proposed | No account matches {query}.
S38 | `K.s38.meter.spend` | alias | (uses `K.s38.spent`, then this month)
S38 | `K.s38.grant.limit` | added, proposed | Limit to lift
S38 | `K.s38.grant.value` | added, proposed | New value
S38 | `K.s38.grant.expiry` | added, proposed | Expires (required)
S38 | `K.s38.grant.reason` | added, proposed | Why (kept in the audit log)
S38 | `K.s38.exception.note` | alias | (uses `K.s38.expiry`)
S38 | `K.s38.exception.held` | added, proposed | {who} granted an exception on {date}: {reason}. It expires {expiry}.
S38 | `K.s38.exception.lapsed` | added, proposed | The exception ended on {date}. This account is back on its plan's limits.
S38 | `K.s38.ledger.heading` | alias | (uses `K.s38.ledger`)
S38 | `K.s38.audit.heading` | added, gen.mjs | Audit log
S38 | `K.s38.audit.row` | added, proposed | {who} · {setting} · {from} to {to} · {when} · {n} accounts moved

## 3. The counts

Every figure below was produced by a script in this session, not counted by hand.

What | Count | How it was derived
`K` ids the validator reported with no home, 18 September | 403 | `validate-pack.py`, before any edit
the same, as tokens cited on the screens | 402 | the extraction in section 1; `K.err` is the 403rd, cited only from `17`
distinct `K` tokens cited on the screens at the start | 704 | the extraction script
of those, already a row in the deck | 302 | 704 minus 402
family references, recorded not written | 33 | 25 screen namespaces, 7 templates, and `K.err`
real ids that needed a row | 370 | 402 minus the 32 screen-side families
resolved as an alias of an existing row | 195 | the classifier over the new blocks
added with wording from `gen.mjs` | 21 | the same
added with wording from the founders' review | 1 | `K.s13.standardset`
added as proposed | 152 | the same
added as deliberately no string | 1 | `K.s01.cancelled`

**The screens changed under this job.** By the time the check ran, another writer had removed the
namespace sentences from S01 to S13, so the screens cite 691 distinct tokens rather than 704, and 13
of the 25 namespace rows in section 14q no longer have a citation. They are left in place because
they are still true. No id this job resolved was removed, and no new unresolved id appeared.

**The proposed rows lean on care, not on volume.** Of the 152, the refusals and failures carry the
tone `refusal` or `caution`, follow rule 6 of the deck (what will not happen, why, what to do), and
reuse the standing promises by id or verbatim rather than restating them.

## 4. The proof

The check is `check.py`, kept beside this file's history in the session scratchpad and reproduced
in full in section 6. It reads the screens, reads the family list from section 1 of this file, and
requires that every other cited id opens a table row in the deck, that every family opens a row in
section 14q, that no id opens two rows, and that every alias points at an id that opens a row.

**Red first.** Run against the deck as it stood at `HEAD` before this job, it fails:

```
cited on screens, distinct: 691
recorded as family references: 33
real ids to resolve: 672
real ids with no row in the deck: 370 ['K.s01.busy', 'K.s01.cancelled', 'K.s01.fineprint', 'K.s01.heading', 'K.s01.promise', 'K.s01.providerlist', 'K.s01.value.decide', 'K.s01.value.ship', 'K.s01.value.write', 'K.s02.desktop.note']
family references with no row in section 14q: 33 ['K.err', 'K.s01', 'K.s02', 'K.s03', 'K.s04', 'K.s05', 'K.s06', 'K.s07', 'K.s08', 'K.s09', 'K.s10', 'K.s11', 'K.s12', 'K.s13', 'K.s27', 'K.s28', 'K.s28.nav', 'K.s29', 'K.s30', 'K.s30.templates', 'K.s31', 'K.s32', 'K.s33', 'K.s33.blocked', 'K.s33.heading', 'K.s34', 'K.s35', 'K.s35.row', 'K.s36', 'K.s36.routing.col', 'K.s37', 'K.s38', 'K.s38.meter']
ids opening more than one row: 0 []
alias targets that open no row: 0 []
FAIL
```

**Then green**, against the deck as saved:

```
cited on screens, distinct: 691
recorded as family references: 33
real ids to resolve: 672
real ids with no row in the deck: 0 []
family references with no row in section 14q: 0 []
ids opening more than one row: 0 []
alias targets that open no row: 0 []
PASS
```

`python3 docs/pack/tools/validate-pack.py` now reports no `K` problem. Its one remaining problem at
the time of writing was a `C` id in another writer's file.

`python3 ~/Desktop/GitHub/sgnkai/scoring/gate.py --file docs/pack/16-COPY-DECK.md --strict` prints
PASSED.

## 5. What the founders should read

1. **152 strings are proposed and unreviewed.** Each is marked `[new]` proposed in the deck. The
   refusals are the ones to read first, because refusing rather than guessing is the product:
   `K.s05.properties.invalid`, `K.s05.nocarrier`, `K.s07.refused`, `K.s08.chart.notable`,
   `K.s08.table.shape`, `K.s09.nophases`, `K.s10.fixallsafe.none`, `K.s13.rewrite.capped`,
   `K.s19.unshared`, `K.s22.nofolderinput`, `K.s23.gh.revoked`, `K.s25.update.refused`,
   `K.s30.handle.taken`, `K.s31.aidown`, `K.s33.offline`, `K.s35.impact.unknown`.
2. **The screens and the deck named the same strings twice.** 195 of the 370 were the same words
   under a second id. They are aliases now, so the words still live once. A builder may prefer to
   rename the screen citations to the deck's ids and delete the aliases; that is an edit to the
   screen files, which this job was not allowed to make.
3. **The skip-all modal has two sentences where the S13 spec wants three.** The drawn modal
   (`K.s14.skipall.body2`) names the plan and the kickoff prompt in one sentence. Recorded on
   `K.s13.skipall.line3`; the drawn wording was kept.
4. **Screen ids inside strings.** Three flag descriptions on S37 name screens (S19, S01, S17) in the
   drawn copy. The deck's rule 4 forbids that, so the new rows use the screen's name instead and say
   so. The drawn generator still carries the ids.
5. **Numbers the strings need and nobody has set:** the handle interval on unpublish (`{days}` in
   `K.s30.unpublish`), the shape a handle accepts (`K.s30.handle.claim`), the list of chart kinds
   (`K.s08.chart.kind`), and whether the 30-day account deletion window is configurable
   (`K.s28.account.delete`).
6. **Strings that still have no id**: the two answers to `K.s04.closedirty`, the refusal when a
   regenerated copy has hand edits (S11), the three portfolio templates, three of the seven idea
   templates, the S38 meter labels, and every `K.err.*` row that `17` needs.
7. **`gen.mjs` moved during this job.** The deck cites it at commit `f237ece` (1,760 lines). The
   working tree now has 1,810 lines, so every `gen.mjs:NNN` citation in the deck, old rows and new,
   is exact at `f237ece` and approximate against the working tree. The 21 new `[gen]` rows were
   checked against `f237ece` by script: 17 match their line exactly, and the other 4 are the S37
   descriptions, which differ on purpose (point 4, and one escaped apostrophe).

## 6. The check, in full

Kept here because the session scratchpad does not survive. Run it with `python3` from anywhere.

```python
"""Proof for docs/pack/tools/copy-reconciliation.md step 5.
Every K id cited in docs/pack/12-screens/*.md must open a table row in 16-COPY-DECK.md,
except tokens recorded as family references in section 1 of the reconciliation file,
which must instead open a row in the deck's section 14q."""
import re, pathlib
PACK = pathlib.Path('/Users/sagnikmitra/Desktop/GitHub/frontmatter/docs/pack')
pat = r'\bK\.[a-z0-9.]*[a-z0-9]'
deck = (PACK/'16-COPY-DECK.md').read_text()
rows = {}
for ln in deck.splitlines():
    m = re.match(r'^`(' + pat.replace('\\b','') + r')` \| (.*)$', ln)
    if m: rows.setdefault(m.group(1), []).append(m.group(2))
recon = (PACK/'tools/copy-reconciliation.md').read_text()
family = set(re.findall(r'^`(K\.[a-z0-9.]*[a-z0-9])` \| family \|', recon, re.M))
cited = {}
for f in sorted((PACK/'12-screens').glob('S*.md')):
    for i in set(re.findall(pat, f.read_text())):
        cited.setdefault(i, []).append(f.stem)
real = sorted(set(cited) - family)
missing = [i for i in real if i not in rows]
fam_missing = [i for i in sorted(family) if i not in rows]
dupes = [i for i, v in rows.items() if len(v) > 1]
# every alias target named in a "(uses ...)" string must itself open a row
dangling = []
for i, v in rows.items():
    for cell in v:
        s = cell.split(' | ')
        s = s[1] if s[0].startswith('S') or s[0] == 'many' else s[0]
        if s.startswith('(uses'):
            for tgt in re.findall(r'`(K\.[a-z0-9.]*[a-z0-9])`', s):
                if tgt not in rows: dangling.append((i, tgt))
print(f'cited on screens, distinct: {len(cited)}')
print(f'recorded as family references: {len(family)}')
print(f'real ids to resolve: {len(real)}')
print(f'real ids with no row in the deck: {len(missing)} {missing[:10]}')
print(f'family references with no row in section 14q: {len(fam_missing)} {fam_missing}')
print(f'ids opening more than one row: {len(dupes)} {dupes[:10]}')
print(f'alias targets that open no row: {len(dangling)} {dangling[:10]}')
print('PASS' if not (missing or fam_missing or dupes or dangling) else 'FAIL')
```

## 7. Limits

- **Not assessed:** whether each proposed string fits its screen visually. Budgets were checked by
  character count only, counting each variable as two characters.
- **Not verified:** that an alias target says what the citing screen meant in every case. Each was
  matched by reading the screen spec's own description and the deck row, not by a founder.
- **The screens were edited by another writer while this ran.** The check passed against the
  screens as they stood at the end; a later edit that adds a new `K` id will make it fail again,
  which is the check doing its job.
- **What would falsify this file:** a cited `K` id with no row in the deck, a `[gen]` row whose
  string is not on its cited line at `f237ece`, or an alias whose target does not open a row. The
  check in section 6 tests the first and third; `classify.py` in the session tested the second.
