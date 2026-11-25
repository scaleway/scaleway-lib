---
'@scaleway/validate-icu-locales': minor
---

New `APOSTROPHE_ESCAPES_PLACEHOLDER` check: a single apostrophe directly before a placeholder (`l'{count}`) escapes it in ICU, rendering the literal text and never substituting the variable. The validator now reports it; doubling the apostrophe (`l''{count}`) keeps it a real apostrophe with a live placeholder.
