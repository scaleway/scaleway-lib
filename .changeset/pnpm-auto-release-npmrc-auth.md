---
'@scaleway/pnpm-auto-release': patch
---

fix(pnpm-auto-release): write registry auth to a temp `.npmrc` outside the repo (passed to publish via `NPM_CONFIG_USERCONFIG`) instead of appending it to the workspace `.npmrc`, which the release commit would commit and push.
