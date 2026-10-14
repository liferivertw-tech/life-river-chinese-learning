# BUILD 04 — Resource Directory First (2026-10-15)

## Product split
**A — Curated online Chinese-learning resources (CURRENT PRIORITY).**
**B — Original LIFE RIVER courses (ON HOLD).** Preserve existing lesson prototype and code; do not delete it, but do not expand it in the next build.

## A — V1 scope
1. Browse 12 categories: pronunciation, Zhuyin, Hanyu Pinyin, strokes/radicals, vocabulary, grammar, listening/speaking, reading/writing, Taiwan daily life, work/school, online courses, TOCFL.
2. Filters: learner native language, resource teaching language, level, free/paid, type (website/video/PDF/app/course), topic, Taiwan Traditional Chinese compatibility.
3. Search titles, descriptions, provider names, keywords.
4. Each resource: id, title, summary (original editorial writing), source URL, provider, primary category, tags, target audience, teaching languages, script (Traditional/Simplified/both), level, type, price model, usage/license status, source last checked at, review status, link health status.
5. Human review before public listing. Automated collection only creates candidate records.
6. Store attribution and deep links; do not copy third-party course content without verified permission.
7. 15 interface locales are a product target. Unreviewed translations must be marked as drafts.

## Seed-source candidates for review
- TOCFL official: https://tocfl.edu.tw/
- National Academy for Educational Research corpus: https://coct.naer.edu.tw/
These are candidate links, not license-cleared or independently reverified records.

## Release acceptance
- At least 30 human-reviewed entries across all 12 categories (some categories may have fewer entries initially).
- Working browse, keyword search, multi-filter, resource details, source links.
- Admin candidate/review/publish workflow, link validation and source provenance.
- Mobile accessibility checks, no false claims of full localization.
- No self-produced lesson expansion in this milestone.

## Engineering boundaries
Maintain existing repository and history. New directory functionality is the primary navigation; legacy original-lesson demo can remain in source but should not be the homepage focus. Codex writes code; GitHub version control; Replit deployment only.
