import type { NumberFormatOptions } from '@formatjs/ecma402-abstract'
import type { Locale as DateFnsLocale } from 'date-fns'
import { formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns'
import type { BaseLocale } from 'international-types'
import PropTypes from 'prop-types'
import type { ReactElement, ReactNode } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import ReactDOM from 'react-dom'
import type { FormatDateOptions } from './formatDate'
import dateFormat from './formatDate'
import type { FormatUnitOptions } from './formatUnit'
import unitFormat from './formatUnit'
import type { IntlListFormatOptions } from './formatters'
import formatters from './formatters'
import type { ReactParamsObject, ScopedTranslateFn, TranslateFn } from './types'

const LOCALE_ITEM_STORAGE = 'locale'

type TranslationsByLocales = Record<string, BaseLocale>
type RequiredGenericContext<Locale extends BaseLocale> =
  keyof Locale extends never
    ? Omit<Context<Locale>, 't' | 'namespaceTranslation'> & {
        t: (str: 'You must pass a generic argument to useI18n()') => void
        namespaceTranslation: (
          str: 'You must pass a generic argument to useI18n()',
        ) => void
      }
    : Context<Locale>

const areNamespacesLoaded = (
  namespaces: string[],
  loadedNamespaces: string[] = [],
) => namespaces.every(n => loadedNamespaces.includes(n))

const getLocaleFallback = (locale: string) => locale.split('-')[0].split('_')[0]

const getCurrentLocale = ({
  defaultLocale,
  supportedLocales,
  localeItemStorage,
}: {
  defaultLocale: string
  supportedLocales: string[]
  localeItemStorage: string
}): string => {
  const languages = navigator.languages || [navigator.language]
  const browserLocales = [...new Set(languages.map(getLocaleFallback))]
  const localeStorage = localStorage.getItem(localeItemStorage)

  return (
    localeStorage ||
    browserLocales.find(locale => supportedLocales.includes(locale)) ||
    defaultLocale
  )
}

type Context<Locale extends BaseLocale> = {
  currentLocale: string
  dateFnsLocale?: DateFnsLocale
  datetime: (
    date: Date | number,
    options?: Intl.DateTimeFormatOptions,
  ) => string
  formatDate: (
    value: Date | number | string,
    options?: FormatDateOptions,
  ) => string
  formatList: (listFormat: string[], options?: IntlListFormatOptions) => string
  formatNumber: (numb: number, options?: NumberFormatOptions) => string
  formatUnit: (value: number, options: FormatUnitOptions) => string
  loadTranslations: (
    namespace: string,
    load?: LoadTranslationsFn,
  ) => Promise<string>
  locales: string[]
  namespaces: string[]
  namespaceTranslation: ScopedTranslateFn<Locale>
  relativeTime: (
    date: Date | number,
    options?: {
      includeSeconds?: boolean
      addSuffix?: boolean
    },
  ) => string
  relativeTimeStrict: (
    date: Date | number,
    options?: {
      addSuffix?: boolean
      unit?: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year'
      roundingMethod?: 'floor' | 'ceil' | 'round'
    },
  ) => string
  setTranslations: React.Dispatch<React.SetStateAction<TranslationsByLocales>>
  switchLocale: (locale: string) => void
  t: TranslateFn<Locale>
  translations: TranslationsByLocales
}

// It's safe to use any here because the Locale can be anything at this point:
// useI18n / useTranslation requires to explicitely give a Locale to use.
const I18nContext = createContext<Context<any> | undefined>(undefined)

export function useI18n<
  // eslint-disable-next-line @typescript-eslint/ban-types
  Locale extends BaseLocale = {},
>(): RequiredGenericContext<Locale> {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within a I18nProvider')
  }

  return context as unknown as RequiredGenericContext<Locale>
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function useTranslation<Locale extends BaseLocale = {}>(
  namespaces: string[] = [],
  load: LoadTranslationsFn | undefined = undefined,
): RequiredGenericContext<Locale> & { isLoaded: boolean } {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a I18nProvider')
  }
  const { loadTranslations, namespaces: loadedNamespaces } = context

  const key = namespaces.join(',')
  useEffect(() => {
    key
      .split(',')
      .map(async (namespace: string) => loadTranslations?.(namespace, load))
  }, [loadTranslations, key, load])

  const isLoaded = useMemo(
    () => areNamespacesLoaded(namespaces, loadedNamespaces),
    [loadedNamespaces, namespaces],
  )

  return {
    ...context,
    isLoaded,
  } as unknown as RequiredGenericContext<Locale> & {
    isLoaded: boolean
  }
}

type LoadTranslationsFn = ({
  namespace,
  locale,
}: {
  namespace: string
  locale: string
}) => Promise<{ default: BaseLocale }>
type LoadLocaleFn = (locale: string) => Promise<Locale>

