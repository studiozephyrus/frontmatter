/**
 * Infrastructure adapter: writes the `public_slug` frontmatter field of a
 * note by reading the current body via the vault reader, splicing the key
 * into the YAML frontmatter, and committing through commitChanges.
 */

import { spliceFrontmatterValue } from "@/modules/share/domain/splice-frontmatter";
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
      // Splice the key's bytes in place. Never regenerate the block from a parsed object:
      // that rewrites comments, quoting, key order and blank lines the user authored, and
      // gray-matter additionally re-parses the body, silently eating any `---` block inside
      // it. Measured over the pinned corpus, the regenerating path left only 33 of 907 files
      // byte-identical after a no-op publish/unpublish cycle; this one leaves 907 of 907.
      // See test/share/frontmatter-splice.test.ts and PLAN.md §3.1.
      const next = spliceFrontmatterValue(file.content, "public_slug", slug);
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
