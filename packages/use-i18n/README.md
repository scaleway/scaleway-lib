# `@scaleway/use-i18n`

## A tiny hooks to handle i18n translation

## Install

```bash
$ yarn add @scaleway/use-i18n
```

## Usage

```js
import React from 'react'
import I18n from '@scaleway/use-i18n'

const Page = () => {
  const { t } = useI18n()

  return <h1>{t('title')}</h1>
}

const App = () => {
  const defaultLocales = ['fr', 'en']
  const defaultTranslations = {
    title: 'Welcome to I18n hooks',
  }

  return (
    <I18n
      defaultLocale="en"
      defaultLocales={defaultLocales}
      defaultTranslations={defaultTranslations}
    >
      <Page />
    </I18n>
  )
}
```
