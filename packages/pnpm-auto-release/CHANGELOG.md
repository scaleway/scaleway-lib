# @scaleway/pnpm-auto-release

## 0.0.3

### Patch Changes

- [#4161](https://github.com/scaleway/scaleway-lib/pull/4161) [`8ac3b54`](https://github.com/scaleway/scaleway-lib/commit/8ac3b54d88752afdd16e222306b7a02394a6cd2a) Thanks [@chambo-e](https://github.com/chambo-e)! - fix(pnpm-auto-release): write registry auth to a temp `.npmrc` outside the repo (passed to publish via `NPM_CONFIG_USERCONFIG`) instead of appending it to the workspace `.npmrc`, which the release commit would commit and push.

- [#4166](https://github.com/scaleway/scaleway-lib/pull/4166) [`51d51a2`](https://github.com/scaleway/scaleway-lib/commit/51d51a217fc5543d911c551ae43077ab790611b4) Thanks [@chambo-e](https://github.com/chambo-e)! - Git and GitHub release/tag commands now run via `execFile` (no shell), so package names/versions with shell metacharacters are passed as plain arguments, and `findWorkspaceRoot` no longer loops forever on Windows.

## 0.0.2

### Patch Changes

- [#3938](https://github.com/scaleway/scaleway-lib/pull/3938) [`045134a`](https://github.com/scaleway/scaleway-lib/commit/045134aaec57172c7a7d4f10496e1c8332d3d1e4) Thanks [@philibea](https://github.com/philibea)! - feat: add `--no-provenance` option to skip provenance flag when publishing
