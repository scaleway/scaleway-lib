---
'@scaleway/regex': patch
---

fix(regex)!: anchor phone regex and require digits — BEHAVIOR CHANGE

The `phone` regex now requires a `+` followed by 6 or more digits to the end of the string (E.164-style). Previously it matched any string merely starting with `+` (even `+` alone with zero digits, or `+abc`), because it was neither anchored with `$` nor required any digit.