const I18nContextProvider = ({
  children,
  defaultLoad,
  loadDateLocale,
  defaultDateLocale,
  defaultLocale,
  defaultTranslations = {},
  enableDefaultLocale = false,
  enableDebugKey = false,
  localeItemStorage = LOCALE_ITEM_STORAGE,
  supportedLocales,
}: {
  children: ReactNode
  defaultLoad: LoadTranslationsFn
  loadDateLocale?: LoadLocaleFn
  defaultDateLocale?: Locale
  defaultLocale: string
  defaultTranslations: TranslationsByLocales
  enableDefaultLocale: boolean
  enableDebugKey: boolean
  localeItemStorage: string
  supportedLocales: string[]
}): ReactElement => {
  const [currentLocale, setCurrentLocale] = useState<string>(
    getCurrentLocale({ defaultLocale, localeItemStorage, supportedLocales }),
  )
  const [translations, setTranslations] =
    useState<TranslationsByLocales>(defaultTranslations)
  const [namespaces, setNamespaces] = useState<string[]>([])
  const [dateFnsLocale, setDateFnsLocale] = useState<Locale | undefined>(
    defaultDateLocale ?? undefined,
  )

  useEffect(() => {
    loadDateLocale?.(currentLocale === 'en' ? 'en-GB' : currentLocale)
      .then(setDateFnsLocale)
      .catch(() => loadDateLocale('en-GB').then(setDateFnsLocale))
  }, [loadDateLocale, currentLocale])

  const loadTranslations = useCallback(
    async (namespace: string, load: LoadTranslationsFn = defaultLoad) => {
      const result = {
        [currentLocale]: { default: {} },
        defaultLocale: { default: {} },
      }
      // load default en language
      if (enableDefaultLocale && currentLocale !== defaultLocale) {
        result.defaultLocale = await load({
          locale: defaultLocale,
          namespace,
        })
      }
      result[currentLocale] = await load({
        locale: currentLocale,
        namespace,
      })

      const trad: Record<string, string> = {
        ...result.defaultLocale.default,
        ...result[currentLocale].default,
      }

      // avoid a lot of render when async update
      // This is handled automatically in react 18, but we leave it here for compat
      // https://github.com/reactwg/react-18/discussions/21#discussioncomment-801703
      ReactDOM.unstable_batchedUpdates(() => {
        setTranslations(prevState => ({
          ...prevState,
          ...{
            [currentLocale]: {
              ...prevState[currentLocale],
              ...trad,
            },
          },
        }))

        setNamespaces(prevState => [
          ...new Set([...(prevState || []), namespace]),
        ])
      })

      return namespace
    },
    [defaultLoad, currentLocale, enableDefaultLocale, defaultLocale],
  )

  const switchLocale = useCallback(
    (locale: string) => {
      if (supportedLocales.includes(locale)) {
        localStorage.setItem(localeItemStorage, locale)
        setCurrentLocale(locale)
      }
    },
    [localeItemStorage, setCurrentLocale, supportedLocales],
  )

  const formatNumber = useCallback(
    (numb: number, options?: NumberFormatOptions) =>
      formatters.getNumberFormat(currentLocale, options).format(numb),
    [currentLocale],
  )

  const formatList = useCallback(
    (listFormat: string[], options?: IntlListFormatOptions) =>
      formatters.getListFormat(currentLocale, options).format(listFormat),
    [currentLocale],
  )

  // This a temporary method
  // Once https://github.com/tc39/proposal-smart-unit-preferences is stable we should
  // be able to use formatNumber directly
  const formatUnit = useCallback(
    (value: number, options: FormatUnitOptions) =>
      unitFormat(currentLocale, value, options),
    [currentLocale],
  )

  const formatDate = useCallback(
    (value: Date | number | string, options: FormatDateOptions = 'short') =>
      dateFormat(currentLocale, value, options),
    [currentLocale],
  )

  const datetime = useCallback(
    (date: Date | number, options?: Intl.DateTimeFormatOptions): string =>
      formatters.getDateTimeFormat(currentLocale, options).format(date),
    [currentLocale],
  )

  const relativeTimeStrict = useCallback(
    (
      date: Date | number,
      options: {
        addSuffix?: boolean
        unit?: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year'
        roundingMethod?: 'floor' | 'ceil' | 'round'
      } = { addSuffix: true, unit: 'day' },
    ) => {
      const finalDate = new Date(date)

      return formatDistanceToNowStrict(finalDate, {
        locale: dateFnsLocale,
        ...options,
      })
    },
    [dateFnsLocale],
  )

  const relativeTime = useCallback(
    (
      date: Date | number,
      options: {
        includeSeconds?: boolean
        addSuffix?: boolean
      } = { addSuffix: true },
    ) => {
      const finalDate = new Date(date)

      return formatDistanceToNow(finalDate, {
        locale: dateFnsLocale,
        ...options,
      })
    },
    [dateFnsLocale],
  )

  const translate = useCallback(
    (key: string, context?: ReactParamsObject<any>) => {
      const value = translations[currentLocale]?.[key] as string
      if (!value) {
        if (enableDebugKey) {
          return key
        }

        return ''
      }
      if (context) {
        return formatters
          .getTranslationFormat(value, currentLocale)
          .format(context) as string
      }

      return value
    },
    [currentLocale, translations, enableDebugKey],
  )

  const namespaceTranslation = useCallback(
    (scope: string, t = translate) =>
      (key: string, context?: ReactParamsObject<any>) =>
        t(`${scope}.${key}`, context) || t(key, context),
    [translate],
  )

  const value = useMemo(
    () => ({
      currentLocale,
      dateFnsLocale,
      datetime,
      formatDate,
      formatList,
      formatNumber,
      formatUnit,
      loadTranslations,
      locales: supportedLocales,
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
      dateFnsLocale,
      datetime,
      formatDate,
      formatList,
      formatNumber,
      formatUnit,
      loadTranslations,
      namespaceTranslation,
      namespaces,
      relativeTime,
      relativeTimeStrict,
      setTranslations,
      supportedLocales,
      switchLocale,
      translate,
      translations,
    ],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

I18nContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultDateLocale: PropTypes.shape({}),
  defaultLoad: PropTypes.func.isRequired,
  defaultLocale: PropTypes.string.isRequired,
  defaultTranslations: PropTypes.shape({}),
  enableDebugKey: PropTypes.bool,
  enableDefaultLocale: PropTypes.bool,
  loadDateLocale: PropTypes.func,
  localeItemStorage: PropTypes.string,
  supportedLocales: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default I18nContextProvider
