---
'@scaleway/auth-scw': patch
---

Fix auth-scw: scope the token refresh single-flight per audience. Two audiences calling `getJWT` concurrently while expired no longer share one in-flight renewal promise, which returned one audience's token to the other.
