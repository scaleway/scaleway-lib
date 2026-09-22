import type { Cache } from '@formatjs/fast-memoize'
import { memoize, strategies } from '@formatjs/fast-memoize'
import IntlTranslationFormat from 'intl-messageformat'

// Deeply inspired by https://github.com/formatjs/formatjs/blob/7406e526a9c5666cee22cc2316dad1fa1d88697c/packages/intl-messageformat/src/core.ts

type BaseFormatters = {
  getNumberFormat: (...args: ConstructorParameters<typeof Intl.NumberFormat>) => Intl.NumberFormat
  getDateTimeFormat: (...args: ConstructorParameters<typeof Intl.DateTimeFormat>) => Intl.DateTimeFormat
  getPluralRules: (...args: ConstructorParameters<typeof Intl.PluralRules>) => Intl.PluralRules
  getListFormat: (...args: ConstructorParameters<typeof Intl.ListFormat>) => Intl.ListFormat
}

function createFastMemoizeCache<V>(): Cache<string, V> {
  const store = new Map<string, V | undefined>()

  return {
    create() {
      return {
        get(key) {
          return store.get(key)
        },
        set(key, value) {
          store.set(key, value)
        },
      }
    },
  }
}

const baseFormatters: BaseFormatters = {
  getDateTimeFormat: memoize(
    (...args: ConstructorParameters<typeof Intl.DateTimeFormat>) => new Intl.DateTimeFormat(...args),
    {
      cache: createFastMemoizeCache<Intl.DateTimeFormat>(),
      strategy: strategies.variadic,
    },
  ),

  getListFormat: memoize((...args: ConstructorParameters<typeof Intl.ListFormat>) => new Intl.ListFormat(...args), {
    cache: createFastMemoizeCache<Intl.ListFormat>(),
    strategy: strategies.variadic,
  }),
  getNumberFormat: memoize(
    (...args: ConstructorParameters<typeof Intl.NumberFormat>) => new Intl.NumberFormat(...args),
    {
      cache: createFastMemoizeCache<Intl.NumberFormat>(),
      strategy: strategies.variadic,
    },
  ),
  getPluralRules: memoize((...args: ConstructorParameters<typeof Intl.PluralRules>) => new Intl.PluralRules(...args), {
    cache: createFastMemoizeCache<Intl.PluralRules>(),
    strategy: strategies.variadic,
  }),
}

type Formatters = BaseFormatters & {
  getTranslationFormat: (...args: ConstructorParameters<typeof IntlTranslationFormat>) => IntlTranslationFormat
}

type TranslationFormatParameter = ConstructorParameters<typeof IntlTranslationFormat>

const formatters: Formatters = {
  ...baseFormatters,
  getTranslationFormat: memoize(
    // oxlint-disable-next-line max-params
    (
      message: TranslationFormatParameter[0],
      locales: TranslationFormatParameter[1],
      overrideFormats: TranslationFormatParameter[2],
      opts: TranslationFormatParameter[3],
    ) =>
      new IntlTranslationFormat(message, locales, overrideFormats, {
        formatters: baseFormatters,
        ...opts,
      }),
    {
      cache: createFastMemoizeCache<IntlTranslationFormat>(),
      strategy: strategies.variadic,
    },
  ),
}

export default formatters
