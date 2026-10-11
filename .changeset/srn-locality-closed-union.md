---
"@scaleway/srn": patch
---

Adopt `@scaleway/sdk-client` 2.14.0, which closed the `Zone`/`Region` unions to their known literal members. `LocalityName` is now the closed `Zone | Region | ''` union sourced from the SDK rather than an open `string`-extending union.
