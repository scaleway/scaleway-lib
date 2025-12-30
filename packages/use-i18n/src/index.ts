import I18nContextProvider from './usei18n'

export type { NumberFormatOptions } from '@formatjs/ecma402-abstract'
export type {
  FormatDistanceToNowOptions,
  FormatDistanceToNowStrictOptions,
} from 'date-fns'
// Re-export international-types for proper TypeScript support
export type {
  BaseLocale,
  LocaleKeys,
  LocaleValue,
  Params,
  Scopes,
} from 'international-types'
export type { FormatDateOptions } from './formatDate'
// Additional types needed for proper TypeScript support
export type { IntlListFormatOptions } from './formatters'
export type { FormatUnitOptions } from './formatUnit'
// Core types
export type {
  ReactParamsObject,
  ScopedTranslateFn,
  ScopedValue,
  TranslateFn,
} from './types'
// Types used in the main I18nContextProvider
export type {
  Context,
  LoadDateLocaleError,
  LoadLocaleFn,
  LoadLocaleFnAsync,
  LoadTranslationsFn,
  RequiredGenericContext,
  SupportedLocalesType,
  TranslationsByLocales,
} from './usei18n'
// Hook exports
export { useI18n, useTranslation } from './usei18n'

export default I18nContextProvider
