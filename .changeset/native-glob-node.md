---
'@scaleway/sync-peer-deps': patch
'@scaleway/changesets-renovate': patch
'@scaleway/validate-icu-locales': patch
---

Replace `tinyglobby` with Node's native `fs.glob`/`fsSync.glob` and drop the dependency.

Performance recap (measured on the scaleway-lib tree: ~40k files, 96 gitignored entries; glob step only, median). File lists are identical to `tinyglobby` in every tested scenario, including symlinked files, gitignored directories with special characters and non-git fallbacks.

- **validate-icu-locales**: broad pattern `4.3ms → 20.8ms`, literal directory argument `3.9ms → 34.6ms` (includes one `stat()` per symlink, needed to follow symlinks like `tinyglobby` did). Full glob step including the shared `git ls-files` call: `~62ms → ~78ms`.
- **changesets-renovate**: `2.1ms → 6.9ms` — negligible next to the `git` subprocesses the CLI already runs.
- **sync-peer-deps**: unchanged (`~7ms`).
- **Cold start**: importing the glob library drops from `~5.5ms` (`tinyglobby` + `fdir` + `picomatch`) to `~0.7ms` (native), for every CLI invocation.
