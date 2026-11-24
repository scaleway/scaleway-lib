---
'@scaleway/use-i18n': patch
---

`useTranslation` now supports a namespace whose name contains a comma — `['common,errors']` was previously split into two nonexistent namespaces and never marked loaded. Passing an inline `load` function also no longer restarts the loading effect on every render (it ran endlessly before); the latest `load` is picked up whenever the effect runs.
