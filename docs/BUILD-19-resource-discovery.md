# BUILD 19｜Multilingual Resource Discovery & Verification

## Goal
Use BUILD 18 coverage gaps to discover real Chinese-learning resources by interface language, verify the actual teaching language, and write only evidence-backed entries into the catalog.

## Verification order
1. Government / public education source
2. School / university / established education provider
3. Dedicated learning platform or app with explicit teaching-language evidence
4. English fallback only when a mother-tongue resource is unavailable

## Required catalog evidence
A resource may set `languageVerified: true` only when the reviewed page explicitly shows that the learning content is taught or explained in that language. A translated marketing page alone is not sufficient.

Required fields for a verified multilingual entry:
- `teachingLanguages`
- `languageVerified: true`
- `languageEvidenceUrl`
- `checkedAt`
- `status: 'verified'`
- `license: 'link-only'`

## First verified batch — 2026-10-16
- Myanmar BOC — Burmese Chinese lessons, free, grammar/conversation
- GoGo Chinese Myanmar — Burmese explanations from Pinyin through vocabulary, grammar and conversation
- BFL School Cambodia — Khmer Chinese materials including Khmer grammar lessons and HSK vocabulary tools
- Mandarin Master — full Tagalog/English support for Filipino learners
- Belajar Bahasa Cina (Mandarin) — Mandarin taught through Bahasa Melayu
- Taiwan Workforce Development Agency migrant-learning notice — official confirmation of Indonesian, Vietnamese, Tagalog and Thai Chinese-learning versions

## Safety / editorial rule
The hub links to third-party resources. Verification means the stated teaching language and basic resource description were checked; it does not imply LIFE RIVER endorsement, partnership, ownership, or permanent availability.
