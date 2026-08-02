#!/usr/bin/env python3
"""
Generate the golden input set for normalize/1 and slug/1. (PLAN §3.8.2)

Run once to create test/mdmax/fixtures/pure-function-golden.json. The fixture is APPEND-ONLY
thereafter: removing or editing a case moves the digest and is indistinguishable from a
regression in the functions themselves.

Invisible characters are written as escapes, never as literals, so the file stays reviewable in
a terminal and in a diff.
"""
import json
from collections import Counter

cases = []


def add(cat, s):
    cases.append({"category": cat, "input": s})


# --- plain ascii ------------------------------------------------------------------
for s in ["Hello World", "Introduction", "API Reference", "Getting Started", "FAQ",
          "Step 1", "Step 2: Setup", "3. Environments", "the end.", "A"]:
    add("ascii", s)

# --- punctuation github-slugger strips; the `&` double-dash case lives here --------
for s in ["Personas & Use Cases", "Roles & Permissions", "Plans & Quotas", "Q&A",
          "What's New?", "Don't Panic!", "C++ vs Rust", "Node.js / Deno", "50% off",
          "foo(bar)", "[bracketed]", "{braced}", "<html>", "a,b,c", "semi;colon",
          "back\\slash", "pipe|char", "star*", "plus+", "equals=", "tilde~", "caret^",
          "at@sign", "hash#tag", "dollar$", "percent%", 'quote"d', "apos'trophe"]:
    add("punctuation", s)

# --- whitespace variants — normalize/1's territory ---------------------------------
for s in ["  leading", "trailing  ", "  both  ", "multiple   spaces",
          "tab\there", "new\nline", "carriage\r\nreturn",
          "non breaking", "zero​width", "ideographic　space",
          "verticaltab", "formfeed", "en quad", "em quad",
          "thin space", "narrow nbsp", "bom﻿here",
          "", " ", "   "]:
    add("whitespace", s)

# --- unicode / normalisation: NFC vs NFD pairs must collapse together --------------
for s in ["Café", "Café", "ÅNGSTRÖM", "Ångström",
          "naïve", "ﬁle", "Ⅻ roman", "ｆｕｌｌ",
          "ß sharp", "SS sharp", "ǆ digraph",
          "Ω ohm", "Ω greek", "µ micro", "μ greek"]:
    add("unicode", s)

# --- non-BMP: the surrogate-pair cases the offset model exists for -----------------
for s in ["Emoji \U0001f600 heading", "Family \U0001f468‍\U0001f469‍\U0001f467‍\U0001f466 here",
          "Flag \U0001f1ee\U0001f1f3 India", "Skin \U0001f44d\U0001f3fd tone",
          "Math \U0001d54f double", "Ancient \U00010300 italic", "Music \U0001d11e clef",
          "Rocket \U0001f680", "\U0001f389", "\U0001f600\U0001f600\U0001f600",
          "Mixed \U0001f600 text \U0001f680 more"]:
    add("non-bmp", s)

# --- CJK / RTL / Indic -------------------------------------------------------------
for s in ["日本語の見出し", "中文标题",
          "한국어 제목", "العربية عنوان",
          "עברית כותרת",
          "हिन्दी शीर्षक",
          "বাংলা শিরোনাম",
          "ไทย หัวข้อ",
          "Ελληνικά", "Русский"]:
    add("scripts", s)

# --- combining marks / grapheme clusters -------------------------------------------
for s in ["é̂̃ stacked", "à́̂̃̄",
          "básic", "क्ष ksha", "ọ̈ two marks"]:
    add("combining", s)

# --- structural edge cases ---------------------------------------------------------
for s in ["---", "###", "# #", "-", "--", "---dashes---", "-leading-dash",
          "trailing-dash-", "a--b", "a---b", "a - b", "a-b", "1-2-3", "...",
          "!!!", "???", "___", "*", "0", "00", "007", "-1", "1.5", "1e10"]:
    add("edge", s)

add("edge", "x" * 300)
add("edge", "word " * 60)
add("edge", "Ünïcödé " * 30)

# --- markdown inline syntax inside a heading ---------------------------------------
for s in ["**bold heading**", "*italic*", "`code`", "[link](url)", "![img](src)",
          "<em>tag</em>", "<!-- comment -->", "~~strike~~", "> quote", "| table |"]:
    add("inline-md", s)

# --- duplicates, kept adjacent so slugDocument's de-dup counter is exercised --------
for s in ["Duplicate", "Duplicate", "Duplicate", "dup", "DUP", "Dup"]:
    add("dedup", s)

# --- deterministic padding to 200; no randomness, so the file is reproducible -------
i = 0
while len(cases) < 200:
    add("generated", f"Generated Heading {i} — with em dash & symbols ({i % 7})")
    i += 1

for k, v in sorted(Counter(c["category"] for c in cases).items()):
    print(f"  {k:14s} {v}")
print(f"  {'TOTAL':14s} {len(cases)}")

with open("test/mdmax/fixtures/pure-function-golden.json", "w") as f:
    json.dump(
        {
            "_comment": (
                "Golden inputs for normalize/1 and slug/1. APPEND-ONLY: removing or editing a "
                "case moves the digest and is indistinguishable from a regression in the "
                "functions themselves. Add new cases at the end only."
            ),
            "generator": "scripts/gen-golden-cases.py",
            "count": len(cases),
            "cases": cases,
        },
        f,
        ensure_ascii=True,
        indent=1,
    )
