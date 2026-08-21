---
'@scaleway/use-i18n': minor
---

`I18n` now sets the `lang` attribute on the root element based on the current locale. By default the attribute is set on `document.documentElement`, but you can target a specific element with the new `rootElement` prop. The attribute is updated on mount and whenever the locale is switched with `switchLocale`.
