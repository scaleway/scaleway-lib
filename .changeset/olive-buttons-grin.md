---
"@scaleway/regex": patch
---

Fix `dashedIpv4` to be anchored so it no longer matches partial/invalid dashed IPv4 strings (e.g. `1-2-3-4-5`). Add edge-case tests across all regexes.
