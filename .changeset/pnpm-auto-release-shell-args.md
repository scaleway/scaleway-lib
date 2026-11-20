---
'@scaleway/pnpm-auto-release': patch
---

Git and GitHub release/tag commands now run via `execFile` (no shell), so package names/versions with shell metacharacters are passed as plain arguments, and `findWorkspaceRoot` no longer loops forever on Windows.
