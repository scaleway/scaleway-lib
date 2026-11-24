# `@scaleway/use-i18n`

## A tiny hooks to handle i18n translation

## Install

```bash
pnpm add @scaleway/use-i18n
```

## Requirements

- Browsers: non-clock `formatDuration` uses `Intl.DurationFormat` (Chrome/Edge 129+, Firefox 136+, Safari 16.4+) — polyfill `@formatjs/intl-durationformat` if you support older browsers. `relativeTime` uses `Intl.RelativeTimeFormat`, available everywhere since 2020.
- TypeScript 6.0+ — the published types reference `Intl.DurationFormatOptions`.

## Usage

### Loading locales

Create a directory with your locales.
Use of local `variables` and `namespace` to dynamically load locales.

**Exemple :**

```text
📦locales
 ┣ 📂de
 ┃ ┗ 📜common.json
 ┣ 📂en
 ┃ ┗ 📜common.json
 ┗ 📂fr
 ┃ ┗ 📜common.json
```

your loaders will be:

```js
const load = ({ locale, namespace }) => import(`./locales/${locale}/${namespace}`)
```

Inside your app you will need to use useTranslation to load namespace locales.

if you want to have pre-load locales you can use defaultTranslations.

```js
import I18n from '@scaleway/use-i18n'
import defaultTranslations from './locales/en/common'

const App = () => (
  <I18n defaultLocale="en" supportedLocales={['en']} defaultTranslations={defaultTranslations}>
    <App />
  </I18n>
)
```

```js
import I18n from '@scaleway/use-i18n'
import React from 'react'

const Page = () => {
  // this will load locales based on `./locales/${currentLocale}/common.json`
  const { t } = useTranlation(['common'])

  return <h1>{t('title')}</h1>
}

const App = () => {
  const defaultLocales = ['fr', 'en']
  const defaultTranslations = {
    title: 'Welcome to I18n hooks',
  }

  const load = ({ locale, namespace }) => import(`./locales/${locale}/${namespace}`)

  return (
    <I18n defaultLocale="en" supportedLocales={defaultLocales} defaultTranslations={defaultTranslations}>
      <Page />
    </I18n>
  )
}
```

### Set the `lang` attribute

`I18n` automatically sets the `lang` attribute on the root element based on the current locale so screen readers and browsers can pick the right language.

By default the attribute is set on `document.documentElement`. You can provide your own root element (for example when rendering into a portal or a specific container) through the `rootElement` prop:

```ts
import I18n from '@scaleway/use-i18n'

const rootElement = document.querySelector('#app-root')!
const root = createRoot(rootElement)

root.render(
  <I18n defaultLocale="en" rootElement={rootElement}>
    <Page />
  </I18n>
)
```

The `lang` attribute is updated whenever the current locale is resolved (from `localStorage`, the browser navigator or `defaultLocale`) and whenever the locale is switched with `switchLocale`.

### useTranslation & useI18n

Theses both hooks are using the same context.
useTranslation will load your locales with a use effect.
Dynamique locale need to be loaded before using useI18n on an other file.

```js
import { useTranslation } from '@scaleway/use-i18n'

const App = () => {
  const i18n = useTranslation(['app', 'common'])

  return <>{i18n.t('app.user')}(</>
}
```

In a case you will need to avoid somes useless re-render. you can wait that all your namespaces are loaded

```js
import { useTranslation } from '@scaleway/use-i18n'

const App = () => {
  const namespaces = ['app', 'common']
  const { t, isLoaded } = useTranslation(namespaces)

  return isLoaded ? <>{t('app.user')}(</> : null
}
```

```js
import { useI18n } from '@scaleway/use-i18n'

const { namespaceTranslation } = useI18n()
const t = namespaceTranslation('namespace.home.users.table.header')
```

### use namespaceTranslation

Namespace translation help you when you have some very long key
Exemple of your locale key: `namespace.home.users.table.header.link`

```js
import { useI18n } from '@scaleway/use-i18n'

const { namespaceTranslation } = useI18n()
const t = namespaceTranslation('namespace.home.users.table.header')
```

### Use date-fns locales in your components

