---
'@scaleway/use-i18n': patch
---

Faster formatting with no output or API change:

- the direct `@formatjs/fast-memoize` dependency is replaced by a small local memoize helper (same behavior, better generics; `intl-messageformat` still depends on `@formatjs/fast-memoize` transitively)
- `formatUnit` reuses memoized `Intl.NumberFormat` instances and caches the `Intl.Locale` language lookup instead of constructing both on every call

Measured on Node 26: memoized calls are ~2.5–3× faster, repeated `formatUnit` calls drop from ~9.6µs to ~0.35µs, and a mixed formatting workload runs ~3× faster.
