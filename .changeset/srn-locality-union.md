---
"@scaleway/srn": minor
---

Narrow `locality.name` to a `LocalityName` union of all known Scaleway zones, regions, and `''` (global), mirrored from `scaleway-sdk-go`. Make `SRN` and `ResourceIdentifierSegment` generic over `P` (product name) and `R` (resource-type key) with `string` defaults, so consumers can substitute their own unions without the library hardcoding Scaleway's product catalog. Add `safeParseSRN` returning a zod-style discriminated union `{ success: true, data: SRN } | { success: false, error: SRNParseError }` for ergonomic use in React render code without try/catch.
