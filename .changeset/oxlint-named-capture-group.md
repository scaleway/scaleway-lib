---
"@scaleway/changesets-renovate": patch
"@scaleway/regex": patch
"@scaleway/sync-peer-deps": patch
---


This rule requires that capturing groups in regexes be explicitly named or converted to non-capturing when the captured value isn't used. Three packages were affected:

- **regex**: Many exported validation regexes used `(...)` syntax even though the captured groups were never read. These are now non-capturing groups `(?:...)` — same matching behavior, clearer intent.
- **sync-peer-deps**: The `SPACE_REGEX` pattern actually uses its captured value (the indentation of `package.json`). Rather than dropping the capture, it's now a named group `(?<indent>\s+)` and the code reads `match.groups['indent']` instead of `match[1]`.
- **changesets-renovate**: An unused capturing group in the git diff parser is now non-capturing.
