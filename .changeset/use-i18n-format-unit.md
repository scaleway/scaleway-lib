---
'@scaleway/use-i18n': patch
---

Every unit name accepted by `FormatUnitOptions['unit']` now formats instead of silently returning `''`: the plural forms (`bits`, `bytes`, `bits-per-second`, `bytes-per-second` and their exponent-prefixed variants like `kilobits`) alias the singular keys, and the missing `byte-per-second-humanized` family (all exponent forms) is registered. Previously-working unit names are unchanged — verified value-by-value against the previous snapshots.
