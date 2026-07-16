"use client";

import { Backlinks } from "@/modules/preview/presentation/Backlinks";
import { Outline } from "@/modules/preview/presentation/Outline";
import { TagsPanel, BookmarksPanel } from "@/modules/preview/presentation/KnowledgePanels";
import { UnlinkedMentions } from "@/modules/preview/presentation/UnlinkedMentions";

const headingClass = "mb-1.5 text-xs font-semibold uppercase tracking-wide";
const headingStyle = { color: "var(--muted)" } as const;

export function RightPane() {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-3">
      <section>
        <h2 className={headingClass} style={headingStyle}>Backlinks</h2>
        <Backlinks />
      </section>

      <section>
        <h2 className={headingClass} style={headingStyle}>Unlinked mentions</h2>
        <UnlinkedMentions />
      </section>

      <section>
        <h2 className={headingClass} style={headingStyle}>Outline</h2>
        <Outline />
      </section>

      <section>
        <h2 className={headingClass} style={headingStyle}>Bookmarks</h2>
        <BookmarksPanel />
      </section>

      <section>
        <h2 className={headingClass} style={headingStyle}>Tags</h2>
        <TagsPanel />
      </section>
    </div>
  );
}
