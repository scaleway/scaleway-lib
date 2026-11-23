---
"@scaleway/scouter": patch
---

useSafeQueryParams issue when parsing an array schema should return array of string instead of just string.

`useSafeQueryParams` and `getSafeQueryParams` now accept a `treatKeysAsArray` option listing the query param keys that must be parsed as arrays, so a single value like `?tags=admin` becomes `['admin']`.
