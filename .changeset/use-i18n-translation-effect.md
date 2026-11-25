---
'@scaleway/use-i18n': patch
---

`useTranslation` now supports a namespace whose name contains a comma — `['common,errors']` was previously split into two nonexistent namespaces and never marked loaded. The `load` reference contract is now documented: keep it stable (module scope or `useCallback`); an inline `load` restarts the loading effect on every render.
