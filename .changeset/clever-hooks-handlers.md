---
"@scaleway/use-dataloader": minor
---

feat: fire onSuccess and onError on every request settle

- `onSuccess` and `onError` callbacks now fire on every settle path: mount loads, `reload()`, polling ticks, focus/reconnect refetches, and provider reload APIs (`reload`, `reloadAll`, `reloadAllActive`, `reloadGroup`, `reloadGroupActive`)
- handlers are registered per mounted hook on the request; all observing hooks' handlers fire once per settle
- handler errors are swallowed (documented) — they no longer affect request state or propagate to error boundaries
- internal cleanup: removed `loadTokenRef` and `createTokenGuardedHandlers` usage from `useDataLoader`; request generation guard handles superseded launches