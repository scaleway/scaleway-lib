---
'@scaleway/oxlint-config': major
---

Reworked the package around a programmatic flat-config API. The legacy pre-built JSON configs (`configs/index.json`, `configs/react.json`, `configs/vitest.json`) and the previous `configs/` exports have been removed.

The package now ships a compiled JavaScript API (`dist/index.js`) that you compose with oxlint's `defineConfig`:

```ts
import { defineConfig } from 'oxlint'
import { base, ignorePatterns, react, vitest } from '@scaleway/oxlint-config'

export default defineConfig({
  extends: [base, react, vitest],
  ignorePatterns,
})
```

New exports:

- `base` — core rules for JavaScript/TypeScript projects (ESLint, import, Node.js, oxc, TypeScript, unicorn) with type-aware/type-checked linting enabled by default.
- `react` — React, React performance, and jsx-a11y rules.
- `vitest` — Vitest rules, scoped to test files.
- `ignorePatterns` — default list of paths to ignore.

This is a breaking change: the previous JSON-based configuration must be migrated to the new programmatic API. The `oxlint` peer dependency requirement has also been raised to `>=1.78.0`.
