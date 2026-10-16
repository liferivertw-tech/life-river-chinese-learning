# BUILD 07｜Resource metadata localization honesty

## Goal

Prevent third-party resource descriptions from silently appearing as if they were translated into the selected interface language.

## Behavior

- A resource may provide locale-specific `summaryByLocale` text.
- If a localized summary exists, it is displayed in that locale.
- Traditional Chinese remains the source summary for the zh-TW interface when no localized copy is supplied.
- For other locales without a verified localized summary, the UI displays a localized "translation pending" message instead of silently showing Chinese.
- The resource's original title and provider name remain intact because they identify the third-party source.

## Acceptance

All 15 locales expose a localized pending-translation label. Existing CI and 15-language visual QA must remain green.
