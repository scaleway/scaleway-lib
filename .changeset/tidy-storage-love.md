---
"@scaleway/use-storage": patch
---

Honor falsy `initialValue` values (`0`, `false`, `''`) instead of ignoring them, and remove the effect that overwrote the local state with the stored value
