---
"@scaleway/srn": patch
---

Narrow `locality.name` to the `LocalityName` union sourced from `@scaleway/sdk-client` (`Zone | Region` plus `''` for global), and derive `LocalityType` from its `ApiLocality` scopes (excluding `'unspecified'`). Make `SRN`, `ResourceIdentifierSegment`, and `Locality` generic over `P` (product name), `R` (resource-type key), and `L` (locality name) with `string`/`LocalityName` defaults, so consumers can substitute their own unions without the library hardcoding Scaleway's product catalog. Add `safeParseSRN` returning a zod-style discriminated union `{ success: true, data: SRN } | { success: false, error: SRNParseError }` for ergonomic use in React render code without try/catch.
