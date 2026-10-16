# BUILD 01 — Homepage · UI/UX · Implementation

## User-first information architecture
1. Hero — start from the learner's language.
2. Learning goal — choose why you want Chinese.
3. Eight-stage path — show the next step, not a backend dashboard.
4. Recommended resources — native-language first, English only to fill a native-language gap.
5. Twelve categories — browse by learning topic.
6. Resource attributes — free/paid, level, teaching language, script, verification.
7. Resource gaps — show actionable gaps without exposing the internal coverage matrix.

## Responsive rule
Desktop and mobile use the same content hierarchy. Mobile changes the layout to a single-column flow and keeps the language selector visible.

## Data boundary
BUILD 17–22 resource intelligence remains the source of truth. The homepage only projects learner-friendly views of that data; it does not change discovery, review, or evidence-verification logic.

## Verification
CI runs `npm test` and `npm run build` on homepage BUILD branches and pull requests.
