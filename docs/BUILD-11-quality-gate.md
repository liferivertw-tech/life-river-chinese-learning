# BUILD 11 — Multilingual Resource Quality Gate

## Scope
This repository is a curated resource directory, not a provider of third-party lessons. Resource candidates are not automatically approved or endorsed.

## Verification checklist
1. Confirm the original source URL, provider, and whether the resource is still available.
2. Inspect actual teaching materials. A translated landing page is **not** proof that lessons teach Chinese in that language.
3. Record each verified teaching language and an evidence URL. Set `languageVerified: true` only after direct inspection.
4. Record intended learners, level, Traditional/Simplified script, free/paid terms, and a review date.
5. Link to third-party pages only; do not copy protected teaching content without permission.
6. For date-specific events, verify enrollment deadlines and archive expired events.

## Review statuses
- `candidate`: collected, not fully reviewed.
- `verified`: source, teaching language, and learning claims reviewed.
- `retired`: unavailable, expired, or removed.

## Commands
- `npm test`: regression tests for ranking and search.
- `npm run audit:catalog`: static metadata audit; this does **not** visit external websites.
- `npm run build`: production bundling.

## Launch gates
- Review translations with native speakers.
- Run the three commands above and record outputs.
- Test desktop and mobile, switching between Traditional Chinese, Thai, and another language repeatedly.
- Confirm all external links and pricing; do not publish unverified items as featured recommendations.
- Deploy only after a live smoke test.
