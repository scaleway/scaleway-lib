---
'@scaleway/sync-peer-deps': patch
'@scaleway/changesets-renovate': patch
'@scaleway/validate-icu-locales': patch
---

Replace `tinyglobby` with Node's native `fs.glob`/`fsSync.glob` and drop the dependency.