`use-i18n` no longer loads date-fns locales for you. If a component needs one — for example `@scaleway/ui`'s `DateInput` — import it in your own app:

```js
import { DateInput } from '@scaleway/ui'
import { useI18n } from '@scaleway/use-i18n'
import { fr } from 'date-fns/locale'

const dateLocales = { fr }

const App = () => {
  const { t, currentLocale } = useI18n()

  return (
    <DateInput
      currentLocale={currentLocale}
      locale={dateLocales[currentLocale]}
      label={t('form.fields.date.label')}
      placeholder={t('form.fields.date.placeholder')}
    />
  )
}
```

### formatDate

This hook exposes a `formatDate` function which can be used to format JS dates

The first parameter is anything that can be accepted as a valid JS Date (Date, number, string)

It accepts an `options` as second parameter which can eiter be one of predefined shorthand formats (see below) or an [Intl.DateTimeFormat `options` object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat)

Shorthand formats:

```text
"long" => "February 13, 2020"
"short" => (default) "Feb 13, 2020"
"hour" => "February 13, 2020, 4:28 PM"
"hourOnly" => "4:28 PM"
"shortWithoutDay" => "Feb 2020"
"numeric" => "2020-02-13"
"numericHour" => "2020-02-13 4:28 PM"
```

```js
import { useI18n } from '@scaleway/use-i18n'

const App = () => {
  const { formatDate } = useI18n()

  const units = [
    formatDate(new Date(2020, 1, 13, 16, 28)), // "Feb 13, 2020"
    formatDate(1581607680000, 'long'), // "February 13, 2020"
    formatDate('2020-02-13T15:28:00.000Z', {
      day: 'numeric',
      era: 'short',
      hour: '2-digit',
      minute: 'numeric',
      month: 'narrow',
      second: '2-digit',
      timeZoneName: 'long',
      weekday: 'long',
      year: '2-digit',
    }), // "Thursday, F 13, 20 AD, 04:28:00 PM Central European Standard Time""
  ]

  return <div>{units}</div>
}
```

### relativeTime

This hook exposes a `relativeTime` function which formats a date relative to now.

The first parameter is a Date or a timestamp. The second is an options object: the native `Intl.RelativeTimeFormat` options (`numeric`, `style`, `localeMatcher`) plus:

- `noSuffix`: drops the "ago"/"in" and returns the bare distance

```js
import { useI18n } from '@scaleway/use-i18n'

const App = () => {
  const { relativeTime } = useI18n()

  const dates = [
    relativeTime(new Date(Date.now() - 3600_000)), // "1 hour ago"
    relativeTime(new Date(Date.now() + 48 * 3600_000)), // "in 2 days"
    relativeTime(new Date(Date.now() - 86_400_000)), // "yesterday" — numeric: "auto" renders CLDR specials
    relativeTime(new Date(Date.now() - 3600_000), { style: 'narrow' }), // "1h ago"
    relativeTime(new Date(Date.now() - 3600_000), { noSuffix: true }), // "1 hour"
  ]

  return <div>{dates}</div>
}
```

### relativeTimeStrict

Same as `relativeTime`, but you pick the unit instead of getting the largest one. It accepts the same options plus:

- `unit`: `'second'`, `'minute'`, `'hour'`, `'day'` (default), `'week'`, `'month'`, `'quarter'` or `'year'`

```js
import { useI18n } from '@scaleway/use-i18n'

const App = () => {
  const { relativeTimeStrict } = useI18n()

  const dates = [
    relativeTimeStrict(new Date(Date.now() - 3499 * 86_400_000)), // "3,499 days ago"
    relativeTimeStrict(new Date(Date.now() - 3499 * 86_400_000), { noSuffix: true }), // "3,499 days"
  ]

  return <div>{dates}</div>
}
```

`noSuffix` is not supported with `unit: 'quarter'` — there is no native unsuffixed form for quarters.

### formatDuration

This hook exposes a `formatDuration` function which formats a number of seconds as a localized duration.

The second parameter can be `'clock'` (`"03:40:50"`), `'clock-milliseconds'` (`"00:00:00:030"`) or any `Intl.DurationFormat` options object — defaulting to `{ style: 'long' }`.

