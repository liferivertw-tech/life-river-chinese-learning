# BUILD 21｜Multilingual Search Discovery Adapter

## Purpose
Connect the BUILD 20 Review Queue to real web-search providers without allowing search results to bypass editorial verification.

## Providers
- Bing Web Search API: configure `BING_SEARCH_KEY`.
- Google Programmable Search: configure `GOOGLE_CSE_KEY` and `GOOGLE_CSE_CX`.
- If no provider is configured, discovery remains safe and reports `no-search-provider-configured`.

## Flow
Coverage Matrix → discovery tasks → search provider → normalized candidates → Review Queue → language verification → editorial review → production catalog.

Search results are **never** promoted automatically.

## Commands
`npm run discover -- --max-tasks=10 --queries-per-task=1`

Optional:
- `--provider=bing`
- `--provider=google`
- `--locale=th`
- `--out=review-queue/discovered-resources.json`

## Candidate semantics
Search results use `languageClaimed` while `teachingLanguages` stays empty until a human or evidence-based verifier confirms the teaching language. This avoids treating a translated search snippet or navigation page as proof.

## Security
API keys are read only from environment variables and are never written into queue files, catalog data, logs, or Git history.
