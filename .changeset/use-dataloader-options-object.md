---
'@scaleway/use-dataloader': minor
---

Add an optional `AbortSignal` to data-loader methods for real cancellation.

`method` fields now receive an `options` object (`{ signal?: AbortSignal }`)
as their last argument. `DataLoader` creates an `AbortController` per
`launch()` and aborts it on `cancel()` (component unmount, cache
invalidation, or a newer request superseding an in-flight one). The
`AbortError` is caught inside `launch()` and never reaches `onError`.

The signal is passed inside an `options` object rather than as a positional
argument so the params variant stays consistent with the signal-only
variant and the arity can grow later (timeout, retry hint, request context)
without another signature churn.

This is additive: existing methods that ignore the new argument keep
working unchanged — they simply don't benefit from abort. Callers that
want cancellation opt in by forwarding `signal` to `fetch` (or any
abort-aware client).
