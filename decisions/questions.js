/* Placeholder — replaced when the extraction round lands. */
window.QUESTIONS = [
{ id:"P1", cat:"Product & definition", sub:"The headline", weight:"critical",
  q:"Does review state stay the product headline after the adversarial round came back against it?",
  lede:"The plan's page one was attacked on 2026-09-08 and did not survive as written.",
  now:"Plan v15 §1 states the product as review state, and immediately labels it a hypothesis under test.",
  why:"It was synthesised from the refutation of three earlier headlines — byte-exactness, authorship and answer-in-place — and shipped without being attacked itself.",
  problem:"The demand evidence does not say what we said it says, and three separate stores show the feature already built and unwanted.",
  evidence:[
    { type:"stat", title:"What the round measured",
      items:[["Texts on issue #33932 asking for persistence","0 of 36","the ask is a per-session panel"],
             ["Installs across 13 markdown-review VS Code extensions","1,217","ceiling 400"],
             ["mddiff — our sentence, shipped 2026-06-03","74 installs",""],
             ["Obsidian forum likes: review state vs the rendering bug","0 vs 501","same forum, same metric"]] }
  ],
  options:[
    { k:"a", label:"Confirm it as written", impact:"Keeps the plan intact and bets that three stores are wrong. No evidence supports this today." },
    { k:"b", label:"Narrow to the working tree with no pull request", impact:"The one container GitHub, Google, Reviewable and Graphite all require and an agent writing locally does not have. Smaller claim, still unoccupied." },
    { k:"c", label:"Demote to a feature and lead with spec-kit self-certification", impact:"“Your checklist is green because the agent ticked it” — 354 of 355 boxes ticked by the agent. Changes the pitch, keeps the engine." },
    { k:"d", label:"Stop and test before deciding", impact:"Two weeks, three headline arms, no build. Delays everything by a fortnight and answers it properly." }
  ],
  rec:"b",
  recCase:"The narrowed claim is the only part of the thesis no incumbent covers, and it survives every number the round produced. It would change if the two-week test shows people do not recognise the working-tree case as their problem.",
  sources:["docs/PRODUCT-BRIEF.md:18","docs/GAPS-2026-09-08.md round 2"] }
];
