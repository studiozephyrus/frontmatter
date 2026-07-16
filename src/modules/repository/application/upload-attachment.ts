/**
 * Application use-case: UploadAttachment.
 *
 * Commits a binary file to the `_attachments/` directory with a timestamp
 * prefix, using the repository writer's binary blob API.
 *
 * Pure application logic: no framework, no infrastructure, no env access.
 */

import type { RepositoryWriter } from "./ports";
import type { CommitAuthor } from "@/modules/repository/domain/commit";

export type UploadAttachmentInput = {
  /** Sanitised filename — only [\w.-]+ characters, validated by caller. */
  filename: string;
  /** Raw binary content encoded as base64 (no data URL prefix). */
  dataBase64: string;
};

export type UploadAttachmentResult = {
  /** Vault-relative path where the attachment was committed. */
  path: string;
  commitSha: string;
};

/**
 * Builds a `YYYYMMDD-HHMMSS` timestamp string from a Date.
 * Exported for unit-testing in isolation.
 */
export function formatTimestamp(d: Date): string {
  const pad = (n: number, len = 2): string => String(n).padStart(len, "0");
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `-${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}`
  );
}

export function makeUploadAttachment(deps: {
  writer: RepositoryWriter;
  author: CommitAuthor;
}): (input: UploadAttachmentInput) => Promise<UploadAttachmentResult> {
  const { writer, author } = deps;

  return async function uploadAttachment({
    filename,
    dataBase64,
  }: UploadAttachmentInput): Promise<UploadAttachmentResult> {
    const ts = formatTimestamp(new Date());
    const path = `_attachments/${ts}-${filename}`;

    const head = await writer.getHeadCommit();
    const blobSha = await writer.createBinaryBlob(dataBase64);
    const treeSha = await writer.createTree(head.treeSha, [{ path, sha: blobSha }]);
    const commitSha = await writer.createCommit(
      `Upload attachment ${filename}`,
      treeSha,
      head.commitSha,
      author,
    );
    await writer.updateRef(commitSha);

    return { path, commitSha };
  };
}
