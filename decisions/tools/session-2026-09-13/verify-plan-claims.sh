#!/bin/bash
# Verify the load-bearing claims from the five research reports before they go into the plan.
FM=/Users/sagnikmitra/Desktop/GitHub/frontmatter; MD=/Users/sagnikmitra/Desktop/GitHub/md
cd "$FM" || exit 2
echo "== code"
sed -n '1,8p' 'src/app/(vault)/page.tsx' | tr '\n' ' '; echo
ls src/app; ls 'src/app/(workspace)' 2>&1 | head -3
printf 'GITHUB_REPO default: '; sed -n '86p' src/config/env.ts
printf 'ALLOWED_GH_LOGIN:    '; sed -n '47p' src/config/env.ts
sed -n '5,10p' src/modules/auth/domain/allowlist.ts
printf 'Firestore I/O calls in src (excluding init): '; grep -rlnE 'setDoc\(|addDoc\(|updateDoc\(|getDoc\(|getDocs\(|collection\(' src | wc -l
printf 'KnowledgeUI firestore mentions: '; grep -ciE 'firestore|setDoc|collection\(' src/modules/app-shell/presentation/KnowledgeUI.tsx
printf 'public slug robots: '; grep -nE 'index:|follow:' 'src/app/(public)/[slug]/page.tsx' | tr '\n' ' '; echo
printf 'test files frontmatter/md: '; find test -name '*.test.*' 2>/dev/null | wc -l | tr -d ' '; printf ' / '; (cd "$MD" && find test -name '*.test.*' 2>/dev/null | wc -l | tr -d ' '); echo
printf 'generate-doc kinds: '; sed -n '21,28p' src/modules/ai/application/generate-document.ts | tr -s ' \n' ' '; echo
echo "== corpus quotes"
sed -n '171p' docs/PRODUCT-BRIEF.md
sed -n '227,231p' docs/PRODUCT-BRIEF.md
sed -n '343,349p' docs/HANDOVER-ANSWERS-2026-09-09.md
B=docs/research/agent-reports-2026-08-29-r8to10/b1-spec-driven-development-market.md
grep -nE 'SPECMINE|581|73,030|Tessl|OpenSpec' "$B" | head -6 | cut -c1-220
echo "== live"
curl -s https://api.github.com/repos/github/spec-kit | grep -E '"stargazers_count"|"pushed_at"' | tr -d ' \n'; echo
curl -s https://api.github.com/repos/eyaltoledano/claude-task-master | grep -E '"stargazers_count"|"pushed_at"' | tr -d ' \n'; echo
curl -sL --compressed -A 'Mozilla/5.0' https://developers.cloudflare.com/r2/pricing/ | sed -e 's/<[^>]*>/ /g' | tr -s ' \n' ' ' | grep -oE 'Storage[^|]{0,60}0\.015[^|]{0,40}|10 GB-month[^.]{0,60}|Class A Operations[^.]{0,60}4\.50[^.]{0,30}|Egress[^.]{0,50}Free' | head -4
curl -sL --compressed -A 'Mozilla/5.0' https://www.w3.org/2001/tag/doc/capability-urls/ | sed -e 's/<[^>]*>/ /g' | tr -s ' \n' ' ' | grep -oiE '.{0,80}120 bits.{0,60}|.{0,60}should expire.{0,40}' | head -3
curl -sL --compressed -A 'Mozilla/5.0' https://docs.claude.com/en/docs/agents-and-tools/tool-use/web-fetch-tool | sed -e 's/<[^>]*>/ /g' | tr -s ' \n' ' ' | grep -oiE '.{0,60}previously appeared.{0,80}' | head -2
curl -sL --compressed -A 'Mozilla/5.0' https://www.codeguide.dev/pricing | sed -e 's/<[^>]*>/ /g' | tr -s ' \n' ' ' | grep -oE '\$2[49][^a-z]{0,6}[a-z /]{0,25}' | head -4
date -u +%Y-%m-%d
