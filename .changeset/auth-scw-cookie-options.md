---
"@scaleway/auth-scw": patch
---

Group the three cookie-related provider props (`cookieSuffix`, `cookieConfig`, `cookieAge`) into a single `cookie` option object, enforce it with an XOR type from `@scaleway/types`, make `storageType` immutable after creation, and expose the store manager through the context.

**Cookie options grouped:**

```tsx
// before
<AuthScwProvider cookieSuffix="…" cookieConfig={{…}} cookieAge={…} storageType="cookie" …>

// after — cookie storage (default), cookie required
<AuthScwProvider cookie={{ suffix: '…', config: {…}, age: … }} …>

// after — localStorage, cookie optional (only needed for migration suffix)
<AuthScwProvider storageType="localStorage" …>
```

The `SingleXOR` from `@scaleway/types` enforces that `cookie` is required when `storageType` is `'cookie'` (or omitted) and optional when `storageType` is `'localStorage'`.

**`storageType` is now immutable:**

`setStorageType` has been removed from the store manager instance and from the module-level exports. The storage type is set at creation time via `createAuthStoreManager({ storageType })` and cannot be changed afterwards — this prevents dangerous mid-session backend switches that could leak data or cause inconsistent state. `suffixKey` is also set at creation time.

**`storeManager` exposed via context:**

The provider's `storeManager` instance is now accessible via `useAuthScw().storeManager`. Consumers should use this instead of importing the `AuthStoreManager` singleton.

**`AuthStoreManager` singleton deprecated:**

The exported `AuthStoreManager` singleton now emits a `console.warn` on first access, directing users to `useAuthScw().storeManager` or `createAuthStoreManager()`. It will be removed in a future major version.
