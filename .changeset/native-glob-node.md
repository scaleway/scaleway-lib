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

Also measured end-to-end in the console (77 packages run `validate-icu` in CI; full CLI wall time, medians of 7 runs). Outputs were byte-identical to the published `tinyglobby` versions in every case, including the extglob pattern `{,!(node_modules)/**/}locales/{en,en-GB,fr,fr-FR}.{ts,json}`.

- **validate-icu-locales**: `179.9ms → 186.7ms` per package run (`+4%`).
- **sync-peer-deps**: `556.5ms → 528.6ms` across the whole repo, 117 `package.json` files (`−5%`).
- **changesets-renovate**: `261.2ms → 253.7ms` on its no-changes path (`−3%`).
