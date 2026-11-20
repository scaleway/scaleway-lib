---
'@scaleway/use-analytics': patch
---

fix(use-analytics): compare group id in ids migration

The group-migration condition compared the user id instead of the group id, so a JSON-encoded group id was never migrated and a redundant group() analytics event fired on every page load.
