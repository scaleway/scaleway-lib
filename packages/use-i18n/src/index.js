import { formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns'
import memoizeIntlConstructor from 'intl-format-cache'
import IntlTranslationFormat from 'intl-messageformat'
import PropTypes from 'prop-types'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import 'intl-pluralrules'

const DEFAULT_LOCALE = 'en'
const APP_LOCALES = ['en', 'fr']
const ENABLE_DEFAULT_LOCAL = true
const LOCALE_ITEM_STORAGE = 'locale'

const prefixKeys = prefix => obj =>
  Object.keys(obj).reduce((acc, key) => {
    acc[prefix + key] = obj[key]

    return acc
  }, {})

export const I18nContext = createContext()
export const useI18n = () => useContext(I18nContext)

export const useTranslation = (namespaces = []) => {
  const { loadTranslations, ...i18n } = useContext(I18nContext)
  const key = namespaces.join(',')
  useEffect(
    () => key.split(',').map(namespace => loadTranslations(namespace)),
    [loadTranslations, key],
  )

  return { loadTranslations, ...i18n }
}

// https://formatjs.io/docs/intl-messageformat/
const getTranslationFormat = memoizeIntlConstructor(IntlTranslationFormat)
const getNumberFormat = memoizeIntlConstructor(Intl.NumberFormat)
const getDateTimeFormat = memoizeIntlConstructor(Intl.DateTimeFormat)
const getListFormat = memoizeIntlConstructor(Intl.ListFormat)

const loadDateFnsLocale = locale => import(`date-fns/locale/${locale}/index`)

const loadNamespace = async (namespace, locale) =>
  import(`../../pages/${namespace}/locales/${locale}`)

const I18nContextProvider = ({
  children,
  enableDefaultLocal,
  defaultLocale,
  defaultLocales,
  defaultTranslations,
  localeItemStorage,
}) => {
  const [currentLocale, setCurrentLocale] = useState(defaultLocale)
  const [locales, setLocales] = useState(defaultLocales)
  const [translations, setTranslations] = useState(defaultTranslations)
  const [dateFnsLocal, setDateFnsLocal] = useState(defaultLocale)

  const loadTranslations = useCallback(
    async namespace => {
      const result = {
        defaultLocale: { default: {} },
        [currentLocale]: { default: {} },
      }
      // load default en language
      if (enableDefaultLocal && currentLocale !== defaultLocale) {
        result.defaultLocale = await loadNamespace(namespace, defaultLocale)
      }
      result[currentLocale] = await loadNamespace(namespace, currentLocale)
      const trad = {
        ...result?.defaultLocale?.default,
        ...result?.[currentLocale]?.default,
      }
      const { prefix, ...values } = trad
      const preparedValues = prefix ? prefixKeys(`${prefix}.`)(values) : values
      setTranslations(prevState => ({ ...prevState, ...preparedValues }))

      return namespace
    },
    [currentLocale, defaultLocale, setTranslations, enableDefaultLocal],
  )

  const getLocaleFallback = useCallback(
    locale => locale.split('-')[0].split('_')[0],
    [],
  )

  const getCurrentLocale = useCallback(() => {
    const languages = navigator.languages || [navigator.language]
    const browserLocales = [...new Set(languages.map(getLocaleFallback))]
    const localeStorage = localStorage.getItem(localeItemStorage)

    return (
      localeStorage ||
      browserLocales.find(locale => locales.includes(locale)) ||
      defaultLocale
    )
  }, [defaultLocale, getLocaleFallback, locales, localeItemStorage])

  const switchLocale = useCallback(
    locale => {
      if (locales.includes(locale)) {
        localStorage.setItem(localeItemStorage, locale)
        setCurrentLocale(locale)
      }
    },
    [setCurrentLocale, locales, localeItemStorage],
  )

  const formatNumber = useCallback(
    (
      numb,
      options = {
        style: 'currency',
        currency: 'EUR',
        currencyDisplay: 'symbol',
      },
    ) => getNumberFormat(currentLocale, options).format(numb),
    [currentLocale],
  )

  const formatList = useCallback(
    (listFormat, options) =>
      getListFormat(currentLocale, options).format(listFormat),
    [currentLocale],
  )

  const datetime = useCallback(
    (date, options) => getDateTimeFormat(currentLocale, options).format(date),
    [currentLocale],
  )

  const relativeTimeStrict = useCallback(
    (date, options = { addSuffix: true, unit: 'day' }) => {
      const finalDate = new Date(date)

      return formatDistanceToNowStrict(finalDate, {
        locale: dateFnsLocal,
        ...options,
      })
    },
    [dateFnsLocal],
  )

  const relativeTime = useCallback(
    (date, options = { addSuffix: true }) => {
      const finalDate = new Date(date)

      return formatDistanceToNow(finalDate, {
        locale: dateFnsLocal,
        ...options,
      })
    },
    [dateFnsLocal],
  )

  const translate = useCallback(
    (key, context) => {
      const value = translations[key]
      if (context !== undefined) {
        if (!value) {
          return ''
        }

        return getTranslationFormat(value, currentLocale).format(context)
      }
      if (!value) {
        if (enableDefaultLocal) {
          return ''
        }

        return key
      }

      return value
    },
    [currentLocale, translations, enableDefaultLocal],
  )

  const namespaceTranslation = useCallback(
    (namespace, __translate = translate) => (identifier, ...args) =>
      __translate(`${namespace}.${identifier}`, ...args) ||
      translate(identifier, ...args),
    [translate],
  )

  useEffect(() => {
    try {
      loadDateFnsLocale(
        currentLocale === 'en' ? 'en-GB' : currentLocale || 'en-GB',
      ).then(setDateFnsLocal)
    } catch (e) {
      loadDateFnsLocale('en-GB').then(setDateFnsLocal)
    }
    setCurrentLocale(getCurrentLocale())
    setTranslations(defaultTranslations)
  }, [currentLocale, getCurrentLocale, defaultTranslations])

  const value = useMemo(
    () => ({
      currentLocale,
      dateFnsLocal,
      datetime,
      formatNumber,
      formatList,
      loadTranslations,
      locales,
      namespaceTranslation,
      relativeTime,
      relativeTimeStrict,
      setLocales,
      setTranslations,
      switchLocale,
      t: translate,
      translations,
    }),
    [
      currentLocale,
      dateFnsLocal,
      datetime,
      formatNumber,
      formatList,
      loadTranslations,
      locales,
      namespaceTranslation,
      relativeTime,
      relativeTimeStrict,
      setLocales,
      setTranslations,
      switchLocale,
      translate,
      translations,
    ],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

I18nContextProvider.defaultProps = {
  defaultLocales: APP_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  enableDefaultLocal: ENABLE_DEFAULT_LOCAL,
  defaultTranslations: {},
  localeItemStorage: LOCALE_ITEM_STORAGE,
}

I18nContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultLocales: PropTypes.arrayOf(PropTypes.string),
  defaultLocale: PropTypes.oneOf(APP_LOCALES),
  enableDefaultLocal: PropTypes.bool,
  defaultTranslations: PropTypes.shape({}),
  localeItemStorage: PropTypes.string,
}

export default I18nContextProvider
