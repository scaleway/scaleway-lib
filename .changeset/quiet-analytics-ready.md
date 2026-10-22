---
'@scaleway/use-analytics': patch
---

Resolve `AnalyticsProvider` readiness immediately when analytics is disabled.

When the provider is mounted with a `settings` object that has no `writeKey` (for example the consumer's `config.analytics = null`), there is nothing to load and no `analytics.ready()` to ever wait for. `isAnalyticsReady` is now `true` right away instead of staying `false` until the readiness timeout fires, so consumers rendering their children on `isAnalyticsReady` (or with `shouldRenderOnlyWhenReady`) are no longer blocked, and no spurious timeout `onError` is reported.
