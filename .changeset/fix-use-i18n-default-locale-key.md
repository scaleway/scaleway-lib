---
"@scaleway/use-i18n": patch
---

Fix TypeError crash when `loadTranslations` uses literal key `"defaultLocale"` instead of the variable's value, and add optional chaining to prevent crash when `load()` returns `undefined`.
