---
'@scaleway/use-i18n': patch
---

The default-locale fallback inside `t()`'s ICU formatting path is guarded: when the primary format fails, a default-locale key that is missing or itself malformed no longer crashes the render — the second failure is reported through `onTranslateError` and `''` is returned.
