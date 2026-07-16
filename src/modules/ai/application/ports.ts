/**
 * LlmClient — port for the LLM provider. Application use-cases depend on this
 * interface; infrastructure (Vercel AI Gateway) provides the implementation.
 */
export interface LlmClient {
  generate(input: {
    prompt: string;
    system?: string;
    /** Speed-first provider ordering (ghost-text). Default = quality-first. */
    speedFirst?: boolean;
  }): Promise<string>;
}
