---
'@scaleway/sync-peer-deps': patch
---

Replace `chalk` with Node's built-in `styleText` (`node:util`) and drop the `chalk` dependency. Output is identical: `styleText` performs the same color auto-detection as `chalk` (TTY, `NO_COLOR`, `FORCE_COLOR`).
