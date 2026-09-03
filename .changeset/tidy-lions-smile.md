---
"@scaleway/phonenumber": patch
---

Use `codePointAt` instead of `charCodeAt` when building regional indicator symbols, correctly handling characters outside the Basic Multilingual Plane
