import { describe, it, expect } from "vitest";
import { EditorState } from "@codemirror/state";
import {
  aiSuggestion,
  aiSuggestionField,
  showAiSuggestion,
  clearAiSuggestion,
} from "@/modules/editor/presentation/ai-suggestion";

function state(doc: string): EditorState {
  return EditorState.create({ doc, extensions: [aiSuggestion] });
}

describe("aiSuggestionField", () => {
  it("starts null (no suggestion)", () => {
    expect(state("hello").field(aiSuggestionField)).toBeNull();
  });

  it("records a range on showAiSuggestion", () => {
    const s = state("hello world");
    const next = s.update({ effects: showAiSuggestion.of({ from: 0, to: 5 }) }).state;
    expect(next.field(aiSuggestionField)).toEqual({ from: 0, to: 5 });
  });

  it("clears on clearAiSuggestion", () => {
    const s = state("hello").update({ effects: showAiSuggestion.of({ from: 0, to: 3 }) }).state;
    const cleared = s.update({ effects: clearAiSuggestion.of(null) }).state;
    expect(cleared.field(aiSuggestionField)).toBeNull();
  });

  it("maps the range forward when text is inserted BEFORE it", () => {
    // doc "0123456789", suggestion covers [4,8)
    const s = state("0123456789").update({ effects: showAiSuggestion.of({ from: 4, to: 8 }) }).state;
    // insert 3 chars at position 0 → range shifts by +3
    const next = s.update({ changes: { from: 0, insert: "XYZ" } }).state;
    expect(next.field(aiSuggestionField)).toEqual({ from: 7, to: 11 });
  });

  it("keeps the range stable when text is inserted AFTER it", () => {
    const s = state("0123456789").update({ effects: showAiSuggestion.of({ from: 0, to: 4 }) }).state;
    const next = s.update({ changes: { from: 9, insert: "ZZ" } }).state;
    expect(next.field(aiSuggestionField)).toEqual({ from: 0, to: 4 });
  });

  it("clears when an edit collapses the range to empty", () => {
    const s = state("0123456789").update({ effects: showAiSuggestion.of({ from: 4, to: 6 }) }).state;
    // delete the whole [4,6) span → mapped to <= from → field self-clears
    const next = s.update({ changes: { from: 3, to: 7, insert: "" } }).state;
    expect(next.field(aiSuggestionField)).toBeNull();
  });

  it("a later showAiSuggestion replaces an earlier one", () => {
    let s = state("0123456789").update({ effects: showAiSuggestion.of({ from: 0, to: 2 }) }).state;
    s = s.update({ effects: showAiSuggestion.of({ from: 5, to: 9 }) }).state;
    expect(s.field(aiSuggestionField)).toEqual({ from: 5, to: 9 });
  });
});
