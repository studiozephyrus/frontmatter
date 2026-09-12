import json, pathlib, re

# The extraction round's raw output. Kept outside the repo because it is 1.5M of
# agent transcript; pass a different path as argv[1] to rebuild from a newer round.
import sys
SRC = sys.argv[1] if len(sys.argv) > 1 else "../.decisions-round.json"
OUT = str(pathlib.Path(__file__).with_name("questions.js"))

src = json.loads(pathlib.Path(SRC).read_text())["result"]

# Order the areas the way the meeting should read them, not the order they were extracted.
ORDER = ["Product & definition", "Form factor & surfaces", "Features", "Flow & interaction",
         "Design, UI & attention", "Engine & technical", "Access, offline & install",
         "Market & competition", "Pricing & tiers", "Go-to-market & channels",
         "Business & operations", "Legal, privacy & data", "Name & identity",
         "Plan, scope & sequencing", "Research & evidence"]
by = {a["cat"]: a for a in src["areas"]}
assert set(by) == set(ORDER), set(by) ^ set(ORDER)


def split_question(text):
    """A question may carry a trailing explanatory sentence. Keep the question in
    the heading and move the rest to the lede, rather than losing the whole item
    because it does not end in a question mark."""
    text = str(text).strip()
    if text.endswith("?"):
        return text, ""
    i = text.find("? ")
    if i > 0:
        return text[:i + 1].strip(), text[i + 2:].strip()
    return text, ""


kept, seen, not_a_question = [], set(), []
for cat in ORDER:
    for q in by[cat]["questions"]:
        qid = re.sub(r"[^\w.-]", "", str(q.get("id", "")).strip())[:24]
        if not qid or qid in seen:
            base, i = (qid or "Q"), 2
            while f"{base}.{i}" in seen:
                i += 1
            qid = f"{base}.{i}"
        seen.add(qid)
        q["id"], q["cat"] = qid, cat

        head, tail = split_question(q.get("q", ""))
        if not head.endswith("?"):
            not_a_question.append((qid, head[:70]))
            continue
        q["q"] = head
        for k in ("lede", "now", "why", "problem", "recCase", "sub", "weight"):
            q.setdefault(k, "")
        if tail:                                   # the trailing sentence leads the lede
            q["lede"] = (tail + " " + str(q["lede"])).strip()
        q.setdefault("evidence", [])
        q.setdefault("options", [])
        q.setdefault("sources", [])
        keys = {o.get("k") for o in q["options"]}
        if q.get("rec") not in keys:               # a recommendation must point at a real option
            q["rec"] = sorted(keys)[0] if keys else ""
        kept.append(q)

hdr = ("/* frontmatter — decisions.\n"
       "   %d questions extracted from two weeks of research by 15 agents, each area then\n"
       "   audited by a second agent that re-opened every citation. Schema matches the tred\n"
       "   decisions app. Generated 2026-09-09 — edit the source documents, not this file. */\n\n" % len(kept))
pathlib.Path(OUT).write_text(hdr + "window.QUESTIONS = " + json.dumps(kept, ensure_ascii=False, indent=1) + ";\n")

print("wrote", len(kept), "questions ·", pathlib.Path(OUT).stat().st_size // 1024, "KB")
print("critical", sum(1 for q in kept if q["weight"] == "critical"),
      "· evidence exhibits", sum(len(q["evidence"]) for q in kept))
print("left out (genuinely not a question):", len(not_a_question), not_a_question)
