# Traditional-first Chinese learning · dual-script presentation

## Product decision
- Primary learning target: Taiwanese Traditional Chinese (zh-Hant-TW), including Taiwan vocabulary and usage.
- Simplified Chinese native speakers are explicitly supported as learners of Traditional Chinese.
- Learner interface language, learner's native language, target script, and comparison script are separate fields.
- For non-Chinese native speakers, first-party example sentences display Traditional and Simplified side by side by default, together with the learner's native-language explanation and Pinyin. Offer Traditional-only and Simplified-only viewing preferences, without changing the primary learning objective.
- For zh-CN native speakers, Traditional is the main lesson text, Simplified is comparison text, with differences highlighted when verified. No forced Pinyin for fluent Chinese readers.
- For zh-TW native speakers, Traditional is the default; comparison is optional.
- Do not equate simplified characters with Mainland pronunciation, and do not automatically replace Taiwanese lexical forms with regional alternatives.
- The current 15 interface locales remain intact pending a separately tested addition of zh-CN. Add simplified native-language support explicitly rather than misclassifying zh-CN as English fallback.

## Example data contract
Each first-party example stores: id, traditional, simplified, pinyin, translations by native language, and optional reviewed character/term differences. Characters that are identical may stay identical in both fields. Do not generate characters with naive string substitution; conversions and lexical alternatives require review.
Third-party resource descriptions may link to the original website, but do not imply the website supports both scripts. Respect resource rights and source metadata.

## Roadmap
1. Add normalized first-party dual-script example data model and tests.
2. Add user-facing native-language/script preference controls; preserve existing resources and paths.
3. Localize zh-CN UI as an additional locale after i18n coverage and visual checks.
4. Support parallel Traditional/Simplified example cards with accessible labels and correct Pinyin; Taiwanese Zhuyin can be offered separately.
5. Run test, build, and 15+ language responsive review before merge. Deploy only after validation.
