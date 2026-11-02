---
"@scaleway/use-dataloader": minor
---

feat: add refetch on window focus and network reconnection

- new `refetchOnFocus` (default `false`) and `refetchOnReconnect` (default `true`) options on `useDataLoader`, also settable globally with `defaultRefetchOnFocus` / `defaultRefetchOnReconnect` on `DataLoaderProvider`
- `true` refetches only stale data per `dataLifetime` (no `dataLifetime` means stale, like a mount), `'always'` refetches regardless of freshness, and an errored request is retried on reconnection **and on focus when enabled**
- only requests with mounted hooks are refetched, not every cached entry, and a request already in flight is never launched twice
- a single listener at provider level iterates the active requests, instead of one listener per hook
- **note:** with the new `refetchOnReconnect: true` default, consumers without `dataLifetime` now refetch all observed requests on every `online` event
