---
'@scaleway/use-i18n': patch
---

`getCurrentLocale` now reduces a region locale to its language when the full tag isn't supported (`fr-FR` → `fr` when only `fr` is) instead of falling straight to the default locale. `localStorage` writes are also guarded: Safari private mode throws on `setItem`, which crashed the provider on first render and on every `switchLocale` — the cached locale is now best-effort.
