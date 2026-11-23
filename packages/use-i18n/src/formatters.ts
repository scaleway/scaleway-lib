import IntlTranslationFormat from 'intl-messageformat'
import type { Formatters as IntlFormatters } from 'intl-messageformat'
import { memoize } from './memoize'

// Deeply inspired by https://github.com/formatjs/formatjs/blob/7406e526a9c5666cee22cc2316dad1fa1d88697c/packages/intl-messageformat/src/core.ts

type BaseFormatters = {
  getNumberFormat: (...args: ConstructorParameters<typeof Intl.NumberFormat>) => Intl.NumberFormat
  getDateTimeFormat: (...args: ConstructorParameters<typeof Intl.DateTimeFormat>) => Intl.DateTimeFormat
  getPluralRules: (...args: ConstructorParameters<typeof Intl.PluralRules>) => Intl.PluralRules
  getListFormat: (...args: ConstructorParameters<typeof Intl.ListFormat>) => Intl.ListFormat
  getRelativeTimeFormat: (...args: ConstructorParameters<typeof Intl.RelativeTimeFormat>) => Intl.RelativeTimeFormat
  getDurationFormat: (...args: ConstructorParameters<typeof Intl.DurationFormat>) => Intl.DurationFormat
}

const baseFormatters: BaseFormatters = {
  getDateTimeFormat: memoize(
    (...args: ConstructorParameters<typeof Intl.DateTimeFormat>) => new Intl.DateTimeFormat(...args),
  ),

  getListFormat: memoize((...args: ConstructorParameters<typeof Intl.ListFormat>) => new Intl.ListFormat(...args)),

  getNumberFormat: memoize(
    (...args: ConstructorParameters<typeof Intl.NumberFormat>) => new Intl.NumberFormat(...args),
  ),

  getPluralRules: memoize((...args: ConstructorParameters<typeof Intl.PluralRules>) => new Intl.PluralRules(...args)),

  getRelativeTimeFormat: memoize(
    (...args: ConstructorParameters<typeof Intl.RelativeTimeFormat>) => new Intl.RelativeTimeFormat(...args),
  ),

  getDurationFormat: memoize(
    (...args: ConstructorParameters<typeof Intl.DurationFormat>) => new Intl.DurationFormat(...args),
  ),
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
        // shortcut: intl-messageformat's Formatters drifts from lib's Intl types (trailingZeroDisplay, useGrouping), drop the cast when they align
        formatters: baseFormatters as IntlFormatters,
        ...opts,
      }),
  ),
}

// format() can return a rich-text array when message values contain callbacks;
// plain messages always format to a string, and the rare array joins back to text.
export const formatToString = (formatted: unknown): string =>
  Array.isArray(formatted) ? formatted.join('') : String(formatted)

export default formatters
