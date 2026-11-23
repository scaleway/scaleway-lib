---
'@scaleway/use-i18n': major
---

Remove the `date-fns` dependency: every date, duration and relative-time format now uses native `Intl` APIs (`Intl.DateTimeFormat`, `Intl.RelativeTimeFormat`, `Intl.DurationFormat`) with CLDR data instead of date-fns locale bundles.

**Added**

- `noSuffix` option on `relativeTime`/`relativeTimeStrict`: returns the bare distance (`"21 years"`, `"3,499 days"`) instead of `"21 years ago"`. Not supported with the `quarter` unit.

**Breaking changes**

- The `I18n` provider no longer accepts `loadDateLocale`, `loadDateLocaleAsync` and `onLoadDateLocaleError`: native `Intl` only needs the current locale string, so there is nothing to load. Remove these props from your setup.
- `dateFnsLocale` is removed from the context. If you passed it to a component that needs a date-fns locale object (e.g. `@scaleway/ui`'s `DateInput`), import and load date-fns in your app.
- `relativeTime` and `relativeTimeStrict` options are `RelativeTimeOptions`/`RelativeTimeStrictOptions` instead of date-fns types: the native `Intl.RelativeTimeFormatOptions` (`localeMatcher?`, `numeric?`, `style?`) plus `noSuffix?`, and `unit?` for the strict variant. `addSuffix` is gone — relative times are suffixed by default ("ago"/"in"). `roundingMethod` is gone as well, with no replacement — distances round half away from "now" on the absolute value, exactly as date-fns did (`Intl.RelativeTimeFormat` exposes no rounding control).
- The `date-fns` type re-exports `FormatDistanceToNowOptions` and `FormatDistanceToNowStrictOptions` are no longer exported from `@scaleway/use-i18n`.
- `formatDuration` options are now `Intl.DurationFormatOptions` (e.g. `{ style: 'narrow' }`) instead of date-fns format options; `'clock'` and `'clock-milliseconds'` are unchanged.
- `switchLocale` is now synchronous and returns `void` instead of `Promise<void>` — with the date-fns locale loading gone there is nothing asynchronous left. Drop any `.then()` calls; `await switchLocale(...)` keeps working unchanged.
- `date-fns` is no longer a peer dependency.

**Requirements**

- Runtime: non-clock `formatDuration` needs `Intl.DurationFormat` — Baseline 2025 (Chrome/Edge 129+, Firefox 136+, Safari 16.4+, Node 23+ per MDN). Polyfill `@formatjs/intl-durationformat` if you support older browsers. `relativeTime` needs `Intl.RelativeTimeFormat` (available everywhere since 2020). Node is already covered by the `engines` field (`>=24`).
- TypeScript: the published types reference `Intl.DurationFormatOptions`, which first ships in TypeScript 6.0 (`lib.es2025.intl`); on older versions the `.d.ts` will not compile.

**Output changes** (CLDR wording):

- Durations gain list separators in English and "et" in French ("3 hours, 40 minutes, 50 seconds", "3 heures, 40 minutes et 50 secondes"), and durations above 24h are plain days instead of calendar months ("45 days", not "1 month 14 days").
- Relative times use CLDR rounding ("21 years ago" instead of "over 20 years ago", "3,499 days ago") and, with the default `numeric: 'auto'`, the full set of CLDR specials — "now", "yesterday"/"hier", "last week", "last month", "last quarter", "last year" and their future forms. Pass `numeric: 'always'` to keep plain output.
- Granularity goes down to seconds: spans under a minute render "45 seconds ago" where date-fns said "less than a minute ago" (30–59s said "1 minute"), and the 45–59-minute window renders in minutes where date-fns said "about 1 hour ago".
- Distances are elapsed time, not wall-clock time: date-fns normalized daylight-saving transitions for day/month/year buckets, so a span crossing a DST shift can now differ by one unit from date-fns.
- `relativeTimeStrict` uses average unit lengths (30.44-day months, 365.25-day years) instead of date-fns's 30/365-day ones, so large counts differ slightly (3499 days is "115 months" where date-fns said "117"). `unit: 'week'` and `unit: 'quarter'` now format in their own unit, where date-fns silently computed years.
- Legacy date-fns options that no longer exist (`includeSeconds`, `format`, `zero`, `delimiter`) are ignored rather than rejected; TypeScript flags them for TS callers.

`formatDate` output is unchanged.
