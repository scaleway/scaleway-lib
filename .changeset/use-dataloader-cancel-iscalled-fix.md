---
'@scaleway/use-dataloader': patch
---

Fix `cancel()` leaving `isCalled` set to `true`, which prevented
`load()` from re-launching after a component unmount/remount (e.g. React
StrictMode) or a key change. This caused requests to get stuck in `idle`
forever — the state would never update.

Also fix a double-decrement of the static `DataLoader.started` counter:
`cancel()` no longer decrements it; `launch()`'s try/catch handles the
single decrement when the aborted method settles.
