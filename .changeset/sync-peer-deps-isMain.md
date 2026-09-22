---
'@scaleway/sync-peer-deps': patch
---

fix(sync-peer-deps): harden isMain check and expand test coverage

Use `fileURLToPath(import.meta.url)` instead of fragile string concatenation
to detect CLI entrypoint. The old `file://${process.argv[1]}` pattern broke
on paths with spaces or URL-encoded characters.
