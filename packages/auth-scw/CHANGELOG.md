# @scaleway/auth-scw

## 1.1.0

### Minor Changes

- [#3698](https://github.com/scaleway/scaleway-lib/pull/3698) [`76d0d6c`](https://github.com/scaleway/scaleway-lib/commit/76d0d6c676ac0e2b6dadda6eb4ac15d508f2d597) Thanks [@philibea](https://github.com/philibea)! - Add `storageType` option to choose between `cookie` (default) and `localStorage` backends. Add `migrateFromCookie` option to live-migrate existing cookie-based sessions to localStorage on provider initialization. Both options are backward-compatible.

### Patch Changes

- [#3698](https://github.com/scaleway/scaleway-lib/pull/3698) [`76d0d6c`](https://github.com/scaleway/scaleway-lib/commit/76d0d6c676ac0e2b6dadda6eb4ac15d508f2d597) Thanks [@philibea](https://github.com/philibea)! - Group the three cookie-related provider props (`cookieSuffix`, `cookieConfig`, `cookieAge`) into a single `cookie` option object, enforce it with an XOR type from `@scaleway/types`, make `storageType` immutable after creation, and expose the store manager through the context.
  
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

## 1.0.4

### Patch Changes

- [#3828](https://github.com/scaleway/scaleway-lib/pull/3828) [`7122b1d`](https://github.com/scaleway/scaleway-lib/commit/7122b1d0adfeb8e6581f9b26bef3489794f93b31) Thanks [@philibea](https://github.com/philibea)! - fix oxlint eslint/init-declarations violations

- [#3842](https://github.com/scaleway/scaleway-lib/pull/3842) [`321be7d`](https://github.com/scaleway/scaleway-lib/commit/321be7daacd3bfc50ffff4ee466e6badb195f8fe) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `zod` to `4.6.2`.

- [#3837](https://github.com/scaleway/scaleway-lib/pull/3837) [`14d95db`](https://github.com/scaleway/scaleway-lib/commit/14d95db9f5ab45603af88627445be5d2e2261c54) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `zod` to `4.6.0`.

## 1.0.3

### Patch Changes

- [#3811](https://github.com/scaleway/scaleway-lib/pull/3811) [`7606103`](https://github.com/scaleway/scaleway-lib/commit/76061033f5ffc28cf54ce3d623ac6064ba223cd2) Thanks [@chambo-e](https://github.com/chambo-e)! - Throw an `Error` object instead of a string literal when the client is used before `setClient`/`createClient` is configured

## 1.0.2

### Patch Changes

- [#3689](https://github.com/scaleway/scaleway-lib/pull/3689) [`a364c3b`](https://github.com/scaleway/scaleway-lib/commit/a364c3b4f39439f4b92faa47242b77506ee89deb) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `zod` to `4.5.4`.

- [#3689](https://github.com/scaleway/scaleway-lib/pull/3689) [`a364c3b`](https://github.com/scaleway/scaleway-lib/commit/a364c3b4f39439f4b92faa47242b77506ee89deb) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `zod` to `4.5.1`.

- [#3689](https://github.com/scaleway/scaleway-lib/pull/3689) [`a364c3b`](https://github.com/scaleway/scaleway-lib/commit/a364c3b4f39439f4b92faa47242b77506ee89deb) Thanks [@renovate](https://github.com/apps/renovate)! - use compiled zod schema

## 1.0.1

### Patch Changes

- [#3505](https://github.com/scaleway/scaleway-lib/pull/3505) [`042c5e9`](https://github.com/scaleway/scaleway-lib/commit/042c5e91a52060a8feb4b872e2bdb5064866ce5b) Thanks [@alexandre-combemorel](https://github.com/alexandre-combemorel)! - fix: switch peerdeps to deps

## 1.0.0

### Major Changes

- [#3481](https://github.com/scaleway/scaleway-lib/pull/3481) [`7f59f5f`](https://github.com/scaleway/scaleway-lib/commit/7f59f5f83a674e654716bc62474a4b339a438b2b) Thanks [@alexandre-combemorel](https://github.com/alexandre-combemorel)! - new package auth-scw to handle login
