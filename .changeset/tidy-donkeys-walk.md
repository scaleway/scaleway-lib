---
"@scaleway/use-dataloader": minor
---

Add bidirectional pagination to `useInfiniteDataLoader`: `loadPrevious` fetches the page before the first loaded one with `getPreviousPage` and prepends it to `data`, `hasPreviousPage` and `isFetchingNextPage`/`isFetchingPreviousPage` expose the window edges and fetch direction, `previousPageParamKey` supports APIs with two token params (eg `before` vs `after`) and `maxPages` keeps a sliding window of pages. Purely additive, previous pages appear before current ones in the flat `data` array.
