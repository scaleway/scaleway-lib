# @scaleway/oxlint-config

Scaleway's shareable configuration for [oxlint](https://oxc.rs/docs/guide/usage/linter.html).

> ⚠️ This package does not follow semver for now. Breaking changes can be introduced in minor/patch versions.

## Requirements

- `oxlint` >= 1.78.0 (peer dependency)

## Installation

```bash
npm install --save-dev @scaleway/oxlint-config oxlint
```

## Usage

The package exposes a set of [flat config](https://oxc.rs/docs/guide/usage/linter/configure/configuration_files.html) presets you can compose with oxlint's `defineConfig`.

Create an `oxlint.config.ts` file in your project root:

```ts
import { defineConfig } from 'oxlint'
import { base, ignorePatterns, react, vitest } from '@scaleway/oxlint-config'

export default defineConfig({
  extends: [base, react, vitest],
  ignorePatterns,
})
```

### Base configuration

`base` includes rules for all JavaScript/TypeScript projects: ESLint core rules, import, Node.js, TypeScript (type-aware), unicorn, and oxc rules. It enables type-aware and type-checked linting by default.

```ts
import { defineConfig } from 'oxlint'
import { base } from '@scaleway/oxlint-config'

export default defineConfig({
  extends: [base],
})
```

### React

For React projects, compose the `react` preset on top of `base`. It adds React, React performance, and JSX accessibility (jsx-a11y) rules.

```ts
import { defineConfig } from 'oxlint'
import { base, react } from '@scaleway/oxlint-config'

export default defineConfig({
  extends: [base, react],
})
```

### Vitest

For projects using Vitest, compose the `vitest` preset on top of `base`. It applies Vitest rules only to test files.

```ts
import { defineConfig } from 'oxlint'
import { base, vitest } from '@scaleway/oxlint-config'

export default defineConfig({
  extends: [base, vitest],
})
```

### Ignore patterns

`ignorePatterns` is a ready-made list of common paths to ignore (build output, generated code, coverage, lockfiles, framework-specific directories, and so on). It is exported separately so you can pick and choose whether to apply it.

```ts
import { defineConfig } from 'oxlint'
import { base, ignorePatterns } from '@scaleway/oxlint-config'

export default defineConfig({
  extends: [base],
  ignorePatterns,
})
```

### Overriding rules

Since the presets are plain config objects, you can override any rule in your own config:

```ts
import { defineConfig } from 'oxlint'
import { base } from '@scaleway/oxlint-config'

export default defineConfig({
  extends: [base],
  rules: {
    'eslint/no-console': 'warn',
    'typescript/explicit-member-accessibility': 'warn',
  },
})
```

## API

| Export           | Description                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| `base`           | Core rules for JavaScript/TypeScript projects (ESLint, import, node, oxc, TypeScript, unicorn). |
| `react`          | React-specific rules (React, react-perf, jsx-a11y).                                             |
| `vitest`         | Vitest-specific rules, scoped to test files.                                                    |
| `ignorePatterns` | Default list of paths to ignore.                                                                |

## License

MIT
