---
'@scaleway/use-dataloader': major
---

Pass an `options` object (`{ signal }`) to params-based methods instead of a positional `AbortSignal`.

`DataLoaderMethodWithParamsFn` previously received the `AbortSignal` as a bare
second argument: `(params, signal?)`. It now receives an `options` object:
`(params, options)`. This aligns the params variant with the signal-only
`DataLoaderMethodFn`, which already used `{ signal }`, and makes the signature
extensible — future options (timeouts, retry hints, request context) can be
added without churning the positional arity again.

This is a breaking type change for callers that destructure the second
parameter as an `AbortSignal`; migrate by destructuring `{ signal }` instead.
