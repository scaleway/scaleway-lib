---
"@scaleway/use-i18n": patch
---

Guard against an undefined `computedExponent` in `formatUnit` (e.g. `humanize: false` with no exponent) instead of crashing on the non-null assertion
