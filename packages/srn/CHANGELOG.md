# @scaleway/srn

## 0.0.4

### Patch Changes

- [#4159](https://github.com/scaleway/scaleway-lib/pull/4159) [`ed7a30b`](https://github.com/scaleway/scaleway-lib/commit/ed7a30b3ef21d7a1e590ded5e0b91b0bc4019455) Thanks [@chambo-e](https://github.com/chambo-e)! - Fixed `parseSRN` silently dropping the first key/value pair of global SRNs with nested paths (e.g. `srn://iam.scw.eu/organizations/1234/users/5678`). Only `zones/` or `regions/` prefixes are now treated as a locality.

## 0.0.3

### Patch Changes

- [#3937](https://github.com/scaleway/scaleway-lib/pull/3937) [`6fde3e8`](https://github.com/scaleway/scaleway-lib/commit/6fde3e84b773199b79290c8abe10a42737628af4) Thanks [@philibea](https://github.com/philibea)! - Narrow `locality.name` to the `LocalityName` union sourced from `@scaleway/sdk-client` (`Zone | Region` plus `''` for global), and derive `LocalityType` from its `ApiLocality` scopes (excluding `'unspecified'`). Make `SRN`, `ResourceIdentifierSegment`, and `Locality` generic over `P` (product name), `R` (resource-type key), and `L` (locality name) with `string`/`LocalityName` defaults, so consumers can substitute their own unions without the library hardcoding Scaleway's product catalog. Add `safeParseSRN` returning a zod-style discriminated union `{ success: true, data: SRN } | { success: false, error: SRNParseError }` for ergonomic use in React render code without try/catch.

## 0.0.2

### Patch Changes

- [#3923](https://github.com/scaleway/scaleway-lib/pull/3923) [`5bfaac4`](https://github.com/scaleway/scaleway-lib/commit/5bfaac48129665ea60916513a1b9be61b7d5ab73) Thanks [@philibea](https://github.com/philibea)! - introduce `@scaleway/srn`, a v0 (not maintained) Node/browser package exposing `parseSRN` for syntactic SRN parsing.
