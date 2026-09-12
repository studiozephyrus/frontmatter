---
mdmap-node: 1
title: Semantic zoom — the Google Maps ladder
parent: MAP.md
status: written
---

# Semantic zoom

The most-requested mechanic in the entire demand corpus, stated independently by notes
users and by developers, in almost the same words:

> "It uses Google Maps as an excellent example: when we look at the planet, we see
> countries. When we zoom in, we start seeing cities and streets. If we zoom in further, we
> see buildings. One needs cues to orient ourselves."

> "I always wished I could zoom out and see an entire codebase like Google Maps."

Nobody ships it properly. Obsidian Canvas has a two-state version — a setting literally
named *"Zoom threshold for hiding card content"* — with two documented failures: it
**does not apply to images**, so image-heavy canvases stay "almost unusable," and there is a
**hard-coded floor below which labels vanish anyway**, overriding the user's setting.
tldraw has no unified system at all; its own issue #8307 describes the state as *"ad-hoc
zoom-level checks"* scattered across shape utils.

## The ladder

Four tiers, explicit, with the map's own semantics deciding what appears at each:

| tier | zoom | what renders |
|---|---|---|
| **z0 — regions** | < 0.25 | named regions only, sized by rank, coloured by health. Gap counts on the badge. No documents. |
| **z1 — documents** | 0.25–0.6 | document titles inside their region. Edges bundle to region level. |
| **z2 — structure** | 0.6–1.0 | headings within each document; typed edges resolve to specific headings |
| **z3 — content** | > 1.0 | the document itself, rendered markdown, **editable in place** |

z3 is the one that makes it a workspace rather than a viewer — and it is only affordable
because the cards are DOM/CodeMirror, not WebGL sprites. That is the trade
[[rendering]] makes deliberately.

## The mechanic that makes it cheap

Steal tldraw's debounce, which is the single most transferable implementation detail found
in the research. Above a **500-shape** threshold, `getEfficientZoomLevel()` returns a
*debounced, stale* zoom during camera motion and only settles **64 ms after the camera
stops**. Every LOD decision reads the debounced value, never the live one.

Consequence: a pinch-zoom crossing three tier boundaries triggers **one** re-render at the
end, not sixty during the gesture. Without this, semantic zoom is the thing that makes your
canvas feel worse than no canvas.

Excalidraw's complementary trick: during an active zoom gesture it sets
`shouldCacheIgnoreZoom` and lets cached bitmaps scale blurrily, re-rasterizing only on
settle. Blurry-then-sharp beats stuttering-and-sharp.

## Labels must not scale

Frame and region labels are divided by the current zoom so they stay a **constant
on-screen size**. tldraw does this and it is why their frame titles remain legible when
zoomed out; Obsidian's do not and it is why theirs disappear.

At z0 the region label is the *only* thing on screen. It has to be readable, which means it
must be authored — see [[../02-evidence/graphify-hairball]] for what happens when 96.5% of
your regions are called `Community 214`.

## What z0 shows that no existing tool does

At the top of the ladder the map is not showing documents at all. It is showing **health**:

```
┌──────────────┐  ┌──────────────┐  ┌ ─ ─ ─ ─ ─ ─ ┐
│  editor      │  │  repository  │    collab
│  9 docs      │  │  14 docs     │  │  0 docs     │
│  ● 3 gaps    │  │  ● clean     │    ○ planned
└──────────────┘  └──────────────┘  └ ─ ─ ─ ─ ─ ─ ┘
```

Dashed outline = a region that is planned and empty. Red edge = broken. Grey wash = a
region of the repo no map claims. That is the shape of the hole, and it is only visible
from altitude.

## The zoom that search performs

Excalidraw's search rule is exactly right and worth copying verbatim: on focusing a match,
check whether it is both *visible* and *legible*. **If the text would render smaller than
14 px at current zoom, or is outside the viewport, zoom in (`contain`); otherwise pan only
(`scale-down`).** 300 ms animation, 350 ms input debounce, results sorted by vertical
position.

Search never yanks you out of your current altitude unless legibility demands it. That one
rule is the difference between a search that helps and a search that disorients.

## The caution

Bederson — who built Pad++ and Piccolo — concluded in 2011 that *"the grand vision of a
zoomable desktop has never been broadly achieved,"* that several commercial ZUI ventures
disappeared, and that surviving interest shows *"significantly scaled back expectations as
to where zooming can be useful,"* with disorientation named as the trade-off.

Read that as: **zoom is a feature, not a paradigm.** The file tree and Cmd+K stay primary.
The map is a mode you enter and leave, and every level must show a breadcrumb so leaving is
always one click.

---

**Sources:** tldraw `options.ts` / `NoteShapeUtil.tsx` / `constants.ts` · Excalidraw
`SearchMenu.tsx` and `renderElement.ts` · forum.obsidian.md/t/90210 and /t/78352 ·
tldraw#8307 · Bederson, *Behaviour & Information Technology* 30(6), 2011 · demand quotes
via Reddit, 2026-07-29.
