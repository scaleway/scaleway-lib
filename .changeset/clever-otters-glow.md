---
"@scaleway/use-analytics": patch
---

Use `codePointAt` instead of `charCodeAt` in `stringToHash` so hashes are consistent for surrogate-pair characters
