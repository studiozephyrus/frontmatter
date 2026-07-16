export type { LlmClient } from "./application/ports";
export { makeRefineText } from "./application/refine-text";
export type { RefineInput, RefineOutput } from "./application/refine-text";
export { makeSummarize } from "./application/summarize";
export type { SummarizeInput, SummarizeOutput } from "./application/summarize";
export { makeSuggestLinks } from "./application/suggest-links";
export type {
  SuggestLinksInput,
  SuggestLinksOutput,
  Suggestion,
} from "./application/suggest-links";
export { makeLinkDoctor } from "./application/link-doctor";
export type {
  LinkDoctorInput,
  LinkDoctorOutput,
  LinkDoctorNoteResult,
  LinkDoctorError,
} from "./application/link-doctor";
export { applyWikilinkSuggestion } from "./application/apply-wikilinks";
export { makeGenerateDocument } from "./application/generate-document";
export type { GenerateDocumentInput, GenerateDocumentOutput } from "./application/generate-document";
export { DOC_KINDS, isDocKind, docPrompt } from "./application/doc-prompts";
export type { DocKind, DocPrompt } from "./application/doc-prompts";
export { gatewayLlmClient } from "./infrastructure/gateway-client";
