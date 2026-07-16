/**
 * Infrastructure adapter: writes the `public_slug` frontmatter field of a
 * note by reading the current body via the vault reader, splicing the key
 * into the YAML frontmatter, and committing through commitChanges.
 */

import matter from "gray-matter";
import type { ShareWriter } from "@/modules/share/application/ports";
import type { CommitRequest, CommitResult } from "@/modules/repository";
import type { VaultReader } from "@/modules/vault";

export function makeShareWriter(deps: {
  reader: VaultReader;
  commitChanges: (req: CommitRequest) => Promise<CommitResult>;
}): ShareWriter {
  return {
    async writeSlug(path, slug) {
      const file = await deps.reader.getFile(path);
      const parsed = matter(file.content);
      const data: Record<string, unknown> = { ...(parsed.data as Record<string, unknown>) };
      if (slug === null) {
        delete data["public_slug"];
      } else {
        data["public_slug"] = slug;
      }
      const next = matter.stringify(parsed.content, data);
      const result = await deps.commitChanges({
        files: [{ path, content: next, baseSha: file.sha }],
        message: slug === null
          ? `share: unpublish ${path}`
          : `share: set public_slug=${slug} on ${path}`,
      });
      // Return the latest blob sha so the caller can chain writes.
      return { sha: result.commitSha };
    },
  };
}
