# BUILD 20｜Automated Resource Collector & Review Queue

## Goal
Turn BUILD 18 coverage gaps into executable discovery tasks and prevent unverified resources from entering the production catalog.

## Pipeline
1. Coverage Matrix identifies non-native cells.
2. `buildDiscoveryTasks()` creates language + learning-node tasks.
3. Search/adapters return candidate resources.
4. `normalizeUrl()` strips tracking noise.
5. `isDuplicateCandidate()` rejects existing or queued URLs.
6. `validateCandidate()` checks required metadata and language evidence.
7. `queueCandidate()` places the item into editorial review.
8. Only candidates with verified teaching language evidence can be promoted.
9. `promoteCandidate()` prepares a catalog-ready verified record.

## Review states
- `queued`: discovery task not yet searched.
- `needs-language-verification`: candidate exists but teaching-language evidence is incomplete.
- `ready-for-editorial-review`: language evidence and metadata passed structural checks.
- `verified`: editorially accepted resource eligible for the production catalog.

## Hard rule
A translated navigation page or marketing landing page is not enough to set `languageVerified=true`. Evidence must show that actual teaching content, explanations, lessons, or learning instructions use the claimed language.

## Commands
- `npm run queue:build` prints the generated discovery queue as JSON.
- `npm run queue:build -- review-queue.json` writes the queue to a file.
- `npm test` runs collector and existing tests.

## Future adapters
External web search, official-site crawlers, YouTube discovery, and provider-specific APIs should feed the same review queue contract rather than writing directly to `src/catalog.js`.
