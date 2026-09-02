---
"@scaleway/units": minor
---

Add support for negative SI unit prefixes (milli, micro, nano, pico, femto, atto, zepto, yocto) in `convertUnit`. Since these prefixes are SI-only, the types now reject combining them with `base: 2` (IEC)
