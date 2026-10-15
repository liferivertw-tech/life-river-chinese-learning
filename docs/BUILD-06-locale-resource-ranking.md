# BUILD 06 — Full locale + native-language resource discovery

## Binding product rule
Changing the selected language must update **all visible site-owned UI text** (navigation, hero, search, category names, filters, resource summaries, buttons, empty states, warnings, footer). No mixed-language UI presented as fully translated. Any missing translation must be clearly marked as incomplete, not silently shipped.

The resource catalog is **native-language-first**. For selected locale L:
1. Rank verified Chinese-learning resources that actually **teach in L** first.
2. If coverage is insufficient, supplement with verified English-language teaching resources.
3. Put other-language materials in a clearly labeled optional section, never misrepresent them as L-language instruction.
4. For English users, do not duplicate the English fallback tier.
5. Chinese script (Traditional/Simplified) is a separate dimension from the teaching language. Prefer Taiwan Traditional Chinese resources when comparable.
6. Do not claim a resource is available in L just because its homepage or menus have an L translation.

## Data model
resource_id, canonical_url, title, provider, category_ids[], topic_tags[], teaching_languages[], interface_languages[], target_learner_languages[], explanation_by_locale{}, chinese_script, learning_levels[], resource_type, pricing, attribution, license_status, verification_status, reviewed_at, checked_at, link_status, language_evidence_url, evidence_notes.

Resource discovery: source discovery -> deduplicate canonical URLs -> inspect teaching-language evidence -> rights/link check -> human review -> publish. Automated collection may add candidates, never auto-publish.

## UI requirements
- Locale preference persists between page visits where permitted; HTML lang matches selected locale.
- Fully translate all site-owned labels for every shipped locale; maintain translation coverage report and native-speaker review status.
- Search across localized metadata and original titles; filters for category, proficiency, teaching language, free/paid, format, and script.
- Display native-language results separately from English supplementary results, with counts and source language badges.
- When no verified native-language resources exist, show a localized honest empty state; never fabricate results.
- Keyboard accessible language selector; high contrast in native select and option menus, including dark mode.

## Acceptance
Test each of 15 locales, including right-to-left/complex-script font coverage where relevant, and verify full page labels, metadata, resource ranking, empty states and fallback. Preserve existing resource-first homepage and postpone original course development.
