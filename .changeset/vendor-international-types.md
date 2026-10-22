---
'@scaleway/use-i18n': patch
---

Vendored the `international-types` type definitions in-house (from `international-types@0.8.1`, MIT) and removed the unmaintained dependency. Adapted to this package's runtime along the way: `LocaleKeys` no longer strips `#plural` suffixes (the hook never supported that convention, so those keys were phantom and failed at runtime), and `Params` now extracts parameters from pure CLDR-category plural messages (`{n, plural, one {…} other {…}}`), which previously produced garbage parameter names. `Params` uses a cheap shape-guard before the plural templates, so type checking is ~34% faster than the original dependency (measured on a 1,000-key locale, TypeScript 7).
