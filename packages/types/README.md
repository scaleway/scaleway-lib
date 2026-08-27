# `@scaleway/utility-types`

A set of shared TypeScript utility types used across Scaleway projects.

This package is **types only** — it ships no runtime code, so importing it has zero cost.

Two usage modes are supported:

1. **Explicit imports** (default) — `import type { XOR } from '@scaleway/utility-types'`
2. **Global types** — list the package in `compilerOptions.types` and use the types without any import.

---

## Install

```bash
pnpm add -D @scaleway/utility-types
# or
npm install -D @scaleway/utility-types
# or
yarn add -D @scaleway/utility-types
```

> The package is ESM only and requires TypeScript 5.0+.

## Available types

| Type                  | Description                                                         |
| --------------------- | ------------------------------------------------------------------- |
| `TupleUnion`          | Convert a string union to a tuple of all permutations               |
| `UnionToIntersection` | Convert a union to an intersection                                  |
| `LastOf`              | Get the last member of a union                                      |
| `UnionToTuple`        | Convert a union to a tuple (more performant than `TupleUnion`)      |
| `Without`             | Mark keys of `T` that also exist on `U` as `never`                  |
| `SingleXOR`           | Exclusive OR of two types (only one can be present)                 |
| `ArrayType`           | Extract the element type of an array                                |
| `XOR`                 | Exclusive OR of N types (exactly one must be present)               |
| `NonEmptyArray`       | Enforce that an array has at least one element                      |
| `DeepPartial`         | Make every property of `T` optional, recursively (including arrays) |

## Usage

### Option 1 — Explicit imports (recommended)

```ts
import type { XOR, DeepPartial, UnionToTuple, NonEmptyArray } from '@scaleway/utility-types'

type User = {
  id: string
  profile: { name: string; age: number }
  tags: string[]
}

type UserUpdate = DeepPartial<User>

type Result = XOR<[{ type: 'success'; data: string }, { type: 'error'; message: string }]>

type Tuple = UnionToTuple<'a' | 'b' | 'c'>

function process(tags: NonEmptyArray<string>) {
  const [first, ...rest] = tags
  return { first, rest }
}
```

No special `tsconfig.json` setup is required. With `moduleResolution: "Bundler"` (the default in [`@scaleway/tsconfig`](../tsconfig/README.md)), installing the package is enough:

```jsonc
{
  "extends": "@scaleway/tsconfig",
}
```

If you're on the classic `node` resolution, add it to `paths`:

```jsonc
{
  "compilerOptions": {
    "moduleResolution": "node",
    "paths": {
      "@scaleway/utility-types": ["./node_modules/@scaleway/utility-types/dist/index.d.ts"],
    },
  },
}
```

### Option 2 — Global types (no imports)

If you'd rather use the types everywhere without importing them, add the `./global` subpath to your `tsconfig.json`'s `compilerOptions.types`:

```jsonc
{
  "extends": "@scaleway/tsconfig",
  "compilerOptions": {
    "types": ["@scaleway/utility-types/global"],
  },
}
```

Every utility type is now available in the global scope:

```ts
// No import needed!
type User = { id: string; profile: { name: string } }

type UserUpdate = DeepPartial<User>
type Result = XOR<[{ type: 'success' }, { type: 'error' }]>
```

> [!NOTE]
> The `types` array is **restrictive**: when set, only the listed packages (plus the ones you reference via `import`) are auto-included. If you rely on other `@types/*` packages (e.g. `@types/node`, `@types/react`), add them to the array too:
>
> ```jsonc
> "types": ["node", "react", "@scaleway/utility-types/global"]
> ```

Both modes can coexist — the module entry stays available for explicit imports even when the global entry is loaded.

## Development

```bash
pnpm install
pnpm --filter @scaleway/utility-types build
pnpm --filter @scaleway/utility-types test:unit
pnpm --filter @scaleway/utility-types typecheck
```
