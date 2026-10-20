# `@scaleway/use-state-reset`

A react hook to keep a state, but automatically reset it to its initial value when one of the dependencies changes.

This is useful for example to reset a pagination to the first page when a filter changes.

---

## Install

```bash
pnpm add @scaleway/use-state-reset
```

## Usage

```tsx
import { useStateReset } from "@scaleway/use-state-reset";

const Component = ({ query }: { query: string }) => {
  // `page` is reset to 0 (the initial value) whenever `query` changes
  const [page, setPage] = useStateReset(0, [query]);

  return (
    <div>
      <span>Current page: {page}</span>
      <button onClick={() => setPage((page) => page + 1)}>Next page</button>
    </div>
  );
};
```

### API

```ts
const [value, setValue] = useStateReset<T>(initialValue: T, deps: DepsItem[])
```

- **`initialValue`**: the initial value of the state. It is also the value the state resets to when a dependency changes. The hook is generic, so any type is supported.
- **`deps`**: an array of dependencies that trigger the reset. When any of them changes, the state is reset to `initialValue`. Dependencies are compared by content (using `JSON.stringify`), so nested `string[]` deps are properly compared, and `undefined`, `null` and `NaN` are kept distinct from each other.
- **`value`** / **`setValue`**: the current value and its setter, behaving like `useState`. Both a plain value and an updater function are supported.

The hook returns a `[value, setValue]` tuple just like `useState`, so anywhere that needs a reset-on-deps-change behavior can swap `useState` for `useStateReset`.
