---
"@scaleway/auth-scw": minor
---

Add `storageType` option to choose between `cookie` (default) and `localStorage` backends. Add `migrateFromCookie` option to live-migrate existing cookie-based sessions to localStorage on provider initialization. Both options are backward-compatible.
