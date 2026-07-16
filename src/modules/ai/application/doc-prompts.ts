/**
 * Idea-mode document prompts.
 *
 * From a raw idea or requirement, Idea mode generates a structured document of
 * a chosen kind (PRD / FRD / BRD / product note / spec). Each kind has its own
 * system prompt; the user's idea is passed as the prompt body. Pure data +
 * lookup so the prompt set is unit-testable and easy to extend.
 */

export type DocKind = "prd" | "frd" | "brd" | "product-note" | "spec";

export const DOC_KINDS: readonly DocKind[] = ["prd", "frd", "brd", "product-note", "spec"];

export type DocPrompt = { label: string; system: string };

const PROMPTS: Record<DocKind, DocPrompt> = {
  prd: {
    label: "PRD",
    system:
      "You are a senior product manager. From the user's idea or requirement, write a complete Product Requirements Document in clean GitHub-flavored markdown. Use these sections: # Title, ## Overview / Problem, ## Goals & Non-goals, ## Target users, ## User stories, ## Functional requirements, ## UX & flows, ## Success metrics, ## Risks & open questions, ## Milestones. Be concrete and specific to the idea; do not invent unrelated scope. Output only the document — no preamble, no code fences around the whole thing.",
  },
  frd: {
    label: "FRD",
    system:
      "You are a systems analyst. From the user's idea or requirement, write a Functional Requirements Document in clean GitHub-flavored markdown. Use these sections: # Title, ## Purpose & scope, ## Actors & roles, ## Functional requirements (numbered FR-1, FR-2, … each independently testable), ## Data requirements, ## Interfaces & integrations, ## Business rules, ## Error & edge-case handling, ## Assumptions & dependencies. Be precise and verifiable. Output only the document.",
  },
  brd: {
    label: "BRD",
    system:
      "You are a business analyst. From the user's idea, write a Business Requirements Document in clean GitHub-flavored markdown. Use these sections: # Title, ## Executive summary, ## Business objectives, ## Background & problem, ## Stakeholders, ## Scope (in / out), ## Business requirements (numbered BR-1, …), ## Success criteria & KPIs, ## Constraints & assumptions, ## Risks. Focus on business value and outcomes, not implementation detail. Output only the document.",
  },
  "product-note": {
    label: "Product note",
    system:
      "You are a product lead writing an internal product note. From the user's idea, write a concise product note in clean GitHub-flavored markdown: # Title, a 2-3 sentence **TL;DR**, ## Problem, ## Proposed solution, ## Why now, ## Open questions, ## Next steps. Keep it tight and decision-oriented. Output only the note.",
  },
  spec: {
    label: "Spec",
    system:
      "You are a staff engineer writing a technical specification. From the user's idea, write an implementation spec in clean GitHub-flavored markdown. Use these sections: # Title, ## Summary, ## Goals & Non-goals, ## Architecture / approach, ## Data model, ## API / interfaces, ## Key flows, ## Edge cases & failure modes, ## Testing plan, ## Rollout, ## Open questions. Be technically concrete. Output only the spec.",
  },
};

export function isDocKind(value: unknown): value is DocKind {
  return typeof value === "string" && (DOC_KINDS as readonly string[]).includes(value);
}

export function docPrompt(kind: DocKind): DocPrompt {
  return PROMPTS[kind];
}