```js
import { useI18n } from '@scaleway/use-i18n'

const App = () => {
  const { formatDuration } = useI18n()

  const durations = [
    formatDuration(13_250), // "3 hours, 40 minutes, 50 seconds"
    formatDuration(13_250, { style: 'narrow' }), // "3h 40m 50s"
    formatDuration(13_250, 'clock'), // "03:40:50"
    formatDuration(0.03, 'clock-milliseconds'), // "00:00:00:030"
    formatDuration(45 * 86_400), // "45 days" — fixed 24h days, not calendar months
  ]

  return <div>{durations}</div>
}
```

Non-finite inputs format like an empty duration: `formatDuration(NaN)` → `''`, `formatDuration(NaN, 'clock')` → `'00:00:00'`.

### formatList

This hook exposes a `formatList` function which can be used to format lists of strings.

The first parameter is an array of strings to format.

It accepts an `options` as second parameter which is an [Intl.ListFormat `options` object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/ListFormat/ListFormat).

```js
import { useI18n } from '@scaleway/use-i18n'

const App = () => {
  const { formatList } = useI18n()

  const cities = [
    formatList(['Paris', 'New York', 'London']), // Paris, New York and London
    formatList(['Paris', 'New York', 'London'], {
      type: 'disjunction',
    }), // Paris, New York or London
  ]

  return <div>{cities}</div>
}
```

### formatUnit

