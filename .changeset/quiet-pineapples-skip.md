---
"@scaleway/changesets-renovate": patch
---

Harden boolean env-var handling: `SORT_CHANGESETS`, `SKIP_BRANCH_CHECK`, `SKIP_COMMIT` and `EXCLUDE_DEVDEPS` now only activate when set to exactly `true` (previously any non-empty value, including `false`, activated them).

Also validate `pnpm-workspace.yaml` and `package.json` when parsed: files missing the `packages`/`name` fields are now treated as invalid instead of being silently processed.
