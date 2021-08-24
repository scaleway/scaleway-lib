import { Locale, formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns'
import PropTypes from 'prop-types'
import React, {
  ReactElement,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import ReactDOM from 'react-dom'
import 'intl-pluralrules'
import dateFormat, { FormatDateOptions } from './formatDate'
import unitFormat, { FormatUnitOptions } from './formatUnit'
import formatters, { IntlListFormatOptions } from './formatters'

const LOCALE_ITEM_STORAGE = 'locale'

type PrimitiveType = string | number | boolean | null | undefined | Date;

type Translations = Record<string, string> & { prefix?: string }
type TranslationsByLocales = Record<string, Translations>
type TranslateFn = (key: string, context?: Record<string, PrimitiveType>) => string

const prefixKeys = (prefix: string) => (obj: { [key: string]: string }) =>
  Object.keys(obj).reduce((acc: { [key: string ]: string }, key) => {
    acc[`${prefix}${key}`] = obj[key]

    return acc
  }, {})

const areNamespacesLoaded = (namespaces: string[], loadedNamespaces: string[] = []) =>
  namespaces.every(n => loadedNamespaces.includes(n))

const getLocaleFallback = (locale: string) => locale.split('-')[0].split('_')[0]

const getCurrentLocale = ({
  defaultLocale,
  supportedLocales,
  localeItemStorage,
}: {
  defaultLocale: string,
  supportedLocales: string[],
  localeItemStorage: string,
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

interface Context {
  currentLocale: string
  dateFnsLocale?: Locale,
  datetime: (date: Date | number, options?: Intl.DateTimeFormatOptions) => string,
  formatDate: (value: Date | number | string, options: FormatDateOptions) => string,
  formatList: (listFormat: string[], options?: IntlListFormatOptions) => string,
  formatNumber: (numb: number, options?: Intl.NumberFormatOptions) => string,
  formatUnit: (value: number, options: FormatUnitOptions) => string,
  loadTranslations: (namespace: string, load?: LoadTranslationsFn) => Promise<string>,
  locales: string[],
  namespaces: string[],
  namespaceTranslation: (namespace: string, t?: TranslateFn) => TranslateFn
  relativeTime: (date: Date | number, options?: {
    includeSeconds?: boolean;
    addSuffix?: boolean;
  }) => string,
  relativeTimeStrict: (date: Date | number, options?: {
    addSuffix?: boolean;
    unit?: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year';
    roundingMethod?: 'floor' | 'ceil' | 'round';
  }) => string,
  setTranslations: React.Dispatch<React.SetStateAction<TranslationsByLocales>>,
  switchLocale: (locale: string) => void,
  t: TranslateFn,
  translations: TranslationsByLocales,
}

const I18nContext = createContext<Context | undefined>(undefined)

export const useI18n = (): Context => {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within a I18nProvider')
  }

  return context
}

export const useTranslation = (namespaces: string[] = [], load?: LoadTranslationsFn): Context & { isLoaded: boolean } => {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useTranslation must be used within a I18nProvider')
  }
  const { loadTranslations, namespaces: loadedNamespaces } = context

  const key = namespaces.join(',')
  useEffect(() => {
    key.split(',').map(async (namespace: string) => loadTranslations?.(namespace, load))
  }, [loadTranslations, key, load])

  const isLoaded = useMemo(
    () => areNamespacesLoaded(namespaces, loadedNamespaces),
    [loadedNamespaces, namespaces],
  )

  return { ...context, isLoaded }
}

type LoadTranslationsFn = ({ namespace, locale }: { namespace: string, locale: string}) => Promise<{ default: Translations}>
type LoadLocaleFn = (locale: string) => Promise<Locale>

const I18nContextProvider = ({
  children,
  defaultLoad,
  loadDateLocale,
  defaultLocale,
  defaultTranslations,
  enableDefaultLocale,
  enableDebugKey,
  localeItemStorage,
  supportedLocales,
}: {
  children: ReactNode,
  defaultLoad: LoadTranslationsFn,
  loadDateLocale: LoadLocaleFn,
  defaultLocale: string,
  defaultTranslations: TranslationsByLocales,
  enableDefaultLocale: boolean,
  enableDebugKey: boolean,
  localeItemStorage: string,
  supportedLocales: string[],
}): ReactElement => {
  const [currentLocale, setCurrentLocale] = useState<string>(
    getCurrentLocale({ defaultLocale, localeItemStorage, supportedLocales }),
  )
  const [translations, setTranslations] = useState<TranslationsByLocales>(defaultTranslations)
  const [namespaces, setNamespaces] = useState<string[]>([])
  const [dateFnsLocale, setDateFnsLocale] = useState<Locale>()

  useEffect(() => {
    loadDateLocale(currentLocale === 'en' ? 'en-GB' : currentLocale)
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

      const trad: Translations = {
        ...result.defaultLocale.default,
        ...result[currentLocale].default,
      }

      const { prefix, ...values } = trad
      const preparedValues = prefix ? prefixKeys(`${prefix}.`)(values) : values

      // avoid a lot of render when async update
      ReactDOM.unstable_batchedUpdates(() => {
        setTranslations(prevState => ({
          ...prevState,
          ...{
            [currentLocale]: {
              ...prevState[currentLocale],
              ...preparedValues,
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
    (numb: number, options?: Intl.NumberFormatOptions) => formatters.getNumberFormat(currentLocale, options).format(numb),
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
    (value: Date | number | string, options: FormatDateOptions) =>
      dateFormat(currentLocale, value, options),
    [currentLocale],
  )

  const datetime = useCallback(
    // intl-format-chache does not forwrad return types
    // eslint-disable-next-line
    (date: Date | number, options?: Intl.DateTimeFormatOptions): string => formatters.getDateTimeFormat(currentLocale, options).format(date),
    [currentLocale],
  )

  const relativeTimeStrict = useCallback(
    (date: Date | number, options: {
      addSuffix?: boolean
      unit?: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year'
      roundingMethod?: 'floor' | 'ceil' | 'round'
    } = { addSuffix: true, unit: 'day' }) => {
      const finalDate = new Date(date)

      return formatDistanceToNowStrict(finalDate, {
        locale: dateFnsLocale,
        ...options,
      })
    },
    [dateFnsLocale],
  )

  const relativeTime = useCallback(
    (date: Date | number, options: {
      includeSeconds?: boolean
      addSuffix?: boolean
    } = { addSuffix: true }) => {
      const finalDate = new Date(date)

      return formatDistanceToNow(finalDate, {
        locale: dateFnsLocale,
        ...options,
      })
    },
    [dateFnsLocale],
  )

  const translate = useCallback<TranslateFn>(
    (key: string, context?: Record<string, PrimitiveType>) => {
      const value = translations[currentLocale]?.[key]
      if (!value) {
        if (enableDebugKey) {
          return key
        }

        return ''
      }
      if (context) {
        // intl-format-chache does not forwrad return types
        // eslint-disable-next-line
        return formatters.getTranslationFormat(value, currentLocale).format(context) as string
      }

      return value
    },
    [currentLocale, translations, enableDebugKey],
  )

  const namespaceTranslation = useCallback(
    (namespace: string, t: TranslateFn = translate) =>
      (identifier: string, context?: Record<string, PrimitiveType>) =>
        t(`${namespace}.${identifier}`, context) || t(identifier, context),
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

I18nContextProvider.defaultProps = {
  defaultTranslations: {},
  enableDebugKey: false,
  enableDefaultLocale: false,
  localeItemStorage: LOCALE_ITEM_STORAGE,
}

I18nContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultLoad: PropTypes.func.isRequired,
  defaultLocale: PropTypes.string.isRequired,
  defaultTranslations: PropTypes.shape({}),
  enableDebugKey: PropTypes.bool,
  enableDefaultLocale: PropTypes.bool,
  loadDateLocale: PropTypes.func.isRequired,
  localeItemStorage: PropTypes.string,
  supportedLocales: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default I18nContextProvider
