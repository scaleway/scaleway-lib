import type { ReactElement, ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import type { FormatDateOptions } from './formatDate'
import dateFormat from './formatDate'
import durationFormat from './formatDuration'
import type { FormatDurationOptions } from './formatDuration'
import formatters from './formatters'
import type { FormatUnitOptions } from './formatUnit'
import unitFormat from './formatUnit'
import { getCurrentLocale, setLangAttribute } from './helpers'
import type { BaseLocale } from './international-types'
import { relativeTime as relativeTimeFormat, relativeTimeStrict as relativeTimeStrictFormat } from './relativeTime'
import type { RelativeTimeOptions, RelativeTimeStrictOptions } from './relativeTime'
import type { ReactParamsObject, SupportedLocalesType } from './types'
import type { LoadTranslationsFn, TranslationsByLocales } from './usei18n'
import { I18nContext } from './usei18n'

const LOCALE_ITEM_STORAGE = 'locale'

const initialDefaultTranslations = {}

const I18nContextProvider = <LocalSupportedType extends string>({
  children,
  rootElement,
  defaultLoad,
  defaultLocale,
  defaultTranslations = initialDefaultTranslations,
  enableDebugKey = false,
  enableDefaultLocale = false,
  localeItemStorage = LOCALE_ITEM_STORAGE,
  onTranslateError,
  onLoadTranslationError,
  isLocaleSupported,
}: {
  children: ReactNode
  rootElement?: Element
  defaultLoad: LoadTranslationsFn<LocalSupportedType>
  defaultLocale: LocalSupportedType
  defaultTranslations?: TranslationsByLocales
  enableDefaultLocale?: boolean
  enableDebugKey?: boolean
  localeItemStorage?: string
  isLocaleSupported: SupportedLocalesType<LocalSupportedType>
  onLoadTranslationError?: (error: unknown) => void
  onTranslateError?: ({
    error,
    currentLocale,
    value,
    key,
  }: {
    error: Error
    currentLocale: LocalSupportedType
    defaultLocale: LocalSupportedType
    value: string
    key: string
  }) => void
}): ReactElement => {
  const [currentLocale, setCurrentLocale] = useState<LocalSupportedType>(
    getCurrentLocale({
      defaultLocale,
      isLocaleSupported,
      localeItemStorage,
      rootElement,
    }),
  )
  const [translations, setTranslations] = useState<TranslationsByLocales>(defaultTranslations)
  const [namespaces, setNamespaces] = useState<string[]>([])

  const loadTranslations = useCallback(
    async (namespace: string, load: LoadTranslationsFn<LocalSupportedType> = defaultLoad) => {
      const result: Record<string, { default: BaseLocale } | undefined> = {
        [currentLocale]: { default: {} },
        [defaultLocale]: { default: {} },
      }
      // load default en language
      if (enableDefaultLocale && currentLocale !== defaultLocale) {
        try {
          const defaultLocaleLoad = await load({
            locale: defaultLocale,
            namespace,
          })

          result[defaultLocale] = defaultLocaleLoad
        } catch (error: unknown) {
          onLoadTranslationError?.(error)
        }
      }

      try {
        const defaultCurrentLocaleLoad = await load({
          locale: currentLocale,
          namespace,
        })
        result[currentLocale] = defaultCurrentLocaleLoad
      } catch (error: unknown) {
        onLoadTranslationError?.(error)
      }

      const trad = {
        ...result[defaultLocale]?.default,
        ...result[currentLocale]?.default,
      }

      setTranslations(prevState => ({
        ...prevState,
        [defaultLocale]: {
          ...prevState[defaultLocale],
          ...result[defaultLocale]?.default,
        },
        [currentLocale]: {
          ...prevState[currentLocale],
          ...trad,
        },
      }))

      setNamespaces(prevState => [...new Set([...prevState, namespace])])

      return namespace
    },
    [defaultLoad, currentLocale, enableDefaultLocale, defaultLocale, onLoadTranslationError],
  )

  const switchLocale = useCallback(
    (locale: LocalSupportedType): void => {
      if (isLocaleSupported(locale)) {
        localStorage.setItem(localeItemStorage, locale)
        setLangAttribute(locale, rootElement)
        setCurrentLocale(locale)
      }
    },
    [localeItemStorage, setCurrentLocale, isLocaleSupported, rootElement],
  )

  const formatNumber = useCallback(
    (numb: number, options?: Intl.NumberFormatOptions) =>
      formatters.getNumberFormat(currentLocale, options).format(numb),
    [currentLocale],
  )

  const formatList = useCallback(
    (listFormat: string[], options?: Intl.ListFormatOptions) =>
      formatters.getListFormat(currentLocale, options).format(listFormat),
    [currentLocale],
  )

  // This a temporary method
  // Once https://github.com/tc39/proposal-smart-unit-preferences is stable we should
  // be able to use formatNumber directly
  const formatUnit = useCallback(
    (value: number, options: FormatUnitOptions) => unitFormat(currentLocale, value, options),
    [currentLocale],
  )

  const formatDate = useCallback(
    (value: Date | number | string, options: FormatDateOptions = 'short') => dateFormat(currentLocale, value, options),
    [currentLocale],
  )

  const datetime = useCallback(
    (date: Date | number, options?: Intl.DateTimeFormatOptions): string =>
      formatters.getDateTimeFormat(currentLocale, options).format(date),
    [currentLocale],
  )

  const relativeTimeStrict = useCallback(
    (date: Date | number, options?: RelativeTimeStrictOptions) =>
      relativeTimeStrictFormat(currentLocale, date, options),
    [currentLocale],
  )

  const formatDuration = useCallback(
    (durationInSeconds: number, format?: FormatDurationOptions) =>
      durationFormat(currentLocale, durationInSeconds, format),
    [currentLocale],
  )

  const relativeTime = useCallback(
    (date: Date | number, options?: RelativeTimeOptions) => relativeTimeFormat(currentLocale, date, options),
    [currentLocale],
  )

  const translate = useCallback(
    // oxlint-disable-next-line eslint/no-explicit-any
    (key: string, context?: ReactParamsObject<any>) => {
      const value = translations[currentLocale]?.[key] as string

      if (enableDebugKey) {
        return key
      }

      if (!value) {
        return ''
      }

      if (context) {
        try {
          return formatters.getTranslationFormat(value, currentLocale).format(context) as string
        } catch (error) {
          onTranslateError?.({
            currentLocale,
            defaultLocale,
            error: error instanceof Error ? error : new Error(String(error)),
            key,
            value,
          })

          // with default locale nothing should break or it's normal to not ignore it.
          const defaultValue = translations[defaultLocale]?.[key] as string

          return formatters.getTranslationFormat(defaultValue, defaultLocale).format(context) as string
        }
      }

      return value
    },
    [currentLocale, translations, enableDebugKey, defaultLocale, onTranslateError],
  )

  const namespaceTranslation = useCallback(
    (scope: string, t = translate) =>
      // oxlint-disable-next-line eslint/no-explicit-any
      (key: string, context?: ReactParamsObject<any>) =>
        t(`${scope}.${key}`, context) || t(key, context),
    [translate],
  )

  const value = useMemo(
    () => ({
      currentLocale,
      datetime,
      formatDate,
      formatList,
      formatNumber,
      formatUnit,
      formatDuration,
      loadTranslations,
      namespaces,
      namespaceTranslation,
      relativeTime,
      relativeTimeStrict,
      setTranslations,
      switchLocale,
      t: translate,
      translations,
    }),
    [
      currentLocale,
      datetime,
      formatDate,
      formatList,
      formatNumber,
      formatUnit,
      formatDuration,
      loadTranslations,
      namespaceTranslation,
      namespaces,
      relativeTime,
      relativeTimeStrict,
      setTranslations,
      switchLocale,
      translate,
      translations,
    ],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export default I18nContextProvider
