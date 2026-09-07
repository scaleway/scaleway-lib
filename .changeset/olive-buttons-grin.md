---
"@scaleway/regex": patch
---

Migrate all regexes to the `v` (unicodeSets) flag. Fix `email` to allow `&` and reject the smart-quote, fix the `uppercaseBasicDomain`/`uppercaseBasicSubdomain` negative-lookahead, and anchor `dashedIpv4` so it no longer matches partial/invalid values (e.g. `1-2-3-4-5`). Add edge-case tests across all regexes.
