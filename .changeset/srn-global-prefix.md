---
'@scaleway/srn': patch
---

Fixed `parseSRN` silently dropping the first key/value pair of global SRNs with nested paths (e.g. `srn://iam.scw.eu/organizations/1234/users/5678`). Only `zones/` or `regions/` prefixes are now treated as a locality.
