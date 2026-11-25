# @scaleway/scouter

## 2.0.0

### Major Changes

- [#4144](https://github.com/scaleway/scaleway-lib/pull/4144) [`56fbdb8`](https://github.com/scaleway/scaleway-lib/commit/56fbdb8e7f27fb6c371a2e86547f6c463ae47769) Thanks [@radhi-nasser-scaleway](https://github.com/radhi-nasser-scaleway)! - feat(scouter)!: remove deprecated useQueryParams
  
  useQueryParams has been removed. Replace all usages with useSafeQueryParams.

### Minor Changes

- [#4149](https://github.com/scaleway/scaleway-lib/pull/4149) [`7cc1d1c`](https://github.com/scaleway/scaleway-lib/commit/7cc1d1cda8585a59051bdcc012fdcc3bdc1061c3) Thanks [@alexandre-combemorel](https://github.com/alexandre-combemorel)! - useSafeQueryParams issue when parsing an array schema should return array of string instead of just string.
  
  `useSafeQueryParams` and `getSafeQueryParams` now accept a `treatKeysAsArray` option listing the query param keys that must be parsed as arrays, so a single value like `?tags=admin` becomes `['admin']`.

## 1.1.2

### Patch Changes

- [#4055](https://github.com/scaleway/scaleway-lib/pull/4055) [`854926c`](https://github.com/scaleway/scaleway-lib/commit/854926c92a525c52cfe1bf4e516d5063792dfa52) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `query-string` to `10.0.0`.

## 1.1.1

### Patch Changes

- [#3769](https://github.com/scaleway/scaleway-lib/pull/3769) [`ca4d74c`](https://github.com/scaleway/scaleway-lib/commit/ca4d74c6498504136cd5c17bde702acb5626fb35) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `query-string` to `9.5.1`.

## 1.1.0

### Minor Changes

- [#3637](https://github.com/scaleway/scaleway-lib/pull/3637) [`ef93671`](https://github.com/scaleway/scaleway-lib/commit/ef93671772a0c6485ad6f459fc959d35638ff709) Thanks [@alexandre-combemorel](https://github.com/alexandre-combemorel)! - feat: export Router component from Scouter

### Patch Changes

- [#3614](https://github.com/scaleway/scaleway-lib/pull/3614) [`810da8e`](https://github.com/scaleway/scaleway-lib/commit/810da8e549ba457e7e1d6903a532e138c65760cb) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `query-string` to `9.5.0`.

## 1.0.2

### Patch Changes

- [#3530](https://github.com/scaleway/scaleway-lib/pull/3530) [`e4a950e`](https://github.com/scaleway/scaleway-lib/commit/e4a950e4befd59911ca86f6f410e63027569305a) Thanks [@etienne-scaleway](https://github.com/etienne-scaleway)! - Batch history changes by using state+context instead of useSyncExternalStore

## 1.0.1

### Patch Changes

- [`264a4bd`](https://github.com/scaleway/scaleway-lib/commit/264a4bd8a580220330e5836319d0777aa4de71a5) Thanks [@etienne-scaleway](https://github.com/etienne-scaleway)! - Fix Link forward navigate

## 1.0.0

### Major Changes

- [#3485](https://github.com/scaleway/scaleway-lib/pull/3485) [`1b09d4c`](https://github.com/scaleway/scaleway-lib/commit/1b09d4c37f13cafe7e96018c92fac6204e44dfb2) Thanks [@etienne-scaleway](https://github.com/etienne-scaleway)! - New router from internal fork of RRv5

### Patch Changes

- [#3498](https://github.com/scaleway/scaleway-lib/pull/3498) [`a91b724`](https://github.com/scaleway/scaleway-lib/commit/a91b7249f71fe55af0bef0c898322f06277268e7) Thanks [@renovate](https://github.com/apps/renovate)! - Updated dependency `query-string` to `9.4.1`.
