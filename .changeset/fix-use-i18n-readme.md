---
'@scaleway/use-i18n': patch
---

Fix README examples so they compile against the real `I18nContextProvider` props: replace the non-existent `supportedLocales` prop with `isLocaleSupported`, pass the required `defaultLoad`, fix the `useTranlation` typo, key `defaultTranslations` by locale, move `useI18n()` out of module scope, and remove stray JSX and self-rendering `<App />`.
