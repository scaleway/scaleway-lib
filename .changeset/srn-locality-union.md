---
"@scaleway/srn": minor
---

Narrow `locality.name` to a `LocalityName` union of all known Scaleway zones, regions, and `''` (global), mirrored from `scaleway-sdk-go`. Make `SRN`, `ResourceIdentifierSegment`, and `Locality` generic over `P` (product name), `R` (resource-type key), and `L` (locality name) with `string`/`LocalityName` defaults, so consumers can substitute their own unions without the library hardcoding Scaleway's product catalog. Add `safeParseSRN` returning a zod-style discriminated union `{ success: true, data: SRN } | { success: false, error: SRNParseError }` for ergonomic use in React render code without try/catch.
