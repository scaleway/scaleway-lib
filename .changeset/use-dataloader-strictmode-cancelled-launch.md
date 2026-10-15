---
'@scaleway/use-dataloader': patch
---

Ignore the result of cancelled launches under React StrictMode: a request
aborted by a remount can no longer overwrite the data/status of the request
that replaced it, nor fire user `onSuccess`/`onError` callbacks or drop the
new in-flight request's state.
