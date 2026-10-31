# BUILD 08 — Homepage integration baseline (2026-10-29)

## Verified baseline
- main: aa9da745885a8d081d6d6bc87b123c03491aec62
- PR #11: OPEN DRAFT, not merged; homepage navigation, accessibility, filters, visual tests.
- PR #13: OPEN DRAFT, not merged; traditional-first example model and six tests.
- Stack: Vite 6, ES modules, Node test runner, Playwright.
- No deployment authorized in this build.

## Integration rules
1. Keep existing 15 locales, 12 categories, 8 stages, and resource intelligence.
2. Integrate #11 changes without overwriting unrelated main functionality.
3. Reuse #13 src/dual-script-examples.js contract rather than recreating it.
4. Add zh-CN as the sixteenth locale in BUILD 09, with explicit native language, interface locale, target script, comparison script, and phonetic notation settings.
5. Traditional (Taiwan) remains primary; do not conflate script conversion with Taiwanese vocabulary substitution.
6. Retain existing visual design, and test mobile and desktop.
7. Run npm test, npm run build, npm run verify:visual (browser availability permitting) before any PR merge.

## Acceptance gates
- All 15 original locales still work.
- Existing filters and learning paths remain functional.
- No duplicate module or unreviewed example conversions.
- Existing tests pass; new homepage interaction tests added.
- Report actual test results, commit hashes and preview instructions; never claim deployment without verification.

## Implementation status
This commit records the verified baseline and acceptance contract only. UI code integration and runtime tests remain pending.
