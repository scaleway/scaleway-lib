---
'@scaleway/changesets-renovate': major
---

Migrated from Changesets v2 to v3. The `@changesets/config` dependency was upgraded from v3 to v4, which renames `read` to `readConfig` and returns a `{ config, warnings, errors }` result object instead of throwing on validation errors. The GitHub Actions release workflow was also updated to use `changesets/action@v2` with the new kebab-case input names.
