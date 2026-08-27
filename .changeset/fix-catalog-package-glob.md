---
'@scaleway/changesets-renovate': patch
---

Fix catalog changeset generation failing to identify affected workspace packages. `findAffectedPackages` now auto-discovers workspace package globs from `pnpm-workspace.yaml` (`packages` field) and the root `package.json` (`workspaces` field) instead of relying on a hardcoded `packages/*/package.json` default, which missed packages in non-default layouts (e.g. `apps/*`).

Fixes https://github.com/scaleway/scaleway-lib/issues/3134
