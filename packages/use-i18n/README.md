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
your loader will be:
```js
const load = ({ locale, namespace }) =>
  import(`./locales/${locale}/${namespace}`)
```
Inside your app you will need to use useTranslation to load namespace locales.

if you want to have pre-load locales you can use defaultTranslations.

```js
import I18N from '@scaleway/use-i18n'
import defaultTranslations from './locales/en/common';

<I18N
  defaultLocale="en"
  supportedLocales={['en']}
  defaultTranslations={defaultTranslations}
>
  <App />
</I18N>
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
  const i18n = useTranslation(['app','common'])

  return <>{i18n.t('app.user')}(</>
}

```

```js
import { useI18n } from '@scaleway/use-i18n'

const App = () => {
  const i18n = useTranslation()
  const { loadTranslations } = i18n
  const namespaces = ['app','common']

  const key = namespaces.join(',')

  useEffect(
    () =>
      key.split(',').map(async namespace => loadTranslations(namespace, load)),
    [loadTranslations, key, load],
  )

  return <>{i18n.t('app.user')}(</>
}

```



```js
import {useI18n} from '@scaleway/use-i18n'

const { namespaceTranslation} = useI18n()
const t = namespaceTranslation('namespace.home.users.table.header')
```

### use namespaceTranslation

Namespace translation help you when you have some very long key
Exemple of your locale key: `namespace.home.users.table.header.link`

```js
import {useI18n} from '@scaleway/use-i18n'

const { namespaceTranslation} = useI18n()
const t = namespaceTranslation('namespace.home.users.table.header')
```
