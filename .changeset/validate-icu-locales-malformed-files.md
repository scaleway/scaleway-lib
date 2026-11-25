---
'@scaleway/validate-icu-locales': patch
---

Malformed locale files now fail the run instead of being silently skipped with exit code 0: broken JSON reports `INVALID_JSON`, modules that fail to import report `IMPORT_FAILED`, missing default exports report `MISSING_DEFAULT_EXPORT`, and default exports that are not objects of string values — arrays included — report `INVALID_LOCALES_FILE`. Non-string values no longer surface as bogus ICU parser errors.
