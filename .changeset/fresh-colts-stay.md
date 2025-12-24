---
"@scaleway/use-dataloader": major
---

- Changed `isLoading` behavior to be `true` only during the initial fetch when there's no cached data
- `isLoading` is now `false` during subsequent fetches, even when `isFetching` is `true`
- Added distinction between initial loading (`isLoading`) and ongoing fetching (`isFetching`)
- `isLoading` is `true` only when there is no cache data and we're fetching for the first time
- `isFetching` remains `true` during any active request (initial or subsequent)
