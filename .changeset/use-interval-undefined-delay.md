---
'@scaleway/use-interval': patch
---

Pause the interval when `delay` is `undefined`, as it already does for `null`. Previously `undefined` was passed through to `setInterval`, coercing to a ~0ms busy loop.
