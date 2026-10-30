import type {
  Locale as DateFnsLocale,
  FormatDurationOptions as FnsFormatDurationOptions,
  FormatDistanceToNowOptions,
  FormatDistanceToNowStrictOptions,
} from 'date-fns'
import { createContext, useContext, useEffect, useMemo } from 'react'
import type { FormatDateOptions } from './formatDate'
import type { FormatUnitOptions } from './formatUnit'
import type { BaseLocale } from './international-types'
import type { ScopedTranslateFn, TranslateFn } from './types'

// Export types that are used in the public API

export type TranslationsByLocales = Record<string, BaseLocale>

export type LoadTranslationsFn<LocalSupportedType extends string> = ({
  namespace,
  locale,
}: {
  namespace: string
  locale: LocalSupportedType
}) => Promise<{ default: BaseLocale }>

export type LoadLocaleFn<LocalSupportedType extends string> = (locale: LocalSupportedType) => DateFnsLocale

export type LoadLocaleFnAsync<LocalSupportedType extends string> = (
  locale: LocalSupportedType,
) => Promise<DateFnsLocale>

export type LoadDateLocaleError = (error: Error) => void

export type RequiredGenericContext<
  LocaleParam extends BaseLocale,
  LocalSupportedType extends string,
> = keyof LocaleParam extends never
  ? Omit<Context<LocaleParam, LocalSupportedType>, 't' | 'namespaceTranslation'> & {
      t: (str: 'You must pass a generic argument to useI18n()') => void
      namespaceTranslation: (str: 'You must pass a generic argument to useI18n()') => void
    }
  : Context<LocaleParam, LocalSupportedType>

const areNamespacesLoaded = (namespaces: string[], loadedNamespaces: string[] = []) =>
  namespaces.every(n => loadedNamespaces.includes(n))

export type FormatDurationOptions = Omit<FnsFormatDurationOptions, 'locale'> | 'clock' | 'clock-milliseconds'

export type Context<LocaleParam extends BaseLocale, LocalSupportedType extends string> = {
  currentLocale: LocalSupportedType
  dateFnsLocale?: DateFnsLocale
  datetime: (date: Date | number, options?: Intl.DateTimeFormatOptions) => string
  formatDate: (value: Date | number | string, options?: FormatDateOptions) => string
  formatList: (listFormat: string[], options?: Intl.ListFormatOptions) => string
  formatNumber: (numb: number, options?: Intl.NumberFormatOptions) => string
  formatUnit: (value: number, options: FormatUnitOptions) => string
  formatDuration: (value: number, options?: FormatDurationOptions) => string
  loadTranslations: (namespace: string, load?: LoadTranslationsFn<LocalSupportedType>) => Promise<string>
  namespaces: string[]
  namespaceTranslation: ScopedTranslateFn<LocaleParam>
  relativeTime: (date: Date | number, options?: FormatDistanceToNowOptions) => string
  relativeTimeStrict: (date: Date | number, options?: FormatDistanceToNowStrictOptions) => string
  setTranslations: React.Dispatch<React.SetStateAction<TranslationsByLocales>>
  switchLocale: (locale: LocalSupportedType) => Promise<void>
  t: TranslateFn<LocaleParam>
  translations: TranslationsByLocales
}

// It's safe to use any here because the Locale can be anything at this point:
// useI18n / useTranslation requires to explicitely give a Locale to use.
// oxlint-disable-next-line eslint/no-explicit-any
export const I18nContext = createContext<Context<any, any> | undefined>(undefined)

export function useI18n<
  LocaleParam extends BaseLocale = BaseLocale,
  LocalSupportedType extends string = '',
>(): RequiredGenericContext<LocaleParam, LocalSupportedType> {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within a I18nProvider')
  }

  return context as unknown as RequiredGenericContext<LocaleParam, LocalSupportedType>
}

export function useTranslation<LocaleParam extends BaseLocale = BaseLocale, LocalSupportedType extends string = ''>(
  namespaces: [string, ...string[]],
  load?: LoadTranslationsFn<LocalSupportedType>,
): RequiredGenericContext<LocaleParam, LocalSupportedType> & {
  isLoaded: boolean
} {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a I18nProvider')
  }
  const { loadTranslations, namespaces: loadedNamespaces } = context

  // here we generate a key string from the array of namespace in order to only trigger the use effect
  // when the passed keys change and not when the ref of the array change
  const key = namespaces.join(',')
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    key.split(',').map(async (namespace: string) => loadTranslations(namespace, load))
  }, [loadTranslations, key, load])

  const isLoaded = useMemo(() => areNamespacesLoaded(namespaces, loadedNamespaces), [loadedNamespaces, namespaces])

  return {
    ...context,
    isLoaded,
  } as unknown as RequiredGenericContext<LocaleParam, LocalSupportedType> & {
    isLoaded: boolean
  }
}
