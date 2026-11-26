---
'@scaleway/scouter': patch
---

Fix `matchPath` to decode route params with `decodeURIComponent` instead of `decodeURI`, so encoded reserved characters (e.g. `%2F`, `%23`) are decoded like react-router v5 did, and malformed percent sequences (e.g. `/files/100%`) no longer throw a `URIError` — the raw value is returned instead.
