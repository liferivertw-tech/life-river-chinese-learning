# BUILD 22｜Evidence-based Language Verifier

## Purpose
Scan discovered resource pages for evidence that the claimed learner language is actually used in teaching content.

## Important boundary
This is an **evidence scanner, not an automatic approval system**. A strong score means the page contains matching script/teaching-language signals. It does not set `languageVerified=true` and does not promote a resource into the production catalog.

## Signals
The scanner combines:
- language-specific script detection where useful;
- language-specific teaching terms;
- a conservative score and verdict: `strong`, `possible`, or `none`.

## Workflow
Discovery candidate → fetch evidence page → evidence score → Review Queue → human/editorial confirmation → verified catalog.

## Command
`npm run verify:queue -- --in=review-queue/discovered-resources.json --out=review-queue/evidence-scan.json`

The verifier uses only the candidate's `languageEvidenceUrl` when present, otherwise its resource URL.

## Safety
- No automatic promotion.
- No API credentials stored.
- Pages are truncated to a bounded text size.
- HTTP failures are retained as review errors rather than treated as evidence.
