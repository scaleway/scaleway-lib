---
"@scaleway/auth-scw": patch
---

Throw an `Error` object instead of a string literal when the client is used before `setClient`/`createClient` is configured
