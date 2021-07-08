# `@scaleway/use-i18n`

## A tiny hooks to handle i18n translation

## Install

```bash
$ yarn add @scaleway/use-i18n
```

## Usage

### Loading locales

Create a directory with your locales.
Use of local `variables` and `namespace` to dynamically load locales.

**Exemple :**

```
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
const load = ({ locale, namespace }) =>
  import(`./locales/${locale}/${namespace}`)
const loadDateLocale = locale => import(`date-fns/locale/${locale}/index`)
```

Inside your app you will need to use useTranslation to load namespace locales.

if you want to have pre-load locales you can use defaultTranslations.

```js
import I18n from '@scaleway/use-i18n'
import defaultTranslations from './locales/en/common'

const App = () => (
  <I18n
    loadDateLocale={loadDateLocale}
    defaultLocale="en"
    supportedLocales={['en']}
    defaultTranslations={defaultTranslations}
  >
    <App />
  </I18n>
)
```

```js
import React from 'react'
import I18n from '@scaleway/use-i18n'

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

  const load = ({ locale, namespace }) =>
    import(`./locales/${locale}/${namespace}`)

  return (
    <I18n
      defaultLocale="en"
      supportedLocales={defaultLocales}
      defaultTranslations={defaultTranslations}
    >
      <Page />
    </I18n>
  )
}
```

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

### use locales from date-fns

You will need sometimes to give locales to somes compoent
In this example, we will use react-date-picker.js

```js
import { useI18n } from '@scaleway/use-i18n'
import { DateInput } from '@scaleway/ui'

const App = () => {
  const { t, currentLocale dateFnsLocale } = useI18n()

  return (
    <div>
      <DateInput
        currentLocale={currentLocale}
        locale={dateFnsLocale}
        label={t('form.fields.date.label')}
        placeholder={t('form.fields.date.placeholder')}
      />
    </div>
  )
}
```

### formatUnit

This hook also exposes a `formatUnit` function which can be used to format bits/bytes until [ECMA-402 Unit Preferences](https://github.com/tc39/proposal-smart-unit-preferences) is standardised

It accepts an `options` as second parameter:
- `unit`: Manadatory (see below)
- `maximumFractionDigits`: The maximum number of fraction digits to use
- `short`: if it should output the short or long form of the unit (think `Kb` vs `kilobits`)


```js
import { useI18n } from '@scaleway/use-i18n'
import { DateInput } from '@scaleway/ui'

const App = () => {
  const { formatUnit } = useI18n()

  const units = [
    formatUnit(12 { unit: 'kilobyte' }) // "12 KB" or "12 Ko" in fr an ro
    formatUnit(10 ** 8 { unit: 'bytes-humanized' }) // "100 MB" or "100 Mo" in fr an ro
    formatUnit(10 ** 8 { unit: 'bits-per-second-humanized' }) // "100Mbs"
  ]

  return (
    <div>
      {units}
    </div>
  )
}
```

We currently support two different unit:
- byte
- bit

With each some variants :
- `(kilo|mega|giga|tera|peta|exa|zetta|yotta)(bit|byte)`: This is the bare unit
  - `formatUnit(12, { unit: 'megabyte' })` => `"12 MB"` or `"12 Mo"` (in fr/ro)
  - `formatUnit(12, { unit: 'kilobit' })` => `"12 Kb"`
  - `formatUnit(12, { unit: 'gigabit' })` => `"12 Gb"`
  - `formatUnit(12, { unit: 'byte' })` => `"12 B"` or `"12 o"` (in fr/ro)
- `(byte|bit)s-humanized`: This is an automated unit which will print a human readable value
  - `formatUnit(1234567, { unit: 'bytes-humanized' })` => `"1.23 MB"` or `"1.23 Mo"` (in fr/ro)
- `(kilo|mega|giga|tera|peta|exa|zetta|yotta)(bit|byte)(byte|bit)-humanized`: This is also an automated unit which will print a human readable value but in the unit specified
  - `formatUnit(123456789, { unit: 'gigabyte-humanized' })` => `"0.12 GB"` or `"0.12 Go"` (in fr/ro)
  - `formatUnit(123456789, { unit: 'kilobyte-humanized' })` => `"123456.78 KB"` or `"123456.78 Ko"` (in fr/ro)

There is also a compound variant which can only be used with bits:
- `(kilo|mega|giga|tera|peta|exa|zetta|yotta)bit-per-second`
  - `formatUnit(1.6, { unit: 'gigabit-per-second' })` => `1.6 Gbps`
  - `formatUnit(1.6, { unit: 'bit-per-second' })` => `1.6 bps`
- `bits-per-second-humanized`: Automated unit
  - `formatUnit(123456789, { unit: 'bits-per-second-humanized' })` => `123.46 Mbps`
- `(kilo|mega|giga|tera|peta|exa|zetta|yotta)bit-per-second-humanized`: Humandreadable value in the unit specified
  - `formatUnit(123456789, { unit: 'gigabit-per-second-humanized' })` => `0.12 Gbps`
  - `formatUnit(123456789, { unit: 'kilobit-per-second-humanized' })` => `123456.78 Kbps`


Here is the full list of available units:
```
bits-humanized
bits-per-second-humanized
bit
bit-per-second
bit-humanized
bit-per-second-humanized
kilobit
kilobit-per-second
kilobit-humanized
kilobit-per-second-humanized
megabit
megabit-per-second
megabit-humanized
megabit-per-second-humanized
gigabit
gigabit-per-second
gigabit-humanized
gigabit-per-second-humanized
terabit
terabit-per-second
terabit-humanized
terabit-per-second-humanized
petabit
petabit-per-second
petabit-humanized
petabit-per-second-humanized
exabit
exabit-per-second
exabit-humanized
exabit-per-second-humanized
zettabit
zettabit-per-second
zettabit-humanized
zettabit-per-second-humanized
yottabit
yottabit-per-second
yottabit-humanized
yottabit-per-second-humanized
bytes-humanized
byte
byte-humanized
kilobyte
kilobyte-humanized
megabyte
megabyte-humanized
gigabyte
gigabyte-humanized
terabyte
terabyte-humanized
petabyte
petabyte-humanized
exabyte
exabyte-humanized
zettabyte
zettabyte-humanized
yottabyte
yottabyte-humanized
```