This hook also exposes a `formatUnit` function which can be used to format bits/bytes until [ECMA-402 Unit Preferences](https://github.com/tc39/proposal-smart-unit-preferences) is standardised

We follow the IEC standard (base 10) with SI units (kilo,mega,giga,...) [more info here](https://en.wikipedia.org/wiki/Binary_prefix)

It accepts an `options` as second parameter:

- `unit`: Mandatory (see below)
- `maximumFractionDigits`: The maximum number of fraction digits to use
- `minimumFractionDigits`: The minimum number of fraction digits to use
- `short`: if it should output the short or long form of the unit (think `Kb` vs `kilobits`)

```js
import { useI18n } from '@scaleway/use-i18n'

const App = () => {
  const { formatUnit } = useI18n()

  const units = [
    formatUnit(12, { unit: 'kilobyte' }), // "12 KB" or "12 Ko" in fr and ro
    formatUnit(10 ** 8, { unit: 'bytes-humanized' }), // "100 MB" or "100 Mo" in fr and ro
    formatUnit(10 ** 8, { unit: 'bits-per-second-humanized' }), // "100 Mbps"
  ]

  return <div>{units}</div>
}
```

We currently support two units:

- byte
- bit

Every unit name exists in a singular and a plural form, which are equivalent: `bits` ≡ `bit`, `kilobytes` ≡ `kilobyte`, `bytes-per-second` ≡ `byte-per-second`.

The form of the unit name decides how your number is interpreted:

- **bare unit** — `(kilo|mega|giga|tera|peta|exa|zetta|yotta)(bit|byte)`: the number is already a count in that unit; it is labeled and formatted, never converted
  - `formatUnit(12, { unit: 'megabyte' })` => `"12 MB"` or `"12 Mo"` (in fr/ro)
  - `formatUnit(12, { unit: 'kilobit' })` => `"12 Kb"`
  - `formatUnit(12, { unit: 'byte' })` => `"12 B"` or `"12 o"` (in fr/ro)
- **pinned `-humanized`** — `(kilo|mega|giga|tera|peta|exa|zetta|yotta)(bit|byte)-humanized`: the number is a raw bit/byte count, converted to the named unit. Use it when the displayed unit is fixed — a table where every row must read in the same unit — but the data is stored in bits or bytes
  - `formatUnit(12, { unit: 'kilobyte-humanized' })` => `"0.01 KB"` — twelve bytes, expressed in kilobytes
  - `formatUnit(123456789, { unit: 'gigabyte-humanized' })` => `"0.12 GB"` or `"0.12 Go"` (in fr/ro)
- **auto `-humanized`** — `(byte|bit)s-humanized`: the number is a raw bit/byte count and the best unit is picked for you. Use it when the unit should follow the magnitude
  - `formatUnit(12, { unit: 'bytes-humanized' })` => `"12 B"` — small input, small unit
  - `formatUnit(1234567, { unit: 'bytes-humanized' })` => `"1.23 MB"` or `"1.23 Mo"` (in fr/ro)

The same three forms exist as `-per-second` compounds:

- `(kilo|mega|giga|tera|peta|exa|zetta|yotta)(bit|byte)-per-second` — bare: `formatUnit(1.6, { unit: 'gigabit-per-second' })` => `"1.6 Gbps"`
- `(kilo|mega|giga|tera|peta|exa|zetta|yotta)(bit|byte)-per-second-humanized` — pinned: `formatUnit(12, { unit: 'kilobit-per-second-humanized' })` => `"0.01 Kbps"`
- `(byte|bit)s-per-second-humanized` — auto: `formatUnit(123456789, { unit: 'bytes-per-second-humanized' })` => `"123.46 MBps"`

Here is the full list of available units:

<details>
<summary>Click to expand the 144 unit names</summary>

```text
bit
bit-per-second
bit-humanized
bit-per-second-humanized
bits
bits-per-second
bits-humanized
bits-per-second-humanized
kilobit
kilobit-per-second
kilobit-humanized
kilobit-per-second-humanized
kilobits
kilobits-per-second
kilobits-humanized
kilobits-per-second-humanized
megabit
megabit-per-second
megabit-humanized
megabit-per-second-humanized
megabits
megabits-per-second
megabits-humanized
megabits-per-second-humanized
gigabit
gigabit-per-second
gigabit-humanized
gigabit-per-second-humanized
gigabits
gigabits-per-second
gigabits-humanized
gigabits-per-second-humanized
terabit
terabit-per-second
terabit-humanized
terabit-per-second-humanized
terabits
terabits-per-second
terabits-humanized
terabits-per-second-humanized
petabit
petabit-per-second
petabit-humanized
petabit-per-second-humanized
petabits
petabits-per-second
petabits-humanized
petabits-per-second-humanized
exabit
exabit-per-second
exabit-humanized
exabit-per-second-humanized
exabits
exabits-per-second
exabits-humanized
exabits-per-second-humanized
zettabit
zettabit-per-second
zettabit-humanized
zettabit-per-second-humanized
zettabits
zettabits-per-second
zettabits-humanized
zettabits-per-second-humanized
yottabit
yottabit-per-second
yottabit-humanized
yottabit-per-second-humanized
yottabits
yottabits-per-second
yottabits-humanized
yottabits-per-second-humanized
byte
byte-per-second
byte-humanized
byte-per-second-humanized
bytes
bytes-per-second
bytes-humanized
bytes-per-second-humanized
kilobyte
kilobyte-per-second
kilobyte-humanized
kilobyte-per-second-humanized
kilobytes
kilobytes-per-second
kilobytes-humanized
kilobytes-per-second-humanized
megabyte
megabyte-per-second
megabyte-humanized
megabyte-per-second-humanized
megabytes
megabytes-per-second
megabytes-humanized
megabytes-per-second-humanized
gigabyte
gigabyte-per-second
gigabyte-humanized
gigabyte-per-second-humanized
gigabytes
gigabytes-per-second
gigabytes-humanized
gigabytes-per-second-humanized
terabyte
terabyte-per-second
terabyte-humanized
terabyte-per-second-humanized
terabytes
terabytes-per-second
terabytes-humanized
terabytes-per-second-humanized
petabyte
petabyte-per-second
petabyte-humanized
petabyte-per-second-humanized
petabytes
petabytes-per-second
petabytes-humanized
petabytes-per-second-humanized
exabyte
exabyte-per-second
exabyte-humanized
exabyte-per-second-humanized
exabytes
exabytes-per-second
exabytes-humanized
exabytes-per-second-humanized
zettabyte
zettabyte-per-second
zettabyte-humanized
zettabyte-per-second-humanized
zettabytes
zettabytes-per-second
zettabytes-humanized
zettabytes-per-second-humanized
yottabyte
yottabyte-per-second
yottabyte-humanized
yottabyte-per-second-humanized
yottabytes
yottabytes-per-second
yottabytes-humanized
yottabytes-per-second-humanized
```

</details>
