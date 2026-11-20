---
'@scaleway/phonenumber': patch
---

`parsePhoneValue` now parses each phone value once instead of redundantly re-parsing the same value up to three times per keystroke.
